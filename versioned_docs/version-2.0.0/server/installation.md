---
id: installation
title: Keploy Installation
sidebar_label: Installation
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

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## 🎬 Capturing Testcases

To initiate the recording of API calls, execute this command in your terminal:

```bash
keploy record -c "CMD_TO_RUN_APP"
```

For example, if you're using a simple Golang program, the **CMD_TO_RUN_APP** would resemble:

```bash
keploy record -c "go run main.go"
```

## 🏃 Running Testcases

To run the testcases and generate a test coverage report, use this terminal command:

```bash
keploy test -c "CMD_TO_RUN_APP" --delay 10
```

Explore the [Keploy Running Guide](/running-keploy/configuration-file/) for additional options and tips on customizing your Keploy setup to perfection.
