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

## Quick Installation

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
  example         Example to record and test via keploy
  generate-config generate the keploy configuration file
  record          record the keploy testcases from the API calls
  test            run the recorded testcases and execute assertions
  update          Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

🎉 Wohoo! You are all set to use Keploy.

## Other Installation Methods

### Downloading and running Keploy in Docker

#### On macOS and Linux
1. Open up a terminal window.

2. Create a bridge network in Docker using the following docker network create command:

```bash
docker network create keploy-network
```

3. Run the following command to start the Keploy container:

```bash
alias keploy="docker run --name keploy-v2 -p 16789:16789 --network keploy-network --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy"
```

#### On Windows

1. Start `WSL` and open up a terminal window.
2. Create a bridge network in Docker using the following docker network create command:

```bash
docker network create keploy-network
```

3. Run the following command to start the Keploy container:

```bash
alias keploy="docker run --name keploy-v2 -p 16789:16789 --network keploy-network --privileged --pid=host -v $(pwd):$(pwd) -w $(pwd) -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy"
```

### Downloading and running Keploy in Native

**Prequisites:**

- Linux Kernel version 5.15 or higher
- Run `uname -a` to verify the system architecture.
- In case of Windows, use WSL with Ubuntu 20.04 LTS or higher.

#### On Linux AMD

1. Open the terminal Session.
2. Run the following command to download and install Keploy:

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz --overwrite -C /tmp
sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
```

#### On Linux ARM

1. Open the terminal Session
2. Run the following command to download and install Keploy:

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp
sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
```

> Note: Keploy is not supported on MacOS natively.

### With Arkade

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
arkade get keploy@2.2.0-alpha20
```


🎉 Wohoo! You are all set to use Keploy.