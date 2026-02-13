---
id: api-testing-edit-assertions
title: Editing Test Suites and Custom Assertions
description: Guide to editing test suites with custom variables and assertion functions
sidebar_label: Edit Assertions
tags:
  - api-testing
  - edit-assertions
  - custom-variables
  - custom-functions
  - test-management
---

# Editing Test Suites and Custom Assertions

This guide explains how to edit test suites in Keploy, including adding custom variables to URLs and request bodies, and creating custom assertion functions for advanced test validation.

## Overview

Keploy provides powerful editing capabilities that allow you to customize your test suites with variables and custom assertion functions. You can define variables that are either global (available across all test suites) or local (specific to a single test suite), and create reusable assertion functions to validate complex scenarios.

## Editing a Test Suite

### Accessing Edit Mode

1. **Navigate to Test Suite**
   - Go to your test suite list
   - Locate the test suite you want to edit

2. **Edit Individual Test Steps**
   - Within the test suite, you can edit individual test steps
   - Click on "Edit Step" for the specific step you want to modify

## Adding Variables

### Variable Types

Keploy supports two types of variables:

1. **Global Variables**: Available across all test suites in your project
2. **Local Variables**: Scoped to the current test suite only

### Adding Variables to URL Path

Variables can be used in URL paths to make tests more flexible and reusable:

#### Example: Using Variables in URL

**Before:**
```
GET https://api.example.com/users/12345
```

**After (with variable):**
```
GET https://api.example.com/users/{{userId}}
```

#### Steps to Add URL Variables

1. **Edit the Test Step**
   - Click on "Edit Step" for the test you want to modify
   - Locate the URL/endpoint field

2. **Insert Variable Syntax**
   - Use double curly braces: `{{variableName}}`
   - Example: `/api/v1/users/{{userId}}/orders/{{orderId}}`

3. **Define Variable Value**
   - Choose variable scope: Global or Local
   - Set the variable value
   - Save the variable

### Adding Variables to Request Body

Variables can also be used in request payloads:

#### Example: Using Variables in Request Body

**Before:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "age": 30
}
```

**After (with variables):**
```json
{
  "username": "{{username}}",
  "email": "{{userEmail}}",
  "age": {{userAge}}
}
```

#### Steps to Add Body Variables

1. **Edit the Request Body**
   - In the test step editor, locate the request body section
   - Identify fields you want to make variable

2. **Replace Values with Variables**
   - Use `{{variableName}}` syntax
   - For strings: `"{{variableName}}"`
   - For numbers/booleans: `{{variableName}}` (without quotes)

3. **Define Variable Values**
   - Create the variable in the variables panel
   - Set as Global or Local
   - Assign the value

### Variable Management Interface

```
┌──────────────────────────────────────────────────────────────────┐
│ Edit Test Step                                                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ URL: https://api.example.com/users/{{userId}}                   │
│                                                                  │
│ Request Body:                                                    │
│ {                                                                │
│   "name": "{{userName}}",                                        │
│   "email": "{{userEmail}}",                                      │
│   "role": "{{userRole}}"                                         │
│ }                                                                │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Variables                                    [+ Add Variable]│  │
│ ├────────────────────────────────────────────────────────────┤  │
│ │                                                            │  │
│ │ Name: userId                                               │  │
│ │ Value: 12345                                               │  │
│ │ Scope: ○ Global  ● Local                                   │  │
│ │                                                            │  │
│ │ Name: userName                                             │  │
│ │ Value: John Doe                                            │  │
│ │ Scope: ● Global  ○ Local                                   │  │
│ │                                                            │  │
│ │ Name: userEmail                                            │  │
│ │ Value: john@example.com                                    │  │
│ │ Scope: ● Global  ○ Local                                   │  │
│ │                                                            │  │
│ │ Name: userRole                                             │  │
│ │ Value: admin                                               │  │
│ │ Scope: ○ Global  ● Local                                   │  │
│ │                                                            │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ [Cancel]                                           [Save Step]   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Creating Custom Variables

#### Local Variables

1. **Click "+ Add Variable"**
   - In the variables panel, click to add a new variable

2. **Configure Local Variable**
   - **Name**: Enter the variable name (e.g., `userId`)
   - **Value**: Set the variable value (e.g., `12345`)
   - **Scope**: Select "Local" radio button
   - **Description**: Optional description for documentation

3. **Use in Test Step**
   - Reference using `{{variableName}}`
   - Local variables are only available in the current test suite

#### Global Variables

1. **Click "+ Add Variable"**
   - Add a new variable in the variables panel

2. **Configure Global Variable**
   - **Name**: Enter the variable name (e.g., `baseUrl`)
   - **Value**: Set the variable value (e.g., `https://api.example.com`)
   - **Scope**: Select "Global" radio button
   - **Description**: Document the variable's purpose

3. **Availability**
   - Global variables are available across all test suites
   - Useful for common values like API endpoints, tokens, etc.

### Dynamic Variables

Use dynamic variables for special values:
- `{{$timestamp}}`: Current timestamp
- `{{$randomInt}}`: Random integer
- `{{$randomString}}`: Random string
- `{{$uuid}}`: Random UUID
- `{{$currentDate}}`: Current date
- `{{$randomEmail}}`: Random email address

## Custom Assertions

### What are Custom Assertions?

Custom assertions allow you to define complex validation logic beyond simple field comparisons. You can create JavaScript functions to validate responses in sophisticated ways.

### Assertion Types

1. **Built-in Assertions**: Standard assertions (equals, contains, greater than, etc.)
2. **Global Functions**: Reusable custom functions available across all tests
3. **Custom Functions**: One-off functions specific to a test step

### Adding Custom Assertion Functions

#### Using Global Functions

1. **Navigate to Assertions Section**
   - In the test step editor, locate the assertions panel
   - Click "+ Add Assertion"

2. **Select Global Function**
   - Choose "Use Global Function" option
   - Select from available global functions
   - Configure function parameters if needed

#### Example: Using Global Function

```
┌──────────────────────────────────────────────────────────────────┐
│ Assertions                                       [+ Add Assertion]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Assertion 1:                                                     │
│ Function: validateEmail                          [Global]        │
│ Field: response.body.email                                       │
│ Expected: Valid email format                                     │
│                                                                  │
│ Assertion 2:                                                     │
│ Function: checkPriceRange                        [Global]        │
│ Field: response.body.price                                       │
│ Min: 0                                                           │
│ Max: 1000                                                        │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

#### Writing Custom Functions

1. **Add Custom Assertion**
   - Click "+ Add Assertion"
   - Select "Write Custom Function"

2. **Write Function Logic**
   - Write JavaScript code to validate the response
   - Access response data via function parameters
   - Return true for pass, false for fail

3. **Save to Global Functions (Optional)**
   - After writing the function, you can save it
   - Click "Save to Global Functions"
   - Name the function for reuse
   - Add description and documentation

### Custom Function Interface

```
┌──────────────────────────────────────────────────────────────────┐
│ Add Custom Assertion                                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ Function Type:                                                   │
│ ○ Use Global Function                                            │
│ ● Write Custom Function                                          │
│                                                                  │
│ Function Code:                                                   │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ function customAssertion(response, expected) {             │  │
│ │   // Access response data                                  │  │
│ │   const actualValue = response.body.data.length;           │  │
│ │                                                            │  │
│ │   // Custom validation logic                               │  │
│ │   if (actualValue >= expected.minLength &&                 │  │
│ │       actualValue <= expected.maxLength) {                 │  │
│ │     return {                                               │  │
│ │       passed: true,                                        │  │
│ │       message: "Array length is within range"              │  │
│ │     };                                                     │  │
│ │   }                                                        │  │
│ │                                                            │  │
│ │   return {                                                 │  │
│ │     passed: false,                                         │  │
│ │     message: `Expected length between ${expected.minLength}│  │
│ │                and ${expected.maxLength}, got ${actualValue}`│ │
│ │   };                                                       │  │
│ │ }                                                          │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│ Expected Parameters:                                             │
│ {                                                                │
│   "minLength": 1,                                                │
│   "maxLength": 100                                               │
│ }                                                                │
│                                                                  │
│ ☑ Save to Global Functions                                       │
│ Function Name: validateArrayLength                               │
│ Description: Validates array length is within specified range    │
│                                                                  │
│ [Test Function]  [Cancel]                        [Add Assertion] │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### Custom Function Examples

#### Example 1: Email Validation

```javascript
function validateEmail(response) {
  const email = response.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return {
    passed: emailRegex.test(email),
    message: emailRegex.test(email) 
      ? "Valid email format" 
      : `Invalid email: ${email}`
  };
}
```

#### Example 2: Date Range Validation

```javascript
function validateDateRange(response, expected) {
  const responseDate = new Date(response.body.createdAt);
  const startDate = new Date(expected.startDate);
  const endDate = new Date(expected.endDate);
  
  const isInRange = responseDate >= startDate && responseDate <= endDate;
  
  return {
    passed: isInRange,
    message: isInRange 
      ? "Date is within range" 
      : `Date ${responseDate} is outside range ${startDate} to ${endDate}`
  };
}
```

#### Example 3: Complex Object Validation

```javascript
function validateUserObject(response, expected) {
  const user = response.body.user;
  const errors = [];
  
  // Check required fields
  if (!user.id) errors.push("Missing user.id");
  if (!user.email) errors.push("Missing user.email");
  if (!user.name) errors.push("Missing user.name");
  
  // Check field types
  if (typeof user.id !== 'number') errors.push("user.id must be a number");
  if (typeof user.email !== 'string') errors.push("user.email must be a string");
  
  // Check field formats
  if (user.email && !user.email.includes('@')) {
    errors.push("user.email must be valid email");
  }
  
  // Check expected values
  if (expected.role && user.role !== expected.role) {
    errors.push(`Expected role ${expected.role}, got ${user.role}`);
  }
  
  return {
    passed: errors.length === 0,
    message: errors.length === 0 
      ? "User object is valid" 
      : errors.join('; ')
  };
}
```

#### Example 4: Response Time Validation

```javascript
function validateResponseTime(response, expected) {
  const responseTime = response.time; // milliseconds
  const maxTime = expected.maxResponseTime;
  
  return {
    passed: responseTime <= maxTime,
    message: responseTime <= maxTime
      ? `Response time ${responseTime}ms is acceptable`
      : `Response time ${responseTime}ms exceeds limit of ${maxTime}ms`
  };
}
```

#### Example 5: Custom Business Logic

```javascript
function validateOrderTotal(response, expected) {
  const order = response.body.order;
  const items = order.items;
  
  // Calculate expected total
  let calculatedTotal = 0;
  for (let item of items) {
    calculatedTotal += item.price * item.quantity;
  }
  
  // Add tax
  calculatedTotal += calculatedTotal * (order.taxRate || 0);
  
  // Add shipping
  calculatedTotal += order.shippingCost || 0;
  
  // Compare with response total
  const difference = Math.abs(calculatedTotal - order.total);
  const tolerance = expected.tolerance || 0.01;
  
  return {
    passed: difference <= tolerance,
    message: difference <= tolerance
      ? `Order total ${order.total} is correct`
      : `Order total mismatch: expected ${calculatedTotal}, got ${order.total}`
  };
}
```

## Managing Global Functions

### Viewing Global Functions

1. **Navigate to Global Functions**
   - Go to Settings or Test Management
   - Click on "Global Functions" or "Function Library"

2. **Browse Functions**
   - View all saved global functions
   - See function descriptions and usage examples
   - Check function parameters

### Creating Global Functions

1. **Click "+ New Global Function"**
   - Open the global function editor

2. **Define Function**
   - **Name**: Unique function name
   - **Description**: Purpose and usage
   - **Parameters**: Expected input parameters
   - **Code**: Function implementation
   - **Examples**: Usage examples

3. **Save Function**
   - Function becomes available across all test suites
   - Can be used in any assertion

### Editing Global Functions

1. **Select Function to Edit**
   - Find the function in the global functions list
   - Click "Edit"

2. **Modify Function**
   - Update code, parameters, or description
   - Test the changes

3. **Save Changes**
   - Updated function is available immediately
   - Existing tests using the function are updated

### Deleting Global Functions

1. **Select Function**
   - Find the function to delete
   - Click "Delete"

2. **Confirm Deletion**
   - Warning: Check if function is used in existing tests
   - Confirm deletion

## Complete Workflow Example

### Scenario: Testing User Registration

1. **Edit Test Suite**
   - Click "Edit Suite" on the user registration test

2. **Edit Step: Create User**
   - Click "Edit Step" on the POST /api/v1/users request

3. **Add Variables to Request Body**
   ```json
   {
     "username": "{{newUsername}}",
     "email": "{{newUserEmail}}",
     "password": "{{newUserPassword}}",
     "age": {{newUserAge}}
   }
   ```

4. **Define Local Variables**
   - `newUsername`: "test_user_{{$timestamp}}" (Local)
   - `newUserEmail`: "test{{$randomInt}}@example.com" (Local)
   - `newUserPassword`: "SecurePass123!" (Local)
   - `newUserAge`: 25 (Local)

5. **Add Global Variable**
   - `apiBaseUrl`: "https://api.example.com" (Global)
   - Update URL to: `{{apiBaseUrl}}/v1/users`

6. **Add Custom Assertions**

   **Assertion 1: Use Global Function**
   - Function: `validateEmail`
   - Field: `response.body.email`

   **Assertion 2: Custom Function**
   ```javascript
   function validateNewUser(response, expected) {
     const user = response.body;
     
     // Check user was created with correct data
     if (user.username !== expected.username) {
       return { passed: false, message: "Username mismatch" };
     }
     
     // Check user ID was generated
     if (!user.id || typeof user.id !== 'number') {
       return { passed: false, message: "Invalid user ID" };
     }
     
     // Check password is not returned
     if (user.password) {
       return { passed: false, message: "Password should not be in response" };
     }
     
     // Check timestamps
     if (!user.createdAt) {
       return { passed: false, message: "Missing createdAt timestamp" };
     }
     
     return { passed: true, message: "User created successfully" };
   }
   ```
   
   **Assertion 3: Save Custom Function to Global**
   - Click "Save to Global Functions"
   - Name: `validateNewUser`
   - Description: "Validates user creation response"

7. **Save Test Step**
   - All changes are saved
   - Variables and assertions are active

8. **Run Test**
   - Variables are substituted with values
   - Custom assertions are executed
   - Results show pass/fail with custom messages

## Best Practices

### Variable Management

1. **Use Global Variables for Common Values**
   - API base URLs
   - Authentication tokens
   - Environment-specific settings
   - Common test data

2. **Use Local Variables for Test-Specific Data**
   - Unique identifiers
   - Test case-specific values
   - Temporary data

3. **Naming Conventions**
   - Use camelCase: `userId`, `apiBaseUrl`
   - Be descriptive: `adminUserToken` instead of `token1`
   - Group related variables: `user_id`, `user_name`, `user_email`

4. **Dynamic Variables**
   - Use built-in dynamic variables for unique values
   - Prevents conflicts in concurrent test runs
   - Ensures test data freshness

### Custom Assertions

1. **Write Clear Functions**
   - Use descriptive function names
   - Add comments explaining logic
   - Return meaningful error messages

2. **Reuse Through Global Functions**
   - Save commonly used validations as global functions
   - Maintain consistency across tests
   - Easier to update validation logic

3. **Handle Edge Cases**
   - Check for null/undefined values
   - Validate data types
   - Handle unexpected response formats

4. **Provide Helpful Error Messages**
   - Include actual vs expected values
   - Explain what went wrong
   - Suggest potential fixes

5. **Test Your Functions**
   - Use the "Test Function" button
   - Validate with different inputs
   - Ensure functions work as expected

## Advanced Features

### Variable Chaining

Use variables within variables:
```json
{
  "apiUrl": "{{baseUrl}}/{{apiVersion}}/{{endpoint}}"
}
```

### Environment Variables

Switch between environments:
- Development: `baseUrl = "https://dev.api.example.com"`
- Staging: `baseUrl = "https://staging.api.example.com"`
- Production: `baseUrl = "https://api.example.com"`

### Response Variable Extraction

Extract values from responses for use in subsequent steps:
```javascript
// In assertion, extract and save value
const userId = response.body.id;
saveVariable('userId', userId, 'local');
```

### Conditional Assertions

Apply assertions based on conditions:
```javascript
function conditionalAssertion(response, expected) {
  // Only validate price if item is in stock
  if (response.body.inStock) {
    if (response.body.price <= 0) {
      return { passed: false, message: "Price must be positive for in-stock items" };
    }
  }
  
  return { passed: true, message: "Validation passed" };
}
```

## Benefits

- **Flexibility**: Customize tests for different scenarios
- **Reusability**: Share variables and functions across tests
- **Maintainability**: Update values in one place
- **Scalability**: Easily manage large test suites
- **Validation Power**: Implement complex business logic validation
- **Consistency**: Standardize assertions across the team

By leveraging custom variables and assertion functions, you can create powerful, flexible, and maintainable test suites that accurately validate your API behavior.
