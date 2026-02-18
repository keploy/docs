---
id: api-testing-run-report
title: Test Run Reports
description: Guide to viewing and analyzing test run reports with detailed execution results and filtering
sidebar_label: Test Run Reports
tags:
  - api-testing
  - run-reports
  - test-execution
  - test-results
  - test-management
---
import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide explains how to use the run report page to track and analyze your test execution results. 

## Run Report List View

### Report Summary Information

For each test run, you can view:

1. **Report ID**: Unique identifier for the test run
2. **Ran on**: Timestamp when the test run was executed
3. **Ran by**: User or system that initiated the test run
4. **Total Suites**: Total number of test suites executed
5. **Status Distribution**:
   - **Pass**: Number of test suites that passed ✅
   - **Fail**: Number of test suites that failed ❌
   - **Buggy**: Number of test suites with bugs 🐛

### Viewing Report List

1. **Navigate to Run Reports**
   - Go to the run reports section in Keploy
   - View the list of all test execution runs

2. **Review Report Summary**
   - See the overall pass/fail/buggy distribution
   - Identify problematic test runs at a glance
   - Track test execution history

## Detailed Report View

### Accessing Detailed Results

Click on any report from the list to view detailed execution results:

1. **Click on Report ID**
   - Select a report to view full details
   - Access comprehensive test execution information

2. **View Test Results**
   - See detailed breakdown of all test suites
   - Identify which tests passed, failed, or are buggy
   - Review execution metrics and timings

### Understanding Test Results

#### Passed Tests ✅
- Tests that successfully completed all assertions
- All validations matched expected results
- No errors or warnings during execution

#### Failed Tests ❌
- Tests that did not meet assertion criteria
- **Failure Reasons Displayed**:
  - Assertion mismatches
  - Unexpected response values
  - Status code mismatches
  - Timeout errors
- **Association Failures**: 
  - Failures from dependent services or associations
  - External API failures affecting the test
  - Database connection issues

#### Buggy Tests 
- Tests with identified bugs or inconsistent behavior
- **Buggy Reasons Displayed**:
  - Shown on top of the particular test step
  - Detailed error messages and stack traces
  - Intermittent failures or race conditions
  - Data inconsistencies

## Filtering Test Results

The run report page provides powerful filtering options to help you analyze specific test results:

### Available Filters

#### 1. Filter by Suite Status
Filter tests based on their execution outcome:
- **Passed**: Show only successful tests
- **Failed**: Show only failed tests
- **Buggy**: Show only buggy tests
- **All**: View all test results

#### 2. Filter by Status Code
Filter by HTTP response status codes:
- **2xx Success**: 200 OK, 201 Created, 204 No Content
- **3xx Redirection**: 301, 302, 304
- **4xx Client Errors**: 400, 401, 403, 404
- **5xx Server Errors**: 500, 502, 503, 504
- **Custom Code**: Filter by specific status codes

#### 3. Filter by HTTP Method
Filter tests by request method:
- **GET**: Retrieve operations
- **POST**: Create operations
- **PUT**: Update operations
- **PATCH**: Partial update operations
- **DELETE**: Delete operations
- **OPTIONS, HEAD**: Other HTTP methods

#### 4. Filter by Endpoint
Filter by API endpoint or URL path:
- Full endpoint URL
- Partial path matching
- Wildcard patterns
- Multiple endpoints selection

### Applying Filters

1. **Open Filter Panel**
   - Click on the filter icon in the report view
   - Select desired filter criteria
   - You can also apply multiple filters simultaneously


## Detailed Test Step Information

### Viewing Step-by-Step Results

For each test case, you can see:

1. **Test Steps Breakdown**
   - Individual steps within each test
   - Request and response details
   - Execution time for each step

2. **Buggy Reasons on Test Steps**
   - Detailed error messages displayed on top of the affected step
   - Root cause analysis
   - Stack traces when available
   - Suggested fixes or actions

3. **Failure Reasons from Assertions**
   - Expected vs actual values comparison
   - Schema validation errors
   - Assertion failure details

4. **Association Failures**
   - Failures from dependent services
   - External API errors
   - Database or integration issues
   - Cascading failure analysis

## Example Report View

```
┌─────────────────────────────────────────────────────────────────┐
│ Run Reports                                                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Report ID: run-2026-02-13-001                                   │
│ Ran On: 2026-02-13 14:25:30                                    │
│ Ran by: john.doe@example.com                                   │
│ Total Suites: 150                                               │
│                                                                 │
│ Distribution:                                                   │
│   ✅ Pass: 125 (83%)                                            │
│   ❌ Fail: 18 (12%)                                             │
│   🐛 Buggy: 7 (5%)                                              │
│                                                                 │
│ [Test Suite Details]                                                  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Report ID: run-2026-02-13-002                                   │
│ Created: 2026-02-13 10:15:22                                    │
│ Creator: Automated CI/CD                                        │
│ Total Suites: 200                                               │
│                                                                 │
│ Distribution:                                                   │
│   ✅ Pass: 180 (90%)                                            │
│   ❌ Fail: 15 (7.5%)                                            │
│   🐛 Buggy: 5 (2.5%)                                            │
│                                                                 │
│ [Test Suite Details]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Benefits of Run Reports

- **Comprehensive Testing Visibility**: Complete view of test execution results
- **Quick Issue Identification**: Easily spot failures and bugs
- **Detailed Diagnostics**: Step-by-step failure analysis
- **Association Tracking**: Monitor external dependencies
- **Historical Tracking**: Maintain test execution history
- **Team Collaboration**: Share results and insights with team
- **Data-Driven Decisions**: Use metrics to improve test quality

By leveraging the run report features, you can maintain high-quality APIs, quickly identify and fix issues, and ensure comprehensive test coverage across your application.