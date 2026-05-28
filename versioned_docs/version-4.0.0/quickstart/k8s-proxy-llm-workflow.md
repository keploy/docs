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

# Developer + LLM Workflow with Keploy Proxy

import ProductTier from '@site/src/components/ProductTier';
import useBaseUrl from '@docusaurus/useBaseUrl';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

The [Developer Workflow](/docs/quickstart/k8s-proxy-developer-workflow) page walks through the manual flow end-to-end—things like creating a branch, editing mocks and test cases, replaying changes, opening a PR, merging, and so on. Every step has an MCP tool behind it. This page goes one step further: install the playbook below as a **Claude Code skill** (or the equivalent rules / memory entry in any other MCP-aware editor—Cursor, Windsurf, Claude Desktop, VS Code Copilot, Trae) and you only ever say **one of two things** to the agent. It handles the rest.

The two prompts are:

1. **"my keploy cloud replay is failing, please analyse and fix it."**—for a local replay that came back red (agent fetches the latest report from the api-server). Say **"the keploy cloud replay pipeline is failing, please analyse and fix it."** when the failure was in CI—agent extracts the `test_run_id` from your CI log instead. Same diagnose-and-fix routine either way.
2. **"Add new keploy tests for my changes."**

The agent discovers the app, resolves the Keploy branch, finds the failing run, reads the diff, decides whether the tests need updating or the app has regressed, applies the fix (a code change to the handler, or a test update on the Keploy branch), re-runs replay, and reports back—without follow-up questions. CI still owns the merge.

This page has three parts:

1. **Wire up the Keploy MCP server in your editor**—one-time config; same JSON shape across every supported editor.
2. **Install the playbook**—a single block that goes into a Claude Code skill, a Cursor rules file, a Windsurf memory file, or any equivalent. It loads automatically whenever the agent sees a Keploy-related prompt.
3. **Use the two prompts**—what to type, what the agent does.

This page picks up after two one-time setups are already done: the application is [recording in your cluster](/docs/quickstart/k8s-proxy), and the [CI pipeline](/docs/quickstart/k8s-proxy-developer-workflow#wiring-up-your-ci-pipeline) (replay on PR open, branch-merge on PR merge) is wired into your repo as instructed on the Developer Workflow page. The agent only drives the dev-side loop—it never touches CI.

---

## Before you start

- A **Keploy PAT**—Dashboard → Settings → API Keys. Copy the `kep_...` value (shown only once).
- An **MCP-aware editor**: Claude Code, Cursor, Windsurf, Claude Desktop, VS Code, or Trae.

---

## Step 1—Wire up the Keploy MCP server

All MCP-aware editors accept the exact same JSON config; only the config file path differs. The Claude Code snippet is shown below as the example; for the equivalent config paths on Cursor, Windsurf / Antigravity, GitHub Copilot, and other clients, see [MCP Client Configuration](/docs/running-keploy/agent-test-generation#mcp-client-configuration) on the Agent Test Generation page—the same JSON shape works there too.

**Claude Code** uses `~/.claude.json`:

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

Fully quit and reopen your editor after editing the config. MCP clients only re-read config on startup.

---

## Step 2—Install the playbook

The playbook below teaches your agent to run the whole workflow autonomously from the two prompts. Without it, the agent has to rediscover the workflow on every call by reading each tool's individual description—slower and prone to skipping the branch-resolution step.

The exact same block works on every MCP-aware editor; only the file path changes. The walkthrough below uses Claude Code's native Skills system as the example.

### Where the playbook goes

| Editor             | Install path                                                                                                                                                                 |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Claude Code**    | `~/.claude/skills/keploy/SKILL.md` (global) **or** `<repo>/.claude/skills/keploy/SKILL.md` (committed). Auto-loaded when the dev's prompt matches the skill's `description`. |
| **Cursor**         | `.cursor/rules/keploy.md` in the repo (committed) **or** Cursor Settings → Rules for AI (global).                                                                            |
| **Windsurf**       | `.windsurfrules` at the repo root, **or** `~/.codeium/windsurf/memory/global_rules.md` (global).                                                                             |
| **Claude Desktop** | A Project's "Project knowledge" section, or paste as the first message of every conversation.                                                                                |
| **VS Code**        | `.github/copilot-instructions.md` (Copilot Chat reads this) or paste in chat per session.                                                                                    |

All five locations accept exactly the same block below. Only Claude Code reads the YAML frontmatter at the top (the `---`-delimited block) to decide when to load the skill; other editors ignore it harmlessly—either keep it for portability or strip it; both work.

Commit the file when you want every teammate's agent to follow the same playbook. Whichever location you pick, **fully restart the editor afterward**—every editor reads skills / rules / memory only at startup.

### The playbook

Use the copy button on the block below and paste it into the file at the path you picked above.

````markdown
---
name: keploy
description: Use this skill whenever the dev mentions keploy—a failing "cloud replay" (local or CI pipeline), a request to "add new keploy tests" or similar, or any Keploy MCP tool. Drives the autonomous Keploy branch workflow end-to-end from two fixed dev prompts—agent resolves app + branch, diagnoses failing runs (local or CI), fixes mocks/tests on a branch, captures new traffic, and validates without follow-up questions.
---

# Keploy MCP playbook—autonomous developer workflow

The developer will only ever say one of two things to you:

**Prompt A:** "my keploy cloud replay is failing, please analyse and fix it." OR "the keploy cloud replay pipeline is failing, please analyse and fix it."—both forms route to the same routine; the first means the dev's last local replay run failed (find the latest test_run on the branch via api-server), the second means a CI pipeline run failed (the dev should paste the CI log or dashboard URL; extract `test_run_id` from it).
**Prompt B:** "Add new keploy tests for my changes."

You handle EVERYTHING else autonomously. Discover the app, the branch, the failing run, the code changes—from the filesystem, from git, and from the Keploy api-server. Make decisions. Execute fixes. Report what you did. Do NOT ask the developer follow-up questions unless you are truly blocked (see "When you may ask" at the bottom).

## Hard rules

1. **Branch-first.** Every write to mocks / tests / recordings is branch-scoped. Resolve `branch_id` before any write. If a tool returns "branch_id is required", you skipped this—fix and retry, don't ask the dev.
2. **Keploy branch name = git branch name.** Detect via `git rev-parse --abbrev-ref HEAD`. Pass that string to `create_branch` (find-or-create, idempotent). Reuse the returned `branch_id` for every subsequent write in this session.
3. **App resolution from cwd.** `basename $(pwd)` → `listApps({q: <basename>})`. Exactly one match → use it. Multiple → pick the one whose name most specifically matches the dev's compose service. Zero matches → ask the dev once.
4. **Fix the root cause—app code or test data.** When a test fails because the contract changed intentionally, fix the test on the Keploy branch (`update_mock` / `updateTestCase`). When a test fails because the app regressed, edit the handler code yourself to restore the correct behavior. Announce the file:line change in clear terms before re-running replay so the dev can interrupt if they object; otherwise proceed. Re-run replay to verify in both cases.
5. **Don't ask what you can find out.** Use `git log`, `git diff`, file reads, and api-server calls. Never ask "what did you change", "which app", or "which branch"—discover them.
6. **Always end with two dashboard URLs.** The branch diff page and the test-run report page. Format:
   - `Branch diff: https://app.keploy.io/api-testing/branch-diff?appId=<app_id>&branchId=<branch_id>`
   - `Run report: https://app.keploy.io/tr/<test_run_id>?appId=<app_id>`
     The `<test_run_id>` is the id from Phase A1 (or, for Routine B, the id of the most recent run after `keploy cloud replay`). Swap the base for self-hosted.

## Discovery (run at the start of every conversation, before either routine)

1. **App.** `basename $(pwd)` → `listApps({q: <basename>})` → pick the unambiguous match. Cache `app_id` for the session.
2. **Branch.** `git rev-parse --abbrev-ref HEAD` → `create_branch({app_id, name: <git branch>})` → cache `branch_id`. If `git rev-parse` returns `HEAD` or exits non-zero, ask the dev for a branch name ONCE.
3. **Cluster.** `getApp({appId: app_id})` → read `origin.clusterName` (the proxy app's bound cluster). Cache as `cluster_name`. `listApps` does **not** return this — you must call `getApp`. You'll pass it to `--cluster` on every `keploy cloud replay` so a local (no-`--trigger`) run resolves the app's identity without requiring an actively-heartbeating cluster.

All three values are sticky for the rest of the conversation. Don't re-discover unless the dev switches git branches.

---

## Routine A—failing cloud replay (local or CI), analyse and fix

### Phase A1—Resolve the `test_run_id`

The goal of this phase is exactly one thing: produce a `test_run_id` you can pass to `getTestReportFull` in Phase A2. Pick how you get it based on the form of Prompt A:

- **Local form** ("my keploy cloud replay is failing…") → call `listTestReports({appId: app_id, branch_id, status: "FAILED", limit: 5})`, pick the most recent run (results are already sorted newest-first by `created_at`), and take its `id`. That's the dev's last local `keploy cloud replay --branch-name` invocation—`keploy cloud replay` uploads its report into the legacy `/tr` collection, which is what `listTestReports` queries. Use `getTestReport({appId: app_id, reportId: test_run_id})` if you want a cheap roll-up probe before pulling the full report.
- **CI form** ("the keploy cloud replay pipeline is failing…") → the dev usually pastes a CI log URL or dashboard URL. Extract `test_run_id` from it. If they didn't paste anything, fall back to the local-form lookup above—a CI failure posts the same legacy test-run-report record to the api-server, so the latest-failed lookup still finds it. Use `source: "ci"` on the list call to scope to runs that carry CI metadata.

Either way, Phase A2 onward is identical—same `getTestReportFull` call, same routes, same fixes.

### Phase A2—Fetch the full report

Call `getTestReportFull({appId: app_id, reportId: test_run_id})`. The OpenAPI-generated tool's **path** parameters are camelCase (`appId`, `reportId`) per the spec, while its **query** parameters stay snake_case (`include_oss_report`, `mock_mismatches_only`, `max_test_cases_per_set`); pass each one with the literal name the spec declares. The defaults (`include_oss_report=true`, `mock_mismatches_only=false`, `max_test_cases_per_set=100`) return the roll-up + every test set + every per-case diff + mock mismatches in one round-trip. Read:

- `report.status`—`FAILED` is your trigger to continue.
- `report.ci_metadata`—when populated this is a CI run; `provider` / `commit_sha` / `pr_number` give you the surrounding context.
- `test_sets[]`—per set, each entry carries `tests[]` (per-case name + status roll-up) and `test_cases[]` (the inflated per-case rows). Iterate `test_cases[]` and, for any case whose `status` is `FAILED`, read:
  - `oss_report.req.{method,url}` — which endpoint failed.
  - `oss_report.result.status_code.{expected,actual}` — status-code diff.
  - `oss_report.result.headers_result[].{expected,actual,normal}` — per-header diff (`normal=false` means a real mismatch).
  - `oss_report.result.body_result[].{expected,actual,normal,type}` — per-body diff. This is your primary signal for an authored-response drift.
  - `oss_report.mock_mismatches.{expected_mocks,actual_mocks}` — set of mocks the replayer recorded versus the set it actually consumed during this run. Populated for both passed and failed cases when consumed-mock data is known. Non-empty + a body diff together is the signature of a mock-driven regression.
  - `oss_report.failure_info.mock_mismatch` — same shape, legacy fallback for reports produced by replayers older than v3.5.49.
  - `oss_report.noise` — JSONPaths the recorder has already marked as ignorable (don't re-flag these as drifts).
- For investigating only mock-driven failures on a large run, pass `mock_mismatches_only=true` — `test_cases[]` is restricted to entries with non-empty `mock_mismatches` (or the legacy fallback) and the response stays token-safe.

### Phase A3—Diagnose each failing test case

Two cases. Decide per failing test case from `git log` / `git diff origin/main...HEAD` (commits on the failing endpoint or its dependencies) and the report's `oss_report.result` body/header diff plus `oss_report.mock_mismatches`:

#### Case 1—Bug in the app (regression). You fix the code.

The handler used to behave correctly; a recent commit broke it. Signal: a recent commit touched the failing endpoint or its dependencies AND `oss_report.result.body_result[].expected` (the recorded baseline) still represents the correct behavior.

Action: edit the handler code yourself to restore the expected behavior—minimal change, consistent with the test's contract. Announce the file:line and a one-line description of the edit **before** applying it so the dev can interrupt if they object; otherwise proceed. Do NOT touch the test—its captured baseline is still correct.

#### Case 2—App behavior drifted intentionally. You fix the test data on the branch.

The contract changed on purpose; the test's recorded baseline is stale. Read `oss_report.result` (status / headers / body diff) and `oss_report.mock_mismatches` together, then pick a sub-action:

**2a—Only a test diff (no mock mismatch driving it).** Update the test data on the branch. The legacy `/tr` flow stores recordings as test cases, so the write tool is `updateTestCase` (or `update_mock` for the response shape if the mismatch is on the recorded response of a downstream call):

- If the diverging field is genuinely non-deterministic (timestamps, request IDs, generated UUIDs—anything that legitimately changes every run), add its JSONPath to the test case's `noise` map via `updateTestCase`. Marking a field as noise tells the runner to ignore diffs on that path; once added, the next replay should treat the same divergence as `normal=true`.
- Otherwise update the recorded `response` body on the test case via `updateTestCase`. Fetch the existing case first via `getTestCase` so you only mutate the fields the new contract dictates and don't drop unrelated keys.

**2b—Test diff plus a mock mismatch that's plausibly causing the diff.** The recorded mock is what's out of date—the downstream call's shape changed. Look at `oss_report.mock_mismatches.expected_mocks` (what the recorder captured) vs `actual_mocks` (what the replayer actually consumed) — entries that appear in `actual_mocks` but not `expected_mocks` are the new outgoing calls you need to capture. Update the mock via `update_mock({app_id, test_set_id, mock_id, branch_id, mock_yaml: <updated yaml>})`. Read the existing mock with `getMock` first to preserve fields you're not changing, then re-run replay.

**Case 2b loop — follow exactly, do not improvise:**

After step 1's `update_mock` lands and the re-replay is still red, your repertoire collapses to **exactly two moves**: another `update_mock` (step 2) or `delete_recording` + re-record (step 3). Anything else — editing `keploy/<test_set_id>/mocks.yaml`, passing `--useLocalMock`, `--disableMockUpload`, or `--useLocalTests` to `keploy cloud replay`, comparing local YAML to spot "what changed", restarting the agent — is **off the menu**. Those flags exist for OSS-level proxy debugging; they appear to work but pin a divergent state to your laptop while the Keploy branch the team replays against stays broken. The contract is "the cloud branch is the only source of truth"; respect it or get out of Routine A.

1. **First edit.** `getMock` → mutate the canonical YAML to reflect the new contract → `update_mock`. Re-run replay.
2. **Second edit (only if step 1 still red on the same mock for the same reason).** Re-read `oss_report.mock_mismatches` for the new run; the diff between `expected_mocks` and `actual_mocks` should now be tighter. `getMock` again (the server may have rewritten derived fields), mutate, `update_mock`. Re-run replay.
3. **Fallback (if step 2 is still red).** Recorded baseline is too far gone to patch piecemeal — choose between a **whole-set** drop and a **scoped** drop based on how many test cases are failing:

   **3a — Whole-set re-record (most / all cases in the set are failing):**
   ```
   delete_recording({app_id, test_set_id, branch_id})           # drops the entire set
   keploy record -c "<dev run command>" --sync                   # captures all flows
   # drive curls covering the same surface the original set covered
   keploy upload test-set \
     --app <ns.deployment> --branch <git branch> \
     --test-set keploy/test-set-N --name <fresh-descriptive-name>
   # re-run keploy cloud replay
   ```

   **3b — Scoped re-record (only one or a few cases in the set are failing):**

   > **Availability**: 3b requires an api-server that advertises `test_case_ids` on the `delete_recording` MCP tool. To check, look at the `delete_recording` tool's `inputSchema.properties` in the MCP server's `tools/list` response — if `test_case_ids` (type: array of string) is listed, 3b is available. If it isn't, fall back to 3a until the deployment includes the scoped-delete change.
   ```
   delete_recording({                                            # tombstones JUST those cases;
     app_id, test_set_id, branch_id,                             # the rest of the set + its
     test_case_ids: [<name-1>, <name-2>, ...]                    # mocks stay intact.
   })                                                            # Names are the same friendly
                                                                 # identifiers used elsewhere
                                                                 # (e.g. "get-api-orders-1").
   keploy record -c "<dev run command>" --sync                   # capture only the dropped flows
   # drive curls for ONLY the test cases you tombstoned — use the
   # recorded request body of each as the curl shape
   keploy upload test-set \
     --app <ns.deployment> --branch <git branch> \
     --test-set keploy/test-set-N \
     --name <slug-part>--rerec-<utc-timestamp-part>              # build per "Naming convention details" below; do NOT post-process the result
   # re-run keploy cloud replay                                   # so re-records cluster with the
                                                                 # set they refresh
   ```

   In 3b the branch ends with two coexisting test-sets: the original (minus the tombstoned cases) and the new small one with the replacements — both contribute to the next replay. The server rejects duplicate names with `test set "X" already exists for this app`, so the convention below mints a unique `--name` and the shared prefix keeps the recordings page self-grouping (original + its re-records sort together).

   > **Naming convention details.** Build the name in two parts and concatenate them verbatim — do NOT post-process the whole result.
   >
   > 1. **Slug part** — take `<original-set-name>`, lowercase it, replace every maximal run of characters outside `[a-z0-9]` (spaces, parens, dots, underscores, etc.) with a single `-`, then trim leading/trailing `-`. Worked example: `Scenario 4 v8 baseline (4 cases)` → `scenario-4-v8-baseline-4-cases`. This avoids the api-server's name validator rejecting spaces/parens/special chars.
   > 2. **Suffix part** — append the literal `--rerec-<utc-timestamp>`, where `<utc-timestamp>` is `YYYYMMDDHHMMZ` (the trailing `Z` is uppercase, in UTC, and is part of the literal — do NOT lowercase or slug it). Example suffix: `--rerec-202605281430Z`.
   >
   > Combined example: `scenario-4-v8-baseline-4-cases--rerec-202605281430Z`. Two agents running in different timezones at the same wall-clock minute produce the same name — preserving the "original + its re-records sort together" intent for cross-timezone CI integrations.
   >
   > **Deterministic alternative.** If the original-set-name isn't available at name-mint time, use `rerec-<short-git-sha>-<utc-timestamp>` where `<short-git-sha>` is the first 7 characters of `git rev-parse HEAD`. The alternative begins with the literal `rerec` (NO leading `-` or `--` — the double-dash in the primary form is the slug/suffix boundary marker, which this form doesn't have because there's no slug part). This form drops the original-set prefix, so re-records won't sort-group with the original on the recordings page — only use it when the prefix is genuinely unavailable.

   Pick 3a when ≥ ~75% of the set's cases fail, 3b otherwise. Defaulting to 3a when only one case is failing destroys unrelated passing tests for no reason.

**Do NOT inspect or edit `keploy/<test_set_id>/mocks.yaml` on the local filesystem.** `keploy cloud replay` re-downloads mocks from the Keploy branch on every run; any local edit is silently overwritten before the next replay. All mock changes go through `update_mock`. If a local-edit + `--useLocalMock`-style workaround tempts you because cloud round-trip changed the shape of a value (e.g. a Postgres NUMERIC `price` came back as `{int: []}` instead of `{int: "1250", exp: -2}`), that is a step-2 retry signal — go to step 2 of the loop with a corrected payload, or to step 3 if step 2 also fails. Do not paper over the round-trip locally; the next replay on a CI runner or another laptop will undo your fix and the team-visible branch state will diverge from what you tested.

**Do NOT pass `--useLocalMock`, `--useLocalTests`, or `--disableMockUpload` to `keploy cloud replay`.** Those flags belong to OSS-level proxy debugging and pin a laptop-local divergent state — the Keploy branch the rest of the team replays against stays broken regardless of what your local run reports. Every replay you trigger in Routine A must round-trip through the cloud branch; otherwise you are not in Routine A any more.

**Do NOT ask the dev which path to take.** Routine A is autonomous. Announce the file:line you intend to change in plain text (so the dev can interrupt if they object), then proceed. Do not call `AskUserQuestion`, do not offer numbered choices, do not pause for confirmation. If two repair paths look equally valid, pick the one the skill recommends (Case 2a noise > body update, Case 2b update_mock > delete + re-record) and proceed. The dev is reviewing the streamed transcript and will Ctrl-C if you're wrong; that's the contract.

Multiple failing test cases can land in different cases—handle each independently.

### Phase A4—Verify

After every Case-1 (app code edit) or Case-2 (test data edit) fix, run via Bash:

```bash
keploy cloud replay --app <ns.deployment> --cluster "<cluster_name>" --branch-name <git branch> \
  -c "<dev run command>" --container-name <app container> --disableReportUpload=false
```

`--cluster` resolves the proxy app's identity without requiring an active heartbeat (use the `cluster_name` cached in Discovery). `-c` + `--container-name` start the app locally; omit them in CI / active-cluster runs and let the in-cluster agent run the deployment. `--disableReportUpload=false` makes the `/tr` report persist locally (the CLI silently sets it to `true` for OAuth sessions otherwise).

If still failing, re-enter Phase A2 with the new `test_run_id`. If passing, proceed to A5. Cap retry attempts at 3 cloud-replay runs total across the Case 2 loop (i.e. step 1's replay + step 2's replay + step 3's replay = 3 — this is independent of the per-step retry budget within Case 2b, which caps `update_mock` attempts at 2 before forcing the 3a/3b fallback). If it's still red after 3 cloud-replay runs, the failures are likely a keploy-side proxy issue (your fixes aren't taking effect). Report the residual failures honestly with the `test_run_id` and the run-report URL so the dev can file a keploy bug, then stop.

### Phase A5—Report (exact format)

```
### Diagnosis
| Test set | Test case | Case | Cause |
| --- | --- | --- | --- |
| <test_set_name> | <test_case_name> | 1 / 2a / 2b | <one-line cause from repo inspection> |

### Fixes applied
- (Case 1) Edited `<file:line>`—`<one-line change description>`.
- (Case 2a) `updateTestCase` on `<test_case_name>`—set noise on `<path>` OR updated response field `<path>`.
- (Case 2b) `update_mock` on `<mock_name>` (test set `<test_set_id>`) OR `delete_recording` + re-capture via `keploy record` + `keploy upload test-set`.
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

1. Run `keploy record -c "<dev run command>" --sync` via Bash. The `-c` value is the exact command from your pre-flight; `--sync` records test cases synchronously so each curl is captured in order with no race against the next one. Cloud association happens in Phase B3's upload step, not here—`keploy record` itself is the local OSS command and doesn't take `--cloud-app-id`.
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

For **local** validation (dev's laptop) — pass `--cluster` (from Discovery), and start the app yourself via `-c` + `--container-name`:

```bash
keploy cloud replay --app <ns.deployment> --cluster "<cluster_name>" --branch-name <git branch> \
  -c "<dev run command>" --container-name <app container> --disableReportUpload=false
```

For **CI / active-cluster** runs, omit `-c`/`--container-name`/`--disableReportUpload` and let the in-cluster agent run the deployment.

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

- Editing handler code on a Case-2-shaped failure (contract changed intentionally). The test data is what's stale—update it on the branch instead.
- Writing to `main` (any tool that omits `branch_id`). Always branch-first.
- Re-recording to absorb a failure without first reading the diff and deciding the route. Re-record only when Route C applies.
- Inventing a PAT, branch name, or secret value.
````

Save the file and fully restart your editor so the skill / rules / memory entry is available in your next session.

---

## Step 3—Use the two prompts

That's it. From now on, you only ever type one of:

> **"my keploy cloud replay is failing, please analyse and fix it."**

_or, when the failure was in CI:_

> **"the keploy cloud replay pipeline is failing, please analyse and fix it."**

or

> **"Add new keploy tests for my changes."**

What happens behind the scenes for each:

### Prompt A—analyse and fix a failing replay (local or CI)

| Phase | What the agent does                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A0    | Resolve `app_id` from `basename $(pwd)` + `listApps`. Resolve `branch_id` from `git rev-parse --abbrev-ref HEAD` + `create_branch`.                                                                                                                                                                                                                                                                                                                                      |
| A1    | Get a `test_run_id` to fetch the report against. Local form → `listTestReports({appId: app_id, branch_id, status: "FAILED", limit: 5})` and take the most recent run's id. CI form → extract `test_run_id` from the CI log or dashboard URL the dev pasted (falls back to the local lookup with `source: "ci"` if nothing was pasted).                                                                                                                                   |
| A2    | Fetch the full report (`getTestReportFull({appId: app_id, reportId: test_run_id})`). Returns roll-up + every test set + per-test-case `oss_report.req`/`resp`/`result`/`mock_mismatches`/`failure_info`/`noise` in one round-trip. Use `mock_mismatches_only=true` to scope to mock-driven failures on large runs.                                                                                                                                                       |
| A3    | Per failing test case, decide Case 1 (bug in the app—recent commit broke it, test is still correct) or Case 2 (app behavior drifted intentionally—test data is stale, with sub-actions 2a noise / 2a response edit / 2b mock edit / 2b delete + re-record). Decision is from `git log` / `git diff` plus the report's `oss_report.result` diff and `oss_report.mock_mismatches`, never from a dev question.                                                              |
| A4    | For Case 1: announce the file:line and a one-line description, then edit the handler code so the dev can stop the agent if they object. For Case 2a: `updateTestCase` to add noise on a non-deterministic field, or to update the recorded `response` body. For Case 2b: `update_mock` on the affected mock, or—if the baseline is too far gone—`delete_recording` and re-record via Routine B's flow. Either way, re-run `keploy cloud replay --branch-name` to verify. |
| A5    | Report: diagnosis table (case per test case) + fixes applied + next-step-for-you + branch-diff URL + run-report URL.                                                                                                                                                                                                                                                                                                                                                     |

### Prompt B—author new keploy tests

| Phase | What the agent does                                                                                                                                                                                                                                                                                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B0    | Discovery (same as A0).                                                                                                                                                                                                                                                                                                                                                            |
| B1    | `git diff origin/main...HEAD` to find handler files that changed; extract added/modified endpoints.                                                                                                                                                                                                                                                                                |
| B2    | Pre-flight: discover the dev's run command from the repo (Makefile → docker-compose.yml → Procfile → package.json → README), start the app, curl any 200-returning endpoint to confirm it's serving traffic, stop it. Then run `keploy record -c "<dev run command>" --sync`, drive a realistic curl per new endpoint, stop the recorder. Recording lands at `keploy/test-set-N/`. |
| B3    | `keploy upload test-set --app <ns.deployment> --branch <git branch> --test-set keploy/test-set-N --name <descriptive-name>` to land the bundle on the Keploy branch.                                                                                                                                                                                                               |
| B4    | `keploy cloud replay --app <ns.deployment> --cluster "<cluster_name>" --branch-name <git branch> -c "<dev run command>" --container-name <app container> --disableReportUpload=false` to validate locally (drop the local flags in CI / active-cluster). On failure, drop into Routine A.                                                                                                                                                                                                                                                               |
| B5    | Report: captured endpoints table + replay result + next-step (open PR) + branch-diff URL + run-report URL.                                                                                                                                                                                                                                                                         |

For everything not covered by these two prompts—manually inspecting test data, editing one mock, listing recordings—use the manual flow on the [Developer Workflow](/docs/quickstart/k8s-proxy-developer-workflow) page directly. The two-prompt workflow handles the 90% case; the manual flow is the escape hatch.

---

## Putting it together

Here are the typical scenarios the agent handles—one per case it decides between. Every one starts with the same two-prompt UX and ends with the dev pushing once CI catches up. The variable bit is what the agent does in the middle.

### Scenario 1—App regression (Case 1)

You merged a refactor that accidentally broke the price calculation on `/orders/{id}`. The test still expects the right total.

> _"my keploy cloud replay is failing, please analyse and fix it."_

A0 → A1 (latest failed run) → A2 (report shows `total_amount: 0` vs expected `99.99`). A3 sees your recent commit on the price-calc helper and the test's authored response is still correct → **Case 1**. A4 announces the edit at `pkg/order/calc.go:42`—restoring the line-item subtotal branch—then applies the fix and re-runs replay (green). A5 reports the edit + URLs.

### Scenario 2—Test data drift on the response (Case 2a, response edit)

You renamed a response field from `username` to `display_name` on `/users/{id}` on purpose. CI replay now fails because the recorded response still says `username`.

> _"the keploy cloud replay pipeline is failing, please analyse and fix it."_

A3 sees the rename commit and the recorded `oss_report.result.body_result[].expected` still pinned to `username` → **Case 2a**. A4 calls `updateTestCase` to swap the field name on the recorded response, re-runs replay (green). A5 reports the test edit + URLs.

### Scenario 3—Test data drift, non-deterministic field (Case 2a, noise)

The replay started failing on `$.created_at`—a timestamp that differs each run. No code changes near it.

> _"my keploy cloud replay is failing, please analyse and fix it."_

A3 sees the diverging field is genuinely time-varying with no related commit → **Case 2a (noise)**. A4 calls `updateTestCase` to add `$.created_at` to that test case's noise map; replay re-runs green.

### Scenario 4—Mock drift from a DB query change (Case 2b, mock edit)

You added a `discount_percent` column to the orders table and updated the `SELECT` to return it. The handler emits the new field, the test expects it, but the recorded mock for the DB call still has the old shape.

> _"my keploy cloud replay is failing, please analyse and fix it."_

A3 sees the schema-change commit and `mock_mismatches` on the SELECT row → **Case 2b**. A4 calls `update_mock` to add `discount_percent` to the mock spec; replay re-runs green. A5 reports the mock edit + URLs.

### Scenario 5—Mock too far gone, full re-record (Case 2b, fallback)

A downstream gRPC client was swapped for HTTP; the recorded mocks are protobuf bytes that no longer apply.

> _"my keploy cloud replay is failing, please analyse and fix it."_

A3 → **Case 2b**. A4 tries one `update_mock` edit—it doesn't pass. The agent falls back: `delete_recording` on the affected test set, then re-records via Routine B's flow (pre-flight → `keploy record -c "<run cmd>" --sync` → curl → `keploy upload test-set --branch <git branch>`). Replay re-runs green.

### Scenario 6—Adding tests for a new endpoint (Routine B)

You added `POST /coupons/redeem`.

> _"Add new keploy tests for my changes."_

B0 → B1 (`git diff origin/main...HEAD` surfaces the new route). B2 pre-flight: agent finds `make run` in the Makefile, brings the app up, `curl /health` returns 200, stops it. Then `keploy record -c "make run" --sync`, curls `POST /coupons/redeem` with a realistic body, stops the recorder. B3 uploads via `keploy upload test-set --app <ns.deployment> --branch <git branch> --name coupons-redeem`. B4 replay returns 1/1 passed. B5 reports the captured endpoint + URLs.

---

Across every scenario, you only ever spoke one of two sentences. You push your code change (and, for Case 1, the agent's app-side edit). CI replays the branch on the PR; merge runs `keploy cloud branch-merge` and the test data lands on main.

For the same flow done manually (CLI / dashboard, no agent), see [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow).
