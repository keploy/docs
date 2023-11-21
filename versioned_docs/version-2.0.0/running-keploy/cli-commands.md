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

## Table of Contents

Keploy CLI has the following <b> commands </b>:

- [Usage](#usage)
- [Common flags to use with all commands](#common-flags-to-use-with-all-commands)
- [record](#record)
- [test](#test)
- [generate-config](#generate-config)

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
- `--config-path string` - Path to the Keploy configuration file. The default is ".".
- `--containerName string` - Name of the docker container in which the user application is running.
- `-d, --delay uint` - Delay in seconds to run user application. The default is 5 seconds.
- `- n, --networkName string` - Name of the docker network in which the user application is running.
- `--passThroughPorts uints` - Ports of outgoing dependency calls to be ignored as mocks and passed through to the actual dependency. The default is no ports.
- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are to be saved.
- `--proxyport uint32` - Port to choose to run Keploy as a proxy.
- `--debug` - To start recording testcases with debug mode enabled.

## [test](#test)

The `test` mode in Keploy allows the user to run the recoded testcases from the API calls and execute assertion. A detailed report is produced after the tests are executed and it's then saved in the yaml format in `keploy/reports` directory in the current working directory.

<b> Usage: </b>

```bash
keploy test [flags]
```

<b> Available flags: </b>

- `--apiTimeout uint` - Timeout in seconds for calling user application. The default is 5 seconds.
- `-c, --command string` - Command required to start the user application.
- `--config-path string` - Path to the Keploy configuration file. The default is ".".
- `--containerName string` - Name of the docker container in which the user application is running.
- `-d, --delay uint` - Delay in seconds to run user application. The default is 5 seconds.
- `--mongoPasswaord string` - Authentication password for mocking MongoDB connection. The default password is "default123".
- `- n, --networkName string` - Name of the docker network in which the user application is running.
- `--passThroughPorts uints` - Ports of outgoing dependency calls to be ignored as mocks and passed through to the actual dependency. The default is no ports.
- `-p, --path string` - Path to the local directory where the recorded testcases and generated mocks are to be saved.
- `--proxyport uint32` - Port to choose to run Keploy as a proxy.
- `-t, --testsets strings` - To specify which specific testsets are to be executed. The default is all testsets.
- `--debug` - To start executing testcases with debug mode enabled.

## [generate-config](#generate-config)

The `generate-config` command in Keploy is used to generate the Keploy Configuration File i.e. `keploy-config.yaml`. The generated configuration file is created in the current working directory.

<b> Usage: </b>

```bash
keploy generate-config [flags]
```

<b> Available flags: </b>

- `-p, --path string` - Path to the local directory where the Keploy Configuration File will be stored. The default is ".".
