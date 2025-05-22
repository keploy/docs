---
id: common-errors
title: Common Errors in Keploy
sidebar_label: Common Errors
tags:
  - explanation
  - faq
---

Let's check some of the common errors that you might encounter while working with Keploy!

### 1. Dependency Not Found Error

#### Description:

This error occurs when Keploy cannot locate or access a required dependency, such as a database or external service.

#### Possible Cause:

- The dependency may not be running or is incorrectly configured.
- Networking issues may be preventing Keploy from connecting to external dependencies.

#### Solution:

- Verify that all required services (e.g., databases, third-party APIs) are active and accessible.
- Check the environment variables or configuration files to confirm the correct host and port details.
- Use network diagnostic tools (e.g., ping, traceroute) to identify connectivity issues.

### 2. Unable to Record API Calls

#### Description:

Keploy fails to record incoming API traffic, meaning no tests are generated.

#### Possible Cause:

- Incorrect integration with the application.
- Keploy may not be correctly started with the application, or the SDK is not configured properly.
- The application may not be making API calls that are recognizable by Keploy.

#### Solution:

- Double-check the integration guide for the programming language you’re using.
- Ensure that Keploy is properly hooked into the API layer.
- Check Keploy logs for any missed or skipped requests.

### 3. Test Replay Failure

#### Description:

Keploy is unable to replay recorded API requests.

#### Possible Cause:

- External services or databases may be in a different state than they were during recording.
- Non-deterministic values like timestamps, UUIDs, or random values are causing failures.

#### Solution:

- Leverage Keploy’s mocking capabilities to simulate external services and databases.
- Use configurations to handle or exclude non-deterministic values for consistent comparisons.
- Regularly reset the database state to match the conditions during recording.

### 4. Response Mismatch Error

#### Description:

When Keploy replays API calls, it detects a mismatch between the recorded response and the current response.

#### Possible Cause:

- The application’s behavior has changed, leading to different responses.
- Changes in the response format, status codes, or headers that weren’t present during recording.

#### Solution:

- Review the application changes and determine if the mismatch is expected (e.g., new features).
- If the change is acceptable, update the test baseline to reflect the new behavior.
- Use Keploy’s flexible comparison options to ignore certain fields or values (like timestamps or version numbers).

### 5. Incorrect Test Generation

#### Description:

Keploy generates tests that don’t properly reflect the API interactions.

#### Possible Cause:

- The API interaction may be too complex or involve custom logic that Keploy cannot automatically handle.
- API parameters may be missing or misinterpreted during recording.

#### Solution:

- Review the recorded test cases for correctness.
- Manually adjust the generated tests to include missing or misinterpreted parameters.
- Make use of Keploy’s API to refine the recording process if necessary.

### 6. Database Connection Error during Test Replay

#### Description:

Keploy cannot connect to the database or other external systems during the replay of tests.

#### Possible Cause:

- The test environment may not have access to the same database as the original recording.
- Database credentials or host information could be incorrect or missing in the test environment.

#### Solution:

- Mirror the test environment configuration with the recording setup.
- Use database mocks or stubs for isolated testing.
- Double-check connection strings, credentials, and database availability.

### 7. Missing or Invalid Configuration Error

#### Description:

Keploy cannot find a valid configuration file or encounters errors in the configuration.

#### Possible Cause:

- The Keploy configuration file (keploy.yaml or similar) is missing or contains invalid values.
- Environment variables required by Keploy may not be set.

#### Solution:

- Ensure the configuration file exists and follows the correct format.
- Populate all required fields with valid values.
- Check that environment variables are properly set.

### 8. Timeout Errors

#### Description:

Keploy times out while recording or replaying API calls.

#### Possible Cause:

- Long-running API requests or slow external dependencies can cause timeout issues.
- Keploy may have low timeout settings for API calls.

#### Solution:

- Increase timeout settings in the Keploy configuration.
- Identify and optimize slow-performing APIs or dependencies.
- Use monitoring tools to analyze API performance.

### 9. Insufficient Permissions

#### Description:

Keploy fails due to insufficient permissions when accessing files, networks, or other resources.

#### Possible Cause:

The user or service running Keploy may not have sufficient permissions to access resources like databases, APIs, or file systems.

#### Solution:

- Ensure that the user or service running Keploy has the necessary permissions.
- Review system permissions and provide the required access rights for Keploy to function properly.

### 10. Version Compatibility Issues

#### Description:

Errors occur because of version mismatches between Keploy, its dependencies, or the application it’s testing.

#### Possible Cause:

- Using incompatible versions of Keploy or related SDKs with your application.
- Dependencies of Keploy (e.g., for mocking or replaying) may have updated and broken compatibility.

#### Solution:

- Verify version compatibility for Keploy and its SDKs.
- Consult Keploy documentation or release notes for known issues.
- Use version pinning to maintain a stable environment.

### 11. Unsupported Protocol or API

#### Description:

Keploy does not support the protocol or API structure you are using (e.g., gRPC, SOAP, etc.).

#### Possible Cause:

- The application might use an API or protocol that Keploy doesn’t yet support (e.g., WebSocket, gRPC).

#### Solution:

- Confirm the supported protocols (currently HTTP/REST and GraphQL).
- Consider alternative tools or frameworks for unsupported protocols.

If you’re still encountering issues after trying these solutions, feel free to reach out to the Keploy team or consult the community forums for additional support. Happy testing!

import GetSupport from '../concepts/support.md'

<GetSupport/>
