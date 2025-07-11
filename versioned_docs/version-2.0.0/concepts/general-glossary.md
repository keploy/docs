---
id: general-glossary
title: General Glossary for Users
sidebar_label: Glossary
description: This glossary has an explanation of all the terminologies that beginners find difficult to understand at first glance.
tags:
  - explanation
  - reference
keywords:
  - API
---

### 1. **API data mocking**

API mocking is a simulation of real APIs and is performed when the production API is not ready. You may come across a
situation where you cannot send an API request to the server because it is not prepared. In such cases, you can mock a
chunk of data from the response and eventually, when you make requests the mocked data will be returned.

### 2. **Idempotency**

An API is idempotent when the outcome of a successful request remains unchanged on making the same request frequently.

### 3. **Noisy field**

Noisy field refers to the random data whose value changes each time you make a request.

For example, a Timestamp is one such property that returns the time when the request is made. Its value is not fed
manually but is automatically recorded therefore, at every call it differs.

### 4. **Interoperability**

Interoperability refers to the situation when the behavior of the data is in its original (native) format when
transferred from one platform to other. It reduces the dependency of files by replacing them with optimized code giving
the same result.

### 5. **Deduplication Algorithm**

Deduplication is a data compression technique wherein redundant copies of the same data are identified and eliminated.
This process involves hash functions or similarity analysis to compare data chunks, enabling the storage system to store
only one instance of each unique data segment, thereby optimizing storage efficiency and reducing redundancy.

### 6. **Unit Testing**

Unit testing involves testing individual components or functions of a software application in isolation to verify that they work as expected.

### 7. **Mocking**

Mocking is a technique used in testing to simulate the behavior of real components (like databases or APIs) so that the code can be tested in isolation.

### 8. **Latency**

Latency is the time delay between a user action and the corresponding response from the system. In APIs, it's the time taken to get a response after a request.

### 9. **Regression Testing**

Regression testing ensures that new code changes haven’t unintentionally affected existing functionality.

### 10. **Test Coverage**

Test coverage is a measure of how much of your codebase is covered by automated tests, indicating the thoroughness of testing.

