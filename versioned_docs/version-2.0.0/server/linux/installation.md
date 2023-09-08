---
id: installation
title: Linux Installation
sidebar_label: Linux
---

There are two ways to use Keploy eBPF in linux, you can use either use:

1. [Natively in Linux](#linux-native).
2. Through [Using Docker](#using-docker).

## Linux Native

### Download the Keploy Binary

```zsh
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
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

We need to create a he alias for the Keploy since we are using the Docker.

```shell
alias keploy='sudo docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm pull ghcr.io/keploy/keploy'
```

#### Capture the Testcases

Now, we will use the newly created alias `keploy` to record the testcases.

```shell
keploy record -c "CMD_to_run_user_container" --containerName "<contianerName>"
```

#### Run the Testcases

Now, we will use the newly created Alias `keploy` to test the testcases.

```shell
keploy test -c "CMD_to_run_user_container" --containerName "<contianerName>" --delay 20
```

> **CMD_to_run_user_container** is the docker command to run the application.
> If you are using `docker compose` command to start the application, `--containerName` is required.

Voilà! 🧑🏻‍💻 We have the server running!

**Footnote**

1. delay is required while using Test Mode.
2. containerName is optional if you are using `Docker run` command, as the Container name must be present within the command itself.
