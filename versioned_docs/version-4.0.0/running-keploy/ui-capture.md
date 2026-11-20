---
id: ui-capture
title: Capture real user flows from your web app
sidebar_label: Overview
description: Keploy UI Testing records real user sessions in your web app and turns each visit into UI flows and journeys, in the dashboard, the REST API or MCP.
tags:
  - UI testing
  - UI capture
  - user flows
  - browser SDK
  - MCP
  - AI agent
keywords:
  - UI testing
  - UI capture
  - capture SDK
  - user flows
  - user journeys
  - session recording
  - ingest key
  - Keploy MCP
  - AI agent
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy UI Testing records how real people use your web app. A small browser SDK, `@keploy/capture-sdk`, records each visit in your users' browsers and masks personal data before anything leaves the browser. Keploy turns each visit into **UI flows**, the steps a user took on each page and the network calls those steps made, and into **journeys**: the paths visits take through your pages, each with its share of sessions. You read them in the Keploy dashboard, over the REST API, or from an AI agent through MCP.

**New here?** The [dashboard quickstart](../ui-capture/quickstart-dashboard.md) records your first flows from a sample shop in about 10 minutes, and the [walkthrough](../ui-capture/walkthrough-dashboard.md) goes on to journeys.

:::note Beta
UI Testing is in beta. Recording visits and reading them as flows and journeys works today. Replaying journeys as Playwright tests is in beta too, and its runner is not in a release build yet: see [What works today](#what-works-today).
:::

## How UI capture works {#how-ui-capture-works}

1. **An ingest key** connects the SDK to one Keploy app. It can only post recordings into that app, so it is safe to ship in your page's JavaScript. See [Ingest keys and environments](../ui-capture/ingest-keys.md).
2. **The capture SDK** runs in your users' browsers. It records the page with [rrweb](https://github.com/rrweb-io/rrweb) and every `fetch` and `XMLHttpRequest` call the page makes, masks personal data in the browser, and posts the recording to Keploy's `/ui/v1/ingest` in batches.
3. **Keploy ends a visit** after 30 minutes without activity, or at once when the visit is completed with `POST /ui/v1/sessions/<session id>/complete`. It then extracts the visit's flows, usually within a few minutes.
4. **Each page of a visit is its own flow**, a route change in a single-page app included, and Keploy chains a visit's flows into its journey. Every journey figure counts sessions: one page load of your app, its in-app navigation included.
5. **You read them** in the dashboard under **UI Testing → UI Flows**, or an agent reads them through the REST API or MCP.

Each visit's flows are listed per app in the dashboard:

<img src="/docs/img/ui-capture/ui-capture-flows.webp" alt="The Flows tab's table of flows, each with its name, session, last update time and status, under the note that each route is its own flow since SDK 3.1.0" width="100%" />

Each flow is the sequence of steps a user took on one page, with the network calls those steps made:

<img src="/docs/img/ui-capture/ui-capture-flow-detail.webp" alt="A flow's Step Timeline, with a masked search typed into the search box and the clicks that followed, beside its Network Calls" width="100%" />

## What works today {#what-works-today}

| What                                               | Status                 | Where                                                                      |
| -------------------------------------------------- | ---------------------- | -------------------------------------------------------------------------- |
| Recording visits, masking in the browser           | Beta                   | `@keploy/capture-sdk` 3.1.0                                                |
| Flows: each page's steps and network calls         | Beta                   | Dashboard **Flows** tab; REST and MCP (`listUIFlows`, `getUIFlow`)         |
| Journeys, and the share of sessions that took each | Beta                   | Dashboard **Journeys** tab; REST and MCP (`uiJourneys`, `uiJourneyImpact`) |
| Replaying journeys as Playwright tests, with mocks | Beta, not runnable yet | The runner is not in a release build yet.                                  |

The SDK only records: generating and running tests is Keploy's side, not the SDK's. A flow's page in the dashboard has a **Generate Test** button. Today it creates a test run that waits for a runner, and in the dashboard's own words: "No runner ships in this release, so the run stays pending until one does."

## Set up UI capture

You can set it up three ways, and they produce the same result: an ingest key for your app, and the SDK in your frontend.

### In the dashboard {#set-up-ui-capture-in-the-dashboard}

Open **UI Testing → UI Flows**, select your app in the header, and follow the setup card: create an ingest key, add the SDK, and check that sessions arrive. The [dashboard quickstart](../ui-capture/quickstart-dashboard.md) walks through it with a sample shop, and the [walkthrough](../ui-capture/walkthrough-dashboard.md) continues to flows and journeys.

### With the REST API {#set-up-ui-capture-with-the-rest-api}

Every step is available on the [Keploy Public API](./public-api.md) at `https://api.keploy.io/client/v1`. You need an API key: `write` scope to create or revoke an ingest key, `read` scope for everything else. Replace `<appId>` with your app's ID.

#### Create an ingest key {#create-an-ingest-key}

```bash
curl -X POST https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys \
  -H "Authorization: Bearer kep_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "storefront prod"}'
```

`name` is optional, and so is `ttlDays` (1 to 365; without it the key does not expire). The response carries the key as `apiKey`, the `endpoint` the SDK posts to, the SDK's install command and an `init` snippet with the key in it, and the `next` steps. `apiKey` appears only in this response: store it before you continue. Creating a key needs `testgen:run` on the app.

#### Check that capture is working {#check-that-capture-is-working}

```bash
curl https://api.keploy.io/client/v1/apps/<appId>/ui/capture-status \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

The response names a `state`, explains it, and lists what to do `next`. It also counts the app's sessions by status and its flows, and lists its most recent sessions.

| `state`       | What it means                                                                                            | What to do                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `NO_SESSIONS` | No recording has reached this app.                                                                       | Check that the page calls `init` with an ingest key for this app and the right endpoint.                               |
| `RECORDING`   | Sessions are arriving. Each becomes flows `idleAfterSeconds` after its last activity.                    | Wait, keep using the app, or end a visit at once with `POST /ui/v1/sessions/<session id>/complete` and the ingest key. |
| `PROCESSING`  | Finished visits are being turned into flows.                                                             | Check again in a minute.                                                                                               |
| `FLOWS_READY` | At least one flow exists.                                                                                | [Read the flows](#read-the-flows).                                                                                     |
| `NO_FLOWS`    | Visits were processed but none had a user action to make a flow from (a page opened and left untouched). | Record a visit that clicks, types or navigates.                                                                        |
| `ALL_FAILED`  | Every finished visit failed to process.                                                                  | Record a fresh visit; contact Keploy support if it fails again.                                                        |

A visit that can't be processed is retried with backoff for about two hours and then counted as failed, so no state lasts forever.

#### Read the flows {#read-the-flows}

```bash
# An app's flows
curl https://api.keploy.io/client/v1/apps/<appId>/ui/flows \
  -H "Authorization: Bearer kep_YOUR_API_KEY"

# One flow's steps and network calls
curl https://api.keploy.io/client/v1/apps/<appId>/ui/flows/<flowId> \
  -H "Authorization: Bearer kep_YOUR_API_KEY"

# The journey plan: how sessions move between pages, and each journey's share of sessions
curl https://api.keploy.io/client/v1/apps/<appId>/ui/journeys \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

The [walkthrough](../ui-capture/walkthrough-dashboard.md#read-the-same-data-from-a-script) shows what each one returns.

#### Manage ingest keys {#manage-ingest-keys}

```bash
# List an app's ingest keys (never returns a key's secret)
curl https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys \
  -H "Authorization: Bearer kep_YOUR_API_KEY"

# Revoke one; pages using it are refused within about 30 seconds
curl -X DELETE https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys/<keyId> \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

### From an AI agent (MCP) {#set-up-ui-capture-from-an-ai-agent-mcp}

Every UI capture endpoint is also a tool on the Keploy MCP server at `https://api.keploy.io/client/v1/mcp`. Connect your agent as described in [MCP client configuration](./agent-test-generation.md#mcp-client-configuration), with an API key that has `read` and `write` scope.

| Tool                                    | What it does                                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `createApp`                             | Creates an app. An app for UI capture needs only a name.                                              |
| `uiCaptureSetup`                        | Creates an ingest key and returns the endpoint, the SDK install command and the `init` snippet.       |
| `uiCaptureStatus`                       | Reports whether recordings arrive and have become flows, with the next step to take.                  |
| `listUIFlows`, `getUIFlow`              | List an app's flows; return one flow's steps and network calls.                                       |
| `uiFlowGraph`                           | How visits move between pages.                                                                        |
| `uiJourneys`, `uiJourneyImpact`         | The journey plan; the share of sessions a set of its journeys stands for.                             |
| `listUITestRuns`, `getUITestRun`        | Read UI test runs. Today a run is made only by a flow page's **Generate Test**, and it stays pending. |
| `listUIIngestKeys`, `revokeUIIngestKey` | List an app's ingest keys; revoke one.                                                                |

The server runs in tool-search mode, so these tools don't appear in the initial tool list. The agent finds them with `search_tools("ui capture")` or calls them by name through `invoke_tool`.

Then ask your agent, for example:

> "Use the Keploy MCP tools to set up UI capture for my app `storefront-web`: create an ingest key, add the capture SDK to this frontend, and tell me when the first flows are ready."

The agent calls `uiCaptureSetup`, edits your frontend with the returned snippet, and polls `uiCaptureStatus` until it reports `FLOWS_READY`.

#### What an agent sees {#what-an-agent-sees}

Flows returned by the REST API and MCP are meant for an agent's context, so they return the shape of the journey and leave out what is most likely to carry your users' data:

- A step says whether the user entered a value (`hasValue`), never the value itself.
- Request and response headers and bodies are not returned.
- URL query strings, fragments and credentials (`user:password@`) are removed.
- A path segment that looks like a secret or a personal number is replaced with `REDACTED`: an email address, six or more digits (a one-time code, an account or card number, and also a date written as digits, such as `20240115`), twelve or more letters and digits in one run (an invite or reset token), or a long token that is not a UUID. Long IDs that are not UUIDs, such as 24-character MongoDB ObjectIds, are replaced too.
- A flow's name and description are scrubbed the same way, and an `aria-label` value in a selector is replaced with `REDACTED`, because it is page text.

What is kept as recorded: the page's paths otherwise, and the `data-testid` values, IDs and class names your developers wrote. These checks go by shape, so they can't recognise every piece of personal data: if your app puts user data into paths or into those attributes, it reaches the agent.

## Install the SDK {#install-the-sdk}

Install the package as a runtime dependency. Its only dependency is `rrweb`.

```bash
npm install @keploy/capture-sdk
```

Call `init` once, as early in your app's startup as you can, in code that runs in the browser:

```ts
import {KeployCapture} from "@keploy/capture-sdk";

await KeployCapture.init({
  endpoint: "https://api.keploy.io/ui/v1/ingest",
  apiKey: "<your app's UI ingest key>",
});
```

Use the `endpoint` the setup card or the API gives you. It is `https://api.keploy.io/ui/v1/ingest` on Keploy Cloud, and your own API server's URL followed by `/ui/v1/ingest` when you self-host. A self-hosted API server builds it from its `API_SERVER_URL`; if that isn't set to the server's public URL, the API returns an empty `endpoint` and says so in `next`, rather than guessing.

- **Early, and once.** The SDK starts recording the page's requests once it has loaded rrweb, which your bundler normally puts in a chunk of its own. A request the page makes before then is not recorded, so start `init` before your app's own code runs. Call it once per page load, not per route: a second `init` returns the same capture.
- **Three sample setups.** The [UI capture sample shops](https://github.com/keploy/samples-typescript) show the call in a React and Vite app (`ui-capture-react-shop`: `src/keploy.ts`, imported first in `src/main.tsx`), a Next.js App Router app (`ui-capture-next-shop`: `instrumentation-client.ts`) and plain HTML pages with no bundler (`ui-capture-html-shop`).
- **Without a bundler**, serve the package's `dist/` directory as it is, import `dist/index.mjs` from it, and map `rrweb` with an import map before the SDK loads. If rrweb cannot be loaded, the capture ends before anything is sent and reports [`KUI_E_DOM_RECORDER_UNAVAILABLE`](../ui-capture/errors.md#kui-e-dom-recorder-unavailable).

### SDK options {#sdk-options}

`endpoint` and `apiKey` are the only required options. The others, with the value the SDK uses when you leave them out:

| Option                | Default      | What it does                                                                                                                                                                                                                 |
| --------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `privacyMode`         | `"balanced"` | `"balanced"` masks every typed value. `"strict"`, for public sites, also masks all visible text, records no request or response body and replaces every query value in a URL. `"off"` masks only password and hidden fields. |
| `sampleRate`          | `1`          | Fraction of captures recorded, rolled when `init` starts one: `0.1` records one in ten.                                                                                                                                      |
| `networkCapture`      | `true`       | Records `fetch` and `XMLHttpRequest` calls. `false` records the page only.                                                                                                                                                   |
| `maxSessionDuration`  | `600000`     | Milliseconds after which a session ends on its own (10 minutes). A later `init` starts a new one.                                                                                                                            |
| `continuous`          | `false`      | Keeps capturing for the life of the page, one session at a time: a session that ends is followed by a new one at the visitor's next click, tap or key press.                                                                 |
| `batchSize`           | `50`         | Events per request, at most 5,000.                                                                                                                                                                                           |
| `batchInterval`       | `5000`       | Milliseconds between sends.                                                                                                                                                                                                  |
| `maxQueueSize`        | `5000`       | Events held in memory while waiting to send; past this, the oldest are dropped.                                                                                                                                              |
| `maxBodySize`         | `524288`     | How much of a request or response body is recorded (512 KB).                                                                                                                                                                 |
| `maskSelectors`       | none         | CSS selectors whose text is masked.                                                                                                                                                                                          |
| `unmaskSelectors`     | none         | CSS selectors whose text is kept in the clear, overriding `maskSelectors` and `"strict"`. It cannot unmask an input value.                                                                                                   |
| `privacy`             | none         | Finer controls: `blockSelectors`, `maskNetworkBodies`, `sensitiveHeaders`, `piiPatterns`, `secretRoutes`, `keepRoutes`, and the two selector lists above.                                                                    |
| `sessionIdGenerator`  | none         | Your own session id instead of the SDK's UUID, to correlate with your own systems.                                                                                                                                           |
| `honorPrivacySignals` | `true`       | Records nothing for a browser that sends Do Not Track or Global Privacy Control, and reports [`KUI_E_CAPTURE_DECLINED`](../ui-capture/errors.md#kui-e-capture-declined).                                                     |
| `onError`             | none         | Called once when a terminal condition ends the capture. See [UI Capture errors and warnings](../ui-capture/errors.md).                                                                                                       |

The [package's README on npm](https://www.npmjs.com/package/@keploy/capture-sdk) describes each option in full.

## Privacy at a glance {#what-the-sdk-records-and-what-it-masks}

Masking happens in the browser, before anything is sent, so Keploy's server never sees the original.

- **Typed values** are masked in every input, textarea and select under `"balanced"` (the default) and `"strict"`. Password and hidden fields are masked in every mode, `"off"` included. The values of radio buttons, checkboxes and buttons are not typed and are recorded under `"balanced"` and `"off"`; to leave such an element out of the recording, list it in `privacy.blockSelectors`.
- **Visible text** is recorded under `"balanced"`, except inside `maskSelectors`. `"strict"` masks all of it. Strict still records `data-testid` values as written, so never build one from user data.
- **Network calls** are recorded with their method, URL, status, headers and bodies. The values of the `Authorization`, `Cookie`, `Set-Cookie`, `X-API-Key`, `X-Auth-Token` and `Proxy-Authorization` headers, and of any header whose name reads as a credential's, are always replaced with `[REDACTED]`. Bodies are redacted by structure: a value under a credential's name is replaced. `privacy.maskNetworkBodies: true` replaces every body with `[MASKED]`, `"strict"` sets it, and `networkCapture: false` records no call.
- **A body the SDK could not redact** is never recorded in the clear: it is recorded as not captured. [`KUI_E_BODY_WORKER_UNAVAILABLE`](../ui-capture/errors.md#kui-e-body-worker-unavailable) describes both markers.
- **Visitors who send Do Not Track or Global Privacy Control** are not recorded, by default.

The dashboard shows a flow's recorded URLs and calls to people on your team who can view the app. The [REST API and MCP](#what-an-agent-sees) return less.

[Privacy and masking](../ui-capture/privacy.md) covers every rule, and what each mode still records.

## Limitations {#limitations}

- **A visit ends after 30 minutes without activity.** A visitor who comes back to the same tab after that is not recorded again until the page reloads, unless you set `continuous: true`, which starts a new session at the visitor's next click, tap or key press.
- **A session lasts at most `maxSessionDuration`**, 10 minutes by default. Set `continuous: true` to keep capturing for the life of the page.
- **Requests made before `init` has loaded rrweb are not recorded.** See [Install the SDK](#install-the-sdk).
- **A site whose links load pages records each page load as its own session**, so its journeys never span a page load. A single-page app's route changes stay in one session.
- **Sampling is per page load, not per user.** The SDK carries no user identity, so journey figures are shares of sessions, not of people.
- **Replaying journeys as Playwright tests is in beta and not runnable yet.** See [What works today](#what-works-today).

[Sessions and sampling](../ui-capture/sessions-and-sampling.md) explains when a session starts and ends, and [Limits and sizes](../ui-capture/limits.md) lists every limit.

## Troubleshooting {#troubleshooting}

An SDK error or warning names a `KUI_E_` code, and [UI Capture errors and warnings](../ui-capture/errors.md) explains each one: what happened, why, and how to fix it.

**The browser console shows `403` with "this API key is not a UI ingest key".**
The SDK was given a personal access token or another kind of key. Create an ingest key for the app, in the dashboard or with `POST /client/v1/apps/<appId>/ui/ingest-keys`, and use it as `apiKey`.

**`capture-status` stays at `NO_SESSIONS`.**
Check the browser's network tab for requests to `/ui/v1/ingest`. If there are none, check that `init` runs in the browser, and that the browser does not send Do Not Track or Global Privacy Control ([`KUI_E_CAPTURE_DECLINED`](../ui-capture/errors.md#kui-e-capture-declined) in the console). A `401` or `403` means the key is not an ingest key, or has been revoked.

**Sessions arrive in a different app.**
An ingest key records into the app it was created for. Create a key for this app and use it as `apiKey`.

**Sessions arrive but no flows appear.**
A visit becomes flows 30 minutes after its last activity, or at once when it is completed with `POST /ui/v1/sessions/<session id>/complete`. `capture-status` shows `RECORDING` until then, and `NO_FLOWS` if the visit had no clicks, typing or navigation.

## Related

- [Dashboard quickstart](../ui-capture/quickstart-dashboard.md)
- [From first visit to journeys](../ui-capture/walkthrough-dashboard.md)
- [UI Capture errors and warnings](../ui-capture/errors.md)
- [@keploy/capture-sdk 3.1.0 release notes](../ui-capture/capture-sdk-3-1-0-release-notes.md)
- [Keploy Public API](./public-api.md)
