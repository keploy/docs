---
id: installation
title: Windows Installation
sidebar_label: Windows
tags:
  - hello-world
  - windows
  - ebpf
  - installation
keywords:
  - hello-world
  - windows
  - ebpf
  - installation
  - guide
  - api
  - docker
---

There are two ways to use Keploy eBPF in windows, you can use either use:

1. [Natively in Windows](#windows-native) using WSL.
2. By [Using Docker](#using-docker).

## Windows Native

### Download the Keploy Binary

```zsh
docker pull ghcr.io/keploy/keploy:v2.0.0-alpha2
```

#### Run the Record Mode

Run this command on your terminal to start the recording of API calls:-

```shell
sudo -E keploy record -c "CMD_TO_RUN_APP"
```

Make API Calls using [Hoppscotch](https://hoppscotch.io/), [Postman](https://www.postman.com/) or cURL command.

Keploy with capture the API calls you have made to generate the test-suites which will contain the testcases and data mocks into `YAML` format.

#### Run the Test Mode

Run this command on your terminal to run the testcases and generate the test coverage report:-

```shell
sudo -E keploy test -c "CMD_TO_RUN_APP" --delay 10
```

Voilà! 🧑🏻‍💻 We have the server running!

---

## Using Docker

### Creating Alias

We need to create the Alias for Keploy since we are using the Docker.

```shell
alias keploy='sudo docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm pull ghcr.io/keploy/keploy'
```

#### Run the Record Mode

Now, we will use the newly created Alias `keployV2` to record the testcases.

```shell
keploy record --c "CMD_to_run_user_container" --containerName "<contianerName>"
```

#### Run the Test Mode

Now, we will use the newly created Alias `keployV2` to test the testcases.

```shell
keploy test --c "CMD_to_run_user_container" --containerName "<contianerName>" --delay 20
```

> **CMD_to_run_user_container** is the docker command to run the application.
> If you are using `docker-compose` command to start the application, `--containerName` is required.

Voilà! 🧑🏻‍💻 We have the server running!

**Footnote**

1. delay is required while using Test Mode.
2. containerName is optional if you are using `Docker run` command, as the Container name must be present within the command itself.
