---
id: coverage
title: Check coverage
sidebar_label: Check coverage
description: See how much of your API your recorded tests reach with schema coverage, and per-test-set code coverage for Java apps, so you know what to record next.
tags:
  - K8s
  - developer
  - coverage
  - schema
keywords:
  - keploy schema coverage
  - api test coverage
  - openapi schema
  - code coverage
  - dynamic deduplication
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

Coverage shows how much of your API your recorded tests reach, so you know what to record next.

## Check schema coverage

Keploy builds an OpenAPI schema of your API from the test cases you record, and keeps one per release of your app. Schema coverage shows how much of that schema your test cases reach.

1. Open **Recordings**, with your app selected. The **Schema Coverage** badge shows the share of the schema's fields, across all releases, that your test cases cover.

   ![Recordings page with the Schema Coverage badge above the release tree](/img/developer/recordings-overview.webp)

2. Click it to open the **Test Coverage** page. You can also open it from the sidebar.
3. The page shows the coverage percentage, covered and total lines, and how many endpoints your tests hit. Each part of the schema is marked **Covered**, **Partial** or **Uncovered**. The **tag** selector starts at **all releases (union)**. Pick one release to see only its schema. Use the **OpenAPI**, **GraphQL** and **gRPC** tabs for each kind of API.

   ![Test Coverage page showing the OpenAPI schema with coverage per field](/img/developer/coverage-schema-page.webp)

To raise coverage, [record](/docs/developer/record/) traffic that reaches the **Uncovered** parts.

## Check code coverage (Java)

Code coverage is available only for Java apps that record with **Dynamic deduplication** turned on (Record dialog → **Record config**).

When the recording ends, Keploy works out code coverage for each test set. On the **Recordings** page, select a test set to see the percentage of **lines covered** and **branches covered**. It shows **Calculating…** until the numbers are ready.

If the app's Java version is newer than Keploy supports, you see **No code coverage** with the detected and supported versions.

For apps that don't use dynamic deduplication, the dashboard doesn't show code coverage. To measure it locally with the Keploy CLI, see [Test Coverage Integration](/docs/quickstart/code-coverage/).

## Related

- [Dynamic Deduplication](/docs/keploy-cloud/deduplication/): how dynamic deduplication works and how to set it up for Java.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/): schema generation per release, and the schema-coverage endpoints.
