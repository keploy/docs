---
id: utg-pr-agent
title: Keploy's PR Agent
sidebar_label: PR Agent
description: This section documents usecase of Keploy's Unit Test Generator Pull Request Agent
tags:
  - utg
  - unit test generator
  - unit test generator pull request agent
  - unit test generator pr agent
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

> **Transform your code review process with intelligent, automated unit test generation that ensures every PR is backed by comprehensive test coverage.**

Keploy's **PR Agent** is a revolutionary GitHub App that seamlessly integrates into your pull request workflow, automatically generating high-quality unit tests for every code change. By embedding intelligent test generation directly into your GitHub PRs, this tool eliminates manual testing overhead and ensures that quality code and comprehensive tests go hand in hand **before anything reaches production**.

## **Quick Setup Guide**

Follow the steps below to get started with the Keploy PR Agent on your GitHub repository:

### Step 1. Install the Keploy GitHub App

- Visit [Github Marketplace](https://github.com/marketplace/keploy)

<img src="https://res.cloudinary.com/dfhtr1rwo/image/upload/v1748777663/keploy-marketplace_lwiaoz.png" width="100%" />

Click on **Add**.

Choose:

- A **specific repository** where you want to enable the PR agent, or
- **All repositories** if you want the functionality across your GitHub organization.
- Authorize the app to complete the installation.
  <!-- one small screenshot for the configuration in repositories goes here -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_2.50.17_PM_okdxc8.png" width="100%" />

### Step 2. Make a Code Change and Open a Pull Request

Once the app is installed:

- Make any code changes in your repository.
- Push your changes and **create a pull request (PR)** as usual.
- The **Keploy PR Agent** will automatically detect the changes and leave a comment on the PR.
  <!-- one image of the koploy pr agent making a comment on the code will be added here  -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914669/Screenshot_2025-05-22_at_3.21.05_PM_uzeewc.png" width="100%" />

### Step 3. Trigger Unit Test Generation

In the PR comment left by Keploy:

- Click on the link.
- You will be redirected to the Keploy service, where the unit test generation process begins.
- The PR Agent uses code semantics and the power of LLMs to understand your code changes and generate meaningful unit tests.
  <!-- one screenshot of the api server generating test cases will go here -->
  <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_3.23.40_PM_emluya.png" width="100%" />

### Step 4. View the Generated Tests and Summary

Once the process is complete:

- Click **"Go back to the PR"**.
- The PR comment will be updated with:
  - All the **unit test files** generated for your recent changes.
  - A **test summary** presented in a **clean tabular format** showing: - File names - Number of test cases - Coverage details - Edge cases handled (if any)
    <!-- one image with the tabular format comment with the test summary will be added here -->
    <img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914671/Screenshot_2025-05-22_at_3.30.35_PM_mubqr5.png" width="100%" />
    You can review, modify, or directly merge the PR with complete confidence that your changes are well-tested.
    With Keploy PR Agent, testing is no longer a bottleneck - it’s built right into your workflow.

## **Get Started Today**

Ready to transform your pull request workflow from a potential quality bottleneck into a quality amplifier? Install the Keploy PR Agent and experience the future of collaborative development.

### **Next Steps:**

1. **Install the PR Agent** in under 10 seconds
2. **Create a test PR** to see the magic in action
3. **Experience the difference** in your next code review cycle

_Elevate your development workflow. Make every pull request a quality checkpoint._

import GetSupport from '../concepts/support.md'

<GetSupport/>
