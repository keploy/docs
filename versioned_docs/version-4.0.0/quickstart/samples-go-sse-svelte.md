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
keywords:
  - Svelte
  - Server-Sent Events
  - MongoDB Mock
  - API Test generator
  - Auto Testcase generation
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Sample Real-Time App (Svelte) — record and replay tests with Keploy"
description="Clone the sample app, run it under Keploy to capture API traffic, then replay the recorded testcases."
totalTime="PT10M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["Keploy CLI", "Docker", "git"]}
visible={false}
steps={[
{
name: "Install Keploy",
text: "Install the Keploy CLI on Linux/WSL using the install script from https://keploy.io/install.sh.",
},
{
name: "Clone the sample app",
text: "Clone the sample repo referenced on this page and install its dependencies.",
},
{
name: "Start dependencies (database, etc.)",
text: "Bring up any Docker services the app needs (databases, message queues) before recording.",
},
{
name: "Record API calls",
text: "Run keploy record -c \"CMD_TO_RUN_APP\" and exercise the app's endpoints (curl, Postman) to capture testcases and mocks.",
},
{
name: "Replay tests",
text: "Run keploy test -c \"CMD_TO_RUN_APP\" --delay 10 to replay the recorded testcases and detect regressions.",
},
]}
/>

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
