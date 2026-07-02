---
id: static-deduplication
title: Static Deduplication
sidebar_label: Static Deduplication
description: Drop schema-identical live traffic at record time so only distinct request shapes become test cases. Mark fields with custom-dedup-fields to keep value-distinct traffic and surface observed values as enums in the generated OpenAPI schema.
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
  - openapi enum
  - schema enum generation
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
```

`record.static-dedup` enables the feature for `keploy record`; `agent.static-dedup` is forwarded to the agent process so it applies the filter in real time.

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

## Custom dedup fields → OpenAPI enum values

Marking specific request or response fields with `custom-dedup-fields` does two things during a recording:

1. **Sharper signatures.** Values from those fields are appended to the dedup hash, so two requests with the same shape but different marked-field values stay as distinct test cases instead of collapsing into one.
2. **Enum-aware schema generation.** When auto-replay generates the OpenAPI document for the recorded service, the distinct scalar values observed for each marked field are emitted as an `enum` array on the matching response (or request) property—turning the dedup hints into machine-readable contract documentation.

### Configure marked fields

Add a `custom-dedup-fields` block under `agent:` in `keploy.yml`:

```yaml
agent:
  static-dedup: true
  custom-dedup-fields:
    - method: GET
      path: /products/{id}
      statusCode: 200
      fields:
        - response.product_id
    - method: GET
      path: /api/v1/data
      statusCode: 200
      fields:
        - response.version
```

For Kubernetes Proxy recordings, send the same list inside `record_config.custom_dedup_fields` on `POST /record/start`. Updating the config applies to newly started or restarted agent processes.

Field-path rules:

- `request.X`—resolve `X` (dot-notated) in the request body.
- `response.X`—resolve it in the response body.
- Bare `X`—try the request body first, fall back to the response body.
- Path matching uses the same `{id}` normalisation as the base signature, so `/products/42` in traffic matches `/products/{id}` in config. Method matching is case-insensitive.

You can also pass the same JSON via the CLI:

```bash
keploy enterprise record --static-dedup \
  --custom-dedup-fields='[{"method":"GET","path":"/products/{id}","statusCode":200,"fields":["response.product_id"]}]' \
  -c "docker compose up"
```

### What ends up in the schema

Suppose the recorded session captures these `GET /products/{id}` responses across the run:

```text
GET /products/1   → { "name": "...", "price": ..., "product_id": "1"   }
GET /products/42  → { "name": "...", "price": ..., "product_id": "42"  }
GET /products/999 → { "name": "...", "price": ..., "product_id": "999" }
```

After auto-replay, the OpenAPI document Keploy generates for the service includes an `enum` listing every distinct value observed for the marked field:

```json
"GetProducts200Response": {
  "properties": {
    "name":  { "type": "string" },
    "price": { "type": "number" },
    "product_id": {
      "enum": ["1", "42", "999"],
      "type": "string"
    }
  },
  "type": "object"
}
```

Without the `custom-dedup-fields` entry the property would be `"product_id": { "type": "string" }`—the inferred type is still correct, but the discrete value space is lost. The same generated document is what the **Schemas** section of the Keploy console renders, so the enum values are visible directly in the UI.

## When should I use this?

- **Live traffic capture in prod or pre-prod.** Recording a service behind a load balancer without dedup almost always produces a pile of nearly identical tests. Static dedup keeps the suite small and focused.
- **Noisy background jobs.** Cron pings, health checks, retry storms—all collapse to one test each.
- **Any environment where rebuilding with coverage wiring is impractical** (polyglot services, third-party images, read-only runtimes). Coverage-based dedup requires language-specific runtime setup inside the image or launch command; static dedup does not.

Pair with [recording filters](/docs/running-keploy/recording-filters/) when you want to _exclude_ known traffic entirely (e.g. `/health`) rather than collapse it to one sample.

## Related guides

- [Remove Duplicate Tests (coverage-based dedup)](/docs/keploy-cloud/deduplication/)—post-replay dedup with `keploy dedup`.
- [Recording filters](/docs/running-keploy/recording-filters/)—exclude traffic before it reaches dedup.
- [Configuration file](/docs/running-keploy/configuration-file/)—all `keploy.yml` options in one place.
