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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide explains how to use the schema coverage page to analyze your API schema coverage and automatically generate additional test suites to cover missing scenarios.

## Overview

The schema coverage page provides a comprehensive view of how well your test suites cover your API schema. You can compare your original schema with Keploy's generated schema, identify gaps in coverage, and automatically generate tests to fill those gaps.

## Accessing Schema Coverage

1. **Navigate to Test Suite**
   - Go to your test suite view
   - Click on the "Schema Coverage" button

2. **Click on Schema Coverage**
   - Click on the "Schema Coverage" button or link

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
│ Total Coverage: 78% ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░                         │
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
│                                                                 │
│ [Cover Missing Lines]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Covering Missing Lines

1. **Click "Cover Missing Lines"**
   - Locate the "Cover Missing Lines" button on the schema coverage page

2. **Specify Coverage Requirements**
   - Define what you want to cover:
     - **Endpoints**: Select specific endpoints to generate tests for
     - **HTTP Methods**: Choose methods (GET, POST, PUT, DELETE, etc.)
     - **Fields**: Specify schema fields that need coverage
     - **Conditions**: Define specific scenarios or edge cases
     - **Status Codes**: Target specific response codes to test
     - **Data Variations**: Specify value ranges or combinations


## Coverage Visualization

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

### Coverage Gaps Identification

Keploy automatically identifies:
1. **Untested Endpoints**: API paths with no test coverage
2. **Missing HTTP Methods**: CRUD operations not tested
3. **Uncovered Fields**: Schema fields never validated
4. **Missing Edge Cases**: Boundary conditions not tested

By leveraging schema coverage analysis and automated test generation, you can ensure comprehensive API testing, maintain high code quality.