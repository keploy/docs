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
so your test code needs **no SDK and no changes**.
The recorded mocks act as virtual services for your dependencies, which makes this a lightweight form of [service virtualization](https://keploy.io/blog/community/service-virtualization).

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

## Declare the calls your app makes after a test (Enterprise)

Some calls belong to a test but come after its last request: a clean-up your app
runs in a goroutine once a delete has answered, or a sweep that repeats that
clean-up every minute. Keploy records such a call in the next test's window, or
between two tests. Left there, it is required of whichever test it landed in, so
that test fails whenever the clean-up comes earlier or later.

Declare these calls under `mock.rules` in `keploy.yml`. `keploy mock record`
then places each recording a rule covers with the test it belongs to, and
`keploy mock replay` serves and checks it there. Rules work on sets recorded with
per-test scoping, and cover MongoDB calls.

```yaml
mock:
  rules:
    - id: order-items-cleanup
      kind: trailing
      why: Deleting an order deletes its items by order_id in a goroutine, and a sweep repeats it every minute.
      match:
        {mongo: {db: shop, command: delete, collection: [items, itemNotes]}}
      boundBy: [body.docs.msgs.0.q.order_id]
    - id: empty-carts-delete
      kind: background
      why: A timer deletes the carts left with no items.
      match: {mongo: {db: shop, command: delete, collection: carts}}
      where: [{field: body.docs.msgs.0.q.items, equals: []}]
```

| Key       | What it says                                                                                                                        |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | The rule's name: 3 to 64 lowercase letters, digits and dashes, starting with a letter or digit. Each rule needs its own.            |
| `kind`    | `trailing`: work the app does for a test after the test asked for it. `background`: a request the app repeats on its own timer.     |
| `why`     | Why the app makes the call, in your words. Required; it is not part of the rule's digest, so rewording it changes nothing.          |
| `match`   | `mongo: {db, command, collection}`, each a literal name (no patterns). `collection` is one name or a list.                          |
| `where`   | Optional, up to 8 exact conditions on the recorded request: `{field: <place>, equals: <value>}`.                                    |
| `boundBy` | `trailing` only, and required there: the places in the recorded request that hold the trailed test's value, such as the deleted id. |

**What a `trailing` rule does.** A recording the rule covers goes with the test
that first sent the value at a `boundBy` place, and the replay serves it wherever
its call lands. When the app repeats the call more times than were recorded, the
last recording answers each repeat, so a slower or faster sweep does not miss.
Each repeat must still match the recorded request, and a call that carries the
test's value at a `boundBy` place but another value elsewhere fails that test.

A trailing write is required once per run of the test it trails: if the app never
makes it, that test fails with `RULE NOT MADE`. Before it decides, the replay
waits while the app is still making progress on what it owes, with no fixed
timeout. A read, or a write whose every recording changed nothing (`n`,
`nModified` or `deletedCount` 0), is served but not required.

On macOS and Windows, keploy waits only on what it can see still running. On
macOS it tells that the app still runs from the process group your test command
started; a process that leaves that group, such as a daemon started with
`setsid`, is not waited on. On Windows it does not wait on the app once your test
command exits. Either way, a trailing write still owed then fails its test with
`RULE NOT MADE`, never a silent pass.

**What keploy refuses, and why.** keploy places or binds a call only when it can
tell which test sent the value, and otherwise leaves the call where it was
recorded:

- A test with no recorded requests (no cases) cannot show which values it sent
  the app, so a rule's call recorded in its window stays that test's own.
- If the test sent the value first at two fields of its requests, keploy cannot
  tell which one the clean-up's value came from, so the call is not bound to that
  test's value and stays where it was recorded.

**What a `background` rule does.** One request with one answer that the app
makes in several windows is served in any window. A background write is required
once in a run that reaches the test it was first recorded in.

**Rules are read whole or not at all.** If keploy cannot read every rule, it
prints `RULES REFUSED` with the first problem and runs no `keploy mock` command
until you fix it: an unknown key, a missing `id`, `kind`, `why` or `match`, two
rules with one `id`, a pattern in a name, an unknown command, a place that does
not parse, or a `trailing` rule without `boundBy`.

**What the rules leave behind.**

- Each recording a rule placed names it in `mappings.yaml` (`rule: <id>@<8 hex>`)
  with the reason it was placed. A recording two rules cover stays where it was
  (`RULES CONFLICT`), and one a rule matched but could not place says why
  (`RULE DID NOT HOLD`).
- `keploy.lock` pins the rules each set was recorded with, with a note such as
  `5 rules (trailing 4, background 1); 412 calls placed, for 31 tests`. A replay
  whose `keploy.yml` rules differ prints `RULES CHANGED` and does not run: record
  the set again with the new rules, or put back the old ones.
- At the end of a replay, one `RULE USED` line per rule says what its series
  answered, how many repeats went past the recorded count, and how many required
  series were made, not made, or not due because their test did not run.

## Times and ids your app makes (Enterprise)

When `keploy mock record` runs your tests a second time to learn what changes
from run to run, two kinds of field differ in every run: a time your app reads
from its clock, and an id it makes anew for a call. Keploy checks a changed time
by its type and format with no rule. Declare an id your app mints with a
`minted` rule in `keploy.yml`.

**Times are checked by their type and format.** On a MongoDB call, a time that
changed between the two runs passes at replay with any value of the type and
format it was recorded in: the same BSON type, an epoch number in the same unit
(seconds, milliseconds, microseconds or nanoseconds), or a text with the same
field order, separators and zone form, with or without a fraction of a second.
A time your app wrote in two formats in the two runs (a zone offset in one and
`Z` in the other, or an epoch in seconds in one and in milliseconds in the
other) passes in either. Keploy does not check the time's range or which clock
read it: your tests' own assertions check the test, and keploy's check is a
bonus over them. A value of another type or format fails the test, and the line
names both. On an HTTP call, a time your app copied from an earlier read of its
clock passes by its format where it no longer equals that read; HTTP's other
times, and times on other calls, are still checked by their range and which
clock read them.

A field is a time when its decoder types it as one (a BSON datetime or
timestamp), when keploy learned it as a read of your app's clock, or when a
`clock` rule declares it. A text that only looks
like a date, or a number that only looks like an epoch, is not a time: keploy
checks it like any other value.

To check times strictly instead (the range, the cut, the zone and which clock
read the value), set `strict`, the only value `mock.times` takes. Any other value
is refused with `RULES REFUSED` before anything runs.

```yaml
mock:
  times: strict
```

**Declare a read of the clock.** A `clock` rule says your app reads a field from
its clock for the call. Keploy then learns the field as a read of the clock even
where the same moment also stands in an earlier answer, but only where the
replay's own clock check holds it in both runs. With the time default on, a
time keploy learns as a read of the clock needs no rule. Declare one for a time
your app copies from an earlier answer, such as a record's creation time written
again in an audit row: keploy learns that as a copy, and the time default does
not cover a copy.

```yaml
mock:
  rules:
    - id: audit-audited-at
      kind: clock
      why: The audit insert sets auditedAt to time.Now().Unix().
      match: {mongo: {db: shop, command: insert, collection: audits}}
      field: body.docs.msgs.0.auditedAt.$numberLong
      clock: {min: -1s, max: 0s, res: 1s}
```

**Declare an id your app mints.** A `minted` rule says your app makes the field's
whole value anew for the call, such as the UUID it gives a new document:

```yaml
mock:
  rules:
    - id: order-id
      kind: minted
      why: CreateOrder gives each new order a fresh uuid.NewString().
      match: {mongo: {db: shop, command: insert, collection: orders}}
      field: body.docs.msgs.0._id
```

At replay keploy binds the new id, and every later call that uses it must send
the same value, as must any other field of the same request that recorded the
whole id, alone or inside a longer text, or a part of it long enough not to be
there by chance (32 bits or more, such as a UUID's last group, or two groups of
a key like `QX7K-M2RD-T9VB-W4HZ`). A short piece of the id that stands in
another field by chance, such as one letter, a UUID's four-digit group or one
group of such a key, does not tie that field to the id. A recording no test owns, such as a
background worker's insert, mints its own id at each call: keploy checks that id
the same way, and a field of the same request that recorded the whole id must
carry the call's new one, but no later call is held to it. On such a recording,
a field that holds the id's words rather than the whole id, such as
`apps/<uuid>` for a UUID id or the bare UUID of an `apps/<uuid>` id, is not
learned. The id fails its test with `minted value reused` when it is the
recorded value, or one the run already bound at a minted field, and with
`minted value of another shape` when it lacks the prefix the recorded ids share
or its length lies outside theirs. Keploy does not check which characters follow
the prefix, so a fresh id never fails for a character the recordings did not
show. A part of the id your app copied from an earlier call, such as the tenant
in `<tenant>-<random>`, is still checked against this run's value.

| Key     | What it says                                                                                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field` | `clock` and `minted`: one place in the recorded request that names a whole value, such as `body.docs.msgs.0._id`. Not a word of a value (`#n`) or a decoding step.           |
| `clock` | `clock` only: `{min, max, res}`, each a duration with its unit. The value lies from `min` to `max` of the call, read at the cut `res`; the range is at most two cuts and 1s. |

Clock and minted rules cover MongoDB calls. A rule on an `http` target is refused
with `RULES REFUSED`.

**What these rules leave behind.** Each recording a `clock` or `minted` rule
covers carries the rule as `sources:` in `mappings.yaml`. `keploy.lock` pins
them, and a pull writes them back, so CI's replay checks the field as the judge
did. One `RULE DECLARED` line per rule says how many recordings it matched and
how many it declared. A recording it matched but could not declare is named in a
`RULE DID NOT HOLD` line, for example when the request holds no value at the
field. Two rules that declare one field of one recording are a `RULES CONFLICT`,
and neither applies.

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
