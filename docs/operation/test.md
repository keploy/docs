---
id: test-operations
title: Test Mode Operations
description: Guide into Keploy Test Mode
sidebar_label: Test
tags:
  - operation-guide
  - test
---

**Test mode** :

- Fetches testcases for the app from keploy server.
- Calls the API with same request payload in testcase.
- Mocks external calls based on data stored in the testcase.
- Validates the responses and uploads results to the keploy server

```
export KEPLOY_MODE="test"
```

Go to the Keploy Console TestRuns Page to get deeper insights on what testcases ran, what failed.

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun1.png "Recent testruns")

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun2.png "Summary")

![testruns](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testrun3.png "Detail")
