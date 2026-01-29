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

# Using Docker Compose 🐳

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

A sample CRUD app to test Keploy integration capabilities using FastHttp and Postgres

<InstallReminder />

### Clone a sample CRUD App 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/fasthttp-postgres
go mod download
```

### Lights, Camera, Record! 🎥

Fire up the application and Postgres instance with Keploy. Keep an eye on the two key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--container-name`: The container name in the `docker-compose.yml` for traffic interception.

#### Capture the test case

```bash
keploy record -c "docker compose up" --container-name "fasthttp_app" --build-delay 50
```

> `--build-delay` adds a buffer (in seconds) to allow images to build/pull and services to start before Keploy begins interception. If your services are already up, you can omit it.

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Generate a Test Case

```bash
curl --request POST \
--url http://localhost:8080/authors \
--header 'content-type: application/json' \
--data '{"name":"Author Name"}'
```

Here's a peek of what you get:

```json
{"id": 1, "name": "Author Name"}
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
    url: http://localhost:8080/authors
    header:
      Accept: "*/*"
      Content-Length: "23"
      Content-Type: application/json
      Host: localhost:8080
      User-Agent: curl/7.68.0
    body: |-
      {"name":"Author Name"}
    body_type: ""
  resp:
    status_code: 201
    header:
      Content-Type: application/json
    body: '{"id": 1, "name": "Author Name"}'
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

#### Fetch Books from App

```bash
curl --request GET --url http://localhost:8080/books
```

Spotted the new test and mock files in your project? High five! 🙌

### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name "fasthttp_app" --build-delay 50 --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

<SectionDivider />

---

# Running App Locally on Linux/WSL 🐧

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

A sample CRUD app to test Keploy integration capabilities using FastHttp and Postgres

<InstallReminder />

### Clone a sample CRUD App 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/fasthttp-postgres
go mod download
```

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (Postgres) chill on Docker. Ready? Let's get the party started!🎉

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

#### 🍃 Kickstart PostgresDB

Let's breathe life into your Postgres container. A simple spell should do the trick:

```bash
docker compose up -d postgres
```

### 📼 Roll the Tape - Recording Time!

First, build the application:

```bash
go build -o app
```

Ready, set, record! Here's how:

```bash
keploy record -c "./app"
```

Keep an eye out for the `-c `flag! It's the command charm to run the app. Whether you're using `go run main.go` or the binary path like `./app`, it's your call.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

#### Generate a Test Case

✨ A pinch of POST magic:

```bash
curl --request POST \
--url http://localhost:8080/authors \
--header 'content-type: application/json' \
--data '{"name":"Author Name"}'
```

And... voila! An Author entry appears:

```json
{"id": 1, "name": "Author Name"}
```

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

Now, the real fun begins. Let's weave more spells!

#### Fetch Books from App

🚀 Follow the URL road...!

```bash
curl --request GET --url http://localhost:8080/books
```

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

### Run Tests 🏁

Ready to put your spells to the test?

```bash
keploy test -c "./app" --delay 10
```

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .
