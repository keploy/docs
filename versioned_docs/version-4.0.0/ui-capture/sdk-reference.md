---
id: sdk-reference
title: "@keploy/capture-sdk reference: options and API"
sidebar_label: SDK options and API
description: Every export of the Keploy capture SDK 3.2.0, the KeployCapture methods, each init option and privacy option, the error classes and what a batch carries.
tags:
  - UI testing
  - UI capture
  - capture SDK
  - reference
keywords:
  - "@keploy/capture-sdk"
  - capture SDK
  - KeployCapture
  - CaptureConfig
  - PrivacyConfig
  - CaptureError
  - SDK options
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The public API of `@keploy/capture-sdk` 3.2.0: the files the package ships, the methods of `KeployCapture`, every option `init` takes, the errors `onError` receives, and what each batch carries. The guides explain each one in context: [Install the SDK](./install-sdk.md), [Sessions and sampling](./sessions-and-sampling.md), [Privacy and masking](./privacy.md) and [Network calls and bodies](./network-and-bodies.md).

## Entry points {#entry-points}

You import the package by its name. Which file that loads depends on how your build reads the package:

| You load it with                          | File                     | Used by                                                                                        |
| ----------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------- |
| `import` (the `exports` map)              | `dist/index.mjs`         | Vite, webpack 5, Next.js and esbuild, and a page with no bundler, which imports it by its path |
| `require` (the `exports` map, and `main`) | `dist/index.js`          | CommonJS builds, such as a server build of your app, and Node                                  |
| The `module` field                        | `dist/index.bundler.mjs` | Bundlers that read `module` and not the `exports` map: webpack 4, and Parcel 2 by default      |
| `types`                                   | `dist/index.d.ts`        | TypeScript                                                                                     |
| The `unpkg` and `jsdelivr` fields         | `dist/index.mjs`         | Those CDNs; [Assets on a CDN](./bundlers.md#assets-on-a-cdn) says which URLs work              |

`dist/index.bundler.mjs` is the same SDK, built so that webpack 4 never reads `import.meta`, and it loads none of the SDK's files from beside it: a bundler resolves them by name.

The SDK loads its other files itself, when a capture needs them: `@keploy/capture-sdk/request-term`, `/strict-attributes`, `/body-redact`, `/body-worker-start`, and the body worker `dist/body-worker.js`. Your bundler emits each as a file of your build, where it can: [Bundlers and frameworks](./bundlers.md#where-there-is-no-body-worker) says where the worker is missing. For bundlers that ignore the `exports` map, the package also ships `request-term/package.json`, `strict-attributes/package.json`, `body-redact/package.json` and `body-worker-start/package.json`. [Bundlers and frameworks](./bundlers.md) says what each setup needs, and [Content-Security-Policy and workers](./csp-and-workers.md#what-the-sdk-loads-and-sends) when each file loads.

There is no script-tag build: the only way in is an `import`. The package's only dependency is `rrweb`, `^2.1.6`.

## KeployCapture {#keploycapture}

`KeployCapture` holds the page's one capture. It has static methods only: you never construct it.

```ts
import {KeployCapture} from "@keploy/capture-sdk";

await KeployCapture.init({endpoint, apiKey}); // start; the only call you need
KeployCapture.pause(); // keep the session, record nothing more
KeployCapture.resume();
KeployCapture.getSessionId(); // "" when no session is live
KeployCapture.getCaptureIdentity(); // the backend join, or why there is none
KeployCapture.getInstance(); // the capture, or null
await KeployCapture.stop(); // stop recording and send what is queued
```

### `init(config)` {#init}

```ts
static init(config: CaptureConfig): Promise<KeployCapture>
```

Starts the capture and resolves to it. `config` is a [`CaptureConfig`](#captureconfig): `endpoint` and `apiKey` are required. While a capture is live, another `init()` returns that same capture and changes nothing, so call it once per page load, not per route. An `init()` made while a `continuous` capture waits for its next session starts that session at once, and a `pause()` in force carries into it.

`init()` does not reject when the SDK refuses to start, such as for a privacy signal or an invalid option: it resolves, and the error reaches you through `onError`, in a task of its own. Online, it resolves once rrweb has loaded. Don't make your app's rendering wait for it: see [Call init once, as early as you can](./install-sdk.md#call-init-once-as-early-as-you-can).

### `stop()` {#stop}

```ts
static stop(): Promise<void>
```

Ends the capture: recording stops and the queued events are sent. A body still being read gets up to one second to finish, and is then recorded cut. The promise resolves once the last send has settled; awaiting it is optional. `stop()` releases the capture, so a later `init()` starts a new session, and it ends a `continuous` capture's wait for its next session. When a session that ended on its own still has its last send in flight, `stop()` waits for it too, for at most 10 seconds.

### `pause()` and `resume()` {#pause-and-resume}

```ts
static pause(): void
static resume(): void
```

`pause()` keeps the session and records nothing more: no DOM event, and no network call that starts or is answered while it is paused. A call still reading its body is recorded at once with what had arrived, cut and marked `...[truncated]`. Between a `continuous` capture's sessions, a pause is kept for the next session. `resume()` records again; a tab that is hidden stays paused until it is shown. [Pause, resume, stop and hidden tabs](./sessions-and-sampling.md#pause-resume-stop) has the details.

### `getSessionId()` {#getsessionid}

```ts
static getSessionId(): string
```

The live session's id: the SDK's UUID, or what your `sessionIdGenerator` returned. It is `""` when no session is live: before `init()`, after `stop()`, and on a page that `sampleRate` left out. This is the id `POST /ui/v1/sessions/<id>/complete` takes, and the one `uiCaptureStatus` lists as `sdkSessionId`. Read it before you call `stop()`, which clears it.

### `getInstance()` {#getinstance}

```ts
static getInstance(): KeployCapture | null
```

The capture, a sampled-out one included. `null` before `init()`, after `stop()`, after a declined or refused `init()`, and between a `continuous` capture's sessions.

### `getCaptureIdentity()` {#getcaptureidentity}

```ts
static getCaptureIdentity():
  | {identity: CaptureIdentity}
  | {refusal: "no-csprng"}
  | null
```

What lets Keploy join this recording to a backend recording of the same requests, exactly as the SDK sends it with each batch. `identity` holds `captureId` (the session id), `sessionNonce` (a random value that tells this run from another run of the same session id), `t0WallMs` (when the capture started, in Unix milliseconds) and `appOrigins` (the page's origin, or none when the page has no usable origin, such as a `data:` URL). `{refusal: "no-csprng"}` means the browser has no `crypto.getRandomValues` to mint the nonce with: the recording is still made, and cannot be joined. It is `null` before a capture has started, and after `stop()`.

## CaptureConfig {#captureconfig}

What `init()` takes. Only `endpoint` and `apiKey` are required.

| Option                | Type                                | Default      | What it does                                                                                                                                                                                                                                              |
| --------------------- | ----------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `endpoint`            | `string`                            | required     | The ingest endpoint the batches are posted to: `https://api.keploy.io/ui/v1/ingest` on Keploy Cloud, or your API server's URL followed by `/ui/v1/ingest`. The SDK's own requests to it are never recorded.                                               |
| `apiKey`              | `string`                            | required     | The app's [ingest key](./ingest-keys.md), sent as `X-API-Key` with every batch. Never another kind of Keploy key.                                                                                                                                         |
| `privacyMode`         | `"balanced"`, `"strict"` or `"off"` | `"balanced"` | How much of the page is recorded. See [Choose a privacy mode](./privacy.md#choose-a-privacy-mode).                                                                                                                                                        |
| `sampleRate`          | `number`, 0 to 1                    | `1`          | The fraction of captures recorded, rolled when `init()` starts one. See [Sampling](./sessions-and-sampling.md#sampling).                                                                                                                                  |
| `networkCapture`      | `boolean`                           | `true`       | Records `fetch` and `XMLHttpRequest` calls. `false` records the page only.                                                                                                                                                                                |
| `maxSessionDuration`  | `number`, milliseconds              | `600000`     | When a session ends on its own: 10 minutes.                                                                                                                                                                                                               |
| `continuous`          | `boolean`                           | `false`      | Keeps capturing for the life of the page, one session at a time. No effect with a `sessionIdGenerator`. See [Keep capturing a long-open page](./sessions-and-sampling.md#continuous).                                                                     |
| `batchSize`           | `number`                            | `50`         | Events per request, at most: clamped to 5,000, and a batch is also cut at 10 MiB.                                                                                                                                                                         |
| `batchInterval`       | `number`, milliseconds              | `5000`       | How often queued events are sent when there is not a full batch; a full batch is sent at once.                                                                                                                                                            |
| `maxQueueSize`        | `number`                            | `5000`       | Events held unsent. Past it, or past 16 MiB of events, the oldest are dropped.                                                                                                                                                                            |
| `maxBodySize`         | `number`, UTF-16 code units         | `524288`     | How much of a request or response body is recorded (512 KB). See [Large bodies](./network-and-bodies.md#large-bodies).                                                                                                                                    |
| `maskSelectors`       | `string[]`                          | none         | CSS selectors whose text is masked, with every text node below them. Merged with `privacy.maskSelectors`. Input values are decided by `privacyMode` alone.                                                                                                |
| `unmaskSelectors`     | `string[]`                          | none         | CSS selectors whose text is kept in the clear, overriding `maskSelectors` and `"strict"` below them. Text only: it cannot unmask an input value. Merged with `privacy.unmaskSelectors`.                                                                   |
| `privacy`             | `Partial<PrivacyConfig>`            | none         | Finer privacy controls: see [PrivacyConfig](#privacyconfig).                                                                                                                                                                                              |
| `sessionIdGenerator`  | `() => string`                      | none         | Your own session id instead of the SDK's UUID: 1 to 200 characters of letters, digits, `.`, `-` and `_`, with no empty dot-separated part, returned synchronously. See [Your own session ids](./sessions-and-sampling.md#your-own-session-ids).           |
| `honorPrivacySignals` | `boolean`                           | `true`       | Records nothing for a browser that sends Do Not Track or Global Privacy Control, and reports [`KUI_E_CAPTURE_DECLINED`](./errors.md#kui-e-capture-declined). Set `false` only where your site has its own lawful basis and says so in its privacy policy. |
| `onError`             | `(err: AnyCaptureError) => void`    | none         | Called once when a condition ends the capture, or keeps it from starting, with a [`CaptureError`](#errors-and-warnings). Warnings never call it. See [Handle SDK errors and warnings](./errors.md#handle-sdk-errors-and-warnings).                        |

## PrivacyConfig {#privacyconfig}

What the `privacy` option takes. Every field is optional in `privacy`; the default is what applies when you leave it out.

| Field               | Type                | Default | What it does                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maskSelectors`     | `string[]`          | `[]`    | As `CaptureConfig.maskSelectors`, merged with it.                                                                                                                                                                                                                                        |
| `unmaskSelectors`   | `string[]`          | `[]`    | As `CaptureConfig.unmaskSelectors`, merged with it.                                                                                                                                                                                                                                      |
| `blockSelectors`    | `string[]`          | `[]`    | CSS selectors whose elements are left out of the recording entirely. See [Mask, unmask and block elements](./privacy.md#mask-unmask-and-block-elements).                                                                                                                                 |
| `maskNetworkBodies` | `boolean`           | `false` | Records every request and response body as `[MASKED]`, without reading the response. `privacyMode: "strict"` sets it, and refuses `false` beside it with [`KUI_E_PRIVACY_CONFLICT`](./errors.md#kui-e-privacy-conflict). See [Mask every body](./network-and-bodies.md#mask-every-body). |
| `sensitiveHeaders`  | `string[]`          | the six | Header names whose values are replaced with `[REDACTED]`. Adds to the six that are always redacted, `authorization`, `cookie`, `set-cookie`, `x-api-key`, `x-auth-token` and `proxy-authorization`, and cannot remove them.                                                              |
| `piiPatterns`       | `PiiPattern[]`      | `[]`    | Your own patterns, as `{name: string, pattern: RegExp}`, run over headers and bodies, never over URLs. See [Your own patterns](./privacy.md#your-own-patterns).                                                                                                                          |
| `secretRoutes`      | `readonly string[]` | `[]`    | Routes of your app whose `:name` segments are credentials, such as `"/invites/:key"`. See [Credentials in URLs](./privacy.md#secret-routes-and-keep-routes).                                                                                                                             |
| `keepRoutes`        | `readonly string[]` | `[]`    | Routes whose `:name` segments are your app's own ids, which the SDK would otherwise take for a token, such as `"/teams/invite/:teamId"`.                                                                                                                                                 |

A `secretRoutes` or `keepRoutes` entry that is not a valid route refuses the capture with [`KUI_E_PRIVACY_ROUTE_INVALID`](./errors.md#kui-e-privacy-route-invalid).

`defaultPrivacyConfig()` returns these defaults, the six headers included. Its `maskNetworkBodies` is `false`, so passing it whole beside `privacyMode: "strict"` is refused with `KUI_E_PRIVACY_CONFLICT`.

## Errors and warnings {#errors-and-warnings}

`onError` receives a `CaptureError`, one of these subclasses. Each carries `code`, `status` (the HTTP status, or `null` when the SDK refused before sending anything), `serverMessage`, `issues`, `remedy` (`{command, manual, docs}`, where `docs` links the code's section of [UI Capture errors and warnings](./errors.md)), `evidence` and `message`. In TypeScript, the handler's argument is `AnyCaptureError`, a union of the subclasses, so checking `err.code` narrows `err.evidence` to that code's fields.

| Class                     | Codes                                                                                                             | `evidence`                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `IngestRejection`         | `KUI_E_INGEST_KEY_REJECTED`, `KUI_E_INGEST_ENDPOINT_NOT_FOUND`, `KUI_E_SESSION_CONFLICT`, `KUI_E_INGEST_REJECTED` | `status`, `serverMessage`, `endpoint`, `sessionId`, `issues` when the server sent them |
| `SessionIdRefusal`        | `KUI_E_SESSION_ID_INVALID`                                                                                        | `sessionId`, `received`, `rule`                                                        |
| `DomRecorderRefusal`      | `KUI_E_DOM_RECORDER_UNAVAILABLE`                                                                                  | `reason`                                                                               |
| `StrictAttributesRefusal` | `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`                                                                             | `reason`                                                                               |
| `PrivacyRouteRefusal`     | `KUI_E_PRIVACY_ROUTE_INVALID`                                                                                     | `option`, `received`, `rule`                                                           |
| `CaptureDeclined`         | `KUI_E_CAPTURE_DECLINED`                                                                                          | `signal`: `"doNotTrack"` or `"globalPrivacyControl"`                                   |
| `PrivacyConflict`         | `KUI_E_PRIVACY_CONFLICT`                                                                                          | `privacyMode`, `option`                                                                |

Warnings are not errors: the capture goes on, `onError` is not called, and the SDK writes one `console.warn` line with the code. Two tables list every code with its summary, its `remedy` and its evidence fields:

- `SDK_ERRORS`: the ten error codes above.
- `SDK_WARNINGS`: the six warning codes, `KUI_E_EVENT_UNSERIALISABLE`, `KUI_E_EVENT_OVERSIZED`, `KUI_E_EVENT_OVERSIZED_SCRUBBING`, `KUI_E_NAVIGATION_UNWRAPPED`, `KUI_E_REQUEST_TERM_FAILED` and `KUI_E_BODY_WORKER_UNAVAILABLE`.

Two helpers read an ingest server's answer as the SDK does: `codeForStatus(status)` returns the code a status ends the capture with, or `null` for a `2xx`, a `429` or a `5xx`, which are not errors; `parseServerError(body)` returns the server's sentence and its `issues`.

## Other exports {#other-exports}

The package also exports these, by name:

- **Privacy:** `PrivacyEngine`, which runs the SDK's masking over your own strings (see [Try your configuration](./privacy.md#try-your-configuration)), and `defaultPrivacyConfig`.
- **Session ids:** `isValidSessionId`, `SESSION_ID_PATTERN`, `SESSION_ID_MAX_LENGTH` (200) and `SESSION_ID_RULE`, the rule as the server words it.
- **Capture identity:** `CaptureIdentityBuilder`, `mintSessionNonce` and `currentOrigin`.
- **The parts `KeployCapture` is built from:** `KeployCaptureRecorder`, `NetworkInterceptor` and `Transport`.
- **A helper:** `describeValue`.
- **Types:** `CaptureConfig`, `PrivacyConfig`, `PiiPattern`, `SessionEvent`, `SessionEventType`, `NetworkEvent`, `NetworkRequestType`, `SessionMetadata`, `CaptureSession`, `TransportPayload`, `TransportConfig`, `EventCallback`, `NetworkEventCallback`, `RecorderState`, `OnEventCallback`, `OnSessionEndCallback`, `CaptureIdentity`, `IdentityRefusal`, and the error types `AnyCaptureError`, `CaptureErrorCode`, `CaptureWarningCode`, `CaptureRemedy`, `CaptureEvidence`, `CaptureWarningEvidence`, `IngestEvidence`, `SessionIdEvidence`, `DomRecorderEvidence`, `PrivacyRouteEvidence`, `CaptureDeclinedEvidence`, `PrivacyConflictEvidence`, `PrivacySignal`, `ServerAnsweredCode`, `ServerError` and `ServerIssue`.

## What a batch carries {#what-a-batch-carries}

Each request the SDK posts to `endpoint` has the ingest key in its `X-API-Key` header, and a JSON body, gzipped when the browser has `CompressionStream`, of this shape (`TransportPayload`):

| Field             | What it is                                                                                                                                                                               |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sessionId`       | The session's id.                                                                                                                                                                        |
| `batchId`         | The batch's own id, minted once and sent unchanged with the same events on every retry, so a batch sent twice is stored once.                                                            |
| `events`          | The batch's events, each a `SessionEvent`: `id`, `sessionId`, `timestamp` (Unix milliseconds), `type` (`"dom"`, `"network"` or `"custom"`), `data`, and `seq`, its place in the session. |
| `metadata`        | The page's `url`, `userAgent`, `viewport`, `referrer`, `language`, `devicePixelRatio` and the `timestamp` the session started.                                                           |
| `sdk`             | `{name, version}`: `version` is the SDK's, such as `3.2.0`.                                                                                                                              |
| `captureIdentity` | The [capture identity](#getcaptureidentity), or `null` when the capture cannot be joined.                                                                                                |

A `"dom"` event's `data` is an rrweb event. A `"network"` event's `data` is a `NetworkEvent`: `method`, `url`, `requestHeaders`, `requestBody`, `responseHeaders`, `responseBody`, `statusCode`, `duration` (milliseconds), `type` (`"fetch"` or `"xhr"`) and `requestTerm` (see [GraphQL](./network-and-bodies.md#graphql)), every value masked as [Privacy and masking](./privacy.md) describes. [What leaves the browser](./privacy.md#what-leaves-the-browser) says what else the SDK sends, and to whom.

## Version differences {#version-differences}

This page describes 3.2.0. Its public API is unchanged from 3.1.0; the [3.2.0 release notes](./capture-sdk-3-2-0-release-notes.md) cover synchronous early network capture before rrweb loads, deferred body-worker preparation and clean teardown if `init()` throws. 3.0.1 has no `continuous`, `honorPrivacySignals`, `privacy.secretRoutes` or `privacy.keepRoutes`, its `remedy` has no `docs`, and it raises fewer codes: the note at the top of [UI Capture errors and warnings](./errors.md) lists them. The [3.1.0 release notes](./capture-sdk-3-1-0-release-notes.md) list everything 3.1.0 changed from 3.0.1, and the TypeScript changes that can stop a 3.0.1 handler from compiling are in [its section 7](./capture-sdk-3-1-0-release-notes.md#7-typescript-handlers-written-for-301-may-not-compile).

## Related

- [Install the SDK](./install-sdk.md)
- [UI Capture errors and warnings](./errors.md)
- [Privacy and masking](./privacy.md)
- [Limits and sizes](./limits.md)
- [@keploy/capture-sdk on npm](https://www.npmjs.com/package/@keploy/capture-sdk)
