---
id: rust-actix-postgres
title: Application with Postgres
sidebar_label: Actix + Postgres
description: A sample Actix-web application to demonstrate Keploy integration capabilities using Rust and Postgres.
tags:
  - Rust
  - Actix
  - Postgres
  - Quickstart
keyword:
  - Rust
  - Actix
  - Postgres
  - API Test generator
  - Auto Testcase generation
---

import InstallReminder from '@site/src/components/InstallReminder';

<InstallReminder />

## Introduction

This guide will walk you through setting up a simple **Rust** application using **Actix-web** and **Postgres** (via **SQLx**) and integrating it with **Keploy** for automated testing.

We will cover two methods:
1. **Docker Compose** (Recommended)
2. **Local Binary**

## Application Setup

### Clone the Repository

```bash
git clone https://github.com/keploy/samples-rust.git
cd samples-rust/rust-actix-postgres
```

## Option 1: Using Docker Compose

This is the easiest way to get started as it sets up both the application and the Postgres database for you.

### 1. Start the Application

```bash
docker compose up -d
```

![Start Application](/img/rust-docker-up.png)

The application will be running at `http://localhost:8080`.

### 2. Record Test Cases

To record test cases, we use the `keploy record` command. This will start your application (via Docker) and proxy the traffic to record interactions.

```bash
keploy record -c "docker compose up" --container-name rust-app
```

![Start Recording](/img/rust-record-start.png)

Now, generate some traffic using `curl` or Postman:

**Create an Item:**

```bash
curl -X POST http://localhost:8080/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Keploy Guide", "description": "Writing tests made easy"}'
```

**Get Items:**

```bash
curl http://localhost:8080/items
```

![Make API Calls](/img/rust-curl-traffic.png)

Stop the recording by pressing `Ctrl+C`. You should see a `keploy/` directory created with your test cases.

![Captured Test Cases](/img/rust-record-captured.png)

### 3. Replay Test Cases

Now, let's verify the recorded test cases.

```bash
keploy test -c "docker compose up" --container-name rust-app --delay 10
```

![Test Replay](/img/rust-test-run.png)

Keploy will compare the current responses with the recorded ones.

---

## Option 2: Running Locally

If you prefer to run the Rust binary directly, follow these steps.

### 1. Start the Database

We'll use Docker to spin up the Postgres database only.

```bash
docker compose up db -d
```

![Start Database](/img/rust-local-db.png)

### 2. Configure Environment

To connect to the database, you need to set the connection string. You can either create a `.env` file or export the variable.

```bash
export DATABASE_URL=postgres://postgres:password@localhost:5432/keploy
```

### 3. Record Test Cases

Now, run the application with Keploy to record traffic.

```bash
keploy record -c "cargo run"
```

![Start Recording](/img/rust-local-record.png)

Once the application matches `Server running at http://0.0.0.0:8080`, generate some traffic.

**Create an Item:**

```bash
curl -X POST http://localhost:8080/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Keploy Guide", "description": "Writing tests made easy"}'
```

**Get Items:**

```bash
curl http://localhost:8080/items
```

![Generate Traffic](/img/rust-local-curl.png)

Stop the recording by pressing `Ctrl+C`.

### 4. Replay Test Cases

Now, let's verify the recorded test cases.

```bash
keploy test -c "cargo run" --delay 10
```

![Test Replay](/img/rust-local-test.png)

Keploy will run the tests and show the results in the terminal.

## Summary

You have successfully:
1.  Set up a Rust Actix-web application.
2.  Recorded API interactions using Keploy.
3.  Replayed and validated the interactions.
