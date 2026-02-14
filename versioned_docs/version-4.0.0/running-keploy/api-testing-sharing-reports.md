---
id: api-testing-sharing-reports
title: Sharing Reports
sidebar_label: Sharing Reports
description: Share API test execution reports securely within your workspace
tags:
  - API testing
  - reports
  - collaboration
  - workspace
  - access control
keywords:
  - internal report sharing
  - workspace collaboration
  - API test results
  - team access
  - execution reports
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

## Sharing Reports

Keploy allows you to securely share test execution reports with members inside your workspace.

## How Report Sharing Works

Reports can be shared in two ways:

### 1. Share with Existing Workspace Members

1. Navigate to a completed **Test Run**
2. Open the execution report
3. Click the **Share** option
4. Select a team member from your workspace
5. Confirm sharing

The selected user will gain access to view the report inside their dashboard.


### 2. Add a New User and Share

If the person is not yet part of your workspace:

1. Click **Add User**
2. Enter their details
3. Add them to your company workspace
4. Share the report with them

Once added, they become a workspace member and can access shared reports based on permissions.


## What Shared Reports Include

When you share a report, the recipient can view:

### Execution Summary
- Total test cases executed
- Passed / Failed count
- Execution duration
- Environment details
- Step-Level Results
- Request & Response Details

## Best Practices

- Share reports instead of exporting logs
- Add relevant team members directly from the dashboard
- Maintain proper role-based access control
- Review assertion-level failures before escalating issues
- Remove access when no longer required
