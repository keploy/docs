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

The result is shown on the recording in the Console, and in `keploy k8s status --app <namespace>.<deployment>`.

## Where it runs

By default the auto-replay pods run in the namespace you installed k8s-proxy into (`keploy`), not in the app's namespace. That way a replay never inherits the app namespace's quotas, NetworkPolicies or PodSecurity level. Two Helm values change this:

- `autoReplay.namespace` puts the pods in another namespace, for example the app's own. Do this if the app's images are pulled with the cloud identity of its ServiceAccount (ECR, GCR, Artifact Registry, ACR), which doesn't travel to another namespace.
- `autoReplay.imagePullSecrets` lists pull secrets for private registries. By default, the app's own `imagePullSecrets` are copied next to the replay pod.

For replaying in a separate cluster, and how the DaemonSet records, see [DaemonSet architecture and auto-replay environments](/running-keploy/k8s-proxy-daemonset-architecture/).

## Related

- [Concepts: noise](/integration-testing/concepts/#noise)
- [Time freezing](/keploy-cloud/time-freezing/), for responses that depend on the clock
