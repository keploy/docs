---
id: contribution-guide
title: Contribution Guide
sidebar_label: Contribution Guide
description: "Step-by-step guide to setting up Keploy locally for development — clone the repo, build from source, and contribute code."
tags:
  - explanation
  - dev guide
  - contribution guide
---

# Contribution Guide

Welcome to the world of Keploy development! This guide will help you set up Keploy locally.

### 1. **Setting Up Your Platform**:

_Keploy built from source intercepts with eBPF, so to record an app with your own build on macOS or Windows, you'll work inside a Linux VM. (To just use Keploy, you don't need one: it runs natively on macOS and Windows — see [Installing Keploy](#installing-keploy) below.)_

- For macOS, install [Lima](https://github.com/lima-vm/lima#installation).
- If you're on Windows, install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install).

Note: Linux Users are good to go.

### 2. **Pre-requisites**:

First things first, ensure you have [Golang](https://go.dev/doc/install) installed.

### 3. **Clone Keploy Repository**:

Time to get your hands on Keploy!:

```shell
git clone https://github.com/keploy/keploy.git && cd keploy
go mod download
```

Once done, build the binary

```shell
go build -race -tags=viper_bind_struct -o keploy .
sudo mv keploy /usr/local/bin/
sudo chmod +x /usr/local/bin/keploy
```

**_Now we have successfully set up Keploy. Let’s test it with the sample app._**

#### Keploy operates in two modes:

- `record`: Capture Keploy test cases from API calls.
- `test`: Execute recorded test cases and validate assertions.

The Keploy CLI operates by capturing all network traffic between your application and its dependencies.

It meticulously records API calls, database queries, and any other interactions your application engages in.

Once the recording phase is complete, Keploy can effortlessly generate test cases and data mocks in YAML format.

If you don't have any samples app, you can use the [gin-mongo URL Shortener](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample application:

#### Let's clone sample app repo:

```shell
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download   # Download dependencies:
go build -o gin-mongo-binary  # Generate binary of the application:
```

### 4. Now let's try running keploy:

#### Capturing Test Cases:

```shell
sudo keploy record -c "path/to/go/binary"
```

#### Running Test Cases:

```shell
sudo keploy test -c "path/to/go/binary" --delay 10
```

Note: Use the `--debug` flag to run Keploy in debug mode for detailed logs.

### Also you can Test Locally Built Docker Image:

#### Build Docker Image:

Note: Run the below command inside the keploy repository and make sure there is no directory by the name of keploy inside the main keploy repository.

```shell
sudo docker image build -t ghcr.io/keploy/keploy:v2-dev .
```

#### Remember setting up the Keploy binary. See [Setup Keploy using Binary](#3-clone-keploy-repository) for details.

#### Capture Test Cases:

```shell
sudo keploy record -c "docker run -p -p <appPort>:<hostPort>  --name <containerName> --network keploy-network --rm <imageName>"
```

#### Running Test Cases:

```shell
sudo keploy test -c "docker run -p -p <appPort>:<hostPort>  --name <containerName> --network keploy-network --rm <imageName>" --delay 10
```

There you have it! With this guide, you're all set to dive into Keploy development.

Happy testing! 🧪🔍💻

> **Note** :- Run `go run github.com/99designs/gqlgen generate --config pkg/graph/gqlgen.yml` to generate the graphql server stubs which can be used when working with unit testing libraries like JUnit, PyTest, etc..

Hope this helps you out, if you still have any questions, reach out to us on [Slack](https://keploy.io/slack).

## Installing Keploy

To install the released Keploy binary alongside your local build:

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StartKeploy from '@site/src/components/StartKeploy';
import StartKeployDocker from '@site/src/components/StartKeployDocker';

<Tabs>
<TabItem value="linux" label="Linux">
<br />

:::info
Make sure your Linux kernel version is **5.10 or higher**.
:::

👉 **Choose your preferred method:**

<Tabs>
<TabItem value="linux-native" label="Native">

### 1. Install Keploy

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

### 2. Once done, you should see something like this:

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

🎉 You have successfully installed **Keploy on Linux**.

<StartKeploy />
</TabItem>

<TabItem value="docker-linux" label="Docker">

### Install Keploy with Docker on Linux

1. Make sure Docker is installed on Linux.
2. Install Keploy

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

🎉 You have successfully set up **Keploy on Linux** using **Docker**.

<StartKeployDocker />
</TabItem>
</Tabs>
</TabItem>

<TabItem value="macos" label="macOS">
<br />

:::info
Keploy runs natively on Apple Silicon Macs: no Lima VM, no Docker and no `sudo`. Natively it understands the HTTP/HTTPS, MySQL and MongoDB calls of Go, Node.js, Python and Java apps; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay — see [Installing Keploy on macOS](/docs/installation/macos-installation/). For containerized apps or those other dependencies use **Docker**; on an Intel Mac use **Lima**, as the macOS CLI is Apple Silicon (arm64) only.
:::

<Tabs>
<TabItem value="macos-native" label="Native">

### Install Keploy

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

<StartKeploy platform="macos" />
</TabItem>

<TabItem value="lima" label="Lima">

### Install Keploy with Lima

1. Check if Lima is installed. If you already have a Lima instance, make it writable (see step 3) and skip to step 5, using its name in place of `debian-12`.
2. Install Lima

```bash
brew install lima
```

3. Create a Debian instance

```bash
limactl create --mount-writable template://debian-12
```

Lima mounts your Mac's home folder read-only by default; `--mount-writable` lets Keploy write its test files into your project. If you already have an instance, stop it if it's running (`limactl stop <name>`), then make it writable with `limactl edit <name> --mount-writable --start`.

4. Start the instance

```bash
limactl start debian-12
```

5. Enter the Linux shell

```bash
limactl shell debian-12
```

6. Install Keploy inside Lima, from the VM's own home directory

```bash
cd ~ && curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

🎉 You have successfully set up **Keploy on macOS** using **Lima**.

<StartKeploy />
</TabItem>

<TabItem value="docker-mac" label="Docker">

### Install Keploy with Docker on macOS

:::note Apple Silicon only
Your application and Keploy's agent run in containers here, but the `keploy` CLI installed in step 2 — which starts them both — runs on your Mac, and is Apple Silicon (arm64) only. On an Intel Mac use the **Lima** tab instead.
:::

1. Make sure Docker Desktop is running on macOS.
2. Install Keploy

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. Create the Docker network your app's container and Keploy share

```bash
docker network create keploy-network
```

🎉 You have successfully set up **Keploy on macOS** using **Docker**.

<StartKeployDocker />
</TabItem>
</Tabs>
</TabItem>

<TabItem value="windows" label="Windows">
<br />

:::info
Keploy runs natively on Windows (x86-64) with no WSL, no Docker and no Administrator — see [Installing Keploy on Windows](/docs/installation/windows-installation/). You can also run it using **WSL** or **Docker**; on Windows on ARM, use **WSL**.
:::

<Tabs>
<TabItem value="windows-native" label="Native">

### Install Keploy

Run this in PowerShell (not as Administrator), then open a new terminal:

```powershell
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
$dir = "$env:USERPROFILE\.keploy\bin"
New-Item -ItemType Directory -Force $dir | Out-Null
Invoke-WebRequest -Uri "https://keploy.io/ent/dl/latest/enterprise_windows_amd64.exe" `
  -OutFile "$dir\keploy.exe"
Unblock-File "$dir\keploy.exe"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$dir*") {
  [Environment]::SetEnvironmentVariable("Path", "$userPath;$dir", "User")
}
```

<StartKeploy />
</TabItem>

<TabItem value="wsl" label="WSL">

### Install Keploy with WSL

1. Enable WSL

```shell
wsl --install -d <Distribution Name>
```

👉 We recommend **Ubuntu-22.04**.

2. Install Keploy inside WSL

```shell
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

🎉 You have successfully set up **Keploy on Windows** using **WSL**.

<StartKeploy />
</TabItem>

<TabItem value="docker-windows" label="Docker">

### Install Keploy with Docker on Windows

1. Make sure Docker Desktop is running on Windows.
2. Install Keploy with the PowerShell script in the **Native** tab. The `keploy` CLI runs on Windows and starts your app's container and Keploy's agent in Docker.
3. Create the Docker network your app's container and Keploy share

```powershell
docker network create keploy-network
```

🎉 You have successfully set up **Keploy on Windows** using **Docker**.

<StartKeployDocker />
</TabItem>
</Tabs>
</TabItem>
</Tabs>

## Related

- [Keploy Docs Contribution Guide](/docs/keploy-explained/docs-dev-guide/) — contribute to the documentation.
- [Testing Guide](/docs/keploy-explained/testing-guide/) — how Keploy's test bench works.
- [Debugger Guide](/docs/keploy-explained/debugger-guide/) — debug Keploy while developing.
- [How Keploy Works?](/docs/keploy-explained/how-keploy-works/) — the internal architecture.
