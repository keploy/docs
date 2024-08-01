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

In test script, --coverage flag would trigger the report generation for jest. For report generation in other testing frameworks like mocha, intern, tap, refer https://istanbul.js.org/docs/tutorials/

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
