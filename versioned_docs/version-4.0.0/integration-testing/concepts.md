---
id: concepts
title: Concepts
description: The terms Keploy's integration testing uses — app, test set, test case, mock, auto-replay, cloud replay, Keploy branch, noise, time freezing and deduplication.
keywords:
  - keploy concepts
  - test set
  - mocks
  - keploy branch
  - noise
---

## App

A service Keploy records, named `<namespace>.<deployment>` after its Kubernetes deployment, for example `shop.orders`. Most commands take it as `--app`. The cluster it runs in is named with `--cluster`; when your account has one connected cluster, you can usually leave that flag out (it's required when you replay through a self-hosted cluster's proxy).

## Test case and Test set

A **Test case** is one request the app received, with the response it sent. Test cases are grouped into **Test sets**, one per recording, or per release when you record several images. A test passes when replaying the request returns the same response, apart from fields marked as noise.

## Mock

A **mock** is one call the app made to a dependency while it handled a request: a SQL query, a Redis command, a Kafka message, a gRPC or HTTP call. A **mapping** records which mocks each test used. During a replay the dependencies aren't running: Keploy answers each call from the matching mock.

## Auto-replay

The replay Keploy runs inside the cluster while a recording is on (every few minutes, 5 by default) and once more when it stops. Auto-replay tests the new recordings against the build they were recorded from. That's how Keploy tells real behaviour from noise, and it removes mocks no test uses. A test that keeps failing here is marked as failed and left out of pull-request runs.

## Cloud replay

`keploy cloud replay` runs an app's tests against a build of your choice: in CI against the pull request's image, on your laptop, or in the cluster with `--trigger`. It downloads the tests and mocks, starts the app with its dependencies mocked, and reports each test.

## Keploy branch

A copy of an app's test data scoped to one pull request, the way a git branch is a copy of your code. Changes such as deleting outdated tests or restoring one are commits on the branch, so main's tests stay untouched until the pull request merges. Keploy creates the branch the first time a pull request's run fails, and finds it again on later runs by repository and pull-request number.

A branch moves through these states: open, review requested, approved or changes requested, then merged or closed. An approval covers the exact head commit the reviewer saw; a new commit asks for review again.

## Main

The app's test data outside any branch: the tests every pull request is checked against. Main changes only through recordings and merged branches.

## Noise

Response fields that change on every call, such as timestamps, request IDs and tokens. Keploy ignores noise when it compares a replayed response with the recorded one. Auto-replay finds most noise for you, and Keploy treats common per-request headers (`Date`, `X-Request-Id`, trace IDs) as noise by default.

## Time freezing

Replays the app with its clock set to the moment the test was recorded. Then tokens that expire and dates in responses come out the same as when they were recorded. Turn it on with `--freezeTime`. See [Time freezing](/keploy-cloud/time-freezing/).

## Deduplication

Drops captured traffic that adds no new coverage, so the suite stays small. **Static** deduplication happens while recording, by request shape. **Dynamic** deduplication (`--dedup`) uses code coverage during a replay.

## Smart test set <ComingSoon label="Upcoming" /> {#smart-test-set}

One deduplicated Test set built from an app's whole recording history, instead of the latest release's sets. Replay it with `--replay-source smart-set`. The app needs the smart-test-set setting turned on.
