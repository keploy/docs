---
id: how-it-works
title: How Keploy works
sidebar_label: How it works
description: The Keploy loop end to end — capture traffic from a Kubernetes environment, keep it as tests with mocks, replay it on every pull request, review intended changes and merge them.
keywords:
  - how keploy works
  - k8s-proxy
  - cloud replay
  - keploy branch
  - regression testing
---

Keploy runs as a loop. It captures traffic from an environment, keeps it as tests, and checks every pull request against those tests. When a change is intended, the outdated tests are removed through review. The next recording brings the suite back up to date.

<Lifecycle steps={[
{title: "Capture", text: "k8s-proxy records live traffic from a deployment"},
{title: "Keep as tests", text: "requests become tests; dependency calls become mocks"},
{title: "Auto-replay", text: "Keploy re-runs them in the cluster to drop noise"},
{title: "Check the PR", text: "cloud replay runs the tests against the PR build"},
{title: "Review", text: "regressions get fixed; intended changes get approved"},
{title: "Merge", text: "the PR merges, and its test changes merge with it"},
]} />

## 1. Capture traffic from an environment

You install **k8s-proxy**, Keploy's Helm chart, into a Kubernetes cluster that already serves traffic, such as staging or production. You don't need to generate that traffic yourself. When you start a recording on a deployment, Keploy captures at the network layer:

- every request the service receives, with the response it sends;
- every call the service makes while it handles that request: SQL and NoSQL databases, Redis, Kafka, gRPC and HTTP APIs.

You don't change the service's code and you don't add an SDK. The proxy captures through a node agent (DaemonSet mode, the default) or through an agent injected next to the app (sidecar mode). See [Connect a cluster](/integration-testing/connect-a-cluster/).

## 2. Keep it as tests with mocks

Each captured request becomes a **Test case**, grouped into **Test sets**. The dependency calls made while serving it become **mocks**, linked to the tests that used them. With deduplication turned on, Keploy also drops repeated traffic that adds no coverage.

Where the data lives depends on how you run Keploy:

|                         | Keploy Cloud (SaaS)                                 | Self-hosted                                                             |
| ----------------------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| Tests and mocks         | Keploy Cloud                                        | Your MySQL (or MongoDB) and your object storage (S3, GCS, Azure, MinIO) |
| Console                 | app.keploy.io                                       | Your Keploy Console                                                     |
| Who reaches the cluster | Keploy Cloud, over an ingress or an outbound tunnel | Your CI and your users, over the proxy's ingress                        |

## 3. Auto-replay drops noise before you see it

While a recording runs, and once more when it stops, Keploy **auto-replays** the new tests inside the cluster against the same build. A test that fails against the very build it was recorded from isn't a regression. It's noise, such as a timestamp, a random ID or a non-deterministic order. Keploy learns those fields as **noise** and removes mocks that no test uses. Only stable tests reach your pull requests. See [Auto-replay](/integration-testing/auto-replay/).

## 4. Check every pull request

In CI, `keploy cloud replay` downloads the app's tests and mocks and runs them against the pull request's image. The dependencies are served from mocks, so the job needs only the service itself.

- If every test passes, the check passes.
- If tests fail, Keploy creates a **Keploy branch** for the pull request. It's a private copy of the test data, where this pull request's changes can be made without touching main.

See [Run on every pull request](/integration-testing/run-in-ci/).

## 5. Review what changed

The pull request's author, or their coding agent, triages the failures:

- A **regression** is a bug in the change. Fix the code and push.
- An **intended** change, such as a new response field or a renamed status, means the recorded test is outdated. `keploy cloud accept` deletes those tests on the Keploy branch and, with `--reviewer`, requests review.
- If a test was deleted by mistake, `keploy cloud restore-test` brings it back.

A reviewer reads the branch's diff and approves it, or asks for changes. While approval is pending, the pull request's check waits. Once the branch is approved, the check passes. See [Review test changes](/integration-testing/review-test-changes/).

## 6. Merge, and the tests follow

When the pull request merges, the next run on main merges its Keploy branch into main's test data. That means the deletions you reviewed, and nothing else. The next recording captures the new behaviour as fresh tests, so the suite never needs hand edits. See [Keep tests current](/integration-testing/keep-tests-current/).

:::tip Accepting a change means deleting a test
Keploy never edits a recorded test to make it pass. An intended change removes the outdated test through review, and a recording adds the new one. That way every test in the suite is something your service really did.
:::

## Next

<CardGrid>
  <Card title="Quickstart" href="/integration-testing/quickstart/">Try the loop on your own cluster.</Card>
  <Card title="Concepts" href="/integration-testing/concepts/">Test sets, mocks, branches and noise, defined.</Card>
</CardGrid>
