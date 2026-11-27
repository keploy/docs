---
id: overview
title: Understand virtual services
sidebar_label: Overview
description: Run recorded plain-HTTP APIs as standalone, network-addressable Virtual Services with zero eBPF and zero root—isolated per CI job or environment via keploy mock serve and keploy vs.
tags:
  - virtual services
  - service virtualization
  - mocks
  - keploy mock serve
  - keploy vs
keywords:
  - keploy virtual services
  - keploy mock serve
  - keploy vs
  - sequence mode virtual service
  - standalone mock server
  - self-hosted virtual service
---

# Understand virtual services

A **Virtual Service** turns recorded HTTP Mocks into a standalone, network-addressable plain-HTTP/1.1 server that any application, test suite, or preview environment can call over standard TCP.

Unlike in-path replay (`keploy test` or `keploy mock replay`), a standalone Virtual Service requires **zero eBPF and zero root privileges**. You point your application or test environment at the Virtual Service's host and port (for example, `http://127.0.0.1:18084` or a container port), and Keploy answers calls directly from recorded HTTP Mocks. Standalone Virtual Services are available in the Keploy Enterprise CLI binary; open-source `keploy` does not include `keploy mock serve` or `keploy vs`.

## Compare standalone Virtual Services with in-path replay Mocks

Keploy keeps in-path replay and standalone Virtual Services as distinct product surfaces with clear boundaries:

| Capability                     | In-path replay (`keploy test`, `keploy mock replay`)                         | Standalone Virtual Service (`keploy mock serve` / `keploy vs`)                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **How traffic is intercepted** | Keploy intercepts calls transparently from the wrapped app or test process   | Direct plain-HTTP network listener (`--listen` / `--bind`); clients connect directly by host and port                                                                                         |
| **Privileges required**        | eBPF agent on Linux (root / capabilities); user-space proxy on macOS/Windows | **Zero eBPF, zero root**—runs as an unprivileged process or container anywhere                                                                                                                |
| **Mock serving policy**        | Serves mocks scoped to the active test run                                   | Standalone server with `onMiss: "404"` (default, returns `404` + `X-Keploy-Miss: true`) or `onMiss: "fail"` (`502` + non-zero exit on stop), never inheriting `mock.onMiss` from `keploy.yml` |
| **Matching mode**              | Supports both default and `KEPLOY_PROVEN=1` per-test scoping                 | Un-windowed HTTP sequence matching with `noise.headers` tuning (`noise.query` and `noise.body` are coming)                                                                                    |
| **Lifecycle control**          | Starts and stops with the test command                                       | Long-running or `--detach` with live Admin API (`:9901`) for `/healthz`, `/readyz`, `/state`, `/misses`, `/reset`, `/stop`, `/shutdown`, and `/metrics`                                       |
| **Best suited for**            | Unit, integration, and regression tests wrapping a single service or suite   | Shared sandbox environments, paid/rate-limited third-party HTTP APIs, and multi-service CI jobs                                                                                               |

## Understand sequence mode

Virtual Services currently run in **sequence mode** (`mode: sequence`, `source.order: timestamp`, `afterLast: repeat-last`):

- Answers incoming plain-HTTP/1.1 requests from recorded HTTP Mocks in recorded timestamp order.
- When the same matching request arrives multiple times, a per-signature cursor steps through recorded responses in order and then repeats the final recorded response (`afterLast: repeat-last`).
- Reset all cursors and miss logs between test suites with `keploy vs reset` (`POST /reset`).
- Custom HTTP headers present on both the recorded mock and the live request are compared by default (standard transport/tracing headers and credential headers are skipped automatically). List fluctuating custom headers under `noise.headers` in your Virtual Service spec.
- Enforces built-in resource bounds: 10 MiB request body cap, 1000-miss cap, and automatic credential redaction in `/misses` and `misses.json`.

## Isolate one Virtual Service per CI job or environment

Every Virtual Service sets `partitionBy: none` and runs **one dedicated instance per CI job or test environment** (header-based partitioning `partitionBy: header:<Name>` is coming and refused at load time in the current release):

- **Zero application header changes:** Consumers never need to inject custom routing or session headers to separate concurrent CI pipelines.
- **Deterministic state:** Each CI job owns its own sequence cursors and miss log, and calls `POST /reset` cleanly between test suites.

## Check protocol support and roadmap

| Capability / protocol                                                                           | Status            | Notes                                                                                                                                                           |
| ----------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Plain-HTTP/1.1 sequence mode**                                                                | **Available now** | Supports `--on-miss 404\|fail`, `afterLast: repeat-last`, `partitionBy: none`, `noise.headers`, `:9901` Admin API, Prometheus `/metrics`, and Docker containers |
| **Query & body matching noise (`noise.query`, `noise.body`) and `partitionBy: header:<Name>`**  | **Coming**        | Refused at load time in the current release; planned for upcoming releases                                                                                      |
| **HTTPS / TLS, HTTP/2, and Java JSSE truststore export**                                        | **Coming**        | Planned for upcoming releases                                                                                                                                   |
| **Named scenarios (`vs scenario`), `afterLast: wrap`, and `onMiss: passthrough`**               | **Coming**        | Planned for upcoming releases                                                                                                                                   |
| **Kubernetes manifest generator (`vs manifest`)**                                               | **Coming**        | Planned for upcoming releases; use the inline `Dockerfile` and `docker run` pattern today                                                                       |
| **HTTP/JSON CRUD state mode**                                                                   | **Coming**        | Planned for upcoming releases                                                                                                                                   |
| **Database & queue sequence mode (MySQL, PostgreSQL, MongoDB, Redis, Aerospike, Pulsar, gRPC)** | **Coming**        | Planned for upcoming releases                                                                                                                                   |

## Self-hosted and air-gapped

Standalone Virtual Services have zero Keploy API server or cloud replay dependency:

- **Telemetry and update opt-outs:** Export `DO_NOT_TRACK=1` (or set `disableTele: true` in `keploy.yml`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Build your own minimal container image:** Package your Keploy Enterprise binary using the inline 4-line `Dockerfile` in [Run a virtual service from recordings](./serve-from-recordings.md) and pass `--build-arg BASE_IMAGE=<your-mirror>/debian:13-slim` in air-gapped networks.
- **Protected non-loopback Admin API:** Binding `--admin` off loopback (for example, `0.0.0.0:19915` inside a container) requires `KEPLOY_VS_ADMIN_TOKEN` with at least `16` characters; otherwise startup is refused with `REFUSE_ADMIN_AUTH_REQUIRED`.
- **Upgrades:** Rebuild your container image after upgrading the Keploy Enterprise CLI binary, and validate specs offline with `keploy vs inspect -f virtual-service.yaml` and `keploy vs schema`.

## Next steps

- [Run a virtual service from recordings](./serve-from-recordings.md): Start plain-HTTP Virtual Services locally, detached in CI, and in Docker containers.
- [Operate and troubleshoot virtual services](./admin-api-and-troubleshooting.md): Use the `:9901` Admin API, `keploy vs explain-miss`, `keploy vs reset`, and `keploy vs stop`.
- [Virtual service specification reference](./reference.md): Inspect `virtual-service.yaml`, CLI flags, Admin API endpoints, Prometheus metrics, refusal codes, and `vs` NEXT phases.
