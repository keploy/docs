---
id: gitlab
title: Integrating with GitLab CI
description: Guide into Keploy GitLab CI Pipeline
sidebar_label: GitLab Runner
keywords:
  - ci testing
  - ci/cd
  - github
  - gitlab
tags:
  - ci
  - cd
  - plugin
---

Keploy can integrated with GitLab CI to streamline your testing process and ensure continuous testing as part of your CI/CD pipeline.

## Create pipeline

To integrate the Keploy in `GitLab`, we first need to install and setup by adding the following steps to our `.gitlab-ci.yml` : -

```yaml
---
stages:
  - test

keploy-test-job: # This job runs in the test stage.
  image: ubuntu:latest
  stage: test
  before_script:
    ## Add the dependencies && Install Keploy Binary

    - apt update && apt install -y sudo curl
    - curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz --overwrite -C /tmp
    - sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
    - sudo mount -t debugfs debugfs /sys/kernel/debug

  script:
    ## Steps to run application
    ...
```

> **Note: if you are using `arm_64` as runner use below to download keploy binary**

`curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp`

Now that we have Keploy installed, and all ready, we need switch to path where `keploy` folder is present in our application and install all the application related dependencies. Since we are using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application, steps in our `script:` would look like below:-

```yaml
script:
  ## Steps to run express-mongoose application
  - apt install -y nodejs npm
  - cd express-mongoose
  - npm install -y
  - keploy test -c "npm start"
```

In your `.gitlab-ci.yml file`, in last step we have `keploy test` command to run your keploy generated test suite, this sets up Keploy to replay the interactions it has generated and perform CI Testing.

We will get to see output : -

```sh
$ keploy test -c "npm start"
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

  version: 2.1.0-alpha23

  🐰 Keploy: 2024-06-05T06:32:52Z INFO config file not found; proceeding with flags only
  🐰 Keploy: 2024-06-05T06:32:52Z WARN Delay is set to 5 seconds, incase your app takes more time to start use --delay to set custom delay
  🐰 Keploy: 2024-06-05T06:32:52Z INFO Example usage: keploy test -c "/path/to/user/app" --delay 6
  🐰 Keploy: 2024-06-05T06:32:52Z INFO GitHub Actions workflow file generated successfully	{"path": "/githubactions/keploy.yml"}
  🐰 Keploy: 2024-06-05T06:32:53Z INFO keploy initialized and probes added to the kernel.
  🐰 Keploy: 2024-06-05T06:32:54Z INFO Keploy has taken control of the DNS resolution mechanism, your application may misbehave if you have provided wrong domain name in your application code.
  🐰 Keploy: 2024-06-05T06:32:54Z INFO starting TCP DNS server at addr :26789
  🐰 Keploy: 2024-06-05T06:32:54Z INFO Proxy started at port:16789
  🐰 Keploy: 2024-06-05T06:32:54Z INFO running	{"test-set": "test-set-0"}
  🐰 Keploy: 2024-06-05T06:32:54Z INFO starting UDP DNS server at addr :26789

  > NodeMongo@1.0.0 start
  > node src/app.js

  Listening on port 8000
  Connected to MongoDB
  🐰 Keploy: 2024-06-05T06:32:59Z INFO starting test for of	{"test case": "test-1", "test set": "test-set-0"}
  Testrun passed for testcase with id: "test-1"

  --------------------------------------------------------------------

  🐰 Keploy: 2024-06-05T06:32:54Z    INFO    result  {"testcase id": "test-1", "testset id": "test-set-0", "passed": "true"}

  <=========================================>
    TESTRUN SUMMARY. For test-set: "test-set-0"
          Total tests: 1
          Total test passed: 1
          Total test failed: 0
  <=========================================>
  ...
  🐰 Keploy: 2024-06-05T06:32:54Z    INFO    test run completed      {"passed overall": true}
```

_And... voila! You have successfully integrated keploy in GitLab CI/CD pipeline 🌟_

Integrating Keploy with GitLab CI automates the testing process, ensuring that tests are run with every commit and merge request. And by running tests automatically in CI pipeline, you can catch issues early and ensure that your application remains stable and reliable.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
