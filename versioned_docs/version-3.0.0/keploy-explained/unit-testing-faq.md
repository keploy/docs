---
id: unit-testing-faq
title: Frequently Asked Questions
sidebar_label: FAQs
tags:
  - explanation
  - faq
---

# Got Questions? We’ve Got Answers! 🚀

Everything you want to know about Unit testing with Keploy—straightforward and no fluff.

### 1. What is Keploy's Unit Test Generator (UTG)?

Keploy's UTG automates the creation of unit tests based on code semantics, enhancing test coverage and reliability.

### 2. Does Keploy send your private data to any cloud server for test generation?

No, Keploy does not send any user code to remote systems, except when using the unit test generation feature. When using the UT gen feature, only the source code and the unit test code will be sent to the Large Language Model (LLM) you are using. By default, Keploy uses - litellm to support vast number of LLM backends. Yes, if your organization has its own LLM(a private one), you can use it with Keploy. This ensures that data is not sent to any external systems.

### 3. How does Keploy contribute to improving unit test coverage?

By providing a zero code platform for automated testing, Keploy empowers developers to scale up their unit test coverage without extensive coding knowledge. This integration enhances testing reports, ultimately boosting confidence in the product's quality.

### 4. Is Keploy cost-effective for automated unit testing?

Yes, Keploy optimizes costs by automating repetitive testing tasks and improving overall test efficiency.

### 5. How does Keploy generate coverage reports?

Keploy generates detailed Cobertura format reports, offering insights into test effectiveness and code quality.

### 6. Can Keploy handle large codebases efficiently?

Yes, Keploy is designed to handle large codebases efficiently, though processing time may vary based on project size and complexity.

### 7. Which method should I choose for generating unit tests?

- **PR Agent**: Best for teams using pull request workflows who want automatic test generation
- **VS Code Extension**: Ideal for individual developers who prefer IDE integration

### 8. Do I need an API key to use these two methods?

The API key is primarily required for the Command Line method. The PR Agent and VS Code Extension may have different authentication mechanisms depending on your setup.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
