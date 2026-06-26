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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy can be integrated with GitHub by two methods:-

1. [Using Shell Scripts](#shell-scripts)
2. [Using GitHub Actions](#github-actions)

You can also [run cloud replay from your CI pipeline](#running-cloud-replay-in-ci).

## Shell Scripts

GitHub scripts are the easiest way to integrate Keploy with GitHub. We will be using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application for the example. You can either add the following script to your `github workflow` or create a new workflow `.github/workflows/keploy-test.yml`:-

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

---

## Running cloud replay in CI

Keploy cloud replay re-runs your recorded test sets from a CI pipeline. It works the same way on any CI control plane — GitHub Actions, GitLab CI, Jenkins, and others — and with both Keploy Cloud and a self-hosted Keploy setup. The pipeline authenticates with an API key from an environment variable, so it needs no browser login.

> Cloud replay uses the Enterprise Keploy binary, which the steps below install.

The flow is the same on every CI system:

1. Store your Keploy API key as a secret and expose it as the `KEPLOY_API_KEY` environment variable. The Keploy CLI reads this variable automatically.
2. Install the Enterprise Keploy binary on the runner.
3. Run `keploy cloud replay` with your application and cluster details.

Because the replay command is plain CLI, it is identical across CI systems:

```bash
keploy cloud replay \
  --app "<NAMESPACE>.<DEPLOYMENT>" \
  --cluster "<CLUSTER>" \
  --namespace "<NAMESPACE>" \
  --delay <DELAY>
```

Replace `<NAMESPACE>`, `<DEPLOYMENT>`, and `<CLUSTER>` with your own values, and set `<DELAY>` to cover your application's startup time.

### Example: GitHub Actions

```yaml
jobs:
  keploy-cloud-replay:
    runs-on: ubuntu-latest
    env:
      KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
    steps:
      - name: Install Keploy
        run: |
          curl --silent --location "https://keploy.io/ent/dl/latest/enterprise_linux_amd64" -o /tmp/keploy
          sudo chmod +x /tmp/keploy && sudo mv /tmp/keploy /usr/local/bin/keploy

      - name: Cloud replay
        run: |
          keploy cloud replay \
            --app "<NAMESPACE>.<DEPLOYMENT>" \
            --cluster "<CLUSTER>" \
            --namespace "<NAMESPACE>" \
            --delay <DELAY>
```

### Other CI systems

The steps are identical elsewhere — expose `KEPLOY_API_KEY` from your secret store, install the binary, then run the command. For example, GitLab CI uses a masked CI/CD variable and Jenkins uses a credentials binding:

```bash
export KEPLOY_API_KEY="$KEPLOY_API_KEY" # injected from your CI secret store
curl --silent --location "https://keploy.io/ent/dl/latest/enterprise_linux_amd64" -o /tmp/keploy
sudo chmod +x /tmp/keploy && sudo mv /tmp/keploy /usr/local/bin/keploy
keploy cloud replay --app "<NAMESPACE>.<DEPLOYMENT>" --cluster "<CLUSTER>" --namespace "<NAMESPACE>" --delay <DELAY>
```

> `--delay` sets how long Keploy waits for the application to become ready before it sends requests. If it is shorter than the application's startup time, the tests can fail, so set it to comfortably cover the boot time.

Hope this helps you out, if you still have any questions, reach out to us .

---

## Running cloud replay in CI

Keploy cloud replay re-runs your recorded test sets from a CI pipeline. It works with both **Keploy Cloud** and a **self-hosted Keploy** setup — the command is the same either way.

### How authentication works

The CLI reads the `KEPLOY_API_KEY` environment variable automatically. You do not need to pass it as a flag or log in through a browser.

- Locally: `export KEPLOY_API_KEY="<your-api-key>"` before running the command.
- In CI: add the key as a secret in your CI settings so the system injects it as an environment variable at runtime. Never hardcode it in your pipeline file.

In GitHub Actions, secrets are stored under **Settings → Secrets and variables → Actions** and referenced in the pipeline as `${{ secrets.KEPLOY_API_KEY }}`.

### Steps

1. Add `KEPLOY_API_KEY` as a repository secret in GitHub (**Settings → Secrets and variables → Actions**).
2. Install the Enterprise Keploy binary on the runner.
3. Run `keploy cloud replay` with your application and cluster details.

> Cloud replay requires the Enterprise binary (`keploy.io/ent/dl/latest/enterprise_linux_amd64`), not the open-source one.

### Example: GitHub Actions

```yaml
jobs:
  keploy-cloud-replay:
    runs-on: ubuntu-latest
    env:
      KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
    steps:
      - name: Install Keploy Enterprise
        run: |
          curl --silent --location "https://keploy.io/ent/dl/latest/enterprise_linux_amd64" -o /tmp/keploy
          sudo chmod +x /tmp/keploy && sudo mv /tmp/keploy /usr/local/bin/keploy

      - name: Cloud replay
        run: |
          keploy cloud replay \
            --app "<NAMESPACE>.<DEPLOYMENT>" \
            --cluster "<CLUSTER>" \
            --namespace "<NAMESPACE>" \
            --delay <DELAY>
```

Replace `<NAMESPACE>`, `<DEPLOYMENT>`, `<CLUSTER>`, and `<DELAY>` with your own values. Set `<DELAY>` to cover your application's startup time (in seconds).

> `KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}` pulls the secret from GitHub's secret store and makes it available as a plain environment variable in all subsequent steps.
