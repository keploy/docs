---
id: javascript
title: Merge Unit Test Coverage Data
sidebar_label: Javascript
tags:
  - javascript
  - js
  - node
  - npm
  - coverage
keywords:
  - coverage
  - Jest
  - Javascript
  - Mongo
  - Ava
  - Intern
  - mocha
  - IoT.js
  - tap
  - Typescript
---

import WhatAreKeployFeatures from './index.md'

<WhatAreKeployFeatures/>

## 🛠️ Language Specific Requirements

| Programming Language | Prerequisites                            |
| :------------------: | :--------------------------------------- |
|      javascript      | [nyc](https://www.npmjs.com/package/nyc) |

## Usage

### Update package file

Update the `package.json` file that runs the application:

```json
  "scripts": {
    //other scripts
    "test": "jest --coverage --collectCoverageFrom='src/**/*.{js,jsx}'",
    "coverage:merge": "mkdir -p ./coverage && nyc merge ./coverage .nyc_output/out.json",
    "coverage:report": "nyc report --reporter=lcov --reporter=text",
    //other scripts
  }
```

In the test script, the --coverage flag triggers report generation for Jest. For other testing frameworks like Mocha, Intern, or Tap, you will need to use their respective coverage tools.

To generate coverage report for your unit tests, Run:

```bash
npm test
```

To merge coverage data of unit tests with keploy tests, Run:

```bash
npm run coverage:merge
```

To get coverage related information for merged coverage data, Run:

```bash
npm run coverage:report
```
