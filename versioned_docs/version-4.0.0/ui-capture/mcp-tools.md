---
id: mcp-tools
title: "UI Testing MCP tools reference"
sidebar_label: MCP tools
description: The Keploy MCP server's UI capture tools, their inputs, the scope and app permission each needs, and how an agent finds and calls them.
tags:
  - UI testing
  - UI capture
  - MCP
  - reference
keywords:
  - Keploy MCP server
  - MCP tools
  - uiCaptureSetup
  - uiCaptureStatus
  - AI agent
  - invoke_tool
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The Keploy MCP server gives an AI agent every step of UI capture as a tool: create an app, mint an ingest key, check that recordings arrive, and read flows, journeys and test runs. Each UI capture tool is generated from the [REST API](./rest-api.md) operation of the same name, so it takes the same inputs and returns the same answer.

## The server {#the-server}

| What           | Value                                                                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| URL            | `https://api.keploy.io/client/v1/mcp`. When you self-host, your API server's URL followed by `/client/v1/mcp`.                               |
| Transport      | Streamable HTTP, stateless.                                                                                                                  |
| Server name    | `keploy-atg`                                                                                                                                 |
| Authentication | An OAuth sign-in, or a Keploy API key in `Authorization: Bearer kep_...` or `X-API-Key: kep_...`. See [OAuth or API key](#oauth-or-api-key). |
| Rate limit     | Each tool call that reaches the API counts against the key's 100 requests a minute, as a REST call does.                                     |

**Tool-search mode.** The server's `tools/list` shows seven tools, so that the full catalogue does not fill the agent's context: the meta-tools `search_tools`, `get_tool_schema` and `invoke_tool`, and the sign-in and setup tools `get_auth_status`, `get_setup_instructions`, `devloop_setup_instructions` and `devloop_begin_oauth_install`. Every other tool is still there:

- `get_tool_schema({names: [...]})` returns the description and input schema of each tool you name. Ask for all you need in one call: the names are in the [table below](#tools) and in the server's instructions.
- `search_tools({query})` finds tools by keyword and returns each match's name and a one-line summary, not its schema. It ranks the whole catalogue by keyword and returns 10 matches unless you pass `limit`, so a query such as `"ui capture"` can return API testing tools too and leave some UI capture tools out. Fetch tools whose names you know with `get_tool_schema`.
- `invoke_tool({name, arguments})` runs a tool by name. A tool missing from `tools/list` can also be called directly with `tools/call` and its exact name.

**Instructions.** The server's `initialize` answer carries instructions with a UI CAPTURE section: the order of the tools below, the wait before a visit becomes flows, and that MCP tools read test runs while journey replay runs via the CLI.

## Tools {#tools}

Every UI capture tool takes `appId`, the app's ID. The scope is the API key's; the permission is what the key's owner must hold on the app.

| Tool                | What it does                                                                                               | Inputs                                                | Scope and permission                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `createApp`         | Creates an app. An app for UI capture needs only a `name`, which cannot be changed later.                  | `name` (required), and other optional app settings    | `write`                                                                  |
| `listApps`          | Lists the company's apps; `q` filters by name.                                                             | `q`, `offset`, `limit`                                | `read`                                                                   |
| `getApp`            | Returns one app.                                                                                           | `appId`, `fields`                                     | `read`                                                                   |
| `deleteApp`         | Deletes an app.                                                                                            | `appId`                                               | `admin`                                                                  |
| `uiCaptureSetup`    | Mints an ingest key and returns it once, with the endpoint, the SDK install command and an `init` snippet. | `appId`, `name`, `ttlDays`                            | `write`, `testgen:run`                                                   |
| `listUIIngestKeys`  | Lists the app's ingest keys, revoked ones included, never their secrets.                                   | `appId`                                               | `read`, `app:view`                                                       |
| `revokeUIIngestKey` | Revokes one ingest key.                                                                                    | `appId`, `keyId`                                      | `write`, `testgen:run`                                                   |
| `uiCaptureStatus`   | Says whether recordings arrive and have become flows, as a state with what to do next.                     | `appId`                                               | `read`, `app:view`                                                       |
| `listUIFlows`       | Lists the app's flows.                                                                                     | `appId`, `limit`, `offset`, `status`                  | `read`, `app:view`                                                       |
| `getUIFlow`         | Returns one flow's steps, network calls and end state.                                                     | `appId`, `flowId`                                     | `read`, `app:view`                                                       |
| `uiFlowGraph`       | How the app's visits move between pages.                                                                   | `appId`                                               | `read`, `app:view`                                                       |
| `uiJourneys`        | The journey plan: the journeys sessions take, each with its share of sessions.                             | `appId`, `refresh`                                    | `read`, `app:view`; `refresh: true` also needs `write` and `testgen:run` |
| `uiJourneyImpact`   | The share of sessions that took at least one of a set of the plan's journeys.                              | `appId`, `planId` (required), `journeyIds` (required) | `read`, `app:view`                                                       |
| `listUITestRuns`    | Lists the app's UI test runs, newest first, one summary line each.                                         | `appId`, `offset`, `limit`                            | `read`, `app:view`                                                       |
| `getUITestRun`      | Returns one UI test run with each journey's verdict.                                                       | `appId`, `runId`                                      | `read`, `app:view`                                                       |

The [REST API reference](./rest-api.md) describes each tool's answer in full. No MCP tool creates or runs a UI test run; to replay journeys as Playwright tests (Beta), use `keploy ui status --app <id>` and `keploy ui run` in Enterprise CLI `v3.9.20` and later (Linux and macOS).

## Call a tool {#call-a-tool}

An MCP client makes these calls for your agent. To see one by hand, send JSON-RPC to the server:

```bash
curl https://api.keploy.io/client/v1/mcp \
  -H "Authorization: Bearer kep_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "invoke_tool",
      "arguments": {"name": "uiCaptureStatus", "arguments": {"appId": "<appId>"}}
    }
  }'
```

The tool's answer is one text item: the REST API's JSON answer, with the HTTP status added as `status_code`. A refusal sets the result's `isError`, and its text carries the API's `error`, as here for `getUITestRun` with a run that does not exist:

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "UI test run not found"
  },
  "meta": {
    "timestamp": "2026-11-20T07:28:18Z"
  },
  "status_code": 404
}
```

## Input types {#input-types}

A REST operation's path and query parameters become `string`, `number` or `boolean` inputs, and its request body's fields keep their types. Two cases to know:

- **`journeyIds` is one string**, the journey IDs joined with commas: `"journeyIds": "a1b2…,c3d4…"`. It takes 1 to 100 IDs, each one of the plan's `journeys`.
- **`refresh` is a boolean**: `"refresh": true`.

## OAuth or API key {#oauth-or-api-key}

- **OAuth.** A request with no credential is answered `401` with a `WWW-Authenticate` challenge that names the server's OAuth metadata, and an MCP client that supports OAuth signs in from it: you approve the sign-in in your browser. The token it gets has the `read` and `write` scopes, never `admin`, so it cannot call `deleteApp`. It works only through the MCP server, not on the REST API.
- **An API key.** A personal access token from **Settings → API Keys** in the dashboard, or the one [`keploy mcp-install`](./cli.md#keploy-mcp-install) mints, in `Authorization: Bearer kep_...`. Give it the `read` and `write` scopes to set up capture; deleting an app needs `admin`, which only organization admins can give a token.
- **A service-account key** bound to the `UI_READER` role on an app reads that app's capture status, flows, flow graph, journeys, impact and test runs. It cannot create or delete apps, list ingest keys, or mint or revoke them. On the Free plan a service account can hold only `MOCK_READER`, so this needs a paid plan.

An ingest key is not accepted: it can only post recordings.

## Related

- [AI agent quickstart](./quickstart-agent.md)
- [An agent onboards a web app](./walkthrough-agent.md)
- [Operate UI capture from an AI agent](./agents.md)
- [REST API](./rest-api.md)
- [CLI](./cli.md)
