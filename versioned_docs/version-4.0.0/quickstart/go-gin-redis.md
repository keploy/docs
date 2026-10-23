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
keywords:
  - Gin Framework
  - Redis
  - Golang
  - API Test generator
  - Auto Testcase generation
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Sample User Authentication App (Golang) — record and replay tests with Keploy"
description="Clone the sample app, run it under Keploy to capture API traffic, then replay the recorded testcases."
totalTime="PT10M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["Keploy CLI", "Docker", "git"]}
visible={false}
steps={[
{
name: "Install Keploy",
text: "Install the Keploy CLI with the install script from https://keploy.io/install.sh (on Windows x86-64, keploy.exe from PowerShell: https://keploy.io/docs/installation/windows-installation/#option-1-run-keploy-natively). Run the app locally on Linux/WSL; on macOS, or on Windows without WSL, use the Docker steps, since natively there Keploy captures Redis calls only as raw bytes that usually don't replay.",
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

import EnterpriseInstallReminder from '@site/src/components/EnterpriseInstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';
import ProductTier from '@site/src/components/ProductTier';

# Using Docker Compose 🐳

<ProductTier tiers="Free, Teams, Scale, Enterprise" />

A sample user authentication app to test Keploy integration capabilities using Gin and Redis.

:::note Recording and mocking Redis needs Keploy Enterprise

Keploy records this app's Redis calls as Mocks, and replays them in `keploy test`, only in [Keploy Enterprise](/docs/keploy-cloud/cloud-installation/), which is the `keploy` that the [install script](/docs/server/installation/) installs by default. A free account is enough to record and replay with it; free-tier runs are subject to a usage allowance.

The open-source `keploy` is the `keploy` that you build from the open-source repository, install with `curl --silent -O -L https://keploy.io/install.sh && source install.sh --oss`, download from the keploy/keploy GitHub releases, or run from the `ghcr.io/keploy/keploy` image. It passes the Redis calls through to the real Redis server in `keploy record` and in `keploy test`, records no Redis Mocks, and logs a warning that the Redis calls are skipped. With it, Redis must be running while `keploy test` runs, and the app reads and writes the live Redis: the OTP verification test fails, because replaying the OTP request stores a new random OTP in Redis, and the recorded OTP no longer matches it. See [Redis Support](/docs/dependencies/redis/).

:::

<EnterpriseInstallReminder />

### Clone a sample user authentication app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-redis
go mod download
```

We will be using Docker compose to run the application as well as Redis on Docker container.

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

This returns the OTP response:

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

This returns the OTP verification response:

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

Keploy Enterprise records no Mock for the app's `PING`. This excerpt of the `mocks.yaml` it writes for these calls leaves out the timestamps and the Mocks for the `HELLO` and `CLIENT SETINFO` commands with which the Redis client opens its connection:

```yaml
version: api.keploy.io/v1beta1
kind: Redis
name: mock-3
spec:
  metadata:
    connID: "0"
  RequestBin:
    - origin: client
      message:
        - type: string
          data: "*5\r\n$3\r\nset\r\n$19\r\nsomething@gmail.com\r\n$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n$2\r\nex\r\n$5\r\n14400\r\n"
  ResponseBin:
    - origin: server
      message:
        - type: string
          data: "+OK\r\n"
connectionId: "0"
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-4
spec:
  metadata:
    connID: "0"
  RequestBin:
    - origin: client
      message:
        - type: string
          data: "*2\r\n$3\r\nget\r\n$19\r\nsomething@gmail.com\r\n"
  ResponseBin:
    - origin: server
      message:
        - type: string
          data: "$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n"
connectionId: "0"
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker run -p 3001:3001 --rm --network <networkName> --name ginRedisApp gin-app:1.0" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

<SectionDivider />

---

# Running App Locally on Linux/WSL 🐧

<ProductTier tiers="Free, Teams, Scale, Enterprise" />

A sample user authentication app to test Keploy integration capabilities using Gin and Redis.

This section runs on Linux or WSL. On macOS, or on Windows without WSL, use the [Docker steps](#using-docker-compose-) instead — natively there, Keploy captures Redis calls only as raw bytes, which usually don't replay.

:::note Recording and mocking Redis needs Keploy Enterprise

Keploy records this app's Redis calls as Mocks, and replays them in `keploy test`, only in [Keploy Enterprise](/docs/keploy-cloud/cloud-installation/), which is the `keploy` that the [install script](/docs/server/installation/) installs by default. A free account is enough to record and replay with it; free-tier runs are subject to a usage allowance.

The open-source `keploy` is the `keploy` that you build from the open-source repository, install with `curl --silent -O -L https://keploy.io/install.sh && source install.sh --oss`, download from the keploy/keploy GitHub releases, or run from the `ghcr.io/keploy/keploy` image. It passes the Redis calls through to the real Redis server in `keploy record` and in `keploy test`, records no Redis Mocks, and logs a warning that the Redis calls are skipped. With it, Redis must be running while `keploy test` runs, and the app reads and writes the live Redis: the OTP verification test fails, because replaying the OTP request stores a new random OTP in Redis, and the recorded OTP no longer matches it. See [Redis Support](/docs/dependencies/redis/).

:::

<EnterpriseInstallReminder />

### Clone a sample user authentication app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-redis
go mod download
```

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Redis) chill on Docker. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

Start the Redis database using docker-compose:

```bash
docker compose up redis
```

Create a binary of our application:

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

Keploy Enterprise records no Mock for the app's `PING`. This excerpt of the `mocks.yaml` it writes for these calls leaves out the timestamps and the Mocks for the `HELLO` and `CLIENT SETINFO` commands with which the Redis client opens its connection:

```yaml
version: api.keploy.io/v1beta1
kind: Redis
name: mock-3
spec:
  metadata:
    connID: "0"
  RequestBin:
    - origin: client
      message:
        - type: string
          data: "*5\r\n$3\r\nset\r\n$19\r\nsomething@gmail.com\r\n$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n$2\r\nex\r\n$5\r\n14400\r\n"
  ResponseBin:
    - origin: server
      message:
        - type: string
          data: "+OK\r\n"
connectionId: "0"
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-4
spec:
  metadata:
    connID: "0"
  RequestBin:
    - origin: client
      message:
        - type: string
          data: "*2\r\n$3\r\nget\r\n$19\r\nsomething@gmail.com\r\n"
  ResponseBin:
    - origin: server
      message:
        - type: string
          data: "$38\r\n{\"otp\":5486,\"username\":\"shivamsourav\"}\r\n"
connectionId: "0"
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

## Related

- [Sample Golang Apps](/docs/quickstart/golang-filter/) — browse more Go samples.
- [Sample Product Catalog App (Golang)](/docs/quickstart/samples-mux/) — another Go sample.
- [Sample URL Shortener App (Golang)](/docs/quickstart/samples-gin/) — another Gin-based Go app.
- [Sample Library App (Flask + Redis)](/docs/quickstart/flask-redis/) — another Redis-backed app.
