---
id: install
title: Record and Replay Your App
sidebar_label: Local
description: "Record your app's API calls as tests and mocks, then replay them with every dependency mocked — natively on Linux and on macOS with Apple silicon."
tags:
  - hello-world
  - linux
  - ebpf
  - installation
  - install
keywords:
  - hello-world
  - ebpf
  - installation
  - install
  - ubuntu
  - linux
  - API Test generator
  - Auto Testcase generation
  - installation-guide
  - server-setup
  - macos
  - windows
  - keploy record
  - keploy test
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Record and replay your app with Keploy"
description="Install the Keploy CLI, record your app's API calls as tests and mocks, and replay them."
totalTime="PT5M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["A terminal", "curl"]}
supplies={["Linux (kernel >= 5.10, with sudo), macOS on Apple Silicon, or Windows on x86-64"]}
visible={false}
steps={[
{
name: "Download and install the Keploy binary",
text: "On Linux or macOS, run: source /dev/stdin <<<\"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')\". On Windows, download https://keploy.io/ent/dl/latest/enterprise_windows_amd64.exe as keploy.exe into a folder on your PATH.",
url: "#install",
},
{
name: "Sign in",
text: "Run: keploy login, and approve the code it shows in your browser.",
url: "#sign-in",
},
{
name: "Record API calls for your app",
text: "Run: keploy record -c \"CMD_TO_RUN_APP\" (for example, keploy record -c \"go run main.go\"), send your app some requests, then press Ctrl+C.",
url: "#capturing-testcases",
},
{
name: "Replay the recorded tests",
text: "Run: keploy test -c \"CMD_TO_RUN_APP\" --delay 10 to replay the test cases with every dependency mocked.",
url: "#running-testcases",
},
]}
/>

Keploy records the API calls your app serves as test cases, and the calls your app makes to answer them, to its database or to other services, as mocks. `keploy test` then sends the recorded requests to your app again and answers its outgoing calls from the mocks, so the tests run with no database or other service running.

It runs natively, with no VM and no Docker:

- **Linux** (kernel 5.10 or later): Keploy intercepts calls with eBPF, which needs root. Run `keploy` as your own user; it asks for `sudo` itself when a command needs it.
- **macOS with Apple silicon**: in user space, with no `sudo`. Natively it understands the HTTP/HTTPS, MySQL and MongoDB calls of Go, Node.js, Python and Java apps. Calls to other services, such as PostgreSQL, Redis, Kafka or gRPC, are captured only as raw bytes and usually don't replay, so run an app that depends on them [with Docker](/docs/installation/macos-installation/#option-3-install-keploy-with-docker).
- **Windows** (x86-64): the same commands, with `keploy.exe` installed as [the Windows guide](/docs/installation/windows-installation/#option-1-run-keploy-natively) shows.

**Keploy doesn't support Intel Macs.** On Windows on ARM, run Keploy in WSL.

:::tip Want to mock your test suite instead?

To record the calls your existing tests make, with no app to start and no requests to send, see [Mock your tests](/docs/running-keploy/mock-quickstart/).

:::

## 1. Install Keploy {#install}

On Linux and macOS:

```bash
source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
```

Then check it:

```bash
keploy --version
```

The script installs Keploy in `~/.keploy/bin`, where it can update itself, and adds that folder to your `PATH`. The [Linux](/docs/installation/linux-installation/) and [macOS](/docs/installation/macos-installation/) guides have the details.

## 2. Sign in {#sign-in}

You need a free Keploy account to record and replay.

```bash
keploy login
```

It prints a link and a code, and opens your browser at [app.keploy.io](https://app.keploy.io) to approve them. Keploy keeps the session and reuses it for every later command. If you skip this step, your first `keploy record` signs you in the same way.

- **No browser on this machine** (a remote shell): `keploy login --manual-login` asks for an API key from your Keploy dashboard instead.
- **CI, or any run with nobody at the keyboard**: set `KEPLOY_API_KEY`, and Keploy never opens a browser.

## 3. Record your app {#capturing-testcases}

From your project's folder, pass the command that starts your app, exactly as you run it yourself:

```bash
keploy record -c "CMD_TO_RUN_APP"
```

For example:

```bash
keploy record -c "go run main.go"            # Go
keploy record -c "node server.js"             # Node.js
keploy record -c ".venv/bin/python app.py"    # Python, from a virtualenv
keploy record -c "java -jar target/app.jar"   # Java
```

On macOS, pass the app's real command, not a launcher such as `npm start` or a wrapper script: macOS drops Keploy's interception when a protected system binary runs. For Java, that means the JDK's own `java`, as in `keploy record -c "${JAVA_HOME:-$(/usr/libexec/java_home)}/bin/java -jar target/app.jar"`. The [macOS guide](/docs/installation/macos-installation/#option-1-run-keploy-natively) has the details.

Keploy starts your app. Once it's up, send it the requests you want as tests, with `curl`, Postman, your frontend or a script. Keploy saves:

- each request and its response as a test case, in `keploy/test-set-0/tests/`;
- the calls your app made to answer them as mocks, in `keploy/test-set-0/mocks.yaml`.

Each `keploy record` writes a new test set: `test-set-1`, `test-set-2`, and so on.

Stop recording with **Ctrl+C**, or pass `--record-timer 2m` to stop after two minutes.

Right after it stops, `keploy record` replays what it just recorded, to check that each test replays and to learn which fields change from one run to the next, such as timestamps and generated IDs, so they don't fail later replays. To skip that replay, pass `--disableAutoReplay`.

It ends with a **NEXT** block: where your tests stand and the command to run next. `keploy status` prints that block again at any time.

## 4. Replay the tests {#running-testcases}

```bash
keploy test -c "CMD_TO_RUN_APP" --delay 10
```

Keploy starts your app, waits `--delay` seconds for it to come up (5 by default), then sends each recorded request and compares the response with the recorded one. Your app's outgoing calls are answered from the mocks, so its database and the services it calls don't need to run.

- `--health-url http://localhost:8080/health` waits until that URL answers with a 2xx instead of a fixed delay, for an app whose start-up time varies.
- `-t test-set-0` replays one test set.

Keploy prints each test's result and a summary, writes the full report to `keploy/reports/test-run-<n>/test-set-<n>-report.yaml`, and ends with the NEXT block.

## 5. Commit and run in CI {#ci}

Commit the `keploy/` folder with your code, so your teammates and your CI replay the same tests. To replay them on every pull request, see [GitHub Actions](/docs/ci-cd/github/#github-actions).

## Related

- [Mock your tests](/docs/running-keploy/mock-your-tests/): record and replay the calls your test suite makes.
- [Installing Keploy on Linux](/docs/installation/linux-installation/).
- [Installing Keploy on macOS](/docs/installation/macos-installation/): Apple silicon, natively or with Docker.
- [Installing Keploy on Windows](/docs/installation/windows-installation/): native on x86-64, or WSL/Docker.
- [Installing Keploy](/docs/server/installation/): every platform, with Docker and Podman.
- [Keploy CLI Commands](/docs/running-keploy/cli-commands/): every command and flag.
- [Keploy configuration file](/docs/running-keploy/configuration-file/): options for `keploy.yml`.
