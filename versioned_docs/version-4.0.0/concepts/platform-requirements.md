---
id: platform-requirements
title: Keploy Platform-Specific Requirements
sidebar_label: Platform-Specific Requirements
description: "Platform-specific requirements for Keploy on macOS, Windows, and Linux — Docker, Lima, WSL, and kernel version prerequisites."
tags:
  - linux
  - ebpf
  - installation
  - install
keywords:
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
| <img src="https://th.bing.com/th/id/R.7802b52b7916c00014450891496fe04a?rik=r8GZM4o2Ch1tHQ&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2017%2f03%2fLINUX-LOGO.png&ehk=5m0lBvAd%2bzhvGg%2fu4i3%2f4EEHhF4N0PuzR%2fBmC1lFzfw%3d&risl=&pid=ImgRaw&r=0" width="10" height="10" alt="Linux" /> **Linux** | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" />                                                | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | Linux kernel 5.15 or higher                                                                                                                                                                                                                                                                                                   |

Keploy runs natively on macOS (Apple Silicon / arm64) and Windows (x86‑64) — neither has eBPF, so it intercepts traffic in userspace on both, and neither needs `sudo` or Administrator. Docker, Lima (macOS) and WSL (Windows) remain supported alternatives, and are still the route on Windows/ARM. On an Intel Mac use Lima: the Docker route on macOS still runs the native CLI on the host, so it is Apple Silicon only too.
