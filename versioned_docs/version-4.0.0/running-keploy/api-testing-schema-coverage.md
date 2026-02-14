---
id: api-testing-schema-coverage
title: Schema Coverage and Generation
description: Guide to viewing schema coverage and generating tests for missing coverage
sidebar_label: Schema Coverage
tags:
  - api-testing
  - schema-coverage
  - test-generation
  - schema-validation
  - test-management
---

# Schema Coverage and Generation

This guide explains how to use the schema coverage page in Keploy to analyze your API schema coverage and automatically generate additional test suites to cover missing scenarios.

## Overview

The schema coverage page provides a comprehensive view of how well your test suites cover your API schema. You can compare your original schema with Keploy's generated schema, identify gaps in coverage, and automatically generate tests to fill those gaps.

## Accessing Schema Coverage

### From Test Suite

1. **Navigate to Test Suite**
   - Go to your test suite view
   - Locate the test suite you want to analyze

2. **Click on Schema Coverage**
   - Click on the "Schema Coverage" button or link
   - This will take you to the schema coverage page for that test suite

## Schema Coverage Page Features

### 1. Original Schema View

The original schema section displays:
- **Your API Schema**: The original OpenAPI/Swagger schema or manually defined schema
- **Schema Structure**: Complete API specification including:
  - Endpoints and paths
  - Request/response models
  - Data types and formats
  - Required and optional fields
  - Validation rules and constraints

### 2. Total Coverage Metrics

View comprehensive coverage statistics:
- **Overall Coverage Percentage**: Total schema coverage across all endpoints
- **Endpoint Coverage**: Coverage breakdown by API endpoint
- **Field Coverage**: Percentage of schema fields covered by tests
- **Method Coverage**: Coverage by HTTP methods (GET, POST, PUT, DELETE, etc.)
- **Status Code Coverage**: Which response codes are tested
- **Covered Lines**: Number of schema lines with test coverage
- **Missing Lines**: Number of schema lines without test coverage

### 3. Keploy Generated Schema

The generated schema section shows:
- **Auto-Generated Schema**: Schema derived from recorded API calls
- **Coverage Highlights**: Visual indication of covered vs uncovered parts
- **Field-Level Coverage**: Which fields have been tested
- **Edge Case Identification**: Scenarios that need additional testing

### Side-by-Side Comparison

View original and generated schemas side by side:
```
┌──────────────────────────────────────────────────────────────────┐
│ Schema Coverage Analysis                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Total Coverage: 78% ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░                        │
│                                                                  │
│ ┌─────────────────────────────┬──────────────────────────────┐  │
│ │ Original Schema             │ Keploy Generated Schema      │  │
│ ├─────────────────────────────┼──────────────────────────────┤  │
│ │                             │                              │  │
│ │ /api/v1/users:              │ /api/v1/users:               │  │
│ │   GET: ✅ Covered           │   GET: ✅ Tested             │  │
│ │   POST: ✅ Covered          │   POST: ✅ Tested            │  │
│ │   PUT: ⚠️  Partial          │   PUT: ⚠️  Partial           │  │
│ │   DELETE: ❌ Not Covered    │   DELETE: ❌ Not Tested      │  │
│ │                             │                              │  │
│ │ User Object:                │ User Object:                 │  │
│ │   id: ✅ Covered            │   id: ✅ Found               │  │
│ │   name: ✅ Covered          │   name: ✅ Found             │  │
│ │   email: ✅ Covered         │   email: ✅ Found            │  │
│ │   phone: ❌ Not Covered     │   phone: ❌ Missing          │  │
│ │   address: ❌ Not Covered   │   address: ❌ Missing        │  │
│ │   role: ⚠️  Partial         │   role: ⚠️  Limited values   │  │
│ │                             │                              │  │
│ └─────────────────────────────┴──────────────────────────────┘  │
│                                                                  │
│ Missing Coverage:                                                │
│ • DELETE /api/v1/users/{id} - Not tested                         │
│ • User.phone field - No test cases                               │
│ • User.address field - No test cases                             │
│ • User.role - Only 'user' value tested, missing 'admin', 'guest' │
│                                                                  │
│ [Cover Missing Lines]                                            │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Covering Missing Lines

### Generate Tests for Uncovered Schema

1. **Click "Cover Missing Lines"**
   - Locate the "Cover Missing Lines" button on the schema coverage page
   - Click to open the test generation dialog

2. **Specify Coverage Requirements**
   - Define what you want to cover:
     - **Endpoints**: Select specific endpoints to generate tests for
     - **HTTP Methods**: Choose methods (GET, POST, PUT, DELETE, etc.)
     - **Fields**: Specify schema fields that need coverage
     - **Conditions**: Define specific scenarios or edge cases
     - **Status Codes**: Target specific response codes to test
     - **Data Variations**: Specify value ranges or combinations

3. **Configure Generation Options**

   Example configuration:
   ```
   ┌──────────────────────────────────────────────────────────────┐
   │ Generate Tests for Missing Coverage                          │
   ├──────────────────────────────────────────────────────────────┤
   │                                                              │
   │ Select Endpoints to Cover:                                   │
   │ ☑ DELETE /api/v1/users/{id}                                  │
   │ ☑ PUT /api/v1/users/{id}                                     │
   │                                                              │
   │ Select Fields to Cover:                                      │
   │ ☑ User.phone                                                 │
   │ ☑ User.address                                               │
   │ ☑ User.role (all values)                                     │
   │                                                              │
   │ HTTP Methods:                                                │
   │ ☑ GET  ☑ POST  ☑ PUT  ☑ DELETE                              │
   │                                                              │
   │ Conditions to Test:                                          │
   │ • Valid user deletion                                        │
   │ • Delete non-existent user (404)                             │
   │ • Unauthorized deletion (401)                                │
   │ • Update with phone number                                   │
   │ • Update with address                                        │
   │ • Test all role values: admin, user, guest                   │
   │                                                              │
   │ Expected Status Codes:                                       │
   │ ☑ 200 OK  ☑ 201 Created  ☑ 204 No Content                   │
   │ ☑ 400 Bad Request  ☑ 401 Unauthorized  ☑ 404 Not Found      │
   │                                                              │
   │ Additional Options:                                          │
   │ ☑ Generate edge cases                                        │
   │ ☑ Include validation errors                                  │
   │ ☑ Test field combinations                                    │
   │                                                              │
   │ [Cancel]                           [Generate Test Suites]    │
   │                                                              │
   └──────────────────────────────────────────────────────────────┘
   ```

4. **Generate Additional Test Suites**
   - Click "Generate Test Suites"
   - Keploy will automatically create tests based on your specifications
   - New test suites will be added to your test suite list
   - Coverage metrics will be updated

## Coverage Analysis Features

### Coverage Visualization

- **Heat Map View**: Visual representation of coverage density
- **Color Coding**:
  - 🟢 **Green**: Fully covered (100%)
  - 🟡 **Yellow**: Partially covered (50-99%)
  - 🔴 **Red**: Not covered (0-49%)
- **Interactive Schema Tree**: Expandable schema structure with coverage indicators

### Detailed Coverage Metrics

#### Endpoint-Level Coverage
```
/api/v1/users
├─ GET    ✅ 100% (All fields covered)
├─ POST   ✅ 95%  (Missing: address validation)
├─ PUT    ⚠️  60%  (Missing: phone, address updates)
└─ DELETE ❌ 0%   (No tests)

/api/v1/products
├─ GET    ✅ 100%
├─ POST   ✅ 100%
├─ PUT    ✅ 85%  (Missing: price edge cases)
└─ DELETE ✅ 100%
```

#### Field-Level Coverage
```
User Schema:
├─ id       ✅ 100% (Tested in all operations)
├─ name     ✅ 100% (Valid, empty, special chars)
├─ email    ✅ 100% (Valid, invalid formats)
├─ phone    ❌ 0%   (Not tested)
├─ address  ❌ 0%   (Not tested)
├─ role     ⚠️  33%  (Only 'user' tested)
│   ├─ user  ✅ Covered
│   ├─ admin ❌ Not covered
│   └─ guest ❌ Not covered
└─ createdAt ✅ 100%
```

### Coverage Gaps Identification

Keploy automatically identifies:
1. **Untested Endpoints**: API paths with no test coverage
2. **Missing HTTP Methods**: CRUD operations not tested
3. **Uncovered Fields**: Schema fields never validated
4. **Missing Edge Cases**: Boundary conditions not tested
5. **Incomplete Enum Values**: Not all possible values tested
6. **Error Scenarios**: Missing negative test cases
7. **Optional Fields**: Optional parameters not tested

## Example Use Cases

### Use Case 1: Complete CRUD Coverage

**Current State:**
- GET and POST endpoints covered
- PUT and DELETE not tested

**Action:**
1. Click "Cover Missing Lines"
2. Select PUT and DELETE endpoints
3. Specify conditions:
   - Valid updates
   - Non-existent resource updates
   - Unauthorized access
4. Generate test suites

**Result:**
- Coverage increases from 50% to 100%
- All CRUD operations tested

### Use Case 2: Field Coverage

**Current State:**
- Basic user fields covered (id, name, email)
- Advanced fields not tested (phone, address)

**Action:**
1. Click "Cover Missing Lines"
2. Select missing fields: phone, address
3. Specify conditions:
   - Valid phone formats
   - Invalid phone formats
   - International addresses
   - Empty addresses
4. Generate test suites

**Result:**
- Field coverage increases from 60% to 100%
- All user fields validated

### Use Case 3: Enum Value Coverage

**Current State:**
- User role field only tested with 'user' value
- Missing tests for 'admin' and 'guest'

**Action:**
1. Click "Cover Missing Lines"
2. Select role field
3. Specify all enum values: admin, user, guest
4. Define conditions for each role's permissions
5. Generate test suites

**Result:**
- Role coverage increases from 33% to 100%
- All role-based scenarios tested

## Benefits of Schema Coverage

### Quality Assurance
- **Comprehensive Testing**: Ensure all API contracts are validated
- **Catch Breaking Changes**: Detect schema violations early
- **Contract Compliance**: Verify API matches specification

### Development Efficiency
- **Automated Test Generation**: Generate tests automatically for missing coverage
- **Gap Identification**: Quickly identify untested scenarios
- **Prioritized Testing**: Focus on areas with low coverage

### Documentation
- **Living Documentation**: Schema coverage serves as API documentation
- **Coverage Reports**: Share coverage metrics with stakeholders
- **Trend Analysis**: Track coverage improvements over time

## Best Practices

1. **Regular Coverage Review**
   - Check schema coverage after adding new endpoints
   - Review coverage before releases
   - Set coverage targets (e.g., 80% minimum)

2. **Incremental Coverage Improvement**
   - Start with critical endpoints
   - Gradually increase coverage over time
   - Focus on high-impact areas first

3. **Meaningful Test Generation**
   - Specify realistic conditions when generating tests
   - Include both positive and negative scenarios
   - Test edge cases and boundary conditions

4. **Keep Schema Updated**
   - Update original schema when API changes
   - Re-run coverage analysis after updates
   - Archive old coverage reports for comparison

5. **Combine with Manual Testing**
   - Use auto-generation for basic coverage
   - Add manual tests for complex scenarios
   - Review and refine generated tests

## Coverage Metrics and Goals

### Recommended Coverage Targets

- **Critical Endpoints**: 95-100% coverage
- **User-Facing APIs**: 90-95% coverage
- **Internal APIs**: 80-90% coverage
- **Experimental Features**: 70-80% coverage

### Monitoring Coverage Trends

Track coverage over time:
```
Coverage History:
├─ Jan 2026: 45% ────────────────────────▒▒▒▒▒▒▒▒▒▒▒
├─ Feb 2026: 62% ──────────────────────────────▒▒▒▒▒
└─ Mar 2026: 78% ────────────────────────────────────▒▒
   Goal:     90% ──────────────────────────────────────────
```

## Integration with Test Workflow

1. **Record API Calls** → Test suites created
2. **View Schema Coverage** → Identify gaps
3. **Generate Missing Tests** → Fill coverage gaps
4. **Run Tests** → Validate coverage
5. **Review Results** → Iterate and improve

## Exporting Coverage Reports

- **Export Options**: PDF, HTML, JSON, CSV
- **Include in CI/CD**: Generate coverage reports in pipelines
- **Share with Team**: Distribute coverage metrics
- **Compliance Reports**: Document API testing completeness

By leveraging schema coverage analysis and automated test generation, you can ensure comprehensive API testing, maintain high code quality, and quickly identify and address testing gaps in your application.