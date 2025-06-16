---
id: samples-rust-wrap
title: Rust Sample Application
sidebar_label: Warp + Mongo
description: The following sample app to test Keploy integration capabilities using Warp HTTP and MongoDb.
tags:
  - Rust
  - MongoDB
keyword:
  - Rust
  - MongoDB
  - API Test generator
  - Auto Testcase generation
---

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

import GetSupport from '../concepts/support.md'

<GetSupport/>
