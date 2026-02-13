---
id: api-testing-run-report
title: Test Run Reports
description: Guide to viewing and analyzing test run reports with detailed execution results and filtering
sidebar_label: Run Reports
tags:
  - api-testing
  - run-reports
  - test-execution
  - test-results
  - test-management
---

# Test Run Reports

This guide explains how to use the run report page in Keploy to track and analyze your test execution results. The run reports provide comprehensive insights into test performance, failures, and bugs with detailed diagnostic information.

## Overview

The run report page displays a list of all test execution runs, allowing you to monitor test results, identify failures, and debug issues efficiently. Each report provides detailed information about individual test cases and their outcomes.

## Run Report List View

### Report Summary Information

For each test run, you can view:

1. **Report ID**: Unique identifier for the test run
2. **Created**: Timestamp when the test run was executed
3. **Creator**: User or system that initiated the test run
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

#### Buggy Tests 🐛
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

2. **Combine Multiple Filters**
   - Apply multiple filters simultaneously
   - Narrow down results to specific scenarios
   - Example: Failed POST requests to /api/v1/users

3. **Clear Filters**
   - Reset filters to view all results
   - Remove individual filter criteria

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
│ Created: 2026-02-13 14:25:30                                    │
│ Creator: john.doe@example.com                                   │
│ Total Suites: 150                                               │
│                                                                 │
│ Distribution:                                                   │
│   ✅ Pass: 125 (83%)                                            │
│   ❌ Fail: 18 (12%)                                             │
│   🐛 Buggy: 7 (5%)                                              │
│                                                                 │
│ [View Details]                                                  │
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
│ [View Details]                                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Detailed Report View Example

```
┌─────────────────────────────────────────────────────────────────┐
│ Run Report: run-2026-02-13-001                                  │
│                                                                 │
│ Filters: [Suite Status: All] [Status Code: All] [Method: All]  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ❌ FAILED: Create User - POST /api/v1/users                     │
│                                                                 │
│ Status Code: 400 Bad Request                                    │
│ Execution Time: 145ms                                           │
│                                                                 │
│ Failure Reason:                                                 │
│   - Assertion Failed: Expected status code 201, got 400         │
│   - Response body validation error                              │
│                                                                 │
│ Association Failures:                                           │
│   - Email validation service returned error                     │
│   - Database constraint violation: duplicate email              │
│                                                                 │
│ Test Steps:                                                     │
│   1. ✅ Prepare request payload                                 │
│   2. ✅ Send POST request                                       │
│   3. ❌ Validate response status (Expected 201, got 400)        │
│   4. ❌ Validate response schema (Missing field: userId)        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 🐛 BUGGY: Get Product Details - GET /api/v1/products/123       │
│                                                                 │
│ Status Code: 200 OK                                             │
│ Execution Time: 2350ms (Timeout Warning)                        │
│                                                                 │
│ Buggy Reason (on Step 2):                                       │
│   - Intermittent timeout on external pricing service            │
│   - Response time exceeded threshold (>2000ms)                  │
│   - Inconsistent data: price field sometimes null               │
│                                                                 │
│ Test Steps:                                                     │
│   1. ✅ Send GET request                                        │
│   2. 🐛 Wait for response (2350ms - Slow)                       │
│      └─ Error: External pricing API timeout                     │
│   3. ⚠️  Validate response (Warning: price field is null)       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ✅ PASSED: Login User - POST /api/v1/auth/login                 │
│                                                                 │
│ Status Code: 200 OK                                             │
│ Execution Time: 95ms                                            │
│                                                                 │
│ All assertions passed successfully                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Analyzing Test Failures

### Common Failure Patterns

1. **Assertion Failures**
   - Response doesn't match expected schema
   - Incorrect status codes
   - Missing or unexpected fields
   - Data type mismatches

2. **Association Failures**
   - Dependent service unavailable
   - Database connection errors
   - Third-party API failures
   - Authentication/authorization issues

3. **Performance Issues**
   - Timeout errors
   - Slow response times
   - Resource exhaustion

### Debugging Failed Tests

1. **Review Failure Reasons**
   - Read detailed error messages
   - Check expected vs actual values
   - Identify the failing step

2. **Check Association Failures**
   - Verify dependent services are running
   - Check network connectivity
   - Review external API status

3. **Analyze Buggy Tests**
   - Review the buggy reason displayed on the test step
   - Check for intermittent issues
   - Look for patterns in bug occurrences

4. **Use Filters for Analysis**
   - Filter by specific endpoints showing failures
   - Group failures by HTTP method
   - Analyze status code patterns

## Report Metrics and Insights

### Key Metrics

- **Pass Rate**: Percentage of successful tests
- **Failure Rate**: Percentage of failed tests
- **Bug Rate**: Percentage of buggy tests
- **Average Execution Time**: Mean time across all tests
- **Success Trend**: Historical pass rate over time

### Performance Insights

- **Slowest Endpoints**: Identify performance bottlenecks
- **Most Failed Tests**: Tests requiring attention
- **Flaky Tests**: Tests with inconsistent results (buggy)
- **Association Dependencies**: Most common external failures

## Best Practices

1. **Regular Report Review**
   - Check reports after each test run
   - Monitor pass rate trends
   - Address failures promptly

2. **Use Filters Effectively**
   - Filter failed tests to prioritize fixes
   - Group by endpoint to identify problematic APIs
   - Filter by status code to categorize issues

3. **Document Failures**
   - Note recurring failure patterns
   - Document association dependencies
   - Track bug fixes and resolutions

4. **Investigate Buggy Tests**
   - Review buggy reasons carefully
   - Check for timing issues or race conditions
   - Stabilize flaky tests

5. **Monitor Associations**
   - Track external service reliability
   - Set up alerts for association failures
   - Maintain fallback strategies

6. **Share Reports**
   - Share reports with team members
   - Include reports in CI/CD pipelines
   - Use reports for sprint retrospectives

## Exporting and Sharing

- **Export Reports**: Download reports in various formats (PDF, CSV, JSON)
- **Share Links**: Generate shareable links to specific reports
- **Schedule Reports**: Set up automated report distribution
- **Integration**: Connect with project management tools

## Benefits of Run Reports

- **Comprehensive Testing Visibility**: Complete view of test execution results
- **Quick Issue Identification**: Easily spot failures and bugs
- **Detailed Diagnostics**: Step-by-step failure analysis
- **Association Tracking**: Monitor external dependencies
- **Historical Tracking**: Maintain test execution history
- **Team Collaboration**: Share results and insights with team
- **Data-Driven Decisions**: Use metrics to improve test quality

By leveraging the run report features, you can maintain high-quality APIs, quickly identify and fix issues, and ensure comprehensive test coverage across your application.