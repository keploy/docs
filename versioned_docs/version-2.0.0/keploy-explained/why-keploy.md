---
id: why-keploy
title: Why Keploy?
sidebar_label: Why Keploy?
tags:
  - explanation
  - why keploy
  - automated testing
  - test scripts
  - manual testing
  - record replay test
---

| **Feature**                                | **Automated Test-Scripting Tools**                      | **Record-Replay Traffic Tools**                                       | **Keploy**                                                              |
| ------------------------------------------ | ------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Test Scripting**                         | Manual test script creation.                            | Record user traffic as tests scripts.                                 | Automatic user traffic recording as test scripts.                       |
| **Mocking Dependencies**                   | Manual mock/stub writing.                               | Setup test environments for dependencies.                             | Automatic mocking of dependencies CRUD operations.                      |
| **Test Coverage**                          | Coverage reliant on script quality.                     | Coverage based on recorded traffic.                                   | Line coverage derived from code quality.                                |
| **Code-Less Integration**                  | Requires scripting for integration.                     | Relies on traffic replication pipelines and mock scripts.             | Uses EBPF for no-code, language-agnostic integration.                   |
| **Noise Detection**                        | Manual noise and data noise identification.             | Limited capability to filter noisy parameters.                        | Accurate noise detection, flagging random/noisy fields.                 |
| **Ease of Use**                            | Moderate learning curve for scripting.                  | Difficulty in recording interactions and test environment management. | User-friendly with quick adoption.                                      |
| **CI/CD Integration**                      | Integration via unit test libraries in CI/CD pipelines. | Limited CI/CD integration, specific environments required.            | Easy integration using unit test libraries in CI/CD.                    |
| **Flexibility**                            | Scripting offers flexibility but is time-consuming.     | Limited flexibility tied to recorded traffic.                         | Highly flexible for various API flows, versatile mocks, and test cases. |
| **Effort Required for 100% Test Coverage** | Requires 50% of development time.                       | Requires 100% of development time.                                    | Requires only 1% of development time.                                   |
| **Community/Support**                      | Support varies based on tool popularity.                | May have limited support.                                             | Active community and documentation.                                     |

### Join the Keploy adventure!

⭐ If you're excited about what's coming, show some love by [starring Keploy on GitHub](https://github.com/keploy/keploy)

🤙 We're happy to hear from you in-case you want to deep-dive. [Schedule a demo](https://calendar.app.google/3mHeyaoKg3A2qkqF6) – because the best tests are yet to come! 🚀🎉

import GetSupport from '../concepts/support.md'

<GetSupport/>
