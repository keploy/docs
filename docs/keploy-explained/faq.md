---
id: faq
title: FAQ
sidebar_label: FAQ
tags:
  - explanation
  - faq
---

### 1. Is Keploy a unit testing framework?

No, keploy is designed to reduce time writing tests manually. It integrates with exising unit testing frameworks like (eg: go test, Junit, pytest, etc.) to ensure compatibility with existing tooling like code coverage, IDE support and CI pipeline/infrastructure support.

### 2. Does Keploy replace unit tests entirely?

If all your code paths can be invoked from API calls then yes, else you can still write testcases for some methods, but the idea is to save at least 80% of the effort.

### 3. What code changes do I need to do?

For `Java`, `Javascript/Typescript`, `Python` there are **no code-changes**. However, for `Golang` applications :

- **Web Framework/Router middleware** needs to be added to ensure keploy can intercept incoming request and inject instrumentation data in the request context.
- **Wrapping External calls** like database queries, http/gRPC calls needs to be done to ensure they are captured and correct mocks are generated for testing those requests.

### 4. How do I run keploy in my CI pipeline?

No changes necessary. You can reuse the pipeline which runs unit tests.

### 5. Does Keploy support read after write to DB scenarios?

Yes. Keploy records the write requests and read requests in the correct order. It then expects the application to perform the writes and reads in the same order. It would return the same database responses as captured earlier.

### 6. How does keploy handle fields like timestamps, random numbers (eg: uuids)?

A request only becomes a testcase if it passes our deduplication algorithm. If its becoming a testcase, a second request is sent to the same application instance (with the same request params) to check for difference in responses. Fields such as timestamps, uuids would be automatically flagged by comparing the second response with the first response. These fields are then ignored during testing going forward.

### 7. Can I use keploy to generate tests from production environments automatically?

Not yet. We are working on making our deduplication algorithm scalable enough to be used safely in production. If you are interested in this use-case, please connect with us on slack. We'd love to work with you to build the deduplication system and load test it with your systems.

### 8. What if my application behaviour changes?

If your application behaviour changes, the respective testcases would fail. You can then mark the new behaviour as normal by clicking on the normalise button.

### 9. Would keploy know if an external service changes?

Not yet. Unless that application is also using keploy, keploy would only test the functionality of the current application. We are working to detect scanning for API contract violations and adding multiple application to perform comprehensive integration tests. All contributions are welcome.
