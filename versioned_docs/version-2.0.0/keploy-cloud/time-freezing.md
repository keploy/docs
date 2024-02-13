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

1. First, check your system architecture
```sh
uname -a
```

2. Download the the appropriate time freeze agent for your architecture & set the `LD_PRELOAD` Environment Variable in your Dockerfile

### amd64/x86_64

```Dockerfile
# Download the time freeze agent
ADD https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/assets/freeze_time_amd64.so /lib/keploy/freeze_time_amd64.so

# Set LD_PRELOAD environment variable to use freeze_time_amd64.so
ENV LD_PRELOAD=/lib/keploy/freeze_time_amd64.so
```

### arm64/aarch64

```Dockerfile
# Download the time freeze agent
ADD https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/assets/freeze_time_arm64.so /lib/keploy/freeze_time_arm64.so

# Set LD_PRELOAD environment variable to use freeze_time_arm64.so
ENV LD_PRELOAD=/lib/keploy/freeze_time_arm64.so
```

