---
id: serve-from-recordings
title: Run a virtual service from recordings
sidebar_label: Serve from recordings
description: Serve recorded plain-HTTP dependencies locally, detached in CI with --on-miss fail and noise.headers, and inside a Docker container built from an inline Dockerfile with KEPLOY_VS_ADMIN_TOKEN.
tags:
  - virtual services
  - keploy mock serve
  - docker
keywords:
  - keploy mock serve
  - keploy vs serve
  - detach ready-file
  - on-miss 404
  - on-miss fail
  - noise.headers
  - KEPLOY_VS_ADMIN_TOKEN
---

# Run a virtual service from recordings

This guide walks through serving recorded plain-HTTP dependencies as standalone Virtual Services—locally from the Keploy Enterprise CLI, detached in CI, and in a Docker container built from an inline `Dockerfile`.

Standalone Virtual Services are available in the Keploy Enterprise CLI binary. `keploy vs serve` is an alias for `keploy mock serve`, so both command prefixes accept the same flags.

## Serve recorded HTTP dependencies locally

### Configure a `virtual-service.yaml` spec

Create a spec file pointing `source.path` and `source.sets` at your Keploy recordings. Custom HTTP headers present on both the recorded mock and live request are compared by default; list any fluctuating custom headers outside the default-ignored transport/tracing set (such as `X-Tenant-Id`) under `noise.headers`:

```yaml
version: keploy.io/v1alpha1
name: downstream-vs-cli
mode: sequence
source:
  path: ./keploy
  sets: [manual]
listen: 127.0.0.1:18084
onMiss: "404"
afterLast: repeat-last
noise:
  headers:
    - X-Tenant-Id
admin:
  listen: 127.0.0.1:19911
```

You can also start directly from CLI flags and save the resolved spec with `--write`:

```bash
keploy mock serve \
  --from manual \
  --source-path ./keploy \
  --host downstream.local \
  --listen 127.0.0.1:18084 \
  --admin 127.0.0.1:19911 \
  --on-miss 404 \
  --write ./downstream-vs.yaml
```

To bind multiple recorded HTTP targets on separate local ports in one process, repeat `--bind <listen-addr>=<recorded-host>`:

```bash
keploy mock serve \
  --from manual \
  --source-path ./keploy \
  --bind 127.0.0.1:8081=product_service:8081 \
  --bind 127.0.0.1:8082=user_service:8082 \
  --admin 127.0.0.1:9901
```

Validate any spec offline before serving:

```bash
keploy vs inspect -f ./downstream-vs.yaml
```

### Run detached in CI and coding-agent workflows

When launching a Virtual Service inside a CI job or from a coding agent, pass `--detach` (and optionally `--ready-file <path>` and `--misses-file <path>`). Keploy waits until `/readyz` succeeds, persists any CLI flag overrides (such as `--on-miss fail`), prints one `vs_serving` block, and exits `0`:

```bash
keploy mock serve -f ./downstream-vs.yaml --detach \
  --on-miss fail --admin 127.0.0.1:19911 \
  --misses-file /tmp/transforms-vserve-e2e-switchoff/vs-misses.json
```

Verbatim CLI output:

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

Send a matching request with a different `X-Tenant-Id` header (`X-Tenant-Id` is not in the default-ignored header list, so it succeeds specifically because `X-Tenant-Id` is configured under `noise.headers`, while non-noise custom header `X-Region` matches the recorded `us-east`):

```bash
curl -i \
  -H "Accept: application/json" \
  -H "X-Tenant-Id: tenant-beta-override" \
  -H "X-Region: us-east" \
  "http://127.0.0.1:18084/v1/profile?user=user-101"
```

That request returns HTTP `200 OK` with the recorded response body.

By contrast, sending a different value for a custom header that is **not** in `noise.headers` (for example, `X-Region: eu-west` instead of recorded `us-east`) triggers a `field_mismatch` miss—returning HTTP `502` under `--on-miss fail` (or HTTP `404` under the default `onMiss: "404"`) with header `X-Keploy-Miss: true` and recording a redacted miss entry:

```bash
curl -i \
  -H "Accept: application/json" \
  -H "X-Tenant-Id: tenant-alpha" \
  -H "X-Region: eu-west" \
  "http://127.0.0.1:18084/v1/profile?user=user-101"
```

Inspect misses and stop the detached service:

```bash
keploy vs explain-miss --admin http://127.0.0.1:19911
keploy vs stop --admin http://127.0.0.1:19911
```

Because `--on-miss fail` was set and 1 miss occurred, `keploy vs stop` flushes the misses file, prints `phase: vs_misses_detected`, and exits with code `1` (`tests_failed`).

## Choose miss policies and header matching noise

### Choose `--on-miss`: `404` or `fail`

Configure `onMiss` in your `virtual-service.yaml` spec or override it with `--on-miss` on the CLI. Standalone Virtual Services **never** inherit `mock.onMiss` from `keploy.yml`.

| Policy (`--on-miss` / `onMiss`) | Behavior on unmatched request                                                            | Exit code on foreground shutdown / `keploy vs stop` |
| ------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------- |
| `404` _(default)_               | Returns HTTP `404` with header `X-Keploy-Miss: true` and records a structured miss entry | `0`                                                 |
| `fail`                          | Returns HTTP `502` with header `X-Keploy-Miss: true` and marks the run failed            | `1` (`tests_failed`) when `misses_count > 0`        |

### Tune header matching noise (`noise.headers`)

Plain-HTTP sequence matching compares:

- HTTP method and path.
- Query parameters and request body fields (up to the 10 MiB request body cap; `noise.query` and `noise.body` tuning is coming).
- Custom HTTP headers present on both the recorded mock and the live request, **except** for:
  - Credential headers (such as `Authorization`, `Cookie`, `X-Api-Key`, `X-Auth-Token`),
  - Headers listed under `noise.headers` (case-insensitive), and
  - Keploy's built-in `defaultIgnoredHeaders` list (27 standard transport and tracing headers): `accept`, `accept-encoding`, `accept-language`, `cache-control`, `connection`, `content-length`, `date`, `host`, `keep-alive`, `pragma`, `te`, `traceparent`, `tracestate`, `transfer-encoding`, `upgrade`, `user-agent`, `x-b3-parentspanid`, `x-b3-sampled`, `x-b3-spanid`, `x-b3-traceid`, `x-correlation-id`, `x-forwarded-for`, `x-forwarded-host`, `x-forwarded-proto`, `x-keploy-session`, `x-real-ip`, and `x-request-id`.

Because `X-Correlation-Id` and `X-Request-Id` are already in `defaultIgnoredHeaders`, you only need to add custom application headers outside that list (such as `X-Tenant-Id` or `X-Region`) to `noise.headers`.

## Build and run a Virtual Service container in Docker

No pre-built Virtual Service image is published on Docker Hub. Download the Linux Keploy Enterprise CLI binary (`https://keploy.io/ent/dl/latest/enterprise_linux_${ARCH}`—see [Install Keploy Enterprise](../concepts/installation.md#on-linux), or pull it from your internal artifact mirror in air-gapped environments) and package it into a minimal container image using this 4-line `Dockerfile`. Released Linux binaries are statically linked; `debian:13-slim` is the tested base image (add a non-root `USER` line if required by your cluster security policy):

```dockerfile
ARG BASE_IMAGE=debian:13-slim
FROM ${BASE_IMAGE}
COPY keploy /usr/local/bin/keploy
ENTRYPOINT ["/usr/local/bin/keploy"]
```

Place your `keploy` Enterprise binary in the build context directory and build the image (in air-gapped environments, pass `--build-arg BASE_IMAGE=<your-mirror>/debian:13-slim` to avoid pulling from Docker Hub):

```bash
chmod +x ./keploy
docker build --build-arg BASE_IMAGE=debian:13-slim -t keploy-vs:local .
# Air-gapped mirror example:
# docker build --build-arg BASE_IMAGE=registry.internal.example/debian:13-slim \
#   -t registry.internal.example/keploy/keploy-vs:local .
```

Create a container spec `vs-container.yaml` with explicit `source.path: /var/lib/keploy/mocks` and container-reachable listeners:

```yaml
version: keploy.io/v1alpha1
name: downstream-vs-docker
mode: sequence
source:
  path: /var/lib/keploy/mocks
  sets: [manual]
listen: 0.0.0.0:18085
onMiss: "404"
afterLast: repeat-last
noise:
  headers:
    - X-Tenant-Id
admin:
  listen: 0.0.0.0:19915
```

Because `admin.listen` binds off loopback (`0.0.0.0:19915`), you **must** supply `KEPLOY_VS_ADMIN_TOKEN` with at least `16` characters—otherwise `keploy mock serve` refuses startup with `REFUSE_ADMIN_AUTH_REQUIRED`.

Run the container with recordings and spec mounted read-only:

```bash
docker run -d --name downstream-vs-docker \
  -p 127.0.0.1:18085:18085 \
  -p 127.0.0.1:19915:19915 \
  -e DO_NOT_TRACK=1 \
  -e KEPLOY_DISABLE_AUTO_UPDATE=1 \
  -e KEPLOY_VS_ADMIN_TOKEN="replace-with-at-least-16-char-token" \
  -v "$(pwd)/keploy:/var/lib/keploy/mocks:ro" \
  -v "$(pwd)/vs-container.yaml:/etc/keploy/vs.yaml:ro" \
  keploy-vs:local mock serve -f /etc/keploy/vs.yaml
```

Verify readiness, data-plane serving, and Admin API bearer authentication:

```bash
curl -fsS http://127.0.0.1:19915/readyz
curl -i \
  -H "Accept: application/json" \
  -H "X-Tenant-Id: docker-noise-check" \
  -H "X-Region: us-east" \
  "http://127.0.0.1:18085/v1/profile?user=user-101"

# Admin API enforces KEPLOY_VS_ADMIN_TOKEN (401 without token, 200 with valid token)
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:19915/state
curl -fsS -H "Authorization: Bearer replace-with-at-least-16-char-token" \
  http://127.0.0.1:19915/state
```

When finished, stop the Virtual Service gracefully via the authenticated Admin API and remove the container:

```bash
KEPLOY_VS_ADMIN_TOKEN="replace-with-at-least-16-char-token" \
  keploy vs stop --admin http://127.0.0.1:19915
docker rm -f downstream-vs-docker
```

## Self-hosted and air-gapped

Running Virtual Services from recordings has zero Keploy API server or cloud replay dependency:

- **Telemetry and update opt-outs:** Set `DO_NOT_TRACK=1` (or `disableTele: true` in `keploy.yml`) and `KEPLOY_DISABLE_AUTO_UPDATE=1` in your container environment to disable startup telemetry and update checks.
- **Air-gapped container builds:** Build from the inline 4-line `Dockerfile` above with `--build-arg BASE_IMAGE=<your-mirror>/debian:13-slim` and push the resulting image to your internal container registry.
- **Mandatory non-loopback admin auth:** Any container binding `admin.listen` off loopback (such as `0.0.0.0:19915` or `:9901`) requires `KEPLOY_VS_ADMIN_TOKEN` (`>= 16` characters), verified with constant-time comparison on all routes except `/healthz` and `/readyz`.
- **Upgrades:** Replace the `keploy` binary in your build context, rebuild your image, and validate specs offline with `keploy vs inspect -f vs-container.yaml`.

## Related

- [Understand virtual services](./overview.md)
- [Operate and troubleshoot virtual services](./admin-api-and-troubleshooting.md)
- [Virtual service specification reference](./reference.md)
