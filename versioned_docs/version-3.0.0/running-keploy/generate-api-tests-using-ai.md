---
id: generate-api-tests-using-ai
title: Generate API Tests using AI
sidebar_label: Generate API Tests
description: Learn how to use Keploy’s API Test Generator to generate high-quality API test suites using AI from OpenAPI, curl, Postman, or traffic.
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Team, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide will help you generate automated API tests using Keploy's AI-based test engine by providing structured inputs like OpenAPI specs, curl commands, Postman collections, or live endpoints.

> 👉 If you want to record API flows by interacting with your web app through a browser, follow this guide instead: [Record API Tests via Chrome Extension](https://keploy.io/docs/running-keploy/api-testing-chrome-extension/)

## Getting Started

- Go to the [Keploy Console](https://app.keploy.io/api-testing/generate)
- Upload your API input (schema, collection, or curl)
- 👊 Keploy’s engine triggers live requests against your target environment to capture the full execution context—including the API response and the resulting 
     dependency interactions (DB queries, internal gRPC calls)—creating a deterministic 'Digital Twin' of the transaction.
- If private endpoints are detected, follow the agent setup prompt
- Review and edit your generated tests

## ⚠️ Private Endpoint API Warning

If your API is not publicly accessible, Keploy will show a warning when attempting to reach those endpoints. **To resolve this**, install the Keploy Agent proxy locally. 
The Agent acts as a local interceptor that uses eBPF to record your service's interactions with its dependencies (Databases, APIs), ensuring tests can be replayed without environment setup.

### Keploy Agent Installation

| Platform    | Steps                                                                                                                                                                                                                                                                   |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **macOS**   | - [Download](https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/Keploy+Agent.dmg) <br /><br /> - Open the `.dmg` file and install the app normally. <br /><br /> - Launch the Keploy Agent after installation. <br />                                 |
| **Linux**   | - Run the following in your terminal: <br /><br /> `curl -L -O https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/keploy-agent-linux-amd64.tar.gz` <br /><br /> `tar -xzf keploy-agent-linux-amd64.tar.gz` <br /><br /> `./keploy-agent` <br /><br /> |
| **Windows** | - [Download](https://keploy-enterprise.s3.us-west-2.amazonaws.com/releases/latest/Keploy+Agent-windows_amd64.zip) <br /><br /> Extract the zip file and Launch the Keploy Agent. <br />                                                                                 |

> ✅ Once installed and running, return to the Keploy Console and hit **Generate API Tests**. The Keploy Agent creates a secure bridge to your local or private 
  environment, enabling our engine to interact with your service as if it were in production, capturing the underlying dependency calls (DB, 3rd party APIs) without code changes.

## BEST Practices for BEST Test Output

| Input Type               | Tips                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| OpenAPI Spec/Swagger Doc | Use OpenAPI v3, best if links are also mentioned                  |
| Postman Collection       | Export the postman collection and copy the JSON to keploy console |
| `curl` Commands          | Provide 3-4 WORKING (2xx) cURL commands along with responses      |
| Live Endpoint Only       | Ensure you're providing a valid and testable API base URL.        |

### Valid & Invalid URL Examples

Use a **base API path, not a homepage** or static resource, for generating test flows.

| URL Example                             |     | Why It's Good or Bad                         |
| --------------------------------------- | --- | -------------------------------------------- |
| `https://api.example.com`               | ✅  | API subdomain — general and testable         |
| `https://example.com/api`               | ✅  | API under path — works across many endpoints |
| `https://example.com/api/v2`            | ✅  | Versioned API route                          |
| `https://example.com/v2/orders`         | ✅  | Specific API group — stable path             |
| `https://example.com`                   | ❌  | Homepage — not an API                        |
| `https://example.com/index.html`        | ❌  | Static file — not useful for API testing     |
| `https://api.example.com/orders/126789` | ❌  | Too specific — single object, not general    |

> ⚠️ Avoid using URLs pointing to static resources or deeply nested objects.

## What Keploy Generates

Every test generated will include:

- ✅ API request + actual response
- ✅ Assertions on status, body, and headers
- ✅ Multi-step flow generation (e.g. POST → GET → DELETE)
- ✅ Automatic test deduplication
- ✅ Environment reusability for staging, QA, or CI
- ✅ Labeled, editable, and sharable from the dashboard

[//]: # "## Next Steps"
[//]: #
[//]: # "- 👉 [Run the generated tests](/docs/running-keploy/run-ai-generated-api-tests)"
[//]: # "- 🔁 [Self-heal for API changes](/docs/running-keploy/self-healing-ai-api-tests)"
[//]: # "- 🧹 [Review, clean, and improve test flows](/docs/running-keploy/review-and-improve-ai-generated-tests)"
[//]: # "- 🤝 [Share tests and test-reports with your team](/docs/running-keploy/share-tests)"
[//]: # "- 🚀 [Integrate tests in your CI/CD pipeline](/docs/running-keploy/ci-cd-ai-gen-api-tests)"
