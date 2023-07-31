---
id: installation
title: Linux Installation
sidebar_label: Linux
---

There are two ways to use Keploy eBPF in linux, you can use either use:

1. [Natively in Linux](#linux-native)
2. through [Using Docker](#using-docker)

# Linux Native

### Download the Keploy Binary

> Keploy Binary Link

### Run the Record Mode

Go the Keploy Repository Folder and run the command:-

```shell
-exec "sudo -E keploy" main.go record --c "CMD_TO_RUN_APP"
```

### Run the Test Mode

Go the Keploy Repository Folder and run the command:-

```shell
-exec "sudo -E keploy" main.go test --c "CMD_TO_RUN_APP" --delay 10
```

> **CMD_TO_RUN_APP** is the respective command to run your target application .

Voilà! 🧑🏻‍💻 We have the server running!


# Using Docker

1. Create an Alias for Keploy

```shell
alias keploy='sudo docker run --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm <keployV2-image>'
```

2. Now, we will use the newly created Alias `keployV2` to record the testcases.

```shell
keploy record --c "CMD_to_run_user_container" --containerName "<contianerName>"
```

3. Now, we will use the newly created Alias `keployV2` to test the testcases.

```shell
keploy test --c "CMD_to_run_user_container" --containerName "<contianerName>" --delay 20
```

> **CMD_to_run_user_container** is the docker command to run the application.
> If you are using `docker-compose` command to start the application, `--containerName` is required.

Voilà! 🧑🏻‍💻 We have the server running!

**Footnote**

1. delay is required while using Test Mode.
2. containerName is optional if you are using `Docker run` command, as the Container name must be present within the command itself.
