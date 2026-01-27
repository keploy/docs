---
id: unit-test-architecture
title: Behind the Scenes
sidebar_label: Behind the Scenes
description: How Keploy's AI-powered unit testing architecture works.
tags:
  - unit testing
  - architecture
  - AI
  - workflow
---

# 🏗️ Unit Testing Architecture

Unit testing at scale isn’t just about writing individual test cases—it's about building a workflow that can generate, filter, and review tests with minimal manual effort.  
Here’s how Keploy leverages AI (LLM) to automate and streamline the unit testing process:

![Keploy Unit Testing Architecture](https://res.cloudinary.com/dfhtr1rwo/image/upload/v1748780535/keploy-utg-arch_rv2rhz.png)

> _This diagram shows the end-to-end workflow of Keploy’s AI-powered unit testing architecture._

---

## How it Works (at a Glance)

- **CI Issues as Input:** The process starts with issues detected by your CI pipeline.
- **LLM Generates Faults:** The system uses AI to create possible faults based on your code and current issues.
- **Build & Test:** It checks if these faults build and whether they pass or fail.
- **Filter & Deduplicate:** Syntactically identical or equivalent faults are removed automatically.
- **Test Generation:** For unique faults, the LLM creates tests specifically designed to catch those faults.
- **Automated Review:** Tests are auto-validated—discarding unstable or irrelevant ones.
- **Diff Summary & Test Plan:** The final tests and summaries are generated automatically, then passed to your PR Agent for CI review.

---

## In Short

Keploy’s AI-driven architecture turns CI feedback and your codebase into a robust, scalable set of unit tests—saving you hours and catching regressions before they hit production.
