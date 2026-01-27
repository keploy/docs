---
id: windows-wsl
title: "Running Keploy Natively on Windows"
sidebar_label: Keploy on Windows native
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

On Windows, WSL is required to run Keploy Binary. You must be running Windows 10 version 2004 and higher (Build 19041
and higher) or Windows 11 to use the commands below.

```shell
wsl --install -d <Distribution Name>
```

Recommended to use "Ubuntu-22.04"

This command will enable the features necessary to run WSL and install the Ubuntu distribution of Linux. (This default
distribution can be changed).

Install "Keploy Binary" :

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

Congratulations! You've successfully set up Keploy natively on Windows.

## What's Next?

### 🎬 [Start Capturing Testcases](/docs/server/installation/)

Begin recording your API calls and generating test cases with Keploy.

#### [Back to Installation Guide](/docs/server/installation/)
