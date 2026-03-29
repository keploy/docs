---
id: agent-test-generation
title: Agent-Based API Test Generation
sidebar_label: AI Agent Testing
description: Generate API tests using AI coding agents like Claude Code, Cursor, and Antigravity with Keploy Enterprise
tags:
  - AI Agent
  - Test Generation
  - Claude Code
  - Cursor
  - Antigravity
  - API Testing
keywords:
  - AI agent test generation
  - Claude Code
  - Cursor
  - Antigravity
  - Keploy Enterprise
  - API testing
  - coverage feedback loop
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Overview

Keploy Enterprise supports agent-based test generation, allowing AI coding assistants (Claude Code, Cursor, Antigravity, GitHub Copilot) to generate and iterate on API tests directly in your IDE.

Instead of switching to a separate web UI, the agent:

1. **Generates test YAML** using the Keploy test format
2. **Runs tests** via Keploy Enterprise with structured JSON output
3. **Reads coverage gaps** from the output and generates targeted tests
4. **Syncs results** to the Keploy platform for team-wide visibility

The Keploy platform automatically builds and refines the API schema over time from your test runs, so providing an OpenAPI spec upfront is **optional**.

## Prerequisites

- Keploy Enterprise installed ([installation guide](/docs/keploy-cloud/cloud-installation/))
- A running API server to test against
- An OpenAPI spec (optional; the platform generates schema coverage over time)

## Setup for AI Agents

To teach your AI agent the Keploy test format, add a context file to your project root. The agent reads this file and learns how to generate valid test suites.

### Claude Code

Create a `CLAUDE.md` file in your project root with the Keploy test format reference. Claude Code automatically reads project-level markdown files. The file should document:

- The YAML test suite schema (name, description, steps)
- Available assertion types (status_code, json_equal, json_contains, etc.)
- Variable extraction and substitution rules
- The CLI commands to run and validate tests

See the [Test Suite YAML Format](#test-suite-yaml-format) section below for the complete schema to include.

### Cursor

Create a `.cursorrules` file in your project root with the same test format reference.

### Antigravity

Use the same test format documentation as system instructions or project context.

## Workflow

### 1. Initialize the test directory

```bash
keploy test-gen init --dir ./keploy
```

This creates:

- `keploy/tests/example.yaml`—a working example test suite
- `keploy/keploy-runner.yaml`—a configuration reference template

### 2. Generate tests with your AI agent

Ask your agent to generate tests:

> "Generate API tests for my user CRUD endpoints"

The agent writes YAML test files directly to `keploy/tests/`.

### 3. Run tests

```bash
keploy test-gen run --base-url http://localhost:8080 --output json
```

The JSON output includes pass/fail status, assertion failures, and extracted variables. The agent reads this to fix failing tests.

### 4. Coverage feedback loop (optional)

If you have an OpenAPI spec, add `--spec` for coverage analysis:

```bash
keploy test-gen run --base-url http://localhost:8080 --spec openapi.yaml --output json
```

The output includes a `coverage` section with `next_steps`—prioritized suggestions for uncovered endpoints. The agent reads these and generates targeted tests automatically.

Even without a spec, the Keploy platform builds schema coverage over time from your test runs. You can view this on the Keploy dashboard.

### 5. Sync results to platform

```bash
keploy test-gen run \
  --base-url http://localhost:8080 \
  --sync --app-id your-app-id --api-key $KEPLOY_API_KEY \
  --output json
```

Results appear on your Keploy dashboard for team-wide visibility, reports, and alerts.

## CLI Reference

### `keploy test-gen run`

Execute test suites against a running API server.

| Flag             | Description                                    | Default           |
| ---------------- | ---------------------------------------------- | ----------------- |
| `--base-url`     | API server URL (required)                      | —                 |
| `--test-dir`     | Directory with test YAML files                 | `./keploy/tests`  |
| `--output`       | Output format: `text`, `json`, `junit`         | `text`            |
| `--spec`         | OpenAPI spec for coverage analysis (optional)  | —                 |
| `--suite`        | Run specific suites by name                    | all               |
| `--ci`           | Exit 1 on failure or low coverage              | `false`           |
| `--min-coverage` | Coverage target (with `--ci` and `--spec`)     | `80`              |
| `--flaky-runs`   | Re-run failed suites N times                   | `0`               |
| `--sync`         | Push results to Keploy platform                | `false`           |
| `--app-id`       | Keploy app ID (with `--sync`)                  | —                 |
| `--api-key`      | Keploy API key                                 | `$KEPLOY_API_KEY` |
| `--auth-header`  | Auth header as `"Key: Value"` (quote in shell) | —                 |
| `--rate-limit`   | Max requests per second                        | unlimited         |
| `--timeout`      | Per-request timeout (seconds)                  | `30`              |

### `keploy test-gen coverage`

Standalone coverage analysis without executing tests. Requires an OpenAPI spec.

| Flag             | Description                    | Default          |
| ---------------- | ------------------------------ | ---------------- |
| `--spec`         | OpenAPI spec file (required)   | —                |
| `--test-dir`     | Directory with test YAML files | `./keploy/tests` |
| `--output`       | Output format: `text`, `json`  | `text`           |
| `--min-coverage` | Coverage target percentage     | `80`             |

### `keploy test-gen init`

Scaffold a test directory with examples.

| Flag    | Description             | Default    |
| ------- | ----------------------- | ---------- |
| `--dir` | Directory to initialize | `./keploy` |

## Test Suite YAML Format

Each file in `keploy/tests/` contains one or more test suites separated by `---`:

```yaml
---
name: User_CRUD_Flow
description: Create, read, and delete a user
steps:
  - name: Create user
    method: POST
    url: /api/users
    headers:
      Content-Type: application/json
    body: '{"name":"Alice","email":"alice@test.com"}'
    extract:
      user_id: $.id
    assert:
      - type: status_code
        expected_string: "201"
      - type: json_equal
        key: $.name
        expected_string: '"Alice"'
  - name: Get user
    method: GET
    url: /api/users/{{user_id}}
    assert:
      - type: status_code
        expected_string: "200"
  - name: Delete user
    method: DELETE
    url: /api/users/{{user_id}}
    assert:
      - type: status_code
        expected_string: "204"
```

### Assertion Types

| Type                | Description                        | Example                                                                      |
| ------------------- | ---------------------------------- | ---------------------------------------------------------------------------- |
| `status_code`       | Exact HTTP status match            | `expected_string: "200"`                                                     |
| `status_code_class` | Status class match                 | `expected_string: "2xx"`                                                     |
| `status_code_in`    | Status in list                     | `expected_string: "200,201,204"`                                             |
| `json_equal`        | Exact match at a JSON path         | `key: $.id`, `expected_string: '"abc"'`                                      |
| `json_contains`     | Subset match at a JSON path        | `key: $.data`, `expected_string: '{"name":"John"}'`                          |
| `json_path`         | Alias for json_equal               | `key: $.id`, `expected_string: '"abc"'`                                      |
| `header_equal`      | Exact header match                 | `key: Content-Type`, `expected_string: "application/json"`                   |
| `header_contains`   | Header value contains a string     | `key: Content-Type`, `expected_string: "json"`                               |
| `header_exists`     | Header key is present              | `key: X-Request-Id`, `expected_string: "true"`                               |
| `header_matches`    | Header matches a regex pattern     | `key: Content-Type`, `expected_string: "application/.*json"`                 |
| `schema`            | Validate response against a schema | `expected_string: '{"type":"object","properties":{"id":{"type":"string"}}}'` |
| `custom_functions`  | Custom JS function assertion       | `expected_string: 'function(req, res) { return res.status === 200; }'`       |

### Variable Extraction

Use JSON paths to extract values from responses and use them in subsequent steps:

```yaml
extract:
  user_id: $.data.id
  token: $.auth.access_token
```

Use in later steps: `url: /users/{{user_id}}`

**Key rules:**

- Variables are scoped to the test suite (not shared between suites)
- Must be extracted before use (by a previous step)
- Path syntax: `$.field` or `field`, `$.nested.field` or `nested.field` (the `$.` prefix is optional)
- Use dot notation for arrays: `$.users.0.id` (correct) instead of `$.users[0].id` (brackets are not supported)

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run API tests
  run: |
    keploy test-gen run \
      --base-url http://localhost:8080 \
      --ci \
      --output junit > test-results.xml

- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results.xml
```

### Exit Codes

| Code | Meaning                                                                                      |
| ---- | -------------------------------------------------------------------------------------------- |
| 0    | All tests pass, coverage above threshold (if `--spec` provided)                              |
| 1    | Test failures, validation errors, coverage below threshold, or sync failure (in `--ci` mode) |

## Coverage Feedback Loop

When `--spec` is provided, every `run` output includes a `coverage` section:

```json
{
  "coverage": {
    "percentage": 72.5,
    "target": 80,
    "gap": "3 endpoints need tests to reach 80%",
    "next_steps": [
      {
        "priority": "critical",
        "action": "generate_test",
        "endpoint": "DELETE /users/{id}",
        "reason": "Zero test coverage.",
        "hint": "Expected responses: 204 (Deleted), 404 (Not found)."
      }
    ]
  }
}
```

The agent reads `next_steps` and generates targeted tests for uncovered endpoints. This loop continues automatically until coverage targets are met.

Without an OpenAPI spec, you can still run tests and sync results. The Keploy platform builds schema coverage progressively from your test execution data over time.
