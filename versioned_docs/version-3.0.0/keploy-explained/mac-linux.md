---
id: mac-linux
title: "Running Keploy Natively on MacOS by setting up a linux env"
sidebar_label: Keploy on MacOS native
---

# Running Keploy Natively on MacOS by setting up a linux env

**_Downloading and running Keploy in Native using Debian on MacOS_**

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
    limactl create template://debian-12
    ```

5.  Start the instance

    ```bash
    limactl start debian-12
    ```

6.  Enter the shell of the running linux instance

    ```bash
    limactl shell debian-12
    ```

7.  Now you are in the linux shell of the debian instance. Replace `{Username}` with your actual macOS username in the following command. This will take you directly to your macOS home directory. (You might need to allow access to Terminal.app in a popup)

    ```bash
    cd /Users/{Username}
    ```

8.  Run the following command to install Keploy

    ```bash
    curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp
    sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
    ```

Congratulations! You've successfully set up Keploy natively on MacOS.

## What's Next?

### 🎬 [Start Capturing Testcases](/server/installation.md#-capturing-testcases)

Begin recording your API calls and generating test cases with Keploy.

#### [Back to Installation Guide](/server/installation.md)
