---
id: installation
title: Installation Overview
sidebar_label: Installation
description: "Install Keploy using the CLI or manually — quick setup guide with platform requirements for Linux, macOS, and Windows."
tags:
  - linux
  - ebpf
  - installation
  - install
keywords:
  - ebpf
  - installation
  - install
  - ubuntu
  - linux
  - windows
  - API Test generator
  - Auto Testcase generation
  - installation-guide
  - server-setup
  - macos
---

import PlatformRequirements from '../concepts/platform-requirements.md'

<PlatformRequirements/>

# Installation Overview

The install is the same whatever your plan. You need a free Keploy account to record and replay: the first `keploy record` or `keploy test` signs you in, and your plan decides which additional features are available.

## Quick Installation Using CLI

On **Linux** and **macOS** (Apple Silicon), install Keploy with:

```bash
 curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

You should see something like this:

```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example           Example to record and test via keploy
  config --generate generate the keploy configuration file
  record            record the keploy testcases from the API calls
  test              run the recorded testcases and execute assertions
  update            Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

🎉 Wohoo! You are all set to use Keploy.

On **Windows** (x86-64), Keploy is a single `keploy.exe`, installed from PowerShell without Administrator — see [Run Keploy natively on Windows](/docs/installation/windows-installation/#option-1-run-keploy-natively).

## Other Installation Methods

<details>
<summary>Install using Docker</summary>

**_Downloading and running Keploy in Docker_**

With this method your application and Keploy's agent run in Docker, but the `keploy` CLI — which starts them both — runs on your machine. Use it when your app runs in containers, or on macOS and Windows when your app depends on services beyond HTTP/HTTPS, MySQL and MongoDB: natively there, calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay.

1. Open up a terminal window.

2. Create a bridge network in Docker using the following docker network create command:

```bash
docker network create keploy-network
```

3. Install Keploy: on Linux and macOS with the command below, on Windows with [the PowerShell steps](/docs/installation/windows-installation/#option-1-run-keploy-natively). On macOS the CLI is Apple Silicon (arm64) only — on an Intel Mac, run Keploy with [Lima](/docs/installation/macos-installation/#option-2-install-keploy-with-lima) instead.

```shell
 curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

#### Examples:

**Record:**

```bash
keploy record -c "docker run -p <appPort>:<hostPort> --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60
```

**Test:**

```bash
keploy test --c "docker run -p <appPort>:<hostPort>  --name <containerName> --network keploy-network <applicationImage>" --delay 10
```

</details>

<details>
<summary>Install Manually</summary>

**_Downloading the Keploy binary yourself_**

These download the same `keploy` binary the install command above installs.

#### On Linux

Prerequisite: Linux kernel **5.10 or higher** (`uname -r` shows yours). This picks the build for your architecture:

```bash
case "$(uname -m)" in
  x86_64) ARCH=amd64 ;;
  aarch64 | arm64) ARCH=arm64 ;;
  *) echo "unsupported architecture: $(uname -m)" >&2; false ;;
esac &&
  curl --fail --silent --show-error --location -o /tmp/keploy \
    "https://keploy.io/ent/dl/latest/enterprise_linux_${ARCH}" &&
  sudo install -m 0755 /tmp/keploy /usr/local/bin/keploy
```

The same steps work inside **WSL** on Windows and inside a **Lima** VM on macOS.

#### On macOS (Apple Silicon)

```bash
mkdir -p ~/.keploy/bin &&
  curl --fail --silent --show-error --location -o ~/.keploy/bin/keploy \
    "https://keploy.io/ent/dl/latest/enterprise_darwin_arm64" &&
  chmod +x ~/.keploy/bin/keploy
export PATH="$HOME/.keploy/bin:$PATH"   # add this line to your ~/.zshrc too
```

There is no Intel macOS build: on an Intel Mac, use the Linux steps inside [Lima](/docs/installation/macos-installation/#option-2-install-keploy-with-lima).

#### On Windows (x86-64)

Follow [the PowerShell steps](/docs/installation/windows-installation/#option-1-run-keploy-natively). On Windows on ARM, use the Linux steps inside WSL.

**_If you run Keploy inside WSL with Docker: setting up Docker Desktop for WSL 2_**

1. Install Docker Desktop for Windows from [here](https://docs.docker.com/desktop/windows/install/).

When developing on Windows with Docker Desktop and WSL 2, it's crucial to configure Docker Desktop to allow WSL 2 distributions to access the Docker daemon. This setup enables seamless integration between your Windows environment, WSL 2 Linux distros, and Docker.

By default, Docker Desktop may not be configured to work with all WSL 2 distros out of the box. Proper configuration ensures that you can run Docker commands from within your WSL 2 environment, allowing for a more native Linux development experience while leveraging the power of Windows.

> This setup is essential for Keploy to function correctly in a WSL 2 environment, as it needs to interact with the Docker daemon to manage containers and networks effectively.
> For detailed instructions on how to configure `Docker Desktop` for WSL 2, please refer to the [official Docker documentation](https://docs.docker.com/desktop/wsl/).

</details>
