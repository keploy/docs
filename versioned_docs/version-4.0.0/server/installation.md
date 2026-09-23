---
id: install
title: Keploy Local Installation
sidebar_label: Local
hide_title: true
description: "Install Keploy locally with one command — natively on Linux, macOS (Apple Silicon) and Windows. Record API calls, generate test cases, and replay them as tests."
tags:
  - hello-world
  - linux
  - ebpf
  - installation
  - install
  - community-edition
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
  - keploy community edition
  - community edition
---

Keploy intercepts your application's API calls and turns them into test cases and mocks. The one command below installs it on **Linux, macOS and Windows** alike — how it intercepts differs, but what you run does not:

- **Linux** — eBPF in the kernel, so `keploy record`/`keploy test` need root.
- **macOS** (Apple Silicon) and **Windows** (x86‑64) — userspace interception. No VM, no Docker, no `sudo` and no Administrator.

Docker, Lima and WSL remain supported alternatives, and are the route on an Intel Mac or Windows/ARM — but on a supported machine you do not need any of them.

By default this installs the **Keploy Community Edition**. Your plan (Community, Pro, or Enterprise) is determined after you log in.

import HowTo from '@site/src/components/HowTo';
import InstallationGuide from '../concepts/installation.md'

<HowTo
name="Install Keploy and capture your first test"
description="Install the Keploy CLI locally and start recording API calls in under five minutes."
totalTime="PT5M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["A terminal", "curl"]}
supplies={["Linux (kernel >= 5.10, with sudo), macOS on Apple Silicon, or Windows on x86-64"]}
visible={false}
steps={[
{
name: "Download and install the Keploy binary",
text: "Run: curl --silent -O -L https://keploy.io/install.sh && source install.sh",
},
{
name: "Verify the installation",
text: "Run: keploy --version",
},
{
name: "Record API calls for your app",
text: "Run: keploy record -c \"CMD_TO_RUN_APP\" (for example, keploy record -c \"go run main.go\").",
url: "#capturing-testcases",
},
{
name: "Replay the recorded tests",
text: "Run: keploy test -c \"CMD_TO_RUN_APP\" --delay 10 to replay testcases and detect regressions.",
url: "#running-testcases",
},
]}
/>

<InstallationGuide/>

## 🎬 Capturing Testcases {#capturing-testcases}

To initiate the recording of API calls, execute this command in your terminal:

```bash
keploy record -c "CMD_TO_RUN_APP"
```

For example, if you're using a simple Golang program, the **CMD_TO_RUN_APP** would resemble:

```bash
keploy record -c "go run main.go"
```

## 🏃 Running Testcases {#running-testcases}

To run the testcases and see if there are any regressions introduced, use this terminal command:

```bash
keploy test -c "CMD_TO_RUN_APP" --delay 10
```

Explore the [Test Coverage Generation Guide](https://keploy.io/docs/server/sdk-installation/go/) for seeing test-coverage with your unit testing library and [Keploy Running Guide](https://keploy.io/docs/running-keploy/configuration-file/) for additional options and tips on customizing your Keploy setup to perfection.

## Related

- [Installing Keploy on macOS](/docs/installation/macos-installation/) — native on Apple Silicon, or Lima/Docker.
- [Installing Keploy on Windows](/docs/installation/windows-installation/) — native on x86-64, or WSL/Docker.
- [Keploy Go SDK — Install & Merge Test Coverage](/docs/server/sdk-installation/go/) — set up a language SDK.
- [Keploy CLI Commands](/docs/running-keploy/cli-commands/) — commands to run after installing.
