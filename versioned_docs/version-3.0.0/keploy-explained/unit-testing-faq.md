---
id: unit-testing-faq
title: Frequently Asked Questions
sidebar_label: FAQs
tags:
  - explanation
  - faq
---

# Got Questions? We’ve Got Answers! 🚀

Let's get to the heart of Keploy Unit Testing with some fun Q&A!

### 1. What is Keploy's Unit Test Generator (UTG)?

Keploy's UTG automatically creates unit tests using code semantics and AI. It helps improve code coverage and catch bugs early, with minimal manual effort.

### 2. Does Keploy send my code to the cloud?

Only when using the Unit Test Generator feature—and even then, just the necessary code/test context is sent to the LLM (Large Language Model) you're using. You can also plug in your **own private LLM**, keeping everything within your infrastructure.

### 3. Is my code or data used to train AI models?

No. Never. Keploy does **not** use your code, test cases, or data to train any internal or external AI models.

### 4. Which AI models does Keploy support?

Keploy supports:

- **Gemini 2.5 Pro (Google)**
- **GPT-4 family (OpenAI)**
- **Other specialized models**

We route test generation tasks to the model best suited for each case, and validate results to ensure high-quality tests.

### 5. How does Keploy protect my data?

Keploy follows strict security practices:

- Data is encrypted in transit and at rest
- No data is shared with third parties
- We are compliant with **ISO 27001**, **SOC 2**, **GDPR**, and **HIPAA**

### 6. What kind of privacy guarantees does Keploy offer?

- Your code is **never shared** or analyzed for marketing
- All data is fully encrypted
- You can delete your data anytime
- Full transparency in how we handle your information

### 7. Which languages are supported for AI-powered test generation?

- ✅ **Go (Golang)**: Full support for generating, running, and validating tests.
- 🚀 **JavaScript** support is coming soon.

We only keep tests that pass, build, and increase coverage—everything else is discarded.

### 8. How does Keploy improve unit test coverage?

By automating the hard parts. Keploy:

- Creates tests automatically
- Targets edge cases
- Filters flaky or redundant tests
- Reports coverage via **Cobertura** format

### 9. Is Keploy suitable for large codebases?

Yes! Keploy is built to handle large, complex projects. Processing time may vary based on size, but the output remains optimized.

### 10. Which method should I use to generate tests?

- **PR Agent**: Best for automated test generation on GitHub pull requests.
- **VS Code Extension**: Ideal for developers who prefer working in their IDE.
- **CLI Tool**: For those who want more control or integrate into scripts.

### 11. Do I need an API key?

Only for the CLI method. Other tools like PR Agent and VS Code Extension use their own secure auth flows.

### 12. How does Keploy ensure the quality of generated tests?

- We validate every test: it must build, pass, and increase coverage.
- Tests that don’t add value are automatically removed.
- We focus on **fewer, stronger** tests—not noise.

### 13. How is Keploy secure and compliant?

Keploy is built on:

- **End-to-end encryption**
- **Least privilege access**
- **Redundant infrastructure**
- Regular **security audits**

We’re committed to keeping your trust.

### 14. What’s next for Keploy?

- Expanding support for more languages
- More model choices for users
- Deeper IDE and CI/CD integrations

Hope this helps you out, if you still have any questions, reach out to us .
