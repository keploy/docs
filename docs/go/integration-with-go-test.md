---
id: integration-with-go-test
title: Integrate with Go Test
sidebar_label: Integrate with Go Test
---

### Testing using Unit Test File

Once you have testcases captured, add this go unit test file `main_test.go` in the root of your sample application.

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

You'll see the total test-coverage of Keploy recorded test-cases and previously written unit-test cases(if any).

> You can use this unit-test file and there's no-need to add any additional steps/checks in your CI pipeline.
