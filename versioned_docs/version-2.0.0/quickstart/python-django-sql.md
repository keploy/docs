---
id: samples-django
title: Sample User Data CRUD App (Django)
sidebar_label: Django + Postgres
description: The following sample app showcases how to use the Django framework and the Keploy Platform.
tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - postgres
keyword:
  - Django Framework
  - Postgres
  - SQL
  - Python
  - API Test generator
  - Auto case generation
---

# Introduction

🪄 Dive into the world of User CRUD Apps and see how seamlessly Keploy integrated with [Django](https://www.djangoproject.com/) and [PostgreSQL](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a sample user data CRUD app 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/django-postgres/django_postgres
```

## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Postgres on Docker container](#using-docker-compose-)
- [Using Docker container for Postgres and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Postgres on Docker container.

### Lights, Camera, Record! 🎥

#### Start Postgres Instance

Start the Postgres instance using the `docker-compose` file-

```bash
docker compose up -d
```

Change the database configuration in `django_postgres/settings.py` file to:

```python
DATABASES = {
  'default': {
      'ENGINE': 'django.db.backends.postgresql',
      'NAME': 'usersdb',
      'USER': 'postgres',
      'PASSWORD': 'postgres',
      'HOST': 'mypostgres',
      'PORT': '5432',
  }
}
```

Build the app image:

```bash
docker build -t django-app:1.0 .
```

Capture the test-cases-

```shell
keploy record -c "docker run -p 8000:8000 --name djangoApp --network keploy-network django-app:1.0"
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

**1. Make a POST request**

```bash
curl --location 'http://127.0.0.1:8000/user/' \
--header 'Content-Type: application/json' \
--data-raw '    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "smith567",
      "website": "www.janesmith.com"
  }'
```

**2. Make a GET request**

```bash
curl --location 'http://127.0.0.1:8000/user/'
```

**3. Make a PUT request**

```bash
curl --location --request PUT 'http://127.0.0.1:8000/user/efbe12df-3cae-4cbc-b045-dc74840aa82b/' \
--header 'Content-Type: application/json' \
--data-raw '    {
      "name": "Jane Smith",
      "email": "smith.jane@example.com",
      "password": "smith567",
      "website": "www.smithjane.com"
  }'
```

**4. Make a GET request**

```bash
curl --location 'http://127.0.0.1:8000/user/c793c752-ad95-4cff-8cbe-5715a1e8a76e/'
```

**5. Make a DELETE request**

```bash
 curl --location --request DELETE 'http://127.0.0.1:8000/user/ee2af3fc-0503-4a6a-a452-b7d8c87a085b/'
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
    url: http://127.0.0.1:8000/user/
    header:
      Accept: "*/*"
      Host: 127.0.0.1:8000
      User-Agent: curl/7.81.0
    body: ""
    body_type: ""
    timestamp: 2023-11-05T12:49:22.444698436+05:30
  resp:
    status_code: 200
    header:
      Allow: POST, OPTIONS, GET
      Content-Length: "31"
      Content-Type: application/json
      Cross-Origin-Opener-Policy: same-origin
      Date: Sun, 05 Nov 2023 07:19:22 GMT
      Referrer-Policy: same-origin
      Server: WSGIServer/0.2 CPython/3.10.12
      Vary: Accept, Cookie
      X-Content-Type-Options: nosniff
      X-Frame-Options: DENY
    body: '{"message": "No Users Found!!"}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 2023-11-05T12:49:24.85684599+05:30
  objects: []
  assertions:
    noise:
      - header.Date
      - header.Allow
      - header.Vary
  created: 1699168764
curl: |
  curl --request GET \
  --url http://127.0.0.1:8000/user/ \
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
              string: SELECT "application_user"."id", "application_user"."name", "application_user"."email", "application_user"."password", "application_user"."website" FROM "application_user"
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
              txstatus: 73
          row_description: {fields: [{name: [105, 100], table_oid: 24705, table_attribute_number: 1, data_type_oid: 2950, data_type_size: 16, type_modifier: -1, format: 0}, {name: [110, 97, 109, 101], table_oid: 24705, table_attribute_number: 2, data_type_oid: 1043, data_type_size: -1, type_modifier: 54, format: 0}, {name: [101, 109, 97, 105, 108], table_oid: 24705, table_attribute_number: 3, data_type_oid: 1043, data_type_size: -1, type_modifier: 258, format: 0}, {name: [112, 97, 115, 115, 119, 111, 114, 100], table_oid: 24705, table_attribute_number: 4, data_type_oid: 1043, data_type_size: -1, type_modifier: 54, format: 0}, {name: [119, 101, 98, 115, 105, 116, 101], table_oid: 24705, table_attribute_number: 5, data_type_oid: 1043, data_type_size: -1, type_modifier: 54, format: 0}]}
          msg_type: 90
          auth_type: 0
      reqtimestampmock: 2023-11-05T12:49:22.471612071+05:30
      restimestampmock: 2023-11-05T12:49:22.47169658+05:30
```

Want to see if everything works as expected?

#### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "docker run -p 8000:8000 --rm --network keploy-network --name djangoApp django-app:1.0" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

**\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\_\_\_\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\*\*\***\*\*\***

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (PostgreSQL) chill on Docker. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

To create the required tables in the database, run:

```bash
python3 manage.py makemigrations
python3 manage.py migrate
```

Using the docker-compose file we will start our Postgres instance:-

```bash
docker compose up -d
```

Ready, set, record! Here's how:

```bash
sudo -E PATH=$PATH keploy record -c "python3 manage.py runserver"
```

Keep an eye out for the `-c `flag! It's the command charm to run the app.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

### Generate testcases

To generate testcases we just need to **make some API calls.**

**1. Make a POST request**

```bash
curl --location 'http://127.0.0.1:8000/user/' \
--header 'Content-Type: application/json' \
--data-raw '    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "smith567",
      "website": "www.janesmith.com"
  }'
```

**2. Make a GET request**

```bash
curl --location 'http://127.0.0.1:8000/user/'
```

**3. Make a PUT request**

```bash
curl --location --request PUT 'http://127.0.0.1:8000/user/efbe12df-3cae-4cbc-b045-dc74840aa82b/' \
--header 'Content-Type: application/json' \
--data-raw '    {
      "name": "Jane Smith",
      "email": "smith.jane@example.com",
      "password": "smith567",
      "website": "www.smithjane.com"
  }'
```

**4. Make a GET request**

```bash
curl --location 'http://127.0.0.1:8000/user/c793c752-ad95-4cff-8cbe-5715a1e8a76e/'
```

**5. Make a DELETE request**

```bash
 curl --location --request DELETE 'http://127.0.0.1:8000/user/ee2af3fc-0503-4a6a-a452-b7d8c87a085b/'
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
    url: http://127.0.0.1:8000/user/
    header:
      Accept: "*/*"
      Host: 127.0.0.1:8000
      User-Agent: curl/7.81.0
    body: ""
    body_type: ""
    timestamp: 2023-11-05T12:49:22.444698436+05:30
  resp:
    status_code: 200
    header:
      Allow: POST, OPTIONS, GET
      Content-Length: "31"
      Content-Type: application/json
      Cross-Origin-Opener-Policy: same-origin
      Date: Sun, 05 Nov 2023 07:19:22 GMT
      Referrer-Policy: same-origin
      Server: WSGIServer/0.2 CPython/3.10.12
      Vary: Accept, Cookie
      X-Content-Type-Options: nosniff
      X-Frame-Options: DENY
    body: '{"message": "No Users Found!!"}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
    timestamp: 2023-11-05T12:49:24.85684599+05:30
  objects: []
  assertions:
    noise:
      - header.Date
      - header.Allow
      - header.Vary
  created: 1699168764
curl: |
  curl --request GET \
  --url http://127.0.0.1:8000/user/ \
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
              string: SELECT "application_user"."id", "application_user"."name", "application_user"."email", "application_user"."password", "application_user"."website" FROM "application_user"
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
              txstatus: 73
          row_description: {fields: [{name: [105, 100], table_oid: 24705, table_attribute_number: 1, data_type_oid: 2950, data_type_size: 16, type_modifier: -1, format: 0}, {name: [110, 97, 109, 101], table_oid: 24705, table_attribute_number: 2, data_type_oid: 1043, data_type_size: -1, type_modifier: 54, format: 0}, {name: [101, 109, 97, 105, 108], table_oid: 24705, table_attribute_number: 3, data_type_oid: 1043, data_type_size: -1, type_modifier: 258, format: 0}, {name: [112, 97, 115, 115, 119, 111, 114, 100], table_oid: 24705, table_attribute_number: 4, data_type_oid: 1043, data_type_size: -1, type_modifier: 54, format: 0}, {name: [119, 101, 98, 115, 105, 116, 101], table_oid: 24705, table_attribute_number: 5, data_type_oid: 1043, data_type_size: -1, type_modifier: 54, format: 0}]}
          msg_type: 90
          auth_type: 0
      reqtimestampmock: 2023-11-05T12:49:22.471612071+05:30
      restimestampmock: 2023-11-05T12:49:22.47169658+05:30
```

Want to see if everything works as expected?

#### Run Tests

Time to put things to the test 🧪

```shell
sudo -E PATH=$PATH keploy test -c "python3 manage.py runserver" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
