---
id: utg-vscode-extension
title: Keploy's VS Code Extension
sidebar_label: VS Code Extension
description: This section documents usecase of Keploy's AI powered unit test vs code extension
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

> **Transform your IDE into a testing powerhouse. Generate comprehensive, intelligent unit tests with a single click - trusted by 500K+ developers worldwide.**

The **Keploy Unit Test Generator VS Code Extension** revolutionizes how developers approach testing by bringing seamless, AI-powered test generation directly into your favorite IDE. Whether you're building new features, debugging complex issues, or refactoring legacy code, generate production-ready unit tests instantly without leaving your development environment.

## **Why 500K+ Developers Choose Keploy**

### **Instant Productivity Boost**

- **One-Click Generation**: Transform any function into a comprehensive test suite in seconds
- **Zero Context Switching**: Stay in your IDE flow without opening external tools
- **Intelligent Analysis**: AI understands your code's business logic and generates relevant test scenarios

### **Enterprise-Grade Quality**

- **LLM-Powered Intelligence**: Leverages GPT-4o and advanced language models for superior test quality
- **Framework Agnostic**: Works seamlessly with Jest, Mocha, JUnit, pytest, and more
- **Production Ready**: Generated tests follow industry best practices and your project's conventions

## **Generate Tests in Simple Steps**

### 1. Install the Extension

You can install the Keploy extension using either of the following methods:

**Method 1: From VS Code Marketplace**

- Open the **Extensions** tab in VS Code.
- Search for **"Keploy"**.
- Click **Install**.

<!-- vs code extension search screenshot -->
<img src="https://res.cloudinary.com/dqwbkjfuh/image/upload/v1747914670/Screenshot_2025-05-22_at_4.50.03_PM_o97dfi.png" width="100%" />

**Method 2: Direct Link / VS Code Marketplace**

- Visit [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=Keploy.keployio).
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

## **Smart Output Management**

### **Intelligent Directory Structure**

Generated tests are organized following best practices:

```
your-project/
├── src/
│   └── utils/
│       └── calculator.js
└── tests/
    └── utils/
        └── calculator.test.js
```

## **Get Started Today**

Don't let testing slow down your development velocity. With Keploy's AI-powered VS Code extension, comprehensive test coverage is just one click away.

### **Quick Start:**

1. **[Install from VS Code Marketplace →](https://marketplace.visualstudio.com/items?itemName=Keploy.keployio)**
2. **Open your favorite project** and select a function
3. **Click "Generate Unit Tests"** and experience the magic
4. **Watch your test coverage soar** while maintaining development speed

_Transform your IDE. Elevate your code quality. Join 500k+ developers building better software with Keploy._

import GetSupport from '../concepts/support.md'

<GetSupport/>
