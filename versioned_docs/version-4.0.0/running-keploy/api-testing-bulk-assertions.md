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

# Bulk Assertions and Schema Validation

This guide explains how to perform bulk assertions in Keploy, allowing you to validate multiple test cases across different endpoints, HTTP methods, and status codes simultaneously.

## What are Bulk Assertions?

Bulk assertions enable you to apply validation rules across multiple test suites at once, saving time and ensuring consistency in your API testing. Instead of creating assertions one by one, you can select multiple tests and apply the same assertion criteria to all of them.

## What are Schema Assertions?

Schema assertions allow you to validate the structure and format of API responses. You can choose specific fields from the entire response body to assert, ensuring that your API returns data in the expected format with the correct data types and required fields.

## How to Perform Bulk Assertions

### 1. Filter Your Test Suites

First, use the filtering options to narrow down the tests you want to assert:
- **Filter by Endpoint**: Select specific API endpoints
- **Filter by HTTP Method**: Choose methods like GET, POST, PUT, DELETE, etc.
- **Filter by Status Code**: Filter by response status codes (2xx, 4xx, 5xx, etc.)
- **Filter by Test Suite**: Select specific test suite collections

### 2. Select Tests for Bulk Assertion

- Once filtered, you can select multiple test cases
- Use checkboxes to select individual tests or select all filtered tests
- The selection can span across different endpoints and methods

### 3. Choose Assertion Fields

From the entire response body, you can choose which fields to assert:
- **Response Headers**: Validate specific headers
- **Response Body Fields**: Select individual fields from the JSON response
- **Status Codes**: Assert expected status codes
- **Response Time**: Validate performance metrics
- **Data Types**: Ensure fields have correct types (string, number, boolean, etc.)
- **Required Fields**: Verify that mandatory fields are present

### 4. Apply Schema Assertions

Schema assertions validate the structure of your API responses:
- **Field Presence**: Ensure required fields exist in the response
- **Data Type Validation**: Verify that fields have the correct data type
- **Format Validation**: Check formats like email, URL, date, etc.
- **Nested Object Validation**: Validate complex nested structures
- **Array Validation**: Assert on array properties and elements

### 5. Save and Execute

- Review the selected assertions
- Apply the assertions to all selected test cases
- Execute the tests to validate against the defined schema

## Example Use Cases

### Example 1: Asserting User Endpoints
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

### Example 2: Error Response Validation
```
Filter by:
- Status Code: 4xx, 5xx
- HTTP Method: POST, PUT, DELETE

Bulk Assert:
- Response contains: error, message, statusCode
- Data types: error (boolean), message (string), statusCode (number)
- Required fields: error, message
```

### Example 3: Performance Testing
```
Filter by:
- Endpoint: /api/v1/products
- HTTP Method: GET

Bulk Assert:
- Response time: < 200ms
- Status Code: 200
- Response contains: products (array), total (number)
```

### Example 4: Schema Validation for Multiple Endpoints
```
Select Multiple Endpoints:
- /api/v1/users
- /api/v1/products
- /api/v1/orders

Schema Assertions:
- All responses have: timestamp, success, data
- timestamp format: ISO 8601
- success type: boolean
- data type: object or array
```

## Benefits of Bulk Assertions

- **Time Efficiency**: Apply assertions to multiple tests simultaneously
- **Consistency**: Ensure uniform validation across similar endpoints
- **Maintainability**: Update assertions for multiple tests at once
- **Comprehensive Testing**: Validate complex scenarios across different endpoints
- **Schema Compliance**: Ensure API responses adhere to defined schemas
- **Reduced Errors**: Less manual work means fewer mistakes

## Schema Assertion Features

### Supported Validations

1. **Type Checking**
   - String, Number, Boolean, Object, Array, Null
   - Custom type definitions

2. **Format Validation**
   - Email, URL, UUID, Date, Time, DateTime
   - Custom regex patterns

3. **Range Validation**
   - Minimum and maximum values for numbers
   - String length constraints
   - Array size limits

4. **Required Fields**
   - Mark fields as mandatory
   - Conditional requirements based on other fields

5. **Nested Object Validation**
   - Deep validation of complex structures
   - Array of objects validation

6. **Custom Assertions**
   - Define custom validation logic
   - Combine multiple assertion rules

## Best Practices

1. **Start with Filters**: Use filters to group similar tests before applying bulk assertions
2. **Incremental Assertions**: Start with basic assertions and add more complex ones gradually
3. **Review Before Applying**: Always review the selected tests before applying bulk assertions
4. **Use Schema Templates**: Create reusable schema templates for common response structures
5. **Version Control**: Keep track of schema changes across API versions
6. **Document Assertions**: Add descriptions to complex assertions for team clarity

## Tips for Effective Schema Assertions

- **Keep schemas DRY**: Reuse common schema patterns across different endpoints
- **Test edge cases**: Include assertions for empty arrays, null values, and optional fields
- **Validate error responses**: Ensure error messages follow a consistent schema
- **Use realistic data**: Test with production-like data for accurate validation
- **Regular updates**: Update schemas when API contracts change

By leveraging bulk assertions and schema validation, you can ensure comprehensive API testing while minimizing manual effort and maintaining high test coverage across your application.