---
id: integrations-vscode
title: IDE integrations — VS Code
sidebar_label: VS Code
description: Keploy's VS Code extension records the API and database calls your tests make and replays them with those dependencies switched off, from inside the editor.
tags:
  - integrations
  - vscode
  - mocks
keywords:
  - keploy vs code extension
  - vscode mocks
  - api mocks
  - database mocks
---

# IDE integrations — VS Code

Keploy's VS Code extension, **Keploy: API & DB Mocks**, brings the [`keploy mock`](/docs/running-keploy/mock-your-tests/) loop into the editor. It records the real calls your tests make to APIs and databases, then replays your tests with those dependencies switched off. It installs the Keploy CLI for you, can set up your AI coding agent to record and replay, and can add a CI job that replays the recording on every pull request.

Install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=keploy.keployio), then follow the [VS Code extension guide](/docs/running-keploy/utg-vscode-extension/).

The extension no longer generates unit tests. To generate unit tests, use Keploy's [PR Agent](/docs/running-keploy/utg-pr-agent/).

## Request another editor

If you need Keploy in JetBrains, Neovim, or another editor, [tell our team](mailto:support@keploy.io).

## Related

- [Keploy VS Code extension](/docs/running-keploy/utg-vscode-extension/) — install, record, replay, and troubleshoot.
- [Mock your tests](/docs/running-keploy/mock-your-tests/) — the `keploy mock` commands the extension runs.
- [SCM Integrations — PR Agent](/docs/keploy-explained/integrations-pr-agent/) — the pull-request integration.
- [Keploy Troubleshooting Guide](/docs/keploy-explained/common-errors/) — fix common setup issues.
- [What is Keploy?](/docs/keploy-explained/introduction/) — project overview.
