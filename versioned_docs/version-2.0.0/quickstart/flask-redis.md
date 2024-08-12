---
id: flask-redis
title: Sample Movie Management App (Sanic + Mongo)
sidebar_label: Sanic+Mongo
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
  - Flasl
  - Redis
  - Python
  - API Test generator
  - Auto case generation
---

## Introduction

🪄 Dive into the world of Student CRUD Apps and see how seamlessly Keploy integrated with [Flask](https://flask.palletsprojects.com/en/3.0.x/) and [Redis](https://redis.io/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a simple Student Management API 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/flask-redis
```

## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Mongo on Docker container](#using-docker-compose-)
- [Using Docker container for Mongo and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Mongo on Docker container.

### Lights, Camera, Record! 🎥

Capture the test-cases-

```shell
keploy record -c "docker compose up" --container-name "flask-web" --buildDelay 50
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Make a POST request:**

```bash
curl -X POST http://localhost:5000/books/ \
-H "Content-Type: application/json" \
-d '{"title": "1984", "author": "George Orwell"}'
```

2. **Make a GET request:**

```bash
curl -X GET "http://localhost:5000/books/?page=1&limit=10"
```

3. **Make a PUT request:**

```bash
curl -X PUT http://localhost:5000/books/1 \
-H "Content-Type: application/json" \
-d '{"title": "1984 - Updated", "author": "George Orwell"}'
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:5000/books/1
```

**Time to run the testcases**

```bash
keploy test -c 'sudo docker compose up' --containerName "flask-web" --delay 10
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

```yaml
version: api.keploy.io/v1beta1
kind: Redis
name: mock-0
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*4\r\n$6\r\nCLIENT\r\n$7\r\nSETINFO\r\n$8\r\nLIB-NAME\r\n$8\r\nredis-py\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "+OK\r\n"
    reqtimestampmock: 2024-08-02T22:15:10.6084523Z
    restimestampmock: 2024-08-02T22:15:10.608930466Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-1
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*4\r\n$6\r\nCLIENT\r\n$7\r\nSETINFO\r\n$7\r\nLIB-VER\r\n$5\r\n5.0.8\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "+OK\r\n"
    reqtimestampmock: 2024-08-02T22:15:10.610066633Z
    restimestampmock: 2024-08-02T22:15:10.610752633Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-2
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*3\r\n$6\r\nINCRBY\r\n$7\r\nbook_id\r\n$1\r\n1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":1\r\n"
    reqtimestampmock: 2024-08-02T22:15:10.611978716Z
    restimestampmock: 2024-08-02T22:15:10.612786841Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-3
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*6\r\n$4\r\nHSET\r\n$6\r\nbook:1\r\n$5\r\ntitle\r\n$4\r\n1984\r\n$6\r\nauthor\r\n$13\r\nGeorge Orwell\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":2\r\n"
    reqtimestampmock: 2024-08-02T22:15:10.613938591Z
    restimestampmock: 2024-08-02T22:15:10.614915925Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-4
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$3\r\nGET\r\n$18\r\nbooks_cache:page_1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "$-1\r\n"
    reqtimestampmock: 2024-08-02T22:15:17.343482553Z
    restimestampmock: 2024-08-02T22:15:17.344991261Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-5
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$4\r\nKEYS\r\n$6\r\nbook:*\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "*1\r\n$6\r\nbook:1\r\n"
    reqtimestampmock: 2024-08-02T22:15:17.345461178Z
    restimestampmock: 2024-08-02T22:15:17.346119386Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-6
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$7\r\nHGETALL\r\n$6\r\nbook:1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "*4\r\n$5\r\ntitle\r\n$4\r\n1984\r\n$6\r\nauthor\r\n$13\r\nGeorge Orwell\r\n"
    reqtimestampmock: 2024-08-02T22:15:17.346484636Z
    restimestampmock: 2024-08-02T22:15:17.346881469Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-7
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*4\r\n$5\r\nSETEX\r\n$18\r\nbooks_cache:page_1\r\n$3\r\n300\r\n$46\r\n[{\"title\": \"1984\", \"author\": \"George Orwell\"}]\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "+OK\r\n"
    reqtimestampmock: 2024-08-02T22:15:17.347539428Z
    restimestampmock: 2024-08-02T22:15:17.348107886Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-8
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$7\r\nHGETALL\r\n$6\r\nbook:1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "*4\r\n$5\r\ntitle\r\n$4\r\n1984\r\n$6\r\nauthor\r\n$13\r\nGeorge Orwell\r\n"
    reqtimestampmock: 2024-08-02T22:15:24.91868625Z
    restimestampmock: 2024-08-02T22:15:24.918989625Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-9
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$3\r\nGET\r\n$17\r\nsearch:books:1984\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "$-1\r\n"
    reqtimestampmock: 2024-08-02T22:15:32.959388379Z
    restimestampmock: 2024-08-02T22:15:32.959604088Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-10
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$4\r\nKEYS\r\n$6\r\nbook:*\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "*1\r\n$6\r\nbook:1\r\n"
    reqtimestampmock: 2024-08-02T22:15:32.959842713Z
    restimestampmock: 2024-08-02T22:15:32.959998921Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-11
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$7\r\nHGETALL\r\n$6\r\nbook:1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "*4\r\n$5\r\ntitle\r\n$4\r\n1984\r\n$6\r\nauthor\r\n$13\r\nGeorge Orwell\r\n"
    reqtimestampmock: 2024-08-02T22:15:32.960231671Z
    restimestampmock: 2024-08-02T22:15:32.960389213Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-12
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*4\r\n$5\r\nSETEX\r\n$17\r\nsearch:books:1984\r\n$3\r\n300\r\n$46\r\n[{\"title\": \"1984\", \"author\": \"George Orwell\"}]\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "+OK\r\n"
    reqtimestampmock: 2024-08-02T22:15:32.960706004Z
    restimestampmock: 2024-08-02T22:15:32.960838838Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-13
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$6\r\nEXISTS\r\n$6\r\nbook:1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":1\r\n"
    reqtimestampmock: 2024-08-02T22:15:39.801969841Z
    restimestampmock: 2024-08-02T22:15:39.802299174Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-14
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*4\r\n$4\r\nHSET\r\n$6\r\nbook:1\r\n$5\r\ntitle\r\n$14\r\n1984 - Updated\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":0\r\n"
    reqtimestampmock: 2024-08-02T22:15:39.802669008Z
    restimestampmock: 2024-08-02T22:15:39.803126174Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-15
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*4\r\n$4\r\nHSET\r\n$6\r\nbook:1\r\n$6\r\nauthor\r\n$13\r\nGeorge Orwell\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":0\r\n"
    reqtimestampmock: 2024-08-02T22:15:39.803492508Z
    restimestampmock: 2024-08-02T22:15:39.803768216Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-16
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*3\r\n$4\r\nHGET\r\n$6\r\nbook:1\r\n$5\r\ntitle\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "$14\r\n1984 - Updated\r\n"
    reqtimestampmock: 2024-08-02T22:15:39.804229258Z
    restimestampmock: 2024-08-02T22:15:39.804523466Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-17
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*3\r\n$4\r\nHGET\r\n$6\r\nbook:1\r\n$6\r\nauthor\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "$13\r\nGeorge Orwell\r\n"
    reqtimestampmock: 2024-08-02T22:15:39.805022091Z
    restimestampmock: 2024-08-02T22:15:39.805174924Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-18
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*6\r\n$5\r\nHMSET\r\n$6\r\nbook:1\r\n$5\r\ntitle\r\n$14\r\n1984 - Updated\r\n$6\r\nauthor\r\n$13\r\nGeorge Orwell\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: "+OK\r\n"
    reqtimestampmock: 2024-08-02T22:15:39.806458299Z
    restimestampmock: 2024-08-02T22:15:39.807372758Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-19
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$6\r\nEXISTS\r\n$6\r\nbook:1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":1\r\n"
    reqtimestampmock: 2024-08-02T22:15:47.227235428Z
    restimestampmock: 2024-08-02T22:15:47.227446803Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-20
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$3\r\nDEL\r\n$6\r\nbook:1\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":1\r\n"
    reqtimestampmock: 2024-08-02T22:15:47.227812303Z
    restimestampmock: 2024-08-02T22:15:47.228129511Z
---
version: api.keploy.io/v1beta1
kind: Redis
name: mock-21
spec:
    metadata:
        type: config
    redisrequests:
        - origin: client
          message:
            - type: string
              data: "*2\r\n$3\r\nDEL\r\n$18\r\nbooks_cache:page_*\r\n"
    redisresponses:
        - origin: server
          message:
            - type: string
              data: ":0\r\n"
    reqtimestampmock: 2024-08-02T22:15:47.228357053Z
    restimestampmock: 2024-08-02T22:15:47.228491803Z
```
You can also check the test summary from your cli 

```bash
<=========================================> 
  COMPLETE TESTRUN SUMMARY. 
        Total tests: 11
        Total test passed: 10
        Total test failed: 1
        Total time taken: "15.13 s"

        Test Suite Name         Total Test      Passed          Failed          Time Taken

        "test-set-0"            6               6               0               "5.06 s"
        "test-set-1"            1               1               0               "5.02 s"
        "test-set-2"            4               3               1               "5.04 s"
<=========================================> 
```

## Some errors you may run into ?

1. While running the application you might have some ports up and running that you are trying to access again. This would throw a EBPF error

You can check the ports from the below command and 

```bash
sudo lsof -p
```

If you want to check which process is using a specific port (e.g., port 5000), use:

```bash
sudo lsof -i :5000
```

Once you have identified the PID of the process using the port you need, you can terminate the process with the kill command:

```bash
sudo kill -9 <PID>
```

2. ERROR: for redis  'ContainerConfig'

The KeyError: 'ContainerConfig' issue you're encountering with Docker Compose is indicative of a problem with the Docker Compose file or its version compatibility. 

Here’s how you can address and troubleshoot this error:

```bash 
sudo apt-get update
sudo apt-get install docker-compose
```

Check your compose file's permissions 

```bash
ls -l docker-compose.yml
```

Re-run the record or test command from above 



