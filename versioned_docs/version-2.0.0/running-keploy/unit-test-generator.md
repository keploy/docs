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

Keploy's unit test generator(ut-gen) implementation of Meta LLM research paper is a first which understands code semantics and generates meaningful unit tests, aiming to:

- **Automate unit test generation (UTG):** Quickly generate comprehensive unit tests and reduce the redundant manual effort.

- **Improve edge cases:** Extend and improve the scope of tests to cover more complex scenarios that are often missed manually.

- **Boost test coverage:** As codebase grows, ensuring exhaustive coverage should become feasible.

## Usage

```bash
keploy gen [flag]
```

## Prerequisites

`API KEY` of the AI model is needed, this can be from either of one these:

- **OpenAI's [GPT-4o](https://platform.openai.com/) [preferred].**
- Alternative LLMs via [litellm](https://github.com/BerriAI/litellm?tab=readme-ov-file#quick-start-proxy---cli).
- [Azure OpenAI](https://azure.microsoft.com/en-in/products/ai-services/openai-service) Services

Now, let's setup the `API_KEY` as environment variable : -

```bash
export API_KEY=xxxx
```

## Running with Javascript/TypeScript applications

For the we need to make sure that the coverage report is in coberuta format, so to make sure let's modify our `package.json` by adding :

```json
"jest": {
      "coverageReporters": ["text", "cobertura"],
    }
```

or if `jest.config.js` is present then, we need to add :

```js
module.exports = {
  coverageReporters: ["text", "cobertura"],
};
```

### Generating Unit Tests

You can test a smaller section of application or to control costs, we can consider generating tests for a single source and its corresponding test file : -

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

We have modified our `package.json` by adding below : -

```json
  "jest": {
    "collectCoverage": true,
    "coverageReporters": ["text", "cobertura"],
    "coverageDirectory": "./coverage"
  }
```

Now let's run Keploy UTG command : -

```bash
keploy gen \
  --source-file-path="./src/routes/routes.js" \
  --test-file-path="./test/routes.test.js" \
  --test-command="npm test" \
  --coverage-report-path="./coverage/cobertura-coverage.xml"
```

We will get following output : -

<img src="/docs/img/express-mongoose-utg.png" alt="Keploy test coverage with ai generated unit tests for express-mongoose" width="100%" style={{ borderRadius: '5px' }}/>

_Voila!! The Generated Testcases have provided with 58% coverage🌟_

## Running with Golang applications

To ensure Cobertura formatted coverage reports, we need to install the following : -

```bash
go install github.com/axw/gocov/gocov@v1.1.0
go install github.com/AlekSi/gocov-xml@v1.1.0
```

### Generating Unit Tests

With the above dependecies installed, we can now generate tests for our application by the following dommand : -

```bash
keploy gen --source-file-path="<path to source file>o" \
  --test-file-path="<path to test file for above source file>" \
  --test-command="go test -v ./... -coverprofile=coverage.out && gocov convert coverage.out | gocov-xml > coverage.xml" \
  --coverage-report-path="<path to coverage.xml>"
```

For Entire Application we can generate tests by using `--test-dir` instead of `--test-file-path`.

> ⚠️ Warning: Executing command with `--test-dir` will generate unit tests for all files in the application. Depending on the size of the codebase, this process may take between 20 minutes to an hour and will incur costs related to LLM usage.

#### Example

Let us consider the [mux-sql](https://github.com/keploy/samples-go/tree/main/mux-sql/) sample-application, where we already have our `app_test.go` test file for `app.go` source file : -

```bash
keploy gen --source-file-path="app.go" \
  --test-file-path="app_test.go" \
  --test-command="go test -v ./... -coverprofile=coverage.out && gocov convert coverage.out | gocov-xml > coverage.xml" \
  --coverage-report-path="./coverage.xml"
```

We will get following output : -

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
