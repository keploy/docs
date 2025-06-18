---
id: keploy-console
title: Keploy Console 📘
sidebar_label: Keploy Console 🛠️
tags:
  - explanation
  - feature guide
  - keploy console
  - installation
keywords:
  - keploy console
  - installation
  - API key
---

### Pre-requisite 📝

Ensure you have [installed keploy enterprise](/docs/keploy-cloud/cloud-installation/#installation-%EF%B8%8F).

### Run Tests Locally ⌛️

Before starting the console, run test cases locally.

```bash
keploy test -c "<CMD_TO_RUN_APP>"
```

<img src="/docs/img/keploy-cloud/console-test-run.png?raw=true" alt="Keploy TestRun"/>

Let's see what broke and fix it.

### Start Keploy Console 📈

- To visualise and edit test-cases basis on test-results, start the console.
  <br/>
  ```bash
  keploy console
  ```
    <br/>
    <img src="/docs/img/keploy-cloud/keploy-console-cmd.png?raw=true" alt="Keploy Console"/>

<br/>

- Select your application on [keploy cloud](https://app.keploy.io) and navigate to the **latest** test-report.

    <br/>
    <img src="/docs/img/keploy-cloud/test-reports.png?raw=true" alt="Keploy UI Console"/>

- Select the **latest** test report to make edits.

## Test Report Operations 🛠️

Edit test-cases locally using keploy console.

- 🎧 Mark Noise Fields
- 📝 Update Expected Test-Results
- 🚫 Ignore Tests
- ♻️ Re-Record Test Suite
- 🗑️ Delete Test Report

<img src="/docs/img/keploy-cloud/test-operations.png?raw=true" alt="Keploy Test Menu Dialog"/>

> ✍️ Note that the changes can be made by editing the latest test report only.

### Add/Remove Noisy Fields

Noisy fields are ignored for assertion when the test-cases runs. Say, `Date` and `Content-Length` are two headers that are not static and can change with each request. We can mark these fields as noisy.

<img src="/docs/img/keploy-cloud/noise.png?raw=true" alt="Noise"/>

You'd see the changes in the test-case file locally, new noisy fields are added under noise param in the test case.

<img src="/docs/img/keploy-cloud/denoise.png?raw=true" alt="De-noise"/>

### Normalise Test Report or Test Case

Similarly, if the test case result is the new expected response, we can normalise the test report or a particular test case. This will update the expected result of the test case locally.

## Need Help?

If you have any questions or need assistance, our support team is here to help. You can reach out to us through our support portal, Slack or by emailing us.
