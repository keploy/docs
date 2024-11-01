---
id: docker-tls
title: TLS Docker Support
sidebar_label: TLS Docker Support
description: This section documents how to use TLS while running keploy via docker.
tags:
  - docker tls
  - docker
keywords:
  - docker
  - documentation
  - tls
  - running-guide
---

### Recording Testcases and Data Mocks <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png" width="20" height="20"/>

1. To record test cases and data mocks, follow these steps in the **root directory** of your application. Ensure that you have the following prerequisites in place:

- If you're running via **docker-compose**, ensure to include the `<CONTAINER_NAME>` under your application service in the docker-compose.yaml file [like this](https://github.com/keploy/samples-python/blob/9d6cf40da2eb75f6e035bedfb30e54564785d5c9/flask-mongo/docker-compose.yml#L14).
- You must run all of the containers on the same network when you're using **docker run command** (you can add your custom **network name** using `--network` flag in **docker run command**).
- In your **Docker Compose** file, every container should run on the same network.
- `Docker_CMD_to_run_user_container` refers to the Docker **command for launching** the application.
- Add the required commands to your DockerFile as stated below.

2. Add the following commands to your Dockerfile to download the `ca.crt` file and the `setup_ca.sh` script.

```dockerfile
# Download the ca.crt file
    RUN curl -o ca.crt  https://raw.githubusercontent.com/keploy/keploy/refs/heads/main/pkg/core/proxy/tls/asset/ca.crt
    RUN curl -o setup_ca.sh https://raw.githubusercontent.com/keploy/keploy/refs/heads/main/pkg/core/proxy/tls/asset/setup_ca.sh
    # Give execute permission to the setup_ca.sh script
    RUN chmod +x setup_ca.sh


# Run the CA setup script and then run the application server
    CMD ["/bin/bash", "-c", "source ./setup_ca.sh && <your app running command>"]
```

> Note: Also add **curl** installation command if **curl** is not installed on your image

To capture test cases, **Execute** the following command within your application's **root directory**.

```shell
keploy record -c "Docker_CMD_to_run_user_container --network <network_name>" --container-name "<container_name>"
```

Perform API calls using tools like [Hoppscotch](https://hoppscotch.io/), [Postman](https://www.postman.com/), or cURL commands.

Keploy will capture the API calls you've conducted, generating test suites comprising **test cases (KTests) and data mocks (KMocks)** in `YAML` format.

### Running Testcases

To execute the test cases, follow these steps in the **root directory** of your application.

When using **docker-compose** to start the application, it's important to ensure that the `--container-name` parameter matches the container name in your `docker-compose.yaml` file.

```shell
keploy test -c "Docker_CMD_to_run_user_container --network <network_name>" --container-name "<container_name>" --delay 20
```

Voilà! 🧑🏻‍💻 We have the tests with data mocks running! 🐰🎉

You'll be able to see the test cases that ran with the results report on the console as well as locally in the `testReport` directory.
