---
id: api-testing-adding-labels
title: Adding Labels to Test Suites
description: Guide to creating and assigning labels to test suites individually or in bulk
sidebar_label: Adding Labels
tags:
  - api-testing
  - test-organization
  - labels
  - test-management
---

# Adding Labels to Test Suites

Labels help you organize, categorize, and filter your test suites effectively. Keploy provides flexible labeling options that allow you to add labels to individual test suites or multiple suites at once.

## Overview

The labeling system in Keploy offers:

- **Individual Labeling**: Add labels to specific test suites
- **Bulk Labeling**: Apply labels to multiple suites simultaneously
- **Label Management**: Create, edit, and delete custom labels
- **Filtering**: Use labels to filter and organize your test collection

## Adding Labels to Individual Test Suites

### Method 1: Using the Three Dots Menu

1. **Navigate to Test Suites**
   - Go to your Keploy dashboard
   - Click on the **Test Suites** section

2. **Access Suite Options**
   - Locate the test suite you want to label
   - Click the **three dots (⋮)** menu next to the test suite name
   - The menu appears in the top-right area of each suite row

3. **Select Add Label Option**
   - From the dropdown menu, click **"Add Label"** or **"Manage Labels"**
   - A label management dialog will open

### Method 2: From Suite Details Page

1. **Open Test Suite**
   - Click on the test suite name to open its details page

2. **Find Label Section**
   - Look for the **"Labels"** or **"Tags"** section in the suite header
   - Click the **"+ Add Label"** button

## Label Assignment Interface

When you open the label assignment dialog, you'll see:

### Existing Labels Section
```
🏷️ Available Labels
├── 📊 Priority
│   ├── high-priority
│   ├── medium-priority
│   └── low-priority
├── 🌍 Environment
│   ├── production
│   ├── staging
│   └── development
├── 👥 Team
│   ├── team-frontend
│   ├── team-backend
│   └── team-qa
└── 🔍 Type
    ├── smoke-test
    ├── regression
    └── integration
```

### Assigning Existing Labels

1. **Browse Categories**
   - Expand label categories to see available options
   - Use the search box to find specific labels quickly

2. **Select Labels**
   - Click on labels to select them
   - Selected labels will be highlighted or marked with a checkmark ✓
   - You can select multiple labels from different categories

3. **Apply Labels**
   - Review your selections in the "Selected Labels" preview
   - Click **"Apply Labels"** to assign them to the test suite

## Creating New Labels

### Creating During Assignment

1. **Open Label Dialog**
   - Follow the steps above to open the label assignment interface

2. **Create New Label**
   - Click **"Create New Label"** or the **"+"** button
   - Enter label details in the creation form

3. **Label Creation Form**
   ```
   Label Name: [smoke-critical]
   Category: [Type] (dropdown)
   Color: [🔴] (color picker)
   Description: [Critical smoke tests that must pass]
   ```

4. **Save and Apply**
   - Click **"Create Label"** to save the new label
   - The new label will automatically be selected for the current suite
   - Click **"Apply Labels"** to complete the assignment

### Pre-creating Labels

You can also create labels in advance:

1. **Access Label Management**
   - Go to **Settings** → **Label Management**
   - Or click **"Manage All Labels"** from any label dialog

2. **Create Label Categories**
   ```
   Category: Priority
   Labels: critical, high, medium, low
   
   Category: Environment  
   Labels: prod, staging, dev, local
   
   Category: Team
   Labels: frontend, backend, qa, devops
   ```

## Bulk Label Assignment

### Using Checkbox Selection

1. **Select Multiple Suites**
   - Navigate to the Test Suites list
   - Use checkboxes to select multiple test suites
   - Or click **"Select All"** to choose all visible suites

2. **Access Bulk Actions**
   - After selecting suites, a bulk actions toolbar appears
   - Click **"Add Labels"** or **"Manage Labels"** button

3. **Bulk Label Dialog**
   ```
   Selected Suites: 5 suites
   ├── User Authentication Suite
   ├── Payment Processing Suite  
   ├── Order Management Suite
   ├── Notification Suite
   └── Report Generation Suite
   
   Actions:
   ☐ Add labels (append to existing)
   ☐ Replace labels (remove existing, add new)
   ☐ Remove specific labels
   ```

4. **Choose Action Type**
   - **Add Labels**: Append new labels to existing ones
   - **Replace Labels**: Remove all existing labels and add new ones
   - **Remove Labels**: Remove specific labels from all selected suites

5. **Select Labels**
   - Choose from existing labels or create new ones
   - Preview shows which suites will be affected
   - Click **"Apply to Selected Suites"**

## Label Management Best Practices

### Naming Conventions

1. **Use Consistent Formatting**
   ```
   ✅ Good Examples:
   - team-frontend
   - priority-high
   - env-production
   - type-smoke-test
   
   ❌ Avoid:
   - TeamFrontend
   - HIGH_PRIORITY
   - prod env
   - smoke test type
   ```

2. **Category-Based Organization**
   ```
   Priority: critical, high, medium, low
   Environment: production, staging, development
   Type: smoke, regression, integration, e2e
   Team: frontend, backend, qa, devops
   Status: active, deprecated, experimental
   ```

### Label Hierarchy

Organize labels in a logical hierarchy:

```
🏢 Organization Level
├── 🌍 Environment
│   ├── production
│   ├── staging
│   └── development
├── 👥 Team Ownership
│   ├── team-auth
│   ├── team-payments
│   └── team-notifications
├── 📊 Test Classification
│   ├── type-smoke
│   ├── type-regression
│   └── type-integration
└── ⚡ Priority Level
    ├── priority-p0
    ├── priority-p1
    └── priority-p2
```

## Using Labels for Organization

### Filtering by Labels

1. **Filter Interface**
   ```
   Filters: [Environment: staging] [Team: backend] [Priority: high]
   
   Results: 12 test suites found
   ├── ✅ User Service API Tests (staging, backend, high)
   ├── ✅ Payment Gateway Tests (staging, backend, high)
   └── ✅ Order Processing Tests (staging, backend, high)
   ```

2. **Combine Multiple Filters**
   - Use AND logic: Show suites with ALL selected labels
   - Use OR logic: Show suites with ANY selected labels
   - Exclude labels: Show suites WITHOUT specific labels

### Search by Labels

```
Search Examples:
- label:high-priority
- label:team-frontend OR label:team-backend
- label:smoke-test AND label:production
- -label:deprecated (exclude deprecated suites)
```

## Advanced Label Operations

### Conditional Labeling

Apply labels based on conditions:

```
IF suite.name CONTAINS "auth" 
   THEN add labels: [team-auth, security]

IF suite.environment == "production"
   THEN add labels: [critical, monitored]
   
IF suite.last_run < 30_days_ago
   THEN add labels: [stale, review-needed]
```

### Label Automation

Set up automatic labeling rules:

1. **Auto-labeling on Creation**
   ```yaml
   rules:
     - if: suite_name matches "smoke*"
       labels: [type-smoke, priority-high]
     - if: created_by == "ci-pipeline" 
       labels: [automated, ci-generated]
   ```

2. **Schedule-based Labeling**
   ```yaml
   scheduled_rules:
     - schedule: "daily"
       condition: last_run > 7_days
       action: add_label "needs-attention"
   ```

## Label Analytics and Reporting

### Label Distribution

View how labels are distributed across your test suites:

```
Label Usage Report
==================
📊 Priority Labels:
├── high-priority: 45 suites (23%)
├── medium-priority: 89 suites (45%)  
└── low-priority: 63 suites (32%)

🌍 Environment Labels:
├── production: 67 suites (34%)
├── staging: 78 suites (39%)
└── development: 52 suites (27%)

👥 Team Labels:
├── team-frontend: 34 suites (17%)
├── team-backend: 56 suites (28%)
└── team-qa: 23 suites (12%)
```

### Label-based Success Rates

Track test success rates by label:

```
Success Rate by Label
====================
🏷️ high-priority: 94% success rate
🏷️ team-backend: 89% success rate  
🏷️ production: 97% success rate
🏷️ smoke-test: 92% success rate
```

## Troubleshooting

### Common Issues

1. **Cannot Add Labels**
   - **Check Permissions**: Ensure you have edit access to the test suite
   - **Verify Suite Status**: Make sure the suite isn't currently running
   - **Browser Issues**: Clear cache and refresh the page

2. **Labels Not Appearing**
   - **Refresh View**: Reload the test suites page
   - **Check Filters**: Verify that filters aren't hiding labeled suites
   - **Sync Issues**: Wait a moment for changes to propagate

3. **Bulk Operations Failing**
   - **Selection Limit**: Reduce the number of selected suites
   - **Permission Issues**: Ensure you have bulk edit permissions
   - **Server Load**: Try again during lower usage periods

### Best Practices for Troubleshooting

1. **Start Small**
   - Test labeling with one suite first
   - Gradually increase to bulk operations

2. **Verify Changes**
   - Check that labels appear correctly after assignment
   - Test filtering with newly added labels

3. **Document Issues**
   - Note any error messages for support
   - Record steps that led to the problem

## Integration Examples

### API Usage

```bash
# Add labels via API
curl -X POST "https://api.keploy.io/test-suites/{suite-id}/labels" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "labels": ["high-priority", "team-backend", "production"]
  }'

# Bulk label assignment
curl -X POST "https://api.keploy.io/test-suites/bulk-labels" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "suite_ids": ["suite-1", "suite-2", "suite-3"],
    "action": "add",
    "labels": ["regression", "nightly-run"]
  }'
```

### CI/CD Integration

```yaml
# GitHub Actions example
- name: Label Test Suites
  run: |
    # Label suites based on changed files
    if [[ "${{ github.event_name }}" == "pull_request" ]]; then
      keploy label add --suites $AFFECTED_SUITES --labels "pr-validation"
    fi
    
    # Label based on branch
    if [[ "${{ github.ref }}" == "refs/heads/main" ]]; then
      keploy label add --suites $ALL_SUITES --labels "main-branch"
    fi
```

## Related Features

- **[Test Suite Management](./api-testing-edit-suites.md)**: Edit and organize test suites
- **[Selective Test Execution](./api-testing-running-selective.md)**: Run tests using label filters
- **[Test Reports](./api-testing-sharing-reports.md)**: Generate reports filtered by labels
- **[Custom Assertions](./api-testing-custom-assertions.md)**: Create assertions for labeled suites

Labels are a powerful organizational tool that help you maintain order in large test collections and enable efficient test management workflows.