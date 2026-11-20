---
id: network-and-bodies
title: "UI capture network calls: what the SDK records of requests and bodies"
sidebar_label: Network calls and bodies
description: Which network calls the Keploy capture SDK records, when it starts, how it reads and redacts request and response bodies, and the markers it records.
tags:
  - UI testing
  - UI capture
  - network capture
keywords:
  - UI capture network
  - capture SDK
  - fetch recording
  - XMLHttpRequest
  - response body
  - maxBodySize
  - maskNetworkBodies
  - GraphQL requestTerm
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

Beside what a visitor does, the capture SDK records the network calls your page makes. Each flow lists the calls its steps made, and they are what a replay of the flow needs. This page says which calls are recorded and from when, how the SDK reads a body without changing what your page gets, and what it records when it cannot keep a body whole. It describes SDK 3.1.0. What is masked in a call is on [Privacy and masking](./privacy.md#network-calls).

## What a recorded call holds {#what-a-recorded-call-holds}

The SDK records every `fetch` and `XMLHttpRequest` call the page makes, each with:

- its method and URL;
- its request and response headers and bodies, redacted;
- its status and duration;
- whether it was a `fetch` or an `XMLHttpRequest`;
- `requestTerm`, which names the [GraphQL](#graphql) operation a request runs.

Only those two APIs are recorded: a WebSocket's messages, an `EventSource` stream and `navigator.sendBeacon` are not. The SDK's own requests to your `endpoint` are never recorded.

A framework's own requests are recorded like your app's. In the [Next.js sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-next-shop), a `<Link>` fetches its page's server component payload (`GET /products?_rsc=…`) as it prefetches and when it is followed, and those calls appear in the recording beside the shop's own. A fetch a server component makes runs on the server, not in the browser, so it is not recorded.

## Start capture before your first call {#start-capture-before-your-first-call}

The SDK starts recording the page's calls only once it has loaded rrweb. `init()` waits for `import("rrweb")` before it patches `fetch` and `XMLHttpRequest`, and your bundler normally puts rrweb in a chunk of its own, fetched over the network. **A call the page makes before that chunk has loaded is not recorded at all**, in a hidden tab as in a visible one. Calling `init()` as early in your app's startup as you can narrows that window; nothing closes it.

So a page's first calls are often missing from its recording. The [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop) imports its `src/keploy.ts` before anything else, and the first page's first request, `GET /api/featured`, is still usually missing. The SDK holds no request back while rrweb loads: until then `fetch` and `XMLHttpRequest` are still the browser's own, so such a request goes out as it would without the SDK, and is not recorded.

An `init()` called while the browser is offline is the exception: it patches `fetch` and `XMLHttpRequest` at once, and sends nothing it records until rrweb has loaded once the browser is back online. If rrweb then cannot load, the capture is refused with [`KUI_E_DOM_RECORDER_UNAVAILABLE`](./errors.md#kui-e-dom-recorder-unavailable), and what it recorded meanwhile is dropped. On a page a service worker controls, `init()` asks for rrweb at once even offline, so precache rrweb's chunk with the rest of your app: a worker that cannot answer that request gets the capture refused, and refused again until the page is reloaded.

## How the SDK reads a body {#how-the-sdk-reads-a-body}

With network capture on, `fetch()` resolves when the response's headers arrive, as it does without the SDK, and the page gets the network's own `Response`. A streamed response, such as server-sent events over `fetch`, NDJSON or an LLM's tokens, streams to the page as it arrives. The SDK reads nothing of a body until the page does, and records what the page read. (Under a fetch polyfill whose responses have no `body`, such as whatwg-fetch, which Mirage JS and pretender use, the SDK reads a copy of each response whole instead.)

- **Read whole**, with `text()`, `json()`, `arrayBuffer()`, `bytes()` or `blob()`: the browser's own method answers, and the SDK records what your app got. A body read with `formData()`, or with a `json()` your app put on `Response.prototype`, is recorded from a copy taken just before, read only as far as `maxBodySize`.
- **Read through `body`**, with a stream reader: the SDK reads the network once for each read the page makes, nothing ahead of it. A page that stops reading early is recorded with exactly what it read, and one that cancels or aborts stops the download at once. A body your app reads only through a clone's `body` is recorded as not read: monitoring tools such as Datadog RUM and Sentry read their own clone, and the recording stays your app's own read.
- **Never read**: the SDK never reads it either. It is recorded as `[Response body not read by the page]`, with its status and headers, once the page's `Response` and its clones are garbage-collected, or when the tab is hidden, the page leaves, the capture pauses or `stop()` ends it. A replay sends that text as the body. A body a browser API reads outside JavaScript, such as `cache.put()` or `WebAssembly.instantiateStreaming()`, is recorded as not read too. A mobile browser may discard a hidden tab without another event, so a body the page first reads after such a tab is shown again stays recorded as not read.

Before SDK 3.1.0, a body the page never read was read and recorded whole.

A body that fails part-way, because of an abort, a dropped connection or the page navigating away, is recorded with what had arrived, cut and marked `...[truncated]`; for a body the page was reading whole, with nothing of it. Each recorded body, whole or cut, is redacted the same way.

## Large bodies {#large-bodies}

`maxBodySize`, 524,288 by default (512 KB), bounds how much of a request or response body is recorded. It counts UTF-16 code units, the length of a JavaScript string: one unit per byte for ASCII text, and fewer units than bytes for text with other characters. Past it:

- **Text** is cut at the bound and marked `...[truncated]`.
- **A cut body that was JSON** no longer parses, and no fragment can be redacted safely, so `[UNPARSEABLE_BODY_NOT_REDACTED]` is recorded in its place: never a partly redacted body, and never one in the clear.
- **A response whose `Content-Length` is over the bound** is never downloaded, and is recorded as `[Response body too large: N bytes]`.

A body the SDK does not read as text is recorded as a note that names what it was. There are eight:

| Note                                   | Recorded for                                                                                                                           |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `[Blob: N bytes, truncated]`           | A `fetch` Blob over the bound.                                                                                                         |
| `[Blob: N bytes]`                      | Any Blob sent with `XMLHttpRequest`, which would have to be read inside `send()`.                                                      |
| `[Binary: N bytes]`                    | A buffer over the bound, or one that is not UTF-8 text. A buffer that is text and fits is recorded as that text.                       |
| `[Response body too large: N bytes]`   | A response whose `Content-Length` is over the bound, so the SDK never downloads it. `N` is the server's figure.                        |
| `[Response body not read by the page]` | A response body your app never read. A replay sends this text as the body.                                                             |
| `[ReadableStream]`                     | A streaming request body, which reading would consume out from under your app.                                                         |
| `[<responseType> response]`            | An `XMLHttpRequest` whose `responseType` makes `responseText` throw.                                                                   |
| `[Unreadable body]`                    | A body that could not be read at all, or a `multipart/form-data` body that does not parse into its fields. It is never passed through. |

A file inside `FormData` is not one of these: the form is recorded, and the file's field reads `[File: name, N bytes]`. The file's bytes are never read.

Lowering `maxBodySize` to save bandwidth gives you `[UNPARSEABLE_BODY_NOT_REDACTED]` for most large JSON, not a shorter body.

## Redaction off the main thread {#redaction-off-the-main-thread}

The page has its body first. The SDK then hands the body to a Web Worker, which redacts it off your page's main thread, in a task of its own once the page's work allows. Your bundler emits the worker, `body-worker.js`, beside your app.

**Where the page has no worker**, the SDK redacts bodies on the main thread, and only up to 64 KiB (65,536 characters) of each: a longer body is recorded cut, under the line `[Body cut: 65536 of N characters kept, unverified]`, followed by its first 65,536 characters redacted, or by `[UNPARSEABLE_BODY_NOT_REDACTED]` for cut JSON. That is the case under webpack 4, under esbuild unless you copy `dist/body-worker.js` beside your bundle, when your build's assets are served from another origin, and under a Content-Security-Policy that does not allow `worker-src 'self'`. When the page leaves, or `stop()` ends the capture, bodies still in the worker are recorded on the main thread the same way, up to 64 KiB in all, each one past that cut under `[Body cut: K of N characters kept, unverified]`, where `K` is what was kept.

**What the SDK holds for redaction is bounded.** While the copies of bodies waiting to be redacted come to 8 Mi UTF-16 units (16 MiB) or more, the next call's bodies are not kept: the call is recorded with each body as `[Body cut: 0 of N characters kept, unverified]`. With bodies of the full default `maxBodySize`, that happens to a healthy page past 16 calls in a burst before the page is idle, or past 8 calls a slow worker has not answered.

**A body the SDK could not redact is recorded as not captured**, never in the clear: the cut line with nothing kept, then a line that says why.

```
[Body cut: 0 of N characters kept, unverified]
[Body not captured: the page left or the capture stopped before redaction was ready]

[Body cut: 0 of N characters kept, unverified]
[Body not captured: the redaction code could not load]

[Body cut: 0 of 0 characters kept, unverified]
[Body not captured: the page took the body's stream before the redaction code had loaded]
```

- The first is a body the page left on, or that `stop()` found, before the SDK's redaction code had arrived. `init()` asks for that code at once, beside rrweb.
- The second is a page where that code could not load at all: a Content-Security-Policy that refuses it, a `404` after a deploy, or the SDK's `dist/index.mjs` served alone. The SDK also logs [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable) once per page.
- The third is a body your app took through `res.body` before the code had arrived, and never read whole.

A cut or not-captured body is not the response the server sent, and a replay never serves it as one: a replayed test that reaches it is reported `unproven`.

## GraphQL {#graphql}

Every recorded call carries `requestTerm`, in every privacy mode, `"strict"` included, unless computing it failed (below). For a GraphQL request it names the operation the body runs: its `operationName` and a hash of its document with every string and number blanked, such as `graphql:GetApps#…`, or `graphql:GetApps#pq` for a persisted query. It is `""` for a body that is not GraphQL, and `body:*` for a body that is not text, is longer than 4 Mi characters, or that the SDK could not read or hash. It is computed from the body before redaction and never holds a variable or a literal.

The code that computes it is a chunk the SDK loads the first time a body could be a GraphQL request, so a page that sends none never loads it. Where that code cannot load, the call is recorded with `body:*`, and where computing a term fails, it is recorded without one. Either way the SDK logs [`KUI_E_REQUEST_TERM_FAILED`](./errors.md#kui-e-request-term-failed) for the first such call in a capture. The page's own request is never affected.

Keploy's server keys the flows it stores without the term, so GraphQL calls with one method and URL are answered in the order they were recorded, whatever operation each runs.

## Mask every body {#mask-every-body}

`privacy.maskNetworkBodies: true` records every request and response body as `[MASKED]`, decided without the SDK reading it: the page's `Response` is never read, cloned or relayed, and the SDK's body code is never loaded. A request with no body or an empty one, and a response to a `HEAD`, or with status `204`, `205` or `304`, or `Content-Length: 0`, is recorded with no body. A response that does not declare its length is `[MASKED]`, even one that turns out empty.

One body is still read: a `Request` object's own, as in `fetch(new Request(url, { body }))`, which is copied and read only as far as its `requestTerm` needs.

`privacyMode: "strict"` sets `maskNetworkBodies`. Setting `privacy.maskNetworkBodies: false` beside it is refused with [`KUI_E_PRIVACY_CONFLICT`](./errors.md#kui-e-privacy-conflict) before anything is recorded.

## Streams and uploads {#streams-and-uploads}

- **A streamed response** reaches the page as the network delivers it, with or without the SDK.
- **A stream passed as a request's `body`** to `fetch()` is not read at all: it is recorded as `[ReadableStream]` and pulled exactly as without the SDK.
- **A streamed upload built into a `Request`**, as in `new Request(url, { body: stream, duplex: "half" })`, is pulled further than the network alone would pull it: when the server answers before the upload ends, the SDK has read on into the stream, about `maxBodySize` bytes of it for ASCII text, up to 4 Mi characters for a stream that starts as a JSON object, which could be a GraphQL request, and all of a `multipart/form-data` body. No browser API says how much of a body the network consumed, so the SDK reads its own copy until it has what the recording keeps.
- **`KeployCapture.stop()`** waits up to one second for calls already answered to finish their bodies, and records any still open then, such as an endless stream, cut at that point and marked `...[truncated]`. A body the page never read is recorded as `[Response body not read by the page]`. `KeployCapture.pause()` records them the same way at once, with no wait.

## Turn network capture off {#turn-network-capture-off}

Pass `networkCapture: false` to `init()` to record the page only: the SDK then does not patch `fetch` or `XMLHttpRequest` and does not load its body code, and the flows it records have no network calls.

## Related

- [Privacy and masking](./privacy.md)
- [Sessions and sampling](./sessions-and-sampling.md)
- [Limits and sizes](./limits.md)
- [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable) and the other warnings
