---
id: api-testing-faq
title: API Testing – Frequently Asked Questions
sidebar_label: FAQs
description: Answers to the most common questions about API testing with Keploy.
tags:
  - explanation
  - faq
---

# Got Questions? We’ve Got Answers! 🚀

Everything you want to know about API testing with Keploy—straightforward and no fluff.

### 1. What types of API tests can Keploy generate?

Keploy automatically creates:

- **Functional Tests:** CRUD operations, endpoint validation
- **Edge Case Tests:** Invalid payloads, error responses
- **Performance Tests:** Response time checks
- **Security Tests:** Input sanitization, auth validation
- **Dependency Tests:** Mocked external service calls

### 2. How does Keploy handle authentication in API tests?

Keploy supports:

- **Auth Types:** JWT, OAuth2, API Keys, Basic Auth
- **Auto-Renewal:** Token refresh flows
- **Test Isolation:** Separate auth contexts per test
- **Security:** No raw credentials stored—uses environment variables

### 3. What protocols and formats does Keploy support?

| Protocol   | Formats          | Features          |
| ---------- | ---------------- | ----------------- |
| HTTP/HTTPS | JSON, XML        | Full support      |
| gRPC       | Protocol Buffers | Code generation   |
| WebSockets | JSON, Binary     | Session testing   |
| GraphQL    | Query/Mutation   | Schema validation |

### 4. How does test generation work for stateful APIs?

Keploy handles stateful workflows by:

1. Recording session cookies/headers
2. Detecting data dependencies between calls
3. Generating cleanup steps (teardown)
4. Creating isolated test contexts

**Example:**  
`POST /cart → GET /cart → POST /checkout → GET /order/{id}`

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
