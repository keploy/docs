---
id: installation
title: Keploy Installation
sidebar_label: Installation
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

Below is a table summarizing the tools needed for both native and Docker installations of Keploy on MacOS, Windows, and
Linux:

| Operating System                                                                                                                                                                                                                                                                                              | Without Docker                                                                                                                  | Docker Installation                                                                                                             | Prerequisites                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <img src="https://www.pngplay.com/wp-content/uploads/3/Apple-Logo-Transparent-Images.png" width="15" height="15" alt="MacOS" /> **MacOS**                                                                                                                                                                     | <img src="https://upload.wikimedia.org/wikipedia/en/b/ba/Red_x.svg" width="20" height="20" alt="Not Supported" />               | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | Docker Desktop version must be 4.25.2 or above                                                                                                                                           |
| <img src="https://upload.wikimedia.org/wikipedia/commons/5/5f/Windows_logo_-_2012.svg" width="15" height="15" alt="Windows" /> **Windows**                                                                                                                                                                    | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | - Use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install#install-wsl-command) `wsl --install` <br/> - Windows 10 version 2004 and higher (Build 19041 and higher) or Windows 11 |
| <img src="https://th.bing.com/th/id/R.7802b52b7916c00014450891496fe04a?rik=r8GZM4o2Ch1tHQ&riu=http%3a%2f%2f1000logos.net%2fwp-content%2fuploads%2f2017%2f03%2fLINUX-LOGO.png&ehk=5m0lBvAd%2bzhvGg%2fu4i3%2f4EEHhF4N0PuzR%2fBmC1lFzfw%3d&risl=&pid=ImgRaw&r=0" width="10" height="10" alt="Linux" /> **Linux** | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | <img src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Green_tick_pointed.svg" width="20" height="20" alt="Supported" /> | Linux kernel 5.15 or higher                                                                                                                                                              |

On MacOS and Windows, additional tools are required for Keploy due to the lack of native eBPF support.

## Quick Installation

Let's get started by setting up the Keploy alias with this command:

```bash
 curl -O https://raw.githubusercontent.com/keploy/keploy/main/keploy.sh && source keploy.sh
```

You should see something like this:

```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example         Example to record and test via keploy
  generate-config generate the keploy configuration file
  record          record the keploy testcases from the API calls
  test            run the recorded testcases and execute assertions
  update          Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

🎉 Wohoo! You are all set to use Keploy.
