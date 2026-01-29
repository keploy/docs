---
id: test-generate
title: What is API testing?
sidebar_label: Generate Tests
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

# 🧪 AI-Powered API Test Suite Generation

Keploy enables you to automatically generate **comprehensive API test suites** for your application using AI, based on live requests, API schemas, and supporting documentation.

## 🚀 Create API Tests in 4 Simple Steps

### 1️⃣ Create a New App

Start by creating a new test project for your application:

- Click on **"Create New App"**
- Give it a name that matches your app/module
- Optionally provide a description

### 2️⃣ Input URL or Endpoint

Provide a base URL or a specific API endpoint you want to test:

This helps Keploy identify where the API requests are sent and initiate context-aware test generation.

### 3️⃣ Add Test Inputs

#### 🔐 Authentication (Optional)

If your API requires authentication, make sure you:

- Add API keys or bearer tokens in headers
- Or include auth flows via test inputs below

#### 📎 Paste cURL Snippets _(Recommended: 3–5)_

Add working `curl` commands representing real user flows. These help the AI infer request types, payloads, and expected outcomes.

```bash
curl -X POST https://your-api.com/login -d 'username=john&password=secret'

curl -X GET https://your-api.com/users

curl -X PUT https://your-api.com/users/1 -d 'username=john&role=admin'
```

### 📄 Swagger / OpenAPI Schema

Paste your OpenAPI (Swagger) spec in either **YAML** or **JSON** format.  
This schema provides a contract for how endpoints behave and enables accurate, schema-driven test generation.

### 4️⃣ Upload Supporting Resources (Optional but Valuable)

Enhance test accuracy by uploading documentation such as:

- 🧾 **API Docs** (Postman collections, Swagger files)
- 💻 **Code Snippets**
- 📄 **PRD/BRD documents**
- 🗂 **Feature briefs or requirement docs**

These help Keploy better understand the intended logic and behavior of each endpoint.
