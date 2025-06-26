---
id: api-testing-cicd
title: API Test Setup for GitHub CI/CD
sidebar_label: CI/CD Integration
description: Learn how to seamlessly integrate Keploy's AI-powered API tests with GitHub Actions for continuous testing.
tags:
  - API testing
  - test automation
  - AI testing
  - ci testing
  - plugin
  - ci pipeline
keywords:
  - fix failing tests
  - ci testing
  - ci/cd
  - github
---

Keploy makes it super simple to run API tests during your CI/CD pipeline on GitHub. Here’s a step-by-step guide to help you set it up in just a few minutes!

## Step 1: Get the Test Command from Keploy Dashboard

1. Go to [app.keploy.io](https://app.keploy.io)
2. Click on **Test Suite** in the sidebar

![Test Suite Page](https://keploy-devrel.s3.us-west-2.amazonaws.com/testsuite-apitesting.png)

3. You'll see an option to “Run test suites natively”

![Run Natively Button](https://keploy-devrel.s3.us-west-2.amazonaws.com/apitestsuites.png)

4. **Copy the command**  
   ![Copy Command](https://keploy-devrel.s3.us-west-2.amazonaws.com/apitesting-ci-cmd.png)

## Step 2: Set Up GitHub Actions Workflow

Add the following steps to your `.github/workflows/ci.yml` file:

### Install Keploy CLI

```yaml
- name: Install Keploy CLI
  run: |
    curl --silent -L https://keploy.io/ent/install.sh | bash
```

### Run Keploy API Tests

Paste the command copied from the dashboard here:

```yaml
- name: Run Keploy Test Suite
  run: |
    export KEPLOY_API_KEY=${{ secrets.KEPLOY_API_KEY }}
    keploy test-suite --app=03d24177-315c-4ee1-a3ac-64ed0ab38567 --base-path http://localhost:8080/books --cloud
```

### ⚠️ **Note**

Don’t forget to add your `KEPLOY_API_KEY` as a GitHub secret!
**Go to your repo → Settings → Security → Actions → _New Repository Secret_**

Replace `--app` and `--base-path` with your actual values from the Keploy Dashboard.

## Output Example: Real-time Test Execution Logs

Once integrated, here’s what a successful run may look like in your GitHub Actions console:

```sh
🐰 Keploy: Running test suite	{"name": "Create and update one book verify other is unaffected via list"}
🐰 Keploy: Running test case	{"name": "Create Book A"}
🐰 Keploy: step passed	{"step": "Create Book A"}
...

+------------------------------------------+--------+-------+
| Test Case                                | Status | Runs  |
+------------------------------------------+--------+-------+
| Create book with only title              | PASSED |     1 |
| Create book with invalid progress        | PASSED |     1 |
| Delete book by very large ID             | PASSED |     1 |
| Update book by invalid ID format         | PASSED |     1 |
| ...                                      | ...    |  ...  |
+------------------------------------------+--------+-------+

Test suite execution summary
Total suites:     122
Passed suites:    122
Failed suites:      0
```

## That's it!

With just a few lines of YAML, you’ve added **AI-powered API test automation** into your GitHub CI pipeline. Now every PR or deployment will be automatically tested with Keploy’s smart test engine.

import GetSupport from '../concepts/support.md'

<GetSupport/>
