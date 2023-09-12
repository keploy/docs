---
id: samples-gin
title: Gin Mongo Sample Application
description: The following sample app showcases how to use gin framework and the Keploy Platform.
tags:
  - Gin Framework
  - MongoDB
keyword:
  - Gin Framework
  - MongoDB
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A sample url shortener app to test Keploy integration capabilities using [Gin](https://gin-gonic.com/) and [mongoDB](https://www.mongodb.com/).

## Setup URL shortener

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download
```

## Capture the testcases

Now, we will create the binary of our application:-

```zsh
go build
```

Once we have our binary file ready,this command will start the recording of API calls using ebpf:-

```shell
sudo -E keploy record -c "./test-app-url-shortener"
```

Make API Calls using Hoppscotch, Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

## Generate testcases

To generate testcases we just need to **make some API calls.** You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

### 1. Generate shortened url

```bash
curl --request POST \
  --url http://localhost:8080/url \
  --header 'content-type: application/json' \
  --data '{
  "url": "https://google.com"
}'
```

this will return the shortened url. The ts would automatically be ignored during testing because it'll always be different.

```json
{
  "ts": 1645540022,
  "url": "http://localhost:8080/Lhr4BWAi"
}
```

### 2. Redirect to original url from shortened url

```bash
curl --request GET \
  --url http://localhost:8080/Lhr4BWAi
```

or by querying through the browser `http://localhost:8080/Lhr4BWAi`

You'll be able to see new test file and mock file generated in your project codebase locally.

## Run the Test Mode

Run this command on your terminal to run the testcases and generate the test coverage report:-

```shell
sudo -E keploy test -c "./test-app-url-shortener" --delay 10
```
