---
id: what-are-keploy-features
title: Understanding Features of Keploy (v1.0.0)
sidebar_label: Keploy Features
description: Learn about the core features of Keploy, including automatic mocking of application dependencies, secure write replay, precise noise detection, and statistical data de-duplication.
tags:
  - explanation
keywords:
  - test cases
  - data dumps
---

### 1. Convert API calls from anywhere to Test-Case

Keploy captures all the API calls and subsequent network traffic served by the application. You can use any existing API management tools like [Postman](https://www.postman.com/), [Curl](https://curl.se/) to generate test-case.

<img src="/docs/img/record-api.gif?raw=true" width="80%" alt="API Tools"/>

### 2. Automatically mock Mutations

Keploy automatically [mocks](/concepts/general-glossary.md#1-api-data-mocking) network/external dependencies for **all CRUD operations** with correct responses.

Data dumps, stubs or mocks for dependencies like DBs, internal services, or third party services like twilio, shopify or stripe are **not required**.

<img src="/docs/img/mock-dependencies.png?raw=true" width="50%" alt="Mock Application Dependencies"/>

Please check list of currently supported dependencies in [Go, Java and Node](https://keploy.io/#integrations).

Keploy can safely replay writes or mutations by capturing from local or other environments and replaying without API chaining.

<img src="/docs/gif/record-replay.gif?raw=true" width="80%" alt="API Tools"/>

[Idempotency](/concepts/general-glossary.md#2-idempotency) guarantees are also **not required** in the application. Multiple Reads after write operations can be replicated automatically too.

### 3. Accurate Noise Detection

Keploy identifies [noisy fields](/concepts/general-glossary.md#3-noisy-field) in the responses accurately like (timestamps, random values) to ensure high quality tests.

As the application serves the API, Keploy re-run that API request with the captured dependency mocks.

[//]: # '<img src="/docs/img/noise-filtration.png?raw=true" alt="Keploy noise filtration"/>'

Keploy then compares if the responses of the API requests disagree with each other.
If any of the fields of the API responses are different they are marked as random/non-deterministic fields.

### 4. Native interoperability

Keploy has [native integrations](/concepts/general-glossary.md#4-interoperability) with popular testing libraries like `go-test`, `jUnit`, `jest`.
Code coverage will be reported with existing and Keploy recorded test cases and can also be integrated in
existing CI pipelines easily.

<img src="/docs/gif/replay-tc.gif?raw=true" alt="Keploy Integration with Testing Libraries"/>

### 5. Easy Integration Framework for new Libraries

Keploy has Instrumentation/Integration framework to easily add the new libraries/drivers within ~100 lines of code.
Please check-out the [contribution guide](versioned_docs\version-1.0.0\devtools\sdk-contrib-guide.md).
