---
id: what-are-keploy-features
title: Keploy Features?
sidebar_label: Keploy
description: Keploy platform automatically mocks application dependencies and safely replay writes. It does accurate noise detection and statistical de-duplication.
tags:
  - explanation
---

### 1. Convert API calls from anywhere to Test-Case

Keploy captures all the API calls and subsequent network traffic served by the application. You can use any existing API management tools like [Postman](https://www.postman.com/), [Hoppscotch](https://hoppscotch.io/), [Curl](https://curl.se/) to generate test-case.

<img src="/img/api-tools.png?raw=true" width="50%" alt="API Tools"/>

### 2. Automatically mock Mutations

Keploy automatically mocks network/external dependencies for **all CRUD operations** with correct responses.

Now you'll not require data dumps or mocks for dependencies like DBs, internal services, or third party services like twilio, shopify or stripe.

<img src="/img/mock-dependencies.png?raw=true" width="50%" alt="Mock Application Dependencies"/>

Please check list of currently supported dependencies in [Go](/docs/go/supported-frameworks).

With Keploy you can safely replay writes or mutations by capturing from local or other environments.

**Idempotency** guarantees are also **not required** in the application. Multiple Reads after write operations can be replicated automatically too.

### 3. Accurate Noise Detection

Keploy identifies noisy fields in the responses accurately like (timestamps, random values) to ensure high quality tests.

As the application serves the API, Keploy re-run that API request with the captured dependency mocks.

<img src="/img/noise-filtration.png?raw=true" alt="Keploy noise filtration"/>

Keploy then compares if the responses of the API requests disagree with each other.
If any of the fields of the API responses are different they are marked as random/non-deterministic fields.

### 4. Native interoperability

Keploy has native integrations with popular testing libraries like `go-test`.
Code coverage will be reported with existing and Keploy recorded test cases and can also be integrated in
existing CI pipelines easily.

<img src="/img/unit-test.gif?raw=true" alt="Keploy Integration with Testing Libraries"/>

### 5. Easy Integration Framework for new Libraries

Keploy has Instrumentation/Integration framework to easily add the new libraries/drivers within ~100 lines of code.
Please check-out the [contribution guide](/docs/devtools/sdk-contrib-guide).
