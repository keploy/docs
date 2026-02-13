---
id: api-testing-filter-suites
title: Using Filtering in Test Suites
description: Guide to add filters for test suites 
sidebar_label: Filter Test Suites
tags:
  - api-testing
  - filter-suites
  - test-suite
  - test-management
---
# Filtering Test Suites

This guide explains how to filter test suites in Keploy to quickly find and manage your API tests. You can apply various filters to narrow down your test suites based on different criteria.

## Available Filter Options

Keploy provides multiple filtering options to help you efficiently locate and organize your test suites:

### 1. Filter by Test Suite
- Filter test suites by their name or identifier
- Quickly locate specific test suites from a large collection
- Use search functionality to find test suites by partial name matching

### 2. Filter by Status Code
- Filter tests based on HTTP response status codes
- Common status code filters:
  - **2xx Success**: 200 OK, 201 Created, 204 No Content, etc.
  - **3xx Redirection**: 301 Moved Permanently, 302 Found, 304 Not Modified, etc.
  - **4xx Client Errors**: 400 Bad Request, 401 Unauthorized, 404 Not Found, etc.
  - **5xx Server Errors**: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, etc.
- Useful for identifying failing tests or specific response patterns

### 3. Filter by HTTP Method
- Filter tests based on the HTTP request method:
  - **GET**: Retrieve data from the server
  - **POST**: Submit data to create new resources
  - **PUT**: Update existing resources
  - **PATCH**: Partially update resources
  - **DELETE**: Remove resources
  - **OPTIONS**: Get communication options
  - **HEAD**: Get headers without body
- Helps organize tests by the type of operation being tested

### 4. Filter by Endpoint
- Filter tests based on the API endpoint or URL path
- Search by:
  - Full endpoint URL
  - Partial path matching
  - Endpoint patterns
- Useful for testing specific API routes or services

## How to Apply Filters

1. **Access the Filter Panel**
   - Navigate to the test suites section in Keploy
   - Look for the filter icon or filter panel

2. **Select Filter Criteria**
   - Choose one or more filter options from the available categories
   - Filters can be combined for more precise results

3. **Apply Filters**
   - Click "Apply" or the filters will be applied automatically
   - The test suite list will update to show only matching results

4. **Clear Filters**
   - Use the "Clear Filters" or "Reset" button to remove all active filters
   - Return to viewing all test suites

## Example Use Cases

### Finding Failed Tests
```
Filter by Status Code: 4xx, 5xx
```
This will show all tests that resulted in client or server errors.

### Reviewing POST Requests
```
Filter by HTTP Method: POST
```
This displays all tests using the POST method.

### Testing a Specific API
```
Filter by Endpoint: /api/v1/users
```
This shows all tests for the users endpoint.

### Combining Filters
```
Filter by:
- HTTP Method: GET
- Status Code: 200
- Endpoint: /api/v1/products
```
This shows all successful GET requests to the products endpoint.

## Benefits of Filtering

- **Faster Navigation**: Quickly find specific tests without scrolling through long lists
- **Better Organization**: Group and view related tests together
- **Debugging Efficiency**: Isolate failing tests or problematic endpoints
- **Test Analysis**: Understand patterns in your API behavior
- **Maintenance**: Easier to update or remove tests for specific endpoints or methods

By using these filtering options, you can efficiently manage and analyze your test suites in Keploy.