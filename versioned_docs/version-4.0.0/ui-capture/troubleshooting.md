---
id: troubleshooting
title: "Troubleshooting UI capture"
sidebar_label: Troubleshooting
description: What to do when Keploy UI capture records nothing, records into the wrong app, makes unexpected flows, cuts bodies, or an agent or the dashboard does not do what you expect.
tags:
  - UI testing
  - UI capture
  - troubleshooting
keywords:
  - UI capture troubleshooting
  - capture SDK
  - ingest key
  - capture status
  - KUI_E_SESSION_CONFLICT
  - Keploy MCP
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

Each entry below is a symptom, its cause and what to do. When the SDK reports a `KUI_E_` code in the browser console or to `onError`, [UI Capture errors and warnings](./errors.md) has that code's own section. The app's [capture status](./rest-api.md#capture-status), on the dashboard's setup card or over the API, is the first thing to read: it says whether recordings arrive and whether they have become flows.

## Setup {#setup}

### The console shows `403` and "this API key is not a UI ingest key" {#not-an-ingest-key}

**Cause:** `apiKey` holds a personal access token or another kind of Keploy key. The ingest endpoint takes only an ingest key.

**Fix:** Create an ingest key for the app, in the dashboard or with `POST /client/v1/apps/<appId>/ui/ingest-keys`, and pass it as `apiKey`. See [Ingest keys and environments](./ingest-keys.md).

### The console shows `401` on the posts to `/ui/v1/ingest` {#ingest-401}

**Cause:** The key is missing, unknown, expired or revoked, or its app was deleted. A revoked key is refused within about 30 seconds.

**Fix:** Create a new ingest key for the app and use it. The capture has ended with [`KUI_E_INGEST_KEY_REJECTED`](./errors.md#kui-e-ingest-key-rejected); a new key takes effect on the next page load.

### The console shows `404` or `405` on the posts {#ingest-404-405}

**Cause:** `endpoint` is wrong: the route is `<api-server>/ui/v1/ingest`.

**Fix:** Use `https://api.keploy.io/ui/v1/ingest` on Keploy Cloud, or your API server's URL followed by `/ui/v1/ingest`. See [`KUI_E_INGEST_ENDPOINT_NOT_FOUND`](./errors.md#kui-e-ingest-endpoint-not-found).

### Nothing arrives, and the console shows a CORS or Content-Security-Policy error {#cors-or-csp}

**Cause:** Either the browser refused the request before any status reached the SDK, because the endpoint's path is outside `/ui/v1/` on another origin, or the page's Content-Security-Policy does not allow the endpoint in `connect-src`. The SDK reads either as a network failure: it keeps retrying, and never calls `onError`.

**Fix:** Check the endpoint, and allow its origin in `connect-src`. See [Content-Security-Policy and workers](./csp-and-workers.md#the-directives-it-needs).

### Creating a key asks you to "Confirm it's you" {#confirm-its-you}

**Cause:** Creating or revoking an ingest key in the dashboard needs a recent sign-in.

**Fix:** Click **Sign in again** and sign in; the dashboard then creates the key. See [Create an ingest key](./quickstart-dashboard.md#create-an-ingest-key).

## Sessions {#sessions}

### Capture status stays at `NO_SESSIONS` {#no-sessions}

**Cause:** No recording has reached the app. Usually `init` does not run in the browser, the key is not this app's, or the browser sends Do Not Track or Global Privacy Control.

**Fix:** Open the app with the browser's developer tools: the SDK posts to `/ui/v1/ingest` every few seconds while you use the page. A `KUI_E_` code in the console says why it does not. See [Check that it works](./install-sdk.md#check-that-it-works).

### Sessions arrive in another app {#sessions-in-another-app}

**Cause:** A page records into the app of the key it sends. The SDK sends no app of its own, so a key made for another app is accepted, and its recordings go into that app, with no error.

**Fix:** Build the page with an ingest key of the app you mean. The key list (**Ingest keys** on the setup card, or `listUIIngestKeys`) shows each key's prefix, the start of the key, so you can tell which key a page ships. Keep each environment's visits apart with [an app per environment](./ingest-keys.md#one-app-per-environment).

### Some visitors never show up {#some-visitors-never-show-up}

**Cause:** The SDK records nothing for a browser that sends Do Not Track or Global Privacy Control, as it does by default, and Brave and DuckDuckGo send Global Privacy Control by default. A `sampleRate` under `1` leaves page loads out too.

**Fix:** Nothing, for the privacy signals: those visitors said no. See [Visitors' privacy signals](./privacy.md#visitors-privacy-signals) and [Sampling](./sessions-and-sampling.md#sampling).

### Each page of a site whose links load pages is a session of its own {#one-session-per-page-load}

**Cause:** A session is one page load of your app with its in-app navigation. A link that loads a page starts a new page, and with it a new capture and a new session. So on such a site, every journey is one page long.

**Fix:** This is how capture works on such a site; a single-page app keeps one session across its route changes. See [What a session is](./sessions-and-sampling.md#what-a-session-is).

### `KUI_E_SESSION_CONFLICT` after you completed a visit with its tab open {#session-conflict-after-complete}

**Cause:** `POST /ui/v1/sessions/<id>/complete` ended the session on Keploy's side, and the tab went on recording into it. Its next batch is refused with `409`, and the capture ends with [`KUI_E_SESSION_CONFLICT`](./errors.md#kui-e-session-conflict); with `continuous: true` and the SDK's own session ids, a new session starts at the visitor's next interaction instead.

**Fix:** Stop the capture before you complete its session: close the tab, or call `KeployCapture.stop()` and wait for it to resolve, as the sample shops' scripted visits do. See [End a visit at once](./sessions-and-sampling.md#end-a-visit-at-once).

### A tab that comes back after 30 minutes stops recording {#tab-back-after-30-minutes}

**Cause:** A tab can send no batch for more than 30 minutes while its session is still open: on a computer that slept, or with a `maxSessionDuration` longer than 30 minutes (by default a session ends after 10). By then Keploy has completed the session, so the tab's next batch is refused, and its capture ends with `KUI_E_SESSION_CONFLICT`.

**Fix:** Set `continuous: true`: with the SDK's own session ids, the capture then starts a new session at the visitor's next click, tap or key press. See [A tab that comes back after 30 minutes](./sessions-and-sampling.md#a-tab-that-comes-back).

## Flows {#flows}

### Sessions arrive, but no flows appear {#no-flows-yet}

**Cause:** A visit becomes flows 30 minutes after its last activity. Until then capture status says `RECORDING`.

**Fix:** Wait, or end the visit at once with `POST /ui/v1/sessions/<session id>/complete`: its flows follow within a minute or two. See [End a visit at once](./sessions-and-sampling.md#end-a-visit-at-once).

### Capture status says `FLOWS_READY` while some visits are still `COMPLETED` {#flows-ready-too-early}

**Cause:** The state is `FLOWS_READY` as soon as the app has any flow, whatever its other sessions are doing. Visits finished later are still being processed.

**Fix:** To wait for particular visits, read their sessions: `sessionsByStatus` counts every state, and `recentSessions` gives each recent session's `status` by its `sdkSessionId`. [Capture and replay in CI](./ci.md#a-capture-check-for-each-pull-request) waits that way.

### A flow named `Navigate on /…`, with one step {#one-step-navigate-flow}

**Cause:** A page that was opened and left untouched still makes a flow, of one step: arriving on the page. The texts for `NO_FLOWS` suggest otherwise. The setup card says the visits had no "click, typing or navigation to make a flow from", and capture status says "a page that is only loaded has no flow". Such a page makes this one-step flow.

**Fix:** Nothing to fix: the flow records that a visitor arrived on the page and did nothing there. See [Read the flows](./walkthrough-dashboard.md#read-the-flows).

### Capture status says `NO_FLOWS` or `ALL_FAILED` {#no-flows-or-all-failed}

**Cause:** `NO_FLOWS`: the app's visits were processed, and none made a flow. `ALL_FAILED`: every finished visit failed to be processed; a visit is retried for about two hours first.

**Fix:** Record a fresh visit that uses the app. If it fails again, contact Keploy support with the `sdkVersion` that `recentSessions` shows. See [Capture status](./rest-api.md#capture-status).

### A single-page app's visit makes one flow, on the page it landed on {#one-flow-per-visit}

**Cause:** `@keploy/capture-sdk` 3.0.1 records no route change made by script, so every step of the visit belongs to its first page. 3.1.0 records each route change, and each route is its own flow.

**Fix:** Upgrade to 3.1.0 or later. `recentSessions` in capture status shows each session's `sdkVersion`. See [Single-page apps and navigation](./spa-navigation.md#before-310).

### The first page's first requests are missing {#first-requests-missing}

**Cause:** Either your app made those requests before `KeployCapture.init()` ran (for example, `init()` was called inside a React `useEffect` instead of at top-level startup), or you are on `@keploy/capture-sdk` 3.1.0 or earlier, which waited for rrweb's chunk to finish loading before patching `fetch` and `XMLHttpRequest` and dropped requests made in that window.

**Fix:** Upgrade to `@keploy/capture-sdk` 3.2.0 or later, which patches `fetch` and `XMLHttpRequest` synchronously inside `init()` once its start checks pass and holds the recorded events until rrweb loads (the app's requests go out immediately), and call `init()` before your app mounts (`instrumentation-client.ts` in Next.js App Router, or the first top-level import in `src/main.tsx` in Vite). If your app dynamically imports the SDK after consent is already granted, you can gate initial fetches behind a short fail-open boot barrier (skipping the wait whenever capture is off or consent is not yet granted). See [Avoid missing boot-time authentication calls](./install-sdk.md#boot-time-capture) and [Start capture before your first call](./network-and-bodies.md#start-capture-before-your-first-call).

## Replay {#replay}

### Authenticated journeys redirect to `/signin` during replay {#replay-redirects-to-signin}

**Cause:** Initial boot-time authentication or session requests (such as `GET /auth/check` or `GET /api/me`) fired before `KeployCapture.init()` ran, so they were never recorded into the session. This happens when `init()` is called inside a React `useEffect` or after an auth provider mounts, or when recording with `@keploy/capture-sdk` 3.1.0 or earlier (which waited for `rrweb` to load before patching `fetch` and `XMLHttpRequest`). During replay, the app cannot match its initial auth check and redirects to `/signin` (and `keploy ui explain` reports `cause.ledger.denied > 0`, with `cause.kind` of `STEP_FAILED` or `MOCK_CONTRACT`).

**Fix:**

1. Upgrade to `@keploy/capture-sdk` 3.2.0 or later and move `KeployCapture.init()` out of `useEffect` into a static top-level import: `instrumentation-client.ts` (Next.js App Router) or the first import of `src/main.tsx` (Vite).
2. If your app dynamically imports the SDK after consent is already granted, gate initial auth fetches behind a short fail-open boot barrier (skipping the wait whenever capture is off or consent is not yet granted). See [Avoid missing boot-time authentication calls](./install-sdk.md#boot-time-capture).
3. Capture a fresh session so the recorded journey includes the boot auth call.
4. If the app also expects pre-existing browser cookies or `localStorage` entries before loading, pass `--storage-state ./storage-state.json` to `keploy ui run` (or place the file at `<repo>/.keploy/ui-storage-state.json`). See [Pre-seed cookies and localStorage](./cli.md#storage-state).

### Staging or preview replay fails when hitting a different API origin {#replay-different-api-origin}

**Cause:** The preview or staging build under test calls a backend API origin (for example `https://api.staging.example.com`) that differs from the recorded session (`https://api.example.com`). By default, Keploy binds each live API origin independently and one-to-one to its matching recorded origin (and synthesizes CORS `OPTIONS` preflights). A cross-origin request is denied when the same method and path were recorded on more than one origin (ambiguous match), when a live origin conflicts with an origin already bound, or when `--strict-origins` is enabled. In `keploy ui explain`, check `cause.ledger.denied > 0` regardless of `cause.kind` (a denied call often breaks a later UI step and is reported as `STEP_FAILED` rather than `MOCK_CONTRACT`).

**Fix:** Inspect `tests[].finding` in `.keploy-ui-results/verdict-document.json` and Playwright's report under `--out` for the denied live URL and `pass --origin-map <live>=<recorded-origin>` hint (and `nearbyCalls` in `keploy ui explain --app <app-id>` for the recorded flow's origins). Pass repeatable `--origin-map <live-origin>=<recorded-origin>` flags (live origin on the left, recorded origin on the right) to `keploy ui run`, and optionally add `--strict-origins` when you want to disable automatic aliasing and enforce only exact or mapped origins:

```bash
keploy ui run \
  --app <app-id> \
  --base-url https://preview.staging.example.com \
  --origin-map https://api.staging.example.com=https://api.example.com \
  --strict-origins
```

See [Map cross-origin APIs for staging and preview environments](./cli.md#cross-origin-api-replay).

## Bodies {#bodies}

| A body reads                                                        | Why                                                                                                                                                                                                                                   | See                                                                                    |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `[Response body not read by the page]`                              | Your app never read that response's body, so the SDK did not either. A replay sends this text.                                                                                                                                        | [How the SDK reads a body](./network-and-bodies.md#how-the-sdk-reads-a-body)           |
| `...[truncated]` at its end                                         | It was longer than `maxBodySize`, or it failed part-way.                                                                                                                                                                              | [Large bodies](./network-and-bodies.md#large-bodies)                                   |
| `[UNPARSEABLE_BODY_NOT_REDACTED]`                                   | It was JSON longer than `maxBodySize`: a cut JSON body cannot be redacted, so it is not kept.                                                                                                                                         | [Large bodies](./network-and-bodies.md#large-bodies)                                   |
| `[Response body too large: N bytes]`                                | Its `Content-Length` was over `maxBodySize`, so it was not downloaded.                                                                                                                                                                | [Large bodies](./network-and-bodies.md#large-bodies)                                   |
| `[Body cut: K of N characters kept, unverified]`                    | The page has no body worker, so bodies are redacted on the main thread up to 64 KiB; or the page left, or the capture stopped, with bodies still in the worker; or, with `0` kept, the bodies held for redaction were at their limit. | [Redaction off the main thread](./network-and-bodies.md#redaction-off-the-main-thread) |
| `[Body not captured: …]`                                            | The SDK could not redact it, so it kept none of it. This line follows `[Body cut: 0 of N …]` and says why.                                                                                                                            | [Redaction off the main thread](./network-and-bodies.md#redaction-off-the-main-thread) |
| `[MASKED]`                                                          | `privacyMode: "strict"` or `privacy.maskNetworkBodies: true` records every body that way.                                                                                                                                             | [Mask every body](./network-and-bodies.md#mask-every-body)                             |
| `[Blob: …]`, `[Binary: …]`, `[ReadableStream]`, `[Unreadable body]` | The body was not text the SDK reads.                                                                                                                                                                                                  | [Large bodies](./network-and-bodies.md#large-bodies)                                   |

## Build and Content-Security-Policy {#build}

### `KUI_E_DOM_RECORDER_UNAVAILABLE` {#rrweb-does-not-load}

**Cause:** The browser could not load rrweb: a page with no bundler and no import map for `rrweb`, a Content-Security-Policy that blocks its chunk, or a deployment that dropped it. The capture ends before anything is sent.

**Fix:** See [`KUI_E_DOM_RECORDER_UNAVAILABLE`](./errors.md#kui-e-dom-recorder-unavailable), and [No bundler](./bundlers.md#no-bundler) for the import map.

### `parcel build` fails: the `buffer` polyfill is not installed {#parcel-buffer}

**Cause:** rrweb's build reads Node's `Buffer`, and Parcel does not install the polyfill itself when `CI` is set. The build stops with `Node builtin polyfill "buffer/" is not installed, but auto install is disabled.`

**Fix:** `npm install buffer`. See [Parcel 2](./bundlers.md#parcel-2).

### `KUI_E_BODY_WORKER_UNAVAILABLE`, with `"part":"worker"` {#no-body-worker}

**Cause:** The page cannot run the SDK's body worker: esbuild does not emit it, webpack 4 cannot, a Content-Security-Policy blocks it, or your assets are served from another origin. Bodies over 64 KiB are then recorded cut.

**Fix:** Under esbuild, copy `node_modules/@keploy/capture-sdk/dist/body-worker.js` beside your bundle; allow `worker-src 'self'`; serve the worker from the page's origin. See [Where there is no body worker](./bundlers.md#where-there-is-no-body-worker).

## Strict mode {#strict}

### `KUI_E_PRIVACY_CONFLICT` {#privacy-conflict}

**Cause:** `privacyMode: "strict"` is set with `privacy.maskNetworkBodies: false`, which asks for the bodies strict leaves out. A `privacy` object built from `defaultPrivacyConfig()` carries that `false`.

**Fix:** Remove `maskNetworkBodies`, or use `"balanced"`. See [`KUI_E_PRIVACY_CONFLICT`](./errors.md#kui-e-privacy-conflict).

### `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE` {#strict-attributes-unavailable}

**Cause:** Strict could not load its attribute allow-list, a chunk of its own, so it recorded nothing.

**Fix:** Deploy every chunk your build emits, or serve the package's `dist/` as it is. See [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](./errors.md#kui-e-strict-attributes-unavailable).

### A visitor's data shows up under strict {#data-under-strict}

**Cause:** Strict still records what describes the page's structure, as written: URL paths, `id` and `class` values, a field's `name`, and `data-testid` values.

**Fix:** Never build a `data-testid`, an `id` or a path from a visitor's data, or block that element with `privacy.blockSelectors`. See [What strict records, and what it doesn't](./privacy.md#what-strict-records).

## Agents and the API {#agents}

### The UI capture tools are missing from the MCP server's `tools/list` {#tools-missing}

**Cause:** The server runs in tool-search mode: `tools/list` shows only its search and setup tools.

**Fix:** Fetch the tools you need by name with `get_tool_schema`, and run them with `invoke_tool`. See [MCP tools](./mcp-tools.md#the-server).

### Agents get `401` after weeks of working (`keploy mcp-install`) {#mcp-token-expired}

**Cause:** The token `keploy mcp-install` mints expires after 90 days. Run again, `mcp-install` hands out the same token from `~/.keploy/mcp.yaml` without checking that it has expired.

**Fix:** Run `keploy mcp-install --rotate`, then configure again every agent that used the old token. See [Connect your agent](./cli.md#keploy-mcp-install).

### `429` `RATE_LIMITED` {#rate-limited}

**Cause:** The API key made more than 100 requests in a minute, or the server's queue of journey plan computations is full.

**Fix:** Wait, then retry: `Retry-After` seconds over REST; over MCP, which shows no headers, the 10 seconds a refused `uiJourneys` names, otherwise a minute. Poll capture status at most once a minute. See [Waiting and polling](./agents.md#waiting-and-polling).

### `deleteApp` is refused {#delete-app-refused}

**Cause:** Deleting an app needs the `admin` scope. A token from an MCP OAuth sign-in never has it, and only organization admins can give it to an API key.

**Fix:** Delete the app with an admin's API key that has the `admin` scope. See [Delete an app](./rest-api.md#delete-an-app).

### An ingest key, or a service-account key, is refused by the REST API {#key-refused-by-the-api}

**Cause:** An ingest key can only post recordings: the REST API refuses it with `403` `INSUFFICIENT_SCOPE`, and the MCP server does not accept it. A service-account key bound to `UI_READER` only reads: it cannot create or delete apps, or list, mint or revoke ingest keys.

**Fix:** Use a personal access token with the scope the operation needs. See [Errors an agent should handle](./agents.md#errors-an-agent-should-handle).

## Dashboard {#dashboard}

### A panel says the figure "was never measured" {#never-measured}

**Cause:** The **Flow Graph** panel on the **Flows** tab and the **Coverage** tab are not served yet. Each says that the server does not expose it and that the figure was never measured: it is not zero. The **Generated Test** panel on a flow's page says the server does not expose the test's source.

**Fix:** For the flow graph, use `GET …/ui/flow-graph` or the MCP tool `uiFlowGraph`. See [The flow graph](./journeys.md#the-flow-graph).

### A test run from **Generate Test** stays pending {#generate-test-pending}

**Cause:** Clicking **Generate Test** on a flow's page in the dashboard creates a single-flow `PENDING` UI test run record on the server. That single-flow run remains pending because `keploy ui run` creates and executes a journey-plan run rather than claiming dashboard-created single-flow runs.

**Fix:** Run your app's journey plan directly with `keploy ui run --app <app-id> --base-url http://localhost:3000` using the `keploy` CLI (`v3.9.24+`, Linux and macOS), which creates, executes, and uploads a new journey-plan run. See [Replay journeys with `keploy ui run`](./cli.md#keploy-ui-run).

### The **Journeys** tab is empty {#journeys-tab-empty}

**Cause:** A journey plan reads the app's sessions that started in the last 30 days and have been processed. **No sessions in this window** means there are none; **No session has a journey yet** means sessions were read but none could be counted yet.

**Fix:** Record a visit and wait until capture status says `FLOWS_READY`, then reload the page. Over the API, `uiJourneys` with `refresh=true` computes a new plan at once; it needs the `write` scope and `testgen:run` on the app. See [Journeys and replay (beta)](./journeys.md).

## Related

- [UI Capture errors and warnings](./errors.md)
- [Install the SDK](./install-sdk.md#check-that-it-works)
- [Sessions and sampling](./sessions-and-sampling.md)
- [Operate UI capture from an AI agent](./agents.md)
- [Limits and sizes](./limits.md)
