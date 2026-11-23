---
id: api-testing-running-selective
title: Running Selective Test Suites
description: Guide to selecting and running specific test suites using checkboxes and bulk actions
sidebar_label: Selective Test Execution
tags:
  - api-testing
  - test-execution
  - bulk-actions
  - test-management
---


import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy allows you to select specific test suites from your test collection and perform bulk actions like running tests, deleting suites, or adding labels. 

## Overview

The selective test suite feature provides:

- **Checkbox Selection**: Choose individual test suites or select all
- **Bulk Actions**: Perform actions on multiple suites simultaneously
- **Filtered Execution**: Run only the tests you've selected

## Selecting Test Suites

### Individual Selection

1. **Navigate to Test Suites**
   - Go to your Test Suite dashboard
   - The test suites have a checkbox on the top for multi selection

### Bulk Selection Options

#### Select All Suites
```
☑️ Select All (at the top of the list)
```
- Checkbox at the top of the suite list
- Selects all visible test suites on the current page
- Useful for applying actions to your entire test collection

#### Select by Filter
1. Apply filters (status, tags, creation date, etc.)
2. Use "Select All" to choose all filtered results
3. Only suites matching your criteria will be selected

## Available Actions

Once you've selected test suites, several bulk actions become available:

### 1. Run Selected Tests

**Button**: **Run Selector** 

**What it does**:
- Executes all test cases within the selected suites
- Runs tests in sequential order 
- Provides consolidated results for all selected suites

### 2. Delete Selected Suites

**Button**: **Delete Selected**

**What it does**:
- Permanently removes selected test suites
- Deletes all test cases within those suites

**Safety Features**:
- Confirmation dialog before deletion
- Shows list of suites to be deleted

### 3. Add Labels

**Button**: **Add Labels** 

**What it does**:
- Adds labels/tags to selected test suites
- Helps organize and categorize tests

**Sample Label Types**:
- **Priority**: `high`, `medium`, `low`
- **Category**: `smoke`, `regression`, `integration`
- **Custom**: Any custom label you define

## Best Practices

   - Verify all intended suites are selected
   - Check that no critical tests are missing
  
## Related Features

- **[Test Suite Management](./api-testing-edit-suites.md)**: Edit and organize test suites
- **[Buggy Test Suites](./api-testing-buggy-suites.md)**: Handle failing test suites
- **[Test Reports](./api-testing-sharing-reports.md)**: View and share execution results
- **[Custom Assertions](./api-testing-custom-assertions.md)**: Define custom validation rules

The selective test execution feature gives you fine-grained control over your test suite management, enabling efficient testing workflows and better resource utilization.