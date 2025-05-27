---
id: github
title: Integrating with GitHub CI
description: Guide into Keploy GitHub CI Pipeline
sidebar_label: GitHub Workflows
keywords:
  - ci testing
  - ci/cd
  - github
  - ci pipeline
tags:
  - ci
  - cd
  - plugin
---

Keploy can be integrated with GitHub by two methods:-

1. [Using Shell Scripts](#shell-scripts)
2. [Using GitHub Actions](#github-actions)

## Shell Scripts

GitHub scripts are the easiest way to integrate Keploy with GitHub. We will be using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application for the example. You can either add the following script to yout `github workflow` or create a new worflow `.github/workflows/keploy-test.yml`:-

```yaml
- name: Checkout Commit
  uses: actions/checkout@v2
- name: Keploy Tests
  id: keploy-run-test
  run: |
    curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz --overwrite -C /tmp
    sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
  ...
```

> **Note: if you are using `arm_64` as runner use below to download keploy binary**

`curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp`

### Example with Scripts

While using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application with keploy test in GitHub CI, the workflow would like:-

```yaml
- name: Checkout Commit
  uses: actions/checkout@v2
- name: Set up Node
  uses: actions/setup-node@v2
  with:
    node-version: 18

- name: Keploy Tests
  id: keploy-run-test
  run: |
    curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz --overwrite -C /tmp
    sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy

    # Install application dependencies
    npm install

    # Run the keploy captured tests
    keploy test -c "node src/app.js"
```

We will get to see output : -

```sh

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

  🐰 Keploy: 2024-06-05T04:55:12Z 	INFO	config file not found; proceeding with flags only
  🐰 Keploy: 2024-06-05T04:55:12Z 	WARN	Delay is set to 5 seconds, incase your app takes more time to start use --delay to set custom delay
  🐰 Keploy: 2024-06-05T04:55:12Z 	INFO	Example usage: keploy test -c "/path/to/user/app" --delay 6
  🐰 Keploy: 2024-06-05T04:55:12Z 	INFO	GitHub Actions workflow file generated successfully	{"path": "/githubactions/keploy.yml"}
  🐰 Keploy: 2024-06-05T04:55:13Z 	INFO	keploy initialized and probes added to the kernel.

  ...

  🐰 Keploy: 2024-06-05T04:55:16Z 	INFO	starting TCP DNS server at addr :26789
  🐰 Keploy: 2024-06-05T04:55:16Z 	INFO	starting UDP DNS server at addr :26789
  🐰 Keploy: 2024-06-05T04:55:16Z 	INFO	Proxy started at port:16789
  🐰 Keploy: 2024-06-05T04:55:16Z 	INFO	running	{"test-set": "test-set-0"}

  Listening on port 8000
  Connected to MongoDB

  🐰 Keploy: 2024-06-05T04:55:21Z 	INFO	starting test for of	{"test case": "test-1", "test set": "test-set-0"}

  Testrun passed for testcase with id: "test-1"

  --------------------------------------------------------------------

  🐰 Keploy: 2024-06-05T04:55:21Z    INFO    result  {"testcase id": "test-1", "testset id": "test-set-0", "passed": "true"}

  <=========================================>
    TESTRUN SUMMARY. For test-set: "test-set-0"
          Total tests: 1
          Total test passed: 1
          Total test failed: 0
  <=========================================>

  🐰 Keploy: 2024-06-05T05:18:49Z 	INFO	test run completed	{"passed overall": true}
  🐰 Keploy: 2024-06-05T05:18:49Z 	INFO	stopping Keploy	{"reason": "replay completed successfully"}
  🐰 Keploy: 2024-06-05T05:18:49Z 	INFO	proxy stopped...
  🐰 Keploy: 2024-06-05T05:18:50Z 	INFO	eBPF resources released successfully...
```

_And... voila! You have successfully integrated keploy in GitHub CI pipeline 🌟_

---

## GitHub Actions

GitHub Actions are a more advanced way to integrate Keploy with GitHub. We will be using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application for the example. Create a new workflow under `.github/workflow` with the name `keploy-test.yml`: -
GitHub Actions are a more advanced way to integrate Keploy with GitHub. We will be using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application for the example. Create a new workflow under `.github/workflow` with the name `keploy-test.yml`: -

```yaml
jobs:
  my_job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Test-Report
        uses: keploy/testgpt@main
        with:
          command: "<CMD_TO_RUN_APP>" ## Command to run the application
```

In the above example, we are using the `keploy/testgpt` action to run the test cases.

> - `working-directory` (optional) is the path to the application by default it takes root to find keploy folder.
> - `delay` (optional) is the time to wait for the application to start.
> - `command` is the command to run your application.

### Example with Actions

While using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application with keploy test in GitHub CI via actions, the workflow would like:-

```yaml
jobs:
  keploy_test_case:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Test-Report
        uses: keploy/testgpt@main
        with:
          working-directory: /express-mongoose
          delay: 10
          command: "node src/app.js"
```

> **Note: `keploy/testgpt` action supports only amd_64 based runners.**

We will get to see output : -

```sh
Test Mode Starting 🎉
sudo -E keploy test -c node src/app.js --delay 10 --path ./

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

  🐰 Keploy: 2024-06-05T05:18:35Z 	INFO	config file not found; proceeding with flags only
  🐰 Keploy: 2024-06-05T05:18:35Z 	INFO	GitHub Actions workflow file generated successfully	{"path": "/githubactions/keploy.yml"}
  🐰 Keploy: 2024-06-05T05:18:35Z 	INFO	keploy initialized and probes added to the kernel.

  ...

  🐰 Keploy: 2024-06-05T05:18:39Z 	INFO	starting TCP DNS server at addr :26789
  🐰 Keploy: 2024-06-05T05:18:39Z 	INFO	starting UDP DNS server at addr :26789
  🐰 Keploy: 2024-06-05T05:18:39Z 	INFO	Proxy started at port:16789
  🐰 Keploy: 2024-06-05T05:18:39Z 	INFO	running	{"test-set": "test-set-0"}
  Listening on port 8000
  Connected to MongoDB
  🐰 Keploy: 2024-06-05T05:18:49Z 	INFO	starting test for of	{"test case": "test-1", "test set": "test-set-0"}

  Testrun passed for testcase with id: "test-1"

  --------------------------------------------------------------------

  🐰 Keploy: 2024-06-05T04:55:21Z    INFO    result  {"testcase id": "test-1", "testset id": "test-set-0", "passed": "true"}

  <=========================================>
    TESTRUN SUMMARY. For test-set: "test-set-0"
          Total tests: 1
          Total test passed: 1
          Total test failed: 0
  <=========================================>
  ...
  🐰 Keploy: 2024-06-05T04:55:21Z    INFO    test run completed      {"passed overall": true}
```

_And... voila! You have successfully integrated keploy in GitHub CI pipeline 🌟_

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
