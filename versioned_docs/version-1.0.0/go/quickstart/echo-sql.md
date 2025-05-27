---
id: echo-sql
title: Sample Echo-SQL Application with the Go (v1.0.0)
sidebar_label: Echo-SQL Sample
tags:
  - hello-world
  - go
  - sdk
  - tutorial
keywords:
  - PostgreSQL
  - Unit Test
  - sample application
---

# URL Shortener Sample App

A sample url shortener app to test Keploy integration capabilities using Echo and [PostgreSQL](https://www.postgresql.org/).

## Installation

Navigate to [Installation guide](../../server/server-installation.md) to quickly install and run the keploy server.

### Setup URL shortener

```bash
git clone https://github.com/keploy/samples-go && cd samples-go/echo-sql
go mod download
```

### Start Keploy Record Mode

```bash
export KEPLOY_MODE=record
```

### Start PostgreSQL instance

```bash
docker-compose up -d
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
  --url http://localhost:8082/url \
  --header 'content-type: application/json' \
  --data '{
  "url": "https://google.com"
}'
```

this will return the shortened url. The ts would automatically be ignored during testing because it'll always be different.

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

or by querying through the browser `http://localhost:6789/Lhr4BWAi`

Now both these API calls were captured as a testcase and should be visible in the keploy-tests folderj.
If you're using Keploy cloud, open [this](https://app.keploy.io/).

![testcases](/img/Echo-Sql-test-cases.png)

Now, let's see the magic! 🪄💫

## Test mode

There are 2 ways to test the application with Keploy.

1. Unit Test File
2. KEPLOY_MODE environment variable

### 1. Testing using Unit Test File

Now that we have our testcase captured, run the unit test file (`main_test.go`) already present in the sample app repo.

If not present, you can add `main_test.go` in the root of your sample application.

```go
package main

import (
  "github.com/keploy/go-sdk/keploy"
  "os"
  "testing"
)

func TestKeploy(t *testing.T) {
  // change port so that test server can run concurrently
  os.Setenv("PORT", "8090")

  keploy.SetTestMode()
  go main()
  keploy.AssertTests(t)
}
```

To automatically run the captured test-cases. Let's run the test-file.

```shell
 go test -coverpkg=./... -covermode=atomic  ./...
```

output should look like -

```shell
ok   echo-psql-url-shortener 6.750s coverage: 51.1% of statements in ./...
```

**We got 51.1% without writing any testcases or mocks for postgres db. 🎉 **

> **Note** : You didn't need postgres locally or write mocks for your testing.
> So no need to setup dependencies like PostgreSQL, web-go locally or write mocks for your testing.

**The application thought it's talking to Postgres 😄**

Go to the Keploy Terminal to get deeper insights on what testcases ran and what failed.

![Echo-Sql-Test-Run](/img/Echo-Sql-test-run.png)

### 2. Testing using `KEPLOY_MODE` Env Variable

To test using `KEPLOY_MODE` env variable, set the same to `test` mode.

```
export KEPLOY_MODE=test
```

Now simply run the application.

```shell
go run handler.go main.go
```

Keploy will run all the captures test-cases, compare and show the results in the terminal.

> **Note** : With this method coverage will not be calculated.

## Let's add a Bug in the App

Now let's introduce a bug! Let's try changing something like renaming `url` to `urls` in handler.go `./handler.go` on line 39

```go
    ...
    type successResponse struct {
      TS  int64  json:"ts"
      URL string json:"urls" //introduced a bug
    }
	...
```

Let's run the test-file to see if Keploy catches the regression introduced.

` go test -coverpkg=./... -covermode=atomic ./...`

You'll notice the failed test-case in the output.

```shell
http server started on [::]:8090
test starting in 5s
starting test execution {"id": "3a772b7f-c472-4c8f-a156-af15b155f051", "total tests": 4}
testing 1 of 4 {"testcase id": "a70f20f1-85e6-4e6f-99ee-660f8666d7f2"}
testing 2 of 4 {"testcase id": "766b0484-a515-433d-a470-3675e6b742ed"}
testing 3 of 4 {"testcase id": "4978ef1f-6b64-421e-aff8-b4c426b035c6"}
testing 4 of 4 {"testcase id": "3342d931-5bef-4c9c-a042-bde3ecd4cc29"}
result {"testcase id": "3342d931-5bef-4c9c-a042-bde3ecd4cc29", "passed": false}
result {"testcase id": "766b0484-a515-433d-a470-3675e6b742ed", "passed": false}
result {"testcase id": "a70f20f1-85e6-4e6f-99ee-660f8666d7f2", "passed": true}
result {"testcase id": "4978ef1f-6b64-421e-aff8-b4c426b035c6", "passed": true}
test run completed {"run id": "3a772b7f-c472-4c8f-a156-af15b155f051", "passed overall": false}
--- FAIL: TestKeploy (5.95s)
    keploy.go:77: Keploy test suite failed
FAIL
coverage: 51.1% of statements in ./...
FAIL echo-psql-url-shortener 7.051s
FAIL
```

This is how the bug will look like in the Keploy Terminal:

![Echo-Sql-test-diff](/img/Echo-Sql-test-diff.png)
![Echo-Sql-test-diff2](/img/Echo-Sql-test-diff2.png)
