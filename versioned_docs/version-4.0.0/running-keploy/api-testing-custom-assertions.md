---
id: api-testing-custom-assertions
title: Custom Assertions
sidebar_label: Custom Assertions
description: Define powerful validation rules for your API tests in Keploy
tags:
  - API testing
  - assertions
  - validation
  - schema validation
  - automation
keywords:
  - status code validation
  - JSON assertions
  - header validation
  - schema validation
  - custom functions

---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

Custom assertions allow you to precisely validate API responses beyond basic status checks.

Keploy supports the following assertion categories:

| Scenario | Recommended Assertion |
|----------|----------------------|
| Exact status code validation | Status Code |
| Accept any success response | Status Code Class |
| Partial JSON validation | JSON Contains |
| Strict field validation | JSON Equal |
| Response structure consistency | Schema |
| Dynamic value comparison | Custom Function |
| Validate only important fields | Selected Fields |
| Security header enforcement | Header Exists / Header Equal |


## For specific Selected Fields

### Selected Fields
Allows you to validate only specific parts of a response instead of the entire body.

Useful when:
- Response includes dynamic metadata
- You want to ignore volatile fields (timestamps, request IDs, etc.)
- Only certain business-critical fields matter

## Custom Functions (Advanced Validation)

For complex validation logic, Keploy supports custom functions inside assertions.

Custom functions allow you to:
- Write JavaScript expressions
- Perform conditional validation
- Compare multiple fields
- Validate dynamic calculations
- Enforce business rules

### Example Use Cases
- Validate `totalAmount = sum(lineItems)`
- Ensure timestamp is within last 5 minutes
- Compare response field with environment variable
- Validate custom encryption or hashing logic

### Example: E-commerce Order Validation

Consider an e-commerce API that returns order details. You want to validate that the total amount equals the sum of all line items plus tax.

**API Response:**
```json
{
  "orderId": "ORD-12345",
  "items": [
    { "name": "Laptop", "price": 1200.00, "quantity": 1 },
    { "name": "Mouse", "price": 25.50, "quantity": 2 }
  ],
  "subtotal": 1251.00,
  "tax": 125.10,
  "total": 1376.10,
  "timestamp": "2026-02-11T10:30:00Z"
}
```

**Custom Function for Total Validation:**
```javascript
// Validate that total = subtotal + tax
function validateOrderTotal(response) {
  const data = JSON.parse(response.body);
  const expectedTotal = data.subtotal + data.tax;
  const actualTotal = data.total;
  
  return {
    passed: Math.abs(expectedTotal - actualTotal) < 0.01, // Handle floating point precision
    message: `Expected total ${expectedTotal}, but got ${actualTotal}`
  };
}

// Validate that subtotal matches sum of line items
function validateSubtotal(response) {
  const data = JSON.parse(response.body);
  const calculatedSubtotal = data.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return {
    passed: Math.abs(calculatedSubtotal - data.subtotal) < 0.01,
    message: `Calculated subtotal ${calculatedSubtotal}, but API returned ${data.subtotal}`
  };
}
```

**Usage in Keploy:**
1. Navigate to your test step editor
2. Add a new assertion
3. Select "Custom Function" as assertion type
4. Paste your custom function code
5. The function will execute during test runs and validate your business logic

## Best Practices

- **Prefer Schema validation** for dynamic APIs
- **Use JSON Equal** only when strict comparison is necessary
- **Avoid over-validating** volatile fields
- **Use Custom Functions** for business logic validation
- **Combine multiple assertions** for stronger test reliability
- **Keep assertions focused and readable**
