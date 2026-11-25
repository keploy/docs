---
id: walkthrough-agent
title: "Walkthrough: an AI agent sets up UI capture and reads flows and journeys"
sidebar_label: An agent onboards a web app
description: Every Keploy MCP tool call an AI agent makes to set up UI capture for a web app and read its flows and journeys, with the real answers.
tags:
  - UI testing
  - UI capture
  - walkthrough
  - AI agent
  - MCP
keywords:
  - AI agent
  - Keploy MCP server
  - uiCaptureSetup
  - uiCaptureStatus
  - uiJourneys
  - UI flows
---

import HowTo from '@site/src/components/HowTo';
import ProductTier from '@site/src/components/ProductTier';

<HowTo
name="Set up Keploy UI capture and read flows and journeys from an AI agent"
description="An AI agent connected to the Keploy MCP server creates an app, mints an ingest key, adds the capture SDK to a web app, checks that visits arrive, and reads the flows, the journey plan and its shares of sessions, then cleans up."
totalTime="PT20M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["An AI coding agent connected to the Keploy MCP server", "The React sample shop", "A browser"]}
visible={false}
steps={[
{name: "Find the tools", text: "Fetch the UI capture tools' schemas with get_tool_schema, using the names in the server's instructions.", url: "#find-the-tools"},
{name: "Create the app", text: "Call createApp with the app's name.", url: "#create-the-app"},
{name: "Mint an ingest key", text: "Call uiCaptureSetup with the appId. Store the apiKey it returns once.", url: "#mint-an-ingest-key"},
{name: "Add the SDK", text: "Put the endpoint and the key in the app's configuration, and call KeployCapture.init once in the browser entry point.", url: "#add-the-sdk"},
{name: "Record visits", text: "Use the app in a browser. uiCaptureStatus says RECORDING; end a visit at once with POST /ui/v1/sessions/<sdkSessionId>/complete and the ingest key.", url: "#record-visits"},
{name: "Wait for the flows", text: "Call uiCaptureStatus at most once a minute until it says FLOWS_READY.", url: "#wait-for-the-flows"},
{name: "Read the flows", text: "Call listUIFlows, then getUIFlow for one flow's steps and network calls.", url: "#read-the-flows"},
{name: "Read the journeys", text: "Call uiJourneys for the journey plan, and uiJourneyImpact for the share of sessions a set of its journeys stands for.", url: "#read-the-journeys"},
{name: "Clean up", text: "Revoke the ingest key with revokeUIIngestKey, and delete the app with deleteApp and an admin key.", url: "#clean-up"},
]}
/>

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This walkthrough follows an AI agent through UI capture from start to finish, through the Keploy MCP server: it finds the tools, creates an app, mints an ingest key, adds the capture SDK to the [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop), checks that visits arrive, and reads the flows, the journey plan and its shares of sessions. Then it cleans up.

Each step shows the tool call as the agent's MCP client sends it to `invoke_tool`, its answer, and what the agent does next. Every answer is from a real run with six visits to the shop, shortened and without its `meta` (but for the test runs' pagination), with IDs replaced and the server written as `api.keploy.io`. To connect your own agent first, follow the [AI agent quickstart](./quickstart-agent.md).

:::note Beta
UI Testing is in beta. Recording visits and reading them as flows and journeys works today. Replaying journeys as Playwright tests is in beta too (Enterprise CLI `v3.9.20` and later ships `keploy ui status` and `keploy ui run` on Linux and macOS); this walkthrough focuses on the MCP tools, which read journeys and test runs. See [What an agent cannot do yet](#what-an-agent-cannot-do-yet).
:::

## What the agent does {#what-the-agent-does}

1. Finds the UI capture tools.
2. Creates an app.
3. Mints an ingest key.
4. Adds the capture SDK to the shop.
5. Checks that capture is waiting for visits.
6. Records visits and ends each one.
7. Waits for the flows.
8. Reads the flows.
9. Reads the journey plan.
10. Counts the share of sessions a set of journeys stands for.
11. Reads the test runs.
12. Cleans up.

## 1. Find the tools {#find-the-tools}

The server runs in tool-search mode: its `tools/list` holds only `search_tools`, `get_tool_schema`, `invoke_tool` and four sign-in and setup tools. Its instructions, in the answer to the MCP `initialize` request, have a UI CAPTURE section that names the UI capture tools in the order an agent uses them. So the agent fetches all their schemas in one call:

```json title="get_tool_schema"
{
  "names": [
    "createApp",
    "listApps",
    "getApp",
    "deleteApp",
    "uiCaptureSetup",
    "listUIIngestKeys",
    "revokeUIIngestKey",
    "uiCaptureStatus",
    "listUIFlows",
    "getUIFlow",
    "uiFlowGraph",
    "uiJourneys",
    "uiJourneyImpact",
    "listUITestRuns",
    "getUITestRun"
  ]
}
```

The answer has each tool's description and input schema. Every UI capture tool takes `appId`; [MCP tools](./mcp-tools.md#tools) lists the rest of their inputs. From here on, the agent runs each tool with `invoke_tool`, with the tool's `name` and `arguments`.

## 2. Create the app {#create-the-app}

The agent creates an app for the shop. An app for UI capture needs only a name, and the name cannot be changed later.

```json title="invoke_tool"
{
  "name": "createApp",
  "arguments": {
    "name": "docs-demo-agent"
  }
}
```

```json title="Answer (shortened)"
{
  "data": {
    "createdAt": 1795159503,
    "id": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "name": "docs-demo-agent"
  },
  "status_code": 201
}
```

A tool's answer is the REST API's answer, with the HTTP status added as `status_code`. The app's `id` is the `appId` every other tool takes.

## 3. Mint an ingest key {#mint-an-ingest-key}

```json title="invoke_tool"
{
  "name": "uiCaptureSetup",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "name": "storefront web",
    "ttlDays": 30
  }
}
```

```json title="Answer"
{
  "data": {
    "apiKey": "kep_YOUR_INGEST_KEY",
    "endpoint": "https://api.keploy.io/ui/v1/ingest",
    "key": {
      "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
      "createdAt": 1795159503,
      "expiresAt": 1797751503,
      "id": "ec6ebf01-0250-49c5-b71c-554cfec6f0af",
      "keyPrefix": "kep_YOUR_ING",
      "name": "storefront web",
      "status": "active"
    },
    "next": [
      "apiKey is shown only in this response: store it now (it is safe to ship in the page; it can only post recordings into this app)",
      "install the SDK and call KeployCapture.init once at app start-up, in the browser bundle",
      "browse the app, then GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/capture-status (MCP: uiCaptureStatus) to see sessions arrive",
      "a session becomes flows 30 minutes after its last activity (to end one at once, as a test or CI recording does, POST https://api.keploy.io/ui/v1/sessions/{sdkSessionId}/complete with this key in X-API-Key); read them with GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/flows (MCP: listUIFlows)",
      "once sessions are processed, GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/journeys (MCP: uiJourneys) is the journey plan a UI test run replays; GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/test-runs (MCP: listUITestRuns, getUITestRun) reads the runs"
    ],
    "sdk": {
      "init": "import { KeployCapture } from \"@keploy/capture-sdk\";\n\nawait KeployCapture.init({\n  endpoint: \"https://api.keploy.io/ui/v1/ingest\",\n  apiKey: \"kep_YOUR_INGEST_KEY\",\n});\n",
      "install": "npm install @keploy/capture-sdk",
      "package": "@keploy/capture-sdk"
    }
  },
  "status_code": 201
}
```

`apiKey` appears only in this answer, so the agent keeps it now. It is safe to ship in the shop's JavaScript: it can only post recordings into this one app. `ttlDays` is optional; without it the key does not expire. Each call mints a new key.

## 4. Add the SDK {#add-the-sdk}

The answer's `sdk.install` and `sdk.init` are what the agent adds to a frontend: install `@keploy/capture-sdk`, and call `KeployCapture.init` once, in a module the app imports before it makes any request. The sample shop already does both: `src/main.tsx` imports `src/keploy.ts` first, and `src/keploy.ts` calls `init` with the endpoint and key from `.env`. So the agent only writes `.env`:

```bash title=".env"
VITE_KEPLOY_INGEST_ENDPOINT=https://api.keploy.io/ui/v1/ingest
VITE_KEPLOY_INGEST_KEY=kep_YOUR_INGEST_KEY
```

Then it builds the shop and serves the build: `npm run build && npm run preview`.

The `init` snippet sets only `endpoint` and `apiKey`, so the SDK runs with its default `privacyMode: "balanced"`, which masks everything visitors type. The shop writes the default out. For a public site, the agent would set `"strict"`, which masks all visible text too.

## 5. Check that capture is waiting for visits {#check-capture}

```json title="invoke_tool"
{
  "name": "uiCaptureStatus",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19"
  }
}
```

```json title="Answer (shortened)"
{
  "data": {
    "explanation": "no session from the capture SDK has reached this app",
    "idleAfterSeconds": 1800,
    "state": "NO_SESSIONS",
    "totalFlows": 0,
    "totalSessions": 0
  },
  "status_code": 200
}
```

`NO_SESSIONS` until someone uses the app. The answer's `next` lists what to check if nothing arrives.

## 6. Record visits {#record-visits}

Here six visits were made in a headless Chromium, along three paths through the shop. A person using the shop by hand records the same way.

| Visits  | Pages                                     | What each does on the way                                   |
| ------- | ----------------------------------------- | ----------------------------------------------------------- |
| 1, 2    | `/` → `/products` → `/cart` → `/checkout` | Searches for `kettle`, adds it to the cart, places an order |
| 3, 4, 5 | `/` → `/about`                            |                                                             |
| 6       | `/` → `/products`                         | Searches for `kettle`                                       |

While the first visit was still open, `uiCaptureStatus` said it was recording:

```json title="Answer to uiCaptureStatus (shortened)"
{
  "data": {
    "explanation": "sessions are arriving; a visit becomes flows 30 minutes after its last activity",
    "idleAfterSeconds": 1800,
    "lastBatchAt": 1795159548,
    "next": [
      "keep using the app, or wait 30 minutes after the last activity, then check again",
      "to end a visit at once (a test or CI recording), POST https://api.keploy.io/ui/v1/sessions/{sdkSessionId}/complete with the app's ingest key in X-API-Key (the SDK's own session id for the visit); its flows follow within a minute or two"
    ],
    "recentSessions": [
      {
        "batches": 5,
        "eventCount": 70,
        "id": "a1e271a4-c6e8-456a-ab38-83f4bf64db4f",
        "lastBatchAt": 1795159548,
        "sdkSessionId": "01056d9a-f9b9-48ef-baf7-15d8804cd7ab",
        "sdkVersion": "3.1.0",
        "startedAt": 1795159526,
        "status": "RECORDING"
      }
    ],
    "sessionsByStatus": {
      "RECORDING": 1
    },
    "state": "RECORDING",
    "totalFlows": 0,
    "totalSessions": 1
  },
  "status_code": 200
}
```

A visit becomes flows `idleAfterSeconds`, 30 minutes, after its last activity. To have its flows at once, the agent ends each visit: it closes the visit's tab, then completes the session with the ingest key. `sdkSessionId` is the browser's own id for the visit: `uiCaptureStatus` lists it under `recentSessions`, as above, and it is what `KeployCapture.getSessionId()` returns, which the shop prints in the browser console:

```bash
curl -X POST "https://api.keploy.io/ui/v1/sessions/<sdkSessionId>/complete" \
  -H "X-API-Key: kep_YOUR_INGEST_KEY"
```

```json title="Answer"
{
  "ok": true,
  "sessionId": "01056d9a-f9b9-48ef-baf7-15d8804cd7ab",
  "status": "COMPLETED"
}
```

A tab left open on a completed session is refused at its next batch, which is why the agent closes it first.

## 7. Wait for the flows {#wait-for-the-flows}

The agent calls `uiCaptureStatus` once a minute. Flows are extracted every minute, so polling faster gains nothing.

```json title="Answer to uiCaptureStatus (shortened)"
{
  "data": {
    "explanation": "flows have been extracted from recorded sessions",
    "next": [
      "read them with GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/flows (MCP: listUIFlows)",
      "each flow lists its steps and the network calls it made"
    ],
    "recentSessions": [
      {
        "batches": 3,
        "completedAt": 1795159633,
        "eventCount": 26,
        "id": "db452012-c693-4938-a672-c15f44c59b1a",
        "lastBatchAt": 1795159632,
        "sdkSessionId": "a1a5cfc9-a48a-483f-8139-26e7ad540e8b",
        "sdkVersion": "3.1.0",
        "startedAt": 1795159625,
        "status": "PROCESSED"
      }
    ],
    "sessionsByStatus": {
      "PROCESSED": 6
    },
    "state": "FLOWS_READY",
    "totalFlows": 16,
    "totalSessions": 6
  },
  "status_code": 200
}
```

`FLOWS_READY` as soon as one flow exists, even while other visits are still being processed: a minute before this answer, it already said `FLOWS_READY`, with 4 sessions `PROCESSED` and 2 still `COMPLETED`. To know that every visit is in, the agent checks `sessionsByStatus`.

## 8. Read the flows {#read-the-flows}

```json title="invoke_tool"
{
  "name": "listUIFlows",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "limit": 50
  }
}
```

```json title="Answer (shortened to 2 of 16 flows)"
{
  "data": [
    {
      "clusterId": "661be522-1276-4612-9e7e-181dfd1ad3ff",
      "createdAt": 1795159660,
      "description": "2 steps, 1 API calls, 6.1s",
      "id": "d07317d4-e2b5-4ba6-b1db-767966e4e474",
      "name": "Click on /",
      "networkCalls": 1,
      "sessionId": "2a58f279-cc49-48cf-85ab-e7cfd9199a33",
      "status": "CLUSTERED",
      "steps": 2
    },
    {
      "clusterId": "4949ebdb-3873-4f10-9d79-c2027ee534a8",
      "createdAt": 1795159660,
      "description": "1 steps, 1 API calls, 0.0s",
      "id": "9888b9ee-f61d-4ca3-b13f-f0524c31d4ed",
      "name": "Navigate on /about",
      "networkCalls": 1,
      "sessionId": "2a58f279-cc49-48cf-85ab-e7cfd9199a33",
      "status": "CLUSTERED",
      "steps": 1
    }
  ],
  "status_code": 200
}
```

The six visits made 16 flows, one for each page each visit opened. A flow's name is a verb and the page it happened on, or `Verb: /a → /b` for a flow that ends on another page: `Fill` when something was typed, else `Click` when something was clicked, else `Navigate`. The agent reads one flow's steps and calls with `getUIFlow`:

```json title="invoke_tool"
{
  "name": "getUIFlow",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "flowId": "248a8854-06ac-4189-936b-e7eb2bd55326"
  }
}
```

```json title="Answer"
{
  "data": {
    "clusterId": "16ba6a5d-a195-4ebb-9457-7f697bfc55c7",
    "createdAt": 1795159660,
    "description": "3 steps, 2 API calls, 6.1s",
    "id": "248a8854-06ac-4189-936b-e7eb2bd55326",
    "name": "Fill on /products",
    "networkCallList": [
      {
        "method": "GET",
        "responseStatus": 200,
        "timestamp": 1795159625571,
        "url": "http://localhost:4173/api/products"
      },
      {
        "method": "GET",
        "responseStatus": 200,
        "timestamp": 1795159631678,
        "url": "http://localhost:4173/api/products"
      }
    ],
    "networkCalls": 2,
    "outcome": {
      "elements": [],
      "viewport": {
        "height": 720,
        "width": 1280
      }
    },
    "sessionId": "db452012-c693-4938-a672-c15f44c59b1a",
    "status": "CLUSTERED",
    "stepList": [
      {
        "action": "navigate",
        "hasValue": true,
        "index": 0,
        "pageUrl": "http://localhost:4173/products",
        "selector": "",
        "timestamp": 1795159625548
      },
      {
        "action": "input",
        "hasValue": true,
        "index": 1,
        "pageUrl": "http://localhost:4173/products",
        "selector": "[data-testid=\"search-input\"]",
        "timestamp": 1795159631613
      },
      {
        "action": "click",
        "index": 2,
        "pageUrl": "http://localhost:4173/products",
        "selector": "[data-testid=\"search-button\"]",
        "timestamp": 1795159631661
      }
    ],
    "steps": 3
  },
  "status_code": 200
}
```

This is visit 6 on the Products page. A step says that a value was typed (`hasValue`), never what. The first call is the page loading its products; the second is the search, `GET /api/products?q=kettle`, which comes back without its query. [What an agent sees](./agents.md#what-an-agent-sees) lists what is left out. Step and call `timestamp`s are in milliseconds.

## 9. Read the journey plan {#read-the-journeys}

```json title="invoke_tool"
{
  "name": "uiJourneys",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19"
  }
}
```

```json title="Answer (shortened)"
{
  "data": {
    "coveragePermille": 1000,
    "coverageTargetPermille": 800,
    "freshness": {
      "computedAt": 1795159694,
      "recomputesAfterSessions": 1,
      "recomputesAt": 1795246094,
      "refreshableAt": 1795159754,
      "sessionsCovered": 6,
      "sessionsProcessedSince": 0
    },
    "journeys": [
      {
        "flowIds": [
          "d07317d4-e2b5-4ba6-b1db-767966e4e474",
          "9888b9ee-f61d-4ca3-b13f-f0524c31d4ed"
        ],
        "id": "2990cf35868e23549307ad2120fe5d58",
        "lastSeenAt": 1795159612,
        "pages": ["/", "/about"],
        "pinned": false,
        "representativeSessionId": "2a58f279-cc49-48cf-85ab-e7cfd9199a33",
        "sdkVersion": "3.1.0",
        "selected": true,
        "sessionPercentage": 50,
        "sessions": 3
      },
      {
        "flowIds": [
          "f059842e-220d-415d-9195-b909f17f6536",
          "c220bcd5-4596-4270-ab4a-accfa4e7a403",
          "453613fc-e400-4461-b184-2321dd2d2559",
          "2635dfaf-b651-4b5d-ab3f-5fb7484f73c3"
        ],
        "id": "778bfd7ec36f1c03bfffa0362a47fe4f",
        "lastSeenAt": 1795159556,
        "pages": ["/", "/products", "/cart", "/checkout"],
        "pinned": false,
        "representativeSessionId": "55c7ea31-dba1-4d49-acbe-56cf700295e3",
        "sdkVersion": "3.1.0",
        "selected": true,
        "sessionPercentage": 33.333333333333336,
        "sessions": 2
      }
    ],
    "maxJourneys": 20,
    "planId": "a89602ff-c783-4f8e-bc34-47a151adea19",
    "ranked": [
      {
        "id": "084e889e39bcbdc4ebbe152a5c81d4ab",
        "pages": ["/", "/products"],
        "selected": false,
        "sessionPercentage": 50,
        "sessions": 3
      },
      {
        "id": "2990cf35868e23549307ad2120fe5d58",
        "pages": ["/", "/about"],
        "selected": true,
        "sessionPercentage": 50,
        "sessions": 3
      },
      {
        "id": "778bfd7ec36f1c03bfffa0362a47fe4f",
        "pages": ["/", "/products", "/cart", "/checkout"],
        "selected": true,
        "sessionPercentage": 33.333333333333336,
        "sessions": 2
      }
    ],
    "totalSessions": 6,
    "windowDays": 30
  },
  "status_code": 200
}
```

- **`journeys`** are the journeys Keploy selected to replay as tests: `/` → `/about`, taken by 3 of the 6 sessions, and `/` → `/products` → `/cart` → `/checkout`, taken by 2. Together they cover all the moves the sessions made between pages (`coveragePermille` 1000), past the 800 Keploy aims for. Each one's `flowIds` are the recording a test of it replays.
- **`ranked`** are the most taken journeys. `/` → `/products` was taken by 3 sessions but is not selected: the longer journey that continues it was, and its test replays those pages too.
- **`freshness`** says how current the plan is. `recomputesAfterSessions: 1` means the next processed session makes a read compute a new plan. `refresh: true` computes one from `refreshableAt`, a minute after `computedAt`, and needs `testgen:run`.

## 10. Count the share of sessions {#share-of-sessions}

`uiJourneyImpact` counts the sessions that took at least one of a set of the plan's journeys, as the share of sessions a failure in those journeys would stand for. `journeyIds` is one string, the IDs joined with commas:

```json title="invoke_tool"
{
  "name": "uiJourneyImpact",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "planId": "a89602ff-c783-4f8e-bc34-47a151adea19",
    "journeyIds": "2990cf35868e23549307ad2120fe5d58,778bfd7ec36f1c03bfffa0362a47fe4f"
  }
}
```

```json title="Answer"
{
  "data": {
    "affectedSessionPercentage": 83.33333333333333,
    "affectedSessions": 5,
    "journeyIds": [
      "2990cf35868e23549307ad2120fe5d58",
      "778bfd7ec36f1c03bfffa0362a47fe4f"
    ],
    "planId": "a89602ff-c783-4f8e-bc34-47a151adea19",
    "totalSessions": 6
  },
  "status_code": 200
}
```

5 of the 6 sessions, 83.3%: a union, never a sum. Each ID must be one of the plan's `journeys`. A journey that is only in `ranked` is refused:

```json title="invoke_tool"
{
  "name": "uiJourneyImpact",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "planId": "a89602ff-c783-4f8e-bc34-47a151adea19",
    "journeyIds": "084e889e39bcbdc4ebbe152a5c81d4ab"
  }
}
```

```json title="Answer"
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "invalid UI journey: journey is not in the plan: 084e889e39bcbdc4ebbe152a5c81d4ab"
  },
  "status_code": 400
}
```

## 11. Read the test runs {#read-test-runs}

```json title="invoke_tool"
{
  "name": "listUITestRuns",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19"
  }
}
```

```json title="Answer"
{
  "data": [],
  "meta": {
    "pagination": {
      "has_next_page": false,
      "has_previous_page": false,
      "next_cursor": null,
      "previous_cursor": null,
      "total_count": 0,
      "unreadable_count": 0
    },
    "timestamp": "2026-11-20T07:28:17Z"
  },
  "status_code": 200
}
```

The app has no runs. No MCP tool creates or runs a UI test run; to replay journeys as Playwright tests (Beta), use `keploy ui status --app <id>` and `keploy ui run` in Enterprise CLI `v3.9.20` and later (Linux and macOS).

## 12. Clean up {#clean-up}

The agent revokes the ingest key, which it lists with `listUIIngestKeys` when it does not have the `keyId`:

```json title="invoke_tool"
{
  "name": "revokeUIIngestKey",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
    "keyId": "ec6ebf01-0250-49c5-b71c-554cfec6f0af"
  }
}
```

```json title="Answer"
{
  "data": {
    "id": "ec6ebf01-0250-49c5-b71c-554cfec6f0af",
    "revoked": true
  },
  "status_code": 200
}
```

Pages that still use the key are refused within about 30 seconds. Then it deletes the app, which needs a key with the `admin` scope. An OAuth sign-in cannot delete apps.

```json title="invoke_tool"
{
  "name": "deleteApp",
  "arguments": {
    "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19"
  }
}
```

```json title="Answer"
{
  "data": {
    "deleted": true
  },
  "status_code": 200
}
```

## Waits {#waits}

- **A visit becomes flows** 30 minutes after its last activity, or a minute or two after `POST /ui/v1/sessions/<sdkSessionId>/complete`.
- **Poll `uiCaptureStatus` at most once a minute.** No state lasts forever: a visit that cannot be processed is retried for about two hours, then counted as failed.
- **The journey plan:** a read computes a new one once enough sessions have been processed since the last. `refresh: true` forces one at most once a minute. A `429` `RATE_LIMITED` answer to `uiJourneys` means the server's queue of plan computations is full, or the plan was not ready in time: its message says to retry in 10 seconds.
- **A `PENDING` test run** is not claimed by any runner: do not poll for it.

[Waiting and polling](./agents.md#waiting-and-polling) has the details.

## What an agent cannot do yet {#what-an-agent-cannot-do-yet}

- Generate or run tests via MCP or REST: no MCP tool or REST route creates, claims or completes a UI test run. To replay journeys as Playwright tests (Beta), run `keploy ui status --app <id>` and `keploy ui run --app <id> --base-url <url>` with Enterprise CLI `v3.9.20` or later (Linux and macOS).
- Pin a journey into the plan, or accept a change.
- Run UI tests in CI via MCP or REST: a CI job can check capture status and read the plan with a key bound to the `UI_READER` role on a paid plan, or replay journeys with `keploy ui run --app <id> --base-url <url>` using a service-account key bound to `UI_RUNNER`.

## Related

- [AI agent quickstart](./quickstart-agent.md)
- [Operate UI capture from an AI agent](./agents.md)
- [MCP tools](./mcp-tools.md)
- [REST API](./rest-api.md)
- [From first visit to journeys](./walkthrough-dashboard.md)
