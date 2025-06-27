---
id: review-and-improve-ai-generated-tests
title: Review & Improve AI-Generated API Tests
sidebar_label: Review & Improve Tests
description: Learn how to inspect, edit, self-heal, and enhance Keploy’s AI-generated API test suites for maximum coverage and reliability.
---

After you’ve generated a starter test suite with Keploy’s AI engine, the next step is to review, refine, and harden those tests so they stay trustworthy as your API evolves.

## Open the Test Review Workspace

Head to the Keploy Console → API Test Generation › Test Suite
Based on the app that is selected, you can view the test suite for that app

## Filtering by Status, Method & Endpoint

Use the **Filter Options** bar in the left **Test‑Suites** pane to slice large suites down to exactly what you need:

| **Filter Tab**  | **How It Helps**                                                                           |
| --------------- | ------------------------------------------------------------------------------------------ |
| **Status Code** | Type `2` to list every 2xx, `30` for redirects, or an exact code like `404`.               |
| **HTTP Method** | Toggle to isolate `GET`, `POST`, `PUT`, `DELETE`, and other verbs.                         |
| **Endpoint**    | Start typing a path fragment (e.g. `/orders`, `/auth`) to instantly narrow matching flows. |

You can **combine these filters** with the search bar—for example, view only failed `DELETE` calls on eg: `/employees`—making it painless to triage huge test suites.

## Edit Test Step – Request & Assertions

Keploy lets you refine both the **request definition** and the **assertions** from a single modal:

1. Click the ✏️ **Edit** icon on any step card.
2. The modal opens with two tabs:

### 📨 Request Details

- Change the HTTP method (`GET`, `POST`, …)
- Update the URL path
- Add or remove headers via `＋ Add Header`
- Edit the request body (JSON, form‑data, etc.)

### ✅ Assertions

- Append new checks with `＋ Add Assertion`
- Pick the assertion type:
  - Status Code
  - Header Equal / Contains
  - Body JSONPath
  - Regex
  - Numeric `>` / `<`, etc.
- Modify comparators or expected values in‑place

### Save & Rollback

Hit **Save Changes** – every edit is version‑controlled so you can roll back anytime.

## 📚 Assertion Types & Examples

Keploy supports nine assertion primitives out-of-the-box.  
Mix-and-match them as needed—every example below can live inside the same `assertions:` array of a test step.

| **Type**              | **What It Checks**                                     | **YAML Snippet**                                                                                           | **Passing Example**                                                          |
| --------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Status Code**       | Response code equals an exact number.                  | `yaml<br>- type: status_code<br>  comparator: equal<br>  expected: 201<br>`                                | `POST /users` returns **201 Created**                                        |
| **Status Code Class** | Response code falls within a class (2xx, 3xx …).       | `yaml<br>- type: status_code_class<br>  comparator: equal<br>  expected: 2xx<br>`                          | `PATCH /users/42` → **204 No Content**                                       |
| **Status Code In**    | Response code is one of a whitelist of codes.          | `yaml<br>- type: status_code_in<br>  expected: [200, 201, 202]<br>`                                        | Upload API may respond with **202 Accepted** while processing async          |
| **JSON Equal**        | **Entire** JSON body matches exactly (order-agnostic). | `yaml<br>- type: json_equal<br>  expected:<br>    id: 42<br>    status: "shipped"<br>`                     | Warehouse service returns `{ "status": "shipped", "id": 42 }`                |
| **JSON Contains**     | Body **contains** a subset of fields/values.           | `yaml<br>- type: json_contains<br>  expected:<br>    status: "error"<br>    message: "invalid token"<br>`  | Auth service returns a long error payload that **includes** those two fields |
| **Header Contains**   | Specific header **includes** a substring.              | `yaml<br>- type: header_contains<br>  field: content-type<br>  expected: json<br>`                         | `content-type: application/**json**; charset=utf-8`                          |
| **Header Equal**      | Header equals an exact value (case-insensitive).       | `yaml<br>- type: header_equal<br>  field: cache-control<br>  expected: "no-store"<br>`                     | `cache-control: No-Store` (case doesn’t matter)                              |
| **Header Exists**     | Header key is present (value ignored).                 | `yaml<br>- type: header_exists<br>  field: x-request-id<br>`                                               | Reverse-proxy injects `x-request-id: 4b087…`                                 |
| **Header Matches**    | Header value matches a **regex** pattern.              | `yaml<br>- type: header_matches<br>  field: set-cookie<br>  pattern: "sessionId=.*; Path=/; HttpOnly"<br>` | `set-cookie: sessionId=abc123; Path=/; HttpOnly; SameSite=Lax`               |

> **Tip **  
> Combine multiple assertions in one step to cover status, headers **and** body in a single round-trip. Every assertion is evaluated independently, so one failure pinpoints the exact mismatch.

## Edit and Manage Test Suites

In the Test Suites list, hover over any row to reveal the ︙ (more-options) menu:

**︙ Menu**: Hover over any suite row to reveal options:

- **Add Test Suite** – Create a new suite and give it a clear, descriptive title.
- **Select Test Suite** – Choose an existing suite for running or further changes.
- **Edit Test Suite** – Update the suite’s name, description, or included tests.
- **Delete Test Suite** – Permanently remove a suite you no longer need.

All changes are saved instantly and logged.
⚠️ Deletion is irreversible. Use Git history or backups to restore.
