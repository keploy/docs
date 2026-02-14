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
