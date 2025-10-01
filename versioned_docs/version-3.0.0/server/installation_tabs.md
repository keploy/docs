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

Keploy uses eBPF to intercept API calls at the network layer and generate test cases and mocks/stubs.  
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
Keploy does not natively support Windows. However, you can run it using **WSL** or **Docker**.
:::

👉 **Choose your preferred method:**

<Tabs>
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