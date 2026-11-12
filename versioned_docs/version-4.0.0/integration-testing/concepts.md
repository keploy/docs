---
id: concepts
title: Concepts
description: How Keploy's integration testing is built (what runs in your cluster, in Keploy Cloud and in CI) and the terms it uses — app, test set, mock, auto-replay, replay, Keploy branch, noise, time freezing and deduplication.
keywords:
  - keploy concepts
  - keploy architecture
  - test set
  - mocks
  - keploy branch
  - noise
---

## How Keploy is built

Three places take part: your Kubernetes cluster, Keploy Cloud, and the CI runner that checks your pull requests.

<Architecture />

1. **Capture.** While a recording runs, a Keploy agent captures each request your service receives and every call it makes to a dependency, without code changes. The agent runs next to your service in the same pod (sidecar mode), or as a node agent on every node that captures with eBPF (DaemonSet mode, deployed in k8s-proxy's namespace). It sends what it captures to **k8s-proxy**, which you install once per cluster with Helm.
2. **Store.** k8s-proxy turns the capture into tests and mocks and keeps them in sync with Keploy Cloud. The proxy always dials out to Keploy over HTTPS. For the other direction, the Console and CLI reach the proxy either through that outbound tunnel (the default) or at an ingress URL you give it.
3. **Auto-replay.** k8s-proxy starts auto-replay pods in its own namespace: your service's image, with dependencies served from the mocks. They learn which fields are noise and set aside tests that don't replay cleanly.
4. **Replay in CI.** On every pull request, your pipeline runs `keploy cloud replay`. It downloads the tests and mocks, starts the pull request's image with its dependencies mocked, and reports the result to Keploy. The step's result is the pull request's check; when tests fail, Keploy opens a Keploy branch for the pull request.

In the **Keploy Console** you start recordings, watch auto-replays and review branches. To start a recording or a replay it reaches k8s-proxy through the tunnel, or directly at the proxy's ingress URL.

On a **self-hosted** install, the tests, mocks and reports stay in your own database and object storage, and the Console and CI talk to k8s-proxy instead of Keploy Cloud. See [Connect a cluster](/integration-testing/connect-a-cluster/).

## Terms

### App

A service Keploy records, named `<namespace>.<deployment>` after its Kubernetes deployment, for example `shop.orders`. Most commands take it as `--app`. The cluster it runs in is named with `--cluster`; when your account has one connected cluster, you can usually leave that flag out (it's required when you replay through a self-hosted cluster's proxy).

### Test case and Test set

A **Test case** is one request the app received, with the response it sent. Test cases are grouped into **Test sets**, one per recording, or per release when you record several images. A test passes when replaying the request returns the same response, apart from fields marked as noise.

### Mock

A **mock** is one call the app made to a dependency while it handled a request: a SQL query, a Redis command, a Kafka message, a gRPC or HTTP call. A **mapping** records which mocks each test used. During a replay the dependencies aren't running: Keploy answers each call from the matching mock.

### Auto-replay

The replay Keploy runs inside the cluster while a recording is on (every few minutes, 5 by default) and once more when it stops. Auto-replay tests the new recordings against the build they were recorded from. That's how Keploy tells real behaviour from noise, and it removes mocks no test uses. A test that keeps failing here is marked as failed and left out of pull-request runs.

### Replay

A replay runs an app's recorded tests again against a build of your choice, with the command `keploy cloud replay` or from the Console's **Replay** button, which runs it in your cluster. The command runs it in CI against the pull request's image, on your laptop, or in the cluster with `--trigger`. It downloads the tests and mocks, starts the app with its dependencies mocked, and reports each test.

### Keploy branch

A copy of an app's test data scoped to one pull request, the way a git branch is a copy of your code. Changes such as deleting outdated tests or restoring one are commits on the branch, so main's tests stay untouched until the pull request merges. Keploy creates the branch the first time a pull request's run fails, and finds it again on later runs by repository and pull-request number.

A branch moves through these states: open, review requested, approved or changes requested, then merged or closed. An approval covers the exact head commit the reviewer saw; a new commit asks for review again.

### Main

The app's test data outside any branch: the tests every pull request is checked against. Main changes only through recordings and merged branches.

### Noise

Response fields that change on every call, such as timestamps, request IDs and tokens. Keploy ignores noise when it compares a replayed response with the recorded one. Auto-replay finds most noise for you, and Keploy treats common per-request headers (`Date`, `X-Request-Id`, trace IDs) as noise by default.

### Time freezing

Keploy replays the app with its clock set to the moment each test was recorded, so tokens that expire and dates in responses come out the same as when they were recorded. It's on by default for recordings and replays you start in the Console (the **Freeze time** switch), and for `keploy cloud replay` in CI or on your machine. Two cases run with the real clock: recordings started with `keploy k8s record start`, and in-cluster replays started with `keploy cloud replay --trigger`. You don't change your app or image: for Go 1.20 and later, Keploy patches a stock Go binary itself. One more exception, for Go apps: when the container's pod spec sets no `command:` (it starts from the image's `ENTRYPOINT`), an in-cluster replay (auto-replay or the Console's **Replay**) runs it on the real clock if k8s-proxy has restarted or been upgraded since the deployment was last recorded, until you record it again. Go apps also aren't frozen in the cluster if you override the agent image with an untagged image or one older than 3.7.22.

### Deduplication

Keeps the suite small by dropping tests that add nothing new. **Static deduplication** is on by default for every recording: while it records, Keploy drops requests with the same shape as one it already kept. See [Static deduplication](/keploy-cloud/static-deduplication/). **Dynamic deduplication**, for Java apps and off by default, instruments the app during auto-replay and drops tests that run the same code path as another. Both are switches in the recording's **Record config** step, and only one can be on at a time: turning on dynamic deduplication turns static off.

### Smart test set <ComingSoon label="Upcoming" /> {#smart-test-set}

One deduplicated Test set built from an app's whole recording history, instead of the latest release's sets. Replay it with `--replay-source smart-set`. The app needs the smart-test-set setting turned on.
