---
id: static-deduplication
title: Static Deduplication
sidebar_label: Static Deduplication
description: Drop schema-identical live traffic at record time so only distinct request shapes become test cases. Configure per-endpoint value-aware dedup with custom fields.
tags:
  - deduplication
  - recording
  - enterprise
  - schema
  - live recording
keywords:
  - static dedup
  - static-dedup
  - schema deduplication
  - custom dedup fields
  - recording dedup
  - keploy enterprise
  - dedup stats
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Why Static Deduplication?

In high-traffic environments, the same request shape repeats thousands of times a minute. Recording every copy inflates your test suite, bloats storage, and buries interesting edge cases under noise.

**Static Deduplication** filters this at the source. While a recording is active, the Keploy agent computes a lightweight **schema signature** for each captured request/response pair and drops any copy whose signature has already been seen in this session. Only distinct request shapes ever become test cases.

Unlike [coverage-based deduplication](/docs/keploy-cloud/deduplication/)—which runs _after_ a replay and removes tests that do not add code coverage—static dedup operates _during_ recording and is schema-based, so:

- It works on any stack. No code-coverage instrumentation, no Go toolchain in the runtime image, no rebuild of your app.
- It is cheap. A hash per request; no disk-bound YAML post-processing.
- It stops the problem upstream. Duplicate traffic is never written to storage in the first place.

## How the schema signature is built

For every captured transaction the agent hashes:

1. **HTTP method**
2. **Normalised URL path.** Numeric IDs, UUIDs, and path segments longer than 20 characters are replaced with `{id}`. For example, `/orders/42`, `/orders/550e8400-e29b-41d4-a716-446655440000`, and `/orders/507f1f77bcf86cd799439011` collapse into the same endpoint. Short strings such as `/orders/abc123` are not treated as IDs.
3. **Sorted request-header keys** (names only, not values).
4. **Response status code.**
5. **Sorted response-header keys.**
6. **Request and response body schema hashes.** For JSON bodies, the agent recursively infers each field's type (`S`, `I`, `F`, `B`, `O`, `N`, or `AS`/`AI`/`AF`/`AB`/`AO`/`AN` for arrays) and combines them with an order-independent XOR—so `{"a":1,"b":"x"}` and `{"b":"y","a":2}` produce the same signature, but `{"a":1}` and `{"a":"1"}` do not.

The first occurrence of a signature is recorded. Every later occurrence is silently dropped.

## Usage

Enable static dedup when you start a recording. Pick the flow that matches how you run Keploy.

### Keploy enterprise CLI

Add `--static-dedup` to `keploy record`:

```bash
keploy enterprise record -c "docker compose up" --containerName orders-api --static-dedup
```

The agent reports it is active in the startup logs and begins filtering on the first captured request.

### `keploy.yml`

Persist it alongside your other recording options:

```yaml
record:
  static-dedup: true

agent:
  static-dedup: true
  # Optional: sharpen dedup on specific endpoints—see below.
  custom-dedup-fields:
    - method: POST
      path: /orders
      statusCode: 201
      fields:
        - response.status
        - request.currency
```

`record.static-dedup` enables the feature for `keploy record`; `agent.static-dedup` (and `agent.custom-dedup-fields`) are forwarded to the agent process so it applies the filter in real time.

### Kubernetes Proxy

When driving recordings through the Kubernetes Proxy REST API, set `static_dedup: true` in the `record_config` block of `POST /record/start`:

```bash
curl -s -X POST "$PROXY/record/start" \
  -H "Authorization: Bearer $K8S_PROXY_SHARED_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "default",
    "deployment": "orders-api",
    "podsCount": 3,
    "clusterId": "prod-use1",
    "record_config": { "static_dedup": true }
  }'
```

The same session will stream a `static_dedup_stats` array in its `/record/status` updates so you can watch dedup effectiveness live from the Keploy Console.

## Custom dedup fields (value-aware dedup)

The default signature is **shape-based**: two POST `/orders` requests with the same JSON field types collapse, even if their values differ. That is usually what you want—but sometimes distinct _values_ represent distinct behaviour you want to capture (e.g. `response.status: "SUCCESS"` vs `"REFUNDED"`).

Configure `custom-dedup-fields` to append a value-based fingerprint to the signature for matching endpoints:

```yaml
agent:
  static-dedup: true
  custom-dedup-fields:
    - method: POST
      path: /orders/{id}/refund
      statusCode: 200
      fields:
        - response.status # look in response body
        - request.currency # look in request body
        - customerTier # try request body, then response body
```

**Field-path rules:**

- `request.X`—resolve `X` (dot-notated) in the request body.
- `response.X`—resolve it in the response body.
- Bare `X`—try the request body first, fall back to the response body.
- Missing or non-JSON fields contribute a `__MISSING__` sentinel, so _present-but-empty_ stays distinct from _absent_.

Paths are matched case-insensitively on method, and the URL path uses the same normalisation as the base signature—so `/orders/42/refund` in traffic matches `/orders/{id}/refund` in config.

You can also pass this from the CLI as JSON:

```bash
keploy enterprise record --static-dedup \
  --custom-dedup-fields='[{"method":"POST","path":"/orders/{id}/refund","statusCode":200,"fields":["response.status","request.currency"]}]' \
  -c "docker compose up"
```

For Kubernetes Proxy recordings, custom fields are sent in `record_config.custom_dedup_fields` and passed to the injected agent with the recording session. Updating the config applies to newly started or restarted agent processes.

## Observe dedup effectiveness

The agent exposes a live stats endpoint when static dedup is enabled:

```bash
curl -s http://<agent-host>:<port>/dedup/stats | jq
```

```json
[
  {
    "method": "POST",
    "url": "/orders",
    "status_code": 201,
    "total_count": 14832,
    "duplicate_count": 14816,
    "schema_key": "POST|/orders|content-type_authorization|201|content-type|17834...|93482..."
  },
  {
    "method": "GET",
    "url": "/orders/{id}",
    "status_code": 200,
    "total_count": 4201,
    "duplicate_count": 4198,
    "schema_key": "GET|/orders/{id}|authorization|200|content-type|0|81921..."
  }
]
```

- `total_count`—how many times this signature was seen.
- `duplicate_count`—how many of those were dropped (always `total_count - 1` when the first was recorded).

When static dedup is disabled, `/dedup/stats` is not available for that agent. Depending on how the agent was started, callers may see a `404` route-not-found response or `static dedup disabled`. Through the Kubernetes Proxy, the same data is embedded in each `/record/status` event as `static_dedup_stats`, so you rarely need to call `/dedup/stats` directly.

## When should I use this?

- **Live traffic capture in prod or pre-prod.** Recording a service behind a load balancer without dedup almost always produces a pile of nearly identical tests. Static dedup keeps the suite small and focused.
- **Noisy background jobs.** Cron pings, health checks, retry storms—all collapse to one test each.
- **Any environment where rebuilding with coverage wiring is impractical** (polyglot services, third-party images, read-only runtimes). Coverage-based dedup requires language-specific runtime setup inside the image or launch command; static dedup does not.

Pair with [recording filters](/docs/running-keploy/recording-filters/) when you want to _exclude_ known traffic entirely (e.g. `/health`) rather than collapse it to one sample.

## Related guides

- [Dynamic Deduplication (coverage-based dedup)](/docs/keploy-cloud/deduplication/)—post-replay dedup with `keploy dedup`.
- [Recording filters](/docs/running-keploy/recording-filters/)—exclude traffic before it reaches dedup.
- [Configuration file](/docs/running-keploy/configuration-file/)—all `keploy.yml` options in one place.
