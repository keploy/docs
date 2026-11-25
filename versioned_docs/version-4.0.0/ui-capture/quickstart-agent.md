---
id: quickstart-agent
title: "UI Testing quickstart for AI agents: set up capture from Claude Code, Cursor or Codex"
sidebar_label: AI agent quickstart
description: Connect your AI coding agent to the Keploy MCP server and have it set up UI capture in your web app and read the first flows for you.
tags:
  - UI testing
  - UI capture
  - quickstart
  - AI agent
  - MCP
keywords:
  - UI capture quickstart
  - AI agent
  - Keploy MCP server
  - Claude Code
  - Cursor
  - Codex
---

import HowTo from '@site/src/components/HowTo';
import ProductTier from '@site/src/components/ProductTier';

<HowTo
name="Set up Keploy UI capture from an AI agent"
description="Connect an AI coding agent to the Keploy MCP server, ask it to set up UI capture in your web app, use the app, and have the agent read the recorded flows."
totalTime="PT10M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["An AI coding agent with MCP, such as Claude Code, Cursor or Codex", "A web app's repository", "A browser"]}
visible={false}
steps={[
{
name: "Connect your agent to Keploy",
text: "Add the Keploy MCP server, https://api.keploy.io/client/v1/mcp, to your agent: sign in with OAuth, send a personal access token in the Authorization header, or run keploy login and keploy mcp-install.",
url: "#connect-your-agent",
},
{
name: "Ask your agent",
text: "Ask the agent to set up Keploy UI capture for your app and tell you when the first flows are ready.",
url: "#ask-your-agent",
},
{
name: "Let the agent set up capture",
text: "The agent creates the app if you have none, mints an ingest key with uiCaptureSetup, adds the capture SDK to your frontend, and checks uiCaptureStatus.",
url: "#what-the-agent-does",
},
{
name: "Use your app",
text: "Use your app in a browser, then close the tab. The agent ends the visit with POST /ui/v1/sessions/<session id>/complete, or waits 30 minutes.",
url: "#use-your-app",
},
{
name: "Read the flows",
text: "When uiCaptureStatus says FLOWS_READY, the agent reads the flows with listUIFlows and getUIFlow, and the journeys with uiJourneys.",
url: "#read-the-flows",
},
]}
/>

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

In this quickstart your AI coding agent sets up Keploy UI capture for you. You connect it to the Keploy MCP server and ask it to set up capture; the agent mints an ingest key, adds the capture SDK to your frontend, and reads the **UI flows** your first visits make. Apart from creating a token, if you connect with one, you never open the dashboard. It takes about 10 minutes.

:::note Beta
UI Testing is in beta. Recording visits and reading them as flows and journeys works today. Replaying journeys as Playwright tests is in beta too: Keploy `3.9.20` and later ships `keploy ui status` and `keploy ui run` on Linux and macOS. See [what works today](../running-keploy/ui-capture.md#what-works-today).
:::

## Start from Keploy Guide {#start-from-keploy-guide}

If you are new to Keploy, you can start directly from **Keploy Guide** at [app.keploy.io/guide](https://app.keploy.io/guide) (or jump straight to UI testing with [app.keploy.io/guide?product=ui_testing](https://app.keploy.io/guide?product=ui_testing)). Pick **UI testing (Beta)**, then copy the ready-to-paste prompt into your coding agent (Claude Code, Cursor, Copilot, or any coding agent) to set up your repository step by step.

The Guide prompt walks your agent through:

1. **Non-blocking CLI sign-in:** runs `keploy login --no-wait && keploy login --finish` so you can approve sign-in in your browser without blocking the agent's shell.
2. **Ingest key setup:** creates an ingest key under **UI Testing → Setup & Keys** ([app.keploy.io/ui-testing/setup](https://app.keploy.io/ui-testing/setup)) or with the MCP tool `uiCaptureSetup`.
3. **Local or staging SDK install first:** installs `@keploy/capture-sdk` in a local or staging environment first (before production) with browser-side masking configured — see [Privacy and masking](./privacy.md).
4. **Immediate flow extraction:** after you browse the app and close its tab, end the visit at once through the session-complete endpoint (`POST /ui/v1/sessions/<sdkSessionId>/complete` on your Keploy API host with the ingest key in `X-API-Key`; see [End a visit at once](./sessions-and-sampling.md#end-a-visit-at-once)) so Keploy extracts flows right away instead of waiting for the 30-minute idle timeout.
5. **Status and replay:** checks readiness with `keploy ui status --app <id>` (on Windows, use the MCP tool `uiCaptureStatus`) and replays the recorded journeys as Playwright tests with `keploy ui run --app <id> --base-url <url>` (Keploy `3.9.20` and later, Linux and macOS).

Read on to connect your agent to the Keploy MCP server manually and walk through each tool call.

## Before you begin

- A Keploy account. Sign in at [app.keploy.io](https://app.keploy.io).
- An AI coding agent that can use MCP servers over HTTP, such as Claude Code, Cursor, Codex, Windsurf or Antigravity.
- Your web app's repository, open in the agent. To try it on a sample first, use the [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop): `git clone https://github.com/keploy/samples-typescript`, then open `samples-typescript/ui-capture-react-shop`.
- Permission to run test generation on the app (`testgen:run`), and a credential with the `write` scope: minting an ingest key needs both, and creating an app needs `write`.

## 1. Connect your agent to Keploy {#connect-your-agent}

The Keploy MCP server is at `https://api.keploy.io/client/v1/mcp`. Connect your agent to it one of three ways.

**Sign in with OAuth.** Add the server with no key. For Claude Code:

```bash
claude mcp add --transport http keploy https://api.keploy.io/client/v1/mcp
```

The server answers a request with no key with `401` and a pointer to its OAuth metadata, and an agent that supports MCP OAuth starts the sign-in from that by itself: you approve it in your browser. The sign-in can read and write, but not delete apps. It is listed under **Settings → Authorized apps** in the dashboard, where you can revoke it.

**With a personal access token.** In the dashboard, open **Settings → API Keys → Generate new token**, and give the token the **Read** and **Write** scopes. Put it in `KEPLOY_PAT`, then add the server with it. For Claude Code:

```bash
claude mcp add --transport http keploy https://api.keploy.io/client/v1/mcp \
  --header "Authorization: Bearer $KEPLOY_PAT"
```

This is the command the setup card under **UI Testing → UI Flows** shows, for the server your dashboard uses:

<img src="/docs/img/ui-capture/ui-capture-agent-callout.webp" alt="The setup card's section Setting this up with an AI agent or a script?, with the claude mcp add command for the Keploy MCP server and a curl command that mints an ingest key" width="100%" />

**With the keploy CLI.** If you have the `keploy` binary, sign in and let it configure your agent:

```bash
keploy login
keploy mcp-install --editor claude-code
```

`--editor` also takes `cursor`, `windsurf`, `claude-desktop`, `codex`, `antigravity` and `github-copilot`. [CLI](./cli.md) has every flag, and how an agent runs `keploy login` without waiting for you.

Other MCP clients take the same URL and header in their configuration file: see [MCP client configuration](../running-keploy/agent-test-generation.md#mcp-client-configuration).

## 2. Ask your agent {#ask-your-agent}

In your app's repository, ask the agent, for example:

> "Use the Keploy MCP tools to set up UI capture for this frontend. Create a Keploy app named `storefront-web` if I don't have one, mint an ingest key, add the capture SDK so it starts before the app's first request, and tell me when the first flows are ready."

## 3. What the agent does {#what-the-agent-does}

The server runs in tool-search mode, so its UI capture tools are not in the agent's initial tool list. The server's own instructions name them, so the agent fetches their schemas in one `get_tool_schema` call and runs them with `invoke_tool`. Then:

1. **`listApps`** finds your app, or **`createApp`** creates one. An app for UI capture needs only a name.
2. **`uiCaptureSetup`** mints an ingest key for the app. The answer holds the key, which it shows only once, the ingest endpoint, the install command `npm install @keploy/capture-sdk`, and an `init` snippet with the endpoint and key in it.
3. **The agent edits your frontend.** It installs the SDK and calls `KeployCapture.init` once, in a module your app imports before anything else. The ingest key can only post recordings into this one app, so it is safe in your page's JavaScript. In the sample shop, it puts the key and endpoint in `.env`, which `src/keploy.ts` reads. The snippet leaves `privacyMode` at its default, `"balanced"`, which masks everything visitors type; for a public site, ask the agent to set `"strict"`, which masks all visible text too.
4. **`uiCaptureStatus`** says `NO_SESSIONS` until someone uses the app.

## 4. Use your app {#use-your-app}

Start your app and use it in a browser for a minute: open a few pages, search, click. `uiCaptureStatus` then says `RECORDING`.

A visit becomes flows 30 minutes after its last activity. To see flows sooner, close the app's tab and tell the agent: it ends the visit at once with `POST /ui/v1/sessions/<session id>/complete` and the ingest key, and the flows follow within a minute or two. The session id is the visit's `sdkSessionId`, which `uiCaptureStatus` lists under `recentSessions`; it is also what `KeployCapture.getSessionId()` returns, and the sample shop prints it in the browser console. The agent checks `uiCaptureStatus` no more than once a minute until it says `FLOWS_READY`.

## 5. Read the flows {#read-the-flows}

The agent reads what your visit recorded:

- **`listUIFlows`** lists the flows, usually one for each page a visit opened, named after what happened and where, such as `Fill on /products`.
- **`getUIFlow`** returns one flow's steps and the network calls they made.
- **`uiJourneys`** returns the journey plan: the paths your sessions took through your pages, each with its share of sessions.

[An agent onboards a web app](./walkthrough-agent.md) shows each of these calls with the answer it returns.

## Without MCP: the same steps with curl {#without-mcp}

An agent or a script without MCP makes the same calls on the [REST API](./rest-api.md), with a personal access token:

```bash
API=https://api.keploy.io/client/v1
AUTH="Authorization: Bearer $KEPLOY_PAT"

# Create the app (skip this for an existing one)
curl -X POST "$API/apps" -H "$AUTH" -H "Content-Type: application/json" -d '{"name": "storefront-web"}'

# Mint an ingest key: the answer has the key, the endpoint and the init snippet
curl -X POST "$API/apps/<appId>/ui/ingest-keys" -H "$AUTH" -H "Content-Type: application/json" -d '{"name": "storefront web"}'

# Check capture, read the flows and the journey plan
curl "$API/apps/<appId>/ui/capture-status" -H "$AUTH"
curl "$API/apps/<appId>/ui/flows" -H "$AUTH"
curl "$API/apps/<appId>/ui/journeys" -H "$AUTH"
```

## What the agent sees {#what-the-agent-sees}

Flows returned to an agent carry the shape of each visit, not your users' data: a step says that a value was typed, never what; headers, bodies and URL queries are left out; and a path segment that looks like an email address, a long number or a token comes back as `REDACTED`. [What an agent sees](./agents.md#what-an-agent-sees) lists the rules.

## Clean up {#clean-up}

To stop recording, ask the agent to revoke the ingest key: it lists the app's keys with `listUIIngestKeys` and revokes one with `revokeUIIngestKey`. Pages that still use the key stop recording within about 30 seconds.

Deleting an app needs a personal access token with the **Admin** scope, which only organization admins can give. An OAuth sign-in cannot delete apps. To disconnect an agent that signed in with OAuth, revoke it under **Settings → Authorized apps**.

## Related

- [An agent onboards a web app](./walkthrough-agent.md)
- [Operate UI capture from an AI agent](./agents.md)
- [MCP tools](./mcp-tools.md)
- [CLI](./cli.md)
- [Dashboard quickstart](./quickstart-dashboard.md)
