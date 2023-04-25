---
id: installation
title: Integration
description: Add the Keploy Typescript SDK to your application.
tags:
  - developer-guide
  - typescript
---

## Requirements

- npm 8+
- yarn

## Keploy Typescript-SDK
[Keploy](https://keploy.io) is a no-code testing platform that generates tests from API calls. This is the Typescript client SDK for recording and replaying the API Calls. There are 2 modes:
1. **Record mode**
    1. Record requests, response and sends to Keploy server.
    2. After keploy server removes duplicates, it then runs the request on the API again to identify noisy fields.
    3. Sends the noisy fields to the keploy server to be saved along with the testcase.
2. **Test mode**
    1. Fetches testcases for the app from keploy server.
    2. Calls the API with same request payload in testcase.
    3. Validates the respones and uploads results to the keploy server.

## Installation
```bash
npm i https://github.com/keploy/typescript-sdk
```

## Usage

```js
require("typescript-sdk/dist/integrations/express/register");
```
The require statement should be at the top of your main file (server.js).

Example :
```js
require("typescript-sdk/dist/integrations/express/register");
var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World!\n');
});
var server = app.listen(3000,() =>
console.log(`Example app listening on port 3000!`));
module.exports = server;
```

## Configure
```
export KEPLOY_MODE="test"
export KEPLOY_APP_NAME="my-app"
export KEPLOY_APP_HOST="localhost"
export KEPLOY_APP_PORT=5050 # port on which server is running
export KEPLOY_APP_DELAY=5 # time delay before starting testruns(in seconds)
export KEPLOY_APP_TIMEOUT=100 # should be number 
# export KEPLOY_APP_FILTER={"urlRegex":"*"}  # should be json not to capture for certain url's

export KEPLOY_SERVER_URL="http://localhost:6789/api" # self hosted keploy running server
# export KEPLOY_SERVER_LICENSE="XXX-XXX-XXX" # hosted keploy server api key
```
### KEPLOY_MODE
There are 3 modes:
 - **Record**: Sets to record mode.
 - **Test**: Sets to test mode.
 - **Off**: Turns off all the functionality provided by the API

**Note:** `KEPLOY_MODE` value is case sensitive.