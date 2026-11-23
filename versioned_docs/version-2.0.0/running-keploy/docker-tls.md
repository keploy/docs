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

2. Trust is handled for you — no certificate to bake in.

   Keploy generates a fresh MITM certificate authority for each run and injects it, with the matching trust environment variables, into your application container automatically. The CA's private key stays inside the Keploy agent.

   :::warning Older guides said to bake in a `ca.crt`
   Earlier versions of this page told you to `ADD` a `ca.crt` and `source setup_ca.sh` from a raw GitHub URL. **Remove those lines.** That recipe baked in a single static CA whose private key was public, and its `setup_ca.sh` overrode Keploy's injected trust. The URL now serves an inert placeholder so old images keep building; drop the `ADD`/`source` lines and rely on the automatic injection. To remove the old static CA from a host, run `sudo keploy ca clean --fresh`.
   :::

To capture test cases, **Execute** the following command within your application's **root directory**.

```shell
keploy record -c "Docker_CMD_to_run_user_container --network <network_name>" --container-name "<container_name>"
```

Make API calls using Postman , or cURL commands.

Keploy will capture the API calls you've conducted, generating test suites comprising **test cases (KTests) and data mocks (KMocks)** in `YAML` format.

### Running Testcases

To execute the test cases, follow these steps in the **root directory** of your application.

When using **docker-compose** to start the application, it's important to ensure that the `--container-name` parameter matches the container name in your `docker-compose.yaml` file.

```shell
keploy test -c "Docker_CMD_to_run_user_container --network <network_name>" --container-name "<container_name>" --delay 20
```

Voilà! 🧑🏻‍💻 We have the tests with data mocks running! 🐰🎉

You'll be able to see the test cases that ran with the results report on the console as well as locally in the `testReport` directory.
