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

## Edit or Delete a Test Suite

Manage entire suites easily from the **Test Suites** list:

- **︙ Menu**: Hover over any suite row to reveal options:
  - ✏️ **Rename** – Update the title and description.
  - 📄 **Duplicate** – Clone the suite with all steps and tags.
  - 🗑️ **Delete** – Permanently remove the suite (with confirmation).

All changes are saved instantly and logged.

> ⚠️ Deletion is irreversible. Use Git history or backups to restore.
