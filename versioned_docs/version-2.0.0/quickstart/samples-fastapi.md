---
id: samples-fastapi
title: FastAPI SQL Sample Application
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

# FastAPI-Postgres CRUD Application

A sample user data CRUD app to test Keploy integration capabilities using [FastAPI](https://fastapi.tiangolo.com/) and [PostgreSQL](https://www.postgresql.org/). <br>
Make the following requests to the respective endpoints -

1. `GET students/` - Get all students.
2. `GET students/{id}` - Get a student by id.
3. `POST students/` - Create a student.
4. `PUT students/{id}` - Update a student by id.
5. `DELETE students/{id}` - Delete a student by id.

## Installation Setup

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/fastapi-postgres
pip3 install -r requirements.txt
```

## Installation Keploy

Keploy can be installed on Linux directly and on Windows with the help of WSL. Based on your system architecture, install the keploy latest binary release

**1. AMD Architecture**

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

<details>
<summary> 2. ARM Architecture </summary>

```shell
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

</details>

### Starting the PostgreSQL Instance

```bash
# Start the application
docker-compose up -d
```

### Capture the Testcases

This command will start the recording of API calls using ebpf:-

```shell
sudo -E keploy record -c "uvicorn application.main:app --reload"
```

Make API Calls using Hoppscotch, Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

### Make a POST request

```bash
curl --location 'http://127.0.0.1:8000/students/' \
--header 'Content-Type: application/json' \
--data-raw '{
      "name": "Eva White",
      "email": "evawhite@example.com",
      "password": "evawhite111"
    }'
```

```bash
curl --location 'http://127.0.0.1:8000/students/' \
--header 'Content-Type: application/json' \
--data-raw '    {
      "name": "John Doe",
      "email": "johndoe@example.com",
      "password": "johndoe123"
    }'
```

### Make a GET request to get all the data

```bash
curl --location 'http://127.0.0.1:8000/students/'
```

This will return all the data saved in the database.

### Make a GET request to get a specific data

```bash
curl --location 'http://127.0.0.1:8000/students/1'
```

### Make a PUT request to update a specific data

```bash
curl --location --request PUT 'http://127.0.0.1:8000/students/2' \
--header 'Content-Type: application/json' \
--data-raw '    {
        "name": "John Dow",
        "email": "doe.john@example.com",
        "password": "johndoe123",
        "stream": "Arts"
    }'
```

### Make a DELETE request to delete a specific data

```bash
curl --location --request DELETE 'http://127.0.0.1:8000/students/1'
```

Now all these API calls were captured as **editable** testcases and written to `keploy/tests` folder. The keploy directory would also have `mocks` file that contains all the outputs of postgres operations.

## Run the Testcases

Now let's run the application in test mode.

```shell
sudo -E keploy test -c "uvicorn application.main:app --reload" --delay 10
```

So, no need to setup fake database/apis like Postgres or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to Postgres 😄**