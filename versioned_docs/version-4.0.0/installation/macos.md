---
id: macos-installation
title: Installing Keploy on macOS
sidebar_label: macOS Installation
description: A guide to installing Keploy on macOS using Lima or Docker.
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

Keploy uses eBPF to intercept API calls on network layer and generates test cases and mocks/stubs. Keploy does not natively support macOS. However, you can still run it using **Lima** or **Docker**.

👉 **Choose your preferred method:**

- [Option 1: Install Keploy with Lima](#option-1-install-keploy-with-lima)

- [Option 2: Install Keploy with Docker](#option-2-install-keploy-with-docker)

## Option 1: Install Keploy with Lima

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

## Option 2: Install Keploy with Docker

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
