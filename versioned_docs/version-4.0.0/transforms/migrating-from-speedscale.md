---
id: migrating-from-speedscale
title: Migrate from Speedscale to Keploy
sidebar_label: Migrate from Speedscale
description: Honest feature-by-feature mapping from Speedscale extractors, transform chains, Traffic Transform Templates (TTT), proxymock blueprints, and responder-only mocks to Keploy Replay Transforms and Virtual Services, including current coverage and upcoming items.
tags:
  - speedscale
  - migration
  - transforms
  - virtual services
  - proxymock
keywords:
  - migrate from speedscale
  - speedscale to keploy
  - speedscale transforms mapping
  - proxymock blueprint to keploy.yml
  - responder-only keploy mock serve
---

# Migrate from Speedscale to Keploy

If your team currently uses Speedscale Traffic Transform Templates (TTT), `proxymock` blueprints, or responder-only mocks, you can map symmetric JWT re-signing and plain-HTTP responder workflows onto Keploy Replay Transforms (`transforms:` in `keploy.yml`) and Virtual Services (`keploy mock serve` / `keploy vs`). Both features are available in the Keploy Enterprise CLI binary.

This guide maps Speedscale concepts, extractors, transform steps, and responder modes to their Keploy equivalents, and states clearly what is available today versus what is coming next.

## Map configuration and workflows

| Speedscale concept                                                          | Keploy equivalent                            | Status & notes                                                                                                                                                                                                                                                                                                             |
| --------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Traffic Transform Template (TTT) / `proxymock/blueprints/<id>.json`         | `transforms:` in `keploy.yml`                | **Available now** for `keploy test` (symmetric `jwt.resign` on HTTP request headers); validated offline with `keploy transforms list` and `keploy transforms schema`                                                                                                                                                       |
| `generator` RRPair request chain                                            | `at: test.request`                           | **Available now** for plaintext HTTP request headers (`header.<Name>`) during `keploy test`; runs before Keploy sends the recorded request to your application (encrypted `ENC:` recordings with transforms are coming)                                                                                                    |
| `responder` RRPair response chain                                           | `at: mock.answer`                            | **Coming**                                                                                                                                                                                                                                                                                                                 |
| `responder` RRPair request chain (signature tuning in standalone responder) | `noise.headers` in `virtual-service.yaml`    | **Available now** for custom HTTP header matching in `keploy mock serve` (`noise.query` and `noise.body` are coming). Custom HTTP headers present on both the recorded mock and live request are compared by default; list drifting custom headers such as `X-Tenant-Id` under `noise.headers`                             |
| `proxymock transform test`                                                  | `keploy transforms test --set <set>`         | **Available now**; offline dry-run before/after preview with secrets and JWT signatures redacted                                                                                                                                                                                                                           |
| `responder-only` mode / `proxymock mock`                                    | `keploy mock serve` (`keploy vs serve`)      | **Available now** for plain-HTTP/1.1 sequence mode (`afterLast: repeat-last`, `onMiss: "404" \| "fail"`) with the `:9901` Admin API. _Coming:_ HTTPS/TLS VS, database/MySQL/PostgreSQL/gRPC VS, Kubernetes manifest generation, named scenarios, `afterLast: wrap`, `onMiss: passthrough`, `--mock-timing`, and hot reload |
| `proxymock match-rate analyze` / `accept` / `undo`                          | `keploy vs explain-miss (--admin \| --file)` | **Partial** (`keploy vs explain-miss` provides deterministic, read-only miss explanations with `unrecorded_route` and `field_mismatch` remedies; there is no `accept` or `undo` command today)                                                                                                                             |
| Cursor reset between test runs                                              | `keploy vs reset --admin <url>`              | **Available now**; rewinds sequence cursors and clears recorded misses in place (does **not** regenerate mocks from traffic)                                                                                                                                                                                               |
| WireMock / Speedscale TTT & blueprint importer                              | Automated importer                           | **Coming**; migrate rules manually using the tables below today                                                                                                                                                                                                                                                            |

## Map extractors to Keploy places

Speedscale uses named extractors (`http_req_header`, `req_body` + `json_path`, `http_queryparam`, `http_url`). Keploy uses an explicit `extract:` place syntax:

| Speedscale extractor + path                                                 | Keploy `extract:` (+ codec)                                                                              | Status                                 |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `http_req_header` (`Authorization`)                                         | `header.Authorization` (with `- bearer` codec when stripping `Bearer `)                                  | **Available now** (`at: test.request`) |
| `http_res_header` (`Date`)                                                  | `header.Date` under `at: mock.answer`                                                                    | **Coming**                             |
| `http_queryparam` (`since`)                                                 | `url.query.since`                                                                                        | **Coming**                             |
| `http_url` + `split("/", n)`                                                | `url.path[n]`                                                                                            | **Coming**                             |
| `req_body` + `json_path("items[0].id")`                                     | `body.items[0].id` (bracket `[0]` array indexing)                                                        | **Coming**                             |
| `res_body` + `json_path("quotes[*].validUntil")`                            | `body.quotes[*].validUntil`                                                                              | **Coming**                             |
| `http_req_cookie` (`session`) / decode pipes (`\|cookie`, `\|b64`, `\|pct`) | Piped `extract` and non-header `propagate.use` values are refused at load time (`REFUSE_INVALID_CONFIG`) | **Coming**                             |

## Map transform steps

| Speedscale transform                                                 | Keploy equivalent                                                                                                                                                                                             | Status                                                                                                                                                              |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `jwt_resign` (`HS256`/`HS384`/`HS512`)                               | `jwt.resign` with `key: ${secret:NAME}`, default `keyEncoding: raw`, `alg: recorded`, `claims: { iat: now, exp: now+1h }` (`base64`/`hex` and `${env:}`/`${file:}` are coming)                                | **Available now**                                                                                                                                                   |
| `jwt_resign` (`RS*`/`ES*`/`EdDSA`)                                   | Asymmetric `jwks-swap`                                                                                                                                                                                        | **Coming**                                                                                                                                                          |
| `date` / `date_shift`                                                | `time.shift`                                                                                                                                                                                                  | **Coming**                                                                                                                                                          |
| `constant` / `replace`                                               | `set`                                                                                                                                                                                                         | **Coming**                                                                                                                                                          |
| `smart_replace_recorded` (forwarded `test.request` headers)          | `propagate.targets` targeting explicit plaintext HTTP Mock places (such as whole `header.Authorization`, under `KEPLOY_PROVEN=1`) + Keploy template captures (`{{capture string .k}}`) and learned minted IDs | **Partial** (`test.request` -> plaintext HTTP Mock forwarding available now; encrypted `ENC:` propagation and `mock.request` capture/echo are coming)               |
| `var_store` / `var_load` across tests                                | `keploy templatize` (`{{capture string .k}}` / `{{string .k}}`)                                                                                                                                               | **Available now**                                                                                                                                                   |
| `scrub` / `scrub_date` / `store_sig` / `delete_sig`                  | `noise.headers` in `virtual-service.yaml`                                                                                                                                                                     | **Partial** (`noise.headers` is available now for standalone Virtual Services; `noise.query`, `noise.body`, and scoped `mock.noise:` for in-path replay are coming) |
| `csv` / `dataframe` / `smart_replace_csv` / `one_of` / `rand_string` | Data-table `map`, `one_of`, `rand_string`                                                                                                                                                                     | **Coming**                                                                                                                                                          |
| `token_fetch` / `aws_auth`                                           | Live-egress token helpers (disabled automatically in air-gapped environments)                                                                                                                                 | **Coming**                                                                                                                                                          |

## Compare key behavioral differences

When porting JWT chains and HTTP responders from Speedscale to Keploy, keep six design differences in mind:

1. **Sequence exhaustion policy (`repeat-last`):** Speedscale's responder cycles through multiple recorded responses round-robin. Keploy Virtual Services currently clamp at the final recorded response (`afterLast: repeat-last`); call `keploy vs reset` (`POST /reset`) between runs to rewind sequence cursors (`afterLast: wrap` is coming).
2. **Custom HTTP headers are matched by default in Virtual Services:** Plain-HTTP Virtual Services compare custom headers present on both the recorded mock and live request (ignoring standard transport/tracing headers and credential headers). List fluctuating custom headers such as `X-Tenant-Id` under `noise.headers` in `virtual-service.yaml`.
3. **Explicit propagation instead of value-equality scan:** Speedscale's `smart_replace` scans entire RRPairs for matching strings. Keploy avoids accidental substring collisions by requiring explicit `propagate.targets` (such as whole `header.Authorization` under `KEPLOY_PROVEN=1`) for forwarded tokens, template captures (`keploy templatize`) for inter-test IDs, and learned minted IDs.
4. **Hard assertion safety:** Keploy never lets a transform rewrite an expected response status or expected response body, and never loosens matching as a side effect of a transform. Runtime transform failures fail the Test Case unsent (`TEST_CASE_REFUSED`).
5. **Clock-freeze coordination:** `jwt.resign` combines the agent's time-freeze verification state, replay clock window reader, and recorded request timestamp so `iat: now` and `exp: now+1h` align with the clock your application observes (including under `KEPLOY_PROVEN=1`, which enforces clock freeze on by default).
6. **Standalone Virtual Service lifecycle:** `keploy mock serve` configures `onMiss` directly in `virtual-service.yaml` or via `--on-miss 404|fail` (default `"404"` with `X-Keploy-Miss: true`; never inherits `mock.onMiss` from `keploy.yml`), exposes the `:9901` Admin API (`/healthz`, `/readyz`, `/state`, `/misses`, `/reset`, `/stop`, `/shutdown`, `/metrics`), and defaults to one isolated Virtual Service per CI job (`partitionBy: none`).

## Port a Speedscale JWT chain to `keploy.yml`

**Speedscale blueprint snippet** (using Speedscale's `${{secret:NAME/KEY}}` syntax):

```json
{
  "extractor": {"type": "http_req_header", "config": {"name": "Authorization"}},
  "transforms": [
    {
      "type": "jwt_resign",
      "config": {"secret": "${{secret:app-secrets/JWT_SECRET}}"}
    }
  ]
}
```

**Equivalent Keploy `keploy.yml`:**

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
    propagate:
      targets:
        - match:
            kind: Http
            host: downstream.local
          use:
            - header.Authorization
```

Validate and preview the migrated configuration offline before running tests:

```bash
keploy transforms list
keploy transforms test --set manual
```

## Self-hosted and air-gapped

- **Offline transforms inspection and Virtual Services:** `keploy transforms list|test|schema`, `keploy mock serve`, and `keploy vs` run locally without a Keploy API server. Export `DO_NOT_TRACK=1` (or set `disableTele: true` in `keploy.yml`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1` to disable startup telemetry and update checks.
- **Telemetry and update opt-outs:** Set `disableTele: true` in `keploy.yml` (or export `DO_NOT_TRACK=1`) together with `KEPLOY_DISABLE_AUTO_UPDATE=1`. For self-hosted `keploy test` runs, authenticate against your cluster with `--k8s-proxy-url` or `KEPLOY_K8S_PROXY_URL` (or `keploy login --k8s-proxy-url <url>`—sign-in checks the flag, environment variable, or saved login before `keploy.yml` is loaded; or use a self-hosted Keploy Enterprise binary built for your internal API server) and set `test.disableReportUpload: true` in `keploy.yml` as needed.
- **Containerized Virtual Services:** Build your own container image from the inline `Dockerfile` in [Run a virtual service from recordings](../virtual-services/serve-from-recordings.md) using your private base image mirror (`--build-arg BASE_IMAGE=<your-mirror>/debian:13-slim`), mount your spec and recordings read-only, and set a `>= 16`-character `KEPLOY_VS_ADMIN_TOKEN` when binding `--admin` off loopback.
- **Upgrades:** Rebuild your container image after upgrading the Keploy Enterprise CLI binary, and validate configs offline with `keploy transforms list` and `keploy vs inspect -f virtual-service.yaml`.

## Related

- [Understand replay transforms](./overview.md)
- [Re-sign expired JWTs during replay](./how-to-resign-jwt.md)
- [Understand virtual services](../virtual-services/overview.md)
- [Run a virtual service from recordings](../virtual-services/serve-from-recordings.md)
- [Transforms reference](./reference.md)
