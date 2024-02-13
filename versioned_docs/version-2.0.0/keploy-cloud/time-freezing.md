---
id: time-freezing
title: Time Freezing
sidebar_label: Time Freezing
tags:
  - explanation
  - feature guide
---

## Introduction

Developers often encounter challenges with time-sensitive objects, such as JWT tokens, which can expire over time. This expiration can lead to automated tests failing because the objects or data being tested have changed or expired due to the natural progression of time

To address this issue, Keploy has introduced a feature known as Time Freezing. This feature allows developers to "freeze" time within their tests. By doing so, it ensures that time-sensitive objects remain unchanged, making tests more consistent and reliable.

Time Freezing stops the clock that controls when time-sensitive objects like JWT tokens expire or change. This stops tests from failing because of time changes, making testing smoother and more predictable.

### Usage

For native Linux environments, simply add the `--freezeTime` flag when running your tests, like so:

```bash
keploy test -c "<appCmd>" --freezeTime
```

For Docker-based applications, you'll need to make a few adjustments to your Dockerfile to utilize this feature:

Download the Time Freeze Agent

1. First, download the appropriate time freeze agent for your architecture:

```Dockerfile
# Download the time freeze agent
ADD https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/assets/freeze_time_amd64.so ./freeze_time_amd64.so
```
2. Set the `LD_PRELOAD` Environment Variable

Configure your Docker environment to use the downloaded .so file:

```Dockerfile
# Set LD_PRELOAD environment variable to use freeze_time_amd64.so
ENV LD_PRELOAD=./freeze_time_amd64.so
```

Replace `amd` with `arm` in the filename to match your system's architecture. After building your Docker image with these adjustments, you can run your tests with the time freezing feature enabled by using the `--freezeTime` flag, as demonstrated above.