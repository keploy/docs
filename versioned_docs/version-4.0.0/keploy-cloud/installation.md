---
id: cloud-installation
title: Get Started on the Enterprise Plan
sidebar_label: Enterprise Plan
description: "Install Keploy and sign in — onboarding guide, an overview of the Enterprise plan features, and steps to integrate API testing into your workflow."
tags:
  - explanation
  - feature guide
  - installation
keywords:
  - installation
  - API key
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

This guide covers installing **Keploy**, the key features available on the Enterprise plan, and steps to get started. It is designed to help teams quickly adopt Keploy and integrate it into their development and testing workflows.

### Requesting the Enterprise Plan

To use the features on this page, your Keploy account needs to be on the Enterprise plan.

#### Note: You can request it by reaching out to us [here](https://calendar.app.google/cXVaj6hbMUjvmrnt9).

---

### Getting Started

Once your account is on the Enterprise plan, you can begin exploring and using these features of Keploy. Below are some of the key capabilities that help teams achieve reliable, scalable, and production-grade API testing.

- **Time Freezing** ❄️  
  Keploy allows you to freeze or roll back time during every test run to the exact moment when the test case was recorded. This ensures that time-sensitive data does not expire or change, making test executions consistent and highly reliable.

- **AI-Driven Test Generation** 🧠  
  Keploy automatically identifies edge cases in your APIs and generates test cases to uncover additional execution paths. This helps improve overall code coverage and detect issues that are often missed in manual testing.

- **Test Deduplication** 📊  
  Keploy intelligently detects and removes duplicate or redundant test cases. This is especially useful when recording scenarios from live environments, allowing teams to retain only meaningful and unique test coverage.

- **Keploy Console** 📈  
  The Keploy Console provides a seamless experience for visualizing bugs, analyzing test results, and sharing reports across teams. It enables better collaboration and faster feedback cycles.

- **Asynchronous Processes Support** ⏱  
  Keploy v2 effectively captures and replays asynchronous workflows. In addition, support for custom user-defined behaviors and assertions is being incorporated to provide greater flexibility in testing complex systems.

- **Mock Registry** 📂  
  The Mock Registry is designed to manage large mock files by storing them in cloud storage instead of committing them to Git repositories. This helps keep repositories lightweight while ensuring efficient mock management at scale.

To begin, install **Keploy** and sign in with your Keploy account.

---

## Installation 🛠️

On Linux or macOS, install Keploy with:

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

On Windows (x86-64), run `keploy.exe` natively from PowerShell — no Administrator needed. See [Run Keploy natively on Windows](/docs/installation/windows-installation/#option-1-run-keploy-natively). For platform details, see the [Linux](/docs/installation/linux-installation/), [macOS](/docs/installation/macos-installation/) and [Windows](/docs/installation/windows-installation/) installation guides.

The first time you run `keploy record` or `keploy test`, Keploy signs you in: it opens your browser at [app.keploy.io](https://app.keploy.io). Where no browser is available, run with `--manual-login` and paste your **API key** when prompted; in CI, set the `KEPLOY_API_KEY` environment variable instead.

An API key typically looks like this:

```
b1dNl....
```

Once you are signed in, Keploy begins recording API calls.

## Related

- [Kubernetes Setup](/docs/keploy-cloud/kubernetes/) — connect a cluster for live record and replay.
- [Keploy Cloud Application Settings Guide](/docs/keploy-cloud/application-settings/) — add your first application.
- [Keploy Console](/docs/keploy-cloud/keploy-console/) — visualize and edit test results.
- [Time Freezing](/docs/keploy-cloud/time-freezing/) — keep time-sensitive tests reliable.
