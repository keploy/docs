---
id: crud-nodejs
title: NodeJS Sample Application
sidebar_label: NodeJS - Express + Mongoose
description: The following sample app showcases how to use NodeJS framework and the Keploy Platform.
tags:
  - javascript
  - nodejs
  - expressjs
  - mongoDB
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - NodeJS Framework
  - ExpressJs
  - MongoDB
  - NodeJS
  - API Test generator
  - Auto Testcase generation
---

## Intoduction 📌

A sample **_CRUD_** application to see how Keploy integrates effortlessly with **_Express.js_** and **_MongoDB_**. Get ready to see the power of Keploy 🔅🔅.

## Get Started! 🎬

Clone the repository and move to crud-API folder

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/crud-API

# Install the dependencies
npm install
```

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

🎉 Wohoo! We are all set to use Keploy.

## 🎬 Capturing Testcases

To begin recording your application's API calls, open your terminal and navigate to your application directory using the cd command. Then, execute the following command:

```bash
keploy record -c "npm start"
```

Make API Calls using Hoppscotch, Postman or curl command. Keploy will capture those calls to generate the test-suites containing testcases and data mocks.

**1. Give Product details**<br />
**_POST REQUEST_**

```bash
curl --request POST \
  --url http://localhost:3000/api/products \
  --header 'content-type: application/json' \
  --data '{
    "name" : "airpods",
    "quantity": 4,
    "price": 20000
}'
```

Here's a response of what you get:

```json
{
  "name": "airpods",
  "quantity": 4,
  "price": 20000,
  "_id": "6629499175a4795410ee4012",
  "createdAt": "2024-04-24T18:04:01.499Z",
  "updatedAt": "2024-04-24T18:04:01.499Z",
  "__v": 0
}
```

**2. Get the Product details** <br />
**_GET REQUEST_**

```bash
curl --location --request GET 'http://localhost:3000/api/products/:id'
```

Replace the :id, with the id of the product of which you want the details in the upcoming API request!<br />

**3. Update the Product details**<br />
**_PUT REQUEST_**

```bash
curl --location --request PUT 'http://localhost:3000/api/products/:id' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "airpods",
    "quantity": 4,
    "price": 20000
    }'
```

**4. Delete a Product details**<br />
**_DELETE REQUEST_**

```bash
curl --location --request DELETE 'http://localhost:8080/potions/:id'
```

🎉 Easy right! Just one API call and you've whipped up a test case with a mock. Check out the Keploy directory to find your shiny new `test-1.yml` and `mocks.yml` files.

```yaml
version: api.keploy.io/v1beta1
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: GET
    proto_major: 1
    proto_minor: 1
    url: http://localhost:3000/
    header:
      Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8
      Accept-Encoding: gzip, deflate, br
      Accept-Language: en-GB,en
      Connection: keep-alived
      Host: localhost:3000
      If-None-Match: W/"22-1zTtRKCtWDH+a9AlmEC9xS1mvKM"
      Sec-Ch-Ua: '"Chromium";v="122", "Not(A:Brand";v="24", "Brave";v="122"'
      Sec-Ch-Ua-Mobile: ?0
      Sec-Ch-Ua-Platform: '"Linux"'
      Sec-Fetch-Dest: document
      Sec-Fetch-Mode: navigate
      Sec-Fetch-Site: none
      Sec-Fetch-User: ?1
      Sec-Gpc: "1"
      Upgrade-Insecure-Requests: "1"
      User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36
    body: ""
    timestamp: 2024-04-22T14:59:23.376284154+05:30
  resp:
    status_code: 304
    header:
      Connection: keep-alive
      Date: Mon, 22 Apr 2024 09:29:23 GMT
      Etag: W/"22-1zTtRKCtWDH+a9AlmEC9xS1mvKM"
      Keep-Alive: timeout=5
      X-Powered-By: Express
    body: ""
    status_message: Not Modified
    proto_major: 0
    proto_minor: 0
    timestamp: 2024-04-22T14:59:23.516347365+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1713778163
curl: |
  curl --request GET \
    --url http://localhost:3000/ \
    --header 'Sec-Fetch-User: ?1' \
    --header 'Sec-Fetch-Dest: document' \
    --header 'Upgrade-Insecure-Requests: 1' \
    --header 'Sec-Gpc: 1' \
    --header 'Accept-Encoding: gzip, deflate, br' \
    --header 'Sec-Fetch-Mode: navigate' \
    --header 'Accept-Language: en-GB,en' \
    --header 'Host: localhost:3000' \
    --header 'If-None-Match: W/"22-1zTtRKCtWDH+a9AlmEC9xS1mvKM"' \
    --header 'Sec-Ch-Ua-Mobile: ?0' \
    --header 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' \
    --header 'Sec-Fetch-Site: none' \
    --header 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8' \
    --header 'Connection: keep-alive' \
    --header 'Sec-Ch-Ua: "Chromium";v="122", "Not(A:Brand";v="24", "Brave";v="122"' \
    --header 'Sec-Ch-Ua-Platform: "Linux"' \
```

## Run keploy test

Want to see it in action? Run the following command to execute your Keploy tests

```bash
keploy test -c "npm run" --delay 10
```

Great job following along 🥳! Now, let's dive deeper and explore how to do Keploy integration with jest test 📌

## Get Keploy jest sdk

```bash
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

For the code coverage for the keploy API tests using the jest integration, you need to add the following test to your Jest test file. It can be called as `keploy.test.js`. Jest test file. It can be called as `keploy.test.js`.

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

Now let's run jest tests along keploy using command

```bash
npm test
```

To get Combined coverage with keploy test coverage

```bash
npm run coverage
```

## Wrapping it up 🎉

Congratulations! You've conquered Keploy and unleashed its power for effortless testing in your NodeJS application. With Jest by your side, you can ensure rock-solid code coverage. Time to go forth and build amazing things! 🧑🏻‍💻

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
