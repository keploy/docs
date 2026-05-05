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
  - limas
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

Keploy uses eBPF to intercept API calls at the network layer and generate test cases and mocks/stubs.  
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
Keploy does not natively support macOS. However, you can run it using **Lima** or **Docker**. 
:::

👉 **Choose your preferred method:**

<Tabs groupId="macos-method">

<TabItem value="lima" label="Lima">

## Install Keploy with Lima

1. **Check if Lima is installed**: If you already have Lima, go to Step 6.

2. **Install Lima**

```bash
brew install lima
```

3. **Create a Debian instance** \[or any instance of your choice]

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

1. **Make sure Docker is installed**: You’ll need Docker Desktop running on macOS.

2. **Install Keploy**

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Verify the installation**

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
You can run Keploy **Natively** or using **WSL** or **Docker**. If you want to run Keploy natively, make sure to do it as an administrator.
:::

👉 **Choose your preferred method:**

<Tabs groupId="windows-method">
  <TabItem value="windows-native" label="Native">
 <br />

`Note: Native Windows support is available only for AMD. For ARM-based systems, please use WSL or Docker.`

### 1. Create a Directory

Use this command to create a directory for Keploy:

```powershell
New-Item -ItemType Directory -Force -Path "$env:APPDATA\Keploy\bin"
```

### 2. Install Keploy

Run this command to install the Keploy exe:

```powershell
Invoke-WebRequest -Uri "https://github.com/keploy/keploy/releases/latest/download/keploy_windows_amd64.exe" -OutFile "$env:APPDATA\Keploy\bin\keploy.exe"
```

### 3. Set Environment Variable

Add the directory containing the Keploy binary to your system user’s `PATH` environment variable to make the `keploy` command available globally.

```text
C:\Users\"Your Username"\AppData\Roaming\Keploy\bin
```

### 4. Finalize Setup

1. Checks: Close all the terminals.
2. Run as Admin: Open your terminal as **Administrator**.
3. Troubleshooting: If you face issues, ensure `cmd.exe` and `powershell.exe` (default paths in Windows) are in your system environment variables.

### 5. Verify Installation

Once done, you should see something like this:

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

2. **Install Keploy**

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Verify the installation**

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
You are on the Keploy Community plan.
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
You are on the Keploy Community plan.
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
