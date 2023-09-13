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

### Create Keploy Alias

To establish a network for your application using Keploy on Docker, follow these steps.

If you're using a docker-compose network, replace keploy-network with your app's docker_compose_network_name below.

```shell
docker network create keploy-network
```

Then, create an alias for Keploy:

```bash
alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --network keploy-network --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy''
```

### Creating Alias

To establish a network for your application using Keploy on Docker, follow these steps.

If you're using a **docker-compose network**, replace `keploy-network` with your app's `docker_compose_network_name` below.

```zsh
docker network create keploy-network
```

Then, create an alias for Keploy:

```shell
alias keploy='sudo docker run --name keploy-v2 -p 16789:16789 --network keploy-network --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
```

### Recording Testcases and Data Mocks

Here are few points to consider before recording!

- If you're running via **docker compose**, ensure to include the `<CONTAINER_NAME>` under your application service in the docker-compose.yaml file [like this](https://github.com/keploy/samples-python/blob/9d6cf40da2eb75f6e035bedfb30e54564785d5c9/flask-mongo/docker-compose.yml#L14).

- Change the **network name** (`--network` flag) from `keploy-network` to your custom network if you changed it above.
- `Docker_CMD_to_run_user_container` refers to the Docker **command for launching** the application.

Utilize the keploy alias we created to capture testcases. **Execute** the following command within your application's **root directory**.

```shell
keploy record -c "Docker_CMD_to_run_user_container --network keploy-network" --containerName "<containerName>"
```

Perform API calls using tools like [Hoppscotch](https://hoppscotch.io/), [Postman](https://www.postman.com/), or cURL commands.

Keploy will capture the API calls you've conducted, generating test suites comprising **testcases (KTests) and data mocks (KMocks)** in `YAML` format.

### Running Testcases

Now, use the keployV2 Alias we created to execute the testcases. Follow these steps in the **root directory** of your application.

When using **docker-compose** to start the application, it's important to ensure that the `--containerName` parameter matches the container name in your `docker-compose.yaml` file.

```shell
keploy test -c "Docker_CMD_to_run_user_container --network keploy-network" --containerName "<containerName>" --delay 20
```

Voilà! 🧑🏻‍💻 We have the tests with data mocks running! 🐰🎉

You'll be able to see the test-cases that ran with the results report on the console as well locally in the `testReport` directory.
