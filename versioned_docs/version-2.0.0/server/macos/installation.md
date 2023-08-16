---
id: installation
title: MacOS Installation
sidebar_label: MacOS
tags:
  - hello-world
  - macos
  - apple
  - ebpf
  - installation
keywords:
  - hello-world
  - macos
  - apple
  - ebpf
  - installation
  - guide
  - api
  - docker
---

As of now there is only one ways to use Keploy eBPF in MacOS, i.e. [Natively using Colima](#using-colima).

# Using Colima

## Install Colima

You need to have the latest version of `brew` installed on your system and then run this command from a terminal:

```zsh
brew install colima
```

Start Colima with defaults

```zsh
colima start
```

## Creating Alias

We need to create the Alias for Keploy since we are using the Docker.

```shell
alias keploy='sudo docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm pull ghcr.io/keploy/keploy'
```

#### Run the Record Mode

Now, we will use the newly created Alias `keployV2` to record the testcases.

```shell
keploy record --c "CMD_to_run_user_container" --containerName "<contianerName>"
```

Make API Calls using [Hoppscotch](https://hoppscotch.io/), [Postman](https://www.postman.com/) or cURL command.

Keploy with capture the API calls you have made to generate the test-suites which will contain the testcases and data mocks into `YAML` format.

#### Run the Test Mode

Now, we will use the newly created Alias `keployV2` to test the testcases.

```shell
keploy test --c "CMD_to_run_user_container" --containerName "<contianerName>" --delay 10
```

> **CMD_TO_RUN_APP** is the respective command to run your target application .

**Footnote**

1. delay is required while using Test Mode.
2. `containerName` is optional if you are using `Docker run` command, if the Container name is already present within the command itself.
