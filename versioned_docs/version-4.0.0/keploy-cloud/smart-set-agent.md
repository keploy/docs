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
2. **Capture traffic** with `keploy record -c "<run command>" --sync --disable-mapping=false`, driving one realistic request per new/changed endpoint.
3. **Upload onto the branch** as a smart set (new contracts ingest as `imported-*`, deduplicated by `schema_ref`; existing ones are skipped).
4. **Validate on the branch** with `keploy cloud replay`.
5. **Report and stop** — you review the branch diff and merge; merge reconciles `imported-*` to stable `test-N`.

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
8. **Always end with two dashboard URLs** — the branch diff page and the test-run report page:
   - `Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>`
   - `Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>`

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

Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>
Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>
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

Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>
Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>
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
