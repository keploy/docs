---
id: mock-your-tests
title: Mock Your Own Tests (pytest, go test, jest)
sidebar_label: Mock Your Tests
description: Use Keploy as a language-agnostic mocking and service virtualization tool for your existing test suite — record the real dependency calls your tests make, then replay them so the suite runs without the real dependencies.
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
  - service virtualization
---

# Mock Your Own Tests

`keploy mock` lets you use Keploy as a **mocking framework for your existing test
suite** — pytest, `go test`, jest/playwright, or any command that makes network
calls. It is a language-agnostic VCR / WireMock that works at the network layer,
so your test code needs **no SDK and no changes**. That holds for the commands
below. To have Keploy prove each test on its own with `KEPLOY_PROVEN=1`, your
test framework also tells Keploy where each test starts and ends, through a small
integration: see [Prove each test offline](#proven).
The recorded mocks act as virtual services for your dependencies, which makes this a lightweight form of [service virtualization](https://keploy.io/blog/community/service-virtualization).

- `keploy mock record -c "<your test command>"` runs your tests and captures the
  real outgoing dependency calls (HTTP, MySQL, …) into a named **mock set**.
- `keploy mock replay -c "<your test command>"` runs your tests again with those
  calls served from the mock set, so the real dependencies can be **offline**.

Keploy propagates your test runner's **exit code**, so it drops straight into CI.

Using VS Code? The [Keploy VS Code extension](/docs/running-keploy/utg-vscode-extension/)
installs the CLI, signs you in and hands the setup to your coding agent, which
runs these commands. Its
[troubleshooting table](/docs/running-keploy/utg-vscode-extension/#troubleshoot)
explains the messages it shows.

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

Add `--strict` to fail the run if a call **missed** its recorded mock (a dependency
contract drifted), even when the tests themselves passed. A DNS lookup with no
recorded mock (Keploy answers it itself), or a connection whose client sent
nothing, does not fail it by itself.

## Prove each test offline (`KEPLOY_PROVEN=1`) {#proven}

With `KEPLOY_PROVEN=1` in its environment, `keploy mock record` does more than
save the calls. After it records your suite against the real dependencies, it
replays every test with the dependencies off, twice: once to learn which values
change from run to run, and once the way CI will run it. A test that replays is
kept. A test that doesn't is skipped from then on, with Keploy's reason and what
to do about it. `keploy mock replay` with the same switch runs the kept tests,
each against its own recording, so a green replay means every test it ran passed
with no real dependency behind it.

### Requirements {#proven-requirements}

- **Linux, or macOS on Apple silicon.** On Linux, Keploy's agent runs as root, so
  Keploy starts it with `sudo` unless you run Keploy as root. Where nobody can
  type a password, such as a CI runner, that `sudo` must work without one, as it
  does on GitHub-hosted runners. macOS needs no `sudo`. On Windows,
  `KEPLOY_PROVEN=1` doesn't run yet: run the commands above without it.
- **A test command Keploy runs directly.** In this release, Keploy refuses a
  Docker command or `--from-container` under the switch, and says so.
- **The integration for your test framework.** Each test tells Keploy where it
  starts and ends, so Keploy can judge it, skip it, or fail it on its own:
  - **Go:** add [`github.com/keploy/go-sdk/v3`](https://pkg.go.dev/github.com/keploy/go-sdk/v3/keploytest)
    and make `defer keploytest.T(t)()` the first statement of every top-level
    test (`keploytest.TP` for a test that calls `Parallel`). Run the suite with
    `go test -p 1 -json ./...`. Without Keploy, the line does nothing.
  - **Playwright:** add [`@keploy/playwright`](https://www.npmjs.com/package/@keploy/playwright)
    and run with `--workers=1 --retries=0`.
  - **Any other framework:** the test process makes the calls itself, as
    [Per-test scoping](#per-test-scoping-optional) describes.
- **`mock.command` in `keploy.yml`.** It's the command CI runs your tests with.
  Under the switch, `keploy mock record` and `keploy mock replay` run it when you
  don't pass `-c`:

  ```yaml
  mock:
    command: go test -p 1 -json ./...
  ```

- **A Keploy account,** unless you keep the recordings in the repository (below).
  Sign in with `keploy login`. `keploy app create` creates the Keploy app for the
  repository and saves its id as `mock.appId` in `keploy.yml`.

### Record and judge {#proven-record}

```bash
export KEPLOY_PROVEN=1
keploy mock record --lock keploy.lock
```

The first record with `--lock keploy.lock` creates `keploy.lock` beside
`keploy.yml`. The recordings go to Keploy, and `keploy.lock` pins them by their
SHA-256 hash, so every commit replays exactly the recordings it pins. Later
records and replays find `keploy.lock` by themselves.

When the record ends, it says what it decided: `QUARANTINED` with the reason for
each test it set aside, a `FIX` line for each kind of failure, `RUNS AGAIN` for a
test that replays now, and `DROPPED` for a skip that no longer applies. A test it
sets aside gets a `skip:` line under its entry in `keploy.lock`, which holds only
for that recording: record the test again and it runs again.

To keep the recordings in the repository instead, with no account, set
`mock.local: true` in `keploy.yml` (or pass `--local`). The record then writes
`keploy/<set>/` and no `keploy.lock`, and a test it sets aside is listed in
`keploy/<set>/verdicts.yaml`.

Then run:

```bash
keploy mock status
```

It reads the repository and prints a `NEXT` block: where things stand, the
command to run next, and what to do around it. Follow it until the replay is
green.

### Commit and run in CI {#proven-ci}

Commit `keploy.yml` and `keploy.lock`. With `mock.local: true`, commit
`keploy/` instead, keeping `keploy/.gitignore` as Keploy wrote it.

In CI, the job installs Keploy and runs the same replay, with no database or
service running: every call is answered from the recordings. On GitHub Actions,
the VS Code extension's **Keploy: Wire CI (GitHub Actions)** command writes
`.github/workflows/keploy.yml` for a project at the repository's root that has
a `keploy.lock`, and never over a file that is already there. Without the
extension, add the same file. For a Go module, it is:

```yaml
# Written by the Keploy VS Code extension. On every pull request and every
# push to main, it replays the tests on the recordings keploy.lock pins, with
# every dependency switched off (keploy.yml's mock.command runs them), and on
# a pull request it comments what the pull request's keploy.lock changes.
# It needs one repository secret, KEPLOY_API_KEY: a read-only CI key from
# https://app.keploy.io/settings/service-accounts
name: keploy
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
  pull-requests: write
jobs:
  replay:
    runs-on: ubuntu-latest
    env:
      KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
      KEPLOY_INVOKER: ci
      KEPLOY_PROVEN: "1"
    steps:
      - uses: actions/checkout@v4
        with:
          # keploy mock diff compares keploy.lock with its merge base.
          fetch-depth: 0
      - uses: actions/setup-go@v5
        with:
          go-version-file: go.mod
      - name: Install Keploy
        run: |
          keploy_rc=0; keploy_sh="$(mktemp)" && curl -fsSL https://keploy.io/ent/install.sh -o "$keploy_sh" && bash "$keploy_sh" || keploy_rc=$?; rm -f "$keploy_sh"; [ "$keploy_rc" -eq 0 ]
      - name: Check the Keploy key
        run: |
          if [ -z "$KEPLOY_API_KEY" ]; then
            echo "::error::Add a repository secret named KEPLOY_API_KEY, a read-only CI key from https://app.keploy.io/settings/service-accounts. A pull request from a fork gets no secrets."
            exit 1
          fi
      - name: Replay on the recordings keploy.lock pins
        # --lock fails the job when keploy.lock is missing, and --on-miss fail
        # fails a call the recordings do not hold instead of letting it out.
        run: |
          keploy mock replay --lock keploy.lock --on-miss fail
      - name: Comment what keploy.lock changes
        if: ${{ always() && github.event_name == 'pull_request' }}
        continue-on-error: true
        env:
          GH_TOKEN: ${{ github.token }}
          PR: ${{ github.event.pull_request.number }}
        run: |
          body="$RUNNER_TEMP/keploy-mock-diff.md"
          { echo '<!-- keploy mock diff -->'; keploy mock diff --markdown --base "origin/$GITHUB_BASE_REF"; } > "$body"
          id=$(gh api --paginate "repos/$GITHUB_REPOSITORY/issues/$PR/comments" --jq '.[] | select(.body | startswith("<!-- keploy mock diff -->")) | .id' | head -n 1)
          if [ -n "$id" ]; then
            gh api -X PATCH "repos/$GITHUB_REPOSITORY/issues/comments/$id" -F body=@"$body" > /dev/null
          else
            gh pr comment "$PR" --repo "$GITHUB_REPOSITORY" --body-file "$body"
          fi
```

For a test command run with `npm`, `npx`, `node`, `yarn` or `pnpm`, the
toolchain step is `actions/setup-node@v4` with `node-version: lts/*`, followed by
`npm ci` when the project has a `package-lock.json`. For any other test runner,
the file has no toolchain step: add the one your tests need.

- `KEPLOY_INVOKER: ci` makes a missing key fail the job at once instead of
  waiting for a sign-in, and the key check before the replay says what to add.
- `--lock` fails the job when `keploy.lock` is missing, and `--on-miss fail`
  fails a call the recordings don't hold instead of letting it reach the
  network.
- On a pull request, the last step comments the table `keploy mock diff
--markdown` prints: the tests the pull request re-records, read from its
  `keploy.lock` against the base branch's. A later push updates that comment. That step needs the
  full history (`fetch-depth: 0`) and `pull-requests: write`, and a failure in
  it never fails the job.
- On Linux, Keploy starts its agent with `sudo`, which GitHub-hosted runners
  allow without a password.

**The CI key.** The replay signs in with a read-only key of a service account,
which an admin of your Keploy organization makes: in
[app.keploy.io](https://app.keploy.io/settings/service-accounts), open
**Account → Service Accounts**, create a service account, give it access to the
app, and create a key. Save it as the repository secret `KEPLOY_API_KEY`, under
the repository's **Settings → Secrets and variables → Actions**, or with the
GitHub CLI, which asks for the value so it stays out of your shell history:

```bash
gh secret set KEPLOY_API_KEY
```

Then commit `.github/workflows/keploy.yml` with `keploy.yml` and `keploy.lock`,
and push. GitHub gives no repository secrets to a pull request from a fork, so
its replay can't sign in.

The replay downloads only the recordings of the tests it runs. Each one is named
by its hash and kept in `~/.cache/keploy/mocks` (set `KEPLOY_MOCK_CACHE_DIR` to
move it). To save the downloads on the next run, cache that folder, keyed on
`keploy.lock`, with a step before the replay:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/keploy/mocks
    key: keploy-mocks-${{ hashFiles('keploy.lock') }}
    restore-keys: keploy-mocks-
```

Cache that folder itself, never a parent such as `~/.cache`.

With `mock.local: true`, the recordings come with the checkout and there is no
`keploy.lock`: drop `KEPLOY_API_KEY`, the key check and the comment step, and
run `keploy mock replay --local` instead.

Using GitLab CI? It's available on request: contact the Keploy team at
[support@keploy.io](mailto:support@keploy.io) and we'll set it up with you. The
same goes for any other CI. The step it runs is
`KEPLOY_PROVEN=1 keploy mock replay --lock keploy.lock --on-miss fail`, in the
project's folder, with the CI key in `KEPLOY_API_KEY`.

### Share with your team {#proven-team}

An admin of your Keploy organization adds each teammate in
[app.keploy.io](https://app.keploy.io/settings/users/add-user) under
**Account → Users → Add User**, with
the email they sign in with. A teammate then needs only Keploy, the test
toolchain and a sign-in:

```bash
keploy login
git clone <your repository> && cd <your repository>
KEPLOY_PROVEN=1 keploy mock replay
```

The replay reads the committed `keploy.yml` and `keploy.lock`, downloads the
recordings the lock pins, and runs the suite with every dependency off. With
`mock.local: true`, the recordings come with the clone and the replay needs no
sign-in.

### Skipped tests {#proven-skips}

| Command                                          | What it does                                                                                                            |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `keploy mock explain <test>`                     | Says why a test is skipped or run: its evidence, its recorded calls, and what its last replay and judging rounds did.   |
| `keploy mock quarantine <test> --reason "<why>"` | Skips a test in CI, with your reason, until it's recorded again. `--undo` runs it again.                                |
| `keploy mock check`                              | Reads the recordings offline after a hand edit and names each mistake with its file, line and fix. Exits 1 on an error. |
| `keploy mock judge`                              | Judges the recordings again, for example after a Keploy upgrade, and drops the skips of tests that now replay.          |
| `keploy mock replay --all`                       | Also runs the skipped tests.                                                                                            |
| `keploy mock replay -- -run TestPlaceOrder`      | Runs part of the suite: what follows `--` goes to the test command.                                                     |

Each of these runs only with `KEPLOY_PROVEN=1` set. Name a Go test as `go test
-run` takes it (`TestPlaceOrder`), or as `<package dir>::<TestName>` when two
packages share the name. Commit `keploy.lock` with any change these make.

## Per-test scoping (optional)

By default a set is recorded and replayed suite-wide. For per-test isolation — so
each test gets exactly its own mocks — your test runner can mark test boundaries
through a tiny HTTP API. Keploy exports two variables into your test process: the
agent's address as **`KEPLOY_MOCK_AGENT`**, and the credential for it as
**`KEPLOY_MOCK_AGENT_TOKEN`**. Call the API at the start and end of each test,
sending the token as a bearer credential:

```
POST  {KEPLOY_MOCK_AGENT}/agent/scope/begin   {"name": "<test name>"}
POST  {KEPLOY_MOCK_AGENT}/agent/scope/end     {"name": "<test name>"}

Authorization: Bearer {KEPLOY_MOCK_AGENT_TOKEN}
```

At record time this writes a per-test `mappings.yaml`; at replay time it restricts
the served pool to that test's mocks. No scope calls ⇒ suite-level, which is still
correct. Run the tests one at a time (see below).

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

:::caution Run tests one at a time
Per-test scoping keeps tests apart only when they run one after another:
`go test -p 1 -parallel 1`, Playwright `--workers=1`, jest `--runInBand`, pytest
without `-n`. Sending the test process's PID as `pid` (Node `process.pid`, Python
`os.getpid()`) does not keep tests that run at the same time apart. At record, a
call made by any other process (a child the test starts, an app server the tests
share) goes to whichever test was open when it was made; at replay, a process the
test did not start, such as a shared app server, is served the whole recording.

Leave `pid` out of both calls, as the calls above and every example below do. A
begin without a `pid` narrows what the whole run is served to the test's mocks,
on every connection. A begin with a `pid` narrows only the connections that the
test process, or a process it started, opens while a test is open. Pooled
connections the app opened outside a test, such as a database pool it filled at
start-up or between two tests, would be served every test's mocks at replay, and
so would every connection of an app the tests share but did not start, such as
Playwright's `webServer` or a server started before the suite.

These calls are for runs without `KEPLOY_PROVEN=1`. Under it Keploy refuses them
(`422 upgrade_integration`): there a test marks its boundaries through Keploy's
scope protocol v1, which two integrations speak: go-sdk's
[`keploytest`](https://pkg.go.dev/github.com/keploy/go-sdk/v3/keploytest) for
`go test` (`go test -p 1`), and
[`@keploy/playwright`](https://www.npmjs.com/package/@keploy/playwright) for
Playwright (`--workers=1 --retries=0`). Keploy runs one test process at a time
there and refuses a second. There is no integration for other frameworks: their
test process makes the calls by hand. It claims the run
(`POST {KEPLOY_MOCK_AGENT}/agent/instance` with `{"key": "<package folder>"}`,
the folder relative to the project) before its first test, then sends
each test's begin with `"canSkip": true`, skips the test when the begin answers
`"action": "skip"`, and sends its end, never with `pid`, `at`, `dir` or `suite`.
:::

**pytest** (`conftest.py`):

```python
import os, json, urllib.request, warnings, pytest

AGENT = os.environ.get("KEPLOY_MOCK_AGENT")
TOKEN = os.environ.get("KEPLOY_MOCK_AGENT_TOKEN")

def _post(path, name):
    if not AGENT:
        return
    body = {"name": name}  # run pytest without -n: see above
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
    // Run go test -p 1 -parallel 1: see above.
    body, _ := json.Marshal(map[string]any{"name": name})
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
two calls with the test's name. Run jest with `--runInBand` and Playwright with
`--workers=1`:

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
      body: JSON.stringify({name}),
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

| Platform                  | How to run                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Linux**                 | Native — `keploy mock record -c "pytest"` (uses eBPF; needs root).                                                                  |
| **Windows** (x86-64)      | Native — same command, without `KEPLOY_PROVEN=1`. Userspace interception, so no Administrator.                                      |
| **macOS** (Apple Silicon) | Native — same command. Userspace interception, so no `sudo`. Without `KEPLOY_PROVEN=1`, `-c "docker compose run tests"` also works. |

Natively on macOS and Windows, Keploy understands HTTP/HTTPS, MySQL and MongoDB
calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like —
are captured only as raw bytes and usually don't replay. If your tests depend on
one of those, run them in a container (as above) or on Linux/WSL. On macOS, also
start the test runner itself rather than through a launcher such as `npm test` or
a wrapper script, and use a Homebrew or uv Python (or a virtualenv built on one),
not Apple's `/usr/bin/python3` — see
[running natively on macOS](/docs/installation/macos-installation/#option-1-run-keploy-natively).
Keploy doesn't support Intel Macs. On Windows on ARM, use WSL.

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
