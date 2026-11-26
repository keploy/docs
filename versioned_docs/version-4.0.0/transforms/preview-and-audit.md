---
id: preview-and-audit
title: Preview and audit transforms
sidebar_label: Preview and audit
description: Validate keploy.yml transform rules offline, preview redacted before/after JWT claim updates, inspect the embedded JSON Schema, and audit applied_transforms, clock_freeze, and redacted variables in keploy test reports.
tags:
  - transforms
  - audit
  - preview
  - json schema
keywords:
  - keploy transforms list
  - keploy transforms test
  - keploy transforms schema
  - REFUSE_KMS_UNAVAILABLE
  - REFUSE_INVALID_CONFIG
  - transforms audit
---

# Preview and audit transforms

Before replaying a Test Set—or when reviewing a pull request that changes `keploy.yml`—use `keploy transforms list`, `keploy transforms test`, and `keploy transforms schema` to validate every rule offline and inspect which headers each transform modifies.

All three commands are read-only, never mutate your recordings or `keploy.yml`, and are available in the Keploy Enterprise CLI binary.

## List and validate configured transforms

Run `keploy transforms list` from your project root to validate `keploy.yml` against Keploy's embedded schema and guardrails:

```bash
keploy transforms list
```

Verbatim CLI output when `fresh-jwt` is valid and `JWT_SECRET` is exported:

```text
=== KEPLOY NEXT ===
phase:    transforms_configured
summary:  1 transform(s) configured in keploy.yml (not yet verified by a passing replay).
ask:      Preview these transforms against test set manual before replaying?
run:      keploy transforms test --set manual
do:       Run `keploy transforms test --set manual` to dry-run preview every matched place (secrets and signatures are redacted), then replay to verify.
options:
  - preview transforms against manual → keploy transforms test --set manual
  - inspect offline transforms JSON schema → keploy transforms schema
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until phase=transforms_verified or hand back to `keploy test` until verified_green. Hard safety rules: never silently rewrite an expected response value or status code, never loosen matching, and never commit a literal signing key (always use ${secret:NAME}).
===================
```

What `keploy transforms list` checks:

- Config and schema validity (`REFUSE_INVALID_CONFIG` for invalid YAML, unsupported fields, unsupported hook points, piped `extract` expressions, or missing `jwt.resign` step).
- Security guardrails (`REFUSE_LITERAL_KEY`, `REFUSE_ALG_NONE`, `REFUSE_ALG_UNSUPPORTED`, `REFUSE_EXP_CAP`).
- Write-back place grammar validity (`REFUSE_UNKNOWN_PLACE_STEP` for decode pipes such as `|cookie`, `|b64`, or `|pct` in write-back places like `propagate.answer`).
- Duplicate `(at, match, extract)` targets (`REFUSE_DUPLICATE_PLACE`).
- Single source of truth (`keploy.yml`).

If any rule violates a guardrail, `keploy transforms list` exits with code `1`, sets `phase: transforms_invalid`, and prints the exact `REFUSE_*` code and fix in `do:`. Note that `keploy transforms list` validates `keploy.yml` statically from `--path` without loading recorded traffic, whereas `keploy test` resolves `--config-path` first and also validates against recorded Test Cases and Mocks (including `REFUSE_EMPTY_EXTRACT`, `REFUSE_VARIABLE_COLLISION`, and `KEPLOY_PROVEN=1` propagation rules).

Add `--json` to emit the top-level `NextBlock` JSON object (`snake_case` keys, with `transforms.source_of_truth`, `transforms.config_path`, `transforms.transforms[]`, and `transforms.errors[]`):

```bash
keploy transforms list --json
```

## Preview before/after values on a Test Set

Run `keploy transforms test --set <set>` to simulate every transform against your recorded Test Cases without starting your application:

```bash
keploy transforms test --set manual
```

You can narrow the preview to a single Test Case or named transform, explicitly toggle `--freezeTime` (when omitted, `keploy transforms test` reads `test.freezeTime` from `keploy.yml` or falls back to the last run), or request `--json`:

```bash
keploy transforms test --set manual --test test-1
keploy transforms test --set manual --name fresh-jwt
keploy transforms test --set manual --freezeTime --json
```

Verbatim CLI output on set `manual` with `JWT_SECRET` exported:

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

Notice two built-in protections in the preview output:

1. **Redaction:** Signing keys, raw recorded bearer tokens, and newly signed JWT signatures are always redacted in human output, `--json`, and test reports. Only non-sensitive claim metadata (`alg`, `iat`, `exp`) and the secret reference name (`${secret:JWT_SECRET}`) are displayed.
2. **Safe dry-run when env vars are unset:** If `${secret:NAME}` is not exported locally, `keploy transforms test` still previews the claim updates with a placeholder signature and prints a `caveats:` line warning that `NAME` must be exported before running `keploy test` (where an unset secret refuses with `REFUSE_SECRET_UNRESOLVED`).

### Understand encrypted (`ENC:`) recordings

Transforms over encrypted recordings (`record.enableEncryption: true`) are **coming** and are currently refused at load time during `keploy test` (`REFUSE_ENCRYPTED_PROPAGATE_UNSUPPORTED` when `propagate` is set, or `REFUSE_INVALID_CONFIG` otherwise). During offline `keploy transforms test` previews, any `ENC:...`-encrypted header target is refused cleanly with `REFUSE_KMS_UNAVAILABLE` (exit code `1`) rather than treating ciphertext as a plain token.

## Audit transforms in `keploy test` reports

After you run `keploy test`, Keploy's `RedactingReportDB` decorates and redacts every Test Case result in `keploy/reports/test-run-N/<set>-report.yaml` before writing it to disk. (Transforms run strictly during `keploy test`; configuring `transforms:` is refused under `keploy cloud replay` and `keploy mock replay`.)

Report excerpt re-rendered from `keploy/reports/test-run-1/manual-report.yaml` of a passing `KEPLOY_PROVEN=1` run (`test-1` with `fresh-jwt`, active clock freeze, and `propagate.targets`):

```yaml
test_case_id: test-1
status: PASSED
req:
  header:
    Authorization: "[REDACTED]"
applied_transforms:
  - name: fresh-jwt
    at: test.request
    place: header.Authorization
    function: jwt.resign
    signing_mode: secret
    secret_ref: ${secret:JWT_SECRET}
    summary: re-signed HS256 JWT (iat=1756285235, exp=1756288835)
clock_freeze:
  active: true
  instant: 2025-08-27 09:00:35+00:00
variables:
  - name: declared:fresh-jwt
    value: "[REDACTED]"
    recorded: "[REDACTED]"
    mock: test case test-1
    place: header.Authorization
    given: true
    sensitive: true
```

What each report section records:

- **`applied_transforms`:** Records `name`, `at` (`test.request`), `place` (`header.<Name>`), `function` (`jwt.resign`), `signing_mode` (`secret`), `secret_ref` (such as `${secret:JWT_SECRET}`), and a redacted `summary`.
- **`clock_freeze`:** Derived from the agent's time-freeze verification state, the replay clock window reader, and the recorded request timestamp (`active: true` or `false`, plus frozen `instant` truncated to the second when unwindowed). Under `KEPLOY_PROVEN=1`, `keploy test` enforces clock freeze on by default even if `--freezeTime=false` is passed, so `clock_freeze.active` is `true` whenever freeze verification succeeds and the Test Case has no `real:` list.
- **Redacted `req`, `variables`, and `failure_info`:** Sensitive request headers (`Authorization`, etc.), `TestResult.Variables` entries (`sensitive: true` with `value` and `recorded` set to `'[REDACTED]'` and `wordRun` / `wordRunRecorded` cleared), and any unmatched-call diffs are scrubbed before persisting the report YAML.
- **Runtime refusals (`TEST_CASE_REFUSED`):** If a Test Case fails transform execution at runtime (for example, a malformed recorded JWT emitting `REFUSE_MALFORMED_JWT`), its `failure_info.category` records `TEST_CASE_REFUSED` and the request is never sent to your application.

When all Test Cases pass with one or more active transforms, `keploy transforms list` reports `phase: transforms_verified`, and `keploy test` prints a `caveats:` line naming the applied transforms so code reviewers can audit them directly in CI logs.

## Inspect the embedded JSON Schema offline

Print the Draft 2020-12 JSON Schema for the `transforms:` block locally from the binary:

```bash
keploy transforms schema
```

Use `keploy transforms schema` to wire IDE autocomplete (YAML Language Server in VS Code or IntelliJ) or to validate `keploy.yml` in a pre-commit hook or CI lint step:

```bash
keploy transforms schema > .keploy/transforms.schema.json
```

## Self-hosted and air-gapped

Previewing and auditing transforms works locally in isolated environments:

- **Offline CLI commands:** `keploy transforms schema`, `keploy transforms list`, and `keploy transforms test` run locally without a Keploy API server. Set `DO_NOT_TRACK=1` (or `disableTele: true` in `keploy.yml`) and `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Telemetry and self-hosted `keploy test`:** Set `disableTele: true` in `keploy.yml` (or export `DO_NOT_TRACK=1`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1`. For self-hosted `keploy test` runs, authenticate against your cluster with `--k8s-proxy-url` or `KEPLOY_K8S_PROXY_URL` (or `keploy login --k8s-proxy-url <url>`—sign-in checks the flag, environment variable, or saved login before `keploy.yml` is loaded; or use a self-hosted Keploy Enterprise binary built for your internal API server) and set `test.disableReportUpload: true` in `keploy.yml` to keep test reports strictly on disk.
- **Customer secrets:** Audit logs, `--debug` logs, `--json` output, reports, and previews never print values from `${secret:NAME}` or freshly re-signed tokens.
- **Upgrades:** Add `keploy transforms list --json` to your CI pipeline so any schema or guardrail changes after upgrading the Keploy Enterprise CLI are caught immediately.

## Related

- [Understand replay transforms](./overview.md)
- [Re-sign expired JWTs during replay](./how-to-resign-jwt.md)
- [Drive transforms and virtual services with coding agents](./coding-agents.md)
- [Transforms reference](./reference.md)
