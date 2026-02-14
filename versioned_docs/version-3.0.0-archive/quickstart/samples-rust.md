---
id: samples-rust
title: GraphQL Application with MongoDB
sidebar_label: Rust + Mongo (GraphQL)
description: The following sample app to test Keploy integration capabilities using rust and MongoDb.
tags:
  - Rust
  - MongoDB
  - GraphQL
keyword:
  - Rust
  - MongoDB
  - GraphQL
  - API Test generator
  - Auto Testcase generation
---

import InstallReminder from '@site/src/components/InstallReminder';

This is a sample app to test Keploy integration capabilities using rust and MongoDb. Buckle up, it's gonna be a fun ride!

## Running App Locally on Linux/WSL 🐧

<InstallReminder />

### Clone a sample Rust app 🧪

```bash
git clone https://github.com/keploy/samples-rust && cd samples-rust/gql-mongo
```

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

Go to the localhost:8000 and create some queries.

We will get the following output in our terminal

![Test-case](/img/rust-mongo-test-case.png?raw=true)

### Run the testcases

Now, let's run the keploy in test mode again:-

```bash
sudo -E env PATH=$PATH keploy test -c 'cargo run'
```

![TestRun](/img/rust-mongo-test-run.png?raw=true)

_Voila!! Our testcases has passed 🌟_

Hope this helps you out, if you still have any questions, reach out to us .
