---
id: introduction
title: Installation of Keploy Server
sidebar_label: Server
---

## Overview

The [Keploy Server](https://github.com/keploy/keploy) is an API-Testing platform that performs the operations of comparing, storing, deduplication of test-cases.
It is completely open source and can be run in a variety of cloud or on-premise environments.
A single Server instance can be used for many different use cases simultaneously, or be tied to a single application.

## Installation

There are two ways to quickly install and run the Keploy Server:

- [Docker](#docker): Using `docker-compose` is recommended for individual developers to record, maintain and test locally.
- [Helm Charts](#helm-charts): Deploying the Server to [Kubernetes](https://kubernetes.io/) is an easy way to improve collaboration amongst test QAs, SDEs, SDETs.

We do not recommend using any of these methods in a full (production) environment.

## Docker

### Prerequisites

1. [Install Docker](https://docs.docker.com/engine/install)
2. [Install docker-compose](https://docs.docker.com/compose/install)

### Start keploy server locally

```shell
git clone https://github.com/keploy/keploy.git && cd keploy
```

Now start the Keploy server.

```shell
docker-compose up
```

Voilà! 🧑🏻‍💻 We have the server running!

Now open the Keploy Console at [http://localhost:8081](http://localhost:8081)

### Update Keploy Server

If you're running old version of Keploy. Update the Keploy Server version by pulling the latest docker image.

```shell
docker-compose pull
```

## Helm Charts [WIP]

We're adding the helm chart for hosting Keploy server in a variety of cloud or on-premise environments. Please track the issue [here](https://github.com/keploy/keploy/issues/80).
