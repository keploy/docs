---
id: overview
title: Unit testing with Keploy
sidebar_label: Overview
slug: /unit-testing/
description: Keploy's PR agent generates unit tests for the code each pull request changes and posts them on the pull request.
keywords:
  - unit test generation
  - pr agent
  - github app
---

Keploy's **PR agent** generates unit tests for the code a pull request changes. Install the Keploy GitHub App on a repository. When you open a pull request, the agent reads the change, generates unit tests for it, and comments on the pull request with what it generated.

<CardGrid>
  <Card title="Set up the PR agent" href="/running-keploy/utg-pr-agent/">
    Install the GitHub App and get tests on your next pull request.
  </Card>
  <Card title="Supported platforms" href="/keploy-explained/integrations-pr-agent/">
    The source-control platforms the PR agent works with.
  </Card>
</CardGrid>

To catch regressions in a whole service with its dependencies mocked, see [integration testing](/integration-testing/).
