---
id: api-testing-functions
title: Functions & Schema Assertions
sidebar_label: Functions & Assertions
description: Enforce response integrity with schema validation and extend testing logic with Global Custom Functions.
---

## B. Functions & Assertions: Logic & Integrity

Assertions define the **"Pass/Fail"** criteria. While standard checks confirm status codes, deep-tech auditing requires validating data integrity through **Schema** and **Logical** validations.

- **Schema Assertions**: These verify that an API consistently returns the correct data types, preventing breaking changes from reaching production.
- **Custom Functions**: Use these for complex logic that simple matching cannot handle, such as verifying if a timestamp falls within a specific range.
- **Global Functions**: Repeatable logic can be saved to the Global library for team-wide reuse.



## Hands-On: Schema Assertions

### 1. Selecting Fields to Assert
Choose specifically which parts of a JSON response Keploy should validate during a replay.

![Schema Assertion UI](/static/img/schema-assertion.png)

- **API Configuration**: Select the specific endpoint and status code (e.g., `GET 400`) to enforce.
- **Response Fields**: Use the visual tree to toggle checkboxes for mandatory fields.

### 2. Multi-Type Assertions
Stack different assertion types, such as verifying a status code while simultaneously checking if a specific field contains a certain value.

![Multi-Assertion Setup](/static/img/multi-assertion.png)

## Custom & Global Functions

### 1. Writing Inline Logic
Access the `request` and `response` objects directly to create complex rules within the assertion panel.

![Custom Function Editor](/static/img/custom-function.png)

### 2. Global Function Library
Save repeatable validation rules to the Global Custom Functions library so they can be reused across your entire development team.

![Global Function Library](/static/img/global-functions.png)