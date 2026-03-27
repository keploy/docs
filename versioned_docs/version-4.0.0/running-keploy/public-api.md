---
id: public-api
title: Public REST API
sidebar_label: Public REST API
description: Use the Keploy Public API to manage apps, generate and run test suites, and track jobs programmatically from CI/CD pipelines, scripts, or AI agents.
tags:
  - API testing
  - REST API
  - ci testing
  - automation
  - API key
  - programmatic access
keywords:
  - public API
  - REST API
  - API key
  - CI/CD
  - automation
  - AI agent
  - MCP
  - programmatic
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Team, Scale, Enterprise" offerings="Dedicated" />

The Keploy Public API gives you programmatic access to everything you can do in the [Keploy Console](https://app.keploy.io) — create apps, generate and run test suites, track jobs, and manage API keys. It is designed for CI/CD pipelines, custom automation scripts, and AI agents.

**Base URL:** `https://api.keploy.io/client/v1`

---

## Authentication

Every request requires a **scoped API key**. Send it in one of these headers:

```bash
# Option 1: Bearer token
Authorization: Bearer kep_...

# Option 2: Dedicated header
X-API-Key: kep_...
```

### Scopes

API keys are created with one or more scopes that control access:

| Scope | What it allows |
|-------|----------------|
| `read` | All `GET` endpoints (view apps, suites, runs, jobs) |
| `write` | Everything in `read` + create, update, delete, generate, run |
| `admin` | Everything in `write` + API key management + app deletion |

### Create your first API key

You need an existing `admin`-scoped key to create keys via the API. To bootstrap your first key, ask your organization admin or create one from the [Keploy Console](https://app.keploy.io).

Once you have an admin key:

```bash
curl -X POST https://api.keploy.io/client/v1/api-keys \
  -H "Authorization: Bearer kep_YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CI Pipeline",
    "scopes": ["read", "write"],
    "ttl_days": 90
  }'
```

The response includes the full key — **save it immediately**. It is only shown once and cannot be retrieved again.

```json
{
  "data": {
    "id": "a1b2c3d4-...",
    "key": "kep_dGVzdGtleXRl...full-key-here",
    "name": "CI Pipeline",
    "scopes": ["read", "write"],
    "created_at": 1735689600,
    "expires_at": 1743465600
  },
  "meta": { "request_id": "550e8400-...", "timestamp": "2025-01-01T00:00:00Z" }
}
```

---

## Response format

All endpoints return a consistent JSON envelope:

```js
// Success
{
  "data": { ... },
  "meta": {
    "request_id": "550e8400-...",
    "timestamp": "2025-01-01T00:00:00Z",
    "pagination": { "has_next_page": true, "next_cursor": "abc123", "total_count": 42 }
  }
}

// Error
{
  "error": { "code": "VALIDATION_ERROR", "message": "name is required" },
  "meta": { "request_id": "550e8400-...", "timestamp": "2025-01-01T00:00:00Z" }
}
```

### Error codes

| Code | HTTP | When it happens |
|------|------|-----------------|
| `AUTHENTICATION_REQUIRED` | 401 | Missing, invalid, or expired API key |
| `INSUFFICIENT_SCOPE` | 403 | Key does not have the required scope |
| `RESOURCE_NOT_FOUND` | 404 | The resource does not exist or is not in your organization |
| `VALIDATION_ERROR` | 400 | Bad request body or missing required fields |
| `CONFLICT` | 409 | Duplicate resource |
| `RATE_LIMITED` | 429 | Too many requests — check `Retry-After` header |
| `INTERNAL_ERROR` | 500 | Unexpected server error — include `request_id` when reporting |

---

## Rate limiting

Each API key is allowed **100 requests per minute** with a burst of up to 100.

Every response includes rate-limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 3
```

- `X-RateLimit-Reset` is the number of **seconds** until at least one token is available again. A value of `0` means you have tokens remaining.
- When the limit is reached, you receive a `429` response with a `Retry-After` header (also in seconds).

---

## Quick start: Generate and run tests from the command line

This example generates AI-powered test suites for your API, then runs them — all from `curl`. The examples use [`jq`](https://jqlang.github.io/jq/) to parse JSON responses. Install it with `brew install jq` (macOS) or `apt-get install jq` (Linux).

### 1. Generate test suites

```bash
APP_ID="your-app-id"    # from the Keploy Console
API_KEY="kep_your_key"
BASE="https://api.keploy.io/client/v1"

JOB_ID=$(curl -s -X POST "$BASE/apps/$APP_ID/test-suites/generate" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"base_url": "https://api.example.com"}' \
  | jq -r '.data.job_id')

echo "Generation job started: $JOB_ID"
```

### 2. Stream job progress in real time

```bash
curl -N -H "Authorization: Bearer $API_KEY" \
  "$BASE/jobs/$JOB_ID/events"
```

This returns [NDJSON](https://ndjson.org/) — one JSON object per line, streamed as events happen.

### 3. Run all test suites

```bash
RUN_JOB=$(curl -s -X POST "$BASE/apps/$APP_ID/test-suites/run" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"base_url": "https://staging.example.com"}' \
  | jq -r '.data.job_id')

echo "Test run job started: $RUN_JOB"
```

### 4. Check results

```bash
# Get all test runs for the app
curl -s -H "Authorization: Bearer $API_KEY" \
  "$BASE/apps/$APP_ID/test-runs" | jq '.data'
```

---

## Use in CI/CD

> Already using the Keploy CLI in CI? See [CI/CD Integration](/docs/running-keploy/api-testing-cicd/) for the CLI-based approach. The REST API below is an alternative for environments where installing the CLI is not practical.

### GitHub Actions

```yaml
name: Keploy API Tests
on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Run Keploy API tests
        env:
          KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
        run: |
          APP_ID="your-app-id"
          BASE="https://api.keploy.io/client/v1"
          AUTH="Authorization: Bearer $KEPLOY_API_KEY"

          # Start a test run
          JOB_ID=$(curl -s -X POST "$BASE/apps/$APP_ID/test-suites/run" \
            -H "$AUTH" -H "Content-Type: application/json" \
            -d '{"base_url": "https://staging.example.com"}' \
            | jq -r '.data.job_id')

          if [ -z "$JOB_ID" ] || [ "$JOB_ID" = "null" ]; then
            echo "Failed to start test job. Check APP_ID and API key."
            exit 1
          fi
          echo "Job: $JOB_ID"

          # Poll until done (timeout after ~10 minutes)
          for i in $(seq 1 60); do
            STATUS=$(curl -s "$BASE/jobs/$JOB_ID" -H "$AUTH" | jq -r '.data.job_status')
            echo "Attempt $i — Status: $STATUS"
            case "$STATUS" in
              COMPLETED) echo "Tests passed"; break ;;
              FAILED)    echo "Tests failed. Inspect: curl -s \"$BASE/apps/$APP_ID/test-runs\" -H \"$AUTH\" | jq"; exit 1 ;;
              CANCELLED|STOPPED) echo "Job $STATUS. Check: curl -s \"$BASE/jobs/$JOB_ID\" -H \"$AUTH\" | jq"; exit 1 ;;
              *)         sleep 10 ;;
            esac
          done
          if [ "$STATUS" != "COMPLETED" ]; then
            echo "Timed out waiting for job $JOB_ID"
            exit 1
          fi
```

> Add `KEPLOY_API_KEY` as a GitHub Actions secret: **Repo Settings → Security → Actions → New Repository Secret**.

### Python

```python
import requests, json

API_KEY = "kep_your_key"
APP_ID = "your-app-id"
BASE = "https://api.keploy.io/client/v1"
HEADERS = {"Authorization": f"Bearer {API_KEY}"}

# Trigger test run
resp = requests.post(
    f"{BASE}/apps/{APP_ID}/test-suites/run",
    headers=HEADERS,
    json={"base_url": "https://staging.example.com"},
)
job_id = resp.json()["data"]["job_id"]

# Stream events
with requests.get(f"{BASE}/jobs/{job_id}/events", headers=HEADERS, stream=True) as r:
    for line in r.iter_lines():
        if line:
            event = json.loads(line)
            print(event["status"])
```

---

## Endpoint reference

All paths are relative to `https://api.keploy.io/client/v1`.

### Apps

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/apps` | read | List all apps |
| `POST` | `/apps` | write | Create an app |
| `GET` | `/apps/{appId}` | read | Get an app |
| `PUT` | `/apps/{appId}` | write | Update an app |
| `DELETE` | `/apps/{appId}` | admin | Delete an app |

**Create app request:**

```json
{ "name": "My API", "endpoint": "https://api.example.com" }
```

### Schema coverage

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/apps/{appId}/schema-coverage` | read | Get [schema coverage](/docs/running-keploy/api-testing-schema-coverage/) report |

Returns coverage percentage, covered/uncovered/partly-covered lines, and per-endpoint details. Requires the app to have an OpenAPI schema configured.

### Test suites

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/apps/{appId}/test-suites` | read | List test suites (cursor-paginated) |
| `POST` | `/apps/{appId}/test-suites` | write | Create a test suite |
| `GET` | `/apps/{appId}/test-suites/{suiteId}` | read | Get a test suite |
| `PUT` | `/apps/{appId}/test-suites/{suiteId}` | write | Update a test suite |
| `DELETE` | `/apps/{appId}/test-suites/{suiteId}` | write | Delete a test suite |
| `POST` | `/apps/{appId}/test-suites/generate` | write | [Generate tests using AI](/docs/running-keploy/generate-api-tests-using-ai/) |
| `POST` | `/apps/{appId}/test-suites/run` | write | [Run test suites](/docs/running-keploy/run-ai-generated-api-tests/) |
| `POST` | `/apps/{appId}/test-suites/bulk-delete` | write | Delete multiple test suites |
| `POST` | `/apps/{appId}/test-suites/{suiteId}/validate` | write | Validate a test suite against your API |

**Generate request:**

```json
{
  "base_url": "https://api.example.com",
  "schema": "openapi: 3.0.0\n...",
  "max_test_suites": 30,
  "ignore_endpoints": ["/health"],
  "timeout": 30
}
```

**Run request:**

```json
{
  "base_url": "https://staging.example.com",
  "test_suite_ids": ["suite-1", "suite-2"]
}
```

Omit `test_suite_ids` to run all suites. Both return `202 Accepted` with a `job_id` to track progress.

### Jobs

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/jobs` | read | List all jobs |
| `GET` | `/jobs/{jobId}` | read | Get a job |
| `POST` | `/jobs/{jobId}/stop` | write | Stop a running job |
| `GET` | `/jobs/{jobId}/events` | read | Stream events (NDJSON) |
| `GET` | `/jobs/{jobId}/validation-result` | read | Get validation result for a validate job |

The `/events` endpoint returns newline-delimited JSON. Connect with `curl -N` or any streaming HTTP client.

### Test runs, reports, and normalization

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/apps/{appId}/test-runs` | read | List test runs |
| `GET` | `/apps/{appId}/test-runs/{runId}` | read | Get a test run |
| `POST` | `/apps/{appId}/test-runs/{runId}/normalize` | write | [Normalize](/docs/running-keploy/self-healing-ai-api-tests/) a test run (AI) |
| `GET` | `/apps/{appId}/test-runs/{runId}/suite-reports` | read | List suite reports (cursor-paginated) |
| `GET` | `/apps/{appId}/test-runs/{runId}/suite-reports/{reportId}` | read | Get a suite report |
| `POST` | `/apps/{appId}/test-runs/{runId}/suite-reports/{reportId}/normalize` | write | Normalize a single suite report (AI) |

> See [Test Run Reports](/docs/running-keploy/api-testing-run-report/) for how to interpret report data.

### Load tests

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `POST` | `/apps/{appId}/load-tests` | write | Start a load test |
| `GET` | `/apps/{appId}/load-tests` | read | List load test runs |
| `GET` | `/apps/{appId}/load-tests/{runId}` | read | Get load test report |
| `POST` | `/apps/{appId}/load-tests/{runId}/stop` | write | Stop a running load test |
| `GET` | `/apps/{appId}/load-tests/{runId}/events` | read | Stream load test events (NDJSON) |

**Start load test request:**

```json
{
  "base_url": "https://staging.example.com",
  "virtual_users": 10,
  "duration_secs": 60,
  "profile": "constant"
}
```

### Generation history

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/apps/{appId}/generation-history` | read | List [generation history](/docs/running-keploy/api-testing-generation-history/) entries |
| `GET` | `/apps/{appId}/generation-history/{jobId}` | read | Get generation details for a specific job |

### Subscription and usage

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/company/subscription` | read | Get current subscription plan and status |
| `GET` | `/company/usage` | read | Get test generation and run usage counts |

### Users and API keys

| Method | Path | Scope | Description |
|--------|------|-------|-------------|
| `GET` | `/users/me` | read | Get current authenticated user info |
| `POST` | `/api-keys` | admin | Create a new API key |
| `GET` | `/api-keys` | admin | List all API keys for your organization |
| `DELETE` | `/api-keys/{keyId}` | admin | Revoke an API key |

**Create API key request:**

```json
{
  "name": "Production CI",
  "scopes": ["read", "write"],
  "ttl_days": 90
}
```

Valid scopes: `read`, `write`, `admin`. Omit `ttl_days` for a key that never expires.

---

## Pagination

Set these variables first (same as the quick start section above):

```bash
API_KEY="kep_your_key"
APP_ID="your-app-id"
BASE="https://api.keploy.io/client/v1"
```

**Cursor-based** (test suites, suite reports):

```bash
# First page
curl -H "Authorization: Bearer $API_KEY" "$BASE/apps/$APP_ID/test-suites?page_size=10"

# Next page
curl -H "Authorization: Bearer $API_KEY" "$BASE/apps/$APP_ID/test-suites?page_size=10&after=CURSOR"
```

**Offset-based** (apps, test runs, jobs):

```bash
curl -H "Authorization: Bearer $API_KEY" "$BASE/apps?offset=0&limit=20"
```

Maximum `limit` is 100. Default is 20.

---

## Related guides

- [Generate API Tests using AI](/docs/running-keploy/generate-api-tests-using-ai/) — step-by-step guide for test generation
- [Run AI-generated API Tests](/docs/running-keploy/run-ai-generated-api-tests/) — executing test suites
- [CI/CD Integration (CLI)](/docs/running-keploy/api-testing-cicd/) — GitHub Actions with the Keploy CLI
- [Authentication Setup](/docs/running-keploy/api-testing-auth-setup/) — configure auth for your API under test
- [Webhook Integration](/docs/running-keploy/api-testing-webhook/) — trigger custom logic during test lifecycle
- [Test Run Reports](/docs/running-keploy/api-testing-run-report/) — understand test results
- [Schema Coverage](/docs/running-keploy/api-testing-schema-coverage/) — measure API coverage
