---
id: samples-sse
title: Sample Real-Time App (Svelte)
sidebar_label: SSE + Svelte + MongoDB
description: The following sample app tests Keploy integration capabilities with realtime subscriptions such as SSE
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - svelte
  - SSE
keyword:
  - Svelte
  - Server-Sent Events
  - MongoDB Mock
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of realtime subscriptions and see how seamlessly Keploy integrates with SSE and MongoDB Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Installation 📥

Ways you can run this sample application.

- [Using Docker container for MongoDB and running application locally](#installation-setup)

## Installation Setup

#### Server

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/sse-svelte
go mod download
```

### Start MongoDB Instance

Using the docker-compose file we will start our mongodb instance:-

```bash
# Start Postgres
docker-compose up mongo
```

### Build Application Binary

Now, we will create the binary of our application:-

```bash
go build -cover
```

Once we have our applicaiton binary ready, we will start the application with keploy to start capturing the testcases.

## Capture the test cases

```bash
sudo -E keploy record "./sse-mongo"
```

### Start the UI

We will capture our test from the UI written in Svelte.js

```bash
cd svelte-app && npm install && npm run dev
```

Now let's click on `GetTime` button to trigger the event. We would notice that keploy will capture those calls : -
![Testcases](https://github.com/keploy/samples-go/raw/main/sse-svelte/img/testcase.png?raw=true)

## Run the Testcases

Now let's run the test mode :-

```shell
keploy test -c "./sse-mongo" --delay 10 --goCoverage
```

Output should look like : -

![Testrun](https://github.com/keploy/samples-go/raw/main/sse-svelte/img/testrun.png?raw=true)

So no need to setup fake database/apis like Postgres or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to MongoDb 😄**. And with just few clicks we were able to get 42% code coverage of our go backend application.
