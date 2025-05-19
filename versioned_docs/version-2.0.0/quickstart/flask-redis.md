---
id: flask-redis
title: Sample Library App (Flask + Redis)
sidebar_label: Flask + Redis
description: This application is a simple Library API built using Flask and Redis for data storage. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on Movie records.

tags:
  - flask
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - redis
keyword:
  - FastAPI Framework
  - Flask
  - Redis
  - Python
  - API Test generator
  - Auto case generation
---

## Introduction

🪄 Dive into the world of Student CRUD Apps and see how seamlessly Keploy integrated with Flask and Redis. Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone the application 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/flask-redis
```

## Installation Keploy

Depending on your OS, choose your adventure:

We are going to run the application the following way

- [Using Docker compose : running application as well as Mongo on Docker container](#using-docker-compose-)

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
```

### **Time to run the testcases**

```bash
keploy test -c 'sudo docker compose up' --containerName "flask-web" --delay 10
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

2. ERROR: for redis 'ContainerConfig'

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
