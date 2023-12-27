---
id: go
title: Integrate with Go Test
sidebar_label: Integrate with Go Test
tags:
  - go
keyword:
  - Echo Framework
  - Gorilla/Mux Framework
  - Gin Framework
  - Postgres
  - SQL
  - Golang
  - API Test generator
  - Auto Testcase generation
  - Go Test
---

This is the client SDK for the [Keploy](https://github.com/keploy/keploy) testing platform. You can use this to generate realistic mock/stub files for your applications.

## Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Mocking/Stubbing for unit tests](#mockingstubbing-for-unit-tests)
4. [Code coverage by the API tests](#code-coverage-by-the-api-tests)

## Installation

Add the Keploy Go SDK to your project:

```go
go get -u github.com/keploy/go-sdk/v2
```

## Usage

### Code coverage by the API tests

The code coverage for the keploy API tests using the `go-test` integration.
Keploy can be integrated in your CI pipeline which can add the coverage of your keploy test.

The percentage of code covered by the recorded tests is logged if the test cmd is ran with the go binary and `withCoverage` flag. The conditions for the coverage is:

1. The go binary should be built with `-cover` flag.
2. The application should have a graceful shutdown to stop the API server on `SIGTERM` or `SIGINT` signals. Or if not call the **GracefulShutdown** from the main function of your go program. Ex:

```go
func main() {

	port := "8080"

	r := gin.Default()

	r.GET("/:param", getURL)
	r.POST("/url", putURL)
	// should be called before starting the API server from main()
	keploy.GracefulShutdown()

	r.Run()
}
```

The keploy test cmd will look like:

```sh
keploy test -c "PATH_TO_GO_COVER_BIANRY" --withCoverage
```

The coverage files will be stored in the directory.

```
keploy
├── coverage-reports
│   ├── covcounters.befc2fe88a620bbd45d85aa09517b5e7.305756.1701767439933176870
│   ├── covmeta.befc2fe88a620bbd45d85aa09517b5e7
│   └── total-coverage.txt
├── test-set-0
│   ├── mocks.yaml
│   └── tests
│       ├── test-1.yaml
│       ├── test-2.yaml
│       ├── test-3.yaml
│       └── test-4.yaml
```

Coverage percentage log in the cmd will be:

```sh
🐰 Keploy: 2023-12-07T08:53:14Z         INFO    test/test.go:261
        test-app-url-shortener          coverage: 78.4% of statements
```

Also the go-test coverage can be merged along the recorded tests coverage by following the steps:

```sh
go test -cover ./... -args -test.gocoverdir="PATH_TO_UNIT_COVERAGE_FILES"

go tool covdata textfmt -i="PATH_TO_UNIT_COVERAGE_FILES","./keploy/coverage-reports" -o coverage-profile

go tool cover -func coverage-profile
```

### Create mocks/stubs for your unit-test

These mocks/stubs are realistic and frees you up from writing them manually. Keploy creates `readable/editable` mocks/stubs yaml files which can be referenced in any of your unit-tests tests. An example is mentioned in [Mocking/Stubbing for unit tests](#mockingstubbing-for-unit-tests) section

1. Install [keploy](https://github.com/keploy/keploy#quick-installation) binary
2. **Record**: To record you can import the keploy mocking library and set the mode to record mode and run you databases. This should generate a file containing the mocks/stubs.

```go
import(
    "github.com/keploy/go-sdk/v2/keploy"
)

// Inside your unit test
...
err := keploy.New(keploy.Config{
	Mode: keploy.MODE_RECORD, // It can be MODE_TEST or MODE_OFF. Default is MODE_TEST. Default MODE_TEST
    Name: "<stub_name/mock_name>" // TestSuite name to record the mock or test the mocks
	Path: "<local_path_for_saving_mock>", // optional. It can be relative(./internals) or absolute(/users/xyz/...)
	MuteKeployLogs: false, // optional. It can be true or false. If it is true keploy logs will be not shown in the unit test terminal. Default: false
	delay: 10, // by default it is 5 . This delay is for running keploy
})
...
```

At the end of the test case you can add the following function which will terminate keploy if not keploy will be running even after unit test is run

```go
keploy.KillProcessOnPort()
```

3. **Mock**: To mock dependency as per the content of the generated file (during testing) - just set the `Mode` config to `keploy.MODE_TEST` eg:

```go
err := keploy.New(keploy.Config{
	Mode: keploy.MODE_TEST,
	Name: "<stub_name/mock_name>"
	Path: "<local_path_for_saving_mock>",
	MubeKeployLogs: false,
	delay: 10,
})
```

#### Example

Mocks/Stubs can be generated for external dependency calls of go unit tests as `readable/editable` yaml files using Keploy.

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/keploy/go-sdk/v2/keploy"
)

func setup(t *testing.T) {
	err := keploy.New(keploy.Config{
		Name:           "TestPutURL",
		Mode:           keploy.MODE_RECORD, // change to MODE_TEST when you run in test mode
		Path:           "/home/ubuntu/dont_touch/samples-go/gin-mongo",
		MuteKeployLogs: false,
		Delay:          15,
	})
	if err != nil {
		t.Fatalf("error while running keploy: %v", err)
	}
	dbName, collection := "keploy", "url-shortener"
	client, err := New("localhost:27017", dbName)
	if err != nil {
		panic("Failed to initialize MongoDB: " + err.Error())
	}
	db := client.Database(dbName)
	col = db.Collection(collection)
}

func TestPutURL(t *testing.T) {

	defer keploy.KillProcessOnPort()
	setup(t)

	r := gin.Default()
	r.GET("/:param", getURL)
	r.POST("/url", putURL)

	data := map[string]string{
		"url": "https://www.example.com",
	}
	payload, err := json.Marshal(data)
	if err != nil {
		t.Fatalf("rfe: %v\n", err)
	}

	req, err := http.NewRequest(http.MethodPost, "/url", bytes.NewBuffer(payload))
	if err != nil {
		t.Fatalf("Couldn't create request: %v\n", err)
	}
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// Checking if the URL was successfully shortened and stored
	if w.Code != http.StatusOK {
		t.Fatalf("Expected HTTP 200 OK, but got %v", w.Code)
	}

	var response map[string]interface{}
	err = json.Unmarshal(w.Body.Bytes(), &response)
	if err != nil {
		t.Fatalf("Failed to unmarshal response: %v\n", err)
	}
	fmt.Println("response-url" + response["url"].(string))

	if response["url"] == nil || response["ts"] == nil {
		t.Fatalf("Response did not contain expected fields")
	}
}
```
