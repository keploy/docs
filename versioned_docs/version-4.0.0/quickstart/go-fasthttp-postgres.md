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
import SectionDivider from '@site/src/components/SectionDivider';
import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

# Running App Locally on Linux/WSL 🐧

This guide walks you through generating tests and DB mocks for a sample CRUD app built with FastHttp and Postgres using Keploy.

<InstallReminder />

### Clone the sample CRUD application 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/fasthttp-postgres
go mod download
```
We can run the application in two ways:

1. Run with Docker
2. Run without Docker

### Option 1: Run with Docker

#### Capture testcases:
```shell
keploy record -c "docker compose up" --container-name=fasthttp_app
```

Keep an eye out for the `-c` flag! It's the command charm to run the app. Whether you're using `docker compose up` or `go run main.go`, it's your call.

If you're seeing logs that resemble the ones below, you're on the right track:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/Keploy_record_fastapi_golang.png" alt="Sample Keploy Record" width="100%" style={{ borderRadius: '5px' }} />

Alright! With the app alive and kicking, let's weave some test cases. Making some API calls! Postman, Hoppscotch,

or even the classic curl - take your pick!

Time to create some users and books:

##### To genereate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`: -

###### 1. Post Requests
```shell
curl -X POST -H "Content-Type: application/json" -d '{"name":"Author Name"}' http://localhost:8080/authors
```

```shell
curl -X POST -H "Content-Type: application/json" -d '{"title":"Book Title","author_id":1}' http://localhost:8080/books
```

###### 2. Get Requests
```bash
curl -i http://localhost:8080/books
```

#### Run captured tests:

Now that we have our testcase captured, run the test file.


```shell
keploy test -c "docker compose up" --container-name=fasthttp_app --delay 10
```
When all is said and done, your test results should look a little something like this:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/keploy_replay_test_fastapi_golang.png" alt="Sample Keploy Replay" width="100%" style={{ borderRadius: '5px' }} />

### Option 2: Run Without Docker

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

#### Start the Postgres container:
```bash
docker compose up -d postgres
```

### Build the Application
```bash
go build -o app
```

#### Capture testcases:
```shell
keploy record -c "./app"
```

Keep an eye out for the `-c` flag! It's the command charm to run the app. Whether you're using `go run main.go` or the binary path like `./app`, it's your call.

If you're seeing logs that resemble the ones below, you're on the right track:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/Keploy_record_fastapi_golang.png" alt="Sample Keploy Record" width="100%" style={{ borderRadius: '5px' }} />

Alright! With the app alive and kicking, let's weave some test cases. Making some API calls! Postman, Hoppscotch,

or even the classic curl - take your pick!

Time to create some users and books:

> Note: The server would be running on http://localhost:8080


##### To genereate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`: - 

###### 1. Post Requests
```shell
curl -X POST -H "Content-Type: application/json" -d '{"name":"Author Name"}' http://localhost:8080/authors
```
```shell
curl -X POST -H "Content-Type: application/json" -d '{"title":"Book Title","author_id":1}' http://localhost:8080/books
```

###### 2. Get Requests
```bash
curl -i http://localhost:8080/books
```



#### Run captured tests

Now that we have our testcase captured, run the test file.

```shell
keploy test -c "./app" --delay 10
```

> That `--delay` flag? Just a little pause (in seconds) to let your app catch its breath before the test cases start rolling in.

When all is said and done, your test results should look a little something like this:

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/keploy_replay_test_fastapi_golang.png" alt="Sample Keploy Replay" width="100%" style={{ borderRadius: '5px' }} />

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible

Happy coding! ✨👩‍💻👨‍💻✨
