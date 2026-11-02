---
id: integration-testing
title: "Integration Testing: Definition and Key Concepts"
sidebar_label: Integration Testing
description: "Integration testing definition, key concepts like stubs, drivers and mocks, common challenges, and how Keploy generates integration tests and mocks from real traffic."
tags:
  - explanation
keywords:
  - integration testing
  - integration testing definition
  - stubs and drivers
  - integration testing with Keploy
---

**Integration testing** is a level of software testing that checks whether separate components of an application work correctly together. Those components can be internal modules, APIs, databases, message queues, third-party services or microservices.

It runs after unit testing and before system testing. Where a unit test checks one function in isolation, an integration test checks what happens at the boundaries: whether data is passed correctly, whether contracts between components are respected, and whether one component handles errors from another.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/pyramid-cost.webp" alt="Testing pyramid showing unit, integration and end-to-end tests" width="667" height="510" style={{maxWidth:'100%',height:'auto'}} />

## Key points

- **What it checks:** data flow and communication between components, including how failures in one component are handled by another.
- **When it runs:** after unit tests pass, and ideally on every pull request in CI.
- **Typical bugs found:** mismatched field names or data types, broken API contracts, wrong database writes, timeouts and bad data between services.

## Integration testing approaches at a glance

| Approach | How it works | Needs |
| --- | --- | --- |
| Big bang | All modules are combined and tested at once | Nothing extra, but failures are hard to trace |
| Top-down | Start with high-level modules, add lower ones step by step | Stubs for lower modules not yet ready |
| Bottom-up | Start with low-level modules, add higher ones step by step | Drivers to call the modules under test |
| Sandwich (hybrid) | Top-down and bottom-up at the same time | Both stubs and drivers |

![Integration testing approach types](https://keploy-devrel.s3.us-west-2.amazonaws.com/integration-testing-approach-type.png)

For a full walkthrough of each approach with examples and a test plan template, read our complete [integration testing guide](https://keploy.io/blog/community/integration-testing-a-comprehensive-guide).

## Key building blocks

- **Stubs:** simple stand-ins for modules that are called by the module under test. They return fixed responses so you can test before every dependency is built.
- **Drivers:** simple stand-ins for modules that call the module under test. They send inputs and collect outputs.
- **Mocks:** stand-ins for external services, such as a payment API or a database, that also let you check how they were called.
- **Test harness:** the setup that starts components, loads test data, runs the tests and records results, usually inside a CI pipeline.

## Common challenges of traditional integration testing

**1. Complexity of systems.** Modern applications connect many modules, APIs and outside services, each with its own configuration and behaviour. Making sure every part passes data correctly to every other part takes a lot of test cases, and unexpected interactions often only show up once everything is wired together.

**2. Dependency management.** Components depend on shared libraries, APIs, databases and third-party services, each with its own version and configuration. A change in one dependency can ripple through several others, which makes integration failures hard to trace back to their cause.

**3. Test data management.** Integration tests need realistic data that stays consistent across every connected system. Creating that data by hand is slow, and keeping it in sync between development, staging and CI environments is even harder, which leads to false failures or false passes.

**4. Environment configuration.** Test environments have to look enough like production to be meaningful, while staying isolated enough to be safe. Small differences in configuration, secrets or network setup between environments are a common reason tests pass locally and fail in staging.

**5. Timing and coordination.** When several teams build different components, they are rarely ready at the same time. Integration testing then waits on the slowest team, and shared test environments get out of sync as teams deploy different versions.

**6. Third-party integrations.** External APIs are outside your control. They can change without notice, apply rate limits, require authentication that is awkward to set up in tests, or simply be unavailable, which makes tests that call them slow and unreliable.

**7. Regression testing.** Every new feature or fix can break an integration that used to work. Keeping a regression suite that covers all integration points up to date takes continuous effort, and running it by hand quickly becomes too slow.

**8. Scalability and performance.** Integrations that work for one request can fail under real load. Testing how connected components behave with high traffic, large data volumes and many concurrent calls needs extra tooling and planning beyond functional integration tests.

## How Keploy handles integration testing

Keploy takes a different route from hand-written integration tests. It records real API calls to your application, together with the responses from the databases and downstream services behind them, and turns them into test cases and mocks.

| Task | Traditional approach | With Keploy |
| --- | --- | --- |
| Writing test cases | Each request and assertion is scripted by hand | Test cases are generated from recorded API traffic |
| Stubs and mocks | Written and maintained by hand | Generated automatically from recorded dependency calls |
| Test data | Built and refreshed manually | Comes from real requests and responses |
| Environment setup | Real dependencies must be running for every test run | Recorded mocks replace dependencies during replay |
| Regression checks | Suite grows slowly and needs constant updates | Recorded tests are replayed on every change |

A typical flow looks like this:

```bash
# 1. Record real traffic while you use the app
keploy record -c "node src/app.js"

# 2. Replay the recordings as integration tests
keploy test -c "node src/app.js" --delay 10
```

During replay, Keploy serves the recorded database and service responses, so the tests check how your application integrates with its dependencies without those dependencies having to be available. See [how Keploy works](/docs/keploy-explained/introduction/) for setup steps for your language and framework.

## Related Terms

- [Unit Testing](/docs/concepts/reference/glossary/unit-testing/): precedes integration testing in the pyramid.
- [End-to-End Testing](/docs/concepts/reference/glossary/end-to-end-testing/): follows integration testing across the full system.
- [Component Testing](/docs/concepts/reference/glossary/component-testing/): tests parts before they are integrated.
- [Stubs](/docs/concepts/reference/glossary/stubs/): simulate not-yet-ready modules during integration.
- [Browse all testing terms](/docs/concepts/reference/glossary/): the full Keploy glossary.

## FAQs

### What is the primary goal of integration testing?

To find and fix defects that appear when different software modules are combined and interact with each other, so the integrated components work correctly as a whole.

### What is the difference between unit testing and integration testing?

Unit testing checks one function or class in isolation, with its dependencies mocked. Integration testing checks that several components work together, using real or recorded dependencies.

### What are stubs and drivers in integration testing?

A stub stands in for a lower-level module that the module under test calls. A driver stands in for a higher-level module that calls the module under test. Stubs are used in top-down testing and drivers in bottom-up testing.

### How does Keploy simplify integration testing?

Keploy records real API calls and the responses from databases and other services, then turns them into test cases and mocks automatically. This removes most of the manual work of writing integration tests, building mocks and preparing test data.

### Can integration tests run in CI/CD?

Yes. Integration tests should run automatically on every pull request. Keploy tests can be replayed in CI pipelines such as [GitHub Actions](/docs/ci-cd/github/), [GitLab CI](/docs/ci-cd/gitlab/) and [Jenkins](/docs/ci-cd/jenkins/).
