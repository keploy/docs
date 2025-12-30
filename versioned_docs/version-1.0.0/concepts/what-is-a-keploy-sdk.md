---
id: what-is-keploy-sdk
title: What is Keploy SDK (v1.0.0)
sidebar_label: Keploy SDK
description: Keploy SDK is a language-specific library that captures and replays API calls and subsequent network interactions.
tags:
  - explanation
  - sdk
keywords:
  - SDK
  - Testing API
---

A Keploy SDK is a language-specific library that offers APIs to do the following:

1. Capture all the network calls like

   - API Request
   - Dependency calls
   - API Response

2. Replay the API request with captured dependency mocks to identify noisy fields.
3. Replay all the test-cases captured and mock the dependencies for the application

Comparing the expected and actual responses for an API call happens at the [Keploy Server](/docs/1.0.0/go/installation).

A Keploy SDK mocks the external dependencies while testing APIs, eliminating the need to setup test-environment.
This allows the application to isolate itself from external dependencies.
