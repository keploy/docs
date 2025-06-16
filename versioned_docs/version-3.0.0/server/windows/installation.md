---
id: installation
title: Windows Installation
sidebar_label: Windows
tags:
  - hello-world
  - windows
  - ebpf
  - installation
  - install
  - installation-guide
  - server-setup
keywords:
  - hello-world
  - windows
  - ebpf
  - installation
  - guide
  - api
  - docker
---

Keploy can be installed in two ways:

1. [One-Click Install](#one-click-install-keploy).
2. [Manual Install](#manual-install)

## One click install Keploy.

```shell
 curl --silent -O https://keploy.io/install.sh && source install.sh
```

## Manual Install

There are two ways to use Keploy eBPF in windows, you can use either use:

1. [Natively in Windows](#windows-native) using WSL.
2. By [Using Docker](#using-docker).

## Windows Native

### Download the Keploy Binary

On Windows, WSL is required to run Keploy Binary. You must be running Windows 10 version 2004 and higher (Build 19041
and higher) or Windows 11 to use the commands below.

```shell
wsl --install -d <Distribution Name>
```

Recommended to use "Ubuntu-22.04"

This command will enable the features necessary to run WSL and install the Ubuntu distribution of Linux. (This default
distribution can be changed).

If you're running an older build, or just prefer not to use the install command and would like step-by-step directions,
see WSL manual installation steps for older versions.

Once installed download and Install "Keploy Binary" :

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

#### Run the Record Mode

Run this command on your terminal to start the recording of API calls:-

```shell
sudo -E keploy record -c "path/to/the/application/binary"
```

Make API Calls using [Postman](https://www.postman.com/) or cURL command.

Keploy with capture the API calls you have made to generate the test-suites which will contain the testcases and data
mocks into `YAML` format.

#### Run the Test Mode

Run this command on your terminal to run the testcases and generate the test coverage report:-

```shell
sudo -E keploy test -c "path/to/the/application/binary" --delay 10
```

Voilà! 🧑🏻‍💻 We have the server running!

---

## Using Docker

### Setting up the Docker Desktop for WSL 2

1. Install Docker Desktop for Windows from [here](https://docs.docker.com/desktop/windows/install/).

When developing on Windows with Docker Desktop and WSL 2, it's crucial to configure Docker Desktop to allow WSL 2 distributions to access the Docker daemon. This setup enables seamless integration between your Windows environment, WSL 2 Linux distros, and Docker.

By default, Docker Desktop may not be configured to work with all WSL 2 distros out of the box. Proper configuration ensures that you can run Docker commands from within your WSL 2 environment, allowing for a more native Linux development experience while leveraging the power of Windows.

> This setup is essential for Keploy to function correctly in a WSL 2 environment, as it needs to interact with the Docker daemon to manage containers and networks effectively.

For detailed instructions on how to configure `Docker Desktop` for WSL 2, please refer to the [official Docker documentation](https://docs.docker.com/desktop/wsl/).

### Creating Alias

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
