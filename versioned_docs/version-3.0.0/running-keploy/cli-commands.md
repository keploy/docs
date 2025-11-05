---
id: cli-commands
title: Keploy CLI Commands
sidebar_label: CLI Commands
description: This section documents usecase of Keploy's CLI Commands
tags:
  - cli commands
keywords:
  - cli
  - documentation
  - commands
---

### Usage

```bash
keploy [command] [flags]
```

You can use `--help, -h` flag for all the commands to see available flag options and their purpose.

## Modes and Flags

Here are some examples of how to use some common flags:

| Mode        | Flags Available                                                                                                                                                                                                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `record`    | `-c, --command`, `--config-path`, `--containerName`, `-d, --delay`, `--metadata`, `-n, --networkName`, `--passThroughPorts`, `-p, --path`, `--proxyport`, `--debug`                                                                                                                                                                      |
| `test`      | `--apiTimeout`, `-c, --command`, `--config-path`, `--containerName`, `-d, --delay`, `--mongoPassword`, `-n, --net, --networkName`, `--passThroughPorts`, `-p, --path`, `--proxyport`, `-t, --testsets`, `--debug`, `-g, --generateTestReport`, `--removeUnusedMocks`, `--coverage`, `--goCoverage`, `--ignoreOrdering`, `--skip-preview` |
| `gen`       | `--sourceFilePath`, `--testFilePath`,`--coverageReportPath`,`--testCommand`,`--coverageFormat`,`--expectedCoverage`,`--maxIterations`,`--testDir`,`--llmBaseUrl`,`--model`,`--llmApiVersion`                                                                                                                                             |
| `normalize` | `-p, --path`, `--test-run`, `--tests`                                                                                                                                                                                                                                                                                                    |
| `rerecord`  | `--test-sets`, `-t`                                                                                                                                                                                                                                                                                                                      |
| `report`    | `--test-sets, -t`, `-p, --path`, `--report-path, -r`, `--body`                                                                                                                                                                                                                                                                           |
| `sanitize`  | `--test-sets, -t`, `-p, --path`                                                                                                                                                                                                                                                                                                          |
| `config`    | `--generate`,`-p, --path`                                                                                                                                                                                                                                                                                                                |

## [record](#record)

The `record` mode in Keploy allows the user to record Keploy testcases from the API calls. The recorded testcases and generated mocks are then saved in the `keploy` directory in the current working directory.

<b> Usage: </b>

```bash
keploy record [flags]
```

<b> Available flags: </b>

- `-c, --command string` - Command required to start the user application.

  ```bash
  keploy record --command "node src/app.js"
  ```

  In the command above, `node src/app.js` is the command which starts the user application.

- `--config-path string` - Path to the Keploy configuration file. The default is ".".

  ```bash
  keploy record -c "node src/app.js" --config-path "./config-dir/"
  ```

  In the above command, `config-dir` is the directory in the CWD where the Keploy configuration file `keploy.yaml` is stored.

- `--container-name string` - Name of the docker container in which the user application is running.

  ```bash
  keploy record -c "docker compose up" --container-name "my-app-container"
  ```

- `-d, --delay uint` - Delay in seconds to run user application. The default is 5 seconds.

  ```bash
  keploy record -c "node src/app.js" -d 10
  ```

- `--metadata string` - Key-value pairs to be added as metadata in the config.yaml file. If a `name` key is provided, it will be used as the test set name.

  ```bash
  keploy record -c "node src/app.js" --metadata "name=mac,env=production,service=gin-mongo,version=2.0.0,team.members[0]=alice,team.members[1]=bob,team.members[2]=carol,labels[0]=canary,labels[1]=stable,config.timeout=30s,config.timeout=60s,complex=a\\,b\\,c\\,d,database.urls[0]=db1.internal,database.urls[1]=db2.internal,database.urls[2]=db3.internal,mode=fast,mode=slow"
  ```

  ```bash
  keploy record -c "node src/app.js" --metadata "name=mac,env=production,service=gin-mongo,version=2.0.0,team.members[0]=alice,team.members[1]=bob,team.members[2]=carol,labels[0]=canary,labels[1]=stable,config.timeout=30s,config.timeout=60s,complex=a\\,b\\,c\\,d,database.urls[0]=db1.internal,database.urls[1]=db2.internal,database.urls[2]=db3.internal,mode=fast,mode=slow"
  ```

  > **Note:** If the same key is used multiple times, the last occurrence will be used.

- `- n, --network-name string` - Name of the docker network in which the user application is running.

  ```bash
  keploy record -c "docker compose up" --container-name "my-app-container" -n "my-app-network"
  ```

- `--pass-through-ports uints` - Ports of outgoing dependency calls to be ignored as mocks and passed through to the actual dependency. The default is no ports.
- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are to be saved.

  ```bash
  keploy record -c "node src/app.js" -p "./tests"
  ```

  In the above command, `tests` is the directory in the CWD where the recorded testcases and generated mocks are to be stored.

- `--proxy-port uint32` - Port to choose to run Keploy as a proxy. The default is 16789.

  ```bash
  keploy record -c "node src/app.js" --proxy-port 8080
  ```

- `--debug` - To start recording testcases with debug mode enabled.

  ```bash
  keploy record -c "node src/app.js" --debug
  ```

- `rerecord` - Record certain test-sets again

  ```bash
  keploy record -c "node src/app.js" --rerecord "test-set-0"
  ```

## [test](#test)

The `test` mode in Keploy allows the user to run the recoded testcases from the API calls and execute assertion. A detailed report is produced after the tests are executed and it's then saved in the yaml format in `keploy/reports` directory in the current working directory.

<b> Usage: </b>

```bash
keploy test [flags]
```

<b> Available flags: </b>

- `--api-timeout uint` - Timeout in seconds for calling user application. The default is 5 seconds.

  ```bash
  keploy test -c "node src/app.js" --api-timeout 10
  ```

- `-c, --command string` - Command required to start the user application.

  ```bash
  keploy test -c "node src/app.js"
  ```

  In the command above, `node src/app.js` is the command which starts the user application.

- `--config-path string` - Path to the Keploy configuration file. The default is ".".

  ```bash
  keploy test -c "node src/app.js" --config-path "./config-dir/"
  ```

  In the above command, `config-dir` is the directory in the CWD where the Keploy configuration file `keploy.yaml` is stored.

- `--container-name string` - Name of the docker container in which the user application is running.

  ```bash
  keploy test -c "docker compose up" --container-name "my-app-container"
  ```

- `-d, --delay uint` - Delay in seconds to run user application. The default is 5 seconds.

  ```bash
  keploy test -c "node src/app.js" --delay 10
  ```

- `--mongo-password string` - Authentication password for mocking MongoDB connection. The default password is "default123".

  ```bash
  keploy test -c "node src/app.js" --mongo-password "my-password"
  ```

- `- n, --network-name string` - Name of the docker network in which the user application is running.

  ```bash
  keploy test -c "docker compose up" --container-name "my-app-container" -n "my-app-network" -d 9
  ```

- `--pass-through-ports uints` - Ports of outgoing dependency calls to be ignored as mocks and passed through to the actual dependency. The default is no ports.

- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are saved.

  ```bash
  keploy test -c "node src/app.js" -d 10 --path "./tests"
  ```

  In the above command, `tests` is the directory in the CWD where the recorded testcases and generated mocks are saved.

- `--proxy-port uint32` - Port to choose to run Keploy as a proxy. The default is 16789.

  ```bash
  keploy test -c "node src/app.js" --proxy-port 8080
  ```

- `-t, --test-sets strings` - To specify which specific testsets are to be executed. The default is all testsets.

  ```bash
  keploy test -c "node src/app.js" -t "test-set-1,test-set-3" --delay 10
  ```

- `--debug` - To start executing testcases with debug mode enabled.

  ```bash
  keploy test -c "node src/app.js" --delay 10 --debug
  ```

- `-g, --generate-test-report` - To generate the test report. The default is true.

  ```bash
  keploy test -c "node src/app.js" --delay 10 -g=false
  ```

- `--remove-unused-mocks` - To remove unused mocks from mock file. The default is false.

  ```bash
  keploy test -c "node src/app.js" --delay 10 --remove-unused-mocks
  ```

- `--ignore-ordering` - Ignore the order of elements in an array for a response, with the default value being true.

  ```bash
  keploy test -c "node src/app.js" --delay 10 --ignore-ordering
  ```

- `--skip-coverage` - skip code coverage computation while running the test cases

- `--skip-preview` - skip line by line code coverage preview but display the total coverage.

  ```bash
  keploy test -c "node src/app.js" --delay 10 --skip-preview
  ```

- `--jacoco-agent-path` - Only applicable for test coverage for Java projects. You can override the jacoco agent jar by providing its path

## [gen](#gen)

The `gen` cmd in Keploy allows user to generate unit tests using LLM Models.

<b> Usage: </b>

```bash
keploy gen [flags]
```

<b> Available flags: </b>

- `sourceFilePath` - Path to the source file for which tests are to be generated.

- `testFilePath` - Path where the generated tests will be saved.

- `coverageReportPath` - Path to generate the coverage report.

- `testCommand` - Command to execute tests and generate the coverage report.

- `coverageFormat` - Type of the coverage report by default report is in "cobertura" format.

- `expectedCoverage` - Desired coverage percentage by default it is set to be at 100%.

- `maxIterations` - Maximum number of iterations for refining tests (default 5).

- `testDir` - Directory where tests will be written.

- `llmBaseUrl` - Base url of the llm.

- `model` - Specifies the AI model to use by default it uses "gpt-4o" model.

- `llmApiVersion` - API version of the llm if any.

## [normalize](#normalize)

The `normalize` cmd in Keploy allows user to change the response of the testcases according to the latest test run response that is executed by the user, this is useful when the API response of the testcases are changed due to code change or any other intentional change in the application.

This command is now “risk-aware” to prevent accidental acceptance of breaking API changes. By default, it will automatically update tests that failed with Low or Medium risk, but it will refuse to normalize any test that failed with a High risk, printing a warning instead.

<b> Usage: </b>

```bash
keploy normalize [flags]
```

<b> Available flags: </b>

- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are to be saved.

  ```bash
  keploy normalize -p "./tests"
  ```

  In the above command, `tests` is the directory in the CWD where the recorded testcases and generated mocks are to be stored.

- `--test-run string` - by default normalization considers the latest test-run to change the response of the testcases but if user want to do it for a particular test-run this flag can be used.

  ```bash
  keploy normalize -p "./tests" --test-run "test-run-10"
  ```

- `--tests string` - by default normalization considers all the testcases for normalization but if user want to normalize only few particular testcases or testsets this flag can be used

  ```bash
  keploy normalize -p "./tests" --test-run "test-run-10" --tests "test-set-1:test-1 test-2, test-set-2, test-set-3, test-set-4:test-3"
  ```

- `--allow-high-risk` - Allow normalization of high-risk test failures. This flag overrides the default safe behavior and updates all failed tests, including those with breaking changes.

  ```bash
  keploy normalize --allow-high-risk
  ```

## [rerecord](#rerecord)

The `rerecord` command allows users to record new Keploy test cases and mocks from existing test cases for the given testset(s).

**Usage:**

```bash
keploy rerecord -c "node src/app.js" -t "test-set-0"
```

**Docker Example:**

To re-record test cases for an application running inside a Docker container, use the Docker run command as the value for the `-c` flag:

```bash
keploy rerecord -c "sudo docker run -p 5000:5000 --name flask-jwt-app --network keploy-network flask-jwt-app" -t "test-set-0" --delay 10
```

**`--delay` flag:**

The `--delay` flag specifies the number of seconds Keploy should wait after starting your application before replaying requests to re-record.
This is useful if your application takes some time to start (for example, when running inside a Docker container or a heavy framework).

- Adjust the delay to match your app's startup time.
- For example, use `--delay 10` to wait for 10 seconds.

## [report](#report)

The `report` command in Keploy is used to display a detailed summary of test results. It can show a compact table-style diff or full body diffs (with colorized JSON), and it can read from the latest test run or a specific report file.

<b> Usage: </b>

```bash
keploy report [flags]
```

<b> Available flags: </b>

- `-t, --test-sets strings` - Testsets to report, e.g., `--test-sets "test-set-1, test-set-2"`. If omitted, all test sets in the latest run are considered.

  ```bash
  keploy report -t "test-set-1"
  ```

- `-p, --path string` - Path to the local directory where generated testcases/mocks are stored. Default is ".".

  ```bash
  keploy report -p "./keploy-tests"
  ```

- `--report-path, -r string` - **Absolute** path to a specific report file to display results from (must point to a file, not a directory). You can still combine this with other flags like `--summary` or `--test-case`.

  ```bash
  keploy report --report-path "/home/user/my-app/keploy/reports/test-run-1.yaml"
  ```

- `--full` - Show full diffs instead of the default compact table view. For JSON bodies, this produces colorized expected/actual comparisons.

  ```bash
  keploy report -t "test-set-1" --full
  ```

- `--summary` - Print only a summarized view (grand totals and per–test-set table with time taken). Useful for a quick dashboard-style overview. Can be combined with `-t/--test-sets` and `--report-path`.

  ```bash
  keploy report --summary
  ```

- `--test-case strings` (alias: `--tc`) - Filter output to specific test case IDs.

  ```bash
  keploy report --test-case "test-1"
  ```

> **Notes**
>
> - By default, `report` shows only **failed** tests with a compact, human-readable diff (status, headers—including trailers/content-length where applicable—and body changes).
> - Use `--full` to see the complete expected vs actual bodies (with JSON colorization).
> - `--summary` prints just the totals and a per–test-set table, optionally restricted with `-t/--test-sets`.
> - When `--report-path` is provided, Keploy reads that file directly. Legacy files that contain only a `tests` list are supported.

## [templatize](#templatize)

The `templatize` cmd allows the user to templatize important fields in the testcases who's values are used in the request of testcases and that may change in the future.

<b> Usage: </b>

```bash
keploy templatize [flags]
```

## [config](#config)

The `config` command in Keploy is used to generate the Keploy Configuration File i.e. `keploy.yaml`. The generated configuration file is created in the current working directory.

<b> Usage: </b>

```bash
keploy config [flags]
```

<b> Available flags: </b>

- `--generate` - Generate a new keploy configration file.

  ```bash
  keploy config --generate
  ```

- `-p, --path string` - Path to the local directory where the Keploy Configuration File will be stored. The default is ".".

  ```bash
  keploy config --generate --path "./config-dir/"
  ```

  In the above command, `config-dir` is the directory in the CWD where the Keploy configuration file `keploy.yaml` is to be stored.

## [example](#example)

The `example` command in Keploy is designed to illustrate the usage of Keploy in various scenarios, showing its capabilities with different types of applications and setups. Below are examples for using Keploy with Golang, Node.js, Java, and Docker applications.

<b> Usage: </b>

```bash
keploy example [flags]
```

<b> Available Flags: </b>

- `--customSetup` - Displays commands tailored for custom user-defined setups.
