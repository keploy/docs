---
id: samples-django
title: Django SQL Sample Application
description: The following sample app showcases how to use the Django framework and the Keploy Platform.
tags:
  - Django Framework
  - Postgres
  - SQL
keyword:
  - Django Framework
  - Postgres
  - SQL
  - Python
  - API Test generator
  - Auto case generation
---

# User Data CRUD Application

A sample user data CRUD app to test Keploy integration capabilities using [Django](https://www.djangoproject.com/) and PostgreSQL.

## Installation Setup

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/django-postgres/django_postgres
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

### Setting Django Application

This is a one-time setup of the Django application.

```bash
python3 -m virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate
```

### Capture the test cases

This command will start the recording of API calls using eBPF:-

```shell
sudo -E keploy record -c "python3 manage.py runserver"
```

Make API Calls using Hoppscotch, Postman, or cURL commands. Keploy with capture those calls to generate the test-suites containing test cases and data mocks.

### Generate test cases

To generate test cases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

### Make a POST request

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

```bash
curl --location 'http://127.0.0.1:8000/user/' \
--header 'Content-Type: application/json' \
--data-raw '    {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "john567",
        "website": "www.johndoe.com"
    }'
```

### Make a GET request to get all the data

```bash
curl --location 'http://127.0.0.1:8000/user/'
```

This will return all the data saved in the database.

### Make a GET request to get specific data

```bash
curl --location 'http://127.0.0.1:8000/user/c793c752-ad95-4cff-8cbe-5715a1e8a76e/'
```

### Make a PUT request to update specific data

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

### Make a DELETE request to delete specific data

```bash
curl --location --request DELETE 'http://127.0.0.1:8000/user/ee2af3fc-0503-4a6a-a452-b7d8c87a085b/'
```

Now all these API calls were captured as **editable** test cases and written to the `keploy/tests` folder. The keploy directory would also have a `mocks` file that contains all the outputs of Postgres operations.

## Run the Testcases

Now let's run the application in test mode.

```shell
sudo -E keploy test -c "python3 manage.py runserver" --delay 10
```

So no need to set up fake databases/APIs like Postgres or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to Postgres 😄**
