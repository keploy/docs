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

:::info Running a browser suite?

A Playwright suite is a different shape: the recorded responses are what your
specs assert on, so one test reaching another test's mock is a false pass rather
than a harmless substitution. That flow — per-test identity, branch-scoped
publishing, and re-recording a single test — is covered in
[Mock a Browser Test Suite (Playwright)](./mock-browser-tests.md).

:::

## Quick start

```bash
# 1. Record the dependency calls your tests make (real dependencies must be up)
keploy mock record -c "pytest"

# 2. Replay — the dependencies can now be down; your tests run against the mocks
keploy mock replay -c "pytest"
```

The mocks are written to `keploy/default/mocks.yaml`. Commit them like a VCR
cassette. Re-recording replaces the whole set **in place**, so a "re-record on
merge to main" job produces a clean, reviewable diff. To keep the set and
replace only the tests one run exercises, add `--partial` — see
[re-recording one test](./mock-browser-tests.md#3-re-record-one-test).

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

| `--on-miss`      | Behaviour                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fail` (default) | The call gets an error (deterministic); the run fails.                                                                                                                    |
| `passthrough`    | The call goes to the **real** dependency; nothing is persisted.                                                                                                           |
| `record`         | The call goes to the real dependency **and is appended** to the set (VCR "new episodes") — incremental refresh. Local development only: do not publish a set it produced. |

```bash
# A new test hit a new endpoint? Capture just that call and keep it:
keploy mock replay -c "pytest" --on-miss record
```

Add `--strict` to exit non-zero when any outgoing call matched **no** recording,
even when the tests themselves passed — a dependency contract drifted, or the
set is stale.

## Per-test scoping (optional)

By default a set is recorded and replayed suite-wide. For per-test isolation — so
each test gets exactly its own mocks — your test runner can mark test boundaries
through a tiny HTTP API. Keploy exports the agent's address into your test process
as **`KEPLOY_MOCK_AGENT`**; call it at the start and end of each test:

```
POST  {KEPLOY_MOCK_AGENT}/agent/scope/begin   {"name": "<test name>", "pid": <worker pid>}
POST  {KEPLOY_MOCK_AGENT}/agent/scope/end     {"name": "<test name>", "pid": <worker pid>}
```

At record time this attributes each captured mock to the test that was running;
at replay time it narrows the served pool to that test's mocks. No scope calls ⇒
suite-level, which is still correct.

A test that the set has **no** recording for falls back to the whole pool. That is
deliberate for integration testing, where one recording answering another test's
request is harmless. Pass `--strict-scope` at replay time to serve such a test
nothing instead — see
[strict scoping](./mock-browser-tests.md#strict-scoping).

:::tip Parallel workers
Include your **worker's PID** as `pid` (e.g. Node `process.pid`, Python
`os.getpid()`) and Keploy scopes the served pool **per worker**, so parallel
runners — Playwright/jest workers, `pytest-xdist`, `go test` -parallel — each get
only their own test's mocks with no cross-worker interference. Keploy attributes
an outgoing call to a worker by its process (walking the process tree), so calls
from a child process the worker spawns are covered too.

`pid` is optional: omit it and scoping falls back to a single shared pool that
assumes tests run **sequentially** (the pre-parallel behavior). Parallel scoping
assumes the runner and the Keploy agent share a PID namespace — the normal case
for `keploy mock <cmd>`; containerized workers in a separate namespace should run
suite-level.
:::

**pytest** (`conftest.py`):

```python
import os, json, urllib.request, pytest

AGENT = os.environ.get("KEPLOY_MOCK_AGENT")

def _post(path, name):
    if not AGENT:
        return
    body = {"name": name, "pid": os.getpid()}  # pid → per-worker isolation under pytest-xdist
    req = urllib.request.Request(AGENT + path, data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json"}, method="POST")
    try:
        urllib.request.urlopen(req, timeout=3).read()
    except Exception:
        pass

@pytest.fixture(autouse=True)
def keploy_scope(request):
    _post("/agent/scope/begin", request.node.name)
    yield
    _post("/agent/scope/end", request.node.name)
```

**go test** (`TestMain` helper):

```go
func scope(path, name string) {
    agent := os.Getenv("KEPLOY_MOCK_AGENT")
    if agent == "" {
        return
    }
    // pid → per-worker isolation when tests run in parallel
    body, _ := json.Marshal(map[string]any{"name": name, "pid": os.Getpid()})
    http.Post(agent+path, "application/json", bytes.NewReader(body))
}

// In each test:  scope("/agent/scope/begin", t.Name()); defer scope("/agent/scope/end", t.Name())
```

**jest / playwright** (a `beforeEach`/`afterEach` or reporter hook) makes the same
two calls with the test's name and `process.pid` — the `pid` is what keeps
Playwright's or jest's parallel **workers** isolated from each other:

```js
// Playwright: in a fixture or beforeEach/afterEach
const post = (path, name) =>
  fetch(`${process.env.KEPLOY_MOCK_AGENT}${path}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name, pid: process.pid}),
  }).catch(() => {});

// titlePath, not title: bare titles collide across spec files, and the
// recording is keyed on this string.
const testName = (testInfo) => testInfo.titlePath.join(" > ");

test.beforeEach(({}, testInfo) =>
  post("/agent/scope/begin", testName(testInfo))
);
test.afterEach(({}, testInfo) => post("/agent/scope/end", testName(testInfo)));
```

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
