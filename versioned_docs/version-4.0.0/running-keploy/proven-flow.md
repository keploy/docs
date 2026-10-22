---
id: proven-flow
title: Record, judge and replay tests in CI
sidebar_label: Judged record and replay (KEPLOY_PROVEN)
description: Record API tests with KEPLOY_PROVEN=1, let auto-replay judge which of them replay, commit verdicts.yaml, and run only the kept tests in CI with keploy test.
tags:
  - record
  - replay
  - auto-replay
  - ci
  - verdicts
keywords:
  - KEPLOY_PROVEN
  - verdicts.yaml
  - quarantined tests
  - keploy auto-replay
  - keploy record judging
  - keploy test in CI
  - mappings.yaml
  - RECORDING LOST
---

With `KEPLOY_PROVEN=1`, `keploy record` does more than save tests. When you stop recording, its auto-replay replays every test it just recorded against the recorded mocks, learns what legitimately changes between runs, and judges each test. A test that replays is kept. A test that doesn't is quarantined in `keploy/<test-set>/verdicts.yaml`, with the reason. Your CI then runs `keploy test` with the same switch: it skips the quarantined tests and replays the rest, so a green run means every test it ran replayed against its own recording.

:::note What this release covers
The flow is for Go applications on Linux: amd64 with kernel 5.10 or later, and arm64 with kernel 6.6 or later. Calls over Unix sockets aren't supported. See [Requirements](#requirements).
:::

## When to use it

Use this flow when you want recorded API tests to run in CI with no dependencies running, and you want to trust the result:

- A kept test passed two replays in which every call it made was answered from the recording, and every call recorded for it was made.
- A test that doesn't replay, because it made a call its recording has no answer for, a call changed, or the app isn't deterministic, doesn't block you. Auto-replay quarantines it with the reason, and CI runs the rest of the suite.
- A test that Keploy can't judge at all is different. One that called a dependency over a Unix socket is an example. When you record, such a test leaves its whole test set without a verdict: Keploy writes nothing for the set, and `keploy record` exits 1. See [Tests with no verdict](/docs/running-keploy/verdicts-yaml/#not-judged).

Without `KEPLOY_PROVEN=1`, `keploy record` and `keploy test` work as described in the [CLI reference](/docs/running-keploy/cli-commands/), and `keploy test` ignores `verdicts.yaml`.

## How the flow works

1. **Record.** `keploy record` captures each request to your app as a test case, and each call your app makes to its dependencies as a mock.
2. **Replay every test (the full round).** When you stop recording, auto-replay replays each new test with its mocks. Your app's clock is frozen 61.5 seconds after the moment the test was recorded, so values that come from the clock change. Keploy learns what changed: a response field that differs becomes noise on the test case, and a value your app generated and sent to a dependency becomes a variable that the mock follows.
3. **Replay as CI will (the confirming round).** Keploy runs `keploy test` the way your CI will run it, skipping the tests it's about to quarantine.
4. **Judge.** A test that passed both rounds is kept. A test that didn't is written to `keploy/<test-set>/verdicts.yaml` with a class and a reason. Keploy prints a `JUDGED` line for each test set, then a `NEXT` block that gives CI's command, `KEPLOY_PROVEN=1 keploy test`.
5. **Run CI's command once.** You run that command on your machine. It skips the quarantined tests and replays the rest, exactly as CI will. Its result is the suite's verdict, and when it's green, its `NEXT` block says what to commit and how to wire CI.
6. **Run in CI.** You commit exactly the paths on the `commit:` line of that green `NEXT` block. That line never names a `mocks.yaml` or a `secret.yaml`, but it does name every test set on disk, judged or not, so delete a set you don't want in CI before you run CI's command. Don't run `git add keploy/` instead: it takes every file under `keploy/` that `keploy/.gitignore` doesn't keep out, which can include a set's `secret.yaml`. See [Commit the test sets](#commit). Keploy puts the mocks of each test set that CI would replay green in the Keploy registry, and `KEPLOY_PROVEN=1 keploy test` in CI downloads them, skips the quarantined tests, and replays the rest.

## Requirements {#requirements}

- **Linux.** amd64 with kernel 5.10 or later, or arm64 with kernel 6.6 or later. macOS and Windows aren't part of this release.
- **A Go application,** built with Go 1.20 or later. Other languages aren't part of this release.
- **sudo rights.** Keploy loads eBPF programs, so it runs its agent with `sudo` and may ask for your password. On a CI runner, the runner's passwordless `sudo` is enough.
- **Docker**, if your app runs with `docker run` or `docker compose`.
- **A Keploy account.** `keploy record` puts a judged test set's mocks in the Keploy registry, and `keploy test` downloads them in CI. Sign in once with `keploy login`. In CI, Keploy signs in with an API key: in [app.keploy.io](https://app.keploy.io), open **Settings → API Keys**, create a key, and set it as the `KEPLOY_API_KEY` environment variable.
- **TCP dependencies.** Keploy doesn't capture calls over Unix sockets. When your app calls a dependency over a Unix socket, the test it happened in and every test after it have no verdict, so the test set has none either. When you record, Keploy writes nothing for that test set, not even for its other tests, prints `NOT JUDGED` for it, and `keploy record` exits 1. Reach that dependency over a TCP address instead, for example `localhost:5432` instead of a socket path, mocked or listed in [`mock.real`](#mock-real). Then delete the test set Keploy didn't judge, `keploy/<test-set>`, and record again: a new recording goes to a new test set, and the old one would stay on disk, where `keploy test` replays every one of its tests, judged by nothing. A CI run with a test that has no verdict fails. The sockets of system services that carry no dependency traffic, such as nscd, systemd-resolved, journald, syslog (`/dev/log`) and D-Bus, don't count. The Docker daemon's socket does: an app that drives Docker, for example with Testcontainers, has a real dependency there. See [Tests with no verdict](/docs/running-keploy/verdicts-yaml/#not-judged) for the other causes, and where Keploy names each one.

## Install Keploy and sign in

```bash
curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
keploy login
```

`https://keploy.io/install.sh` hands over to the same installer, so either one installs the same Keploy. If Keploy is already installed on your machine, run `keploy update` instead, so that you have the latest Keploy Enterprise release.

Then turn the flow on for your shell:

```bash
export KEPLOY_PROVEN=1
```

Set it to `1`. `keploy record` and `keploy test` refuse a value they can't read as on or off, such as `yes`, and the other commands take it as off. Set the switch for every Keploy command in this flow: `record`, `test`, `status` and `quarantine`. Without it, `keploy record` doesn't judge, `keploy test` ignores `verdicts.yaml` (it warns that it does, and runs every test, the quarantined ones too), and `keploy quarantine`, `keploy test --all` and `keploy test --judge` don't exist. Once a test set holds a `verdicts.yaml`, a Keploy command run without the switch still ends with this flow's `NEXT` block, with a caveat that the switch isn't set. The commands Keploy prints for you to run carry `KEPLOY_PROVEN=1`: every `keploy` command in the `NEXT` block, except the `keploy mock` commands, which don't need it; the `keploy quarantine` line under `QUARANTINE?`; and the commands in each reason's remedy. A few log lines and errors name a command without it, such as the `next_step` of `keploy record`'s incomplete-verdict log line and the `keploy quarantine` command in the `--must-pass` refusal, so set the switch on every Keploy command of this flow all the same. The examples on this page set it on each command, so you can copy any one of them on its own.

## Record your tests

Pick the command that matches how you run your app.

**Native.** Build your Go binary and start it with `-c`:

```bash
go build -o server .
KEPLOY_PROVEN=1 keploy record -c "./server"
```

Start the Go binary itself in `-c`, not a shell, `make` or a script that starts it. Keploy freezes the clock of the Go binary that `-c` starts, as described in [Freeze time](#freeze-time).

**Start your app's dependencies first.** Keploy records your app's real calls to its database and the other services it calls, with their answers, so they must be up while you record, as they are when you run the app yourself. For example, start a database your compose file defines with `docker compose up -d db`, and give your app the same environment variables it always reads, such as its database address. Only replay, in auto-replay and in CI, runs without them. A compose app is different: `docker compose up` starts its dependency services with it.

**Docker.** Use the `docker run` command you already use, and pass the container's name:

```bash
docker build -t my-app:latest .
KEPLOY_PROVEN=1 keploy record -c "docker run -p 8080:8080 --name my-app my-app:latest" --container-name my-app
```

Keploy runs your container in the network of its own agent container, and moves the command's `-p`, `--network` and `--add-host` options to that container, so your app reaches what it reaches without Keploy. To reach a database on the Docker host, such as one you started with `docker compose up -d db`, use `host.docker.internal` and the port the host publishes, as you would without Keploy: for example `--add-host host.docker.internal:host-gateway -e DB_HOST=host.docker.internal -e DB_PORT=5433`.

**Docker Compose.** Pass the app's service name, or its `container_name`, from your compose file. A compose app needs `--container-name`:

```bash
KEPLOY_PROVEN=1 keploy record -c "docker compose up" --container-name api
```

When Keploy replays a compose app, in auto-replay and in CI, only the app and Keploy's agent run, with the services they can't start without. The app's dependency services stay down, and Keploy answers the app's calls to them from the mocks. A service you name in the command (`docker compose up api redis`) runs too, which is how a [`mock.real`](#mock-real) dependency that is a compose service stays up.

Then send traffic to your app: `curl`, your API test suite, or a script that walks through your endpoints. **Send one request at a time.** When a request starts while another one is still open, Keploy warns `some tests were recorded while another test's request was still open`: it maps each dependency call made while both were open to the test whose request came first, which may not be the test that made it. Such tests can fail auto-replay and be quarantined.

To stop recording, press **Ctrl+C once**, then wait. Keploy says:

```text
auto-replay: recording stopped — now replaying what was just recorded to check for noise. Press Ctrl+C again to skip and exit. Under KEPLOY_PROVEN=1 a skip leaves keploy record with no verdict on what it recorded, so it does not exit 0: a recording that did not fail on its own exits 128+N for the signal (130 for Ctrl+C).
```

Auto-replay runs both rounds and prints its verdict. Don't press Ctrl+C a second time: that skips auto-replay, so nothing is judged, no `verdicts.yaml` is written, and `keploy record` exits 130. To record without a verdict on purpose, pass `--disableAutoReplay`, or set `record.disableAutoReplay: true` in `keploy.yml`. Such a recording isn't judged, and no noise is learned for it. Its `NEXT` block is then the one for a recording that nothing replayed: it asks you to run `keploy test` twice and add each field that differs to that test case's noise list. Don't do that in this flow, where auto-replay learns the noise. To have the set judged, delete its directory, `keploy/<test-set>`, and record it again without the flag.

:::caution Don't pass `--delay` to keploy record
`--delay` is a `keploy test` flag. `keploy record` rejects it as an unknown flag and records nothing: its auto-replay's delay is `--auto-replay-delay`. Under the switch, auto-replay and `keploy test` wait for your app to be ready before they send the first test: it listens on the port the test connects to, or the health URL you gave answers (`--auto-replay-health-url` on `keploy record`, `--health-url` on `keploy test`). Then they wait their delay, 15 seconds for auto-replay (`--auto-replay-delay`) and 5 for `keploy test` (`--delay`), and send it.
:::

### Choose a capture mode {#capture-mode}

Keploy records in one of two modes. Auto-replay and `keploy test` replay the same way in both: Keploy's proxy serves the mocks.

|                                    | Proxy (default)                                                                                                                       | Low latency (`--low-latency`)                                                                                |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| How Keploy records                 | Your app's calls to its dependencies go through Keploy's proxy.                                                                       | Keploy reads your app's traffic in the kernel with eBPF. Nothing sits between your app and its dependencies. |
| HTTPS dependencies while recording | Your app must trust Keploy's CA. Keploy sets this up for common runtimes; see [TLS Docker Support](/docs/running-keploy/docker-tls/). | No CA is needed while recording.                                                                             |
| HTTPS dependencies while replaying | Your app must trust Keploy's CA.                                                                                                      | Your app must trust Keploy's CA: replay always goes through the proxy.                                       |
| Kernels                            | amd64 5.10 or later, arm64 6.6 or later.                                                                                              | The same: low-latency capture loads on arm64 from 6.4, but this flow is supported from 6.6.                  |

To record in low-latency mode, add the flag to the record command:

```bash
KEPLOY_PROVEN=1 keploy record -c "./server" --low-latency
```

`--low-latency` is a `keploy record` flag only. With it, Keploy runs itself with `sudo` from the start, even for a native app.

A client that rejects Keploy's certificate without a word, or hangs up just after its TLS handshake, leaves Keploy unable to tell whether a call was lost. The test it happened in has no verdict, so when you record, its whole test set is `NOT JUDGED`, as for a Unix socket. A Go client doesn't reject a certificate that way: it sends an alert. It does hang up without a word when it gives up, for example on a cancelled context. See [A TLS handshake hung up on](/docs/running-keploy/verdicts-yaml/#tls-hung-up) for what to do.

### Reach a dependency for real {#mock-real}

Under the switch, Keploy records and mocks every call your app makes. To keep a dependency live in recording, auto-replay and CI, list it under `mock.real` in `keploy.yml`:

```yaml
mock:
  real:
    - auth.example.com:443
    - localhost:6379
    - container:redis
```

Each entry is one of:

- **A name and port,** such as `auth.example.com:443`.
- **An address and port,** such as `localhost:6379`, `10.0.4.7:6379` or `[::1]:5432`. `localhost` means both `127.0.0.1` and `::1`.
- **`container:` and an image repository, without a tag,** such as `container:redis` for a container that runs `redis:7-alpine`. It matches every container of that image, on every port. It isn't a container's name or a compose service's name: for a service that runs `image: redis:7-alpine`, write `container:redis`, whatever the service is called. An entry with a tag or a digest, such as `container:redis:7`, is refused.

A test that uses a `mock.real` dependency runs on the real clock, and CI must start that dependency: a run in which a listed destination is never reached fails. For a compose app, name a `mock.real` service in the compose command you record and test with, such as `docker compose up api redis`, or Keploy's replay leaves it down. The `--pass-through-ports` and `--global-passthrough` flags, `keploy record`'s `--opportunistic-tls-intercept` and `keploy test`'s `--mocking`, and the `keploy.yml` settings that match them, such as `passThroughPorts` and `bypassRules`, don't apply under the switch; `mock.real` replaces them.

## Read what auto-replay prints {#read-the-output}

While it replays, auto-replay logs what it learns. A response field that changed is marked as noise on the test case, and a value your app generated and echoed to a dependency is learned as an `echo`, which the mock answers with this run's value:

```text
INFO	auto-noise: marked diff fields as noise on testcase	{"test_set_id": "test-set-0", "test_case": "get-date-1", "fields": ["body.served_at"]}
INFO	learned a field that changed between record and replay	{"Type": "http", "mock": "mock-0", "field": "body.key", "as": "echo"}
```

Keploy learns noise only for a test whose dependency calls were all answered. A test that made a call with no recorded answer keeps failing, and is quarantined with that call as its evidence:

```text
WARN	auto-noise: keploy could not mock a dependency call this testcase made; its differences were not learned as noise and it stays failed
```

After the confirming round, Keploy prints its verdict for each test set:

```text
JUDGED  test-set-0: 5 replayable, 2 quarantined (1 flaky/request_changed, 1 flaky/unstable_order); wrote keploy/test-set-0/verdicts.yaml: commit it
  QUARANTINED  test-set-0/post-learn-batch-1  flaky/unstable_order: HTTP POST /batch to localhost:8096 (no_match) sent an array in another order
  QUARANTINED  test-set-0/post-learn-order-1  flaky/request_changed: HTTP POST /orders to localhost:8096 (no_match) changed
```

### The JUDGED line

`JUDGED  <test-set>: <N> replayable, <M> quarantined (<count> <class>/<reason>, ...); <what happened to verdicts.yaml>`

- **Replayable** tests passed both rounds. CI runs them.
- **Quarantined** tests are listed in `verdicts.yaml`, so CI skips them. The counts in brackets group them by [class and reason](/docs/running-keploy/verdicts-yaml/#reasons).
- A test set with a test that Keploy couldn't judge gets no `JUDGED` line. It gets a `NOT JUDGED` line instead, nothing is written for it, and `keploy record` exits 1: see [Tests with no verdict](/docs/running-keploy/verdicts-yaml/#not-judged).

The line ends with one of:

| Ending                                             | Meaning                                           |
| -------------------------------------------------- | ------------------------------------------------- |
| `wrote keploy/<test-set>/verdicts.yaml: commit it` | Keploy added or changed entries. Commit the file. |
| `keploy/<test-set>/verdicts.yaml unchanged`        | The file already says what Keploy decided.        |
| `it needs no verdicts.yaml`                        | Every test replays, and the set has no file.      |

Under the `JUDGED` line, Keploy can print:

| Line                                                                                                                                  | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `QUARANTINED  <test-set>/<test>  <class>/<reason>: <evidence>`                                                                        | The test is now in `verdicts.yaml`. The evidence names the calls, mocks or response fields without their bodies; the [verdicts.yaml reference](/docs/running-keploy/verdicts-yaml/#fields) says what a URL keeps. See [what to do for each reason](/docs/running-keploy/verdicts-yaml/#reasons).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `RUNS AGAIN  <test-set>/<test>: ...`                                                                                                  | The test replays now, so its old entry no longer applies, and CI runs it again.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `PRUNED  <test-set>/<test>: its recording is no longer on disk`                                                                       | Keploy dropped an entry whose test's recording is gone.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `RECORDING LOST  <test-set>/<test>: ...`                                                                                              | The recording of this test lost data. See [Capture-loss evidence](#recording-lost).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `SET FAILED (in CI's shape): <why>` or `SET FAILED (replaying every test): <why>`, then the same label with `, its evidence: <calls>` | A round's `keploy test` failed the whole set for what none of its tests owns: a call your app made before the set's first test, or after its last, that no recording answers, or a call the set's worker scope recorded that your app no longer makes. CI's `keploy test` fails the set for it whichever of its tests run, so Keploy keeps no test of the set, whichever round saw it: it quarantines them all as `keploy/set_failed`, or `keploy/set_capture_incomplete` when Keploy also couldn't capture all that the set did. When a [`mock.real`](#mock-real) destination that was never reached is all the set failed for, the label adds `, for what only the recordings of <tests> list`, and only those tests are quarantined, as `app-infra/real_not_reached`. |
| `SET FAILED only replaying every test, after <tests>, which CI skips on their own account: ...`                                       | Only the full round failed the set, after it replayed tests that CI skips anyway. The failure may be what those tests did, or it may come again whichever tests run, so Keploy still keeps no test of the set. Fix those tests first.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `NOT CHARGED TO A TEST (in CI's shape): ...`                                                                                          | A dependency call made outside every test that Keploy couldn't answer or capture, such as a background poller's, in the confirming round, which runs as CI does. CI's `keploy test` fails the set on it, so Keploy keeps no test of the set, as for `SET FAILED`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `NOT CHARGED TO A TEST (replaying every test): ...`                                                                                   | The same, seen in the full round, which replays every test. It counts as the confirming round's would.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `NOTE  <test-set>: every test of it CI reaches is quarantined, so CI runs none of it`                                                 | CI runs no test of this set, so none of it is verified, and Keploy doesn't put the set's mocks in the Keploy registry. Don't commit the set: delete it, act on [its reasons](/docs/running-keploy/verdicts-yaml/#reasons), and record again. When every set the record judged gets this line, Keploy says so after the last one: see the two `CI runs none of the tests this record judged` lines below.                                                                                                                                                                                                                                                                                                                                                                 |

Other lines a test set can get:

- `NOT JUDGED  <test-set>: <why>; nothing was written for it`: Keploy couldn't judge the set, so it decided nothing for any of its tests: it writes no `verdicts.yaml` for the set, and doesn't put the set's mocks in the Keploy registry. It happens when a test of the set has no verdict, such as one that called a Unix socket, or when a round stopped early or the app never answered a test. `<why>` says which round stopped and why: for a test with no verdict, it names the cause and the tests, and a `RECORDING LOST` line under it names each of those tests. What to do is in the `next_step` of the replay's `ERROR` line above it, which starts `test-set is not judged:`. Fix what they name, delete the set's directory, `keploy/<test-set>`, and record again. Don't commit the set or upload its mocks: `keploy record` writes a new set when you record again, and leaves this one on disk until you delete it, where `keploy test` replays every one of its tests. [Tests with no verdict](/docs/running-keploy/verdicts-yaml/#not-judged) shows an example. A set with no test case gets `NOT JUDGED  <test-set>: it has no test case to judge`.
- `NOT WRITTEN  <test-set>: keploy/<test-set>/verdicts.yaml changed while keploy record judged, so it stays as it was`: something else changed the file meanwhile, such as a `git pull` or another Keploy run, so nothing Keploy decided for the set was written. The same line ends `could not be written, so it stays as it was` when the write failed, for example on file permissions. Run `KEPLOY_PROVEN=1 keploy test --judge`: it replays the set and prints a `keploy quarantine` command for each test that fails, which you run if you agree (it writes a `manual` entry). Or delete the set and record it again. Until its `verdicts.yaml` says what you decided, don't commit the set or upload its mocks.
- `NOT JUDGED` and `NOT WRITTEN` lines can end `, and the bake of its mappings.yaml's worker scope was put back`. Before the confirming round, Keploy had moved into the set's `mappings.yaml` the recorded calls your app made outside the test that recorded them (see `BAKED` below). Nothing was decided for the set, so Keploy put the file back as `keploy record` wrote it.
- `BAKED  <test-set>: <mock> answers from <where> on, in the set's worker scope (mappings.yaml worker:): ...`, printed before the `JUDGED` line: the full round saw your app make a recorded call outside the test that recorded it, for example from a background job, so Keploy moved that mock to the set's worker scope in `mappings.yaml`. `<where>` is `the set's start`, or `after <test> began`: the earliest point at which the full round saw the call. It's part of what you commit with `mappings.yaml`. `NOT BAKED  <test-set>: ...` says Keploy couldn't read or write the file, so those calls stay with their tests.
- `QUARANTINE?  <test-set>/<test>  ...`, followed by a `KEPLOY_PROVEN=1 keploy quarantine ...` command: a test failed the way CI runs it, and no entry skips it. Keploy never adds that entry by itself. Run the printed command if you agree, or fix the test.
- `keploy record's judging: CI would be red as these lists stand, for what is shown above, so keploy record does not exit 0`: a test CI runs is red, or CI fails a set for what no test owns, and judging decided no entry for it. Fix it before you wire CI.
- `keploy record's judging: CI runs none of the tests this record judged, every one of them quarantined for what is shown above, and no other test set of the project has a test CI runs: CI's keploy test would run no test and fail, so keploy record does not exit 0`: every test the record judged is quarantined, and CI's `keploy test` fails a run in which no test runs.
- `keploy record's judging: CI runs none of the tests this record judged: every one of them is quarantined, for what is shown above. Another test set of the project has a test CI runs, so keploy record keeps its own exit code ...`: the same, but CI still runs the tests of another set, so CI isn't failed for it. None of what this record judged is verified.

### Exit codes

`keploy record` exits 0 when it judged every test set it recorded, wrote what it decided, and its judging found nothing that makes CI red as the lists stand, even if it quarantined tests. Exit 0 isn't the suite's verdict, and it doesn't mean CI will be green. CI's `keploy test` decides by its own rules, not by judging's, and it replays every test set on disk, including one this record didn't judge, such as a set left from an earlier recording. So a script should take only a green [`KEPLOY_PROVEN=1 keploy test`](#gate), run over every test set (without `-t`), as the suite's verdict.

In every other case, `keploy record` prints `keploy record's verdict is incomplete: <why>; it exits <code>`, so that a script can't take an unjudged recording, or one that its judging found CI would fail, for a judged one. That happens when auto-replay judged nothing, a test set was `NOT JUDGED` or `NOT WRITTEN`, a second Ctrl+C stopped it, judging found CI would be red as the lists stand, or CI would run no test at all. It exits 1, or 128 plus the signal's number when a signal stopped the recording's auto-replay or its judging: 130 for Ctrl+C, and 129 for a hang-up, such as a closed terminal, that stopped the recording. When the recording fails on its own, for example because your app exits with an error, `keploy record` exits with that failure's code, and says so on the same line. With `--disableAutoReplay`, nothing is judged, and the exit code is the recording's own.

### The NEXT block

Every `keploy record` and `keploy test` ends with a `NEXT` block, and `KEPLOY_PROVEN=1 keploy status` prints it any time (add `--json` for a machine-readable copy). A judging round is never the suite's verdict, so `keploy record`'s block is never green, and it wires no CI: when its verdict is complete, it gives you CI's own command to run once. After the record above, which kept 5 tests and quarantined 2, it looks like this:

```text
=== KEPLOY NEXT ===
phase:    recorded
summary:  keploy record judged the suite: the tests it kept passed both judging rounds. A judging round is not the suite's verdict: CI's own command is, `KEPLOY_PROVEN=1 keploy test -c './server'`, and it has not run on what keploy record wrote yet. keploy/test-set-0/verdicts.yaml quarantines 2 test(s) of test-set-0 (1 flaky/request_changed, 1 flaky/unstable_order), and CI's keploy test skips them.
ask:      Run CI's command once, on what keploy record wrote? Its result is the suite's verdict, and its NEXT block wires CI.
run:      KEPLOY_PROVEN=1 keploy test -c './server'
do:       Run `KEPLOY_PROVEN=1 keploy test -c './server'` once and follow the NEXT block it ends with. It is the command CI runs: it skips what keploy/<set>/verdicts.yaml quarantines, as CI does, and it writes the run's quarantine.yaml, so its result is the suite's verdict, and its NEXT block wires CI once it is green. ...
options:
  - run CI's command once: its result is the suite's verdict → KEPLOY_PROVEN=1 keploy test -c './server'
  - re-record, once each reason is fixed → KEPLOY_PROVEN=1 keploy record -c './server' --metadata 'name=<descriptive-name>'
protocol: ...
===================
```

When the confirming round failed tests that judging then quarantined, the `summary` starts `keploy record's confirming round failed what it then quarantined`, and when a set failed on its own, it says so, with why. When judging's verdict failed, for example for a `NOT JUDGED` set or a CI that would be red, the block is `verified_red`, and when CI would run no test at all, `verified_empty`: fix what they name, then record again. When judging quarantined every test it judged but another test set of the project has a test CI runs, `keploy record` keeps its own exit code and its block is `recorded`: its `summary` says that none of the tests it judged is verified, and it gives CI's command, which runs the other sets' tests.

#### Run CI's command once {#gate}

Run the command on the `run:` line where you recorded, in the directory that holds `keploy/`:

```bash
KEPLOY_PROVEN=1 keploy test -c "./server"
```

It runs exactly as your CI will: it skips the quarantined tests, replays the rest against their mocks, and applies every rule CI applies. Your app's dependencies don't need to run, except a [`mock.real`](#mock-real) one. Its result is the suite's verdict. When it's green, its `NEXT` block wires CI:

```text
=== KEPLOY NEXT ===
phase:    verified_green
summary:  5 test(s) passed across 1 test-set(s), and CI's keploy test is green: it skips the 2 test(s) keploy/<set>/verdicts.yaml quarantines (1 flaky/request_changed, 1 flaky/unstable_order), and none of those is verified.
caveats:
  - 2 quarantined test(s) did not run (keploy/<set>/verdicts.yaml): this green covers the other tests only. `KEPLOY_PROVEN=1 keploy test --all` runs them; `KEPLOY_PROVEN=1 keploy test --judge` drops the entries of those that now pass.
ask:      Want me to (a) cover another resource, (b) wire CI so this runs on every PR, or (c) stop here?
do:       The quarantined tests are not verified: ... If wiring CI: the Keploy registry holds each test set's mocks; CI downloads them by the hash in the set's config.yaml (KEPLOY_API_KEY required in CI). Commit exactly the paths on the commit: line (relative to the directory that holds keploy/: run `git add` there, and CI's keploy test there too): ... The CI job: check out; install Keploy (`curl --silent -O -L https://keploy.io/ent/install.sh && bash install.sh -isCI`); export KEPLOY_API_KEY from a CI secret; in the directory that holds keploy/, run `KEPLOY_PROVEN=1 keploy test -c './server'` with KEPLOY_INVOKER=ci so a missing session fails fast instead of waiting on a browser login. ...
commit:   keploy.yml keploy/.gitignore keploy/test-set-0/tests keploy/test-set-0/mappings.yaml keploy/test-set-0/verdicts.yaml keploy/test-set-0/config.yaml
options:
  - cover another resource → KEPLOY_PROVEN=1 keploy record -c './server' --metadata 'name=<descriptive-name>'
  - wire CI: add a job that installs keploy and runs `KEPLOY_PROVEN=1 keploy test` on every PR (see do:)
  - stop
protocol: ...
===================
```

The `summary` counts the tests the run ran. The `caveats` line says how many quarantined tests it skipped: a green covers the other tests only. The `JUDGED` line and the `QUARANTINED` lines under it name each one, and so does this run's `QUARANTINED, not run` list, which [CI prints too](#ci). When the run fails, its block is `verified_red`, with each failing test: fix what it names before you wire CI.

| Field      | What it tells you                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phase`    | Where the suite is: `uninitialized` (no test set in `keploy/` yet), `recorded` (judged but not yet run as CI runs it; not replayed since it changed; last replayed without the switch, a run that ignored `verdicts.yaml`; last replayed green over only some test sets, with `-t`; or last replayed before a set's `verdicts.yaml`, mappings or config changed), `verified_green`, `verified_red`, `verified_empty` (the last run scored nothing, so it isn't green), or `ci_wired` (green, with a `.github/workflows/keploy.yml` beside `keploy/`). Only a `keploy test` with the switch, run to its end over every test set as the lists stand, is green: `keploy record`'s judging rounds aren't. A run with the switch that stopped before its end is red. |
| `summary`  | The last run in one sentence, or what `keploy record`'s judging decided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `failures` | Each failing test, with what differed and a remedy.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `caveats`  | What a green doesn't cover, such as the quarantined tests the run skipped. Read them before you call the suite green.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `ask`      | The question to answer next.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `run`      | The command to run next, when there is one: after a record, CI's command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `do`       | The next step in full. After a green `keploy test` it's the CI recipe: what to commit, how to install Keploy, and the `keploy test` command.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `commit`   | Exactly the paths to `git add`, relative to the directory that holds `keploy/`. Only a green block has it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `options`  | Commands for the next step. Every `keploy` command in the block carries the switch, except the `keploy mock` commands, which don't need it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

The commands the block prints leave out `--container-name`. When `keploy record` creates `keploy.yml`, it saves your `-c` command and `--container-name` there, and `keploy test` reads them from the committed file. If your `keploy.yml` existed before you recorded, pass the same `-c` and `--container-name` to `keploy test` yourself.

When `do:` says the Keploy registry doesn't hold a test set's mocks, a CI checkout would have no mocks for that set and its tests would fail. For a set that judging kept green, upload them with the `keploy mock upload -t <test-set>` command it prints, then run `KEPLOY_PROVEN=1 keploy status` again, as `do:` says. The upload writes the set's `config.yaml`, which CI reads, after the run, so `keploy status` reports the suite as `recorded` and gives [CI's command](#gate) to run once more: commit what that run's green block names. The block says this of any set on disk whose mocks the registry doesn't hold, including the ones `keploy record` didn't upload on purpose: a set it printed `NOT JUDGED` for, or one judging counted red (`CI would be red`, or a `NOTE` that CI runs none of it). Don't upload or commit those: delete the set's directory, `keploy/<test-set>`, and record again. For a `NOT WRITTEN` set, settle its `verdicts.yaml` first, as its line says.

## Commit the test sets {#commit}

Once [CI's command](#gate) is green, `git add` exactly the paths on the `commit:` line of its `NEXT` block, from the directory that holds `keploy/`:

```bash
git add keploy.yml keploy/.gitignore keploy/test-set-0/tests keploy/test-set-0/mappings.yaml keploy/test-set-0/verdicts.yaml keploy/test-set-0/config.yaml
```

The `commit:` line names the files of every test set on disk, not only the sets Keploy judged, because CI's `keploy test` replays every set the checkout holds. A green run passed each of them once. But a set that Keploy didn't judge, such as one left on disk by a `NOT JUDGED` record or recorded with `--disableAutoReplay`, was never replayed in both judging rounds, so nothing found which of its tests don't replay, and it has no `verdicts.yaml` to skip them: CI can fail on them later. Delete such a set, `keploy/<test-set>`, and run CI's command once more before you commit: see [Tests with no verdict](/docs/running-keploy/verdicts-yaml/#not-judged).

| Path                                                   | What it is                                                                                                                                               | Commit it?                                                                                                                                                                  |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keploy.yml`                                           | Keploy's settings for your app, such as its command and `mock.real`.                                                                                     | Yes                                                                                                                                                                         |
| `keploy/.gitignore`                                    | Keeps Keploy's local files, such as `reports/`, out of the repository. Once Keploy has put a set's mocks in the registry, it keeps `mocks.yaml` out too. | Yes                                                                                                                                                                         |
| `keploy/<test-set>/tests/`, and `assets/` when present | The test cases, with the noise auto-replay learned.                                                                                                      | Yes                                                                                                                                                                         |
| `keploy/<test-set>/mappings.yaml`                      | Which recorded calls each test owns. Under the switch, only `keploy record` writes it. `mappings.json` in the JSON storage format.                       | Yes                                                                                                                                                                         |
| `keploy/<test-set>/verdicts.yaml`                      | The tests CI skips, and why. See the [verdicts.yaml reference](/docs/running-keploy/verdicts-yaml/).                                                     | Yes                                                                                                                                                                         |
| `keploy/<test-set>/config.yaml`                        | Names the upload of the set's mocks in the Keploy registry. `config.json` in the JSON storage format.                                                    | Yes                                                                                                                                                                         |
| `keploy/<test-set>/seed.sh`, when present              | Your seed script for the set.                                                                                                                            | Yes                                                                                                                                                                         |
| `keploy/<test-set>/mocks.yaml`                         | The recorded dependency calls.                                                                                                                           | **Never.** It's in the Keploy registry. When Keploy puts it there, it adds `/*/mocks.yaml` to `keploy/.gitignore` to keep it out of the repository. Don't remove that line. |
| `keploy/<test-set>/mocks.json` or `mocks.gob`          | The recorded dependency calls, in the JSON or gob storage format. The registry takes only `mocks.yaml`.                                                  | Yes: CI reads it from the checkout, and the `commit:` line lists it.                                                                                                        |
| `keploy/<test-set>/secret.yaml`                        | Secrets that `keploy sanitize` took out of the recording.                                                                                                | Never                                                                                                                                                                       |
| `keploy/reports/`                                      | Run reports.                                                                                                                                             | No                                                                                                                                                                          |

## Run the kept tests in CI {#ci}

The CI job checks out the repository, builds your app, installs Keploy, and runs `keploy test` with the switch on, in the directory that holds `keploy/`. Store your Keploy API key as a CI secret named `KEPLOY_API_KEY`. In GitHub Actions, add `.github/workflows/keploy.yml`:

```yaml
name: keploy
on: [pull_request]

jobs:
  keploy-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version-file: go.mod
      - name: Build the app
        run: go build -o server .
      - name: Install Keploy
        run: curl --silent -O -L https://keploy.io/ent/install.sh && bash install.sh -isCI
      - name: Replay the kept tests
        env:
          KEPLOY_PROVEN: "1"
          KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
          KEPLOY_INVOKER: ci
        run: keploy test -c "./server"
```

- **`KEPLOY_PROVEN: "1"` is required.** Without it, `keploy test` ignores `verdicts.yaml`, runs every test, the quarantined ones too, and judges them the old way, so it can pass tests the flow quarantined. The `NEXT` block such a run ends with, and `keploy status` after it, don't take it for the suite's verdict: they report the suite as `recorded`, and ask for a run with the switch.
- **Use the command you recorded with.** For a Docker app, build the image first, for example with `docker build -t my-app:latest .`, then run `keploy test` with the same `docker run` command. For a Compose app, run it with the same `docker compose up` command. `keploy test` takes `--container-name` from the committed `keploy.yml`, as [the NEXT block](#the-next-block) says. If your `docker run` command names a network with `--network`, create that network in the job first, with `docker network create`.
- **Run it where `keploy/` is.** If `keploy/` isn't at the repository root, for example in a monorepo, set `defaults.run.working-directory` on the job to the directory that holds it, and point `go-version-file` at that directory's `go.mod`: `defaults.run` applies to `run:` steps only.
- **Your app's dependencies don't need to run.** Keploy answers your app's calls from the mocks it downloads from the Keploy registry. Give your app the same configuration it had when you recorded, such as the environment variables it reads at startup. Only a `mock.real` dependency must run in CI.
- **`KEPLOY_INVOKER: ci`** makes a missing sign-in fail at once, instead of waiting for a browser login.
- Don't add `--mappings` or `--freezeTime`. Under the switch, `keploy test` uses the committed `mappings.yaml` and always freezes your app's clock.

The CI run first lists what it skips, and why, with what to do for each reason:

```text
QUARANTINED, not run (2): `KEPLOY_PROVEN=1 keploy test --all` runs them
  test-set-0/post-learn-batch-1  flaky/unstable_order  HTTP POST /batch to localhost:8096 (no_match) sent an array in another order  since 2026-10-20
  test-set-0/post-learn-order-1  flaky/request_changed  HTTP POST /orders to localhost:8096 (no_match) changed  since 2026-10-20
  by class: keploy 0 · app-infra 0 · flaky 2 · manual 0
  flaky/request_changed: a request field changed between runs in a way keploy does not learn: make it deterministic, then re-record
  flaky/unstable_order: the app sent an array in another order than it recorded: give it a stable order in the app, then re-record
```

After the replay it prints a `SET` line for each test set, and a `VERDICT  failed: <why>` line when the run fails:

```text
SET  test-set-0: 5 ran, 5 passed, 0 failed, 2 quarantined not run
```

`keploy test` exits 0 when every test it ran passed and it printed no `VERDICT  failed` line. It exits non-zero when a test failed, when no test ran (for example, every test is quarantined), when a test has no verdict (`NOT JUDGED`), and when the run fails for a reason no single test shows: a `HELD` test, a call charged to no test, or a `mock.real` destination never reached. The test report counts a quarantined test as ignored, and JUnit output marks it skipped, with the message `quarantined by keploy (<reason>)`. Other lines you can see:

- `UNLISTED  <test-set>: no verdicts.yaml, so none of its tests is quarantined`: the set has no `verdicts.yaml`, so every test of it runs. That's expected for a set in which every test replays.
- `STALE  <test-set>/<test>`: the test's entry names another recording, so the test runs. This happens after a hand edit of the test case, or a merge that brought another version of it.
- `RAN ANYWAY  <test-set>/<test>  <class>/<reason>`: a quarantined test that ran because you passed `--all`.
- `UNREADABLE  <test-set>: ...`: Keploy couldn't read the set's `verdicts.yaml`, for example because it holds merge-conflict markers, so it skips none of the set's tests.
- `HELD  <test-set>/<test>`: the test ran, and Keploy holds evidence against it, such as a call no mock answered, so the run fails even if the test passed.
- `UNATTRIBUTED  <test-set>: <calls>, charged to no test`: calls that Keploy couldn't answer or capture, made outside every test, such as by a background poller. The run fails.
- `NOT JUDGED  <test-set>/<test>: <why>, so it has no verdict`: the test has no verdict, for one of the causes in [Tests with no verdict](/docs/running-keploy/verdicts-yaml/#not-judged). The run fails, the set's `SET` line ends `, <N> not judged`, and the `VERDICT  failed` line gives the remedy. A set Keploy couldn't judge as a whole gets `NOT JUDGED  <test-set>: ...` instead.
- `ENDED  <test-set>: <how>`: `keploy test` ended the set other than `PASSED`, for example `FAILED` with no failing test. The run fails.
- `NOT RUN  <test-set>: the run stopped before it`: none of the set's tests ran.
- `REAL  <test-set>/<test>: <destination> (<N> connections, <M> failed)`: the test reached a [`mock.real`](#mock-real) dependency for real.
- `LIVE  <test-set>/<test>: <program> :<port>`: the test called a listener of the run's own processes, such as a database your app starts as its child process. Keploy lets that call through, and never records it.
- `MOCKED  <test-set>/<test>: <destination> (mocked: ...)`: the test called a local destination outside the run, such as another container or a process you started yourself, and Keploy answered it from the mocks. If that destination is your app, the test tests nothing: start the app with the `-c` command you give Keploy, then record again. The line ends with that remedy.
- `UNFROZEN  <who>: <why>`: a test or a process that ran on the real clock, or whose clock Keploy couldn't check. See [Freeze time](#freeze-time).

## Keep the suite healthy

- **When the app changes on purpose,** record the affected flows again. `keploy record` writes them to a new test set and judges it. Then delete the old test cases they replace, so CI doesn't run them; `KEPLOY_PROVEN=1 keploy test --judge` drops their entries (`PRUNED`). Run [CI's command](#gate) once more before you commit, as after your first record.
- **After you fix what a quarantine reason names,** record that flow again, as above, or run `KEPLOY_PROVEN=1 keploy test --judge`. It replays the test sets twice, read-only, drops the entries of tests that now pass, and prints a `keploy quarantine` command for each test that fails. It never adds a skip by itself.
- **To quarantine a test by hand,** for example a test that fails since a change you made on purpose, until you record it again:

  ```bash
  KEPLOY_PROVEN=1 keploy quarantine test-set-0/get-orders-3 --reason "fails since the orders API change in PR 812 until it is re-recorded"
  ```

  The reason is one line of at most 200 bytes. The entry's class is `manual`, and it applies until the test's recording changes. Quarantine only a test that fails: `KEPLOY_PROVEN=1 keploy test --judge` drops the entry of a test that passes, a manual one too.

- **After any change to what CI reads, run [CI's command](#gate) once more before you commit,** with no `-t`, so that it replays every test set as CI does. That means after a record, a `keploy quarantine`, a `keploy test --judge`, a `keploy mock upload`, or a `git pull` that changed a set's `verdicts.yaml`, `mappings.yaml` or `config.yaml`. Until you do, `keploy status` doesn't call the suite green. It reports a run made before those files last changed as `recorded`, whether that run was green or red, and so it does a green run of only some test sets (`-t`). Each time, its `NEXT` block gives CI's command. Commit what the green run's `commit:` line names.
- **To run the quarantined tests too,** for example to check a fix, run `KEPLOY_PROVEN=1 keploy test --all`. It isn't CI's command, so run CI's command once more before you commit.
- **The suite stays in this flow** while any of its test sets holds a `verdicts.yaml`. Deleting every set's `verdicts.yaml` takes it out, and drops each quarantine and its reason with it, so CI would run those tests again. Do that only to leave the flow on purpose, never to make a run pass.
- **When CI goes red,** run `KEPLOY_PROVEN=1 keploy status` and follow its `NEXT` block. A call the app now makes differently, or no longer makes, is what a regression looks like, so check the code change before you record again.

## Capture-loss evidence: RECORDING LOST {#recording-lost}

Sometimes Keploy can't capture all of what your app's connections carry while it records. For example, its capture buffer runs out of room, or, in low-latency mode, the app sends bytes that were never in its memory, such as a file it sends with `sendfile`. Under the switch, such a loss doesn't fail `keploy record` by itself. Keploy charges each loss to the test that was open when it counted the loss, and auto-replay judges that test the same way as every other:

- A test whose recording lost nothing it needs replays, and is kept.
- A test whose recording lost what it needs fails to replay, for example on a call with no recorded answer or on a different response. It's quarantined with the usual reason, and its entry also names what the recording lost.
- A test that lost data and that no round could judge is quarantined as `keploy/capture_incomplete`, never kept.

:::caution A loss can cost you tests, and land on another test
When a capture loss, or memory pressure, overlaps a request, Keploy's agent can leave that request out of the recording altogether, so that it never saves a test whose mocks are incomplete. That request then has no test case, so nothing judges it, and its loss is charged to another test of the set. That test may replay and be kept: its `RECORDING LOST` line then names a test that didn't lose what it needs, and says it's kept. The agent counts the requests it left out as `tcs_suppressed_total` on its `agent: recording complete` line. It logs that line at `INFO` level, and at `WARN` only when they're a quarter or more of the session's requests, so a few left-out requests raise no warning. So when a `RECORDING LOST` line appears, read that count, compare the test cases on disk with the requests you sent, and record the missing ones again. A loss of bytes that were never in your app's memory happens in low-latency mode only, so record those flows in proxy mode.
:::

Under the `JUDGED` line, Keploy prints a `RECORDING LOST` line for each test whose recording lost data, with what was lost and what Keploy decided:

```text
  RECORDING LOST  test-set-0/get-orders-1: capture incomplete: keploy dropped captured bytes 1 time(s) for want of room, so the calls they belong to were not recorded whole; it replays, so it is kept
  RECORDING LOST  test-set-0/post-orders-2: capture incomplete: keploy dropped captured bytes 1 time(s) for want of room, so the calls they belong to were not recorded whole; it does not replay, so it is quarantined (keploy/unmocked_call), its entry naming what the recording lost
```

A test with no verdict, such as one that called a Unix socket, gets a `RECORDING LOST` line too, ending `its set was not judged`, under its set's `NOT JUDGED` line. A loss that no single test holds, such as one after the last test, gets one line for the test set, ending with whether auto-replay judged the set's tests without it. A kept test's line is a warning, not a failure: the test replayed against its recording. If many tests lose data, the [capture-loss guide](/docs/running-keploy/capture-loss/) says what causes each kind of loss and what to change.

On a kernel that can count them, Keploy also reports capture runs the kernel skipped (`during its recording the kernel skipped N capture run(s) ...`). That count is evidence too, never a verdict on its own: on a kernel that can't count them, Keploy judges each test the same way, without that line.

When auto-replay doesn't run (`--disableAutoReplay`), nothing judges the recording, so a capture loss fails `keploy record` as it does without the switch. When auto-replay runs but can't judge a set whose recording lost data, `keploy record` says its verdict is incomplete and exits non-zero.

## Freeze time {#freeze-time}

Under the switch, Keploy always freezes your app's clock when it replays: you don't pass `--freezeTime`. In auto-replay's full round, the clock reads 61.5 seconds after the moment each test was recorded, so time-dependent fields differ and are learned. In the confirming round and in CI, it reads the recorded moment.

For a Go app there's nothing to rebuild. Keploy patches a copy of your compiled Go binary at run time and runs that copy, natively and in Docker; your own binary and image aren't modified. When Keploy can't patch a binary, it logs one `time-freeze[go]` line that names the binary and the reason, the app runs on the real clock, and `keploy test` lists it on an `UNFROZEN` line, so a pass that relied on the real clock shows. When staging the frozen clock fails for an operational reason, such as a Docker daemon error or an image Keploy couldn't pull, Keploy refuses to start the app unfrozen and says why. See [Time Freezing](/docs/keploy-cloud/time-freezing/) for what Keploy patches and the few cases it can't.

`UNFROZEN` has a second form, which doesn't mean your app ran on the real clock:

```text
UNFROZEN  the run's processes: keploy's agent runs in a pid namespace of its own (a container), where the process numbers its proxy reports are not its own, so it cannot check that each process reads the run's clock
```

Keploy prints it on every run of a native app, one you start with `-c "./server"`, when Keploy itself runs inside a container: a GitHub Actions job with `container:`, GitLab's Docker executor, or any CI step that runs in a container. Its agent then runs in a PID namespace of its own. Keploy patched your app's binary as usual, and its log says so (`time-freeze[go]: patched the Go app`). What it couldn't do is check, process by process, that each one reads the frozen clock. The line doesn't fail the run. A native app on a runner that's a virtual machine, such as GitHub Actions' `ubuntu-latest`, doesn't get it, and neither does an app you run with `docker run` or `docker compose`.

## Flags and settings the switch replaces {#refused-flags}

Under `KEPLOY_PROVEN=1`, Keploy refuses these flags before it starts your app, with an error that says what replaces them, so a command copied from an older guide doesn't run the old way. Keploy checks some of them after it signs in, so without a session you see the sign-in error first:

| Command                        | Flag                                                                                                                                                 | Use instead                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `keploy record`                | `--auto-replay-health-poll-timeout`                                                                                                                  | Nothing: auto-replay waits for your app's readiness.                                          |
| `keploy record`                | `--auto-replay-mock-noise-detection`, `--auto-replay-schema-noise-detection`, `--auto-replay-mock-noise-strict`, `--auto-replay-schema-noise-strict` | Nothing: auto-replay's learn step learns what changes.                                        |
| `keploy record`, `keploy test` | `--pass-through-ports`, `--global-passthrough`                                                                                                       | [`mock.real`](#mock-real) in `keploy.yml`.                                                    |
| `keploy record`                | `--opportunistic-tls-intercept`                                                                                                                      | [`mock.real`](#mock-real) in `keploy.yml`.                                                    |
| `keploy test`                  | `--mocking`                                                                                                                                          | [`mock.real`](#mock-real) in `keploy.yml`.                                                    |
| `keploy test`                  | `--health-poll-timeout`                                                                                                                              | Nothing: the first test waits for your app's readiness.                                       |
| `keploy test`                  | `--must-pass`, `--max-fail-attempts`                                                                                                                 | `keploy quarantine`, with a reason.                                                           |
| `keploy test`                  | `--flaky-check-retry`                                                                                                                                | `keploy test --judge`.                                                                        |
| `keploy test`                  | `--mock-noise-detection`, `--schema-noise-detection`                                                                                                 | Nothing: `keploy record`'s auto-replay learns what changes, and a replay writes no recording. |

Keploy also ignores the matching `keploy.yml` settings, such as `test.ignoredTests`, `test.selectedTests` (select test sets with `-t` instead), `test.mustPass`, `test.healthPollTimeout`, `record.passThroughPorts` and `bypassRules`, and says so in a warning when they're set.

## Related

- [verdicts.yaml reference](/docs/running-keploy/verdicts-yaml/): every field, class and reason, and what to do for each.
- [Capture loss warnings](/docs/running-keploy/capture-loss/): why Keploy couldn't record some bytes, and what to change.
- [Time Freezing](/docs/keploy-cloud/time-freezing/): how Keploy freezes a Go app's clock with nothing to rebuild.
- [Mock Registry](/docs/keploy-cloud/mock-registry/): where your mocks live instead of the repository.
