---
id: admin-api-and-troubleshooting
title: Operate and troubleshoot virtual services
sidebar_label: Operate and troubleshoot
description: Control running plain-HTTP Virtual Services through the :9901 Admin API and keploy vs CLI wrappers, protect non-loopback admin listeners with a >=16-character KEPLOY_VS_ADMIN_TOKEN, and resolve misses with keploy vs explain-miss.
tags:
  - virtual services
  - troubleshooting
  - admin api
  - keploy vs
keywords:
  - keploy vs explain-miss
  - keploy vs reset
  - keploy vs stop
  - KEPLOY_VS_ADMIN_TOKEN
  - REFUSE_ADMIN_AUTH_REQUIRED
  - virtual service admin api
---

# Operate and troubleshoot virtual services

Every running Virtual Service exposes an operational Admin API on `127.0.0.1:9901` by default (configurable with `--admin` or `admin.listen`) and matching `keploy vs` CLI commands that emit structured `=== KEPLOY NEXT ===` blocks and `--json` output. Standalone Virtual Services are available in the Keploy Enterprise CLI binary.

## Secure the Admin API with `KEPLOY_VS_ADMIN_TOKEN`

- **Loopback (`127.0.0.1`, `::1`, `localhost`):** Bearer auth is optional, though recommended on shared hosts. When no token is set, all admin endpoints except `/healthz` and `/readyz` reject requests carrying a cross-origin `Origin` header or a non-loopback `Host` header (`403 Forbidden`) to block browser CSRF and DNS rebinding.
- **Non-loopback (`0.0.0.0:19915`, `:9901`, etc.):** A bearer token of **at least 16 characters** (`KEPLOY_VS_ADMIN_TOKEN` or `--admin-token`) is **mandatory**. Starting a Virtual Service with a non-loopback `--admin` address without a `>= 16`-character token is refused at load time with `REFUSE_ADMIN_AUTH_REQUIRED`. Because the Admin API serves plaintext HTTP, terminate TLS in front of non-loopback admin listeners on untrusted networks.

```bash
export KEPLOY_VS_ADMIN_TOKEN="replace-with-at-least-16-char-token"
keploy mock serve -f ./downstream-vs.yaml --admin 127.0.0.1:19911 --detach
```

When `KEPLOY_VS_ADMIN_TOKEN` is set in your shell environment, `keploy vs explain-miss`, `keploy vs reset`, and `keploy vs stop` automatically send `Authorization: Bearer $KEPLOY_VS_ADMIN_TOKEN` (verified with constant-time comparison). Keploy never prints the token value in logs, `KEPLOY NEXT` blocks, or `--json` output.

For raw `curl` calls against protected admin routes, pass the header directly:

```bash
curl -H "Authorization: Bearer $KEPLOY_VS_ADMIN_TOKEN" http://127.0.0.1:19911/state
```

## Use the Admin API endpoints (`:9901`)

All endpoints except `/healthz` and `/readyz` require `Authorization: Bearer <token>` when `KEPLOY_VS_ADMIN_TOKEN` is configured.

| Method & path                           | Purpose                                                                                                                                                                                                               | How to call                                       |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `GET /healthz`                          | Liveness check (`200 OK`, `{"status":"ok"}`)                                                                                                                                                                          | Health check / `curl`                             |
| `GET /readyz`                           | Readiness check (`200 OK`, `{"status":"ready"}`)                                                                                                                                                                      | Readiness probe / `curl`                          |
| `GET /state`                            | Live state snapshot (`name`, `mode`, `scenario`, `loaded_mocks`, `requests_served`, `misses_count`, optional `overflow_misses`, `after_last`, `on_miss`, `pid`)                                                       | Direct HTTP (`curl http://127.0.0.1:19911/state`) |
| `GET /misses`                           | JSON object (`{ name, scenario, requests_served, misses_count, misses: [...] }`) of unmatched calls since last reset (capped at 1000 misses, credential headers and query secrets redacted, sorted by 8-char hash ID) | `keploy vs explain-miss --admin <url>`            |
| `POST /reset`                           | Resets all sequence cursors to index `0`, clears misses, and zeroes `requests_served`                                                                                                                                 | `keploy vs reset --admin <url>`                   |
| `POST /stop` _(alias `POST /shutdown`)_ | Flushes `misses.json` (defaults to `$TMPDIR` or `/tmp` as `keploy-vs-<name>-misses.json`, configurable with `--misses-file`), closes listeners cleanly, and exits                                                     | `keploy vs stop --admin <url>`                    |
| `GET /metrics`                          | Prometheus text exposition for `keploy_vs_requests_served_total`, `keploy_vs_misses_total`, and `keploy_vs_loaded_mocks`                                                                                              | Prometheus scrape / `curl`                        |

## Run day-two operations from the CLI

### Reset cursors and miss counters between test suites

```bash
keploy vs reset --admin http://127.0.0.1:19911
```

`keploy vs reset` calls `POST /reset`, rewinds all sequence cursors to `0`, clears recorded misses, and zeroes `requests_served`. Because `requests_since_reset` is `0` immediately after reset, Keploy reports `phase: vs_serving` (`vs_clean` is reported only after at least one request is served with zero misses).

### Stop a detached Virtual Service cleanly

```bash
keploy vs stop --admin http://127.0.0.1:19911
```

`keploy vs stop` invokes `POST /stop`, flushes the miss log (defaulting to `$TMPDIR` or `/tmp` as `keploy-vs-<name>-misses.json`, configurable with `--misses-file`), releases listening ports, and prints the final `=== KEPLOY NEXT ===` summary.

Verbatim output when stopping a Virtual Service started with `--on-miss fail` after 1 miss (exits with code `1`, `tests_failed`):

```text
=== KEPLOY NEXT ===
phase:    vs_misses_detected
summary:  Stopped virtual service cleanly (2 request(s) served, 1 miss(es)).
run:      keploy vs explain-miss --file /tmp/transforms-vserve-e2e-switchoff/vs-misses.json
do:       Misses were flushed to /tmp/transforms-vserve-e2e-switchoff/vs-misses.json. Run `keploy vs explain-miss --file /tmp/transforms-vserve-e2e-switchoff/vs-misses.json` to inspect each miss.
options:
  - explain flushed misses → keploy vs explain-miss --file /tmp/transforms-vserve-e2e-switchoff/vs-misses.json
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until phase=vs_clean (after serving >=1 request with 0 misses) or phase=vs_serving (when detached and ready); stop a detached virtual service with `keploy vs stop --admin <url>`. Never fabricate a 200 response for an unrecorded route.
===================
```

When zero misses occurred (or `onMiss` is `"404"`), `keploy vs stop` exits `0`.

## Diagnose misses with `keploy vs explain-miss`

Run `keploy vs explain-miss` against a running Virtual Service or against a saved `misses.json` file after shutdown:

```bash
keploy vs explain-miss --admin http://127.0.0.1:19911
# Or offline after shutdown:
keploy vs explain-miss --file /tmp/transforms-vserve-e2e-switchoff/vs-misses.json
```

`keploy vs explain-miss` is **read-only and exits `0`** whether it finds `0` misses or `> 0` misses; it communicates status through `phase` (`vs_clean`, `vs_serving`, or `vs_misses_detected`) and structured `failures:` rows. Credential headers (`Authorization`, `Cookie`, `X-Api-Key`, `X-Auth-Token`, etc.) and query secrets are redacted automatically.

Verbatim output when a request sends a non-noise custom header `X-Region: eu-west` instead of recorded `us-east`:

```text
=== KEPLOY NEXT ===
phase:    vs_misses_detected
summary:  Virtual service "downstream-vs-cli" recorded 1 miss(es) across 2 request(s). See per-miss remedies below.
failures:
  - cd23b766: header_mismatch (header.X-Region expected=us-east got=eu-west)  [remedy: field_mismatch]
      FIX: Add drifting request field(s) (header.X-Region) under `noise:` in the virtual service spec, or re-record the updated call.
do:       Review each deterministic miss remedy above (add missing sets to --from, add drifting fields to noise:, or re-record the missing call). Never fabricate a 200 response for an unrecorded route.
options:
  - reset cursors and clear misses → keploy vs reset --admin http://127.0.0.1:19911
  - stop virtual service cleanly → keploy vs stop --admin http://127.0.0.1:19911
protocol: This output uses a NEXT block. Relay `ask` to the dev verbatim and wait; run `run` on yes; loop until phase=vs_clean (after serving >=1 request with 0 misses) or phase=vs_serving (when detached and ready); stop a detached virtual service with `keploy vs stop --admin <url>`. Never fabricate a 200 response for an unrecorded route.
===================
```

### Understand the miss remedy kinds

Every miss reported by `keploy vs explain-miss` carries a deterministic 8-character content hash ID and one of two deterministic remedy kinds:

| `remedy.kind`      | Cause                                                                                          | Recommended action                                                                                                                                                                                         |
| ------------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `unrecorded_route` | No loaded Mock matches the destination, HTTP method, or URL path template                      | Add the recorded Test Set containing that route to `--from` / `source.sets`, or re-record the missing call against the real dependency                                                                     |
| `field_mismatch`   | Route matched a candidate Mock, but a specific header, query parameter, or body field differed | Inspect the named field paths in `failures:`; update the test input to match the recorded flow, add drifting custom headers under `noise.headers` in `virtual-service.yaml`, or re-record the updated call |

## Interpret common `KEPLOY NEXT` outcomes

| `phase`              | When it appears                                                                                     | Next action                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `vs_serving`         | Listeners are ready and `requests_since_reset == 0` (including immediately after `keploy vs reset`) | Drive your consumer tests against the Virtual Service listeners                                |
| `vs_clean`           | `requests_since_reset > 0` and `misses_since_reset == 0`                                            | Consumer suite passed cleanly against recorded Mocks; stop with `keploy vs stop` when done     |
| `vs_misses_detected` | `misses_since_reset > 0`                                                                            | Run `keploy vs explain-miss` and act on each remedy                                            |
| `vs_invalid`         | `virtual-service.yaml` or CLI flags failed validation (exit `1`, `reason: refused`)                 | Fix the reported schema, binding, or admin-auth error and re-run `keploy vs inspect -f <spec>` |
| `vs_error`           | Port already in use, admin URL unreachable, or transport failure (exit `1`, `reason: keploy_error`) | Check port availability, container port mapping, or `KEPLOY_VS_ADMIN_TOKEN`                    |

## Self-hosted and air-gapped

Operating and troubleshooting Virtual Services has zero Keploy API server or cloud replay dependency:

- **Telemetry and update opt-outs:** Export `DO_NOT_TRACK=1` (or set `disableTele: true` in `keploy.yml`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks. Every Admin API endpoint and `keploy vs` command communicates exclusively with your local process or container.
- **Local data residency and redaction:** `/misses`, `misses.json`, `/state`, and Prometheus `/metrics` stay strictly inside your host or container network; credential headers, query secrets, and admin tokens are redacted automatically, and miss history is bounded at 1000 entries.
- **Protected non-loopback admin access:** Any non-loopback `--admin` listener requires a `>= 16`-character `KEPLOY_VS_ADMIN_TOKEN` (else `REFUSE_ADMIN_AUTH_REQUIRED`).
- **Upgrades:** Rebuild your container image with the new Keploy Enterprise CLI binary, monitor `/healthz`, `/readyz`, and `/metrics`, and validate specs offline with `keploy vs inspect -f virtual-service.yaml`.

## Related

- [Understand virtual services](./overview.md)
- [Run a virtual service from recordings](./serve-from-recordings.md)
- [Virtual service specification reference](./reference.md)
- [Drive transforms and virtual services with coding agents](../transforms/coding-agents.md)
