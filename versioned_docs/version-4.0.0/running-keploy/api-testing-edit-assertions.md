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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

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
2. Select **"Edit Test Step"**
3. The Test Step Editor will open

![Edit Assertions](https://keploy-devrel.s3.us-west-2.amazonaws.com/edit-assertions-1.png)

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

## Editing Existing Assertions
You can choose from multiple assertion categories:
- Status Code Assertion
- Header Assertion
- Body / JSON Path Assertion
- Schema Assertion


