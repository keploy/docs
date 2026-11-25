---
id: what-is-keploy
title: What is Keploy?
sidebar_label: Introduction to Keploy
description: Keploy is an AI-powered testing agent and sandboxing platform that captures real user traffic at the network layer to automatically generate test cases, dependency mocks (service virtualization), and production-like sandboxes — requiring zero code changes. It keeps testing aligned with AI-driven code velocity.
tags:
  - explanation
  - introduction
  - features
  - what is keploy
keywords:
  - API test generation
  - eBPF-based testing
  - dependency virtualization
  - service virtualization
  - production sandbox
  - legacy application testing
  - migration regression testing
  - continuous validation
  - infrastructure mocking
  - flaky test elimination
  - AI-driven testing
  - production behavior replay
  - release confidence
  - Junit
  - PyTest
  - GoTest
  - Jest
  - Backend Testing
  - API Tests
  - AI Generated Tests
---

Keploy is an AI-powered testing agent and sandboxing platform that automatically generates test cases, dependency mocks, and [production-like sandboxes](https://keploy.io/blog/community/sandbox-testing) from real user traffic. It records live API calls at the socket level — with eBPF in the kernel on Linux, and in user space on macOS and Windows — and replays them as deterministic tests, requiring zero code changes and scaling test coverage with AI-driven code velocity. On Linux, and with Docker, it works with any programming language or framework; natively on macOS and Windows it covers Go, Node.js, Python and Java apps — see [Installing Keploy](/docs/server/installation/) for what each platform supports. Keploy enables production behavior replay, dependency virtualization ([service virtualization](https://keploy.io/blog/community/service-virtualization)) for databases and external APIs, legacy application testing without code changes, and migration regression testing against production baselines.

Keploy creates backend **API tests with built-in-mocks** or stubs **by recording your application network calls** making
your testing process not only faster than unit tests but also incredibly efficient.

<img src="/docs/gif/record-tc.gif" alt="Test Case Generator" width="80%" height="150" />

Keploy sits between your application and the network: it captures the API calls your app serves and the calls your app makes to its dependencies, then replays them.

### Step 1: Record API calls as test cases

Start your application through `keploy record`. Each request your app serves is saved as a test case, and each call your app makes to answer it (a database query, an HTTP call to another service) is saved as a mock. Both are YAML files in your project's `keploy/` folder:

- test cases in `keploy/test-set-0/tests/`
- mocks in `keploy/test-set-0/mocks.yaml`

<div style={{backgroundColor:'white', padding:'10px', display:'inline-block', borderRadius:'8px'}}>
  <video autoPlay loop muted playsInline width="562" height="356" style={{maxWidth:'100%',height:'auto'}} aria-label="Test Case Generator" poster="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/gif/how-keploy-works-poster.webp"><source src="/docs/gif/how-keploy-works.mp4" type="video/mp4" /></video>
</div>

### Step 2: Replay the test cases

After you change your code, run `keploy test`. Keploy:

- starts your app and waits for it to be ready (`--delay`, 5 seconds by default),
- sends each recorded request to it,
- answers your app's calls to databases and other services from the recorded mocks, so no database or other service needs to be running,
- compares each response with the recorded one, ignoring fields that change on every run, such as timestamps and generated IDs.

It prints a summary in the terminal and writes a report to `keploy/reports/`. When you're signed in, it also uploads the report and prints a link to it on [app.keploy.io](https://app.keploy.io).

You can run Keploy on your machine or in your CI pipeline.

> **Note:** You can record from any environment that has your app's dependencies set up. Start with a low-traffic environment; for high-traffic environments, see [Deduplication](/docs/keploy-cloud/deduplication/).

For help, ask in the [Keploy Slack](https://keploy.io/slack) or see the [Troubleshooting guide](/docs/keploy-explained/common-errors/).
