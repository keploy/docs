---
id: installation
title: Installing Keploy
sidebar_label: Installation
description: Installation guide for Keploy on Linux, macOS, and Windows.
hide_table_of_contents: true
tags:
  - installation
keywords:
  - linux
  - macos
  - windows
  - ebpf
  - lima
  - wsl
  - installation
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StartKeploy from '@site/src/components/StartKeploy';
import StartKeployDocker from '@site/src/components/StartKeployDocker';

# Installing Keploy

This guide walks you through installing the Keploy CLI, which enables you to record API calls and replay them as sandboxes for testing.

## 1. Install Keploy CLI

Keploy captures your app's API calls and turns them into test cases and mocks/stubs. It runs natively on Linux, macOS (Apple Silicon) and Windows (x86-64).
Choose your OS to get started 🚀

<Tabs groupId="install-os">
<TabItem value="linux" label="Linux">
<br />

:::info
Make sure your Linux kernel version is **5.10 or higher**.
:::
👉 **Choose your preferred method:**

<Tabs groupId="linux-method">
<TabItem value="linux-native" label="Native">
 <br />

### 1. Install Keploy CLI

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

### 2. Once done, you should see something like this:

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

</TabItem>

<TabItem value="docker-linux" label="Docker">

## Install Keploy with Docker on Linux

1. **Make sure Docker is installed**: You’ll need Docker installed on Linux

2. **Install Keploy**

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Once done, you should see something like this:**

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

</TabItem>
</Tabs>
</TabItem>

<TabItem value="macos" label="macOS">
<br />

:::info
Keploy runs **natively** on Apple Silicon Macs: no Lima VM, no Docker and no `sudo`. Natively it understands the **HTTP/HTTPS, MySQL and MongoDB** calls of Go, Node.js, Python and Java apps; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay.

- Your app runs in containers, or depends on one of those other services? Use the **Docker** tab.
- On an Intel Mac, use the **Lima** tab. The `keploy` CLI for macOS is Apple Silicon (arm64) only, and the Docker tab uses it too.

:::

👉 **Choose your preferred method:**

<Tabs groupId="macos-method">

<TabItem value="macos-native" label="Native">
<br />

### 1. Install Keploy CLI

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

This installs `keploy` into `~/.keploy/bin` for your user — it never asks for `sudo`. Prefer Homebrew? `brew install keploy/tap/keploy` installs the same CLI.

### 2. Verify the installation

```bash
keploy --version
```

### 3. Good to know

- **Start your app itself, not a launcher.** macOS removes Keploy from anything a launcher such as `npm start`, `mvn` or a wrapper shell script re-spawns. Build first, then record the app directly: `node server.js`, your Go binary (`go build -o app .` then `./app`, rather than `go run`) or your jar. Keploy warns you if it could not attach.
- **Use your own Python and Java.** Apple's `/usr/bin/python3` and `/usr/bin/java` are protected by macOS and record nothing. Use a Homebrew or uv Python, or a virtualenv built on one — with pyenv, its real interpreter (`$(pyenv which python3)`), not the shim — and your JDK's own `java`: `"${JAVA_HOME:-$(/usr/libexec/java_home)}/bin/java" -jar target/<your-app>.jar` (any `java` on your `PATH` other than Apple's `/usr/bin/java`, such as SDKMAN's or Homebrew's, works as it is).
- **HTTPS works out of the box.** Keploy trusts its certificate for your app's process only — nothing is added to your keychain. Apps that pin their own certificates are the exception.

See [Installing Keploy on macOS](/docs/installation/macos-installation/) for more.

</TabItem>

<TabItem value="lima" label="Lima">

## Install Keploy with Lima

Lima runs Keploy inside a Linux VM on your Mac. It is the way to run Keploy on an **Intel Mac**; on Apple Silicon, the **Native** tab needs no VM.

1. **Check if Lima is installed**: If you already have a Lima instance, make it writable (see step 3) and go to Step 5, using its name in place of `debian-12`.

2. **Install Lima**

```bash
brew install lima
```

3. **Create a Debian instance** \[or any instance of your choice]

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

7. **Once done, you should see something like this:**

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

</TabItem>

<TabItem value="docker-mac" label="Docker">

## Install Keploy with Docker on macOS

:::note Apple Silicon only
Your application and Keploy's agent run in containers here, but the `keploy` CLI installed in step 2 — which starts them both — runs on your Mac, and is Apple Silicon (arm64) only. On an Intel Mac use the **Lima** tab instead.
:::

1. **Make sure Docker is installed**: You’ll need Docker Desktop running on macOS.

2. **Install Keploy**

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Create the Docker network** your app's container and Keploy share:

```bash
docker network create keploy-network
```

4. **Verify the installation**

   **Once done, you should see something like this:**

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

</TabItem>
</Tabs>
</TabItem>

<TabItem value="windows" label="Windows">
<br />

:::info
Keploy runs **natively** on Windows (x86-64): no WSL, no Docker and no Administrator. Natively it understands your app's **HTTP/HTTPS, MySQL and MongoDB** calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay.

- Your app runs in containers, or depends on one of those other services? Use the **Docker** tab.
- On Windows on ARM, use the **WSL** tab.

:::

👉 **Choose your preferred method:**

<Tabs groupId="windows-method">
  <TabItem value="windows-native" label="Native">
 <br />

### 1. Install Keploy

Run this in **PowerShell** — a normal one; Keploy does not need Administrator. It downloads `keploy.exe` into `%USERPROFILE%\.keploy\bin` and adds that folder to your user `PATH`:

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

The file is named `enterprise_windows_amd64.exe` for historical reasons — it is the `keploy` CLI, and a free account is all you need.

### 2. Open a new terminal

Close your terminals and open a new one, so it picks up the new `PATH`. If you face issues, make sure `cmd.exe` and `powershell.exe` (their default Windows paths) are on your `PATH`: Keploy starts your app through `cmd.exe`.

### 3. Verify Installation

In the new terminal, run `keploy`. You should see something like this:

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

  </TabItem>

  <TabItem value="wsl" label="WSL">

## Install Keploy with WSL

If you already have WSL, go to Step 2.

Note: Make sure you’re on:

- **Windows 10** (version 2004 or later, build 19041+)
- **Windows 11**

Run the following command in PowerShell (as Administrator):

1. **Enable WSL**

```shell
wsl --install -d <Distribution Name>
```

👉 We recommend using **Ubuntu-22.04** for the best experience.
(You can also choose a different distribution if needed.)

2. **Install Keploy Binary**
   Inside your WSL terminal, run:

```shell
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Verify Installation**

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

</TabItem>

<TabItem value="docker-windows" label="Docker">

## Install Keploy with Docker on Windows

1. **Make sure Docker is installed** : You’ll need **Docker Desktop** running on Windows.

2. **Install Keploy**: follow steps 1–2 of the **Native** tab. The `keploy` CLI runs on Windows and starts your app's container and Keploy's agent in Docker.

3. **Create the Docker network** your app's container and Keploy share:

```powershell
docker network create keploy-network
```

4. **Verify the installation**

In a new terminal, run `keploy`. You should see something like this:

```bash
🐰 Keploy: 2026-05-05T08:23:30.09586779Z        INFO    Starting Keploy {"version": "3.4.1", "buildSource": "unknown", "apiServerURL": "https://api.keploy.io", "inDocker": false}

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy: 3.4.1

Keploy CLI

Usage:
  keploy [command]

Available Commands:
  agent             starts keploy agent for hooking and starting proxy
  cloud             Manage cloud operations
  config            manage keploy configuration file
  console           manage keploy console file
  contract          Manage keploy contracts
  create-branch     Create a new branch on a Keploy app
  create-test-suite Validate a test suite spec from JSON and insert it via api-server
  debug             Debug and reproduce Keploy failures locally
  dedup             manage keploy dedup file
  diff              compare two keploy test runs and print regressions/fixes
  example           Example to record and test via keploy
  export            export Keploy tests as postman collection
  import            import postman collection to Keploy tests
  list-branches     List branches on a Keploy app
  login             Authenticate with your Keploy account
  logout            Sign out of your Keploy account
  mock              Managing mocks
  normalize         Normalize Keploy
  record            record end to end api-calls
  report            report the keploy test results from the API calls
  sanitize          sanitize the keploy testcases to remove the sensitive data
  templatize        templatize the keploy testcases
  test              run the recorded testcases and execute assertions
  test-gen          AI agent-based API test generation — run, coverage, init
  test-suite        Run keploy test suites
  test-suite-format Print the canonical test-suite step schema
  ui                Manage UI flow capture, testing, and reporting
  update            update keploy to latest version
  update-test-suite Validate edits to a test suite and snapshot-replace it via api-server

Flags:
      --config-path string   Path to the local directory where keploy configuration file is stored (default ".")
      --debug                Run in debug mode
      --disable-ansi         Disable ANSI color in logs
  -h, --help                 help for keploy
      --json                 Print output in JSON format
      --manual-login         Use manual login prompt instead of opening browser
  -v, --version              version for keploy

Guided Commands:
  help              Help about any command

Examples:

  Record:
        keploy record -c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --container-name "<containerName>" --buildDelay 60

  Test:
        keploy test --c "docker run -p 8080:8080 --name <containerName> --network keploy-network <applicationImage>" --delay 10 --buildDelay 60

  Config:
        keploy config --generate -p "/path/to/localdir"


Use "keploy [command] --help" for more information about a command.
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

## 2. Log in to Keploy

After installing, authenticate with your Keploy account.
Choose the method that fits your setup:

<Tabs>
<TabItem value="browser" label="Browser Login (Default)">

Keploy opens a browser window to sign you in automatically:

```bash
keploy login
```

```bash
Opening browser for authentication...

If the browser does not open automatically, please visit:
https://app.keploy.io/signin/integration/auth?method=code&code=<YOUR_CODE>

Waiting for authentication...
Logged in successfully!
```

</TabItem>
<TabItem value="manual" label="Manual Login">

If a browser cannot open (for example in a remote terminal):

```bash
keploy login --manual-login
```

When prompted, enter your Keploy API key. To get your API key:

1. Log in to [app.keploy.io](https://app.keploy.io)
2. Click on your **user profile** at the bottom left
3. Go to **Account Settings**
4. In the sidebar, select **API Keys**
5. Click **Generate new token**
6. Fill in the details:
   - **Token name** — give it a recognizable name
   - **Scopes** — select the access level you need:
     - **Read** — read-only access to resources
     - **Write** — read and write access
     - **Admin** — full administrative access
   - **Expiration** — default is 90 days
7. Click **Generate token**
8. **Copy the token immediately** — it will not be shown again

Once your API key is verified, you will see:

```bash
API key verified successfully!
You are on the Keploy <plan> plan.
```

</TabItem>
<TabItem value="apikey" label="API Key (CI/CD)">

For CI/CD environments, authenticate using an API key:

```bash
keploy login --api-key <YOUR_API_KEY>
```

You can also set it as an environment variable:

```bash
export KEPLOY_API_KEY=<YOUR_API_KEY>
```

### How to get your API key

1. Log in to [app.keploy.io](https://app.keploy.io)
2. Click on your **user profile** at the bottom left
3. Go to **Account Settings**
4. In the sidebar, select **API Keys**
5. Click **Generate new token**
6. Fill in the details:
   - **Token name** — give it a recognizable name
   - **Scopes** — select the access level you need:
     - **Read** — read-only access to resources
     - **Write** — read and write access
     - **Admin** — full administrative access
   - **Expiration** — default is 90 days
7. Click **Generate token**
8. **Copy the token immediately** — it will not be shown again

Once your API key is verified, you will see:

```bash
API key verified successfully!
You are on the Keploy <plan> plan.
```

</TabItem>
</Tabs>

Now you can start using Keploy to record API calls and replay them as sandboxes for testing your application.

To explore what's available at each tier, visit [keploy.io/pricing](https://keploy.io/pricing).

## 🎉 Congratulations!

<Tabs groupId="install-os">
<TabItem value="linux" label="Linux">

<Tabs groupId="linux-method">
<TabItem value="linux-native" label="Native">

You’ve successfully installed **Keploy on Linux**.

<StartKeploy />

</TabItem>
<TabItem value="docker-linux" label="Docker">

You’ve successfully set up **Keploy on Linux** using **Docker**.

<StartKeployDocker />

</TabItem>
</Tabs>

</TabItem>

<TabItem value="macos" label="macOS">

<Tabs groupId="macos-method">
<TabItem value="macos-native" label="Native">

You’ve successfully installed **Keploy on macOS**.

<StartKeploy platform="macos" />

</TabItem>
<TabItem value="lima" label="Lima">

You’ve successfully set up **Keploy on macOS** using **Lima**.

<StartKeploy />

</TabItem>
<TabItem value="docker-mac" label="Docker">

You’ve successfully set up **Keploy on macOS** using **Docker**.

<StartKeployDocker />

</TabItem>
</Tabs>

</TabItem>

<TabItem value="windows" label="Windows">

<Tabs groupId="windows-method">
<TabItem value="windows-native" label="Native">

You’ve successfully installed **Keploy on Windows**.

<StartKeploy />

</TabItem>
<TabItem value="wsl" label="WSL">

You’ve successfully set up **Keploy on Windows** using **WSL**.

<StartKeploy />

</TabItem>
<TabItem value="docker-windows" label="Docker">

You’ve successfully set up **Keploy on Windows** using **Docker**.

<StartKeployDocker />

</TabItem>
</Tabs>

</TabItem>
</Tabs>

## Related

- [Keploy Local Installation](/docs/server/install/) — the quick local install.
- [Keploy Go SDK — Install & Merge Test Coverage](/docs/server/sdk-installation/go/) — set up a language SDK.
- [Keploy CLI Commands](/docs/running-keploy/cli-commands/) — commands to run after installing.
