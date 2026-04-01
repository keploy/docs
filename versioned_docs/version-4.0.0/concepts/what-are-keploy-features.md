---
id: what-are-keploy-features
title: Keploy Features
sidebar_label: Keploy Features
description: Keploy features include automatic test generation from real traffic, production-like sandboxes, dependency virtualization, AI-powered flaky test elimination, infrastructure mocking, legacy application testing, migration regression testing, continuous validation, and CI/CD integration — all without code changes.
tags:
  - explanation
  - keploy features
  - features
  - record replay test
  - mock mutations
keywords:
  - test cases
  - dependency virtualization
  - production sandbox
  - infrastructure mocking
  - flaky test elimination
  - legacy application testing
  - migration regression testing
  - continuous validation
  - production behavior replay
  - AI-driven testing
  - release confidence
  - keploy features
  - features
  - record replay test
  - mock mutations
---

Keploy's key features include automatic test generation from real user traffic, production-like sandbox environments, dependency virtualization for databases and external services, AI-powered noise detection for flaky test elimination, infrastructure mocking for message queues and APIs, legacy application testing without code changes, migration regression testing against production baselines, continuous validation in CI/CD pipelines, and Time Freezing for deterministic replay — enabling teams to ship with AI-driven code velocity while maintaining release confidence.

## Key Features

Keploy is built for a wide variety of use-cases, however, to kick things off, let's dive into some key features that
make Keploy stand out from the rest of the testing platforms out there.

## 🧩 Combined Test Coverage in CI/CD:

#### Run Tests with Mocks Anywhere You Like

Keploy has [native integrations](/concepts/general-glossary.md#4-interoperability) with your unit-testing libraries
like `go-test`, `jUnit`, `jest`, `pyTest`. Keploy gives combined test-coverage and can also be integrated in existing CI
pipelines easily within `go-test`, `jUnit`, `jest`, `pyTest` workflows.

<img src="/docs/gif/replay-tc.gif?raw=true" alt="Keploy Integration with Testing Libraries"  width="80%"/>

Run tests with mocks anywhere you like—**locally on the CLI**, in your **CI pipeline**, or even across a **Kubernetes
cluster**. It's testing wherever you want it! 🌍

## 📽️ Works for Complex API Flows

#### Can easily record complex API flows and replay them as tests and stubs.

With Keploy, you can effortlessly record and replay intricate, distributed API flows as mocks and stubs. It's like
having a time machine for your tests! ⏳

Keploy will record all API calls and their subsequent network traffic served by the application. You can utilize your
favorite API management tools like Postman or even Curl to generate test cases.

Keploy automatically [mocks](/concepts/general-glossary.md#1-api-data-mocking) network/external dependencies for **all
CRUD operations** with correct responses.

<img src="/docs/gif/record-replay.gif?raw=true" width="80%" alt="API Tools"/>

Once recorded, you have the flexibility to replay and simulate the same flow with mutations/write calls locally or
within your CI environment without needing to connect to external services/dependencies.

No more data dumps, stubs, or mocks for dependencies like DBs, internal services, or third-party services like twilio,
shopify, or stripe are required anymore. 💡

<img src="/docs/img/mock-dependencies.png?raw=true" width="50%" alt="Mock Application Dependencies" style={{backgroundColor: '#EDEDED'}}/>

[Idempotency](/concepts/general-glossary.md#2-idempotency) guarantees are also **not required** in the application.
Multiple Reads after write operations can be replicated automatically too. 🔄

[//]: # '<img src="/docs/img/record-api.gif?raw=true" width="80%" alt="API Tools"/>'

## ♻️ Multi-Purpose Mocks

#### Re-Use Mocks for Testing Servers

Keploy generated dependency mocks can also be used as test case for the server. These tests can be used for use-cases
like chaos testing, e2e testing, integration testing, api and regression testing. 🌟

## 🌐 Code-less EBPF Instrumentation

#### Network Layer Integration makes it Light-Weight

Keploy uses EBPF like a secret sauce to make integration code-less, language agnostic, and oh-so-lightweight. 🍲

## 🔍 Accurate Noise Detection

#### Eliminates random fields for Assertion

Keploy identifies [noisy fields](/concepts/general-glossary.md#3-noisy-field) in the responses accurately like (
timestamps, random values) to ensure high quality tests.

As the application serves the API, Keploy re-run that API request with the captured dependency mocks.

[//]: # '<img src="/img/noise-filtration.png?raw=true" alt="Keploy noise filtration"/>'

Keploy identifies differences in API responses, marking them as random/noisy fields. 🧐✅

Hope this helps you out, if you still have any questions, reach out to us .
