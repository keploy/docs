---
id: windows-wsl
title: "Running Keploy Natively on Windows"
sidebar_label: Keploy on Windows native
description: "Install and run Keploy natively on Windows using WSL — prerequisites, setup steps, and running your first test."
tags:
  - windows
  - ebpf
  - windows installation
  - installation
  - installation-guide
keywords:
  - windows
  - ebpf
  - installation
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Run Keploy natively on Windows via WSL"
description="Set up WSL and install the Keploy binary inside a Linux distribution to run Keploy on Windows."
totalTime="PT10M"
tools={["Windows", "WSL", "Ubuntu", "Keploy CLI"]}
steps={[
{name: "Check prerequisites", text: "Ensure you are on Windows 10 version 2004+ (build 19041+) or Windows 11 with admin access."},
{name: "Install WSL + Ubuntu", text: "Run wsl --install -d Ubuntu-22.04 from an elevated terminal and set up your Linux user."},
{name: "Install the Keploy binary", text: "Inside the WSL shell download the Keploy release tarball and move the binary to /usr/local/bin."},
{name: "Verify", text: "Run keploy in the WSL shell to confirm the CLI is installed."},
]}
visible={false}
/>

Keploy relies on the Linux kernel's eBPF subsystem to capture network traffic, so it does not run directly on the Windows kernel. On Windows you run Keploy inside **WSL (Windows Subsystem for Linux)**, which gives you a real Linux kernel while keeping your Windows development environment. This page covers the WSL prerequisites and installs the Keploy binary inside that Linux environment.

## Prerequisites

- **Windows 10** version 2004 or higher (Build 19041 and higher), or **Windows 11**.
- Administrator access to run `wsl --install` the first time.
- A working internet connection to pull the WSL distribution and the Keploy release.

## Enable WSL and install a Linux distribution

Open PowerShell or Windows Terminal **as Administrator** and run:

```shell
wsl --install -d <Distribution Name>
```

We recommend **"Ubuntu-22.04"**:

```shell
wsl --install -d Ubuntu-22.04
```

This command enables the features necessary to run WSL and installs the chosen Ubuntu distribution of Linux. (The default distribution can be changed.) You may be prompted to restart Windows and to create a Linux username and password on first launch.

## Install the Keploy binary

Once you are inside your WSL Ubuntu shell, install the Keploy binary:

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

Running `keploy` should print the CLI help, confirming the binary is on your `PATH`. From here on, run every Keploy command from inside the WSL shell (not native PowerShell), and keep your application code on the WSL filesystem for the best performance.

Congratulations! You've successfully set up Keploy natively on Windows.

## What's Next?

### 🎬 [Start Capturing Testcases](/docs/server/installation/)

Begin recording your API calls and generating test cases with Keploy.

#### [Back to Installation Guide](/docs/server/installation/)

## Related

- [Running Keploy on macOS and Linux](/docs/keploy-explained/mac-linux/) — the equivalent setup for other operating systems.
- [CLI commands reference](/docs/running-keploy/cli-commands/) — every `keploy` command and flag.
- [Common errors and fixes](/docs/keploy-explained/common-errors/) — troubleshooting, including WSL-specific issues.
