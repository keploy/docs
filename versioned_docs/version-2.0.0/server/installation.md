---
id: installation
title: Installation
sidebar_label: Installation
description: Install Keploy with Arkade, Homebrew, Docker, or the official install script.
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

<head>
  <title>Installation | Keploy Docs</title>
  <meta charSet="utf-8" />
</head>

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

To run the testcases and see if there are any regressions introduced, use this terminal command:

```bash
keploy test -c "CMD_TO_RUN_APP" --delay 10
```

## Install Keploy via Arkade

1. Installing Arkade

```bash
# Note: you can also run without `sudo` and move the binary yourself
curl -sLS https://get.arkade.dev | sudo sh

arkade --help
ark --help  # a handy alias

# Windows users with Git Bash
curl -sLS https://get.arkade.dev | sh
```

2. Install Keploy

```bash
arkade get keploy
```

Or you can also download specific version of Keploy using the following command:

```bash
arkade get keploy@2.3.0-beta47
```


Explore the [Test Coverage Generation Guide](https://keploy.io/docs/server/sdk-installation/go/) for seeing test-coverage with your unit testing library and [Keploy Running Guide](https://keploy.io/docs/running-keploy/configuration-file/) for additional options and tips on customizing your Keploy setup to perfection.
