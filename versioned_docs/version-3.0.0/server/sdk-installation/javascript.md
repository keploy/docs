---
id: javascript
title: Merge Unit and Keploy Test Coverage Data
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

#### Install nyc:

```
npm i nyc
```

In the test script, the --coverage flag triggers report generation for Jest. For other testing frameworks like Mocha, Intern, or Tap, you will need to use their respective coverage tools.

#### Run keploy test command:

Once it has been done, run keploy test command:

```
keploy test -c "your_application_command"
```

After successful execution of this command, A coverage report would be generated inside the test-run folder of keploy/reports.

```
keploy
├── reports
│   └── test-run-0
│       ├── coverage.yaml
│       └── test-set-0-report.yaml
└── test-set-0
    ├── mocks.yaml
    └── tests
        ├── test-1.yaml
        └── test-2.yaml
```

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
