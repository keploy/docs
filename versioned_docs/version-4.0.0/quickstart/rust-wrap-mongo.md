---
id: samples-rust-wrap
title: Rust Sample Application
sidebar_label: Warp + Mongo
description: The following sample app to test Keploy integration capabilities using Warp HTTP and MongoDb.
tags:
  - Rust
  - MongoDB
keywords:
  - Rust
  - MongoDB
  - API Test generator
  - Auto Testcase generation
---
import HowTo from '@site/src/components/HowTo';

<HowTo
  name="Rust Sample Application — record and replay tests with Keploy"
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

This is a sample app to test Keploy integration capabilities using rust and MongoDb. Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Setup app

Now that we have bun installed, we will setup our application.

```bash
git clone https://github.com/keploy/samples-rust && cd samples-rust/CRUD-rust-mongo
```

## Running App Locally on Linux/WSL 🐧

We will be using Docker compose to run Mongo on Docker container.

### Let's start the MongoDB Instance

```zsh
docker compose up -d
```

### Capture testcase

```bash
sudo -E env PATH=$PATH keploy record -c 'cargo run'
```

#### Generate testcase

1. Create Notes

```bash
curl --location 'http://localhost:8000/api/notes/' \
--header 'Content-Type: application/json' \
--data '{
    "title": "You'\''ll learn how to build a CRUD API with FastAPI",
    "content": "Fastapi is really easy to use",
    "category": "FastAPI"
}'
```

which will return

```json
{
  "status": "success",
  "data": {
    "note": {
      "id": "6618fa20875aedcfe96e08ed",
      "title": "You'll learn how to build a CRUD API with FastAPI",
      "content": "Fastapi is really easy to use",
      "category": "FastAPI",
      "published": false,
      "createdAt": "2024-04-12T09:08:48.686Z",
      "updatedAt": "2024-04-12T09:08:48.686Z"
    }
  }
}
```

2. Get Notes

```bash
curl --location 'http://localhost:8000/api/notes/6618fa20875aedcfe96e08ed'
```

This is how keploy terminal would look like:

![Testcase](../../../static/img/rust-crud-record.png?raw=true)

### Run the testcases

Now, let's run the keploy in test mode again:-

```bash
sudo -E env PATH=$PATH keploy test -c 'cargo run'
```

_Voila!! Our testcases has passed 🌟_

Hope this helps you out, if you still have any questions, reach out to us .
