---
id: macos-installation
title: Installing Keploy on macOS
sidebar_label: macOS Installation
description: A guide to running Keploy on macOS — natively, or with Lima or Docker.
tags:
  - installation
keywords:
  - macos
  - installation
  - docker
  - lima
---

# Installing Keploy on macOS

Keploy now runs **natively on macOS** (Apple Silicon) — you can record and replay an app that runs directly on your Mac, with no Lima VM and no Docker. Native macOS support intercepts traffic in userspace (there is no eBPF on macOS), so it needs no root and installs nothing system-wide.

Native macOS support covers **Go, Node.js, Python and Java** apps, including their HTTPS traffic, and understands their **HTTP/HTTPS, MySQL and MongoDB** calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay. If your app runs in containers, or depends on one of those other services, use [Docker](#option-3-install-keploy-with-docker). On an Intel Mac, use [Lima](#option-2-install-keploy-with-lima).

:::note Keploy needs a free account

`keploy record` and `keploy test` sign you in before they run. The first time you use either, Keploy prints a URL and opens your browser at [app.keploy.io](https://app.keploy.io) to sign in; the session is then cached in `~/.keploy/tokens.yaml` and reused.

- **No browser available** (a remote shell, a container): run with `--manual-login` and paste an API key from your Keploy dashboard when prompted.
- **CI, or any non-interactive run**: set `KEPLOY_API_KEY` (or pass `--api-key`) and Keploy skips the sign-in prompt entirely.
- **Offline**: the local mock loop — `keploy mock record --local` and `keploy mock replay --local` — is the one pair that runs without signing in. While you are signed out it logs a harmless `failed to validate user role` line and then runs normally. This is the mock loop, not a replacement for `keploy record` and `keploy test` — see [Mock your tests](/docs/running-keploy/mock-your-tests).

A free account is enough to record and replay. Free-tier runs are subject to a usage allowance.

:::

👉 **Choose your preferred method:**

- [Option 1: Run Keploy natively (recommended)](#option-1-run-keploy-natively)

- [Option 2: Install Keploy with Lima](#option-2-install-keploy-with-lima)

- [Option 3: Install Keploy with Docker](#option-3-install-keploy-with-docker)

## Option 1: Run Keploy natively

:::note Apple Silicon only

The native macOS build is **Apple Silicon (arm64) only**. On an Intel Mac the installer, the Homebrew formula and `keploy update` refuse to install rather than fetch a binary that cannot run there. If one of them sent you here, use [Option 2 (Lima)](#option-2-install-keploy-with-lima), which installs the Linux build inside the VM. [Option 3 (Docker)](#option-3-install-keploy-with-docker) is not an Intel route either: it starts your app and Keploy's agent in containers, but the `keploy` CLI that drives it is the same native build running on your Mac.

:::

1. **Install Keploy**

   ```bash
   curl --silent -O -L https://keploy.io/install.sh && source install.sh
   ```

2. **Record your app** — pass the command that starts it, exactly as you run it yourself:

   ```bash
   keploy record -c "<your app command>"
   ```

   For example, a Go binary, a Node server, a Python app or a Java jar:

   ```bash
   keploy record -c "./myapp"          # Go
   keploy record -c "node server.js"   # Node.js
   keploy record -c ".venv/bin/python app.py"   # Python, from a virtualenv
   keploy record -c "${JAVA_HOME:-$(/usr/libexec/java_home)}/bin/java -jar target/app.jar"   # Java
   ```

3. **Replay the recorded tests**:

   ```bash
   keploy test -c "<your app command>" --delay 10
   ```

:::note Good to know

- **No password prompt.** Native macOS interception needs no privileges, so `keploy record`/`test` do not ask for `sudo`.
- **Use your own Python and Java.** Apple's `/usr/bin/python3` and `/usr/bin/java` are protected by macOS and record nothing. Use a Homebrew or uv Python, or a virtualenv built on one — with pyenv, its real interpreter (`$(pyenv which python3)`), not the shim — and your JDK's own `java`: `"${JAVA_HOME:-$(/usr/libexec/java_home)}/bin/java" -jar target/<your-app>.jar` (any `java` on your `PATH` other than Apple's `/usr/bin/java`, such as SDKMAN's or Homebrew's, works as it is).
- **Run the real executable, not a launcher.** macOS strips the interception from `npm start`, a `make` recipe, or a wrapper shell script (it is dropped when the OS runs a protected system binary). Run the app's actual command — `node server.js` rather than `npm start`, or build first and run the binary. Keploy warns you if it never got loaded.
- **Go HTTPS on macOS.** Go verifies TLS through the macOS Security framework; Keploy makes its interception CA trusted for your app's process only, so recording an HTTPS Go app works without touching your system keychain. Apps that pin a certificate (an explicit root pool) are the exception.

:::

## Option 2: Install Keploy with Lima

1. **Check if Lima is installed**  
   If you already have a Lima instance, make it writable (see step 3) and go to Step 5, using its name in place of `debian-12`.

2. **Install Lima**

   ```bash
   brew install lima
   ```

3. **Create a Debian instance**

   ```bash
   limactl create --mount-writable template://debian-12
   ```

   Lima mounts your Mac's home folder read-only by default; `--mount-writable` lets Keploy write its test files into your project. If you already have an instance, stop it if it's running (`limactl stop <name>`), then make it writable with `limactl edit <name> --mount-writable --start`.

4. **Start the instance**

   ```bash
   limactl start debian-12
   ```

5. **Enter the Linux shell**

   ```bash
   limactl shell debian-12
   ```

6. **Install Keploy inside Lima**, from the VM's own home directory

   ```bash
   cd ~ && curl --silent -O -L https://keploy.io/install.sh && source install.sh
   ```

   Then `cd` into your project under `/Users/<you>/…` to record it.

7. **Verify the installation**

   ```bash
   keploy --version
   ```

✅ If the version shows up, Keploy is installed successfully!

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/)

Begin recording your API calls and automatically generate test cases with Keploy.

---

## Option 3: Install Keploy with Docker

:::note Also Apple Silicon only

With this option your application and Keploy's agent run in containers, but the `keploy` CLI installed in step 3 — which starts them both — is the native macOS build, which is Apple Silicon (arm64) only. On an Intel Mac use [Option 2 (Lima)](#option-2-install-keploy-with-lima) instead.

:::

1. **Make sure Docker is installed**
   You’ll need Docker Desktop running on macOS.

2. **Create a Docker bridge network**

   ```bash
   docker network create keploy-network
   ```

3. **Install Keploy**

   ```bash
   curl --silent -O -L https://keploy.io/install.sh && source install.sh
   ```

4. **Verify the installation**

   ```bash
   keploy --version
   ```

✅ If the version shows up, Keploy is installed successfully!

## What's Next?

🎬 Start Capturing Test cases

### ▶️ Record

```bash
keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" \
--container-name "<containerName>" --buildDelay 60
```

### 🧪 Test

```bash
keploy test -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" \
--delay 10 --buildDelay 60
```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on macOS** — natively, or with **Lima** or **Docker**.
