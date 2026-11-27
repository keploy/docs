---
id: coding-agents
title: Drive transforms and virtual services with coding agents
sidebar_label: Coding agents
description: How Claude Code, Cursor, Codex, and other coding agents drive Keploy Replay Transforms and standalone plain-HTTP Virtual Services deterministically using KEPLOY NEXT blocks, top-level --json, stable exit codes, and offline embedded schemas—with zero LLM calls inside Keploy.
tags:
  - transforms
  - virtual services
  - ai agents
  - coding agents
  - KEPLOY NEXT
keywords:
  - coding agents
  - KEPLOY NEXT
  - AGENTS.md
  - claude code
  - cursor
  - llm_diagnose
  - keploy transforms schema
  - keploy vs schema
---

# Drive transforms and virtual services with coding agents

Coding agents such as Claude Code, Cursor, Codex, GitHub Copilot, and Antigravity can configure Replay Transforms and operate standalone Virtual Services directly from the terminal using the Keploy Enterprise CLI. No custom integration or MCP server is required.

:::important No LLM calls inside Keploy or CI
**Keploy's CLI, Replay Transforms runtime, Virtual Services runtime, and CI checks never call an LLM.** Every failure diagnosis, JWT check, transform preview, and Virtual Service miss explanation is 100% deterministic and computed from recorded evidence and runtime counters.

When a failure cannot be classified deterministically—for example, a real application regression returning HTTP `500`—Keploy emits `remedy: llm_diagnose`. That code does **not** invoke a model inside Keploy; it explicitly hands judgment back to the developer (or the developer's own coding agent) to inspect the application code and diff.
:::

## Understand the agent contract

Every `keploy transforms`, `keploy mock serve`, and `keploy vs` command follows the same machine-readable and human-readable contract:

1. **`=== KEPLOY NEXT ===` blocks (primary path):** Every command prints a structured NEXT block with `phase`, `summary`, optional `failures` and `caveats`, `ask`, `run`, `do`, `options`, and a flow-specific `protocol` line. Commands printed in `run:` and `options:` are shell-quoted literally so an agent can execute them verbatim.
2. **Top-level `--json`:** Passing `--json` to any one-shot command emits the `NextBlock` JSON object directly at the top level (`snake_case` keys throughout, with `transforms` or `vs` payloads). Foreground `keploy mock serve --json` emits compact single-line NDJSON objects (one ready event, then one shutdown summary event).
3. **Stable exit codes:** Agents branch on Keploy's exit codes plus `phase` and structured `errors[].code`:

| Exit code | Meaning                      | Typical Transforms / Virtual Services outcome                                                                                                                                                                                           |
| --------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`       | Success                      | Clean `transforms list`, `transforms test`, `transforms schema`, `vs inspect`, `vs explain-miss` (with 0 or more misses), `vs reset`, `vs stop` (when 0 misses or `--on-miss` is not `fail`), `vs schema`, or `--detach` ready          |
| `1`       | Keploy error or test failure | `REFUSE_*` config refusal (`phase: transforms_invalid` or `vs_invalid`), replay test failures (`TEST_CASE_REFUSED` or assertion diff), `mock serve --on-miss fail` or `vs stop` with misses, or runtime/bind errors (`phase: vs_error`) |
| `5`       | Authentication required      | Missing or expired Keploy authentication session when running `keploy test`                                                                                                                                                             |
| `8`       | Usage error                  | Unknown subcommand, invalid flag, or wrong argument count                                                                                                                                                                               |

4. **Embedded offline JSON Schemas:** Agents can inspect the exact config contracts offline at any time with `keploy transforms schema` and `keploy vs schema`.

## Follow a worked agent session

This walkthrough shows verbatim `=== KEPLOY NEXT ===` outputs from a live session where a coding agent diagnoses expired-JWT `401` failures, previews a `jwt.resign` transform, verifies a green replay (plus anti-loop and regression checks), and operates a standalone plain-HTTP Virtual Service.

### Step 1: Agent checks the red `keploy test` run

Without transforms, both recorded tests fail with HTTP `401` (`ImmatureSignatureError`), and Keploy emits `remedy: transform_jwt_resign`:

```text
=== KEPLOY NEXT ===
phase:    verified_red
summary:  2 of 2 test(s) failed. See the per-failure diff + remedy hints below.
failures:
  - test-1: status (status_code expected=200 got=401)  [remedy: transform_jwt_resign → keploy transforms test --set manual]
      FIX: JWT has future iat/nbf relative to recorded timestamp (alg=HS256, iat=2025-08-28T15:15:41Z, exp=2025-08-28T16:15:41Z, recorded_ts=2025-08-27T09:00:35Z) so --freezeTime alone causes ImmatureSignatureError. Add this jwt.resign transform to keploy.yml:
transforms:
  - name: fresh-jwt
    at: test.request
    match: { kind: Http, path: /api/v1/** }
    extract: header.Authorization
    steps:
      - bearer
      - jwt.resign:
          key: ${secret:<ENV_VAR_WITH_HS_KEY>}
          alg: recorded
          claims: { iat: now, exp: now+1h }
  - test-2: status (status_code expected=200 got=401)  [remedy: transform_jwt_resign → keploy transforms test --set manual]
      FIX: JWT has future iat/nbf relative to recorded timestamp (alg=HS256, iat=2025-08-28T15:15:41Z, exp=2025-08-28T16:15:41Z, recorded_ts=2025-08-27T09:00:40Z) so --freezeTime alone causes ImmatureSignatureError. Add this jwt.resign transform to keploy.yml:
transforms:
  - name: fresh-jwt
    at: test.request
    match: { kind: Http, path: /api/v1/** }
    extract: header.Authorization
    steps:
      - bearer
      - jwt.resign:
          key: ${secret:<ENV_VAR_WITH_HS_KEY>}
          alg: recorded
          claims: { iat: now, exp: now+1h }
ask:      Want me to investigate and fix the failing test(s)?
run:      keploy transforms test --set manual
do:       Noise was calibrated at record time, so these are most likely real diffs, not flakiness — do NOT blanket-mark them as noise. For each failure: read the failing test YAML, its mocks, the handler source, and the git diff. Apply the remedy hint if confident — re-record (stale mocks), configure `transforms:` in keploy.yml (see JWT fix below), or edit the expected value (a change that matches a deliberate code edit). Only add a field to `noise` if its value actually differs between two back-to-back `keploy test` runs; a field that fails with the SAME value every run is a real diff. NEVER silently rewrite an expected value to force a red test green: if a change has no matching code edit, treat it as a real regression and surface it to the dev. Re-run `keploy test` to confirm. JWT TRANSFORM FIX: add this snippet to keploy.yml and run `keploy transforms test --set manual`:
transforms:
  - name: fresh-jwt
    at: test.request
    match: { kind: Http, path: /api/v1/** }
    extract: header.Authorization
    steps:
      - bearer
      - jwt.resign:
          key: ${secret:<ENV_VAR_WITH_HS_KEY>}
          alg: recorded
          claims: { iat: now, exp: now+1h }
options:
  - re-record (only after each failure's regression check) → keploy record -c 'LD_PRELOAD=/tmp/keploy_freeze_time_amd64.so KEPLOY_TIME_FILE=/tmp/kclk18680934/t python3 /tmp/transforms-vserve-e2e-switchoff/app/app.py' --metadata 'name=<descriptive-name>'
  - re-run after a fix → keploy test -c 'LD_PRELOAD=/tmp/keploy_freeze_time_amd64.so KEPLOY_TIME_FILE=/tmp/kclk18680934/t python3 /tmp/transforms-vserve-e2e-switchoff/app/app.py' --mappings
  - this repo also has 1 Keploy recording(s) for its own test suite → keploy mock status
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until the suite rests green — phase=verified_green (or ci_wired once CI is set up). phase=verified_empty is not a resting phase: the run scored nothing, so fix the run and repeat it — never report it as green and never wire CI off it. A green carrying `caveats` is not a clean bill of health either: read them before reporting success. Never silently rewrite an expected value to make a red test pass.
===================
```

### Step 2: Developer approves; agent edits `keploy.yml` and runs preview

The agent relays `ask` to the developer. After approval, the agent adds `fresh-jwt` to `keploy.yml` (referencing `${secret:JWT_SECRET}`, plus `propagate.targets` when running under `KEPLOY_PROVEN=1`) and runs `keploy transforms test --set manual`:

```text
=== KEPLOY NEXT ===
phase:    transforms_configured
summary:  Dry-run succeeded on set manual: 2 preview(s) across 1 transform(s).
previews:
  - test-1 [fresh-jwt test.request] header.Authorization: JWT(alg=HS256, iat=1756394141, exp=1756397741, sig=<redacted>) -> JWT(alg=HS256, iat=1795752363, exp=1795755963, sig=<re-signed>) (re-signed with ${secret:JWT_SECRET})
  - test-2 [fresh-jwt test.request] header.Authorization: JWT(alg=HS256, iat=1756394141, exp=1756397741, sig=<redacted>) -> JWT(alg=HS256, iat=1795752363, exp=1795755963, sig=<re-signed>) (re-signed with ${secret:JWT_SECRET})
ask:      Dry-run preview looks clean. Replay the suite with these transforms active?
run:      keploy test -c '<your app start command>' --mappings
do:       Review the redacted before/after preview lines above (and any caveats such as unset `${secret:...}` env vars). If everything matches expectations, run `keploy test -c '<your app start command>' --mappings` to verify the suite.
options:
  - replay with transforms active → keploy test -c '<your app start command>' --mappings
  - list configured transforms → keploy transforms list
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until phase=transforms_verified or hand back to `keploy test` until verified_green. Hard safety rules: never silently rewrite an expected response value or status code, never loosen matching, and never commit a literal signing key (always use ${secret:NAME}).
===================
```

### Step 3: Agent replays and verifies green (with anti-loop and regression safety)

After approval, the agent runs `keploy test`. Both Test Cases pass (`2/2` passed, `0` failed, exit `0`) in both default mode and `KEPLOY_PROVEN=1` mode:

```text
=== KEPLOY NEXT ===
phase:    verified_green
summary:  All 2 test(s) passed across 1 test-set(s). Suite is green and dependency-free.
caveats:
  - Transforms were applied during this run (fresh-jwt across 2 test(s)); passing assertions reflect the transformed requests/mocks (expected responses were never modified).
ask:      Want me to (a) cover another resource, (b) wire CI so this runs on every PR, or (c) stop here?
do:       If wiring CI: the green run already auto-uploaded the mocks to the Keploy registry; CI fetches them by the hash stored in each test-set's config.yaml (KEPLOY_API_KEY required in CI). Commit tests/, seed.sh, and config.yaml — NEVER commit mocks.yaml (huge; keploy gitignores it on purpose — do not remove that ignore). The CI job: check out; install Keploy (`keploy_rc=0; keploy_sh="$(mktemp)" && curl -fsSL https://keploy.io/install.sh -o "$keploy_sh" && bash "$keploy_sh" -isCI || keploy_rc=$?; rm -f "$keploy_sh"; case "$(uname -s)" in Darwin) PATH="$HOME/.keploy/bin:$PATH"; export PATH ;; esac; [ "$keploy_rc" -eq 0 ]`); export KEPLOY_API_KEY from a CI secret; run `keploy test -c '<your app start command>' --mappings` with KEPLOY_INVOKER=ci so a missing session fails fast instead of waiting on a browser login. keploy.yml names no app command: in the job, put the command that starts the app -- the -c the green run was given -- where it says <your app start command>.
options:
  - cover another resource → keploy record -c '<your app start command>' --metadata 'name=<descriptive-name>'
  - wire CI: add a job that installs keploy and runs `keploy test` on every PR (see do:)
  - stop
  - this repo also has 1 Keploy recording(s) for its own test suite → keploy mock status
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until the suite rests green — phase=verified_green (or ci_wired once CI is set up). phase=verified_empty is not a resting phase: the run scored nothing, so fix the run and repeat it — never report it as green and never wire CI off it. A green carrying `caveats` is not a clean bill of health either: read them before reporting success. Never silently rewrite an expected value to make a red test pass.
===================
```

If `JWT_SECRET` had been exported with the wrong secret and the app still returned `401` after `fresh-jwt` ran, Keploy reads `applied_transforms` from the test report and emits `remedy: transform_jwt_mismatch` instead of suggesting another `jwt.resign`—preventing infinite agent loops:

```text
=== KEPLOY NEXT ===
phase:    verified_red
summary:  2 of 2 test(s) failed. See the per-failure diff + remedy hints below.
failures:
  - test-1: status (status_code expected=200 got=401)  [remedy: transform_jwt_mismatch]
      FIX: Transform "fresh-jwt" already re-signed this JWT (secret reference ${secret:JWT_SECRET}) and the app still returned 401: verify that secret reference ${secret:JWT_SECRET} matches the app's JWT_SECRET and check claim overrides (do NOT add another jwt.resign).
  - test-2: status (status_code expected=200 got=401)  [remedy: transform_jwt_mismatch]
      FIX: Transform "fresh-jwt" already re-signed this JWT (secret reference ${secret:JWT_SECRET}) and the app still returned 401: verify that secret reference ${secret:JWT_SECRET} matches the app's JWT_SECRET and check claim overrides (do NOT add another jwt.resign).
ask:      Want me to investigate and fix the failing test(s)?
do:       Noise was calibrated at record time, so these are most likely real diffs, not flakiness — do NOT blanket-mark them as noise. For each failure: read the failing test YAML, its mocks, the handler source, and the git diff. Apply the remedy hint if confident — re-record (stale mocks), configure `transforms:` in keploy.yml (see JWT fix below), or edit the expected value (a change that matches a deliberate code edit). Only add a field to `noise` if its value actually differs between two back-to-back `keploy test` runs; a field that fails with the SAME value every run is a real diff. NEVER silently rewrite an expected value to force a red test green: if a change has no matching code edit, treat it as a real regression and surface it to the dev. Re-run `keploy test` to confirm. JWT MISMATCH: Transform "fresh-jwt" already re-signed this JWT (secret reference ${secret:JWT_SECRET}) and the app still returned 401: verify that secret reference ${secret:JWT_SECRET} matches the app's JWT_SECRET and check claim overrides (do NOT add another jwt.resign).
options:
  - re-record (only after each failure's regression check) → keploy record -c '<your app start command>' --metadata 'name=<descriptive-name>'
  - re-run after a fix → keploy test -c '<your app start command>' --mappings
  - this repo also has 1 Keploy recording(s) for its own test suite → keploy mock status
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until the suite rests green — phase=verified_green (or ci_wired once CI is set up). phase=verified_empty is not a resting phase: the run scored nothing, so fix the run and repeat it — never report it as green and never wire CI off it. A green carrying `caveats` is not a clean bill of health either: read them before reporting success. Never silently rewrite an expected value to make a red test pass.
===================
```

And if a code change introduces a real application regression (for example, returning HTTP `500`), Keploy reports `remedy: llm_diagnose` so the agent inspects the application code instead of touching `keploy.yml`:

```text
=== KEPLOY NEXT ===
phase:    verified_red
summary:  2 of 2 test(s) failed. See the per-failure diff + remedy hints below.
failures:
  - test-1: status (status_code expected=200 got=500)  [remedy: llm_diagnose]
  - test-2: status (status_code expected=200 got=500)  [remedy: llm_diagnose]
ask:      Want me to investigate and fix the failing test(s)?
do:       Noise was calibrated at record time, so these are most likely real diffs, not flakiness — do NOT blanket-mark them as noise. For each failure: read the failing test YAML, its mocks, the handler source, and the git diff. Apply the remedy hint if confident — re-record (stale mocks), `--freezeTime` (auth/time expiry), or edit the expected value (a change that matches a deliberate code edit). Only add a field to `noise` if its value actually differs between two back-to-back `keploy test` runs; a field that fails with the SAME value every run is a real diff. NEVER silently rewrite an expected value to force a red test green: if a change has no matching code edit, treat it as a real regression and surface it to the dev. Re-run `keploy test` to confirm.
options:
  - re-record (only after each failure's regression check) → keploy record -c '<your app start command>' --metadata 'name=<descriptive-name>'
  - re-run after a fix → keploy test -c '<your app start command>' --mappings
  - this repo also has 1 Keploy recording(s) for its own test suite → keploy mock status
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until the suite rests green — phase=verified_green (or ci_wired once CI is set up). phase=verified_empty is not a resting phase: the run scored nothing, so fix the run and repeat it — never report it as green and never wire CI off it. A green carrying `caveats` is not a clean bill of health either: read them before reporting success. Never silently rewrite an expected value to make a red test pass.
===================
```

### Step 4: Drive a standalone Virtual Service in the same session

When the agent starts a standalone plain-HTTP Virtual Service for consumer tests, it uses `--detach` so the command returns immediately once `/readyz` succeeds, checks misses with `keploy vs explain-miss`, and stops it cleanly with `keploy vs stop`:

```bash
keploy mock serve -f downstream-vs.yaml --detach \
  --on-miss fail --admin 127.0.0.1:19911 \
  --misses-file /tmp/transforms-vserve-e2e-switchoff/vs-misses.json
```

Verbatim `vs_serving` output:

```text
=== KEPLOY NEXT ===
phase:    vs_serving
summary:  Virtual service "downstream-vs-cli" is serving (2 mocks loaded, 0 request(s) served, 0 miss(es)).
do:       Drive consumer traffic against the bound listener(s), then check misses with `keploy vs explain-miss --admin http://127.0.0.1:19911` or stop with `keploy vs stop --admin http://127.0.0.1:19911`.
options:
  - inspect recorded misses → keploy vs explain-miss --admin http://127.0.0.1:19911
  - reset cursors and counters → keploy vs reset --admin http://127.0.0.1:19911
  - stop virtual service cleanly → keploy vs stop --admin http://127.0.0.1:19911
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until phase=vs_clean (after serving >=1 request with 0 misses) or phase=vs_serving (when detached and ready); stop a detached virtual service with `keploy vs stop --admin <url>`. Never fabricate a 200 response for an unrecorded route.
===================
```

After driving consumer tests, the agent checks misses with `keploy vs explain-miss --admin http://127.0.0.1:19911` and shuts down cleanly with `keploy vs stop --admin http://127.0.0.1:19911`. When `--on-miss fail` is set and any miss occurred, `keploy vs stop` prints `phase: vs_misses_detected`, flushes the miss log, prints `run: keploy vs explain-miss --file <misses_file>`, and exits `1`.

## Drop an `AGENTS.md` snippet into your repository

Copy the snippet below into your repository's `AGENTS.md` (or `.claude/CLAUDE.md` / `.cursor/rules/`) so every coding agent follows Keploy's NEXT protocol safely:

```markdown
## Keploy Replay Transforms and Virtual Services

- Drive Keploy through the CLI and follow every `=== KEPLOY NEXT ===` block (`phase`, `summary`, `failures`, `ask`, `run`, `do`, `options`, `protocol`). Use `--json` when parsing structured output.
- Relay every `ask:` to the user verbatim before running `run:`.
- Inspect config schemas offline with `keploy transforms schema` and `keploy vs schema`.
- Never commit literal secrets or keys in `keploy.yml`—always use `${secret:NAME}` (`${env:NAME}` and `${file:path}` are coming).
- Never edit recorded Test Cases, expected status codes, expected response bodies, or Mock files by hand to make a red test green.
- Always launch standalone Virtual Services with `--detach` (and `--ready-file <path>` when capturing metadata) and shut them down with `keploy vs stop --admin <url>` when finished.
- Note that `keploy vs explain-miss` is read-only and exits `0` even when misses are found; inspect `phase` (`vs_clean`, `vs_serving`, `vs_misses_detected`) and `failures:`.
- Keploy never calls an LLM internally. When a NEXT block reports `remedy: llm_diagnose`, inspect the application code and diff yourself.
```

## Self-hosted and air-gapped

Coding-agent workflows work in isolated environments:

- **Offline CLI commands and embedded schemas:** Because Keploy never calls an LLM and embeds its Draft 2020-12 schemas (`keploy transforms schema` and `keploy vs schema`) directly inside the binary, `keploy transforms list|test|schema`, `keploy mock serve`, and `keploy vs` run locally without a Keploy API server. Export `DO_NOT_TRACK=1` (or set `disableTele: true` in `keploy.yml`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Telemetry and self-hosted `keploy test` config:** Set `disableTele: true` in `keploy.yml` (or export `DO_NOT_TRACK=1`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1`. For self-hosted `keploy test` runs, authenticate against your cluster with `--k8s-proxy-url` or `KEPLOY_K8S_PROXY_URL` (or `keploy login --k8s-proxy-url <url>`—sign-in checks the flag, environment variable, or saved login before `keploy.yml` is loaded; or use a self-hosted Keploy Enterprise binary built for your internal API server) and set `test.disableReportUpload: true` in `keploy.yml` as needed.
- **Containerized Virtual Services:** Package your Keploy Enterprise binary into a minimal container image using the inline `Dockerfile` in [Run a virtual service from recordings](../virtual-services/serve-from-recordings.md) and pass `--build-arg BASE_IMAGE=<your-mirror>/debian:13-slim` in air-gapped networks.
- **Customer secrets and admin tokens:** Keep signing secrets in `${secret:NAME}` and non-loopback Virtual Service admin tokens (`>= 16` characters) in `KEPLOY_VS_ADMIN_TOKEN`. Keploy omits secret values and admin tokens from printed `run:` lines and NEXT blocks.
- **Upgrades:** After upgrading the Keploy Enterprise CLI, re-export `keploy transforms schema` and `keploy vs schema` and review your repository's `AGENTS.md` snippet against any new flags or fields.

## Related

- [Use the Universal Mocker with a coding agent](../universal-mocker/guides/coding-agents.md)
- [Operate UI capture from an AI agent](../ui-capture/agents.md)
- [Preview and audit transforms](./preview-and-audit.md)
- [Operate and troubleshoot virtual services](../virtual-services/admin-api-and-troubleshooting.md)
- [Transforms reference](./reference.md)
- [Virtual service specification reference](../virtual-services/reference.md)
