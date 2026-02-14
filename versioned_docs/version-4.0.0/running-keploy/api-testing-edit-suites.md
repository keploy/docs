---
id: api-testing-edit-suites
title: Edit Test Suites
sidebar_label: Edit Test Suites
description: Editing test suites for API tests
tags:
  - API testing
  - webhooks
  - integration
  - custom validation
  - policy enforcement
keywords:
  - webhook
  - API testing
  - PreExecute
  - PostExecute
  - external validation
  - custom logic
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide will help you edit test suites in Keploy to customize your API testing workflow.

## Editing Test Suite Details

To modify test suite settings like name and description:

1. Navigate to your test suite in the Keploy dashboard
2. Click on the **three dots (⋯)** helper menu in the test suite you want to modify
3. Select **"Edit Suite"** from the dropdown menu
4. Update the suite name, description, and other details as needed
5. Save your changes

## Editing Individual Test Steps

To modify specific test requests and responses:

1. Go to the individual test step within your test suite
2. Click on **"Edit Step"** to open the test editor
3. You can now modify:
   - Request details (URL, headers, body, parameters)
   - HTTP method
   - Request payload

### Adding and Editing Assertions

Assertions help validate your API responses. To add or edit assertions:

1. In the test step editor, navigate to the assertions section
2. Add new assertions or modify existing ones
3. You can validate:
   - Response status codes
   - Response body content
   - Response headers

### Custom Functions in Assertions

Keploy supports custom functions for advanced assertion logic. You can:

- Create custom validation functions
- Use JavaScript expressions for complex validations
- Reference external validation logic

For detailed information on custom functions, [reference here](#).
### Creating and Using Variables

Variables allow you to create reusable values across your test suite:

1. **URL Base Path Variables**: Define base URLs that can be reused across multiple tests
2. **Environment Variables**: Set different values for different testing environments
3. **Dynamic Variables**: Create variables that change during test execution

## How to Create Variables

For in detail usage of variables refer here : 

## Best Practices

- **Use descriptive names**: Give your test suites and individual tests clear, descriptive names that explain their purpose
- **Group related tests**: Organize tests logically within suites (e.g., user authentication, payment processing, etc.)
- **Keep suites focused**: Each test suite should test a specific feature or workflow
- **Test multiple aspects**: Include assertions for status codes, response structure, and business logic
