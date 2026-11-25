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

Native Windows support covers apps in **Go, Node.js, Python and Java** on **Windows 10 or 11 on an x64 PC**. From Keploy 3.9.19 it understands the same calls as on macOS: **HTTP and HTTPS (HTTP/2 included), gRPC, PostgreSQL, MySQL, MongoDB, Amazon DynamoDB, Aerospike, Couchbase, Memcached, Apache HBase and Apache ZooKeeper**. Calls to Redis, Kafka, Apache Pulsar and other services are captured only as raw bytes and usually don't replay, and Amazon SQS calls are recorded as plain HTTPS calls, without the SQS matching Keploy has on Linux. If your app runs in containers, or depends on one of those other services, use [Docker](#option-3-install-keploy-with-docker). WSL is available too, and is the route on Windows on Arm.

:::note Keploy needs a free account

`keploy record` and `keploy test` sign you in before they run. The first time you use either, Keploy prints a URL and opens your browser at [app.keploy.io](https://app.keploy.io) to sign in; the session is then cached in `%USERPROFILE%\.keploy\tokens.yaml` and reused.

- **No browser available** (a remote shell, a container): run with `--manual-login` and paste an API key from your Keploy dashboard when prompted.
- **CI, or any non-interactive run**: set `KEPLOY_API_KEY` (or pass `--api-key`) and Keploy skips the sign-in prompt entirely.
- **Offline**: the local mock loop — `keploy mock record --local` and `keploy mock replay --local` — is the one pair that runs without signing in. While you are signed out it logs a harmless `failed to validate user role` line and then runs normally. This is the mock loop, not a replacement for `keploy record` and `keploy test` — see [Mock your tests](/docs/universal-mocker/mock-your-tests/).

A free account is enough to record and replay. Free-tier runs are subject to a usage allowance.

:::

👉 **Choose your preferred method:**

- [Option 1: Run Keploy natively (recommended)](#option-1-run-keploy-natively)

- [Option 2: Install Keploy with WSL](#option-2-install-keploy-with-wsl)

- [Option 3: Install Keploy with Docker](#option-3-install-keploy-with-docker)

## Option 1: Run Keploy natively

:::note The VS Code extension

From version 3.1.7, the [Keploy VS Code extension](/docs/running-keploy/utg-vscode-extension/#run-it-on-windows) sets Keploy up on Windows. It installs the CLI by itself into `%LOCALAPPDATA%\.keploy\bin`, the folder the steps below use, and keeps it at Keploy CLI 3.9.19 or later, so in VS Code's terminals you don't need step 1. To run `keploy` in other terminals, still add the folder to your user `Path`: run step 1's script, or only its `$dir = ...` line and the last four lines. If you installed Keploy before, the cleanup under step 1 still applies: an older `keploy.exe` earlier on your `Path` wins over the extension's in VS Code's terminals too. If you used version 3.0 of the extension, 3.1 removes the CLI copy 3.0 put in `%APPDATA%\.keploy\bin`; a `keploy.exe` you put there yourself stays.

:::

1. **Install Keploy.** Run this in PowerShell — a normal one, not as Administrator. It downloads `keploy.exe` into `%LOCALAPPDATA%\.keploy\bin` and adds that folder to your user `Path`:

   ```powershell
   $ProgressPreference = 'SilentlyContinue'
   [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
   $dir = "$env:LOCALAPPDATA\.keploy\bin"
   New-Item -ItemType Directory -Force $dir | Out-Null
   Invoke-WebRequest -Uri "https://keploy.io/ent/dl/latest/enterprise_windows_amd64.exe" `
     -OutFile "$dir\keploy.exe"
   Unblock-File "$dir\keploy.exe"
   $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
   if ($userPath -notlike "*$dir*") {
     [Environment]::SetEnvironmentVariable("Path", "$userPath;$dir", "User")
   }
   ```

   Open a new terminal so the updated `Path` takes effect, then check it with `keploy --version`. Restart VS Code as well if you use it: its terminals keep the `Path` VS Code started with. To update Keploy later, run the same steps again.

   The file is named `enterprise_windows_amd64.exe` for historical reasons — it is the `keploy` CLI, and a free account is all you need. Use this download, not the `keploy_windows_amd64` file on the GitHub releases page: that one cannot run your app natively and stops with _"not supported by this build of Keploy"_.

   **If Windows blocks the file.** `keploy.exe` is code-signed by Keploy Inc. If you download it in a browser instead and SmartScreen shows "Windows protected your PC" on first run, right-click the file, choose **Properties**, check that the **Digital Signatures** tab lists **Keploy Inc**, and tick **Unblock** on the **General** tab (or run `Unblock-File` on it, as the script above does).

   **If you installed Keploy before.** Earlier versions of these steps put `keploy.exe` in `%USERPROFILE%\.keploy\bin`. Remove that copy and its `Path` entry, so that every terminal runs the CLI in `%LOCALAPPDATA%\.keploy\bin`:

   ```powershell
   $old = "$env:USERPROFILE\.keploy\bin"
   Remove-Item "$old\keploy.exe" -ErrorAction SilentlyContinue
   $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
   $kept = ($userPath -split ';' | Where-Object { $_ -and $_.TrimEnd('\') -ne $old }) -join ';'
   [Environment]::SetEnvironmentVariable("Path", $kept, "User")
   ```

   This removes only the old `keploy.exe`. Leave the rest of `%USERPROFILE%\.keploy` in place: it holds your sign-in. In a new terminal, `(Get-Command keploy).Source` should then print a path ending in `AppData\Local\.keploy\bin\keploy.exe`.

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

Native Windows support is **x86‑64 only**, on Windows 10 or 11, and the application under test must be 64-bit. On Windows on Arm, use [WSL](#option-2-install-keploy-with-wsl).

:::

:::note

Keploy instruments the application **it starts**, so launch your app through `keploy record -c` or `keploy test -c` rather than starting it yourself and pointing Keploy at a running process.

**HTTPS and Keploy's certificate.** To record your app's HTTPS calls, Keploy adds its certificate authority, named `Keploy MITM CA` followed by an ID, to your Windows user's **Trusted Root** certificate store, and — where your JDK's truststore is writable — to that truststore too. The first time, Windows shows a **Security Warning** asking whether to install it: select **Yes**. This needs no Administrator. If you select **No**, the run stops: Keploy's certificate setup fails, and Keploy prints the step that trusts the certificate; start the record or replay again and select **Yes**. Only a run as Administrator whose add to your user's store fails (there is no desktop to show the prompt, or you selected **No**) puts the certificate in the machine's Trusted Root store instead, which every user of the PC trusts. Keploy keeps the certificate authority in `%LOCALAPPDATA%\Keploy\ca`, so later runs reuse it with no prompt. It stays in the store after Keploy exits; to remove it, open **Manage user certificates** (`certmgr.msc`) and delete the **Keploy MITM CA** entry under **Trusted Root Certification Authorities** (for one in the machine's store, use **Manage computer certificates**, `certlm.msc`, as Administrator). Earlier versions of Keploy added a certificate authority named `My Custom CA`; remove it with `certutil -user -delstore Root "My Custom CA"`.

Keploy intercepts your app's TCP connections and its DNS lookups, so a dependency that no longer exists is still answered from its Mock during a replay. A name in your Windows `hosts` file is answered by Windows itself; every other lookup goes through Keploy, as on Linux. Calls to services Keploy doesn't understand natively on Windows, such as Redis or Kafka, are captured only as raw bytes and usually don't replay, so for those use [Docker](#option-3-install-keploy-with-docker). Apart from DNS lookups, traffic an application sends over UDP is not recorded.

:::

### Troubleshoot Keploy on Windows

- **Microsoft Defender stops or quarantines `keploy.exe`.** `keploy.exe` is code-signed by Keploy Inc from Keploy 3.8.128. Defender flagged the unsigned 3.8.127 build as `Trojan:Win32/Gracing.I`, a false positive. Check the copy you have with `(Get-AuthenticodeSignature "$env:LOCALAPPDATA\.keploy\bin\keploy.exe") | Format-List Status, SignerCertificate`: its status should be `Valid`, and its signer certificate's subject should start with `CN=Keploy Inc,`. If it isn't, delete that `keploy.exe` and install the latest release with [step 1](#option-1-run-keploy-natively), or run **Keploy: Install or update the CLI** in VS Code. Don't add a Defender exclusion: a copy that fails this check isn't Keploy's signed build. If Defender still flags a copy that passes it, report it to Keploy and submit the file to Microsoft as a false positive.
- **SmartScreen blocks `keploy.exe`.** Select **More info** and check that the publisher is **Keploy Inc**. If it is, select **Run anyway**. If it says **Unknown publisher**, the file isn't Keploy's signed build: delete it and install again with [step 1](#option-1-run-keploy-natively).
- **Windows asks whether to install a certificate from "Keploy MITM CA".** Select **Yes**: Keploy needs it to record and replay HTTPS calls. It goes into your Windows user's Trusted Root store. Only a run as Administrator whose add to that store fails puts it in the machine's store instead.
- **No desktop to answer that prompt.** A CI runner's service, an OpenSSH session or a scheduled task can't show it. Keploy then gives its certificate to Node, Python, OpenSSL and curl, Cargo and Java apps through the variables each one reads. Go and .NET apps read only the Windows store: trust Keploy's certificate once from a session signed in to the desktop as the same Windows user the CI runner or SSH session runs as, by running Keploy there and selecting **Yes**, or by running the `certutil -user -addstore ROOT` command Keploy prints, with the certificate's path. Later runs as that user, with a desktop or not, reuse it. A certificate an administrator or a group policy put in the machine's Trusted Root store counts too, and a run with no desktop as Administrator or as LocalSystem (an account in the Administrators group) adds it to the machine's store itself. A runner that runs as a built-in service account such as NETWORK SERVICE can do neither: have an administrator add the certificate Keploy prints (from that account's `%LOCALAPPDATA%\Keploy\ca`) to the machine's Trusted Root store, or run the runner as a normal user who trusts it once from a desktop.
- **Updating `keploy.exe` fails.** Windows doesn't let a running `keploy.exe` be replaced. End every Keploy run, then update again. In VS Code, the extension says _keploy.exe is running_ or _keploy.exe is held open by another program_ (such as an antivirus scan or a backup): select **Retry** once it has ended.
- **An Arm PC.** Keploy's Windows capture runs only on x64, so on Windows on Arm use [WSL](#option-2-install-keploy-with-wsl).

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
   source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
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
