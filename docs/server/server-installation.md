---
id: server-installation
title: Installation of Keploy Server
sidebar_label: Server Installation
---

## Installation Methods

There are two ways to quickly install and run the Keploy Server:

- [Helm Charts](#helm-charts): Deploying the Server to [Kubernetes](https://kubernetes.io/) is an easy way to improve collaboration amongst test QAs, SDEs, SDETs.
- [Docker](#docker): Using `docker-compose` is recommended for individual developers to record, maintain and test locally.

We do not recommend using any of these methods in a full (production) environment.

### 1. Helm Charts

Keploy can also be installed to your Kubernetes cluster using the Helm chart. It automatically deploys a mongo instance using the [Bitnami Mongo Helm chart](https://github.com/bitnami/charts/tree/master/bitnami/mongodb)

#### Installation

```shell
helm upgrade -i keploy .
```

#### Access via kube proxy

```shell
export POD_NAME=$(kubectl get pods --namespace default -l "app.kubernetes.io/name=keploy,app.kubernetes.io/instance=keploy" -o jsonpath="{.items[0].metadata.name}")
export CONTAINER_PORT=$(kubectl get pod --namespace default $POD_NAME -o jsonpath="{.spec.containers[0].ports[0].containerPort}")
kubectl --namespace default port-forward $POD_NAME 8080:$CONTAINER_PORT
```

Then the keploy service should be accessible on http://127.0.0.1:8080

#### Access via ingress

To access Keploy though ingress, please add information about ingress in the [values.yaml](https://github.com/keploy/keploy/blob/main/deployment/keploy/values.yaml) file.

### 2. Docker

#### Prerequisites

1. [Install Docker](https://docs.docker.com/engine/install)
2. [Install docker-compose](https://docs.docker.com/compose/install)

### Start MongoDB
Spin up MongoDB to store the test-runs results

```shell
docker container run -it -p27017:27017 mongo
```

> Note that Testcases are exported as files in the repo by default


### MacOS
```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_darwin_all.tar.gz" | tar xz -C /tmp

sudo mv /tmp/keploy /usr/local/bin && keploy
```

### Linux
```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp


sudo mv /tmp/keploy /usr/local/bin && keploy
```

### Linux ARM
```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp


sudo mv /tmp/keploy /usr/local/bin && keploy
```

Voilà! 🧑🏻‍💻 We have the server running!

Now open the Keploy Console at [http://localhost:6789](http://localhost:6789)
