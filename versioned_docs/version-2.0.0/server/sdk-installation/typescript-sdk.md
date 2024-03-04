---
id: typescript
title: Keploy Integration with Jest
sidebar_label: Jest
tags:
  - javascript
  - js
keywords:
  - Jest
  - Javascript
  - Mongo
---

## Pre-requisites

1. [Node.js](https://nodejs.org/en/download)
2. [nyc](https://www.npmjs.com/package/nyc): `npm i nyc`

## Installation

### Get Keploy jest sdk

[Install the latest release of the Keploy Jest SDK](https://www.npmjs.com/package/@keploy/sdk)

```bash
npm i @keploy/sdk
```

## Update package file

Update the `package.json` file that runs the application:

```json
  "scripts": {
    //other scripts
    "test": "jest --coverage --collectCoverageFrom='src/**/*.{js,jsx}'",
    "coverage": "nyc npm test && npm run coverage:merge && npm run coverage:report",
    "coverage:merge": "mkdir -p ./coverage && nyc merge ./coverage .nyc_output/out.json",
    "coverage:report": "nyc report --reporter=lcov --reporter=text"
    //other scripts
  }
```

## Usage

For the code coverage for the keploy API tests using the `jest` integration, you need to add the following test to your
Jest test file. It can be called as `Keploy.test.js`.

```javascript
const {expect} = require("@jest/globals");
const keploy = require("@keploy/sdk");
const timeOut = 300000;

describe(
  "Keploy Server Tests",
  () => {
    test(
      "TestKeploy",
      (done) => {
        const cmd = "npm start";
        const options = {};
        keploy.Test(cmd, options, (err, res) => {
          if (err) {
            done(err);
          } else {
            expect(res).toBeTruthy(); // Assert the test result
            done();
          }
        });
      },
      timeOut
    );
  },
  timeOut
);
```

Now let's run jest tests along keploy using command:-

```bash
keploy test -c "npm test" --delay 15 --coverage
```

To get Combined coverage

```bash
keploy test -c "npm run coverage" --delay 10 --coverage
```
