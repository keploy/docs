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

## Introduction

🪄 Dive into the world of CRUD applications and see how seamlessly Keploy integrates with [FastHttp](https://github.com/valyala/fasthttp) and [Postgres](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Clone the sample CRUD application 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/fasthttp-postgres
go mod download
```

## Installation 📥

There are 2 ways you can run this sample application.

- [Using Docker compose: running application as well as Postgres on Docker container](#using-docker-compose-)
- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker Compose to run the application as well as Postgres on Docker container.

### Lights, Camera, Record! 🎥

Fire up the application and Postgres instance with Keploy. Keep an eye on the two key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--container-name`: The container name in the `docker-compose.yml` for traffic interception.

```bash
keploy record -c "docker compose up" --container-name "fasthttpPostgresApp"
```

Getting logs like this? Perfect! 👌
![Testcase](https://github.com/keploy/samples-go/raw/main/fasthttp-postgres/img/testcases.png)

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's create some users and books:

#### Post Requests

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Author Name"}' http://localhost:8080/authors
curl -X POST -H "Content-Type: application/json" -d '{"title":"Book Title","author_id":1}' http://localhost:8080/books
```

#### Get Request

```bash
curl -i http://localhost:8080/books
```

🎉 Woohoo! With simple API calls, you've crafted test cases with mocks! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`.

Here's a peek of what you get:

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:8080/authors
    header:
      Accept: "*/*"
      Content-Length: "22"
      Content-Type: application/json
      Host: localhost:8080
      User-Agent: curl/7.88.1
    body: '{"name":"Author Name"}'
    timestamp: 2024-06-24T13:05:47.732915734+05:30
  resp:
    status_code: 201
    header:
      Content-Length: "0"
      Date: Mon, 24 Jun 2024 07:35:47 GMT
      Server: Server
    body: ""
    status_message: Created
    proto_major: 0
    proto_minor: 0
    timestamp: 2024-06-24T13:05:49.810554677+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1719214549
curl: |-
  curl --request POST \
    --url http://localhost:8080/authors \
    --header 'Host: localhost:8080' \
    --header 'User-Agent: curl/7.88.1' \
    --header 'Accept: */*' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Author Name"}'
```

This is how the generated **mock.yml** will look like:

```yaml
version: api.keploy.io/v1beta1
kind: Postgres
name: mock-0
spec:
  metadata:
    type: config
  postgresrequests:
    - identifier: StartupRequest
      length: 96
      payload: AAAAYAADAAB1c2VyAHBvc3RncmVzAGNsaWVudF9lbmNvZGluZwBVVEY4AGV4dHJhX2Zsb2F0X2RpZ2l0cwAyAGRhdGFiYXNlAGRiAGRhdGVzdHlsZQBJU08sIE1EWQAA
      startup_message:
        protocolversion: 196608
        parameters:
          client_encoding: UTF8
          database: db
          datestyle: ISO, MDY
          extra_float_digits: "2"
          user: postgres
      auth_type: 0
  postgresresponses:
    - header: [R]
      identifier: ServerResponse
      length: 96
      authentication_md5_password:
        salt: [200, 42, 157, 175]
      msg_type: 82
      auth_type: 5
  reqtimestampmock: 2024-06-24T13:05:47.736932812+05:30
  restimestampmock: 2024-06-24T13:05:47.74668502+05:30
connectionId: "0"
```

_Time to perform more API magic!_

#### Get All Books

```bash
curl -i http://localhost:8080/books
```

Or just type `http://localhost:8080/books` in your browser. Your choice!

Spotted the new test and mock files in your project? High five! 🙌

### Run Tests 🏃‍♀️

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name "fasthttpPostgresApp" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Your results should be looking like this:

![Testrun](https://github.com/keploy/samples-go/raw/main/fasthttp-postgres/img/testrun.png)

Did you spot that the ts (timestamp) is showing some differences? Yep, time has a way of doing that! 🕰️

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

---

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Postgres) chill on Docker. Ready? Let's get the party started! 🎉

If you are using WSL on Windows then use below to start WSL in the user's home directory:

```bash
wsl ~
```

First things first, update the Postgres URL to `localhost:5432` on **line 21** of our trusty `main.go` file.

### 🍃 Kickstart Postgres

Let's breathe life into your Postgres container. A simple spell should do the trick:

```bash
docker compose up postgres
```

### 📼 Recording Time!

Ready, set, record! Here's how:

```bash
go build -cover
keploy record -c "./app"

```

Keep an eye out for the `-c` flag! It's the command charm to run the app. Whether you're using `go run main.go` or the binary path like `./app`, it's your call.
If you're seeing logs that resemble the ones below, you're on the right track:

![Testcase](https://github.com/keploy/samples-go/raw/main/fasthttp-postgres/img/testcases.png)

Alright! With the app alive and kicking, let's weave some test cases. Making some API calls! Postman, Hoppscotch,

or even the classic curl - take your pick!

Time to create some users and books:

#### Post Requests

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name":"Author Name"}' http://localhost:8080/authors
curl -X POST -H "Content-Type: application/json" -d '{"title":"Book Title","author_id":1}' http://localhost:8080/books
```

#### Get Request

```bash
curl -i http://localhost:8080/books
```

🎉 Look at you go! With a few simple API calls, you've crafted test cases with mocks! Peek into the Keploy directory and behold the freshly minted `test-1.yml` and `mocks.yml`.

### 🏃‍♀️ Run the Tests!

Time to put it all to the test:

```bash
keploy test -c "./app" --delay 5
```

> That `--delay` flag? Just a little pause (in seconds) to let your app catch its breath before the test cases start rolling in.

When all is said and done, your test results should look a little something like this:

![Testrun](https://github.com/keploy/samples-go/raw/main/fasthttp-postgres/img/testrun.png)

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
