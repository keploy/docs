---
id: api-testing-bulk-assertions
title: Bulk Assertions and Schema Validation
description: Guide to performing bulk assertions across multiple endpoints, methods, and status codes
sidebar_label: Bulk Assertions
tags:
  - api-testing
  - bulk-assertions
  - schema-assertions
  - test-validation
  - test-management
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide explains how to perform bulk assertions in Keploy, allowing you to validate multiple test cases across different endpoints, HTTP methods, and status codes simultaneously.

## What are Schema Bulk Assertions?

Schema assertions allow you to validate the structure and format of API responses in bulk so that you can choose specific fields from the entire response body to assert

## How to Perform Bulk Assertions

### 1. Filter Your Test Suites

First, use the filtering options to narrow down the tests you want to assert:
- **Filter by Endpoint**: Select specific API endpoints
- **Filter by HTTP Method**: Choose methods like GET, POST, PUT, DELETE, etc.
- **Filter by Status Code**: Filter by response status codes (2xx, 4xx, 5xx, etc.)
- **Filter by Test Suite**: Select specific test suite collections

### 2. Choose Assertion Fields

Select the configure schema assertions option
From the entire response body, you can choose which fields to assert:
- **Response Body Fields**: Select individual fields from the JSON response
- **Data Types**: Ensure fields have correct types (string, number, boolean, etc.)
- **Required Fields**: Verify that mandatory fields are present

### 4. Apply Schema Assertions

Schema assertions validate the structure of your API responses:
- **Field Presence**: Ensure required fields exist in the response
- **Data Type Validation**: Verify that fields have the correct data type
- **Format Validation**: Check formats like email, URL, date, etc.

### 5. Save and Execute

- Review the selected assertions
- Apply the assertions to all selected test cases
- Execute the tests to validate against the defined schema

## Example Use Cases

### Example: Asserting User Endpoints
```
Filter by:
- Endpoint: /api/v1/users/*
- HTTP Method: GET
- Status Code: 200

Bulk Assert:
- Response contains: id, name, email
- Data types: id (number), name (string), email (string)
- Email format validation
```


## Benefits of Bulk Assertions

- **Time Efficiency**: Apply assertions to multiple tests simultaneously
- **Consistency**: Ensure uniform validation across similar endpoints
- **Maintainability**: Update assertions for multiple tests at once

## Tips for Effective Schema Assertions

- **Keep schemas DRY**: Reuse common schema patterns across different endpoints
- **Test edge cases**: Include assertions for empty arrays, null values, and optional fields
- **Validate error responses**: Ensure error messages follow a consistent schema
- **Use realistic data**: Test with production-like data for accurate validation
- **Regular updates**: Update schemas when API contracts change

By leveraging bulk assertions and schema validation, you can ensure comprehensive API testing while minimizing manual effort and maintaining high test coverage across your application.