---
id: what-is-keploy-ebpf
title: What is Keploy eBPF
sidebar_label: Keploy eBPF
description: Keploy eBPF is a language-agnostic library that captures and replays API calls and subsequent network interactions.
tags:
  - explanation
  - ebpf
keywords:
  - ebpf
  - Testing API
---

A Keploy eBPF is a language-agnostic library that offers APIs to do the following:

1. Capture all the network calls like

   - API Request
   - Dependency calls
   - API Response

2. Replay the API request with captured dependency mocks to identify noisy fields.
3. Replay all the test-cases captured and mock the dependencies for the application

Comparing the expected and actual responses for an API call happens at the Keploy Server.

A Keploy eBPF mocks the external dependencies while testing APIs, eliminating the need to setup test-environment. This allows the application to isolate itself from external dependencies.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
