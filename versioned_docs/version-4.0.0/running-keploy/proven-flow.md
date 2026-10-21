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
- A test that can't replay yet, because of a dependency Keploy can't mock, a call it couldn't capture, or an app that isn't deterministic, doesn't block you. Auto-replay filters it out and says why, and the rest of the suite runs.

Without `KEPLOY_PROVEN=1`, `keploy record` and `keploy test` work as described in the [CLI reference](/docs/running-keploy/cli-commands/), and `keploy test` ignores `verdicts.yaml`.

## How the flow works

1. **Record.** `keploy record` captures each request to your app as a test case, and each call your app makes to its dependencies as a mock.
2. **Replay every test (the full round).** When you stop recording, auto-replay replays each new test with its mocks. Your app's clock is frozen 61.5 seconds after the moment the test was recorded, so values that come from the clock change. Keploy learns what changed: a response field that differs becomes noise on the test case, and a value your app generated and sent to a dependency becomes a variable that the mock follows.
3. **Replay as CI will (the confirming round).** Keploy runs `keploy test` the way your CI will run it, skipping the tests it's about to quarantine.
4. **Judge.** A test that passed both rounds is kept. A test that didn't is written to `keploy/<test-set>/verdicts.yaml` with a class and a reason. Keploy prints a `JUDGED` line for each test set, then a `NEXT` block that says what to commit and how to wire CI.
5. **Run in CI.** You commit the `keploy` folder without its `mocks.yaml` files. Keploy puts the mocks of each test set that CI would replay green in the Keploy registry, and `KEPLOY_PROVEN=1 keploy test` in CI downloads them, skips the quarantined tests, and replays the rest.

## Requirements {#requirements}

- **Linux.** amd64 with kernel 5.10 or later, or arm64 with kernel 6.6 or later. Keploy behaves the same on both. macOS and Windows aren't part of this release.
- **A Go application,** built with Go 1.20 or later. Other languages aren't part of this release.
- **sudo rights.** Keploy loads eBPF programs, so it runs its agent with `sudo` and may ask for your password. On a CI runner, the runner's passwordless `sudo` is enough.
- **Docker**, if your app runs with `docker run` or `docker compose`.
- **A Keploy account.** `keploy record` puts a judged test set's mocks in the Keploy registry, and `keploy test` downloads them in CI. Sign in once with `keploy login`. In CI, Keploy signs in with an API key: in [app.keploy.io](https://app.keploy.io), open your user profile, go to **Account Settings → API Keys**, generate a token, and set it as the `KEPLOY_API_KEY` environment variable.
- **TCP dependencies.** Keploy doesn't capture calls over Unix sockets. A test that calls a dependency over a Unix socket gets no verdict: Keploy reports it as `NOT JUDGED`, with the remedy to reach that dependency over a TCP address (for example `localhost:5432` instead of a socket path), and a CI run that reaches it fails. The sockets of system services that carry no dependency traffic, such as nscd, systemd-resolved, journald, syslog (`/dev/log`) and D-Bus, don't count. The Docker daemon's socket does: an app that drives Docker, for example with Testcontainers, has a real dependency there.

## Install Keploy and sign in

```bash
curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
keploy login
```

`https://keploy.io/install.sh` hands over to the same installer, so either one installs the same Keploy.

Then turn the flow on for your shell:

```bash
export KEPLOY_PROVEN=1
```

Set the switch for every Keploy command in this flow: `record`, `test`, `status` and `quarantine`. Without it, `keploy record` doesn't judge, `keploy test` ignores `verdicts.yaml` (it warns that it does, and runs every test, the quarantined ones too), and `keploy quarantine`, `keploy test --all` and `keploy test --judge` don't exist. The commands Keploy prints, such as the `keploy quarantine` line under `QUARANTINE?`, assume the switch is set in your shell. The examples on this page set it on each command, so you can copy any one of them on its own.

## Record your tests

Pick the command that matches how you run your app.

**Native.** Build your Go binary and start it with `-c`:

```bash
go build -o server .
KEPLOY_PROVEN=1 keploy record -c "./server"
```

Start the Go binary itself in `-c`, not a shell, `make` or a script that starts it. Keploy freezes the clock of the Go binary that `-c` starts, as described in [Freeze time](#freeze-time).

**Docker.** Use the `docker run` command you already use, and pass the container's name:

```bash
docker build -t my-app:latest .
KEPLOY_PROVEN=1 keploy record -c "docker run -p 8080:8080 --name my-app my-app:latest" --container-name my-app
```

**Docker Compose.** Pass the app's service name, or its `container_name`, from your compose file. A compose app needs `--container-name`:

```bash
KEPLOY_PROVEN=1 keploy record -c "docker compose up" --container-name api
```

When Keploy replays a compose app, in auto-replay and in CI, only the app and Keploy's agent run, with the services they can't start without. The app's dependency services stay down, and Keploy answers the app's calls to them from the mocks. A service you name in the command (`docker compose up api redis`) runs too, which is how a [`mock.real`](#mock-real) dependency that is a compose service stays up.

Then send traffic to your app: `curl`, your API test suite, or a script that walks through your endpoints. **Send one request at a time.** When a request starts while another one is still open, Keploy warns `some tests were recorded while another test's request was still open`: it maps each dependency call made while both were open to the test whose request came first, which may not be the test that made it. Such tests can fail auto-replay and be quarantined.

To stop recording, press **Ctrl+C once**, then wait. Keploy says:

```text
auto-replay: recording stopped — now replaying what was just recorded to check for noise. Press Ctrl+C again to skip and exit.
```

Auto-replay runs both rounds and prints its verdict. Don't press Ctrl+C a second time: that skips auto-replay, so nothing is judged, no `verdicts.yaml` is written, and `keploy record` exits non-zero. To record without a verdict on purpose, pass `--disableAutoReplay`, or set `record.disableAutoReplay: true` in `keploy.yml`.

:::caution Don't pass `--delay` to keploy record
`--delay` is a `keploy test` flag. `keploy record` rejects it as an unknown flag and records nothing. Under the switch, auto-replay and `keploy test` wait for your app to be ready before they send the first test: it listens on the port the test connects to, or the health URL you gave answers (`--auto-replay-health-url` on `keploy record`, `--health-url` on `keploy test`).
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

A client that rejects Keploy's certificate without a word, or hangs up just after its TLS handshake, leaves Keploy unable to tell whether a call was lost. The test it happened in is `NOT JUDGED`, with the remedy to make that client trust Keploy's CA.

### Reach a dependency for real {#mock-real}

Under the switch, Keploy records and mocks every call your app makes. To keep a dependency live in recording, auto-replay and CI, list it under `mock.real` in `keploy.yml`, as a host and port, an address, or a container:

```yaml
mock:
  real:
    - auth.example.com:443
    - localhost:6379
    - container:redis
```

A test that uses a `mock.real` dependency runs on the real clock, and CI must start that dependency: a run in which a listed destination is never reached fails. For a compose app, name a `mock.real` service in the compose command you record and test with, such as `docker compose up api redis`, or Keploy's replay leaves it down. The `--pass-through-ports`, `--global-passthrough` and `--opportunistic-tls-intercept` flags, and the `passThroughPorts` and `bypassRules` settings, don't apply under the switch; `mock.real` replaces them.

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

After the confirming round, Keploy prints its verdict for each test set, then the `NEXT` block:

```text
JUDGED  test-set-0: 5 replayable, 2 quarantined (1 flaky/request_changed, 1 flaky/unstable_order); wrote keploy/test-set-0/verdicts.yaml: commit it
  QUARANTINED  test-set-0/post-learn-batch-1  flaky/unstable_order: HTTP POST /batch to localhost:8096 (no_match) sent an array in another order
  QUARANTINED  test-set-0/post-learn-order-1  flaky/request_changed: HTTP POST /orders to localhost:8096 (no_match) changed
```

### The JUDGED line

`JUDGED  <test-set>: <N> replayable, <M> quarantined (<count> <class>/<reason>, ...); <what happened to verdicts.yaml>`

- **Replayable** tests passed both rounds. CI runs them.
- **Quarantined** tests are listed in `verdicts.yaml`, so CI skips them. The counts in brackets group them by [class and reason](/docs/running-keploy/verdicts-yaml/#reasons).
- A test that Keploy couldn't judge is in neither count. The confirming round's output names it on a `NOT JUDGED` line, with the reason.

The line ends with one of:

| Ending                                             | Meaning                                           |
| -------------------------------------------------- | ------------------------------------------------- |
| `wrote keploy/<test-set>/verdicts.yaml: commit it` | Keploy added or changed entries. Commit the file. |
| `keploy/<test-set>/verdicts.yaml unchanged`        | The file already says what Keploy decided.        |
| `it needs no verdicts.yaml`                        | Every test replays, and the set has no file.      |

Under the `JUDGED` line, Keploy can print:

| Line                                                                                  | Meaning                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `QUARANTINED  <test-set>/<test>  <class>/<reason>: <evidence>`                        | The test is now in `verdicts.yaml`. The evidence names the calls, mocks or response fields without their bodies; the [verdicts.yaml reference](/docs/running-keploy/verdicts-yaml/#fields) says what a URL keeps. See [what to do for each reason](/docs/running-keploy/verdicts-yaml/#reasons). |
| `RUNS AGAIN  <test-set>/<test>: ...`                                                  | The test replays now, so its old entry no longer applies, and CI runs it again.                                                                                                                                                                                                                  |
| `PRUNED  <test-set>/<test>: its recording is no longer on disk`                       | Keploy dropped an entry whose test's recording is gone.                                                                                                                                                                                                                                          |
| `RECORDING LOST  <test-set>/<test>: ...`                                              | The recording of this test lost data. See [Capture-loss evidence](#recording-lost).                                                                                                                                                                                                              |
| `NOT CHARGED TO A TEST (in CI's shape): ...`                                          | A dependency call made outside every test that Keploy couldn't answer or capture, such as a background poller. CI fails on it.                                                                                                                                                                   |
| `NOTE  <test-set>: every test of it CI reaches is quarantined, so CI runs none of it` | CI would run no test of this set, and a run in which no test ran fails. Fix the reasons and record again.                                                                                                                                                                                        |

Other lines a test set can get:

- `NOT JUDGED  <test-set>: <why>; nothing was written for it`: Keploy couldn't judge the set, for example because a round stopped early or the app never answered a test. Fix what the reason names and record again. A set with no test case gets `NOT JUDGED  <test-set>: it has no test case to judge`.
- `NOT WRITTEN  <test-set>: keploy/<test-set>/verdicts.yaml changed while keploy record judged, so it stays as it was`: something else changed the file meanwhile, such as a `git pull` or another Keploy run, so nothing Keploy decided for the set was written. The same line ends `could not be written, so it stays as it was` when the write failed, for example on file permissions. Run `KEPLOY_PROVEN=1 keploy test --judge`: it replays the set and prints a `keploy quarantine` command for each test that fails, which you run if you agree (it writes a `manual` entry). Or delete the set and record it again.
- `QUARANTINE?  <test-set>/<test>  ...`, followed by a `keploy quarantine` command: a test failed the way CI runs it, and no entry skips it. Keploy never adds that entry by itself. Run the printed command, with the switch set, if you agree, or fix the test.
- `keploy record's judging: CI would be red as these lists stand`: what's printed above it would fail CI. Fix it before you wire CI.

### Exit codes

`keploy record` exits 0 when judging finished and CI would be green as the lists stand, even if it quarantined tests. When it prints `keploy record's judging: CI would be red as these lists stand`, go by that line, not by the exit code: fix what it names before you wire CI. When the recording fails on its own, for example because your app exits with an error, `keploy record` exits with that failure's code. When Keploy recorded tests but couldn't finish judging them, because auto-replay judged nothing, a test set was `NOT JUDGED` or `NOT WRITTEN`, or a second Ctrl+C stopped it, `keploy record` prints `keploy record's verdict is incomplete: <why>` and exits non-zero, so a script can't take an unjudged recording for a judged one.

### The NEXT block

Every `keploy record` and `keploy test` ends with a `NEXT` block, and `KEPLOY_PROVEN=1 keploy status` prints it any time (add `--json` for a machine-readable copy). After a green record it looks like this:

```text
=== KEPLOY NEXT ===
phase:    verified_green
summary:  All 5 test(s) passed across 1 test-set(s). Suite is green and dependency-free.
caveats:
  - 2 quarantined test(s) did not run (keploy/<set>/verdicts.yaml): this green covers the other tests only. `KEPLOY_PROVEN=1 keploy test --all` runs them; `KEPLOY_PROVEN=1 keploy test --judge` drops the entries of those that now pass.
ask:      Want me to (a) cover another resource, (b) wire CI so this runs on every PR, or (c) stop here?
do:       If wiring CI: the Keploy registry holds each test set's mocks; CI downloads them by the hash in the set's config.yaml (KEPLOY_API_KEY required in CI). Commit exactly the paths on the commit: line (relative to the directory that holds keploy/: run `git add` there, and CI's keploy test there too): ...
commit:   keploy.yml keploy/.gitignore keploy/test-set-0/tests keploy/test-set-0/mappings.yaml keploy/test-set-0/verdicts.yaml keploy/test-set-0/config.yaml
options:
  - cover another resource → KEPLOY_PROVEN=1 keploy record -c './server' --metadata 'name=<descriptive-name>'
  - wire CI: add a job that installs keploy and runs `KEPLOY_PROVEN=1 keploy test` on every PR (see do:)
  - stop
protocol: ...
===================
```

| Field      | What it tells you                                                                                                                                                                                                                                   |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phase`    | Where the suite is: `recorded` (not replayed since it changed), `verified_green`, `verified_red`, `verified_empty` (the last run scored nothing, so it isn't green), or `ci_wired` (green, with a `.github/workflows/keploy.yml` beside `keploy/`). |
| `summary`  | The last run in one sentence.                                                                                                                                                                                                                       |
| `failures` | Each failing test, with what differed and a remedy.                                                                                                                                                                                                 |
| `caveats`  | What a green doesn't cover, such as the quarantined tests it didn't run. Read them before you call the suite green.                                                                                                                                 |
| `do`       | The next step in full. After a green record it's the CI recipe: what to commit, how to install Keploy, and the `keploy test` command.                                                                                                               |
| `commit`   | Exactly the paths to `git add`, relative to the directory that holds `keploy/`.                                                                                                                                                                     |
| `options`  | Commands for the next step, each with the switch where the flow needs it.                                                                                                                                                                           |

For a Docker or Compose app, add the `--container-name` you recorded with to the `keploy record` and `keploy test` commands the block prints.

When `do:` says the Keploy registry doesn't hold a test set's mocks, a CI checkout would have no mocks for that set and its tests would fail. Upload them with the `keploy mock upload -t <test-set>` command it prints, then run `KEPLOY_PROVEN=1 keploy status` again.

## Commit the test sets {#commit}

From the directory that holds `keploy/`, `git add` exactly the paths on the `NEXT` block's `commit:` line:

```bash
git add keploy.yml keploy/.gitignore keploy/test-set-0/tests keploy/test-set-0/mappings.yaml keploy/test-set-0/verdicts.yaml keploy/test-set-0/config.yaml
```

| Path                                                   | What it is                                                                                              | Commit it?                                                                                            |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `keploy.yml`                                           | Keploy's settings for your app, such as its command and `mock.real`.                                    | Yes                                                                                                   |
| `keploy/.gitignore`                                    | Keeps `mocks.yaml`, `reports/` and Keploy's other local files out of the repository.                    | Yes                                                                                                   |
| `keploy/<test-set>/tests/`, and `assets/` when present | The test cases, with the noise auto-replay learned.                                                     | Yes                                                                                                   |
| `keploy/<test-set>/mappings.yaml`                      | Which recorded calls each test owns. Under the switch, only `keploy record` writes it.                  | Yes                                                                                                   |
| `keploy/<test-set>/verdicts.yaml`                      | The tests CI skips, and why. See the [verdicts.yaml reference](/docs/running-keploy/verdicts-yaml/).    | Yes                                                                                                   |
| `keploy/<test-set>/config.yaml`                        | Names the upload of the set's mocks in the Keploy registry.                                             | Yes                                                                                                   |
| `keploy/<test-set>/seed.sh`, when present              | Your seed script for the set.                                                                           | Yes                                                                                                   |
| `keploy/<test-set>/mocks.yaml`                         | The recorded dependency calls.                                                                          | **Never.** It's in the Keploy registry, and `keploy/.gitignore` keeps it out. Don't remove that line. |
| `keploy/<test-set>/mocks.json` or `mocks.gob`          | The recorded dependency calls, in the JSON or gob storage format. The registry takes only `mocks.yaml`. | Yes: CI reads it from the checkout, and the `commit:` line lists it.                                  |
| `keploy/<test-set>/secret.yaml`                        | Secrets that `keploy sanitize` took out of the recording.                                               | Never                                                                                                 |
| `keploy/reports/`                                      | Run reports.                                                                                            | No                                                                                                    |

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

- **`KEPLOY_PROVEN: "1"` is required.** Without it, `keploy test` ignores `verdicts.yaml`, runs every test, the quarantined ones too, and judges them the old way, so it can pass tests the flow quarantined.
- **Use the command you recorded with.** For a Docker app, build the image first, then run the same `docker run` command with the same `--container-name`. For a Compose app, run the same `docker compose up` command with the same `--container-name`.
- **Run it where `keploy/` is.** If `keploy/` isn't at the repository root, for example in a monorepo, set `defaults.run.working-directory` on the job to the directory that holds it, and point `go-version-file` at that directory's `go.mod`: `defaults.run` applies to `run:` steps only.
- **Your app's dependencies don't need to run.** Keploy answers your app's calls from the mocks it downloads from the Keploy registry. Give your app the same configuration it had when you recorded, such as the environment variables it reads at startup. Only a `mock.real` dependency must run in CI.
- **`KEPLOY_INVOKER: ci`** makes a missing sign-in fail at once, instead of waiting for a browser login.
- Don't add `--mappings` or `--freezeTime`. Under the switch, `keploy test` uses the committed `mappings.yaml` and always freezes your app's clock.

The CI run first lists what it skips, and why, with what to do for each reason:

```text
QUARANTINED, not run (2): `keploy test --all` runs them
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
- `UNREADABLE  <test-set>: ...`: Keploy couldn't read the set's `verdicts.yaml`, for example because it holds merge-conflict markers, so it skips none of the set's tests.
- `HELD  <test-set>/<test>`: the test ran, and Keploy holds evidence against it, such as a call no mock answered, so the run fails even if the test passed.

## Keep the suite healthy

- **When the app changes on purpose,** record the affected flows again. `keploy record` writes them to a new test set and judges it. Then delete the old test cases they replace, so CI doesn't run them; `KEPLOY_PROVEN=1 keploy test --judge` drops their entries (`PRUNED`).
- **After you fix what a quarantine reason names,** record that flow again, as above, or run `KEPLOY_PROVEN=1 keploy test --judge`. It replays the test sets twice, read-only, drops the entries of tests that now pass, and prints a `keploy quarantine` command for each test that fails. It never adds a skip by itself.
- **To quarantine a test by hand,** for example while a shared sandbox is down:

  ```bash
  KEPLOY_PROVEN=1 keploy quarantine test-set-0/get-orders-3 --reason "payments sandbox is down until Friday"
  ```

  The reason is one line of at most 200 bytes. The entry's class is `manual`, and it applies until the test's recording changes.

- **To run the quarantined tests too,** for example to check a fix, run `KEPLOY_PROVEN=1 keploy test --all`.
- **When CI goes red,** run `KEPLOY_PROVEN=1 keploy status` and follow its `NEXT` block. A call the app now makes differently, or no longer makes, is what a regression looks like, so check the code change before you record again.

## Capture-loss evidence: RECORDING LOST {#recording-lost}

Sometimes Keploy can't capture all of a call while it records, for example when its capture buffer runs out of room. Under the switch, such a loss never fails the recording. It's evidence for auto-replay, which judges each affected test the same way as every other:

- A test whose recording lost nothing it needs replays, and is kept.
- A test whose recording lost what it needs fails to replay, for example on a call with no recorded answer or on a different response. It's quarantined with the usual reason, and its entry also names what the recording lost.
- A test that lost data and that no round could judge is quarantined as `keploy/capture_incomplete`, never kept.

Under the `JUDGED` line, Keploy prints a `RECORDING LOST` line for each test whose recording lost data, with what was lost and what Keploy decided:

```text
  RECORDING LOST  test-set-0/get-orders-1: capture incomplete: keploy dropped captured bytes 1 time(s) for want of room, so the calls they belong to were not recorded whole; it replays, so it is kept
  RECORDING LOST  test-set-0/post-orders-2: capture incomplete: keploy dropped captured bytes 1 time(s) for want of room, so the calls they belong to were not recorded whole; it does not replay, so it is quarantined (keploy/unmocked_call), its entry naming what the recording lost
```

A loss that no single test holds, such as one after the last test, gets one line for the test set, ending with whether auto-replay judged the set's tests without it. A kept test's line is a warning, not a failure: the test replayed against its recording. If many tests lose data, the [capture-loss guide](/docs/running-keploy/capture-loss/) says what causes each kind of loss and what to change.

On a kernel that can count them, Keploy also reports capture runs the kernel skipped (`during its recording the kernel skipped N capture run(s) ...`). That count is evidence too, never a verdict on its own: on a kernel that can't count them, Keploy judges each test the same way, without that line.

When auto-replay doesn't run (`--disableAutoReplay`), nothing judges the recording, so a capture loss fails `keploy record` as it does without the switch. When auto-replay runs but can't judge a set whose recording lost data, `keploy record` says its verdict is incomplete and exits non-zero.

## Freeze time {#freeze-time}

Under the switch, Keploy always freezes your app's clock when it replays: you don't pass `--freezeTime`. In auto-replay's full round, the clock reads 61.5 seconds after the moment each test was recorded, so time-dependent fields differ and are learned. In the confirming round and in CI, it reads the recorded moment.

For a Go app there's nothing to rebuild. Keploy patches a copy of your compiled Go binary at run time and runs that copy, natively and in Docker; your own binary and image aren't modified. When Keploy can't patch a binary, it logs one `time-freeze[go]` line that names the binary and the reason, the app runs on the real clock, and `keploy test` lists it on an `UNFROZEN` line, so a pass that relied on the real clock shows. When staging the frozen clock fails for an operational reason, such as a Docker daemon error or an image Keploy couldn't pull, Keploy refuses to start the app unfrozen and says why. See [Time Freezing](/docs/keploy-cloud/time-freezing/) for what Keploy patches and the few cases it can't.

## Flags and settings the switch replaces {#refused-flags}

Under `KEPLOY_PROVEN=1`, these flags fail the command at once, with an error that says what replaces them, so a command copied from an older guide doesn't run the old way:

| Command                        | Flag                                                                                                                                                 | Use instead                                                                                   |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `keploy record`                | `--auto-replay-health-poll-timeout`                                                                                                                  | Nothing: auto-replay waits for your app's readiness.                                          |
| `keploy record`                | `--auto-replay-mock-noise-detection`, `--auto-replay-schema-noise-detection`, `--auto-replay-mock-noise-strict`, `--auto-replay-schema-noise-strict` | Nothing: auto-replay's learn step learns what changes.                                        |
| `keploy record`, `keploy test` | `--pass-through-ports`, `--global-passthrough`, `--opportunistic-tls-intercept`                                                                      | [`mock.real`](#mock-real) in `keploy.yml`.                                                    |
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
