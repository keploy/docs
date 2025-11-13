---
id: go
title: Merge Unit and Keploy Test Coverage Data
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

## 🛠️ Language Specific Requirements

There are two requirements to get coverage for Go: first, you need to perform a graceful shutdown, and second, you must build the binary using the `-cover` flag. Once that’s done, run `keploy test`.

| Programming Language | Prerequisites                                                                                                                                                                                                                                   |
| :------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          go          | 1. The application should have a graceful shutdown to stop the API server on `SIGTERM` or `SIGINT` signals. Refer below code for basic implementation of graceful shutdown function. <br/> 2. The go binary should be built with `-cover` flag. |

## 1. Graceful Shutdown

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

## 2. Usage

For keploy test coverage the binary must built with `-cover` flag:

```go
go build -cover
```

Once it has been done, run keploy test command:

```
keploy test -c "your_application_command"
```

After successful execution of this command, A coverage report would be generated inside the test-run folder of keploy/reports.

```
keploy
├── reports
│   └── test-run-0
│       ├── coverage.yaml
│       └── test-set-0-report.yaml
└── test-set-0
    ├── mocks.yaml
    └── tests
        ├── test-1.yaml
        └── test-2.yaml
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
