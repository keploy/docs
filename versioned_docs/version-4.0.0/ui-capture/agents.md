---
id: agents
title: "Operate UI capture from an AI agent"
sidebar_label: Operate from an AI agent
description: Credentials, tools, waits and errors for an AI agent that sets up Keploy UI capture and reads flows and journeys through MCP or the REST API.
tags:
  - UI testing
  - UI capture
  - AI agent
  - MCP
keywords:
  - AI agent
  - Keploy MCP server
  - UI capture
  - uiCaptureStatus
  - service account
  - personal access token
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

An AI agent can set up UI capture and read what it records, through the Keploy MCP server or the REST API: create an app, mint an ingest key, add the capture SDK to your frontend, check that visits arrive, and read flows, journeys and test runs. This page is the reference for building that into an agent's workflow. To try it first, follow the [AI agent quickstart](./quickstart-agent.md).

:::note Beta
UI Testing is in beta. Recording visits and reading them as flows and journeys works today. Replaying journeys as Playwright tests is in beta too, and its runner is not in a release build yet, so an agent cannot run tests: see [What agents cannot do yet](#what-agents-cannot-do-yet).
:::

## Credentials {#credentials}

A person approves every credential an agent uses. An agent never needs a password.

| Credential                                | How you get it                                                                                                                                                                 | What it can do                                                                                                                                                                                                                                            |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MCP OAuth sign-in                         | Add the MCP server to your agent with no key. It is answered `401` with the server's OAuth challenge, and the agent opens a sign-in you approve.                               | Through the MCP server only. Scopes `read` and `write`: every UI capture tool but `deleteApp`. Revoke it under **Settings → Authorized apps**.                                                                                                            |
| Personal access token                     | **Settings → API Keys → Generate new token** in the dashboard, with the **Read** and **Write** scopes, and **Admin**, which only organization admins can give, to delete apps. | REST and MCP, up to its scopes and your role.                                                                                                                                                                                                             |
| `keploy login`, then `keploy mcp-install` | The [keploy CLI](./cli.md) mints a personal access token and writes it into your agent's MCP configuration.                                                                    | The scopes your role allows. It expires after 90 days, and is reused until then; minting a new one, with `--rotate` or on another machine, revokes the earlier ones, and agents holding them lose access.                                                 |
| `KEPLOY_API_KEY`                          | An API key in the environment of the `keploy` binary.                                                                                                                          | Signs the binary in where no person can approve a sign-in, such as CI. The binary has no UI capture commands.                                                                                                                                             |
| Service-account key bound to `UI_READER`  | An admin creates the service account in the dashboard and binds it to the `UI_READER` role on one app.                                                                         | Reads that app's capture status, flows, flow graph, journeys, impact and test runs. It cannot create or delete apps, list ingest keys, or mint or revoke them. On the Free plan a service account can hold only `MOCK_READER`, so this needs a paid plan. |

Whatever the credential, what it reaches on an app is what its owner holds there: minting or revoking an ingest key needs `testgen:run` on the app, and every read needs `app:view`.

The **ingest key** the agent mints is not one of these. It can only post recordings into its one app, so it is safe to ship in your page's JavaScript, and the REST API and the MCP server refuse it.

## Connect {#connect}

The MCP server is at `https://api.keploy.io/client/v1/mcp`. It runs in tool-search mode: `tools/list` shows only `search_tools`, `get_tool_schema` and `invoke_tool`, and four sign-in and setup tools. An agent fetches the schemas of the tools it needs, by the names in the server's instructions, in one `get_tool_schema` call, and runs them with `invoke_tool`. [MCP tools](./mcp-tools.md#the-server) has the details, and [MCP client configuration](../running-keploy/agent-test-generation.md#mcp-client-configuration) shows each client's configuration file.

An agent without MCP calls the same operations on the [REST API](./rest-api.md).

## The lifecycle {#the-lifecycle}

In the REST routes, `…` stands for `/client/v1/apps/{appId}`.

| Step                | MCP tool                               | REST route                                                        | What comes back                                                                                  |
| ------------------- | -------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Create the app      | `createApp`                            | `POST /client/v1/apps`                                            | The app and its `id`.                                                                            |
| Mint an ingest key  | `uiCaptureSetup`                       | `POST …/ui/ingest-keys`                                           | The key once, the ingest endpoint, `npm install @keploy/capture-sdk`, an `init` snippet, `next`. |
| Add the SDK         | none: the agent edits your frontend    |                                                                   |                                                                                                  |
| Check capture       | `uiCaptureStatus`                      | `GET …/ui/capture-status`                                         | A `state`, its `explanation`, what to do `next`, counts and the ten most recent sessions.        |
| End a visit at once | none: an HTTP call with the ingest key | `POST /ui/v1/sessions/{sdkSessionId}/complete` on the ingest host | `{ok, sessionId, status}`.                                                                       |
| Read the flows      | `listUIFlows`, `getUIFlow`             | `GET …/ui/flows`, `GET …/ui/flows/{flowId}`                       | Each flow's name, session and counts; one flow's steps, calls and end state.                     |
| See how visits move | `uiFlowGraph`                          | `GET …/ui/flow-graph`                                             | Pages and the moves between them.                                                                |
| Read the journeys   | `uiJourneys`                           | `GET …/ui/journeys`                                               | The journey plan, each journey's share of sessions, and its `freshness`.                         |
| Share of sessions   | `uiJourneyImpact`                      | `GET …/ui/journeys/impact`                                        | The share of sessions that took at least one of the journeys given.                              |
| Read test runs      | `listUITestRuns`, `getUITestRun`       | `GET …/ui/test-runs`, `GET …/ui/test-runs/{runId}`                | The app's UI test runs and each journey's verdict.                                               |
| Clean up            | `revokeUIIngestKey`, `deleteApp`       | `DELETE …/ui/ingest-keys/{keyId}`, `DELETE …`                     | `{id, revoked: true}`; `{deleted: true}`.                                                        |

`uiCaptureSetup` mints a new key on every call, because a key's secret is shown only once. An agent stores it at once, and lists and revokes old keys with `listUIIngestKeys` and `revokeUIIngestKey`.

The snippet `uiCaptureSetup` returns sets only `endpoint` and `apiKey`, so the SDK runs with its default `privacyMode: "balanced"`, which masks every typed value. For a public site, the agent adds `privacyMode: "strict"`, which also masks all visible text. It puts the `init` call in a module the app imports before any data fetching: requests the page makes before `init` has loaded rrweb are not recorded.

## Waiting and polling {#waiting-and-polling}

- **A visit becomes flows** `idleAfterSeconds` (1800, 30 minutes) after its last activity. To end a visit at once, as a test or a CI recording should, close its tab and `POST /ui/v1/sessions/<sdkSessionId>/complete` with the ingest key in `X-API-Key`. `<sdkSessionId>` is the browser's own session id: `uiCaptureStatus` lists it under `recentSessions`, and `KeployCapture.getSessionId()` returns it. Its flows follow within a minute or two.
- **Poll `uiCaptureStatus` at most once a minute.** Flows are extracted every minute. The state is `FLOWS_READY` as soon as one flow exists, while later visits may still be processing: `sessionsByStatus` says when every one is `PROCESSED`. No state lasts forever: a visit that cannot be processed is retried for about two hours and then counted as failed.
- **The journey plan:** a read of it computes a new one once enough sessions have been processed since the last (`freshness.recomputesAfterSessions`), and once the last is a day old (`freshness.recomputesAt`). `uiJourneys` with `refresh: true` computes a new one from `freshness.refreshableAt`, a minute after the last; before then it answers the stored plan. `refresh` needs `testgen:run`.
- **A UI test run that is `PENDING`** has not been claimed by a runner, and none may claim it: its `next` says not to poll for it.
- **Rate limits.** Each API key may make 100 requests a minute. Past that, the answer is `429` `RATE_LIMITED`. Over REST, its `Retry-After` header says how many seconds to wait. An MCP tool's answer carries no headers: a refused `uiJourneys` says in its message to retry in 10 seconds, and the rate limit's message says only to retry later, so wait a minute.

## Errors an agent should handle {#errors-an-agent-should-handle}

The REST API answers an error as `{"error": {"code", "message", "details"}, "meta": {...}}`. An MCP tool returns the same body with `isError` set. Branch on `code`, never on the message.

| HTTP  | `code`                          | When                                                                                                                                                                                                                           | What to do                                                                                                               |
| ----- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| `400` | `VALIDATION_ERROR`              | A request the API's schema or the route refuses: a key name over 100 bytes or the reserved `Web UI Session`, `ttlDays` outside 1 to 365, a `listUIFlows` `limit` outside 1 to 200, more than 100 `journeyIds`, a malformed ID. | Fix the input: the message says what is wrong.                                                                           |
| `400` | `INVALID_PARAMETER`             | A `uiJourneyImpact` journey that is not one of the plan's `journeys`.                                                                                                                                                          | Read the plan again and pass its `journeys`.                                                                             |
| `401` | `AUTHENTICATION_REQUIRED`       | No key, or a key the server does not accept.                                                                                                                                                                                   | Ask the person for a new key or sign-in.                                                                                 |
| `403` | `INSUFFICIENT_SCOPE`            | The key lacks the operation's scope. An ingest key gets this on every REST route.                                                                                                                                              | Use a key with the scope; the [REST API](./rest-api.md) lists each one's.                                                |
| `403` | `INSUFFICIENT_PERMISSION`       | The key's owner lacks the permission on the app. The message names it: `testgen:run` or `app:view`.                                                                                                                            | Ask an admin for that permission on the app.                                                                             |
| `403` | `FORBIDDEN`                     | A service-account key asked for what no service account may do, such as `listUIIngestKeys`. For `createApp` and `deleteApp`, a `UI_READER` key gets `INSUFFICIENT_SCOPE` first.                                                | Do not retry: a person's key does these.                                                                                 |
| `404` | `RESOURCE_NOT_FOUND`            | The app is not the caller's, or the flow, key or run is not this app's. `uiJourneyImpact` with a plan older than 14 days.                                                                                                      | Check the IDs; read the plan again for a current `planId`.                                                               |
| `409` | `UI_INGEST_KEY_ACCOUNT_CLAIMED` | Minting a key lost a race with the app's service account being torn down, and the key was taken back.                                                                                                                          | Call `uiCaptureSetup` again.                                                                                             |
| `429` | `RATE_LIMITED`                  | The key's rate limit, or `uiJourneys` while the server's queue of plan computations is full or the request ended before its plan was ready.                                                                                    | Wait, then retry: `Retry-After` seconds over REST; over MCP, the 10 seconds a refused `uiJourneys` names, else a minute. |
| `501` | `FEATURE_NOT_ENABLED`           | The server runs without the feature.                                                                                                                                                                                           | Do not retry.                                                                                                            |

The capture SDK reports its own errors in the browser, each with a `KUI_E_` code: see [UI Capture errors and warnings](./errors.md).

## What an agent sees {#what-an-agent-sees}

Flows returned by the REST API and MCP are meant for an agent's context, so they return the shape of the journey and leave out what is most likely to carry your users' data:

- A step says whether the user entered a value (`hasValue`), never the value itself.
- Request and response headers and bodies are not returned.
- URL query strings, fragments and credentials (`user:password@`) are removed.
- A path segment that looks like a secret or a personal number is replaced with `REDACTED`: an email address, six or more digits (a one-time code, an account or card number, and also a date written as digits, such as `20240115`), twelve or more letters and digits in one run (an invite or reset token), or a long token that is not a UUID. Long IDs that are not UUIDs, such as 24-character MongoDB ObjectIds, are replaced too.
- A flow's name and description are scrubbed the same way, and an `aria-label` value in a selector is replaced with `REDACTED`, because it is page text.

What is kept as recorded: the page's paths otherwise, and the `data-testid` values, IDs and class names your developers wrote. These checks go by shape, so they can't recognise every piece of personal data: if your app puts user data into paths or into those attributes, it reaches the agent.

The dashboard shows more to people on your team who can view the app: a flow's recorded URLs with their queries, for example.

## What agents cannot do yet {#what-agents-cannot-do-yet}

- **Generate or run tests.** No tool or REST route creates, claims or completes a UI test run. A run today comes only from a flow page's **Generate Test** in the dashboard, and it stays pending: the runner that replays journeys as Playwright tests, `keploy ui run`, is not in a release build yet.
- **Pin a journey** into the plan, or accept a change.
- **Run tests in CI.** No service-account role runs UI tests. A CI job can check capture status and read the plan with a `UI_READER` key, on a paid plan: see [Check capture in CI](./ci.md).

## Related

- [AI agent quickstart](./quickstart-agent.md)
- [An agent onboards a web app](./walkthrough-agent.md)
- [MCP tools](./mcp-tools.md)
- [REST API](./rest-api.md)
- [CLI](./cli.md)
