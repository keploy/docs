---
id: go
title: Coverage Report Generation
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

The percentage of code covered by the recorded tests is logged when the test command is run with the Go binary. Additionally, a coverage report in YAML format will be generated and stored in keploy/reports/test-run-{id}. The conditions for the coverage is:

1. The go binary should be built with `-cover` flag.
2. The application should have a graceful shutdown to stop the API server on `SIGTERM` or `SIGINT` signals. Or if not call the **GracefulShutdown** from the main function of your go program. Ex:

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

Run keploy test command as usual:

```sh
keploy test -c "PATH_TO_GO_COVER_BINARY"
```

By default, the raw coverage files would be dumped in `./coverage-reports` directory. Use the `coverageReportPath` flag to provide an alternative path.

Here is the directory structure for a test run with `coverage` flag enabled:

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

and, the coverage.yaml would look like: 
```yaml
file_coverage:
    test-app-url-shortener/handler.go: 75.00%
    test-app-url-shortener/main.go: 86.67%
total_coverage: 79.07%
```

Also the go-test coverage can be merged along the recorded tests coverage by following the steps:

```sh
go test -cover ./... -args -test.gocoverdir="PATH_TO_UNIT_COVERAGE_FILES"

go tool covdata textfmt -i="PATH_TO_UNIT_COVERAGE_FILES","./coverage-reports" -o combined-coverage.txt

go tool cover -func combined-coverage.txt
```
