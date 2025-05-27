---
id: samples-redis
title: Sample User Authentication App (Golang)
sidebar_label: Gin + Redis
description: The following sample app showcases how to use Gin framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - redis
  - gin-framework
keyword:
  - Gin Framework
  - Redis
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of User Authentication apps and see how seamlessly Keploy integrates with Gin and Redis. Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample user authentication app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-redis
go mod download
```

## Installation 📥

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Postgres on Docker container](#using-docker-compose-)
- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Postgres on Docker container.

### Lights, Camera, Record! 🎥

#### Setup the Redis Database 📦

Start the Redis instance using the `docker-compose` file-

```bash
docker compose up redis
```

Now, we will create the docker image of our application:-

```bash
docker build -t gin-app:1.0 .
```

### Capture the test-cases-

```shell
keploy record -c "docker run -p 3001:3001 --network <networkName> --name ginRedisApp gin-app:1.0"
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

#### 1. Request OTP

```bash
curl --location 'localhost:3001/api/getVerificationCode?email=something@gmail.com&username=shivamsourav'
```

This will return the OTP response:

```
{
  "status": "true",
  "message": "OTP Generated successfully",
  "otp": "5486"
}
```

**2. Verify OTP**

```bash
curl --location 'localhost:3001/api/verifyCode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "otp":2121,
    "email":"something@gmail.com"
}'
```

This will return the OTP verification response:

```bash
{
  "status": "true",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6ImdtYWlsLmNvbSIsImV4cCI6MTY5ODc1ODIyNn0.eVrNACUY93g-5tu8fxb2BEOs1wn2iCe8wVpUYU6OLSE",
  "username": "shivamsourav",
  "message": "OTP authenticated successfully"
}
```

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

```yaml
version: api.keploy.io/v1beta2
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://localhost:3001/api/getVerificationCode?email=something@gmail.com&username=shivamsourav
    url_params:
      email: something@gmail.com
      username: shivamsourav
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Connection: keep-alive
      Host: localhost:3001
      Postman-Token: 2db91281-a5bf-49e0-be0d-c6293c833910
      User-Agent: PostmanRuntime/7.33.0
    body: ""
    body_type: ""
  resp:
    status_code: 200
    header:
      Content-Length: "69"
      Content-Type: application/json; charset=utf-8
      Date: Tue, 31 Oct 2023 09:17:00 GMT
    body: '{"status":"true","message":"OTP Generated successfully","otp":"5486"}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
  objects: []
  assertions:
    noise:
      - body.otp
      - header.Date
  created: 1698743822
curl: |
  curl --request GET \
  --url http://localhost:3001/api/getVerificationCode?email=something@gmail.com&username=shivamsourav \
  --header 'Host: localhost:3001' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'User-Agent: PostmanRuntime/7.33.0' \
  --header 'Accept: */*' \
  --header 'Postman-Token: 2db91281-a5bf-49e0-be0d-c6293c833910' \
```

This is how `mocks.yml` generated would look like:-

```yaml
  version: api.keploy.io/v1beta2
  kind: Generic
  name: mocks
  spec:
      metadata: {}
      genericrequests:
          - origin: client
          message:
              - type: string
              data: "*1\r\n$4\r\nping\r\n"
      genericresponses:
          - origin: server
          message:
              - type: string
              data: "+PONG\r\n"
  ---
  version: api.keploy.io/v1beta2
  kind: Generic
  name: mocks
  spec:
      metadata: {}
      genericrequests:
          - origin: client
          message:
              - type: string
              data: "*5\r\n$3\r\nset\r\n$19\r\nsomething@gmail.com\r\n$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n$2\r\nex\r\n$5\r\n14400\r\n"
      genericresponses:
          - origin: server
          message:
              - type: string
              data: "+OK\r\n"
  ---
  version: api.keploy.io/v1beta2
  kind: Generic
  name: mocks
  spec:
      metadata: {}
      genericrequests:
          - origin: client
          message:
              - type: string
              data: "*2\r\n$3\r\nget\r\n$19\r\nsomething@gmail.com\r\n"
      genericresponses:
          - origin: server
          message:
              - type: string
              data: "$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n"
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "sudo docker run -p 3001:3001 --rm --network <networkName> --name ginRedisApp gin-app:1.0" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Redis) chill on Docker. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

Start the Redis database using docker-compose:

```bash
docker compose up redis
```

We'll create a binary of our application:

```bash
go build -o gin-redis
```

Ready, set, record! Here's how:

```bash
sudo -E PATH=$PATH keploy record -c "./gin-redis"
```

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

#### Generate testcases

To generate testcases we just need to **make some API calls.**

**1. Request OTP**

```bash
curl --location 'localhost:3001/api/getVerificationCode?email=something@gmail.com&username=shivamsourav'
```

This will return the OTP response:

```json
{
  "status": "true",
  "message": "OTP Generated successfully",
  "otp": "5486"
}
```

**2. Verify OTP**

```bash
curl --location 'localhost:3001/api/verifyCode' \
--header 'Content-Type: application/json' \
--data-raw '{
    "otp":2121,
    "email":"something@gmail.com"
}'

```

This will return the OTP verification response:

```json
{
  "status": "true",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2YWx1ZSI6ImdtYWlsLmNvbSIsImV4cCI6MTY5ODc1ODIyNn0.eVrNACUY93g-5tu8fxb2BEOs1wn2iCe8wVpUYU6OLSE",
  "username": "shivamsourav",
  "message": "OTP authenticated successfully"
}
```

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

```yaml
version: api.keploy.io/v1beta2
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://localhost:3001/api/getVerificationCode?email=something@gmail.com&username=shivamsourav
    url_params:
      email: something@gmail.com
      username: shivamsourav
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Connection: keep-alive
      Host: localhost:3001
      Postman-Token: 2db91281-a5bf-49e0-be0d-c6293c833910
      User-Agent: PostmanRuntime/7.33.0
    body: ""
    body_type: ""
  resp:
    status_code: 200
    header:
      Content-Length: "69"
      Content-Type: application/json; charset=utf-8
      Date: Tue, 31 Oct 2023 09:17:00 GMT
    body: '{"status":"true","message":"OTP Generated successfully","otp":"5486"}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
  objects: []
  assertions:
    noise:
      - body.otp
      - header.Date
  created: 1698743822
curl: |
  curl --request GET \
  --url http://localhost:3001/api/getVerificationCode?email=something@gmail.com&username=shivamsourav \
  --header 'Host: localhost:3001' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'User-Agent: PostmanRuntime/7.33.0' \
  --header 'Accept: */*' \
  --header 'Postman-Token: 2db91281-a5bf-49e0-be0d-c6293c833910' \
```

This is how `mocks.yml` generated would look like:-

```yaml
  version: api.keploy.io/v1beta2
  kind: Generic
  name: mocks
  spec:
      metadata: {}
      genericrequests:
          - origin: client
          message:
              - type: string
              data: "*1\r\n$4\r\nping\r\n"
      genericresponses:
          - origin: server
          message:
              - type: string
              data: "+PONG\r\n"
  ---
  version: api.keploy.io/v1beta2
  kind: Generic
  name: mocks
  spec:
      metadata: {}
      genericrequests:
          - origin: client
          message:
              - type: string
              data: "*5\r\n$3\r\nset\r\n$19\r\nsomething@gmail.com\r\n$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n$2\r\nex\r\n$5\r\n14400\r\n"
      genericresponses:
          - origin: server
          message:
              - type: string
              data: "+OK\r\n"
  ---
  version: api.keploy.io/v1beta2
  kind: Generic
  name: mocks
  spec:
      metadata: {}
      genericrequests:
          - origin: client
          message:
              - type: string
              data: "*2\r\n$3\r\nget\r\n$19\r\nsomething@gmail.com\r\n"
      genericresponses:
          - origin: server
          message:
              - type: string
              data: "$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n"
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
sudo -E keploy test -c "./gin-redis" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
