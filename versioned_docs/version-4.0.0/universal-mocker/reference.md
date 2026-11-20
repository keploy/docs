---
id: reference
title: Universal Mocker reference
sidebar_label: Reference
description: Every keploy mock command and flag of Keploy 3.9.4, as the CLI's own help prints it, the keploy.yml keys and environment variables that set the same values, the exit codes, and the replay results keploy mock status reports.
tags:
  - mocks
  - reference
  - keploy mock
keywords:
  - keploy mock record
  - keploy mock replay
  - keploy mock flags
  - keploy.yml mock keys
  - keploy mock exit codes
  - keploy mock environment variables
  - service virtualization
---

This page lists every `keploy mock` command of Keploy 3.9.4 and each of its
flags, in the words of the CLI's own help. To see the help of the release you
have installed, run:

```bash
keploy --version
keploy mock --help
```

Some commands and flags appear only when `KEPLOY_PROVEN=1` is set, as the
[keploy.yml and keploy.lock](./guides/keploy-yml-and-lock.md) guide runs them.
They are listed in their own section, or marked `KEPLOY_PROVEN=1` only.

After the commands come the [keploy.yml keys](#keployyml-keys), the
[environment variables](#environment-variables), the
[exit codes](#exit-codes) and the [replay results](#replay-results).

## Commands

| Command                                             | What it does                                                                                                                                                                      |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`keploy mock check`](#keploy-mock-check)           | Check a mock set's files offline: what a replay would refuse, or do other than they seem to say (`KEPLOY_PROVEN=1` only)                                                          |
| [`keploy mock diff`](#keploy-mock-diff)             | Show which e2e tests a change re-records: keploy.lock against its merge base, or a portal branch against main                                                                     |
| [`keploy mock download`](#keploy-mock-download)     | Download mocks from the keploy registry                                                                                                                                           |
| [`keploy mock explain`](#keploy-mock-explain)       | Say what a mock set's files say of one test: why it is skipped or run, its evidence, its recorded calls, and what its last replay and judging rounds did (`KEPLOY_PROVEN=1` only) |
| [`keploy mock judge`](#keploy-mock-judge)           | Judge the recordings again (after a keploy upgrade): drop entries whose tests now replay, but a flaky one, and print what to do about each new failure (`KEPLOY_PROVEN=1` only)   |
| [`keploy mock patch`](#keploy-mock-patch)           | Patch a single recorded mock on a Keploy branch (a PostgresV3 mock's sql_ast_hash is cleared for replay to recompute)                                                             |
| [`keploy mock pin`](#keploy-mock-pin)               | Turn the app's recording pin on or off: while it is on, every replay of the app reads keploy.lock (`KEPLOY_PROVEN=1` only)                                                        |
| [`keploy mock publish`](#keploy-mock-publish)       | Publish a recorded set to a portal branch, one pack per test flow                                                                                                                 |
| [`keploy mock pull`](#keploy-mock-pull)             | Pull a portal branch's flows into the local set                                                                                                                                   |
| [`keploy mock quarantine`](#keploy-mock-quarantine) | Skip tests in CI, with your reason, until they are recorded again (keploy.lock's skip lines, else verdicts.yaml); --undo runs them again (`KEPLOY_PROVEN=1` only)                 |
| [`keploy mock record`](#keploy-mock-record)         | Record the outgoing dependency calls your test command makes                                                                                                                      |
| [`keploy mock register`](#keploy-mock-register)     | List keploy.lock's recordings in Keploy Cloud under the git branch, for the dashboard (replay reads keploy.lock either way)                                                       |
| [`keploy mock replay`](#keploy-mock-replay)         | Replay recorded mocks while your test command runs                                                                                                                                |
| [`keploy mock status`](#keploy-mock-status)         | Show what the recorded mocks prove and the recommended next step                                                                                                                  |
| [`keploy mock upload`](#keploy-mock-upload)         | Upload mocks to the keploy registry                                                                                                                                               |

To see one command's help, run `keploy mock <command> --help`.

## Commands you run without `KEPLOY_PROVEN`

### `keploy mock diff`

Show which e2e tests a change re-records: keploy.lock against its merge base, or a portal branch against main.

```text
keploy mock diff [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--base string`: The git revision to compare keploy.lock with (default: the merge base with the branch this one merges into: GITHUB_BASE_REF's, else origin/HEAD's, origin/main or origin/master); not with --branch.
- `--branch string`: Compare this portal branch with main, in place of keploy.lock.
- `-p, --config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--json`: Print the server's diff document as one line.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--lock string`: The keploy.lock to compare (default: keploy.lock next to keploy.yml, when there is one); --base's side is the file at the same path in that commit; not with --branch.
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--markdown`: Print a PR-comment table.

Examples from the CLI's help:

```bash
keploy mock diff --markdown
keploy mock diff --base origin/main
keploy mock diff --branch feature/x --markdown
```

### `keploy mock download`

Download mocks from the keploy registry.

```text
keploy mock download [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--app-name string`: Name of the user's application.
- `-c, --config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--overwrite`: Overwrite an existing local mock file when it differs from the registry version.
- `-p, --path string`: Path to local keploy directory where generated mocks are stored. Default: `.`.
- `--registry-ids strings`: Registry IDs for direct mock download.
- `-t, --test-sets strings`: Testsets to consider e.g. -t "test-set-1, test-set-2".

Examples from the CLI's help:

```bash
keploy mock download
```

### `keploy mock patch`

Patch a single recorded mock on a Keploy branch (a PostgresV3 mock's sql_ast_hash is cleared for replay to recompute).

```text
keploy mock patch [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app string`: Keploy app UUID (required).
- `--branch-id string`: Keploy branch UUID (required; the edit lands as an overlay on this branch only).
- `-c, --config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--mock-id string`: Mock name (e.g. mock-54). Required.
- `--mock-yaml-file string`: Path to the patched mock YAML, or "-" for stdin (required).
- `--test-set-id string`: Test set UUID the mock belongs to (required).

Examples from the CLI's help:

```bash
keploy mock patch \
  --app <appUUID> --branch-id <branchUUID> \
  --test-set-id <testSetUUID> --mock-id mock-54 \
  --mock-yaml-file ./patched-mock.yaml
```

### `keploy mock publish`

Publish a recorded set to a portal branch, one pack per test flow.

```text
keploy mock publish [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app string`: Keploy app to upload to when keploy.yml has no mock.appId: reuses the app with this exact name, or creates it.
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--branch string`: Portal branch to publish to (default: the current git branch, never main) or to replay and pull from (default: the CI branch, then the git branch, then main).
- `--config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--json`: Print the result as one JSON line on stdout; logs go to stderr.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--manual-login`: Use manual login prompt instead of opening browser.
- `-p, --path string`: Path to local keploy directory where generated mocks are stored. Default: `.`.
- `-t, --test-sets strings`: Mock sets to publish, e.g. -t orders (default: mock.name from keploy.yml, else "default").
- `--from string` (`KEPLOY_PROVEN=1` only): Publish the recording a judged keploy mock record kept in this staging folder (the record prints the line when its own publish failed), or the mapping edit a keploy mock judge judged and kept there, then write its judged verdicts.yaml into the project (under keploy.lock: pin it, with its skip lines, in the lock).
- `--lock string` (`KEPLOY_PROVEN=1` only): With --from: the keploy.lock to pin the staged recording in, when its record or judge was given --lock (the line it printed names it); without it, only the project's own keploy.lock.

Examples from the CLI's help:

```bash
keploy mock publish --branch feature/x
```

### `keploy mock pull`

Pull a portal branch's flows into the local set.

```text
keploy mock pull [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--branch string`: Portal branch to publish to (default: the current git branch, never main) or to replay and pull from (default: the CI branch, then the git branch, then main).
- `--config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--json`: Print the result as one JSON line on stdout; logs go to stderr.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--manual-login`: Use manual login prompt instead of opening browser.
- `-p, --path string`: Path to local keploy directory where generated mocks are stored. Default: `.`.
- `-t, --test-sets strings`: Mock sets to pull, e.g. -t orders (default: mock.name from keploy.yml, else "default").
- `--lock string` (`KEPLOY_PROVEN=1` only): The keploy.lock that pins the recordings to replay, pull or record over (default: keploy.lock next to keploy.yml, when there is one); not with --branch.

Examples from the CLI's help:

```bash
keploy mock pull --branch feature/x
```

### `keploy mock record`

Record the outgoing dependency calls your test command makes.

```text
keploy mock record [flags]
```

Flags:

- `--app string`: Keploy app to upload to when keploy.yml has no mock.appId: reuses the app with this exact name, or creates it.
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--branch string`: Portal branch to publish to (default: the current git branch, never main) or to replay and pull from (default: the CI branch, then the git branch, then main).
- `-b, --build-delay uint`: Time to wait for a docker container to build. Default: `30`.
- `--cmd-type string`: Type of command (native/docker-run/docker-start/docker-compose/from-container). Default: `native`.
- `-c, --command string`: Command that runs your test suite, e.g. "pytest" or "go test ./...".
- `--config-path string`: Path to the local directory where keploy configuration file is stored. Default: `.`.
- `--container-name string`: Name of the application's docker container (docker/compose runs).
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--disable-handshake-hold`: Accept every outgoing connection at once instead of holding its handshake until the real destination answers.
- `--dns-port uint32`: Port used by the Keploy DNS server. Default: `26789`.
- `--enable-obfuscation`: Obfuscate detected secrets in what is recorded, published and reported (default: record.enableObfuscation from keploy.yml). Hashed secrets such as bcrypt are replaced too, so tests that check a password against a recorded hash need obfuscation off.
- `--from-container string`: Record against an already-running container: keploy re-creates it under its own namespaces. Replaces -c.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--local`: Use the local file-backed mock store even when a cloud registry is configured.
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--name string`: Name of the mock set to record into / replay from. Default: `default`.
- `-n, --network-name string`: Name of the application's docker network.
- `--pass-through-ports uints`: Destination ports to leave untouched (never mocked). Default: `[]`.
- `-p, --path string`: Path to the local directory where the mock set is stored (keploy/&lt;name&gt;/). Default: `.`.
- `--proxy-port uint32`: Port used by the Keploy proxy to intercept outgoing calls. Default: `16789`.
- `--record-requests`: Record the app's incoming requests and responses as test cases (on by default; --record-requests=false turns it off); pass the app's port with --pass-through-ports so the tests reach it. Default: `true`.
- `--record-timer duration`: Optional upper bound on the record session (e.g. "30s"); the runner exiting ends it first.
- `--register`: After a record pinned by keploy.lock, list the lock in Keploy Cloud under the git branch, for the dashboard's Recordings and Branch reviews (replay reads keploy.lock either way); a lock CI would run no test of is not listed. Default: `true`.
- `--freeze-binary stringArray` (`KEPLOY_PROVEN=1` only): A Go binary built before keploy runs that a test or the app starts, whose clock should be shifted too: every round this command runs patches it for the round and restores it after, as keploy mock replay --freeze-binary does (Linux). Repeatable.
- `--lock string` (`KEPLOY_PROVEN=1` only): The keploy.lock this record pins its recordings in (default: keploy.lock next to keploy.yml, when there is one); a path that does not exist yet is created, which is how a project's first keploy.lock is made; not with --branch.

Examples from the CLI's help:

```bash
keploy mock record -c "pytest" --name default
```

### `keploy mock register`

List keploy.lock's recordings in Keploy Cloud under the git branch, for the dashboard (replay reads keploy.lock either way).

```text
keploy mock register [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--base string`: The git revision whose keploy.lock the branch's review diff compares with (default: the merge base with the branch this one merges into: GITHUB_BASE_REF's, else origin/HEAD's, origin/main or origin/master).
- `--branch string`: The Keploy Cloud branch to list it under (default: the CI branch, else the git branch); never main.
- `-p, --config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--lock string`: The keploy.lock to list (default: keploy.lock next to keploy.yml).
- `--main`: List keploy.lock as the app's Keploy main instead, as a green replay of the default branch does in CI: the lock HEAD's commit holds, where HEAD is the commit a CI push to the default branch built, else the tip of origin's default branch; not with --branch or --base. For the dashboard only; CI's read-scoped key, app admins and admins may run it.
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--replace`: With --main: list it although Keploy main lists a commit Keploy Cloud takes as newer (the default branch was reset to an older commit, or a listed commit's time is ahead of the clock); HEAD must be the tip of origin's default branch, in CI too. App admins and admins only (branch:merge on the app), with a write-scoped key.

Examples from the CLI's help:

```bash
keploy mock register
keploy mock register --branch feature/x --base origin/develop
keploy mock register --main
keploy mock register --main --replace
```

### `keploy mock replay`

Replay recorded mocks while your test command runs.

```text
keploy mock replay [flags]
```

Flags:

- `--allow-egress strings`: What the replay may reach on the real network (repeat or comma-separated), the same list as keploy test's test.allowEgress. "dns" forwards a DNS query no mock answers to the host's and public resolvers too; without it a miss is forwarded only to a resolver inside the replay's own network (docker's, the container network's or the cluster's).
- `--app string`: Keploy app to upload to when keploy.yml has no mock.appId: reuses the app with this exact name, or creates it.
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `--branch string`: Portal branch to publish to (default: the current git branch, never main) or to replay and pull from (default: the CI branch, then the git branch, then main).
- `-b, --build-delay uint`: Time to wait for a docker container to build. Default: `30`.
- `--cmd-type string`: Type of command (native/docker-run/docker-start/docker-compose/from-container). Default: `native`.
- `-c, --command string`: Command that runs your test suite, e.g. "pytest" or "go test ./...".
- `--compose-deps`: Docker compose apps: also start the app's dependency services during the replay. By default only the app and the keploy agent run, and the app's calls to its dependencies are served from recorded mocks.
- `--config-path string`: Path to the local directory where keploy configuration file is stored. Default: `.`.
- `--container-name string`: Name of the application's docker container (docker/compose runs).
- `--coverage-report string`: Coverage report the test command writes, when it is not a default location (coverage.out, coverage/lcov.info, coverage.xml, jacoco.xml, ...)
- `--debug`: debug flag for testing.
- `-d, --delay uint`: Seconds to wait for the runner to be ready before it starts issuing calls.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--disable-handshake-hold`: Accept every outgoing connection at once instead of holding its handshake until the real destination answers.
- `--disableReportUpload`: Disable uploading the run report to Keploy Cloud.
- `--dns-port uint32`: Port used by the Keploy DNS server. Default: `26789`.
- `--emit-mock-events`: Log one line per mock as it is first served (stdout; stderr under --json).
- `--enable-obfuscation`: Obfuscate detected secrets in what is recorded, published and reported (default: record.enableObfuscation from keploy.yml). Hashed secrets such as bcrypt are replaced too, so tests that check a password against a recorded hash need obfuscation off.
- `--freeze-binary stringArray`: A Go binary built before keploy runs whose clock should be shifted too; patched for the run and restored after it (Linux). Repeatable.
- `--freeze-time`: Shift the clock of the tests and the apps they start back to when the mocks were recorded, so recorded tokens and expiries stay valid (native commands). Default: `true`.
- `--from-container string`: Record against an already-running container: keploy re-creates it under its own namespaces. Replaces -c.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--local`: Use the local file-backed mock store even when a cloud registry is configured.
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--min-coverage float`: Fail the replay when the test run covers less than this percentage of the code, from the coverage report the test command writes (0 disables).
- `--name string`: Name of the mock set to record into / replay from. Default: `default`.
- `-n, --network-name string`: Name of the application's docker network.
- `--on-miss string`: What to do when an outgoing call matches no recorded mock: fail \| passthrough \| record. Default: `fail`.
- `--pass-through-ports uints`: Destination ports to leave untouched (never mocked). Default: `[]`.
- `-p, --path string`: Path to the local directory where the mock set is stored (keploy/&lt;name&gt;/). Default: `.`.
- `--proxy-port uint32`: Port used by the Keploy proxy to intercept outgoing calls. Default: `16789`.
- `--report-answer-timeout duration`: How long the run's report upload, once sent whole, waits for the server's answer (e.g. 20m), timed from when its last byte was sent. The server stores a report only after it has read all of it; meanwhile the upload says every 30 s that it still waits. KEPLOY_REPORT_ANSWER_TIMEOUT sets the same default for every run. Default: `10m0s`.
- `--run-only stringArray`: Run only this test (repeat the flag for more; the name as the test runner's harness reports it, and a subtest runs with its test); the harness skips the rest.
- `--strict`: Exit non-zero if a call missed its recorded mock (dependency contract drift); a DNS lookup or a connection that sent nothing does not count.
- `--all` (`KEPLOY_PROVEN=1` only): also run the tests the set's verdicts.yaml quarantines.
- `--list-main string` (`KEPLOY_PROVEN=1` only): After a green replay of keploy.lock, list it as the app's Keploy main in Keploy Cloud, for the dashboard: auto (the default) on a CI push to the repository's default branch (GitHub Actions, GitLab CI, Woodpecker), on after a green replay whose HEAD is the tip of origin's default branch (another CI system), off never. Also KEPLOY_LIST_MAIN; the flag wins.
- `--lock string` (`KEPLOY_PROVEN=1` only): The keploy.lock that pins the recordings to replay, pull or record over (default: keploy.lock next to keploy.yml, when there is one); not with --branch.

Examples from the CLI's help:

```bash
keploy mock replay -c "pytest" --name default --on-miss fail
```

### `keploy mock status`

Show what the recorded mocks prove and the recommended next step.

```text
keploy mock status [flags]
```

Flags:

- `--json`: Emit the NEXT block and the full mock state as one JSON object; its "work" says what the call read of the repository, by reader: files_read, bytes_read, trees_built and decodes.
- `--path string`: Path to the directory that contains the keploy/ folder (defaults to the current directory). Default: `.`.

Examples from the CLI's help:

```bash
keploy mock status          # in your repository
keploy mock status --json   # everything, for an editor or an agent
```

### `keploy mock upload`

Upload mocks to the keploy registry.

```text
keploy mock upload [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--app-id string`: Keploy app id to use instead of the app name (default: mock.appId from keploy.yml).
- `-c, --config-path string`: Path to the local directory where keploy.yml is stored. Default: `.`.
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--manual-login`: Use manual login prompt instead of opening browser.
- `-p, --path string`: Path to local keploy directory where generated mocks are stored. Default: `.`.
- `-t, --test-sets strings`: Testsets to consider e.g. -t "test-set-1, test-set-2".

Examples from the CLI's help:

```bash
keploy mock upload
```

## Commands shown only with `KEPLOY_PROVEN=1`

### `keploy mock check`

Shown only with `KEPLOY_PROVEN=1`.

Check a mock set's files offline: what a replay would refuse, or do other than they seem to say.

```text
KEPLOY_PROVEN=1 keploy mock check [flags]
```

Flags:

- `--json`: Print the findings as JSON: \{set, findings: \[\{severity, code, file, line, test, mock, message, fix\}\]\}.
- `--local`: Read the recordings in keploy/&lt;set&gt; on disk, as keploy mock replay --local does, not Keploy Cloud's (keploy.lock's).
- `--lock string`: The keploy.lock that pins the project's recordings (default: keploy.lock next to keploy.yml, when there is one); not with --local or keploy.yml's mock.local.
- `--name string`: The mock set (default: keploy.yml's mock.name, else "default").
- `--path string`: Path to the folder that holds keploy/ (default: keploy.yml's path, else the current folder).

Examples from the CLI's help:

```bash
KEPLOY_PROVEN=1 keploy mock check                 # keploy.yml's set, as keploy mock replay reads it
KEPLOY_PROVEN=1 keploy mock check --local         # the set keploy mock record --local wrote in keploy/<set>/
KEPLOY_PROVEN=1 keploy mock check --name e2e --json
```

### `keploy mock explain`

Shown only with `KEPLOY_PROVEN=1`.

Say what a mock set's files say of one test: why it is skipped or run, its evidence, its recorded calls, and what its last replay and judging rounds did.

```text
KEPLOY_PROVEN=1 keploy mock explain <test id or name> [flags]
```

Flags:

- `--json`: Print the explanation as JSON.
- `--local`: Read the recordings in keploy/&lt;set&gt; on disk, as keploy mock replay --local does, not Keploy Cloud's (keploy.lock's).
- `--lock string`: The keploy.lock that pins the project's recordings (default: keploy.lock next to keploy.yml, when there is one); not with --local or keploy.yml's mock.local.
- `--name string`: The mock set (default: keploy.yml's mock.name, else "default").
- `--path string`: Path to the folder that holds keploy/ (default: keploy.yml's path, else the current folder).

Examples from the CLI's help:

```bash
KEPLOY_PROVEN=1 keploy mock explain orders::TestPlaceOrder
KEPLOY_PROVEN=1 keploy mock explain TestPlaceOrder                   # a bare name: the one test of the set with that name
KEPLOY_PROVEN=1 keploy mock explain --local orders::TestPlaceOrder   # the set keploy mock record --local wrote
KEPLOY_PROVEN=1 keploy mock explain orders::TestPlaceOrder --name e2e --json
```

### `keploy mock judge`

Shown only with `KEPLOY_PROVEN=1`.

Judge the recordings again (after a keploy upgrade): drop entries whose tests now replay, but a flaky one, and print what to do about each new failure.

```text
KEPLOY_PROVEN=1 keploy mock judge [flags]
```

Flags:

- `--app string`: The Keploy app whose recordings to judge, by name, when keploy.yml names no mock.appId (default: the app named after the repository); not with --local.
- `--branch string`: The Keploy Cloud branch whose recordings to judge (default: the CI branch, then the git branch, then main); not with --local.
- `--freeze-binary stringArray`: A Go binary built before keploy runs that a test or the app starts, whose clock should be shifted too: every round this command runs patches it for the round and restores it after, as keploy mock replay --freeze-binary does (Linux). Repeatable.
- `--local`: Judge the recordings in keploy/&lt;set&gt; on disk, not Keploy Cloud's.
- `--lock string`: The keploy.lock that pins the recordings to judge (default: keploy.lock next to keploy.yml, when there is one); not with --branch or --local.
- `--name string`: The mock set (default: keploy.yml's mock.name, else "default").
- `--path string`: Path to the folder that holds keploy/ (default: keploy.yml's path, else the project directory).

### `keploy mock pin`

Shown only with `KEPLOY_PROVEN=1`.

Turn the app's recording pin on or off: while it is on, every replay of the app reads keploy.lock.

```text
KEPLOY_PROVEN=1 keploy mock pin on|off|status [flags]
```

Flags:

- `--app-id string`: Keploy app id to pin (default: mock.appId from keploy.yml).
- `--path string`: Path to the directory that contains keploy.yml (defaults to the current directory). Default: `.`.

Examples from the CLI's help:

```bash
KEPLOY_PROVEN=1 keploy mock pin status
KEPLOY_PROVEN=1 keploy mock pin on
KEPLOY_PROVEN=1 keploy mock pin off --app-id <id>
```

### `keploy mock quarantine`

Shown only with `KEPLOY_PROVEN=1`.

Skip tests in CI, with your reason, until they are recorded again (keploy.lock's skip lines, else verdicts.yaml); --undo runs them again.

```text
KEPLOY_PROVEN=1 keploy mock quarantine <test name or id>... --reason <why> [flags]
```

Flags:

- `--app string`: The Keploy app whose recordings to judge, by name, when keploy.yml names no mock.appId (default: the app named after the repository); not with --local.
- `--branch string`: The Keploy Cloud branch whose recordings to judge (default: the CI branch, then the git branch, then main); not with --local.
- `--local`: Judge the recordings in keploy/&lt;set&gt; on disk, not Keploy Cloud's.
- `--lock string`: The keploy.lock that pins the recordings to judge (default: keploy.lock next to keploy.yml, when there is one); not with --branch or --local.
- `--name string`: The mock set (default: keploy.yml's mock.name, else "default").
- `--path string`: Path to the folder that holds keploy/ (default: keploy.yml's path, else the project directory).
- `--reason string`: Why the test is skipped (at most 200 bytes); shown wherever it is skipped.
- `--undo`: Stop skipping the tests: remove their skip (whatever judged or quarantined them), so keploy mock replay runs them.

Examples from the CLI's help:

```bash
KEPLOY_PROVEN=1 keploy mock quarantine TestPlaceOrder --reason "flaky upstream, JIRA-123"
KEPLOY_PROVEN=1 keploy mock quarantine --undo TestPlaceOrder
# a test is named as go test's -run takes it (TestPlaceOrder), or by its
# test ID, <package dir>::<TestName> (Go), when two packages share the name
```

## Sign-in commands

A command that reads or writes Keploy Cloud needs you signed in with `keploy login`, or an API key in `KEPLOY_API_KEY`. Some commands also take `--api-key`. A record or replay run with `--local` needs neither.

### `keploy login`

Authenticate with your Keploy account.

```text
keploy login [flags]
```

Flags:

- `--api-key string`: Keploy API key for this invocation (overrides KEPLOY_API_KEY env).
- `--debug`: debug flag for testing.
- `--disable-ansi`: Disable ANSI colors in the output.
- `--finish`: Collect the session for the sign-in started by 'keploy login --no-wait': waits up to 70 seconds for the approval, and can be run again until the code expires.
- `--json`: With --no-wait or --finish: print the answer as one JSON document (a NEXT block) on stdout, for AI agents and tools; logs go to stderr.
- `--k8s-proxy-auth`: Authenticate through the k8s-proxy instead of the api-server (for CI with no direct api-server/internet access). Defaults on when --k8s-proxy-url, KEPLOY_K8S_PROXY_URL or the login 'keploy login --k8s-proxy-url' saved gives a k8s-proxy URL (keploy.yml cloud.k8sProxyUrl alone does not); pass --k8s-proxy-auth=false to opt out. Requires a k8s-proxy URL and an API key (KEPLOY_API_KEY, --api-key or the saved login).
- `--k8s-proxy-url string`: Self-hosted k8s-proxy ingress URL to authenticate against; setting it enables k8s-proxy-auth mode by default (e.g. `https://keploy-proxy.my-cluster.internal`). Falls back to KEPLOY_K8S_PROXY_URL. 'keploy login --k8s-proxy-url &lt;url&gt;' saves the URL and the API key in ~/.keploy, so later commands need neither variable.
- `--manual-login`: Use manual login prompt instead of opening browser.
- `--new`: With --no-wait: discard the sign-in waiting here and start a new one (without it, --no-wait shows the waiting code or link again).
- `--no-wait`: Print the sign-in link and code and exit instead of waiting; collect the session later with 'keploy login --finish' (for AI agents, whose shell shows output only when a command exits, and for machines without a browser).
- `--show`: Print the API key (its last 4 characters only) and the k8s-proxy URL a login uses here, and where each comes from (a flag, the environment or the saved login in ~/.keploy), then exit without signing in.

Examples from the CLI's help:

```bash
keploy login
keploy login --no-wait && keploy login --finish
keploy login --manual-login
keploy login --k8s-proxy-url https://<k8s-proxy ingress host>
keploy login --show
```

### `keploy logout`

Sign out of your Keploy account.

```text
keploy logout [flags]
```

Flags:

- `--debug`: Run in debug mode.
- `--disable-ansi`: Disable ANSI colors in the output.

Examples from the CLI's help:

```bash
keploy logout
```

## keploy.yml keys

`keploy mock` reads the keys under `mock:` in the `keploy.yml` of the folder
it runs in, or of the folder `--config-path` names. Each key below sets the
same value as its flag. A flag you pass wins over the key.

```yaml
mock:
  name: default
  onMiss: fail
  strict: true
```

| Key              | Flag                 | What it sets                                                                             |
| ---------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| `name`           | `--name`             | The mock set to record into and replay from. Default: `default`.                         |
| `onMiss`         | `--on-miss`          | What a replay does with a call no recording answers: `fail`, `passthrough` or `record`.  |
| `strict`         | `--strict`           | `true` makes a replay exit non-zero when a call missed its recorded mock.                |
| `local`          | `--local`            | `true` keeps the recordings in the repository, under `keploy/<set>/`, with no sign-in.   |
| `recordTimer`    | `--record-timer`     | An upper bound on a record session, such as `30s`.                                       |
| `recordRequests` | `--record-requests`  | `false` stops a record from saving the app's incoming requests as test cases.            |
| `emitMockEvents` | `--emit-mock-events` | `true` logs one line per mock as a replay first serves it.                               |
| `minCoverage`    | `--min-coverage`     | The lowest coverage percentage a replay accepts. `0` turns the check off.                |
| `coverageReport` | `--coverage-report`  | The coverage report your test command writes, when it is not in a default place.         |
| `runOnly`        | `--run-only`         | A list of the tests to run. The rest are skipped.                                        |
| `appId`          | `--app-id`           | The Keploy app that holds the recordings.                                                |
| `branch`         | `--branch`           | The Keploy branch to read and publish. Ignored while `keploy.lock` pins the recordings.  |
| `command`        | `-c`                 | The command that runs your tests. Read when you don't pass `-c`, with `KEPLOY_PROVEN=1`. |

Outside `mock:`, `keploy.yml` has a top-level `sessionCalls` list: the HTTP
calls a replay serves to every test, as
[Serve a call to every test](./guides/background-workers.md#serve-a-call-to-every-test)
shows. It has a top-level `command` key too. When a folder
has no `keploy.yml`, the first `keploy mock record` or `keploy mock replay`
there creates one from the flags you pass, and a replay saves its `-c` as that
`command`. After that, `keploy mock replay` with no `-c` runs it, with or
without `KEPLOY_PROVEN`.

The [keploy.yml and keploy.lock](./guides/keploy-yml-and-lock.md) guide says
which of these files to commit and how `keploy.lock` pins your recordings.

## Environment variables

`keploy mock` reads these variables. A flag you pass wins over its variable.

| Variable                       | What it sets                                                                                                                                                                     |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KEPLOY_API_KEY`               | A Keploy API key. The cloud commands sign in with it, with no `keploy login`. Use it in CI. `--api-key` wins over it.                                                            |
| `KEPLOY_K8S_PROXY_URL`         | The URL of a self-hosted k8s-proxy to sign in and work through. `--k8s-proxy-url` wins over it.                                                                                  |
| `KEPLOY_REPORT_ANSWER_TIMEOUT` | How long a run's report upload waits for the server's answer, such as `20m`. `--report-answer-timeout` wins over it. Default: `10m`.                                             |
| `KEPLOY_DISABLE_AUTO_UPDATE`   | `1`, `true`, `yes` or `on` keeps the CLI on the version it has. Without it, a command first installs the newest Keploy release when there is one. Set it in a pinned pipeline.   |
| `KEPLOY_PROVEN`                | `1` checks each test on its own: each test gets only the calls it recorded, and a replay reports a result per test. It also turns on the commands and flags marked for it above. |
| `KEPLOY_LIST_MAIN`             | With `KEPLOY_PROVEN=1`: the default of `keploy mock replay --list-main`, `auto`, `on` or `off`.                                                                                  |
| `KEPLOY_RUN_RESULT`            | A file path. When the command ends, Keploy writes its exit code there as JSON, and the reason when it has one. See [Exit codes](#exit-codes).                                    |
| `MOCK_LOCAL`                   | `true` works as `--local`: no sign-in, and the recordings stay in the repository.                                                                                                |
| `MOCK_NAME`                    | The mock set, as `--name` sets it.                                                                                                                                               |
| `MOCK_EMITMOCKEVENTS`          | `true` works as `--emit-mock-events`: a replay logs one line per mock as it first serves it.                                                                                     |

`MOCK_LOCAL`, `MOCK_NAME` and `MOCK_EMITMOCKEVENTS` are the keploy.yml keys
`local`, `name` and `emitMockEvents`, in capitals after `MOCK_`. For
example, this records into the set `nightly`, in the repository, with no
sign-in:

```bash
MOCK_LOCAL=true MOCK_NAME=nightly keploy mock record -c "go test -count=1 ./..."
```

[Step 6 of the Go quickstart](./quickstarts/go.md#step-6-check-each-test-on-its-own)
turns on `KEPLOY_PROVEN=1` and shows a result per test.

## Exit codes

`keploy mock record` and `keploy mock replay` exit with your test command's
own exit code. So a failing test fails your CI job, as it would without
Keploy. The other codes are Keploy's own.

| Code                         | Meaning                                                                                                                                                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `0`                          | The test command passed.                                                                                                                                                                                                         |
| The test command's exit code | The test command failed, and Keploy passes its code on unchanged: `1` for a failing `go test`, `7` for a command that ends with `exit 7`.                                                                                        |
| `1`                          | Keploy itself failed, or the replay failed one of its own checks: with `--strict`, a call missed its recording; or, with the default `--on-miss fail`, the replay served none of the recorded calls. The error message says why. |
| `2`                          | Keploy crashed. The result file below usually has `reason: keploy_error` and a message that starts with `keploy crashed:`.                                                                                                       |
| `3`                          | Keploy could not get the kernel privileges it needs.                                                                                                                                                                             |
| `4`                          | The mode you asked for can't work on this operating system or CPU.                                                                                                                                                               |
| `5`                          | Not signed in, and running the command again won't change that. Run `keploy login`, set `KEPLOY_API_KEY`, or keep the recordings in the repository with `--local`.                                                               |
| `6`                          | The machine or container lacks something Keploy needs to start, such as a mounted tracefs.                                                                                                                                       |
| `8`                          | The command line is wrong: an unknown command or flag, or the wrong number of arguments. The command did not run.                                                                                                                |
| `128+N`                      | A signal stopped `keploy mock replay` before it finished: `130` for Ctrl+C (SIGINT), `143` for SIGTERM, `129` for SIGHUP. A stopped replay never exits `0`, so CI can't pass it.                                                 |

Here is each code as Keploy 3.9.4 printed it, with `CI=true` and no
sign-in, trimmed to the lines that matter:

```text
$ keploy mock bogus
Error: unknown command "bogus" for "keploy mock"
Run 'keploy mock --help' for usage.
exit code: 8

$ keploy mock record -c "go test -count=1 ./..."
Error: not signed in: CI is set and stdin is not a terminal, so nobody here can approve a sign-in; set KEPLOY_API_KEY to an API key from the Keploy dashboard, or sign in with `keploy login --no-wait` and `keploy login --finish`
exit code: 5

$ keploy mock replay --local -c "sh -c 'go test -count=1 ./... && exit 7'"
🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 7}
exit code: 7
```

A test command can exit `1`, `2`, `5` or `8` on its own too. To tell its code from
Keploy's, set `KEPLOY_RUN_RESULT` to a file path and read the file after the
run:

```bash
KEPLOY_RUN_RESULT=/tmp/keploy-result.json keploy mock replay --local -c "go test -count=1 ./..."
cat /tmp/keploy-result.json
```

| Run                                | What Keploy 3.9.4 wrote                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| The tests passed                   | `{"exit_code":0}`                                                                                            |
| The test command exited `1` or `7` | `{"exit_code":1}`, `{"exit_code":7}`                                                                         |
| Not signed in                      | `{"exit_code":5,"reason":"auth_required","message":"not signed in: CI is set and stdin is not a terminal…"}` |
| Ctrl+C during a replay             | `{"exit_code":130,"reason":"interrupted","message":"the run was interrupted before it finished"}`            |

When the test command's code is passed on, the file has no `reason`. Some
Keploy failures leave none either, and the log says what failed. A `reason`
is `auth_required` (not signed in), `keploy_error` (Keploy failed) or
`interrupted`. With `KEPLOY_PROVEN=1`, a replay's `reason` also says why its
verdict failed, such as `tests_failed` or `min_coverage`, and the file has a
`status`: `passed`, `failed` or `not_judged`.

## Replay results

Each replay writes what it proved to `keploy/<set>/last-replay.yaml`, which
`keploy/.gitignore` keeps out of git. `keploy mock status --json` prints each
set with its verdict and that last replay. This is the set `default` after a
replay whose test failed, from Keploy 3.9.4, trimmed:

```bash
keploy mock status --json
```

```json
{
  "flow": "mock",
  "phase": "verified_red",
  "summary": "The last replay of default failed: the tests failed on the last replay (exit 1).",
  "mock": {
    "config": "keploy.yml",
    "command": "go test -count=1 ./...",
    "sets": [
      {
        "name": "default",
        "calls": 1,
        "mocksFile": "mocks.yaml",
        "storage": "repo",
        "perTest": false,
        "verdict": "failed",
        "why": "the tests failed on the last replay (exit 1)",
        "lastReplay": {
          "set": "default",
          "at": "2026-11-20T03:56:14Z",
          "command": "go test -count=1 ./...",
          "onMiss": "fail",
          "strict": false,
          "exitCode": 1,
          "runnerExitCode": 1,
          "failedBy": "runner",
          "loaded": 1,
          "consumed": 1,
          "missed": 0,
          "isolated": false,
          "isolationNote": "the test command failed",
          "mocksDigest": "dbf13cec4aacab7b9884b8328d415d74b1436418482ca74c4960a2aabd261ee2",
          "coverageNote": "the test command wrote no coverage report",
          "keployVersion": "3.9.4"
        },
        "lastRecord": {
          "set": "default",
          "command": "go test -count=1 ./..."
        }
      }
    ],
    "cloud": {"state": "no_app", "tests": 0, "sets": 0}
  }
}
```

The top of the output is the next step to take: `phase`, `summary`, and the
command to run next in `run` and `options`. `keploy mock status`, without
`--json`, prints the same next step as text.

### Each set

| Field        | What it says                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| `name`       | The mock set.                                                                                               |
| `calls`      | The recorded calls in the set. `-1` when they can't be counted cheaply.                                     |
| `mocksFile`  | The recording's file name: `mocks.yaml`, `mocks.json` or `mocks.gob`.                                       |
| `storage`    | Where the recording lives: `repo` (in the repository), `cloud`, `registry` or `local_only`.                 |
| `perTest`    | `true` when the test runner reported where each test starts and ends, so each test gets only its own calls. |
| `verdict`    | What the last replay proved. The values are in the next table.                                              |
| `why`        | The verdict in words.                                                                                       |
| `lastReplay` | The last replay's results, from `last-replay.yaml`.                                                         |
| `lastRecord` | The command the last `keploy mock record` of the set ran.                                                   |

| `verdict`      | Meaning                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `not_replayed` | Never replayed on this machine.                                                                           |
| `isolated`     | It passed with every dependency answered from the recording, and no call was missed.                      |
| `failed`       | The last replay exited non-zero.                                                                          |
| `leaky`        | It passed, but a call could reach a real dependency (`--on-miss passthrough` or `record`), or was missed. |
| `unverified`   | It passed with `--on-miss fail`, but Keploy could not read which calls were missed.                       |
| `stale`        | The recording has changed since it was replayed.                                                          |
| `below_floor`  | It was isolated, but the run covered less code than `--min-coverage`.                                     |
| `no_coverage`  | It was isolated, and the repository sets a coverage floor, but the run wrote no coverage report.          |
| `not_judged`   | With `KEPLOY_PROVEN=1`: some tests were left without a verdict, and none failed.                          |
| `quarantined`  | Its tests passed, but the set's `verdicts.yaml` sets most of them aside.                                  |
| `unknown`      | Keploy could not read the last replay's results. Replay again.                                            |

### The last replay

| Field                          | What it says                                                                                                                  |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `set`, `at`, `command`         | The set, when the replay ran, and the test command.                                                                           |
| `onMiss`, `strict`             | The `--on-miss` and `--strict` the replay used. Only `onMiss: fail` keeps a call that was never recorded from a real service. |
| `exitCode`                     | What Keploy exited with.                                                                                                      |
| `runnerExitCode`               | What the test command exited with. `-1` when it never exited on its own.                                                      |
| `failedBy`                     | What failed the run, when something did. The values are below.                                                                |
| `error`                        | Why Keploy could not run the replay or finish it, when that happened.                                                         |
| `loaded`, `consumed`, `missed` | The mocks loaded, the mocks served, and the calls no mock answered. `-1` means the count was never reported.                  |
| `isolated`, `isolationNote`    | `true` when the run showed the tests pass with no real dependency. The note says why not.                                     |
| `mocksDigest`                  | The SHA-256 of the mocks file the replay used, so you can tell whether the set was re-recorded since.                         |
| `coverage`, `coverageNote`     | The coverage your test command reported, or why there is none.                                                                |
| `minCoverage`                  | The `--min-coverage` the run was held to, when one was set.                                                                   |
| `bypass`                       | The destinations set to skip Keploy, which the replay sent to the real service.                                               |
| `keployVersion`                | The Keploy release that ran the replay.                                                                                       |

`failedBy` is one of:

- `runner`: the test command failed.
- `setup`: Keploy could not start the run, so the tests never ran.
- `strict`: `--strict` was on and a call missed its recorded mock.
- `min-coverage`: the run covered less code than `--min-coverage`, or wrote no
  coverage report.
- `keploy`: Keploy did not finish the run.
- `nothing-verified`: the run served none of the recorded calls, so it checked
  nothing.
- `capture_incomplete`: Keploy could not follow a process the test command
  ran, so that process's calls went to the real service.
- With `KEPLOY_PROVEN=1`, also `begin_refused` (Keploy refused a test when it
  began) and `rule_not_made` (a call a rule says the run must make was never
  made).

## See also

- [Overview](./overview.md): what the Universal Mocker records and replays.
- [Go quickstart](./quickstarts/go.md): a first record and replay, end to end.
- [Mock your tests](./mock-your-tests.md): the full guide to record and replay.
- [Troubleshooting](./troubleshooting.md): what a failing record or replay
  prints, and how to fix it.
