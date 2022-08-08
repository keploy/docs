---
id: gin-mongo-quickstart
title: Sample Application with the Go SDK
sidebar_label: Gin-Mongo Sample
tags:
- hello-world
- go
- sdk
- tutorial
---

# Example URL Shortener App

A sample url shortener app to test Keploy integration capabilities in Go.

In this sample application we're using 2 dependencies - [Gin](https://gin-gonic.com), mongoDB.

### Pre-requisites

- [Go](https://golang.org/doc/install)

import ServerInstallation from '../../server/server-installation.md'

<ServerInstallation/>


Once you have the Keploy Server running, open the Keploy Console at [http://localhost:8081](http://localhost:8081)

### Setup URL shortener

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/gin-mongo
go mod download
```

### Run the application

```shell
go run handler.go main.go
```

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

Now both these API calls were captured as a testcase and should be visible on the [Keploy console](http://localhost:8081/testlist).
If you're using Keploy cloud, open [this](https://app.keploy.io/testlist).

You should be seeing an app named `sample-url-shortener` with the test cases we just captured.

![testcases](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testcases.png)

Now, let's see the magic! 🪄💫

## Test mode

There are 2 ways to test the application with Keploy.

1. [Unit Test File](/docs/go/run-your-first-app-tutorial#testing-using-unit-test-file)
2. [KEPLOY_MODE environment variable](/docs/go/run-your-first-app-tutorial#testing-using-keploy_mode-env-variable)

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
ok      test-app-url-shortener  6.268s  coverage: 80.3% of statements in ./...
```

**We got 80.3% without writing any testcases or mocks for mongo db. 🎉 **

> **Note** : You didn't need to setup mongoDB locally or write mocks for your testing.

**The application thought it's talking to mongoDB 😄**

Go to the Keploy Console TestRuns Page to get deeper insights on what testcases ran, what failed.

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun1.png "Recent testruns")

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun2.png "Summary")

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun3.png "Detail")

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
{"msg":"result","testcase id":"05a576e1-c03a-4c25-a469-4bea0307cd08","passed":false}
{"msg":"result","testcase id":"cad6d926-b531-477c-935c-dd7314c4357a","passed":true}
{"msg":"test run completed","run id":"19d4cba1-b77c-4301-884a-5b3f08dc6248","passed overall":false}
--- FAIL: TestKeploy (5.72s)
    keploy.go:42: Keploy test suite failed
FAIL
coverage: 80.3% of statements in ./...
FAIL    test-app-url-shortener  6.213s
FAIL
```

To deep dive the problem go to [test runs](http://localhost:8081/testruns)

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun4.png "Recent testruns")

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun5.png "Detail")
