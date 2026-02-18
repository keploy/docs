---
id: api-testing-variables
title: Variables in API Testing
sidebar_label: Variables
description: Capture, store, and reuse dynamic data across test steps to build complex API workflows.
---

## A. Variables: Implementation & Data Chaining

Variables in Keploy act as placeholders for dynamic data that changes between test executions, primarily facilitating **"Data Chaining."** This is a deep-tech requirement where the response from one API (like an `owner_id`) provides the necessary input for a subsequent request.

- **Extraction**: You must map response fields to variable names in the **Variables** tab of the **Edit Test Step** panel.
- **Injection**: Reference these values in URLs or headers using the double-curly brace syntax: `{{variable_name}}`.
- **Global vs. Suite Scope**: Suite variables are captured from previous steps, while Global variables are persistent constants like base URLs or environment keys.

## Hands-On: Implementation

### 1. Extraction from Responses
To reuse data from a response, map it in the Variables tab of a test step. Use the syntax `steps["Step_Name"].response.body.path` to target specific data.

![Variable Extraction](/static/img/var-extraction.png)

Keploy automatically flags variables that are defined but not yet referenced in your request to help maintain clean test suites.

### 2. Injection into Requests
Once defined, variables can be injected into URLs, Headers, or Request Bodies using the double-curly brace syntax.

![Variable Injection](/static/img/var-injection.png)

### 3. Global Variable Management
Global variables serve as the source of truth for your environment. They can be static strings or dynamic functions that generate data on the fly.

![Global Variables](/static/img/global-vars.png)