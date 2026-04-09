---
id: api-testing-generation-history
title: Test Generation History
description: Guide to viewing and managing test generation history with job tracking and status monitoring
sidebar_label: Generation History
tags:
  - api-testing
  - generation-history
  - test-generation
  - job-tracking
  - test-management
---
import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide explains how to use the generation history to track and manage your test generation jobs. 

## Generation History Features

### Job Information Display

For each generation job, you can view:

1. **Job ID**: Unique identifier for each test generation run
2. **Generation Statistics**:
   - **Accepted**: Number of test suites that passed validation
   - **Recovered**: Number of test suites that were recovered from errors
   - **Rejected**: Number of test suites that failed validation
   - **Buggy**: Number of test suites with identified issues
3. **Input Details**: The inputs and configurations used for that particular generation
4. **Timestamp**: When the generation job was executed
5. **Status**: Overall status of the generation job (Completed, In Progress, Failed)

### Viewing Generation Details

To view details of a specific generation:

1. **Navigate to Generation History**
   - Go to the generation history section in Keploy
   - View the list of all generation jobs

2. **Review Job Statistics**
   - See the breakdown of accepted, recovered, rejected, and buggy test suites

3. **Check Input Parameters**
   - View the inputs used for that generation
   - Review configuration settings and parameters
   - Understand what led to specific results

## Working with Rejected Test Suites

### Adding Rejected Tests to Current Suite

If you find rejected test suites that you want to include:

1. **Locate Rejected Tests**
   - Browse through the generation history
   - Identify jobs with rejected test suites

2. **Click the Plus Icon**
   - Click on the **+** (plus) icon next to any rejected test suite
   - This action will add the rejected test to your current list of test suites

## Understanding Test Statuses

### Accepted Tests ✅
- Tests that passed all validation checks
- Successfully generated and ready to use
- No issues detected in the test suite

### Rejected Tests ❌
- Tests that failed validation checks
- May have incorrect assertions or invalid configurations
- Require manual review and fixes
- Can be added back to the test suite list for modification

### Buggy Tests 🐛
- Tests with identified bugs or issues
- May have inconsistent behavior or errors
- Need investigation and debugging
- Review test logic and inputs

## Example Generation History View

```
┌─────────────────────────────────────────────────────────────────┐
│ Generation History                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Job ID: gen-2026-02-13-001                                      │
│ Timestamp: 2026-02-13 10:30:45                                  │
│ Status: Completed                                               │
│                                                                 │
│ Statistics:                                                     │
│   ✅ Accepted: 45                                               │
│   ❌ Rejected: 8                                                │
│   🐛 Buggy: 3                                                   │
│                                                                 │
│ Inputs Used:                                                    │
│   - Endpoints: /api/v1/users, /api/v1/products                  │
│   - Methods: GET, POST, PUT                                     │
│   - Recording Duration: 5 minutes                               │
│   - Agent: Local Agent v2.1.0                                   │
│                                                                 │
│ Rejected Tests:                                [+] Add to Suite │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Job ID: gen-2026-02-12-005                                      │
│ Timestamp: 2026-02-12 16:22:10                                  │
│ Status: Completed                                               │
│                                                                 │
│ Statistics:                                                     │
│   ✅ Accepted: 32                                               │
│   ❌ Rejected: 15                                               │
│   🐛 Buggy: 7                                                   │
│                                                                 │
│ Inputs Used:                                                    │
│   - Endpoints: /api/v2/orders                                   │
│   - Methods: GET, DELETE                                        │
│   - Recording Duration: 3 minutes                               │
│   - Agent: Browser Extension                                    │
│                                                                 │
│ Rejected Tests:                                [+] Add to Suite │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Analyzing Generation Trends

### Success Rate Analysis
- Track the percentage of accepted vs rejected tests over time
- Identify patterns in test generation quality
- Optimize inputs based on historical data

### Input Optimization
- Review which inputs led to higher acceptance rates
- Compare different configurations and their outcomes
- Refine your test generation strategy

### Error Patterns
- Identify common reasons for test rejection
- Address recurring bugs or issues
- Improve test generation quality

## Best Practices

1. **Regular Review**
   - Check generation history regularly
   - Monitor acceptance rates and trends
   - Address rejected tests promptly

2. **Learn from Rejected Tests**
   - Analyze why tests were rejected
   - Improve input parameters for future generations
   - Document common issues and solutions

3. **Recover and Reuse**
   - Use the plus icon to recover rejected tests
   - Fix and validate rejected test suites
   - Build a comprehensive test coverage

4. **Track Performance**
   - Monitor the number of buggy tests
   - Identify problematic endpoints or methods
   - Improve API stability based on insights

5. **Maintain Clean History**
   - Archive old generation jobs periodically
   - Focus on recent and relevant generations
   - Keep track of successful generation patterns
