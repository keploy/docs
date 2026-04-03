---
id: what-is-keploy-ebpf
title: What is Keploy eBPF
sidebar_label: Keploy eBPF
description: eBPF (Extended Berkeley Packet Filter) is a Linux kernel technology that Keploy uses to capture socket-level network I/O via kernel hooks with near-zero overhead — enabling production behavior replay, dependency virtualization, legacy application testing, and infrastructure mocking without code changes.
tags:
  - explanation
  - ebpf
keywords:
  - eBPF-based testing
  - eBPF
  - Testing API
  - production behavior replay
  - dependency virtualization
  - legacy application testing
  - infrastructure mocking
  - kernel-level traffic capture
---

eBPF (Extended Berkeley Packet Filter) is a Linux kernel technology that Keploy uses to intercept network packets at the socket level with near-zero overhead. By injecting eBPF hooks, Keploy captures all incoming API requests and outgoing dependency calls — database queries, external API calls, and message queue interactions — without modifying application code or requiring language-specific SDK installation. This kernel-level capture enables production behavior replay, dependency virtualization, legacy application testing for systems never designed for testability, and infrastructure mocking that replaces heavy staging environments with production-like sandboxes.

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
