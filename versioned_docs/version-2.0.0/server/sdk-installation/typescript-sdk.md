---
id: typescript
title: Integrate with Jest
sidebar_label: Integrate with Jest framework
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

## Installation

### Get Keploy jest sdk

[Install the latest release of the Keploy Jest SDK](https://www.npmjs.com/package/@keploy/typescript-sdk)

```bash
npm i @keploy/typescript-sdk
```

## Usage

For the code coverage for the keploy API tests using the `jest` integration, you need to add the following test to your Jest test file. It can be called as `Keploy.test.js`.

```javascript
const {KeployTest, Config} = require("@keploy/typescript-sdk/dist/keployCli");

const timeOut = 300000;

const {expect} = require("@jest/globals");
describe(
  "Keploy Server Tests",
  () => {
    test(
      "TestKeploy",
      async () => {
        testResult = await KeployTest();
        // const config = new Config('npm start')
        // testResult =  await KeployTest(config)
        //by default command is set to "npm start", incase of custom command update the keployTest as shown above
        expect(testResult).toBeTruthy();
      },
      timeOut
    );
  },
  timeOut
);
```

Now let's run jest tests along keploy using command:-

```bash
sudo -E PATH=$PATH keploy test -c "npm test" --delay 15
```
