---
id: test-run-reports
title: What is API testing?
sidebar_label: Test Report generation
description: This section documents what is API Testing and why we need it
tags:
  - API testing
  - API mocks
  - generate test cases
  - test automation
keywords:
  - api testing
  - api mocks
  - automated testing
  - ai testing
  - keploy
  - Gemini
  - OpenAI
---

# 🧪 Keploy Test Run Reports

Easily track and manage the outcome of your API test runs with detailed reporting on test executions, results, and creators.

## 🔍 Search Test Run Reports

Use the search bar to filter reports by Report ID, creator email, or status.

### 📋 Test Report Summary

- Report ID
- Created At
- Creator
- Total Tests
- Passed
- Failed
- Status

## 🧩 Test Suites

Manage and fine-tune your test suites for each API endpoint. You can edit request inputs, response expectations, and assertion types.

### ✏️ Editable Test Cases

Each test case can be modified to:

- Change the **request payload**, headers, or query parameters
- Edit or update **expected response bodies**
- Select or modify **assertion types**

### 🧪 Supported Assertion Types

| Assertion Type     | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `statusCode`       | Asserts the HTTP status code matches expected (e.g., 200, 404) |
| `bodyContains`     | Checks if the response body includes specific text or keys     |
| `jsonEquals`       | Validates deep equality of the JSON response                   |
| `headerMatch`      | Asserts presence or value of specific response headers         |
| `schemaValidation` | Validates against OpenAPI/JSON schema if available             |
| `custom`           | User-defined scripts or match rules                            |

#### ➕ Example Test Case Structure (YAML)

```yaml
- testName: Get All Users
  method: GET
  endpoint: /users
  expectedStatus: 200
  assertions:
    - type: statusCode
    - type: bodyContains
      value: "username"
    - type: jsonEquals
      expected:
        - id: 1
          username: john_doe
```

### 🧱 Edit Test Step

Easily customize individual test steps to simulate real-world API usage and validate your app’s behavior under different conditions.

#### 🔧 Request Details

Update the request configuration for each test case:

- **Name:**  
  `Create Object P024 Invalid JSON`

- **Method:**  
  `POST`

- **URL Path:**  
  `/objects`

- **Headers:**

  | Key          | Value            |
  | ------------ | ---------------- |
  | Content-Type | application/json |

  You can **Add Header** as needed (e.g., Authorization, Custom-Token).

- **Request Body:**

  ````json
  {
    "name": "AUT Test Object P024",
    "data": {
      "key": "value"
  }
  }```
  ````

### 💾 Actions

- ✅ **Save Changes** — Apply edits to the test step and update the suite.
- ❌ **Cancel** — Discard any unsaved modifications and revert to the last saved state.
