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

# Installing Keploy

Keploy uses eBPF to intercept API calls at the network layer and generate test cases and mocks/stubs.  
Choose your OS to get started 🚀

<Tabs>
  <TabItem value="linux" label="Linux">
<br />
:::info
Installing Keploy on Linux is super easy it works on **any Linux distribution** with a simple one-command installation
:::

## 1. Install Keploy

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

## 2. Verify Installation

```bash
keploy --version
```

✅ If you see the version number, Keploy has been installed successfully!

## 🎉 Congratulations!

You’ve successfully installed **Keploy on Linux**.

  </TabItem>

  <TabItem value="macos" label="macOS">
  <br />

:::info
Keploy does not natively support macOS. However, you can run it using **Lima** or **Docker**.
:::
👉 **Choose your preferred method:**

- [Option 1: Install Keploy with Lima](#option-1-install-keploy-with-lima)

- [Option 2: Install Keploy with Docker on macOS](#option-2-install-keploy-with-docker-on-macos)

## Option 1: Install Keploy with Lima

1. **Check if Lima is installed**: If you already have Lima, Go to Step 6.

2. **Install Lima**

   ```bash
   brew install lima
   ```

3. **Create a Debian instance** [or any instance of your choice]

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
   keploy --version
   ```

✅ If the version shows up, Keploy is installed successfully!

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/#-capturing-testcases)

Begin recording your API calls and automatically generate test cases with Keploy.

## Option 2: Install Keploy with Docker on macOS

1. **Make sure Docker is installed**: You’ll need Docker Desktop running on macOS.

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

You’ve successfully set up **Keploy on macOS** using either **Lima** or **Docker**.

  </TabItem>

  <TabItem value="windows" label="Windows">
<br />
:::info
Keploy does not natively support Windows. However, you can run it using **WSL** or **Docker**.
:::
👉 **Choose your preferred method:**

- [Option 1: Install Keploy with WSL](#option-1-install-keploy-with-wsl)

- [Option 2: Install Keploy with Docker on WSL](#option-2-install-keploy-with-docker-on-wsl)

## Option 1: Install Keploy with WSL

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
   keploy --version
   ```

   ✅ If you see the version number, Keploy is installed successfully!

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/#-capturing-testcases)

Begin recording your API calls and automatically generate test cases with Keploy.

---

## Option 2: Install Keploy with Docker on WSL

1. **Make sure Docker is installed** : You’ll need **Docker Desktop** running on Windows.

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

You’ve successfully set up **Keploy on Windows** using either **WSL** or **Docker**.

  </TabItem>
</Tabs>
