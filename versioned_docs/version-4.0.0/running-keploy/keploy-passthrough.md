---
id: keploy-passthrough
title: Keploy Passthrough
sidebar_label: Keploy Passthrough
description: This section documents how to rename testset
tags:
  - keploy
  - keploy passthrough
keywords:
  - keploy
  - documentation
  - running-guide
---

The generic dependency support is unable to mock the certain config requests because the server sends the request buffers for initial handshake instead of client libraries. Due to which the test fails due to different flow in generic dependency support.

This is why, user can provide the server port to pass the external requests without mocking them.

## Under the proven model: `mock.real`

On Linux, Keploy runs its proven model by default. There `keploy record` and `keploy test` refuse `--passThroughPorts` as an unknown flag (exit code 8) and ignore `passThroughPorts` in `keploy.yml`. List the destinations Keploy should reach for real in `keploy.yml` under `mock.real` instead: an address (`localhost:5432`), a name (`auth.example.com:443`) or a container (`container:redis`). Keploy never records or mocks a call to them, and records and mocks every other call.

```yaml
mock:
  real:
    - localhost:5672
    - localhost:5432
```

The examples below apply with the proven model off: with `KEPLOY_PROVEN=0`, and on macOS and Windows, where it is off by default.

## Keploy Passthrough Example

You can add `--passThroughPorts` flag to pass the outgoing calls at the given ports and pass them in the keploy proxy without mocking.

### Record cmd

```zsh
sudo -E env 'PATH=$PATH' main.go record -c "java -jar path/to/user/jar" --passThroughPorts 5672,5432
```

### Test cmd

```zsh
sudo -E env 'PATH=$PATH' main.go test -c "java -jar path/to/user/jar" --delay 25  --passThroughPorts 5672,5432
```

## Related

- [Recording Filters](/docs/running-keploy/recording-filters/) — control which calls Keploy captures.
- [Adding a custom Mock](/docs/running-keploy/custom-mocks/) — hand-author mocks for dependencies.
- [Keploy CLI Commands](/docs/running-keploy/cli-commands/) — full command and flag reference.
