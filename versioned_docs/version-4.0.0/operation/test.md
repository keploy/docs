---
id: test-operations
title: Test Mode Operations
description: Guide into Keploy Test Mode
sidebar_label: Test
tags:
  - operation-guide
  - test
  - replay-tests
---

To run KTests and KMocks you can follow any one of these methods:

### Method 1

<details><summary>
Set Environment Variable `KEPLOY_MODE`

</summary>

```shell
export KEPLOY_MODE="test"
```

Run application and find test report summary on the Keploy Server Logs and detailed test report in directory where
Keploy Server is running.

![Test report summary](/gif/replay-tc.gif)

</details>
