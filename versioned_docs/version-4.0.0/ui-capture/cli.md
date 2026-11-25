---
id: cli
title: "UI Testing CLI reference: keploy login, keploy mcp-install and keploy ui"
sidebar_label: CLI
description: What the keploy binary does for UI Testing: signing in, connecting an AI agent to the Keploy MCP server, checking capture readiness with keploy ui status, and replaying journeys with keploy ui run.
tags:
  - UI testing
  - UI capture
  - CLI
  - reference
keywords:
  - keploy login
  - keploy mcp-install
  - Keploy CLI
  - AI agent
  - MCP
  - UI capture
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

For UI Testing, the `keploy` binary signs you in to Keploy from a terminal or an AI agent's shell, connects your AI agent to the Keploy MCP server, and in Enterprise CLI `v3.9.20` and later (Linux and macOS) checks capture readiness (`keploy ui status`) and replays recorded journeys as Playwright tests (`keploy ui run`).

To install it, see [Install Keploy](../server/installation.md).

## Sign in from a terminal or an agent {#keploy-login}

```bash
keploy login
```

`keploy login` signs you in through your browser and waits until you approve the sign-in. With an API key in `KEPLOY_API_KEY`, or a session it saved before, it uses that instead.

An AI agent's shell shows a command's output only when the command exits, so an agent signs in in two steps:

```bash
keploy login --no-wait --json
# a person opens the link and approves the code
keploy login --finish --json
```

1. `keploy login --no-wait` prints the sign-in link and code and exits without waiting. The agent shows them to you.
2. You open the link and approve the code.
3. `keploy login --finish` collects the session. It waits up to 70 seconds for the approval, and can be run again until the code expires.

| Flag             | What it does                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `--no-wait`      | Print the sign-in link and code and exit instead of waiting.                                                                          |
| `--finish`       | Collect the session for the sign-in started by `--no-wait`.                                                                           |
| `--new`          | With `--no-wait`: discard the sign-in waiting here and start a new one. Without it, `--no-wait` shows the waiting code or link again. |
| `--json`         | With `--no-wait` or `--finish`: print the answer as one JSON document on stdout, for AI agents and tools. Logs go to stderr.          |
| `--api-key`      | A Keploy API key for this invocation, in place of the `KEPLOY_API_KEY` environment variable.                                          |
| `--show`         | Print the API key a login uses here (its last 4 characters only) and where it comes from, then exit without signing in.               |
| `--manual-login` | Ask for an API key to paste instead of opening the browser.                                                                           |

When an API key is set, in `KEPLOY_API_KEY` or with `--api-key`, and the server accepts it, `keploy login --no-wait` answers that you are signed in and starts no sign-in.

## Connect your agent {#keploy-mcp-install}

```bash
keploy mcp-install --editor claude-code
```

`keploy mcp-install` uses the session `keploy login` saved: sign in first. It mints a personal access token for the Keploy MCP server and writes the server, `https://api.keploy.io/client/v1/mcp` with that token, into your agent's MCP configuration as `keploy`. The UI capture tools are then available to the agent: see [MCP tools](./mcp-tools.md).

| Flag               | What it does                                                                                                                                                                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--editor <name>`  | The agent to configure: `claude-code`, `cursor`, `windsurf`, `claude-desktop`, `codex`, `antigravity` or `github-copilot`. For `github-copilot`, which has no configuration file on disk, it prints a block to paste. Pass this or `--all`. |
| `--all`            | Configure every MCP-aware agent found on this machine. GitHub Copilot is not detected: configure it with `--editor github-copilot`.                                                                                                         |
| `--scope <scope>`  | `global` (the default) configures the agent for every project on this machine. `project` configures it for the current directory, for Claude Code, Cursor and Codex; for Cursor and Codex that writes the token into a file in your repo.   |
| `--api-server-url` | The Keploy API server to connect to. The default is `https://api.keploy.io`. Pass your own server's URL when you self-host.                                                                                                                 |
| `--rotate`         | Mint a new token and revoke the current one. Every agent configured with the old token must then be configured again.                                                                                                                       |
| `--show-token`     | Print the real token inside the copy-paste blocks. Off by default, because those blocks end up in terminal scrollback and CI logs.                                                                                                          |

The token is minted once and reused: `mcp-install` keeps it in `~/.keploy/mcp.yaml`, so configuring one more agent leaves the others working. It expires after 90 days. When your agents start getting `401`, run `keploy mcp-install --rotate`: without `--rotate`, `mcp-install` hands out the cached token again. Minting a new one, with `--rotate`, on another machine or by signing in to the Keploy VS Code extension, which mints its token the same way, revokes the ones minted before, and agents still holding them lose access.

The token carries the scopes your role in the company allows. Effective access is still what your role holds on each app: setting up capture needs `testgen:run` on the app, and reading flows needs `app:view`.

## In CI {#in-ci}

No person can approve a sign-in code in CI. To sign the `keploy` binary in there, set `KEPLOY_API_KEY` to a Keploy API key.

A CI job that checks capture status or reads the journey plan can call the [REST API](./rest-api.md) with a `UI_READER` service-account key (or a personal access token). To replay journeys as Playwright tests in CI, run `keploy ui run --app <id> --base-url <url>` with a `UI_RUNNER` service-account key in `KEPLOY_API_KEY` (Enterprise CLI `v3.9.20` and later on Linux and macOS).

## keploy ui {#keploy-ui}

Enterprise CLI `v3.9.20` and later ships the `keploy ui` commands on Linux and macOS (Beta):

- `keploy ui status --app <id>`: checks capture and replay readiness for an app.
- `keploy ui run --app <id> --base-url <url>`: replays recorded journeys as Playwright tests against recorded mocks.

Replaying journeys as Playwright tests is in beta: see [what works today](../running-keploy/ui-capture.md#what-works-today).

## Related

- [AI agent quickstart](./quickstart-agent.md)
- [Operate UI capture from an AI agent](./agents.md)
- [MCP tools](./mcp-tools.md)
- [REST API](./rest-api.md)
- [Install Keploy](../server/installation.md)
