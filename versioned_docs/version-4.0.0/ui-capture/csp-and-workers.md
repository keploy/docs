---
id: csp-and-workers
title: Content-Security-Policy and workers for UI capture
sidebar_label: Content-Security-Policy and workers
description: What the Keploy capture SDK loads and sends while it runs, the Content-Security-Policy directives it needs, and what happens when one is blocked.
tags:
  - UI testing
  - UI capture
  - capture SDK
keywords:
  - Content-Security-Policy
  - CSP
  - worker-src
  - connect-src
  - script-src
  - Web Worker
  - service worker
  - import map
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

If your site sends a `Content-Security-Policy` header, it must let the capture SDK load its own files, start its body worker and post to Keploy's ingest endpoint. This page lists what the SDK loads and sends, the directives that allow each, and what the SDK does when one is blocked. It also covers pages a service worker serves, and pages that start offline.

## What the SDK loads and sends {#what-the-sdk-loads-and-sends}

Besides the SDK's main bundle, which is part of your app's bundle, a capture loads these files while it runs. Your bundler emits each as a file of your build (Vite names them `rrweb-<hash>.js`, `body-redact-<hash>.js` and so on); with no bundler, they are the files of the package's `dist/` directory.

| What                                                                                  | When                                                                                         | Directive     |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------- |
| rrweb, the library that records the page                                              | At `init()`, for every capture                                                               | `script-src`  |
| The body redaction code (`body-redact`)                                               | At `init()`, beside rrweb, for a capture that records bodies (the default)                   | `script-src`  |
| The worker's start (`body-worker-start`; `body-worker-unbundled.mjs` with no bundler) | Just before the body worker                                                                  | `script-src`  |
| The body worker (`body-worker.js`)                                                    | In the page's next idle period after such a capture starts                                   | `worker-src`  |
| The GraphQL code (`request-term`)                                                     | The first time a request body could be a GraphQL request                                     | `script-src`  |
| The attribute list (`strict-attributes`)                                              | At `init()`, beside rrweb, under `privacyMode: "strict"` only, which loads neither body file | `script-src`  |
| The batches, posted to your `endpoint`                                                | Every few seconds while there is something to send, with `fetch`                             | `connect-src` |

A capture that masks every body, under `privacyMode: "strict"` or with `privacy.maskNetworkBodies: true`, loads neither the body code nor the worker.

## The directives it needs {#the-directives-it-needs}

- **`script-src`** must allow the SDK's chunks wherever your build serves them, as it allows the rest of your build's scripts. When they are served from your own origin, `'self'` does.
- **`worker-src 'self'`** lets the body worker run, or the `child-src` or `script-src` that a policy with no `worker-src` falls back to. A browser runs a worker only from the page's own origin, so the worker must be served from it.
- **`connect-src`** must allow the ingest endpoint's origin: `https://api.keploy.io` on Keploy Cloud, or your own API server's origin when you self-host.

For example, under this policy the [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop)'s production build records its visits in Chromium with no violation: its body worker runs, and a GraphQL request sent from the page loads the GraphQL code. That check posted to a local test ingest, whose origin took the place of `https://api.keploy.io`.

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; worker-src 'self'; connect-src 'self' https://api.keploy.io
```

A policy for your own app also needs whatever the rest of your app loads.

### Without a bundler {#without-a-bundler}

The import map that tells the browser where `rrweb` is (see [No bundler](./bundlers.md#no-bundler)) is an inline script, so `script-src 'self'` alone blocks it. Allow it by its hash: the SHA-256 of the text between `<script type="importmap">` and `</script>`, whitespace included, base64-encoded. Under this policy, with the hash of its own import map, the [plain HTML sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-html-shop)'s pages record their visits in Chromium with no violation, again with a local test ingest in place of `https://api.keploy.io`:

```text
Content-Security-Policy: default-src 'self'; script-src 'self' 'sha256-Im2C7SeFUs3EXTFUZJSteww4lP72+k39AUQCo6TeygI='; worker-src 'self'; connect-src 'self' https://api.keploy.io
```

Your own import map has a hash of its own. The surest way to get it: when the policy blocks the import map, Chromium's console error names the hash it expects. Without the import map, rrweb cannot be imported, and the capture ends before anything is sent with [`KUI_E_DOM_RECORDER_UNAVAILABLE`](./errors.md#kui-e-dom-recorder-unavailable).

## What happens when one is blocked {#what-happens-when-one-is-blocked}

| Blocked                             | What the SDK does                                                                                                                                                                                                                                  | You see                                                                                                               |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| rrweb                               | Ends the capture before sending anything, with `fetch` and `XMLHttpRequest` left unpatched                                                                                                                                                         | [`KUI_E_DOM_RECORDER_UNAVAILABLE`](./errors.md#kui-e-dom-recorder-unavailable) in `onError` and the console           |
| The attribute list, under strict    | Ends the capture before recording anything                                                                                                                                                                                                         | [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](./errors.md#kui-e-strict-attributes-unavailable) in `onError` and the console |
| The body worker                     | Goes on recording, and redacts each body on the main thread instead, up to 64 KiB: a body over that is recorded cut                                                                                                                                | One [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable) warning, `"part":"worker"`           |
| The body redaction code             | Goes on recording; a body the main thread must redact is recorded as not captured, never in the clear                                                                                                                                              | One `KUI_E_BODY_WORKER_UNAVAILABLE` warning, `"part":"code"`                                                          |
| The GraphQL code                    | Goes on recording; each request that could be GraphQL is recorded with the term `body:*`, and the load is not retried on that page                                                                                                                 | One [`KUI_E_REQUEST_TERM_FAILED`](./errors.md#kui-e-request-term-failed) warning                                      |
| The ingest endpoint (`connect-src`) | Reads each refused upload as a network failure: keeps the events, retries with backoff, never calls `onError`; past `maxQueueSize` or 16 MiB held, events are dropped: see [Batching and outages](./sessions-and-sampling.md#batching-and-outages) | A Content-Security-Policy error in the console for each upload; nothing arrives in Keploy                             |

A browser keeps a failed module import for the life of the page, so after you fix the policy, reload the page: calling `init()` again on the same page does not load the file.

A warning does not end the capture: the SDK writes it with `console.warn`, never `console.error`, so a page whose tests or error tracker fail on console errors does not fail on one.

## Service workers and offline starts {#service-workers-and-offline-starts}

- **A page that starts offline** does not ask for rrweb until the browser is back online, since a browser keeps a failed module import for the life of the page. It patches `fetch` and `XMLHttpRequest` at once, so the page's requests are recorded, and sends nothing until rrweb has loaded. If rrweb then cannot load, the capture ends with `KUI_E_DOM_RECORDER_UNAVAILABLE`, and what it recorded meanwhile is dropped, unsent.
- **A page a service worker controls** (`navigator.serviceWorker.controller` is set) is different: a service worker can answer the import with no network, so `init()` asks for rrweb at once and records what the visitor does offline. Precache rrweb's chunk with the rest of your app, and under strict its attribute list too.
- **Any service worker in control counts**, one with no `fetch` handler included. An `init()` called offline under it asks for rrweb at once. If the service worker cannot answer, the import fails and the capture is refused at that `init()`, and again at an `init()` made once the browser is back online, until the page is loaded again.

The SDK's body worker is a dedicated Web Worker that the SDK starts with `new Worker`, not a service worker.

## Related

- [Install the SDK](./install-sdk.md)
- [Bundlers and frameworks](./bundlers.md)
- [Network calls and bodies](./network-and-bodies.md#redaction-off-the-main-thread)
- [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable)
- [UI Capture errors and warnings](./errors.md)
