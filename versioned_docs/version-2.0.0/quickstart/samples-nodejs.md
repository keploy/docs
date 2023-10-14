---
id: samples-nodejs
title: NodeJS Sample Application
description: The following sample app showcases how to use NodeJS framework and the Keploy Platform.
tags:
  - NodeJS Framework
  - MongoDB
keyword:
  - NodeJS Framework
  - MongoDB
  - NodeJS
  - API Test generator
  - Auto Testcase generation
---

# Express-Mongo

A simple sample CRUD application to test using Keploy build with Express and MongoDB.

## Setup application

Clone the repository and move to express-mongoose folder

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/express-mongoose

# Install the dependencies
npm install
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

> **Since we have setup our sample-app natively, we need to update the mongoDB host on line 4, in `db/connection.js`, from `mongodb://mongoDb:27017/keploy` to `mongodb://127.0.0.1:27017/keploy`.**

### Capture the testcases

```bash
sudo -E env PATH=$PATH Keploy record -c 'npm run src/app.js'
```

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

```bash
curl --request POST \
--url http://localhost:8000/students \
   --header 'content-type: application/json' \
   --data '{
    "name":"John Do",
    "email":"john@xyiz.com",
    "phone":"0123456799"
    }'
```

we will get the output:

```
Student registration successful!
```

We will get the following output in our terminal

![Testcase](/img/testcase-node.png)

## Running the testcases

```bash
sudo -E env PATH=$PATH keploy test -c 'npm run src/app.js' --delay 10
```

Our testcases will fail as the Keep-Alive connection won't be available when we are using testmode, this happen because in test mode the Keploy uses the `Mocks.yml`, which was generated in the record mode.

![Testcase](/img/testrun-node-fail.png)

Let's add the `connection` and `keep-alive` as the noise in the test-1.yml on line 42 under `header.Date`. The file would look like:-

```
        noise:
        |   - header.Date
        |   - header.Keep-Alive
        |   - header.Connection
```

Now, let's run the keploy in test mode again:-

![Testrun](/img/testrun-node-pass.png)

_Voila!! Our testcases has passed 🌟_

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
docker build -t node-app:1.0 .
```

2. Now we will run the keploy in record mode:-

```bash
keploy record -c "docker run -p 8000:8000 --name nodeMongoApp --network keploy-network node-app:1.0"
```

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

```bash
curl --request POST \
--url http://localhost:8000/students \
   --header 'content-type: application/json' \
   --data '{
    "name":"John Doe",
    "email":"john@xyz.com",
    "phone":"0123456798"
    }'
```

we will get the output:

```
Student registration successful!
```

We will get the following output in our terminal

![Testcase](/img/testcase-node.png)

## Running the testcases

```bash
keploy test -c "docker run -p 8000:8000 --name nodeMongoApp --network keploy-network node-app:1.0" --delay 10
```

Our testcases will fail as the Keep-Alive connection won't be available when we are using testmode, this happen because in test mode the Keploy uses the `Mocks.yml`, which was generated in the record mode.

![Testcase](/img/testrun-node-fail.png)

Let's add the `connection` and `keep-alive` as the noise in the test-1.yml on line 42 under `header.Date`. The file would look like:-

```
        noise:
        |   - header.Date
        |   - header.Keep-Alive
        |   - header.Connection
```

Now, let's run the keploy in test mode again:-

![Testrun](/img/testrun-node-pass.png)

_Voila!! Our testcases has passed 🌟_
