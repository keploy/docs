---
id: samples-fasthttp
title: Sample CRUD App (Golang)
sidebar_label: FastHttp + Postgres
description: The following sample app showcases how to use FastHttp framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - postgres
  - fasthttp
keyword:
  - FastHttp Framework
  - Postgres Mock
  - Golang
  - API Test generator
  - Auto Testcase generation
---

import InstallReminder from '@site/src/components/InstallReminder';
import ProductTier from '@site/src/components/ProductTier';
import SectionDivider from '@site/src/components/SectionDivider';

# FastHTTP & Postgres Sample CRUD App

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide walks you through generating tests and DB mocks for a sample CRUD app built with FastHttp and Postgres using Keploy.

<InstallReminder />

## Using Docker Compose

### Clone the sample CRUD App 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/fasthttp-postgres
go mod download
```

### Lights, Camera, Record! 🎥

Start up the application and Keploy with a single command. Make sure to keep an eye on the two key flags:

`-c`: Command to run the app (e.g., `docker compose up`).

`--container-name`: The container name in the `docker-compose.yml` for traffic interception.

#### Capture the test case

```bash
keploy record -c "docker compose up" --container-name "fasthttp_app" --build-delay 50
```

> `--build-delay` adds a buffer (in seconds) to allow images to build/pull and services to start before Keploy begins interception. If your services are already up, you can omit it.

If you're seeing logs that resemble the ones below, you're on the right track:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/Keploy_record_fastapi_golang.png" alt="Sample Keploy Record" width="100%" style={{ borderRadius: '5px' }} />

Make API calls using **cURL**, **Postman**, or **Hoppscotch**.
Keploy captures these requests to automatically generate test suites with test cases and data mocks.


#### Generate a Test Case

##### Post Requests

```bash
curl --request POST \
--url http://localhost:8080/authors \
--header 'content-type: application/json' \
--data '{"name":"Author Name"}'
```

This API call generates a test case along with the required mocks. You can find the generated files in the Keploy directory, including `test-1.yml` and `mocks.yml`.

You can continue by making additional API calls to generate more test cases.

##### Get Requests

```bash
curl --request GET --url http://localhost:8080/books
```


### 🏃‍♀️ Run the Tests

Time to run the testcases which were generated from the previous API calls..

```bash
keploy test -c "docker compose up" --container-name "fasthttp_app" --build-delay 50 --delay 10
```

> The `--delay` flag specifies the time (in seconds) Keploy waits before running the test cases after starting the application.

When all is said and done, your test results should look a little something like this:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/keploy_replay_test_fastapi_golang.png" alt="Sample Keploy Replay" width="100%" style={{ borderRadius: '5px' }} />

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.

Happy coding! ✨👩‍💻👨‍💻✨

<SectionDivider />

---

## Running App Locally on Linux/WSL 🐧

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide walks you through generating tests and DB mocks for a sample CRUD app built with FastHttp and Postgres using Keploy.

<InstallReminder />

### Clone the sample CRUD App 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/fasthttp-postgres
go mod download
```

We'll be running our sample application right on Linux, but just to make things a bit more thrilling, We'll have our database (Postgres) running on Docker. 

> Note: This application requires the following database environment variables 
> to be set in order to run correctly.
>
> Create a .env file in this directory with the following values:
>
> ```env
> DB_HOST=localhost
> DB_PORT=5432
> DB_USER=postgres
> DB_PASSWORD=password
> DB_NAME=db
> ```

### Kickstart PostgresDB

Let's start your Postgres container:

```bash
docker compose up -d postgres

```
> The `-d` flag runs the PostgreSQL container in detached mode (in the background).

This would start your postgres container which will be running on docker.

### Lights, Camera, Record! 🎥

#### First, build the application:

```bash
go build -o app
```

#### Capture the test case

```bash
keploy record -c "./app"
```

The `-c` flag specifies the command used to run the application. You can use either `go run main.go` or the compiled binary (for example, `./app`).

If you're seeing logs that resemble the ones below, you're on the right track:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/Keploy_record_fastapi_golang.png" alt="Sample Keploy Record" width="100%" style={{ borderRadius: '5px' }} />

With the application running successfully, you can begin generating test cases by making API calls using tools such as **cURL**, **Postman**, or **Hoppscotch**.

#### Generate a Test Case

##### Post Requests

```bash
curl --request POST \
--url http://localhost:8080/authors \
--header 'content-type: application/json' \
--data '{"name":"Author Name"}'
```

This API call generates a test case along with the required mocks. You can find the generated files in the Keploy directory, including `test-1.yml` and `mocks.yml`.

You can continue by making additional API calls to generate more test cases.

##### Get Requests

```bash
curl --request GET --url http://localhost:8080/books
```


### 🏃‍♀️ Run the Tests 

You are now ready to run the generated test cases.

```bash
keploy test -c "./app" --delay 10
```

When all is said and done, your test results should look a little something like this:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/keploy_replay_test_fastapi_golang.png" alt="Sample Keploy Replay" width="100%" style={{ borderRadius: '5px' }} />

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 

Happy coding! ✨👩‍💻👨‍💻✨

Hope this helps you out, if you still have any questions, reach out to us .
