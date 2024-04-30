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

The percentage of code covered by the recorded tests is logged when the test command is run with the Go binary and the `coverage` flag. Additionally, a coverage report in YAML format will be generated and stored in keploy/reports/test-run-{id}. The conditions for the coverage is:

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
keploy test -c "PATH_TO_GO_COVER_BINARY" --coverage
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

Coverage percentage log in the cmd will be:

```sh
🐰 Keploy: 2023-12-07T08:53:14Z         INFO    test/test.go:261
        test-app-url-shortener          coverage: 78.4% of statements
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

go tool covdata textfmt -i="PATH_TO_UNIT_COVERAGE_FILES","./keploy/coverage-reports" -o coverage-profile

go tool cover -func coverage-profile
```
