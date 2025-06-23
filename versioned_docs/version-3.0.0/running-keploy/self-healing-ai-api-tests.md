---
id: self-healing-ai-api-tests
title: Self-Healing API Tests
sidebar_label: Self-Heal API Tests
description: Automatically update failing API test cases using Keploy AI.
tags:
  - API testing
  - test automation
  - AI testing
  - self-healing
  - flaky test repair
keywords:
  - fix failing tests
  - heal test cases
  - keploy ai testing
---

Keploy can automatically fix failing test cases using its built-in AI engine. This is useful when:

- Your API responses have changed slightly (e.g. new fields, formats)
- Assertion mismatches are minor
- You want to fix many tests without editing them one-by-one

### 🔧 How to Use Self-Healing

1. **Go to the Test Report**

   - Navigate to the test report where failures are listed.

2. **Click on a Failed Test**

   - Open the specific failing test case you'd like to fix.

3. **Click "Fix with AI"**

   - This will trigger Keploy AI to update the assertions based on the current API response.

4. _(Optional)_ **Add Context**

   - You can provide hints or expectations to help the AI fix it more precisely.

5. _(Optional)_ **Bulk Fix**

   - From the **Test Suites** page, select multiple suites and click **"Fix with AI"** to heal them all in one go.

6. **Wait for AI to Heal**

   - The process may take a few seconds to complete.

7. **Find Updated Tests**
   - Revisit the **Test Suites** page to view the newly healed tests.

### ✅ Best Practices

- Use AI healing after any significant backend changes.
- Review the updated assertions to ensure correctness.
- Combine healing with test deduplication to keep your suite clean.

[//]: # "You can read more on [Test Reports](/docs/running-keploy/review-and-improve-ai-generated-tests) or [Running Tests](/docs/running-keploy/run-ai-generated-api-tests)."
