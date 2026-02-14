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

# Test Suite Settings & Actions

The test suite panel in Keploy provides a comprehensive set of actions and settings to manage your test suites effectively. From basic operations like running and sharing tests to advanced features like bulk schema editing and global configurations, the suite panel offers everything you need for efficient test management.

## Overview of Available Actions

The test suite panel provides access to the following key actions:

- **Share Test Suite**: Collaborate with team members by sharing test suites
- **Run Test Suite**: Execute all tests within the suite
- **Bulk Edit Schema Assertions**: Modify assertions across multiple tests
- **Add Global Variables**: Define variables accessible across all tests
- **Run in CI**: Configure continuous integration execution
- **Global Functions**: Create reusable functions for test suites

## Accessing the Test Suite Panel

1. **Navigate to Test Suites**
   - Go to your Keploy dashboard
   - Click on **Test Suites** from the main navigation

2. **Open Suite Panel**
   - Click on any test suite to open its details
   - The suite panel opens with various action buttons and settings tabs

3. **Panel Layout**
   ```
   Test Suite: User Authentication API
   =====================================
   [Share] [Run] [Settings] [⋮ More Actions]
   
   Tabs: [Tests] [Variables] [Functions] [Assertions] [CI/CD]
   ```

## Action 1: Sharing Test Suites

### Share Options

**Access**: Click the **Share** button in the suite panel

**Sharing Methods**:
- **Team Members**: Share with specific users in your organization
- **Public Link**: Generate a public link for external sharing
- **Export**: Download suite as a file for offline sharing

### Sharing Process

1. **Click Share Button**
   ```
   Share "User Authentication API" Suite
   ====================================
   
   Share with:
   ☐ Team Members
   ☐ External Users  
   ☐ Generate Public Link
   ☐ Export as File
   ```

2. **Configure Sharing Settings**
   ```
   Permissions:
   ☐ View Only (read-only access)
   ☐ Edit (can modify tests)
   ☐ Execute (can run tests)
   ☐ Admin (full control)
   
   Expiration: [30 days ▼]
   Password Protection: [Optional]
   ```

3. **Generate Share Link**
   ```
   Generated Link:
   https://app.keploy.io/shared/suite/abc123xyz
   
   Actions:
   [Copy Link] [Send Email] [Download QR Code]
   ```

## Action 2: Running Test Suites

### Run Configuration

**Access**: Click the **Run** button in the suite panel

**Execution Options**:
```
Run Configuration
=================

Environment: [Staging ▼]
Execution Mode: 
  ☐ Sequential (one test at a time)
  ☑ Parallel (multiple tests simultaneously)
  
Parallel Settings:
  Max Concurrent Tests: [5]
  Timeout per Test: [30 seconds]
  
Retry Policy:
  Failed Tests: [Retry 2 times]
  Retry Delay: [5 seconds]
  
Data Options:
  ☐ Use Test Data
  ☐ Generate Random Data
  ☑ Use Global Variables
```

### Execution Monitoring

Real-time execution progress:
```
Execution Progress: 15 of 20 tests completed
=========================================

✅ Login API Test              (0.8s)
✅ Register User Test          (1.2s)  
✅ Password Reset Test         (0.9s)
🔄 Profile Update Test         (running...)
⏳ Logout Test                 (queued)
⏳ Delete Account Test         (queued)

Success Rate: 85% | Avg Response Time: 1.1s
```

## Action 3: Bulk Edit Schema Assertions

### Schema Assertion Editor

**Access**: Go to **Assertions** tab in the suite panel

**Bulk Operations Available**:
- **Add Assertions**: Apply new assertions to multiple tests
- **Modify Assertions**: Update existing assertions across tests
- **Remove Assertions**: Delete specific assertions from multiple tests
- **Template Application**: Apply assertion templates to selected tests

### Bulk Editing Process

1. **Select Tests for Bulk Edit**
   ```
   Tests in Suite (20 total)
   ========================
   ☑ Select All
   ☑ Login API Test
   ☑ Register User Test  
   ☑ Password Reset Test
   ☐ Profile Update Test
   ☐ Logout Test
   
   Selected: 3 tests
   ```

2. **Choose Assertion Type**
   ```
   Assertion Categories
   ===================
   
   📊 Response Validation:
   ├── Status Code Assertions
   ├── Response Time Assertions
   ├── Header Validations
   └── Content-Type Checks
   
   🔍 Content Validation:  
   ├── JSON Schema Validation
   ├── Required Fields Check
   ├── Data Type Validation
   └── Value Range Validation
   
   🔐 Security Assertions:
   ├── Authentication Headers
   ├── HTTPS Enforcement
   └── CORS Validation
   ```

3. **Configure Assertions**
   ```
   JSON Schema Assertion
   ====================
   
   Field: response.user.id
   Type: [number ▼]
   Required: ☑ Yes
   Validation Rules:
     Min Value: [1]
     Max Value: [999999]
   
   Field: response.user.email  
   Type: [string ▼]
   Required: ☑ Yes
   Pattern: [^[^\s@]+@[^\s@]+\.[^\s@]+$]
   
   Apply to: 3 selected tests
   ```

## Action 4: Add Global Variables

### Global Variable Management

**Access**: Go to **Variables** tab in the suite panel

**Variable Types**:
- **Environment Variables**: Different values per environment
- **Static Variables**: Fixed values across all tests
- **Dynamic Variables**: Generated at runtime
- **Secret Variables**: Encrypted sensitive data

### Adding Global Variables

1. **Create New Variable**
   ```
   Add Global Variable
   ==================
   
   Variable Name: [api_base_url]
   Variable Type: [Environment ▼]
   
   Environment Values:
   Development: https://api-dev.example.com
   Staging:     https://api-staging.example.com  
   Production:  https://api.example.com
   
   Description: Base URL for API endpoints
   ```

2. **Variable Categories**
   ```
   🌍 Environment Variables:
   ├── api_base_url
   ├── database_host
   └── auth_service_url
   
   🔐 Authentication:
   ├── api_key (secret)
   ├── auth_token (dynamic)
   └── client_secret (secret)
   
   📊 Test Data:
   ├── test_user_id
   ├── sample_email
   └── default_timeout
   
   ⚙️ Configuration:
   ├── max_retry_attempts
   ├── request_timeout
   └── parallel_execution_count
   ```

3. **Variable Usage in Tests**
   ```
   Example Usage in Test Request:
   =============================
   
   URL: {{api_base_url}}/users/{{test_user_id}}
   Headers:
     Authorization: Bearer {{auth_token}}
     Content-Type: application/json
   
   Body:
   {
     "email": "{{sample_email}}",
     "timeout": {{default_timeout}}
   }
   ```

## Action 5: Run in CI

### CI/CD Integration Setup

**Access**: Go to **CI/CD** tab in the suite panel

**Available CI Platforms**:
- GitHub Actions
- GitLab CI/CD
- Jenkins
- Azure DevOps
- CircleCI
- Custom Webhooks

### CI Configuration Process

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

2. **Generate CI Configuration**
   ```yaml
   # Generated GitHub Actions Workflow
   name: API Tests - User Authentication Suite
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]
     schedule:
       - cron: '0 6 * * *'  # Daily at 6 AM
   
   jobs:
     api-tests:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Run Keploy Test Suite
           uses: keploy/test-action@v1
           with:
             suite-id: 'user-auth-suite-123'
             environment: 'staging'
             parallel: true
             max-concurrent: 5
           env:
             KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
   ```

3. **CI Execution Settings**
   ```
   CI Execution Configuration
   =========================
   
   Trigger Conditions:
   ☑ On Push to Main Branch
   ☑ On Pull Request  
   ☑ Scheduled (Daily at 6 AM)
   ☐ Manual Trigger Only
   
   Execution Environment:
   Environment: [Staging ▼]
   Parallel Execution: ☑ Enabled
   Max Workers: [5]
   Timeout: [10 minutes]
   
   Failure Handling:
   ☑ Fail build on test failure
   ☑ Send notifications on failure
   ☐ Auto-retry failed tests
   ```

## Action 6: Global Functions

### Function Management

**Access**: Go to **Functions** tab in the suite panel

**Function Types**:
- **Pre-request Functions**: Execute before each test
- **Post-response Functions**: Execute after each test response
- **Utility Functions**: Reusable helper functions
- **Validation Functions**: Custom assertion logic

### Creating Global Functions

1. **Add New Function**
   ```
   Create Global Function
   =====================
   
   Function Name: [generateAuthToken]
   Function Type: [Pre-request ▼]
   
   Function Code:
   ```javascript
   function generateAuthToken(request, context) {
     const timestamp = Date.now();
     const signature = crypto.createHmac('sha256', context.secret_key)
                            .update(`${timestamp}${request.method}${request.url}`)
                            .digest('hex');
     
     return {
       'X-Auth-Token': `${timestamp}.${signature}`,
       'X-Timestamp': timestamp
     };
   }
   ```

2. **Function Categories**
   ```
   🔧 Utility Functions:
   ├── generateRandomId()
   ├── formatTimestamp()  
   ├── encodeBase64()
   └── validateEmail()
   
   🔐 Authentication:
   ├── generateAuthToken()
   ├── refreshToken()
   └── validateSession()
   
   📊 Data Processing:
   ├── normalizeResponse()
   ├── extractErrorCode()
   └── calculateChecksum()
   
   ✅ Validation:
   ├── validateSchema()
   ├── checkResponseTime()
   └── verifyHeaders()
   ```

3. **Function Usage Examples**
   ```javascript
   // Pre-request function usage
   function beforeRequest(request, context) {
     // Add authentication
     const authHeaders = generateAuthToken(request, context);
     request.headers = { ...request.headers, ...authHeaders };
     
     // Add request ID for tracking
     request.headers['X-Request-ID'] = generateRandomId();
     
     return request;
   }
   
   // Post-response validation
   function afterResponse(response, context) {
     // Validate response schema
     const isValid = validateSchema(response.body, context.expectedSchema);
     if (!isValid) {
       throw new Error('Response schema validation failed');
     }
     
     // Check performance
     if (response.time > context.maxResponseTime) {
       console.warn(`Slow response: ${response.time}ms`);
     }
     
     return response;
   }
   ```

## Advanced Suite Configuration

### Suite-Level Settings

**Access**: Click **Settings** button in suite panel

**Configuration Options**:
```
Suite Configuration
==================

General Settings:
  Suite Name: [User Authentication API]
  Description: [Complete authentication flow tests]
  Owner: [team-backend]
  
Execution Settings:
  Default Environment: [Staging]
  Default Timeout: [30 seconds]
  Max Retry Attempts: [3]
  Parallel Execution: ☑ Enabled
  
Data Management:
  ☑ Preserve test data between runs
  ☑ Auto-cleanup temporary data
  ☐ Use production data (warning)
  
Notifications:
  ☑ Email on failure
  ☑ Slack integration  
  ☐ SMS alerts
  
Security:
  ☑ Encrypt sensitive variables
  ☑ Audit log access
  ☑ Require approval for modifications
```

### Suite Templates

Save and reuse suite configurations:
```
Save as Template
===============

Template Name: [Standard API Test Suite]
Description: [Default configuration for API testing]

Include in Template:
☑ Variable definitions
☑ Global functions  
☑ Assertion templates
☑ CI/CD configuration
☐ Test data (large datasets)

Apply Template to:
☐ New test suites only
☐ Existing suites (with confirmation)
```

## Monitoring and Analytics

### Suite Performance Dashboard

```
Suite Analytics Dashboard
========================

📊 Execution Statistics (Last 30 Days):
├── Total Runs: 1,247
├── Success Rate: 94.2%
├── Average Duration: 4m 32s
└── Most Common Failures: Authentication timeout

📈 Trends:
├── Success Rate: ↗️ +2.1% (improving)
├── Response Time: ↘️ -120ms (faster)  
└── Test Coverage: ↗️ +5 new assertions

🔍 Top Issues:
├── Flaky Test: "Password Reset" (12% failure rate)
├── Slow Endpoint: "/users/profile" (avg 2.1s)
└── Missing Assertion: Response headers validation
```

## Best Practices

### Suite Organization

1. **Logical Grouping**
   - Group related API endpoints together
   - Separate by functional areas (auth, payments, etc.)
   - Use consistent naming conventions

2. **Variable Management**
   - Use environment-specific variables
   - Avoid hardcoding sensitive data
   - Document variable purposes

3. **Function Reusability**
   - Create modular, single-purpose functions
   - Use descriptive function names
   - Include error handling

### Performance Optimization

1. **Execution Efficiency**
   - Enable parallel execution for independent tests
   - Set appropriate timeouts
   - Use test data factories

2. **Resource Management**
   - Clean up test data after execution
   - Monitor suite execution times
   - Optimize slow-running tests

## Troubleshooting

### Common Issues

1. **Suite Won't Run**
   - Check environment connectivity
   - Verify variable values
   - Review function syntax

2. **Bulk Operations Failing**
   - Reduce operation scope
   - Check individual test permissions
   - Verify schema compatibility

3. **CI Integration Issues**
   - Validate API keys and secrets
   - Check network connectivity
   - Review execution logs

### Getting Help

- **Documentation**: Review individual feature guides
- **Support**: Contact support with suite execution logs
- **Community**: Ask questions in Keploy forums
- **API Reference**: Check API documentation for programmatic access

## Related Features

- **[Individual Test Management](./api-testing-edit-suites.md)**: Edit specific tests
- **[Label Management](./api-testing-adding-labels.md)**: Organize with labels
- **[Selective Execution](./api-testing-running-selective.md)**: Run specific tests
- **[Sharing & Reports](./api-testing-sharing-reports.md)**: Share results

The test suite panel provides a comprehensive control center for managing all aspects of your API test suites, from basic execution to advanced automation and collaboration features.