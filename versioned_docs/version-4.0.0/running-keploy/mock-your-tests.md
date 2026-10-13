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

Using VS Code? The [Keploy VS Code extension](/docs/running-keploy/utg-vscode-extension/)
runs these commands for you from a panel, and its
[troubleshooting table](/docs/running-keploy/utg-vscode-extension/#troubleshoot)
explains the messages the panel shows when a run fails.

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
through a tiny HTTP API. Keploy exports two variables into your test process: the
agent's address as **`KEPLOY_MOCK_AGENT`**, and the credential for it as
**`KEPLOY_MOCK_AGENT_TOKEN`**. Call the API at the start and end of each test,
sending the token as a bearer credential:

```
POST  {KEPLOY_MOCK_AGENT}/agent/scope/begin   {"name": "<test name>", "pid": <worker pid>}
POST  {KEPLOY_MOCK_AGENT}/agent/scope/end     {"name": "<test name>", "pid": <worker pid>}

Authorization: Bearer {KEPLOY_MOCK_AGENT_TOKEN}
```

At record time this writes a per-test `mappings.yaml`; at replay time it restricts
the served pool to that test's mocks. No scope calls ⇒ suite-level, which is still
correct.

:::caution The token is required
The agent's API is authenticated, so a scope call without the header is rejected
with **401** and that test is not scoped. Send the header whenever
`KEPLOY_MOCK_AGENT_TOKEN` is set, and omit it when it is not, so the same glue
code keeps working against an older Keploy that does not export it — that is what
every example below does.

Watch out for the common shape `try: ... except: pass`. It hides the 401, and
per-test scoping silently falls back to suite-level while your suite still
passes. Keploy logs the rejection on its own output with the variable to set, so
check there if scoping stops taking effect after an upgrade.
:::

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
import os, json, urllib.request, warnings, pytest

AGENT = os.environ.get("KEPLOY_MOCK_AGENT")
TOKEN = os.environ.get("KEPLOY_MOCK_AGENT_TOKEN")

def _post(path, name):
    if not AGENT:
        return
    body = {"name": name, "pid": os.getpid()}  # pid → per-worker isolation under pytest-xdist
    headers = {"Content-Type": "application/json"}
    if TOKEN:                       # absent on an older Keploy; the call still works there
        headers["Authorization"] = "Bearer " + TOKEN
    req = urllib.request.Request(AGENT + path, data=json.dumps(body).encode(),
                                 headers=headers, method="POST")
    try:
        urllib.request.urlopen(req, timeout=3).read()
    except Exception as e:
        # Surfaced, not swallowed: a 401 here means the test simply is not
        # scoped, and silence would make that look like it worked.
        warnings.warn(f"keploy: scope call {path} failed: {e}")

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
    req, err := http.NewRequest(http.MethodPost, agent+path, bytes.NewReader(body))
    if err != nil {
        return
    }
    req.Header.Set("Content-Type", "application/json")
    // Absent on an older Keploy, which does not require it.
    if tok := os.Getenv("KEPLOY_MOCK_AGENT_TOKEN"); tok != "" {
        req.Header.Set("Authorization", "Bearer "+tok)
    }
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        log.Printf("keploy: scope call %s failed: %v", path, err)
        return
    }
    defer resp.Body.Close()
    if resp.StatusCode != http.StatusOK {
        // 401 here means this test is not scoped; do not let that pass quietly.
        log.Printf("keploy: scope call %s returned %s", path, resp.Status)
    }
}

// In each test:  scope("/agent/scope/begin", t.Name()); defer scope("/agent/scope/end", t.Name())
```

**jest / playwright** (a `beforeEach`/`afterEach` or reporter hook) makes the same
two calls with the test's name and `process.pid` — the `pid` is what keeps
Playwright's or jest's parallel **workers** isolated from each other:

```js
// Playwright: in a fixture or beforeEach/afterEach
const post = async (path, name) => {
  const token = process.env.KEPLOY_MOCK_AGENT_TOKEN;
  const headers = {"Content-Type": "application/json"};
  // Absent on an older Keploy, which does not require it.
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const r = await fetch(`${process.env.KEPLOY_MOCK_AGENT}${path}`, {
      method: "POST",
      headers,
      body: JSON.stringify({name, pid: process.pid}),
    });
    // A 401 means this test is not scoped — say so rather than swallow it.
    if (!r.ok) console.warn(`keploy: scope call ${path} returned ${r.status}`);
  } catch (e) {
    console.warn(`keploy: scope call ${path} failed: ${e}`);
  }
};

test.beforeEach(({}, testInfo) => post("/agent/scope/begin", testInfo.title));
test.afterEach(({}, testInfo) => post("/agent/scope/end", testInfo.title));
```

## Platforms

| Platform                  | How to run                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Linux**                 | Native — `keploy mock record -c "pytest"` (uses eBPF; needs root).                                                                                |
| **Windows** (x86-64)      | Native — same command. Userspace interception, so no Administrator.                                                                               |
| **macOS** (Apple Silicon) | Native — same command. Userspace interception, so no `sudo`. Running your tests in a container, e.g. `-c "docker compose run tests"`, also works. |

Natively on macOS and Windows, Keploy understands HTTP/HTTPS, MySQL and MongoDB
calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like —
are captured only as raw bytes and usually don't replay. If your tests depend on
one of those, run them in a container (as above) or on Linux/WSL. On macOS, also
start the test runner itself rather than through a launcher such as `npm test` or
a wrapper script, and use a Homebrew or uv Python (or a virtualenv built on one),
not Apple's `/usr/bin/python3` — see
[running natively on macOS](/docs/installation/macos-installation/#option-1-run-keploy-natively).
On an Intel Mac, use [Lima](/docs/installation/macos-installation/#option-2-install-keploy-with-lima);
on Windows on ARM, use WSL.

## Refresh in CI

Because re-recording overwrites the set in place and the runner's exit code is
propagated, refreshing mocks on a merge to `main` is a normal CI step:

```bash
# bring up the real dependencies, then:
keploy mock record -c "pytest" --name default
keploy sanitize          # scrub secrets before committing
git add keploy/ && git commit -m "chore: refresh mocks" || echo "no changes"
```

By default `keploy mock` is **registry-first**: the set is uploaded to Keploy
after record and downloaded before replay automatically (registry use depends on
your plan). Pass `--local` to keep everything on disk — the `--local` loop is
also the one that runs without signing in.
