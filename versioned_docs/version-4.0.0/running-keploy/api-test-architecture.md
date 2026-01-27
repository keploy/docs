---
id: api-test-architecture
title: Behind the Scenes
sidebar_label: Behind the Scenes
description: How Keploy turns your schema and API requests into edge-case API tests—instantly.
tags:
  - api testing
  - architecture
  - OpenAPI
  - curl
---

# 🛠️ API Testing Architecture

With Keploy, go from API specs to real, production-grade API tests—**instantly!**  
Here’s how our architecture works under the hood.

![Keploy API Testing Architecture](https://res.cloudinary.com/dfhtr1rwo/image/upload/v1748784682/keploy-api-arch_i3hjco.png)

> _From schema and cURL to edge-case API tests, pass/fail tracking, and detailed diffs—all automated._

## 📋 Requirements to Get Started

You can use Keploy’s API testing for **any application, in any language**.  
To generate the most valuable and accurate test cases, you’ll need:

### 1. Upload Your OpenAPI Schema (Swagger)

_Why?_  
This gives Keploy a detailed map of your API endpoints, making test generation much smarter and more precise.

### 2. Drop in Your cURL Commands

_Why?_  
Your real-world cURL requests show Keploy how your APIs are actually used, covering positive, negative, and edge cases.

### 3. Make Your App Publicly Accessible (Ngrok Works Great!)

_Why?_  
Keploy needs to interact with your live API endpoints to generate and validate tests. Tools like Ngrok make this easy, even for local apps.

## ⚡ How Keploy Turns Your Inputs Into API Tests

- Upload your OpenAPI schema, API docs, and cURL requests.
- Keploy analyzes these to auto-generate edge case test cases—covering positive, negative, and neutral scenarios.
- Tests are run, tracked, and diffs are shown so you can catch issues instantly.
- Results are visible at a glance: what passed, what failed, and what needs fixing.

Ready to try it? [app.keploy.io](https://app.keploy.io)

Questions? [Contact our team](mailto:support@keploy.io).
