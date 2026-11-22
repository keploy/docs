---
id: capture-sdk-3-2-0-release-notes
title: "@keploy/capture-sdk 3.2.0 release notes"
sidebar_label: UI Capture SDK 3.2.0 release notes
description: What changes in @keploy/capture-sdk 3.2.0, the Keploy UI Capture browser SDK, from 3.1.0, including synchronous network capture before rrweb loads, deferred body-worker startup, clean init error teardown and npm metadata updates.
tags:
  - UI capture
  - capture SDK
  - release notes
keywords:
  - UI capture
  - capture SDK
  - "@keploy/capture-sdk"
  - "3.2.0"
  - release notes
  - upgrade
  - network capture
  - rrweb
toc_max_heading_level: 3
---

3.2.0 is published under the npm `latest` tag. A project that depends on
`^3.1.0` (or `^3`) gets it the next time its lockfile is updated (for
example `npm update`, or an install with no lockfile). To stay on 3.1.0,
pin `3.1.0` (or `~3.1.0`).

There are **no breaking changes from 3.1.0**. Nothing in the public API
was removed or renamed, no options or defaults changed, no new error or
warning codes were added, and TypeScript code written against 3.1.0
compiles unchanged. If you are upgrading from 3.0.1, read the
[3.1.0 release notes](./capture-sdk-3-1-0-release-notes.md) first.

This package records. Keploy turns the recordings into deduplicated
flows and, in beta, into Playwright tests that replay recorded journeys
against recorded mocks. Generating and running those tests is Keploy's
side, not the SDK's: nothing in this package generates or runs a test.

## Behaviour changes and fixes

### 1. Initial page-load `fetch` and `XMLHttpRequest` calls are captured while rrweb loads

In 3.1.0, `KeployCapture.init()` waited for `import("rrweb")` (and,
under `privacyMode: "strict"`, `strict-attributes`) to resolve before it
patched `fetch` and `XMLHttpRequest`. Because bundlers usually emit
rrweb as a separate async chunk, requests a page fired immediately after
an unawaited `init()` were not recorded (only an `init()` called while
offline patched early).

In 3.2.0, network capture starts synchronously inside `init()` — once
the synchronous start checks (`privacyMode: "strict"` with
`maskNetworkBodies: false`, `honorPrivacySignals`, `privacy.secretRoutes`
and `privacy.keepRoutes`, `sampleRate` and `sessionIdGenerator`) have
passed — before `import("rrweb")` resolves:

- **`fetch` and `XMLHttpRequest` are patched at once**, so requests your
  page fires right after calling `init()` are recorded while rrweb
  loads.
- **Nothing leaves the browser while held.** The transport stays held
  until rrweb (and under `strict`, `strict-attributes`) has loaded:
  regular flushes, full-batch flushes, keepalive-share flushes,
  `visibilitychange` and `pagehide` do not send held events early.
- **Held events join the session.** Once rrweb loads, held network
  events are delivered in the same session alongside the initial DOM
  snapshot.
- **Clean rollback on failure or early `stop()`.** If rrweb (or
  `strict-attributes`) fails to load, or if `KeployCapture.stop()` is
  called while the import is still in flight, `fetch` and
  `XMLHttpRequest` are restored synchronously, open body relays are cut,
  queued body-redaction jobs are discarded, `stop()` skips its 1 s body
  linger, and all held events and bodies are dropped unsent.
- **Offline starts use the same path.** An `init()` called while the
  browser is offline still waits to import rrweb until the browser is
  back online (unless a service worker controls the page), using this
  same synchronous patch-and-hold path.

Requests made _before_ `init()` is called are still outside the SDK's
reach, so keep calling `init()` as early in startup as you can. When
`networkCapture: false` is set, `fetch` and `XMLHttpRequest` are still
left unpatched.

### 2. Body-worker preparation waits until rrweb loads

For captures that redact bodies (the default, `privacyMode: "balanced"`),
`init()` still requests the main-thread body-redaction chunk
(`dist/body-redact.mjs`) right away beside rrweb, while scheduling the
idle startup of the Web Worker (`dist/body-worker.js`) is now deferred
until rrweb resolves. A slow, failed, or cancelled `init()` therefore
does not start a worker early.

### 3. Clean teardown when `init()` throws

If `init()` throws an unexpected error after creating the capture
instance, the SDK now runs capture teardown before releasing the
singleton and rethrowing, so `fetch` and `XMLHttpRequest`, listeners and
timers are restored cleanly and a later `init()` starts fresh.

## Package and README updates

- **`homepage` set in `package.json`.** The npm package now declares
  `homepage: "https://keploy.io/docs/running-keploy/ui-capture/"`, so
  the package page on npm links directly to the UI Capture guide.
- **README updates.** The package README now links to the
  [3.1.0 release notes](./capture-sdk-3-1-0-release-notes.md), removes
  its pre-publication 404 notices, and updates the dashboard flows
  screenshot alt text to match the current Flows tab UI.

## Size

Measured on the published 3.2.0 tarball with Node's `zlib.gzipSync` (the
same check the package runs before publish):

- `dist/index.mjs`: about **40.9 kB gzipped** (40,939 B; budget
  40,960 B);
- `dist/index.js` (CommonJS): **41.1 kB gzipped** (41,135 B; budget
  41,316 B);
- `dist/index.bundler.mjs` (the `module` field build): **40.9 kB
  gzipped** (40,915 B; budget 40,960 B).

All builds stay within the unraised 3.1.0 budgets (rrweb not included).
The lazy chunks and worker are unchanged:

- `dist/body-redact.mjs`: about 9.7 kB gzipped (9.9 kB CommonJS),
  requested at `init()` beside rrweb for captures that record bodies;
- `dist/body-worker.js`: about 9.3 kB gzipped, started in the next idle
  period after rrweb loads;
- `dist/strict-attributes.mjs`: about 1.3 kB gzipped (1.5 kB CommonJS),
  under `privacyMode: "strict"` only;
- `dist/request-term.mjs`: about 1.2 kB gzipped (1.4 kB CommonJS), on
  pages that send a body that could be GraphQL.
