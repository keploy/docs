---
id: mac-linux
title: "Running Keploy Natively on MacOS by setting up a linux env"
sidebar_label: MacOS Native
---

# Running Keploy Natively on MacOS by setting up a linux env

### Downloading and running Keploy in Native using Debian on MacOS

1. Open the terminal Session.
2. Run the following command. This installs homebrew and makes it easier to manage software and packages on macOS

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

3. Now, with the help of homebrew, we would install Lima (Linux Virtual Machine) by running this command.

```bash
brew install lima
```

4. Paste this command next.

```bash
limactl show-ssh --format=config debian-12 & add it to its ssh config
```

5. Open a remote window on your code editor and Click on connect to host
6. Now select the configured SSH as "lima-debian"
7. Once you are in the terminal run the following commands to go into your directory

```bash
cd /Users
```

```bash
cd /{Username}
```

8. Run the following command to install Keploy

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp
sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
```

9. Commands to Install docker

```bash
sudo apt-get -y update
sudo apt-get -y install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

10. Add docker to sudoers

```bash
sudo groupadd docker
sudo gpasswd -a $USER docker
```
