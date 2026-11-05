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

The Keploy capture SDK (`@keploy/capture-sdk`) names every error it passes to `onError` and every dropped-event warning it logs with a `KUI_E_` code. An error's `remedy.docs`, and a warning's entry in the SDK's exported `SDK_WARNINGS`, link to the code's section on this page. Each section says what happened, why, and how to fix it. To set up UI Capture, see [Capture real user flows from your web app](../running-keploy/ui-capture.md).

| Code                                                                  | Kind    | Raised when                                                                                     |
| --------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| [`KUI_E_INGEST_KEY_REJECTED`](#kui-e-ingest-key-rejected)             | Error   | The ingest server answers `401` or `403`.                                                       |
| [`KUI_E_INGEST_ENDPOINT_NOT_FOUND`](#kui-e-ingest-endpoint-not-found) | Error   | The ingest server answers `404` or `405`.                                                       |
| [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict)                   | Error   | The ingest server answers `409`.                                                                |
| [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected)                     | Error   | The ingest server, or for a `413` a proxy in front of it, answers any other `4xx` except `429`. |
| [`KUI_E_SESSION_ID_INVALID`](#kui-e-session-id-invalid)               | Error   | `sessionIdGenerator` does not produce an id the server would accept.                            |
| [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable)   | Error   | The SDK cannot load rrweb in the browser.                                                       |
| [`KUI_E_PRIVACY_ROUTE_INVALID`](#kui-e-privacy-route-invalid)         | Error   | A `privacy.secretRoutes` or `privacy.keepRoutes` entry is not a valid route.                    |
| [`KUI_E_EVENT_UNSERIALISABLE`](#kui-e-event-unserialisable)           | Warning | An event cannot be serialised to JSON.                                                          |
| [`KUI_E_EVENT_OVERSIZED`](#kui-e-event-oversized)                     | Warning | An event alone is over the ingest server's body cap.                                            |
| [`KUI_E_EVENT_OVERSIZED_SCRUBBING`](#kui-e-event-oversized-scrubbing) | Warning | Scrubbing credentials out of an event takes it over that cap.                                   |

:::note SDK versions
This page describes the SDK releases whose codes link here, all of them after 3.0.1. `@keploy/capture-sdk` 3.0.1 does not link here and differs in places, among them: its `CaptureError.remedy` is `{command, manual}`, with no `docs` and the full remedy in `manual`; it has no `continuous` option and no `privacy.secretRoutes` or `privacy.keepRoutes`; and it does not raise `KUI_E_DOM_RECORDER_UNAVAILABLE`, `KUI_E_PRIVACY_ROUTE_INVALID` or `KUI_E_EVENT_OVERSIZED_SCRUBBING`.
:::

## Handle SDK errors and warnings

**An error ends the capture.** The SDK logs it with `console.error`, stops recording, releases its singleton, and then calls your `onError` once with a `CaptureError`. When the ingest server refused a batch, the logged line carries the server's own explanation, and the SDK also unpatches `fetch` and `XMLHttpRequest` and drops every event it had not yet sent. A page started offline whose rrweb import then fails loses what it held the same way: see [`KUI_E_DOM_RECORDER_UNAVAILABLE`](#kui-e-dom-recorder-unavailable). Because the singleton is released before `onError` runs, your handler can call `KeployCapture.init()` again to start a fresh capture. An error the SDK raises before sending anything does not reject `init()`: `init()` resolves, and the error reaches you only through `onError`.

One exception: with `continuous: true` and session ids the SDK minted, a refusal that says the server completed or filled the session ends only that session, without `onError`. See [`KUI_E_SESSION_CONFLICT`](#kui-e-session-conflict) and [`KUI_E_INGEST_REJECTED`](#kui-e-ingest-rejected).

A `CaptureError` carries:

- `code`: one of the seven error codes on this page. Branch on `code`, never on the message.
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

**A warning drops one event, and the capture continues.** The SDK does not call `onError`. It writes one `console.error` line for the first such event of each code in a capture, and drops later ones in that capture silently. A new `init()` starts a new count. The line names the code and ends with the evidence as JSON:

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
