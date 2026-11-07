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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" />

### Usage

```bash
keploy [command] [flags]
```

You can use `--help, -h` flag for all the commands to see available flag options and their purpose.

## Commands and Flags

Here are some examples of how to use some common flags:

| Command            | Flags Available                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `record`           | `-c, --command`, `--config-path`, `--containerName`, `--metadata`, `-n, --networkName`, `--passThroughPorts`, `-p, --path`, `--proxy-port`, `--debug`                                                                                                                                                                                                  |
| `test`             | `--apiTimeout`, `-c, --command`, `--config-path`, `--containerName`, `-d, --delay`, `--mongoPassword`, `-n, --networkName`, `--passThroughPorts`, `-p, --path`, `--proxy-port`, `-t, --testsets`, `--debug`, `--removeUnusedMocks`, `--skip-coverage`, `--ignoreOrdering`, `--disable-line-coverage`, `--proto-dir`, `--proto-file`, `--proto-include` |
| `gen` (Deprecated) | `--sourceFilePath`, `--testFilePath`,`--coverageReportPath`,`--testCommand`,`--coverageFormat`,`--expectedCoverage`,`--maxIterations`,`--testDir`,`--llmBaseUrl`,`--model`,`--llmApiVersion`                                                                                                                                                           |
| `normalize`        | `-p, --path`, `--test-run`, `--tests`                                                                                                                                                                                                                                                                                                                  |
| `report`           | `--test-sets, -t`, `-p, --path`, `--report-path, -r`, `--body`                                                                                                                                                                                                                                                                                         |
| `sanitize`         | `--test-sets, -t`, `-p, --path`                                                                                                                                                                                                                                                                                                                        |
| `config`           | `--generate`,`-p, --path`                                                                                                                                                                                                                                                                                                                              |

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

> **Podman:** on Linux, with the Keploy that `install.sh` installs (v3.8.60 or later), an application started in rootful Podman with `podman run` or `podman compose` works the same way: `keploy record -c "podman compose up" --container-name "my-app-container"`. See [Platform requirements](/docs/concepts/platform-requirements/#podman) for what `podman compose` needs.

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

- `--capture-packets` - Capture the raw network packets on Keploy's proxy ports and write them into each test set's directory as `traffic.pcap`, with the TLS session keys in `sslkeys.log` next to it, so that Wireshark or tshark can decrypt the TLS traffic.

```bash
keploy record -c "node src/app.js" --capture-packets
tshark -r keploy/test-set-0/traffic.pcap -o tls.keylog_file:keploy/test-set-0/sslkeys.log
```

:::note Ubuntu 26.04
Ubuntu 26.04 confines `tshark` with an AppArmor profile (`/etc/apparmor.d/tshark`). Apart from its own data files, `tshark` may read only files that the user running it owns under `/tmp`, `/var/tmp` or `~/tmp`. Given the files in `keploy/test-set-0/`, it stops with "You don't have permission to read the file". It also skips a key log file that it may not read without saying so, and then shows the TLS traffic still encrypted. Copy both files first, as the user who runs `tshark`:

```bash
d=$(mktemp -d)
cp keploy/test-set-0/traffic.pcap keploy/test-set-0/sslkeys.log "$d"/
tshark -r "$d/traffic.pcap" -o "tls.keylog_file:$d/sslkeys.log"
```

If you run `sudo tshark`, make the copies with `sudo cp`, so that root owns them.
:::

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

- `--remove-unused-mocks` - To remove unused mocks from mock file. The default is false.

```bash
keploy test -c "node src/app.js" --delay 10 --remove-unused-mocks
```

- `--ignore-ordering` - Ignore the order of elements in an array for a response, with the default value being true.

```bash
keploy test -c "node src/app.js" --delay 10 --ignore-ordering
```

- `--skip-coverage` - skip code coverage computation while running the test cases

- `--disable-line-coverage` - skip the line by line code coverage preview of a JavaScript application, but display the total coverage.

```bash
keploy test -c "node src/app.js" --delay 10 --disable-line-coverage
```

- `--jacoco-agent-path` - Only applicable for test coverage for Java projects. You can override the jacoco agent jar by providing its path

- `--proto-dir string` - Path of the directory where all protos of a service are located. Used for GRPC test cases to enable better deterministic and proper comparison of protobuf responses.

```bash
keploy test -c "node src/app.js" --proto-dir "./protos"
```

- `--proto-file string` - Path of main proto file. Used for GRPC test cases to enable better deterministic and proper comparison of protobuf responses. Either `--proto-file` or `--proto-dir` must be provided for GRPC tests.

```bash
keploy test -c "node src/app.js" --proto-file "./protos/main.proto"
```

- `--proto-include stringArray` - Path of directories to be included while parsing import statements in proto files. This is optional and used for GRPC test cases when proto files have import dependencies.

```bash
keploy test -c "node src/app.js" --proto-file "./protos/main.proto" --proto-include "./protos/common,./protos/shared"
```

> **Note for GRPC Tests:** When running GRPC test cases, it's recommended to provide proto information using either `--proto-file` or `--proto-dir` flags. If proto information is not provided, Keploy will use basic canonical matching of the protoscopic textual format of GRPC response body, which may be less accurate than proto-based comparison.

## [gen](#gen)

> **Deprecated:** This command is deprecated.

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

- `--summary` - Print only a summarized view (grand totals and per-test-set table with time taken). Useful for a quick dashboard-style overview. Can be combined with `-t/--test-sets` and `--report-path`.

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
> - `--summary` prints just the totals and a per-test-set table, optionally restricted with `-t/--test-sets`.
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

## [update](#update)

The `update` command installs the latest Keploy release over the binary you are running.

<b> Usage: </b>

```bash
keploy update
```

### Automatic updates

Keploy keeps itself on the latest release. Before a command starts, Keploy checks for a newer release, at most once an hour, or 10 minutes after a check that failed. The check takes at most 3 seconds. A check that fails, on a machine that is offline or when the release server doesn't answer within those 3 seconds, is made again by the first command 10 minutes or more later. When there is a newer release, Keploy downloads it, verifies its SHA-256 checksum, replaces the binary, and runs your command on the new version. Your command runs once, on the new version. Commands that start during the install wait for it, and they run on the new version too.

When the update can't happen, Keploy prints a warning on stderr and runs your command on the version you have. This covers a machine that is offline, a release server that can't be reached, a binary you can't write to, a download that fails its checksum, and a binary that another Keploy run is using. A failed install is tried again after an hour. An install that stops making progress can hold your command for up to 10 minutes before Keploy gives up on it. Pressing Ctrl+C during an update stops your command too: it doesn't start.

The install script puts Keploy where your user can replace it: `~/.keploy/bin`, which it adds to your `PATH` in your shell's startup file. A terminal that was already open needs `export PATH="$HOME/.keploy/bin:$PATH"`. For a shell other than bash or zsh, the script prints the line to add yourself instead: for fish, `set -U fish_user_paths $HOME/.keploy/bin $fish_user_paths`, run once; for csh and tcsh, `setenv PATH "$HOME/.keploy/bin:$PATH"` in `~/.cshrc`, or in `~/.tcshrc` when you have one and your shell is tcsh, as `csh` on macOS is. On macOS, every install goes to `~/.keploy/bin`. On Linux, three installs keep `/usr/local/bin`: one run as root, one in a CI pipeline, and a 2.x version pinned with `-v`. With `-noRoot`, those three go to `~/.keploy/bin` too. The script knows a CI pipeline by its environment: GitHub Actions, GitLab CI, CircleCI, Travis CI, Buildkite, Drone, AppVeyor, Jenkins, TeamCity, Bitbucket Pipelines, AWS CodeBuild, Azure Pipelines, Bamboo, GoCD, or any system that sets `CI=true`. In any other script that installs in one shell and runs Keploy in another, pass `-isCI`.

An install from before this change is in `/usr/local/bin`, which only root can write to. A run that isn't root can't update there, so it prints the warning on each command and stays on its version. The warning says how to move to a folder you own:

```bash
curl -fsSL https://keploy.io/install.sh | bash
```

The script then prints the command that removes the old binary. To stay in `/usr/local/bin`, run `sudo keploy update` for each release.

A binary in `~/.keploy/bin` isn't on the path `sudo` searches, so `sudo keploy` doesn't find it. Keploy asks for `sudo` itself when a command needs it. To run it as root yourself, use `sudo -E env PATH="$PATH" keploy`.

Keploy never replaces a binary that a run is using. Every run of a command holds a lock beside the binary until it ends, so all the Keploy processes of a run are one version. While a run is under way, other commands on that machine warn and run the version installed, and `keploy update` refuses and says that a run is using the binary. A long `keploy record` holds updates off until it ends. The next command after the last run ends installs the update.

CI pipelines and service-account keys update the same way as any other run.

To keep a pipeline on the version it installed, or to run where the release server can't be reached, set `KEPLOY_DISABLE_AUTO_UPDATE`:

```bash
export KEPLOY_DISABLE_AUTO_UPDATE=1
keploy test -c "<command to run your app>"
```

With `KEPLOY_DISABLE_AUTO_UPDATE` set to `1`, `true`, `yes`, or `on`, Keploy doesn't check for a release and doesn't install one. `keploy update` still installs the latest release when you run it.

Plain `sudo` drops the variable, so run `sudo -E env PATH="$PATH" keploy` to keep it.

A version you install with the install script's `-v` flag is also replaced by the latest release at the first command, unless you set the variable.

Keploy doesn't replace its own binary in these cases:

- **Keploy Docker image:** pull a newer image.
- **Homebrew, Nix, or Snap:** Keploy prints a warning and runs on the version you have. Update through the package manager.
- **VS Code extension:** the extension installs and tracks its own binary. Keploy only prints a notice that a newer release is available.
- **Self-hosted runs:** these runs reach only your k8s-proxy, so Keploy doesn't check for a release. A run is self-hosted when `--k8s-proxy-auth`, `--k8s-proxy-url`, `KEPLOY_K8S_PROXY_AUTH`, `KEPLOY_K8S_PROXY_URL`, or `cloud.k8sProxyAuth` or `cloud.k8sProxyUrl` in `keploy.yml` turns the mode on.
- **Builds from an organization's release channel:** a build published under `keploy.io/ent/dl/org/<organization>/` has a version with a suffix, such as `3.8.112-4f2a9c1d`. Keploy never replaces it with a public release, and `keploy update` leaves it alone too. Install new builds from the same channel.

## Related

- [Configuration File](/docs/running-keploy/configuration-file/) — set these flags once in `keploy.yaml`.
- [Recording Filters](/docs/running-keploy/recording-filters/) — control which requests get recorded.
- [Keploy Templatize](/docs/running-keploy/keploy-templatize/) — details on the `templatize` command.
- [Keploy Passthrough](/docs/running-keploy/keploy-passthrough/) — using the `--passThroughPorts` flag.
