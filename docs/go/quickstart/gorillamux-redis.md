---
id: gorillamux-redis
title: Contact Keeper with Gorilla/Mux-Redis
sidebar_label: Gorilla/Mux-Redis Sample
tags:
  - hello-world
  - go
  - sdk
  - tutorial
---

# Contact Keeper Sample App

A sample contact keeper app to test Keploy integration capabilities using [Gorilla Mux](https://pkg.go.dev/github.com/gorilla/mux) and [Redis](https://redis.io/).

## Installation Setup

> Note that Testcases are exported as files in the local repository by default

You can refer to the [installation guide](https://docs.keploy.io/docs/server/server-installation) to install Keploy on your machine.

### Prerequisites

1. [Redis](https://redis.io/)

### Setup Contact Keeper App

```bash
git clone https://github.com/keploy/samples-go && cd samples-go/gorillamux-redis
```

### Start Redis

```bash
redis-server
```

### Start Keploy Record Mode and run the application

```
export KEPLOY_MODE=record && go run main.go
```

### Skip above steps with Gitpod

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer)

## Generate testcases

To generate testcases we just need to make some API calls. You can use [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), or simply `curl`

### Store the contact details

```bash
curl --request POST \
 --url http://localhost:8080/data/1 \
 --header 'content-type: application/json' \
 --data '{
 "name":"John Doe",
 "email":"johndoe@example.com"
}'
```

this will return the data that is inserted.

```
{
    "name":"John Doe",
    "email":"johndoe@example.com"
}
```

Also, you can add any id (a numeric value) to the endpoint to insert the data. Here we have used 1.

### Get back the stored data using the id

1. By using Curl Command

```bash
curl --request GET \
 --url http://localhost:8080/data/1

```

2. Or by querying through the browser `http://localhost:8080/data/1'

![Gorilla-Mux-Test-Capture](/img/GorillaMux-Redis.png)

Now both these API calls were captured as **editable** testcases and written to `keploy/tests` folder. The keploy directory would also have `mocks` folder that contains all the outputs of redis operations. Here's what the folder structure look like:

```
.
├── README.md
├── main.go
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

The test files should look like the sample below and the format is common for both **_http tests_** and **_mocks_**.

```yaml
version: api.keploy.io/v1beta2
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: /data/1
    header:
      Accept: "*/*"
      Content-Length: "54"
      Content-Type: application/json
      User-Agent: curl/7.81.0
    body: |-
      {
       "name":"John Doe",
       "email":"johndoe@example.com"
      }
    body_type: utf-8
  resp:
    status_code: 200
    header:
      Content-Type: application/json
    body: |
      {"name":"John Doe","email":"johndoe@example.com"}
    body_type: utf-8
    status_message: ""
    proto_major: 1
    proto_minor: 1
  objects:
    - type: error
      data: H4sIAAAAAAAA/wEAAP//AAAAAAAAAAA=
  mocks:
    - mock-1-0
  assertions:
    noise: []
  created: 1675929915
```

Now, let's see the magic! ✨💫

## Test mode

Now that we have our testcase captured, run the test file (in the gomux-redis directory, not the Keploy directory).

```shell
 go test -coverpkg=./... -covermode=atomic  ./...
```

output should look like

```shell
ok  	sample-app	5.032s	coverage: 71.4% of statements in ./...
```

> **We got 71.4% without writing any e2e testcases or mocks for Redis!**

So no need to setup fake database/apis like Redis or write mocks for them. Keploy automatically mocks them and, **The application thinks it's talking to Redis 😄**

Go to the `Keploy Console` to get deeper insights on what testcases ran, what failed.

![GorillaMux-Redis-Test-Run](/img/GorillaMux-Redis-test-runs.png)

<details>
<summary>𝗜𝗻𝘀𝗶𝗴𝗵𝘁𝘀 𝗼𝗻 𝗞𝗲𝗽𝗹𝗼𝘆 𝗖𝗼𝗻𝘀𝗼𝗹𝗲</summary>

```shell
 <=========================================>
  TESTRUN STARTED with id: "635ffdba-1382-48fd-8c81-8e6eebf95f29"
	For App: "my-app"
	Total tests: 2
 <=========================================>

Testrun passed for testcase with id: "test-2"

--------------------------------------------------------------------

Testrun passed for testcase with id: "test-1"

--------------------------------------------------------------------


 <=========================================>
  TESTRUN SUMMARY. For testrun with id: "635ffdba-1382-48fd-8c81-8e6eebf95f29"
	Total tests: 2
	Total test passed: 2
	Total test failed: 0
 <=========================================>


```

</details>

---

### Make a code change

Now try changing something like commenting line numbers 115 and 116 and uncommenting line 119 in [main.go](./main.go) and running ` go test -coverpkg=./... -covermode=atomic ./...` again

```shell
starting test execution	{"id": "5ae0c256-f54d-4126-a794-5d5f50d3db76", "total tests": 2}
testing 1 of 2	{"testcase id": "test-1"}
testing 2 of 2	{"testcase id": "test-2"}
result	{"testcase id": "test-2", "passed": true}
result	{"testcase id": "test-1", "passed": false}
test run completed	{"run id": "5ae0c256-f54d-4126-a794-5d5f50d3db76", "passed overall": false}
--- FAIL: TestKeploy (5.02s)
    keploy.go:75: Keploy test suite failed
FAIL
	sample-app	coverage: 70.8% of statements in ./...
FAIL	sample-app	5.027s
FAIL


```

To deep dive the problem you can look at the keploy logs

<details>
<summary>𝗞𝗲𝗽𝗹𝗼𝘆 𝗟𝗼𝗴𝘀</summary>

```shell
 <=========================================>
  TESTRUN STARTED with id: "5ae0c256-f54d-4126-a794-5d5f50d3db76"
	For App: "my-app"
	Total tests: 2
 <=========================================>

Testrun passed for testcase with id: "test-2"

--------------------------------------------------------------------

Testrun failed for testcase with id: "test-1"
Test Result:
	Input Http Request: models.HttpReq{
  Method:     "POST",
  ProtoMajor: 1,
  ProtoMinor: 1,
  URL:        "/data/1",
  URLParams:  map[string]string{},
  Header:     http.Header{
    "Accept": []string{
      "*/*",
    },
    "Content-Length": []string{
      "54",
    },
    "Content-Type": []string{
      "application/json",
    },
    "User-Agent": []string{
      "curl/7.81.0",
    },
  },
  Body:   "{\n \"name\":\"John Doe\",\n \"email\":\"johndoe@example.com\"\n}",
  Binary: "",
  Form:   []models.FormData(nil),
}

	Expected Response: models.HttpResp{
  StatusCode: 200,
  Header:     http.Header{
    "Content-Type": []string{
      "application/json",
    },
  },
  Body:          "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\"}\n",
  StatusMessage: "",
  ProtoMajor:    0,
  ProtoMinor:    0,
  Binary:        "",
}

	Actual Response: models.HttpResp{
  StatusCode:    200,
  Header:        http.Header{},
  Body:          "Record saved",
  StatusMessage: "",
  ProtoMajor:    0,
  ProtoMinor:    0,
  Binary:        "",
}

DIFF:
	 Response Headers: {
		"Content-Type": {
			Expected value: "[application/json]"
			Actual value: "[]"
		}
	}
	Response body: {
{
			Expected value: "{\"name\":\"John Doe\",\"email\":\"johndoe@example.com\"}\n"
			Actual value: "Record saved"
		}
--------------------------------------------------------------------


 <=========================================>
  TESTRUN SUMMARY. For testrun with id: "5ae0c256-f54d-4126-a794-5d5f50d3db76"
	Total tests: 2
	Total test passed: 1
	Total test failed: 1
 <=========================================>

```

This is how the bug will look like in the Keploy Terminal:

![GorillaMux-Redis-test-diff](/img/GorillaMux-Redis-test-diff.png)
![GorillaMux-Redis-test-diff2](/img/GorillaMux-Redis-test-diff2.png)

</details>
