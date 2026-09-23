---
id: mac-linux
title: "Running Keploy on macOS in a Linux VM (Lima)"
sidebar_label: Keploy on macOS with Lima
description: "Run Keploy on macOS inside a Debian Linux VM with Lima — the route for Intel Macs. Step-by-step installation guide."
---

# Running Keploy on macOS in a Linux VM (Lima)

**_Downloading and running Keploy in a Debian VM on macOS_**

:::tip Looking for true native macOS?

This page runs Keploy inside a Debian VM, which is the route for an **Intel Mac**. On Apple Silicon you can skip the VM: Keploy records an app running directly on your Mac, with no Lima and no Docker — see [Installing Keploy on macOS](/docs/installation/macos-installation/).

:::

1.  Open the terminal Session.
2.  Run the following command. This installs homebrew and makes it easier to manage software and packages on macOS

    ```bash
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    ```

3.  Now, with the help of homebrew, we would install Lima (Linux Virtual Machine) by running this command.

    ```bash
    brew install lima
    ```

4.  Create a Debian instance.

    ```bash
    limactl create --mount-writable template://debian-12
    ```

    Lima mounts your Mac's home folder read-only by default; `--mount-writable` lets Keploy write its test files into your project. If you already have an instance, stop it if it's running (`limactl stop <name>`), make it writable with `limactl edit <name> --mount-writable --start`, and continue at step 6, using its name in place of `debian-12`.

5.  Start the instance

    ```bash
    limactl start debian-12
    ```

6.  Enter the shell of the running linux instance

    ```bash
    limactl shell debian-12
    ```

7.  Now you are in the linux shell of the debian instance. Install Keploy from the VM's own home directory. The installer picks the Linux build for the VM's architecture, which matches your Mac's.

    ```bash
    cd ~ && curl --silent -O -L https://keploy.io/install.sh && source install.sh
    ```

8.  Go to your project on the Mac side to record it. Replace `{Username}` with your actual macOS username. (You might need to allow access to Terminal.app in a popup)

    ```bash
    cd /Users/{Username}
    ```

Congratulations! You've successfully set up Keploy on macOS in a Lima VM.

## What's Next?

### 🎬 [Start Capturing Testcases](/docs/server/installation/)

Begin recording your API calls and generating test cases with Keploy.

#### [Back to Installation Guide](/docs/server/installation/)

## Related

- [Running Keploy on Windows in WSL](/docs/keploy-explained/windows-wsl/) — the WSL setup.
- [Keploy Troubleshooting Guide](/docs/keploy-explained/common-errors/) — fix common install issues.
- [Keploy CLI Commands](/docs/running-keploy/cli-commands/) — commands to run after install.
