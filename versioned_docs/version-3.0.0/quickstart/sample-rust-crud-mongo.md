---
id: sample-rust-crud-mongo
title: CRUD REST API with MongoDB
sidebar_label: Rust + MongoDB (REST)
description: A sample CRUD REST API application to test Keploy integration capabilities using Rust and MongoDB.
tags:
  - Rust
  - MongoDB
  - REST API
keywords:
  - Rust
  - MongoDB
  - API Test generator
  - Auto Testcase generation
  - CRUD
  - REST
---

This is a sample CRUD REST API application to showcase Keploy integration capabilities using Rust and MongoDB. Let's get started! 🚀

import InstallReminder from '@site/src/components/InstallReminder';

## Running App Locally on Linux/WSL 🐧

<InstallReminder />

## Get Started! 🎬

Now that we have Keploy installed, let's set up our application.

```bash
git clone https://github.com/keploy/samples-rust
cd samples-rust/CRUD-rust-mongo
```

We will be using Docker compose to run Mongo on Docker container.

### Let's start the MongoDB Instance

Open the root directory path in your terminal and then execute the following command:

```bash
docker-compose up -d
```

### Run the app

```bash
cargo r -r
```

The app will be running on port 8000.

#### Capture testcase

On same terminal execute the following command:

```bash
keploy record -c 'cargo r -r'
```

The output will be as follows:
<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/rust-mongo-rest-test-run.webp" alt="RecordRun" width="1783" height="1174" style={{maxWidth:'100%',height:'auto'}} />

### Generate testcase

Open Postman or any other tool, or utilize the Postman VSCode extension. Click on the import icon (shown below):

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/rust-mongo-postman-collection-import-button.webp" alt="TestRun" width="943" height="697" style={{maxWidth:'100%',height:'auto'}} />

Import the file named: `Note App.postman_collection.json`

After that, Postman will display a similar window:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/rust-mongo-rest-postman-collection.webp" alt="TestRun" width="2548" height="1222" style={{maxWidth:'100%',height:'auto'}} />

Hit the Create Note Request with the available data and you will get the following output in your terminal:

```bash
🐰 Keploy: 2024-08-27T21:06:57+05:30 t 8INFO
🟠 Keploy has captured test cases for the user's application.   {"path": "/root/samples-rust/CRUD-rust-mongo/keploy/test-set-3/tests", "testcase name": "test-1"}
```

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/rust-mongo-rest-postman-create-success.webp" alt="TestRun" width="1300" height="1009" style={{maxWidth:'100%',height:'auto'}} />

Afterward, create a GET all request, and you will get the following output in your terminal:

```bash
🐰 Keploy: 2024-08-27T21:13:41+05:30    INFO    🟠 Keploy has captured test cases for the user's application.   {"path": "/root/samples-rust/CRUD-rust-mongo/keploy/test-set-3/tests", "testcase name": "test-3"}
```

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/rust-mongo-rest-postman-get-all-success.webp" alt="Test-case" width="1363" height="1039" style={{maxWidth:'100%',height:'auto'}} />

We peformed two requests, one to create a note and one to get all notes. These requests are captured as testcases by Keploy.

### Run the testcases

Now, let's start keploy in test mode to run our test cases :

```bash
keploy test -c 'cargo r -r'
```

We get the following output in the terminal -

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/rust-mongo-rest-test-run-2.webp" alt="TestRun" width="1690" height="1095" style={{maxWidth:'100%',height:'auto'}} />
_Voila!! Our testcases has passed 🌟_
