---
id: install-sdk
title: Install the Keploy capture SDK in your web app
sidebar_label: Install the SDK
description: Add @keploy/capture-sdk to a React and Vite app, a Next.js App Router app or plain HTML pages, start it early, and check that recordings arrive.
tags:
  - UI testing
  - UI capture
  - capture SDK
keywords:
  - capture SDK
  - "@keploy/capture-sdk"
  - install
  - React
  - Vite
  - Next.js
  - import map
  - ingest key
  - Do Not Track
  - Global Privacy Control
---

import ProductTier from '@site/src/components/ProductTier';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The Keploy capture SDK, `@keploy/capture-sdk`, records what people do in your web app and the requests the page makes, masks personal data in the browser, and posts the recording to Keploy in batches. This page adds it to your own app: install the package, call `init` once and early, keep the ingest key in your configuration, and check that recordings arrive. It describes SDK 3.2.0.

The code on this page comes from the three [UI capture sample shops](https://github.com/keploy/samples-typescript): one small shop built with React and Vite (`ui-capture-react-shop`), with the Next.js App Router (`ui-capture-next-shop`), and as plain HTML pages with no bundler (`ui-capture-html-shop`). Each sample's CI visits it in Chromium and checks what its SDK sent.

## Before you begin

You need an **ingest key** for the Keploy app you want to record into, and the **ingest endpoint** the SDK sends to.

- In the dashboard, open **UI Testing → UI Flows** and click **Create ingest key**: see [Create an ingest key](./quickstart-dashboard.md#create-an-ingest-key).
- With the REST API, `POST /client/v1/apps/<appId>/ui/ingest-keys` returns the key as `apiKey` and the `endpoint` to use; an AI agent calls the same thing as the MCP tool `uiCaptureSetup`. See [Create an ingest key](./rest-api.md#create-an-ingest-key).

The endpoint is `https://api.keploy.io/ui/v1/ingest` on Keploy Cloud. When you self-host Keploy, it is your API server's URL followed by `/ui/v1/ingest`.

## Install {#install}

```bash
npm install @keploy/capture-sdk
```

Install it as a runtime dependency, not a dev one: it runs in production, in your visitors' browsers. Its only dependency is `rrweb`, the library it records the page with, which your bundler resolves, and it has no peer dependencies. The package ships ES module and CommonJS builds with TypeScript types. The samples pin the exact version they are tested with, `"@keploy/capture-sdk": "3.1.0"`.

There is no script-tag build: the only way in is an `import`. A page with no bundler imports it from the package's `dist/` directory, as the **Plain HTML** tab below shows.

## Call init once, as early as you can {#call-init-once-as-early-as-you-can}

`KeployCapture.init` starts the capture. It has two required options: `endpoint`, the ingest endpoint, and `apiKey`, your ingest key, which the SDK sends in the `X-API-Key` header of every batch. Every other option has a default. Each sample calls it once, from a module of its own; this is the React shop's:

```ts title="src/keploy.ts (excerpt)"
import {KeployCapture} from "@keploy/capture-sdk";

const endpoint = import.meta.env.VITE_KEPLOY_INGEST_ENDPOINT;
const apiKey = import.meta.env.VITE_KEPLOY_INGEST_KEY;

async function startCapture(): Promise<void> {
  if (!endpoint || !apiKey) {
    console.info(
      "[shop] Keploy UI capture is off: set VITE_KEPLOY_INGEST_ENDPOINT and VITE_KEPLOY_INGEST_KEY in .env"
    );
    return;
  }
  await KeployCapture.init({
    endpoint,
    apiKey,
    // The default, written out: every typed value is masked, and the page's
    // visible text is kept. "strict" also masks all visible text and records
    // no request or response body.
    privacyMode: "balanced",
    privacy: {
      // Text that repeats what the shopper typed: the order confirmation
      // shows their email, so its text is masked.
      maskSelectors: ["[data-testid=order-confirmation]"],
      // Never recorded: the reviews (people's names) are replaced by an
      // empty box of the same size.
      blockSelectors: ["[data-testid=reviews]"],
      // A route whose path holds a credential, such as an invite link, is
      // declared so its value is kept out of every event. The shop has none:
      // secretRoutes: ["/invites/:key"],
    },
    onError(err) {
      // The visitor's browser sends Do Not Track or Global Privacy Control:
      // nothing is recorded, and nothing needs fixing.
      if (err.code === "KUI_E_CAPTURE_DECLINED") return;
      console.error(
        `[shop] Keploy UI capture stopped: ${err.code}`,
        err.message
      );
    },
  });
  const sessionId = KeployCapture.getSessionId();
  if (sessionId)
    console.info(`[shop] Keploy UI capture is recording session ${sessionId}`);
}

/** Settles once capture has started, or once it is off, declined or refused. */
export const captureStarted: Promise<void> = startCapture().catch(
  (err: unknown) => {
    console.error("[shop] Keploy UI capture did not start:", err);
  }
);
```

The Next.js and plain HTML shops make the same call; only where they read the endpoint and key differs (see the tabs below).

- **As early as you can.** In SDK 3.2.0, `init()` patches `fetch` and `XMLHttpRequest` synchronously once its start checks pass, before rrweb finishes loading, and holds those events until rrweb loads. Requests your app fires right after calling `init()` are recorded; requests made _before_ `init()` is called are still missed (in SDK 3.1.0 and earlier, requests made while rrweb's chunk loaded were missed too). Starting `init()` from a module imported before your app's own code ensures early page-load requests are captured. See [Start capture before your first call](./network-and-bodies.md#start-capture-before-your-first-call).
- **Without holding your app back.** Start `init()` and let your app go on: don't make rendering or routing wait for it. Online, an awaited `init()` resolves only once rrweb has loaded, and a refused one can resolve about 30 seconds after the call, longer in a hidden tab (see [Handle SDK errors and warnings](./errors.md#handle-sdk-errors-and-warnings)). The samples start it first and never wait for it.
- **Once per page load, not per route.** A second `init()` returns the capture that is already running, and `KeployCapture.stop()` ends it, so that a later `init()` starts a new session. In a single-page app a session holds the page load's route changes too, up to `maxSessionDuration` (10 minutes by default): see [Single-page apps and navigation](./spa-navigation.md) and [Sessions and sampling](./sessions-and-sampling.md#what-a-session-is). On a site whose links load pages, every page load runs `init()` again and starts a session of its own.
- **In the browser.** Call it from code that runs in the browser, not during server-side rendering. The Next.js shop's module does nothing on the server.

### Avoid missing boot-time authentication calls {#boot-time-capture}

:::caution Don't call `KeployCapture.init()` in a React `useEffect`
`@keploy/capture-sdk` `3.2.0+` patches `fetch` and `XMLHttpRequest` synchronously inside `init()` once its start checks pass (privacy signals, route declarations, sampling, and `sessionIdGenerator`, with `networkCapture` enabled), before `rrweb` finishes loading. However, if you call `KeployCapture.init()` inside a React `useEffect` (or after sibling or child auth providers mount), boot-time requests such as `GET /auth/check` or `GET /api/me` fire **before** `init()` runs. Those calls are never recorded, which causes authenticated journeys to redirect to `/signin` when replayed.
:::

Always prefer a static top-level import so `KeployCapture.init()` starts before your application tree mounts (your app's network requests go out immediately and `rrweb` loads asynchronously without needing to be awaited):

- **Next.js (App Router):** import your capture module from root `instrumentation-client.ts`, which runs in the browser before React hydrates.
- **React + Vite / SPAs:** import your capture module (`import "./keploy";`) as the very first top-level import in `src/main.tsx`, before React or any auth provider mounts.

#### Gate lazy-loaded capture with a fail-open boot barrier {#fail-open-boot-barrier}

Prefer the static top-level import above whenever possible: `init()` patches `fetch` and `XMLHttpRequest` synchronously once its start checks pass, does not hold back your app's requests, and loads `rrweb` asynchronously.

Use a boot barrier only if your app must dynamically import `@keploy/capture-sdk` after consent is **already known to be granted** (for example, a returning visitor whose stored consent preference is true) and you need boot fetches not to race ahead of that dynamic import. In that narrow case, you can optionally await a short **fail-open boot barrier** (around 250 ms) before firing initial auth/bootstrap fetches, and **skip the barrier immediately (0 ms delay)** whenever capture is disabled or consent has not yet been granted (never wait on a cookie banner):

```ts title="src/boot-barrier.ts"
let readyResolve: (() => void) | undefined;
const captureInitReady = new Promise<void>((resolve) => {
  readyResolve = resolve;
});

/** Call once KeployCapture.init() has been invoked, or immediately if capture will not run. */
export function markCaptureReady(): void {
  readyResolve?.();
}

/**
 * Optional fail-open wait before initial auth/bootstrap fetches when dynamically
 * importing the SDK for an already-consented visit. Skip when capture is off or
 * consent is not yet granted.
 */
export function waitForCaptureBoot(
  shouldWait: boolean,
  timeoutMs = 250
): Promise<void> {
  if (!shouldWait) return Promise.resolve();
  return Promise.race([
    captureInitReady,
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}
```

In your dynamic-import path, invoke `KeployCapture.init(...)` (you do not need to await `rrweb` loading on SDK `3.2.0+`, because `fetch` and `XMLHttpRequest` are patched synchronously once start checks pass) and then call `markCaptureReady()`, which settles `captureInitReady` immediately. Note the trade-off: an uncached dynamic chunk load can take longer than `timeoutMs`, adding up to `timeoutMs` to the first auth fetch on cold loads while still missing the call if the chunk arrives late. That is another reason to prefer a static top-level import.

## Add it to your app {#add-it-to-your-app}

<Tabs>
<TabItem value="react-vite" label="React + Vite" default>

The [React shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop) (React 19, Vite 8, React Router) calls `init` in `src/keploy.ts`, above. `src/main.tsx` imports that module before anything else, so the capture starts before the app's own code runs:

```tsx title="src/main.tsx (excerpt)"
// Keploy UI capture first, so it starts before any of the app's code: see keploy.ts.
import "./keploy";
```

Vite reads the endpoint and key from `.env` into `import.meta.env`, and `src/vite-env.d.ts` declares the two variables for TypeScript:

```bash title=".env"
VITE_KEPLOY_INGEST_ENDPOINT=https://api.keploy.io/ui/v1/ingest
VITE_KEPLOY_INGEST_KEY=kep_YOUR_INGEST_KEY
```

Vite builds the SDK's own files as chunks of your build, beside rrweb's, and emits its body worker as a file. Deploy every file the build emits: see [Bundlers and frameworks](./bundlers.md#vite).

</TabItem>
<TabItem value="nextjs" label="Next.js (App Router)">

The [Next.js shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-next-shop) (Next.js 16 App Router) starts the capture from `instrumentation-client.ts`, at the shop's root: Next.js runs that file in the browser before the app hydrates.

```ts title="instrumentation-client.ts (excerpt)"
// Next.js runs this file in the browser before the app hydrates, so Keploy
// UI capture starts from here. lib/keploy.ts does the work.
import "./lib/keploy";
```

`lib/keploy.ts` makes the React shop's `init` call. It reads the endpoint and key from `NEXT_PUBLIC_` variables:

```ts title="lib/keploy.ts (excerpt)"
const endpoint = process.env.NEXT_PUBLIC_KEPLOY_INGEST_ENDPOINT;
const apiKey = process.env.NEXT_PUBLIC_KEPLOY_INGEST_KEY;
```

And it starts nothing on the server, where Next.js renders the pages too:

```ts title="lib/keploy.ts (excerpt)"
/** Settles once capture has started, or once it is off, declined or refused. */
export const captureStarted: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : startCapture().catch((err: unknown) => {
        console.error("[shop] Keploy UI capture did not start:", err);
      });
```

```bash title=".env"
NEXT_PUBLIC_KEPLOY_INGEST_ENDPOINT=https://api.keploy.io/ui/v1/ingest
NEXT_PUBLIC_KEPLOY_INGEST_KEY=kep_YOUR_INGEST_KEY
```

Next.js writes `NEXT_PUBLIC_` variables into the page when it builds it, so build again after you change them.

The SDK records the requests the browser makes. A fetch in a server component runs on the server and is not part of the recording; the shop's pages are client components that fetch their data in the browser. Next.js's own requests from the browser are recorded too: a `<Link>` fetches its page's server component payload (`GET /products?_rsc=…`) as it prefetches or when it is followed.

</TabItem>
<TabItem value="html" label="Plain HTML (no bundler)">

Without a bundler, serve the package's `dist/` directory as it is and import `dist/index.mjs` from it. The SDK imports `rrweb` by name, so map that name with an import map before the SDK loads. The [plain HTML shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-html-shop)'s server, `server.mjs`, serves `node_modules/@keploy/capture-sdk/dist/` at `/vendor/capture-sdk/` and rrweb's `dist/` at `/vendor/rrweb/`, and every page has these lines in its `<head>`:

<!-- prettier-ignore -->
```html title="pages/index.html (excerpt)"
    <!-- The SDK imports rrweb by name; with no bundler, an import map says where it is. -->
    <script type="importmap">
      { "imports": { "rrweb": "/vendor/rrweb/rrweb.js" } }
    </script>
    <!-- Keploy UI capture, on its own and async, so the page's script never waits for it: see app/keploy.js. -->
    <script type="module" async src="/app/keploy.js"></script>
```

`app/keploy.js` is the React shop's `src/keploy.ts` in plain JavaScript, with the SDK imported by its path:

```js title="app/keploy.js (excerpt)"
import {KeployCapture} from "/vendor/capture-sdk/index.mjs";
import {apiKey, endpoint} from "/keploy-config.js";
```

- **Serve the whole `dist/` directory**, not `index.mjs` alone. The SDK loads its other files from beside `dist/index.mjs`: its body redaction code, its GraphQL code, its body worker and, under `privacyMode: "strict"`, its attribute list. A page that serves `index.mjs` alone records each request and response body as not captured, and refuses every strict capture.
- **Install rrweb yourself**, at a version inside the SDK's own `rrweb` range, so that npm installs one copy, at `node_modules/rrweb`. The shop's `package.json` lists `"rrweb": "2.2.2"`.
- **The endpoint and key** come from the shop's `.env`, which its server hands to `app/keploy.js` as `/keploy-config.js`. On your own static site, write them into your `keploy.js`: an ingest key is safe to ship in a page.

```bash title=".env"
KEPLOY_INGEST_ENDPOINT=https://api.keploy.io/ui/v1/ingest
KEPLOY_INGEST_KEY=kep_YOUR_INGEST_KEY
```

Every link on this site loads a page, so each page load starts its own capture and is a session of its own, and a page's flows never span two pages. If the import map is missing or rrweb cannot load, the capture ends before anything is sent, with [`KUI_E_DOM_RECORDER_UNAVAILABLE`](./errors.md#kui-e-dom-recorder-unavailable). A Content-Security-Policy must allow the import map, an inline script: see [Content-Security-Policy and workers](./csp-and-workers.md#without-a-bundler).

</TabItem>
</Tabs>

## Choose a privacy mode {#choose-a-privacy-mode}

Masking happens in the browser, before anything is sent. `privacyMode` sets how much the SDK records:

| `privacyMode`                | Typed values                               | Visible text                                                    | Request and response bodies |
| ---------------------------- | ------------------------------------------ | --------------------------------------------------------------- | --------------------------- |
| `"balanced"` (the default)   | Masked in every input, textarea and select | Recorded, except inside `maskSelectors`                         | Recorded, redacted          |
| `"strict"`, for public sites | Masked                                     | Masked, and every attribute value that can hold text is blanked | Not recorded                |
| `"off"`                      | Masked only in password and hidden fields  | Recorded, except inside `maskSelectors`                         | Recorded, redacted          |

`"strict"` also replaces every query value in a URL. Under `"balanced"` and `"off"`, a body's values under a credential's name, such as `password` or `token`, are replaced with `[REDACTED]` before it is sent.

The dashboard's setup card and the REST API's `init` snippet set only `endpoint` and `apiKey`, so they record under `"balanced"`. The samples write `privacyMode: "balanced"` out, so the choice is visible in the code. Strict still records `data-testid` values as written, so never build one from user data. [Privacy and masking](./privacy.md) covers every rule, and what each mode still records.

## Keep the key in configuration {#keep-the-key-in-configuration}

- **The key is safe to ship.** An ingest key can post recordings into the one app it was made for and do nothing else: no reads and no other API. That is why it can sit in a page every visitor can read. Never put any other kind of Keploy key in its place: the ingest server refuses a personal access token with `403`.
- **Read it from the build's configuration**, as the samples do: `VITE_` variables for Vite, `NEXT_PUBLIC_` variables for Next.js. Both are built into the page, so rebuild after you change one.
- **One key records into one app**, the one it was made for: the SDK sends no app of its own, so a key made for another app is accepted, and its recordings go into that app with no error. An app's journey shares are shares of every session the app receives, so give an environment whose visits you don't want mixed with production's, such as staging or CI, an app and a key of its own: see [One app per environment](./ingest-keys.md#one-app-per-environment).

## Visitors who send Do Not Track or Global Privacy Control {#visitors-who-send-do-not-track-or-global-privacy-control}

The SDK honours both signals by default (`honorPrivacySignals: true`). When a visitor's browser sends Global Privacy Control (`navigator.globalPrivacyControl === true`) or Do Not Track (`navigator.doNotTrack === "1"`, or as older browsers spell it), `init()` records, patches and sends nothing for that page load. The SDK then:

- calls `onError` with [`KUI_E_CAPTURE_DECLINED`](./errors.md#kui-e-capture-declined), in a task of its own after the `init()` call, for every declined `init()` except one made while 16 already wait for their hand-over;
- writes one `console.info` line per page, not a `console.error`.

Some browsers send Global Privacy Control by default, Brave and DuckDuckGo among them, so expect this from a share of your real visitors. It is not an error: return early on `KUI_E_CAPTURE_DECLINED` in `onError` and keep it out of your error tracking, as the samples' `onError` does. Calling `init()` again does not help: every `init()` is declined while the browser sends the signal.

Set `honorPrivacySignals: false` only where your site has its own lawful basis to record such visitors and says so in its privacy policy. The SDK then records regardless of the signals.

## Handle errors {#handle-errors}

`onError` is called once when a condition that ends the capture happens: the ingest server refused a batch (a revoked key, a wrong endpoint), or the SDK refused to start (rrweb could not load, a conflicting privacy option, the visitor's privacy signal). Branch on `err.code`, never on the message. The samples' `onError`, above, returns on `KUI_E_CAPTURE_DECLINED` and logs every other code.

- **A refusal before anything is sent does not reject `init()`.** It reaches `onError` in a task of its own, and `init()` resolves once the handler has run.
- **Warnings don't call `onError`.** The capture goes on, and the SDK writes one `console.warn` line with the code, such as [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable).
- **A `429`, a `5xx` or a network failure is not an error.** The SDK retries with backoff and never calls `onError` for it.

[UI Capture errors and warnings](./errors.md) explains every code: what happened, why, and how to fix it.

## Check that it works {#check-that-it-works}

1. **Open your app with your browser's developer tools.** `KeployCapture.getSessionId()` returns the id of the session being recorded, and `""` when no session is live; the samples log it as `[shop] Keploy UI capture is recording session <id>`.
2. **Watch the Network tab.** While you click around, the SDK posts a batch to `/ui/v1/ingest` every few seconds (every 5 seconds by default), and each is answered `200`.
3. **Check that sessions arrive in Keploy.** The dashboard's setup card counts them under **3. Check that sessions arrive**, and `GET /client/v1/apps/<appId>/ui/capture-status` reports the same: see [Watch the sessions arrive](./quickstart-dashboard.md#watch-the-sessions-arrive) and [Capture status](./rest-api.md#capture-status).

Nothing is posted? Check the console for a `KUI_E_` code, and test in a browser that sends neither Do Not Track nor Global Privacy Control: in one that does, nothing is recorded, as above. A `401` or `403` on those posts means the key is missing, unknown, expired, revoked or not an ingest key.

## Other bundlers and frameworks {#other-bundlers-and-frameworks}

The SDK's tests build it with webpack 4 and 5, Parcel 2, Next.js (Turbopack and webpack), Vite, esbuild, and with no bundler. [Bundlers and frameworks](./bundlers.md) says what each needs. If your site sends a Content-Security-Policy, read [Content-Security-Policy and workers](./csp-and-workers.md).

## Related

- [Dashboard quickstart](./quickstart-dashboard.md)
- [Privacy and masking](./privacy.md)
- [Single-page apps and navigation](./spa-navigation.md)
- [Bundlers and frameworks](./bundlers.md)
- [UI Capture errors and warnings](./errors.md)
