---
id: smart-set-agent
title: AI Agent for Smart Test Sets
sidebar_label: AI Agent (Smart Tests)
description: Let AI coding agents like Claude Code and Cursor diagnose failing smart-set replays and add new smart tests on a branch, using the Keploy MCP tools
tags:
  - AI Agent
  - Smart Test Set
  - Claude Code
  - Cursor
  - MCP
  - branch
keywords:
  - smart test set agent
  - Claude Code
  - Cursor
  - Keploy MCP
  - schema_ref
  - branch-native testing
  - failing replay fix
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Overview

Keploy's [smart test set](/docs/keploy-cloud/deduplication/) is a content-addressed test substrate: cases are keyed by a `schema_ref` (a hash of the contract shape — method, path, status, content-types, and the request/response body & query **shapes**), deduplicated per application, and edited **branch-natively** (the `main` view is read-only; edits live on a branch until a human or CI merges them).

This page describes a ready-made **agent skill** that lets an AI coding assistant (Claude Code, Cursor, and similar) operate that substrate end-to-end. Given one of two plain-English prompts, the agent:

1. **Diagnoses a failing smart-set replay** — finds the app, branch, failing run, and the relevant code changes, classifies each failure, and fixes it **on a branch**.
2. **Adds new smart tests** for your latest code changes — records traffic, uploads it as a smart set onto the branch, and validates it.

The agent always stops at a **verified branch** and reports back. Merging to `main` stays a human/CI decision — it is intentionally not something the agent does.

## Prerequisites

- Keploy Enterprise with [smart test sets enabled](/docs/keploy-cloud/deduplication/) on the app (`EnableSmartTestSet=true`).
- The Keploy **MCP server** configured in your agent (see [MCP Server setup](/docs/running-keploy/agent-test-generation/#mcp-server-recommended-for-ai-agents)). The smart-set workflow uses the same `/client/v1/mcp` endpoint and the same authentication.
- A Personal Access Token (PAT) or API key with access to the app.
- The application's recording cluster reachable for `keploy cloud replay`.

## What the agent needs from you

The developer only ever says one of two things — the skill handles everything else (discovering the app, branch, failing run, and code changes) autonomously:

| Prompt                                                                | Routine                                          |
| --------------------------------------------------------------------- | ------------------------------------------------ |
| _"my keploy smart-set replay is failing, please analyze and fix it."_ | Routine A — diagnose & fix on a branch           |
| _"Add new keploy smart tests for my changes."_                        | Routine B — record, upload, validate on a branch |

## Installing the skill

The skill is a single Markdown file that teaches your agent the smart-set workflow and guardrails. Drop it into your project so the agent picks it up automatically.

### Cursor

Save the skill as `.cursor/skills/smart-set/SKILL.md` in your project root. Cursor auto-discovers [Agent Skills](https://cursor.com/docs/context/skills) from `.cursor/skills/` and invokes this one on demand when your prompt matches a failing smart-set replay or a request to add smart tests. This is the on-demand **skill** mechanism — distinct from always-on `.cursor/rules/*.mdc` project rules, which would bill the full skill on every turn.

### Claude Code

Save the skill under your project's skills directory (e.g. `.claude/skills/smart-set/SKILL.md`) or reference its content from `CLAUDE.md`. Claude Code reads project-level skill and context files automatically.

The full skill content is included at the end of this page under [Skill reference](#skill-reference).

## How it works

### Key concepts the agent relies on

- **Branch-first, enforced by the substrate.** Every edit, delete, obsolete, or mock write is branch-scoped; a write without a `branch_id` is rejected. The Keploy branch name mirrors your git branch name (`git rev-parse --abbrev-ref HEAD`), and `create_branch` is idempotent (find-or-create).
- **`schema_ref` identity.** **Value edits** (response body, noise, assertions, mock re-links) keep the same `schema_ref` and are safe in place. **Shape edits** (changing method/path/status/content-type or the body/query structure) recompute the `schema_ref`; if the new ref collides with another case you get a typed `SchemaRefConflict` to resolve, not retry.
- **Non-destructive re-record.** Re-recording a same-shape contract replaces the case data in place and carries your noise/assertions/obsolete flags forward. A re-record that changes the shape lands a **new** `schema_ref` — the stale case is then deleted so the suite doesn't keep a red duplicate.
- **The boundary is the branch.** The agent never runs a merge or rebase to `main` — it reports a verified branch and the dashboard URLs, and you (or CI) merge.

### Routine A — fix a failing replay

1. **Resolve the failing run.** For a local failure, the agent fetches the newest `FAILED` report on the branch; for a CI failure, it extracts the `test_run_id` from the pasted CI/dashboard URL.
2. **Fetch the report**, projected to just the failing cases (a focused field set instead of the full ~34k-token report).
3. **Classify each failing case** after an unconditional working-tree check (`git status`/`git diff`):
   - **Regression** — code changed and broke a correct contract → the agent **fixes the source and rebuilds**, never edits the test to match a bug.
   - **Value drift** — a field/header/body value legitimately changed → `updateSmartTestCase` (golden body or `noise` for non-deterministic fields).
   - **Shape drift** — the contract structure changed → `updateSmartTestCase` with the new request/response shape, resolving any `SchemaRefConflict`.
   - **Mock drift** — a downstream response changed → `upsertSmartMock` (or re-record when the request itself changed).
4. **Verify on the branch** via `keploy cloud replay --replay-source smart-set` and iterate (capped retries).
5. **Report and stop** with a diagnosis table, the fixes applied, and dashboard URLs for the branch diff and run report.

### Routine B — add new smart tests

1. **Identify changed endpoints** from the git diff.
2. **Capture traffic** with `keploy record --sync --disable-mapping=false`, driving one realistic request per new/changed endpoint.
3. **Upload onto the branch** as a smart set (new contracts ingest as `imported-*`, deduplicated by `schema_ref`; existing ones are skipped).
4. **Validate on the branch** with `keploy cloud replay`.
5. **Report and stop** — you review the branch diff and merge; merge reconciles `imported-*` to stable `test-N`.

## Replay flags the agent always uses

When the agent runs `keploy cloud replay` for a smart-set app, these flags are required:

| Flag                          | Why                                                                                                                                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--replay-source smart-set`   | Replay the deduplicated smart-set cases. Without it the CLI defaults to `latest-release` and replays raw per-release recordings instead.                                                            |
| `--cluster <name>`            | The recording cluster (`origin.clusterName`); a `no active clusters found` error usually means this flag was omitted.                                                                               |
| `--branch-name <git branch>`  | Replay the branch view, including the agent's edits.                                                                                                                                                |
| `--freezeTime`                | Required when the app is built with the Go `faketime` agent, so `time.Now()` matches the recording and timestamp-bearing mocks still match. See [Time freezing](/docs/keploy-cloud/time-freezing/). |
| `--disableReportUpload=false` | Write the `/tr` report row so the run is visible on the dashboard.                                                                                                                                  |
| `--strict-failure`            | Keep response-divergent cases failing instead of silently demoting them.                                                                                                                            |

## Limitations

- The agent's scope ends at a verified branch — it never runs a merge or rebase to `main`.
- Replaying connection-oriented data store mocks (e.g. some PostgreSQL flows) can require additional recorder support; if a replay can't go fully green for reasons outside the test data, the agent reports the blocker rather than masking it by editing the golden output.

## Skill reference

The complete skill file to install (`SKILL.md`):

```markdown
---
name: keploy-smart-set
description: Keploy SMART-SET MCP workflow — when a smart-set cloud replay is failing (analyze and fix on a branch), or to add new smart tests for code changes. Drives schema_ref-keyed, branch-native record/replay and smart-case/mock edits via the Keploy MCP tools. The agent fixes on a branch and reports; merging to main is the dev's (or CI's) call.
---

# Keploy SMART-SET playbook — autonomous developer workflow

Smart test sets are Keploy's content-addressed test substrate: cases are keyed by `schema_ref` (a hash of the contract shape — method, path, status, content-types, request/response body & query SHAPES), deduped per app, and edited **branch-natively** (main is read-only; edits live on a branch until a human/CI merges). Re-recording is **non-destructive for same-shape refreshes** — it replaces a case's data in place by `schema_ref` and preserves history, so user edits (noise, assertions, obsolete) carry forward; but a re-record that changes the shape lands a new `schema_ref` and you must delete the stale old case (Hard rule 5).

## Entry points

The developer will only ever say one of two things to you:

- **Prompt A:** "my keploy smart-set replay is failing, please analyze and fix it." (local: find the latest failing test_run on the branch) OR "the keploy smart-set pipeline is failing, please analyze and fix it." (CI: extract `test_run_id` from the pasted CI log/dashboard URL).
- **Prompt B:** "Add new keploy smart tests for my changes."

You handle EVERYTHING else autonomously — discover the app, the branch, the failing run, the code changes. Execute fixes **on a branch**, report what you did, and tell the dev to review & merge.

## Hard rules

0. **Native MCP transport only.** Verify the Keploy MCP tools are loaded. If your tool list shows only the meta-tools (`get_auth_status`, `search_tools`, `get_tool_schema`, `invoke_tool`), the real tools are hidden server-side to save context — fetch their schemas in ONE batched `get_tool_schema({names:[…]})` call, then run each via `invoke_tool({name, arguments})`. Smart-set names: `listApps`, `getApp`, `listBranches`, `create_branch`, `listTestReports`, `getTestReportFull`, `listSmartTestCases`, `updateSmartTestCase`, `setSmartTestCaseObsolete`, `deleteSmartTestCase`, `upsertSmartMock`, `deleteSmartMock`, `getMock`, `uploadRecordingBundle`.
1. **Branch-first — the substrate ENFORCES it.** Every edit/delete/obsolete/mock-write is branch-scoped; a write without a `branch_id` is rejected. Resolve `branch_id` before any write.
2. **Keploy branch name = git branch name** (`git rev-parse --abbrev-ref HEAD`). Pass it to `create_branch` (find-or-create, idempotent); reuse the returned `branch_id`. Never target the reserved `main` branch.
3. **App resolution from cwd.** `basename $(pwd)` → `listApps({q: <basename>})`. One match → use it; zero/ambiguous → narrow by compose-service name, else ask once.
4. **schema_ref awareness.** VALUE edits keep `schema_ref` (`noiseJson`, `assertionsJson`, `description`, `mockReferencesJson`, `respBody`). SHAPE edits change it (`requestJson`/`responseJson`); a colliding new ref yields a `SchemaRefConflict` — don't retry blindly. All `*Json` args are STRINGIFIED JSON, not objects.
5. **Re-record replaces in place only if `schema_ref` is unchanged.** If the re-record changes the shape it lands a NEW `schema_ref` as a separate case — then `deleteSmartTestCase` the stale old one.
6. **Your boundary is the branch. NEVER merge or rebase.** After your fix is green on the branch, STOP and report — the dev/CI merges.
7. **Don't ask what you can find out** (`git log`, `git diff`, file reads, api-server calls).
8. **Always end with two dashboard URLs** — the branch diff page and the test-run report page.

## Discovery (run once at the start)

1. **App.** `basename $(pwd)` → `listApps({q})` → cache `app_id`.
2. **Branch.** `git rev-parse --abbrev-ref HEAD` → `create_branch({app_id, name})` → cache `branch_id`.
3. **App context (once).** `getApp({appId, fields:["name","namespace","deployment","origin.clusterName","origin.namespace","origin.deployment"]})` — you need `origin.clusterName` for `--cluster`.
4. **Canonical replay command — use ALL these flags on every replay:** `keploy cloud replay --app <ns.deployment> --branch-name <git branch> --cluster <origin.clusterName> --replay-source smart-set --freezeTime --disableReportUpload=false --strict-failure`. Why each: `--replay-source smart-set` (the CLI defaults to latest-release), `--cluster` (from origin.clusterName; omit it and the CLI errors "no active clusters found"), `--freezeTime` (when the app is built with the Go faketime agent), `--disableReportUpload=false` (writes the /tr report row so the run shows on the dashboard), `--strict-failure` (don't silently demote response-divergent cases). These match the "Replay flags" table above.

## Routine A — failing smart-set replay (ON A BRANCH)

- **A1 — Resolve `test_run_id`.** Local → `listTestReports({appId, branch_id, status:"FAILED", limit:5})` exactly once, take `data[0].id` (`status` is case-sensitive). CI → extract from the pasted URL.
- **A2 — Fetch the report**, projected with `failed_only:true` + a `fields=` list (drops ~34k → ~1–2k tokens). For mock failures, a second call with `mock_mismatches_only:true` to get the `mock-N` ids.
- **A3 — Diagnose.** Unconditional working-tree check first (`git status -s`, `git diff`). **Code-change gate:** if a code change touches the same field the report says drifted, that's a regression by default — fix the source, don't bake it into the golden body. Classify each case:
  - **Case 1 — App regression.** Edit/revert the application source, rebuild the image, replay. Don't touch the test.
  - **Case A — Value drift.** `updateSmartTestCase` — `noiseJson` for non-deterministic fields, `respBody` for a real value change.
  - **Case B — Shape drift.** `updateSmartTestCase` with `requestJson`/`responseJson`; resolve a `SchemaRefConflict` by obsoleting/deleting the twin, never by blind retry.
  - **Case C — Mock drift.** `upsertSmartMock` for an in-place value drift; re-record when the outbound request changed or the match key can't be hand-authored.
- **A4 — Verify on the branch.** Rebuild first after a Case 1 edit. Replay with the **canonical command from Discovery (all flags)**, piping output through `tail`/`grep`. All cases failing "connection reset"/status 0 = a stale leftover replay container on the app port (`docker rm -f` it), not a code bug. Cap retries at 3.
- **A5 — Report and STOP.** Diagnosis table + fixes applied + the two dashboard URLs. Tell the dev to review & merge.

## Routine B — add new smart tests

- **B1 — Identify changes.** `git diff origin/main...HEAD --name-only`, filter to HTTP handlers, list each endpoint's method+path.
- **B2 — Capture traffic.** Pre-flight the run command, then `keploy record -c "<cmd>" --sync --disable-mapping=false` (both flags mandatory), drive one realistic request per endpoint, stop the recorder by PID.
- **B3 — Upload onto the branch.** `keploy upload test-set --app <ns.deployment> --branch <git branch> --test-set keploy/test-set-N --smart-test-set --name <name>` (ingests new contracts as `imported-*`, dedup by `schema_ref`).
- **B4 — Validate** with the **canonical replay command from Discovery (all flags)**. On failure, enter Routine A from A2.
- **B5 — Report and STOP.** Captured/skipped table + replay result + dashboard URLs; the dev merges (merge reconciles `imported-*` → `test-N`).

## When you MAY ask the dev

- PAT missing/invalid → ask for a fresh PAT.
- Detached `HEAD`/non-zero from `git rev-parse` → ask for a branch name once.
- `listApps` ambiguous and unnarrowable → list candidates, ask once.
- Pre-flight can't start the app → name the command + error, ask once.
- A `SchemaRefConflict` where both cases are legitimately distinct → surface it; "merge into existing" is the dev's call.

## Anti-patterns (refuse these)

- Merging or rebasing the branch to main.
- Editing on `main` (every mutation needs `branch_id`).
- Treating a `SchemaRefConflict` as retryable.
- Re-recording a shape-changed contract but forgetting to delete the stale case.
- Editing handler code on a Case A/B/C (contract-change) failure.
```
