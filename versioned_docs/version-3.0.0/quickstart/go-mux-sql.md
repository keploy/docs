---
id: samples-mux
title: Sample Product Catalog App (Golang)
sidebar_label: Mux + Postgres
description: The following sample app showcases how to use Mux framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - postgres
  - mux-framework
keyword:
  - Mux Framework
  - Postgres
  - SQL
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of Product catelog and see how seamlessly Keploy integrates with [Mux](https://github.com/gorilla/mux) and [Postgres](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample Product Catalog App🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/mux-sql
go mod download
```

## Installation 📥

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Postgres on Docker container](#using-docker-compose-)
- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Postgres on Docker container.

### Lights, Camera, Record! 🎥

Fire up the application and Postgres instance with Keploy. Keep an eye on the two key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--container-name`: The container name in the `docker-compose.yml` for traffic interception.

#### Capture the TestCase

```bash
keploy record -c "docker compose up" --container-name "muxSqlApp" --build-delay 50
```

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Generate a Test Case

```bash
curl --request POST \
--url http://localhost:8010/product \
--header 'content-type: application/json' \
--data '{
  "name":"Bubbles",
  "price": 123
}'
```

Here's a peek of what you get:

```json
{
  "id": 1,
  "name": "Bubbles",
  "price": 123
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
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:8010/product
    header:
      Accept: "*/*"
      Content-Length: "46"
      Content-Type: application/json
      Host: localhost:8010
      User-Agent: curl/8.1.2
    body: |-
      {
          "name":"Bubbles",
          "price": 123
          }
    body_type: ""
  resp:
    status_code: 201
    header:
      Content-Length: "37"
      Content-Type: application/json
      Date: Mon, 09 Oct 2023 06:51:16 GMT
    body: '{"id":4,"name":"Bubbles","price":123}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
  objects: []
  assertions:
    noise:
      - header.Date
  created: 1696834280
```

this is how `mocks.yml` generated would look like:-

```yaml
version: api.keploy.io/v1beta2
kind: Postgres
name: mocks
spec:
  metadata: {}
  postgresrequests:
    - origin: client
      message:
        - type: binary
          data: AAAAZgADAABleHRyYV9mbG9hdF9kaWdpdHMAMgB1c2VyAHBvc3RncmVzAGRhdGFiYXNlAHBvc3RncmVzAGNsaWVudF9lbmNvZGluZwBVVEY4AGRhdGVzdHlsZQBJU08sIE1EWQAA
  postgresresponses:
    - origin: server
      message:
        - type: binary
          data: UgAAAAwAAAAF0ykSRQ==
---
version: api.keploy.io/v1beta2
kind: Postgres
name: mocks
spec:
  metadata: {}
  postgresrequests:
    - origin: client
      message:
        - type: binary
          data: cAAAAChtZDU3ZmY0ZTZhZGEzMThlZDJiYWM5ODQyY2YwNmEyODE2MwA=
  postgresresponses:
    - origin: server
      message:
        - type: binary
          data: UgAAAAgAAAAAUwAAABZhcHBsaWNhdGlvbl9uYW1lAABTAAAAGWNsaWVudF9lbmNvZGluZwBVVEY4AFMAAAAXRGF0ZVN0eWxlAElTTywgTURZAFMAAAAZaW50ZWdlcl9kYXRldGltZXMAb24AUwAAABtJbnRlcnZhbFN0eWxlAHBvc3RncmVzAFMAAAAUaXNfc3VwZXJ1c2VyAG9uAFMAAAAZc2VydmVyX2VuY29kaW5nAFVURjgAUwAAADFzZXJ2ZXJfdmVyc2lvbgAxMC41IChEZWJpYW4gMTAuNS0yLnBnZGc5MCsxKQBTAAAAI3Nlc3Npb25fYXV0aG9yaXphdGlvbgBwb3N0Z3JlcwBTAAAAI3N0YW5kYXJkX2NvbmZvcm1pbmdfc3RyaW5ncwBvbgBTAAAAEVRpbWVab25lAFVUQwBLAAAADAAAAB6JC1lnWgAAAAVJ
---
version: api.keploy.io/v1beta2
kind: Postgres
name: mocks
spec:
  metadata: {}
  postgresrequests:
    - origin: client
      message:
        - type: binary
          data: UAAAAEUASU5TRVJUIElOVE8gcHJvZHVjdHMobmFtZSwgcHJpY2UpIFZBTFVFUygkMSwgJDIpIFJFVFVSTklORyBpZAAAAEQAAAAGUwBTAAAABA==
  postgresresponses:
    - origin: server
      message:
        - type: binary
          data: MQAAAAR0AAAADgACAAAAGQAABqRUAAAAGwABaWQAAABAAgABAAAAFwAE/////wAAWgAAAAVJ
```

#### Fetch Product from Catalog

```bash
curl --request GET \  --url http://localhost:8010/products
```

Or just type `http://localhost:8010/products` in your browser. Your choice!

Spotted the new test and mock files in your project? High five! 🙌

### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name "muxSqlApp" --build-delay 50 --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Postgres) chill on Docker. Ready? Let's get the party started!🎉

First things first, update the First things first, update the postgres host on **line 10** in main.go, update the host to `localhost`.

#### 🍃 Kickstart PostgresDB

Let's breathe life into your Postgres container. A simple spell should do the trick:

```bash
docker compose up postgres
```

### 📼 Roll the Tape - Recording Time!

Ready, set, record! Here's how:

```bash
sudo -E env PATH=$PATH keploy record -c "go run main.go app.go"
```

Keep an eye out for the `-c `flag! It's the command charm to run the app. Whether you're using `go run main.go app.go` or the binary path like `./test-app-product-catelog`, it's your call.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

#### Generate a Test Case

✨ A pinch of URL magic:

```bash
curl --request POST \
--url http://localhost:8010/product \
--header 'content-type: application/json' \
--data '{
  "name":"Bubbles",
  "price": 123
  }'
```

And... voila! A Product entry appears:

```json
{
  "id": 1,
  "name": "Bubbles",
  "price": 123
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
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:8010/product
    header:
      Accept: "*/*"
      Content-Length: "46"
      Content-Type: application/json
      Host: localhost:8010
      User-Agent: curl/8.1.2
    body: |-
      {
          "name":"Bubbles",
          "price": 123
          }
    body_type: ""
  resp:
    status_code: 201
    header:
      Content-Length: "37"
      Content-Type: application/json
      Date: Mon, 09 Oct 2023 06:51:16 GMT
    body: '{"id":4,"name":"Bubbles","price":123}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
  objects: []
  assertions:
    noise:
      - header.Date
  created: 1696834280
```

this is how `mocks.yml` generated would look like:-

```yaml
version: api.keploy.io/v1beta2
kind: Postgres
name: mocks
spec:
  metadata: {}
  postgresrequests:
    - origin: client
      message:
        - type: binary
          data: AAAAZgADAABleHRyYV9mbG9hdF9kaWdpdHMAMgB1c2VyAHBvc3RncmVzAGRhdGFiYXNlAHBvc3RncmVzAGNsaWVudF9lbmNvZGluZwBVVEY4AGRhdGVzdHlsZQBJU08sIE1EWQAA
  postgresresponses:
    - origin: server
      message:
        - type: binary
          data: UgAAAAwAAAAF0ykSRQ==
---
version: api.keploy.io/v1beta2
kind: Postgres
name: mocks
spec:
  metadata: {}
  postgresrequests:
    - origin: client
      message:
        - type: binary
          data: cAAAAChtZDU3ZmY0ZTZhZGEzMThlZDJiYWM5ODQyY2YwNmEyODE2MwA=
  postgresresponses:
    - origin: server
      message:
        - type: binary
          data: UgAAAAgAAAAAUwAAABZhcHBsaWNhdGlvbl9uYW1lAABTAAAAGWNsaWVudF9lbmNvZGluZwBVVEY4AFMAAAAXRGF0ZVN0eWxlAElTTywgTURZAFMAAAAZaW50ZWdlcl9kYXRldGltZXMAb24AUwAAABtJbnRlcnZhbFN0eWxlAHBvc3RncmVzAFMAAAAUaXNfc3VwZXJ1c2VyAG9uAFMAAAAZc2VydmVyX2VuY29kaW5nAFVURjgAUwAAADFzZXJ2ZXJfdmVyc2lvbgAxMC41IChEZWJpYW4gMTAuNS0yLnBnZGc5MCsxKQBTAAAAI3Nlc3Npb25fYXV0aG9yaXphdGlvbgBwb3N0Z3JlcwBTAAAAI3N0YW5kYXJkX2NvbmZvcm1pbmdfc3RyaW5ncwBvbgBTAAAAEVRpbWVab25lAFVUQwBLAAAADAAAAB6JC1lnWgAAAAVJ
---
version: api.keploy.io/v1beta2
kind: Postgres
name: mocks
spec:
  metadata: {}
  postgresrequests:
    - origin: client
      message:
        - type: binary
          data: UAAAAEUASU5TRVJUIElOVE8gcHJvZHVjdHMobmFtZSwgcHJpY2UpIFZBTFVFUygkMSwgJDIpIFJFVFVSTklORyBpZAAAAEQAAAAGUwBTAAAABA==
  postgresresponses:
    - origin: server
      message:
        - type: binary
          data: MQAAAAR0AAAADgACAAAAGQAABqRUAAAAGwABaWQAAABAAgABAAAAFwAE/////wAAWgAAAAVJ
```

Now, the real fun begins. Let's weave more spells!

#### Fetch Product from Catalog

🚀 Follow the URL road...!

```bash
curl --request GET \  --url http://localhost:8010/products
```

Or simply wander over to your browser and visit `http://localhost:8010/products`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

<img src="/docs/img/mux-sql-test-cases.png" alt="Sample Keploy Test case and Mock for Mux SQL" width="100%" style={{ borderRadius: '5px' }}/>

### Run Tests 🏁

Ready to put your spells to the test?

```bash
sudo -E env PATH=$PATH keploy test -c "go run main.go app.go" --delay 10
```

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
