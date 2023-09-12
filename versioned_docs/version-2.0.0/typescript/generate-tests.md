---
id: generate-tests
title: Generate E2E tests (with mocks)
description: Generate E2E tests (with mocks)
tags:
  - developer-guide
  - typescript
---

## Configure
Add the following to the .env file of your application.

```
export KEPLOY_TEST_CASE_PATH="./example"    # If KEPLOY_TEST_CASE_PATH is not provided then a folder named keploy-tests will be made containing mocks folder. If KEPLOY_MOCK_PATH is provided then the mocks will be generated there. 
export KEPLOY_MOCK_PATH="./exampleMockPath" 
```

**Note:** To enable `Test Export`, add `export ENABLE_TEST_EXPORT=true` in your .env file of [keploy-server](https://github.com/keploy/keploy) repository. If enabled, yaml files  containing test cases will be generated in the directory provided by the user. Similarly, mocks will be generated in the yaml files.

```shell
export ENABLE_TEST_EXPORT=true
```
**Note:** If test export is enabled, then the recorded test cases will not be visible in the ui.