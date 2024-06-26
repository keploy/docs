---
id: testing-guide
title: testing Guide
sidebar_label: Testing Guide
tags:
  - explanation
  - running guide
  - ci guide
  - limitations
---

# Testing Guide 🧪

In this blog, we will learn how test bench of keploy works and how you can contribute to keploy's code coverage.

## Keploy test Keploy?

- Keploy's test bench is built on the principle that Keploy can test itself, operating in two distinct modes: `RECORD` and `TEST`. Each mode activates different sections of the codebase, with some overlap between the two. These modes can be executed concurrently to enhance testing efficiency.

- `keployR` & `keployT` are similar binaries just the name is different for readability.

- For example, if you have recorded tests and mocks for a Go + MongoDB application [keploy/samples-go/gin-mongo](https://github.com/keploy/samples-go/tree/native-linux/gin-mongo), the test bench allows you to run Keploy in test mode (`keployT`) from within Keploy in record mode (`keployR`) using the following pseudo command: `keployR record -c "keployT test -c ./gin-mongo-app`. This command initiates Keploy in record mode, which in turn launches Keploy in test mode to run the application. As `keployT` executes the test sets, it simulates API calls for each test case. These simulated API calls are then recorded as tests by `keployR`, along with any external calls from the application being captured as mocks. Meanwhile, `keployT` generates a final report of the test runs. This approach allows for the simultaneous execution of both Keploy's record and test flows.

- One significant benefit of this method is that it eliminates the need to set up external dependencies in the CI pipeline for testing. `KeployT` acts as a virtual database, with its calls being recorded by `keployR`, streamlining the testing process.

## Running Guide

This guide includes the recording and testing of tests and mocks with the help of keploy test-bench.

### Setup

- Get the latest version of keploy by following [this](https://github.com/keploy/keploy?tab=readme-ov-file#-quick-installation). And rename the binary to `keployR` (released) using `sudo mv usr/local/bin/keploy /usr/local/bin/keployR`

- Get the current version of keploy by building the binary with current changes using

```bash
go build -tags=viper_bind_struct -cover -o keployB . && sudo mv keployB /usr/local/bin/keployB
```

- You will now have built and released binary of keploy as `keployB` and `keployR` respectively.

- Take any application, I've tested for the gin-mongo sample app so you can take that one as of now. And record test some cases, make at least two sessions of recording. Use the below command to record tests and mocks via the released binary of keploy

```bash
sudo -E env PATH=$PATH keployR record -c "<running cmd of gin-mongo>"
```

- You will also be requiring [pilot](https://github.com/keploy/pilot) to assert tests and prepare mocks for assertion, you can get the latest pilot using:

```bash
curl --silent -o pilot --location "https://github.com/keploy/pilot/releases/latest/download/pilot_linux_amd64" &&
          sudo chmod a+x pilot && sudo mkdir -p /usr/local/bin && sudo mv pilot /usr/local/bin
```

- To enable testing mode of keploy, `--enableTesting` flag is required.

### Why both released and built keploy binaries?

Note: Here `keployR` is released binary and `keployB` is built binary.
The idea is that there will be two cases:

1. The latest released version of keploy will be used for recording the tests & mocks using and built version of keploy will be used for testing.
   i.e. `keployR record -c "keployB test -c ./gin-mongo-app`.

2. The latest released version of keploy will be used for testing and built version of keploy will be used for recording tests & mocks.
   i.e. `keployB record -c "keployR test -c ./gin-mongo-app`.

These two scenarios are designed to ensure the detection of changes, including any potential breaking changes or adjustments that may affect backward compatibility.

### Recording and testing of tests and mocks via test-bench

Right now, in this guide i am only showing the first scenario, to run the second scenario you just need to replace the binaries as mentioned in the **4th** step.

#### Recording Phase 🎥

1. Since you now already have some recorded tests and mocks of gin-mongo application, let's call it **pre-recorded** tests.

2. To record tests and mocks via test-bench, you need to run this command to record test cases (for each test-set you have to run this command):

```bash
sudo -E env PATH=$PATH keployR record -c "sudo -E env PATH=$PATH keployB test -c '<binary of gin-mongo>' --proxyPort 56789 --dnsPort 46789  --delay=<delay> --testsets <test-set-id> --configPath '<config-path>' --path '<path-to-pre-recorded-tests>' --enableTesting --generateGithubActions=false" --path "./test-bench/" --proxyPort=36789 --dnsPort 26789 --configPath '<config-path>' --enableTesting --generateGithubActions=false
```

3. This above command will generate new tests and mocks from your existing **pre-recorded** tests and mocks.

4. For second scenario, you just need to use `keployB` for recording and `keployR` for testing.

#### Testing Phase 🧪

1. **_Assert the tests_**

With this step, your tests undergo validation as the pilot compares HTTP requests and responses from both the **pre-recorded** and **test-bench-recorded** tests. This comparison considers noisy fields, utilizing the configuration file for accuracy.

```bash
pilot -test-assert -preRecPath <path-to-pre-recorded-tests> -testBenchPath ./test-bench -configPath <path-to-config-file>
```

2. **_Prepare mock assertions_**

By feeding the mocks from the newly recorded test cases into the pre-recorded ones (and vice versa), and observing if the results match those obtained with the original mocks, you can confirm the validity of the new mocks. This reciprocal testing ensures the integrity and reliability of the newly generated test data.

However, Keploy uniquely incorporates the timestamps of each request and response in the tests (ingress) and compares these with the timestamps in the mocks (egress). This method significantly reduces the chances of mismatches by selectively retaining only the mocks that come under the request and response time of the test case.

Directly incorporating mocks recorded through the testing approach into pre-recorded test cases could lead to failures, as these were initially recorded at much earlier times. To overcome this issue, we swap the timestamps of the request and response between the pre-recorded and newly recorded test cases. This adjustment ensures that the mocks are compatible and can be effectively utilized without disrupting the natural workflow of Keploy. Thus, this strategy allows us to use the mocks correctly and ensures the accuracy of our test validations.

```bash
pilot -mock-assert -preRecPath <path-to-pre-recorded-tests> -testBenchPath ./test-bench -configPath <path-to-config-file>
```

3. **_Do the actual mock assertion_**

You just need to run test mode for both the **pre-recorded** and newly **test-bench-recorded** tests and mocks via the released binary of keploy.

- For **pre-recorded**:

```bash
sudo -E env PATH=$PATH keployR test -c "<app running command>" --delay <app delay> --path "<path-to-pre-recorded-tests>" --generateGithubActions=false
```

- For **test-bench-recorded**:

```bash
sudo -E env PATH=$PATH keployR test -c "<app running command>" --delay <app delay> --path "./test-bench" --generateGithubActions=false
```

If both scenarios yield a "passed" result, it signifies that this approach mirrors the standard recording and testing process via Keploy. In that case, you're all set to proceed, and your tests and mocks are considered legitimate.

## Running the setup in CI (Github Actions)

- Implementing this setup in CI will enhance Keploy's testing by incorporating various sample applications with different supported dependencies. This comprehensive testing will thoroughly assess Keploy's major components, including the proxy and parsers.

- To achieve this, you'll need to add two workflows for each sample application, covering both recording and testing scenarios.

- You can refer to this [setup](https://github.com/keploy/keploy/blob/main/.github/workflows/build_stage.yml) for guidance.

## Limitations ⚠️

- Port Configuration: The ports for Keploy Record (`keployR`) and Keploy Test (`keployT`) need to be hardcoded. You can't change the ports and run this entire setup properly.
- Sequential Test Sets: Only one test set can be run at a time.
- Limited Environment Support: This feature is currently available only for native binary environments and not for Docker environments.
- Recording Delay: After the test runs, there is a waiting period of 1 second to ensure proper recording of test cases. (related to implementation)
- Process Filtering: Internally, Keploy Record (`keployR`) should handle only application-related calls and not Keploy Test (`keployT`) related calls. To achieve this, `keployT` waits for `keployR` to retrieve the PID before starting the test run. This ensures that `keployR` can filter out `keployT` related calls based on the PID. (related to implementation)
- As of now, running this setup on `WSL` is not handled.
- Don't rename the **test-sets** or **test-cases** while running this setup.

<!-- To understand the internals you can refer to this [blog](blog link). -->

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
