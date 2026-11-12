---
id: errors
title: UI Capture SDK errors and warnings
sidebar_label: UI Capture errors
description: What each KUI_E_ error and warning from the Keploy capture SDK means, why it happens, and how to fix it.
tags:
  - UI capture
  - capture SDK
  - errors
  - troubleshooting
keywords:
  - UI capture
  - capture SDK
  - KUI_E
  - onError
  - CaptureError
  - ingest key
---

The Keploy capture SDK (`@keploy/capture-sdk`) names every error it passes to `onError`, and every console warning in its exported `SDK_WARNINGS`, with a `KUI_E_` code. An error's `remedy.docs`, and a warning's `SDK_WARNINGS` entry, link to the code's section on this page. Each section says what happened, why, and how to fix it. To set up UI Capture, see [Capture real user flows from your web app](../running-keploy/ui-capture.md).

| Code                                                                  | Kind    | Raised when                                                                                              |
| --------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| [`KUI_E_INGEST_KEY_REJECTED`](#kui-e-ingest-key-rejected)             | Error   | The ingest server answers `401` or `403`.                                                                |
| [`KUI_E_INGEST_ENDPOINT_NOT_FOUND`](#kui-e-ingest-endpoint-not-found) | Error   | The ingest server answers `404` or `405`.                                                                |
| [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict)                   | Error   | The ingest server answers `409`.                                                                         |
| [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected)                     | Error   | The ingest server, or for a `413` a proxy in front of it, answers any other `4xx` except `429`.          |
| [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid)               | Error   | `sessionIdGenerator` does not produce an id the server would accept.                                     |
| [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable)   | Error   | The SDK cannot load rrweb in the browser.                                                                |
| [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid)         | Error   | A `privacy.secretRoutes` or `privacy.keepRoutes` entry is not a valid route.                             |
| [`KUI_E_CAPTURE_DECLINED`](#kui-e-capture-declined)                   | Error   | The browser sends Do Not Track or Global Privacy Control, and `honorPrivacySignals` is on (the default). |
| [`KUI_E_PRIVACY_CONFLICT`](#kui-e-privacy-conflict)                   | Error   | `privacyMode: "strict"` is set together with `privacy.maskNetworkBodies: false`.                         |
| [`KUI_E_EVENT_UNSERIALISABLE`](#kui-e-event-unserialisable)           | Warning | An event cannot be serialised to JSON.                                                                   |
| [`KUI_E_EVENT_OVERSIZED`](#kui-e-event-oversized)                     | Warning | An event alone is over the ingest server's body cap.                                                     |
| [`KUI_E_EVENT_OVERSIZED_SCRUBBING`](#kui-e-event-oversized-scrubbing) | Warning | Scrubbing credentials out of an event takes it over that cap.                                            |
| [`KUI_E_NAVIGATION_UNWRAPPED`](#kui-e-navigation-unwrapped)           | Warning | The page made a History or Navigation API method the SDK wraps impossible to replace.                    |
| [`KUI_E_REQUEST_TERM_FAILED`](#kui-e-request-term-failed)             | Warning | The SDK could not compute a request's GraphQL term, or could not load the code that computes it.         |

:::note SDK versions
This page describes the SDK releases whose codes link here, all of them after 3.0.1. `@keploy/capture-sdk` 3.0.1 does not link here and differs in places, among them: its `CaptureError.remedy` is `{command, manual}`, with no `docs` and the full remedy in `manual`; it has no `continuous` option and no `privacy.secretRoutes` or `privacy.keepRoutes`; it has no `honorPrivacySignals` and records regardless of Do Not Track or Global Privacy Control; its `privacyMode: "strict"` does not mask request or response bodies; and it does not raise `KUI_E_DOM_RECORDER_UNAVAILABLE`, `KUI_E_PRIVACY_ROUTE_INVALID`, `KUI_E_CAPTURE_DECLINED`, `KUI_E_PRIVACY_CONFLICT`, `KUI_E_EVENT_OVERSIZED_SCRUBBING`, `KUI_E_NAVIGATION_UNWRAPPED` or `KUI_E_REQUEST_TERM_FAILED`.
:::

## Handle SDK errors and warnings

**An error ends the capture.** The SDK logs it with `console.error`, stops recording, releases its singleton, and then calls your `onError` once with a `CaptureError`. When the ingest server refused a batch, the logged line carries the server's own explanation, and the SDK also unpatches `fetch` and `XMLHttpRequest` and drops every event it had not yet sent. A page started offline whose rrweb import then fails loses what it held the same way: see [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable). Because the singleton is released before `onError` runs, your handler can call `KeployCapture.init()` again, and that starts a fresh capture once the cause is fixed. With the same options it does not: [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid), [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid) and [`KUI_E_PRIVACY_CONFLICT`](#kui-e-privacy-conflict) are raised again; [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable) is raised again on the same page until you fix the cause and reload; and while the browser sends a privacy signal and `honorPrivacySignals` is on, every `init()` is declined with [`KUI_E_CAPTURE_DECLINED`](#kui-e-capture-declined). Never call `init()` again from `onError` on these five codes with the same options: each such call raises the same error and calls your handler again, which calls `init()` again, and so on. An error the SDK raises before sending anything does not reject `init()`: `init()` resolves, and the error reaches you only through `onError`.

[`KUI_E_CAPTURE_DECLINED`](#kui-e-capture-declined) is not a failure, so it is logged differently: with `console.info`, and only for the first declined `init()` on a page. `onError` still hears every declined `init()`.

One exception: with `continuous: true` and session ids the SDK minted, a refusal that says the server completed or filled the session ends only that session, without `onError`. See [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict) and [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected).

A `CaptureError` carries:

- `code`: one of the nine error codes on this page. Branch on `code`, never on the message.
- `status`: the HTTP status the server answered, or `null` when the SDK refused before sending anything.
- `serverMessage`: the `error` field of the server's JSON body, or the body's text, or `null`.
- `issues`: the server's `[{path, message}]` list, which the ingest server sends only with a `400` to say which field it refused, or `null`.
- `remedy`: `{command, manual, docs}`. `docs` links to the code's section on this page, where the remedy is, and `manual` holds the same link. `command` is always `null`: no `keploy` CLI command performs these fixes.
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

**A warning does not end the capture.** The SDK does not call `onError`. Three warnings each mean one event was dropped; [`KUI_E_NAVIGATION_UNWRAPPED`](#kui-e-navigation-unwrapped) and [`KUI_E_REQUEST_TERM_FAILED`](#kui-e-request-term-failed) drop nothing. The SDK writes one `console.error` line for the first occurrence of each code in a capture, and says nothing about later ones in that capture: a later dropped event is dropped silently. A new `init()`, or with `continuous: true` each new session, starts a new count. The line names the code and ends with the evidence as JSON:

```text
[keploy] KUI_E_EVENT_OVERSIZED: dropped an event: 11059200 bytes in a body, over the ingest server's 10485760-byte cap, so no batch could carry it. The capture continues; any further such events in this capture are dropped silently. evidence={"eventId":"7","eventType":"dom","bytes":11059200,"cap":10485760}
```

A program that reads the console can match the code and parse the JSON after the first `evidence=`. Nothing before that marker comes from your page: the event's id and type are only in the JSON.

## `KUI_E_INGEST_KEY_REJECTED` {#kui-e-ingest-key-rejected}

**Error.** The ingest server answered `401` or `403`. Capture has stopped.

**What happened:** The ingest server refused the SDK's API key, so no events from this page can be stored.

**Cause:** The key is missing, unknown, expired or revoked, its owner is deactivated, or it is not a UI ingest key. A [scoped Public API key](../running-keploy/public-api.md) (a personal access token) is refused with `403` however it is scoped: with `write` scope it can mint an ingest key, but it is not one.

**Fix:** Mint a UI ingest key for this app and pass it as `apiKey` to `KeployCapture.init()`. You can mint one:

- In the Keploy dashboard, as described in [Set up UI Capture in the dashboard](../running-keploy/ui-capture.md#set-up-ui-capture-in-the-dashboard).
- With `POST <api-server>/client/v1/apps/<appId>/ui/ingest-keys` and a scoped Public API key with `write` scope in `Authorization: Bearer`, as described in [Create an ingest key](../running-keploy/ui-capture.md#create-an-ingest-key). The Keploy MCP server's `uiCaptureSetup` tool makes the same call.

Both need `testgen:run` on the app. A new key takes effect on the next page load.

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_INGEST_ENDPOINT_NOT_FOUND` {#kui-e-ingest-endpoint-not-found}

**Error.** The ingest server answered `404` or `405`. Capture has stopped.

**What happened:** Nothing at `endpoint` accepts a POST, so no events from this page can be stored.

**Cause:** `endpoint` is wrong, not the key. The SDK sends only POSTs to `endpoint`, and the route that accepts them is the ingest route, `<api-server>/ui/v1/ingest`. A `404` or `405` that reaches the SDK comes from a typo in the path under `/ui/v1/`, or from a same-origin proxy that does not forward the route.

**Fix:** Set the `endpoint` you pass to `KeployCapture.init()` to `<api-server>/ui/v1/ingest` (`https://api.keploy.io/ui/v1/ingest` on Keploy Cloud), or to a same-origin proxy that forwards that route, and reload the page.

:::caution Silence does not prove the endpoint is right
If the endpoint is on another origin and its path is outside `/ui/v1/`, or the API server has no UI ingest route, the browser refuses the CORS preflight and no status reaches the SDK. The SDK retries that as a network error and never raises this code. Check the endpoint before you trust silence.
:::

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_SESSION_CONFLICT` {#kui-e-session-conflict}

**Error.** The ingest server answered `409`. Capture has stopped.

**What happened:** This session id is already claimed by a completed session or by a different capture, or a `batchId` was re-used with different events.

**Cause:** Usually a `sessionIdGenerator` that returns a fixed value, so a second run of the same scenario posts into the first run's session. A session completed from the dashboard while the page was still recording is refused the same way.

**Fix:** Give each run its own session id: remove the `sessionIdGenerator` override, or make it return a fresh id on every page load. Events already stored under this session are intact.

With `continuous: true` and session ids the SDK minted, a `409` whose body gives the reason `session_completed` ends only that session: the SDK does not call `onError`, and the next session starts at the visitor's next interaction. Any other reason, a server that sends no reason, or your own `sessionIdGenerator` stops the capture as above.

**Evidence:** `status`, `serverMessage`, `endpoint`, `sessionId`, and `issues` when the server sent them.

## `KUI_E_INGEST_REJECTED` {#kui-e-ingest-rejected}

**Error.** The ingest server, or for a `413` a proxy in front of it, answered a `4xx` it will keep refusing: the body is malformed (`400`), its encoding is unsupported (`415`), or it is over a size limit (`413`). Capture has stopped.

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

**What happened:** The configured `sessionIdGenerator` did not produce a session id the ingest server would accept: it returned a string outside the server's rule, returned a non-string, or threw. Nothing was sent.

**Cause:** `evidence.received` says what the generator produced: `string <value>`, `number 42`, `object Map {}`, `a Promise (sessionIdGenerator must return a string synchronously)`, or `threw <error>`. `evidence.sessionId` is the string it returned, or `null` when it returned no string. `evidence.rule` is the server's rule: a session id must be 1–200 characters of letters, digits, dot, dash and underscore, with no empty dot-separated segment.

**Fix:** Make `sessionIdGenerator` return a string inside that rule, synchronously, without throwing. Encode a correlation id such as `user:42/session 1` first, for example as base64url. Or remove the override and let the SDK mint a UUID. The SDK checks the id before it sends the first byte, so the fix takes effect on the next `init()`.

**Evidence:** `sessionId`, `received`, `rule`.

## `KUI_E_DOM_RECORDER_UNAVAILABLE` {#kui-e-dom-recorder-unavailable}

**Error.** Raised in the browser before the SDK sends anything: at `init()`, or, for a page started offline, once the network is back and the import still fails. Capture has ended.

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

## `KUI_E_PRIVACY_ROUTE_INVALID` {#kui-e-privacy-route-invalid}

**Error.** Raised by the SDK before it sends anything. Capture did not start.

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

**What happened:** The visitor's browser sent a privacy signal, Do Not Track or Global Privacy Control, and `honorPrivacySignals` is on, as it is by default. The SDK honoured the signal: it recorded nothing, patched nothing and sent nothing, and the capture never started.

**Cause:** The visitor's browser settings, not your code. `evidence.signal` names the signal:

- `globalPrivacyControl`: `navigator.globalPrivacyControl` is `true`. When the browser sends both signals, this is the one named.
- `doNotTrack`: `navigator.doNotTrack` is `"1"` or `"yes"`, `window.doNotTrack` is `"1"`, or `navigator.msDoNotTrack` is `"1"`.

Some browsers send Global Privacy Control by default, Brave and DuckDuckGo among them, so expect this code from a share of your real visitors. The SDK checks the signal on every `init()` made while no capture is running, before `sampleRate` applies, so a visitor that `sampleRate` would have left out is declined, and reported, all the same. `onError` is called once for every declined `init()`. The `console.info` line is written only for the first one on a page:

```text
[keploy] capture did not start: the browser sent Global Privacy Control, and honorPrivacySignals is on (KUI_E_CAPTURE_DECLINED). Nothing was recorded or sent.
```

`@keploy/capture-sdk` 3.0.1 records regardless of these signals, so once you upgrade from it, visitors who send either signal are no longer recorded.

The decline also comes before every other check except [`KUI_E_PRIVACY_CONFLICT`](#kui-e-privacy-conflict): in a browser that sends either signal, with `honorPrivacySignals` on, the SDK never checks `sessionIdGenerator` or your privacy routes, and never loads rrweb, so [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid), [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid) and [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable) cannot appear there.

**Fix:** Nothing needs fixing: the person using the page said no. In `onError`, return early on this code and keep it out of your error tracker. Calling `init()` again does not help: while the browser sends the signal and `honorPrivacySignals` is on, every `init()` is declined. To test your integration, use a browser with both signals off, or set `honorPrivacySignals: false` in development only. Set `honorPrivacySignals: false` only where your site has its own lawful basis to record regardless of these signals, and says so in its privacy policy. The SDK then records as it would with no signal.

**Evidence:** `signal`.

## `KUI_E_PRIVACY_CONFLICT` {#kui-e-privacy-conflict}

**Error.** Raised by the SDK before it records or sends anything. Capture did not start.

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

**Warning.** One `console.error` line, for the first such event in a capture. The capture continues.

**What happened:** The SDK dropped one captured event because it could not be serialised to JSON: it had a cycle, a `BigInt`, or a getter that throws. The capture continues without it.

**Cause:** `evidence.eventId` and `evidence.eventType` say which event. `evidence.reason` is the message of the error `JSON.stringify` threw: its own for a cycle or a `BigInt`, or the getter's or `toJSON`'s own when one throws.

**Fix:** A `custom` event comes from your code (`KeployCaptureRecorder.emitEvent`): make its payload plain JSON, with no cycles, no `BigInt` and no throwing getters. Any other event type is the SDK's own serialisation and is a defect in the SDK: report it to Keploy.

**Evidence:** `eventId`, `eventType`, `reason`.

## `KUI_E_EVENT_OVERSIZED` {#kui-e-event-oversized}

**Warning.** One `console.error` line, for the first such event in a capture. The capture continues.

**What happened:** The SDK dropped one captured event because, alone in a request body, it is over the ingest server's decoded cap (`evidence.cap` bytes), so no batch could carry it. The capture continues without it.

**Cause:** `evidence.bytes` is the size of a request body carrying only this event (its JSON plus the batch envelope), and `evidence.cap` is the server's limit on one body.

- A `dom` event this large is an rrweb full snapshot of a very large page, or one change to it as large (a subtree inserted at once). Without it, later events would name nodes the recording never showed, so the SDK holds the page's later DOM changes and interactions until a full snapshot is delivered. It retakes one at once after a dropped change, 5 seconds after a dropped snapshot and then at doubling waits up to every 60 seconds while the page is too big, and when the tab is next shown.
- A `network` event this large is a captured body under a raised `maxBodySize`.

**Fix:**

- For a `dom` event, leave the heaviest subtrees out of the snapshot with `privacy.blockSelectors`.
- For a `network` event, lower `maxBodySize` in `KeployCapture.init()` so bodies are truncated before capture.

**Evidence:** `eventId`, `eventType`, `bytes`, `cap`.

## `KUI_E_EVENT_OVERSIZED_SCRUBBING` {#kui-e-event-oversized-scrubbing}

**Warning.** One `console.error` line, for the first such event in a capture. The capture continues.

**What happened:** The SDK dropped one captured event while scrubbing the page URL's credentials out of it. The scrubbed event was certain to pass the ingest server's decoded cap (`evidence.cap` bytes), so no batch could carry it, and the SDK stopped there. The capture continues without it.

**Cause:** The SDK scrubs an event only when the page's URL holds a credential (a declared route's value, a token), and it replaces each credential with `[REDACTED]`. So a short value repeated through a crafted URL makes every link rrweb resolves against that URL grow. The SDK measures the event as it scrubs it, and stops as soon as the event is certain to stay over the cap even after later replacements shrink it, rather than spend the page's time and memory on an event it could never send. `evidence.atLeast` is how many characters the scrubbed event was certain to reach when the SDK stopped: a lower bound on its size in a body, which is larger.

The SDK then holds the page's later DOM changes and interactions until a full snapshot is sent again. It retakes one at once after a dropped change, 5 seconds after a dropped snapshot and then at doubling waits up to every 60 seconds until one is delivered, or when the tab is next shown.

**Fix:** Apart from a crafted URL, a `dom` event this large is an rrweb full snapshot of a very large page: leave the heaviest subtrees out of the snapshot with `privacy.blockSelectors`.

**Evidence:** `eventType`, `atLeast`, `cap`. The event has no id, because it never reached the SDK's queue.

## `KUI_E_NAVIGATION_UNWRAPPED` {#kui-e-navigation-unwrapped}

**Warning.** One `console.error` line per capture. Nothing is dropped, and the capture continues.

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

**Warning.** One `console.error` line, for the first such request in a capture. Nothing is dropped, the page's request is not affected, and the capture continues.

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
