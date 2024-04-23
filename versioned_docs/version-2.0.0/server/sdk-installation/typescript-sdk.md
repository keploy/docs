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
2. [nyc](https://www.npmjs.com/package/nyc)
3. [Keploy SDK](https://github.com/keploy/keploy?tab=readme-ov-file#-quick-installation)
4. [Jest](https://jestjs.io/docs/getting-started)
2. [nyc](https://www.npmjs.com/package/nyc)
3. [Keploy SDK](https://github.com/keploy/keploy?tab=readme-ov-file#-quick-installation)
4. [Jest](https://jestjs.io/docs/getting-started)

## Installation

### Get Keploy jest sdk

[Install the latest release of the Keploy Jest SDK](https://www.npmjs.com/package/@keploy/sdk)

```bash
npm i @keploy/sdk nyc jest
npm i @keploy/sdk nyc jest
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
Jest test file. It can be called as `keploy.test.js`.
Jest test file. It can be called as `keploy.test.js`.

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

Now let's run jest tests along keploy using command: -
Now let's run jest tests along keploy using command: -

```bash
npm test
npm test
```

To get Combined coverage with keploy test coverage: - 

```bash
npm run coverage
npm run coverage
```
