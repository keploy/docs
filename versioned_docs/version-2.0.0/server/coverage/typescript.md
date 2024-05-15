---
id: typescript
title: Coverage Report Generation
sidebar_label: Typescript
tags:
  - javascript
  - js
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

## Pre-requisites

1. [nyc](https://www.npmjs.com/package/nyc)

To generate coverage report for your node application, follow the below instructions.

## Update package file

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

## Usage

To generate coverage report for keploy recorded testcases, Run keploy test command as usual: 

```bash
keploy test -c "npm run start"
```

To generate coverage report for your unit tests: -

```bash
npm test
```

To get Combined coverage with keploy test coverage: -

```bash
npm run coverage:report
```
