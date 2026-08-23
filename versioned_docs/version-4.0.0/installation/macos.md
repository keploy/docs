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
  - ebpf
  - lima
---

# Installing Keploy on macOS

Keploy now runs **natively on macOS** — you can record and replay an app that runs directly on your Mac, with no Lima VM and no Docker. Native macOS support intercepts traffic in userspace (there is no eBPF on macOS), so it needs no root and installs nothing system-wide.

Native macOS support covers **Go, Node.js, Python and Java** apps, including their HTTPS traffic. Docker and Lima remain available if you prefer to run your app in a container.

👉 **Choose your preferred method:**

- [Option 1: Run Keploy natively (recommended)](#option-1-run-keploy-natively)

- [Option 2: Install Keploy with Lima](#option-2-install-keploy-with-lima)

- [Option 3: Install Keploy with Docker](#option-3-install-keploy-with-docker)

## Option 1: Run Keploy natively

1. **Install Keploy**

   ```bash
   curl --silent -O -L https://keploy.io/install.sh && source install.sh
   ```

2. **Record your app** — pass the command that starts it, exactly as you run it yourself:

   ```bash
   keploy record -c "<your app command>"
   ```

   For example, a Go binary, a Node server, or a Python app:

   ```bash
   keploy record -c "./myapp"          # Go
   keploy record -c "node server.js"   # Node.js
   keploy record -c "python app.py"    # Python
   ```

3. **Replay the recorded tests**:

   ```bash
   keploy test -c "<your app command>" --delay 10
   ```

:::note Good to know

- **No password prompt.** Native macOS interception needs no privileges, so `keploy record`/`test` do not ask for `sudo`.
- **Run the real executable, not a launcher.** macOS strips the interception from `npm start`, a `make` recipe, or a wrapper shell script (it is dropped when the OS runs a protected system binary). Run the app's actual command — `node server.js` rather than `npm start`, or build first and run the binary. Keploy warns you if it never got loaded.
- **Go HTTPS on macOS.** Go verifies TLS through the macOS Security framework; Keploy makes its interception CA trusted for your app's process only, so recording an HTTPS Go app works without touching your system keychain. Apps that pin a certificate (an explicit root pool) are the exception.

:::

## Option 2: Install Keploy with Lima

1. **Check if Lima is installed**  
   If you already have Lima, Go to Step 6.

2. **Install Lima**

   ```bash
   brew install lima
   ```

3. **Create a Debian instance**

   ```bash
   limactl create template://debian-12
   ```

4. **Start the instance**

   ```bash
   limactl start debian-12
   ```

5. **Enter the Linux shell**

   ```bash
   limactl shell debian-12
   ```

6. **Install Keploy inside Lima**

   ```bash
   curl --silent -O -L https://keploy.io/install.sh && source install.sh
   ```

7. **Verify the installation**

   ```bash
   keploy version
   ```

✅ If the version shows up, Keploy is installed successfully!

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/)

Begin recording your API calls and automatically generate test cases with Keploy.

---

## Option 3: Install Keploy with Docker

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
   keploy version
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

You’ve successfully set up **Keploy on macOS** using either **Lima** or **Docker**.
