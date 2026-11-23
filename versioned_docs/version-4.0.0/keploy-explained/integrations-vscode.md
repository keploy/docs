---
id: integrations-vscode
title: IDE integrations — VS Code
sidebar_label: VS Code
description: Keploy's VS Code extension installs the Keploy CLI, signs you in, and hands the setup of Keploy's dependency mocks to your coding agent.
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

Keploy's VS Code extension, **Keploy: API Testing, Mocks & Service Virtualization**, sets up the [`keploy mock`](/docs/universal-mocker/mock-your-tests/) loop through the coding agent you already use. Keploy records the real calls your tests make to APIs and databases, then replays your tests with those dependencies switched off. The extension installs the Keploy CLI for you, signs you in, installs Keploy's skill for your project, and hands the setup to Claude Code (its VS Code extension's chat, or the `claude` CLI in an integrated terminal), GitHub Copilot, or Cursor's agent. When both the Claude Code extension and the `claude` CLI are installed, it asks once whether to use **Claude Code (chat)** or **Claude Code (terminal)**; with no Claude Code installed, it asks once per workspace rather than silently handing off to another agent. It then shows what the CLI reports about each test, stages the setup's files for you to commit, and helps wire CI replay for every project and CI system.

Install it from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=keploy.keployio), then follow the [VS Code walkthrough](/docs/universal-mocker/walkthroughs/vscode/) or the [VS Code extension guide](/docs/running-keploy/utg-vscode-extension/).

The extension no longer generates unit tests. To generate unit tests, use Keploy's [PR Agent](/docs/running-keploy/utg-pr-agent/).

## Request another editor

If you need Keploy in JetBrains, Neovim, or another editor, [tell our team](mailto:support@keploy.io).

## Related

- [Keploy VS Code extension](/docs/running-keploy/utg-vscode-extension/) — install, sign in, set up with your agent, and troubleshoot.
- [Mock your tests](/docs/universal-mocker/mock-your-tests/) — the `keploy mock` commands your agent runs.
- [SCM Integrations — PR Agent](/docs/keploy-explained/integrations-pr-agent/) — the pull-request integration.
- [Keploy Troubleshooting Guide](/docs/keploy-explained/common-errors/) — fix common setup issues.
- [What is Keploy?](/docs/keploy-explained/introduction/) — project overview.
