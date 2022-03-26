---
id: record-operations
title: Record Mode Operations
description: Guide into Keploy Record Mode
sidebar_label: Record
tags:
  - operation-guide
  - record
---

**Record mode** :
In the record mode, following operations happen.

- Records requests, response and all external calls and sends to Keploy server.
- After keploy server removes duplicates, the API request is run again with the application to identify noisy fields.
- Sends the noisy fields to the keploy server to be saved along with the testcase.

If you want to record the APIs served to your application from any source, set the `KEPLOY_MODE` environment variable.

```
export KEPLOY_MODE="record"
```

As you make API calls, you'll see new test-cases being generated on the [Keploy Console](/docs/operation/web-ui-operations).

![testcases](https://raw.githubusercontent.com/keploy/samples-go/main/gin-mongo/testcases.png)
