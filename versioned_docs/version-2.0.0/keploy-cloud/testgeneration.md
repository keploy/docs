---
id: auto-test-generation
title: Auto Test Generation
sidebar_label: Test Generation
tags:
  - Auto Test Generation
  - OpenAPI
  - Test Automation
keywords:
  - Auto Test Generation
  - Keploy
  - OpenAPI
  - Test Automation
---

### Introduction to Auto Test Generation 🚀

Auto Test Generation simplifies the testing process by automating the generation of test cases based on the provided OpenAPI Schema file.

### Usage 🛠️

To generate tests automatically, use the following command:

```bash
keploy generate-tests -c "<appCmd>" -s "<schemaFilePath>"
```

generate-tests supports all the flags related to the record command and -s is the flag which provides the schema file path to the test generation service.
