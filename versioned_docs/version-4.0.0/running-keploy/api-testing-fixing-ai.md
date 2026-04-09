---
id: api-testing-fix-with-ai
title: Fix with AI
sidebar_label: Fix with AI
description: Automatically normalize and repair failing test suites using AI
tags:
  - API testing
  - AI automation
  - test normalization
  - test maintenance
  - debugging
keywords:
  - AI test fixing
  - normalize test suite
  - failing tests
  - automated test repair
  - intelligent assertions
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

## Fix with AI

**Fix with AI** helps you automatically repair and normalize failing test suites using intelligent analysis.

Instead of manually editing requests, assertions, or schema mismatches, you can provide instructions to the AI, and it will adjust the suite accordingly.

This significantly reduces test maintenance effort when APIs evolve.

---

## When to Use Fix with AI

Use this feature when:

- A test suite fails after backend changes
- Response fields were renamed or restructured
- Dynamic fields are causing frequent assertion failures
- Schema mismatches occur
- You want to normalize outdated validations
- You want to clean up over-strict assertions

---

## How It Works

1. Navigate to a **Failing Test Suite**
2. Click **Fix with AI**
3. Provide instructions describing what needs to be corrected

Example instructions:
- "Normalize dynamic fields like timestamps and request IDs"
- "Update schema based on latest API response"
- "Ignore volatile metadata fields"
- "Fix assertion mismatches based on new response structure"
- "Relax strict JSON equality checks"

4. Submit your instructions
5. AI analyzes the failure and updates the test suite accordingly

---

## What the AI Can Modify

The AI can intelligently update:

- JSON assertions  
- Schema validations  
- Header validations  
- Status code expectations  
- Dynamic field handling  
- Selected field configurations  
- Request payload mismatches  

It ensures the suite reflects the current API behavior while preserving intended validation logic.

---

## Example Scenario

### Problem
Your API now returns:

```json
{
  "id": 123,
  "email": "user@example.com",
  "createdAt": "2026-02-11T10:30:00Z"
}
```

Previously, your test expected strict equality including `createdAt`.

The test fails due to timestamp variance.

### Instruction to AI
"Normalize dynamic fields like `createdAt` and ignore timestamp differences."

### Result
AI updates the assertion to:

- Use Schema validation instead of strict equality
- Exclude or normalize the `createdAt` field
- Keep critical business validations intact

The test suite now passes without weakening important checks.

---

## Normalization Behavior

When you ask the AI to "normalize" a suite, it may:

- Replace strict JSON Equal with Schema validation
- Convert full-body comparison into Selected Fields
- Remove volatile fields from assertions
- Adjust regex for dynamic headers
- Update expected status codes if API behavior changed intentionally

Normalization focuses on making tests stable without reducing meaningful validation.

---

## Best Practices

- **Be specific in your instructions**
- **Clearly mention which fields should be ignored or updated**
- **Review AI-generated changes before finalizing**
- **Use normalization for dynamic fields, not business logic errors**
- **Keep critical validations strict**