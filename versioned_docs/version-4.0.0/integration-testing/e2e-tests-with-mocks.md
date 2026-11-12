---
id: e2e-tests-with-mocks
title: Your e2e tests with Keploy mocks
sidebar_label: Your e2e tests + mocks
description: Coming soon — write your own end-to-end tests, let Keploy record and mock every dependency they touch, and run them in CI with no real databases or services.
keywords:
  - e2e testing
  - mocking
  - keploy mock
  - ci
---

<ComingSoon />

Capturing traffic from an environment gives you tests for what your service already does. For a regression suite you design yourself, Keploy is adding a second way in: **your own end-to-end tests, with Keploy mocking everything they touch.**

## How it will work

<Lifecycle steps={[
{title: "Write e2e tests", text: "in the framework you already use"},
{title: "Record once", text: "Keploy captures every dependency call the tests make"},
{title: "Run in CI", text: "dependencies are served from mocks; nothing else to start"},
{title: "Refresh", text: "re-record when a dependency's behaviour changes on purpose"},
]} />

- **Your tests, your assertions.** You decide what to cover; Keploy doesn't generate the tests.
- **No dependency setup.** Databases, caches, queues and third-party APIs are mocked at the network layer, with no SDK and no code changes.
- **Same pipeline.** The tests run as a step in the pipeline that already builds your service.

## Until then

[Capture from an environment](/integration-testing/quickstart/) is available today and covers the regression loop end to end.

An early preview of the mocking CLI, `keploy mock record` and `keploy mock replay`, is available for trying it with your own tests: see [Mock your tests in 2 minutes](/running-keploy/mock-quickstart/) and [Mock your own tests](/running-keploy/mock-your-tests/). Expect it to change before the release. To be told when it ships, join the [Keploy Slack](https://keploy.io/slack).
