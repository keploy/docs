---
id: code-coverage
title: Code Coverage
sidebar_label: Code Coverage
description: Learn what code coverage is and how it helps both QA and developers through schema, branch, and statement coverage.
tags:
  - testing
  - code coverage
  - qa
  - devs
  - software quality
keyword:
  - code coverage
  - schema coverage
  - branch coverage
  - statement coverage
  - testing best practices
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Code Coverage 📊

Code coverage is a **metric that measures how much of your source code is executed while running automated tests**.  
It helps teams understand the quality of their tests and identify untested areas of the codebase.

 <img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/coverage-docs.png" alt="Keploy Record Test case" width="100%" />

High code coverage does not always mean good tests, but it ensures that critical parts of your application are not left untested.

<Tabs>

  <TabItem value="qa" label="For QA">
  
  ## ✅ Schema Coverage

Schema coverage measures how much of your **API schema** (endpoints, request/response fields, contracts) is exercised during testing.

 <img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/qa_coverage.png" alt="qa-coverage" width="100%" />

- Ensures all API fields are validated at least once
- Detects missing test cases for optional/edge fields
- Helps QA teams ensure **specification-to-implementation accuracy**

</TabItem>

<TabItem value="devs" label="For Devs">

## 🛠️ Branch Coverage

Branch coverage measures whether **all possible paths (if/else, switch cases, loops)** in the code have been executed by tests.

- Ensures both true and false conditions are tested
- Helps catch untested edge cases in logic
- More thorough than statement coverage

---

## 📌 Statement Coverage

Statement coverage measures how many **individual lines/statements of code** are executed at least once during testing.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/code-coverage.png" alt="Keploy Record Test case" width="100%" />

- Easier to achieve than branch coverage
- Provides a quick baseline of test completeness
- Ensures no "dead code" is left untested

</TabItem>

</Tabs>
