---
id: windows-installation
title: Running Keploy on Windows
sidebar_label: Windows Installation
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

Keploy uses eBPF to intercept API calls on network layer and generates test cases and mocks/stubs. Keploy does not natively support Windows. However, you can still run it using **Wsl** or **Docker**.

👉 **Choose your preferred method:**

- [Option 1: Install Keploy with WSL](#option-1-install-keploy-with-wsl)

- [Option 2: Install Keploy with Docker](#option-2-install-keploy-with-docker)

## Option 1: Install Keploy with WSL

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

### 🎬 [Start Capturing Test Cases](/docs/server/installation/#-capturing-testcases)

Begin recording your API calls and automatically generate test cases with Keploy.

---

## Option 2: Install Keploy with Docker 

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
