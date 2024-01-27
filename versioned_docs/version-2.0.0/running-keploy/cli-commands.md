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

### Common flags to use with all commands

- `--help, -h` - Shows the description and available help for the command

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

  In the above command, `config-dir` is the directory in the CWD where the Keploy configuration file `keploy-config.yaml` is stored.

- `--containerName string` - Name of the docker container in which the user application is running.
<!--
  ```bash
  keploy record --containerName "my-app-container"
  ``` -->

- `-d, --delay uint` - Delay in seconds to run user application. The default is 5 seconds.

  ```bash
  keploy record -c "node src/app.js" -d 10
  ```

- `- n, --networkName string` - Name of the docker network in which the user application is running.
<!--
  ```bash
  keploy record --containerName "my-app-container" -n "my-app-network"
  ``` -->

- `--passThroughPorts uints` - Ports of outgoing dependency calls to be ignored as mocks and passed through to the actual dependency. The default is no ports.
- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are to be saved.

  ```bash
  keploy record -c "node src/app.js" -p "./tests"
  ```

  In the above command, `tests` is the directory in the CWD where the recorded testcases and generated mocks are to be stored.

- `--proxyport uint32` - Port to choose to run Keploy as a proxy. The default is 16789.

  ```bash
  keploy record -c "node src/app.js" --proxyport 8080
  ```

- `--debug` - To start recording testcases with debug mode enabled.

  ```bash
  keploy record -c "node src/app.js" --debug
  ```

## [test](#test)

The `test` mode in Keploy allows the user to run the recoded testcases from the API calls and execute assertion. A detailed report is produced after the tests are executed and it's then saved in the yaml format in `keploy/reports` directory in the current working directory.

<b> Usage: </b>

```bash
keploy test [flags]
```

<b> Available flags: </b>

- `--apiTimeout uint` - Timeout in seconds for calling user application. The default is 5 seconds.

  ```bash
  keploy test -c "node src/app.js" --apiTimeout 10
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

  In the above command, `config-dir` is the directory in the CWD where the Keploy configuration file `keploy-config.yaml` is stored.

- `--containerName string` - Name of the docker container in which the user application is running.
<!--
  ```bash
  keploy test --containerName "my-app-container"
  ``` -->

- `-d, --delay uint` - Delay in seconds to run user application. The default is 5 seconds.

  ```bash
  keploy test -c "node src/app.js" --delay 10
  ```

- `--mongoPassword string` - Authentication password for mocking MongoDB connection. The default password is "default123".

  ```bash
  keploy test -c "node src/app.js" --mongoPassword "my-password"
  ```

- `- n, --networkName string` - Name of the docker network in which the user application is running.
<!--
  ```bash
  keploy test --containerName "my-app-container" -n "my-app-network" -d 9
  ``` -->

- `--passThroughPorts uints` - Ports of outgoing dependency calls to be ignored as mocks and passed through to the actual dependency. The default is no ports.
- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are saved.

  ```bash
  keploy test -c "node src/app.js" -d 10 --path "./tests"
  ```

  In the above command, `tests` is the directory in the CWD where the recorded testcases and generated mocks are saved.

- `--proxyport uint32` - Port to choose to run Keploy as a proxy. The default is 16789.

  ```bash
  keploy test -c "node src/app.js" --proxyport 8080
  ```

- `-t, --testsets strings` - To specify which specific testsets are to be executed. The default is all testsets.

  ```bash
  keploy test -c "node src/app.js" -t "test-set-1,test-set-3" --delay 10
  ```

- `--debug` - To start executing testcases with debug mode enabled.

  ```bash
  keploy test -c "node src/app.js" --delay 10 --debug
  ```

## [generate-config](#generate-config)

The `generate-config` command in Keploy is used to generate the Keploy Configuration File i.e. `keploy-config.yaml`. The generated configuration file is created in the current working directory.

<b> Usage: </b>

```bash
keploy generate-config [flags]
```

<b> Available flags: </b>

- `-p, --path string` - Path to the local directory where the Keploy Configuration File will be stored. The default is ".".

  ```bash
  keploy generate-config -p "./config-dir/"
  ```

  In the above command, `config-dir` is the directory in the CWD where the Keploy configuration file `keploy-config.yaml` is to be stored.

## [example](#example)

The `example` command in Keploy is designed to illustrate the usage of Keploy in various scenarios, showing its capabilities with different types of applications and setups. Below are examples for using Keploy with Golang, Node.js, Java, and Docker applications.

<b> Usage: </b>

```bash
keploy example [flags]
```

<b> Available Flags: </b>

- `--customSetup` - Displays commands tailored for custom user-defined setups.
