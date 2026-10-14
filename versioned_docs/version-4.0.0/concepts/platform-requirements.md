---
id: platform-requirements
title: Keploy Platform-Specific Requirements
sidebar_label: Platform-Specific Requirements
description: "Platform-specific requirements for Keploy on macOS, Windows, and Linux — native support on each, when to use Docker, Podman, Lima or WSL, and kernel version prerequisites."
tags:
  - linux
  - ebpf
  - installation
  - install
keywords:
  - podman
  - ebpf
  - installation
  - install
  - ubuntu
  - linux
  - windows
  - API Test generator
  - Auto Testcase generation
  - installation-guide
  - server-setup
---

## 🛠️ Platform-Specific Requirements for Keploy

Below is a table summarizing the tools needed for both native and Docker installations of Keploy on macOS, Windows, and
Linux:

| Operating System                                                                                                                                                                                                                                                                                              | Without Docker                                                                                                                                                                 | Docker Installation                                                                                                             | Prerequisites                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://www.pngplay.com/wp-content/uploads/3/Apple-Logo-Transparent-Images.png" width="15" height="15" alt="macOS" /> **macOS**                                                                                                                                                                     | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> Native, Apple Silicon (Go, Node, Python, Java) | [Guide](/server/install/)                                                                                                       | **Native: nothing to install** — no Docker, no Lima, no `sudo`. <br/> Only if you choose a container route: Docker Desktop 4.25.2+, or Lima (which is also the route on an Intel Mac).                                                                                                                                        |
| <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg" width="15" height="15" alt="Windows" /> **Windows**                                                                                                                                                                    | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> Native, x86‑64 (Go, Node, Python, Java)        | [Guide](/server/install/)                                                                                                       | **Native: nothing to install** — no WSL, no Docker, no Administrator. <br/> Only if you choose a container route: [WSL](https://learn.microsoft.com/en-us/windows/wsl/install#install-wsl-command) (`wsl --install`, Windows 10 2004+/build 19041+ or Windows 11 — also the route on Windows/ARM), or Docker Desktop 4.25.2+. |
| <img src="https://th.bing.com/th/id/R.7802b52b7916c00014450891496fe04a?rik=r8GZM4o2Ch1tHQ&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2017%2f03%2fLINUX-LOGO.png&ehk=5m0lBvAd%2bzhvGg%2fu4i3%2f4EEHhF4N0PuzR%2fBmC1lFzfw%3d&risl=&pid=ImgRaw&r=0" width="10" height="10" alt="Linux" /> **Linux** | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" />                                                | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | Linux kernel 5.10 or higher                                                                                                                                                                                                                                                                                                   |

Keploy runs natively on macOS (Apple Silicon / arm64) and Windows (x86‑64) — neither has eBPF, so it intercepts traffic in userspace on both, and neither needs `sudo` or Administrator. Natively on macOS and Windows, Keploy understands HTTP/HTTPS, MySQL and MongoDB calls; calls to other services — PostgreSQL, Redis, Kafka, gRPC and the like — are captured only as raw bytes and usually don't replay, so for an app that runs in containers or depends on them, use Docker. Docker, Lima (macOS) and WSL (Windows) remain supported alternatives, and WSL is the route on Windows on ARM. On an Intel Mac use Lima: the Docker route on macOS still runs the native CLI on the host, so it is Apple Silicon only too.

Low-latency recording (`keploy record --low-latency`, or a Kubernetes Sidecar with `low_latency_mode`) and the Kubernetes DaemonSet agent capture with eBPF hooks that arm64 kernels support only from 6.4 (x86-64 kernels from 5.10). On an older arm64 kernel, record without low latency, and use Sidecar mode without `low_latency_mode` in Kubernetes.

## Podman

On Linux, Keploy records and tests applications that run in Podman as well as in Docker. In a `keploy record` or `keploy test` command, use `podman run` (or `podman compose`) where these docs use `docker run` (or `docker compose`). Run every other container command they give, such as creating the network, building the image or starting a database with `docker run -d`, as `sudo podman ...`, so that it is in the rootful Podman Keploy uses. See the **Podman** tab under Linux in [Installing Keploy](/docs/server/installation/) for the commands.

- **Rootful Podman.** Keploy's agent loads eBPF, which a rootless Podman can't grant, so Keploy drives the rootful Podman and runs as root (it re-runs itself with `sudo` when it needs to). Images and containers you created with Podman without `sudo` aren't visible to it: build or pull your app's image with `sudo podman`.
- **Podman's API.** Keploy talks to Podman's Docker-compatible API. If the rootful `podman.socket` is enabled (`sudo systemctl enable --now podman.socket`) it uses that; otherwise it starts Podman's API service for the run and stops it when Keploy exits.
- **Compose.** `podman compose` (Podman 4.7 or later; Keploy is tested with Podman 5) works with Docker Compose v2 or later (`docker-compose`) as its compose provider, on a host that runs systemd: Podman runs healthchecks with systemd timers, and your app's service waits for the healthcheck of Keploy's agent service. podman-compose isn't supported.
- **Local Podman on Linux only.** A Podman set up as a podman-remote client (for example with `CONTAINER_HOST`, `CONTAINER_CONNECTION`, or `remote = true` in containers.conf) runs containers in another Podman service, but Keploy's agent runs in the local rootful Podman, so Keploy refuses it. On macOS and Windows, including Podman machine, Keploy refuses Podman commands: its agent uses Linux's eBPF.
- **Which Keploy.** Podman support is in the Keploy that `curl --silent -O -L https://keploy.io/install.sh && source install.sh` installs (free with an account), from v3.8.60. A `keploy` built from the open-source repository refuses Podman commands and says where to get it.
