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
```

:::note Keploy Community needs a free account

`keploy record` and `keploy test` sign you in before they run. The first time you use either, Keploy prints a URL and opens your browser at [app.keploy.io](https://app.keploy.io) to sign in; the session is then cached in `~/.keploy/tokens.yaml` and reused.

- **No browser available** (a remote shell, a container): run with `--manual-login` and paste an API key from your Keploy dashboard when prompted.
- **CI, or any non-interactive run**: set `KEPLOY_API_KEY` (or pass `--api-key`) and Keploy skips the sign-in prompt entirely.
- **Offline**: the local mock loop — `keploy mock record --local` and `keploy mock replay --local` — is the one pair that runs without signing in. While you are signed out it logs a harmless `failed to validate user role` line and then runs normally. This is the mock loop, not a replacement for `keploy record` and `keploy test` — see [Mock your tests](/docs/running-keploy/mock-your-tests).

A free account is enough to record and replay. Free-tier runs are subject to a usage allowance.

:::

## 2. Verify Installation

After installation, check if Keploy is working by running:

```bash
keploy --version
```

✅ If you see the version number, Keploy has been installed successfully!

## 🎉 Congratulations!

You’ve successfully installed **Keploy on Linux**.

## What's Next?

### 🎬 [Start Capturing Test Cases](/docs/server/installation/)

Begin recording your API calls and automatically generate test cases with Keploy.
