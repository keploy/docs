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

Keploy captures all the API calls and subsequent network traffic served by the application. You can use any existing API management tools like Postman, curl to generate test-case.

<video autoPlay loop muted playsInline width="800" height="582" style={{width:'80%',height:'auto'}} aria-label="API Tools" poster="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/record-api-poster.webp"><source src="/docs/img/record-api.mp4" type="video/mp4" /></video>

### 2. Automatically mock Mutations

Keploy automatically [mocks](/concepts/general-glossary.md#1-api-data-mocking) network/external dependencies for **all CRUD operations** with correct responses.

Data dumps, stubs or mocks for dependencies like DBs, internal services, or third party services like twilio, shopify or stripe are **not required**.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/mock-dependencies.webp" width="50%" alt="Mock Application Dependencies"/>

Please check list of currently supported dependencies in [Go, Java and Node](https://keploy.io/#integrations).

Keploy can safely replay writes or mutations by capturing from local or other environments and replaying without API chaining.

<video autoPlay loop muted playsInline width="800" height="348" style={{width:'80%',height:'auto'}} aria-label="API Tools" poster="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/gif/record-replay-poster.webp"><source src="/docs/gif/record-replay.mp4" type="video/mp4" /></video>

[Idempotency](/concepts/general-glossary.md#2-idempotency) guarantees are also **not required** in the application. Multiple Reads after write operations can be replicated automatically too.

### 3. Accurate Noise Detection

Keploy identifies [noisy fields](/concepts/general-glossary.md#3-noisy-field) in the responses accurately like (timestamps, random values) to ensure high quality tests.

As the application serves the API, Keploy re-run that API request with the captured dependency mocks.

[//]: # '<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/noise-filtration.webp" alt="Keploy noise filtration" width="2162" height="686" />'

Keploy then compares if the responses of the API requests disagree with each other.
If any of the fields of the API responses are different they are marked as random/non-deterministic fields.

### 4. Native interoperability

Keploy has [native integrations](/concepts/general-glossary.md#4-interoperability) with popular testing libraries like `go-test`, `jUnit`, `jest`.
Code coverage will be reported with existing and Keploy recorded test cases and can also be integrated in
existing CI pipelines easily.

<video autoPlay loop muted playsInline width="800" height="450" style={{maxWidth:'100%',height:'auto'}} aria-label="Keploy Integration with Testing Libraries" poster="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/gif/replay-tc-poster.webp"><source src="/docs/gif/replay-tc.mp4" type="video/mp4" /></video>

### 5. Easy Integration Framework for new Libraries

Keploy has Instrumentation/Integration framework to easily add the new libraries/drivers within ~100 lines of code.
Please check-out the [contribution guide](versioned_docs\version-1.0.0\devtools\sdk-contrib-guide.md).
