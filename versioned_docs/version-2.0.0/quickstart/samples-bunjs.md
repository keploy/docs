---
id: samples-bunjs
title: BunJS Sample Application
description: The following sample app showcases how to use BunJS framework and the Keploy Platform.
tags:
  - BunJS Framework
  - MongoDB
keyword:
  - BunJS Framework
  - MongoDB
  - BunJS
  - API Test generator
  - Auto Testcase generation
---

# Sample app with Bun.js and MongoDb

This is a sample app to test Keploy integration capabilities using [Bun.js](https://bun.sh) and MongoDb.

## Pre-requsite

We first need to install bun.js.

```zsh
# Bun.js is supported on macOS, Linux, and WSL
curl -fsSL https://bun.sh/install | bash
```

## Setup app

Now that we have bun installed, we will setup our application

```zsh
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/bun-mongo

# Install the dependencies
bun install
```

# Using Keploy :

There are two ways to use Keploy:-

1. [Natively on Linux/WSL](#natively-on-ubuntuwsl)
2. [Using Docker](#running-sample-app-using-docker)

## Natively on Ubuntu/WSL

Keploy can be installed on Linux directly and on Windows with the help of WSL. Based on your system architecture, install the keploy latest binary release from here:-

#### Linux

1. AMD Architecture

```zsh
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

<details> 
<Summary> 2. ARM Architecture </Summary>

```zsh
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

</details>

#### Windows Subsystem for Linux (WSL)

On Windows, WSL is required to run Keploy Binary. You must be running Windows 10 version 2004 and higher (Build 19041 and higher) or Windows 11 to use the commands below.

```bash
wsl --install
```

Once installed download and Install "Keploy Binary" :

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

### Let's start the MongoDB Instance

```zsh
docker-compose up -d
```

> **Since we have setup our sample-app natively, we need to update the mongoDB host on line 41, in `supabun.ts`, from `mongodb://mongoDb-bun:27017/keploy` to `mongodb://loacalhost:27017/keploy`.**

### Capture the testcases

```bash
sudo -E env PATH=$PATH Keploy record -c 'bun run supabun.ts'
```

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

1. Generate the testcases

```bash
curl --request POST localhost:420/save
```

we will get the output:

```
{"succes":true}
```

2. Fetch the data

```bash
curl --request GET localhost:420/fetch
```

this will provide us with the output:-

```
{"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
```

We will get the following output in our terminal

![Testcase](/img/testcase-bun.png)

---

# Running sample app using docker

Keploy can be used on Linux & Windows through Docker, and on MacOS by the help of [Colima](https://docs.keploy.io/docs/server/macos/installation/#using-colima).

## Create Keploy Alias

We need create an alias for Keploy:

```bash
alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
```

## Let's start the MongoDB Instance

```bash
docker-compose up -d
```

## Capture the testcases

1. We first need to build dockerimage of our application:-

```bash
docker build -t bun-app:1.0 .
```

2. Now we will run the keploy in record mode:-

```bash
keploy record -c "docker run -p 420:420 --name bunMongoApp --network keploy-network bun-app:1.0"
```

### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

```bash
curl --request POST localhost:420/save
```

we will get the output:

```
{"succes":true}
```

2. Fetch the data

```bash
curl --request GET localhost:420/fetch
```

this will provide us with the output:-

```
{"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
```

We will get the following output in our terminal

![Testcase](/img/testcase-bun.png)

# Running the testcases

This is WIP and depended upon the issue by oven/bun & elysia:- https://github.com/elysiajs/elysia/issues/231
