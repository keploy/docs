---
id: api-testing-variables
title: Variables in API Testing
sidebar_label: Variables
description: Capture, store, and reuse dynamic data across test steps to build complex API workflows.
---

## A. Variables: Implementation & Data Chaining

Variables in Keploy act as placeholders for dynamic data that changes between test executions, primarily facilitating **"Data Chaining."** This allows you to create advanced workflows where the response from one API (such as an `owner_id` generated during a creation step) provides the necessary input for a subsequent request, such as updating or deleting that specific record.

- **Extraction**: This involves identifying specific data points within an API response—such as an ID, a token, or a status string—and mapping them to a unique variable name in the **Variables** tab of the **Edit Test Step** panel.
- **Injection**: Once a variable is captured, it can be dynamically inserted into subsequent URLs, Headers, or Request Bodies using the double-curly brace syntax: `{{variable_name}}`.
- **Global vs. Suite Scope**: 
    - **Suite Variables**: These are ephemeral and captured from previous steps within a specific test suite run to maintain state across a single workflow.
    - **Global Variables**: These are persistent constants, such as base URLs, environment-specific keys, or static authentication tokens, available across all suites in the workspace.

## Hands-On: Implementation

### 1. Extraction from Responses
To reuse data, you define a mapping that tells Keploy exactly where to look in a previous response. 

![Variable Extraction](/static/img/var-extraction.png)

**Example Context:** In the view above, we are extracting the unique ID of a record. The mapping `steps["Create_Owner"].response.body.id` captures the value from the **Create_Owner** step. Note the **Unused** badge; Keploy provides this visual hint when a variable has been defined but hasn't been injected into any subsequent request yet.

### 2. Injection into Requests
Injection allows you to replace static values with dynamic variables, ensuring your tests remain flexible across different environments and data states.

![Variable Injection](/static/img/var-injection.png)

**Example Context:** This view shows the **Request Details** for an API call to the `/owners` endpoint. By defining the method (e.g., **POST**), you can then use placeholders like `{{owner_id}}` in the URL path or body. Keploy will automatically swap the placeholder with the actual value captured during test execution.

### 3. Global Variable Management
Global variables serve as the centralized source of truth for your testing environment.

![Global Variables](/static/img/global-vars.png)

**Example Context:** The **Global Variables** dashboard allows you to manage workspace-wide data. This includes static entries like the **base URL** and dynamic **Global Custom Functions**. For instance, `generateCompanyId()` is a function that returns a unique string starting with `COMP_` followed by a timestamp, ensuring unique identifiers for every test run.