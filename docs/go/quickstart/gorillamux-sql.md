---
id: gorillamux-sql
title: Sample Application with Gorilla/Mux-SQL
sidebar_label: Gorilla/Mux-SQL Sample
tags:
  - hello-world
  - go
  - sdk
  - tutorial
---

# URL Shortener Sample App

A sample contact keeper app to test Keploy integration capabilities using [Gorilla Mux](https://pkg.go.dev/github.com/gorilla/mux) and [sql](https://dev.mysql.com/).

## Installation

Navigate to [Installation guide](../../server/server-installation.md) to quickly install and run the keploy server.

### Setup Gorilla/Mux-SQL App

```bash
git clone https://github.com/keploy/samples-go && cd mux-sql
go mod download
```

### Start Keploy Record Mode and start go server

```bash
export KEPLOY_MODE=record
```

### Start the postgres SQL server

```bash
docker-compose up -d
```

### Run the application

```shell
go run .
```

## Generate testcases

To generate testcases we just need to **make some API calls.** You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

### 1. Generate shortened url

```bash
curl --request POST \
  --url http://localhost:8082/url \
  --header 'content-type: application/json' \
  --data '{
  "url": "https://google.com"
}'
```

this will return the response. The ts would automatically be ignored during testing because it'll always be different.

```
{
  "ts": 1645540022,
  "url": "http://localhost:8082/Lhr4BWAi"
}
```

### 2. Redirect to original url from shortened url

```bash
curl --request GET \
  --url http://localhost:8082/Lhr4BWAi
```

or by querying through the browser `http://localhost:8082/Lhr4BWAi`

Now both these API calls were captured as editable testcases and written to `keploy/tests` folder. The keploy directory would also have mocks folder that contains all the outputs of postgres operations. Here's what the folder structure look like:

```bash
.
├── README.md
├── docker-compose.yml
├── go.mod
├── go.sum
├── keploy
│   ├── tests
│       ├── test-1.yaml
│       ├── test-2.yaml
│   └── mocks
│       ├── mock-1.yaml
│       └── mock-2.yaml

```

You should be seeing an app named `sample-url-shortener` with the test cases we just captured.

![Gin-Mongo-test-cases](/img/Gorillamux-SQL-test-cases.png)

Now, let's see the magic! 🪄💫

## Generate Test Runs

To generate Test Runs, **close the application** and **run the below command** in the same _users-profile_ directory:

```
export KEPLOY_MODE=test
go test -v -coverpkg=./... -covermode=atomic  ./...
```

Once done, the Keploy terminal should look like this:

![keploy-test-runs](/img/Gorillamux-test-runs.png)
