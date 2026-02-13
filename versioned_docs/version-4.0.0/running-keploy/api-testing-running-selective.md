---
id: api-testing-running-selective
title: Running Selective Test Suites
description: Guide to selecting and running specific test suites using checkboxes and bulk actions
sidebar_label: Selective Test Execution
tags:
  - api-testing
  - test-execution
  - bulk-actions
  - test-management
---

# Running Selective Test Suites

Keploy allows you to select specific test suites from your test collection and perform bulk actions like running tests, deleting suites, or adding labels. This selective approach helps you manage large test collections efficiently and run only the tests you need.

## Overview

The selective test suite feature provides:

- **Checkbox Selection**: Choose individual test suites or select all
- **Bulk Actions**: Perform actions on multiple suites simultaneously
- **Filtered Execution**: Run only the tests you've selected
- **Efficient Management**: Handle large test collections with ease

## Selecting Test Suites

### Individual Selection

1. **Navigate to Test Suites**
   - Go to your Keploy dashboard
   - Click on the **Test Suites** section

2. **Use Checkboxes**
   - Each test suite has a checkbox on the left side
   - Click the checkbox next to any suite you want to select
   - Selected suites will be highlighted with a checkmark ✓

3. **Visual Indicators**
   - Selected suites show a blue checkmark
   - The suite row may be highlighted or have a colored border
   - A selection counter appears showing "X suites selected"

### Bulk Selection Options

#### Select All Suites
```
☑️ Select All (at the top of the list)
```
- Checkbox at the top of the suite list
- Selects all visible test suites on the current page
- Useful for applying actions to your entire test collection

#### Select by Filter
1. Apply filters (status, tags, creation date, etc.)
2. Use "Select All" to choose all filtered results
3. Only suites matching your criteria will be selected

#### Select by Pattern
- Use search functionality to find specific suites
- Select all results matching your search criteria
- Combine with filters for more precise selection

## Available Actions

Once you've selected test suites, several bulk actions become available:

### 1. Run Selected Tests

**Button**: **Run Selected** or **Execute Selected**

**What it does**:
- Executes all test cases within the selected suites
- Runs tests in parallel or sequential order (configurable)
- Provides consolidated results for all selected suites

**Usage**:
```
1. Select desired test suites using checkboxes
2. Click "Run Selected" button
3. Choose execution options (if prompted):
   - Parallel execution (faster)
   - Sequential execution (more stable)
   - Environment selection
4. Click "Start Execution"
```

**Execution Options**:
- **Environment**: Choose target environment (dev, staging, prod)
- **Parallel Runs**: Set number of concurrent executions
- **Timeout Settings**: Configure test timeout values
- **Retry Policy**: Set retry attempts for failed tests

### 2. Delete Selected Suites

**Button**: **Delete Selected**

**What it does**:
- Permanently removes selected test suites
- Deletes all test cases within those suites
- Cannot be undone (use with caution)

**Safety Features**:
- Confirmation dialog before deletion
- Shows list of suites to be deleted
- Option to export suites before deletion

**Usage**:
```
1. Select test suites to delete
2. Click "Delete Selected"
3. Review the confirmation dialog
4. Type "DELETE" to confirm (if required)
5. Click "Confirm Deletion"
```

### 3. Add Labels

**Button**: **Add Labels** or **Manage Tags**

**What it does**:
- Adds labels/tags to selected test suites
- Helps organize and categorize tests
- Enables better filtering and search

**Label Types**:
- **Environment**: `dev`, `staging`, `production`
- **Priority**: `high`, `medium`, `low`
- **Category**: `smoke`, `regression`, `integration`
- **Owner**: `team-frontend`, `team-backend`
- **Custom**: Any custom label you define

**Usage**:
```
1. Select test suites to label
2. Click "Add Labels"
3. Choose from existing labels or create new ones
4. Select multiple labels if needed
5. Click "Apply Labels"
```

### 4. Additional Bulk Actions

#### Export Selected
- Download selected suites as files
- Export in various formats (JSON, CSV, etc.)
- Backup before making changes

#### Duplicate Selected
- Create copies of selected test suites
- Useful for creating variations or backups
- Maintains original test structure

#### Move to Folder
- Organize suites into folders or categories
- Bulk organization for better management
- Maintain hierarchical structure

## Selection Workflow Examples

### Example 1: Running Smoke Tests

**Scenario**: Run all smoke tests before deployment

```
1. Filter by label: "smoke"
2. Click "Select All" (selects all smoke test suites)
3. Click "Run Selected"
4. Choose "Production" environment
5. Set parallel execution: 5 concurrent runs
6. Click "Start Execution"
```

### Example 2: Cleaning Up Old Tests

**Scenario**: Delete outdated test suites

```
1. Filter by creation date: "Older than 6 months"
2. Filter by status: "Not run in 30 days"
3. Review the filtered results
4. Select relevant suites (uncheck any you want to keep)
5. Click "Delete Selected"
6. Confirm deletion after review
```

### Example 3: Organizing by Team

**Scenario**: Add team labels to categorize ownership

```
1. Search for suites containing "user-management"
2. Select all relevant suites
3. Click "Add Labels"
4. Add label: "team-backend"
5. Add label: "high-priority"
6. Click "Apply Labels"
```

## Selection Management

### Selection Persistence

- **Page Navigation**: Selections persist when moving between pages
- **Filter Changes**: Selections maintained when applying new filters
- **Session Duration**: Selections cleared when closing browser/tab

### Selection Counter

The interface shows:
```
✓ 5 suites selected out of 23 total
```

### Clear Selection

**Options to clear selection**:
- Click "Clear Selection" button
- Uncheck "Select All" checkbox
- Refresh the page

## Best Practices

### Before Running Selected Tests

1. **Review Selection**
   ```
   - Verify all intended suites are selected
   - Check that no critical tests are missing
   - Confirm environment settings
   ```

2. **Check Dependencies**
   ```
   - Ensure selected tests don't have interdependencies
   - Verify test data requirements
   - Confirm service availability
   ```

3. **Set Appropriate Timeouts**
   ```
   - Consider total execution time
   - Set realistic timeout values
   - Plan for potential failures
   ```

### Efficient Selection Strategies

1. **Use Filters First**
   - Apply relevant filters before selecting
   - Reduce noise and focus on relevant suites
   - Combine multiple filters for precision

2. **Leverage Labels**
   - Maintain good labeling practices
   - Use consistent naming conventions
   - Regular label cleanup and organization

3. **Batch Operations**
   - Group similar actions together
   - Avoid frequent small operations
   - Plan bulk changes in advance

## Monitoring Execution

### Real-time Progress

When running selected tests:

```
Execution Progress: 3 of 5 suites completed
├── ✅ User Authentication Suite (Passed)
├── ✅ Payment Processing Suite (Passed) 
├── ⚠️  Order Management Suite (Failed - 2 tests)
├── 🔄 Notification Suite (Running...)
└── ⏳ Report Generation Suite (Queued)
```

### Execution Summary

After completion:
```
Execution Results Summary
========================
Total Suites: 5
✅ Passed: 3 suites
❌ Failed: 2 suites
⏱️ Total Time: 4m 32s
📊 Success Rate: 60%
```

## Troubleshooting

### Selection Issues

**Problem**: Can't select certain suites
- **Solution**: Check permissions for those suites
- **Check**: Verify suites aren't currently running

**Problem**: Selection doesn't persist
- **Solution**: Ensure browser cookies are enabled
- **Check**: Verify stable internet connection

### Execution Issues

**Problem**: Selected tests won't run
- **Solutions**:
  - Verify all selected suites are valid
  - Check environment connectivity
  - Confirm sufficient system resources
  - Review test dependencies

**Problem**: Bulk actions fail
- **Solutions**:
  - Reduce selection size and try again
  - Check server capacity and load
  - Verify permissions for bulk operations

## Keyboard Shortcuts

Enhance your workflow with keyboard shortcuts:

```
Ctrl/Cmd + A    : Select all visible suites
Ctrl/Cmd + D    : Deselect all suites
Spacebar        : Toggle selection for highlighted suite
Enter           : Run selected suites
Delete          : Delete selected suites (with confirmation)
```

## Integration with CI/CD

### API Endpoints for Selective Execution

```bash
# Run specific test suites via API
curl -X POST "https://api.keploy.io/test-suites/run" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{
    "suite_ids": ["suite-1", "suite-2", "suite-3"],
    "environment": "staging",
    "parallel": true,
    "max_concurrent": 3
  }'
```

### GitHub Actions Example

```yaml
name: Run Selected API Tests
on:
  workflow_dispatch:
    inputs:
      suite_labels:
        description: 'Comma-separated list of suite labels to run'
        required: true
        default: 'smoke,critical'

jobs:
  run-selective-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Run Selected Test Suites
        run: |
          keploy test run \
            --labels ${{ github.event.inputs.suite_labels }} \
            --environment staging \
            --parallel 5
```

## Related Features

- **[Test Suite Management](./api-testing-edit-suites.md)**: Edit and organize test suites
- **[Buggy Test Suites](./api-testing-buggy-suites.md)**: Handle failing test suites
- **[Test Reports](./api-testing-sharing-reports.md)**: View and share execution results
- **[Custom Assertions](./api-testing-custom-assertions.md)**: Define custom validation rules

The selective test execution feature gives you fine-grained control over your test suite management, enabling efficient testing workflows and better resource utilization.