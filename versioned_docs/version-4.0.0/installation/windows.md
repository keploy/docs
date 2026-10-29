---
id: windows-installation
title: Running Keploy on Windows
sidebar_label: Windows Installation
description: "Install Keploy on Windows — natively with no Administrator needed, or with WSL or Docker."
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

Keploy runs **natively on Windows** — you can record and replay an app that runs directly on Windows, with no WSL and no Docker. There is no eBPF on Windows, so Keploy instruments the application it starts and intercepts its network calls in user space. No driver loads and **you do not need Administrator**.

Native Windows support covers apps in **Go, Node.js, Python and Java**, and understands their **HTTP/HTTPS, MySQL and MongoDB** calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay. If your app runs in containers, or depends on one of those other services, use [Docker](#option-3-install-keploy-with-docker). WSL is available too, and is the route on Windows on ARM.

:::note Keploy needs a free account

`keploy record` and `keploy test` sign you in before they run. The first time you use either, Keploy prints a URL and opens your browser at [app.keploy.io](https://app.keploy.io) to sign in; the session is then cached in `%USERPROFILE%\.keploy\tokens.yaml` and reused.

- **No browser available** (a remote shell, a container): run with `--manual-login` and paste an API key from your Keploy dashboard when prompted.
- **CI, or any non-interactive run**: set `KEPLOY_API_KEY` (or pass `--api-key`) and Keploy skips the sign-in prompt entirely.
- **Offline**: the local mock loop — `keploy mock record --local` and `keploy mock replay --local` — is the one pair that runs without signing in. While you are signed out it logs a harmless `failed to validate user role` line and then runs normally. This is the mock loop, not a replacement for `keploy record` and `keploy test` — see [Mock your tests](/docs/running-keploy/mock-your-tests).

A free account is enough to record and replay. Free-tier runs are subject to a usage allowance.

:::

👉 **Choose your preferred method:**

- [Option 1: Run Keploy natively (recommended)](#option-1-run-keploy-natively)

- [Option 2: Install Keploy with WSL](#option-2-install-keploy-with-wsl)

- [Option 3: Install Keploy with Docker](#option-3-install-keploy-with-docker)

## Option 1: Run Keploy natively

1. **Install Keploy.** Run this in PowerShell — a normal one, not as Administrator:

   ```powershell
   $ProgressPreference = 'SilentlyContinue'
   [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
   $dir = "$env:USERPROFILE\.keploy\bin"
   New-Item -ItemType Directory -Force $dir | Out-Null
   Invoke-WebRequest -Uri "https://keploy.io/ent/dl/latest/enterprise_windows_amd64.exe" `
     -OutFile "$dir\keploy.exe"
   Unblock-File "$dir\keploy.exe"
   $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
   if ($userPath -notlike "*$dir*") {
     [Environment]::SetEnvironmentVariable("Path", "$userPath;$dir", "User")
   }
   ```

   Open a new terminal so the updated `Path` takes effect, then check it with `keploy --version`.

   The file is named `enterprise_windows_amd64.exe` for historical reasons — it is the `keploy` CLI, and a free account is all you need. Use this download, not the `keploy_windows_amd64` file on the GitHub releases page: that one cannot run your app natively and stops with _"not supported by this build of Keploy"_.

   **If Windows blocks the file.** The Windows build is not yet code-signed, so if you download `keploy.exe` in a browser, SmartScreen may show "Windows protected your PC" on first run. Right-click the file, choose **Properties** and tick **Unblock** (or run `Unblock-File` on it, as the script above does).

2. **Open a terminal.** An ordinary PowerShell or Terminal window is enough — Keploy does not need to run elevated.

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

Native Windows support is **x86‑64 only**, and the application under test must be 64-bit. On Windows on ARM, use [WSL](#option-2-install-keploy-with-wsl).

:::

:::note

Keploy instruments the application **it starts**, so launch your app through `keploy record -c` or `keploy test -c` rather than starting it yourself and pointing Keploy at a running process.

**HTTPS and Keploy's certificate.** To record your app's HTTPS calls, Keploy adds its certificate authority, named `My Custom CA`, to your Windows user's **Trusted Root** certificate store, and — where your JDK's truststore is writable — to that truststore too. Windows may ask you once to confirm adding it. It stays there after Keploy exits; to remove it, run `certutil -user -delstore Root "My Custom CA"`.

Keploy intercepts your app's TCP connections and resolves hostnames through the application's resolver, so a dependency that no longer exists is still answered from its Mock during a replay. Natively on Windows it understands HTTP/HTTPS, MySQL and MongoDB calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay, so for those use [Docker](#option-3-install-keploy-with-docker). Traffic an application sends over UDP is not recorded.

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
   keploy --version
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

3. **Install Keploy** with [Option 1, step 1](#option-1-run-keploy-natively). The `keploy` CLI runs on Windows and starts your app's container and Keploy's agent in Docker.

4. **Verify the installation**

   ```bash
   keploy --version
   ```

✅ If the version shows up, Keploy is installed successfully!

## What's Next?

🎬 Start Capturing Test cases

### ▶️ Record

```powershell
keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60
```

### 🧪 Test

```powershell
keploy test -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60
```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on Windows** — natively, or with **WSL** or **Docker**.
