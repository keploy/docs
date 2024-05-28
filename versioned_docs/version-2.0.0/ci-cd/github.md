---
id: github
title: Integrating with GitHub CI
description: Guide into Keploy GitHub CI Pipeline
sidebar_label: GitHub
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
GitHub scripts are the easiest way to integrate Keploy with GitHub. We will be using [echo-sql](https://github.com/keploy/samples-go/tree/main/echo-sql) sample-application for the example. You can either add the following script to yout `github workflow` or create a new worflow `.github/workflows/keploy-test.yml`:-

```yaml
  - name: Checkout Commit
    uses: actions/checkout@v2
  - name: Set up Go
    uses: actions/setup-go@v2
    with:
        go-version: 1.2*.*

  - name: Keploy Tests
    id: keploy-run-test
    run: |
        curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
        sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy
        sudo mount -t debugfs debugfs /sys/kernel/debug
          
        ## Install application dependencies
        go mod download
        keploy test -c "go run main.go handler.go"
```

## GitHub Actions
GitHub Actions are a more advanced way to integrate Keploy with GitHub. We will be using [echo-sql](https://github.com/keploy/samples-go/tree/main/echo-sql) sample-application for the example. Create a new workflow unde `.github/workflow` with the name `keploy-test.yml`: - 

```yaml
name: Run keploy-test-cases
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, edited, synchronize, reopened]

jobs:
  my_job:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout
      uses: actions/checkout@v2
    - name: Test-Report
      uses: keploy/testgpt@main
      with:
        working-directory: /echo-sql
        delay: 10
        command: go run .
```

In the above example, we are using the `keploy/testgpt` action to run the test cases. The `working-directory` is the path to the application, `delay` is the time to wait for the application to start, and `command` is the command to run the test cases.

> **Note: `keploy/testgpt` action supports only amd_64 based runners.**

In both the cases, We will get to see output : -

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

  version: 2.1.0-alpha18

  🐰 Keploy: 2024-05-24T12:05:16Z 	INFO	config file not found; proceeding with flags only
  🐰 Keploy: 2024-05-24T12:05:16Z 	INFO	GitHub Actions workflow file generated successfully	{"path": "/githubactions/keploy.yml"}
  🐰 Keploy: 2024-05-24T12:05:16Z 	INFO	keploy initialized and probes added to the kernel.
  🐰 Keploy: 2024-05-24T12:05:17Z 	INFO	Java detected and successfully imported CA	{"path": "/usr/lib/jvm/temurin-11-jdk-amd64/lib/security/cacerts", "output": "Warning: use -cacerts option to access cacerts keystore\nCertificate was added to keystore\n"}
  🐰 Keploy: 2024-05-24T12:05:17Z 	INFO	Successfully imported CA	{"": "V2FybmluZzogdXNlIC1jYWNlcnRzIG9wdGlvbiB0byBhY2Nlc3MgY2FjZXJ0cyBrZXlzdG9yZQpDZXJ0aWZpY2F0ZSB3YXMgYWRkZWQgdG8ga2V5c3RvcmUK"}
  🐰 Keploy(test): 2024-05-27T19:50:15Z 	INFO	running	{"test-set": "test-set-0"}

    ____    __
    / __/___/ /  ___
  / _// __/ _ \/ _ \
  /___/\__/_//_/\___/ v4.9.0
  High performance, minimalist Go web framework
  https://echo.labstack.com
  ____________________________________O/_______
                                      O\
  ⇨ http server started on [::]:8082
  🐰 Keploy: 2024-05-24T13:56:28+05:30    INFO    starting test for of    {"test case": "test-1", "test set": "test-set-0"}

  Testrun passed for testcase with id: "test-1"

  --------------------------------------------------------------------

  🐰 Keploy: 2024-05-24T13:56:28+05:30    INFO    result  {"testcase id": "test-1", "testset id": "test-set-0", "passed": "true"}

  <=========================================> 
    TESTRUN SUMMARY. For test-set: "test-set-0"
          Total tests: 1
          Total test passed: 1
          Total test failed: 0
  <=========================================> 
  ...
  🐰 Keploy: 2024-05-24T13:56:28+05:30    INFO    test run completed      {"passed overall": true}
```

_And... voila! You have successfully integrated keploy in GitHub CI pipeline 🌟_

Hope this helps you out, if you still have any questions, reach out to us on our [Slack](https://join.slack.com/t/keploy/shared_invite/zt-2dno1yetd-Ec3el~tTwHYIHgGI0jPe7A)