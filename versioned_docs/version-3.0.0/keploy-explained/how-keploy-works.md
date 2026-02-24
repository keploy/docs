---
id: how-keploy-works
title: How Keploy Works?
sidebar_label: Architecture
tags:
  - explanation
  - replay-test-case
  - replay-guide
  - record-guide
  - record-test-case
---

## How does Keploy work?

Keploy uses eBPF hooks at the Linux kernel level to intercept incoming and outgoing network traffic from an application without requiring any code changes. In record mode, it captures API calls and their downstream dependency interactions, storing them as YAML test cases and stubs. In test mode, Keploy replays those recorded requests and auto-mocks all external dependencies, enabling deterministic regression testing.

### 🎯 Goals

- 🛠 **Automatic instrumentation:** No code changes required.
- 📡 **Automatic traffic capture:** Both incoming and outgoing traffic is captured and manipulated.
- ✍️ **Readable and Editable:** Tests and stubs are easy to understand and modify.
- 🔒 **TLS Support:** Secure connections in HTTPS or databases are supported.
- 🔄 **Request Matching:** Mocking responses during testing by matching requests.

## What is Keploy's high-level architecture?

Keploy's architecture consists of three core components: an eBPF hooks loader that intercepts ingress and egress network traffic at the kernel level, a transparent network proxy that records or mocks outgoing calls to databases and external services, and an API server that manages test execution and resource lifecycle. This design enables zero-code instrumentation across any language or framework.

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

## How does Keploy record and replay tests?

Keploy operates in two modes. In record mode, eBPF hooks capture all incoming HTTP requests and redirect outgoing TCP/UDP traffic through a proxy that saves interactions as YAML files. In test mode, Keploy reads those YAML files, replays the recorded HTTP requests against the application, and mocks all outgoing dependency calls to prevent side effects.

Consider an application server serving HTTP APIs for clients like web/mobile apps, postman, or curl, and depending on a database and another API.

- **Record Mode:** Keploy injects eBPF hooks to capture incoming HTTP traffic and redirects outgoing TCP/UDP traffic to its proxy server. The proxy server captures packets asynchronously and saves them in YAML files.
- **Test Mode:** Keploy reads the YAML files for test cases and stubs/mocks. It starts the application, sends recorded HTTP test cases, and mocks responses for outgoing calls. This ensures no side effects due to non-idempotency.

Hope this helps you out, if you still have any questions, reach out to us .
