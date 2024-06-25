---
id: samples-csharp
title: Sample CRUD App (CSharp)
sidebar_label: .Net + Postgres
description: The following sample app showcases how to use .Net framework and the Keploy Platform.
tags:
  - csharp
  - quickstart
  - samples
  - examples
  - tutorial
  - postgrs
  - dotnet-framework
keyword:
  - DotNet Framework
  - Postgres
  - CSharp
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of User Authentication apps and see how seamlessly Keploy integrates with [.Net](https://dotnet.microsoft.com/en-us/) and [Postgres](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample user authentication app 🧪

```bash
git clone https://github.com/keploy/samples-csharp.git && cd samples-csharp

# start the database instance
docker-compose up
```

## Installation 📥

- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Redis) chill on Docker. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

We need to run the migration command before starting our application:

```bash
dotnet ef migrations add InitialMigration
dotnet ef database update
```

Ready, set, record! Here's how:

```bash
keploy record -c "dotnet run"
```

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

#### Generate testcases

To generate testcases we just need to **make some API calls.**

**1. Create User**

```bash
curl -k -X POST -H "Content-Type: application/json" -d '{"name":"Sarthak Shnygle","age":23}' http://localhost:5249/api/user
```

This will return the response:

```json
{
  "id": 1,
  "name": "Sarthak Shnygle",
  "age": 23
}
```

**2. Get the User**

```bash
curl -k http://localhost:5249/api/user
```

This will return the OTP verification response:

```json
[
  {
    "id": 1,
    "name": "Sarthak Shnygle",
    "age": 23
  }
]
```

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

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
    url: http://localhost:5249/api/user
    header:
      Accept: "*/*"
      Content-Length: "37"
      Content-Type: application/json
      Host: localhost:5249
      User-Agent: curl/8.2.1
    body: '{"age":"23","name":"Sarthak Shnygle"}'
    body_type: ""
    timestamp: 2023-12-15T10:31:57.291484259Z
    host: ""
  resp:
    status_code: 201
    header:
      Content-Type: application/json; charset=utf-8
      Date: Fri, 15 Dec 2023 10:31:57 GMT
      Location: http://localhost:5249/api/User/3
      Server: Kestrel
    body: '{"id":3,"name":"Sarthak Shnygle","age":23}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 2023-12-15T10:31:59.566772512Z
  objects: []
  assertions:
    noise:
      body.age: []
      header.Date: []
  created: 1702636319
curl: |-
  curl --request POST \
    --url http://localhost:5249/api/user \
    --header 'Host: localhost:5249' \
    --header 'User-Agent: curl/8.2.1' \
    --header 'Accept: */*' \
    --header 'Content-Type: application/json' \
    --data '{"age":"23","name":"Sarthak Shnygle"}'
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "dotnet run" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
