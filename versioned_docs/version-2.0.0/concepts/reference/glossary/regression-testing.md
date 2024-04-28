---
id: regression-testing
title: Using Keploy for Regression Testing
sidebar_label: Regression Testing
description: This glossary has an explanation of all the terminologies that beginners find difficult to understand at first glance.
tags:
  - explanation
keywords:
  - API
---

## What is regression testing?

Regression testing is a type of software testing that ensures that changes made to a software application do not negatively impact existing functionality. It is typically performed after a new feature is added, a bug is fixed, or a configuration change is made.

Regression testing can be performed manually or using automated tools. Manual regression testing involves re-running a subset of test cases that have been previously executed to ensure that they still pass. Automated regression testing uses software to execute test cases automatically, which can save time and resources.

## Different Types of regression testing:

**Full regression testing**: This involves re-running all of the test cases in a test suite. This is the most comprehensive approach, but it can be time-consuming and resource-intensive.
**Partial regression testing**: This involves re-running a subset of test cases that are likely to be affected by the changes made to the software. This approach is more efficient than full regression testing, but it may not catch all of the potential regressions.
**Risk-based regression testing**: This approach prioritizes the test cases that are most likely to be affected by the changes made to the software. This approach can help to ensure that the most important test cases are re-run, while also minimizing the amount of time and resources that are spent on regression testing.

Regression testing is an important part of the software testing process. It helps to ensure that the software is stable and reliable, and that it continues to meet the requirements of the users.

## Benefits of perform regression testing using Keploy:

- It helps to ensure that the software is stable and reliable.
- It helps to prevent regressions, which are defects that are introduced into the software when changes are made.
- It helps to identify potential problems with the software before they are released to users.
- It helps to save time and resources by preventing the need to fix regressions after the software is released.

## How to perform Regression Testing using Keploy?

Regression testing involves re-running previously executed test cases to ensure that recent changes to the codebase have not introduced new bugs or regressions. Keploy provides several features that facilitate regression testing:

- Test Case Management: Keploy allows you to organize and manage test cases effectively. You can categorize test cases based on their purpose, severity, or functionality, making it easier to identify and execute relevant regression tests.
- Test Automation: Keploy supports test automation with various testing frameworks such as GoTest, JUnit, and NUnit. You can automate the execution of regression test suites, ensuring that they are consistently executed whenever changes are made to the codebase.
- Continuous Integration (CI): Keploy integrates with CI pipelines such as Jenkins, Travis CI, and CircleCI. You can configure Keploy to automatically trigger regression tests whenever new code is pushed to the repository, ensuring that regression testing is performed as part of the CI process.
- Capture and Replay Tests: Keploy allows you to capture and replay tests and mocks resembling real traffic. This feature enables you to simulate user interactions and test scenarios, making it easier to identify regressions caused by recent code changes.
- Code Coverage Analysis: Keploy provides built-in tools for measuring code coverage, including line coverage, branch coverage, and statement coverage. By monitoring code coverage metrics during regression testing, you can ensure that all relevant code paths are exercised and regression bugs are detected.

Overall, by leveraging Keploy's testing capabilities and integrating it into your regression testing process, you can ensure the stability and reliability of your software by detecting and preventing regression bugs effectively.
