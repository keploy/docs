---
id: samples-fastapi
title: Sample Student Data CRUD App (FastAPI)
description: The following sample app showcases how to use the FastAPI framework and the Keploy Platform.
tags:
  - FastAPI Framework
  - Postgres
  - SQL
keyword:
  - FastAPI Framework
  - Postgres
  - SQL
  - Python
  - API Test generator
  - Auto case generation
---

# Introduction

🪄 Dive into the world of User CRUD Apps and see how seamlessly Keploy integrated with [FastAPI](https://fastapi.tiangolo.com/) and [PostgreSQL](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

## Pre-Requisite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.
- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.

## Get Started! 🎬

## Setup the PostgreSQL Database 📦

Create a docker network, run -

```bash
docker network create backend
```

Start the Postgres instance using the `docker-compose` file-

```bash
docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d --network backend --name mypostgres postgres
```

```bash
docker build -t fastapi-app:1.0 .
```

## Clone the sample Student Data CRUD app 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/fastapi-postgres
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
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Capture the test-cases-

  ```shell
  keploy record -c "docker run -p 8000:8000 --name FastapiApp --network backend --name fastapiPostgresApp fastapi-app:1.0"
  ```

  🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  Let's make URLs short and sweet:

  ### Generate testcases

  To generate testcases we just need to **make some API calls.**

  **1. Make a POST request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "Eva White",
      "email": "evawhite@example.com",
      "password": "evawhite111"
      }'
  ```

  **2. Make a GET request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/'
  ```

  **3. Make a PUT request**

  ```bash
  curl --location --request PUT 'http://127.0.0.1:8000/students/1' \
  --header 'Content-Type: application/json' \
  --data-raw '    {
          "name": "John Dow",
          "email": "doe.john@example.com",
          "password": "johndoe123",
          "stream": "Arts"
      }'
  ```

  **4. Make a GET request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/1'
  ```

  **5. Make a DELETE request**

  ```bash
  curl --location --request DELETE 'http://127.0.0.1:8000/students/1'
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
      url: http://127.0.0.1:8000/students/
      header:
        Accept: "*/*"
        Host: 127.0.0.1:8000
        User-Agent: curl/7.81.0
      body: ""
      body_type: ""
      timestamp: 2023-11-06T10:42:43.046337785+05:30
    resp:
      status_code: 404
      header:
        Content-Length: "29"
        Content-Type: application/json
        Date: Mon, 06 Nov 2023 05:12:42 GMT
        Server: uvicorn
      body: '{"detail":"Data not found!!"}'
      body_type: ""
      status_message: ""
      proto_major: 0
      proto_minor: 0
      timestamp: 2023-11-06T10:42:45.959907593+05:30
    objects: []
    assertions:
      noise:
        - header.Date
    created: 1699247565
  curl: |
    curl --request GET \
    --url http://127.0.0.1:8000/students/ \
    --header 'User-Agent: curl/7.81.0' \
    --header 'Accept: */*' \
    --header 'Host: 127.0.0.1:8000' \
  ```

  This is how `mocks.yml` generated would look like:-

  ```yaml
    version: api.keploy.io/v1beta2
    kind: Postgres
    name: mocks
    spec:
        metadata: {}
        postgresrequests:
            - header: [Q]
            identifier: ClientRequest
            length: 8
            query:
                string: SELECT students."ID" AS "students_ID", students."Name" AS "students_Name", students."Email" AS "students_Email", students."Hashed Password" AS "students_Hashed Password", students."Subject Stream" AS "students_Subject Stream" FROM students LIMIT 100 OFFSET 0
            msg_type: 81
            auth_type: 0
        postgresresponses:
            - header: [T, C, Z]
            identifier: ServerResponse
            length: 8
            authentication_md5_password:
                salt:
                    - 0
                    - 0
                    - 0
                    - 0
            command_complete:
                - command_tag:
                    - 83
                    - 69
                    - 76
                    - 69
                    - 67
                    - 84
                    - 32
                    - 48
            ready_for_query:
                txstatus: 84
            row_description: {fields: [{name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 73, 68], table_oid: 24577, table_attribute_number: 1, data_type_oid: 23, data_type_size: 4, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 78, 97, 109, 101], table_oid: 24577, table_attribute_number: 2, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 69, 109, 97, 105, 108], table_oid: 24577, table_attribute_number: 3, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 72, 97, 115, 104, 101, 100, 32, 80, 97, 115, 115, 119, 111, 114, 100], table_oid: 24577, table_attribute_number: 4, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 83, 117, 98, 106, 101, 99, 116, 32, 83, 116, 114, 101, 97, 109], table_oid: 24577, table_attribute_number: 5, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}]}
            msg_type: 90
            auth_type: 0
        reqtimestampmock: 2023-11-06T10:42:43.063446464+05:30
        restimestampmock: 2023-11-06T10:42:43.063544657+05:30
  ```

  Want to see if everything works as expected?

  #### Run Tests

  Time to put things to the test 🧪

  ```shell
  keploy test -c "docker run -p 8000:8000 --name FastapiApp --network backend --name fastapiPostgresApp fastapi-app:1.0" --delay 10
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

  We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (PostgreSQL) chill on Docker. Ready? Let's get the party started!🎉

  ### 📼 Roll the Tape - Recording Time!

  Ready, set, record! Here's how:

  ```bash
  keploy record -c "uvicorn application.main:app --reload"
  ```

  Keep an eye out for the `-c `flag! It's the command charm to run the app.

  Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

  ### Generate testcases

  To generate testcases we just need to **make some API calls.**

  **1. Make a POST request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "Eva White",
      "email": "evawhite@example.com",
      "password": "evawhite111"
      }'
  ```

  **2. Make a GET request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/'
  ```

  **3. Make a PUT request**

  ```bash
  curl --location --request PUT 'http://127.0.0.1:8000/students/1' \
  --header 'Content-Type: application/json' \
  --data-raw '    {
          "name": "John Dow",
          "email": "doe.john@example.com",
          "password": "johndoe123",
          "stream": "Arts"
      }'
  ```

  **4. Make a GET request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/1'
  ```

  **5. Make a DELETE request**

  ```bash
  curl --location --request DELETE 'http://127.0.0.1:8000/students/1'
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
      url: http://127.0.0.1:8000/students/
      header:
        Accept: "*/*"
        Host: 127.0.0.1:8000
        User-Agent: curl/7.81.0
      body: ""
      body_type: ""
      timestamp: 2023-11-06T10:42:43.046337785+05:30
    resp:
      status_code: 404
      header:
        Content-Length: "29"
        Content-Type: application/json
        Date: Mon, 06 Nov 2023 05:12:42 GMT
        Server: uvicorn
      body: '{"detail":"Data not found!!"}'
      body_type: ""
      status_message: ""
      proto_major: 0
      proto_minor: 0
      timestamp: 2023-11-06T10:42:45.959907593+05:30
    objects: []
    assertions:
      noise:
        - header.Date
    created: 1699247565
  curl: |
    curl --request GET \
    --url http://127.0.0.1:8000/students/ \
    --header 'User-Agent: curl/7.81.0' \
    --header 'Accept: */*' \
    --header 'Host: 127.0.0.1:8000' \
  ```

  This is how `mocks.yml` generated would look like:-

  ```yaml
    version: api.keploy.io/v1beta2
    kind: Postgres
    name: mocks
    spec:
        metadata: {}
        postgresrequests:
            - header: [Q]
            identifier: ClientRequest
            length: 8
            query:
                string: SELECT students."ID" AS "students_ID", students."Name" AS "students_Name", students."Email" AS "students_Email", students."Hashed Password" AS "students_Hashed Password", students."Subject Stream" AS "students_Subject Stream" FROM students LIMIT 100 OFFSET 0
            msg_type: 81
            auth_type: 0
        postgresresponses:
            - header: [T, C, Z]
            identifier: ServerResponse
            length: 8
            authentication_md5_password:
                salt:
                    - 0
                    - 0
                    - 0
                    - 0
            command_complete:
                - command_tag:
                    - 83
                    - 69
                    - 76
                    - 69
                    - 67
                    - 84
                    - 32
                    - 48
            ready_for_query:
                txstatus: 84
            row_description: {fields: [{name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 73, 68], table_oid: 24577, table_attribute_number: 1, data_type_oid: 23, data_type_size: 4, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 78, 97, 109, 101], table_oid: 24577, table_attribute_number: 2, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 69, 109, 97, 105, 108], table_oid: 24577, table_attribute_number: 3, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 72, 97, 115, 104, 101, 100, 32, 80, 97, 115, 115, 119, 111, 114, 100], table_oid: 24577, table_attribute_number: 4, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 83, 117, 98, 106, 101, 99, 116, 32, 83, 116, 114, 101, 97, 109], table_oid: 24577, table_attribute_number: 5, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}]}
            msg_type: 90
            auth_type: 0
        reqtimestampmock: 2023-11-06T10:42:43.063446464+05:30
        restimestampmock: 2023-11-06T10:42:43.063544657+05:30
  ```

  Want to see if everything works as expected?

  #### Run Tests

  Time to put things to the test 🧪

  ```shell
  keploy test -c "uvicorn application.main:app --reload" --delay 10
  ```

  > The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

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
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Capture the test-cases-

  ```shell
  keploy record -c "docker run -p 8000:8000 --name FastapiApp --network backend --name fastapiPostgresApp fastapi-app:1.0"
  ```

  🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  Let's make URLs short and sweet:

  ### Generate testcases

  To generate testcases we just need to **make some API calls.**

  **1. Make a POST request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "name": "Eva White",
      "email": "evawhite@example.com",
      "password": "evawhite111"
      }'
  ```

  **2. Make a GET request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/'
  ```

  **3. Make a PUT request**

  ```bash
  curl --location --request PUT 'http://127.0.0.1:8000/students/1' \
  --header 'Content-Type: application/json' \
  --data-raw '    {
          "name": "John Dow",
          "email": "doe.john@example.com",
          "password": "johndoe123",
          "stream": "Arts"
      }'
  ```

  **4. Make a GET request**

  ```bash
  curl --location 'http://127.0.0.1:8000/students/1'
  ```

  **5. Make a DELETE request**

  ```bash
  curl --location --request DELETE 'http://127.0.0.1:8000/students/1'
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
      url: http://127.0.0.1:8000/students/
      header:
        Accept: "*/*"
        Host: 127.0.0.1:8000
        User-Agent: curl/7.81.0
      body: ""
      body_type: ""
      timestamp: 2023-11-06T10:42:43.046337785+05:30
    resp:
      status_code: 404
      header:
        Content-Length: "29"
        Content-Type: application/json
        Date: Mon, 06 Nov 2023 05:12:42 GMT
        Server: uvicorn
      body: '{"detail":"Data not found!!"}'
      body_type: ""
      status_message: ""
      proto_major: 0
      proto_minor: 0
      timestamp: 2023-11-06T10:42:45.959907593+05:30
    objects: []
    assertions:
      noise:
        - header.Date
    created: 1699247565
  curl: |
    curl --request GET \
    --url http://127.0.0.1:8000/students/ \
    --header 'User-Agent: curl/7.81.0' \
    --header 'Accept: */*' \
    --header 'Host: 127.0.0.1:8000' \
  ```

  This is how `mocks.yml` generated would look like:-

  ```yaml
    version: api.keploy.io/v1beta2
    kind: Postgres
    name: mocks
    spec:
        metadata: {}
        postgresrequests:
            - header: [Q]
            identifier: ClientRequest
            length: 8
            query:
                string: SELECT students."ID" AS "students_ID", students."Name" AS "students_Name", students."Email" AS "students_Email", students."Hashed Password" AS "students_Hashed Password", students."Subject Stream" AS "students_Subject Stream" FROM students LIMIT 100 OFFSET 0
            msg_type: 81
            auth_type: 0
        postgresresponses:
            - header: [T, C, Z]
            identifier: ServerResponse
            length: 8
            authentication_md5_password:
                salt:
                    - 0
                    - 0
                    - 0
                    - 0
            command_complete:
                - command_tag:
                    - 83
                    - 69
                    - 76
                    - 69
                    - 67
                    - 84
                    - 32
                    - 48
            ready_for_query:
                txstatus: 84
            row_description: {fields: [{name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 73, 68], table_oid: 24577, table_attribute_number: 1, data_type_oid: 23, data_type_size: 4, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 78, 97, 109, 101], table_oid: 24577, table_attribute_number: 2, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 69, 109, 97, 105, 108], table_oid: 24577, table_attribute_number: 3, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 72, 97, 115, 104, 101, 100, 32, 80, 97, 115, 115, 119, 111, 114, 100], table_oid: 24577, table_attribute_number: 4, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}, {name: [115, 116, 117, 100, 101, 110, 116, 115, 95, 83, 117, 98, 106, 101, 99, 116, 32, 83, 116, 114, 101, 97, 109], table_oid: 24577, table_attribute_number: 5, data_type_oid: 1043, data_type_size: -1, type_modifier: -1, format: 0}]}
            msg_type: 90
            auth_type: 0
        reqtimestampmock: 2023-11-06T10:42:43.063446464+05:30
        restimestampmock: 2023-11-06T10:42:43.063544657+05:30
  ```

  Want to see if everything works as expected?

  #### Run Tests

  Time to put things to the test 🧪

  ```shell
  keploy test -c "docker run -p 8000:8000 --name FastapiApp --network backend --name fastapiPostgresApp fastapi-app:1.0" --delay 10
  ```

  > The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

  Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
  </details>
