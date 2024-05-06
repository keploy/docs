---
id: expressjs-mongodb
title: Expressjs Sample Application
sidebar_label: Express + MongoDb
description: The following sample app showcases how to use NodeJS framework and the Keploy Platform.
tags:
  - javascript
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - NodeJS Framework
  - MongoDB
  - NodeJS
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A simple sample CRUD application and see how seamlessly Keploy integrates with [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

Clone the repository and move to express-mongoose folder

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/express-mongo-priyank

# Install the dependencies
npm install
```

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

### Lights, Camera, Record! 🎥

#### Capturing Testcases

```
keploy record -c "npm start"
```

#### Let's generate the testcases.

Make API Calls using  [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

```bash
curl --request GET \
--url http://localhost:3001/api/products
```

Or simply wander over to your browser and visit ` http://localhost:3001/api/products`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

###  Run the following command to execute  Keploy tests for the application
```
keploy test -c "npm run" --delay 10
```

### Keploy Js SDK
```
npm i @keploy/sdk
```
### Update json file
```
"scripts": {
    "test": "jest --coverage --collectCoverageFrom='src/**/*.{js,jsx}'",
    "coverage": "nyc npm test && npm run coverage:merge && npm run coverage:report",
    "coverage:merge": "mkdir -p ./coverage && nyc merge ./coverage .nyc_output/out.json",
    "coverage:report": "nyc report --reporter=lcov --reporter=text"
  },
```
### usages
create a file under `test` folder & rename the file to `Keploy.test.js` & paste the code
```
const { expect } = require("@jest/globals");
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

### Run test

```
npm run test
```

### Check Coverage
```
npm run coverage
```

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨
