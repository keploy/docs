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