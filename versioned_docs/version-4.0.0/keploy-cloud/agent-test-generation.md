---
id: agent-test-generation
title: Agent-Based Test Generation
sidebar_label: Agent Test Generation
description: Generate API tests using AI coding agents (Claude Code, Cursor, Windsurf) with the keploy-runner CLI
tags:
  - AI Agent
  - Test Generation
  - Claude Code
  - Cursor
  - Windsurf
  - keploy-runner
  - CLI
keywords:
  - AI agent test generation
  - Claude Code
  - Cursor
  - keploy-runner
  - API testing
  - coverage feedback loop
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Overview

Keploy's agent-based test generation lets AI coding assistants (Claude Code, Cursor, Windsurf, GitHub Copilot) generate and iterate on API tests directly in your IDE. Instead of using a separate web UI, the agent:

1. **Generates test YAML** using the Keploy test format (taught via CLAUDE.md or .cursorrules)
2. **Runs tests** via the `keploy-runner` CLI with structured JSON output
3. **Reads coverage gaps** from the output and generates targeted tests
4. **Syncs results** to the Keploy platform for team-wide visibility

This eliminates the "double LLM tax" — the agent writes tests directly instead of calling a second LLM.

## Prerequisites

- Go 1.26+ installed (the version required by the enterprise module)
- A running API server to test against
- An OpenAPI spec (optional, enables coverage feedback loop)

## Installation

```bash
# From the keploy/enterprise repository
go install github.com/keploy/enterprise/v3/cmd/keploy-runner@latest
```

Or build from source:

```bash
git clone https://github.com/keploy/enterprise.git
cd enterprise
go build -o keploy-runner ./cmd/keploy-runner/
```

## Setup for AI Agents

### Claude Code

Copy `CLAUDE.md` from the [agent-docs directory](https://github.com/keploy/enterprise/tree/main/agent-docs) to your project root. Claude Code will automatically read it and learn the test format.

### Cursor

Copy the `cursorrules` file from agent-docs to `.cursorrules` in your project root.

### Windsurf / Other MCP-compatible agents

Use the same CLAUDE.md content as system instructions or project context.

## Workflow

### 1. Initialize the test directory

```bash
keploy-runner init --dir ./keploy
```

This creates:
- `keploy/tests/example.yaml` — a working example test suite
- `keploy/keploy-runner.yaml` — a configuration reference template

### 2. Generate tests with your AI agent

Ask your agent to generate tests. It will use the format from CLAUDE.md:

> "Generate API tests for my user CRUD endpoints based on the OpenAPI spec"

The agent writes YAML test files directly to `keploy/tests/`.

### 3. Run tests

```bash
keploy-runner run --base-url http://localhost:8080 --output json
```

The JSON output includes pass/fail status, assertion failures, and extracted variables — the agent reads this to fix failing tests.

### 4. Coverage feedback loop

Add `--spec` to include coverage analysis:

```bash
keploy-runner run --base-url http://localhost:8080 --spec openapi.yaml --output json
```

The output now includes a `coverage` section with `next_steps` — prioritized suggestions for uncovered endpoints. The agent reads these and generates targeted tests automatically.

### 5. Sync results to platform

```bash
keploy-runner run \
  --base-url http://localhost:8080 \
  --spec openapi.yaml \
  --sync --app-id your-app-id --api-key $KEPLOY_API_KEY \
  --output json
```

Results appear on your Keploy dashboard for team-wide visibility, reports, and alerts.

## CLI Reference

### `keploy-runner run`

Execute test suites against a running API server.

| Flag | Description | Default |
|------|-------------|---------|
| `--base-url` | API server URL (required) | — |
| `--test-dir` | Directory with test YAML files | `./keploy/tests` |
| `--output` | Output format: `text`, `json`, `junit` | `text` |
| `--spec` | OpenAPI spec for coverage analysis | — |
| `--suite` | Run specific suites by name | all |
| `--ci` | Exit 1 on failure or low coverage | `false` |
| `--min-coverage` | Coverage target (with `--ci`) | `80` |
| `--flaky-runs` | Re-run failed suites N times | `0` |
| `--sync` | Push results to Keploy platform | `false` |
| `--app-id` | Keploy app ID (with `--sync`) | — |
| `--api-key` | Keploy API key | `$KEPLOY_API_KEY` |
| `--auth-header` | Auth header as `"Key: Value"` (quote in shell) | — |
| `--rate-limit` | Max requests per second | unlimited |
| `--timeout` | Per-request timeout (seconds) | `30` |

### `keploy-runner coverage`

Standalone coverage analysis without executing tests.

| Flag | Description | Default |
|------|-------------|---------|
| `--spec` | OpenAPI spec file (required) | — |
| `--test-dir` | Directory with test YAML files | `./keploy/tests` |
| `--output` | Output format: `text`, `json` | `text` |
| `--min-coverage` | Coverage target percentage | `80` |

### `keploy-runner init`

Scaffold a test directory with examples.

| Flag | Description | Default |
|------|-------------|---------|
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

| Type | Description | Example |
|------|-------------|---------|
| `status_code` | Exact HTTP status match | `expected_string: "200"` |
| `status_code_class` | Status class match | `expected_string: "2xx"` |
| `status_code_in` | Status in list | `expected_string: "200,201,204"` |
| `json_equal` | Exact match at gjson path | `key: $.id`, `expected_string: '"abc"'` |
| `json_contains` | Subset match at gjson path | `key: $.data`, `expected_string: '{"name":"John"}'` |
| `json_path` | Alias for json_equal | `key: $.id`, `expected_string: '"abc"'` |
| `header_equal` | Exact header match | `key: Content-Type`, `expected_string: "application/json"` |
| `header_contains` | Header substring | `key: Content-Type`, `expected_string: "json"` |
| `header_exists` | Header presence | `key: X-Request-Id`, `expected_string: "true"` |
| `header_matches` | Header regex match | `key: Content-Type`, `expected_string: "application/.*json"` |
| `schema` | JSON Schema validation | `expected_string: '{"type":"object","properties":{"id":{"type":"string"}}}'` |
| `custom_functions` | JS function assertion | `expected_string: 'function(req, res) { return res.status === 200; }'` |

### Variable Extraction

Use gjson paths to extract values from responses and use them in subsequent steps:

```yaml
extract:
  user_id: $.data.id
  token: $.auth.access_token
```

Use in later steps: `url: /users/{{user_id}}`

**Key rules:**
- Variables are scoped to the test suite (not shared between suites)
- Must be extracted before use (by a previous step)
- gjson path syntax: `$.field` or `field`, `$.nested.field` or `nested.field` (the `$.` prefix is optional and stripped automatically)
- Use dot notation for arrays: `$.users.0.id` (correct) instead of `$.users[0].id` (incorrect — brackets are not supported by gjson)

## CI/CD Integration

### GitHub Actions

```yaml
- name: Run API tests
  run: |
    keploy-runner run \
      --base-url http://localhost:8080 \
      --spec openapi.yaml \
      --ci --min-coverage 80 \
      --output junit > test-results.xml

- name: Upload test results
  uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results.xml
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | All tests pass, coverage above threshold |
| 1 | Test failures, validation errors, coverage below threshold, or sync failure (in `--ci` mode) |

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
