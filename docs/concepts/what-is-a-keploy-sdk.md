---
id: what-is-keploy-sdk
title: What is Keploy SDK
sidebar_label: Keploy SDK
description: Keploy SDK is a language-specific library that captures and replays API calls and subsequent network interactions.
tags:
  - explanation
  - sdk
---

A Keploy SDK is a language-specific library that offers APIs to do the following:

1. Capture all the network calls like

   - API Request
   - Dependency calls
   - API Response

2. Replay the API request with captured dependency mocks to identify noisy fields. Read more about how [Keploy de-noising](/docs/keploy-explained/introduction#3-accurate-noise-detection) works.
3. Replay all the test-cases captured and mock the dependencies for the application

Comparing the expected and actual responses for an API call happens at the [Keploy Server](docs/server/introduction).

A Keploy SDK enables you to not call the external dependencies while testing APIs, eliminating the need to setup test-environment.
This allows the application to use the full power of the programming language, and isolate itself from external dependencies.
