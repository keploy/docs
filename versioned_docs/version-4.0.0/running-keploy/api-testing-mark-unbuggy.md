---
id: api-testing-mark-unbuggy
title: Mark Test Suite as Unbuggy
description: Guide to marking test suites as unbuggy after fixing issues
sidebar_label: Mark as Unbuggy
tags:
  - api-testing
  - test-management
  - suite-status
  - debugging
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

After resolving issues in a buggy test suite, you can mark it as unbuggy to indicate that the problems have been addressed and the suite is functioning correctly again.

## When to Mark a Suite as Unbuggy

Mark a test suite as unbuggy when:

- All test failures have been resolved
- API endpoints are working as expected
- Schema validations are passing
- Authentication issues have been fixed
- Test assertions are now accurate
- The underlying API issues have been corrected

## How to Mark a Suite as Unbuggy

### Step 1: Navigate to the Test Suite

1. Navigate to the **Test Suites** section
2. Click on the specific test suite you want to mark as unbuggy

### Step 2: Access Suite Options

Once you're on the test suite page:

1. Look for the **three dots (⋮)** menu next to the test suite name
2. Select **"Unmark Buggy"** from the dropdown options

## What Happens When You Mark a Suite as Unbuggy

### Immediate Changes

- **Status Update**: The suite status changes from "Buggy" to "Active" 
- **Future Runs**: The suite will run normally in subsequent test executions
- **Reporting**: The suite will be included in standard test reports
- **Monitoring**: Keploy will continue monitoring the suite for new issues
- **History**: The previous buggy status and resolution are logged in the suite history

### 1. API Endpoint Restored

**Scenario**: A 404 error was resolved by fixing the API endpoint

**Before marking unbuggy**:
```bash
# Verify the endpoint is working
curl -X POST https://api.example.com/owners \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Owner"}'
```

### 2. Schema Issues Fixed

**Scenario**: Response schema validation was fixed by updating the API

**Verification steps**:
1. Check that response format matches expectations
2. Verify all required fields are present
3. Confirm data types are correct

This ensures that suites are automatically marked as unbuggy when automated fixes resolve issues.

Remember: Marking a suite as unbuggy should only be done after thoroughly verifying that all issues have been resolved and the suite is functioning correctly.