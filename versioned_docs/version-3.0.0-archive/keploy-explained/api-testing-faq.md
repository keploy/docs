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

Let's get to the heart of Keploy API Testing with some fun Q&A!

### 1. What types of API tests can Keploy generate?

Keploy automatically creates:

- **Functional Tests** – CRUD operations, endpoint validation
- **Edge Case Tests** – Invalid payloads, error responses
- **Performance Tests** – Response time checks
- **Security Tests** – Input sanitization, auth validation
- **Dependency Tests** – Mocked external service calls

### 2. How does Keploy handle authentication in API tests?

Keploy supports:

- **Auth Types:** JWT, OAuth2, API Keys, Basic Auth
- **Token Refresh:** Auto-renews tokens as needed
- **Test Isolation:** Uses separate auth contexts per test
- **Secure Storage:** No raw credentials stored—uses environment variables

### 3. What protocols and formats does Keploy support?

| Protocol   | Formats          | Features          |
| ---------- | ---------------- | ----------------- |
| HTTP/HTTPS | JSON, XML        | Full support      |
| gRPC       | Protocol Buffers | Code generation   |
| WebSockets | JSON, Binary     | Session testing   |
| GraphQL    | Query/Mutation   | Schema validation |

### 4. How does test generation work for stateful APIs?

Keploy handles stateful workflows by:

1. Capturing session cookies and headers
2. Detecting request dependencies
3. Creating cleanup/teardown steps
4. Isolating test contexts

**Example:**  
`POST /cart → GET /cart → POST /checkout → GET /order/{id}`

### 5. How does Keploy ensure security and compliance?

- **Encryption:** All data is encrypted in transit and at rest
- **Principle of Least Privilege:** Minimum necessary access to data
- **Redundancy:** Fault-tolerant and resilient infrastructure
- **Audits:** Regular security assessments
- **Compliance:** ISO 27001, SOC 2, GDPR, HIPAA

### 6. How does Keploy protect my API data and test traffic?

- No data shared with third parties
- Full transparency about data handling
- Test data is used only for your tests
- Keploy never mines or analyzes your test data for AI training or marketing

### 7. Does Keploy use my data to train AI models?

No. Keploy does **not** use your API data, requests, responses, or logs to train any AI model—internal or external.

### 8. How does Keploy use AI for API testing?

Keploy combines multiple AI models:

- **Gemini 2.5 Pro (Google):** For reasoning and flow understanding
- **GPT-4 (OpenAI):** For robust coverage and complex scenario handling
- **Other LLMs:** Added based on task fit and ongoing evaluation

**How It Works:**

- Smart routing of tasks to the best model
- Tests are validated and cleaned up before output
- Weak or redundant tests are filtered out

### 9. Can I see which model Keploy used for test generation?

We select models automatically, but always prioritize reliability, privacy, and quality. Your code or test data is **never** used to train models.

### 10. What privacy controls do I have?

- You can delete your test data at any time
- All logs, requests, and test artifacts are encrypted
- Keploy gives you full visibility and control

### 11. Want to know more?

Have questions or need a security report for your team? [Contact us!](mailto:support@keploy.io)

Your code, your data, your control. 🔐

Hope this helps you out, if you still have any questions, reach out to us .
