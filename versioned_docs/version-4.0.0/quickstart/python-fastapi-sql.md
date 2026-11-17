---
id: samples-fastapi
title: Sample Student Data CRUD App
sidebar_label: FastAPI + Postgres
description: The following sample app showcases how to use the FastAPI framework and the Keploy Platform.
tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - fast-api-framework
  - postgres
keywords:
  - FastAPI Framework
  - Postgres
  - SQL
  - Python
  - API Test generator
  - Auto case generation
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Sample Student Data CRUD App — record and replay tests with Keploy"
description="Clone the sample app, run it under Keploy to capture API traffic, then replay the recorded testcases."
totalTime="PT10M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["Keploy CLI", "Docker", "git"]}
visible={false}
steps={[
{
name: "Install Keploy",
text: "Install the Keploy CLI with the install script from https://keploy.io/install.sh (on Windows x86-64, keploy.exe from PowerShell: https://keploy.io/docs/installation/windows-installation/#option-1-run-keploy-natively). Run the app locally on Linux/WSL; on macOS, or on Windows without WSL, use the Docker Compose steps, since natively there Keploy captures PostgreSQL calls only as raw bytes that usually don't replay.",
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

## Using Docker Compose 🐳

<ProductTier tiers="Free, Teams, Scale, Enterprise" />

🪄 Dive into the world of User CRUD Apps and see how seamlessly Keploy integrated with FastAPI and PostgreSQL. Buckle up, it's gonna be a fun ride! 🎢

import Link from '@docusaurus/Link'
import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';
import ProductTier from '@site/src/components/ProductTier';

<InstallReminder />

### Clone the sample Student Data CRUD app 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/fastapi-postgres
```

### Point the app at the Postgres container 🔌

The app runs in a container, so it must reach Postgres by its compose service name instead of `localhost`. In both `application/main.py` and `application/database.py`, change `@localhost:5432` to `@postgres:5432` in `SQLALCHEMY_DATABASE_URL`.

### Lights, Camera, Record! 🎥

Capture the test-cases-

```shell
keploy record -c "docker compose up" --container-name "fastapi-app" --build-delay 50
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

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `keploy/test-set-0/tests/` (one file per call, e.g. `post-students-1.yaml`) and `keploy/test-set-0/mocks.yaml`.

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: get-students-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://127.0.0.1:8000/students/
    header:
      Accept: '*/*'
      Host: 127.0.0.1:8000
      User-Agent: curl/8.7.1
    body: ""
    timestamp: 2026-11-16T12:37:17.039514963Z
  resp:
    status_code: 200
    header:
      Content-Length: "109"
      Content-Type: application/json
      Date: Mon, 16 Nov 2026 12:37:16 GMT
      Server: uvicorn
    body: '[{"name":"Eva White","email":"evawhite@example.com","password":"sfwbxijuf222","stream":"Mathematics","id":1}]'
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2026-11-16T12:37:17.044762963Z
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1794832637
  app_port: 8000
curl: |
  curl --request GET \
    --url http://127.0.0.1:8000/students/ \
    --header 'Accept: */*' \
    --header 'Host: 127.0.0.1:8000' \
    --header 'User-Agent: curl/8.7.1' \
```

This is how the generated `mocks.yaml` would look like:-

```yaml
version: api.keploy.io/v1beta1
kind: PostgresV3
name: mock-28
spec:
    metadata:
        bindEncoding: wire
        class: APP
        connID: "2"
        destAddr: 172.21.0.2:5432
        lifetime: perTest
        type: mocks
    postgresV3:
        type: query
        query:
            class: APP
            lifetime: perTest
            sqlAstHash: sha256:c7ada4e1d75ca3577e3832dabf1d290a894d7a9b47164ad99cc809a9f0384b30
            sqlNormalized: "SELECT students.\"ID\" AS \"students_ID\", students.\"Name\" AS \"students_Name\", students.\"Email\" AS \"students_Email\", students.\"Hashed Password\" AS \"students_Hashed Password\", students.\"Subject Stream\" AS \"students_Subject Stream\" \nFROM students \n LIMIT $2 OFFSET $1"
            invocationId: sha256:c7ada4e1d75ca3577e3832dabf1d290a894d7a9b47164ad99cc809a9f0384b30:2:2026-11-16T12:37:17.042651505Z:24
            precedingTxState: in_tx
            bindValues:
                - !!binary MTAw
                - !!binary MA==
            bindFormats:
                - 0
                - 0
            response:
                rowDescription:
                    - name: students_ID
                      tableOid: 16386
                      colAttrNum: 1
                      typeOid: 23
                      typeSize: 4
                      typeMod: -1
                    - name: students_Name
                      tableOid: 16386
                      colAttrNum: 2
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                    - name: students_Email
                      tableOid: 16386
                      colAttrNum: 3
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                    - name: students_Hashed Password
                      tableOid: 16386
                      colAttrNum: 4
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                    - name: students_Subject Stream
                      tableOid: 16386
                      colAttrNum: 5
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                rows:
                    - - 1
                      - Eva White
                      - evawhite@example.com
                      - sfwbxijuf222
                      - Mathematics
                commandComplete: SELECT 1
            sideEffects: {}
    reqTimestampMock: 2026-11-16T12:37:17.042651505Z
    resTimestampMock: 2026-11-16T12:37:17.043078546Z
connectionId: "2"
```

Want to see if everything works as expected?

#### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "docker compose up" --container-name "fastapi-app" --build-delay 50  --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yaml`, or fiddle with the request or response in the files under `tests/`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

<SectionDivider />

## Running App Locally on Linux/WSL 🐧

<ProductTier tiers="Free, Teams, Scale, Enterprise" />

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (PostgreSQL) chill on Docker. Ready? Let's get the party started!🎉

This section runs on Linux or WSL. On macOS, or on Windows without WSL, use the [Docker Compose steps](#using-docker-compose-) instead — natively there, Keploy captures PostgreSQL calls only as raw bytes, which usually don't replay.

<InstallReminder />

### Clone the sample Student Data CRUD app 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/fastapi-postgres
```

### Lights, Camera, Record! 🎥

Capture the test-cases-

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

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `keploy/test-set-0/tests/` (one file per call, e.g. `post-students-1.yaml`) and `keploy/test-set-0/mocks.yaml`.

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: get-students-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://127.0.0.1:8000/students/
    header:
      Accept: '*/*'
      Host: 127.0.0.1:8000
      User-Agent: curl/8.7.1
    body: ""
    timestamp: 2026-11-16T12:37:17.039514963Z
  resp:
    status_code: 200
    header:
      Content-Length: "109"
      Content-Type: application/json
      Date: Mon, 16 Nov 2026 12:37:16 GMT
      Server: uvicorn
    body: '[{"name":"Eva White","email":"evawhite@example.com","password":"sfwbxijuf222","stream":"Mathematics","id":1}]'
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2026-11-16T12:37:17.044762963Z
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1794832637
  app_port: 8000
curl: |
  curl --request GET \
    --url http://127.0.0.1:8000/students/ \
    --header 'Accept: */*' \
    --header 'Host: 127.0.0.1:8000' \
    --header 'User-Agent: curl/8.7.1' \
```

This is how the generated `mocks.yaml` would look like:-

```yaml
version: api.keploy.io/v1beta1
kind: PostgresV3
name: mock-28
spec:
    metadata:
        bindEncoding: wire
        class: APP
        connID: "2"
        destAddr: 172.21.0.2:5432
        lifetime: perTest
        type: mocks
    postgresV3:
        type: query
        query:
            class: APP
            lifetime: perTest
            sqlAstHash: sha256:c7ada4e1d75ca3577e3832dabf1d290a894d7a9b47164ad99cc809a9f0384b30
            sqlNormalized: "SELECT students.\"ID\" AS \"students_ID\", students.\"Name\" AS \"students_Name\", students.\"Email\" AS \"students_Email\", students.\"Hashed Password\" AS \"students_Hashed Password\", students.\"Subject Stream\" AS \"students_Subject Stream\" \nFROM students \n LIMIT $2 OFFSET $1"
            invocationId: sha256:c7ada4e1d75ca3577e3832dabf1d290a894d7a9b47164ad99cc809a9f0384b30:2:2026-11-16T12:37:17.042651505Z:24
            precedingTxState: in_tx
            bindValues:
                - !!binary MTAw
                - !!binary MA==
            bindFormats:
                - 0
                - 0
            response:
                rowDescription:
                    - name: students_ID
                      tableOid: 16386
                      colAttrNum: 1
                      typeOid: 23
                      typeSize: 4
                      typeMod: -1
                    - name: students_Name
                      tableOid: 16386
                      colAttrNum: 2
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                    - name: students_Email
                      tableOid: 16386
                      colAttrNum: 3
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                    - name: students_Hashed Password
                      tableOid: 16386
                      colAttrNum: 4
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                    - name: students_Subject Stream
                      tableOid: 16386
                      colAttrNum: 5
                      typeOid: 1043
                      typeSize: -1
                      typeMod: -1
                rows:
                    - - 1
                      - Eva White
                      - evawhite@example.com
                      - sfwbxijuf222
                      - Mathematics
                commandComplete: SELECT 1
            sideEffects: {}
    reqTimestampMock: 2026-11-16T12:37:17.042651505Z
    resTimestampMock: 2026-11-16T12:37:17.043078546Z
connectionId: "2"
```

Want to see if everything works as expected?

#### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "uvicorn application.main:app --reload" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yaml`, or fiddle with the request or response in the files under `tests/`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

## Related

- [Sample Python Apps](/docs/quickstart/python-filter/) — Browse more Python Keploy samples.
- [Sample User Data CRUD App (Django)](/docs/quickstart/samples-django/) — Another Python SQL CRUD app.
- [Sample Task Creation CRUD App](/docs/quickstart/samples-flask/) — Python Flask CRUD sample.
- [Sample SMS Sending App](/docs/quickstart/samples-fastapi-twilio/) — FastAPI with external API integration.
