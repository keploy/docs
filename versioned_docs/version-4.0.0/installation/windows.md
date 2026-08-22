---
id: windows-installation
title: Running Keploy on Windows
sidebar_label: Windows Installation
description: "Install Keploy on Windows — natively with the WinDivert driver, or with WSL or Docker."
tags:
  - windows
  - ebpf
  - windows installation
  - installation
  - installation-guide
keywords:
  - windows
  - ebpf
  - installation
---

# Installing Keploy on Windows

Keploy runs **natively on Windows** — you can record and replay an app that runs directly on Windows, with no WSL and no Docker. On Windows it intercepts traffic with the WinDivert network driver (there is no eBPF on Windows), which needs Administrator privileges.

Native Windows support covers apps in **Go, Node.js, Python and Java**. WSL and Docker remain available if you prefer them.

👉 **Choose your preferred method:**

- [Option 1: Run Keploy natively (recommended)](#option-1-run-keploy-natively)

- [Option 2: Install Keploy with WSL](#option-2-install-keploy-with-wsl)

- [Option 3: Install Keploy with Docker](#option-3-install-keploy-with-docker)

## Option 1: Run Keploy natively

1. **Install Keploy** — download the Windows build from the [releases page](https://github.com/keploy/keploy/releases) (or your Keploy distribution) and put `keploy.exe` on your `PATH`.

2. **Open an Administrator terminal.** WinDivert loads a network driver, so `keploy` must run elevated (right-click PowerShell or Terminal → _Run as administrator_).

3. **Record your app** — pass the command that starts it:

   ```powershell
   keploy record -c "<your app command>"
   ```

   For example:

   ```powershell
   keploy record -c ".\myapp.exe"        # Go
   keploy record -c "node server.js"     # Node.js
   keploy record -c "python app.py"      # Python
   ```

4. **Replay the recorded tests**:

   ```powershell
   keploy test -c "<your app command>" --delay 10
   ```

:::note

Native Windows support is **x86‑64 only**. On Windows/ARM, use WSL or Docker.

:::



## Option 2: Install Keploy with WSL

If you already have WSL, Go to Step 2.

1. **Enable WSL**

   Make sure you’re on:
   - **Windows 10** (version 2004 or later, build 19041+)
   - **Windows 11**

   Run the following command in PowerShell (as Administrator):

   ```shell
   wsl --install -d <Distribution Name>
   ```

👉 We recommend using **Ubuntu-22.04** for the best experience.
(You can choose a different distribution if needed.)

2. **Install Keploy Binary**
   Inside your WSL terminal, run:

   ```shell
   curl --silent -O -L https://keploy.io/install.sh && source install.sh
   ```

3. **Verify Installation**

   ```bash
   keploy version
   ```

   ✅ If you see the version number, Keploy is installed successfully!

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/)

Begin recording your API calls and automatically generate test cases with Keploy.

---

## Option 3: Install Keploy with Docker

1. **Make sure Docker is installed**
   You’ll need **Docker Desktop** running on Windows.

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

You’ve successfully set up **Keploy on Windows** using either **WSL** or **Docker**.
