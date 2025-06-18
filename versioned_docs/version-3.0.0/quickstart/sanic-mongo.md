---
id: sanic-mongo
title: Sample Movie Management App (Sanic + Mongo)
sidebar_label: Sanic + Mongo
description: This application is a simple movie management API built using Python's Sanic framework and MongoDB for data storage. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on Movie records.

tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - sanic
  - postgres
  - sms
  - Mongo
keyword:
  - FastAPI Framework
  - MongoDB
  - Sanic
  - Python
  - API Test generator
  - Auto case generation
---

## Introduction

This application is a simple movie management API built using Python's Sanic framework and MongoDB for data storage. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on Movie records.

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

# Get Started! 🎬

## Clone the app 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/sanic-mongo
```

## Download the requirements.txt file and DB setup

Head to the folder of the application and run

```shell
pip3 install -r requirements.txt
```

Open a different terminal and setup your MongoDB through docker

```shell
sudo docker network create keploy-network
```

```shell
docker run -p 27017:27017 -d --rm --name mongoDB --net keploy-network mongo
```

## Lights, Camera, Record! 🎥

Capture the test-cases-

```shell
keploy record -c "python3 server.py"
```

You should be able to see this in your terminal

<img src="/docs/img/sanic-mongo-record.png" alt="Sample Keploy record sanic mongo" width="100%" style={{ borderRadius: '5px' }} />

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

## Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Make a POST request:**

```bash
  curl -X "POST" "http://127.0.0.1:8000/add_movie" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json; charset=utf-8' \
    -d '{
        "name": "Whiplash"
    }'
```

2. **Make a GET request:**

```bash
  curl -X "GET" "http://127.0.0.1:8000/movies" \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json; charset=utf-8'
```

3. **Make a DELETE request:**

```bash
  curl -X "DELETE" "http://127.0.0.1:8000/movies" \
    -H 'Accept: application/json' \
    -H 'Content-Type: application/json; charset=utf-8'

```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

This is an example of what your mocks would look like

```yaml
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-0
spec:
  metadata:
    operation: '{ OpQuery flags: [], fullCollectionName: admin.$cmd, numberToSkip: 0, numberToReturn: -1, query: {"ismaster": {"$numberInt":"1"},"helloOk": true,"client": {"driver": {"name": "PyMongo|Motor","version": "4.6.3|3.4.0"},"os": {"type": "Linux","name": "Linux","architecture": "x86_64","version": "5.15.146.1-microsoft-standard-WSL2"},"platform": "CPython 3.10.12.final.0|asyncio"}}, returnFieldsSelector:  }'
    type: config
  requests:
    - header:
        length: 303
        requestId: 1804289383
        responseTo: 0
        Opcode: 2004
      message:
        flags: 0
        collection_name: admin.$cmd
        number_to_skip: 0
        number_to_return: -1
        query: '{"ismaster":{"$numberInt":"1"},"helloOk":true,"client":{"driver":{"name":"PyMongo|Motor","version":"4.6.3|3.4.0"},"os":{"type":"Linux","name":"Linux","architecture":"x86_64","version":"5.15.146.1-microsoft-standard-WSL2"},"platform":"CPython 3.10.12.final.0|asyncio"}}'
        return_fields_selector: ""
  responses:
    - header:
        length: 329
        requestId: 13
        responseTo: 1804289383
        Opcode: 1
      message:
        response_flags: 8
        cursor_id: 0
        starting_from: 0
        number_returned: 1
        documents:
          - '{"helloOk":true,"ismaster":true,"topologyVersion":{"processId":{"$oid":"667b1d2066b0c1d16885b016"},"counter":{"$numberLong":"0"}},"maxBsonObjectSize":{"$numberInt":"16777216"},"maxMessageSizeBytes":{"$numberInt":"48000000"},"maxWriteBatchSize":{"$numberInt":"100000"},"localTime":{"$date":{"$numberLong":"1719344783026"}},"logicalSessionTimeoutMinutes":{"$numberInt":"30"},"connectionId":{"$numberInt":"4"},"minWireVersion":{"$numberInt":"0"},"maxWireVersion":{"$numberInt":"21"},"readOnly":false,"ok":{"$numberDouble":"1.0"}}'
      read_delay: 560917
  created: 1719344783
  reqTimestampMock: 2024-06-26T01:16:23.025984506+05:30
  resTimestampMock: 2024-06-26T01:16:23.026710262+05:30
```

## **Time to put things to the test 🧪:**

```bash
 keploy test -c "python server.py"
```

This is how your terminal would look like :

<img src="/docs/img/sanic-mongo-test.png" alt="Sample Keploy Test Sanic Mongo" width="100%" style={{ borderRadius: '5px' }} />

You can experiment with different API calls, modify the database response in mocks.yml, or adjust the request or response in test-x.yml. Then, run the tests again to see the change in response
