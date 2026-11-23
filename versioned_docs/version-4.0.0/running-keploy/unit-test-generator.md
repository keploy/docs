---
id: unit-test-generator
title: Keploy Unit Test Generator
sidebar_label: Introduction
description: This section documents usecase of Keploy's Unit Test Generator
tags:
  - utg
  - unit test generator
  - generate unit test
  - unit test
keywords:
  - unit test generator
  - unit testing
  - unit tests
  - documentation
  - testcases
  - AI testing
  - Gemini
  - OpenAI
---

Keploy's Unit Test Generator (UTG) simplifies testing by generating high-quality, maintainable unit tests with minimal manual effort. Inspired by Meta’s LLM research, it uses code semantics and Large Language Models (LLMs) to produce meaningful test cases.

To fit into modern development workflows, Keploy generates unit tests on your pull requests.

Keploy's UTG aims to:

- **Automate unit test generation:** Reduce manual effort by generating tests automatically.
- **Improve edge case coverage:** Catch complex scenarios often missed manually.
- **Boost test coverage:** Make comprehensive coverage achievable as your codebase grows.

### Try the Unit Test Generator

Install the [PR Agent](/docs/running-keploy/utg-pr-agent/), a GitHub App, on your repository to automatically generate tests when you create a pull request.

## Related

- [Unit Test Architecture](/docs/running-keploy/unit-test-architecture/) — how the generator is structured.
- [Keploy's PR Agent](/docs/running-keploy/utg-pr-agent/) — generate unit tests on pull requests.
