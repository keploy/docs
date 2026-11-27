---
id: reference
title: Virtual service specification reference
sidebar_label: Reference
description: Complete reference for virtual-service.yaml, keploy mock serve and keploy vs CLI commands and flags, the :9901 Admin API, Prometheus metrics, refusal codes, vs KEPLOY NEXT phases, and exit codes.
tags:
  - virtual services
  - reference
  - schema
  - cli
  - metrics
keywords:
  - virtual-service.yaml
  - virtual-service.schema.json
  - keploy vs schema
  - keploy mock serve flags
  - keploy vs phases
  - virtual service metrics
  - REFUSE_ADMIN_AUTH_REQUIRED
---

# Virtual service specification reference

This page documents the `virtual-service.yaml` specification, every `keploy mock serve` and `keploy vs` command and flag, the `:9901` Admin API, Prometheus metrics, resource limits, refusal codes, `KEPLOY NEXT` phases, and exit codes. Standalone Virtual Services are available in the Keploy Enterprise CLI binary and currently support plain-HTTP/1.1 sequence mode.

To print the exact Draft 2020-12 JSON Schema embedded in your installed Keploy binary offline, run:

```bash
keploy vs schema
```

## Configure `virtual-service.yaml`

```yaml
version: keploy.io/v1alpha1 # Optional: keploy.io/v1alpha1 (default) | v1alpha1
name: downstream-vs # Required: DNS-safe Virtual Service name
mode: sequence # sequence (default)
listen: "127.0.0.1:8081" # Optional: default plain-HTTP listen addr when bindings is empty
admin:
  listen: "127.0.0.1:9901" # Admin API listen address (default 127.0.0.1:9901)
  tokenEnv: KEPLOY_VS_ADMIN_TOKEN # Optional: env var name holding bearer token (>=16 chars off loopback)
source:
  path: ./keploy # Optional: base directory containing Keploy test sets
  sets: [manual] # Required: recorded Test Sets to load
  host: downstream.local # Optional: upstream host filter when bindings is empty
  order: timestamp # timestamp (default)
onMiss: "404" # "404" (default) | "fail" (never inherits mock.onMiss from keploy.yml)
afterLast: repeat-last # repeat-last (default)
partitionBy: none # none (only supported value in the current release; header partitioning is coming)
bindings: # Optional: explicit listener-to-recorded-target mappings
  - listen: "127.0.0.1:8081"
    target: product_service:8081
    protocol: http
  - listen: "127.0.0.1:8082"
    target: user_service:8082
    protocol: http
noise: # Optional: request-matching noise ignored by sequence matcher
  headers: # Custom HTTP header names ignored during matching (case-insensitive)
    - X-Tenant-Id
```

### Top-level fields

| Field            | Type            | Default                 | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | --------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`        | `string`        | `keploy.io/v1alpha1`    | Specification version (`keploy.io/v1alpha1` or `v1alpha1`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `name`           | `string`        | _(required)_            | DNS-safe Virtual Service name matching `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `mode`           | `string`        | `sequence`              | Serving mode (`sequence`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `listen`         | `string`        | `127.0.0.1:8081`        | Default plain-HTTP listen address when `bindings` is empty (for example, `:8081` or `127.0.0.1:8081`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `bindings`       | `array<object>` | _(optional)_            | Listener bindings (`listen`, `target`, optional `protocol`: `http`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `admin.listen`   | `string`        | `127.0.0.1:9901`        | Listen address for the Admin API and Prometheus `/metrics`. Binding off loopback requires a `>= 16`-character token (`REFUSE_ADMIN_AUTH_REQUIRED`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `admin.tokenEnv` | `string`        | `KEPLOY_VS_ADMIN_TOKEN` | Environment variable name holding the Admin API bearer token (literal tokens are refused with `REFUSE_LITERAL_ADMIN_TOKEN`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `source.path`    | `string`        | `./keploy`              | Base directory containing Keploy Test Sets (for example, `./keploy` or `/var/lib/keploy/mocks`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `source.sets`    | `array<string>` | _(required)_            | One or more recorded Test Set names or paths to load.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `source.host`    | `string`        | _(optional)_            | Recorded upstream host filter (normalized with or without `:port`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `source.order`   | `string`        | `timestamp`             | Mock ordering strategy (`timestamp`, sorted by `ReqTimestampMock`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `onMiss`         | `string`        | `"404"`                 | Unmatched-request behavior: `"404"` (returns `404` + `X-Keploy-Miss: true`) or `"fail"` (`502` + non-zero exit on stop). Never inherits `mock.onMiss` from `keploy.yml`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `afterLast`      | `string`        | `repeat-last`           | Sequence exhaustion behavior: `repeat-last` clamps at the final recorded response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `partitionBy`    | `string`        | `none`                  | Cursor partition key: `none` only (`header:<Header-Name>` is coming and refused at load time with `REFUSE_INVALID_PARTITION_BY`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `noise`          | `object`        | _(optional)_            | HTTP request-matching noise. Currently supports `headers[]` only (custom headers ignored case-insensitively during matching; `query[]` and `body[]` are coming and refused at load time with `REFUSE_SCHEMA_INVALID`). Custom HTTP headers present on both the recorded mock and live request are compared unless listed in `noise.headers`, marked as credential headers, or in Keploy's 27 built-in `defaultIgnoredHeaders` (`accept`, `accept-encoding`, `accept-language`, `cache-control`, `connection`, `content-length`, `date`, `host`, `keep-alive`, `pragma`, `te`, `traceparent`, `tracestate`, `transfer-encoding`, `upgrade`, `user-agent`, `x-b3-parentspanid`, `x-b3-sampled`, `x-b3-spanid`, `x-b3-traceid`, `x-correlation-id`, `x-forwarded-for`, `x-forwarded-host`, `x-forwarded-proto`, `x-keploy-session`, `x-real-ip`, `x-request-id`). |

## CLI commands and flags

`keploy vs serve` is a direct alias for `keploy mock serve`.

### `keploy mock serve` (`keploy vs serve`)

Start a standalone plain-HTTP Virtual Service from recorded sets or a `virtual-service.yaml` spec.

```bash
keploy mock serve [flags]
```

| Flag                    | Default                                                                  | Description                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `-f, --file <path>`     | _(none)_                                                                 | Path to a `virtual-service.yaml` spec YAML/JSON file.                                                                |
| `--from <sets>`         | _(none)_                                                                 | Recorded Keploy Test Set name(s) or directory/file path(s) to serve.                                                 |
| `--source-path <dir>`   | _(none)_                                                                 | Base directory containing Keploy Test Sets (overrides `source.path`).                                                |
| `--host <host>`         | _(none)_                                                                 | Filter recorded HTTP mocks by upstream host (normalized with or without `:port`).                                    |
| `--listen <addr>`       | `127.0.0.1:8081`                                                         | Plain-HTTP listen address when `--bind` is not specified.                                                            |
| `--bind <addr=target>`  | _(repeatable)_                                                           | Bind a local plain-HTTP listener to a recorded upstream target (for example, `127.0.0.1:8081=product_service:8081`). |
| `--admin <addr>`        | `127.0.0.1:9901`                                                         | Listen address for the Admin API and `/metrics`. Non-loopback addresses require a `>= 16`-character token.           |
| `--admin-token <token>` | `$KEPLOY_VS_ADMIN_TOKEN`                                                 | Admin API bearer token (prefer `KEPLOY_VS_ADMIN_TOKEN` so tokens stay out of process arguments).                     |
| `--on-miss <policy>`    | `404`                                                                    | Behavior on miss: `404` (`X-Keploy-Miss: true`) or `fail` (`502` + non-zero exit on stop).                           |
| `--partition-by <key>`  | `none`                                                                   | Cursor partition key: `none` only (`header:<Header-Name>` is coming and refused at load time).                       |
| `--write <path>`        | _(none)_                                                                 | Write the resolved `VirtualServiceSpec` YAML to `<path>` before serving.                                             |
| `--detach`              | `false`                                                                  | Start detached, wait until `/readyz` succeeds, print one `vs_serving` block, and exit `0`.                           |
| `--ready-file <path>`   | `$TMPDIR/keploy-vs-<name>-ready.json` _(or `/tmp/...`, with `--detach`)_ | Write the `vs_serving`, `vs_invalid`, or `vs_error` `NextBlock` JSON to `<path>`.                                    |
| `--misses-file <path>`  | `$TMPDIR/keploy-vs-<name>-misses.json` _(or `/tmp/...`)_                 | Flush redacted misses JSON to `<path>` on clean shutdown.                                                            |
| `--json`                | `false`                                                                  | Emit one top-level `NextBlock` JSON object (`--detach`) or compact 1-line NDJSON objects (foreground).               |

### `keploy vs inspect`

Validate a `virtual-service.yaml` specification offline and summarize listeners and loaded HTTP mocks.

```bash
keploy vs inspect -f <spec> [--json]
```

### `keploy vs explain-miss`

Inspect unmatched calls from a running Virtual Service or a saved `misses.json` file. Read-only; always exits `0` on valid input and reports misses via `phase: vs_misses_detected` and `failures:` (`unrecorded_route` or `field_mismatch`).

```bash
keploy vs explain-miss (--admin <url> | --file <path>) [--admin-token <token>] [--json]
```

### `keploy vs reset`

Reset all sequence cursors, clear recorded misses, and zero `requests_served`. Reports `phase: vs_serving` (`requests_since_reset == 0`).

```bash
keploy vs reset --admin <url> [--admin-token <token>] [--json]
```

### `keploy vs stop`

Trigger `POST /stop` on a running Virtual Service, flush `misses.json`, and print the final `KEPLOY NEXT` summary. Exits `1` (`tests_failed`) when the Virtual Service was started with `--on-miss fail` and recorded `misses_count > 0`.

```bash
keploy vs stop --admin <url> [--admin-token <token>] [--json]
```

### `keploy vs schema`

Print the embedded Draft 2020-12 JSON Schema (`virtual-service.schema.json`) offline.

```bash
keploy vs schema [--json]
```

## Admin API (`:9901`) and resource bounds

All endpoints except `/healthz` and `/readyz` require `Authorization: Bearer <token>` when `KEPLOY_VS_ADMIN_TOKEN` is configured (mandatory with `>= 16` characters whenever `admin.listen` binds off loopback).

| Method | Path                          | Response                                                                                                                                                      |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/healthz`                    | `200 OK` (`{"status":"ok"}`)                                                                                                                                  |
| `GET`  | `/readyz`                     | `200 OK` (`{"status":"ready"}`)                                                                                                                               |
| `GET`  | `/state`                      | JSON snapshot: `name`, `mode`, `scenario`, `loaded_mocks`, `requests_served`, `misses_count`, optional `overflow_misses`, `after_last`, `on_miss`, `pid`      |
| `GET`  | `/misses`                     | JSON object (`{ name, scenario, requests_served, misses_count, misses: [...] }`) of redacted `MissRecord` entries sorted by deterministic 8-char SHA-256 `id` |
| `POST` | `/reset`                      | Rewinds all sequence cursors, clears misses, zeroes `requests_served`                                                                                         |
| `POST` | `/stop` _(alias `/shutdown`)_ | Flushes `misses_file`, closes listeners gracefully, and terminates the process                                                                                |
| `GET`  | `/metrics`                    | Prometheus text exposition format (`text/plain; version=0.0.4`)                                                                                               |

Built-in runtime limits:

- **Request body cap:** 10 MiB per incoming HTTP request.
- **Miss log cap:** 1000 recorded misses per Virtual Service instance (resettable via `POST /reset`).
- **Redaction:** Credential headers (`Authorization`, `Cookie`, `X-Api-Key`, `X-Auth-Token`, etc.) and query secrets are redacted before storing or flushing misses.

## Prometheus metrics (`/metrics`)

`/metrics` exports three Prometheus metrics:

| Metric                            | Type    | Labels             | Description                                                    |
| --------------------------------- | ------- | ------------------ | -------------------------------------------------------------- |
| `keploy_vs_requests_served_total` | Counter | `name`, `scenario` | Total requests handled by the Virtual Service since last reset |
| `keploy_vs_misses_total`          | Counter | `name`, `scenario` | Total unmatched requests since last reset                      |
| `keploy_vs_loaded_mocks`          | Gauge   | `name`, `scenario` | Number of recorded HTTP mocks loaded                           |

## Load-time refusal codes (`REFUSE_*`)

Invalid specs or flags exit with code `1` (`KEPLOY_RUN_RESULT.reason: "refused"`), set `phase: vs_invalid`, and emit structured `errors[].code` values:

| Code                          | Cause                                                                                                                             |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `REFUSE_SCHEMA_INVALID`       | `virtual-service.yaml` failed embedded JSON Schema validation or `-f` was omitted.                                                |
| `REFUSE_EMPTY_SOURCE`         | No recorded Test Sets were specified in `source.sets` / `--from`.                                                                 |
| `REFUSE_INVALID_BINDING`      | Malformed `--bind <listen>=<target>` expression, empty listener/target, or unsupported protocol (only `http` is supported).       |
| `REFUSE_DUPLICATE_LISTEN`     | Two bindings declare the same local listen address.                                                                               |
| `REFUSE_INVALID_PARTITION_BY` | `partitionBy` is not `none` (`header:<Header-Name>` partitioning is coming).                                                      |
| `REFUSE_INVALID_ON_MISS`      | Unsupported `onMiss` value (must be `"404"` or `"fail"`).                                                                         |
| `REFUSE_INVALID_AFTER_LAST`   | Unsupported `afterLast` value (must be `repeat-last`).                                                                            |
| `REFUSE_INVALID_ORDER`        | Unsupported `source.order` value (must be `timestamp`).                                                                           |
| `REFUSE_LITERAL_ADMIN_TOKEN`  | Hardcoded secret detected instead of an environment variable name in `admin.tokenEnv`.                                            |
| `REFUSE_ADMIN_AUTH_REQUIRED`  | Non-loopback `admin.listen` / `--admin` address configured without a `>= 16`-character `KEPLOY_VS_ADMIN_TOKEN` / `--admin-token`. |
| `REFUSE_NO_MOCKS_LOADED`      | Zero recorded HTTP mocks found in the configured `source.sets` / `source.path`.                                                   |

## `vs` NEXT phases

Every `vs` phase is computed statically from spec validity and live counters—never stored or overstated:

| Phase                | Computed condition                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `vs_invalid`         | `virtual-service.yaml` or CLI flags failed schema, binding, or admin-auth validation.                               |
| `vs_built`           | Specification validated cleanly (`keploy vs inspect`).                                                              |
| `vs_serving`         | Server is live and `requests_since_reset == 0` (including immediately after `--detach` start or `keploy vs reset`). |
| `vs_clean`           | Server handled `requests_since_reset > 0` with `misses_since_reset == 0`.                                           |
| `vs_misses_detected` | `misses_since_reset > 0` (live via `--admin` or offline via `--file`).                                              |
| `vs_error`           | Runtime or transport error (port busy, admin unreachable, or unauthorized admin token).                             |

## Exit codes

| Exit code | `KEPLOY_RUN_RESULT.reason`                  | Meaning                                                                                                                                                                                               |
| --------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`       | _(none)_                                    | Clean `serve --detach`, `inspect`, `explain-miss` (with `0` or `> 0` misses), `reset`, `stop` (when `misses_count == 0` or `onMiss != fail`), or `schema`.                                            |
| `1`       | `refused` / `tests_failed` / `keploy_error` | Invalid spec or missing non-loopback admin token (`vs_invalid`), `--on-miss fail` with misses on foreground shutdown or `keploy vs stop` (`tests_failed`), or runtime/transport failure (`vs_error`). |
| `8`       | _(none)_                                    | CLI usage error (unknown subcommand, bad flag, or wrong argument count).                                                                                                                              |

## Self-hosted and air-gapped

- **Telemetry and update opt-outs:** Export `DO_NOT_TRACK=1` (or set `disableTele: true` in `keploy.yml`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Container packaging:** Build your own minimal container image using the inline 4-line `Dockerfile` in [Run a virtual service from recordings](./serve-from-recordings.md) with `--build-arg BASE_IMAGE=<your-mirror>/debian:13-slim`, mount recordings and spec read-only, and provide a `>= 16`-character `KEPLOY_VS_ADMIN_TOKEN` whenever binding `admin.listen` off loopback.
- **Embedded schema:** `virtual-service.schema.json` is compiled directly into the Keploy Enterprise binary (`keploy vs schema`).
- **Upgrades:** Rebuild your container image after upgrading the Keploy Enterprise CLI binary, re-export `keploy vs schema`, and run `keploy vs inspect -f virtual-service.yaml` in CI.

## Related

- [Understand virtual services](./overview.md)
- [Run a virtual service from recordings](./serve-from-recordings.md)
- [Operate and troubleshoot virtual services](./admin-api-and-troubleshooting.md)
- [Transforms reference](../transforms/reference.md)
