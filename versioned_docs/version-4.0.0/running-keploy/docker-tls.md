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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" />

### Recording Testcases and Data Mocks <img src="https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png" width="20" height="20" alt="Docker logo"/>

1. To record test cases and data mocks, follow these steps in the **root directory** of your application. Ensure that you have the following prerequisites in place:

- If you're running via **docker-compose**, ensure to include the `<CONTAINER_NAME>` under your application service in the docker-compose.yaml file [like this](https://github.com/keploy/samples-python/blob/9d6cf40da2eb75f6e035bedfb30e54564785d5c9/flask-mongo/docker-compose.yml#L14).
- You must run all of the containers on the same network when you're using **docker run command** (you can add your custom **network name** using `--network` flag in **docker run command**).
- In your **Docker Compose** file, every container should run on the same network.
- `Docker_CMD_to_run_user_container` refers to the Docker **command for launching** the application.
- Add the required commands to your DockerFile as stated below.

2. Trust is handled for you — no certificate to bake in.

   Keploy generates a fresh MITM certificate authority for each run and injects
   it, along with the matching trust environment variables, into your
   application container automatically (`docker run`, `docker compose` and
   `--from-container`). The CA's private key stays inside the Keploy agent and
   is never written anywhere your application container can read it.

   :::warning Older guides said to bake in a `ca.crt`
   Earlier versions of this page told you to `ADD` a `ca.crt` and
   `source setup_ca.sh` from a raw GitHub URL. **Remove those lines.** That
   recipe baked in a single static CA whose private key was public, and its
   `setup_ca.sh` overrode Keploy's injected trust (breaking interception for
   Node and Python `requests` apps). The URL now serves an inert placeholder so
   old images keep building, but you should drop the `ADD`/`source` lines and
   rely on the automatic injection above.
   :::

   Most runtimes (Go, Node, Python `requests`/`httpx`, curl, Java, .NET, Rust)
   trust Keploy's CA from the injected environment variables with no image
   change. A few libraries read **only** the OS trust store and ignore those
   variables — notably libcurl used as a library (PHP's `curl` extension,
   Guzzle), `git`, and `wget`/GnuTLS. If your app uses one of those, install the
   per-run CA into the image's store at startup from the volume Keploy mounts:

   ```dockerfile
       # Only needed for apps that read the OS trust store directly (PHP curl, git, wget).
       RUN apt-get update && apt-get install -y ca-certificates
       # Install the per-run CA that Keploy mounts at /tmp/keploy-tls, then run the app.
       CMD ["/bin/bash", "-c", "cp /tmp/keploy-tls/keploy-ca.crt /usr/local/share/ca-certificates/keploy.crt 2>/dev/null; update-ca-certificates 2>/dev/null; <your app running command>"]
   ```

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

## Removing Keploy's CA from a host

For containerized runs there is nothing to clean up — the per-run CA lives in the
agent container and goes away with it. On a **native** run (`keploy record`/`test`
without Docker on Linux), Keploy installs its per-run CA into the host trust store
for the duration of the run and removes it on exit.

If you ran an **older** keploy (which installed a static CA and never removed it),
or a run was killed before it could clean up, remove the leftover CA with:

```shell
sudo keploy ca clean --fresh
```

This removes Keploy's CA from the system trust store, the JDK keystore and any
leftover temp files, **matched by fingerprint** so your own certificates are left
untouched.

- **Windows:** the CA is added to your user's `Root` store (older elevated runs
  may have used the machine store). Remove it with
  `certutil -user -delstore Root "Keploy MITM CA"` (and, for a machine-store
  entry, the same command without `-user` from an elevated prompt). The retired
  static CA used the name `My Custom CA`.
- **macOS:** native runs do not add anything to the system keychain (trust is set
  per process), so there is nothing to remove.

## Related

- [Keploy CLI Commands](/docs/running-keploy/cli-commands/) — full record and test flag reference.
- [Configuration File](/docs/running-keploy/configuration-file/) — set container and network names in `keploy.yaml`.
- [Keploy Passthrough](/docs/running-keploy/keploy-passthrough/) — pass through ports for containerized dependencies.
- [Adding a custom Mock to the Keploy Mock File](/docs/running-keploy/custom-mocks/) — mock services you cannot containerize.
