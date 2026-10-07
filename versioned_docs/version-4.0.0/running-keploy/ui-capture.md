---
id: ui-capture
title: Capture real user flows from your web app
sidebar_label: UI Capture
description: Record real user sessions in your web app with the Keploy capture SDK and turn every visit into UI flows you can read in the dashboard, over the REST API, or from an AI agent through MCP.
tags:
  - UI testing
  - UI capture
  - user flows
  - browser SDK
  - MCP
  - AI agent
keywords:
  - UI capture
  - capture SDK
  - user flows
  - session recording
  - ingest key
  - Keploy MCP
  - AI agent
---

UI Capture records how real people use your web app and turns each visit into a **UI flow**: the steps a user took (pages, clicks, typing, selections) and the network calls those steps made. You add a small browser SDK to your frontend, Keploy receives the recording, and the flows appear in the Keploy dashboard and through the API.

You can set it up three ways, and they produce the same result:

- [In the Keploy dashboard](#set-up-ui-capture-in-the-dashboard), with a few clicks.
- [With the REST API](#set-up-ui-capture-with-the-rest-api), from a script or CI job.
- [From an AI coding agent](#set-up-ui-capture-from-an-ai-agent-mcp), such as Claude Code or Cursor, through the Keploy MCP server.

:::note Beta
UI Capture is in beta. This page describes what works today, including its current [limitations](#limitations).
:::

## How UI Capture works

1. **An ingest key** connects the SDK to one Keploy app. It can only post recordings into that app, so it is safe to ship in your page's JavaScript.
2. **The capture SDK** (`@keploy/capture-sdk`) runs in your users' browsers. It records the page and the `fetch`/`XMLHttpRequest` calls it makes, masks what users type, and sends the recording to Keploy in small batches.
3. **Keploy ends a visit** after 30 minutes without activity, then extracts its flows, usually within a few minutes.
4. **You read the flows** in the dashboard, or an agent reads them through the REST API or MCP.

## Before you begin

- A Keploy app to record into. Create one in the [Keploy Console](https://app.keploy.io) if you have none.
- Permission to run test generation on that app (`testgen:run`) to create or revoke an ingest key, the same in the dashboard and the API. Viewing capture status and flows needs only view access to the app (`app:view`).
- A web frontend built with a bundler (Vite, webpack, Next.js, and similar). See [Install the SDK](#install-the-sdk) for why.

## Set up UI Capture in the dashboard

1. In the Keploy Console, select your app and open **UI Testing → UI Flows** in the left navigation. An app with no flows yet opens on the setup card; an app with flows has it under the **Setup** tab.

   <img src="/img/ui-capture/ui-capture-setup-card.webp" alt="The UI Capture setup card, with steps to create an ingest key, add the SDK and check that sessions arrive" width="100%" />

   The screenshots on this page are from a local deployment, so they show `http://localhost:8083` where Keploy Cloud shows `https://api.keploy.io`.

2. Under **1. Create an ingest key**, optionally name the key (for example, `production web`) and click **Create ingest key**.

   If you signed in more than 15 minutes ago, Keploy asks you to confirm it's you before it creates the key.

3. Copy the key. **It is shown only once.** The SDK snippet under **2. Add the SDK to your app** now contains it.

   <img src="/img/ui-capture/ui-capture-key-created.webp" alt="A newly created ingest key, shown once, with the SDK install command and an init snippet that already contains the key" width="100%" />

4. [Install the SDK](#install-the-sdk) in your app with the snippet, deploy it, and use the app in a browser.

5. Watch **3. Check that sessions arrive**. **Sessions received** counts visits as they arrive, and **Last activity** shows when the SDK last sent anything. **Flows extracted** goes up once a visit has been idle for 30 minutes and Keploy has processed it. The line under the counts says which [state](#check-that-capture-is-working) capture is in: the same state an agent reads from the API. When the first flows are ready, the page switches to its tabs on its own.

   <img src="/img/ui-capture/ui-capture-status.webp" alt="The status panel showing one session received, the time of the last activity, one flow extracted, the app's ingest key and how to set this up from an agent" width="100%" />

6. Open the **Flows** tab to see each flow, and click a flow to see its steps and network calls.

   <img src="/img/ui-capture/ui-capture-flows.webp" alt="The flows table listing a captured flow with its session, last update time and status" width="100%" />

   <img src="/img/ui-capture/ui-capture-flow-detail.webp" alt="A flow's detail page with its step timeline and the network calls the steps made" width="100%" />

The setup card also lists your app's ingest keys, with when each was created, last used and expires. To stop a key from being accepted, click the trash icon next to it, then **Revoke**. Pages using that key stop recording within about 30 seconds.

## Install the SDK

Install the package:

```bash
npm install @keploy/capture-sdk
```

Call `init` once, when your app starts, in code that runs in the browser:

```javascript
import {KeployCapture} from "@keploy/capture-sdk";

await KeployCapture.init({
  endpoint: "https://api.keploy.io/ui/v1/ingest",
  apiKey: "<your ingest key>",
});
```

Use the `endpoint` the setup card or the API gives you. It is `https://api.keploy.io/ui/v1/ingest` on Keploy Cloud and your own API server's `/ui/v1/ingest` when self-hosted. A self-hosted API server builds it from its `API_SERVER_URL`; if that isn't set to the server's public URL, the API returns an empty `endpoint` and says so in `next`, rather than guessing.

In a server-rendered framework, start the SDK from a client-side effect so it runs only in the browser. For example, in a Next.js App Router layout:

```tsx
"use client";

import {useEffect} from "react";

export function UICapture() {
  useEffect(() => {
    let stop: (() => void) | undefined;
    void import("@keploy/capture-sdk").then(async ({KeployCapture}) => {
      await KeployCapture.init({
        endpoint: "https://api.keploy.io/ui/v1/ingest",
        apiKey: process.env.NEXT_PUBLIC_KEPLOY_UI_CAPTURE_API_KEY!,
      });
      stop = () => void KeployCapture.stop();
    });
    return () => stop?.();
  }, []);
  return null;
}
```

:::caution Use a bundler
The SDK loads its DOM recorder ([rrweb](https://github.com/rrweb-io/rrweb)) with a package import that your bundler resolves. Loaded on a page without a bundler or an import map, the SDK starts without an error but cannot record the page: it sends the page's network calls and no clicks, typing or navigation, so sessions arrive and never become flows.
:::

### SDK options

| Option               | Default      | What it does                                                                                                                                   |
| -------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint`           | required     | The ingest URL.                                                                                                                                |
| `apiKey`             | required     | The app's ingest key.                                                                                                                          |
| `privacyMode`        | `"balanced"` | `"balanced"` masks every typed value and records visible text. `"strict"` also masks all visible text. `"off"` records typed values.           |
| `networkCapture`     | `true`       | Records `fetch` and `XMLHttpRequest` calls. Set `false` to record only the page.                                                               |
| `sampleRate`         | `1`          | Fraction of visits to record, from `0` to `1`. `0.1` records 10% of visits.                                                                    |
| `maxSessionDuration` | `600000`     | Longest recording of one page load, in milliseconds (10 minutes). When it elapses, recording stops until the next `init` (the next page load). |
| `maskSelectors`      | `[]`         | CSS selectors whose text is masked.                                                                                                            |
| `privacy`            | —            | Finer controls: `blockSelectors`, `maskNetworkBodies`, `sensitiveHeaders`, `piiPatterns`.                                                      |

### What the SDK records, and what it masks

- **Typed values** are masked in every input, textarea and select with the default `privacyMode`. Password fields and hidden inputs are masked in every mode, including `"off"`. The values of radio buttons, checkboxes and buttons are not typed and are recorded in every mode; to leave an element out of the recording entirely, list it in `privacy.blockSelectors`.
- **Visible text** on the page is recorded, unless you use `privacyMode: "strict"` or `maskSelectors`. To drop an element from the recording entirely, list it in `privacy.blockSelectors`.
- **Network calls** are recorded with their method, URL (including the query string), status, headers and bodies. The values of the `Authorization`, `Cookie`, `Set-Cookie`, `X-API-Key`, `X-Auth-Token` and `Proxy-Authorization` headers are always replaced with `[REDACTED]`. To stop recording bodies, set `privacy.maskNetworkBodies: true`; to stop recording network calls, set `networkCapture: false`.

The dashboard shows a flow's recorded URLs and calls to people on your team who can view the app. The [REST API and MCP](#what-an-agent-sees) return less.

## Set up UI Capture with the REST API

Every step is available on the [Keploy Public API](./public-api.md) at `https://api.keploy.io/client/v1`. You need an API key: `write` scope to create or revoke an ingest key, `read` scope for everything else. Replace `<appId>` with your app's ID.

### Create an ingest key

```bash
curl -X POST https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys \
  -H "Authorization: Bearer kep_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "storefront prod"}'
```

`name` is optional, and so is `ttlDays` (1 to 365; without it the key does not expire). The response has everything needed to install the SDK, including an `init` snippet with the key in it:

```json
{
  "data": {
    "key": {
      "id": "28ff3828-d0e9-4a05-8615-c48c1fd51bba",
      "name": "storefront prod",
      "keyPrefix": "kep_dpeSyTYC",
      "appId": "<appId>",
      "status": "active",
      "createdAt": 1791282595
    },
    "apiKey": "kep_dpeSyTYC…",
    "endpoint": "https://api.keploy.io/ui/v1/ingest",
    "sdk": {
      "package": "@keploy/capture-sdk",
      "install": "npm install @keploy/capture-sdk",
      "init": "import { KeployCapture } from \"@keploy/capture-sdk\";\n\nawait KeployCapture.init({ … });\n"
    },
    "next": [
      "apiKey is shown only in this response: store it now (it is safe to ship in the page; it can only post recordings into this app)",
      "install the SDK and call KeployCapture.init once at app start-up, in the browser bundle",
      "browse the app, then GET /client/v1/apps/<appId>/ui/capture-status (MCP: uiCaptureStatus) to see sessions arrive",
      "a session becomes flows 30 minutes after its last activity; read them with GET /client/v1/apps/<appId>/ui/flows"
    ]
  }
}
```

`apiKey` appears only in this response. Store it before you continue.

### Check that capture is working

```bash
curl https://api.keploy.io/client/v1/apps/<appId>/ui/capture-status \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

The response names a `state`, explains it, and lists what to do `next`:

```json
{
  "data": {
    "state": "FLOWS_READY",
    "explanation": "flows have been extracted from recorded sessions",
    "next": [
      "read them with GET /client/v1/apps/<appId>/ui/flows (MCP: listUIFlows)",
      "each flow lists its steps and the network calls it made"
    ],
    "endpoint": "https://api.keploy.io/ui/v1/ingest",
    "idleAfterSeconds": 1800,
    "totalSessions": 1,
    "sessionsByStatus": {"PROCESSED": 1},
    "lastBatchAt": 1791282469,
    "totalFlows": 1,
    "recentSessions": [
      {
        "id": "eda95518-6f70-4a80-b618-9ea986db11a0",
        "sdkSessionId": "a760c5be-2a02-4d2f-8d4d-3ff1ed94c0fe",
        "status": "PROCESSED",
        "startedAt": 1791282469,
        "lastBatchAt": 1791282469,
        "completedAt": 1791282487,
        "eventCount": 32,
        "batches": 1,
        "sdkVersion": "3.0.1"
      }
    ]
  }
}
```

| `state`       | What it means                                                                          | What to do                                                           |
| ------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `NO_SESSIONS` | No recording has reached this app.                                                     | Check the page calls `init` with this app's ingest key and endpoint. |
| `RECORDING`   | Sessions are arriving. Each becomes flows `idleAfterSeconds` after its last activity.  | Wait, or keep using the app.                                         |
| `PROCESSING`  | Finished visits are being turned into flows.                                           | Check again in a minute.                                             |
| `FLOWS_READY` | At least one flow exists.                                                              | [List the flows](#read-the-flows).                                   |
| `NO_FLOWS`    | Visits were processed but contained no user action (a page opened and left untouched). | Record a visit that clicks, types or navigates.                      |
| `ALL_FAILED`  | Every finished visit failed to process.                                                | Record a fresh visit; contact Keploy support if it fails again.      |

A visit that can't be processed is retried with backoff for about two hours and then counted as failed, so no state lasts forever. A session's `id` is the `sessionId` its flows carry; `sdkSessionId` is the browser's own ID for the same visit.

Timestamps in seconds: `createdAt`, `startedAt`, `lastBatchAt`, `completedAt`. Step and network-call `timestamp`s in a flow are in milliseconds.

### Read the flows

List an app's flows:

```bash
curl https://api.keploy.io/client/v1/apps/<appId>/ui/flows \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": [
    {
      "id": "45733249-11ef-42be-a758-b0f621fb697d",
      "name": "Fill on /",
      "description": "6 steps, 1 API calls, 2.7s",
      "status": "CLUSTERED",
      "sessionId": "eda95518-6f70-4a80-b618-9ea986db11a0",
      "clusterId": "ff14bf67-d5aa-4ca0-8feb-cd265b079f3c",
      "steps": 6,
      "networkCalls": 1,
      "createdAt": 1791282487
    }
  ]
}
```

Get one flow's steps and calls:

```bash
curl https://api.keploy.io/client/v1/apps/<appId>/ui/flows/<flowId> \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": {
    "id": "45733249-11ef-42be-a758-b0f621fb697d",
    "name": "Fill on /",
    "steps": 6,
    "networkCalls": 1,
    "stepList": [
      {
        "index": 1,
        "action": "input",
        "selector": "#search",
        "hasValue": true,
        "pageUrl": "https://shop.example.com/",
        "timestamp": 1791282467268
      },
      {
        "index": 2,
        "action": "click",
        "selector": "#go",
        "pageUrl": "https://shop.example.com/",
        "timestamp": 1791282467813
      }
    ],
    "networkCallList": [
      {
        "method": "GET",
        "url": "https://shop.example.com/api/search",
        "responseStatus": 200,
        "timestamp": 1791282467824
      }
    ]
  }
}
```

### Manage ingest keys

```bash
# List an app's ingest keys (never returns a key's secret)
curl https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys \
  -H "Authorization: Bearer kep_YOUR_API_KEY"

# Revoke one; pages using it are refused within about 30 seconds
curl -X DELETE https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys/<keyId> \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

## Set up UI Capture from an AI agent (MCP)

Every UI Capture endpoint is also a tool on the Keploy MCP server at `https://api.keploy.io/client/v1/mcp`. Connect your agent as described in [MCP client configuration](./agent-test-generation.md#mcp-client-configuration), with an API key that has `read` and `write` scope.

| Tool                | What it does                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `uiCaptureSetup`    | Creates an ingest key and returns the endpoint, the SDK install command and the `init` snippet. |
| `uiCaptureStatus`   | Reports whether recordings arrive and have become flows, with the next step to take.            |
| `listUIFlows`       | Lists an app's flows.                                                                           |
| `getUIFlow`         | Returns one flow's steps and network calls.                                                     |
| `listUIIngestKeys`  | Lists an app's ingest keys.                                                                     |
| `revokeUIIngestKey` | Revokes an ingest key.                                                                          |

The server runs in tool-search mode, so these tools don't appear in the initial tool list. The agent finds them with `search_tools("ui capture")` or calls them by name through `invoke_tool`.

Then ask your agent, for example:

> "Use the Keploy MCP tools to set up UI capture for my app `storefront-web`: create an ingest key, add the capture SDK to this frontend, and tell me when the first flows are ready."

The agent calls `uiCaptureSetup`, edits your frontend with the returned snippet, and polls `uiCaptureStatus` until it reports `FLOWS_READY`.

### What an agent sees

Flows returned by the REST API and MCP are meant for an agent's context, so they return the shape of the journey and leave out what is most likely to carry your users' data:

- A step says whether the user entered a value (`hasValue`), never the value itself.
- Request and response headers and bodies are not returned.
- URL query strings, fragments and credentials (`user:password@`) are removed.
- A path segment that looks like a secret or a personal number is replaced with `REDACTED`: an email address, six or more digits (a one-time code, an account or card number, and also a date written as digits, such as `20240115`), twelve or more letters and digits in one run (an invite or reset token), or a long token that is not a UUID. Long IDs that are not UUIDs, such as 24-character MongoDB ObjectIds, are replaced too.
- A flow's name and description are scrubbed the same way, and an `aria-label` value in a selector is replaced with `REDACTED`, because it is page text.

What is kept as recorded: the page's paths otherwise, and the `data-testid` values, IDs and class names your developers wrote. These checks go by shape, so they can't recognise every piece of personal data: if your app puts user data into paths or into those attributes, it reaches the agent.

## Limitations

- **A visit is ended by 30 minutes of inactivity.** A user who comes back to the same tab after that is not recorded again until the page reloads.
- **One recording lasts at most one page load and 10 minutes** by default (`maxSessionDuration`).
- **Single-page-app route changes are not yet recorded as navigation.** In an app that changes routes without a full page load, a flow's steps all show the page where the visit started.
- **The SDK needs a bundler.** See [Install the SDK](#install-the-sdk).

## Troubleshooting

**The browser console shows `403` with "this API key is not a UI ingest key".**
The SDK was given a personal access token or another kind of key. Create an ingest key for the app, in the dashboard or with `POST /client/v1/apps/<appId>/ui/ingest-keys`, and use it as `apiKey`.

**`capture-status` stays at `NO_SESSIONS`.**
Check the browser's network tab for requests to `/ui/v1/ingest`. If there are none, check that `init` runs in the browser. A `401` or `403` means the key is not an ingest key, or has been revoked.

**Sessions arrive in a different app.**
An ingest key records into the app it was created for. Create a key for this app and use it as `apiKey`.

**Sessions arrive but no flows appear.**
A visit becomes flows 30 minutes after its last activity. `capture-status` shows `RECORDING` until then, and `NO_FLOWS` if the visit had no clicks, typing or navigation. If your visits did have those, check that your app is built with a bundler: without one the SDK records only network calls (see [Install the SDK](#install-the-sdk)).
