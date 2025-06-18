---
id: go
title: Merge Unit Test Coverage Data
sidebar_label: Go
tags:
  - go
  - coverage
keyword:
  - coverage
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

import WhatAreKeployFeatures from './index.md'

<WhatAreKeployFeatures/>

## 🛠️ Language Specific Requirements

| Programming Language | Prerequisites                                                                                                                                                                                                                                                       |
| :------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|          go          | 1. The application should have a graceful shutdown to stop the API server on `SIGTERM` or `SIGINT` signals. Refer [appendix](#graceful-shutdown) for basic implementation of graceful shutdown function. <br/> 2. The go binary should be built with `-cover` flag. |

## Graceful Shutdown

It is important that the application is shutdown gracefully. In case of Golang, function for graceful shutdown:

```go
func GracefulShutdown() {
	stopper := make(chan os.Signal, 1)
	// listens for interrupt and SIGTERM signal
	signal.Notify(stopper, os.Interrupt, os.Kill, syscall.SIGKILL, syscall.SIGTERM)
	go func() {
		select {
		case <-stopper:
			os.Exit(0)
		}
	}()
}

func main() {

	port := "8080"

	r := gin.Default()

	r.GET("/:param", getURL)
	r.POST("/url", putURL)
	// should be called before starting the API server from main()
	GracefulShutdown()

	r.Run()
}
```

## Usage

For keploy test coverage the binary must built with `-cover` flag:

```go
go build -cover
```

To get the coverage data for unit tests :

```go
go test -cover ./... -args -test.gocoverdir="PATH_TO_UNIT_COVERAGE_FILES"
```

To merge coverage data of unit tests with Keploy provided coverage :

```go
go tool covdata textfmt -i="PATH_TO_UNIT_COVERAGE_FILES","./coverage-reports" -o combined-coverage.txt
```

To get the coverage related information for merged coverage data :

```go
go tool cover -func combined-coverage.txt
```
