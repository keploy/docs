---
id: troubleshooting
title: Troubleshoot the Universal Mocker
sidebar_label: Troubleshooting
description: What keploy mock record and keploy mock replay print when something goes wrong, what causes it, and how to fix it, from a call with no recording to a replay that passes on your machine but fails in CI. Every message is from Keploy 3.9.4.
tags:
  - mocks
  - troubleshooting
  - keploy mock
keywords:
  - keploy mock replay fails
  - no recorded mock matched an outgoing call
  - mock mismatch
  - 502 Bad Gateway in replay
  - replay verified nothing
  - keploy mock status
  - not signed in CI
  - service virtualization
---

# Troubleshoot the Universal Mocker

This page lists what Keploy prints when a record or a replay goes wrong, what
causes it, and how to fix it.

Every output here is from Keploy 3.9.4, in a Go project whose tests call a
rates API on `localhost:8090`, with the recordings kept in the repository
(`--local`). The output is trimmed: timestamps and lines that don't matter are
cut. Tags such as `#a0064248d208` change on every run, so this page shows them
as `#…`.

## Start with `keploy mock status`

Run `keploy mock status` after any record or replay. It reads the files under
`keploy/` and prints a block that says where the project is and what to run
next:

```text
$ keploy mock status
=== KEPLOY NEXT ===
phase:    verified_red
summary:  The last replay of default failed: the tests failed on the last replay (exit 1).
ask:      Want me to find out why? A red replay is either a regression in the code, or a dependency call the recording does not have.
run:      keploy mock replay --local -c 'go test -count=1 ./...' --on-miss fail
do:       Re-run the replay and read its output. `no recorded mock matched an outgoing call` lines are calls the recording lacks: …
options:
  - re-run the replay → keploy mock replay --local -c 'go test -count=1 ./...' --on-miss fail
  - re-record against the real dependencies → keploy mock record --local -c 'go test -count=1 ./...'
===================
```

| Field      | What it says                                                       |
| ---------- | ------------------------------------------------------------------ |
| `phase`    | Where the project is. The table below lists each phase.            |
| `summary`  | The state of each recording, in one sentence.                      |
| `caveats`  | Anything else to know, such as recordings not in Keploy Cloud yet. |
| `ask`      | The question a coding agent asks you before it runs `run`.         |
| `run`      | The command to run next.                                           |
| `do`       | The steps behind `run`, in full.                                   |
| `options`  | The other commands that make sense now.                            |
| `protocol` | How a coding agent should use the block.                           |

| Phase            | What it means                                                                                                | What to do                                              |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| `uninitialized`  | Nothing is recorded yet.                                                                                     | Record with the real dependencies up.                   |
| `recorded`       | A recording exists, but no replay has shown that the tests pass with every dependency off since it was made. | Stop the dependencies and replay with `--on-miss fail`. |
| `verified_red`   | The last replay failed.                                                                                      | Read its output. The sections below cover each failure. |
| `verified_green` | The last replay passed, and the recording answered every call.                                               | Run the replay in CI.                                   |

A `recorded` summary says why the recording isn't proven yet:

| Summary ends with                                                                           | Cause                                                                                    |
| ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `(never replayed on this machine)`                                                          | You recorded but haven't replayed on this machine. A fresh clone starts here too.        |
| `(re-recorded since its last replay)`                                                       | You recorded again after the last replay.                                                |
| `(--on-miss passthrough lets a call the recording does not have reach the real dependency)` | The last replay let unrecorded calls through to the real services, so it proves nothing. |

## A call has no recording

Your test fails in a replay, and Keploy prints `no recorded mock matched an
outgoing call`. Here a test was added after the last record, and its call to
`/rates?from=EUR&to=GBP` isn't in the recording:

```text
$ keploy mock replay --local -c "go test -count=1 ./..."
🐰 Keploy(agent): WARN  mock mismatch: no matching mock for outgoing call  {"protocol": "HTTP", "destination": "{}:8090 #…", "call": "GET /{}", "path_tag": "#…", "match_phase": "no_schema_candidates", "candidates": 1, "closest": "mock-0", "next_step": "Only values drifted (query.to). …"}
--- FAIL: TestEURGBP (0.00s)
    rate_test.go:41: GET /rates?from=EUR&to=GBP: 502 Bad Gateway
FAIL
FAIL	example.com/rates	0.149s
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 1, "missed": 1}
🐰 Keploy: WARN  no recorded mock matched an outgoing call  {"protocol": "HTTP", "call": "GET /{}", "path_tag": "#…", "destination": "{}:8090", …}
  Mock mismatch: [HTTP] GET /rates [path tag #…]  →  localhost:8090 [host tag #…]
  Hint: Only values drifted (query.to). If the change is expected, re-record the mock set with 'keploy mock record', or, with the dependency reachable, capture the new calls with 'keploy mock replay --on-miss record'. …
🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
```

A replay runs with `--on-miss fail` unless you say otherwise. Keploy answers a
call that the recording doesn't have with an error, and never lets it reach the
real service. An HTTP client gets `502 Bad Gateway`. The log lines write `{}`
and a tag where the host and the path go. The `Mock mismatch` line at the end
names them, and its `Hint` says what is different:

| Hint says                                                                                       | Cause                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Only values drifted (query.to).`                                                               | The call matches a recorded call except for the values in the brackets. Here the test asked for `to=GBP`, and the recording has only `to=USD`.                                                                                                                                                                                      |
| `No recorded mocks were available to match against for this protocol in the selected mock set.` | The recording has no call of this kind at all. If the replay also warns `the mock set is empty`, there is no recording: see [The mock set is empty](#the-mock-set-is-empty).                                                                                                                                                        |
| `Each test is served the HTTP calls it recorded.`                                               | Keploy serves each test only the HTTP calls that it recorded itself. If another test recorded this call, and every test may make it, such as fetching a token, declare it as a [session call](./guides/background-workers.md#serve-a-call-to-every-test). The hint calls the file `keploy.yaml`: it is your project's `keploy.yml`. |

If you didn't mean to change the call, the replay found a regression: fix the
code. If you did, record the new call:

1. Start the real dependencies.
2. Record again:

   ```bash
   keploy mock record --local -c "go test -count=1 ./..."
   ```

   ```text
   ok  	example.com/rates	0.008s
   🐰 Keploy: INFO  recorded mocks  {"mocks": 2, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   ```

3. Stop the dependencies, and replay:

   ```bash
   keploy mock replay --local -c "go test -count=1 ./..."
   ```

   ```text
   ok  	example.com/rates	0.149s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 0}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 2}
   ```

To add only the new calls and keep the rest of the recording, replay with the
dependencies up and `--on-miss record` instead of step 2:

```bash
keploy mock replay --local --on-miss record -c "go test -count=1 ./..."
```

```text
🐰 Keploy(agent): INFO  on-miss: served an unrecorded call from the real dependency  {"Type": "http", …, "policy": "record"}
ok  	example.com/rates	0.158s
🐰 Keploy: INFO  appended new dependency calls to the mock set (--on-miss record)  {"new": 1, "mock-set": "default", "next_step": "review the added mocks and commit them; the next replay serves them without the real dependency"}
🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "--on-miss record lets a call the recording does not have reach the real dependency"}
```

Then do step 3. A replay with `--on-miss record` reaches the real services, so
it never proves that your tests run with the dependencies off.

Don't edit `mocks.yaml` by hand, and don't switch to `--on-miss passthrough` to
make a failing replay pass. Both hide the call that changed.

## The mock set is empty

Every call fails in a replay, and Keploy warns first that the mock set is
empty:

```text
$ keploy mock replay --local -c "go test -count=1 ./..."
🐰 Keploy: WARN  the mock set is empty; the runner will hit a miss on every dependency call  {"mock-set": "default", "next_step": "record it first with: keploy mock record -c <the same test command> --name default"}
--- FAIL: TestEURUSD (0.00s)
    rate_test.go:30: GET /rates?from=EUR&to=USD: 502 Bad Gateway
🐰 Keploy: INFO  mock replay summary  {"loaded": 0, "consumed": 0, "missed": 1}
  Hint: No recorded mocks were available to match against for this protocol in the selected mock set. Re-record the mock set with 'keploy mock record'.
```

The replay found no recording of the set it names. Check these, in order:

1. You recorded at all. `keploy mock status` says `phase: uninitialized` when
   nothing is recorded.
2. You replay the same set you recorded. A replay reads the set that `--name`
   names, `default` if you don't pass it.
3. The recording is in this checkout. With `--local`, commit `keploy.yml` and
   the `keploy/` folder. Its `.gitignore` keeps the run files out. With the
   recordings in Keploy Cloud, commit `keploy.lock`, as
   [keploy.yml and keploy.lock](./guides/keploy-yml-and-lock.md) explains.

## The replay "verified nothing"

The test command passes, but the replay exits `1`:

```text
$ keploy mock replay --local -c "go test -count=1 -run NoSuchTest ./..."
ok  	example.com/rates	0.142s [no tests to run]
🐰 Keploy: INFO  mock replay summary  {"loaded": 1, "consumed": 0, "missed": 0}
🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
🐰 Keploy: ERROR  replay verified nothing: the test command served none of the recorded calls  {"mock-set": "default", "loaded": 1, "next_step": "check the test command actually makes the recorded dependency calls, and that the recording is not stale -- re-record it with keploy mock record if it is"}
```

The test command made none of the recorded calls, so the replay shows nothing
about them, and Keploy fails it. This happens when the command runs no test, as
`-run NoSuchTest` does here, or a different set of tests from the one you
recorded. Replay with the same test command that you recorded with.

## The record fails with the dependencies down

A record runs your tests against the real dependencies. If they aren't up, the
tests fail, and Keploy keeps nothing:

```text
$ keploy mock record --local -c "go test -count=1 ./..."
🐰 Keploy(agent): INFO  a dependency did not accept the application's connection; the application's connect failed the same way, as it would without keploy …, and nothing is recorded for that attempt  {"destination": "127.0.0.1:8090", "answer": "refuse", "error": "dial tcp 127.0.0.1:8090: connect: connection refused"}
--- FAIL: TestEURUSD (0.00s)
    rate_test.go:30: Get "http://localhost:8090/rates?from=EUR&to=USD": dial tcp [::1]:8090: connect: connection refused
🐰 Keploy: WARN  tests failed; the recording was not kept or published, and the previous recording is left as it was  {"mock-set": "default"}
🐰 Keploy: WARN  no outgoing calls were captured; the runner made no mockable dependency calls, or its traffic was not intercepted  {…}
🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "record", "exitCode": 1}
```

Start the dependencies, check that your tests pass without Keploy, and record
again. A record whose tests fail never replaces the recording you already have.

## Keploy says a port is taken

```text
🐰 Keploy(agent): WARN  the proxy's port 16789 is taken by pid 26793 (python3); the proxy listens on port 63298 instead
```

You don't need to do anything. Keploy uses a free port instead, and the replay
runs as usual.

## The tests pass on your machine but fail in CI

### Not signed in

```text
$ CI=true keploy mock replay -c "go test -count=1 ./..."
Error: not signed in: CI is set and stdin is not a terminal, so nobody here can approve a sign-in; set KEPLOY_API_KEY to an API key from the Keploy dashboard, or sign in with `keploy login --no-wait` and `keploy login --finish`
```

The command exits `5`. Without `--local`, a replay reads the recordings from
Keploy Cloud, and in CI nobody can sign in:

- If the recordings are in Keploy Cloud, add a CI key from the Keploy dashboard
  to the job as the `KEPLOY_API_KEY` secret.
  [Run the replay in CI](./guides/ci.md) shows a whole job.
- If the recordings are in the repository, pass `--local`, as you did on your
  machine. It needs no sign-in.

### The checkout has no recording

If CI's replay warns `the mock set is empty`, the recording never reached the
runner. See [The mock set is empty](#the-mock-set-is-empty).

`keploy mock status` suggests a guard for this before the replay in CI, so the
job fails at once when the recording is missing:

```bash
test -s keploy/default/mocks.yaml
```

### The test command downloads packages

A replay gives your test command no network. If the command downloads modules
or plugins first, as `go test` and `mvn test` do on a fresh runner, the
download fails, and Keploy reports DNS misses for the package registry, such as
`proxy.golang.org` or `repo.maven.apache.org`. Download them before the replay.
Don't record again: a record would capture the downloads.

- Go: run `go mod download` first, as the
  [Go quickstart](./quickstarts/go.md#step-7-commit-the-recording) does.
- Maven: run a `mvn test` that matches no test first, as the
  [Java quickstart](./quickstarts/java.md#step-7-commit-the-recording) does.

### The runner has no sudo

On Linux, Keploy starts its agent with `sudo` unless the job runs as root, so
the runner needs passwordless `sudo`. GitHub-hosted runners have it.

### A CI key can't record

A CI key can replay, but Keploy Cloud refuses the recordings it uploads, so
Keploy stops a record that is signed in with one:

```text
keploy mock record was not started: this run is signed in with a CI key, and Keploy Cloud refuses the recordings a CI key uploads (CI keys can replay but not publish), so the record would be thrown away after it ran; record with a user's key instead: set KEPLOY_API_KEY to an API key a user made (not a CI key), or unset it and run `keploy login`; CI keeps its key for `keploy mock replay`
```

Record on your machine, signed in as yourself, and keep CI for replays.

## Read the full log

Each run prints where its full log is, under the Keploy banner:

```text
Keploy: 3.9.4
logs: /tmp/keploy-logs-2951337140.txt
```

The [exit codes](./reference.md#exit-codes) in the reference say what each code
means, and how to tell Keploy's codes from your test command's.

## See also

- [Overview](./overview.md): what the Universal Mocker records and replays.
- [Go quickstart](./quickstarts/go.md): a first record and replay, end to end.
- [Network isolation](./guides/network-isolation.md): what a replay sends
  to the real network, and the flags that let a call out.
- [Times, dates and ids that change](./guides/changing-values.md): a test
  that sends a new time or id on every run, or checks a token's expiry.
- [Reference](./reference.md): every `keploy mock` command and flag.
