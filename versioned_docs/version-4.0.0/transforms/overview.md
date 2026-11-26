---
id: overview
title: Understand replay transforms
sidebar_label: Overview
description: Declarative replay transforms re-sign expired or rotated HS256, HS384, and HS512 JWTs in HTTP test request headers during keploy test without editing recorded files or loosening assertions.
tags:
  - transforms
  - replay
  - jwt
  - universal mocker
keywords:
  - replay transforms
  - keploy transforms
  - jwt resign
  - keploy.yml transforms
  - self-hosted replay
---

# Understand replay transforms

**Replay Transforms** are declarative rules in `keploy.yml` that rewrite recorded HTTP test request headers during `keploy test`—specifically re-signing expired or rotated HMAC JSON Web Tokens (JWTs) with `jwt.resign`—without mutating your recorded Test Cases or Mocks on disk.

Replay Transforms are available in the Keploy Enterprise CLI binary; open-source `keploy` does not include the `transforms` command.

When you record traffic in one environment or weeks earlier, replaying those recordings later often fails for legitimate authentication reasons:

- A recorded HS256, HS384, or HS512 bearer token expired (`exp` is in the past).
- The token's `iat` claim is later than the recorded request timestamp, so `--freezeTime` alone triggers `ImmatureSignatureError`.
- Your CI or staging environment rotated the symmetric signing secret (`JWT_SECRET`).

Replay Transforms resolve these authentication failures deterministically, leave your assertions untouched, and run in both default replay mode and `KEPLOY_PROVEN=1` mode because they represent explicit configuration rather than automatic learning.

## Understand the transform pipeline

Every transform follows a four-stage pipeline during `keploy test`:

```text
match -> extract -> steps -> write back
```

1. **Match (`at` + optional `match`):** Select which recorded HTTP Test Cases the transform applies to using `at: test.request` and optional filters (`kind`, `method`, `host`, `path` glob, `testSet`, `test`).
2. **Extract (`extract`):** Read a target HTTP request header (`header.<Name>`, such as `header.Authorization`).
3. **Steps (`steps`):** Run an optional `bearer` codec (which strips `"Bearer "` on extract and restores it on write-back) followed by `jwt.resign` using a symmetric HS256, HS384, or HS512 key referenced via `${secret:NAME}`.
4. **Write back (and optional `propagate`):** Write the re-signed header back into the outgoing test request before Keploy sends it to your application. Under `KEPLOY_PROVEN=1`, when your application forwards the re-signed header to plaintext downstream HTTP Mocks, `propagate.targets` binds the recorded value to the live re-signed value in memory so those downstream Mocks match cleanly.

## Check current scope and roadmap

Replay Transforms currently focus on `keploy test` with symmetric JWT re-signing on HTTP request headers:

| Capability                                                                                                                  | Status            | Details                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `at: test.request` + `header.<Name>`                                                                                        | **Available now** | Re-sign HTTP request headers before Keploy sends a Test Case during `keploy test`                                |
| `bearer` codec + `jwt.resign` (`HS256`/`HS384`/`HS512`)                                                                     | **Available now** | Supports `${secret:NAME}` with default `raw` key encoding, `claims`, `expOffset`, `preserveClaims`, and `expCap` |
| `propagate.targets` (`use: [header.<Name>]`) for plaintext HTTP Mocks                                                       | **Available now** | Binds forwarded request headers under `KEPLOY_PROVEN=1` with redacted `sensitive: true` variables                |
| Offline preview & audit (`keploy transforms list\|test\|schema`)                                                            | **Available now** | Validates rules, previews redacted before/after JWT claims, and prints the embedded Draft 2020-12 JSON Schema    |
| `keyEncoding` (`base64`/`hex`), `${env:...}` / `${file:...}`, `propagate.answer`/`ignore`, non-header `propagate.use`       | **Coming**        | Refused at load time (`REFUSE_INVALID_CONFIG`) in the current release                                            |
| Encrypted (`ENC:`) recordings with transforms, `keploy cloud replay`, and `keploy mock replay`                              | **Coming**        | Refused at load time in the current release                                                                      |
| Asymmetric `jwks-swap` (`RS*`/`ES*`/`EdDSA`), `time.shift`, `set`, `mock.answer`, body/query/path places, and `[*]` fan-out | **Coming**        | Planned for upcoming releases                                                                                    |
| `mock.request` responder capture/echo, `k8s-proxy` cluster auto-replay, and console-managed transform storage               | **Coming**        | Planned for upcoming releases                                                                                    |

:::note Replay surface
Replay Transforms run strictly during `keploy test`. Configuring `transforms:` in `keploy.yml` is refused at load time under `keploy cloud replay` and `keploy mock replay` (`REFUSE_INVALID_CONFIG`) until cloud/auto-replay parity ships.
:::

### Understand encrypted (`ENC:`) recordings and redaction

- Transforms over encrypted recordings (`record.enableEncryption: true`) are **coming** and are currently refused at load time (`REFUSE_ENCRYPTED_PROPAGATE_UNSUPPORTED` when `propagate` is set, or `REFUSE_INVALID_CONFIG` otherwise).
- During offline `keploy transforms test` dry-run previews, Keploy refuses `ENC:` targets cleanly with `REFUSE_KMS_UNAVAILABLE` instead of treating ciphertext as a malformed JWT.
- Keploy redacts signing keys, live re-signed tokens, and recorded bearer tokens from test reports (`TestResult.Req`, `TestResult.Variables`, and `applied_transforms`), `KEPLOY NEXT` blocks, `--json` output, and `--debug` logs.

## Rely on hard safety rules

Replay Transforms enforce strict guardrails at load time and runtime so a transform can never mask a real regression:

- **Never rewrites expected values or status codes:** A transform only modifies outgoing test requests. Your application's recorded expected response status, headers, and body remain untouched.
- **Never loosens matching:** Transforms do not ignore fields or widen Mock matchers. Matching relaxation belongs strictly under noise configuration; noise and transforms never merge.
- **Single source of truth (`keploy.yml`):** Replay Transforms read strictly from `keploy.yml` in your repository. Duplicate transforms targeting overlapping `(at, match, extract)` places—or any transform colliding with a learned, minted, or template-captured variable place—are refused at load time.
- **Fail closed at runtime (`TEST_CASE_REFUSED`):** If a transform fails at runtime on a specific Test Case (for example, a malformed recorded JWT), Keploy fails that Test Case with category `TEST_CASE_REFUSED` **before sending the request**, so your application never receives a broken request.
- **Transparent reporting:** Every Test Case that runs with active transforms records `applied_transforms` and `clock_freeze` (with secrets, headers, and variables redacted) in `keploy/reports/test-run-N/<set>-report.yaml` and surfaces a caveat in `KEPLOY NEXT` output.
- **No silent persistence into Mocks:** Declared propagation bindings attach in memory with `source: declared` and are stripped before any Mock write-back, so `keploy.yml` rules never leak into recorded Mock files.

## Compare transforms with related Keploy features

Keploy separates five mechanisms that solve different replay problems:

| Mechanism                                   | Purpose                                                                                                                                           | When to use                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Replay Transforms (`transforms:`)**       | Deterministically re-sign HTTP request header JWTs (`jwt.resign`) during `keploy test`                                                            | Expired JWTs, future `iat` claims, or rotated HMAC signing secrets                                                                                                                    |
| **Noise (`noise`, `mock.noise`)**           | Ignore volatile response fields in assertions or volatile request fields during Mock matching                                                     | Request IDs, trace headers, server headers, or non-semantic formatting drift                                                                                                          |
| **Template captures (`keploy templatize`)** | Capture an ID or token emitted by one Test Case response (`{{capture string .k}}`) and inject it into a later Test Case request (`{{string .k}}`) | Inter-test ID chaining where Test 2 consumes an ID created by Test 1 (see [Keploy Templatize](../running-keploy/keploy-templatize.md))                                                |
| **Learned minted IDs & rules**              | Track values your application mints or reads from its clock during `KEPLOY_PROVEN=1` replays                                                      | Runtime UUIDs and app-generated IDs (see [Values that change](../universal-mocker/guides/changing-values.md) and [Rules in keploy.yml](../universal-mocker/guides/declared-rules.md)) |
| **Time Freezing (`--freezeTime`)**          | Roll your application's process clock back to the recorded Test Case timestamp                                                                    | Apps validating recorded timestamps or unchanged-secret tokens (see [Time Freezing](../keploy-cloud/time-freezing.md))                                                                |

### Understand how `jwt.resign` interacts with `--freezeTime`

During `keploy test`, Keploy derives `clock_freeze` by combining the agent's time-freeze verification state, the agent's replay clock window reader, and the recorded request timestamp to resolve `now` for `jwt.resign`:

- When time freezing is enabled and agent verification passes, `clock_freeze.active` is `true`, `clock_freeze.instant` records the active frozen instant (the replay clock window floor when a window is active, or the recorded request timestamp truncated to the second otherwise), and `jwt.resign` evaluates `now` against that frozen instant.
- When time freezing is off (`--freezeTime=false` in default mode), when freeze verification does not succeed, or when running under `KEPLOY_PROVEN=1` on a Test Case that declares a `real:` list, `clock_freeze.active` is `false` and `jwt.resign` evaluates `now` against the wall clock.
- Under `KEPLOY_PROVEN=1`, `keploy test` enforces time freezing on by default even if `--freezeTime=false` is passed, so `clock_freeze.active` reports `true` (and `jwt.resign` signs against the frozen clock) whenever freeze verification succeeds and the Test Case has no `real:` list.

## Self-hosted and air-gapped

Replay Transforms execute locally inside the Keploy Enterprise CLI on your developer workstations and private CI runners:

- **Offline inspection and preview:** `keploy transforms list`, `keploy transforms test`, and `keploy transforms schema` embed the Draft 2020-12 JSON Schema directly in the binary and run locally without a Keploy API server. Set `DO_NOT_TRACK=1` (or `disableTele: true` in `keploy.yml`) and `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Telemetry and update opt-outs:** Set `disableTele: true` in `keploy.yml` (or export `DO_NOT_TRACK=1`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1`.
- **Self-hosted `keploy test` endpoints:** Because `keploy test` verifies your API key and uploads test reports by default, authenticate against your self-hosted cluster with `--k8s-proxy-url` or `KEPLOY_K8S_PROXY_URL` (or `keploy login --k8s-proxy-url <url>`—sign-in checks the flag, environment variable, or saved login before `keploy.yml` is loaded; or use a self-hosted Keploy Enterprise binary built for your internal API server) and set `test.disableReportUpload: true` in `keploy.yml` when you want reports written strictly to local disk.
- **Customer secrets:** Reference signing keys with `${secret:NAME}`. Secret values are never written to `keploy.yml`, reports, or logs.
- **Upgrades:** After upgrading the Keploy Enterprise CLI binary, validate existing `keploy.yml` transform blocks offline with `keploy transforms list` before running CI.

## Next steps

- [Re-sign expired JWTs during replay](./how-to-resign-jwt.md): Follow a complete walkthrough covering HS256/HS384/HS512 secrets, `KEPLOY_PROVEN=1` propagation, and `--freezeTime`.
- [Preview and audit transforms](./preview-and-audit.md): Dry-run transforms offline with `keploy transforms list`, `keploy transforms test`, and `keploy transforms schema`, and inspect redacted reports.
- [Drive transforms and virtual services with coding agents](./coding-agents.md): Let Claude Code, Cursor, or another coding agent act on `KEPLOY NEXT` blocks.
- [Transforms reference](./reference.md): Inspect the full `transforms:` schema, `jwt.resign` options, refusal codes, and CLI flags.
