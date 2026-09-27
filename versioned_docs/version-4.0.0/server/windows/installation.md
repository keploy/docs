---
id: installation
title: Windows Installation
sidebar_label: Windows
description: "Install Keploy on Windows — natively on x86-64 with no Administrator, or inside WSL or Docker."
tags:
  - hello-world
  - windows
  - installation
  - install
  - installation-guide
  - server-setup
keywords:
  - hello-world
  - windows
  - wsl
  - installation
  - guide
  - api
  - docker
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Install Keploy on Windows"
description="Install Keploy natively on Windows (x86-64) from PowerShell, or run it inside WSL or Docker."
totalTime="PT5M"
tools={["Windows", "PowerShell", "Keploy CLI"]}
steps={[
{name: "Download Keploy", text: "In PowerShell (no Administrator), download https://keploy.io/ent/dl/latest/enterprise_windows_amd64.exe as keploy.exe into %USERPROFILE%\\.keploy\\bin and add that folder to your user PATH."},
{name: "Record", text: "Open a new terminal and run: keploy record -c \"<your app command>\""},
{name: "Or use WSL or Docker", text: "On Windows on ARM, run Keploy inside WSL. For an app that runs in containers, use Docker Desktop."},
]}
visible={false}
/>

Keploy runs **natively on Windows (x86-64)** — no WSL, no Docker and no Administrator. You can also run it inside WSL or with Docker:

1. [Natively on Windows](#windows-native) (recommended).
2. [Inside WSL](#inside-wsl) — also the route on Windows on ARM.
3. By [Using Docker](#using-docker) — for apps that run in containers, or that depend on services other than HTTP/HTTPS, MySQL and MongoDB: natively on Windows, calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay.

## Windows Native

### Download the Keploy Binary

Run this in **PowerShell** — a normal one, not as Administrator:

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

Open a new terminal so the updated `Path` takes effect, then check it with `keploy --version`.

#### Run the Record Mode

Run this command on your terminal to start the recording of API calls:-

```powershell
keploy record -c "path\to\the\application\binary"
```

Make API Calls using Postman or cURL command.

Keploy will capture the API calls you have made to generate the test-suites which will contain the testcases and data
mocks into `YAML` format.

#### Run the Test Mode

Run this command on your terminal to run the testcases and generate the test coverage report:-

```powershell
keploy test -c "path\to\the\application\binary" --delay 10
```

Voilà! 🧑🏻‍💻 We have the server running! See [Installing Keploy on Windows](/docs/installation/windows-installation/) for more.

## Inside WSL

You must be running Windows 10 version 2004 and higher (Build 19041 and higher) or Windows 11 to use the commands below. Enable WSL from an elevated terminal:

```shell
wsl --install -d <Distribution Name>
```

Recommended to use "Ubuntu-22.04"

This command will enable the features necessary to run WSL and install the Ubuntu distribution of Linux. (This default
distribution can be changed).

If you're running an older build, or just prefer not to use the install command and would like step-by-step directions,
see WSL manual installation steps for older versions.

Then, inside the WSL shell, install Keploy:

```shell
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

Inside WSL, `keploy record` and `keploy test` work as they do on Linux.

---

## Using Docker

With Docker Desktop running, install Keploy as in [Windows Native](#windows-native) above. The `keploy` CLI runs in PowerShell and starts your app's container and Keploy's agent in Docker. Then [create the network](#create-a-network) and record.

### If you run Keploy inside WSL: setting up Docker Desktop for WSL 2

1. Install Docker Desktop for Windows from [here](https://docs.docker.com/desktop/windows/install/).

When developing on Windows with Docker Desktop and WSL 2, it's crucial to configure Docker Desktop to allow WSL 2 distributions to access the Docker daemon. This setup enables seamless integration between your Windows environment, WSL 2 Linux distros, and Docker.

By default, Docker Desktop may not be configured to work with all WSL 2 distros out of the box. Proper configuration ensures that you can run Docker commands from within your WSL 2 environment, allowing for a more native Linux development experience while leveraging the power of Windows.

> This setup is essential for Keploy to function correctly in a WSL 2 environment, as it needs to interact with the Docker daemon to manage containers and networks effectively.

For detailed instructions on how to configure `Docker Desktop` for WSL 2, please refer to the [official Docker documentation](https://docs.docker.com/desktop/wsl/).

### Create a network

We need to create a custom network for Keploy since we are using the Docker, therefore application container would
require `docker network` to act as the bridge between them.

If you're using a **docker-compose network**, replace `keploy-network` with your app's `docker_compose_network_name`
below.

```shell
docker network create keploy-network
```

#### Run the Record Mode

Now, we record the testcases.

```shell
keploy record -c "docker run -p <appPort>:<hostPort> --name <containerName> --network keploy-network --rm <applicationImage>" --containerName "<containerName>" --delay 10
```

#### Run the Test Mode

Now, we will test the testcases.

```shell
keploy test -c "docker run -p <appPort>:<hostPort> --name <containerName> --network keploy-network --rm <applicationImage>" --containerName "<containerName>" --delay 20
```

> **CMD_to_run_user_container** is the docker command to run the application.
> If you are using `docker compose` command to start the application, `--containerName` is required.

Voilà! 🧑🏻‍💻 We have the server running!

You'll be able to see the test-cases that ran with the results report on the console as well locally in the `testReport`
directory.

**Footnote**

1. `delay` is required while using Test Mode.
2. containerName is optional if you are using `Docker run` command, as the Container name must be present within the
   command itself.
