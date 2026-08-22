---
id: mock-your-tests
title: Mock Your Own Tests (pytest, go test, jest)
sidebar_label: Mock Your Tests
description: Use Keploy as a language-agnostic mocking framework for your existing test suite — record the real dependency calls your tests make, then replay them so the suite runs without the real dependencies.
tags:
  - mocks
  - mocking
  - pytest
  - go test
  - jest
keywords:
  - keploy mock
  - mock record
  - mock replay
  - vcr
  - dependency mocking
---

# Mock Your Own Tests

`keploy mock` lets you use Keploy as a **mocking framework for your existing test
suite** — pytest, `go test`, jest/playwright, or any command that makes network
calls. It is a language-agnostic VCR / WireMock that works at the network layer,
so your test code needs **no SDK and no changes**.

- `keploy mock record -c "<your test command>"` runs your tests and captures the
  real outgoing dependency calls (HTTP, MySQL, …) into a named **mock set**.
- `keploy mock replay -c "<your test command>"` runs your tests again with those
  calls served from the mock set, so the real dependencies can be **offline**.

Keploy propagates your test runner's **exit code**, so it drops straight into CI.

## Quick start

```bash
# 1. Record the dependency calls your tests make (real dependencies must be up)
keploy mock record -c "pytest"

# 2. Replay — the dependencies can now be down; your tests run against the mocks
keploy mock replay -c "pytest"
```

The mocks are written to `keploy/default/mocks.yaml`. Commit them like a VCR
cassette. Re-recording overwrites the set **in place**, so a "re-record on merge
to main" job produces a clean, reviewable diff.

```bash
# go test
keploy mock record -c "go test ./..."
keploy mock replay -c "go test ./..."

# a named set (e.g. per service)
keploy mock record -c "npm test" --name orders
keploy mock replay -c "npm test" --name orders
```

## On-miss policy

When an outgoing call matches no recorded mock, `--on-miss` decides what happens:

| `--on-miss`      | Behaviour                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------- |
| `fail` (default) | The call gets an error (deterministic); the run fails.                                                          |
| `passthrough`    | The call goes to the **real** dependency; nothing is persisted.                                                 |
| `record`         | The call goes to the real dependency **and is appended** to the set (VCR "new episodes") — incremental refresh. |

```bash
# A new test hit a new endpoint? Capture just that call and keep it:
keploy mock replay -c "pytest" --on-miss record
```

Add `--strict` to fail the run if any _recorded_ mock was **missed** (a dependency
contract drifted), even when the tests themselves passed.

## Per-test scoping (optional)

By default a set is recorded and replayed suite-wide. For per-test isolation — so
each test gets exactly its own mocks — your test runner can mark test boundaries
through a tiny HTTP API. Keploy exports the agent's address into your test process
as **`KEPLOY_MOCK_AGENT`**; call it at the start and end of each test:

```
POST  {KEPLOY_MOCK_AGENT}/agent/scope/begin   {"name": "<test name>"}
POST  {KEPLOY_MOCK_AGENT}/agent/scope/end     {"name": "<test name>"}
```

At record time this writes a per-test `mappings.yaml`; at replay time it restricts
the served pool to that test's mocks. No scope calls ⇒ suite-level, which is still
correct.

:::note Sequential execution
Per-test scoping narrows a **single** served mock pool per test, so it assumes
your tests run **sequentially**. With parallel workers (pytest-xdist,
`go test`-parallel, jest workers) the scopes would overlap and stomp each other —
run those suites **suite-level** (omit the scope calls, or record without them):
suite-level replay serves the whole set to every test and is safe under
parallelism.
:::

**pytest** (`conftest.py`):

```python
import os, json, urllib.request, pytest

AGENT = os.environ.get("KEPLOY_MOCK_AGENT")

def _post(path, body):
    if not AGENT:
        return
    req = urllib.request.Request(AGENT + path, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    try:
        urllib.request.urlopen(req, timeout=3).read()
    except Exception:
        pass

@pytest.fixture(autouse=True)
def keploy_scope(request):
    _post("/agent/scope/begin", {"name": request.node.name})
    yield
    _post("/agent/scope/end", {"name": request.node.name})
```

**go test** (`TestMain` helper):

```go
func scope(path, name string) {
    agent := os.Getenv("KEPLOY_MOCK_AGENT")
    if agent == "" {
        return
    }
    body, _ := json.Marshal(map[string]string{"name": name})
    http.Post(agent+path, "application/json", bytes.NewReader(body))
}

// In each test:  scope("/agent/scope/begin", t.Name()); defer scope("/agent/scope/end", t.Name())
```

**jest / playwright** (a `beforeEach`/`afterEach` or reporter hook) follows the same
two calls with the test's name.

## Platforms

| Platform            | How to run                                                                |
| ------------------- | ------------------------------------------------------------------------- |
| **Linux**           | Native — `keploy mock record -c "pytest"` (uses eBPF; needs root).        |
| **Windows** (amd64) | Native — same command, from an Administrator shell.                       |
| **macOS** (arm64)   | Run your tests through a container, e.g. `-c "docker compose run tests"`. |

## Refresh in CI

Because re-recording overwrites the set in place and the runner's exit code is
propagated, refreshing mocks on a merge to `main` is a normal CI step:

```bash
# bring up the real dependencies, then:
keploy mock record -c "pytest" --name default
keploy sanitize          # scrub secrets before committing
git add keploy/ && git commit -m "chore: refresh mocks" || echo "no changes"
```

On Keploy Cloud / Enterprise, `keploy mock` is **registry-first**: the set is
uploaded after record and downloaded before replay automatically. Pass `--local`
to keep everything on disk (the open-source behaviour).
