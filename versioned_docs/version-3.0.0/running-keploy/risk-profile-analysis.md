---
id: risk-profile-analysis
title: Risk Profile Analysis
sidebar_label: Risk Profile Analysis
description: Discover Keploy's Risk Profile Analysis feature, which automatically classifies API test failures as High, Medium, or Low risk, helping you instantly distinguish between breaking changes and minor updates.
tags:
  - risk-analysis
  - change-management
  - breaking-changes
keywords:
  - risk analysis
  - breaking changes
  - High Risk
  - Medium Risk
  - Low Risk
  - Risk Categories
  - Schema Changed
  - Schema Broken
---

When API contracts change, tests are expected to fail. However, not all failures are equal. A minor, backward-compatible change (like adding a new optional field) is very different from a major, breaking change (like removing a field or changing a data type).

The **Risk Profile Analysis** feature addresses this by automatically categorizing each test failure based on its potential impact. It assigns a risk level of **High**, **Medium**, or **Low**, giving developers immediate insight into the severity and nature of API changes. This helps distinguish between intentional contract updates and unintentional bugs right from the test report.

### Key Concepts

When a test fails, it is now assigned a risk level:

- **HIGH**: Indicates a likely breaking change to the API contract. This is the highest level of risk.

  - **Triggers**: Status code changes, `Content-Type` header changes, removing fields from a JSON body, or changing the data type of a field (e.g., string to number).

- **MEDIUM**: Indicates a change that might affect consumers but is not a direct contract violation.

  - **Triggers**: Changes in header values (other than `Content-Type`), or changes to field values within a JSON body while new fields are also being added.

- **LOW**: Indicates a backward-compatible, non-breaking change.
  - **Triggers**: Only adding new, optional fields to a JSON body.

To provide more detail, failures are also assigned one or more categories:

- `SCHEMA_BROKEN`: A breaking change occurred in the response body (field removed, type changed).
- `SCHEMA_ADDED`: Only new fields were added to the response body.
- `SCHEMA_UNCHANGED`: The response body schema is identical, but values within it have changed.
- `STATUS_CODE_CHANGED`: The HTTP status code was different from the expected one.
- `HEADER_CHANGED`: One or more headers were different.

##### How Risk Profiling Works During Testing

1.  **Failure Detection**: Keploy runs tests as usual. When a response mismatch is detected, the new analysis logic is triggered.
2.  **Deep Comparison**: Keploy performs a detailed comparison of the expected versus actual responses:
    - **Status Code**: Checks for any mismatch.
    - **Headers**: Pays special attention to the `Content-Type` header.
    - **JSON Body**: Analyzes the _nature_ of the difference by comparing the structure of the expected and actual JSON payloads to identify added fields, removed fields, and data type changes.
3.  **Risk Assessment**: Based on the comparison, a `RiskLevel` and one or more `FailureCategory` tags are assigned to the test result.
4.  **Enhanced Reporting**: The test report (`test-run-*-report.yaml`) is updated to include these new details. The summary now includes counts for high, medium, and low-risk failures, and each individual failed test specifies its risk and category.

**Example Test Report Snippet:**

```yaml
version: 2.0.0
name: test-set-0
status: FAILED
success: 0
failure: 12
high-risk: 7
medium-risk: 4
low-risk: 1
total: 12
tests:
  - name: test-1
    status: FAILED
    # ... other fields
    failure_info:
      risk: HIGH
      category:
        - SCHEMA_BROKEN
  - name: test-2
    status: FAILED
    # ... other fields
    failure_info:
      risk: LOW
      category:
        - SCHEMA_ADDED
```
