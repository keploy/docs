---
id: unit-test-generator
title: Keploy Unit Test Generator
sidebar_label: Unit Test Generator
description: This section documents usecase of Keploy's Unit Test Generator
tags:
  - utg
  - unit test generator
keywords:
  - unit test generator
  - unit testing
  - unit tests
  - documentation
  - commands
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
keploy gen --sourceFilePath="<path to source file>" \
    --testFilePath="<path to test file for above source file>" \
    --testCommand="npm test" \
    --coverageReportPath="<path to coverage.xml>"
```

For Entire Application we can generate tests by using `--testDir` instead of `--testFilePath`.

> ⚠️ Warning: Executing command with `--testDir` will generate unit tests for all files in the application. Depending on the size of the codebase, this process may take between 20 minutes to an hour and will incur costs related to LLM usage.

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
  --sourceFilePath="./src/routes/routes.js" \
  --testFilePath="./test/routes.test.js" \
  --testCommand="npm test" \
  --coverageReportPath="./coverage/cobertura-coverage.xml"
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
keploy gen --sourceFilePath="<path to source file>o" \
  --testFilePath="<path to test file for above source file>" \
  --testCommand="go test -v ./... -coverprofile=coverage.out && gocov convert coverage.out | gocov-xml > coverage.xml" \
  --coverageReportPath="<path to coverage.xml>"
```

For Entire Application we can generate tests by using `--testDir` instead of `--testFilePath`.

> ⚠️ Warning: Executing command with `--testDir` will generate unit tests for all files in the application. Depending on the size of the codebase, this process may take between 20 minutes to an hour and will incur costs related to LLM usage.

#### Example

Let us consider the [mux-sql](https://github.com/keploy/samples-go/tree/main/mux-sql/) sample-application, where we already have our `app_test.go` test file for `app.go` source file : -

```bash
keploy gen --sourceFilePath="app.go" \
  --testFilePath="app_test.go" \
  --testCommand="go test -v ./... -coverprofile=coverage.out && gocov convert coverage.out | gocov-xml > coverage.xml" \
  --coverageReportPath="./coverage.xml"
```

We will get following output : -

<img src="/docs/img/mux-sql-utg.png" alt="Keploy test coverage with ai generated unit test for mux-sql" width="100%" style={{ borderRadius: '5px' }}/>

_Voila!! The Generated Testcases have provided with 71% coverage in just 2 iterations 🌟_
