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

### You can try the Unit Test Generator in three ways:

1. **UTG PR Agent**: Install a GitHub App on your repo to automatically generate tests when you create a pull request.
2. **Keploy UTG VS Code Extension**: Generate test files with a single click directly from your IDE.
3. **Keploy CLI**: Use commands to manually generate unit tests for individual files or the entire project.

<!-- <img src="/img/POST-request.png" alt="Test Case Generator" width="80%" height="150" /> -->

# Three tools to Generate Unit Tests

## 1. Keploy PR Agent - Effortless Unit Testing for Every Change 📦

Writing and maintaining unit tests for every small code change can be a time-consuming and repetitive task. In fast-paced development environments, ensuring thorough test coverage often takes a backseat. That’s where the **Keploy PR Agent** steps in.

The **PR Agent** automates unit test generation directly from your pull requests—no manual intervention required. It understands your code changes, generates high-quality tests, and comments them directly on your PR with a single click. No more switching contexts or copy-pasting boilerplate code—Keploy handles it all.

### How It Works - Step-by-Step Setup Guide 🔧

Follow the steps below to get started with the Keploy PR Agent on your GitHub repository:

### 1. Install the Keploy GitHub App 🧩

- Visit [github.com/apps/keploy](https://github.com/apps/keploy)
- Click on **"Install/Configure"**.
- Choose:
  - A **specific repository** where you want to enable the PR agent, or
  - **All repositories** if you want the functionality across your GitHub organization.
- Authorize the app to complete the installation.

### 2. Make a Code Change and Open a Pull Request 🔁

Once the app is installed:

- Make any code changes in your repository.
- Push your changes and **create a pull request (PR)** as usual.
- The **Keploy PR Agent** will automatically detect the changes and leave a comment on the PR.

### 3. Trigger Unit Test Generation ⚡

In the PR comment left by Keploy:

- Click on the link (e.g., `https://api.keploy.io/github/trigger/...`).
- You will be redirected to the Keploy service, where the unit test generation process begins.
- The PR Agent uses code semantics and the power of LLMs to understand your code changes and generate meaningful unit tests.

### 4. View the Generated Tests and Summary ✅

Once the process is complete:

- Click **"Go back to the PR"**.
- The PR comment will be updated with:
  - All the **unit test files** generated for your recent changes.
  - A **test summary** presented in a **clean tabular format** showing:
    - File names
    - Number of test cases
    - Coverage details
    - Edge cases handled (if any)

You can review, modify, or directly merge the PR with complete confidence that your changes are well-tested.
With Keploy PR Agent, testing is no longer a bottleneck - it’s built right into your workflow.

## 2. VS Code Extension 🔌

Generate unit tests with a single click directly from your IDE.

**Setup:**

- Go to VS Code Extensions marketplace
- Search for "Keploy" and install the extension

**Usage:**

- Open your project in VS Code
- Click on "Generate Unit Tests" button in the Keploy extension
- All test files and test cases are generated instantly for your entire project
- Tests are created with comprehensive coverage for your codebase

## 3. Command Line Interface 💻

The traditional method using Keploy CLI commands for automated test generation.

**Prerequisites:**
`API KEY` of the AI model is needed, this can be from either of one these:

- **OpenAI's [GPT-4o](https://platform.openai.com/) [preferred].**
- Alternative LLMs via [litellm](https://github.com/BerriAI/litellm?tab=readme-ov-file#quick-start-proxy---cli).
- [Azure OpenAI](https://azure.microsoft.com/en-in/products/ai-services/openai-service) Services

Now, let's setup the `API_KEY` as environment variable:

```bash
export API_KEY=xxxx
```

**Usage:**

```bash
keploy gen [flag]
```

## Command Line Usage Guide

### Running with Javascript/TypeScript applications

For the we need to make sure that the coverage report is in coberuta format, so to make sure let's modify our `package.json` by adding:

```json
"jest": {
"coverageReporters": ["text", "cobertura"],
    }
```

or if `jest.config.js` is present then, we need to add:

```js
module.exports = {
  coverageReporters: ["text", "cobertura"],
};
```

#### Generating Unit Tests

You can test a smaller section of application or to control costs, we can consider generating tests for a single source and its corresponding test file:

```bash
keploy gen --source-file-path="<path to source file>" \
    --test-file-path="<path to test file for above source file>" \
--test-command="npm test" \
    --coverage-report-path="<path to coverage.xml>"
```

For Entire Application we can generate tests by using `--test-dir` instead of `--test-file-path`.

> ⚠️ Warning: Executing command with `--test-dir` will generate unit tests for all files in the application. Depending on the size of the codebase, this process may take between 20 minutes to an hour and will incur costs related to LLM usage.

#### Example

Let us consider the [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application, where we have a jest testcases under `test` folder with name `routes.test.js`.

We have modified our `package.json` by adding below:

```json
"jest": {
"collectCoverage": true,
"coverageReporters": ["text", "cobertura"],
"coverageDirectory": "./coverage"
  }
```

Now let's run Keploy UTG command:

```bash
keploy gen \
  --source-file-path="./src/routes/routes.js" \
--test-file-path="./test/routes.test.js" \
  --test-command="npm test" \
--coverage-report-path="./coverage/cobertura-coverage.xml"
```

We will get following output:

<img src="/docs/img/express-mongoose-utg.png" alt="Keploy test coverage with ai generated unit tests for express-mongoose" width="100%" style={{ borderRadius: '5px' }}/>

_Voila!! The Generated Testcases have provided with 58% coverage🌟_

### Running with Golang applications

To ensure Cobertura formatted coverage reports, we need to install the following:

```bash
go install github.com/axw/gocov/gocov@v1.1.0
go install github.com/AlekSi/gocov-xml@v1.1.0
```

#### Generating Unit Tests

With the above dependecies installed, we can now generate tests for our application by the following dommand:

```bash
keploy gen --source-file-path="<path to source file>o" \
  --test-file-path="<path to test file for above source file>" \
--test-command="go test -v ./... -coverprofile=coverage.out && gocov convert coverage.out | gocov-xml > coverage.xml" \
  --coverage-report-path="<path to coverage.xml>"
```

For Entire Application we can generate tests by using `--test-dir` instead of `--test-file-path`.

> ⚠️ Warning: Executing command with `--test-dir` will generate unit tests for all files in the application. Depending on the size of the codebase, this process may take between 20 minutes to an hour and will incur costs related to LLM usage.

#### Example

Let us consider the [mux-sql](https://github.com/keploy/samples-go/tree/main/mux-sql/) sample-application, where we already have our `app_test.go` test file for `app.go` source file:

```bash
keploy gen --source-file-path="app.go" \
  --test-file-path="app_test.go" \
--test-command="go test -v ./... -coverprofile=coverage.out && gocov convert coverage.out | gocov-xml > coverage.xml" \
  --coverage-report-path="./coverage.xml"
```

We will get following output:

<img src="/docs/img/mux-sql-utg.png" alt="Keploy test coverage with ai generated unit test for mux-sql" width="100%" style={{ borderRadius: '5px' }}/>

_Voila!! The Generated Testcases have provided with 71% coverage in just 2 iterations 🌟_

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
