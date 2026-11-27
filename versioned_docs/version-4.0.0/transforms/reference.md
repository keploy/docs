---
id: reference
title: Transforms reference
sidebar_label: Reference
description: Complete reference for keploy.yml transforms configuration, place grammar, bearer codec, jwt.resign options, propagate.targets, CLI commands and flags, REFUSE_* codes, KEPLOY NEXT phases, and exit codes.
tags:
  - transforms
  - reference
  - schema
  - cli
keywords:
  - transforms.schema.json
  - keploy transforms list
  - keploy transforms test
  - keploy transforms schema
  - keyEncoding
  - REFUSE_LITERAL_KEY
  - REFUSE_ALG_UNSUPPORTED
  - REFUSE_INVALID_CONFIG
  - REFUSE_ENCRYPTED_PROPAGATE_UNSUPPORTED
  - transforms phases
---

# Transforms reference

This page documents the `transforms:` configuration schema in `keploy.yml`, supported place syntax, steps, CLI commands, load-time and runtime refusal codes, `KEPLOY NEXT` phases, and exit codes. Replay Transforms are available in the Keploy Enterprise CLI binary and execute during `keploy test`.

To print the exact Draft 2020-12 JSON Schema embedded in your installed Keploy binary offline, run:

```bash
keploy transforms schema
```

## Configure `transforms:` in `keploy.yml`

`transforms:` is a top-level list in `keploy.yml`. Each entry defines one rule that matches recorded HTTP test requests, extracts a header value, runs an ordered list of steps, and writes the transformed value back.

```yaml
transforms:
  - name: fresh-jwt # Required: unique identifier (^[A-Za-z0-9][A-Za-z0-9._-]*$)
    at: test.request # Required: test.request
    match: # Optional: omit to match all HTTP test requests
      kind: Http # Optional: Http | HTTP | http
      method: GET # Optional: HTTP method (omit to match all)
      host: api.local # Optional: normalized with/without :port
      path: /api/v1/** # Optional: exact path or glob (*, **)
      testSet: manual # Optional: restrict to a specific Test Set
      test: test-1 # Optional: restrict to a specific Test Case
    extract: header.Authorization # Required: HTTP request header (header.<Name>)
    steps: # Required: optional "bearer" codec + jwt.resign
      - bearer
      - jwt.resign:
          key: ${secret:JWT_SECRET}
          keyEncoding: raw
          alg: recorded
          expOffset: 1h
          preserveClaims: true
          expCap: 24h
          claims:
            iat: now
            exp: now+1h
    propagate: # Optional: bind rewritten header to plaintext HTTP mocks (KEPLOY_PROVEN=1)
      targets:
        - match:
            kind: Http
            host: downstream.local
          use:
            - header.Authorization
```

### Top-level transform fields

| Field               | Type     | Required         | Description                                                                                                                                                                                                                                                                                                             |
| ------------------- | -------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`              | `string` | Yes              | Unique transform identifier matching `^[A-Za-z0-9][A-Za-z0-9._-]*$` (letters, digits, dots, dashes, underscores).                                                                                                                                                                                                       |
| `at`                | `string` | Yes              | Hook point: `test.request`. (`mock.answer` and `mock.request` are coming.)                                                                                                                                                                                                                                              |
| `match`             | `object` | No               | Optional filter selecting which HTTP Test Cases this rule applies to.                                                                                                                                                                                                                                                   |
| `match.kind`        | `string` | No               | Protocol kind (`Http`, `HTTP`, `http`, or empty).                                                                                                                                                                                                                                                                       |
| `match.method`      | `string` | No               | HTTP method filter (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc.).                                                                                                                                                                                                                                                     |
| `match.host`        | `string` | No               | Target host filter (normalized with or without `:port`, e.g., `downstream.local` matches `downstream.local:8081`).                                                                                                                                                                                                      |
| `match.path`        | `string` | No               | URL path filter supporting single-segment `*` and multi-segment `**` globs.                                                                                                                                                                                                                                             |
| `match.testSet`     | `string` | No               | Restrict the rule to a specific recorded Test Set name.                                                                                                                                                                                                                                                                 |
| `match.test`        | `string` | No               | Restrict the rule to a specific Test Case name (for example, `test-1`).                                                                                                                                                                                                                                                 |
| `extract`           | `string` | Yes              | HTTP request header place matching `^header\.[A-Za-z0-9-]+$` (for example, `header.Authorization`).                                                                                                                                                                                                                     |
| `steps`             | `array`  | Yes              | Non-empty ordered list containing optional `"bearer"` codec and a `jwt.resign` object.                                                                                                                                                                                                                                  |
| `propagate`         | `object` | No               | Optional propagation specification binding the rewritten `test.request` value to plaintext HTTP Mocks under `KEPLOY_PROVEN=1` (required under `KEPLOY_PROVEN=1` when recorded downstream mocks carry the rewritten header). Refused with `REFUSE_ENCRYPTED_PROPAGATE_UNSUPPORTED` when `record.enableEncryption: true`. |
| `propagate.targets` | `array`  | With `propagate` | Non-empty list of `{ match, use }` rules where `use` lists plain HTTP request headers (`^header\.[A-Za-z0-9-]+$`, such as whole `header.Authorization`). `answer`, `ignore`, and non-header `use` places are coming and refused at load time (`REFUSE_INVALID_CONFIG`).                                                 |

## Place grammar

- **`extract`:** Currently supports HTTP request headers (`header.<Name>`, case-insensitive header name such as `header.Authorization`). Piped `extract` expressions (such as `header.Cookie|cookie.session`) fail the JSON Schema `^header\.[A-Za-z0-9-]+$` pattern (`REFUSE_INVALID_CONFIG`).
- **Array indexing (upcoming body places):** Keploy's place parser indexes JSON arrays using bracket notation (`body.items[0].productId`), not dot-numeric segments (`body.items.0.productId`).
- **`propagate.targets[].use`:** Supports plain HTTP request headers (`^header\.[A-Za-z0-9-]+$`, such as whole `header.Authorization`). Non-header `use` places, `propagate.targets[].answer`, and `propagate.targets[].ignore` are coming and refused at load time with `REFUSE_INVALID_CONFIG`.

## Steps (`bearer` and `jwt.resign`)

### `bearer` codec

```yaml
- bearer
```

Strips the `"Bearer "` prefix on extract and restores `"Bearer "` on write-back. Omit `- bearer` if the target header contains a raw JWT without a `"Bearer "` prefix.

### `jwt.resign` operation

```yaml
- jwt.resign:
    key: ${secret:JWT_SECRET} # Required: ${secret:NAME} (no literal keys; ${env:} and ${file:} coming)
    keyEncoding: raw # Optional: raw (default; base64 and hex are coming)
    alg: recorded # Optional: recorded | HS256 | HS384 | HS512 (alg: none and asymmetric/PS* refused)
    expOffset: 1h # Optional: Go duration added to replay now for exp when claims.exp is omitted
    preserveClaims: true # Optional: default true; preserves recorded JWT claims not explicitly overridden
    expCap: 24h # Optional: maximum allowed exp delta above now (Go duration, default 24h)
    claims: # Optional: claim overrides ("now", "now+<dur>", "now-<dur>", or literals)
      iat: now
      exp: now+1h
      nbf: now
```

| Field            | Type      | Default      | Description                                                                                                                                                                                                          |
| ---------------- | --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`            | `string`  | _(required)_ | Secret reference (`${secret:NAME}`) for symmetric HS signing (`${env:NAME}` and `${file:path}` are coming and refused with `REFUSE_INVALID_CONFIG`). Literal keys are refused with `REFUSE_LITERAL_KEY`.             |
| `keyEncoding`    | `string`  | `raw`        | Encoding of key material: `raw` (UTF-8/raw bytes). `base64` and `hex` are coming and refused at load time with `REFUSE_INVALID_CONFIG`.                                                                              |
| `alg`            | `string`  | `recorded`   | Signing algorithm: `recorded` (preserve recorded HS algorithm) or explicit `HS256`, `HS384`, or `HS512`. `none` is refused with `REFUSE_ALG_NONE`; unsupported algorithms are refused with `REFUSE_ALG_UNSUPPORTED`. |
| `expOffset`      | `string`  | _(none)_     | Go duration (such as `"1h"`) added to replay `now` for `exp` when `claims.exp` is not set (capped by `expCap`).                                                                                                      |
| `preserveClaims` | `boolean` | `true`       | When `true`, preserves all recorded JWT claims not explicitly overridden in `claims`.                                                                                                                                |
| `claims`         | `object`  | _(optional)_ | Claim overrides supporting `"now"`, `"now+<dur>"`, `"now-<dur>"`, or literal JSON values.                                                                                                                            |
| `expCap`         | `string`  | `24h`        | Maximum allowed `exp` delta above `now` (Go duration). Requests exceeding `expCap` are refused with `REFUSE_EXP_CAP`.                                                                                                |

## CLI commands and flags

### `keploy transforms list`

Validate `keploy.yml` transforms and report the current flow phase.

```bash
keploy transforms list [--path <dir>] [--json]
```

| Flag           | Description                                                                          |
| -------------- | ------------------------------------------------------------------------------------ |
| `--path <dir>` | Optional. Path to the directory containing `keploy.yml` and `keploy/` (default `.`). |
| `--json`       | Emit the top-level `NextBlock` JSON object (`transforms` payload in `snake_case`).   |

### `keploy transforms test`

Preview every configured transform offline against a recorded Test Set without starting your application.

```bash
keploy transforms test --set <set> [--path <dir>] [--test <testcase>] [--name <transform>] [--freezeTime] [--json]
```

| Flag                 | Description                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `--set <set>`        | Required. Name of the recorded Test Set (for example, `manual` or `test-set-0`).                                                                       |
| `--path <dir>`       | Optional. Path to the directory containing `keploy.yml` and `keploy/` (default `.`).                                                                   |
| `--test <testcase>`  | Optional. Preview only the named Test Case (for example, `test-1`).                                                                                    |
| `--name <transform>` | Optional. Preview only the named transform from `keploy.yml`.                                                                                          |
| `--freezeTime`       | Optional. Evaluate transforms as if `--freezeTime` is enabled (when omitted, reads `test.freezeTime` from `keploy.yml` or falls back to the last run). |
| `--json`             | Emit the top-level `NextBlock` JSON object with `transforms.previews[]`.                                                                               |

### `keploy transforms schema`

Print the embedded Draft 2020-12 JSON Schema (`transforms.schema.json`) offline.

```bash
keploy transforms schema [--json]
```

## Report audit fields (`applied_transforms` and `clock_freeze`)

During `keploy test`, each Test Case result written by `RedactingReportDB` includes redacted `applied_transforms[]`, `clock_freeze`, and redacted `req` / `variables`:

| Field                               | Description                                                                                                                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `applied_transforms[].name`         | Transform name from `keploy.yml`.                                                                                                                                                                                                      |
| `applied_transforms[].at`           | Hook point (`test.request`).                                                                                                                                                                                                           |
| `applied_transforms[].place`        | Target place expression (for example, `header.Authorization`).                                                                                                                                                                         |
| `applied_transforms[].function`     | Operation applied (`jwt.resign`).                                                                                                                                                                                                      |
| `applied_transforms[].signing_mode` | Signing mode (`secret`).                                                                                                                                                                                                               |
| `applied_transforms[].secret_ref`   | Secret reference name (for example, `${secret:JWT_SECRET}`), never the secret value.                                                                                                                                                   |
| `applied_transforms[].summary`      | Redacted before/after summary.                                                                                                                                                                                                         |
| `clock_freeze.active`               | Boolean derived from the agent's time-freeze verification state and replay clock window reader (under `KEPLOY_PROVEN=1`, forced on by default and `true` whenever freeze verification succeeds and the Test Case has no `real:` list). |
| `clock_freeze.instant`              | Active frozen timestamp when `clock_freeze.active` is `true` (truncated to the second when unwindowed).                                                                                                                                |
| `variables[].sensitive`             | `true` for propagated sensitive bindings, with `value: "[REDACTED]"`, `recorded: "[REDACTED]"`, and `wordRun` / `wordRunRecorded` cleared.                                                                                             |

## Refusal codes (`REFUSE_*` and `TEST_CASE_REFUSED`)

Every load-time refusal exits with code `1` (`KEPLOY_RUN_RESULT.reason: "refused"`), sets `phase: transforms_invalid`, prefixes the message with `REFUSE_<CODE>:`, and includes structured `transforms.errors[].code` in `--json`:

| Code                                     | Cause                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Fix                                                                                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `REFUSE_INVALID_CONFIG`                  | Schema error, unsupported `at`/step, piped `extract`, non-raw `keyEncoding`, `${env:}`/`${file:}`, `propagate.answer`/`ignore`/non-header `use`, `record.enableEncryption: true`, or `cloud replay`/`mock replay`.                                                                                                                                                                                                                                                                                               | Validate `keploy.yml` against `keploy transforms schema` and run under `keploy test` with plaintext recordings. |
| `REFUSE_EMPTY_EXTRACT`                   | A transform or `propagate` target matched zero places containing a value across all matched requests/Mocks.                                                                                                                                                                                                                                                                                                                                                                                                      | Check `match` filters and `extract` / `use` place paths.                                                        |
| `REFUSE_DUPLICATE_PLACE`                 | Two transforms share a name or target overlapping `(at, match, extract)` places.                                                                                                                                                                                                                                                                                                                                                                                                                                 | Merge rules or narrow the `match` filters.                                                                      |
| `REFUSE_VARIABLE_COLLISION`              | A transform targets a place already owned by a learned, minted, or template-captured variable.                                                                                                                                                                                                                                                                                                                                                                                                                   | Remove the conflicting transform or adjust its target place.                                                    |
| `REFUSE_LITERAL_KEY`                     | `jwt.resign.key` received a hardcoded key instead of `${secret:NAME}`.                                                                                                                                                                                                                                                                                                                                                                                                                                           | Move the secret to an env var and reference `${secret:NAME}`.                                                   |
| `REFUSE_ALG_NONE`                        | `jwt.resign` attempted to sign with `alg: none`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Use `alg: recorded` or `HS256`, `HS384`, or `HS512`.                                                            |
| `REFUSE_ALG_UNSUPPORTED`                 | `jwt.resign` encountered an unsupported algorithm (anything other than `HS256`, `HS384`, or `HS512`).                                                                                                                                                                                                                                                                                                                                                                                                            | Use a supported symmetric HMAC algorithm (`HS256`, `HS384`, or `HS512`).                                        |
| `REFUSE_EXP_CAP`                         | `jwt.resign` requested an `exp` lifetime or `expOffset` exceeding `expCap` (default `24h`).                                                                                                                                                                                                                                                                                                                                                                                                                      | Reduce `claims.exp` / `expOffset` or raise `expCap`.                                                            |
| `REFUSE_UNKNOWN_PLACE_STEP`              | A write-back place (`ParsePlace(..., forWriteBack=true)`) used an unsupported decode pipe (`\|cookie`, `\|b64`, `\|pct`, `\|jwt.<claim>`).                                                                                                                                                                                                                                                                                                                                                                       | Target a plain HTTP request header (`header.<Name>`).                                                           |
| `REFUSE_LOW_ENTROPY_PROPAGATE`           | A propagated value failed minimum entropy checks (must have length `>= 8`, Shannon entropy `>= 2.5` bits/char, and `>= 24` bits total).                                                                                                                                                                                                                                                                                                                                                                          | Propagate only high-entropy tokens or identifiers.                                                              |
| `REFUSE_PROPAGATE_REQUIRES_PROVEN`       | Either (1) `propagate` targeted a header outside the switch-off ignored set (the five credential headers `Authorization`, `Proxy-Authorization`, `Cookie`, `X-Api-Key`, `X-Auth-Token` plus Keploy's built-in flaky/transport headers `models.FlakyHeaders` such as `X-Request-Id`, `traceparent`, `Date`, `Idempotency-Key`, and `X-Csrf-Token`) while `KEPLOY_PROVEN` is off, or (2) under `KEPLOY_PROVEN=1`, the rewritten header also appears on recorded downstream HTTP Mocks without a `propagate` block. | Add `propagate.targets` targeting the downstream mock under `KEPLOY_PROVEN=1`, or remove `propagate` if unused. |
| `REFUSE_ENCRYPTED_PROPAGATE_UNSUPPORTED` | `propagate` was configured while `record.enableEncryption: true`.                                                                                                                                                                                                                                                                                                                                                                                                                                                | Encrypted recordings with transforms/propagate are coming; use plaintext recordings today.                      |
| `REFUSE_SECRET_UNRESOLVED`               | A `${secret:NAME}` key could not be resolved at replay time.                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Export `NAME` in the environment before running `keploy test`.                                                  |
| `REFUSE_KMS_UNAVAILABLE`                 | A transform targeted an encrypted `ENC:` field during offline `keploy transforms test`.                                                                                                                                                                                                                                                                                                                                                                                                                          | Transforms over encrypted `ENC:` recordings are coming; use plaintext recordings today.                         |

### Runtime and preview refusals

The following refusal codes occur per Test Case during `keploy transforms test` dry-run preview or at replay time during `keploy test` (not at static config load time):

| Code                                     | Cause                                                                               | Behavior                                                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `REFUSE_MALFORMED_JWT`                   | Extracted header value is not a valid compact JWS (`header.payload.signature`).     | Reported during `keploy transforms test` preview; during `keploy test`, triggers a runtime `TEST_CASE_REFUSED` failure so the request is unsent. |
| `TEST_CASE_REFUSED` _(failure category)_ | A transform refused a single Test Case at runtime (such as `REFUSE_MALFORMED_JWT`). | Recorded in `failure_info.category`; Keploy fails that Test Case unsent while valid sibling Test Cases still run.                                |

## `transforms` NEXT phases

`phase` is computed statically from repository config, recordings, and the latest test report on every command:

| Phase                   | Meaning                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `transforms_none`       | No `transforms:` entries are configured in `keploy.yml`.                                  |
| `transforms_invalid`    | One or more transforms failed schema or guardrail validation (`REFUSE_*`).                |
| `transforms_configured` | Transforms are valid and configured (or previewed), but have not yet passed a replay run. |
| `transforms_verified`   | The latest replay report applied these transforms and passed.                             |

## Exit codes

| Exit code | `KEPLOY_RUN_RESULT.reason`                  | Meaning                                                                                                       |
| --------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `0`       | _(none)_                                    | Clean `list`, `test`, or `schema`.                                                                            |
| `1`       | `refused` / `tests_failed` / `keploy_error` | Config/guardrail refusal (`REFUSE_*`), failed replay tests (including `TEST_CASE_REFUSED`), or runtime error. |
| `5`       | `auth_required`                             | Missing or expired Keploy authentication session during `keploy test`.                                        |
| `8`       | _(none)_                                    | CLI usage error (unknown command, invalid flag, or wrong argument count).                                     |

## Self-hosted and air-gapped

- **Offline commands:** `keploy transforms list`, `keploy transforms test`, and `keploy transforms schema` run locally without a Keploy API server. Set `DO_NOT_TRACK=1` (or `disableTele: true` in `keploy.yml`) and `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Telemetry and self-hosted `keploy test`:** Set `disableTele: true` in `keploy.yml` (or export `DO_NOT_TRACK=1`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1`. For self-hosted `keploy test` runs, authenticate against your cluster with `--k8s-proxy-url` or `KEPLOY_K8S_PROXY_URL` (or `keploy login --k8s-proxy-url <url>`—sign-in checks the flag, environment variable, or saved login before `keploy.yml` is loaded; or use a self-hosted Keploy Enterprise binary built for your internal API server) and set `test.disableReportUpload: true` in `keploy.yml` when keeping reports strictly local.
- **Embedded schema:** `transforms.schema.json` is compiled directly into the Keploy Enterprise binary.
- **Upgrades:** After upgrading the Keploy Enterprise CLI binary, re-export `keploy transforms schema` for IDE validation and run `keploy transforms list` to verify existing configs.

## Related

- [Understand replay transforms](./overview.md)
- [Re-sign expired JWTs during replay](./how-to-resign-jwt.md)
- [Preview and audit transforms](./preview-and-audit.md)
- [Virtual service specification reference](../virtual-services/reference.md)
