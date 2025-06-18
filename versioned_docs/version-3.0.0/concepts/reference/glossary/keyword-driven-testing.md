---
id: keyword-driven-testing
title: Keyword Driven Testing
sidebar_label: Keyword Driven Testing
description: Learn how Keyword Driven Testing separates test logic from implementation using keywords.
tags:
  - explanation
keywords:
  - automation
  - framework
---

### What is Keyword Driven Testing?

Keyword Driven Testing is a software testing methodology that separates test design from test implementation by using keywords to represent actions or operations. Each keyword corresponds to a specific action (such as "Click", "Input Text", "Verify Element") and is mapped to code that performs the action. Testers create test cases by combining these keywords, often in a tabular format, making test creation accessible to both technical and non-technical users.

### How Keyword Driven Testing Works

- **Defining Keywords:** Identify and document keywords that represent actions in the application under test. These can be low-level (e.g., "Click Button") or high-level (e.g., "Login User").
- **Implementing Keywords:** Developers implement functions or methods for each keyword, which interact with the application.
- **Creating Test Cases:** Testers build test cases by sequencing keywords and providing test data, often in spreadsheets or tables.
- **Executing Tests:** A test execution engine reads the test cases, interprets the keywords, and runs the corresponding code.
- **Reviewing Results:** Test results are analyzed to determine which keywords (and thus which actions) passed or failed.

### Components of Keyword Driven Testing

- **Keyword Library:** A collection of reusable functions or methods mapped to keywords.
- **Test Data:** Data required for executing test cases, usually stored separately (e.g., spreadsheets, databases).
- **Driver Script/Test Execution Engine:** Software that reads test cases, interprets keywords, and invokes corresponding actions.

### Types of Keywords

- **Low-level keywords:** Represent basic actions (e.g., click, input, select).
- **High-level keywords:** Combine multiple low-level keywords to represent business processes (e.g., "Checkout", "Register User").

### Benefits of Keyword Driven Testing

- **Separation of Concerns:** Test design is independent from implementation, enabling non-programmers to write tests.
- **Reusability:** Keywords can be reused across multiple test cases, reducing duplication.
- **Maintainability:** Changes in application logic only require updates to keyword implementations, not all test cases.
- **Collaboration:** Enables both technical and business stakeholders to contribute to test design.

### Challenges

- **Initial Setup:** Building a robust keyword library and test execution engine requires upfront investment.
- **Keyword Management:** As the application grows, maintaining and organizing keywords can become complex.
- **Debugging:** Errors may be harder to trace if keywords are too generic or poorly documented.

### Example

A simple table-driven test case might look like:

| Keyword        | Argument 1   | Argument 2      |
| -------------- | ------------ | --------------- |
| StartApp       | MyApp        |                 |
| InputText      | username     | user1           |
| InputText      | password     | pass123         |
| ClickButton    | login        |                 |
| VerifyElement  | dashboard    | visible         |
| TerminateApp   | MyApp        |                 |

### Tools Supporting Keyword Driven Testing

- **Selenium with TestNG/JUnit:** Allows mapping of keywords to methods, often using configuration files.
- **Robot Framework:** Provides built-in and custom keywords with a tabular syntax for test case design.
- **Squish, testRigor, and others:** Offer keyword-driven approaches with varying degrees of abstraction and automation.

### Conclusion

Keyword Driven Testing empowers teams to create maintainable, reusable, and business-friendly test cases by abstracting technical details behind human-readable keywords. It is especially valuable in complex or rapidly changing projects where collaboration between testers and developers is essential.

---

#### FAQs

**1. What is the main advantage of Keyword Driven Testing?**  
It enables non-programmers to design and maintain tests, increasing collaboration and reducing maintenance effort.

**2. How does it differ from data-driven testing?**  
Data-driven testing focuses on varying input data, while keyword-driven testing focuses on varying actions using keywords.

**3. Can it be used for both manual and automated testing?**  
Yes, keyword-driven testing is suitable for both manual and automated testing scenarios.

**4. What are common pitfalls?**  
Poorly defined or overly generic keywords can make debugging difficult and reduce test clarity.

**5. Which tools support this methodology?**  
Popular tools include Selenium (with TestNG/JUnit), Robot Framework, Squish, and testRigor.
