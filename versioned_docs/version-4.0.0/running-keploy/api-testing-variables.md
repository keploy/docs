---
id: api-testing-variables
title: Variables in API Testing
sidebar_label: Variables
description: Capture, store, and reuse dynamic data across test steps to build complex API workflows.
tags:
  - API testing
  - context variables
  - global variables
  - test automation
  - dynamic data
keywords:
  - keploy variables
  - test data reuse
  - api chaining
  - environment variables
---

## 🔗 Why Use Variables?

| Challenge                               | ROI & Impact                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------- |
| Hard-coded IDs lead to brittle tests    | Dynamic IDs allow tests to run repeatedly without manual updates             |
| Manual token management for every run   | Automated auth flow using context variables across steps                     |
| Inconsistent data across environments   | Environment variables allow seamless switching between Dev and Staging       |

## 💥 Understanding Variable Scope

Variables in Keploy follow a hierarchy to ensure the right data is used at the right time:

| Scope | Description | Priority |
| :--- | :--- | :--- |
| **Suite (Context)** | Captured from current or previous test steps (e.g., `steps["Create Vet"].response.body.id`). | **High** (Overrides Global) |
| **Global** | Environment-level constants like `baseUrl` or `apiKey`. | **Medium** |

## 🚀 Hands-On: Managing Variables

AI-powered data management ensures your API flows are connected and dynamic. Use the `{{variable_name}}` syntax to reference any defined variable in your Headers, URL, or Body.

### **Capturing Data from Steps**
In the **Edit Test Step** panel, you can map response fields to variables:
1.  Navigate to the **Variables** tab in a specific test step.
2.  Define a name (e.g., `vet_id`).
3.  Map it to a response path using the syntax: `steps["Step Name"].response.body.path`.



## 🛠️ How It Works

| Integration Method | When to Use | How Keploy Works? |
| :--- | :--- | :--- |
| **Automatic Chaining** | When Step B needs an ID from Step A | Keploy "extracts" the field from the first response and injects it into the next request. |
| **Global Definitions** | For static URLs and Keys | Defined in Workspace Settings; accessible by every suite in your project. |
| **Environment Profiles** | Switching between local and hosted | Group variables into profiles to swap entire sets of configurations instantly. |

## ✨ Key Features
- **Unused Variable Detection**: The UI flags variables that aren't being referenced in your current step.
- **Inline Editing**: Update request details, headers, and bodies directly while managing variables.
- **Auto-interpolation**: References like `{{vet_id}}` are resolved at runtime.

## ✅ Best Practices
- **Standardized Naming**: Use descriptive names like `adminUserToken` instead of `token1`.
- **camelCase Consistency**: Stick to `userId` for all variable names to avoid PR conflicts.