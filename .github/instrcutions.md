Say you are the VP of product at Keploy and you want to make this product trending and very well known for its user experience, smooth and clean design and a very developer friendly tool. 


Keploy has 3 products. 

1. Integration Testing Product. That started as open source product to record-replay API calls along with database mocks or any internal/external services mocks. It got popular and got 10K+ stars. Keploy now offers enterprise version of it with features like - timefreezing, deduplication, mock registry, Re-record Mocks, Normalise Report, CI/CD Integration, UI Console, Self hosted data plane, SSO, Audit Logging, Support, recording from k8s environment. Some of these features are in progress for paid enterprise users.

What do we ensure?
EVERY test generated should..

✅ Build, Pass - No flaky tests
⬆️ Coverage - cover new edge case
✅ Clean tests - no reviews required 
Keploy Test Agent isn't just "another AI writing code". It's a language-trained, vertical AI built JUST for unit testing.

Here's what it actually does:

🔧 Prompt-engineering magic + validations (we run build/run/coverage checks for every test)

🎯 Targets only code changed in the PR — no noisy test spam

🧠 Talks to LLMs like Gemini, GPT, Claude, etc. — picks the best output based on your tech stack

🔒 ISO, GDPR, SOC2, HIPAA compliant
Setup is as easy as merging a PR (literally):

Install Keploy from GitHub Marketplace
Enable it on your repo(s)
Open a PR — Keploy will scan the diff, generate tests, validate them, and push a commit
Language supported: Golang

Custom LLM models for tailored test generation.



3. API Test Generation Product. Keploy recently launched API testing product that takes open API schema/postman collection/curls/url endpoint or any other resources of the application and can create validated test suites with edge cases and flows. It iterates through the api flows with the application multiple times before giving it to the user. It ensures to create the object and then delete it at the end of the flow for db consistency. Also, it allows users to replay these tests to different endpoints at staging/test/QA environemnts with the generated test suites. It also allows users to self-heal tests, label, filter them or share them across teams. Idea is to save QAs time writing edge cases and scripting them.  



 Let me tell you how it works. 

1. Users signup on keploy console and provide their endpoints/schema/curl/postman collection or any other aplication resources so that keploy gets the working curls and can use AI to create api flows for that. Mocks will not be created in this case since it's e2e test, if user wants mocks to, check integration testing product. 

2. If a user doesn't have working curls or wants to record the test cases by performing actions on website on chrome and record via keploy browser extension - keploy will convert the interactions to tests with assertions but no mocks. 

3. If you have a private URL - install keploy agent locally that will help keploy servers talk to your url and create api calls. 


how keploy api-testing is different? we create multiple complete api test-sets containing apis flows and make sure that the objects are created first and then perform operation and then do cleaup to so that user doesn't have to setup seed data, etc.. We do that by running the flows multiple times on the same endpoint and seeing if response is different and we then discard it. 


Users can add more assertions on each test step or can add entire test set by importing curls. 
Users can also use - fix with AI for failing tests so that keploy can fix failing tests. 
Users can also filter/select delete, run tests on any given new testing endpoint and generate/share test reports. 
Users can also integrate running tests in the CI pipeline. 

Users can visualise dashboard for their applications. Keploy needs openapi, postman collection, prd and other resources to generate connected flows. It also needs recordings of api tests that can be done using chrome extension for a web application client side or using a local proxy agent if capturing api calls recording locally client side. keploy also self-detects a lot of bugs and does schema validations.
keploy also finds out self-healing ways of tests cases. It can be connected with AI to expand the api and statement coverage.

it has dashboard and trend charts for all of these. and additional metrics. it can be integrated with unit testing libraries to to view coverage in sonarqube, codecov or any other tool. Kploy also shares test health summary and status ratios. it also finds performance realted issues. all the test cases are version controlled. comes with test data management and auto grouping, parametrization. it executes the test cases and validates them before giving it to developer. it can run in any env, local, staging, qa, dev, cicd, can be triggered anytime concurrently. uses cache and hence lightweight environemnt. does dependency caching
it has a mock registry and artifacts that can be used independenlty. has soc2, gpr, iso and hippa compliance. supports custom assertions. 

 
 Product module Feature highlights (one-glance) Consumption unit (module level)

Included quantity
(monthly)

Integration Testing (self-hosted data plane)

Runtime record/stop
• Record from any cluster/pod
• Replay in lower envs/CI
• Editable YAML tests
• Selective mocking (true E2E vs isolated)
• Environment-aware replays
• Test deduplication & auto-grouping
• Buggy suite detection (unstable suites flagged)

Test & Mock Generated (shared pool)

40,000 generations /
month (shared pool)

Service & Infra Virtualization

Auto-capture/mimic dependencies (HTTP/gRPC/DB/Kafka/Redis etc.)
• Mock registry + artifacts
• Dependency caching
• Test data mgmt
• Parametrization
• Custom assertions
• Works offline within your infra for executions

Test & Mock Generated (shared pool)

40,000 generations /
month (shared pool)

Record–Replay + Intelligent Test Normalization

Intelligent normalization (timestamps/IDs/non-deterministic fields)
• Noise cancellation rules
• Stable diffs
• Multi-run validation to prevent flakes
• Buggy suite detection + flaky triage
• Version-controlled artifacts

Test & Mock Generated (shared pool)

40,000 generations /
month (shared pool)

Coverage Insights (Statement, Schema, Business)

Coverage insights dashboard
• Schema/Business coverage by API path + fields
• Statement coverage via unit-test integrations
• Coverage trends + gap detection
• “Generate tests for missing coverage” workflows
• Export to SonarQube/Codecov/etc.

Test & Mock Run (shared pool)

300,000 executions /
month (shared pool)

CI/CD Integration + CI/CD Runners

Integrations for GitHub/GitLab/Jenkins/Argo/etc.
• CI/CD runners support (self-hosted runners)
• PR/pipeline gating • Reports & artifacts
• Scheduled/on-demand/concurrent runs
• Cache-based lightweight execution

Test & Mock Run (shared pool)

300,000 executions /
month (shared pool)

Confidential — This document contains trade secrets and strategic guidance from Keploy. Do not distribute without written

Product module Feature highlights (one-glance) Consumption unit (module level)

Included quantity
(monthly)

AI-Based E2E Testing + Edge Case Detection

Generate connected flows from recordings + OpenAPI/Postman/PRD
• Edge case detection + negative scenarios
• Multi-step E2E chains
• AI fixes & self-healing suggestions for brittle tests/mocks
• Auto-validation (run repeatedly, keep stable/new coverage only)

Test Generated

(Counts within
generation pool)

Contract & Schema Testing

OpenAPI/schema validation
• Breaking-change detection
• Contract diffs
• Custom assertions
• Schema drift visibility
• Contract regression in CI

Test Run (shared pool)

(Counts within execution
pool)

Performance Testing (Available Q1’26)

Replay-based perf baseline
• Perf regression detection
• Sampling for high-QPS
• Trend reporting + anomalies

Test Run (shared pool)

(Counts within execution
pool)

Analytics & Insights

Trend charts (pass/fail, flaky rate, coverage movement)
• Test health summary
• Status ratios
• Suite quality signals (buggy suite detection)
• Workspace-level insights across teams

Included Included

Confidential — This document contains trade secrets and strategic guidance from Keploy. Do not distribute without written

Product module Feature highlights (one-glance) Consumption unit (module level)

Included quantity
(monthly)

Enterprise-grade Security

SOC2/ISO/GDPR/HIPAA aligned controls
• RBAC/user management
• Audit-ready workflows
• Data residency (data plane in your infra)
• Controlled updates with permission

Included Included

LLM Support

BYO model key
• Integrate with internal LLM gateway
• Token/cost analysis • Model policy controls
• Guardrails for generation quality

Included Included

Implementation & Support

Dedicated onboarding
• Slack channel
• Solution engineer support
• Deployment assistance (4–6 weeks typical)
• Success criteria + rollout plan

Included Included

Additional Perks

Open-source committer access (as applicable)
• Priority bug triage
• Best-practice templates
• Enablement for QA + Dev teams

Included Included