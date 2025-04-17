---
id: installation
title: Keploy Installation
sidebar_label: Installation
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
---

import PlatformRequirements from '../concepts/platform-requirements.md'

<PlatformRequirements/>

# Keploy Installation

## Quick Installation Using CLI

Let's get started by setting up the Keploy alias with this command:

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

## Other Installation Methods

<details>
<summary>Install using Docker</summary>

### Downloading and running Keploy in Docker

#### On macOS

Note : Keploy is not supported natively on MacOS, so you can follow the below method to run with docker

1. Open up a terminal window.

2. Create a bridge network in Docker using the following docker network create command:

```bash
docker network create keploy-network
```

3. Run the following command to start the Keploy container:

```bash
alias keploy="docker run --name keploy-v2 -p 16789:16789 --network keploy-network --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy"
```

</details>

<details>
<summary>Downloading and running Keploy in Native</summary>

### Downloading and running Keploy in Native

**Prequisites:**

- Linux Kernel version 5.15 or higher
- Run `uname -a` to verify the system architecture.
- In case of Windows, use WSL with Ubuntu 20.04 LTS or higher.

<summary>Downloading and running Keploy On WSL/Linux AMD</summary>

#### On WSL/Linux AMD

1. Open the terminal Session.
2. Run the following command to download and install Keploy:

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz --overwrite -C /tmp
sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
```

#### On WSL/Linux ARM

1. Open the terminal Session
2. Run the following command to download and install Keploy:

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp
sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy

```

> Note: Keploy is not supported on MacOS natively.

### Setting up the Docker Desktop for WSL 2

1. Install Docker Desktop for Windows from [here](https://docs.docker.com/desktop/windows/install/).

When developing on Windows with Docker Desktop and WSL 2, it's crucial to configure Docker Desktop to allow WSL 2 distributions to access the Docker daemon. This setup enables seamless integration between your Windows environment, WSL 2 Linux distros, and Docker.

By default, Docker Desktop may not be configured to work with all WSL 2 distros out of the box. Proper configuration ensures that you can run Docker commands from within your WSL 2 environment, allowing for a more native Linux development experience while leveraging the power of Windows.

> This setup is essential for Keploy to function correctly in a WSL 2 environment, as it needs to interact with the Docker daemon to manage containers and networks effectively.
> For detailed instructions on how to configure `Docker Desktop` for WSL 2, please refer to the [official Docker documentation](https://docs.docker.com/desktop/wsl/).

</details>
