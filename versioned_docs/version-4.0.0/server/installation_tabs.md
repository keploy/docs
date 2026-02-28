---
id: installation
title: Installing Keploy
sidebar_label: Installation
description: Installation guide for Keploy on Linux, macOS, and Windows.
hide_table_of_contents: false
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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />
<ProductTier tiers="Open Source" offerings="Self-Hosted, Dedicated" />

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import StartKeploy from '@site/src/components/StartKeploy';
import StartKeployDocker from '@site/src/components/StartKeployDocker';

# Install Keploy

Keploy captures real API calls and database interactions, then helps you replay them as tests without rebuilding your full production environment.

## Choose your setup path

:::info
#### Recommended: Keploy Enterprise CLI

Use this if you want the **fastest setup**, **browser-based sign-in**, and access to Keploy's Enterprise capabilities.
:::

## Keploy Enterprise CLI

<details>
<summary><strong>Keploy Enterprise CLI</strong></summary>

This is the preferred way to install and use Keploy.

With this setup:
* you install the recommended Keploy binary
* you start using Keploy immediately
* if authentication is required, Keploy opens a browser and signs you in automatically
* once the flow is complete, Keploy is ready to use for record and test

### How authentication works

When you run a command like:
* `keploy record`
* `keploy test`

and you are not already signed in, Keploy will:
1. open a browser window
2. ask you to sign in
3. return you to the CLI automatically
</details>

## Install the recommended Keploy CLI

Follow the step below to install the Keploy Enterprise Agent:

```bash
curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
```

## Record Your First Test

Once Keploy is installed, run your application through Keploy.
This captures your real API calls and database interactions.

```bash 
keploy record -c "YOUR_START_COMMAND"
```

Example:
`keploy record -c "npm start"`
or
`keploy record -c "go run main.go"`

If you are not authenticated yet, the recommended CLI will automatically open the browser login flow and continue after sign-in.


## Replay and Verify

After recording is complete, stop your app and run:

```bash
keploy test -c "YOUR_START_COMMAND" --delay 10
```

Keploy will replay the captured traffic so you can run your tests without depending on the original database or external services.

## Automatic Cloud / Sandbox Behavior

Cloud backup and sandbox sync will be documented here very soon, once the rollout is live.

---

## Why this is the recommended path?
<details>
<summary><strong>Why this is recommended path?</strong></summary>
Use the recommended Keploy Enterprise CLI if you want:
* the easiest install experience
* built-in browser-based authentication
* less manual setup
* access to Enterprise Keploy capabilities
* a smoother path for integrations and team workflows
</details>

## Which path should I choose?

:::info
The Open Source version is best for **HTTP / REST** protocol.

If you need support for **gRPC, Redis, GraphQL, webhooks, and advanced integration workflows,** use the **Enterprise** version.

For broader framework and protocol support, we recommend installing Keploy Enterprise.
:::

### Feature Comparison

| Feature | Open Source | Enterprise |
|----------|-------------|------------|
| **Dependencies** |  |  |
| HTTP | Yes | Yes |
| MySQL | Yes | Yes |
| gRPC Outgoing | No | Yes |
| Mongo | No | Yes |
| Postgres | No | Yes |
| Redis | No | Yes |
| SQS | No | Yes |
| Kafka | No | Yes |
| HTTP2 | No | Yes |
| **Incoming Tests** |  |  |
| HTTP | Yes | Yes |
| gRPC Incoming | Yes | Yes |
| **Extra Features** |  |  |
| Mock Upload | No | Yes |
| Time Freezing | No | Yes |
| Deduplication (Static + Codepath) | No | Yes |
| Sandboxing for Existing E2E / Integration Tests | No | Yes | 

## Setup: Open-source 

Choose your OS to get started 🚀

<Tabs>
<TabItem value="linux" label="Linux">
<br />

:::info
Make sure your Linux kernel version is **5.10 or higher**.
:::
👉 **Choose your preferred method:**

<Tabs>
<TabItem value="linux-native" label="Native">
 <br />

### 1. Install Keploy

    ```bash
    curl --silent -O -L https://keploy.io/install.sh && source install.sh
    ```

    ### 2. Once done, You should see something like this:

    ```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

    Keploy CLI

    Available Commands:
      example           Example to record and test via keploy
      config --generate generate the keploy configuration file
      record            record the keploy testcases from the API calls
      test              run the recorded testcases and execute assertions
      update            Update Keploy

    Flags:
          --debug     Run in debug mode
      -h, --help      help for keploy
      -v, --version   version for keploy

    Use "keploy [command] --help" for more information about a command.
    ```

## 🎉 Congratulations!

You’ve successfully installed **Keploy on Linux**.

<StartKeploy />
</TabItem>

<TabItem value="docker-linux" label="Docker">

## Install Keploy with Docker on Linux

1. **Make sure Docker is installed**: You’ll need Docker installed on Linux

2. **Install Keploy**

```bash
   curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Once done, You should see something like this:**

```bash
    ▓██▓▄
 ▓▓▓▓██▓█▓▄
  ████████▓▒
       ▀▓▓███▄      ▄▄   ▄               ▌
      ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
    ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
   ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
    ▓▌                           ▐█▌                   █▌
     ▓

 Keploy CLI

 Available Commands:
   example           Example to record and test via keploy
   config --generate generate the keploy configuration file
   record            record the keploy testcases from the API calls
   test              run the recorded testcases and execute assertions
   update            Update Keploy

 Flags:
       --debug     Run in debug mode
   -h, --help      help for keploy
   -v, --version   version for keploy

 Use "keploy [command] --help" for more information about a command.
```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on Linux** using **Docker**.

<StartKeployDocker />
</TabItem>
</Tabs>
</TabItem>

<TabItem value="macos" label="macOS">
<br />
:::info 
Keploy does not natively support macOS. However, you can run it using **Lima** or **Docker**. 
:::

👉 **Choose your preferred method:**

<Tabs>

<TabItem value="lima" label="Lima">

## Install Keploy with Lima

1. **Check if Lima is installed**: If you already have Lima, Go to Step 6.

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

7. **Once done, You should see something like this:**

```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example           Example to record and test via keploy
  config --generate generate the keploy configuration file
  record            record the keploy testcases from the API calls
  test              run the recorded testcases and execute assertions
  update            Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on macOS** using **Lima**.

<StartKeploy />

</TabItem>

<TabItem value="docker-mac" label="Docker">

## Install Keploy with Docker on macOS

1. **Make sure Docker is installed**: You’ll need Docker Desktop running on macOS.

2. **Install Keploy**

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Verify the installation**

   **Once done, You should see something like this:**

```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example           Example to record and test via keploy
  config --generate generate the keploy configuration file
  record            record the keploy testcases from the API calls
  test              run the recorded testcases and execute assertions
  update            Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on macOS** using **Docker**.

 <StartKeployDocker />

</TabItem>
</Tabs>
</TabItem>

<TabItem value="windows" label="Windows">
<br />

:::info
You can run Keploy **Natively** or using **WSL** or **Docker**. If you want to run Keploy natively, make sure to do it as an administrator.
:::

👉 **Choose your preferred method:**

<Tabs>
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

    Once done, You should see something like this:

    ```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

    Keploy CLI

    Available Commands:
      example           Example to record and test via keploy
      config --generate generate the keploy configuration file
      record            record the keploy testcases from the API calls
      test              run the recorded testcases and execute assertions
      update            Update Keploy

    Flags:
          --debug     Run in debug mode
      -h, --help      help for keploy
      -v, --version   version for keploy

    Use "keploy [command] --help" for more information about a command.
    ```
## 🎉 Congratulations!

You’ve successfully installed **Keploy on Windows**.

<StartKeploy />
  </TabItem>

  <TabItem value="wsl" label="WSL">

## Install Keploy with WSL

If you already have WSL, Go to Step 2.

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
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example           Example to record and test via keploy
  config --generate generate the keploy configuration file
  record            record the keploy testcases from the API calls
  test              run the recorded testcases and execute assertions
  update            Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on Windows** using **WSL**.

<StartKeploy />

</TabItem>

<TabItem value="docker-windows" label="Docker">

## Install Keploy with Docker on Windows

1. **Make sure Docker is installed** : You’ll need **Docker Desktop** running on Windows.

2. **Install Keploy**

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

3. **Verify the installation**

**Once done, You should see something like this:**

```bash

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example           Example to record and test via keploy
  config --generate generate the keploy configuration file
  record            record the keploy testcases from the API calls
  test              run the recorded testcases and execute assertions
  update            Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.

```

## 🎉 Congratulations!

You’ve successfully set up **Keploy on Windows** using **Docker**.

<StartKeployDocker />

</TabItem>
</Tabs>
</TabItem>
</Tabs>
