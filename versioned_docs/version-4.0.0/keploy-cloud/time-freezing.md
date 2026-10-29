---
id: time-freezing
title: Time Freezing
sidebar_label: Time Freezing
description: "Freeze time during Keploy test runs to handle JWT tokens and time-sensitive data — ensure consistent, reliable test results."
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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Why Time Freezing? ❄️

While making tests, **time-sensitive objects like JWT tokens are a challenge** as they expire, leading to test failures. This increases the maintenance effort of test suites and also impacts reliability.

## What is Time Freezing? ⏳

With Keploy Cloud users will be able to **freeze/rollback the time in every test run, back to when the test case was recorded.**

This allows developers to ensure time-sensitive objects don’t expire or change, **making tests consistent and more reliable.**

## Usage 🛠️

Add the `--freezeTime` flag when you replay your tests. There is nothing to rebuild and no Dockerfile to change: Keploy freezes the clock of every kind of app itself.

- **Go apps:** Keploy patches a copy of your app's compiled Go binary at replay so that it reads the frozen clock, and runs that copy. Your own binary and image are never modified.
- **Other apps (Node, Java, Python, Ruby):** Keploy loads its `LD_PRELOAD` clock library into the app.

```bash
keploy test -c "<appCmd>" --freezeTime
```

Use time freezing only to replay. Always record with your normal build and without `--freezeTime`.

### Running natively on Linux (or WSL) 🐧

When Keploy runs natively on Linux — including inside WSL on Windows — **add the `--freezeTime` flag** when running your tests:

```bash
keploy test -c "<appCmd>" --freezeTime
```

This covers Go apps too: Keploy patches the Go binary that `<appCmd>` starts, including one started after `NAME=value`, `env` or `sudo -E`, and builds and patches the program of a `go run` command.

Start the Go binary itself in `<appCmd>`. When the command starts a shell, `make` or a shell script (`sh -c ./server`, `./start.sh`, `make run`), Keploy loads its clock library into that program and doesn't look at the programs it starts, so a Go program among them runs on the real clock. The replay log warns about it: `Time freezing: keploy's clock shim loaded in sh, which the app's command runs; keploy did not look at the programs it starts.`

### Running natively on macOS or Windows 🍎💻

Time freezing isn't supported when Keploy runs natively on macOS or Windows (outside WSL): even with `--freezeTime`, the application runs on the real clock.

To freeze time on these platforms, run your application with Docker as described in [Running on Docker](#running-on-docker-) below, or run Keploy on Linux: in [WSL](/docs/installation/windows-installation/#option-2-install-keploy-with-wsl) on Windows, or in a [Lima](/docs/installation/macos-installation/#option-2-install-keploy-with-lima) VM on macOS.

### Running on Docker 🐳

For apps that run with `docker run` or `docker compose`, also **add the `--freezeTime` flag**, with no change to your Dockerfile:

```bash
keploy test -c "docker compose up" --container-name "<containerName>" --freezeTime
```

### For Golang(Go) Applications -

Keploy patches the app's Go binary at replay, with no rebuild: it reads the binary from the image, patches a copy of it on the host, and mounts the copy over the original in the container. When the image's entrypoint is a script, Keploy finds the Go binaries in the image and patches them.

- Keploy pulls the image when it isn't on the Docker daemon yet, with the Docker CLI's credentials, so a private image works too.
- Keploy builds a compose service that has `build:` the way `docker compose up` would, when its image isn't built yet, and then patches it. It does so when `<appCmd>` runs `docker compose up` itself, not through a script or `make`. Keploy patches the image it finds before `up` starts, so don't have `up` build or pull the app's image again: no `--build`, `pull_policy: build` or `pull_policy: always`.
- Run the app's binary in the image, not `go run`: Keploy doesn't patch the Go toolchain, so a program it builds as it runs reads the real clock. A compose service that mounts its own file over the Go binary runs that file, unpatched.
- Use a local Docker daemon that shares its filesystem with Keploy's host. A remote daemon, or one that runs in a VM without the host's temporary directory shared (Docker Desktop without file sharing, colima, lima, podman machine), can't mount the patched copy.
- Build the app with Go 1.20 or later, for linux/amd64 or linux/arm64.

### For Node/Java/Python Applications -

Keploy adds its `LD_PRELOAD` clock library to the container. You don't need to add it to your Dockerfile.

### Check that time freezing applied

When Keploy doesn't patch a Go binary, it logs one `time-freeze[go]` line that names the binary, says why, and says what to do:

```text
time-freeze[go]: <binary>: not patched (<reason>); runs on the real clock. <what to do>
```

When Keploy can't stage the freeze of a Docker app at all, for example on a remote daemon, the line reads `time-freeze[go]: requested but NOT applied — <reason>`. Before the first test set, the replay checks the clock, and `Time freezing could not be verified before replaying tests` repeats the binary and the reason. Fix the reason where you can, and replay again.

### Fallback: a replay-only faketime build

Use this only when the reason can't be fixed: a remote or VM-backed Docker daemon, a binary that checks its own bytes or is signed, or a linux/amd64 or linux/arm64 Go binary built with Go 1.20 or later that Keploy says it can't patch. It's no fix for a binary built with a Go older than 1.20 (build it with a newer Go) or for another architecture. Keploy runs an app built with its `faketime` runtime as it is and never patches it.

Build a separate binary or image for replay only. Never record with it, and keep your production build without the tag.

#### amd64/x86_64 🖥️

```Dockerfile
# Download the time freeze agent
ADD https://keployenterprise.blob.core.windows.net/releases/latest/assets/go_freeze_time_amd64 /lib/keploy/go_freeze_time_amd64

# set suitable permissions
RUN chmod +x /lib/keploy/go_freeze_time_amd64

# run the binary
RUN /lib/keploy/go_freeze_time_amd64

# build your binary with fake time (for replay only)
RUN go build -tags=faketime <your_main_file>
```

OR

#### arm64/aarch64 📱

```Dockerfile
# Download the time freeze agent
ADD https://keployenterprise.blob.core.windows.net/releases/latest/assets/go_freeze_time_arm64 /lib/keploy/go_freeze_time_arm64

# set suitable permissions
RUN chmod +x /lib/keploy/go_freeze_time_arm64

# run the binary
RUN /lib/keploy/go_freeze_time_arm64

# build your binary with fake time (for replay only)
RUN go build -tags=faketime <your_main_file>
```

To build natively instead, download the same `go_freeze_time_<arch>` helper, run it once (it adds the `faketime` runtime to your Go toolchain), and build with `go build -tags=faketime -o <replay-binary> <your_main_package>` into a separate output path. Then replay that build with `--freezeTime`.

## Related

- [Dynamic Deduplication](/docs/keploy-cloud/deduplication/) — related test-stability feature.
- [Static Deduplication](/docs/keploy-cloud/static-deduplication/) — dedupe recorded tests.
- [Mock Registry](/docs/keploy-cloud/mock-registry/) — manage the mocks time-freezing relies on.
