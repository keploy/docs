---
id: overview
title: Integration testing with Keploy
sidebar_label: Overview
slug: /integration-testing/
description: Keploy turns real traffic from your Kubernetes environments into regression tests with mocks, runs them on every pull request, and keeps them current as your service changes.
keywords:
  - integration testing
  - regression testing
  - kubernetes
  - traffic capture
  - keploy cloud replay
---

Keploy turns the traffic your service already handles into regression tests. It captures real requests from a Kubernetes environment, including every call the service makes to its databases, queues and other APIs. Keploy stores each request with its response as a test, and the dependency calls as mocks. On every pull request, Keploy replays those tests against the new build, with the mocks standing in for the dependencies, and shows you what changed.

You don't write the tests and you don't run the environment they came from. When a change is intended, you delete the outdated tests on the pull request, a reviewer approves, and the next recording captures the new behaviour.

## Two ways to use Keploy

<CardGrid>
  <Card title="Capture from an environment" href="/integration-testing/how-it-works/" badge="Available">
    Record live traffic from staging or production, a place where you don't control the traffic. Keploy keeps the recorded tests as your regression suite and checks every pull request against them.
  </Card>
  <Card title="Your e2e tests with Keploy mocks" href="/integration-testing/e2e-tests-with-mocks/" badge="Coming soon">
    Write your own end-to-end tests, let Keploy record and mock the dependencies they hit, and run them in your pipeline with no real dependencies.
  </Card>
</CardGrid>

## What you get

- **Tests from real usage.** The suite covers the requests your users actually send, with their real payloads and edge cases.
- **No dependency setup in CI.** Databases, caches, queues and downstream APIs are served from recorded mocks, so a pull request runs the service alone.
- **A reviewed record of behaviour changes.** A failing test is either a regression to fix, or an intended change that a reviewer signs off on before the pull request merges.
- **Agent-ready.** Every command prints its next step, and the loop's commands can answer in JSON, so a coding agent can run the whole loop: fix a regression, or accept a change and request review.

## Start here

New to Keploy? Read [How it works](/integration-testing/how-it-works/) for the whole loop on one page. Then start with the Quickstart: it connects your cluster, records one service's traffic as tests, lets auto-replay check them, and replays them against a build. The guides after it go deeper into each step. You can do most of them from the terminal or from the Keploy Console.

<CardGrid>
  <Card title="1. Quickstart" href="/integration-testing/quickstart/">
    Install the CLI, connect a cluster, record one service and replay its tests against a build.
  </Card>
  <Card title="2. Connect a cluster" href="/integration-testing/connect-a-cluster/">
    Install k8s-proxy with Helm, on Keploy Cloud or self-hosted.
  </Card>
  <Card title="3. Record traffic" href="/integration-testing/record-traffic/">
    Start, watch and stop a recording of a deployment's live traffic.
  </Card>
  <Card title="4. Run on every pull request" href="/integration-testing/run-in-ci/">
    Add `keploy cloud replay` to GitHub Actions, GitLab CI or Jenkins.
  </Card>
  <Card title="5. Review test changes" href="/integration-testing/review-test-changes/">
    Triage a failed run, accept intended changes, and get them approved.
  </Card>
  <Card title="6. Keep tests current" href="/integration-testing/keep-tests-current/">
    Delete outdated tests, restore one, and keep a pull request's branch up to date.
  </Card>
</CardGrid>
