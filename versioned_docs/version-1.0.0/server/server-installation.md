---
id: server-installation
title: Installation of Keploy Server (v1.0.0)
sidebar_label: Server Installation
---

The [Keploy Server](https://github.com/keploy/keploy) can be installed and run locally. To quickly install and run the Keploy Server download binary depending on your OS platform:

<!--
- [Helm Charts](#helm-charts): Deploying the Server to [Kubernetes](https://kubernetes.io/) is an easy way to improve collaboration amongst test QAs, SDEs, SDETs.
-->

<!--
## Helm Charts

Keploy can also be installed to your Kubernetes cluster using the Helm chart. It automatically deploys a mongo instance using the [Bitnami Mongo Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/mongodb)

#### Installation

```shell
helm upgrade -i keploy .
```

#### Access via kube proxy

```shell
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=keploy,app.kubernetes.io/instance=keploy" -o jsonpath="{.items[0].metadata.name}")
export CONTAINER_PORT=$(kubectl get pod --namespace default $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
kubectl --namespace default port-forward $POD_NAME 6789:$CONTAINER_PORT
```

Then the keploy service should be accessible on http://127.0.0.1:6789

#### Access via ingress

To access Keploy though ingress, please add information about ingress in the [values.yaml](https://github.com/keploy/keploy/blob/main/deployment/keploy/values.yaml) file.

-->

## Install Binary

### MacOS

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/tag/v0.9.1/download/keploy_darwin_all.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

### Linux

<details>
<summary>Linux</summary>

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/tag/v0.9.1/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

</details>

<details>
<summary>Linux ARM</summary>

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/tag/v0.9.1/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

The UI can be accessed at http://localhost:6789

</details>

### Windows

<details>
<summary>Windows</summary>

- Download the [Keploy Windows AMD64](https://github.com/keploy/keploy/releases/tag/v0.9.1/download/keploy_windows_amd64.tar.gz), and extract the files from the zip folder.

- Run the `keploy.exe` file.

</details>

<details>
<summary>Windows ARM</summary>

- Download the [Keploy Windows ARM64](https://github.com/keploy/keploy/releases/tag/v0.9.1/download/keploy_windows_arm64.tar.gz), and extract the files from the zip folder.

- Run the `keploy.exe` file.

</details>

Voilà! 🧑🏻‍💻 We have the server running!
