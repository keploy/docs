---
id: cloud-installation
title: Keploy Enterprise Installation
sidebar_label: Enterprise Installation
tags:
  - explanation
  - feature guide
  - keploy enterprise
  - installation
keywords:
  - keploy enterprise
  - installation
  - API key
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

This guide provides a complete overview of **Keploy Enterprise**, including onboarding instructions, key features, and steps to get started. It is designed to help teams quickly adopt Keploy Enterprise and integrate it into their development and testing workflows.

### Requesting a Keploy Enterprise Account

To get access to Keploy Enterprise, you’ll first need an enterprise account.

#### Note: You can request one by reaching out to us [here](https://calendar.app.google/cXVaj6hbMUjvmrnt9).

---

### Getting Started with Keploy Enterprise

Once your enterprise account is set up, you can begin exploring and using the core features of Keploy Enterprise. Below are some of the key capabilities that help teams achieve reliable, scalable, and production-grade API testing.

- **Time Freezing** ❄️  
  Keploy Enterprise allows you to freeze or roll back time during every test run to the exact moment when the test case was recorded. This ensures that time-sensitive data does not expire or change, making test executions consistent and highly reliable.

- **AI-Driven Test Generation** 🧠  
  Keploy Enterprise automatically identifies edge cases in your APIs and generates test cases to uncover additional execution paths. This helps improve overall code coverage and detect issues that are often missed in manual testing.

- **Test Deduplication** 📊  
  Keploy Enterprise intelligently detects and removes duplicate or redundant test cases. This is especially useful when recording scenarios from live environments, allowing teams to retain only meaningful and unique test coverage.

- **Keploy Console** 📈  
  The Keploy Console provides a seamless experience for visualizing bugs, analyzing test results, and sharing reports across teams. It enables better collaboration and faster feedback cycles.

- **Asynchronous Processes Support** ⏱  
  Keploy v2 effectively captures and replays asynchronous workflows. In addition, support for custom user-defined behaviors and assertions is being incorporated to provide greater flexibility in testing complex systems.

- **Mock Registry** 📂  
  The Mock Registry is designed to manage large mock files by storing them in cloud storage instead of committing them to Git repositories. This helps keep repositories lightweight while ensuring efficient mock management at scale.

To begin using Keploy Enterprise, you need to install the **Keploy Enterprise Agent** and authenticate using your API key.

---

## Installation 🛠️

Follow the steps below to install and validate the Keploy Enterprise Agent:

```bash
curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
```

When recording API calls using the Enterprise Agent, you will be prompted to provide your **API key**.

An API key typically looks like this:

```
b1dNl....
```

Once the API key is successfully validated, the Keploy Enterprise Agent will begin recording API calls.
