---
id: auto-replay
title: Auto-replay
description: How Keploy re-runs new recordings inside your cluster to separate real behaviour from noise before any pull request is checked against them.
keywords:
  - auto replay
  - noise detection
  - kubernetes
  - keploy
---

Auto-replay is the replay Keploy runs inside your cluster, against the same build a recording came from. If a test fails against the very build that produced it, the failure isn't a regression; something in the response simply changes on every call. Auto-replay finds those cases, so pull requests are only checked against tests that are stable.

## When it runs

- **During a recording,** every few minutes (5 by default; you can change the interval in the recording's settings in the Console).
- **When a recording stops,** once more over everything captured.

## What it does

1. **Replays each new test** with its mocks, against the recorded build.
2. **Learns noise.** It marks fields that differ between the recording and the replay, such as timestamps, generated IDs and tokens, as noise, so later comparisons ignore them.
3. **Classifies each test.** A test passes, is noisy (and now has its noise marked), or keeps failing. A test that keeps failing is marked as failed and left out of pull-request runs, because it can't tell you anything reliable.
4. **Prunes mocks** that no test used.

## See the results

- **While it runs.** The live recording's **View running auto-replay** opens the active auto-replay: how many tests have replayed, passed, failed or turned out noisy, and the replay pod's progress.
- **Afterwards.** The deployment's **Auto-Replay History** lists every recording with its captured tests and how many passed and failed. Expand a recording to see its runs; a run with failed tests offers its [debug bundle](/integration-testing/troubleshooting/#debug-bundles).
- **From the terminal.** `keploy k8s status --app <namespace>.<deployment>`.

<Screenshot src="/img/integration-testing/console/auto-replay-history.webp" alt="Auto-Replay History for a deployment: each recording with its release tag, captured tests, and passed and failed counts" />

You can change the auto-replay's timing when you start a recording, in its **Auto replay** step: the initial delay, the interval, and mock noise detection.

<Screenshot src="/img/integration-testing/console/record-auto-replay.webp" alt="The Auto replay step of Start Recording: initial delay, auto replay interval, mock noise detection and advanced settings" width="560" />

## Where it runs

By default the auto-replay pods run in the namespace you installed k8s-proxy into (`keploy`), not in the app's namespace. That way a replay never inherits the app namespace's quotas, NetworkPolicies or PodSecurity level. Two Helm values change this:

- `autoReplay.namespace` puts the pods in another namespace, for example the app's own. Do this if the app's images are pulled with the cloud identity of its ServiceAccount (ECR, GCR, Artifact Registry, ACR), which doesn't travel to another namespace.
- `autoReplay.imagePullSecrets` lists pull secrets for private registries. By default, the app's own `imagePullSecrets` are copied next to the replay pod.

For replaying in a separate cluster, and how the DaemonSet records, see [DaemonSet architecture and auto-replay environments](/running-keploy/k8s-proxy-daemonset-architecture/).

## Related

- [Concepts: noise](/integration-testing/concepts/#noise)
- [Concepts: time freezing](/integration-testing/concepts/#time-freezing), for responses that depend on the clock
