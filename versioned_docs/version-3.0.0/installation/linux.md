---
id: linux-installation
title: Installing Keploy on Linux
sidebar_label: Linux Installation
description: A quick guide to installing Keploy on Linux.
tags:
  - installation
keywords:
  - linux
  - installation
---

# Installing Keploy on Linux

Keploy uses eBPF to intercept API calls on network layer and generates test cases and mocks/stubs. Installing Keploy on Linux is super easy it works on **any Linux distribution** with a simple one-click installation 🚀  

## 1. Install Keploy

Run the following command in your terminal:

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
````

## 2. Verify Installation

After installation, check if Keploy is working by running:

```bash
keploy version
```

✅ If you see the version number, Keploy has been installed successfully!

## 🎉 Congratulations!

You’ve successfully installed **Keploy on Linux**.

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/#-capturing-testcases)

Begin recording your API calls and automatically generate test cases with Keploy.
