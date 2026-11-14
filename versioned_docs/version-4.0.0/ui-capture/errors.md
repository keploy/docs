---
id: errors
title: UI Capture errors and warnings
sidebar_label: UI Capture errors
description: What each KUI_E_ error and warning from the Keploy capture SDK and the Keploy UI tools means, its exit code, why it happens, and how to fix it.
tags:
  - UI capture
  - capture SDK
  - keploy ui
  - errors
  - troubleshooting
keywords:
  - UI capture
  - capture SDK
  - KUI_E
  - onError
  - CaptureError
  - ingest key
  - exit code
  - keploy ui run
---

Keploy UI Capture names every error and warning it reports with a `KUI_E_` code, and links each code to its section on this page. Each section says what happened, the exit code, why it happened, and how to fix it, naming only commands that exist. It is written to be acted on by a person or by an AI agent.

- **The capture SDK** (`@keploy/capture-sdk`) passes its errors to `onError` and writes its warnings to the console; its exported `SDK_WARNINGS` lists the warnings. An error's `remedy.docs`, and a warning's `SDK_WARNINGS` entry, link here. See [Handle SDK errors and warnings](#handle-sdk-errors-and-warnings) and the table below.
- **The Keploy UI tools**, the `keploy ui` commands, the replay engine and the tools an AI agent calls, return their errors with a `remedy` whose `docs` links here, and exit with the code's exit code. See [Handle errors from the Keploy UI tools](#handle-errors-from-the-keploy-ui-tools), which lists their codes.

To set up UI Capture, see [Capture real user flows from your web app](../running-keploy/ui-capture.md).

| Code                                                                          | Kind    | Raised when                                                                                              |
| ----------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| [`KUI_E_INGEST_KEY_REJECTED`](#kui-e-ingest-key-rejected)                     | Error   | The ingest server answers `401` or `403`.                                                                |
| [`KUI_E_INGEST_ENDPOINT_NOT_FOUND`](#kui-e-ingest-endpoint-not-found)         | Error   | The ingest server answers `404` or `405`.                                                                |
| [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict)                           | Error   | The ingest server answers `409`.                                                                         |
| [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected)                             | Error   | The ingest server, or for a `413` a proxy in front of it, answers any other `4xx` except `429`.          |
| [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid)                       | Error   | `sessionIdGenerator` does not produce an id the server would accept.                                     |
| [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable)           | Error   | The SDK cannot load rrweb in the browser.                                                                |
| [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](#kui-e-strict-attributes-unavailable) | Error   | Under `privacyMode: "strict"`, the SDK cannot load its attribute allow-list in the browser.              |
| [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid)                 | Error   | A `privacy.secretRoutes` or `privacy.keepRoutes` entry is not a valid route.                             |
| [`KUI_E_CAPTURE_DECLINED`](#kui-e-capture-declined)                           | Error   | The browser sends Do Not Track or Global Privacy Control, and `honorPrivacySignals` is on (the default). |
| [`KUI_E_PRIVACY_CONFLICT`](#kui-e-privacy-conflict)                           | Error   | `privacyMode: "strict"` is set together with `privacy.maskNetworkBodies: false`.                         |
| [`KUI_E_EVENT_UNSERIALISABLE`](#kui-e-event-unserialisable)                   | Warning | An event cannot be serialised to JSON.                                                                   |
| [`KUI_E_EVENT_OVERSIZED`](#kui-e-event-oversized)                             | Warning | An event alone is over the ingest server's body cap.                                                     |
| [`KUI_E_EVENT_OVERSIZED_SCRUBBING`](#kui-e-event-oversized-scrubbing)         | Warning | Scrubbing credentials out of an event takes it over that cap.                                            |
| [`KUI_E_NAVIGATION_UNWRAPPED`](#kui-e-navigation-unwrapped)                   | Warning | The page made a History or Navigation API method the SDK wraps impossible to replace.                    |
| [`KUI_E_REQUEST_TERM_FAILED`](#kui-e-request-term-failed)                     | Warning | The SDK could not compute a request's GraphQL term, or could not load the code that computes it.         |
| [`KUI_E_BODY_WORKER_UNAVAILABLE`](#kui-e-body-worker-unavailable)             | Warning | The page cannot run the SDK's body worker, or load the code that redacts bodies.                         |

:::note SDK versions
This page describes the SDK releases whose codes link here, all of them after 3.0.1. `@keploy/capture-sdk` 3.0.1 does not link here and differs in places, among them: its `CaptureError.remedy` is `{command, manual}`, with no `docs` and the full remedy in `manual`; it has no `continuous` option and no `privacy.secretRoutes` or `privacy.keepRoutes`; it has no `honorPrivacySignals` and records regardless of Do Not Track or Global Privacy Control; its `privacyMode: "strict"` does not mask request or response bodies; and it does not raise `KUI_E_DOM_RECORDER_UNAVAILABLE`, `KUI_E_PRIVACY_ROUTE_INVALID`, `KUI_E_CAPTURE_DECLINED`, `KUI_E_PRIVACY_CONFLICT`, `KUI_E_EVENT_OVERSIZED_SCRUBBING`, `KUI_E_NAVIGATION_UNWRAPPED`, `KUI_E_REQUEST_TERM_FAILED`, `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE` or `KUI_E_BODY_WORKER_UNAVAILABLE`. `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE` and `KUI_E_BODY_WORKER_UNAVAILABLE` are new in 3.1.0-rc.2: 3.1.0-rc.1 does not raise them either, and it writes its warnings with `console.error`, not `console.warn`.
:::

## Handle SDK errors and warnings

**An error ends the capture.** The SDK logs it with `console.error`, stops recording, releases its singleton, and then calls your `onError` once with a `CaptureError`. When the ingest server refused a batch, the logged line carries the server's own explanation, and the SDK also unpatches `fetch` and `XMLHttpRequest` and drops every event it had not yet sent. A page started offline loses what it held the same way when rrweb, or under strict its attribute allow-list, then fails to load: see [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable) and [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](#kui-e-strict-attributes-unavailable). Because the singleton is released before `onError` runs, your handler can call `KeployCapture.init()` again, and that starts a fresh capture once the cause is fixed. With the same options it does not: [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid), [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid) and [`KUI_E_PRIVACY_CONFLICT`](#kui-e-privacy-conflict) are raised again; [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable) and [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](#kui-e-strict-attributes-unavailable) are raised again on the same page until you fix the cause and reload; and while the browser sends a privacy signal and `honorPrivacySignals` is on, every `init()` is declined with [`KUI_E_CAPTURE_DECLINED`](#kui-e-capture-declined). Never call `init()` again from `onError` on these six codes with the same options: each such call raises the same error and calls your handler again, which calls `init()` again, and so on. An error the SDK raises before sending anything does not reject `init()`: `init()` resolves, and the error reaches you only through `onError`.

[`KUI_E_CAPTURE_DECLINED`](#kui-e-capture-declined) is not a failure, so it is logged differently: with `console.info`, and only for the first declined `init()` on a page. `onError` still hears every declined `init()`.

One exception: with `continuous: true` and session ids the SDK minted, a refusal that says the server completed or filled the session ends only that session, without `onError`. See [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict) and [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected).

A `CaptureError` carries:

- `code`: one of the ten SDK error codes on this page. Branch on `code`, never on the message.
- `status`: the HTTP status the server answered, or `null` when the SDK refused before sending anything.
- `serverMessage`: the `error` field of the server's JSON body, or the body's text, or `null`.
- `issues`: the server's `[{path, message}]` list, which the ingest server sends only with a `400` to say which field it refused, or `null`.
- `remedy`: `{command, manual, docs}`. `docs` links to the code's section on this page, where the remedy is, and `manual` holds the same link. `command` is always `null`: no command of the keploy binary performs these fixes.
- `evidence`: the fields listed under **Evidence** in the code's section below.

```ts
import {KeployCapture} from "@keploy/capture-sdk";

await KeployCapture.init({
  endpoint,
  apiKey,
  onError: (err) => {
    // The visitor's browser declined capture: not a failure, so keep it out
    // of your error tracker.
    if (err.code === "KUI_E_CAPTURE_DECLINED") return;
    if (err.code === "KUI_E_INGEST_KEY_REJECTED") rotateKeyAndReload();
    else report(err.code, err.serverMessage, err.evidence, err.remedy.docs);
  },
});
```

The server's status decides the code:

| The ingest server answers             | Code                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| `401` or `403`                        | [`KUI_E_INGEST_KEY_REJECTED`](#kui-e-ingest-key-rejected)             |
| `404` or `405`                        | [`KUI_E_INGEST_ENDPOINT_NOT_FOUND`](#kui-e-ingest-endpoint-not-found) |
| `409`                                 | [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict)                   |
| Any other `4xx` (`400`, `413`, `415`) | [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected)                     |
| `429`, a `5xx`, or a network failure  | None: the SDK retries with backoff and never calls `onError`.         |
| `2xx`                                 | None: the batch was accepted.                                         |

**A warning does not end the capture.** The SDK does not call `onError`. Three warnings each mean one event was dropped; [`KUI_E_NAVIGATION_UNWRAPPED`](#kui-e-navigation-unwrapped), [`KUI_E_REQUEST_TERM_FAILED`](#kui-e-request-term-failed) and [`KUI_E_BODY_WORKER_UNAVAILABLE`](#kui-e-body-worker-unavailable) drop no event. The SDK writes one `console.warn` line for the first occurrence of each code in a capture, and says nothing about later ones in that capture: a later dropped event is dropped silently. A new `init()`, or with `continuous: true` each new session, starts a new count. The exception is [`KUI_E_BODY_WORKER_UNAVAILABLE`](#kui-e-body-worker-unavailable), which the SDK writes once per page. The SDK never uses `console.error` for a warning, so a page whose tests or error tracker fail on console errors does not fail on one. SDK versions before 3.1.0-rc.2 wrote these lines with `console.error`. The line names the code and ends with the evidence as JSON:

```text
[keploy] KUI_E_EVENT_OVERSIZED: dropped an event: 11059200 bytes in a body, over the ingest server's 10485760-byte cap, so no batch could carry it. The capture continues; any further such events in this capture are dropped silently. evidence={"eventId":"7","eventType":"dom","bytes":11059200,"cap":10485760}
```

A program that reads the console can match the code and parse the JSON after the first `evidence=`. Nothing before that marker comes from your page: the event's id and type are only in the JSON.

## `KUI_E_INGEST_KEY_REJECTED` {#kui-e-ingest-key-rejected}

**Error.** The ingest server answered `401` or `403`. Capture has stopped.

**Exit code:** `11` (blocked-env), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The ingest server refused the SDK's API key, so no events from this page can be stored.

**Cause:** The key is missing, unknown, expired or revoked, its owner is deactivated, or it is not a UI ingest key. A [scoped Public API key](../running-keploy/public-api.md) (a personal access token) is refused with `403` however it is scoped: with `write` scope it can mint an ingest key, but it is not one.

**Fix:** Mint a UI ingest key for this app and pass it as `apiKey` to `KeployCapture.init()`. You can mint one:

- In the Keploy dashboard, as described in [Set up UI Capture in the dashboard](../running-keploy/ui-capture.md#set-up-ui-capture-in-the-dashboard).
- With `POST <api-server>/client/v1/apps/<appId>/ui/ingest-keys` and a scoped Public API key with `write` scope in `Authorization: Bearer`, as described in [Create an ingest key](../running-keploy/ui-capture.md#create-an-ingest-key). The Keploy MCP server's `uiCaptureSetup` tool makes the same call.

Both need `testgen:run` on the app. A new key takes effect on the next page load.

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_INGEST_ENDPOINT_NOT_FOUND` {#kui-e-ingest-endpoint-not-found}

**Error.** The ingest server answered `404` or `405`. Capture has stopped.

**Exit code:** `11` (blocked-env), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** Nothing at `endpoint` accepts a POST, so no events from this page can be stored.

**Cause:** `endpoint` is wrong, not the key. The SDK sends only POSTs to `endpoint`, and the route that accepts them is the ingest route, `<api-server>/ui/v1/ingest`. A `404` or `405` that reaches the SDK comes from a typo in the path under `/ui/v1/`, or from a same-origin proxy that does not forward the route.

**Fix:** Set the `endpoint` you pass to `KeployCapture.init()` to `<api-server>/ui/v1/ingest` (`https://api.keploy.io/ui/v1/ingest` on Keploy Cloud), or to a same-origin proxy that forwards that route, and reload the page.

:::caution Silence does not prove the endpoint is right
If the endpoint is on another origin and its path is outside `/ui/v1/`, or the API server has no UI ingest route, the browser refuses the CORS preflight and no status reaches the SDK. The SDK retries that as a network error and never raises this code. Check the endpoint before you trust silence.
:::

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_SESSION_CONFLICT` {#kui-e-session-conflict}

**Error.** The ingest server answered `409`. Capture has stopped.

**Exit code:** `11` (blocked-env), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** This session id is already claimed by a completed session or by a different capture, or a `batchId` was re-used with different events.

**Cause:** Usually a `sessionIdGenerator` that returns a fixed value, so a second run of the same scenario posts into the first run's session. A session completed from the dashboard while the page was still recording is refused the same way.

**Fix:** Give each run its own session id: remove the `sessionIdGenerator` override, or make it return a fresh id on every page load. Events already stored under this session are intact.

With `continuous: true` and session ids the SDK minted, a `409` whose body gives the reason `session_completed` ends only that session: the SDK does not call `onError`, and the next session starts at the visitor's next interaction. Any other reason, a server that sends no reason, or your own `sessionIdGenerator` stops the capture as above.

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_INGEST_REJECTED` {#kui-e-ingest-rejected}

**Error.** The ingest server, or for a `413` a proxy in front of it, answered a `4xx` it will keep refusing: the body is malformed (`400`), its encoding is unsupported (`415`), or it is over a size limit (`413`). Capture has stopped.

**Exit code:** `11` (blocked-env), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** A batch was refused, and sending it again would be refused again.

**Cause:** Read `serverMessage`: the ingest server's own sentence, or the text of a body that is not the ingest server's. A `413` from the ingest server is one of two things it does not tell apart by status:

- `ui session has reached its size limit`: this session is complete.
- A sentence containing `request body exceeds` (`request body exceeds N bytes` for the size on the wire, `decoded request body exceeds N bytes` after gzip): the server's body cap is lower than the 10 MiB the SDK forms every batch under. The SDK and the server are at mismatched versions.

A `413` whose `serverMessage` holds neither sentence did not come from the ingest server. A proxy in front of it refused the body under its own limit. nginx's page says `413 Request Entity Too Large`, and nginx's default `client_max_body_size` is 1 MiB.

A `400` or `415` is the same mismatch as `request body exceeds`. The SDK builds every byte it sends: it checks the session id (the one value you supply) against the server's rule before sending, clamps `batchSize` to the 5000-event cap it knows, and cuts every batch at the 10 MiB decoded cap. So a `4xx` of this kind means the server's rules are newer than this SDK's. On a `400`, `evidence.issues` names the field the server refused.

**Fix:**

- For `ui session has reached its size limit`, call `KeployCapture.stop()` and then `KeployCapture.init()` to start a new session. With `continuous: true` and session ids the SDK minted, a `413` whose body gives the reason `session_full` needs none of this: the SDK ends that session without calling `onError`, and the next one starts at the visitor's next interaction.
- For a `413` that holds neither sentence, raise the proxy's body limit on the ingest route to at least 10 MiB, the most the SDK sends in one request (for nginx, `client_max_body_size 10m;`). Upgrading the SDK changes nothing.
- For a mismatch (`request body exceeds`, a `400` or a `415`), upgrade `@keploy/capture-sdk` to the version the server documents.

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_SESSION_ID_INVALID` {#kui-e-session-id-invalid}

**Error.** Raised by the SDK before it sends anything. Capture did not start.

**Exit code:** `15` (usage), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The configured `sessionIdGenerator` did not produce a session id the ingest server would accept: it returned a string outside the server's rule, returned a non-string, or threw. Nothing was sent.

**Cause:** `evidence.received` says what the generator produced: `string <value>`, `number 42`, `object Map {}`, `a Promise (sessionIdGenerator must return a string synchronously)`, or `threw <error>`. `evidence.sessionId` is the string it returned, or `null` when it returned no string. `evidence.rule` is the server's rule: a session id must be 1–200 characters of letters, digits, dot, dash and underscore, with no empty dot-separated segment.

**Fix:** Make `sessionIdGenerator` return a string inside that rule, synchronously, without throwing. Encode a correlation id such as `user:42/session 1` first, for example as base64url. Or remove the override and let the SDK mint a UUID. The SDK checks the id before it sends the first byte, so the fix takes effect on the next `init()`.

**Evidence:** `sessionId`, `received`, `rule`.

## `KUI_E_DOM_RECORDER_UNAVAILABLE` {#kui-e-dom-recorder-unavailable}

**Error.** Raised in the browser before the SDK sends anything: at `init()`, or, for a page started offline, once the network is back and the import still fails. Capture has ended.

**Exit code:** `15` (usage), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The SDK could not load rrweb, the library it records the page with. Without it a session holds no clicks, typing or page changes and would become no flows, so the SDK ended the capture before sending anything.

**Cause:** `evidence.reason` is the error the browser gave for the SDK's `import("rrweb")`. That import names the bare specifier `rrweb`, which a bundler (Vite, webpack, Next.js, esbuild, Rollup) resolves and a page that loads the SDK without one cannot. A Content-Security-Policy or a network failure that blocks rrweb's chunk is refused the same way; `reason` says which.

**Fix:**

- Install `@keploy/capture-sdk` with your package manager and import it from code your bundler builds.
- With no bundler, map the specifier with an import map before the SDK loads:

  ```html
  <script type="importmap">
    {
      "imports": {
        "rrweb": "<URL of rrweb's dist/rrweb.js, the version @keploy/capture-sdk depends on>"
      }
    }
  </script>
  ```

- When a Content-Security-Policy or a network failure blocked rrweb's chunk, make the chunk reachable.

Then reload the page. A browser keeps a failed module import for the life of the page: in Chromium, a second `init()` after the fix makes no new request and fails again.

A page started offline does not ask for rrweb until it is back online, and sends nothing until rrweb has loaded. If the import then fails, the SDK drops what the page did meanwhile, unsent. A page that a service worker controls is different: the worker is asked for rrweb at once, and a worker that does not hold rrweb's chunk fails the import, so precache it.

Under server-side rendering there is no page, so a failed import records nothing and raises nothing.

**Evidence:** `reason`.

## `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE` {#kui-e-strict-attributes-unavailable}

**Error.** Raised in the browser under `privacyMode: "strict"`, before the SDK sends anything: at `init()`, or, for a page started offline, once the network is back and the load still fails. Capture has ended.

**Exit code:** `15` (usage), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** Strict records no page text: it blanks every attribute value that can hold text, such as `title`, `aria-label` or `alt`, and keeps those that hold the page's structure, such as `id`, `class`, `role` or `data-testid`. The list of attributes it keeps is a chunk of its own, `dist/strict-attributes.mjs` (`dist/strict-attributes.js` in the CommonJS build), which only strict loads, in parallel with rrweb. The SDK could not load it, so it ended the capture without recording the page. It does not record without the list: it could not tell which values to keep, and blanking every attribute value would leave a recording that selectors and replay cannot use.

**Cause:** `evidence.reason` is the error the browser gave for the SDK's `import("@keploy/capture-sdk/strict-attributes")` and, on a page with no bundler, for `dist/strict-attributes.mjs` beside `dist/index.mjs`. `privacyMode: "balanced"` and `"off"` never load the chunk, so they never raise this code.

- Your deployment does not serve the chunk your bundler emitted for `@keploy/capture-sdk/strict-attributes`.
- With no bundler, the page does not serve `dist/strict-attributes.mjs` beside `dist/index.mjs`, and its import map does not map `@keploy/capture-sdk/strict-attributes`.
- A Content-Security-Policy or a network failure blocked the chunk; `reason` says which.
- The chunk is another version's: the SDK refuses a chunk built as any version but its own. A page that loads the SDK from unpkg's package root with `?module` gets the `module` field's build, `dist/index.bundler.mjs` (webpack 4's), and unpkg rewrites the SDK's import of its own chunks to the `@latest` version's files, which are another version's whenever the page does not load the latest. That build refuses them and has no file beside it to fall back to, so the strict capture is refused.

**Fix:**

- With a bundler (Vite, webpack, Next.js, esbuild, Parcel), deploy every chunk your build emits, not only the entry.
- With no bundler, serve the package's `dist/` as it is, so `strict-attributes.mjs` sits beside `index.mjs`, or map `@keploy/capture-sdk/strict-attributes` to the package's `dist/strict-attributes.mjs` in your import map, as you map `rrweb`.
- From a CDN, import `dist/index.mjs` by its path, for example `https://unpkg.com/@keploy/capture-sdk@<version>/dist/index.mjs` or `https://cdn.jsdelivr.net/npm/@keploy/capture-sdk@<version>/dist/index.mjs`. It refuses a chunk of another version and loads its own from beside it. On unpkg, the package root without `?module` also works, because unpkg redirects it to `dist/index.mjs`. jsDelivr's package root does not: jsDelivr serves the file there without a redirect, so the browser looks for the SDK's chunks in the wrong directory.
- When a Content-Security-Policy blocked the chunk, allow the chunk's origin in `script-src`. When a network failure did, make the chunk reachable.

Then reload the page. A browser keeps a failed module import for the life of the page, so the fix takes effect on the next page load, not on another `init()`.

A page started offline does not ask for the chunk until it is back online, and sends nothing until it has loaded. If the load then fails, the SDK drops what the page did meanwhile, unsent. A page that a service worker controls asks at once, and a worker that does not hold the chunk fails the load, so precache it, as for rrweb: see [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable).

**Evidence:** `reason`.

## `KUI_E_PRIVACY_ROUTE_INVALID` {#kui-e-privacy-route-invalid}

**Error.** Raised by the SDK before it sends anything. Capture did not start.

**Exit code:** `15` (usage), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** A route in `privacy.secretRoutes` or `privacy.keepRoutes` is not one the SDK can match. Recording with it would protect nothing it names, so capture did not start and nothing was sent.

**Cause:** `evidence.option` is the list the entry is in, `evidence.received` is the entry (`string <value>`, `number 42`), and `evidence.rule` is what a route must be:

- `/`-separated segments from the start of the path, each a literal, `*` (any one segment) or `:name` (the value it names), with no `?` or `#`.
- A secret route names at least one `:name`, for example `/invites/:key` or `/*/forgotten-password/:token`.
- A keep route has at least one literal, for example `/teams/invite/:teamId` or `/invites/settings`.
- The option must be an array of such strings.

**Fix:** Rewrite the entry inside that rule, or remove it. The SDK checks the routes before it sends the first byte, so the fix takes effect on the next `init()`.

**Evidence:** `option`, `received`, `rule`.

## `KUI_E_CAPTURE_DECLINED` {#kui-e-capture-declined}

**Error.** Raised by the SDK before it records or sends anything. Capture did not start. This is not a failure, so the SDK logs it with `console.info`, not `console.error`.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The visitor's browser sent a privacy signal, Do Not Track or Global Privacy Control, and `honorPrivacySignals` is on, as it is by default. The SDK honoured the signal: it recorded nothing, patched nothing and sent nothing, and the capture never started.

**Cause:** The visitor's browser settings, not your code. `evidence.signal` names the signal:

- `globalPrivacyControl`: `navigator.globalPrivacyControl` is `true`. When the browser sends both signals, this is the one named.
- `doNotTrack`: `navigator.doNotTrack` is `"1"` or `"yes"`, `window.doNotTrack` is `"1"`, or `navigator.msDoNotTrack` is `"1"`.

Some browsers send Global Privacy Control by default, Brave and DuckDuckGo among them, so expect this code from a share of your real visitors. The SDK checks the signal on every `init()` made while no capture is running, before `sampleRate` applies, so a visitor that `sampleRate` would have left out is declined, and reported, all the same. `onError` is called once for every declined `init()`. The `console.info` line is written only for the first one on a page:

```text
[keploy] capture did not start: the browser sent Global Privacy Control, and honorPrivacySignals is on (KUI_E_CAPTURE_DECLINED). Nothing was recorded or sent.
```

`@keploy/capture-sdk` 3.0.1 records regardless of these signals, so once you upgrade from it, visitors who send either signal are no longer recorded.

The decline also comes before every other check except [`KUI_E_PRIVACY_CONFLICT`](#kui-e-privacy-conflict): in a browser that sends either signal, with `honorPrivacySignals` on, the SDK never checks `sessionIdGenerator` or your privacy routes, and never loads rrweb or strict's attribute allow-list, so [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid), [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid), [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable) and [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](#kui-e-strict-attributes-unavailable) cannot appear there.

**Fix:** Nothing needs fixing: the person using the page said no. In `onError`, return early on this code and keep it out of your error tracker. Calling `init()` again does not help: while the browser sends the signal and `honorPrivacySignals` is on, every `init()` is declined. To test your integration, use a browser with both signals off, or set `honorPrivacySignals: false` in development only. Set `honorPrivacySignals: false` only where your site has its own lawful basis to record regardless of these signals, and says so in its privacy policy. The SDK then records as it would with no signal.

**Evidence:** `signal`.

## `KUI_E_PRIVACY_CONFLICT` {#kui-e-privacy-conflict}

**Error.** Raised by the SDK before it records or sends anything. Capture did not start.

**Exit code:** `15` (usage), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** `privacyMode: "strict"` records no request or response body, and `privacy.maskNetworkBodies` is `false`, which asks for them. The SDK does not pick one of the two for you, so it recorded nothing, patched nothing and sent nothing, and the capture never started. It logs:

```text
[keploy] capture did not start: privacyMode "strict" records no request or response body, and privacy.maskNetworkBodies is false, which asks for them (KUI_E_PRIVACY_CONFLICT). Remove privacy.maskNetworkBodies, or use privacyMode "balanced".
```

**Cause:** `KeployCapture.init()` received `privacyMode: "strict"` and a `privacy` object whose `maskNetworkBodies` is `false`. A `privacy` object built from the SDK's exported `defaultPrivacyConfig()` counts: its `maskNetworkBodies` is `false`. Under `privacyMode: "balanced"` or `"off"`, `maskNetworkBodies: false` is no conflict. The conflict is in your configuration, so every visitor's capture is refused: the SDK checks for it before it checks the browser's privacy signals and before `sampleRate` applies.

**Fix:** Choose one of the two:

- To record no bodies, keep `privacyMode: "strict"` and remove `privacy.maskNetworkBodies`, or set it to `true`. Strict masks every body without it.
- To record bodies, use `privacyMode: "balanced"`, which records them after the SDK's own redaction. Balanced also records what strict replaces: the page's visible text, and query and header values. It still redacts the values it reads as credentials, and PII patterns in header values and in the page's own URL, but not PII in visible text or in a request's query values.

The SDK checks the options before it records anything, so the fix takes effect on the next `init()`.

**Evidence:** `privacyMode` (always `"strict"`), `option` (always `"privacy.maskNetworkBodies"`).

## `KUI_E_EVENT_UNSERIALISABLE` {#kui-e-event-unserialisable}

**Warning.** One `console.warn` line, for the first such event in a capture. The capture continues.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The SDK dropped one captured event because it could not be serialised to JSON: it had a cycle, a `BigInt`, or a getter that throws. The capture continues without it.

**Cause:** `evidence.eventId` and `evidence.eventType` say which event. `evidence.reason` is the message of the error `JSON.stringify` threw: its own for a cycle or a `BigInt`, or the getter's or `toJSON`'s own when one throws.

**Fix:** A `custom` event comes from your code (`KeployCaptureRecorder.emitEvent`): make its payload plain JSON, with no cycles, no `BigInt` and no throwing getters. Any other event type is the SDK's own serialisation and is a defect in the SDK: report it to Keploy.

**Evidence:** `eventId`, `eventType`, `reason`.

## `KUI_E_EVENT_OVERSIZED` {#kui-e-event-oversized}

**Warning.** One `console.warn` line, for the first such event in a capture. The capture continues.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The SDK dropped one captured event because, alone in a request body, it is over the ingest server's decoded cap (`evidence.cap` bytes), so no batch could carry it. The capture continues without it.

**Cause:** `evidence.bytes` is the size of a request body carrying only this event (its JSON plus the batch envelope), and `evidence.cap` is the server's limit on one body.

- A `dom` event this large is an rrweb full snapshot of a very large page, or one change to it as large (a subtree inserted at once). Without it, later events would name nodes the recording never showed, so the SDK holds the page's later DOM changes and interactions until a full snapshot is delivered. It retakes one at once after a dropped change, 5 seconds after a dropped snapshot and then at doubling waits up to every 60 seconds while the page is too big, and when the tab is next shown.
- A `network` event this large is a captured body under a raised `maxBodySize`.

**Fix:**

- For a `dom` event, leave the heaviest subtrees out of the snapshot with `privacy.blockSelectors`.
- For a `network` event, lower `maxBodySize` in `KeployCapture.init()` so bodies are truncated before capture.

**Evidence:** `eventId`, `eventType`, `bytes`, `cap`.

## `KUI_E_EVENT_OVERSIZED_SCRUBBING` {#kui-e-event-oversized-scrubbing}

**Warning.** One `console.warn` line, for the first such event in a capture. The capture continues.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The SDK dropped one captured event while scrubbing the page URL's credentials out of it. The scrubbed event was certain to pass the ingest server's decoded cap (`evidence.cap` bytes), so no batch could carry it, and the SDK stopped there. The capture continues without it.

**Cause:** The SDK scrubs an event only when the page's URL holds a credential (a declared route's value, a token), and it replaces each credential with `[REDACTED]`. So a short value repeated through a crafted URL makes every link rrweb resolves against that URL grow. The SDK measures the event as it scrubs it, and stops as soon as the event is certain to stay over the cap even after later replacements shrink it, rather than spend the page's time and memory on an event it could never send. `evidence.atLeast` is how many characters the scrubbed event was certain to reach when the SDK stopped: a lower bound on its size in a body, which is larger.

The SDK then holds the page's later DOM changes and interactions until a full snapshot is sent again. It retakes one at once after a dropped change, 5 seconds after a dropped snapshot and then at doubling waits up to every 60 seconds until one is delivered, or when the tab is next shown.

**Fix:** Apart from a crafted URL, a `dom` event this large is an rrweb full snapshot of a very large page: leave the heaviest subtrees out of the snapshot with `privacy.blockSelectors`.

**Evidence:** `eventType`, `atLeast`, `cap`. The event has no id, because it never reached the SDK's queue.

## `KUI_E_NAVIGATION_UNWRAPPED` {#kui-e-navigation-unwrapped}

**Warning.** One `console.warn` line per capture. Nothing is dropped, and the capture continues.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** To record route changes, and which history traversals the page's own script asked for, the SDK puts wrappers in place of `history.pushState`, `replaceState`, `back`, `forward` and `go`, and, where the browser has the Navigation API, of `navigation.back`, `forward` and `traverseTo`. It wraps all of them or none. The page had made the method that `evidence.method` names impossible to replace and put back, so the SDK wrapped none of them:

```text
[keploy] KUI_E_NAVIGATION_UNWRAPPED: the page made a History or Navigation API method impossible to replace and put back, so the SDK wrapped none of them. The capture continues: route changes are still recorded, with less detail, and none says that the page's script asked for it. evidence={"method":"history.back"}
```

Route changes are still recorded, from the page's navigation events, with less detail:

- No traversal carries `initiator: "script"`. Where the browser has the Navigation API, only `userInitiated` is left to tell an in-app Back button that calls `history.back()` from the browser's Back, and WebKit reports `userInitiated: true` for a `history.back()` called from a click handler. Where it does not, nothing tells them apart.
- Where the browser has the Navigation API, a `pushState` or `replaceState` to a fragment is recorded as a `hash` change.
- Where it does not, a `pushState` or `replaceState` is found only at the next recorded event, and is recorded as a `push`, or as a `traverse` when that event comes during a `popstate` or `hashchange` dispatch. Two of them before that event are recorded as one, and a credential the page put into its URL and removed again before that event is not collected, so the SDK does not scrub it as that value: a link on the page that still carries it keeps it unless its name or shape marks it as a credential, such as a `token` query parameter or a JWT.

**Cause:** Code on the page that ran before `init()` locked a method the SDK wraps. Either it defined the method as an own property that is neither writable nor configurable, or it made `history` or `navigation` itself take no new property (`Object.freeze`, `Object.seal` or `Object.preventExtensions` on it), so the SDK cannot put an own property in place of a method the object inherits.

**Fix:** Find the page code that locks that method, or `history` or `navigation`, and remove it, so that they are replaceable whenever `init()` runs. Then reload the page.

**Evidence:** `method`: the method the SDK could not replace, as `history.<name>` or `navigation.<name>`. When several are locked, it is the first in this order: `history.pushState`, `replaceState`, `back`, `forward`, `go`, then `navigation.back`, `forward`, `traverseTo`.

## `KUI_E_REQUEST_TERM_FAILED` {#kui-e-request-term-failed}

**Warning.** One `console.warn` line, for the first such request in a capture. Nothing is dropped, the page's request is not affected, and the capture continues.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** With every request, the SDK records a term computed from the raw request body: for a GraphQL request sent in the body, its operation name and an id of its document (`pq` for a persisted query), which replay uses to tell apart GraphQL operations sent to the same URL. For one request it could not compute the term, and it recorded the request anyway:

```text
[keploy] KUI_E_REQUEST_TERM_FAILED: recorded a request without its term, or body:*: computing it failed; the request itself was not affected. The capture continues; any further such requests in this capture are recorded that way, silently. evidence={"method":"POST","reason":"RangeError: Maximum call stack size exceeded"}
```

- If computing the term threw, the request is recorded without a term, as an SDK older than the term records it.
- If the code that computes it did not load, the request is recorded with the term `body:*`, which means unknown. That code is a separate chunk, which the SDK loads the first time a body could be a GraphQL request. The SDK does not retry the load for the life of the page, so every later such request on that page is recorded `body:*` too.

Replay then cannot tell this request's GraphQL operation from that of another request sent with the same method and URL, unless that other request was recorded with its own term; requests recorded this way are answered in the order they were recorded.

**Cause:** `evidence.reason` is the name and message of what threw, or of the failed load. `evidence.method` is the request's method.

- The chunk did not load: a Content-Security-Policy blocked it, the page was offline when the SDK first asked for it, or your deployment does not serve the chunk your bundler emitted beside the SDK. The SDK imports it by the bare specifier `@keploy/capture-sdk/request-term`, which your bundler resolves through the package's `exports` map, as it resolves `rrweb`.
- Computing the term threw. Usually either the SDK's own GraphQL lexer or parser threw, which is a defect in the SDK in this browser, or the page's `crypto` did, which comes from the page's environment: a page whose `crypto` getter or `crypto.subtle.digest` throws or rejects, for example because the page replaced it.

A page with no `SubtleCrypto` at all, such as one served over plain HTTP from a host other than `localhost` or a loopback address (`127.0.0.1`, `[::1]`), cannot hash a GraphQL document, so it records such a request `body:*` without this warning. A persisted query needs no hash and is recorded with its term there too.

**Fix:**

- For a chunk that did not load, let the page load it: allow it in your Content-Security-Policy, and deploy it with the rest of your build. With no bundler, map `@keploy/capture-sdk/request-term` to the package's `dist/request-term.mjs` in your import map, as you map `rrweb`. Then reload the page: the SDK does not retry the load on a page where it failed.
- For a throw of the SDK's lexer or parser, report it to Keploy with `evidence.reason`, the SDK version and the browser.
- For a throw of the page's `crypto`, find the page code that replaces `crypto` or `crypto.subtle.digest`.

**Evidence:** `method`, `reason`.

## `KUI_E_BODY_WORKER_UNAVAILABLE` {#kui-e-body-worker-unavailable}

**Warning.** One `console.warn` line per page, at the first failure. The page's requests are not affected, and the capture continues.

**Exit code:** `12` (nothing-matched), as UI Capture's error list gives it. The SDK runs in the page, so it never exits a process itself.

**What happened:** The SDK redacts request and response bodies in a Web Worker, `dist/body-worker.js`, so that redaction does not run on your page's main thread. It also loads the same redaction code for the main thread, `dist/body-redact.mjs`, for the moments that cannot wait for the worker, such as the page being left. It loads both once per page, soon after a capture that records bodies starts. On this page one of the two could not be loaded or run:

```text
[keploy] KUI_E_BODY_WORKER_UNAVAILABLE: could not run the body worker or load the body chunk (evidence.part): without the worker, a body over 64 KiB is recorded cut; without the chunk, a body the main thread must redact is recorded with nothing kept; replay reports a test over a cut body unproven. Allow worker-src 'self' in the page's CSP, use a bundler that emits the worker (or copy dist/body-worker.js beside the bundle), serve it from the page's origin, or serve the SDK's dist/ as it is. Said once per page. evidence={"part":"worker","reason":"the worker's script did not load or run (refused by the page's CSP, a 404, or a script that does not parse)"}
```

The SDK redacts bodies on the main thread instead:

- Without the worker, a body of 64 KiB or less is redacted and recorded as before. A body over 64 KiB is recorded **cut**: under a first line `[Body cut: K of N characters kept, unverified]`, where N is the body's length, only its first K characters are redacted and kept.
- Without the main thread's code, a body the main thread must redact is recorded as that line alone, with nothing kept: `[Body cut: 0 of N characters kept, unverified]`. When the worker is missing too, that is every body; otherwise, only a body still in the worker when the page is left or the capture stops.

A cut response body is not the response your server sent, so replay never serves it as one. Replay answers the request as a failed request, and reports a test that reaches it as `unproven`. A cut request body does not change replay.

A capture that masks every body, under `privacyMode: "strict"` or with `privacy.maskNetworkBodies: true`, loads neither part and never raises this warning.

**Cause:** `evidence.part` says which part failed, and `evidence.reason` what the browser said. The SDK writes the line once per page, for the first part that failed, so when both fail it names only one: after you fix it and reload, the line names the other.

- `worker`: the worker did not start, or its script failed to load or run. The common causes:
  - The page's Content-Security-Policy does not allow a worker from your origin: no `worker-src 'self'`, and no `child-src` or `script-src` it falls back to that allows it.
  - Your bundler does not emit the worker. webpack 4 cannot, and esbuild does not unless you copy the file.
  - The worker is served from another origin. A browser runs a worker only from the page's own origin, so it cannot run one from a build whose assets come from a CDN (webpack's `publicPath`, Next.js's `assetPrefix`), or from the SDK's own files loaded from a CDN without a bundler.
- `code`: the main thread's code did not load. With no bundler, the page serves `dist/index.mjs` without `dist/body-redact.mjs` beside it; or a Content-Security-Policy, a 404 or a network failure blocked it.

A page that loads the SDK from unpkg's package root with `?module` gets the `module` field's build, `dist/index.bundler.mjs`, and unpkg rewrites the SDK's import of its own chunks to the `@latest` version's files, which are another version's whenever the page does not load the latest. The SDK refuses a chunk of another version, and that build has no file beside it to fall back to, so it records every body with nothing kept. Import `dist/index.mjs` instead, as [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](#kui-e-strict-attributes-unavailable) describes. From a CDN the worker still cannot run, because a browser runs a worker only from the page's own origin: to clear this warning, serve `dist/` from your own origin.

While the browser is offline, the SDK does not ask for either part, unless a service worker controls the page. It waits until the browser is back online, so starting offline does not by itself raise this warning.

**Fix:**

- Allow the worker in your Content-Security-Policy: `worker-src 'self'`.
- Use a bundler that emits it from `new Worker(new URL("./body-worker.js", import.meta.url))`: webpack 5, Vite, Parcel 2, or Next.js with webpack or Turbopack. Under webpack 4, upgrade. Under esbuild, copy `node_modules/@keploy/capture-sdk/dist/body-worker.js` beside your bundle.
- Serve the worker from the page's own origin.
- With no bundler, serve the package's `dist/` as it is, from the page's own origin, and import `dist/index.mjs` from it. The SDK loads `dist/body-redact.mjs`, and `dist/body-worker-unbundled.mjs`, which starts `dist/body-worker.js`, from beside `dist/index.mjs`. An import map that maps `@keploy/capture-sdk/body-redact` and `@keploy/capture-sdk/body-worker-start` is used first.

Then reload the page. The SDK does not retry a load that failed while the page was online.

**Evidence:** `part`, `reason`.

## Handle errors from the Keploy UI tools

The `keploy ui` commands, the replay engine that `keploy ui run` drives, and the UI Capture tools an AI agent calls name every failure with a `KUI_E_` code too. A tool error carries:

- `code`: the code. Branch on `code` and on the exit code, never on the message.
- `severity`: `fatal`, `error` or `warning`.
- `summary`: one line that says what happened.
- `evidence`: the fields listed under **Evidence** in the code's section below.
- `remedy`: `{command, manual, alternatives, autofixable, docs}`. `docs` links to the code's section on this page.
- `retryable` and `retryAfterMs`.

How to act on one, as a person or as an AI agent:

1. **Run `remedy.command` only when it is not `null`.** Replace each `<placeholder>` in it with the evidence field of that name. Run it unattended only when `remedy.autofixable` is `true`. When `command` is `null`, no command fixes the error: `manual` and the code's section below say what to do. `alternatives` lists other ways to address the same need: a command, or for [`KUI_E_REFUSED_BY_DESIGN`](#kui-e-refused-by-design) the step to take instead, in words.
2. **Retry only when `retryable` is `true`,** and wait `retryAfterMs` first. Only a transport failure is retryable: retrying a verdict is how a broken thing reports success.
3. **Read the exit code before you read a run as a test result.** Only `0` and `1` are results of a run. Every other code means nothing, or nothing trustworthy, was measured.
4. **A code marked reserved is not raised by any current build.** It documents a check that is designed but not wired yet. Do not wait for it or branch on it.

A remedy names only these commands of the keploy binary: `keploy login` with `--no-wait`, `--json` and `--finish`, `keploy ui --help`, and `keploy ui run`, which needs `--app` and `--base-url` and also takes `--suite`, `--plan`, `--repo` and `--out`. Any other command a remedy names, such as `npx playwright test`, is not the binary's.

### Exit codes

| Exit code | Name              | Meaning                                                                                                 |
| --------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| `0`       | pass              | Every flow in scope was proven, and none regressed.                                                     |
| `1`       | findings          | At least one flow differed from its recording.                                                          |
| `5`       | sign-in-required  | No signed-in session or API key could be used. Nothing ran, and nothing was measured.                   |
| `10`      | nondeterministic  | The run did not reproduce, so its result is not trustworthy.                                            |
| `11`      | blocked-env       | The environment prevented the run. Nothing was measured.                                                |
| `12`      | nothing-matched   | A flow in scope had no recording to compare against, or the selection matched none. Nothing was proven. |
| `13`      | refused-by-policy | The requested verb does not exist, by design.                                                           |
| `14`      | needs-a-human     | The answer is unproven, and must not be guessed.                                                        |
| `15`      | usage             | The invocation was malformed.                                                                           |

`5` is the keploy binary's own exit code for a missing sign-in, shared with UI Capture.

### Codes from the Keploy UI tools

| Code                                                                | Exit | Raised when                                                                   |
| ------------------------------------------------------------------- | ---- | ----------------------------------------------------------------------------- |
| [`KUI_E_SIGN_IN_REQUIRED`](#kui-e-sign-in-required)                 | `5`  | No signed-in session or API key could be used.                                |
| [`KUI_E_SERVER_UNREACHABLE`](#kui-e-server-unreachable)             | `11` | The Keploy UI Capture server did not answer.                                  |
| [`KUI_E_SERVER_REJECTED`](#kui-e-server-rejected)                   | `11` | The server answered and refused the request.                                  |
| [`KUI_E_BROWSER_MISSING`](#kui-e-browser-missing)                   | `11` | No browser binary was found. Reserved.                                        |
| [`KUI_E_TEST_NOT_EXECUTED`](#kui-e-test-not-executed)               | `11` | Playwright reported a generated test as skipped.                              |
| [`KUI_E_NODE_BELOW_FLOOR`](#kui-e-node-below-floor)                 | `11` | This Node.js cannot load the replay runtime.                                  |
| [`KUI_E_RUNTIME_PATH_REFUSED`](#kui-e-runtime-path-refused)         | `11` | A path the replay runtime goes to holds something the engine did not write.   |
| [`KUI_E_ENV_NOT_READY`](#kui-e-env-not-ready)                       | `11` | One or more environment checks did not pass.                                  |
| [`KUI_E_IMAGE_DIGEST_MISMATCH`](#kui-e-image-digest-mismatch)       | `11` | The container image is not the one the baselines were captured in. Reserved.  |
| [`KUI_E_NOT_IMPLEMENTED`](#kui-e-not-implemented)                   | `11` | The capability is designed but not built in this build.                       |
| [`KUI_E_TOOL_FAILED`](#kui-e-tool-failed)                           | `11` | The tool threw before it produced a result.                                   |
| [`KUI_E_NO_FLOWS_MATCHED`](#kui-e-no-flows-matched)                 | `12` | The selection matched no flows.                                               |
| [`KUI_E_CATALOGUE_TOO_LARGE`](#kui-e-catalogue-too-large)           | `12` | The flow catalogue is larger than the client reads in one pass.               |
| [`KUI_E_REFUSED_BY_DESIGN`](#kui-e-refused-by-design)               | `13` | The requested verb does not exist, by design.                                 |
| [`KUI_E_FIELD_NAME_DRIFT`](#kui-e-field-name-drift)                 | `14` | A producer and a consumer disagree about a field name.                        |
| [`KUI_E_VERDICT_DOCUMENT_REFUSED`](#kui-e-verdict-document-refused) | `14` | The engine built a verdict document the contract refuses.                     |
| [`KUI_E_UNKNOWN_VERDICT`](#kui-e-unknown-verdict)                   | `14` | A result carried a verdict outside the closed set.                            |
| [`KUI_E_COUNTS_DO_NOT_SUM`](#kui-e-counts-do-not-sum)               | `14` | A verdict document's counts do not add up to its total. Reserved.             |
| [`KUI_E_ENVELOPE_OVERFLOW`](#kui-e-envelope-overflow)               | `14` | A tool response was over its byte budget, with nowhere to spill the rest.     |
| [`KUI_E_ENVELOPE_INVALID`](#kui-e-envelope-invalid)                 | `14` | A tool response could not be rendered as a valid envelope.                    |
| [`KUI_E_ARTIFACT_INLINE_IMAGE`](#kui-e-artifact-inline-image)       | `14` | An image was put inside a tool response instead of referenced by path.        |
| [`KUI_E_DETERMINISM_CERT_STALE`](#kui-e-determinism-cert-stale)     | `14` | A determinism certificate no longer matches its recording. Reserved.          |
| [`KUI_E_NOISE_FLOOR_UNMEASURED`](#kui-e-noise-floor-unmeasured)     | `14` | A comparison was asked for with no measured noise floor. Reserved.            |
| [`KUI_E_SENSITIVITY_BELOW_NOISE`](#kui-e-sensitivity-below-noise)   | `14` | The smallest difference the run would report is inside the noise. Reserved.   |
| [`KUI_E_NEEDS_HUMAN`](#kui-e-needs-human)                           | `14` | The answer needs a decision the tool will not make on its own. Reserved.      |
| [`KUI_E_NONDETERMINISTIC_RUN`](#kui-e-nondeterministic-run)         | `10` | Repeated runs over unchanged inputs gave different results. Reserved.         |
| [`KUI_E_MOCK_UNMATCHED_REQUEST`](#kui-e-mock-unmatched-request)     | `1`  | The app made a request during replay that has no recorded exchange. Reserved. |
| [`KUI_E_SCHEMA_DRIFT`](#kui-e-schema-drift)                         | `1`  | A committed generated contract file differs from what its source generates.   |
| [`KUI_E_UNKNOWN_TOOL`](#kui-e-unknown-tool)                         | `15` | No tool has that name.                                                        |
| [`KUI_E_TOOL_NOT_AVAILABLE`](#kui-e-tool-not-available)             | `15` | The tool is in the contract but not wired in this build.                      |
| [`KUI_E_INVALID_INPUT`](#kui-e-invalid-input)                       | `15` | The arguments do not match the tool's schema.                                 |
| [`KUI_E_ENGINE_INPUT_INVALID`](#kui-e-engine-input-invalid)         | `15` | What the engine was given is not what the Keploy API server serves.           |
| [`KUI_E_USAGE`](#kui-e-usage)                                       | `15` | The invocation was malformed.                                                 |

## `KUI_E_SIGN_IN_REQUIRED` {#kui-e-sign-in-required}

**Fatal error.** The keploy binary could not use a signed-in session or an API key.

**Exit code:** `5` (sign-in-required). Nothing ran, and nothing was measured.

**What happened:** The command needs a Keploy account, and no signed-in session or API key could be used, so it stopped before it did anything. This is a fact about the credentials, not about the app under test.

**Cause:** The binary found no signed-in session it could use, and no usable API key in `KEPLOY_API_KEY`: you have not signed in on this machine, or the session or the key is no longer accepted.

**Fix:** Sign in, then run the command again:

1. Run `keploy login --no-wait --json`. It prints a link and a code, and exits without waiting.
2. A person opens the link and approves the code.
3. Run `keploy login --finish` to collect the session.

An AI agent runs step 1, hands the link and the code to its user, and runs step 3 once the user says the code is approved. In CI, or anywhere no person can approve a code, set `KEPLOY_API_KEY` to an API key instead.

**Evidence:** `message`, which says what the binary found.

## `KUI_E_SERVER_UNREACHABLE` {#kui-e-server-unreachable}

**Error, retryable.** A tool could not reach the Keploy UI Capture server.

**Exit code:** `11` (blocked-env). Nothing was measured.

**What happened:** The Keploy UI Capture server did not answer, so no flows could be read.

**Cause:** The server is down, or `url` is not the address it listens on, or the network between the tool and the server dropped the request. The tool tried `attempts` times, and `lastError` is the last failure it saw.

**Fix:** Confirm the server is up, and that `url` is the address it listens on. This is the one tool error that is retryable: wait `retryAfterMs` (2000 ms) and try again. If the server is really unavailable, work from the last captured flows on disk instead of the API.

**Evidence:** `url`, `attempts`, `lastError`.

## `KUI_E_SERVER_REJECTED` {#kui-e-server-rejected}

**Error.** The server answered, and refused the request.

**Exit code:** `11` (blocked-env). Nothing was measured.

**What happened:** The server is reachable, but it did not accept the request or its credentials.

**Cause:** `status` says which:

- `401` or `403`: the credentials were missing or not accepted.
- `404`: the path or the id does not exist.
- `301`, `302`, `303`, `307` or `308`: the server redirected. The tool never follows a redirect, so your API key is never sent to another origin. `lastError` names the origin it pointed at.
- Any other status below `500`, or `200` with an error in the body: the server refused this request. `lastError` carries its message.

**Fix:** Retrying changes none of these. By `status`:

- `401` or `403`: for the keploy binary, sign in again with `keploy login --no-wait --json` and, once a person approves the code it prints, `keploy login --finish`; or set `KEPLOY_API_KEY` to an API key. For a tool that reads `.keploy-ui/config.json`, set `apiKey` there.
- `404`: check the id or the path you asked for.
- A redirect: if the origin in `lastError` is your Keploy UI Capture server, set `server` to it in `.keploy-ui/config.json`.
- Any other: read `lastError`, and correct the request it names.

**Evidence:** `url`, `status`, `lastError`.

## `KUI_E_BROWSER_MISSING` {#kui-e-browser-missing}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `11` (blocked-env). The run never started, so nothing was measured.

**What happened:** No browser binary was found, so the run never started. This is a gap in the environment, not a test result.

**Cause:** The browser Playwright expects, `browser`, is not installed in any of `searchedPaths`.

**Fix:** Run `npx playwright install --with-deps <browser>`, with `<browser>` from the evidence. This remedy is `autofixable`: an agent may run it unattended. Or run inside the pinned container image, so the browser and its fonts are the ones the recording was made against.

**Evidence:** `browser`, `searchedPaths`.

## `KUI_E_TEST_NOT_EXECUTED` {#kui-e-test-not-executed}

**Error.** Playwright reported a generated test as skipped.

**Exit code:** `11` (blocked-env). Nothing was measured for this flow.

**What happened:** The recording exists, and its test did not run. The flow's verdict is `blocked`: not `uncovered`, and not `passed`.

**Cause:** A generated suite never skips its own tests. Something outside it stopped this one: a project filter, a `--grep` pattern, or a `fixme`.

**Fix:** Remove the filter, the grep or the fixme that excluded `testId`, then run the suite again with `npx playwright test`.

**Evidence:** `flowId`, `testId`, `playwrightStatus`.

## `KUI_E_NODE_BELOW_FLOOR` {#kui-e-node-below-floor}

**Fatal error.** This Node.js cannot load the replay runtime.

**Exit code:** `11` (blocked-env). The run never started, so nothing was measured.

**What happened:** The replay engine checked the Node.js version before the run and stopped. This is a gap in the environment, not a test result.

**Cause:** The replay runtime is an ES module that the engine loads from CommonJS, and only some Node.js versions do that without a flag. `found` is the version that ran, and `required` the floor.

**Fix:** Run on a Node.js that loads an ES module from CommonJS without a flag: 20.19 or later on Node 20, 22.12 or later on Node 22, or any version from 23.

**Evidence:** `found`, `required`.

## `KUI_E_RUNTIME_PATH_REFUSED` {#kui-e-runtime-path-refused}

**Fatal error.** A path the replay runtime goes to holds something the engine did not write.

**Exit code:** `11` (blocked-env). Nothing was changed, nothing ran, and nothing was measured.

**What happened:** Before it installs the replay runtime, the engine checks every path it would write. One of them holds something it did not write, so it stopped.

**Cause:** `path` names it, and `reason` says why it was refused.

**Fix:** Move or remove `path`, or run the suite from a directory that does not hold it. The engine never deletes what it did not write.

**Evidence:** `path`, `reason`.

## `KUI_E_ENV_NOT_READY` {#kui-e-env-not-ready}

**Fatal error.** One or more environment checks did not pass.

**Exit code:** `11` (blocked-env). Nothing can be measured here until they pass.

**What happened:** The tool checked the environment, and at least one check failed. The diagnosis is complete: each check's result is in the evidence.

**Cause:** `failing` names the checks that failed. `checks` holds every check: what it probed, its result, and its own remedy.

**Fix:** Fix each failing check by its own remedy in `checks`, then run again what you were doing. Do not run the diagnosis again first: it is already complete, so repeating it changes nothing.

**Evidence:** `failing`, `checks`, and `wroteConfig` and `setupSteps` when the tool that raised it knows them.

## `KUI_E_IMAGE_DIGEST_MISMATCH` {#kui-e-image-digest-mismatch}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `11` (blocked-env). Nothing was measured.

**What happened:** The container image is not the one the baselines were captured in, so screenshots are not comparable. Measured on an unpinned font stack, the divergence between a host and a container was 21.4%.

**Cause:** The run is in an image with the digest `actualDigest`, and the baseline at `baselinePath` was captured in `expectedDigest`.

**Fix:** Run in the pinned image, with `<expectedDigest>` from the evidence:

```bash
docker run --rm -e KEPLOY_UI_IMAGE_DIGEST=<expectedDigest> -v "$PWD:/w" -w /w mcr.microsoft.com/playwright@<expectedDigest> npx playwright test
```

Do not record again in the wrong image. Screenshot drift between images comes from fonts and is deterministic, so a new recording there replaces a difference you can detect with a permanent one.

**Evidence:** `expectedDigest`, `actualDigest`, `baselinePath`.

## `KUI_E_NOT_IMPLEMENTED` {#kui-e-not-implemented}

**Error.** That capability is designed, but not built in this build.

**Exit code:** `11` (blocked-env). Nothing ran, and nothing was measured.

**What happened:** You asked for a capability this build does not have, so the tool stopped without doing anything. The non-zero exit is not a test failure.

**Cause:** `capability` names what you asked for, and `available` lists what this build has.

**Fix:** Use a capability this build has: `available` lists them, and `keploy ui --help` lists the `keploy ui` commands. A command that is not built yet is hidden from that list, so it never sends you to one.

**Evidence:** `capability`, `available`.

## `KUI_E_TOOL_FAILED` {#kui-e-tool-failed}

**Error.** The tool threw before it produced a result.

**Exit code:** `11` (blocked-env). Nothing was measured, so this is not a finding about the code under test.

**What happened:** The tool raised an exception and stopped.

**Cause:** `message` says what failed.

**Fix:** Fix what `message` names, then run the tool again. If `message` points at the tool itself, not at your environment or your input, report it to Keploy with the message.

**Evidence:** `message`.

## `KUI_E_NO_FLOWS_MATCHED` {#kui-e-no-flows-matched}

**Warning.** The selection matched no flows.

**Exit code:** `12` (nothing-matched). Nothing was measured.

**What happened:** The flows you selected do not exist, so nothing was compared. This is a fact about the invocation, not about the software. Nothing was proven for the scope you asked for, which is not the same as nothing being wrong.

**Cause:** `selector` is what you asked for. `available` is what was actually captured.

**Fix:** Select again from the ids in `available`.

**Evidence:** `selector`, `available`.

## `KUI_E_CATALOGUE_TOO_LARGE` {#kui-e-catalogue-too-large}

**Error.** The flow catalogue is larger than the client reads in one pass.

**Exit code:** `12` (nothing-matched). Nothing was measured.

**What happened:** The client filters flows itself, after it reads them, and it reads at most `cap` of them. The catalogue holds more (`total`), so no filtered answer over it can be trusted, and the tool gave none.

**Cause:** The flows endpoint offers no filtering, so the filter runs in the client over a partial read.

**Fix:** Narrow what is recorded, so the catalogue is under `cap`. Paging cannot help: every page would still be selected from a partial read.

**Evidence:** `total`, `cap`.

## `KUI_E_REFUSED_BY_DESIGN` {#kui-e-refused-by-design}

**Fatal error.** The requested verb does not exist in this product, by design.

**Exit code:** `13` (refused-by-policy).

**What happened:** You asked for a verb such as `retry`, `heal`, `update-snapshots`, `set-tolerance` or `quarantine`. Each one would let a broken thing report success, so the product does not have it. This is a refusal, not a missing feature.

**Cause:** `verb` is the verb, `requestedAs` the spelling you used, and `reason` what the verb would have hidden.

**Fix:** Do what the verb's entry in [Verbs UI Capture refuses](refusals.md) says instead. Each one measures the thing the refused verb would have hidden.

**Evidence:** `verb`, `requestedAs`, `reason`.

## `KUI_E_FIELD_NAME_DRIFT` {#kui-e-field-name-drift}

**Fatal error.** A producer and a consumer disagree about a field name.

**Exit code:** `14` (needs-a-human).

**What happened:** A tool's result does not match the shape the contract declares for it, so a caller reading the declared field names would silently get nothing. The tool refused to return it.

**Cause:** One side spelled a field name by hand instead of reading it from the contract. `consumer` and `producer` name the two sides, `field` the field, and `expected` and `actual` the two names.

**Fix:** This is a defect in the tool that raised it, not in your app or your input: report the evidence to Keploy, and do not work around the missing field. When you build on the contract yourself, read the field names from `@keploy/contract` and its generated schemas, and generate both sides from it.

**Evidence:** `consumer`, `producer`, `field`, `expected`, `actual`.

## `KUI_E_VERDICT_DOCUMENT_REFUSED` {#kui-e-verdict-document-refused}

**Fatal error.** The engine built a verdict document the contract refuses, and wrote none.

**Exit code:** `14` (needs-a-human).

**What happened:** The engine ran the tests, then built a verdict document that breaks the contract's rules, so it wrote no document at all.

**Cause:** A bug in the engine, not a finding about your app. `issues` names each rule the document broke.

**Fix:** Report `issues` to Keploy. To see how the tests went in the meantime, read the Playwright report.

**Evidence:** `issues`.

## `KUI_E_UNKNOWN_VERDICT` {#kui-e-unknown-verdict}

**Fatal error.** A result carried a verdict outside the closed set.

**Exit code:** `14` (needs-a-human).

**What happened:** A result named a verdict the contract does not have. An unknown verdict is never read as a pass, so the tool refused the result.

**Cause:** The producer named in `source` sent `value`, which is not one of `allowed`.

**Fix:** Map the producer's status onto a verdict in `allowed`. Adding a verdict means changing `@keploy/contract`, not the producer. If a Keploy tool produced it, report the evidence to Keploy.

**Evidence:** `value`, `allowed`, `source`.

## `KUI_E_COUNTS_DO_NOT_SUM` {#kui-e-counts-do-not-sum}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `14` (needs-a-human).

**What happened:** A verdict document's per-verdict counts do not add up to its total, so at least one result is unaccounted for, and could be hiding a failure.

**Cause:** The producer counted by hand and got it wrong. `buckets` are its counts, `summed` their sum, and `total` the total it claimed, for run `runId`.

**Fix:** The document is wrong at its source. Fix the producer to count with `tallyVerdicts()` from `@keploy/contract`, not by hand.

**Evidence:** `total`, `summed`, `buckets`, `runId`.

## `KUI_E_ENVELOPE_OVERFLOW` {#kui-e-envelope-overflow}

**Fatal error.** A tool response was over its byte budget, with nowhere to put the rest.

**Exit code:** `14` (needs-a-human).

**What happened:** The response was `bytes` long, over `limitBytes`, and the tool could not bring it under the budget without dropping fields, so it sent nothing.

**Cause:** `spillAvailable` says which:

- `false`: the tool was given no artifact sink, so the oversized content had nowhere to go.
- `true`: the tool already moved every field it can move into artifact files (the data, the error's evidence, the warnings, the next steps and the artifact list), and what is left is still over `limitBytes`.

**Fix:** By `spillAvailable`:

- `false`: give the renderer an artifact sink, so oversized content becomes a file path instead of filling the budget. Set `KEPLOY_UI_ARTIFACT_DIR` to choose where those files go.
- `true`: no setting changes this, and retrying gives the same result. Report the evidence to Keploy.

**Evidence:** `bytes`, `limitBytes`, `spillAvailable`.

## `KUI_E_ENVELOPE_INVALID` {#kui-e-envelope-invalid}

**Fatal error.** A tool response could not be rendered as a valid envelope.

**Exit code:** `14` (needs-a-human).

**What happened:** The tool handed the renderer something the contract refuses, so nothing was sent.

**Cause:** `field` names the part of the response that is wrong, and `problem` says how.

**Fix:** Pass `data: null` instead of leaving the payload key out, and set `ok: false` exactly when an error is attached. If a Keploy tool raised it, report the evidence to Keploy.

**Evidence:** `field`, `problem`.

## `KUI_E_ARTIFACT_INLINE_IMAGE` {#kui-e-artifact-inline-image}

**Fatal error.** An image was put inside a tool response instead of referenced by path.

**Exit code:** `14` (needs-a-human).

**What happened:** The tool refused to send a response with an image inside it. A screenshot costs 1,000 to 1,800 input tokens, and a model is a poor judge of pixel differences.

**Cause:** `field` holds an image of `bytes` bytes, of type `mediaType`.

**Fix:** Write the image to the artifact directory, and reference its path in `artifacts[]`.

**Evidence:** `field`, `bytes`, `mediaType`.

## `KUI_E_DETERMINISM_CERT_STALE` {#kui-e-determinism-cert-stale}

**Error. Reserved:** no current build raises it.

**Exit code:** `14` (needs-a-human).

**What happened:** The determinism certificate no longer matches the recording it certifies, so a pass would rest on evidence about different bytes.

**Cause:** The certificate at `certificatePath` predates the current recording. `certificateSha256` and `recordingSha256` are the two digests.

**Fix:** Record the flow again, or treat the result as unproven. Never read a stale certificate as a pass.

**Evidence:** `flowId`, `certificatePath`, `certificateSha256`, `recordingSha256`.

## `KUI_E_NOISE_FLOOR_UNMEASURED` {#kui-e-noise-floor-unmeasured}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `14` (needs-a-human).

**What happened:** A comparison was asked for with no measured noise floor for this environment. Every threshold lets some real regressions pass, so an assumed one is refused.

**Cause:** No noise floor has been measured for `metric` in `environment`, so any tolerance would be a guess.

**Fix:** Run the same flow several times against an unchanged build, and take the spread you observe as the floor.

**Evidence:** `metric`, `environment`.

## `KUI_E_SENSITIVITY_BELOW_NOISE` {#kui-e-sensitivity-below-noise}

**Error. Reserved:** no current build raises it.

**Exit code:** `14` (needs-a-human).

**What happened:** The smallest difference this run would report is inside the measured noise floor, so a pass would prove nothing, and the threshold fires on runs where nothing changed.

**Cause:** The threshold sits below the measured noise. `signal`, `noise` and `ratio` are the measured figures.

**Fix:** Reduce the noise: pin the fonts, turn off animation, and pin the container digest. Do not widen what counts as a match.

**Evidence:** `flowId`, `signal`, `noise`, `ratio`.

## `KUI_E_NEEDS_HUMAN` {#kui-e-needs-human}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `14` (needs-a-human).

**What happened:** The honest answer needs a decision the tool will not make on its own. Guessing it is the failure this code prevents.

**Cause:** `question` is the decision, and `context` what the tool knows about it, for run `runId`.

**Fix:** A person decides. An AI agent hands `question` and `context` to its user and does not invent an answer.

**Evidence:** `question`, `context`, `runId`.

## `KUI_E_NONDETERMINISTIC_RUN` {#kui-e-nondeterministic-run}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `10` (nondeterministic). The result is not trustworthy.

**What happened:** Two runs of the same recording, over unchanged inputs, gave different results. The harness cannot tell you whether the software changed.

**Cause:** Something the recording does not pin changed between the runs. `runs`, `divergentAt` and `artifacts` describe the runs and where they diverged.

**Fix:** Pin the input that varies in the recording: the clock, a random seed, an animation, or worker scheduling. Do not retry: a retry that goes green has deleted the finding, not resolved it.

**Evidence:** `flowId`, `runs`, `divergentAt`, `artifacts`.

## `KUI_E_MOCK_UNMATCHED_REQUEST` {#kui-e-mock-unmatched-request}

**Fatal error. Reserved:** no current build raises it.

**Exit code:** `1` (findings).

**What happened:** During replay, the app made a request that has no recorded exchange, so it was denied instead of sent to the real network.

**Cause:** The replayed page asked for something the recording never saw. `key` is the exact key it looked for; `url`, `method` and `nearest` describe the request and the recorded exchanges it was matched against.

**Fix:** Record the flow again, so the new call is captured. Nothing reaches the real network during replay, by design, so letting the request through is not an option.

**Evidence:** `flowId`, `key`, `url`, `method`, `nearest`.

## `KUI_E_SCHEMA_DRIFT` {#kui-e-schema-drift}

**Fatal error.** A committed generated contract file differs from what its source generates.

**Exit code:** `1` (findings). Here the finding is the drift.

**What happened:** The UI Capture contract's code generator check found that `artifact` is not what the contract source generates now, so the schema and its consumers have diverged. You meet this code only when you build UI Capture from its source.

**Cause:** The contract source changed and the generated files were not regenerated, or a generated file was edited by hand. `committedSha256` and `generatedSha256` are the two versions.

**Fix:** Regenerate the files, review the change, and commit it:

```bash
pnpm --filter @keploy/contract run codegen && git diff -- packages/contract/generated
```

**Evidence:** `artifact`, `committedSha256`, `generatedSha256`.

## `KUI_E_UNKNOWN_TOOL` {#kui-e-unknown-tool}

**Error.** No tool has that name.

**Exit code:** `15` (usage). Nothing ran.

**What happened:** An agent called a tool that does not exist.

**Cause:** `requested` is the name it called. `available` lists the names it can call.

**Fix:** Call one of the tools in `available`.

**Evidence:** `requested`, `available`.

## `KUI_E_TOOL_NOT_AVAILABLE` {#kui-e-tool-not-available}

**Error.** The tool is in the contract, but not wired in this build.

**Exit code:** `15` (usage). Nothing ran.

**What happened:** An agent called a tool this build does not provide. It is not a transient failure.

**Cause:** `requested` is part of the contract, and this build has no handler for it. `available` lists the tools it has.

**Fix:** Pick a tool from `available`. Do not retry: nothing the caller does makes this tool work in this build.

**Evidence:** `requested`, `available`.

## `KUI_E_INVALID_INPUT` {#kui-e-invalid-input}

**Error.** The arguments do not match the tool's schema.

**Exit code:** `15` (usage). Nothing ran.

**What happened:** The tool refused its input before it ran.

**Cause:** `issues` names each field that is wrong, by its path, and what was expected.

**Fix:** Correct each field `issues` names, and call the tool again.

**Evidence:** `issues`.

## `KUI_E_ENGINE_INPUT_INVALID` {#kui-e-engine-input-invalid}

**Error.** What the engine was given is not what the Keploy API server serves.

**Exit code:** `15` (usage). Nothing ran.

**What happened:** The replay engine checked its input, the plan and its journeys' flows, before it ran, and refused it.

**Cause:** `path` names the first field that is wrong, and `problem` says how.

**Fix:** Fetch the plan and its journeys' flows again, with the fields the engine reads: `path` says which one the input got wrong.

**Evidence:** `path`, `problem`.

## `KUI_E_USAGE` {#kui-e-usage}

**Error.** The invocation was malformed.

**Exit code:** `15` (usage). Nothing ran, so nothing was measured.

**What happened:** The command line, or the call, was refused before anything ran.

**Cause:** `argv` is what was given, and `problem` says what is wrong with it.

**Fix:** Read the usage with `keploy ui --help`, and issue the command again.

**Evidence:** `argv`, `problem`.
