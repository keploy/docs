---
id: samples-mux
title: Sample Product Catelog App (Golang)
sidebar_label: Mux + Postgres
description: The following sample app showcases how to use Mux framework and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - Mux Framework
  - Postgres
  - SQL
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of URL shorteners and see how seamlessly Keploy integrates with [Mux](https://github.com/gorilla/mux) and [mongoDB](https://www.mongodb.com/). Buckle up, it's gonna be a fun ride! 🎢

## Pre-Requisite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.
- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.

## Get Started! 🎬

## Clone a sample URL shortener app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/mux-sql
go mod download
```

## Installation 📥

Depending on your OS, choose your adventure:

- <details>
   <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>

  Alright, let's equip ourselves with the **latest Keploy binary**:

  ```bash
  curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

  sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
  ```

  If everything goes right, your screen should look a bit like this:

   <img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

  Moving on...
   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}> Run App with <img src="/docs/img/os/docker.png" alt="Docker Container" width="3%" /> Docker </summary>

  #### Add alias for Keploy:

  ```bash
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
  `-c`: Command to run the app (e.g., `docker compose up`).

  `--containerName`: The container name in the `docker-compose.yml` for traffic interception.

  ```bash
  keploy record -c "docker compose up" --containerName "muxSqlApp"
  ```

  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  Let's make URLs short and sweet:

  #### Generate shortened url

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

  #### Fetch Product from Catelog

  ```bash
  curl --request GET \  --url http://localhost:8010/products
  ```

  Or just type `http://localhost:8010/products` in your browser. Your choice!

  Spotted the new test and mock files in your project? High five! 🙌

  #### Run Tests

  Time to put things to the test 🧪

  ```bash
  keploy test -c "docker compose up" --containerName "muxSqlApp" --delay 10
  ```

  > The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨

   </details>
   <br/>

   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}>Run App on 🐧 Linux  </summary>

  We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (mongoDB) chill on Docker. Ready? Let's get the party started!🎉

  First things first, update the First things first, update the postgres host on **line 10** in main.go, update the host to `localhost`.

  #### 🍃 Kickstart PostgresDB

  Let's breathe life into your mongo container. A simple spell should do the trick:

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

  #### Generate shortened url

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

  And... voila! A shortened URL appears:

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

  #### Fetch Product from Catelog

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

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>

   </details>

   <br/>

- <details>
   <summary><img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs </summary>

  Dive straight in, but first, give **Colima** a gentle nudge with (`colima start`). Let's make sure it's awake and ready for action!

  #### Add alias for Keploy 🐰:

  For the sake of convenience (and a bit of Mac magic 🪄), let's set up a shortcut for Keploy:

  ```bash
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v debugfs:/sys/kernel/debug:rw -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock -v '"$HOME"'/.keploy-config:/root/.keploy-config -v '"$HOME"'/.keploy:/root/.keploy --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
  `-c`: Command to run the app (e.g., `docker compose up`).

  `--containerName`: The container name in the `docker-compose.yml` for traffic interception.

  ```bash
  keploy record -c "docker compose up" --containerName "muxSqlApp"
  ```

  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  Let's make URLs short and sweet:

  #### Generate Testcases

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

  #### Fetch Product from Catelog

  ```bash
  curl --request GET \  --url http://localhost:8010/products
  ```

  Or just type `http://localhost:8010/products` in your browser. Your choice!

  Spotted the new test and mock files in your project? High five! 🙌

  <img src="/docs/img/mux-sql-test-cases.png" alt="Sample Keploy Test case and Mock for Mux SQL" width="100%" style={{ borderRadius: '5px' }}/>

  Want to see if everything works as expected?

  #### Run Tests

  Time to put things to the test 🧪

  ```bash
  keploy test -c "docker compose up" --containerName "muxSqlApp" --delay 10
  ```

  > The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>
