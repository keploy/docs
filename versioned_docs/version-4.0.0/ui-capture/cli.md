---
id: cli
title: "UI Testing CLI reference: keploy login and keploy mcp-install"
sidebar_label: CLI
description: What the keploy binary does for UI Testing today, signing in and connecting an AI agent to the Keploy MCP server, and what it does not do yet.
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

The `keploy` binary has no UI Testing commands of its own. For UI Testing it does two things: it signs you in to Keploy, from a terminal or from an AI agent's shell, and it connects your AI agent to the Keploy MCP server, whose tools then set up capture and read flows and journeys. This page covers the released `keploy` binary.

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

The UI capture steps a CI job takes, such as checking capture status or reading the journey plan, are calls to the [REST API](./rest-api.md) with an API key, not `keploy` commands.

## keploy ui {#keploy-ui}

The `keploy ui` commands, the runner `keploy ui run` that replays journeys as Playwright tests among them, are not in a release build yet. In the released binary, `keploy ui --help` answers `Error: unknown command "ui" for "keploy"`. Replaying journeys as Playwright tests is in beta: see [what works today](../running-keploy/ui-capture.md#what-works-today).

## Related

- [AI agent quickstart](./quickstart-agent.md)
- [Operate UI capture from an AI agent](./agents.md)
- [MCP tools](./mcp-tools.md)
- [REST API](./rest-api.md)
- [Install Keploy](../server/installation.md)
