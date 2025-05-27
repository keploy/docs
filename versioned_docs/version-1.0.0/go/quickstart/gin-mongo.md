---
id: gin-mongo
title: Sample Gin-Mongo Application with the Go (v1.0.0)
sidebar_label: Gin-Mongo Sample
tags:
  - hello-world
  - go
  - sdk
  - tutorial
keywords:
  - SDK
  - Docker
  - MongoDB
  - golang gin
---

# URL Shortener Sample App

A sample url shortener app to test Keploy integration capabilities using Gin and mongoDB .

## Installation

Navigate to [Installation guide](../../server/server-installation.md) to quickly install and run the keploy server.

### Setup URL shortener

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download
```

### Start Keploy Record Mode

```bash
export KEPLOY_MODE=record
```

### Start the MongoDB server

```bash
docker container run -it -p27017:27017 mongo
```

### Run the application

```shell
go run handler.go main.go
```

## Generate testcases

To generate testcases we just need to **make some API calls.** You can use [Postman](https://www.postman.com/), or simply `curl`

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

```
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
If you're using Keploy cloud, open [this](https://app.keploy.io/) to see captured test-cases visually.

You should be seeing an app named `sample-url-shortener` with the test cases we just captured.

![Gin-Mongo-test-cases](/img/Gin-Mongo-test-cases.png)

Now, let's see the magic! 🪄💫

## Test mode

There are 2 ways to test the application with Keploy.

1. [Unit Test File](/docs/1.0.0/go/quickstart/gin-mongo#testing-using-unit-test-file)
2. [KEPLOY_MODE environment variable](/docs/1.0.0/go/quickstart/gin-mongo#testing-using-keploy_mode-env-variable)

### Testing using Unit Test File

Now that we have our testcase captured, run the unit test file (`main_test.go`) already present in the sample app repo.

If not present, you can add `main_test.go` in the root of your sample application.

```go
  package main

  import (
    "github.com/keploy/go-sdk/keploy"
    "testing"
  )

  func TestKeploy(t *testing.T) {
      keploy.SetTestMode()
      go main()
      keploy.AssertTests(t)
}
```

To automatically download and run the captured test-cases. Let's run the test-file.

```shell
 go test -coverpkg=./... -covermode=atomic  ./...
```

output should look like -

```shell
ok      test-app-url-shortener  6.557s  coverage: 80.3% of statements in ./...
```

**We got 80.3% without writing any testcases or mocks for mongo db. 🎉 **

> **Note** : You didn't need to setup mongoDB locally or write mocks for your testing.

**The application thought it's talking to mongoDB 😄**

Go to the Keploy Console TestRuns Page to get deeper insights on what testcases ran, what failed.

![Gin-Mongo-test-diff](/img/Gin-Mongo-test-runs.png)

### Testing using `KEPLOY_MODE` Env Variable

To test using `KEPLOY_MODE` env variable, set the same to `test` mode.

```
export KEPLOY_MODE="test"
```

Now simply run the application.

```shell
go run handler.go main.go
```

Keploy will run all the captures test-cases, compare and show the results on the console.

> **Note** : With this method coverage will not be calculated.

## Let's add a Bug in the App

Now let's introduce a bug! Let's try changing something like renaming `url` to `urls` in handler.go `./handler.go` on line 96

```go
    ...
    c.JSON(http.StatusOK, gin.H{
		...
		"urls": "http://localhost:8080/" + id,
	})
	...
```

Let's run the test-file to see if Keploy catches the regression introduced.

` go test -coverpkg=./... -covermode=atomic ./...`

You'll notice the failed test-case in the output.

```shell
result  {"testcase id": "fd502338-b04d-4f96-a21e-38bd81edd9ee", "passed": false}
result  {"testcase id": "e8fb1ab0-2f39-48e1-b2ab-6142bc4e9515", "passed": true}
test run completed      {"run id": "a48f2fdf-7873-4879-bc81-5d280ee169fb", "passed overall": false}
--- FAIL: TestKeploy (7.01s)
    keploy.go:77: Keploy test suite failed
FAIL
coverage: 80.3% of statements in ./...
FAIL    test-app-url-shortener  7.022s
FAIL
```

To deep dive the problem go to [test runs](http://localhost:6789/testruns)

![Gin-Mongo-test-diff](/img/Gin-Mongo-test-diff.png)
