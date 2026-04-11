---
id: what-are-keploy-features
title: Keploy Features
sidebar_label: Keploy Features
description: Keploy platform automatically mocks application dependencies and safely replay writes. It does accurate noise detection and statistical de-duplication.
tags:
  - explanation
  - keploy features
  - features
  - record replay test
  - mock mutations
keywords:
  - test cases
  - data dumps
  - keploy features
  - features
  - record replay test
  - mock mutations
---

## What are Keploy's key features?

Keploy provides combined test coverage reporting in CI/CD pipelines, records complex distributed API flows as replayable test cases, automatically mocks all external dependencies including databases and third-party services, detects and filters noisy fields like timestamps from assertions, and supports multiple languages through code-less eBPF-based instrumentation that requires zero application changes.

## 🧩 How does Keploy provide combined test coverage in CI/CD?

#### Run Tests with Mocks Anywhere You Like

Keploy integrates natively with unit-testing frameworks such as go-test, jUnit, jest, and pyTest to report combined test coverage from both recorded API tests and existing unit tests. Tests can run locally on the CLI, inside CI pipelines, or across Kubernetes clusters, giving teams a unified coverage metric without maintaining separate test infrastructure.

Keploy has [native integrations](/concepts/general-glossary.md#4-interoperability) with your unit-testing libraries
like `go-test`, `jUnit`, `jest`, `pyTest`. Keploy gives combined test-coverage and can also be integrated in existing CI
pipelines easily within `go-test`, `jUnit`, `jest`, `pyTest` workflows.

<img src="/docs/gif/replay-tc.gif?raw=true" alt="Keploy Integration with Testing Libraries"  width="80%"/>

Run tests with mocks anywhere you like—**locally on the CLI**, in your **CI pipeline**, or even across a **Kubernetes
cluster**. It's testing wherever you want it! 🌍

## 📽️ How does Keploy handle complex API flows?

#### Can easily record complex API flows and replay them as tests and stubs.

Keploy records all API calls and their downstream network interactions, including database queries, cache lookups, and third-party service calls, then stores them as replayable YAML test cases with auto-generated dependency mocks. This allows teams to reproduce multi-service distributed flows locally or in CI without connecting to live external services.

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

## ♻️ What are Keploy's multi-purpose mocks?

#### Re-Use Mocks for Testing Servers

Keploy-generated dependency mocks serve multiple testing purposes beyond regression tests. The same recorded mocks can be reused for chaos testing, end-to-end testing, integration testing, and API contract testing, eliminating the need to create and maintain separate mock data sets for each testing strategy.

Keploy generated dependency mocks can also be used as test case for the server. These tests can be used for use-cases
like chaos testing, e2e testing, integration testing, api and regression testing. 🌟

## 🌐 How does Keploy achieve code-less instrumentation?

#### Network Layer Integration makes it Light-Weight

Keploy uses eBPF (extended Berkeley Packet Filter) to attach hooks at the Linux kernel's network layer, intercepting system calls for incoming and outgoing connections. This kernel-level approach requires zero application code changes, works with any programming language or framework, and adds minimal performance overhead compared to user-space instrumentation.

Keploy uses EBPF like a secret sauce to make integration code-less, language agnostic, and oh-so-lightweight. 🍲

## 🔍 How does Keploy detect and handle noise in tests?

#### Eliminates random fields for Assertion

Keploy automatically identifies noisy fields in API responses, such as timestamps, UUIDs, and random values, by comparing multiple replays of the same request. Fields that change between runs are marked as noise and excluded from assertions, ensuring that generated test cases remain stable and do not produce false-positive failures.

Keploy identifies [noisy fields](/concepts/general-glossary.md#3-noisy-field) in the responses accurately like (
timestamps, random values) to ensure high quality tests.

As the application serves the API, Keploy re-run that API request with the captured dependency mocks.

[//]: # '<img src="/img/noise-filtration.png?raw=true" alt="Keploy noise filtration"/>'

Keploy identifies differences in API responses, marking them as random/noisy fields. 🧐✅

Hope this helps you out, if you still have any questions, reach out to us .
