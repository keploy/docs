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

To get the coverage data for unit tests, Run:

```sh
go test -cover ./... -args -test.gocoverdir="PATH_TO_UNIT_COVERAGE_FILES"
```

To merge coverage data of unit tests with keploy tests, Run:

```sh
go tool covdata textfmt -i="PATH_TO_UNIT_COVERAGE_FILES","./coverage-reports" -o combined-coverage.txt
```

To get the coverage related information for merged coverage data, Run:

```sh
go tool cover -func combined-coverage.txt
```
