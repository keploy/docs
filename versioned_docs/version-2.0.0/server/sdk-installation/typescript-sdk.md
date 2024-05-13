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
5. [nyc](https://www.npmjs.com/package/nyc)
6. [Keploy SDK](https://github.com/keploy/keploy?tab=readme-ov-file#-quick-installation)
7. [Jest](https://jestjs.io/docs/getting-started)

## Installation

### Get Keploy jest sdk

[Install the latest release of the Keploy Jest SDK](https://www.npmjs.com/package/@keploy/sdk)

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

You can get the coverage with Keploy in 2 ways:

1. [Using Keploy Binary](#Using-Keploy-Binary)
2. [Using Keploy Docker](#Using-Keploy-Docker)

## Using Keploy Binary

To get the coverage of Keploy's API tests, you can run the command given below:

```bash
keploy test -c "<command-to-run-your-application>" --delay 10
```

To combine the coverages and get the reports, you can refer to [this](#combine-and-get-report) section.

## Using Keploy Docker

Add the following lines to your `Dockerfile` to install the coverage library and to start the application with the coverage library.

```bash
RUN yarn install nyc
CMD ["nyc","<command-to-run-your-application>"]
```

You need to make sure that your present working directory on the host is mounted to the working directory in the docker container. In a docker compose file, it will look something like this:

```bash
    volumes:
      - .:<working-directory-in-the-container>
```

To get the coverage of Keploy's API tests, you can run the command given below:

```bash
keploy test -c "<command-to-run-your-docker-application>" --containerName=<container-name-on-which-tests-have-been-recorded> --buildDelay 100s --delay 10
```

Now, to get the coverage of your unit tests, you need to update the run command in your Dockerfile to:

```bash
CMD ["npm", "test"]
```

To get the unit coverage you can either run it by using your normal docker run command, or to run it using Keploy, you can use the command below:

```bash
keploy test -c "<command-to-run-your-docker-application>" --containerName=<container-name-on-which-tests-have-been-recorded> --buildDelay 100s --delay 10
```

## Combine And Get Report

Now that you have the coverages of both your unit tests and Keploy's API tests, you can combine them and get the report.

To get Combined coverage with keploy test coverage: -

```bash
npm run coverage
```
