---
id: time-freezing
title: Time Freezing
sidebar_label: Time Freezing
tags:
  - explanation
  - feature guide
  - jwt
  - time sensitive fields
keywords:
  - time freezing
  - keploy cloud
  - jwt
  - time sensitive fields
---

## Introduction 📘

### Why Time Freezing? ❄️

While making tests, **time-sensitive objects like JWT tokens are a challenge** as they expire, leading to test failures. This increases the maintenance effort of test suites and also impacts reliability.

### What is Time Freezing? ⏳

With Keploy Cloud users will be able to **freeze/rollback the time in every test run, back to when the test case was recorded.**

This allows developers to ensure time-sensitive objects don’t expire or change, **making tests consistent and more reliable.**

## Usage 🛠️

### Running on Linux or Windows(WSL) 🐧💻

For native Linux, Windows(WSL) environments, simply **add the `--freezeTime` flag** when running your tests, like so:

```bash
keploy test -c "<appCmd>" --freezeTime
```

Voila! Your tests will now run with time freezing enabled.

### Running on Docker 🐳

For Docker-based applications, you'll need to make a few adjustments to your Dockerfile to utilize this feature:

1. First, check your system architecture

```sh
uname -a
```

2. Download the the appropriate time freeze agent for your architecture & set the `LD_PRELOAD` Environment Variable in your Dockerfile

### amd64/x86_64 🖥️

```Dockerfile
# Download the time freeze agent
ADD https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/assets/freeze_time_amd64.so /lib/keploy/freeze_time_amd64.so

# Set LD_PRELOAD environment variable to use freeze_time_amd64.so
ENV LD_PRELOAD=/lib/keploy/freeze_time_amd64.so
```

OR

### arm64/aarch64 📱

```Dockerfile
# Download the time freeze agent
ADD https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/assets/freeze_time_arm64.so /lib/keploy/freeze_time_arm64.so

# Set LD_PRELOAD environment variable to use freeze_time_arm64.so
ENV LD_PRELOAD=/lib/keploy/freeze_time_arm64.so
```

3. Re-Build your Docker image.
4. Now **add the `--freezeTime` flag** when running your tests with Keploy, like so:

```bash
keploy test -c "<appCmd>" --freezeTime
```

Voila! Your tests will now run with time freezing enabled.
