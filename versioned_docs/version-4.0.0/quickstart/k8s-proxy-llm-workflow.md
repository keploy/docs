---
id: k8s-proxy-llm-workflow
title: Developer + LLM Workflow with Keploy Proxy
sidebar_label: LLM Workflow
description: Wire up Keploy's MCP server, paste a single autonomous playbook into your editor, and run the whole Keploy workflow with exactly two developer prompts—the LLM does everything else.
tags:
  - K8s
  - Developer Workflow
  - LLM
  - MCP
  - Claude Code
  - Cursor
  - AI Agent
  - Branches
keywords:
  - Keploy MCP
  - Claude Code
  - Cursor MCP
  - Windsurf MCP
  - LLM workflow
  - Keploy branches
  - cloud replay
  - branch-merge
  - autonomous agent
---

# Keploy MCP playbook—autonomous developer workflow

## Installation

Save this playbook as an **agent skill**, not a static rules file. Cursor's modern Skills mechanism (and Claude Code's identical `SKILL.md` convention) loads the file on demand when the user issues one of the two prompts below, instead of injecting it as always-on context. That keeps every other unrelated agent task out of this playbook's token cost.

- **Cursor:** create `.cursor/skills/keploy/SKILL.md` (or your project's preferred Skills path) and paste the rest of this page into it. Do **not** put this content in `.cursorrules` — `.cursorrules` files are always-on and would bill the full ~8k-token playbook on every editor interaction.
- **Claude Code:** create `.claude/skills/keploy/SKILL.md` and paste the rest of this page into it. The agent invokes it automatically when the developer's prompt matches one of the entry points below.
- **Other agents (Windsurf, Antigravity, …):** create the equivalent skill / project-context file. Avoid global / always-on placements for the same token-cost reason.

The MCP server itself is configured separately — see the [agent test generation MCP setup](/docs/running-keploy/agent-test-generation#mcp-client-configuration) for the Cursor / Claude Code MCP entries that wire `https://api.keploy.io/client/v1/mcp` into your client.

## Entry points

The developer will only ever say one of two things to you:

**Prompt A:** "my keploy cloud replay is failing, please analyze and fix it." OR "the keploy cloud replay pipeline is failing, please analyze and fix it."—both forms route to the same routine; the first means the dev's last local replay run failed (find the latest test_run on the branch via api-server), the second means a CI pipeline run failed (the dev should paste the CI log or dashboard URL; extract `test_run_id` from it).
**Prompt B:** "Add new keploy tests for my changes."

You handle EVERYTHING else autonomously. Discover the app, the branch, the failing run, the code changes—from the filesystem, from git, and from the Keploy api-server. Make decisions. Execute fixes. Report what you did. Do NOT ask the developer follow-up questions unless you are truly blocked (see "When you may ask" at the bottom).

## Hard rules

1. **Branch-first.** Every write to mocks / tests / recordings is branch-scoped. Resolve `branch_id` before any write. If a tool returns "branch_id is required", you skipped this—fix and retry, don't ask the dev.
2. **Keploy branch name = git branch name.** Detect via `git rev-parse --abbrev-ref HEAD`. Pass that string to `create_branch` (find-or-create, idempotent). Reuse the returned `branch_id` for every subsequent write in this session.
3. **App resolution from cwd.** `basename $(pwd)` → `listApps({q: <basename>})`. Exactly one match → use it. Multiple → pick the one whose name most specifically matches the dev's compose service. Zero matches → ask the dev once.
4. **Fix the root cause—app code or test data.** When a test fails because the contract changed intentionally, fix the test on the Keploy branch (`keploy mock patch` CLI for mocks; `updateTestCase` MCP tool for test cases). When a test fails because the app regressed, edit the handler code yourself to restore the correct behavior. Announce the file:line change in clear terms before re-running replay so the dev can interrupt if they object; otherwise proceed. Re-run replay to verify in both cases.
5. **Don't ask what you can find out.** Use `git log`, `git diff`, file reads, and api-server calls. Never ask "what did you change", "which app", or "which branch"—discover them.
6. **Always end with two dashboard URLs.** The branch diff page and the test-run report page. Format:
   - `Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>`
   - `Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>`
     The `<test_run_id>` is the id from Phase A1 (or, for Routine B, the id of the most recent run after `keploy cloud replay`). Swap the base for self-hosted.

## Discovery (run at the start of every conversation, before either routine)

1. **App.** `basename $(pwd)` → `listApps({q: <basename>})` → pick the unambiguous match. Cache `app_id` for the session.
2. **Branch.** `git rev-parse --abbrev-ref HEAD` → `create_branch({app_id, name: <git branch>})` → cache `branch_id`. If `git rev-parse` returns `HEAD` or exits non-zero, ask the dev for a branch name ONCE.
3. **App context — MANDATORY before any `keploy cloud replay` invocation** (Phase A4 OR Phase B4). `getApp({appId: app_id, fields: ["name","namespace","deployment","origin.clusterName","origin.namespace","origin.deployment"]})`. The full app schema is ~16k tokens; the projected response is ~300 tokens. **Call this AT MOST ONCE per session.** The returned identity fields are sticky — hold them mentally, do not re-call `getApp` later in the conversation for the same `app_id`. **You CANNOT issue `keploy cloud replay` without first resolving `origin.clusterName` here — the CLI requires `--cluster <name>` and the error it returns when the flag is missing (`no active clusters found`) is misleading; it actually means "you forgot `--cluster`".**

All three values are sticky for the rest of the conversation. Don't re-discover unless the dev switches git branches. Re-calling `getApp` mid-session is an anti-pattern — its 16k schema lives in your context for every subsequent step regardless of whether you ask for it again.

---

## Routine A—failing cloud replay (local or CI), analyze and fix

### Phase A1—Resolve the `test_run_id`

The goal of this phase is exactly one thing: produce a `test_run_id` you can pass to `getTestReportFull` in Phase A2. Pick how you get it based on the form of Prompt A:

- **Local form** ("my keploy cloud replay is failing…") → call `listTestReports({appId: app_id, branch_id, status: "FAILED", limit: 5})` **EXACTLY ONCE for the whole session**. Pick `data[0]` (newest first by `created_at`) and take its `id`. That's the dev's last local `keploy cloud replay --branch-name` invocation — `keploy cloud replay` uploads its report into the legacy `/tr` collection. **Do NOT retry with different status / source / branch_id permutations** if the first call returns empty. **Do NOT re-call after your own `keploy cloud replay` finishes** — the final replay's stdout already shows the new `test_run_id` in its `View test report at: …/tr/<id>` line; parse the URL instead of re-querying. `status` is CASE-SENSITIVE — use the exact value `"FAILED"`, not `"failed"` or `"Failed"`. Use `getTestReport({appId: app_id, reportId: test_run_id})` for a cheap roll-up probe only when the full report is going to be large.
- **CI form** ("the keploy cloud replay pipeline is failing…") → the dev usually pastes a CI log URL or dashboard URL. Extract `test_run_id` from it. If they didn't paste anything, fall back to the local-form lookup above—a CI failure posts the same legacy test-run-report record to the api-server, so the latest-failed lookup still finds it. Use `source: "ci"` on the list call to scope to runs that carry CI metadata.

Either way, Phase A2 onward is identical—same `getTestReportFull` call, same routes, same fixes.

### Phase A2—Fetch the full report

Call `getTestReportFull` with a projection that includes EVERYTHING you will need for Phase A3 diagnosis — in one call. **The field paths below match the actual response schema verbatim — pasting other forms (`name`/`id` for test cases, `failed_steps[]`, top-level `mock_mismatches`) returns null because those keys do not exist in the response.** The canonical projection:

```
getTestReportFull({
  appId: app_id,
  reportId: test_run_id,
  include_oss_report: true,
  max_test_cases_per_set: 50,
  fields: [
    "report.status",
    "report.ci_metadata",
    "report.failed_count",
    "report.passed_count",
    "test_sets[].test_set_name",
    "test_sets[].test_set_id",
    "test_sets[].status",
    "test_sets[].test_cases[].test_case_name",
    "test_sets[].test_cases[].test_case_id",
    "test_sets[].test_cases[].status",
    "test_sets[].test_cases[].oss_report.req",
    "test_sets[].test_cases[].oss_report.resp",
    "test_sets[].test_cases[].oss_report.result",
    "test_sets[].test_cases[].oss_report.failure_info",
    "test_sets[].test_cases[].oss_report.noise"
  ]
})
```

The OpenAPI-generated tool's **path** parameters are camelCase (`appId`, `reportId`); **query** parameters stay snake_case (`include_oss_report`, `mock_mismatches_only`, `max_test_cases_per_set`, `fields`). Pass each with the literal name the spec declares.

**Use `fields` aggressively** — full report is ~34k tokens, projection brings it to ~5k. Supports dotted paths + array wildcards (`field[]`). **If your first call missed a field you need, ADD it to a new projected call — NEVER drop `fields=` to "get everything" and never fall back to `include_oss_report=true`/`max_test_cases_per_set=N` without `fields=`. The unprojected response is the 34k-token blob that gets re-added to context every subsequent turn for the rest of the session.** Read:

- `report.status` — `FAILED` is your trigger to continue.
- `report.ci_metadata` — when populated this is a CI run; `provider` / `commit_sha` / `pr_number` give you the surrounding context.
- `test_sets[]` — per set, each entry carries `test_set_name`, `test_set_id`, `status`, and `test_cases[]` (the inflated per-case rows). Iterate `test_cases[]` and, for any case whose `status` is `FAILED`, read:
  - `test_case_name`, `test_case_id` — identity (note these are the FULL field names, NOT `name`/`id`).
  - `oss_report.req.{method,url}` — which endpoint failed.
  - `oss_report.result.status_code.{expected,actual,normal}` — status-code diff.
  - `oss_report.result.headers_result[].{expected,actual,normal}` — per-header diff (`normal=false` means a real mismatch).
  - `oss_report.result.body_result[].{expected,actual,normal,type}` — per-body diff. This is your primary signal for an authored-response drift.
  - `oss_report.result.dep_result[]` — per-dependency (downstream mock) diff. Often empty in current api-server builds; `mock_mismatches` (separate call) is the reliable signal.
  - `oss_report.failure_info.{category,risk,assessment}` — high-level signals: `category` includes tokens like `HEADER_CHANGED`, `BODY_CHANGED`, `SCHEMA_UNCHANGED`; `assessment.value_changes[]` names the specific JSON keys that drifted. Useful for fast classification.
  - `oss_report.noise` — JSONPaths the recorder has already marked as ignorable (don't re-flag these as drifts).

**Getting mock IDs for Case 2b (separate call with `mock_mismatches_only=true`):** The default report does NOT include `mock_mismatches` per case (the field is omitted by the server unless explicitly requested). When Phase A3 classification routes to Case 2b, make a SECOND projected call with `mock_mismatches_only=true` to discover which mocks need patching:

```
getTestReportFull({
  appId: app_id,
  reportId: test_run_id,
  mock_mismatches_only: true,
  fields: [
    "test_sets[].test_set_id",
    "test_sets[].test_cases[].test_case_name",
    "test_sets[].test_cases[].oss_report.mock_mismatches.actual_mocks[].name",
    "test_sets[].test_cases[].oss_report.mock_mismatches.actual_mocks[].kind"
  ]
})
```

The response will only contain cases that consumed mocks. Read `oss_report.mock_mismatches.actual_mocks[].name` to get the mock IDs (`mock-N` strings) for targeted `getMock` reads. This avoids `listMocks` (which returns ~28k tokens of inventory).

### Phase A3—Diagnose each failing test case

**Before classifying, verify intent.** The commit-message channel is **asymmetric**: it can confirm "deliberate" with high confidence, but it cannot confirm "bug." Real regressions ship with normal-sounding messages ("add field X", "extract helper", "switch to v2 client") — no one writes `fix(orders): accidentally broke duplicate-detect`. So the message has exactly one trustworthy verdict: deliberate → Case 2. Everything else means "message doesn't decide" — go look at the working tree, then the diff.

Honest classifier — apply in order, stop at the first match:

**Step 0 — Working-tree check (UNCONDITIONAL; run FIRST, before any classifier MCP or git-history call).**

```
git status -s -- <failing-handler-path>
git diff -- <failing-handler-path>          # unstaged
git diff --cached -- <failing-handler-path> # staged but not committed
```

Run all three **every time**, even when the tree looks clean. The empty result IS the evidence required to advance to Step 1. Skipping = silent misclassification when the assumption is wrong.

**Allowlist of MCP calls permitted before Step 0** (Phase A1 discovery only): `listApps`, `getApp`, `create_branch`, `list_branches`, `listTestReports`, `getTestReport`, `tools/list`. EVERY other call — `getTestReportFull`, `getTestCase`, `getMock`, `listMocks`, `getRecording`, `listRecordings`, `updateTestCase`, `update_mock`, `delete_recording` — is classifier/write and MUST come AFTER Step 0. Reading `getTestCase` first biases toward Case 2 framing.

Any uncommitted edit touching the failing handler's source → **Case 1, mandatory.** Revert (or ask the dev); do NOT proceed to commit-history reasoning. Uncommitted edits beat any committed-history signal — they can't be the deliberate new contract.

**Step 1 — Identify the recording's snapshot anchor.**

If Step 0 is clean (no uncommitted edits on the failing path), find the commit the failing test set was recorded against. Sources, in order of preference:

- The test set's `created_at` timestamp from `listRecordings` / `getRecording` → `git log --until=<ts> -1 --format=%H -- <failing-handler-path>` gives the commit that was HEAD when the recording was captured.
- The branch's first commit ancestor of HEAD that pre-dates the recording's creation.

Commits **at or before** the anchor are already encoded in the recording — they cannot be a drift source, regardless of how "intentional" their messages read. Skip them.

**Step 2 — Commit-message check (post-anchor commits only).** For each commit strictly after the anchor that touches the failing handler:

- (a) **Message names a feature / refactor / contract change / incident remediation** → **Case 2**. Dev's stated intent is the contract; do NOT rewrite the deliberate code into a non-IO equivalent (still Case 1 in disguise).
- (b) **Message silent/generic** AND diff touches the exact drifted field per `oss_report.result.body_result[].expected` AND baseline still represents correct contract → **Case 1**. Side-effect regression; the signal is the diff×baseline intersection, not the message.
- (c) **Otherwise** (silent + drift not in diff, or unclear) → **Case 2** (default to test-data work; silence is not evidence of a bug).
- (d) **No post-anchor commits touch the failing handler AND Step 0 clean** → ask the dev; flaky/environment/proxy.

Classify each failing test case using `oss_report.result` body/header diff + `oss_report.mock_mismatches`:

#### Case 1—Bug in the app (regression). You fix the code.

The handler used to behave correctly; an uncommitted edit or a recent commit broke it as a side effect. Signal: Step 0 flagged an uncommitted edit OR the diff touches the same field the report says drifted, the commit message doesn't claim that field as the intended change, and `oss_report.result.body_result[].expected` (the recorded baseline) still represents the correct behavior.

**Action — execute IN THIS ORDER. Skipping or reordering any step is a defect; the rebuild does nothing without the edit, and the replay tells you nothing without the rebuild.**

**Step C1.1 — Edit the source. This is THE fix.** Pick one of:

- **Uncommitted regression (Step 0 fired):** Run `git checkout -- <failing-handler-path>` (or `git restore -- <path>`) via the Bash tool to discard the working-tree edit. This is the literal fix — the test was passing against the committed source, and the working-tree edit is what broke it. Do NOT skip to rebuild expecting the rebuild to "restore" the source; image rebuild reads from the current source, so without the checkout you'll rebuild the same broken code.
- **Committed regression (Step 2 fired):** Edit the **application source code** (`.go` / `.py` / `.ts` / `.java` / etc.) yourself using the Edit/Write tool to restore the expected behavior — minimal change, consistent with the test's contract.

The fix MUST live in the application source. Do NOT modify `Dockerfile*`, `docker-compose*.yml`, `keploy.yml`, `.env*`, k8s manifests, CI workflows, or the replay command line; do NOT introduce a new env-var-driven branch in code as a way to toggle the bug away at runtime. Announce the file:line and a one-line description of the edit **before** applying it so the dev can interrupt if they object; otherwise proceed. Do NOT touch the test—its captured baseline is still correct.

**Step C1.2 — Verify the edit landed.** Run `git status -s -- <failing-handler-path>` and `git diff -- <failing-handler-path>`. Status + diff MUST both be empty for an uncommitted-regression revert (means working tree matches committed baseline). If either still shows changes, redo C1.1. Do not proceed to rebuild until verification is clean.

**Step C1.3 — Rebuild the image.** Only AFTER C1.2 clean: `docker build -t <image>:<tag> <build-context>`. Cloud replay does not compile from source — see "rebuild before replay" below for tag-matching rules.

**Step C1.4 — Replay.** Then run `keploy cloud replay`. Expect green. If still red after a clean C1.1/C1.2 revert + C1.3 rebuild, investigate further — do NOT flip to Case 2 (the Step 0 signal is the strongest available).

**Anti-patterns (both forbidden):** (1) jumping to `docker build` without executing C1.1 — rebuilds the broken code unchanged; (2) flipping from Case 1 → Case 2 mid-run — Step 0 + Step 2 classification is binding for this iteration. Persistent red after a clean C1.1-C1.3 means ambient state (stale `mock-*-patch.yaml` files, leftover branch test sets) is poisoning the run; surface that to the dev, don't override the classification.

#### Case 2—App behavior drifted intentionally. You fix the test data on the branch.

The contract changed on purpose; the test's recorded baseline is stale. Read `oss_report.result` (status / headers / body diff) and `oss_report.mock_mismatches` together, then pick a sub-action:

**2a—Only a test diff (no mock mismatch driving it).** Update the test data on the branch. The legacy `/tr` flow stores recordings as test cases, so the write tool is `updateTestCase` MCP tool (or `keploy mock patch` CLI if the mismatch is on the recorded response of a downstream mock):

- If the diverging field is genuinely non-deterministic (timestamps, request IDs, generated UUIDs—anything that legitimately changes every run), add its JSONPath to the test case's `noise` map via `updateTestCase`. Marking a field as noise tells the runner to ignore diffs on that path; once added, the next replay should treat the same divergence as `normal=true`.
- Otherwise update the recorded `response` body on the test case via `updateTestCase`. Fetch the existing case first via `getTestCase` so you only mutate the fields the new contract dictates and don't drop unrelated keys.

**2b—Test diff plus a mock mismatch that's plausibly causing the diff.** The recorded mock is what's out of date—the downstream call's shape changed. Look at `oss_report.mock_mismatches.expected_mocks` (what the recorder captured) vs `actual_mocks` (what the replayer actually consumed) — entries that appear in `actual_mocks` but not `expected_mocks` are the new outgoing calls you need to capture.

**Data flow for Case 2b (internalise before touching anything):**

- **Cloud (api-server + mongo) is the single source of truth.** Every write (`keploy mock patch`, `updateTestCase`, `delete_recording`, `keploy upload test-set`) mutates the cloud, not a local file. `keploy cloud replay` re-downloads the bundle into a throwaway local `keploy/<test_set_id>/` cache each run — never hand-edit YAML there, it's wiped on the next run.
- **A 2xx write is persisted in mongo.** Use `getMock` / `getTestCase` for readback if you want to double-check; you do NOT need to "push" or "force-refresh" the bundle.
- **`keploy upload test-set` has one valid use: landing a fresh `keploy record` capture on a branch (step 2 of 2b-recapture).** Don't re-upload an edited bundle — it creates a duplicate test set, doesn't replace the failing one.

**Before the ladder: check whether patch is even applicable.**

`keploy mock patch` can only modify an EXISTING mock entry. It cannot add a new one. So if the source change introduced a new outbound call (new SQL query, new downstream HTTP, new redis op) that has no corresponding entry in the recorded mocks, patching is structurally impossible — there is nothing to patch.

Detect this case from the report's `mock_mismatches`:

- `actual_mocks` lists the outbound calls the app made during replay.
- `expected_mocks` lists the calls the recording has mocks for.
- **If `actual_mocks` contains entries with no match in `expected_mocks`** (e.g. a `SELECT … FOR UPDATE` query that doesn't appear in any recorded mock's `sqlNormalized`), the bundle is missing an entry. Skip the patch ladder and go directly to **2b-recapture** — that is the only path that can introduce a new mock entry without hand-guessing its response shape.

If every `actual_mocks` entry has a matching `expected_mocks` entry but the _values_ differ (column order, bind values, response rows), patch IS applicable — proceed to the ladder.

**Escalation ladder when patches don't make replay green:** `keploy mock patch` ×≤2 → 2b-recapture (record/upload/delete) ×1 → **then** stop-and-report. Verify each patch with `getMock` readback. Reporting prematurely (after 2 failed patches, skipping recapture) leaves a fixable drift uncaught.

**Pick patch vs recapture by drift _shape_, not "is this deliberate":**

- **2b-patch — DEFAULT for scoped _value_ changes on EXISTING mocks.** Tool: `keploy mock patch --app <appUUID> --branch-id <branchUUID> --test-set-id <tsUUID> --mock-id <name> --mock-yaml-file <path>` (CLI). Read existing with `getMock` first, write patched YAML to a file, invoke CLI. Use when the drift is a value change on an existing mock entry (one operator changed, one column / header / constant differs, response shape same family). **New query / new downstream call → NOT patchable → 2b-recapture.**

  > **Always use the CLI, not MCP `update_mock`.** The CLI re-derives kind-specific fields the agent can't compute — most importantly `sql_ast_hash` for PostgresV3 (sha256 of the parsed-normalized AST the matcher keys on). MCP `update_mock` with a stale `sql_ast_hash` writes 2xx, `getMock` echoes new SQL back, but replay still fails because the matcher's hash lookup misses.

- **2b-recapture — ONLY for sweeping changes that can't be patched cleanly** (call graph rewritten, request/response shapes diverge wholesale, multiple endpoints drifted at once). Order: (1) `keploy record --sync --disable-mapping=false` (the latter two flags are MANDATORY — see Phase B2 below for the full rationale: without them the recording's mock-to-case relationship is lost at upload time), (2) `keploy upload test-set --branch <git branch>`, (3) **only after upload succeeds**, `delete_recording` on the stale set. **Never `delete_recording` first** — reversing leaves the branch at zero coverage and the next replay "passes" trivially (zero tests = zero failures, indistinguishable from a real fix).

  > **Recapture is YOU driving traffic. Seed deliberately, drive surgically.** Keploy has no scoped-recapture primitive. Before re-recording, read each existing case's `http_req` + recorded responses to learn what state it assumes (e.g. recorded `GET /api/orders` returned 7 rows but the suite POSTs only 2 → 5 pre-seeded). SQL INSERT / S3 copy / Kafka seed that state, then `keploy record` and drive ONLY the affected case's curls. Driving everything against a fresh DB silently degrades coverage — a `GET ?user_id=Mallory` with no Mallory row captures `{"count":0,"orders":[]}` and replays green without verifying anything.

**Two constraints on every Case 2b action:**

- **Fixtures are branch-scoped — never copy across branches.** Each Keploy branch carries its own recorded fixtures, mocks, and mappings, captured against THAT branch's app state. NEVER upload a recording (or a `keploy mock patch` derivative) from a sibling branch or from main onto the current branch as a shortcut "fix." The fixture's recorded app-state assumptions belong to where it was captured; planting it on a branch with different code state silently corrupts replay lineage and confuses every downstream reader of the branch history. If you need fresh fixtures, re-record against the CURRENT branch's app via `keploy record` + `keploy upload test-set --branch <git branch>`.

- **Reuse before re-record.** Before `keploy record` / `keploy upload test-set` for 2b: `listRecordings({app_id, branch_id})`, then `getMock` per ID. The report-based path (`mock_mismatches_only=true` projected call) names mock IDs directly — **prefer that**. `listMocks` should NOT be the default discovery step (it adds ~28k tokens of inventory), but it IS an acceptable FALLBACK when the projected `mock_mismatches_only=true` call returns empty for the test set you care about (e.g., the failure shape is body-only with no consumed mocks). If a current-branch recording already covers the endpoint with the missing mock entries, `delete_recording` the failing set and stop. Re-record is the LAST resort.

Multiple failing test cases can land in different cases—handle each independently.

### Phase A4—Verify

**After a Case 1 source edit, rebuild the app's docker image BEFORE replay.** Cloud replay doesn't compile — it uses whatever's currently tagged for the manifest's image ref on the local Docker daemon. Resolve the tag from replay logs (`"Using deployment image": "<repo>:<tag>"`) or `getRecording`/`listRecordings` `resources`, then:

```bash
docker build -t <manifest-image-tag> <build-context-dir>
```

`<build-context-dir>` is where the app's `Dockerfile` lives. If the manifest tag is registry-prefixed, match it exactly — else Docker pulls from the registry and misses your edit. **Case 2 fixes skip this step.**

Then run via Bash — **always pipe the output through `tail` / `grep`** so the ~10-40k tokens of replay log don't enter your context wholesale, AND **always pass `--disableReportUpload=false`** so the `/tr` report row gets written (OAuth-authenticated CLIs default this flag to `true`, which silently skips the upload — without it, `listTestReports` will return empty for this run and the dashboard URL won't print):

```bash
keploy cloud replay --app <ns.deployment> --branch-name <git branch> --cluster <cluster-name> --disableReportUpload=false 2>&1 \
  | tail -n 60 \
  | grep -E "Total test|Failed Testcases|test passed|test failed|FAIL|ERROR|debug bundle|View test report"
```

The full replay log contains per-mock-match traces, per-testcase debug lines, and a final summary block. Your decisions only need the final summary + any FAIL/ERROR lines + the `View test report at:` URL. Piping at the command level keeps the slice that gets re-added to context on every subsequent step to ~2k tokens instead of the full ~40k — over a retry loop that compounds enormously. Apply the same pipe pattern to every other long-running Bash command: `keploy record` output, `docker build`, `keploy upload test-set`. Read the cached log file directly only when the grep slice doesn't show what you need.

**`--cluster` is mandatory.** Use the `origin.clusterName` you cached from Discovery's `getApp` (do NOT re-call). Without it, auto-select needs a cluster heartbeat within 35s and dies `no active clusters found`.

If still failing, re-enter Phase A2 with the new `test_run_id`. Cap retries at 3 — beyond that, report residual failures with `test_run_id` + run URL and stop.

**Sanity gate before declaring success.** Post-fix `total_tests` must be ≥ pre-fix. A drop (especially "0 passed / 0 failed") = coverage regression from deleting a test set before its replacement uploaded. Re-record + upload to restore.

### Phase A5—Report (exact format)

```
### Diagnosis
| Test set | Test case | Case | Cause |
| --- | --- | --- | --- |
| <test_set_name> | <test_case_name> | 1 / 2a / 2b | <one-line cause from repo inspection> |

### Fixes applied
- (Case 1) Edited `<file:line>`—`<one-line change description>`.
- (Case 2a) `updateTestCase` on `<test_case_name>`—set noise on `<path>` OR updated response field `<path>`.
- (Case 2b) `keploy mock patch` on `<mock_name>` (test set `<test_set_id>`) OR `delete_recording` + re-capture via `keploy record` + `keploy upload test-set`.
- `keploy cloud replay` re-run: `<p>/<t>` tests passed.

### Next step for you
- (Case 1) Review the code edit at `<file:line>`. Push when satisfied; CI will replay automatically.
- (Case 2) Push your code change—CI replay will pick up the updated Keploy branch.
- (Retry cap hit) File a keploy bug with `test_run_id=<id>` and the run-report URL.

Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>
Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>
```

---

## Routine B—"add new keploy tests for my changes"

### Phase B1—Identify the changes

1. `git diff origin/main...HEAD --name-only` (fall back to `main...HEAD` if `origin/main` isn't fetched).
2. Filter to **HTTP-handler files**—route definitions, controllers, request handlers. Skip refactors, test files, docs, generated code, migrations.
3. For each handler file, read the diff hunks (`git diff origin/main...HEAD -- <file>`) and list the endpoints that were added or modified. Note each one's `method` + `path` + a one-line description.
4. If nothing handler-relevant changed, tell the dev "no API-handler changes detected on this branch—no new tests needed", and stop.

### Phase B2—Capture traffic for the new endpoints

**Pre-flight: confirm the app starts under the dev's local setup.** Discover the dev's run command from the repo (priority order: `Makefile` targets like `run` / `start` / `dev`, `docker-compose.yml` (`docker compose up -d`), `Procfile`, `package.json` scripts, the README's quickstart section). Start the app with that command, curl a reachable endpoint (`/health`, the root, anything that 200s) to confirm it's serving traffic, then stop it cleanly. Don't ask the dev for help here unless you literally cannot get the app to start—discovering the run command from the repo is on you.

**Make sure the app is fully stopped before running `keploy record`.** `keploy record -c "<dev run command>"` spawns its own instrumented copy of the app; if your pre-flight instance is still running, the two will fight over the port (or the container name). `docker compose down` / kill the PID / whatever stops it cleanly before continuing.

**Capture:**

1. Run `keploy record -c "<dev run command>" --sync --disable-mapping=false` via Bash. The `-c` value is the exact command from your pre-flight; `--sync` records test cases synchronously so each curl is captured in order with no race against the next one; **`--disable-mapping=false` is MANDATORY** — without it, the host inherits `keploy.yml`'s `disableMapping: true` (the auto-generated default), the agent silently skips writing `mappings.yaml`, and the uploaded bundle lands in mongo with no `mapping_audits` doc → `getMockMapping` returns empty `mocks: []` for every test case → replay matcher falls back to fragile timestamp-windows. Cloud association happens in Phase B3's upload step, not here — `keploy record` itself is the local OSS command and doesn't take `--cloud-app-id`.
2. For each new/changed endpoint, drive ONE realistic curl. Infer body shape from the OpenAPI spec if there is one, otherwise from the handler signature itself.
3. Stop `keploy record` (kill the PID you captured at step 1, or send Ctrl-C equivalent).
4. The recording lands at `keploy/test-set-N/` on disk.

### Phase B3—Upload to the Keploy branch

```bash
keploy upload test-set \
  --app <ns.deployment> \
  --branch <git branch> \
  --test-set keploy/test-set-N \
  --name <descriptive-name>
```

`<descriptive-name>` should reflect the dev's change (e.g. "checkout-with-discount" if they added a discount field). The `--branch` flag scopes the upload to your sticky branch; subsequent dashboard reviewers see only this diff.

### Phase B4—Validate

```bash
keploy cloud replay --app <ns.deployment> --branch-name <git branch> --cluster <cluster-name> --disableReportUpload=false 2>&1 \
  | tail -n 60 \
  | grep -E "Total test|Failed Testcases|test passed|test failed|FAIL|ERROR|debug bundle|View test report"
```

`--cluster` is mandatory — resolve from the `getApp` call you made in Discovery (you cached `origin.clusterName`; do NOT re-call `getApp`). **If you skipped Discovery step 3 because Routine B "starts at git diff" — go back and call `getApp` NOW before replay. Without `--cluster`, the CLI dies with `no active clusters found`, which sounds like "no cluster is running" but actually means "you forgot the flag".** `--disableReportUpload=false` is mandatory too — OAuth CLIs default it to `true` which silently skips the `/tr` report upload. Pipe through `tail`/`grep` for the same context-cost reason as Phase A4.

If anything failed, enter Routine A from Phase A2—the diagnosis routine handles it.

### Phase B5—Report (exact format)

```
### Captured
| Endpoint | Test set | Cases |
| --- | --- | --- |
| <method> <path> | <name> | <N> |

### Replay
<p>/<t> tests passed on branch `<git branch>`.

### Next step
Open your PR. CI will replay this branch automatically; merge will fold the test data into main.

Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>
Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>
```

---

## When you MAY ask the dev (and only then)

- The PAT is missing or invalid (auth error from the MCP tool itself) → ask the dev to mint a fresh PAT.
- `git rev-parse --abbrev-ref HEAD` returns `HEAD` (detached) or exits non-zero → ask the dev for a Keploy branch name ONCE.
- `listApps` returns multiple ambiguous matches that you cannot narrow by compose-service name → list the candidates and ask ONCE.
- Phase B2's pre-flight cannot start the app (discovered the run command from compose / Makefile / Procfile / README but it failed) → name the command you tried and the error, then ask ONCE.

Everything else—what failed and why, which mock to update, what test-set name to use, whether the dev's commit was intentional, what the new endpoint's contract should look like—you discover from the repo and the api-server. Do not ask.

## Anti-patterns (refuse these)

- **Editing handler code on a Case-2 failure.** Contract changed intentionally → fix test data on the branch, not source.
- **Rewriting deliberate code into non-IO equivalents to satisfy stale mocks** (mutex for `SELECT … FOR UPDATE`, local cache for Redis, hardcoded value for HTTP call). Mutates prod behaviour to pass tests; often regresses the safety property the commit added (process-local mutex doesn't survive replicas).
- **`delete_recording` as the first action of 2b.** Order is record → upload → delete. Delete-first empties the branch; next replay "passes" trivially (zero tests = zero failures).
- **Hand-editing local `keploy/<test_set_id>/` files.** That dir is re-downloaded each replay; edits are overwritten. Use CLI / MCP write paths.
- **`keploy upload test-set` to re-publish edited mocks.** Upload is for landing fresh recordings only — it creates a duplicate test set, not a replacement. If `keploy mock patch` + `getMock` confirm the write but replay still fails, that's a matcher defect to report.
- **Editing anything outside the application source tree.** No `Dockerfile*` / `docker-compose*` / `keploy.yml` / `.env*` / k8s manifests / CI workflows; no env-var-driven runtime bypass branches. Real code fix or test-data fix — nothing in between.
- **Flipping CLI flags to make a failure go away** (`--freezeTime=false`, `--envs FOO=bar`, `--mocking=false`, `--ignoreOrdering=true`). Always a test-data problem instead.
- **Writing to `main`** (any tool that omits `branch_id`).
- **Uploading fixtures from another branch onto the current branch.** Fixtures are branch-scoped — they encode app-state assumptions of where they were captured. Re-record against THIS branch instead.
- **Uploading fresh recordings without checking existing branch coverage first.** `listRecordings({app_id, branch_id})` + targeted `getMock` first; reuse if covered.
- **Inventing a PAT, branch name, or secret value.**
- **Running `keploy --help`, `keploy <cmd> --help`, or any `--version` info dump.** This skill names every command + flag you need (`keploy cloud replay`, `keploy mock patch`, `keploy record`, `keploy upload test-set`). The CLI's help text is ~14k tokens and gets re-added to context on every subsequent turn — pure waste.
- **Reading `keploy/cloud-debug.log`, `keploy-logs.txt`, or any file under the local `keploy/` cache directory.** That dir is throwaway state wiped on every replay; the cloud-debug.log alone is ~25k tokens. Use `getTestReportFull` for structured failure data — never inspect the raw debug log.
