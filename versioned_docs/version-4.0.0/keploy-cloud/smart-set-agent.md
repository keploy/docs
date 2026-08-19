---
id: smart-set-agent
title: LLM Workflow (Smart Tests)
sidebar_label: LLM Workflow (Smart Tests)
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

Keploy's smart test set is a content-addressed test substrate: cases are keyed by a `schema_ref` (a hash of the contract shape — method, path, status, content-types, and the request/response body & query **shapes**), deduplicated per application, and edited **branch-natively** (the `main` view is read-only; edits live on a branch until a human or CI merges them).

This page describes a ready-made **agent skill** that lets an AI coding assistant (Claude Code, Cursor, and similar) operate that substrate end-to-end. Given one of two plain-English prompts, the agent:

1. **Diagnoses a failing smart-set replay** — finds the app, branch, failing run, and the relevant code changes, classifies each failure, and fixes it **on a branch**.
2. **Adds new smart tests** for your latest code changes — records traffic, uploads it as a smart set onto the branch, and validates it.

The agent always stops at a **verified branch** and reports back. Merging to `main` stays a human/CI decision — it is intentionally not something the agent does.

## Before you start

- Keploy Enterprise with smart test sets enabled on the app (`EnableSmartTestSet=true`), and the app already [recording in your cluster](/docs/quickstart/k8s-proxy).
- A **Keploy PAT** — Dashboard → Settings → API Keys. Copy the `kep_...` value (shown only once).
- A **Skills-aware editor**: Cursor (cursor-agent CLI / Cursor IDE), Claude Code, Windsurf, Antigravity, or any agent that loads `.../skills/<name>/SKILL.md` on demand. Older `.cursorrules` / `.windsurfrules` always-on rules files work too but bill the full skill on every editor interaction — Skills are the modern, on-demand path and what this page recommends.
- **Run the agent from inside the app's git repository.** The skill inspects your `git` commit message and `git diff` to decide whether a failing case is an **intentional contract change** (update the test data) or a **regression** (fix the code). Outside a repo it can't tell them apart and will conservatively treat the change as a regression and refuse to edit the test.

---

## Step 1 — Wire up the Keploy MCP server

All MCP-aware editors accept the exact same JSON config; only the config file path differs.

### MCP config path per editor

| Editor                      | Config file path                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**             | `~/.claude.json` (global)                                                                                                               |
| **Cursor IDE**              | `.cursor/mcp.json` in the repo (per-repo, committed) **or** `~/.cursor/mcp.json` (global)                                               |
| **cursor-agent CLI**        | `~/.cursor/mcp.json` (CLI reads the global path)                                                                                        |
| **Windsurf / Antigravity**  | `~/.codeium/windsurf/mcp_config.json` or the editor's documented equivalent                                                             |
| **Other MCP-aware editors** | See [MCP Client Configuration](/docs/running-keploy/agent-test-generation#mcp-client-configuration) — same JSON shape works everywhere. |

### The JSON config (same for every editor)

```json
{
  "mcpServers": {
    "keploy": {
      "type": "http",
      "url": "https://api.keploy.io/client/v1/mcp",
      "headers": {"Authorization": "Bearer kep_..."}
    }
  }
}
```

Two things to swap for your environment:

- **`url`** — `https://api.keploy.io/client/v1/mcp` is the hosted Keploy endpoint. For **self-hosted** deployments use your api-server's URL (commonly `http://localhost:8083/client/v1/mcp` for a local dev install).
- **`kep_...`** — paste your PAT from Dashboard → Settings → API Keys (shown only once on creation; regenerate if you've lost it).

Fully quit and reopen your editor after editing the config — MCP clients only re-read config on startup.

### Verify the MCP wiring (do this BEFORE Step 2)

After restarting your editor, ask the agent:

> _"List your available tools — do you see any prefixed `keploy-` or `mcp__keploy`?"_

You should see Keploy MCP tools. Depending on the server version you'll see **either** the full catalog (`listApps`, `getApp`, `listTestReports`, `getTestReportFull`, `getMock`, `listSmartTestCases`, `updateSmartTestCase`, `upsertSmartMock`, `setSmartTestCaseObsolete`, etc.) **or** — when **tool-search mode** is on (the default on newer servers) — just the handful of meta-tools (`search_tools`, `get_tool_schema`, `invoke_tool`, `get_auth_status`, `get_setup_instructions`). **Either is fine**: the skill's Hard rule 0 handles both and reaches the full catalog by name. Only if you see **zero** keploy tools did the config fail to load — check:

- The file path matches your editor's expected location (see the table above).
- The PAT in `Bearer kep_...` has no quotes / trailing-whitespace issues.
- The `url` is reachable from your machine: `curl -i <url>` should return an **HTTP response** (e.g. 200 or 401), NOT connection-refused. Any HTTP status means the server is up; connection-refused means the URL is wrong.

> ⚠ **Do NOT proceed to Step 2 if Keploy MCP tools aren't visible.** Without native MCP the agent silently falls back to shell HTTP calls, which inflates per-turn token cost several-fold because every JSON-RPC envelope + auth token + response becomes new context instead of structured tool envelopes the cache can reuse.

---

## Step 2 — Install the skill

The skill teaches your agent to run the whole smart-set workflow autonomously from the two routine prompts. Without it, the agent has to rediscover the workflow on every call by reading each tool's description — slower and prone to skipping the branch-resolution step.

The exact same file works on every Skills-aware editor; only the path changes. Skills load on demand when the user's prompt matches the skill's `description`, so it only enters your context when actually needed — not on every editor interaction.

### Where the skill goes

| Editor                                           | Install path                                                                                                                                                                                                                             |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cursor**                                       | `.cursor/skills/smart-set/SKILL.md` in the repo (committed). Avoid always-on rule formats (`.cursorrules`, or `.cursor/rules/*.mdc` with `alwaysApply: true`) — they bill the full skill on every turn even for unrelated conversations. |
| **Claude Code**                                  | `.claude/skills/smart-set/SKILL.md` in the repo (committed) **or** `~/.claude/skills/smart-set/SKILL.md` (global). Auto-loaded when the dev's prompt matches the skill's `description`.                                                  |
| **Windsurf / Antigravity / other Skills agents** | The agent's equivalent `skills/<name>/SKILL.md` path. Avoid global / always-on placements for the same token-cost reason.                                                                                                                |

Copy the skill from [Skill reference](#skill-reference) below into the file at the path you picked, then **fully restart the editor** — editors read skills only at startup. Commit the file when you want every teammate's agent to follow the same skill.

---

## Step 3 — Use the two prompts

That's it. From now on you only ever type one of:

> **"my keploy smart-set replay is failing, please analyze and fix it."**

_or, when the failure was in CI:_

> **"the keploy smart-set pipeline is failing, please analyze and fix it."**

or

> **"Add new keploy smart tests for my changes."**

What happens behind the scenes for each:

### Prompt A — analyze and fix a failing smart-set replay (local or CI)

| Phase | What the agent does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A0    | Discovery — resolve `app_id` from `basename $(pwd)` + `listApps`, `branch_id` from `git rev-parse --abbrev-ref HEAD` + `create_branch` (find-or-create), and cluster identity from `getApp` (cached for the session).                                                                                                                                                                                                                                                                               |
| A1    | Get a `test_run_id`. Local → `listTestReports({appId, branch_id, status: "FAILED"})`, newest id. CI → extract `test_run_id` from the pasted CI log / dashboard URL.                                                                                                                                                                                                                                                                                                                                 |
| A2    | Fetch the report via `getTestReportFull` with a `fields=[...]` projection and `failed_only: true` (brings the ~34k-token report down to ~1-2k). For mock failures, a second call with `mock_mismatches_only: true` to surface the `mock-N` ids.                                                                                                                                                                                                                                                     |
| A3    | Classify each failing case after an unconditional `git status`/`git diff`: **Regression** (code broke a correct contract → fix the source, never the test), **Case A — value** (`respBody`, or `noiseJson` for non-deterministic fields — `schema_ref` preserved), **Case B — shape** (`requestJson`/`responseJson` — `schema_ref` recomputed; resolve a `SchemaRefConflict` by obsoleting/deleting the twin), **Case C — mock** (`upsertSmartMock`, or re-record when the outbound request moved). |
| A4    | Apply the fix on the branch via `updateSmartTestCase` / `upsertSmartMock` / `setSmartTestCaseObsolete` / `deleteSmartTestCase` (regression → edit source + rebuild image), then verify with `keploy cloud replay --replay-source smart-set --branch-name <git branch> --cluster <name> --freezeTime` (capped retries).                                                                                                                                                                              |
| A5    | Report: diagnosis table (case per failing test) + fixes applied + next step + branch-diff URL + run-report URL. Merging to `main` stays with you or CI.                                                                                                                                                                                                                                                                                                                                             |

### Prompt B — author new smart tests

| Phase | What the agent does                                                                                                                                                                                                                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B0    | Discovery (same as A0).                                                                                                                                                                                                                                                         |
| B1    | `git diff origin/main...HEAD --name-only` → new / changed endpoints (method + path).                                                                                                                                                                                            |
| B2    | Pre-flight: find the run command (Makefile / compose / Procfile / package.json / README), start the app, curl to confirm it serves, stop it. Then `keploy record -c "<run cmd>" --sync --disable-mapping=false`, drive one realistic request per new endpoint, SIGINT to flush. |
| B3    | `keploy upload test-set --smart-test-set --app <ns.deployment> --branch <git branch> --test-set keploy/test-set-N` — new `schema_ref`s ingest as `imported-*` (deduplicated); existing ones are skipped.                                                                        |
| B4    | `keploy cloud replay --replay-source smart-set --branch-name <git branch> --cluster <name>` to validate. On failure, drop into Prompt A from Phase A2.                                                                                                                          |
| B5    | Report: captured endpoints + replay result + next step (open PR) + URLs. Merge reconciles `imported-*` → stable `test-N`.                                                                                                                                                       |

---

## Key concepts the agent relies on

- **Branch-first, enforced by the substrate.** Every edit, delete, obsolete, or mock write is branch-scoped; a write without a `branch_id` is rejected. The Keploy branch name mirrors your git branch name (`git rev-parse --abbrev-ref HEAD`), and `create_branch` is idempotent (find-or-create).
- **`schema_ref` identity.** **Value edits** (response body, noise, assertions, mock re-links) keep the same `schema_ref` and are safe in place. **Shape edits** (changing method/path/status/content-type or the body/query structure) recompute the `schema_ref`; if the new ref collides with another case you get a typed `SchemaRefConflict` to resolve, not retry.
- **Non-destructive re-record.** Re-recording a same-shape contract replaces the case data in place and carries your noise/assertions/obsolete flags forward. A shape-changing re-record lands a **new** `schema_ref` — the stale case is then deleted so the suite doesn't keep a red duplicate.
- **The boundary is the branch.** The agent never runs a merge or rebase to `main` — it reports a verified branch and the dashboard URLs, and you (or CI) merge.

## Replay flags

When the agent runs `keploy cloud replay` for a smart-set app, these flags are required on **every** replay — except `--freezeTime`, which is added **only** when the app is built with the Go `faketime` agent:

| Flag                          | Why                                                                                                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--app <ns.deployment>`       | The app to replay, as `namespace.deployment`. Required by every `keploy cloud replay` (and `keploy upload test-set`).                                                                                                                                              |
| `--replay-source smart-set`   | Replay the deduplicated smart-set cases. Without it the CLI defaults to `latest-release` and replays raw per-release recordings instead.                                                                                                                           |
| `--cluster <name>`            | The recording cluster (`origin.clusterName`); a `no active clusters found` error usually means this flag was omitted.                                                                                                                                              |
| `--branch-name <git branch>`  | Replay the branch view, including the agent's edits. **Flag-name asymmetry (not a typo):** `keploy cloud replay` scopes by branch with `--branch-name`, while `keploy upload test-set` (Routine B3) uses `--branch` — different subcommands, different flag names. |
| `--freezeTime`                | Required when the app is built with the Go `faketime` agent, so `time.Now()` matches the recording and timestamp-bearing mocks still match. See [Time freezing](/docs/keploy-cloud/time-freezing/).                                                                |
| `--disableReportUpload=false` | Write the `/tr` report row so the run is visible on the dashboard.                                                                                                                                                                                                 |
| `--strict-failure`            | Keep response-divergent cases failing instead of silently demoting them.                                                                                                                                                                                           |

## Limitations

- The agent's scope ends at a verified branch — it never runs a merge or rebase to `main`.
- Replaying connection-oriented data store mocks (e.g. some PostgreSQL flows) can require additional recorder support; if a replay can't go fully green for reasons outside the test data, the agent reports the blocker rather than masking it by editing the golden output.

## Skill reference

The complete skill file to install (`SKILL.md`):

````markdown
---
name: keploy-smart-set
description: Keploy SMART-SET MCP workflow — when a smart-set cloud replay is failing (analyze and fix on a branch), or to add new smart tests for code changes. Drives schema_ref-keyed, branch-native record/replay and smart-case/mock edits via the Keploy MCP tools. The agent fixes on a branch and reports; merging to main is the dev's (or CI's) call.
---

# Keploy SMART-SET playbook — autonomous developer workflow

Smart test sets are Keploy's content-addressed test substrate: cases are keyed by `schema_ref` (a hash of the contract shape — method, path, status, content-types, request/response body & query SHAPES), deduped per app, and edited **branch-natively** (main is read-only; edits live on a branch until a human/CI merges). Re-recording is **non-destructive for same-shape refreshes** — it replaces a case's data in place by `schema_ref` and preserves history, so user edits (noise, assertions, obsolete) carry forward; but a re-record that changes the shape lands a new `schema_ref` and you must delete the stale old case (Hard rule 5). This is the parallel to the legacy `keploy` skill; use THIS skill when the app/flow is on the smart-set substrate.

## Entry points

The developer will only ever say one of two things to you:

**Prompt A:** "my keploy smart-set replay is failing, please analyze and fix it." OR "the keploy smart-set pipeline is failing, please analyze and fix it." — the first means the dev's last local replay on the branch failed (find the latest test_run via api-server), the second means a CI run failed (the dev pastes the CI log/dashboard URL; extract `test_run_id` from it).
**Prompt B:** "Add new keploy smart tests for my changes."

You handle EVERYTHING else autonomously — discover the app, the branch, the failing run, the code changes. Make decisions, execute fixes **on a branch**, report what you did, and tell the dev to review & merge. Do NOT ask follow-up questions unless truly blocked (see "When you may ask").

## Hard rules

0. **Native MCP transport only — NEVER Python+urllib shell fallback.** Verify Keploy MCP tools are loaded. **If your tool list shows ONLY the meta-tools** (`get_auth_status`, `search_tools`, `get_tool_schema`, `invoke_tool`), the real tools are hidden server-side to save context. You already KNOW the names you need — fetch their schemas in ONE batched `get_tool_schema({names:[…]})` call, then run each via `invoke_tool({name, arguments})`. The smart-set names: `listApps`, `getApp`, `listBranches`, `create_branch`, `listTestReports`, `getTestReportFull`, `listSmartTestCases`, `updateSmartTestCase`, `setSmartTestCaseObsolete`, `deleteSmartTestCase`, `upsertSmartMock`, `deleteSmartMock`, `getMock`, `uploadRecordingBundle`. Do NOT use `search_tools` for a name you already have (fuzzy search returns 5–10 unrelated schemas, ~10× the tokens). Reserve `search_tools` ONLY for a name you genuinely don't know.

1. **Branch-first — and the substrate ENFORCES it.** Main is read-only for smart-set: every edit/delete/obsolete/mock-write is branch-scoped and a write without a `branch_id` is REJECTED (`ErrSmartMutationRequiresBranch` / "requires a branch"). Resolve `branch_id` before any write. If a tool rejects the write for a missing branch, you skipped this — resolve the branch and retry, don't ask the dev.
2. **Keploy branch name = git branch name.** Detect via `git rev-parse --abbrev-ref HEAD`. Pass that string to `create_branch` (find-or-create, idempotent). Reuse the returned `branch_id` for every write this session. The branch literally named `main` is reserved — never target it.
3. **App resolution from cwd.** `basename $(pwd)` → `listApps({q: <basename>})`. One match → use it. Zero/ambiguous → narrow by compose-service name, else ask once.
4. **schema_ref awareness — know which edits move identity.**
   - **VALUE edits keep `schema_ref`:** `noiseJson`, `assertionsJson`, `description`, mock relink (`mockReferencesJson`), and the golden response body (`respBody`). These are safe in-place edits. (All `*Json` args are STRINGIFIED JSON, not objects.)
   - **SHAPE edits change `schema_ref`:** replacing `requestJson` or `responseJson` (method/path/status/content-type/body-or-query STRUCTURE). A shape edit recomputes the ref; if the new ref collides with another case in scope you get a typed `SchemaRefConflict` — DON'T retry blindly (see Case B).
5. **Re-record replaces in place only if the `schema_ref` is unchanged** (same shape → refreshes the case, your noise/assertions carry forward). If the re-record changes the shape it lands a NEW `schema_ref` as a separate case — then `deleteSmartTestCase` the stale old one or the suite keeps a red duplicate. Needed when a mock can't be patched in place (Case C) or the shape moved.
6. **Your boundary is the branch. NEVER merge or rebase.** Merging/rebasing to main is a human/CI-gated action (and is intentionally NOT an MCP tool). After your fix is green ON THE BRANCH, STOP and report — tell the dev to review & merge. Do not attempt `mergeBranch`/`rebaseBranch`, do not look for a merge CLI, do not edit on main.
7. **Don't ask what you can find out.** Use `git log`, `git diff`, file reads, and api-server calls.
8. **Always end with two dashboard URLs** — the branch diff page and the test-run report page (URL-encode the git branch name):
   - `Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branch=<url_encoded_git_branch>`
   - `Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>&branch=<url_encoded_git_branch>`

## Discovery (run once at the start, before either routine)

1. **App.** `basename $(pwd)` → `listApps({q: <basename>})` → cache `app_id`.
2. **Branch.** `git rev-parse --abbrev-ref HEAD` → `create_branch({app_id, name: <git branch>})` → cache `branch_id`. Detached `HEAD`/non-zero → ask the dev once.
3. **App context — MANDATORY before any `keploy cloud replay`, AT MOST ONCE per session.** `getApp({appId: app_id, fields: ["name","namespace","deployment","origin.clusterName","origin.namespace","origin.deployment"]})`. The full schema is ~16k tokens; this projection is ~300. You CANNOT issue `keploy cloud replay` without `origin.clusterName` (the CLI needs `--cluster <name>`; its `no active clusters found` error actually means "you forgot `--cluster`"). The identity fields are sticky — never re-call `getApp`.
4. **`--replay-source smart-set` — MANDATORY on EVERY `keploy cloud replay`.** The CLI defaults to `latest-release`, which replays the raw per-release recordings, NOT the smart set. You MUST pass `--replay-source smart-set` so replay pulls the deduped smart-set cases (requires the app to have `EnableSmartTestSet=true`). Without it you're testing the legacy release sets, not the smart set, and the report won't reflect smart-set edits.
5. **`--freezeTime` — MANDATORY on EVERY `keploy cloud replay`** if the app is built with the Go faketime agent. Without it `time.Now()` drifts from the recording, timestamp-bearing mocks miss, and the call falls through to the real backend (looks like an app bug; isn't). Always: `keploy cloud replay --app <ns.deployment> --branch-name <branch> --cluster <name> --replay-source smart-set --freezeTime --disableReportUpload=false --strict-failure`.

All values are sticky. Don't re-discover unless the dev switches git branches.

---

## Routine A — failing smart-set replay, analyze and fix (ON A BRANCH)

### Phase A1 — Resolve the `test_run_id`

- **Local form** → `listTestReports({appId: app_id, branch_id, status: "FAILED", limit: 5})` **EXACTLY ONCE**. Take `data[0].id` (newest first). `status` is CASE-SENSITIVE (`"FAILED"`). Do NOT retry permutations on empty; do NOT re-query after your own replay — parse the `View test report at: …/tr/<id>` line from its stdout.
- **CI form** → extract `test_run_id` from the pasted CI/dashboard URL; fall back to the local lookup with `source: "ci"`.

### Phase A2 — Fetch the full report

Smart-set replays post the same `/tr` report shape as legacy, so the projection is identical — fetch everything you need in ONE call:

```
getTestReportFull({
  appId: app_id, reportId: test_run_id,
  include_oss_report: true, failed_only: true, max_test_cases_per_set: 50,
  fields: [
    "report.status","report.ci_metadata","report.failed_count","report.passed_count",
    "test_sets[].test_set_name","test_sets[].test_set_id","test_sets[].status",
    "test_sets[].test_cases[].test_case_name","test_sets[].test_cases[].test_case_id","test_sets[].test_cases[].status",
    "test_sets[].test_cases[].oss_report.req","test_sets[].test_cases[].oss_report.resp",
    "test_sets[].test_cases[].oss_report.result","test_sets[].test_cases[].oss_report.failure_info",
    "test_sets[].test_cases[].oss_report.noise"
  ]
})
```

`failed_only: true` + the projection drops the call from ~34k → ~1–2k tokens. **Never** drop `fields=`. Path params (`appId`,`reportId`) are camelCase; query params (`include_oss_report`,`failed_only`,`mock_mismatches_only`,`max_test_cases_per_set`,`fields`) stay snake_case. For mock-driven failures, make a SECOND call with `mock_mismatches_only: true` projected to `…oss_report.mock_mismatches.actual_mocks[].name`/`.kind` to get the `mock-N` ids. The smart-set case name is `test-N` (stable across edits) — read `test_case_name`.

### Phase A3 — Diagnose each failing case

**Step 0 — Working-tree check (UNCONDITIONAL, FIRST).** `git status -s`, `git diff`, `git diff --cached` on the failing handler path. The empty result IS the evidence to advance. Only Phase A1 discovery MCP calls are allowed before Step 0; every classifier/write call comes after.

**Verify intent before classifying.** Commit messages confirm "deliberate" (→ contract change) but never "bug." Tie the change to the failure (does the diff touch the field/header/status the report says drifted?). Expected change → fix test data on the branch; unexpected → fix the code.

**⚠️ CODE-CHANGE GATE — decide this BEFORE reaching for any smart-set edit tool.** If Step 0 (or `git log`) shows a code change on the failing handler that touches the **same field the report says drifted**, that is **Case 1 (a regression) by default — REVERT/fix the source (`git checkout -- <file>` or an Edit) and rebuild. Do NOT `updateSmartTestCase`/`respBody` to make the app's new output the golden value.** Updating the test to match changed code **bakes the regression in as the new contract** and hides the bug. This skill is branch-edit-centric, but a code regression is NOT a test-data problem — resist the reflex to "just update the golden body." Only treat the code change as intentional (→ Case A/B test edit) when the **commit message explicitly claims that contract change** OR the dev asked for it in this session. If a code change is present and intent is genuinely ambiguous, **ASK the dev once** — do not silently update the test.

Classify each failing case:

#### Case 1 — App regression. You fix the code.

The handler used to behave correctly; an uncommitted edit or recent commit broke it. Same as the legacy flow: (C1.1) edit/revert the **application source** (never Dockerfile/compose/keploy.yml/CI); (C1.2) verify the edit landed (`git status`/`git diff` clean for a revert); (C1.3) rebuild the image (`docker build -t <manifest-image-tag> <ctx>`); (C1.4) replay on the branch. The recorded baseline is correct — do NOT touch the test.

#### Case A — Value drift (test data is stale; identity unchanged). `updateSmartTestCase` on the branch.

The contract changed in a way that keeps the same `schema_ref` (a field value, a header constant, a response body value). Tool: `updateSmartTestCase({appId, name: "test-N", branch_id, <patch>})`.
**`updateSmartTestCase` arg names — all the JSON-bearing fields are STRINGIFIED JSON** (not objects): `noiseJson`, `assertionsJson`, `mockReferencesJson`, `requestJson`, `responseJson` (each a JSON string), plus `respBody` (string), `description`, and the required `appId`, `name`, `branch_id`. Passing an object instead of a JSON string → `invalid request body`.

- **Non-deterministic field** (timestamp, generated UUID, request id): add its JSONPath to **`noiseJson`** (a JSON map serialized as a string, e.g. `noiseJson: "{\"body.ts\":[]}"`) — the runner then ignores diffs on that path.
- **Real value change**: set **`respBody`** (the golden response body string) — a VALUE edit that never moves `schema_ref`. Read the case first via `listSmartTestCases` so you only change what the new contract dictates.
- Assertions / description: pass **`assertionsJson`** (JSON string) / `description`.

#### Case B — Shape drift (the contract STRUCTURE changed; identity moves). `updateSmartTestCase` with `requestJson`/`responseJson`.

Replacing **`requestJson`** (full HTTPReq as a JSON string) or **`responseJson`** (full HTTPResp JSON string) recomputes `schema_ref`. Two outcomes:

- **Resolves to a new, free ref** → the case is updated and re-keyed; done.
- **`SchemaRefConflict`** (the new ref already belongs to a different case — including an obsolete one) → DON'T retry blindly. The conflict payload names `existingCaseId`/`existingName`. Decide: if the other case is the stale twin of this contract, `setSmartTestCaseObsolete` or `deleteSmartTestCase` it on the branch, then re-apply the shape edit; if both are legitimately distinct, leave them and report the conflict to the dev (an explicit "merge into existing" is a human action). The failed shape edit persists NOTHING — the case is untouched, so there is no partial state to clean up.

#### Case C — Mock drift. `upsertSmartMock` on the branch.

A downstream call's recorded response drifted (`mock_mismatches`). For a simple VALUE drift on an existing mock (same request shape), read the mock with `getMock({…, branch_id})` and write the corrected mock via `upsertSmartMock({appId, name: "mock-N", branch_id, <mockYaml>})`; relink with `updateSmartTestCase`'s `mockReferences` (a VALUE edit).

**Can't patch in place → re-record (Routine B on the branch), then `deleteSmartTestCase` the stale case if the shape moved (rule 5):** when the outbound REQUEST changed (a new/changed downstream call — no in-place mock to patch), or when the mock's match key is content-derived and can't be hand-authored — re-record so keploy re-derives it.

Handle each failing case independently. Obsolete a contract that no longer exists with `setSmartTestCaseObsolete` (it carries forward across re-records).

### Phase A4 — Verify (ON THE BRANCH)

After a Case 1 source edit, rebuild the image first (`docker build -t <manifest-image-tag> <ctx>`; Case A/B/C skip this). Then replay on the branch, **piping output through `tail`/`grep`** so the ~10–40k-token log doesn't enter context:

```bash
keploy cloud replay --app <ns.deployment> --branch-name <git branch> --cluster <cluster-name> --replay-source smart-set --freezeTime --disableReportUpload=false --strict-failure 2>&1 \
  | tail -n 60 | grep -E "Total test|Failed Testcases|test passed|test failed|FAIL|ERROR|debug bundle|View test report"
```

`--disableReportUpload=false` (writes the `/tr` row), `--strict-failure` (don't let response-divergent-but-mock-drifted tests demote to OBSOLETE/PASSED), `--cluster` (from cached `origin.clusterName`), `--freezeTime` (if faketime) are all mandatory. If still failing, re-enter Phase A2 with the new `test_run_id`; cap retries at 3. **Sanity gate:** post-fix `total_tests` must be ≥ pre-fix (a "0 passed/0 failed" drop = coverage regression).

**ALL cases failing "connection reset"/status 0 = a stale leftover replay container on the app port, not a code bug:** `docker ps -aq --filter publish=<appPort> | xargs -r docker rm -f` and retry — don't rebuild or revert.

### Phase A5 — Report and STOP (the dev merges)

```
### Diagnosis
| Case (test-N) | Class | Cause |
| --- | --- | --- |
| <test_case_name> | 1 / A / B / C | <one-line cause from repo inspection> |

### Fixes applied (on branch `<git branch>`)
- (Case 1) Edited `<file:line>` — `<change>`; rebuilt image; replay green.
- (Case A) `updateSmartTestCase` on `<test-N>` — set noise on `<path>` OR updated `respBody`.
- (Case B) `updateSmartTestCase` on `<test-N>` — shape edit re-keyed schema_ref (or resolved a SchemaRefConflict by obsoleting `<twin>`).
- (Case C) `upsertSmartMock` on `<mock-N>` (or relinked `mockReferences`).
- `keploy cloud replay` on branch: `<p>/<t>` tests passed.

### Next step for you
- Review the branch diff. **Merge the branch to main yourself (or let CI merge it)** — I make changes on the branch only.
- (Case 1) Review the code edit at `<file:line>` and push.
- (SchemaRefConflict left for you) Two cases share a contract — decide which to keep, or merge-into-existing in the UI.

Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branch=<url_encoded_git_branch>
Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>&branch=<url_encoded_git_branch>
```

---

## Routine B — "add new keploy smart tests for my changes"

### Phase B1 — Identify the changes

`git diff origin/main...HEAD --name-only` (fall back to `main...HEAD`). Filter to HTTP-handler files; list each added/modified endpoint's `method`+`path`. Nothing handler-relevant → tell the dev, stop.

### Phase B2 — Capture traffic

Pre-flight: discover the run command (keploy.yml `command`, a `run.sh`, Makefile/compose/Procfile/package.json/README), start the app, curl an endpoint to confirm it serves, stop it cleanly. Make sure it's fully stopped before recording. Then `keploy record -c "<run command>" --sync --disable-mapping=false` (both flags MANDATORY — without `--disable-mapping=false` the test→mock mapping is silently dropped at upload), drive ONE realistic curl per new/changed endpoint, stop recording. Recording lands at `keploy/test-set-N/`.

Background the recorder and stop it by PID (`echo $! > /tmp/rec.pid` … `kill -INT $(cat /tmp/rec.pid)`) — not `pkill -f 'keploy record'` (matches your own shell). If a re-replay doesn't reflect a change, clear the local cache: `rm -f keploy/smart-set/.mock-cache.json keploy/smart-set/mocks.yaml`.

### Phase B3 — Upload as a smart set, onto the branch

```bash
keploy upload test-set --app <ns.deployment> --branch <git branch> --test-set keploy/test-set-N --smart-test-set --name <descriptive-name>
```

`--smart-test-set` (NOTE the dashes) ingests new contracts as `imported-*` on the branch, deduped by `schema_ref` (existing contracts are SKIPPED, reported per-case — re-uploading the same recording is a no-op, not a duplicate). Requires `--branch` and an app with smart test set enabled (else the server rejects with "requires the app to have smart test set enabled").

### Phase B4 — Validate (on the branch)

```bash
keploy cloud replay --app <ns.deployment> --branch-name <git branch> --cluster <cluster-name> --replay-source smart-set --freezeTime --disableReportUpload=false 2>&1 \
  | tail -n 60 | grep -E "Total test|test passed|test failed|FAIL|ERROR|View test report"
```

If anything fails, enter Routine A from Phase A2.

### Phase B5 — Report and STOP (the dev merges)

```
### Captured (imported on branch `<git branch>`)
| Endpoint | Imported (test-N) | Skipped (already in set) |
| --- | --- | --- |
| <method> <path> | <N new> | <M existing> |

### Replay
<p>/<t> tests passed on branch `<git branch>`.

### Next step
Review the branch diff and **merge to main yourself (or via CI)** — merge reconciles the `imported-*` cases to stable `test-N`. I import & validate on the branch only.

Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branch=<url_encoded_git_branch>
Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>&branch=<url_encoded_git_branch>
```

---

## When you MAY ask the dev (and only then)

- PAT missing/invalid (auth error from the MCP tool) → ask for a fresh PAT.
- `git rev-parse --abbrev-ref HEAD` returns `HEAD`/non-zero → ask for a branch name ONCE.
- `listApps` ambiguous and unnarrowable by compose-service → list candidates, ask ONCE.
- Pre-flight cannot start the app → name the command + error, ask ONCE.
- A `SchemaRefConflict` where BOTH cases are legitimately distinct contracts → surface it; "merge into existing" is the dev's call.

## Anti-patterns (refuse these)

- **Merging or rebasing the branch to main** — not your job, not an MCP tool. Fix on the branch, report, let the dev/CI merge.
- **Editing on `main`** — every smart-set mutation needs `branch_id`; main is read-only.
- **Treating a `SchemaRefConflict` as retryable** — re-applying the same shape edit conflicts again. Resolve the twin (obsolete/delete) or report.
- **Re-recording a shape-changed contract but forgetting to delete the stale old case** — re-record lands a NEW `schema_ref`; the old case keeps failing as a duplicate. Delete/obsolete it after re-record (rule 5).
- **Editing handler code on a Case A/B/C failure** — contract changed → fix test data on the branch, not source.
- **Uploading fixtures from another branch / inventing a PAT or branch name.**
- **`search_tools` for a tool you already know** (use `get_tool_schema`), **`keploy --help`/`--version` dumps**, **reading `keploy/cloud-debug.log` or the local `keploy/` cache** (throwaway; use `getTestReportFull` for structured data).
````

## Scenarios

Every scenario starts with the same two-prompt UX and ends at a **verified branch** (you or CI merge afterward). The variable part is the decision the agent makes in the middle — one per case it classifies.

### Scenario 1 — App regression (the agent refuses to edit the test)

A refactor accidentally emptied a response value that the app should still return (the downstream mock still carries the correct data).

> _"my keploy smart-set replay is failing, please analyze and fix it."_

The agent reads the report, sees the field dropped with the **schema unchanged**, and confirms the downstream mock still provides the value → classifies a **regression**. It makes **no** smart-set edit — it flags the app bug (and fixes the source when the change was clearly unintended), rebuilds, and re-runs. Baking the bad value into the golden test is explicitly refused.

### Scenario 2 — Value drift on the response body (Case A)

You changed a response value on purpose (e.g. a version string now carries a `v` prefix).

> _"my keploy smart-set replay is failing, please analyze and fix it."_

The recorded value differs from the app's new output with no regression signal → **Case A (value)**. The agent calls `updateSmartTestCase` with the new `respBody`; `schema_ref` is **preserved** (identity unchanged). Replay re-runs green.

### Scenario 3 — Non-deterministic field (Case A, noise)

A response field now varies every request (a per-request id, a deploy tag, a timestamp).

> _"my keploy smart-set replay is failing, please analyze and fix it."_

The agent recognizes the value is non-deterministic (not a real contract change) → **Case A (noise)**. It calls `updateSmartTestCase` adding the field's JSONPath to `noiseJson` — rather than pinning a single value that would just re-fail next run — and **preserves** any existing noise entries.

### Scenario 4 — Shape drift (Case B)

You renamed (or removed / retyped) a response field.

> _"the keploy smart-set pipeline is failing, please analyze and fix it."_

The contract **structure** moved → **Case B (shape)**. The agent calls `updateSmartTestCase` with the new `responseJson`; `schema_ref` is **recomputed** for the new shape. Replay re-runs green.

> Note: purely **additive** fields do not fail replay — the response comparison is _expected ⊆ actual_ — so a shape scenario is triggered by a rename, removal, or type change, not by adding a new field.

### Scenario 5 — Shape drift that collides with an existing case (`SchemaRefConflict`)

A shape edit produces a `schema_ref` that already belongs to another case (often an obsolete twin).

The agent does **not** blind-retry. It reads the conflict's `existingCaseId`, resolves the stale twin on the branch (`setSmartTestCaseObsolete` or `deleteSmartTestCase`), then re-applies the shape edit. If both cases are legitimately distinct, it reports the conflict for you to resolve rather than guessing.

### Scenario 6 — Mock drift (Case C)

The app's outbound call to a dependency changed, so the recorded mock no longer matches (`mock_mismatches` in the report).

> _"my keploy smart-set replay is failing, please analyze and fix it."_

The agent confirms the app logic is intact and only the downstream contract moved → **Case C (mock)**. It calls `upsertSmartMock` to update the mock on the branch (or re-records when the request shape itself changed). Replay re-runs green.

### Scenario 7 — Endpoint removed (obsolete)

You deprecated an endpoint; its recorded contract can no longer replay.

> _"my keploy smart-set replay is failing, please analyze and fix it."_

The agent recognizes an intentional removal (not a routing regression) → `setSmartTestCaseObsolete` on the branch. The case leaves the replayable set (kept in history), it is **not** deleted, and replay re-runs green.

### Scenario 8 — Adding tests for a new endpoint (Routine B)

You added a new route.

> _"Add new keploy smart tests for my changes."_

The agent records one realistic request for the new endpoint, uploads it onto the branch (`keploy upload test-set --smart-test-set --branch <git branch>` — new `schema_ref`s ingest as `imported-*`, deduplicated), and validates with a branch replay. On merge, `imported-*` reconciles to a stable `test-N`.

---

Across every scenario you only ever said one of two sentences. You push your code change (and, for Scenario 1, the agent's app-side fix); CI replays the branch on the PR and `keploy cloud branch-merge` lands the test data on `main` at merge.

## Related workflows

- **[Developer + LLM Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-llm-workflow)** — the same agent-driven loop for the broader Keploy Proxy flow: per-editor MCP config, the full playbook with phase-by-phase Routines A/B (report projection, exact report format), and worked scenarios. Start there for the general setup; use **this** page for the smart-set substrate specifics (`schema_ref` identity, branch-native edits, `SchemaRefConflict`).
- **[Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow)** — the same flow done **manually** (dashboard / CLI, no agent): create a branch, edit test cases and mocks, replay, open a PR, merge.
