---
id: api-testing-suite-settings
title: Test Suite Settings & Actions
description: Complete guide to test suite panel actions including sharing, running, bulk editing, and global configurations
sidebar_label: Suite Settings
tags:
  - api-testing
  - test-suite-management
  - suite-settings
  - bulk-operations
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The test suite panel provides a comprehensive set of actions and settings to manage basic operations like running and sharing tests to advanced features like bulk schema editing and global configurations.

## Overview of Available Actions

The test suite panel provides access to the following key actions:

- **Share Test Suite**: Collaborate with team members by sharing test suites
- **Run Test Suite**: Execute all tests within the suite
- **Bulk Edit Schema Assertions**: Modify assertions across multiple tests
- **Run in CI**: Configure continuous integration execution
- **Global Functions**: Create reusable functions for test suites
- **Add Global Variables**: Define variables accessible across all tests

## Accessing the Test Suite Panel
   - Click on **Test Suites** from the main navigation
   - The suite panel opens with various action buttons and settings tabs

## Action 1: Sharing Test Suites

**Access**: Click the **Share** button in the suite panel

**Sharing Methods**:
- **Team Members**: Share with specific users in your organization
- **Public Link**: Generate a public link for external sharing

## Action 2: Running Test Suites
**Access**: Click the **Run** button in the suite panel

## Action 3: Bulk Edit Schema Assertions
**Access**: Go to **Schema Assertions** tab in the suite panel

**Bulk Operations Available**:
- **Add Assertions**: Apply new assertions to multiple tests
- **Template Application**: Apply assertion templates to selected tests
## Action 4: Add Global Variables

**Access**: Go to **Variables** tab in the suite panel

**Variable Types**:
- **Environment Variables**: Different values per environment
- **Static Variables**: Fixed values across all tests
- **Dynamic Variables**: Generated at runtime
- **Secret Variables**: Encrypted sensitive data

## Action 5: Add to CI

1. **Select CI Platform**
   ```
   Choose CI/CD Platform
   ====================
   
   ☑ GitHub Actions
   ☐ GitLab CI/CD
   ☐ Jenkins  
   ☐ Azure DevOps
   ☐ CircleCI
   ☐ Custom Webhook
   ```
- Use the Generated CI Configuration**
 
## Action 6: Global Functions

**Access**: Go to **Functions** tab in the suite panel

**Function Types**:
- **Pre-request Functions**: Execute before each test
- **Post-response Functions**: Execute after each test response
- **Utility Functions**: Reusable helper functions
- **Validation Functions**: Custom assertion logic
## Related Features

- **[Individual Test Management](./api-testing-edit-suites.md)**: Edit specific tests
- **[Label Management](./api-testing-adding-labels.md)**: Organize with labels
- **[Selective Execution](./api-testing-running-selective.md)**: Run specific tests
- **[Sharing & Reports](./api-testing-sharing-reports.md)**: Share results

The test suite panel provides a comprehensive control center for managing all aspects of your API test suites, from basic execution to advanced automation and collaboration features.