---
id: samples-echo
title: Echo SQL Sample Application
sidebar_label: Echo + Postgres
description: The following sample app showcases how to use Echo framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - postgres
keyword:
  - Echo Framework
  - Postgres
  - SQL
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A sample url shortener app to test Keploy integration capabilities using Echo and [PostgreSQL](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample URL shortener app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/echo-sql
go mod download
```

## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Postgres on Docker container](#using-docker-compose-)
- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Postgres on Docker container.

### Lights, Camera, Record! 🎥

#### Start Postgres Instance

Using the docker-compose file we will start our postgres instance:-

```bash
# Start Postgres
docker compose up
```

#### Creating Docker Volume

```bash
docker volume create --driver local --opt type=debugfs --opt device=debugfs debugfs
```

### Capture the Testcases

Now, we will create the binary of our application:-

```zsh
docker build -t echo-app:1.0 .
```

Once we have our binary file ready,this command will start the recording of API calls using ebpf:-

```shell
keploy record -c "docker run -p 8082:8082 --name echoSqlApp --network keploy-network echo-app:1.0"
```

Make API Calls using Hoppscotch, Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

#### Generate testcases

To generate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/) or simply `curl`

```bash
curl --request POST \
  --url http://localhost:8082/url \
  --header 'content-type: application/json' \
  --data '{
  "url": "https://github.com"
}'
```

this will return the shortened url. The ts would automatically be ignored during testing because it'll always be different.

```json
{
  "ts": 1647802058801841100,
  "url": "http://localhost:8082/GuwHCgoQ"
}
```

#### Redirect to original URL from shortened URL

##### 1. By using Curl Command

```bash
curl --request GET \
  --url http://localhost:8082/GuwHCgoQ
```

2. Or by querying through the browser `http://localhost:8082/GuwHCgoQ`

Now both these API calls were captured as **editable** testcases and written to `keploy/tests` folder. The keploy directory would also have `mocks` file that contains all the outputs of postgres operations. Here's what the folder structure look like:

![Testcase](/img/testcase-echo.png?raw=true)

Now, let's see the magic! ✨💫

Want to see if everything works as expected?

### Run the Testcases

Now that we have our testcase captured, we will add `ts` to noise field in `test-*.yaml` files.

**1. On line 32 we will add "`- body.ts`" under the "`header.data`".**

Now let's run the test mode (in the echo-sql directory, not the Keploy directory).

```shell
keploy test -c "docker run -p 8082:8082 --name echoSqlApp --network keploy-network echo-app:1.0" --delay 10
```

output should look like

![Testrun](/img/testrun-echo.png?raw=true)

So no need to setup fake database/apis like Postgres or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to Postgres 😄**

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Postgres) chill on Docker. Ready? Let's get the party started!🎉
Using the docker-compose file we will start our Postgres instance:-

```shell
docker-compose up -d
```

> **Since we are using docker to run the application, we need to update the `postgres` host on line 28 in `main.go`, update the host to `localhost`.**

Now, we will create the binary of our application:-

```go
go build -cover
```

### Capture the Testcases

```shell
sudo -E PATH=$PATH keploy record -c "./echo-psql-url-shortener"
```

![Testcase](/img/testcase-echo.png?raw=true)

#### Generate testcases

To genereate testcases we just need to make some API calls. You can use Postman, Hoppscotch, or simply curl

```bash
curl --request POST \
  --url http://localhost:8082/url \
  --header 'content-type: application/json' \
  --data '{
  "url": "https://google.com"
}'
```

this will return the shortened url.

```json
{
  "ts": 1645540022,
  "url": "http://localhost:8082/Lhr4BWAi"
}
```

#### Redirect to original url from shòrtened url

```zsh
curl --request GET \ --url http://localhost:8082/Lhr4BWAi
```

or by querying through the browser `http://localhost:8082/Lhr4BWAi`

Now, let's see the magic! 🪄💫

Now both these API calls were captured as a testcase and should be visible on the Keploy CLI. You should be seeing an app named keploy folder with the test cases we just captured and data mocks created

### Run the captured testcases

Now that we have our testcase captured, run the test file.

```shell
sudo -E PATH=$PATH keploy record -c "./echo-psql-url-shortener" --delay 10
```

So no need to setup dependencies like mongoDB, web-go locally or write mocks for your testing.

The application thinks it's talking to mongoDB 😄

We will get output something like this:
![Testrun](/img/testrun-echo.png?raw=true)

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
