---
id: integrations-pr-agent
title: SCM Integrations — PR Agent
sidebar_label: Integrations & Connected Tools
description: See which platforms Keploy integrates with for automated PR testing.
tags:
  - integrations
  - github
  - PR agent
---

# 🔗 SCM Integrations — PR Agent

Keploy’s PR Agent helps automate code reviews, testing, and feedback—right where you work.

## What the PR Agent does

The PR Agent runs Keploy inside your source-control workflow and comments back on the pull request itself, so test feedback lives next to the code being reviewed instead of in a separate dashboard. On each pull request it can:

- **Generate and run tests** against the changed code and report pass/fail status as a PR check.
- **Surface coverage** so reviewers can see whether new code is exercised by tests before merging.
- **Leave inline feedback** on the diff, highlighting untested paths or regressions the recorded suites catch.

This keeps the "did this change break anything?" question answerable at review time, rather than after a merge.

## ✅ Currently Supported

**GitHub:**  
Our PR Agent seamlessly integrates with GitHub repositories for test automation, coverage checks, and intelligent feedback on your pull requests. If you already run Keploy in CI, the PR Agent complements the [CI/CD GitHub setup](/docs/ci-cd/github/) by adding review-time feedback on top of your pipeline runs.

## 💡 Need Support for Another Platform?

Want Keploy’s PR Agent on GitLab, Bitbucket, or another platform?

[Reach out to our team!](mailto:support@keploy.io)

We’re always open to feedback and requests as we expand our integration support.

**More integrations are coming soon—stay tuned!**

## Related

- [Generate API tests using AI](/docs/running-keploy/generate-api-tests-using-ai/) — the test-generation engine the PR Agent runs on your changes.
- [UTG PR Agent (unit-test generation on PRs)](/docs/running-keploy/utg-pr-agent/) — the companion agent for unit tests.
- [CI/CD with GitHub Actions](/docs/ci-cd/github/) — wire Keploy into your GitHub pipeline.
