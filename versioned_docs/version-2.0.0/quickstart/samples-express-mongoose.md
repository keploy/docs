---
id: express-mongoose-application
title: sample course selling api (express)
sidebar_label: NodeJS - Express + Mongoose
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
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/node-mongoose

# Install the dependencies
npm install
```

### Lights, Camera, Record! 🎥

### Docker installation and running the mongodb compass

## Here I'm using WSL , so follow below steps to configure docker with mongo db compass

**1. Install docker in your windows and follow this tutorial to connect with mongodb compass :**

```bash
https://www.youtube.com/watch?v=NEPZqSvKx40&list=PLff_PESolMjuDXQdjiqYRW_GnDQjU32QX
```

**2. after installing docker and running those commands in video use this command as well to create a network:**

```bash
docker network create keploy-network
```

> \*_url should look something like this depending on your connection you can adjust, also update your .env file with mongodb_url:`mongodb://127.0.0.1:27023/courses`._

#### Capturing Testcases

```bash
keploy record -c "npm start"
```

if using wsl use this :

```bash
sudo -E env PATH=$PATH keploy record -c 'npm start'
```

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml` after doing below steps

_Time to perform API magic!_
Follow the breadcrumbs... or Make more API Calls

Some api calls you can make

Get request - Get all courses

```bash
curl --request GET \
--url http://localhost:3000/courses
```

Post request - Add a new course

```bash
curl --location 'http://localhost:3000/courses' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'title=react advance' \
--data-urlencode 'description=advance' \
--data-urlencode 'price=1000' \
--data-urlencode 'published=true'
```

Put request - Add a new course

- Make sure to replace id of course

```bash
curl --location --request PUT 'http://localhost:3000/courses/6626a9cd3840cb305c0a6d52' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'title=react advance'
```

Delete request - Delete a course

- Make sure to replace id of course

```bash
curl --location --request DELETE 'http://localhost:3000/courses/6626a9cd3840cb305c0a6d52'
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
    url: http://localhost:3000/courses
    header:
      Accept: "*/*"
      Accept-Encoding: gzip, deflate, br
      Cache-Control: no-cache
      Connection: keep-alive
      Host: localhost:3000
      Postman-Token: 61d4ef71-85a9-4dd9-b036-6beb0136c8d7
      User-Agent: PostmanRuntime/7.32.1
    body: ""
    timestamp: 2024-04-22T23:56:36.910408265+05:30
  resp:
    status_code: 200
    header:
      Access-Control-Allow-Origin: "*"
      Connection: keep-alive
      Content-Length: "740"
      Content-Type: application/json; charset=utf-8
      Date: Mon, 22 Apr 2024 18:26:36 GMT
      Etag: W/"2e4-bpK0GltUbFpXKUMEiWddtMBI/a4"
      Keep-Alive: timeout=5
      X-Powered-By: Express
    body: '{"courses":[{"_id":"66269dd4a16b2f11f9c1c0e9","title":"python course","description":"advance","price":1000,"published":true,"__v":0},{"_id":"66269e13a16b2f11f9c1c0ec","title":"react course","description":"advance","price":1000,"published":true,"__v":0},{"_id":"66269f2034c9140719a0f7de","title":"express","description":"advance","price":1000,"published":true,"__v":0},{"_id":"6626a8f2946288ed91737eb7","title":"express and react","description":"advance","price":1000,"published":true,"__v":0},{"_id":"6626a9cd3840cb305c0a6d52","title":"react and next js","description":"advance","price":1000,"published":true,"__v":0},{"_id":"6626aa43f9602455c7dac9ea","title":"react advance","description":"advance","price":1000,"published":true,"__v":0}]}'
    status_message: OK
    proto_major: 0
    proto_minor: 0
    timestamp: 2024-04-22T23:56:38.951925148+05:30
  objects: []
  assertions:
    noise:
      header.Date: []
  created: 1713810398
curl: |
  curl --request GET \
    --url http://localhost:3000/courses \
    --header 'Connection: keep-alive' \
    --header 'User-Agent: PostmanRuntime/7.32.1' \
    --header 'Accept: */*' \
    --header 'Cache-Control: no-cache' \
    --header 'Postman-Token: 61d4ef71-85a9-4dd9-b036-6beb0136c8d7' \
    --header 'Host: localhost:3000' \
    --header 'Accept-Encoding: gzip, deflate, br' \
```

Or simply wander over to your browser and visit `http://localhost:3000/courses`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "npm start" --delay 10
```

If using wsl use this :

```bash
keploy -E env PATH=$PATH keploy test -c 'npm start' --delay 10
```

Keploy test report:
![image](https://github.com/s2ahil/samples-typescript/assets/101473078/48f2b866-04d1-433b-9270-34c15786893c)

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

### To Run test using jest use this command :

```bash
npm test
```

jest test coverage report :

![Screenshot 2024-04-22 025850](https://github.com/s2ahil/samples-typescript/assets/101473078/f60570d0-b998-4b4a-912d-80d4c73604e3)

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

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨
