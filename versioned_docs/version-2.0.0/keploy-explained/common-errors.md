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

This error occurs when Keploy is unable to find or access a required dependency, like a database or external service.

#### Possible Cause:

- The dependency may not be running or is incorrectly configured.
- Networking issues may be preventing Keploy from connecting to external dependencies.

#### Solution:

- Ensure that all necessary services (e.g., databases, third-party APIs) are running.
- Check your environment variables or config files for the correct host and port details.

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

- Use Keploy’s mocking features to mock external services and databases.
- Exclude or handle non-deterministic values using Keploy’s configuration to ensure stable comparisons.

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

- Ensure that the test environment mirrors the configuration used during recording.
- Use database mocks or stubs if testing in isolation from the database is desired.

### 7. Missing or Invalid Configuration Error

#### Description:

Keploy cannot find a valid configuration file or encounters errors in the configuration.

#### Possible Cause:

- The Keploy configuration file (keploy.yaml or similar) is missing or contains invalid values.
- Environment variables required by Keploy may not be set.

#### Solution:

- Double-check the configuration file format and ensure all required fields are populated.
- Verify that environment variables (like API keys, URLs) are correctly set and accessible.

### 8. Timeout Errors

#### Description:

Keploy times out while recording or replaying API calls.

#### Possible Cause:

- Long-running API requests or slow external dependencies can cause timeout issues.
- Keploy may have low timeout settings for API calls.

#### Solution:

- Increase the timeout settings in Keploy’s configuration.
- Investigate slow-performing services or optimize the API to reduce request time.

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

- Ensure that all components, including Keploy and its SDKs, are compatible with each other.
- Consult the Keploy documentation or release notes for any breaking changes in recent versions.

### 11. Unsupported Protocol or API

#### Description:

Keploy does not support the protocol or API structure you are using (e.g., gRPC, SOAP, etc.).

#### Possible Cause:

- The application might use an API or protocol that Keploy doesn’t yet support (e.g., WebSocket, gRPC).

#### Solution:

- Confirm that your API format is supported. Keploy currently supports HTTP/REST and GraphQL. For unsupported APIs, you may need to use alternative testing tools or frameworks.

Hope this helps you out, if you are still facing any issues, please feel free to reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
