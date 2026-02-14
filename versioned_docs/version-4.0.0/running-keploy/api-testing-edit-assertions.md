---
id: api-testing-edit-assertions
title: Editing Test Suites and Custom Assertions
description: Guide to editing test suites with custom variables and assertion functions
sidebar_label: Edit Assertions
tags:
  - api-testing
  - edit-assertions
  - custom-variables
  - custom-functions
  - test-management
---

# Editing Test Suites and Custom Assertions

This guide explains how to edit test suites in Keploy, including adding custom variables to URLs and request bodies, and creating custom assertion functions for advanced test validation.

## Overview

Editing a test suite allows you to:

- Modify API request details (URL, headers, body, method)
- Create and manage **global** and **local** variables
- Update or replace existing assertions
- Add **custom assertion functions**
- Write reusable validation logic for request or response

This gives you fine-grained control over how your APIs are validated.


## Accessing Test Suite Edit Mode

### Step 1: Navigate to Test Suites

1. Go to your **Test Suites**
2. Click on the **Test Suite** 
3. Locate the suite you want to modify

### Step 2: Open Test Step Editor

#### Using Three Dots Menu

1. Click the **three dots (⋮)** next to the test suite
2. Select **"Edit Test Step"**
3. The Test Step Editor will open

Editing the Request

Inside the Test Step Editor, you can modify:

```yaml
Method: GET
URL: https://api.example.com/users/{{user_id}}

Headers:
  Authorization: Bearer {{auth_token}}

Body:
  email: "{{email}}"
```

You can:

- Change HTTP method
- Update endpoint path
- Modify headers
- Edit JSON payload
- Inject variables into any field

### Using Variables for dynamic tests

For understanding how to use variables : 

## Editing Existing Assertions
You can choose from multiple assertion categories:
- Status Code Assertion
- Header Assertion
- Body / JSON Path Assertion
- Schema Assertion
- Adding Custom Assertions: For custom assertions using functions refer: 


