---
id: server-installation
title: Installation of Keploy Server
sidebar_label: Server Installation
---

The [Keploy ebpf](https://github.com/keploy/keploy) can be installed and run locally. To quickly install and run the Keploy Server download binary depending on your OS platform:

## Install Keploy eBPF

### MacOS

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_darwin_all.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

### Linux


```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```


### Windows

<details>
<summary>Windows</summary>

- Download the [Keploy Windows AMD64](https://github.com/keploy/keploy/releases/latest/download/keploy_windows_amd64.tar.gz), and extract the files from the zip folder.

- Run the `keploy.exe` file.

</details>

### Docker

<details>
<summary>Docker</summary>
</details>

### Podman

<details>
<summary>Podman</summary>

</details>

Voilà! 🧑🏻‍💻 We have the server running!
