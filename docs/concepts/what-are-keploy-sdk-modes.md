---
id: what-are-keploy-sdk-modes
title: Keploy SDK Modes
sidebar_label: Keploy SDK Modes
description: Keploy SDK is a language-specific library that captures and replays API calls and subsequent network interactions.
tags:
  - explanation
  - sdk
---

### SDK Modes

The Keploy SDKs modes can operated by setting ` KEPLOY_MODE` environment variable. There are 3 Keploy SDK modes:

1. **Off** : In the off mode the Keploy SDK will turn off all the functionality provided by the Keploy platform.

```
export KEPLOY_MODE="off"
```

2. **Record mode** :
   - Record requests, response and all external calls and sends to Keploy server.
   - After keploy server removes duplicates, it then runs the request on the API again to identify noisy fields.
   - Sends the noisy fields to the keploy server to be saved along with the testcase.

```
export KEPLOY_MODE="record"
```

3. **Test mode** :
   - Fetches testcases for the app from keploy server.
   - Calls the API with same request payload in testcase.
   - Mocks external calls based on data stored in the testcase.
   - Validates the responses and uploads results to the keploy server

```
export KEPLOY_MODE="test"
```
