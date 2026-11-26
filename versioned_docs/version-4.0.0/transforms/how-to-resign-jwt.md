---
id: how-to-resign-jwt
title: Re-sign expired JWTs during replay
sidebar_label: Re-sign expired JWTs
description: Step-by-step walkthrough to re-sign expired or rotated HS256, HS384, and HS512 JWTs during keploy test, including KEPLOY_PROVEN=1 propagate.targets, --freezeTime compatibility, and anti-loop protection.
tags:
  - transforms
  - jwt
  - replay
keywords:
  - jwt resign
  - expired jwt replay
  - KEPLOY_PROVEN
  - keploy transforms test
  - ImmatureSignatureError
---

# Re-sign expired JWTs during replay

When you replay recorded API traffic after a token expires—or in an environment with a rotated signing key—your application rejects authenticated requests with HTTP `401 Unauthorized` before business logic runs.

This walkthrough shows how to diagnose a JWT `401` failure during `keploy test`, add an HS256/HS384/HS512 `jwt.resign` transform to `keploy.yml`, preview it offline, and replay cleanly in both default and `KEPLOY_PROVEN=1` modes. Replay Transforms are available in the Keploy Enterprise CLI binary.

## Diagnose the JWT failure

Consider an order API recorded in test set `manual` (`test-1` for `GET /api/v1/orders/ord-101` and `test-2` for `GET /api/v1/orders/ord-202`), where the service validates an HS256 `Authorization: Bearer ...` token and forwards it to a downstream HTTP dependency (`downstream.local`).

The recorded requests carry timestamps `2025-08-27T09:00:35.5Z` and `2025-08-27T09:00:40.5Z` (truncated to `2025-08-27T09:00:35Z` and `2025-08-27T09:00:40Z` when frozen), while the recorded JWT has `iat=2025-08-28T15:15:41Z` (after the recorded request timestamp). Running `keploy test` with `--freezeTime` alone causes the verifier to reject both tokens with `401` (`ImmatureSignatureError: iat in the future`), and Keploy prints a deterministic `transform_jwt_resign` remedy:

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

## Add a `jwt.resign` transform to `keploy.yml`

Add a `transforms:` block to `keploy.yml` that extracts `header.Authorization`, strips the `Bearer ` prefix with the `bearer` codec, and re-signs the token with `${secret:JWT_SECRET}`:

```yaml
transforms:
  - name: fresh-jwt
    at: test.request
    match:
      kind: Http
      path: /api/v1/**
    extract: header.Authorization
    steps:
      - bearer
      - jwt.resign:
          key: ${secret:JWT_SECRET}
          keyEncoding: raw
          alg: recorded
          claims:
            iat: now
            exp: now+1h
```

When replaying under `KEPLOY_PROVEN=1` and your application forwards `Authorization` to plaintext downstream HTTP Mocks, `propagate.targets` is **required** so the downstream Mock matches the newly signed header. `REFUSE_PROPAGATE_REQUIRES_PROVEN` fires in two cases:

1. **With `KEPLOY_PROVEN` off (default):** configuring `propagate.targets[].use` for a header outside the switch-off ignored header set—the five credential headers (`Authorization`, `Proxy-Authorization`, `Cookie`, `X-Api-Key`, `X-Auth-Token`) plus Keploy's built-in flaky/transport headers (`models.FlakyHeaders`, such as `X-Request-Id`, `traceparent`, `Date`, `Idempotency-Key`, and `X-Csrf-Token`)—is refused at load time.
2. **With `KEPLOY_PROVEN=1`:** omitting `propagate` when recorded downstream HTTP Mocks carry the rewritten header is refused at load time.

```yaml
transforms:
  - name: fresh-jwt
    at: test.request
    match:
      kind: Http
      path: /api/v1/**
    extract: header.Authorization
    steps:
      - bearer
      - jwt.resign:
          key: ${secret:JWT_SECRET}
          alg: recorded
          claims:
            iat: now
            exp: now+1h
    propagate:
      targets:
        - match:
            kind: Http
            host: downstream.local
          use:
            - header.Authorization
```

Key details of this configuration:

- **Secret references only:** `key` must reference `${secret:NAME}` (default `raw` UTF-8 key encoding; `keyEncoding: base64|hex`, `${env:NAME}`, and `${file:path}` are coming and refused at load time with `REFUSE_INVALID_CONFIG`). Keploy refuses literal keys (`REFUSE_LITERAL_KEY`), `alg: none` (`REFUSE_ALG_NONE`), unsupported algorithms such as `RS256` or `PS256` (`REFUSE_ALG_UNSUPPORTED`), and `exp` deltas exceeding `expCap` (`REFUSE_EXP_CAP`, default `24h`).
- **Host normalization:** `host: downstream.local` matches both `downstream.local` and `downstream.local:8081`.
- **Whole-place propagation:** Always propagate whole `header.Authorization` (never a decoded sub-token) so Keploy binds the complete `"Bearer <recorded>"` header to `"Bearer <re-signed>"`.
- **Plaintext recordings only:** Transforms over encrypted recordings (`record.enableEncryption: true`) are coming and are refused at load time (`REFUSE_ENCRYPTED_PROPAGATE_UNSUPPORTED` when `propagate` is set, or `REFUSE_INVALID_CONFIG` otherwise).
- **Selective mock attachment:** Keploy attaches the declared variable only to matched Mocks that actually contain `header.Authorization`, so unauthenticated endpoints continue matching cleanly.

:::note Asymmetric JWTs (`RS*`, `ES*`, `EdDSA`)
Symmetric HMAC (`HS256`, `HS384`, `HS512`) signing is available now. Asymmetric `jwks-swap` mode for `RS*`, `ES*`, and `EdDSA` tokens is coming in a future release.
:::

## Preview the transform offline

Export `JWT_SECRET` (matching the key your application verifies) and preview the transform offline with `keploy transforms test`:

```bash
export JWT_SECRET="your-app-jwt-secret"
keploy transforms test --set manual
```

Verbatim CLI output:

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

If `JWT_SECRET` is not yet exported, `keploy transforms test` still previews the decoded claim updates with a placeholder signature and prints a `caveats:` line reminding you to export `JWT_SECRET` before running `keploy test`. Neither the signing secret nor the freshly minted signature bytes are ever printed or written to reports.

## Replay in default and `KEPLOY_PROVEN=1` modes

Run `keploy test` with your application command:

```bash
keploy test -c "python3 app.py" --freezeTime --test-sets manual
```

Or run with strict per-test dependency verification (`KEPLOY_PROVEN=1`):

```bash
KEPLOY_PROVEN=1 keploy test -c "python3 app.py" --freezeTime --test-sets manual
```

Verbatim `verified_green` output when all Test Cases pass with the active transform:

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

### Understand clock freeze behavior

- **Default mode with `--freezeTime`:** Keploy combines the agent's time-freeze verification state, the replay clock window reader, and the recorded request timestamp. When freeze verification succeeds, `clock_freeze.active` is `true` and `jwt.resign` signs `iat: now` and `exp: now+1h` against the active frozen instant (the replay clock window floor, or the recorded request timestamp truncated to the second).
- **Default mode with `--freezeTime=false`:** `clock_freeze.active` is `false` and `jwt.resign` signs against the wall clock.
- **`KEPLOY_PROVEN=1` mode:** `keploy test` enforces clock freeze on by default—even when `--freezeTime=false` is passed—so `clock_freeze.active` reports `true` (and `jwt.resign` aligns with the frozen clock) whenever freeze verification succeeds and the Test Case has no `real:` list. If freeze verification fails or the Test Case declares a `real:` list, `clock_freeze.active` is `false` and `now` uses the wall clock.

## Verify safety: wrong secrets, regressions, and malformed tokens

Three guardrails ensure transforms never hide bugs:

1. **Wrong secret anti-loop (`transform_jwt_mismatch`):** If `JWT_SECRET` does not match the secret your application verifies, the app still returns `401`. Keploy checks `applied_transforms` in the report and emits `remedy: transform_jwt_mismatch` instructing you to verify `${secret:JWT_SECRET}` rather than adding a duplicate transform.
2. **Real regressions stay red (`llm_diagnose`):** Transforms never rewrite expected HTTP status codes or bodies. If your handler returns HTTP `500` or a wrong payload, `keploy test` fails with `remedy: llm_diagnose`.
3. **Malformed tokens fail unsent (`TEST_CASE_REFUSED`):** If a recorded Test Case contains a malformed `Authorization` value that cannot be parsed as a JWT, Keploy marks that Test Case `TEST_CASE_REFUSED` and **never sends the request to your application**, while valid sibling Test Cases still run.

## Self-hosted and air-gapped

JWT re-signing runs locally inside the Keploy Enterprise CLI:

- **Offline preview and telemetry opt-outs:** `keploy transforms list`, `keploy transforms test`, and `keploy transforms schema` run locally without a Keploy API server. Export `DO_NOT_TRACK=1` (or set `disableTele: true` in `keploy.yml`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Self-hosted `keploy test` configuration:** Authenticate against your self-hosted cluster with `--k8s-proxy-url` or `KEPLOY_K8S_PROXY_URL` (or `keploy login --k8s-proxy-url <url>`—sign-in checks the flag, environment variable, or saved login before `keploy.yml` is loaded; or use a self-hosted Keploy Enterprise binary built for your internal API server) and set `test.disableReportUpload: true` in `keploy.yml` if you want reports kept strictly on local disk.
- **Customer secrets:** Supply symmetric signing keys through CI secret environment variables (`${secret:NAME}`). In Kubernetes CI runners, inject those environment variables from your own Kubernetes Secrets.
- **Upgrades:** After upgrading the Keploy Enterprise CLI binary, run `keploy transforms test --set <set>` offline to verify all signing rules before running CI.

## Related

- [Understand replay transforms](./overview.md)
- [Preview and audit transforms](./preview-and-audit.md)
- [Drive transforms and virtual services with coding agents](./coding-agents.md)
- [Transforms reference](./reference.md)
