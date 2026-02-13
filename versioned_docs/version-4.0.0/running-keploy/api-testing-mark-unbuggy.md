---
id: api-testing-mark-unbuggy
title: Mark Test Suite as Unbuggy
description: Guide to marking test suites as unbuggy after fixing issues
sidebar_label: Mark as Unbuggy
tags:
  - api-testing
  - test-management
  - suite-status
  - debugging
---

# Mark Test Suite as Unbuggy

After resolving issues in a buggy test suite, you can mark it as unbuggy to indicate that the problems have been addressed and the suite is functioning correctly again.

## When to Mark a Suite as Unbuggy

Mark a test suite as unbuggy when:

- All test failures have been resolved
- API endpoints are working as expected
- Schema validations are passing
- Authentication issues have been fixed
- Test assertions are now accurate
- The underlying API issues have been corrected

## How to Mark a Suite as Unbuggy

### Step 1: Navigate to the Test Suite

1. Go to your Keploy dashboard
2. Navigate to the **Test Suites** section
3. Click on the specific test suite you want to mark as unbuggy

### Step 2: Access Suite Options

Once you're on the test suite page:

1. Look for the **three dots (⋮)** menu next to the test suite name
2. The menu is typically located in the top-right area of the suite header
3. Click on the three dots to open the context menu

### Step 3: Mark as Unbuggy

From the context menu:

1. Select **"Unmark Buggy"** from the dropdown options

## What Happens When You Mark a Suite as Unbuggy

### Immediate Changes

- **Status Update**: The suite status changes from "Buggy" to "Active" or "Passing"
- **Visual Indicator**: The suite will no longer appear with error indicators
- **Dashboard Update**: The suite is moved out of the buggy suites list
- **Notification**: A success notification confirms the status change

### Ongoing Behavior

- **Future Runs**: The suite will run normally in subsequent test executions
- **Reporting**: The suite will be included in standard test reports
- **Monitoring**: Keploy will continue monitoring the suite for new issues
- **History**: The previous buggy status and resolution are logged in the suite history

## Best Practices

### Before Marking as Unbuggy

1. **Verify All Fixes**
   ```bash
   # Run the test suite manually to confirm fixes
   keploy test --test-sets "your-suite-name"
   ```

2. **Check All Test Cases**
   - Ensure every test in the suite is passing
   - Verify no intermittent failures remain
   - Confirm all assertions are working correctly

3. **Test in Multiple Environments**
   - Run tests in staging environment
   - Verify production-like conditions
   - Check with realistic data volumes

### Documentation

1. **Record Resolution Steps**
   - Document what was fixed
   - Note any API changes made
   - Record configuration updates

2. **Update Test Documentation**
   - Modify test descriptions if needed
   - Update expected behaviors
   - Add notes about resolution

## Common Scenarios for Marking as Unbuggy

### 1. API Endpoint Restored

**Scenario**: A 404 error was resolved by fixing the API endpoint

**Before marking unbuggy**:
```bash
# Verify the endpoint is working
curl -X POST https://api.example.com/owners \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Owner"}'
```

### 2. Schema Issues Fixed

**Scenario**: Response schema validation was fixed by updating the API

**Verification steps**:
1. Check that response format matches expectations
2. Verify all required fields are present
3. Confirm data types are correct

### 3. Authentication Resolved

**Scenario**: Authentication issues were fixed by updating credentials

**Before marking unbuggy**:
1. Test with new authentication tokens
2. Verify permissions are sufficient
3. Check token expiration dates

### 4. Environment Configuration Fixed

**Scenario**: Environment-specific issues were resolved

**Verification checklist**:
- [ ] Database connections working
- [ ] Environment variables set correctly
- [ ] Required services are running
- [ ] Network connectivity is stable

## Bulk Operations

### Mark Multiple Suites as Unbuggy

If you have multiple suites to mark as unbuggy:

1. **From the Buggy Suites List**:
   - Use checkboxes to select multiple suites
   - Click the bulk actions menu
   - Select "Mark Selected as Unbuggy"

2. **From Individual Suite Pages**:
   - Process each suite individually
   - Verify fixes for each suite separately
   - Document resolutions for tracking

## Monitoring After Marking as Unbuggy

### Automated Monitoring

Keploy automatically monitors unbuggy suites for:
- New test failures
- Performance regressions
- Schema changes
- API availability issues

### Manual Verification

Regularly check that previously buggy suites remain stable:

1. **Weekly Reviews**
   - Check suite success rates
   - Monitor execution times
   - Review error logs

2. **After Deployments**
   - Run critical test suites
   - Verify no regressions introduced
   - Check environment stability

## Troubleshooting

### Unable to Mark as Unbuggy

If you can't find the option to mark as unbuggy:

1. **Check Permissions**
   - Ensure you have edit permissions for the test suite
   - Verify your account has the necessary role

2. **Suite Status**
   - Confirm the suite is currently marked as buggy
   - Check if recent test runs are still failing

3. **Browser Issues**
   - Refresh the page and try again
   - Clear browser cache if needed
   - Try using a different browser

### Accidental Marking

If you accidentally marked a suite as unbuggy:

1. **Re-run the Suite**
   - Execute the test suite again
   - If issues persist, it will automatically be marked as buggy

2. **Manual Review**
   - Check the suite execution results
   - Review individual test case outcomes
   - Mark as buggy again if needed

## Related Actions

After marking a suite as unbuggy, you might want to:

- **Schedule Regular Runs**: Set up automated execution schedules
- **Update Documentation**: Revise test suite documentation
- **Share Results**: Notify team members of the resolution
- **Review Similar Suites**: Check other suites for similar issues

## Integration with CI/CD

When marking suites as unbuggy in CI/CD pipelines:

```yaml
# Example GitHub Action
- name: Mark Suite as Unbuggy
  if: ${{ steps.test.outputs.all_passed == 'true' }}
  run: |
    keploy suite mark-unbuggy --suite-id ${{ env.SUITE_ID }}
```

This ensures that suites are automatically marked as unbuggy when automated fixes resolve issues.

Remember: Marking a suite as unbuggy should only be done after thoroughly verifying that all issues have been resolved and the suite is functioning correctly.