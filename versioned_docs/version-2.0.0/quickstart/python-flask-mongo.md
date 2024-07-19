---
id: samples-flask
title: Sample Task Creation CRUD App (Flask)
sidebar_label: Flask + Mongo
description: The following sample app showcases how to use the Flask framework and the Keploy Platform.
tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - mongodb
  - flask-framework
keyword:
  - Flask Framework
  - MongoDB
  - NoSQL
  - Python
  - API Test generator
  - Auto case generation
---

# Introduction

🪄 Dive into the world of Student CRUD Apps and see how seamlessly Keploy integrated with [Flask](https://flask.palletsprojects.com/en/3.0.x/) and [MongoDB](https://www.mongodb.com/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a simple Student Management API 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/flask-mongo
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
keploy record -c "docker compose up" --container-name "flask-app" --buildDelay 50
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Make a POST request:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Important task"}' http://localhost:5000/api/tasks
```

2. **Make a GET request:**

```bash
curl http://localhost:5000/api/tasks
```

3. **Make a PUT request:**

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Random task"}' http://localhost:5000/api/tasks/12345
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/12345
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://localhost:5000/api/tasks
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Cache-Control: no-cache
      Connection: keep-alive
      Content-Length: "59"
      Content-Type: application/json
      Host: localhost:5000
      Postman-Token: 10512b5c-4da7-4ef3-b145-101cdd1357f1
      User-Agent: PostmanRuntime/7.32.1
    body: '{"title": "Task 6","description": "Description for Task 6"}'
    timestamp: 2024-04-22T16:38:39.232565209+05:30
  resp:
    status_code: 200
    header:
      Access-Control-Allow-Origin: "*"
      Content-Length: "267"
      Content-Type: application/json
      Date: Mon, 22 Apr 2024 11:08:39 GMT
      Server: Werkzeug/3.0.2 Python/3.10.12
    body: |
      {
        "tasks": [
          {
            "description": "should update",
            "id": "6626362fc7c5eddf174c88e4",
            "title": "Updated"
          },
          {
            "description": "Should work",
            "id": "66263667c7c5eddf174c88e5",
            "title": "Let's Check another time"
          }
        ]
      }
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2024-04-22T16:38:41.245704918+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1713784121
curl: |-
  curl --request GET \
    --url http://localhost:5000/api/tasks \
    --header 'Host: localhost:5000' \
    --header 'User-Agent: PostmanRuntime/7.32.1' \
    --header 'Accept: */*' \
    --header 'Content-Type: application/json' \
    --header 'Connection: keep-alive' \
    --header 'Cache-Control: no-cache' \
    --header 'Postman-Token: 10512b5c-4da7-4ef3-b145-101cdd1357f1' \
    --header 'Accept-Encoding: gzip, deflate, br' \
    --data '{"title": "Task 6","description": "Description for Task 6"}'
```

This is how the `mocks.yml` looks like:

```yaml
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-0
spec:
  metadata:
    operation: '{ OpQuery flags: [], fullCollectionName: admin.$cmd, numberToSkip: 0, numberToReturn: -1, query: {"ismaster": {"$numberInt":"1"},"helloOk": true,"client": {"driver": {"name": "PyMongo","version": "4.6.3"},"os": {"type": "Linux","name": "Linux","architecture": "x86_64","version": "5.15.146.1-microsoft-standard-WSL2"},"platform": "CPython 3.10.12.final.0"}}, returnFieldsSelector:  }'
    type: config
  requests:
    - header:
        length: 283
        requestId: 1804289383
        responseTo: 0
        Opcode: 2004
      message:
        flags: 0
        collection_name: admin.$cmd
        number_to_skip: 0
        number_to_return: -1
        query: '{"ismaster":{"$numberInt":"1"},"helloOk":true,"client":{"driver":{"name":"PyMongo","version":"4.6.3"},"os":{"type":"Linux","name":"Linux","architecture":"x86_64","version":"5.15.146.1-microsoft-standard-WSL2"},"platform":"CPython 3.10.12.final.0"}}'
        return_fields_selector: ""
  responses:
    - header:
        length: 329
        requestId: 238
        responseTo: 1804289383
        Opcode: 1
      message:
        response_flags: 8
        cursor_id: 0
        starting_from: 0
        number_returned: 1
        documents:
          - '{"helloOk":true,"ismaster":true,"topologyVersion":{"processId":{"$oid":"6626352423399d438e00b0cf"},"counter":{"$numberLong":"0"}},"maxBsonObjectSize":{"$numberInt":"16777216"},"maxMessageSizeBytes":{"$numberInt":"48000000"},"maxWriteBatchSize":{"$numberInt":"100000"},"localTime":{"$date":{"$numberLong":"1713784113763"}},"logicalSessionTimeoutMinutes":{"$numberInt":"30"},"connectionId":{"$numberInt":"18"},"minWireVersion":{"$numberInt":"0"},"maxWireVersion":{"$numberInt":"21"},"readOnly":false,"ok":{"$numberDouble":"1.0"}}'
      read_delay: 1010011
  created: 1713784113
  reqTimestampMock: 2024-04-22T16:38:33.762559618+05:30
  resTimestampMock: 2024-04-22T16:38:33.763749062+05:30
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "docker compose up" --container-name "flask-app" --buildDelay 50 --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MongoDB) chill on Docker. Ready? Let's get the party started!🎉

## Install all dependencies

```bash
pip install -r requirements.txt
```

## Start the MongoDB server

```bash
sudo service mongod start
```

## Lights, Camera, Record! 🎥

To initiate the recording of API calls, execute this command in your terminal:

```bash
keploy record -c "python3 app.py"
```

Now, your app will start running, and you have to make some API calls to generate the test cases!!

1. **Make a POST request:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Important task"}' http://localhost:5000/api/tasks
```

2. **Make a GET request:**

```bash
curl http://localhost:5000/api/tasks
```

3. **Make a PUT request:**

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Random task"}' http://localhost:5000/api/tasks/12345
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/12345
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://localhost:5000/api/tasks
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Cache-Control: no-cache
      Connection: keep-alive
      Content-Length: "59"
      Content-Type: application/json
      Host: localhost:5000
      Postman-Token: 10512b5c-4da7-4ef3-b145-101cdd1357f1
      User-Agent: PostmanRuntime/7.32.1
    body: '{"title": "Task 6","description": "Description for Task 6"}'
    timestamp: 2024-04-22T16:38:39.232565209+05:30
  resp:
    status_code: 200
    header:
      Access-Control-Allow-Origin: "*"
      Content-Length: "267"
      Content-Type: application/json
      Date: Mon, 22 Apr 2024 11:08:39 GMT
      Server: Werkzeug/3.0.2 Python/3.10.12
    body: |
      {
        "tasks": [
          {
            "description": "should update",
            "id": "6626362fc7c5eddf174c88e4",
            "title": "Updated"
          },
          {
            "description": "Should work",
            "id": "66263667c7c5eddf174c88e5",
            "title": "Let's Check another time"
          }
        ]
      }
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2024-04-22T16:38:41.245704918+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1713784121
curl: |-
  curl --request GET \
    --url http://localhost:5000/api/tasks \
    --header 'Host: localhost:5000' \
    --header 'User-Agent: PostmanRuntime/7.32.1' \
    --header 'Accept: */*' \
    --header 'Content-Type: application/json' \
    --header 'Connection: keep-alive' \
    --header 'Cache-Control: no-cache' \
    --header 'Postman-Token: 10512b5c-4da7-4ef3-b145-101cdd1357f1' \
    --header 'Accept-Encoding: gzip, deflate, br' \
    --data '{"title": "Task 6","description": "Description for Task 6"}'
```

This is how the `mocks.yml` looks like:

```yaml
version: api.keploy.io/v1beta1
kind: Mongo
name: mock-0
spec:
  metadata:
    operation: '{ OpQuery flags: [], fullCollectionName: admin.$cmd, numberToSkip: 0, numberToReturn: -1, query: {"ismaster": {"$numberInt":"1"},"helloOk": true,"client": {"driver": {"name": "PyMongo","version": "4.6.3"},"os": {"type": "Linux","name": "Linux","architecture": "x86_64","version": "5.15.146.1-microsoft-standard-WSL2"},"platform": "CPython 3.10.12.final.0"}}, returnFieldsSelector:  }'
    type: config
  requests:
    - header:
        length: 283
        requestId: 1804289383
        responseTo: 0
        Opcode: 2004
      message:
        flags: 0
        collection_name: admin.$cmd
        number_to_skip: 0
        number_to_return: -1
        query: '{"ismaster":{"$numberInt":"1"},"helloOk":true,"client":{"driver":{"name":"PyMongo","version":"4.6.3"},"os":{"type":"Linux","name":"Linux","architecture":"x86_64","version":"5.15.146.1-microsoft-standard-WSL2"},"platform":"CPython 3.10.12.final.0"}}'
        return_fields_selector: ""
  responses:
    - header:
        length: 329
        requestId: 238
        responseTo: 1804289383
        Opcode: 1
      message:
        response_flags: 8
        cursor_id: 0
        starting_from: 0
        number_returned: 1
        documents:
          - '{"helloOk":true,"ismaster":true,"topologyVersion":{"processId":{"$oid":"6626352423399d438e00b0cf"},"counter":{"$numberLong":"0"}},"maxBsonObjectSize":{"$numberInt":"16777216"},"maxMessageSizeBytes":{"$numberInt":"48000000"},"maxWriteBatchSize":{"$numberInt":"100000"},"localTime":{"$date":{"$numberLong":"1713784113763"}},"logicalSessionTimeoutMinutes":{"$numberInt":"30"},"connectionId":{"$numberInt":"18"},"minWireVersion":{"$numberInt":"0"},"maxWireVersion":{"$numberInt":"21"},"readOnly":false,"ok":{"$numberDouble":"1.0"}}'
      read_delay: 1010011
  created: 1713784113
  reqTimestampMock: 2024-04-22T16:38:33.762559618+05:30
  resTimestampMock: 2024-04-22T16:38:33.763749062+05:30
```

## Run the tests

Now, it's time to put things to the test 🧪

```bash
keploy test -c "python3 app.py" --delay 10
```

Now, you can also try different API calls, tweak the DB response in the mocks.yml, or fiddle with the request or response in test-x.yml. Run the tests again and see the magic unfold!

## Check Test Coverage

We have a `test-app.py` where all the unit test cases has been written. Now using Keploy, we can check it's code coverage!!
Now to run your unit tests with Keploy, you can run the command given below:

```bash
python3 -m coverage run -p --data-file=.coverage.unit -m pytest -s test_keploy.py test_app.py
```

To combine the coverage from the unit tests, and Keploy's API tests we can use the command below:

```bash
python3 -m coverage combine
```

Finally, to generate the coverage report for the test run, you can run:

```bash
python3 -m coverage report
```

and if you want the coverage in an html file, you can run:

```bash
python3 -m coverage html
```

## Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
