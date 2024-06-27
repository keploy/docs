---
id: samples-node-jwt
title: NodeJS - JWT Sample Application
sidebar_label: NodeJS - JWT + Postgres
description: The following sample app showcases how to use NodeJS framework with JWT and the Keploy Platform.
tags:
  - javascript
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - NodeJS Framework
  - Postgres
  - NodeJS
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A simple sample CRUD application to test using Keploy build with Node, JWT and Postgres. Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Setup application

Clone the repository and move to express-mongo folder

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/node-jwt

# Install the dependencies
npm install
```

## Installation 📥

Depending on your OS, choose your adventure:
There are 2 ways you can run this sample application.

- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)
- [Using Docker compose : running application as well as Postgres on Docker container](#using-docker-compose-)

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (postgres) chill on Docker. Ready? Let's get the party started!🎉

If you are using WSL on windows then use below to start wsl in the user's home directory:

```bash
wsl ~
```

### Let's start the Postgres Instance

```zsh
docker-compose up -d
```

## Capture the testcases

```bash
sudo -E env PATH=$PATH keploy record -c 'node app.js'
```

### Let's Generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

1. Create User

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"user",
    "email":"user@keploy.io",
    "password":"1234"
}'
```

we will get the output:

```json
{"message": "User was registered successfully!"}
```

We will get the following output in our terminal

<img src="/docs/img/jwt-record.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

Let's go ahead create few more testcases for different endpoints!

2. Create Admin User

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"admin",
    "email":"admin@keploy.io",
    "password":"1234",
    "role":["admin"]
}'
```

we will get the output:

```json
{"message": "User was registered successfully!"}
```

3. User Signin

```bash
curl --location 'http://localhost:8080/api/auth/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"user",
    "email":"user@keploy.io",
    "password":"1234"
}'
```

We will get access token once the user has signed in:

```json
{
  "id": 1,
  "username": "user",
  "email": "user@keploy.io",
  "roles": ["ROLE_USER"],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzNzY0ODY1LCJleHAiOjE3MTM3NjUwNDV9.5LSU1A1jxIbIQFS6Tq26ENNWZBinFt2cJQZ7swpipbc"
}
```

4. Access user Content

```sh
curl --location 'http://localhost:8080/api/test/all'
```

We will get:

```
Public Content
```

5. Access user Content

```sh
curl --location 'http://localhost:8080/api/test/user' \
--header 'x-access-token: <TOKEN>'
```

We will get

```
User Content
```

## Running the testcases

```bash
sudo -E env PATH=$PATH keploy test -c 'npm run app.js' --delay 10
```

Our testcases will fail as the token would expire and new Token will generated again when we are using testmode. To make sure that testcases do not fail, we have use [timeFreezing](https://keploy.io/docs/keploy-cloud/time-freezing/).
Our testcases will fail as the token would expire and new Token will generated again when we are using testmode. To make sure that testcases do not fail, we have use [timeFreezing](https://keploy.io/docs/keploy-cloud/time-freezing/).

<img src="/docs/img/jwt-test-fail.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

But for this application, the Token expiration is 10 mins so let's go ahead and test the application within 10mins. Let's add the `Etag` and `accessToken` as the noise in the `test-3.yml` on line 45 under `header.Date`. The file would look like:-
But for this application, the Token expiration is 10 mins so let's go ahead and test the application within 10mins. Let's add the `Etag` and `accessToken` as the noise in the `test-3.yml` on line 45 under `header.Date`. The file would look like:-

```
        noise:
        |   - header.Date
        |   - header.Etag
        |   - body.accessToken
```

Now, let's run the keploy in test mode again:-

<img src="/docs/img/jwt-test-pass.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

---

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Postgres on Docker container.

Since we have setup our sample-app using docker, we need to update the postgres host on line 2, in `config/db.config.js`, from `localhost` to `postgres`.

## Capture the testcases

We will run the keploy in record mode with docker-compose to start our application:-

```bash
keploy record -c "docker-compose up" --container-name "jwtSqlApp"
```

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

1. Create User

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"user",
    "email":"user@keploy.io",
    "password":"1234"
}'
```

we will get the output:

```json
{"message": "User was registered successfully!"}
```

We will get the following output in our terminal

<img src="/docs/img/jwt-record.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

Let's go ahead create few more testcases for different endpoints!

2. Create Admin User

```bash
curl --location 'http://localhost:8080/api/auth/signup' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"admin",
    "email":"admin@keploy.io",
    "password":"1234",
    "role":["admin"]
}'
```

we will get the output:

```json
{"message": "User was registered successfully!"}
```

3. User Signin

```bash
curl --location 'http://localhost:8080/api/auth/signin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username":"user",
    "email":"user@keploy.io",
    "password":"1234"
}'
```

We will get access token once the user has signed in:

```json
{
  "id": 1,
  "username": "user",
  "email": "user@keploy.io",
  "roles": ["ROLE_USER"],
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzEzNzY0ODY1LCJleHAiOjE3MTM3NjUwNDV9.5LSU1A1jxIbIQFS6Tq26ENNWZBinFt2cJQZ7swpipbc"
}
```

4. Access user Content

```sh
curl --location 'http://localhost:8080/api/test/all'
```

We will get:

```
Public Content
```

5. Access user Content

```sh
curl --location 'http://localhost:8080/api/test/user' \
--header 'x-access-token: <TOKEN>'
```

We will get

```
User Content
```

## Running the testcases

```bash
keploy test -c 'sudo docker-compose up'  --container-name "jwtSqlApp" --delay 10
```

Our testcases will fail as the token would expire and new Token will generated again when we are using testmode. To make sure that testcases do not fail, we have use [timeFreezing](https://keploy.io/docs/keploy-cloud/time-freezing/).

<img src="/docs/img/jwt-test-fail.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

But for this application, the Token expiration is 10 mins so let's go ahead and test the application within 10mins. Let's add the `Etag` and `accessToken` as the noise in the `test-3.yml` on line 45 under `header.Date`. The file would look like:-

```
        noise:
        |   - header.Date
        |   - header.Etag
        |   - body.accessToken
```

Now, let's run the keploy in test mode again:-

<img src="/docs/img/jwt-test-pass.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***
