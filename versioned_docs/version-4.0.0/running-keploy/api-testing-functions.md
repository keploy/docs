---
id: api-testing-functions
title: Functions & Schema Assertions
sidebar_label: Functions & Assertions
description: Enforce response integrity with schema validation and extend testing logic with Global Custom Functions.
tags:
  - API testing
  - schema assertions
  - custom functions
  - javascript validation
keywords:
  - keploy assertions
  - schema validation
  - global functions
  - api testing logic
---

## ⚡ Why Use Advanced Assertions?

| Challenge                               | ROI & Impact                                                              |
| --------------------------------------- | ------------------------------------------------------------------------- |
| Responses change structure unexpectedly | Schema assertions catch "breaking changes" in data types or missing keys. |
| Business logic requires complex math    | Custom JS functions allow you to validate logic (e.g., A + B = C). |
| Flaky timestamps cause test failures    | Use functions to ignore or normalize dynamic data before comparison. |

## 💥 Assertions vs. Global Functions

| Capability | Schema Assertions | Global Custom Functions |
| :--- | :--- | :--- |
| **Primary Goal** | Validate Data Structure (Types). | Validate Custom Logic/Workflows. |
| **Input** | Selected Response Fields (JSON). | Full Request and Response Objects. |
| **Coding** | No-Code (Select via UI). | JavaScript (Pro-Code). |

## 🚀 Hands-On: Setting Assertions

### **1. Schema Assertions (No-Code)**
Validate that your API consistently returns the correct data types (e.g., `id` is always a number).
1.  **Select Endpoint**: Choose the path (e.g., `/pettypes`) and method (e.g., `POST 201`).
2.  **Select Fields**: Use the field picker to choose exactly which keys to validate (e.g., `name` [string]).
3.  **Save**: Keploy will now enforce these types during every replay.



### **2. Global Custom Functions (JS)**
For validations that require logic beyond simple matching:
* **Create New**: Define a function using the signature `function customFunction(request, response)`.
* **Global Access**: Once saved, these functions can be applied as an assertion type across any suite in your workspace.

## 🛠️ How It Works

| Integration Method | When to Use | How Keploy Works? |
| :--- | :--- | :--- |
| **Field-Level Selection** | When only specific fields matter | Choose specific body fields to check for exact matches, ignoring irrelevant noise. |
| **Status Code Checks** | For basic "Happy Path" testing | Asserts that the response code matches the expected value (e.g., 200 vs 201). |
| **Custom JS Logic** | For dynamic or complex rules | Executes your JavaScript in a secure sandbox during the assertion phase. |

## ✨ Key Features
- **Visual Hierarchy**: Browse your response structure in a nested "Response Fields" tree for easy selection.
- **Bulk Edits**: Apply assertions or status code checks across multiple test steps simultaneously.
- **Fix with AI**: Use AI-assisted repair to normalize failing assertions or suggest logic fixes.

## ✅ Best Practices
- **Minimize Exact Matches**: Use schema assertions for dynamic fields (like IDs) to reduce flakiness.
- **Centralize Logic**: Store repeatable validation rules in **Global Custom Functions** to keep individual tests clean.