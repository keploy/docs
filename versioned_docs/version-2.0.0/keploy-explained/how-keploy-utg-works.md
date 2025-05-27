---
id: how-keploy-utg-works
title: How Keploy UTG PR Agent Works?
sidebar_label: How Keploy Works?
tags:
  - explanation
  - why keploy
  - automated testing
  - test scripts
  - manual testing
  - record replay test
---

> **Transform your testing workflow with intelligent, AI-powered unit test generation that understands your code like a senior developer.**

Keploy UTG (Unit Test Generator) revolutionizes the way developers approach testing by combining advanced static analysis, intelligent code parsing, and cutting-edge AI-driven test case generation. Our platform seamlessly integrates into your existing development workflow through two powerful tools designed for maximum efficiency and minimal friction.

## **Core Integration Points**

### 1. **VS Code Extension** -

Direct integration into your favorite IDE for real-time test generation during active development.

### 2. **PR Agent**

Intelligent pull request analysis that ensures every code change comes with comprehensive test coverage.

## **The Intelligent Test Generation Pipeline**

Our sophisticated four-step process transforms your code into comprehensive test suites:

### **Step 1: Smart Input Detection**

- **Single Function Mode**: Target specific functions or methods for focused testing
- **File-Level Analysis**: Process entire source files for comprehensive coverage
- **PR Delta Scanning**: Automatically detect and analyze only changed code in pull requests
<!-- - **Multi-Language Support**: Seamlessly handle JavaScript, TypeScript, Java, Go, and Python -->

### **Step 2: Deep Code Intelligence**

Keploy's advanced parser performs comprehensive code analysis:

- **Function Signature Analysis**: Extract parameter types, return types, and method signatures
- **Control Flow Mapping**: Identify all conditional branches, loops, and execution paths
- **Dependency Discovery**: Automatically detect external API calls, database interactions, and third-party integrations
- **Type Inference**: Smart type detection for dynamically typed languages
- **Business Logic Recognition**: Understand complex logic patterns and business rules

### **Step 3: AI-Powered Test Synthesis**

Our proprietary AI engine combines rule-based heuristics with machine learning:

- **Pattern Recognition**: Trained on millions of real-world code patterns and testing scenarios
- **Edge Case Generation**: Automatically identify and test boundary conditions, null values, and error states
- **Mock Auto-Generation**: Intelligent creation of mocks and stubs for external dependencies
- **Regression Testing**: Generate tests that prevent future breaking changes
- **Performance Considerations**: Include basic performance validation where applicable

### **Step 4: Framework-Native Output**

Generate production-ready test files that feel hand-written:

- **Framework Compliance**: Output tests in your project's existing testing framework
- **Code Style Matching**: Maintain consistency with your team's coding conventions
- **Comprehensive Coverage**: Include happy path, edge cases, error scenarios, and integration points
- **Documentation Integration**: Auto-generate test descriptions and inline comments

## **VS Code Extension Deep Dive**

### **Seamless Workflow Integration**

Transform your development experience with context-aware test generation:

```typescript
// Right-click any function → "Generate Unit Tests"
function calculateTax(income: number, rate: number): number {
  if (income < 0) throw new Error("Income cannot be negative");
  return income * (rate / 100);
}
// ↓ Instantly generates comprehensive test suite ↓
```

### **Key Features**

- **One-Click Generation**: Right-click context menu integration
- **Smart File Organization**: Auto-creates `tests/` or `__tests__/` directories
- **Live Preview**: See generated tests before committing
- **Incremental Updates**: Add tests for new functions without breaking existing ones
- **Customizable Templates**: Configure output format and naming conventions

### **Perfect For:**

- **Active Development**: Generate tests while writing new features
- **Refactoring Sessions**: Ensure changes don't break existing functionality
- **Legacy Code**: Add tests to existing codebases incrementally
- **Learning**: Understand testing best practices through AI-generated examples

## **PR Agent: Your Automated Quality Assurance**

### **Intelligent Pull Request Analysis**

Transform your code review process with automated test generation:

- **Diff-Based Intelligence**: Analyzes only changed lines for targeted test generation
- **Multi-File Support**: Handles complex PRs affecting multiple modules
- **Contextual Understanding**: Considers the broader codebase context when generating tests
- **Review Integration**: Seamlessly integrates with GitHub, GitLab, and Bitbucket workflows

### **Advanced Capabilities**

- **Smart Commenting**: Adds meaningful comments explaining test logic and edge cases
- **Coverage Metrics**: Provides instant feedback on test coverage improvements
- **Conflict Resolution**: Handles merge conflicts in test files intelligently
- **Team Notifications**: Alerts team members when tests are auto-generated or updated

### **Deployment Options**

- **GitHub Comments**: Non-intrusive suggestions in PR conversations
- **Auto-Commit Mode**: Directly pushes tests to feature branches
- **Review Required**: Requires maintainer approval before test integration
- **Custom Workflows**: Integrate with existing CI/CD pipelines and quality gates

## **Advanced Technical Architecture**

### **Core Technologies**

- **Multi-Language AST Parsing**: Language-specific parsers for accurate code understanding
- **Machine Learning Models**: Continuously trained on open-source and enterprise codebases
- **Intelligent Type Inference**: Advanced algorithms for dynamic language support
- **Mock Generation Engine**: Sophisticated stubbing for complex external dependencies
- **Pattern Matching System**: Recognition of common coding patterns and anti-patterns

### **Performance & Scalability**

- **Parallel Processing**: Handle multiple files simultaneously
- **Incremental Analysis**: Only process changed code for faster execution
- **Cloud-Native Architecture**: Scalable infrastructure for enterprise workloads
- **Caching Layer**: Smart caching for repeated analysis patterns

<!-- ## **Comprehensive Framework Support**

| Language | Primary Frameworks | Advanced Features |
|----------|-------------------|-------------------|
| **JavaScript/TypeScript** | Jest, Mocha, Vitest | React Testing Library, DOM mocking |
| **Java** | JUnit 5, TestNG, Mockito | Spring Test integration, annotation support |
| **Go** | Built-in testing, Testify | Goroutine testing, benchmark generation |
| **Python** | pytest, unittest | Fixture management, async testing | -->

## **Workflow Summary**

| **Tool**              | **Trigger**           | **Use Case**        | **Output**            | **Best For**          |
| --------------------- | --------------------- | ------------------- | --------------------- | --------------------- |
| **VS Code Extension** | Manual/On-demand      | Active development  | Local test files      | Individual developers |
| **PR Agent**          | Automatic/PR creation | Code review process | PR comments + commits | Team workflows        |

## **Getting Started**

Ready to revolutionize your testing workflow? Keploy UTG eliminates the tedious aspects of test writing, allowing you to focus on building exceptional software while maintaining the highest quality standards.

**Next Steps:**

- Install the VS Code extension for immediate productivity gains
- Configure PR Agent for automated team-wide quality assurance
- Explore advanced configuration options for enterprise deployments

_Questions? Our support team and community are here to help you maximize your testing efficiency._

import GetSupport from '../concepts/support.md'

<GetSupport/>
