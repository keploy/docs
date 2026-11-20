---
id: rest-api
title: "UI Testing REST API reference"
sidebar_label: REST API
description: Every UI capture operation of the Keploy Public API, from minting ingest keys to capture status, flows, journeys and test runs, with real answers.
tags:
  - UI testing
  - UI capture
  - REST API
  - reference
keywords:
  - Keploy Public API
  - UI capture API
  - ingest key
  - capture status
  - UI flows
  - journeys
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The UI capture operations of the [Keploy Public API](../running-keploy/public-api.md) let a script or an AI agent do everything the dashboard's UI Testing pages do: mint the ingest key the capture SDK sends with, check that recordings arrive, and read flows, journeys and test runs. Each operation is also a tool of the same name on the Keploy MCP server: see [MCP tools](./mcp-tools.md).

The answers on this page are real: they were captured from an app with six recorded visits to the [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop), some through the REST API and some through the MCP server, which returns the same answer. IDs are replaced, `meta.request_id` and `meta.trace_id` are left out, and long lists are shortened.

## Base URL and authentication {#base-url-and-authentication}

- **Base URL:** `https://api.keploy.io/client/v1`. When you self-host, your API server's URL followed by `/client/v1`.
- **API key:** a personal access token from **Settings → API Keys** in the dashboard, in `Authorization: Bearer kep_...` or `X-API-Key: kep_...`. An ingest key is refused with `403`: it can only post recordings.
- **Scope and permission.** Each operation needs a scope on the key (`read`, `write` or `admin`) and a permission its owner holds on the app: `app:view` to read, `testgen:run` to mint or revoke an ingest key. A missing scope is `403` `INSUFFICIENT_SCOPE`; a missing permission is `403` `INSUFFICIENT_PERMISSION`, with the permission named.
- **Service accounts.** A service-account key bound to the `UI_READER` role on an app may call that app's read operations, except listing its ingest keys. It may not create or delete apps, or mint or revoke ingest keys. On the Free plan a service account can hold only `MOCK_READER`, so this needs a paid plan.
- **Rate limit:** 100 requests a minute per key, with `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` on each answer, and `429` `RATE_LIMITED` with `Retry-After` past it.
- **Answers** are `{"data": ..., "meta": {"request_id", "timestamp"}}`. Errors are `{"error": {"code", "message", "details"}, "meta": ...}`. Branch on `code`: [Error codes](../running-keploy/public-api.md#error-codes) lists the Public API's, and each operation below names the ones it adds.
- **Times** in `data` are Unix seconds, except the `timestamp` of a flow's steps and calls, which is in milliseconds. `meta.timestamp` is an RFC 3339 string.
- **The spec** is served at `GET /client/v1/openapi.yaml`, and as a page at `/client/v1/docs`, without a key. The UI capture operations carry the tag `UI Capture`.

## Create an app {#create-an-app}

`POST /client/v1/apps` · MCP `createApp` · scope `write`

An app for UI capture needs only a `name`. The name cannot be changed later, and two apps cannot share one.

```bash
curl -X POST https://api.keploy.io/client/v1/apps \
  -H "Authorization: Bearer kep_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "storefront-web"}'
```

The answer, `201`, is the app; its `id` is the `appId` every operation below takes.

## Create an ingest key {#create-an-ingest-key}

`POST /client/v1/apps/{appId}/ui/ingest-keys` · MCP `uiCaptureSetup` · scope `write`, permission `testgen:run`

Mints an ingest key for the app and returns everything needed to install the capture SDK.

| Body field | Type    | What it is                                                                                                                                                |
| ---------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`     | string  | Optional. A label for the key, at most 100 bytes, spaces at either end trimmed. Without one, `ui-capture` and today's date. `Web UI Session` is reserved. |
| `ttlDays`  | integer | Optional. The key's lifetime in days, 1 to 365. Without it the key does not expire.                                                                       |

```bash
curl -X POST "https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys" \
  -H "Authorization: Bearer kep_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "ci smoke"}'
```

```json title="201 Created"
{
  "data": {
    "key": {
      "id": "0a09758e-d08e-4354-913f-dfb79fbb52bc",
      "name": "ci smoke",
      "keyPrefix": "kep_YOUR_ING",
      "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
      "status": "active",
      "createdAt": 1795159504
    },
    "apiKey": "kep_YOUR_INGEST_KEY",
    "endpoint": "https://api.keploy.io/ui/v1/ingest",
    "sdk": {
      "package": "@keploy/capture-sdk",
      "install": "npm install @keploy/capture-sdk",
      "init": "import { KeployCapture } from \"@keploy/capture-sdk\";\n\nawait KeployCapture.init({\n  endpoint: \"https://api.keploy.io/ui/v1/ingest\",\n  apiKey: \"kep_YOUR_INGEST_KEY\",\n});\n"
    },
    "next": [
      "apiKey is shown only in this response: store it now (it is safe to ship in the page; it can only post recordings into this app)",
      "install the SDK and call KeployCapture.init once at app start-up, in the browser bundle",
      "browse the app, then GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/capture-status (MCP: uiCaptureStatus) to see sessions arrive",
      "a session becomes flows 30 minutes after its last activity (to end one at once, as a test or CI recording does, POST https://api.keploy.io/ui/v1/sessions/{sdkSessionId}/complete with this key in X-API-Key); read them with GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/flows (MCP: listUIFlows)",
      "once sessions are processed, GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/journeys (MCP: uiJourneys) is the journey plan a UI test run replays; GET /client/v1/apps/af1ec8ee-c43a-4c9c-826b-4223f506fb19/ui/test-runs (MCP: listUITestRuns, getUITestRun) reads the runs"
    ]
  },
  "meta": {
    "timestamp": "2026-11-20T07:25:04Z"
  }
}
```

- `apiKey` is in this answer only, which carries `Cache-Control: no-store`: store it now. It is safe to ship in your page's JavaScript, because it can only post recordings into this one app.
- Every call mints a new key, since a stored key's secret cannot be returned again. List and revoke the ones you no longer use.
- `sdk.init` sets only `endpoint` and `apiKey`. Put it in your app's browser entry point, once, in a module imported before any data fetching: requests made before `init` has loaded rrweb are not recorded.
- `endpoint` is empty when a self-hosted server does not know its public URL (`API_SERVER_URL` is not an absolute URL), and `next` then says to use the base URL you called this API on, followed by `/ui/v1/ingest`.
- A `409` with `UI_INGEST_KEY_ACCOUNT_CLAIMED` means the mint lost a race with a teardown of the app's service account, and the key was taken back. Call it again.

## List ingest keys {#list-ingest-keys}

`GET /client/v1/apps/{appId}/ui/ingest-keys` · MCP `listUIIngestKeys` · scope `read`, permission `app:view`

The app's ingest keys, newest first, revoked ones included, and never their secrets. `keyPrefix` matches the start of the `apiKey` a page ships.

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": [
    {
      "id": "0a09758e-d08e-4354-913f-dfb79fbb52bc",
      "name": "ci smoke",
      "keyPrefix": "kep_YOUR_ING",
      "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
      "status": "revoked",
      "createdAt": 1795159504
    },
    {
      "id": "ec6ebf01-0250-49c5-b71c-554cfec6f0af",
      "name": "storefront web",
      "keyPrefix": "kep_YOUR_ING",
      "appId": "af1ec8ee-c43a-4c9c-826b-4223f506fb19",
      "status": "active",
      "createdAt": 1795159503,
      "expiresAt": 1797751503
    }
  ],
  "meta": {
    "timestamp": "2026-11-20T07:25:05Z"
  }
}
```

## Revoke an ingest key {#revoke-an-ingest-key}

`DELETE /client/v1/apps/{appId}/ui/ingest-keys/{keyId}` · MCP `revokeUIIngestKey` · scope `write`, permission `testgen:run`

```bash
curl -X DELETE "https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys/<keyId>" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": {
    "id": "0a09758e-d08e-4354-913f-dfb79fbb52bc",
    "revoked": true
  },
  "meta": {
    "timestamp": "2026-11-20T07:25:04Z"
  }
}
```

Pages that still ship the key are refused within about 30 seconds. A key that is not one of this app's ingest keys is `404`.

## Capture status {#capture-status}

`GET /client/v1/apps/{appId}/ui/capture-status` · MCP `uiCaptureStatus` · scope `read`, permission `app:view`

Whether the capture SDK is delivering sessions and whether they have become flows, as a `state` to branch on, with an `explanation` and what to do `next`. It also returns the ingest `endpoint`, `idleAfterSeconds` (how long after its last activity a visit becomes flows), the number of sessions in all and by status, when the last batch arrived (`lastBatchAt`), the number of flows (`totalFlows`), and the ten most recent sessions.

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/capture-status" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json title="While a visit is recording"
{
  "data": {
    "state": "RECORDING",
    "explanation": "sessions are arriving; a visit becomes flows 30 minutes after its last activity",
    "next": [
      "keep using the app, or wait 30 minutes after the last activity, then check again",
      "to end a visit at once (a test or CI recording), POST https://api.keploy.io/ui/v1/sessions/{sdkSessionId}/complete with the app's ingest key in X-API-Key (the SDK's own session id for the visit); its flows follow within a minute or two"
    ],
    "endpoint": "https://api.keploy.io/ui/v1/ingest",
    "idleAfterSeconds": 1800,
    "totalSessions": 1,
    "sessionsByStatus": {
      "RECORDING": 1
    },
    "lastBatchAt": 1795159548,
    "totalFlows": 0,
    "recentSessions": [
      {
        "id": "a1e271a4-c6e8-456a-ab38-83f4bf64db4f",
        "sdkSessionId": "01056d9a-f9b9-48ef-baf7-15d8804cd7ab",
        "status": "RECORDING",
        "startedAt": 1795159526,
        "lastBatchAt": 1795159548,
        "eventCount": 70,
        "batches": 5,
        "sdkVersion": "3.1.0"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-11-20T07:25:49Z"
  }
}
```

A session's `id` is the `sessionId` its flows carry; `sdkSessionId` is the browser's own id for the visit, the one `POST /ui/v1/sessions/<sdkSessionId>/complete` takes.

| `state`       | What it means                                                                                                                            | What to do                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `NO_SESSIONS` | No recording has reached this app.                                                                                                       | Check that the page calls `init` with an ingest key for this app and the right endpoint.                                     |
| `RECORDING`   | Sessions are arriving. Each becomes flows `idleAfterSeconds` after its last activity.                                                    | Wait, keep using the app, or end a visit at once with [`POST /ui/v1/sessions/<sdkSessionId>/complete`](#complete-a-session). |
| `PROCESSING`  | Finished visits are being turned into flows.                                                                                             | Check again in a minute: extraction runs every minute.                                                                       |
| `FLOWS_READY` | At least one flow exists.                                                                                                                | [List the flows](#list-flows), and read the [journey plan](#journey-plan).                                                   |
| `NO_FLOWS`    | Visits were processed, and none made a flow. A page opened and left untouched still makes a one-step flow, such as `Navigate on /about`. | Record a fresh visit.                                                                                                        |
| `ALL_FAILED`  | Every finished visit failed to process.                                                                                                  | Record a fresh visit; contact Keploy support if it fails again.                                                              |

A visit that can't be processed is retried with backoff for about two hours and then counted as failed, so no state lasts forever.

## List flows {#list-flows}

`GET /client/v1/apps/{appId}/ui/flows` · MCP `listUIFlows` · scope `read`, permission `app:view`

The app's flows, usually one for each page a visit opened: its name, description, status, the `sessionId` it came from, its number of steps and network calls, and `createdAt`.

| Query parameter | What it is                                                                                             |
| --------------- | ------------------------------------------------------------------------------------------------------ |
| `limit`         | Page size, 1 to 200. The default is 50.                                                                |
| `offset`        | Page offset. The default is 0.                                                                         |
| `status`        | Only flows in this status: `EXTRACTED`, `CLUSTERED`, `TEST_GENERATED`, `TEST_PASSED` or `TEST_FAILED`. |

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/flows?limit=2" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": [
    {
      "id": "d07317d4-e2b5-4ba6-b1db-767966e4e474",
      "name": "Click on /",
      "description": "2 steps, 1 API calls, 6.1s",
      "status": "CLUSTERED",
      "sessionId": "2a58f279-cc49-48cf-85ab-e7cfd9199a33",
      "clusterId": "661be522-1276-4612-9e7e-181dfd1ad3ff",
      "steps": 2,
      "networkCalls": 1,
      "createdAt": 1795159660
    },
    {
      "id": "9888b9ee-f61d-4ca3-b13f-f0524c31d4ed",
      "name": "Navigate on /about",
      "description": "1 steps, 1 API calls, 0.0s",
      "status": "CLUSTERED",
      "sessionId": "2a58f279-cc49-48cf-85ab-e7cfd9199a33",
      "clusterId": "4949ebdb-3873-4f10-9d79-c2027ee534a8",
      "steps": 1,
      "networkCalls": 1,
      "createdAt": 1795159660
    }
  ],
  "meta": {
    "timestamp": "2026-11-20T07:28:15Z"
  }
}
```

The answer has no `meta.pagination`: ask for the next page with `offset` until a page comes back shorter than `limit`.

## Get a flow {#get-a-flow}

`GET /client/v1/apps/{appId}/ui/flows/{flowId}` · MCP `getUIFlow` · scope `read`, permission `app:view`

One flow in full: what [List flows](#list-flows) says of it, plus `stepList`, `networkCallList` and `outcome`.

- **`stepList`:** each step's `index`, `action`, `selector`, `hasValue` (a value was entered, never which), `checked` (the state an input step left a checkbox or a radio in), `pageUrl` and `timestamp`.
- **`networkCallList`:** each call's `method`, `url`, `responseStatus` and `timestamp`.
- **`outcome`:** the end state the recording proves: the path the flow's last click led to (`url`), or the elements the app added after its last answered call and still showed, each named by a selector and never by its text; the `viewport`, the window's size when the outcome was read; and `navigation`, how the next flow began. A flow extracted before extraction version 4 has none.

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/flows/<flowId>" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": {
    "id": "248a8854-06ac-4189-936b-e7eb2bd55326",
    "name": "Fill on /products",
    "description": "3 steps, 2 API calls, 6.1s",
    "status": "CLUSTERED",
    "sessionId": "db452012-c693-4938-a672-c15f44c59b1a",
    "clusterId": "16ba6a5d-a195-4ebb-9457-7f697bfc55c7",
    "steps": 3,
    "networkCalls": 2,
    "createdAt": 1795159660,
    "stepList": [
      {
        "index": 0,
        "action": "navigate",
        "selector": "",
        "hasValue": true,
        "pageUrl": "http://localhost:4173/products",
        "timestamp": 1795159625548
      },
      {
        "index": 1,
        "action": "input",
        "selector": "[data-testid=\"search-input\"]",
        "hasValue": true,
        "pageUrl": "http://localhost:4173/products",
        "timestamp": 1795159631613
      },
      {
        "index": 2,
        "action": "click",
        "selector": "[data-testid=\"search-button\"]",
        "pageUrl": "http://localhost:4173/products",
        "timestamp": 1795159631661
      }
    ],
    "networkCallList": [
      {
        "method": "GET",
        "url": "http://localhost:4173/api/products",
        "responseStatus": 200,
        "timestamp": 1795159625571
      },
      {
        "method": "GET",
        "url": "http://localhost:4173/api/products",
        "responseStatus": 200,
        "timestamp": 1795159631678
      }
    ],
    "outcome": {
      "elements": [],
      "viewport": {
        "width": 1280,
        "height": 720
      }
    }
  },
  "meta": {
    "timestamp": "2026-11-20T07:28:15Z"
  }
}
```

Headers, bodies, typed values and URL queries are never returned, and path segments that read as secrets or personal data come back as `REDACTED`: [What an agent sees](./agents.md#what-an-agent-sees) lists the rules. A flow of another app is `404`.

## Flow graph {#flow-graph}

`GET /client/v1/apps/{appId}/ui/flow-graph` · MCP `uiFlowGraph` · scope `read`, permission `app:view`

How the app's recorded visits move between pages. A node is a page path pattern, such as `/orders/:id`, with the number of flows on it and the share of sessions that reached it (`sessionPercentage`, 0 to 100); its `type` is `entry` when some session started there. A link is a move between two pages by a session's consecutive flows, with how often it happened (`value`) and at most five of the flows it led to (`flowIds`).

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/flow-graph" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": {
    "nodes": [
      {
        "id": "/",
        "label": "/",
        "type": "entry",
        "flowCount": 6,
        "sessionPercentage": 100
      },
      {
        "id": "/about",
        "label": "/about",
        "type": "page",
        "flowCount": 3,
        "sessionPercentage": 50
      },
      {
        "id": "/products",
        "label": "/products",
        "type": "page",
        "flowCount": 3,
        "sessionPercentage": 50
      },
      {
        "id": "/cart",
        "label": "/cart",
        "type": "page",
        "flowCount": 2,
        "sessionPercentage": 33.333333333333336
      },
      {
        "id": "/checkout",
        "label": "/checkout",
        "type": "page",
        "flowCount": 2,
        "sessionPercentage": 33.333333333333336
      }
    ],
    "links": [
      {
        "source": "/",
        "target": "/products",
        "value": 3,
        "flowIds": [
          "c220bcd5-4596-4270-ab4a-accfa4e7a403",
          "6368957e-9d8d-405f-939b-c162882cacfc",
          "248a8854-06ac-4189-936b-e7eb2bd55326"
        ]
      },
      {
        "source": "/products",
        "target": "/cart",
        "value": 2,
        "flowIds": [
          "453613fc-e400-4461-b184-2321dd2d2559",
          "80e82e96-c592-4da3-a3f6-c7f08b5daeec"
        ]
      },
      {
        "source": "/cart",
        "target": "/checkout",
        "value": 2,
        "flowIds": [
          "2635dfaf-b651-4b5d-ab3f-5fb7484f73c3",
          "b1e489df-42af-4bd6-b273-fe64147c9a80"
        ]
      },
      {
        "source": "/",
        "target": "/about",
        "value": 3,
        "flowIds": [
          "080dc372-322d-4b09-b644-194917534b1f",
          "9195ecd8-dc22-4418-8ccd-23c81aa854d8",
          "9888b9ee-f61d-4ca3-b13f-f0524c31d4ed"
        ]
      }
    ],
    "totalSessions": 6,
    "flowsRead": 16,
    "truncated": false,
    "backLinksDropped": 0
  },
  "meta": {
    "timestamp": "2026-11-20T07:28:16Z"
  }
}
```

The graph is bounded for an agent's context: the 100 most frequent links, every page they touch, and the most visited other pages up to 200 nodes. `linksDropped` and `nodesDropped`, present when some were left out, count them. Links only go forward in one page order, so moves back to an earlier page are counted in `backLinksDropped`. It is built from the app's 10,000 most recent flows (`truncated` says when there were more). The flow graph is on the REST API and MCP only.

## Journey plan {#journey-plan}

`GET /client/v1/apps/{appId}/ui/journeys` · MCP `uiJourneys` · scope `read`, permission `app:view`

The app's journey plan: how its sessions move between pages, the journeys they take, and the journeys Keploy selects to replay as tests. Every count is of sessions, and every `sessionPercentage` a share of `totalSessions`: a session is one page load of the app, its in-app navigation included, not a person.

| Query parameter | What it is                                                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `refresh`       | `true` computes a new plan now, from a minute after the last one was computed; before then the stored plan is answered. It needs `testgen:run` on the app and a key with the `write` scope. |

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/journeys" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": {
    "planId": "a89602ff-c783-4f8e-bc34-47a151adea19",
    "createdAt": 1795159694,
    "windowDays": 30,
    "from": 1792567694,
    "to": 1795159694,
    "totalSessions": 6,
    "sessionsRead": 6,
    "sessionsOnNoPage": 0,
    "coveragePermille": 1000,
    "coverageTargetPermille": 800,
    "maxJourneys": 20,
    "fingerprint": "65406ad5a44ff56445ccff79351a05b469be40938f9b8cc917f26f412ac91be7",
    "notes": [],
    "journeys": [
      {
        "id": "2990cf35868e23549307ad2120fe5d58",
        "pages": ["/", "/about"],
        "sessions": 3,
        "sessionPercentage": 50,
        "lastSeenAt": 1795159612,
        "selected": true,
        "pinned": false,
        "representativeSessionId": "2a58f279-cc49-48cf-85ab-e7cfd9199a33",
        "sdkVersion": "3.1.0",
        "flowIds": [
          "d07317d4-e2b5-4ba6-b1db-767966e4e474",
          "9888b9ee-f61d-4ca3-b13f-f0524c31d4ed"
        ]
      },
      {
        "id": "778bfd7ec36f1c03bfffa0362a47fe4f",
        "pages": ["/", "/products", "/cart", "/checkout"],
        "sessions": 2,
        "sessionPercentage": 33.333333333333336,
        "lastSeenAt": 1795159556,
        "selected": true,
        "pinned": false,
        "representativeSessionId": "55c7ea31-dba1-4d49-acbe-56cf700295e3",
        "sdkVersion": "3.1.0",
        "flowIds": [
          "f059842e-220d-415d-9195-b909f17f6536",
          "c220bcd5-4596-4270-ab4a-accfa4e7a403",
          "453613fc-e400-4461-b184-2321dd2d2559",
          "2635dfaf-b651-4b5d-ab3f-5fb7484f73c3"
        ]
      }
    ],
    "ranked": [
      {
        "id": "084e889e39bcbdc4ebbe152a5c81d4ab",
        "pages": ["/", "/products"],
        "sessions": 3,
        "sessionPercentage": 50,
        "lastSeenAt": 1795159625,
        "selected": false,
        "pinned": false,
        "representativeSessionId": "db452012-c693-4938-a672-c15f44c59b1a"
      }
    ],
    "rankedDropped": 0,
    "nodes": [
      {
        "page": "/",
        "sessions": 6,
        "sessionPercentage": 100,
        "entrySessions": 6
      },
      {
        "page": "/about",
        "sessions": 3,
        "sessionPercentage": 50,
        "entrySessions": 0
      }
    ],
    "edges": [
      {
        "source": "/",
        "target": "/about",
        "sessions": 3,
        "sessionPercentage": 50
      }
    ],
    "nodesDropped": 0,
    "edgesDropped": 0,
    "pagesMerged": 0,
    "freshness": {
      "computedAt": 1795159694,
      "sessionsCovered": 6,
      "sessionsProcessedSince": 0,
      "recomputesAfterSessions": 1,
      "recomputesAt": 1795246094,
      "refreshableAt": 1795159754
    }
  },
  "meta": {
    "timestamp": "2026-11-20T07:28:14Z"
  }
}
```

The answer above is shortened: `ranked` holds three journeys, `nodes` five pages and `edges` four moves.

- **`journeys`** are the journeys a test run replays: the most taken ones until they cover `coverageTargetPermille` of the window's moves between pages, at most `maxJourneys`, then any pinned ones. Each has its `pages`, `sessions` and `sessionPercentage`, `lastSeenAt`, and `flowIds`, the recording a test of it replays, which you read with [Get a flow](#get-a-flow). `excluded` says why a journey is not run: `ERRORS_ONLY`, `NO_REPLAYABLE_RECORDING` or `UNSEEN_IN_WINDOW`.
- **`ranked`** are the 50 most taken journeys; **`nodes`** and **`edges`** are the pages and the moves between them.
- **`notes`** say where a bound changed what is counted.
- **`freshness`** says how current the plan is: when it was computed (`computedAt`), how many sessions it read and how many were processed since, after how many more it is recomputed (`recomputesAfterSessions`), when a read recomputes it anyway (`recomputesAt`, a day after `computedAt`), and from when `refresh=true` does (`refreshableAt`).

A read that computes a plan waits for its turn on the server. When the server's queue of plan computations is full, or the request ends before its plan is ready, the answer is `429` `RATE_LIMITED` with `Retry-After: 10`: retry then.

## Journey impact {#journey-impact}

`GET /client/v1/apps/{appId}/ui/journeys/impact` · MCP `uiJourneyImpact` · scope `read`, permission `app:view`

How many of a plan's sessions took at least one of a set of its journeys. It is a union, never a sum: a session that took two of the journeys counts once.

| Query parameter | What it is                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------- |
| `planId`        | Required. The plan's `planId`, from the [journey plan](#journey-plan).                         |
| `journeyIds`    | Required. 1 to 100 journey IDs, joined with commas. Each must be one of the plan's `journeys`. |

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/journeys/impact?planId=<planId>&journeyIds=<journeyId>,<journeyId>" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": {
    "planId": "a89602ff-c783-4f8e-bc34-47a151adea19",
    "journeyIds": [
      "2990cf35868e23549307ad2120fe5d58",
      "778bfd7ec36f1c03bfffa0362a47fe4f"
    ],
    "totalSessions": 6,
    "affectedSessions": 5,
    "affectedSessionPercentage": 83.33333333333333
  },
  "meta": {
    "timestamp": "2026-11-20T07:28:17Z"
  }
}
```

A journey ID the plan does not run is `400` `INVALID_PARAMETER`; a `planId` that is not one of the app's plans, or a plan older than 14 days, is `404`.

## List test runs {#list-test-runs}

`GET /client/v1/apps/{appId}/ui/test-runs` · MCP `listUITestRuns` · scope `read`, permission `app:view`

The app's UI test runs, newest first, one summary each: `status`, `verdict`, a one-line `summary`, the `planId` it replays, the number of tests, a counter per verdict, the share of sessions its failing journeys stand for (`impact`) and their IDs (`failingJourneyIds`). It takes `offset` and `limit` (at most 100, default 20), and `meta.pagination` says whether more follow.

A run today comes only from a flow page's **Generate Test** in the dashboard, and it stays `PENDING`: no API call creates or runs one, and the runner that replays journeys as Playwright tests is not in a release build yet. For an app with no runs:

```bash
curl "https://api.keploy.io/client/v1/apps/<appId>/ui/test-runs" \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

```json
{
  "data": [],
  "meta": {
    "timestamp": "2026-11-20T07:28:18Z",
    "pagination": {
      "has_next_page": false,
      "has_previous_page": false,
      "next_cursor": null,
      "previous_cursor": null,
      "total_count": 0,
      "unreadable_count": 0
    }
  }
}
```

## Get a test run {#get-a-test-run}

`GET /client/v1/apps/{appId}/ui/test-runs/{runId}` · MCP `getUITestRun` · scope `read`, permission `app:view`

One run in full: what [List test runs](#list-test-runs) says of it, plus one result per journey (`results`), what to do `next`, and the run's claim by a runner. Each result has the journey's `verdict` (`PASSED`, `FAILED`, `UNCOVERED`, `UNPROVEN`, `NONDETERMINISTIC` or `BLOCKED`), its `cause`, the step it failed at (`failingStep`), and its `sessions` and `sessionPercentage`. A run that is `PENDING` has no results, and its `next` says that no runner has claimed it and not to poll for it. A run of another app is `404`.

## Delete an app {#delete-an-app}

`DELETE /client/v1/apps/{appId}` · MCP `deleteApp` · scope `admin`

```bash
curl -X DELETE "https://api.keploy.io/client/v1/apps/<appId>" \
  -H "Authorization: Bearer kep_YOUR_ADMIN_KEY"
```

```json
{
  "data": {
    "deleted": true
  },
  "meta": {
    "timestamp": "2026-11-20T07:28:19Z"
  }
}
```

An OAuth sign-in through the MCP server cannot delete an app: its token never has the `admin` scope.

## Ingest endpoints {#ingest-endpoints}

The capture SDK posts what it records to the ingest endpoint, `https://api.keploy.io/ui/v1/ingest`, with the ingest key in `X-API-Key`. These routes take only an ingest key, and any browser origin may call them.

### Complete a session {#complete-a-session}

`POST /ui/v1/sessions/{sdkSessionId}/complete`, with the ingest key in `X-API-Key`

Ends a visit at once, so Keploy turns it into flows within a minute or two instead of after 30 idle minutes, as a test or a CI recording should. `{sdkSessionId}` is the browser's id for the visit, which `KeployCapture.getSessionId()` returns. Close the visit's tab first: a tab left open on a completed session is refused at its next batch.

```bash
curl -X POST "https://api.keploy.io/ui/v1/sessions/<sdkSessionId>/complete" \
  -H "X-API-Key: kep_YOUR_INGEST_KEY"
```

```json
{
  "ok": true,
  "sessionId": "01056d9a-f9b9-48ef-baf7-15d8804cd7ab",
  "status": "COMPLETED"
}
```

Completing a session that has already ended answers `200` again, with its current status. A session this app never received is `404`.

### Answers {#ingest-answers}

`POST /ui/v1/ingest` is the SDK's: you do not call it yourself. The SDK stops capturing on any `4xx` answer but `429`, and [UI Capture errors and warnings](./errors.md) says what each one means.

| Status | When                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| `200`  | Accepted.                                                                                                             |
| `400`  | The request is malformed.                                                                                             |
| `401`  | No key, a key that is not a Keploy key or is sent the wrong way, an unknown or expired key, or the key's app is gone. |
| `403`  | The key is not an ingest key, such as a personal access token.                                                        |
| `404`  | No such route under `/ui/v1`, or a complete for a session this app never received.                                    |
| `405`  | A method other than `POST`.                                                                                           |
| `409`  | A batch for a completed session, a second run of one session id, or a batch id already stored with different events.  |
| `413`  | A batch over 10 MiB, or a session at its size or batch cap.                                                           |
| `415`  | A `Content-Type` or `Content-Encoding` the SDK does not send.                                                         |
| `429`  | The key's rate limit, 6,000 requests a minute, with `Retry-After`. The SDK retries these.                             |

## Related

- [MCP tools](./mcp-tools.md)
- [Operate UI capture from an AI agent](./agents.md)
- [AI agent quickstart](./quickstart-agent.md)
- [Keploy Public API](../running-keploy/public-api.md)
- [UI Capture errors and warnings](./errors.md)
