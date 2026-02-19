---
id: api-testing-functions
title: Functions & Schema Assertions
sidebar_label: Functions & Assertions
description: Enforce response integrity with schema validation and extend testing logic with Global Custom Functions.
---

## B. Functions & Assertions: Logic & Integrity

Assertions define the **"Pass/Fail"** criteria for your tests. While standard checks confirm status codes, comprehensive auditing requires validating data integrity through **Schema** and **Logical** validations.

- **Schema Assertions**: These verify that an API consistently returns the correct data types (e.g., string, integer), preventing breaking changes from reaching production.
- **Custom Functions**: Use these for complex logic that simple matching cannot handle, such as verifying if a timestamp falls within a specific range.
- **Global Functions**: Repeatable logic can be saved to the Global library for team-wide reuse.



## Hands-On: Schema Assertions

### 1. Selecting Fields to Assert
Choose specifically which parts of a JSON response Keploy should validate during a replay.

![Schema Assertion UI](/static/img/schema-assertion.png)

**Example Context:** In this window, we are targeting a `GET` request on the `/visits/-1` endpoint that expects a `400` status code. Under **Response Fields**, specific keys like `className` and `exMessage` are selected. Toggling these ensures Keploy validates that these fields are returned as the correct data type (strings) during every replay.

### 2. Multi-Type Assertions
Stack different assertion types, such as verifying a status code while simultaneously checking if a specific field contains a certain value.

![Multi-Assertion Setup](/static/img/multi-assertion.png)

**Example Context:** This setup enforces two rules simultaneously:
1. **Status Code**: Validates that the server returns a `201` (Created).
2. **JSON Contains**: Specifically checks the `city` header/field to ensure it matches the expected value `"sometown"`.

## Custom & Global Functions

### 1. Writing Inline Logic
Access the `request` and `response` objects directly to create complex rules within the assertion panel.

![Custom Function Editor](/static/img/custom-function.png)

**Example Context:** The editor shows a function signature: `function customFunction(request, response)`. This gives you direct access to the full objects, allowing you to write JavaScript logic to determine if the test should pass based on dynamic conditions.

### 2. Global Function Library
Save repeatable validation rules to the Global Custom Functions library so they can be reused across your entire development team.

![Global Function Library](/static/img/global-functions.png)

**Example Context:** The library shows reusable logic stored globally. For example, the `customFunction` at the bottom demonstrates an `assert.greater(response.status, 399)` utility, creating a standardized rule to verify error-level status codes across multiple suites.