---
id: common-errors
title: Keploy Troubleshooting Guide
sidebar_label: Troubleshooting Guide
description: "Troubleshoot common Keploy errors — dependency not found, failed API recording, test replay issues, sudo on Linux, HTTPS certificates and telemetry — and their solutions."
tags:
  - explanation
  - faq
---

Let’s explore some frequently encountered issues and how to resolve them effectively.

### 1. Dependency Not Found Error

#### Description:

This error occurs when Keploy cannot locate or access a required dependency, such as a database or external service.

#### Possible Cause:

- The dependency may not be running or is incorrectly configured.
- Networking issues may be preventing Keploy from connecting to external dependencies.

#### Solution:

- Verify that all required services (e.g., databases, third-party APIs) are active and accessible.
- Check the environment variables or configuration files to confirm the correct host and port details.
- Use network diagnostic tools (e.g., ping, traceroute) to identify connectivity issues.

### 2. Unable to Record API Calls

#### Description:

Keploy fails to record incoming API traffic, meaning no tests are generated.

#### Possible Cause:

- Incorrect integration with the application.
- Keploy may not be correctly started with the application, or the SDK is not configured properly.
- The application may not be making API calls that are recognizable by Keploy.

#### Solution:

- Double-check the integration guide for the programming language you’re using.
- Ensure that Keploy is properly hooked into the API layer.
- Check Keploy logs for any missed or skipped requests.

### 3. Test Replay Failure

#### Description:

Keploy is unable to replay recorded API requests.

#### Possible Cause:

- External services or databases may be in a different state than they were during recording.
- Non-deterministic values like timestamps, UUIDs, or random values are causing failures.

#### Solution:

- Leverage Keploy’s mocking capabilities to simulate external services and databases.
- Use configurations to handle or exclude non-deterministic values for consistent comparisons.
- Regularly reset the database state to match the conditions during recording.

### 4. Response Mismatch Error

#### Description:

When Keploy replays API calls, it detects a mismatch between the recorded response and the current response.

#### Possible Cause:

- The application’s behavior has changed, leading to different responses.
- Changes in the response format, status codes, or headers that weren’t present during recording.

#### Solution:

- Review the application changes and determine if the mismatch is expected (e.g., new features).
- If the change is acceptable, update the test baseline to reflect the new behavior.
- Use Keploy’s flexible comparison options to ignore certain fields or values (like timestamps or version numbers).

### 5. Incorrect Test Generation

#### Description:

Keploy generates tests that don’t properly reflect the API interactions.

#### Possible Cause:

- The API interaction may be too complex or involve custom logic that Keploy cannot automatically handle.
- API parameters may be missing or misinterpreted during recording.

#### Solution:

- Review the recorded test cases for correctness.
- Manually adjust the generated tests to include missing or misinterpreted parameters.
- Make use of Keploy’s API to refine the recording process if necessary.

### 6. Database Connection Error during Test Replay

#### Description:

Keploy cannot connect to the database or other external systems during the replay of tests.

#### Possible Cause:

- The test environment may not have access to the same database as the original recording.
- Database credentials or host information could be incorrect or missing in the test environment.

#### Solution:

- Mirror the test environment configuration with the recording setup.
- Use database mocks or stubs for isolated testing.
- Double-check connection strings, credentials, and database availability.

### 7. Missing or Invalid Configuration Error

#### Description:

Keploy cannot find a valid configuration file or encounters errors in the configuration.

#### Possible Cause:

- The Keploy configuration file (keploy.yaml or similar) is missing or contains invalid values.
- Environment variables required by Keploy may not be set.

#### Solution:

- Ensure the configuration file exists and follows the correct format.
- Populate all required fields with valid values.
- Check that environment variables are properly set.

### 8. Timeout Errors

#### Description:

Keploy times out while recording or replaying API calls.

#### Possible Cause:

- Long-running API requests or slow external dependencies can cause timeout issues.
- Keploy may have low timeout settings for API calls.

#### Solution:

- Increase timeout settings in the Keploy configuration.
- Identify and optimize slow-performing APIs or dependencies.
- Use monitoring tools to analyze API performance.

### 9. Insufficient Permissions

#### Description:

Keploy fails due to insufficient permissions when accessing files, networks, or other resources.

#### Possible Cause:

The user or service running Keploy may not have sufficient permissions to access resources like databases, APIs, or file systems.

#### Solution:

- Ensure that the user or service running Keploy has the necessary permissions.
- Review system permissions and provide the required access rights for Keploy to function properly.

### 10. Version Compatibility Issues

#### Description:

Errors occur because of version mismatches between Keploy, its dependencies, or the application it’s testing.

#### Possible Cause:

- Using incompatible versions of Keploy or related SDKs with your application.
- Dependencies of Keploy (e.g., for mocking or replaying) may have updated and broken compatibility.

#### Solution:

- Verify version compatibility for Keploy and its SDKs.
- Consult Keploy documentation or release notes for known issues.
- Use version pinning to maintain a stable environment.

### 11. Unsupported Protocol or API

#### Description:

Keploy does not support the protocol or API structure you are using (e.g., gRPC, SOAP, etc.).

#### Possible Cause:

- The application might use an API or protocol that Keploy doesn’t yet support (e.g., WebSocket, gRPC).

#### Solution:

- Confirm the supported protocols (currently HTTP/REST and GraphQL).
- Consider alternative tools or frameworks for unsupported protocols.

### 12. MySQL connection hangs during the handshake

#### Description:

Your application cannot reach MySQL while Keploy is running. The client reports a lost connection during the handshake, and the application often never finishes starting because its connection pool is stuck:

```
ERROR 2013 (HY000): Lost connection to server at 'handshake: reading initial communication packet'
```

The same setup connects normally when you run it without Keploy.

#### Possible Cause:

- `disableMysqlAutoDetect` is set to `true`, and the port your database listens on is not listed in `mysqlPorts`.
- You are running a Keploy version that predates automatic MySQL port detection, which recognised only `3306` and `4000` unless you configured `mysqlPorts`.

#### Solution:

- Remove `disableMysqlAutoDetect` from your config file, or set it to `false`. Keploy then identifies MySQL on any port on its own.
- If you need detection off, list every MySQL port your application uses:

  ```yaml
  mysqlPorts: [3307, 6033]
  ```

- On an older Keploy version, upgrade, or add the port to `mysqlPorts`.

See [MySQL port detection](../running-keploy/configuration-file.md#mysql-port-detection) for how Keploy identifies the protocol during Record and recovers the port during Test.

### 13. Capture loss warning: "proxyless capture could not record an app's bytes"

#### Description:

While recording with `keploy record --low-latency`, a Kubernetes Sidecar with `low_latency_mode`, or the Kubernetes DaemonSet agent, Keploy logs:

```
proxyless capture could not record an app's bytes: the app sent them with sendfile(2), ...
```

The recording is missing those bytes, and the test cases or mocks that carried them may be incomplete.

#### Possible Cause:

- The app moved the bytes without copying them through its own memory: `sendfile(2)` (for example nginx `sendfile on`, Tomcat's default sendfile, or Go's `http.ServeFile`), `splice(2)` (for example Go's `io.Copy` between two connections), or io_uring registered buffers.
- Less often: a `MSG_TRUNC` receive, which needs no change, or a page Keploy's hook could not read, logged as an error.
- Keploy's hooks missed the app's TCP bytes, for example a `recvmmsg`, `sendmmsg` or io_uring call in progress when another eBPF tool started or stopped, on an x86-64 kernel older than 6.3 (see [Keep Keploy's hooks from missing TCP bytes](../running-keploy/capture-loss.md#unseen)), or a single send or receive moved more than 16 MiB (see [Split sends and receives of more than 16 MiB](../running-keploy/capture-loss.md#too-large)).

#### Solution:

- Follow the `toRecordIt` field, if the line has one. [Capture loss warnings](../running-keploy/capture-loss.md), which the line's `docs` field links, describes each cause and what to do about it.

### 14. Podman: the command is refused, the app doesn't start, or its image isn't found

#### Description:

Recording or testing an application that runs in Podman stops before it starts, with one of these:

```
this keploy build cannot record or test applications that run in Podman. ...
```

```
failed to prepare podman: keploy records and tests applications that run in Podman on Linux only
```

```
podman is set up as podman-remote's client, ...
```

```
podman could not say whether it runs locally ...
```

or, with compose, the app's container never starts and Podman says:

```
Error: unrecognized namespace mode service:keploy-agent passed
```

or Podman can't find the application's image although `podman images` (without `sudo`) lists it, or the app runs but nothing is recorded.

#### Possible Cause:

- The `keploy` binary doesn't include Podman support: one built from the open-source repository, installed with `install.sh --oss`, or downloaded from the keploy/keploy GitHub releases.
- Keploy is older than v3.8.60 (`keploy -v`): it runs a Podman command as a host process, so the app starts but nothing is recorded, with no error.
- Keploy is running on macOS or Windows (including with Podman machine). Keploy records Podman applications on Linux only.
- Podman is a podman-remote client (set by `CONTAINER_HOST`, `CONTAINER_CONNECTION`, or `remote = true` in containers.conf), so the app would run in another Podman service, while Keploy's agent runs in the local rootful Podman.
- With compose, the compose provider is podman-compose, which Keploy doesn't support. Keploy re-runs itself with `sudo -E` and your `PATH`, so `sudo -E env "PATH=$PATH" podman compose version` shows the provider it gets. Podman takes `PODMAN_COMPOSE_PROVIDER`, else the first of containers.conf's `compose_providers` it finds (by default Docker's compose plugin, then `docker-compose`, then `podman-compose` on that `PATH`).
- With compose, the host doesn't run systemd, so Podman never runs the healthcheck of Keploy's agent service and the app's service, which waits for it, never starts.
- The image is in your rootless Podman. Keploy runs as root and drives the rootful Podman, which has its own images.

#### Solution:

- Install or update Keploy with `source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"` (free with an account): Podman needs v3.8.60 or later.
- Run Keploy on the Linux machine whose rootful Podman runs the app, with `CONTAINER_HOST` and `CONTAINER_CONNECTION` unset (or `CONTAINER_HOST` set to the rootful socket, `unix:///run/podman/podman.sock`, with the rootful `podman.socket` enabled) and without `remote = true` in containers.conf.
- For compose, install Docker Compose (`docker-compose`) on that `PATH` and keep `podman-compose` out of containers.conf's `compose_providers`, or set `PODMAN_COMPOSE_PROVIDER` to docker-compose's path; and run it on a host with systemd, or use `podman run`.
- Build or pull the image with `sudo podman`. See [Platform requirements](/docs/concepts/platform-requirements/#podman).

### 15. An HTTP service on port 3306 or 4000 gets no answer while recording

#### Description:

Your application calls an HTTP service on port `4000` (a common development port) or `3306`. Under `keploy record` the call never gets a response, and the client waits until its own timeout. The same service on another port works, and so does the call without Keploy.

#### Possible Cause:

- The port is listed in `mysqlPorts`. Keploy pins a listed port to MySQL and waits for a MySQL greeting that an HTTP service never sends.
- `disableMysqlAutoDetect` is set to `true` and `mysqlPorts` is empty, which pins `3306` and `4000` to MySQL.
- You are running an older Keploy version that took every connection to `3306` or `4000` for MySQL.

#### Solution:

- Remove the port from `mysqlPorts`. List only ports that serve MySQL.
- Remove `disableMysqlAutoDetect` from your config file, or set it to `false`.
- On an older Keploy version, upgrade.

See [MySQL port detection](../running-keploy/configuration-file.md#mysql-port-detection) for how Keploy tells MySQL from other protocols on these ports.

### 16. Linux: Keploy asks for your password, or a CI job stops at `sudo` {#linux-sudo}

#### Description:

On Linux, `keploy record`, `keploy test`, `keploy mock record` or `keploy mock replay` asks for your `sudo` password. Where nobody can type it, such as a CI runner or a script with no terminal, the command stops because `sudo` can't ask.

#### Possible Cause:

- On Linux, Keploy's agent, the process that records and replays the calls, uses eBPF, which needs root. Keploy runs as your user and starts its agent with `sudo`, unless Keploy itself runs as root.
- macOS needs no `sudo`: on a Mac with Apple silicon, Keploy works in user space.

#### Solution:

- Run `keploy` as your own user, and type your password when `sudo` asks.
- Where nobody can type a password, let that user run `sudo` without one. GitHub-hosted runners already do.
- Don't start Keploy itself with `sudo keploy`: the files it writes in your home folder are then owned by root, and a later run as your user can't update them. If a run warns `failed to persist refreshed tokens to ~/.keploy/tokens.yaml`, give the folder back to your user:

  ```bash
  sudo chown -R $USER ~/.keploy
  ```

### 17. Linux: `certutil is not installed` warning {#certutil-warning}

#### Description:

A run on Linux warns once:

```
keploy could not add its CA to the NSS database Chromium-based browsers read: certutil is not installed. Install it (Debian/Ubuntu: apt-get install libnss3-tools; Fedora/RHEL: dnf install nss-tools); until then a browser rejects keploy's certificate and its HTTPS calls are neither recorded nor mocked
```

The run goes on.

#### Possible Cause:

Keploy records and replays HTTPS calls with a certificate authority (CA) of its own (see [entry 18](#https-ca)). Most clients trust it through the system trust store and the variables Keploy sets for your app. Chromium-based browsers (Chrome, Chromium, the Chromium that Playwright and Puppeteer drive, and Electron apps) read only their own NSS database, `$HOME/.pki/nssdb`. Keploy adds its CA there with NSS's `certutil`, and `certutil` isn't installed.

#### Solution:

- If your tests don't drive a Chromium-based browser or another client that reads `$HOME/.pki/nssdb`, you can ignore the warning: every other client trusts Keploy's CA without it.
- If they do, install `certutil` and run again:

  ```bash
  # Debian or Ubuntu
  sudo apt-get install libnss3-tools
  # Fedora or RHEL
  sudo dnf install nss-tools
  ```

### 18. HTTPS: do I need to trust Keploy's certificate? {#https-ca}

#### Description:

Keploy reads and answers your app's HTTPS calls by acting as the server, with certificates from a certificate authority (CA) of its own. You don't install or trust that CA yourself, and on macOS Keploy needs no `sudo` or keychain change for it.

#### Possible Cause:

Not an error. For each run, Keploy makes your app trust its CA:

- **Linux:** Keploy adds this run's CA to the system trust store, and to the NSS database Chromium-based browsers read when `certutil` is installed (see [entry 17](#certutil-warning)), and removes it when the run ends. Its agent runs as root, so it can.
- **macOS (Apple silicon):** Keploy adds its CA inside each process it starts, in memory, so Go programs, which ask macOS to check certificates, trust it too. Your keychain isn't changed.
- **On both,** the app gets environment variables that point it at Keploy's CA: `NODE_EXTRA_CA_CERTS` at the CA, and `SSL_CERT_FILE`, `REQUESTS_CA_BUNDLE` and `CARGO_HTTP_CAINFO` at a bundle of your system's roots plus Keploy's CA. Java gets a truststore of both through `JAVA_TOOL_OPTIONS`.

#### Solution:

- Nothing to do. Each JVM your app starts prints `Picked up JAVA_TOOL_OPTIONS: ...` during a run: the JVM prints that line whenever `JAVA_TOOL_OPTIONS` is set, and it's expected.
- Older Keploy versions put one fixed CA into the system trust store and left it there. To remove it from a machine that ran one, run `sudo keploy ca clean` (on Debian or Ubuntu, `sudo keploy ca clean --fresh` also rebuilds the system bundle).

### 19. Telemetry: what Keploy sends, and how to turn it off {#telemetry}

#### Description:

The Keploy CLI sends usage telemetry to Keploy, to `telemetry.keploy.io`:

- events about runs, such as how many tests and mocks a recording made, by kind of mock, and how a test run ended, with an installation ID, your OS and the Keploy version;
- sign-in events, when you sign in or the CLI renews your session, which carry your Keploy account's email address and IDs;
- crash reports, which carry the run's log and the machine's host name.

#### Possible Cause:

Telemetry is on unless you turn it off.

#### Solution:

Turn it off in one of these ways:

- `disableTele: true` in your project's `keploy.yml`: no Keploy command run in the project sends telemetry;
- `--disable-tele` on one command, for example `keploy mock record --disable-tele`.

Either one covers everything above, including the agent Keploy starts. Until the CLI has read your choice, it sends nothing.

The Keploy VS Code extension sends its own events. Turn them off with its `keploy.telemetry.enabled` setting or VS Code's `telemetry.telemetryLevel`; then every CLI the extension starts gets `KEPLOY_DISABLETELE=true`. See [the extension's Telemetry section](/docs/running-keploy/utg-vscode-extension/#telemetry).

If you’re still encountering issues after trying these solutions, feel free to reach out to the Keploy team on [Slack](https://keploy.io/slack).

Happy Testing!

## Related

- [Capture loss warnings](/docs/running-keploy/capture-loss/) — bytes the eBPF capture cannot record, and how to record them.
- [Debugger Guide](/docs/keploy-explained/debugger-guide/) — debug Keploy with the VS Code debugger.
- [Running Keploy on Windows in WSL](/docs/keploy-explained/windows-wsl/) — WSL setup and fixes.
- [Running Keploy on macOS in a Linux VM (Lima)](/docs/keploy-explained/mac-linux/) — macOS setup with Lima.
- [API Testing — Frequently Asked Questions](/docs/keploy-explained/api-testing-faq/) — common API testing questions.
