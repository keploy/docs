---
id: samples-fastapi-twilio
title: Sample SMS Sending App (FastAPI-Twilio)
sidebar_label: FastAPI + Twilio (HTTP)
description: The following sample app showcases how to use the FastAPI framework with Twilio's SMS Service and the Keploy Platform.
tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - fast-api-framework
  - postgres
  - sms
  - twilio
keyword:
  - FastAPI Framework
  - Twilio
  - SMS
  - Python
  - API Test generator
  - Auto case generation
---

# Introduction

🪄 Dive into the world of SMS Sending Apps and see how seamlessly Keploy can be integrated with [FastAPI](https://fastapi.tiangolo.com/) and [Twilio](https://www.twilio.com/en-us). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Setup the Twilio Account 💬

You can get your Twilio credentials by signing in to [Twilio Console](https://console.twilio.com/).
Once you get the `Twilio Account SID, Auth Token, and Phone Number`, modify the `.env` file with your credentials.

## Clone the Sample App 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/fastapi-twilio
```

## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker : running application](#using-docker-compose-)
- [Running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Mongo on Docker container.

### Lights, Camera, Record! 🎥

Create the docker image of the app:

```bash
docker build -t fastapi-twilio:1.0 .
```

Capture the test-cases-

```shell
keploy record -c "docker run -p 8000:8000 --name fastapi-twilio fastapi-twilio:1.0"
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

**Make the POST requests**

    1. Replace the place holder below i.e. `YOUR_REGISTERED_PERSONAL_PHONE_NUMBER` with your registered personal phone number that you linked with Twilio.

     ```bash
     curl --location 'http://127.0.0.1:8000/send-sms/' \
     --header 'Content-Type: application/json' \
     --data '{
         "Body": "Test, testtt, testttttttssss :)",
         "To": "YOUR_REGISTERED_PERSONAL_PHONE_NUMBER",
     }'
     ```

    2. Replace the place holder below i.e. `SOME_WRONG_PHONE_NUMBER` with any wrong phone number and make the request.

     ```bash
     curl --location 'http://127.0.0.1:8000/send-sms/' \
     --header 'Content-Type: application/json' \
     --data '{
         "Body": "Test, testtt, testttttttssss :)",
         "To": "SOME_WRONG_PHONE_NUMBER",
     }'
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
    url: http://127.0.0.1:8000/send-sms/
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Connection: keep-alive
      Content-Length: "75"
      Content-Type: application/json
      Host: 127.0.0.1:8000
      Postman-Token: c871b715-7aae-46b6-8e0d-1341aa426624
      User-Agent: PostmanRuntime/7.34.0
    body: |-
      {
          "Body": "Test, testtt, testttttttssss :)",
          "To": "+91700004379"
      }
    body_type: ""
    timestamp: 2023-11-14T14:56:25.800517709+05:30
  resp:
    status_code: 200
    header:
      Content-Length: "73"
      Content-Type: application/json
      Date: Tue, 14 Nov 2023 09:26:25 GMT
      Server: uvicorn
    body: '{"message":"Failed to send SMS. Please check the provided phone number."}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 2023-11-14T14:56:32.013566624+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1699953992
curl: |-
  curl --request POST \
  --url http://127.0.0.1:8000/send-sms/ \
  --header 'User-Agent: PostmanRuntime/7.34.0' \
  --header 'Accept: */*' \
  --header 'Postman-Token: c871b715-7aae-46b6-8e0d-1341aa426624' \
  --header 'Host: 127.0.0.1:8000' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'Content-Type: application/json' \
  --data '{
      "Body": "Test, testtt, testttttttssss :)",
      "To": "+91700004379"
  }'
```

This is how `mocks.yml` generated would look like:-

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: mocks
spec:
  metadata:
    name: Http
    operation: POST
    type: HTTP_CLIENT
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: /2010-04-01/Accounts/AC19413687d9ce28c80cda944730f8b286/Messages.json
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate
      Authorization: Basic QUMxOTQxMzY4N2Q5Y2UyOGM4MGNkYTk0NDczMGY4YjI4NjpjMTc0MDc5YzU2NTA0N2FmYWJmNDk5MWI2ZGQ1MmFiYg==
      Connection: keep-alive
      Content-Length: "81"
      Content-Type: application/x-www-form-urlencoded
      User-Agent: python-requests/2.31.0
    body: Body=Test%2C+testtt%2C+testttttttssss+%3A%29&From=%2B16413324066&To=%2B9170000437
    body_type: ""
    timestamp: 0001-01-01T00:00:00Z
  resp:
    status_code: 400
    header:
      Access-Control-Allow-Credentials: "true"
      Access-Control-Allow-Headers: Accept, Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, Idempotency-Key
      Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
      Access-Control-Allow-Origin: "*"
      Access-Control-Expose-Headers: ETag
      Connection: keep-alive
      Content-Length: 335,335
      Content-Type: application/json
      Date: Tue, 14 Nov 2023 09:27:21 GMT
      Twilio-Concurrent-Requests: "1"
      Twilio-Request-Duration: "0.080"
      Twilio-Request-Id: RQb54d7f05d29e83bc89889cc136bcd99d
      X-Api-Domain: api.twilio.com
      X-Home-Region: us1
      X-Powered-By: AT-5000
      X-Shenanigans: none
    body: '{"code": 21608, "message": "The number +917000XXXX is unverified. Trial accounts cannot send messages to unverified numbers; verify +917000XXXX at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers", "more_info": "https://www.twilio.com/docs/errors/21608", "status": 400}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 0001-01-01T00:00:00Z
  objects: []
  created: 1699954041
  reqTimestampMock: 2023-11-14T14:57:20.914415283+05:30
  resTimestampMock: 2023-11-14T14:57:21.298027703+05:30
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "docker run -p 8000:8000 --name fastapi-twilio fastapi-twilio:1.0" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the Twilio response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

Install Python's virtual environment library:

```bash
pip3 install virtualenv
```

Create a virtual environment and activate it:

```bash
python3 -m virtualenv venv && source venv/bin/activate
```

Install the dependencies using the `requirements.txt` file:

```bash
pip3 install -r requirements.txt
```

Ready, set, record! Here's how:

```bash
keploy record -c "uvicorn application.main:app --reload"
```

Keep an eye out for the `-c `flag! It's the command charm to run the app.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

### Generate testcases

To generate testcases we just need to **make some API calls.**

**Make the POST requests**

    1. Replace the place holder below i.e. `YOUR_REGISTERED_PERSONAL_PHONE_NUMBER` with your registered personal phone number that you linked with Twilio.

     ```bash
     curl --location 'http://127.0.0.1:8000/send-sms/' \
     --header 'Content-Type: application/json' \
     --data '{
         "Body": "Test, testtt, testttttttssss :)",
         "To": "YOUR_REGISTERED_PERSONAL_PHONE_NUMBER",
     }'
     ```

    2. Replace the place holder below i.e. `SOME_WRONG_PHONE_NUMBER` with any wrong phone number and make the request.

     ```bash
     curl --location 'http://127.0.0.1:8000/send-sms/' \
     --header 'Content-Type: application/json' \
     --data '{
         "Body": "Test, testtt, testttttttssss :)",
         "To": "SOME_WRONG_PHONE_NUMBER",
     }'
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
    url: http://127.0.0.1:8000/send-sms/
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Connection: keep-alive
      Content-Length: "75"
      Content-Type: application/json
      Host: 127.0.0.1:8000
      Postman-Token: c871b715-7aae-46b6-8e0d-1341aa426624
      User-Agent: PostmanRuntime/7.34.0
    body: |-
      {
          "Body": "Test, testtt, testttttttssss :)",
          "To": "+91700004379"
      }
    body_type: ""
    timestamp: 2023-11-14T14:56:25.800517709+05:30
  resp:
    status_code: 200
    header:
      Content-Length: "73"
      Content-Type: application/json
      Date: Tue, 14 Nov 2023 09:26:25 GMT
      Server: uvicorn
    body: '{"message":"Failed to send SMS. Please check the provided phone number."}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 2023-11-14T14:56:32.013566624+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1699953992
curl: |-
  curl --request POST \
  --url http://127.0.0.1:8000/send-sms/ \
  --header 'User-Agent: PostmanRuntime/7.34.0' \
  --header 'Accept: */*' \
  --header 'Postman-Token: c871b715-7aae-46b6-8e0d-1341aa426624' \
  --header 'Host: 127.0.0.1:8000' \
  --header 'Accept-Encoding: gzip, deflate, br' \
  --header 'Connection: keep-alive' \
  --header 'Content-Type: application/json' \
  --data '{
      "Body": "Test, testtt, testttttttssss :)",
      "To": "+91700004379"
  }'
```

This is how `mocks.yml` generated would look like:-

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: mocks
spec:
  metadata:
    name: Http
    operation: POST
    type: HTTP_CLIENT
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: /2010-04-01/Accounts/AC19413687d9ce28c80cda944730f8b286/Messages.json
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate
      Authorization: Basic QUMxOTQxMzY4N2Q5Y2UyOGM4MGNkYTk0NDczMGY4YjI4NjpjMTc0MDc5YzU2NTA0N2FmYWJmNDk5MWI2ZGQ1MmFiYg==
      Connection: keep-alive
      Content-Length: "81"
      Content-Type: application/x-www-form-urlencoded
      User-Agent: python-requests/2.31.0
    body: Body=Test%2C+testtt%2C+testttttttssss+%3A%29&From=%2B16413324066&To=%2B9170000437
    body_type: ""
    timestamp: 0001-01-01T00:00:00Z
  resp:
    status_code: 400
    header:
      Access-Control-Allow-Credentials: "true"
      Access-Control-Allow-Headers: Accept, Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since, Idempotency-Key
      Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS
      Access-Control-Allow-Origin: "*"
      Access-Control-Expose-Headers: ETag
      Connection: keep-alive
      Content-Length: 335,335
      Content-Type: application/json
      Date: Tue, 14 Nov 2023 09:27:21 GMT
      Twilio-Concurrent-Requests: "1"
      Twilio-Request-Duration: "0.080"
      Twilio-Request-Id: RQb54d7f05d29e83bc89889cc136bcd99d
      X-Api-Domain: api.twilio.com
      X-Home-Region: us1
      X-Powered-By: AT-5000
      X-Shenanigans: none
    body: '{"code": 21608, "message": "The number +917000XXXX is unverified. Trial accounts cannot send messages to unverified numbers; verify +917000XXXX at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers", "more_info": "https://www.twilio.com/docs/errors/21608", "status": 400}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 0001-01-01T00:00:00Z
  objects: []
  created: 1699954041
  reqTimestampMock: 2023-11-14T14:57:20.914415283+05:30
  resTimestampMock: 2023-11-14T14:57:21.298027703+05:30
```

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "uvicorn application.main:app --reload" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the Twilio response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
