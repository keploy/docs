---
id: integration-testing
title: "Integration Testing Definition"
sidebar_label: Integration Testing
description: "Integration testing definition: how modules, APIs, services and databases are tested together. Quick explanation plus a link to the full Keploy guide."
tags:
  - explanation
keywords:
  - integration testing
  - integration testing definition
---

Integration testing is a level of software testing that checks whether separate components of an application work correctly together. Those components can be internal modules, APIs, databases, message queues, third-party services or microservices.

It runs after unit testing and before system testing, and focuses on the interfaces, contracts and data passed between components.

<img
  src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/pyramid-cost.webp"
  alt="Testing pyramid showing integration testing between unit and end-to-end testing"
  width="667"
  height="510"
  style={{maxWidth: '100%', height: 'auto'}}
/>

## Key points

- **What it checks:** data flow and communication between components, including how failures in one component are handled by another.
- **Main approaches:** big bang, top-down (uses stubs), bottom-up (uses drivers) and sandwich (hybrid).
- **Typical bugs found:** mismatched field names or data types, broken API contracts, timeouts and bad data between services.

## Learn more

For types, a test plan template, real examples, tools and best practices, read our complete [integration testing guide](https://keploy.io/blog/community/integration-testing-a-comprehensive-guide).

Keploy generates integration tests and mocks automatically from real API traffic. See [how Keploy works](/docs/keploy-explained/introduction/).

## Related Terms

- [Unit Testing](/docs/concepts/reference/glossary/unit-testing/): precedes integration testing in the pyramid.
- [End-to-End Testing](/docs/concepts/reference/glossary/end-to-end-testing/): follows integration testing across the full system.
- [Component Testing](/docs/concepts/reference/glossary/component-testing/): tests parts before they are integrated.
- [Stubs](/docs/concepts/reference/glossary/stubs/): simulate not-yet-ready modules during integration.
- [Browse all testing terms](/docs/concepts/reference/glossary/): the full Keploy glossary.

## FAQs

### 1. What is the primary goal of integration testing?

The primary goal of integration testing is to find and fix defects that appear when different software modules are combined and interact with each other, so the integrated components work correctly as a whole.

### 2. How does Keploy simplify integration testing?

Keploy records real API calls and the responses from databases and other services, then turns them into test cases and mocks automatically. This removes most of the manual work of writing integration tests and setting up dependencies.
