---
id: record-operations
title: Record Mode Operations
description: Guide into Keploy Record Mode
sidebar_label: Record
tags:
  - operation-guide
  - record
---

> Note that Testcases are exported as files in the project directory by default

To record API calls as test cases set `KEPLOY_MODE` environment variable to `record`.

```shell
export KEPLOY_MODE="record"
```

That's it! 🔥 As you make API calls to your application, new test-cases are being generated locally in `keploy-tests`
directory.

> > KTest directory path (`KEPLOY_TEST_PATH`) is configurable.

![Record Tests and Mocks](/gif/record-tc.gif "Record Tests and Mocks")

> > KMock directory path (`KEPLOY_MOCK_PATH`) is configurable.
