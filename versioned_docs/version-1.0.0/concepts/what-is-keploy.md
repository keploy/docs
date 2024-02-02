---
id: what-is-keploy
title: What is Keploy? (v1.0.0)
sidebar_label: What is Keploy?
description: Keploy is e2e testing toolkit for developers that generates tests from API calls.
tags:
  - explanation
keywords:
  - Junit
---

Keploy is functional testing toolkit for developers.
It **generates E2E tests for APIs (KTests)** along with **mocks or stubs(KMocks)** by
recording real API calls.

KTests can be imported as mocks for consumers and vice-versa.

![Test Case Generation](/gif/record-tc.gif)

Merge KTests with unit testing libraries(like Go-Test, JUnit..) to **track combined test-coverage**.

KMocks can also be referenced in existing tests or use anywhere (including any testing framework).
KMocks can also be used as tests for the server.
