---
id: installation
title: Linux Installation
sidebar_label: Linux
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

Keploy can be installed in two ways:

1. [One-Click Install](#one-click-install-keploy).
2. [Manual Install](#manual-install)

## One click install Keploy.

```shell
 curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

## Manual Install

There are two ways to use Keploy eBPF in linux, you can use either use:

1. [Natively in Linux](#linux-native).
2. Through [Using Docker](#using-docker).

## Linux Native

### Download the Keploy Binary

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

<details>
 <summary> <strong> ARM Architecture </strong> </summary>

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

</details>

#### Run the Record Mode

Run this command on your terminal to start the recording of API calls:-

```shell
sudo -E keploy record -c "CMD_TO_RUN_APP"
```

Make API Calls using [Postman](https://www.postman.com/) or cURL command.

Keploy with capture the API calls you have made to generate the test-suites which will contain the testcases and data
mocks into `YAML` format.

#### Run the Test Mode

Run this command on your terminal to run the testcases and generate the test coverage report:-

```shell
sudo -E keploy test -c "CMD_TO_RUN_APP" --delay 10
```

Voilà! 🧑🏻‍💻 We have the server running!

---

## Using Docker

We need to create a custom network for Keploy since we are using the Docker, therefore application container would
require `docker network` to act as the bridge between them.

If you're using a **docker-compose network**, replace `keploy-network` with your app's `docker_compose_network_name`
below.

```shell
docker network create keploy-network
```

#### Capture the Testcases

Now, we will record the testcases.

```shell
keploy record -c "docker run -p <appPort>:<hostPort> --name <containerName> --network keploy-network --rm <applicationImage>" --containerName "<containerName>" --delay 10
```

#### Run the Testcases

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
