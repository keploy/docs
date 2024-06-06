---
id: gitlab
title: Integrating with GitLab CI
description: Guide into Keploy GitLab CI Pipeline
sidebar_label: GitLab
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
    - curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
    - sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
    - sudo mount -t debugfs debugfs /sys/kernel/debug

  script:
    ## Steps to run application
    ...
```

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
$ keploy test -c "go run main.go handler.go"
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

version: 2.1.0-alpha18
🐰 Keploy: 2024-05-24T15:56:22+05:30    INFO    config file not found; proceeding with flags only
🐰 Keploy: 2024-05-24T15:56:22+05:30    WARN    Delay is set to 5 seconds, incase your app takes more time to start use --delay to set custom delay
🐰 Keploy: 2024-05-24T15:56:22+05:30    INFO    Example usage: keploy test -c "/path/to/user/app" --delay 6
...
🐰 Keploy: 2024-05-24T15:56:23+05:30    INFO    Proxy started at port:16789
🐰 Keploy: 2024-05-24T15:56:23+05:30    INFO    starting TCP DNS server at addr :26789
🐰 Keploy: 2024-05-24T15:56:23+05:30    INFO    running {"test-set": "test-set-0"}
🐰 Keploy: 2024-05-24T15:56:23+05:30    INFO    starting UDP DNS server at addr :26789

   ____    __
  / __/___/ /  ___
 / _// __/ _ \/ _ \
/___/\__/_//_/\___/ v4.9.0
High performance, minimalist Go web framework
https://echo.labstack.com
____________________________________O/_______
                                    O\
⇨ http server started on [::]:8082
🐰 Keploy: 2024-05-24T15:56:28+05:30    INFO    starting test for of    {"test case": "test-1", "test set": "test-set-0"}
Testrun passed for testcase with id: "test-1"

--------------------------------------------------------------------

🐰 Keploy: 2024-05-24T15:56:28+05:30    INFO    result  {"testcase id": "test-1", "testset id": "test-set-0", "passed": "true"}

 <=========================================>
  TESTRUN SUMMARY. For test-set: "test-set-0"
        Total tests: 1
        Total test passed: 1
        Total test failed: 0
 <=========================================>
...
🐰 Keploy: 2024-05-24T15:56:28+05:30    INFO    test run completed      {"passed overall": true}
```

_And... voila! You have successfully integrated keploy in GitLab CI/CD pipeline 🌟_

Integrating Keploy with GitLab CI automates the testing process, ensuring that tests are run with every commit and merge request. And by running tests automatically in CI pipeline, you can catch issues early and ensure that your application remains stable and reliable.

Hope this helps you out, if you still have any questions, reach out to us on our [Slack](https://join.slack.com/t/keploy/shared_invite/zt-2dno1yetd-Ec3el~tTwHYIHgGI0jPe7A)
