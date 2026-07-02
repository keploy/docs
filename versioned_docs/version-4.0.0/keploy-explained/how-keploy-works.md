---
id: how-keploy-works
title: How Keploy Works?
sidebar_label: Architecture
description: Keploy uses eBPF hooks in the Linux kernel to capture real user traffic in Record mode and replay it in production-like sandboxed environments in Test mode — enabling production behavior replay, dependency virtualization, and continuous validation with automatic regression detection.
tags:
  - explanation
  - replay-test-case
  - replay-guide
  - record-guide
  - record-test-case
keywords:
  - eBPF-based testing
  - production behavior replay
  - dependency virtualization
  - continuous validation
  - production sandbox
  - infrastructure mocking
  - migration regression testing
  - legacy application testing
---

Keploy generates tests by using eBPF hooks in the Linux kernel to capture socket-level application traffic. In Record mode, it captures every incoming HTTP request and outgoing dependency call — database queries, API calls, message queue interactions — saving them as YAML test cases. In Test mode, it replays those requests in a sandboxed environment that closely mimics production, with all dependencies automatically virtualized and responses compared to detect regressions. This production behavior replay enables continuous validation, migration regression testing, and legacy application testing without code changes.

## 🌟 Keploy V2 Architecture 🌟

### 🎯 Goals

- 🛠 **Automatic instrumentation:** No code changes required.
- 📡 **Automatic traffic capture:** Both incoming and outgoing traffic is captured and manipulated.
- ✍️ **Readable and Editable:** Tests and stubs are easy to understand and modify.
- 🔒 **TLS Support:** Secure connections in HTTPS or databases are supported.
- 🔄 **Request Matching:** Mocking responses during testing by matching requests.

## 🏗 High-level architecture

Keploy uses eBPF to instrument applications without code changes. Key components include:

- **eBPF hooks loader**
- **Network Proxy**
- **API server**

<img src="/docs/img/oss/keploy-arch.png?raw=true" alt="Keploy Architecture" loading="lazy" decoding="async"/>

### 🪝 eBPF hooks loader

The eBPF hooks loader handles the Ingress and Egress Interceptor logic.

- **Ingress Interceptor:** Captures incoming HTTP calls and stores them in YAML format. It intercepts system calls related to incoming HTTP request connections.
- **Egress Interceptor:** Forwards TCP and certain UDP connections to the proxy for interception. Applications are unaware of this transparent process.

### 🌐 Network Proxy

The Network Proxy acts as a transparent proxy for recording or mocking outgoing network calls. It processes TCP streams, matching the protocol and using the appropriate [integration packages](https://github.com/keploy/keploy/tree/main/pkg/core/proxy/integrations).

- **Readability:** To maintain readability in tests and mocks, Keploy converts binary streams from TCP connections into well-structured YAMLs, covering outgoing calls like databases, caches, and API calls
- **Support for Unknown Dependencies:** Keploy can handle unknown dependencies by recording binary data as base64 in YAML and using fuzzy matching to correlate incoming requests during testing and mocking.
- **TLS Interception:** For TLS-based connections like HTTPS, Keploy intercepts traffic by inserting a fake certificate chain between the application and itself. The specific method varies with the language and runtime.

### 🖥 API server

The API server manages commands for start/stop and resource management (e.g., testicles, stubs). It's evolving to enable full agent mode, beyond just CLI.

## 🧪 Example

Consider an application server serving HTTP APIs for clients like web/mobile apps, postman, or curl, and depending on a database and another API.

- **Record Mode:** Keploy injects eBPF hooks to capture incoming HTTP traffic and redirects outgoing TCP/UDP traffic to its proxy server. The proxy server captures packets asynchronously and saves them in YAML files.
- **Test Mode:** Keploy reads the YAML files for test cases and stubs/mocks. It starts the application, sends recorded HTTP test cases, and mocks responses for outgoing calls. This ensures no side effects due to non-idempotency.

Hope this helps you out, if you still have any questions, reach out to us .
