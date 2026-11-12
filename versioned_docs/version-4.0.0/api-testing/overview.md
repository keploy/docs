---
id: overview
title: API testing with Keploy
sidebar_label: Overview
slug: /api-testing/
description: Generate validated API test suites with AI from an OpenAPI spec, a Postman collection, cURL commands or a live endpoint, then run them against any environment and in CI.
keywords:
  - api testing
  - ai test generation
  - openapi
  - postman
---

Keploy's API testing generates test suites for an API you point it at, then runs them against any environment: staging, QA or production. You give it an OpenAPI spec, a Postman collection, a few cURL commands, a live base URL, or browser actions recorded with the Chrome extension. Keploy calls the API, builds connected flows (create, then read, then update, then delete), and keeps only the tests whose responses it could verify.

API tests run against a live environment, with no mocks. To test a service in isolation with its dependencies mocked, use [integration testing](/integration-testing/).

## Start here

<CardGrid>
  <Card title="Generate tests with AI" href="/running-keploy/generate-api-tests-using-ai/">
    Upload a spec, a collection or cURL commands in the Console and generate a suite.
  </Card>
  <Card title="Record with the Chrome extension" href="/running-keploy/api-testing-chrome-extension/">
    Click through your web app and turn the API calls it makes into tests.
  </Card>
  <Card title="Generate from your coding agent" href="/running-keploy/agent-test-generation/">
    Let Claude Code or Cursor generate and run suites through Keploy's MCP server.
  </Card>
  <Card title="Run in CI" href="/running-keploy/api-testing-cicd/">
    Run your suites on every pull request with GitHub Actions.
  </Card>
</CardGrid>

## How it works

1. **Point Keploy at your API.** If the endpoints are private, run the [local agent](/running-keploy/api-testing-local-agent/) so the Console can reach them.
2. **Keploy generates suites.** Each suite is a flow of steps, with assertions taken from the real responses.
3. **Review and refine.** Edit steps and assertions, add variables and labels, and mark suites as buggy or not.
4. **Run anywhere.** Run from the Console, through a webhook or in CI, and read the run reports.
