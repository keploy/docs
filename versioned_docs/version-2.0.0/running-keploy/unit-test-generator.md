---
id: unit-test-generator
title: Keploy Unit Test Generator
sidebar_label: Unit Test Generator
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

To fit into modern development workflows, Keploy now supports multiple methods for unit test generation - ranging from automated pull request comments to a one-click VS Code extension and a flexible CLI tool.

Keploy's UTG aims to:

- **Automate unit test generation:** Reduce manual effort by generating tests automatically.
- **Improve edge case coverage:** Catch complex scenarios often missed manually.
- **Boost test coverage:** Make comprehensive coverage achievable as your codebase grows.

### Try the Unit Test Generator in two ways:

1. **UTG PR Agent**: Install a GitHub App on your repo to automatically generate tests when you create a pull request.
2. **Keploy UTG VS Code Extension**: Generate test files with a single click directly from your IDE.

<img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1748347544/ChatGPT_Image_May_27_2025_at_05_32_27_PM_zghj7g.png" width="100%" />

<!-- banner image goes here  -->

# Three tools to Generate Unit Tests

## 1. Keploy PR Agent - Effortless Unit Testing for Every Change

Writing and maintaining unit tests for every small code change can be a time-consuming and repetitive task. In fast-paced development environments, ensuring thorough test coverage often takes a backseat. That’s where the **Keploy PR Agent** steps in.

The **PR Agent** automates unit test generation directly from your pull requests - no manual intervention required. It understands your code changes, generates high-quality tests, and comments them directly on your PR with a single click. No more switching contexts or copy-pasting boilerplate code - Keploy handles it all.

### How It Works - Step-by-Step Setup Guide

Follow the steps below to get started with the Keploy PR Agent on your GitHub repository:

### 1. Install the Keploy GitHub App

- Visit [github.com/apps/keploy](https://github.com/marketplace/keploy)
- Click on **"Install/Configure"**.
  <!-- the configuration/installation screenshot goes here -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_2.48.30_PM_blsk3h.png" width="100%" />
- Choose:
  - A **specific repository** where you want to enable the PR agent, or
  - **All repositories** if you want the functionality across your GitHub organization.
- Authorize the app to complete the installation.
  <!-- one small screenshot for the configuration in repositories goes here -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_2.50.17_PM_okdxc8.png" width="100%" />

### 2. Make a Code Change and Open a Pull Request

Once the app is installed:

- Make any code changes in your repository.
- Push your changes and **create a pull request (PR)** as usual.
- The **Keploy PR Agent** will automatically detect the changes and leave a comment on the PR.
  <!-- one image of the koploy pr agent making a comment on the code will be added here  -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914669/Screenshot_2025-05-22_at_3.21.05_PM_uzeewc.png" width="100%" />

### 3. Trigger Unit Test Generation

In the PR comment left by Keploy:

- Click on the link (e.g., `https://api.keploy.io/github/trigger/...`).
- You will be redirected to the Keploy service, where the unit test generation process begins.
- The PR Agent uses code semantics and the power of LLMs to understand your code changes and generate meaningful unit tests.
  <!-- one screenshot of the api server generating test cases will go here -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_3.23.40_PM_emluya.png" width="100%" />

### 4. View the Generated Tests and Summary

Once the process is complete:

- Click **"Go back to the PR"**.
- The PR comment will be updated with:
  - All the **unit test files** generated for your recent changes.
  - A **test summary** presented in a **clean tabular format** showing: - File names - Number of test cases - Coverage details - Edge cases handled (if any)
    <!-- one image with the tabular format comment with the test summary will be added here -->
    <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914671/Screenshot_2025-05-22_at_3.30.35_PM_mubqr5.png" width="100%" />
    You can review, modify, or directly merge the PR with complete confidence that your changes are well-tested.
    With Keploy PR Agent, testing is no longer a bottleneck - it’s built right into your workflow.

## 🔌 Keploy VS Code Extension - One-Click Unit Test Generation Inside Your IDE

Writing unit tests shouldn't be a chore and with the Keploy VS Code Extension, it isn’t.
Used by over **500K+ developers** as of **March 22nd, 2025**, the Keploy VS Code extension empowers developers to generate high-quality, meaningful unit tests with **a single click** - without ever leaving their IDE. Whether you're refactoring code, adding new features, or onboarding onto a new repo, Keploy simplifies your testing workflow right inside VS Code.

### Setup Guide - Step by Step

### 1. Install the Extension

You can install the Keploy extension using either of the following methods:

**Method 1: From VS Code Marketplace**

- Open the **Extensions** tab in VS Code.
- Search for **"Keploy"**.
- Click **Install**.

<!-- vs code extension search screenshot -->
<img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_4.50.03_PM_o97dfi.png" width="100%" />

**Method 2: Direct Link / VS Code Marketplace**

- Visit the [Keploy Extension on VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Keploy.keployio).
- Click **Install** and follow the prompts to open it in VS Code.

<!-- vs code marketplace screenshot -->
<img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_4.51.22_PM_qytvhv.png" width="100%" />

### 2. Generate Unit Tests in a Single Click

Once the extension is installed:

1. **Look for the Keploy icon** in the **Activity Bar** (left-hand sidebar) of VS Code.
2. Click the **Keploy icon** to open the extension UI.
3. You’ll see a simple interface with a button labeled **“Generate Unit Tests.”**
4. Click the button - that’s it!

<!-- one design asset image goes here -->
<img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747915233/Group_33518_1_usvh0v.png" width="100%" />

Keploy will analyze your codebase and automatically generate all relevant unit test files, covering:

- Core logic
- Edge cases
- Boundary conditions
- And more - all with meaningful assertions and clean test structure.

## What Happens Next?

After clicking **Generate Unit Tests**, Keploy will:

- Parse and understand your source code using code semantics.
- Create relevant test files alongside your existing code (in your test directory or alongside source files, depending on your config).
- Provide complete test coverage with little to no boilerplate code.

<!-- one design asset will go here -->
<img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747915360/Frame_3_vuizpr.png" width="100%" />

All tests are:

- Readable
- Maintainable
- Ready to run using your preferred test runner (e.g., Jest, Mocha, etc.)

## Why Use Keploy in VS Code?

- **One-click simplicity**: No config, no terminal - just click and go.
- **LLM-powered generation**: Understands your code deeply, not just syntax.
- **Boost productivity**: Spend less time writing tests, more time building features.
- **Fits right into your workflow**: Native support within VS Code means no context switching.

With the Keploy VS Code Extension, testing is no longer a manual afterthought - it’s built right into your development process.

## Frequently Asked Questions(FAQs)

1. **What is Keploy's Unit Test Generator (UTG)?**<br/>

- Keploy's UTG automates the creation of unit tests based on code semantics, enhancing test coverage and reliability.

2. **Does Keploy send your private data to any cloud server for test generation?**<br/>

- No, Keploy does not send any user code to remote systems, except when using the unit test generation feature. When using the UT gen feature, only the source code and the unit test code will be sent to the Large Language Model (LLM) you are using. By default, Keploy uses - litellm to support vast number of LLM backends. Yes, if your organization has its own LLM(a private one), you can use it with Keploy. This ensures that data is not sent to any external systems.

3. **How does Keploy contribute to improving unit test coverage?**<br/>

- By providing a zero code platform for automated testing, Keploy empowers developers to scale up their unit test coverage without extensive coding knowledge. This integration enhances testing reports, ultimately boosting confidence in the product's quality.

4. **Is Keploy cost-effective for automated unit testing?**<br/>

- Yes, Keploy optimizes costs by automating repetitive testing tasks and improving overall test efficiency.

5. **How does Keploy generate coverage reports?**<br/>

- Keploy generates detailed Cobertura format reports, offering insights into test effectiveness and code quality.

6. **Can Keploy handle large codebases efficiently?**<br/>

- Yes, Keploy is designed to handle large codebases efficiently, though processing time may vary based on project size and complexity.

7. **Which method should I choose for generating unit tests?**<br/>

- **PR Agent**: Best for teams using pull request workflows who want automatic test generation
- **VS Code Extension**: Ideal for individual developers who prefer IDE integration
- **Command Line**: Perfect for CI/CD pipelines and automated workflows

8. **Do I need an API key for all three methods?**<br/>

- The API key is primarily required for the Command Line method. The PR Agent and VS Code Extension may have different authentication mechanisms depending on your setup.
