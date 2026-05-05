---
id: install
title: Keploy Local Installation
sidebar_label: Local
hide_title: true
description: "Install Keploy locally on Linux using eBPF — record API calls, generate test cases, and replay tests with one command."
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
---

Keploy uses eBPF to intercept API calls on network layer and generates test cases and mocks/stubs.

import HowTo from '@site/src/components/HowTo';
import InstallationGuide from '../concepts/installation.md'

<HowTo
  name="Install Keploy on Linux and capture your first test"
  description="Install the Keploy CLI locally and start recording API calls in under five minutes."
  totalTime="PT5M"
  estimatedCost={{currency: "USD", value: "0"}}
  tools={["bash", "curl", "Linux kernel >= 5.10"]}
  supplies={["A Linux or WSL2 machine", "Sudo access"]}
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
