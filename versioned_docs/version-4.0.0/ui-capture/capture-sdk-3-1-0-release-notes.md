---
id: capture-sdk-3-1-0-release-notes
title: "@keploy/capture-sdk 3.1.0 release notes"
sidebar_label: UI Capture SDK 3.1.0 release notes
description: What changes in @keploy/capture-sdk 3.1.0, the Keploy UI Capture browser SDK, from 3.0.1 and from its release candidates, and what to check before you upgrade.
tags:
  - UI capture
  - capture SDK
  - release notes
keywords:
  - UI capture
  - capture SDK
  - "@keploy/capture-sdk"
  - "3.1.0"
  - release notes
  - upgrade
  - honorPrivacySignals
  - onError
  - privacyMode strict
toc_max_heading_level: 3
---

3.1.0 is published under the npm `latest` tag. A project that depends on
`^3.0.1` (or `^3`) gets it the next time its lockfile is updated (for
example `npm update`, or an install with no lockfile). To stay on 3.0.1,
pin `3.0.1` (or `~3.0.1`).

Nothing in the public API was removed or renamed. One new option is on
by default (`honorPrivacySignals`), many behaviours changed, the recorded data
has new shapes, the SDK loads new files at run time, and some TypeScript
code written against 3.0.1 no longer compiles. Read the next two sections
before you upgrade.

This package records. Keploy turns the recordings into deduplicated
flows and, in beta, into Playwright tests that replay recorded journeys
against recorded mocks. Generating and running those tests is Keploy's
side, not the SDK's: nothing in this package generates or runs a test.
Where these notes say what replay does with a recorded value, they
describe how that beta replay reads it.

Two release candidates, `3.1.0-rc.1` and `3.1.0-rc.2`, were published
under the `next` tag only. If you ran one, the last section lists what
changed since.

## Before you upgrade: checklist

- Using `privacyMode: "strict"`? Remove `privacy.maskNetworkBodies: false`
  and don't pass `defaultPrivacyConfig()` beside it, or the capture will
  not start (1).
- Filter `KUI_E_CAPTURE_DECLINED` out of your error reporting (2).
- Call `init()` again from `onError` only after changing what was
  refused, and don't make rendering or routing wait on
  `await KeployCapture.init()`: a refused one can take up to about 30 s
  to resolve (3).
- In unit tests with fake timers, advance them, or a refused `init()`
  does not resolve (3).
- If your error tracker groups errors by stack, expect a refused
  `init()`'s errors to group together: their `err.stack` shows the SDK's
  hand-over, not your `init()` call (3).
- TypeScript: update `onError` handlers and anything exhaustive over the
  SDK's error or warning codes (7).
- Make sure your build ships the SDK's extra files and your
  Content-Security-Policy allows them: rrweb's chunk (8), the body worker
  `dist/body-worker.js` with `worker-src 'self'`, the chunk
  `dist/body-redact.*` (13), the GraphQL term chunk `dist/request-term.*`
  ("GraphQL requests") and, under strict, `dist/strict-attributes.*` (5).
- If anything reads recorded bodies, expect new notes in place of some of
  them: `[Response body not read by the page]` (11), `[Body cut: ...]`
  (13, 14), `[Body not captured: ...]` (14) and more `[REDACTED]` (17).
- If you rely on text typed into rich-text editors being recorded under
  `balanced`, it no longer is (4).
- Under strict, give controls that have only a label a `data-testid` (5).
- Tests or dashboards that expect one flow per single-page-app visit now
  get one flow per route (15).

## Behaviour changes

### 1. `privacyMode: "strict"` with `privacy.maskNetworkBodies: false` no longer starts

Strict mode now records no request or response bodies (see 6). A config
that asks for strict mode and also sets `privacy.maskNetworkBodies: false`
contradicts itself, so the SDK refuses to start, for every visitor:

- nothing is recorded, patched or sent, and `init()` still resolves,
  once `onError` has run (see 3);
- a `console.error` line is written, once per page load, and `onError`
  receives `KUI_E_PRIVACY_CONFLICT` in a task of its own (see 3), with
  `evidence: { privacyMode: "strict", option: "privacy.maskNetworkBodies" }`;
- this check runs before the privacy-signal check (see 2), so you also see
  it in a browser that sends Global Privacy Control.

This also catches `privacy: defaultPrivacyConfig()` (or a spread of it)
beside `privacyMode: "strict"`, because `defaultPrivacyConfig()` sets
`maskNetworkBodies: false`.

**What to change:** delete `maskNetworkBodies: false` (or drop that key
from what you pass), since strict mode already masks bodies. If you need
bodies recorded, use `privacyMode: "balanced"` instead.

### 2. Do Not Track and Global Privacy Control visitors are not recorded

The new option `honorPrivacySignals` defaults to `true`. The SDK treats a
visitor as having opted out when any of these is set:

- `navigator.globalPrivacyControl === true`;
- `navigator.doNotTrack` is `"1"` or `"yes"`;
- `window.doNotTrack === "1"`;
- `navigator.msDoNotTrack === "1"`.

For such a visitor, `init()` resolves, but the capture never starts:

- rrweb is not loaded;
- `fetch` and `XMLHttpRequest` are not patched;
- nothing is sent;
- no session exists, so `getSessionId()` returns `""`.

The SDK also tells you, twice over:

- `onError` is called with `KUI_E_CAPTURE_DECLINED` for **every**
  declined `init()` call, not once per page, in a task of its own after
  the call (see 3). The one exception: a declined `init()` made while 16
  others are waiting for their hand-over resolves without it.
  `evidence.signal` is `"globalPrivacyControl"` or `"doNotTrack"`, and
  `status` is `null`.
- A `console.info` line is written once per page load.

With `continuous: true` no session starts either.

**Consequence:** Brave and DuckDuckGo send GPC by default, so their
users are not recorded unless they turn it off. If your `onError` forwards every error to an
error tracker, it now files one event for each declined `init()` it is
told of. Filter it out:

<!-- prettier-ignore -->
```ts
onError: (err) => {
  if (err.code === "KUI_E_CAPTURE_DECLINED") return; // the visitor opted out; nothing failed
  // ...
}
```

**To opt out:** set `honorPrivacySignals: false`, and the SDK records
those visitors anyway. Do this only if your site has its own lawful basis
to record them and your privacy policy says so.

### 3. `onError` runs in a task of its own, and repeated refusals are paced

In 3.0.1, `onError` was called for a server rejection and for an invalid
`sessionIdGenerator`; the second ran in `init()`'s microtasks, before
`init()` resolved. In 3.1.0 it is also called, before anything is sent,
for a declined visitor (2), a conflicting config (1), an invalid privacy
route (17), and rrweb or strict's allow-list failing to load (8).

**How a refused `init()` reaches `onError`.** This covers every refusal
above but a server rejection, which reaches `onError` as in 3.0.1:

- **In a task of its own.** The capture ends and the singleton is
  released first. Then `onError` runs in a timer (`setTimeout`) task,
  never inside the refused `init()` call and never in its microtasks. A
  load that fails only after an offline start (8), or after a leave held
  it (14), is handed over the same way, after `init()` has resolved.
- **`init()` resolves after its handler.** A refused `init()` resolves
  once its `onError` has run, so code after
  `await KeployCapture.init(...)` sees what the handler did.
- **Repeated refusals of one code are paced.** Per page and per code, at
  most one hand-over is scheduled at a time. A refusal of that code made
  while one is scheduled joins it, and that hand-over tells each joined
  refusal in the order they came, each `init()` resolving after its own
  handler. A hand-over scheduled soon after its code's last one (within
  that one's wait plus 1 s of when it ran) waits twice as long as the
  last one did, counted from when the last one ran: 50 ms the first
  time, doubling up to 30 s. Otherwise it runs in the next task. So no
  refused `init()` is scheduled more than 30 s out.
- **At most 16 refusals of a code wait.** A refused `init()` made while
  16 of its code are waiting resolves at once, without calling `onError`,
  and the SDK keeps nothing of it. Every other refused `init()` is told
  when its hand-over's timer runs. The SDK's error spec moves to
  `sdk-errors` v5, which states the hand-over and this one exception.
- **The console line is written once per page load, per code.** That
  holds for the `console.error` line of a conflicting config, an invalid
  route or `sessionIdGenerator` and a failed load (3.0.1 wrote an invalid
  generator's line on every `init()`), and for a decline's
  `console.info` line. A server rejection still writes its line every
  time.

**A handler may still call `init()` again**, since the capture has
ended. Do it only after changing what was refused: a declined visitor, a
conflicting config, an invalid route and a `sessionIdGenerator` that
returns the same bad id fail the same way on the next `init()`, and a
chunk that failed to load can fail again. For example, re-init after dropping a `sessionIdGenerator` that
returned a bad id, or after rotating a key on
`KUI_E_INGEST_KEY_REJECTED`. A handler that re-inits the same config for
every refusal above, even twice for each one, never recurses or freezes
the page: it goes round 11 times in its first minute, then twice a
minute, and each round runs at most 16 handlers. A server rejection is
not paced: a handler that re-inits the same config on one is called
again for each upload the server rejects.

**What this changes for your code:**

- **An awaited `init()` can take up to about 30 s.** Suppose a page
  calls `init()` again and again, less than about a second apart, and
  each is refused: a single-page app that calls it on every route change,
  say, for a visitor who sends GPC. Its refusals are then told at the
  code's growing waits, and an awaited `init()` resolves only at the
  code's next hand-over, up to about 30 s after the call (longer in a
  hidden tab, whose timers the browser throttles). Don't make rendering
  or routing wait on `await KeployCapture.init()`.
- **Fake timers.** A refused `init()` resolves only after a timer task,
  so under fake timers `await KeployCapture.init(...)` for a declined or
  refused config does not resolve until you advance them (for example
  `await vi.runAllTimersAsync()`). Advance them before you switch back to
  real timers: a hand-over left on a fake timer never runs. Later refused
  `init()` calls of its code in that copy of the SDK (in tests, the rest
  of the file) join it: up to 16 wait with it, unresolved, so an awaited
  one hangs until the test times out, and the rest resolve at once,
  untold. What waits is handed over only when a refused `init()` of that
  code finds the lost hand-over more than 31 s past due, or due more than
  31 s ahead (a clock that went back), as `performance.now()` reads it.
  A page that clears timers it did not set can lose a hand-over the same
  way.
- **Many refused `init()` calls in one test file.** The pace is kept per
  loaded copy of the SDK, so the tests of one file share it. If each test
  awaits a refused `init()` of the same code right after the last, the
  second waits 50 ms and each one after waits twice as long as the one
  before: the ninth waits 6.4 s, past a 5 s test timeout. Use fake
  timers and advance them, or load the SDK afresh for each test (for
  example `vi.resetModules()`, then import it again). The console line
  is written once per code per copy too, so only the first test that
  triggers a code sees it: a suite that expects the `sessionIdGenerator`
  line in each of several tests, as 3.0.1 wrote it, now sees it only in
  the first, unless each test loads the SDK afresh.
- **`err.stack` shows the SDK's hand-over, not your `init()` call.** The
  error `onError` gets for these refusals is built when it is handed
  over, in the SDK's timer task, so its stack shows that task, not the
  code that called `init()`. An error tracker that groups errors by stack
  puts all of one code's refusals in one group. The error's `code`,
  `message`, `evidence` and `remedy` are as before.

### 4. Rich-text editors are masked under `balanced`

In 3.0.1, rrweb's input masking reached `input`, `textarea` and `select`
only, so text typed into a `contenteditable` element (TipTap, Quill,
Lexical, ProseMirror, a plain one) was recorded in clear under `balanced`,
emails and card numbers included.

In 3.1.0, the text of every element inside a `[contenteditable]` (other
than `contenteditable="false"`) is masked under `balanced` and `strict`,
as an input's value is, and `unmaskSelectors` cannot unmask it. `off`
records it.

**Consequence:** a page that makes a large region editable (a page builder,
a notes app, a CMS editor) records that whole region as asterisks under
`balanced`, including text the visitor did not type.

### 5. `privacyMode: "strict"` masks more, and records no page text

In 3.0.1, strict mode did two things: it masked input values, and it
replaced every visible text node with asterisks. Network data was
recorded exactly as in `"balanced"`, and every attribute was recorded as
written. In 3.1.0, strict mode records no typed text, no visible text and
no bodies:

- **Bodies.** Strict forces `privacy.maskNetworkBodies` on (see 6).
- **Request URLs.** Every query value is replaced with `[REDACTED]`, and
  every parameter name is kept. For example,
  `/search?q=ada%40example.com&page=2` is recorded as
  `/search?q=[REDACTED]&page=[REDACTED]`. An empty value and a bare name
  (`?flag`) are recorded as written. Such a request does not match a live
  one at replay today (see "Redacted values and replay" in 17).
- **The page's own URL, the session's referrer and every URL in the
  DOM.** Every query value and every fragment-pair value is replaced, and
  names are kept. So the page URL in a recording can differ from the URL
  the visitor saw, for example `?page=[REDACTED]`.
- **Headers.** Every request and response header value is replaced with
  `[REDACTED]`, and its name is kept. The exceptions are these 18
  headers, whose values are kept: `accept`, `accept-encoding`,
  `accept-ranges`, `age`, `cache-control`, `connection`,
  `content-encoding`, `content-language`, `content-length`,
  `content-type`, `date`, `etag`, `expires`, `keep-alive`,
  `last-modified`, `pragma`, `transfer-encoding` and `vary`.

**Text in attributes, the head and comments.** Text lives in more places
than text nodes. A page that copies a visitor's search into
`<meta name="description">` sent the search to the ingest in clear under
3.0.1's strict mode. Strict now reads attributes by an allow-list. An
attribute keeps its value only if its name is part of the page's
structure: `id`, `class`, `role`, `name`, `type`, `data-testid`, ARIA
state and relationships, form and layout attributes, SVG geometry and
paint (on SVG elements only), or rrweb's own. It also keeps its value if a
rule of its own reads it: URLs (with every query value replaced), CSS,
`srcset` and `srcdoc`. Every other value is recorded as an empty string.
That covers:

- `title`, `alt`, `placeholder`, `aria-label` and the other `aria-*` text;
- every `data-*` attribute except `data-testid` and a lazy loader's
  `data-src`, `data-href` and `data-srcset`, which are read as URLs (path
  kept, query values replaced);
- every `value` that rrweb records in clear, including a checkbox's,
  radio's or button's. A field value that rrweb already masked keeps its
  asterisks;
- an input's `min`, `max` and `pattern` (a date range copies the picked
  start into the end's `min`; a confirm field copies a typed email into
  `pattern`);
- framework state, such as `wire:snapshot`, `x-data`, `hx-vals` and an
  Astro island's `props`;
- a custom element's attributes, except its global ones (`id`, `class`,
  `slot`, ARIA state);
- a `<meta>`'s `content`, unless the meta configures the page
  (`http-equiv`, or a `name` of `viewport`, `color-scheme`,
  `theme-color`, `referrer`, `robots` or `format-detection`);
- comments;
- every ARIA attribute that reflects a choice or an entry
  (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-valuetext`,
  `aria-checked`, `aria-selected`, `aria-pressed`, `aria-current`,
  `aria-sort`, `aria-invalid`, `aria-activedescendant`). HTML's `checked`
  and `selected` are dropped altogether;
- a URL-named attribute (`href`, `src`, `action` and the rest) that holds
  text rather than a URL;
- text, attributes, scripts and comments inside a `srcdoc`.

The `<title>` element's text and SVG `<text>` were already masked as text
nodes. A checkbox's or radio's value in an Input event is asterisks; the
event still says whether it is checked.

**Still recorded under strict:** URL paths (`/search/<term>`, a hash route,
a `<link rel="canonical">`, a lazy image's `data-src`), `id`s, `class`es, a field's `name`, SVG
geometry (a signature pad's strokes), text under `unmaskSelectors`, a
comment outside `<html>` that changes after the snapshot, and
`data-testid`, **exactly as written**, because replay finds elements by
it. An app that builds a test id from user data (`row-${email}`) records
that data. Do not put a visitor's text in any of these.

**Strict recordings look different, and name elements differently.** A
strict recording no longer carries `aria-label`, so the flow engine names
an element by `data-testid`, a stable `id`, or its tag and class names
instead. Add
`data-testid` to controls that have only a label. Played back as a
session recording (with rrweb's player), a strict recording also looks
different: CSS keyed on a `data-*` (`[data-theme=dark]`, Radix's
`data-state`) or on a `title` no longer matches, `<progress>` and
`<meter>` show no value, and animated or filtered SVG and legacy table
attributes (`bgcolor`, `cellpadding`) play back without them. On a
Docusaurus site (measured on keploy.io/docs), the playback keeps the
layout, colours, cards and icons, with the text masked; the themed logo
and the colour-mode toggle's icon disappear, because Docusaurus shows them
through `[data-theme]` CSS.

**The allow-list is a chunk only strict loads.** It is
`dist/strict-attributes.mjs` (about 1.3 kB gzipped; `.js` for CommonJS,
1.5 kB). `balanced` and `off` never download it. Under `strict` the SDK
imports it at `init()`, in parallel with rrweb, and records nothing until
both have loaded. A bundler emits it as a chunk: deploy every chunk your
build emits. With no bundler, serve `dist/` as it is. **If the chunk
cannot be loaded** (a Content-Security-Policy, a network failure, a
deployment that dropped the file), the capture ends before anything is
recorded or sent, with the new `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`.

Strict mode still records each request's method, URL path, status,
duration and header names, and its new `requestTerm` (see "GraphQL
requests"; Keploy's hosted service does not use it yet). For a GraphQL
request, that term holds the operation name and
a hash of the query document with every literal blanked. It is computed
from the raw body before masking, so it is recorded even though the body
itself is `[MASKED]`.

### 6. Bodies masked whole are decided without reading them

This applies to every capture with `privacy.maskNetworkBodies: true`, in
any mode, and to every strict capture (strict forces the option on).

In 3.0.1, such a capture read each body and recorded `[MASKED]`, or `null`
when the body was empty. In 3.1.0 it decides from what the body is,
without reading it:

- the Response your page gets is the network's own, never read, cloned or
  relayed by the SDK;
- a body passed in `fetch()`'s `init` or to `XMLHttpRequest.send()` is
  decided from its kind and size, never serialised or decoded. A string
  body is still scanned for its `requestTerm` (see "GraphQL requests");
- the body-redaction code (see 13) is never loaded.

A body is recorded `null` when it is absent: a request sent with no body
or an empty one; a `fetch` response to a `HEAD`, a `204`, `205` or `304`,
one with `Content-Length: 0`, and one whose `body` is `null` or already
locked; an XHR text response that is empty. Every other body is
`[MASKED]`, including an XHR `Blob` (even an empty one), an XHR `json`,
`blob` or `arraybuffer` response, and **a `fetch` response that does not
declare its length, even if it turns out empty** (3.0.1 recorded that one
`null`).

One body is still copied and read, and only as far as its `requestTerm`
needs: the body of a `Request` object you pass to `fetch()`
(`fetch(new Request(url, { body }))`, as ky and axios's fetch adapter send
it). The SDK copies it as your page calls `fetch()` and reads the copy
after that call returns: whole when it starts as a JSON object, its first
KiB otherwise, and a multipart one is parsed.

### 7. TypeScript: handlers written for 3.0.1 may not compile

`CaptureErrorCode` grew from 5 codes to 10, and `AnyCaptureError` grew
from 2 classes to 7. The new codes, with their classes, are:

- `KUI_E_DOM_RECORDER_UNAVAILABLE` (`DomRecorderRefusal`);
- `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE` (`StrictAttributesRefusal`);
- `KUI_E_PRIVACY_ROUTE_INVALID` (`PrivacyRouteRefusal`);
- `KUI_E_CAPTURE_DECLINED` (`CaptureDeclined`);
- `KUI_E_PRIVACY_CONFLICT` (`PrivacyConflict`).

**The `onError` example in the 3.0.1 README no longer compiles.** It ends
with a fallback branch that reads `err.evidence.issues`. That branch now
also receives the five new classes, and their `evidence` has no `issues`:

```
error TS2339: Property 'issues' does not exist on type '... | Readonly<{ reason: string; }> | ...'.
```

The same change breaks two other common patterns:

- a `switch (err.code)` that is exhaustive with a `never` default fails
  with TS2322;
- a `Record<CaptureErrorCode, …>` that lists the five 3.0.1 codes fails
  with TS2739.

Three more types grew, and break the same patterns:

- `CaptureWarningCode` grew from 2 codes to 6 (see "Error codes"), and
  `CaptureWarningEvidence` with it;
- `CaptureEvidence` grew from 2 members to 6;
- `CaptureRemedy` has a new required field, `docs`, so code that builds a
  `CaptureRemedy` object of its own must add it.

**Fixes:**

- **Smallest fix.** Read `err.issues` instead of `err.evidence.issues`.
  Every `CaptureError` has an `issues` field, and it is `null` when the
  server sent none. This one change compiles against both 3.0.1 and
  3.1.0.
- **Or narrow first.** Guard the branch with
  `if (err instanceof IngestRejection)` (it is exported), then read
  `err.evidence.issues` inside it.
- **Update exhaustive code.** Add the new codes to exhaustive switches and
  to `Record<CaptureErrorCode, …>` and `Record<CaptureWarningCode, …>`
  tables.
- **Filter declines.** Drop `KUI_E_CAPTURE_DECLINED` before you report
  errors (see 2).

**Plain JavaScript handlers** are not affected by the types. At runtime,
though, they now receive the five new codes. `remedy.manual` has also
changed: it used to hold the remedy's prose and now holds a link to the
error's docs page. `remedy.manual` is deprecated; read the new
`remedy.docs`, which holds the same link.

### 8. If rrweb (or strict's allow-list) cannot be loaded, the capture stops

In 3.0.1, if `import("rrweb")` failed, `init()` resolved and the SDK
recorded no page activity, silently. Network calls were still recorded
and sent.

In 3.1.0, the SDK refuses the capture instead, in any environment that
has a `window`: a browser, or a jsdom-based test environment.

- Nothing is sent, and `fetch` and `XMLHttpRequest` are not patched.
- A `console.error` line is written, once per page load.
- `onError` receives `KUI_E_DOM_RECORDER_UNAVAILABLE` in a task of its
  own (see 3), and `evidence.reason` holds the browser's error. Under
  strict, a failed allow-list chunk is refused the same way, as
  `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`.
- Where there is no `window`, as in server-side rendering, there is no
  refusal: the SDK behaves there as 3.0.1 did.

The usual causes are:

- the ESM build loaded without a bundler and without an import map for
  `rrweb`;
- rrweb's chunk blocked by a Content-Security-Policy or by the network.

**A page that starts offline** does not load rrweb (or, under strict, the
allow-list) until the browser is online again, unless a service worker
controls the page. Meanwhile, the page's network calls are recorded but
held, not sent. If rrweb then fails to load, the capture is refused as
above, and what was held is dropped unsent. Calling `stop()` while it
waits also drops what was held.

### 9. A dropped page event holds page recording until a fresh snapshot is sent

3.0.1 went on recording clicks, typing and DOM changes after the page
snapshot they refer to had been dropped (an oversized snapshot, a full
queue). Those events then named nodes the recording never showed. 3.1.0
holds them instead.

When a DOM event is dropped (too large to send, or evicted from the
queue), the SDK:

- also discards the page interactions and DOM changes still queued behind
  it, up to the next full page snapshot in the queue;
- records **no further** clicks, typing, scrolling, mouse movement or DOM
  changes until it has taken a fresh full snapshot.

Network calls, route changes and custom events are still recorded.

**Outside an outage**, the SDK retakes the snapshot at once when the
dropped event was a DOM change. When the dropped event was a snapshot, it
retakes one after 5 s, then at doubling waits up to every 60 s, because
each attempt serialises the whole document. **A page whose snapshot never
fits** (over the ingest's 10 MiB cap) therefore records no DOM changes or
interactions at all, and is serialised again every 60 s for as long as it
stays that large. The `KUI_E_EVENT_OVERSIZED` console warning is the only
notice; nothing in the recording marks the gap.

**During an outage.** The SDK now also caps what it holds unsent at
**16 MiB** of JSON, beside `maxQueueSize` (5,000 events by default). Past
the byte cap, the oldest go first: batches that already failed are dropped
whole, then the oldest queued events. While the browser is offline or
uploads are failing, a dropped DOM event takes no retake: the hold stays
until the outage ends, and then the SDK takes **one** fresh snapshot,
queued after everything it held. Page recording resumes when the server
first accepts a batch again. On a page that sends only DOM events, the
outage ends when the queue has emptied while the browser is online, with
no upload accepted, so the snapshot is taken again each time the 16 MiB
cap refills. Interactions made
between the first drop and that snapshot are not in the recording.

The same applies when, during an outage, a tab is shown again or the
capture is resumed after `pause()`, and the page changed while the tab was
hidden or paused: no interactions are recorded until the outage ends.

### 10. Ingest outages: uploads back off

The first batch that fails gets three attempts. The gaps between them are
0.5–1 s and then 1–2 s. After the third attempt fails, 3.0.1 waited up to
4 s more before it put the batch back in the queue. 3.1.0 puts it back at
once.

From then on, uploads count as failing:

- **One attempt per batch.** Each later batch gets one attempt.
- **A wait before each new batch.** The flush timer, a full batch, or an
  event over 32 KiB starts no new upload until a wait has passed. The wait
  is 2 s at first and then doubles: 4, 8, 16 and 32 s, up to a cap of
  60 s. Each wait is also stretched by a random 0–50%, so at the cap it
  lasts 60–90 s. A dead endpoint therefore gets about one scheduled
  request a minute (a page whose only traffic is DOM events also restarts
  the wait each time its queue runs empty).
- **What bypasses the wait.** `stop()`, the tab being hidden, the
  browser's `online` event and the page unloading all still send at once.

**How long recovery takes to notice.** Once the wait has reached its cap,
the SDK can take up to about 90 s after its last failed attempt to try
again. Add up to one `batchInterval` (5 s by default) for the next flush,
so up to about 95 s in all. It notices sooner if the browser fires
`online`, the tab is hidden, or `stop()` is called.

When a batch is accepted again, everything held is sent at once, not one
batch per interval. If page events were dropped meanwhile, the SDK takes
one fresh snapshot (see 9).

**The page is not held up by the back-off.** The wait is a timestamp
check, not something the page's code waits on. While uploads fail, the
SDK also stops re-snapshotting the page (but see the DOM-only case in 9),
and the 16 MiB cap bounds the memory it holds.

### 11. `fetch()`: the page gets the network's own Response, and a body it never reads is recorded as not read

In 3.0.1, the SDK read each response's whole body before `fetch()`
resolved. A streamed response, such as SSE over `fetch`, NDJSON or an
LLM's tokens, therefore reached the page only when it ended, and an
endless stream never reached it at all. Every response body was recorded,
whether the page read it or not.

In 3.1.0, `fetch()` resolves when the headers arrive, as it does without
the SDK, and the body reaches the page as the network delivers it.

**The Response is the network's own object.** Its `url`, `redirected`,
`type`, `headers`, `bodyUsed`, `instanceof Response` and BYOB readers are
the browser's, and a Cache API round trip stores it exactly as without the
SDK. The SDK answers the body readers, `body` and `clone()` with
non-enumerable members of its own on that object.

**The SDK reads a body only as your page reads it** (unless bodies are
masked whole, see 6, or the Response has no `body` member at all: under
a fetch polyfill such as whatwg-fetch, which Mirage JS and pretender install, the
SDK reads a clone, as 3.0.1 did, and records the body whether or not the
page reads it):

- **Read whole** (`text()`, `json()`, `arrayBuffer()`, `bytes()`,
  `blob()`): the browser's own method answers, and the SDK records what
  your app got. A `blob()` is read back from that same `Blob` after your
  code has it, so a page that leaves right after its `blob()` may have
  that exchange recorded cut. `formData()`, and a `json()` your app put on
  `Response.prototype`, are recorded from a copy read only as far as
  `maxBodySize` needs. A clone's whole read (`res.clone().text()`, as ky
  does) is recorded the same way; the first whole read to finish is the
  recording.
- **Read through `res.body`:** the SDK reads the network once for each
  read your page makes, never ahead. A page that cancels or aborts stops
  the download at once, and is recorded with exactly what it read.
- **A clone's `body` is never recorded.** Monitoring tools (Datadog RUM,
  Sentry) read a clone of every response through its stream; that is not
  your app's read. A body your app reads only through a clone's `body` is
  recorded as not read.
- **Never read:** the SDK never reads it either. It is recorded as the
  text `[Response body not read by the page]`, with its real status and
  headers. That includes a body a browser API consumes past JavaScript,
  such as `cache.put(req, res)` or `WebAssembly.instantiateStreaming(res)`.
  Replay sends that text as the body.

**Behaviour change: unread bodies.** A response your page ignores (a
fire-and-forget POST, a prefetch, a check of `res.ok` alone) was recorded
with its whole body in 3.0.1. In 3.1.0 its body is the note above. If
something downstream reads recorded response bodies, expect the note for
those calls.

**Behaviour change: when an unread exchange is recorded.** Not at a
deadline, because a page may read a body tasks later. It is recorded when
the browser garbage-collects the Response, its clones and its stream, or
when the tab is hidden, the page leaves, the capture pauses, or `stop()`
settles. So such an exchange can reach Keploy well after it happened, or
only as the page ends. A mobile browser may discard a hidden tab without
another event, so a body your page first reads after its tab was hidden
and shown again stays recorded as not read.

A response to `HEAD`, and a `204`, `205` or `304`, is recorded with an
empty body. A body that fails part-way (an abort, a dropped connection, a
navigation) is recorded with what had arrived, cut and marked
`...[truncated]`; for a body your page was reading whole, nothing of it is
kept.

**What else your page can see.** Besides the SDK's own members on the
Response (above), a body your code reads by calling the prototype's
method directly (`Response.prototype.text.call(res)`) passes the SDK by,
and is recorded as not read. And a streamed request body built into a
`Request`
(`new Request(url, { body: stream, duplex: "half" })`) that the server
answers early can be read further than without the SDK, up to the chunk
that crosses `3 x maxBodySize + 4` bytes. A stream passed as `init.body`
is not read at all (recorded `[ReadableStream]`).

### 12. `pause()` and `stop()`

- **`pause()` decides by when an exchange happened.** An exchange that
  starts, or is answered, while the capture is paused is not recorded,
  even if its answer arrives after `resume()`. In 3.0.1 an exchange was
  kept or dropped by whether the capture was paused when its record was
  made.
- An exchange still reading its body at `pause()` is recorded at once,
  with what had arrived, cut and marked `...[truncated]`, and nothing of
  it after, `resume()` included. Your page's own read goes on untouched.
- **`stop()`** waits up to 1 s for exchanges already answered to finish
  their bodies, then records any still open (an endless stream) cut at
  that point. An unread body is recorded as not read.
- The promise `stop()` returns also waits, for at most 10 s, for the final
  upload of a capture or session that had already ended on its own (at
  `maxSessionDuration`, at a server rejection, or between `continuous`
  sessions). Awaiting it is optional.

### 13. Body redaction runs in a Web Worker, which your build must ship

In 3.0.1, request and response bodies were redacted on the page's main
thread, by code inside the SDK's bundle. In 3.1.0, a capture that records
bodies (the default, `balanced`) redacts them off the main thread:

- **`dist/body-worker.js`** (about 9.3 kB gzipped), a Web Worker the SDK
  starts in the page's next idle period after the capture starts. The SDK
  creates it as `new Worker(new URL("./body-worker.js", import.meta.url))`,
  which webpack 5, Next.js (webpack and Turbopack), Vite and Parcel 2
  turn into a file of your build;
- **`dist/body-redact.mjs`** (about 9.7 kB; `.js` for CommonJS, 9.9 kB),
  the same code for the main thread, plus the `res.body` relay (see 11).
  `init()` requests it at once, beside rrweb. Your page's network is
  recorded from the start; it never waits for this chunk.

A capture that masks bodies whole (see 6) loads neither. Both files are
new requests your page makes; deploy every file your bundler emits.

**These setups have no worker:**

- **webpack 4**: it cannot parse `import.meta`, so the SDK keeps it out of
  every file webpack 4 reads;
- **esbuild**: it does not emit the worker. Copy
  `node_modules/@keploy/capture-sdk/dist/body-worker.js` beside your
  bundle and it runs;
- **a build that loads the SDK's CommonJS files** (its `require` entry):
  the CommonJS worker start has no `import.meta`, so it starts no worker;
- **an environment with no `Worker`**, such as jsdom in unit tests;
- **assets served from another origin** (webpack's `publicPath` or Next's
  `assetPrefix` on a CDN): a browser runs a worker only from the page's
  own origin;
- **a Content-Security-Policy that refuses it**: allow `worker-src 'self'`
  (or the `child-src` or `script-src` it falls back to);
- **the SDK loaded from a CDN without a bundler**;
- **any other bundler** that does not turn
  `new URL("./body-worker.js", import.meta.url)` into a file. The SDK's
  tests build webpack 5, Next.js, Vite and Parcel 2; with anything else,
  check that your build emits `dist/body-worker.js`.

Each of these setups writes the `KUI_E_BODY_WORKER_UNAVAILABLE` warning
(see 18) once per page load that records bodies, in production too. If
you forward `console.warn` to an error tracker, expect one event per such
page load.

**Without the worker**, the main thread redacts each body, but only its
first 64 KiB. A body over 64 KiB, which 3.0.1 kept whole up to the 512 KB
`maxBodySize`, is recorded cut: its first 64 KiB redacted under the line
`[Body cut: 65536 of N characters kept, unverified]`. Replay reports a test
over a cut body as unproven. **If the body chunk cannot load either** (a
CSP, a 404 after a deploy, `dist/index.mjs` served alone), every body
the page or the SDK read, whatever its size, is recorded as not captured
(see 14), never in the clear; a response body nothing read keeps
`[Response body not read by the page]`. The console says
`KUI_E_BODY_WORKER_UNAVAILABLE` (a warning, see 18) once per page for each
part that failed, `worker` or `code`.

**With no bundler**, serve the package's `dist/` directory as it is,
import `dist/index.mjs` from it, and map `rrweb` alone with an import map.
The SDK loads its chunks and the worker from beside `dist/index.mjs`. An
import map that maps `@keploy/capture-sdk/body-redact`,
`/body-worker-start`, `/request-term` or `/strict-attributes` is honoured
first.

**From a CDN** (jsDelivr, unpkg), import `dist/index.mjs` by its
path. The chunks load from the CDN if it sends CORS headers, as CDNs do;
the worker cannot, so bodies over 64 KiB are cut as above. unpkg's package
root redirects to `dist/index.mjs`. jsDelivr's package root answers with
the file at the root's own URL, where no chunk is beside it, so name the
path there. Two cases to avoid or know about:

- A package-root URL with `?module` serves the `module` field's build,
  `dist/index.bundler.mjs`, which is not meant for a page without a
  bundler: it loads no chunk from beside itself, so it records every body
  as not captured and refuses every strict capture with
  `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`.
- The SDK loads only chunks of its own version. If a CDN hands it another
  version's chunk (unpkg's `?module` rewrites the SDK's own imports to
  the `@latest` version's files), it refuses that chunk and loads its own
  from beside itself.

**The `module` field** now names `dist/index.bundler.mjs` (it was
`dist/index.mjs`), a build for webpack 4 and Parcel without the no-bundler
worker start. The `exports` map still gives `import` `dist/index.mjs` and
`require` `dist/index.js`.

**`PrivacyEngine.maskNetworkData()` called directly** still masks headers
and the URL, but it redacts bodies only once a capture on the page has
loaded the body code. Until then it records each body as `[MASKED]`, never
in the clear. In 3.0.1 it always redacted bodies itself.

### 14. Some bodies are now recorded cut or "not captured"

3.0.1 recorded every body up to `maxBodySize`. 3.1.0 bounds what it holds
for redaction and never sends a body it could not redact, so a body can
now arrive as one of these notes instead. Replay never serves a cut or
not-captured body; a test that reaches one is reported unproven.

**Too much waiting for redaction.** The SDK holds bodies waiting for
redaction (for their idle task, for the worker to start or answer, or for
the body chunk) up to a page-wide bound of 8 Mi UTF-16 units (16 MiB of
strings). Each exchange counts its bodies plus 1,024 units, and counts
again while a copy is posted to the worker, until the worker answers. An
exchange that comes while the bound is full is recorded with nothing of
its bodies kept: `[Body cut: 0 of N characters kept, unverified]`. Nothing
is logged. With bodies of 512 KB (the default `maxBodySize`), that
happens past 16 exchanges in a burst before the page is idle, or past 8
that a slow worker has not answered; smaller bodies take many more. A lone exchange is taken whatever its size when nothing
else is held.

**The page leaves, or `stop()` settles.** Bodies still waiting in the
worker are redacted on the main thread then, up to 64 KiB in all; the
first body past that keeps what is left of the 64 KiB, and the rest are
recorded with nothing kept. If the body chunk has not loaded by then, they
are recorded "not captured" (below).

**Not captured.** The cut note with nothing kept, then a line that says
why. There are three causes:

```
[Body cut: 0 of N characters kept, unverified]
[Body not captured: the page left or the capture stopped before redaction was ready]

[Body cut: 0 of N characters kept, unverified]
[Body not captured: the redaction code could not load]

[Body cut: 0 of 0 characters kept, unverified]
[Body not captured: the page took the body's stream before the redaction code had loaded]
```

- **left:** the page left (or `stop()`'s 1 s bound came) before the body
  chunk had arrived;
- **code failed:** the body chunk could not load at all (see 13);
- **early:** your page took `res.body` before the body chunk had arrived,
  and nothing read the body whole. Such a page gets the browser's own
  stream at once; the SDK never makes a read wait for its chunk. A page
  that only looks at `res.body` and then reads whole (ofetch and Nuxt's
  `$fetch` do `response.body ||`, then `text()`) is recorded as usual.

**While the page is leaving.** The SDK counts the page as leaving from
`beforeunload`, or from a Navigation API navigation to another document
that your app does not intercept or cancel. While it is leaving, the SDK
starts none of its own loads (its chunks, rrweb and the body worker), so
it never holds up the next page; a load the leave cancelled is asked for
again once the page has stayed. During a leave:

- a body answered after the leave began is recorded as **left** at once,
  unless a worker is already running (a page that cannot run a worker at
  all redacts it on the main thread as usual);
- an XHR the leave aborts is recorded as the browser leaves it: status 0,
  no response body;
- a GraphQL request whose term code has not loaded is recorded with the
  term `body:*`, and nothing is logged;
- `init()` never waits on a load the leave holds. If the leave holds
  rrweb's import, `init()` resolves, but no DOM events are recorded and
  nothing is sent until rrweb loads after the leave ends: the page's
  network calls are recorded and held, as for an offline start (8), and
  dropped if rrweb then fails to load. If the leave never ends (below),
  nothing from that page is sent, and nothing is logged.

A route your single-page app intercepts with the Navigation API is not a
leave. Otherwise the leave ends only on proof that the page stayed:
Chromium aborting the navigation (a cancelled "leave page?" prompt), a
`pageshow` from the back/forward cache, or your script starting a capture.
So after a link answered `204`, a download, a cancelled prompt in Firefox
or WebKit, or a `mailto:` link in Chromium, the page counts as leaving
until one of those happens. A continuous capture's next session, which
the visitor's click or key press starts, is not such proof.

### 15. The SDK wraps the History API

To record single-page-app navigations, the SDK now replaces these methods
with wrappers while it captures:

- `history.pushState`, `replaceState`, `back`, `forward` and `go`;
- where the browser has the Navigation API, `navigation.back`, `forward`
  and `traverseTo`.

A router that wraps any of them after the SDK keeps its wrapper when the
capture stops. If the page has made one of them impossible to replace,
the SDK wraps none of them and writes a `KUI_E_NAVIGATION_UNWRAPPED`
warning to the console. Route changes are then still recorded, with less
detail.

**A single-page app's visit becomes one flow per route.** 3.0.1 recorded
no navigation at `history.pushState`, so a visit that changed route by
script was a single flow, on the page where it landed. 3.1.0 records each
route change, and a flow never spans a navigation. The same visit is now
one flow per route, each holding the steps taken there. Tests or
dashboards that expect one flow per visit should look at the flow for
each route instead. This is by design, not an SDK defect: Keploy ties
the visit back together by chaining a session's flows across client-side
navigations into one journey, and journeys, not single flows, are what
Keploy's replay (in beta) runs, so a visit such as "add to cart → cart →
checkout" is replayed end to end (subject to the redacted-value limit in
17).

### 16. Network event timestamps

A `fetch` event's `timestamp` is now when the response's headers arrived,
not when its body finished. A stream's body can end minutes later; the
exchange keeps its place in the recording.

### 17. Redaction is wider, in every privacy mode

Redaction happens in the recorded copy only; the requests your page sends
are not modified.

**What 3.0.1 did.** It redacted JSON body values under credential key
names (`password`, `token`, `secret`, `apikey`, `auth`, `session`,
`cookie`, `pin`, `ssn`, `cvv`, `otp` and names ending in `password`,
`secret`, `token` and the like), the values of eleven credential-named
query parameters, and six default headers. It ran its built-in patterns
(JWTs, email addresses, US phone numbers, SSNs, IPv4 addresses, card
numbers) over header values, JSON string values and other bodies. It
redacted nothing in the DOM or the page's own URL.

**What 3.1.0 adds:**

- **One name rule everywhere.** The same credential-name rule now reads
  JSON keys, form fields, multipart part names, `name=value` pairs in text
  bodies, header names, and query and fragment parameters, so 3.0.1's
  JSON-key names now apply to forms, query strings and headers too. (The
  page's own URL and the DOM's URLs keep `auth`, `session`, `cookie`,
  `pin` and `sig` as an app's own parameters: under `balanced` and `off`
  such a value is scrubbed there only when it is shaped like a token (a
  JWT, or 32 or more letters and digits) or matches a built-in pattern,
  so `?pin=4821` or a 16-character `?session=` value there is recorded.) It also adds
  names 3.0.1 had nowhere, such as `code_verifier`, `passphrase`,
  `totp`, `passcode`, one-time-code names (`reset_code`,
  `verification_code`, `oobCode`), card expiry names (`exp_month`,
  `ccExp`; in JSON, a bare `expiry` only beside a card field), an OAuth
  token
  exchange's `code`, and names ending in `otp`,
  `signature`, `jwt` or `credential` (the README's "Names" list has the
  rest). So form posts,
  `FormData`, `URLSearchParams` and XHR string bodies, which 3.0.1
  recorded with `password=`, `client_secret` and `refresh_token` in clear,
  are now redacted.
- **URLs and `name=value` text inside bodies.** A JSON string value that
  holds a URL has the URL's credential values redacted, and one that holds
  `name=value` pairs has a credential pair redacted where the pair starts
  the string or follows `?`, `&` or a `#` after a path; a string that is
  itself JSON is redacted as JSON. In HTML, XML and other text bodies,
  absolute URLs, link attributes and CSS `url()`s are read the same way (a
  relative URL inside prose is not). A presigned S3, GCS or Azure link
  loses its signing parameters (`X-Amz-Signature`, `X-Amz-Credential`,
  `X-Amz-Security-Token`, `sig`), every other byte kept. 3.0.1 only
  scanned these with its built-in patterns.
- **Headers** whose name reads as a credential's (`X-Access-Token`,
  `X-Csrf-Token`, `Api-Key`, `X-Session-Id` and the like), on top of the
  six defaults. A header that carries a URL (`Location`,
  `Content-Location`, `Link`, `Refresh`) has that URL's query values
  redacted as a request URL's are.
- **Provider keys.** The built-in patterns now also match keys whose
  prefix names them (Keploy `kep_` keys, GitHub, GitLab, Slack, Stripe,
  OpenAI and Anthropic keys, npm tokens, webhook secrets, AWS key ids,
  Google API keys), in headers, bodies and the page. They also run over
  form bodies, as sent and decoded.
- **Request URLs**, which 3.0.1 read only for eleven query names: a
  credential anywhere in a pair's value (nested or encoded, as in
  `?next=/reset?token=…`) replaces that pair's whole value, a path's
  `;jsessionid=` is redacted, user name and password are dropped, and a
  credential from the page's own URL is scrubbed from them (below).
- **The page's own URL, the session's referrer and the URLs in the DOM**,
  which 3.0.1 recorded as they were:
  - credential-named query and fragment values (but see the five names
    above), a token-shaped path
    segment after a reset, invite, verify or magic-link segment
    (`/reset-password/<token>`), and every OAuth authorization response's
    `code` and `state`;
  - values shaped like a token (a JWT, or 32 or more letters and digits
    that are not a slug; a UUID, or any value under an `*id` name, is
    kept) and values a built-in pattern matches (`?email=ada%40x.com`);
  - the page URL's fragment is dropped unless it is a hash router's route
    (`#/cart`), so `#reviews` is no longer recorded;
  - a URL's user name and password are dropped;
  - a crafted URL (path, query and route over 64 KiB, or more than 32
    credential values) is recorded as its origin and `/[REDACTED]`.
- **Credentials from the page's URL are scrubbed from every event**,
  wherever the page or rrweb copied them: DOM, network bodies and
  headers, and custom events. Inside JSON a number holding one becomes the
  string `"[REDACTED]"`; a header or custom-event key holding one is
  renamed (a second key that becomes the same name gets a `#2` suffix), and
  a DOM attribute so named is dropped. An event the scrub cannot read is
  dropped rather than sent.
- **The DOM, in every mode.** Every text node, and every attribute, is
  scanned for JWTs and provider keys. Attributes that hold text (`title`,
  `alt`, `placeholder`, `label`, `aria-label` and the other `aria-*` text,
  a `data-*` that is not a URL, a `<meta>`'s `content`, a button's or
  option's `value`) are also scanned for emails, phone numbers, SSNs,
  IPv4 addresses and card numbers. Matches become `[REDACTED]`.

**Kept now, where 3.0.1 redacted:** a paging cursor (`pageToken`,
`nextPageToken`, `NextToken`, `continuationToken`) is recorded as sent, so
a replay asks for the next page the recording holds; a flag
(`true`/`false`) under a credential's name is kept; and an object under
`otp` is read rather than replaced whole, so `{"otp":{"enabled":true}}`
is recorded as sent (its inner `code` still goes).

**Known over-redaction:** a few names the rule takes hold some apps' plain
data, such as Adyen's public `clientKey`, a `tokenId` or Twilio's `sid`.
Their values are recorded as `[REDACTED]`, and a replay serves that string
where the app had its value. In the same way, a presigned upload or
download URL your app receives in a response is recorded with its
signature redacted, so a replay serves a link that no longer works.

**Known under-redaction: this is recognition, not a guarantee.** A
credential in a shape the rules do not recognise (an unusual parameter
name, a token that is a dictionary word or digits alone, a short token in
a path) is recorded. Past 32 credential values in one page URL, the rest
are not scrubbed from other events. In a browser without the Navigation
API, a credential the page puts in its URL through a `pushState` the SDK
did not wrap, and hides again before the next recorded event, is not
collected. Declare such routes with `privacy.secretRoutes`, and name a
credential parameter like one (anything ending in `token`).

**How recorded bodies are written changed too:**

- a JSON body is redacted in its own text: only the values it replaces
  change, and every other byte (whitespace, key order, escapes, an integer
  past 2^53) is kept as the server sent it. 3.0.1 parsed and re-serialised
  it, which changed whitespace and escapes and rounded large integers;
- a `FormData` body is recorded URL-encoded (`a+b=c%26d`), a file's note
  included (`%5BFile%3A+name%2C+N+bytes%5D`). 3.0.1 wrote its fields and
  the `[File: name, N bytes]` note raw (`k=v&...`);
- a body sent as `multipart/form-data` that does not parse into its fields
  is recorded as `[Unreadable body]`, never as it came.

**Redacted values and replay.** Keploy's hosted service keys the flows
it stores, and so the beta tests that replay them, by canonical-key v1,
under which a recorded value matches only itself; v1 leaves out of the key only the eleven query names 3.0.1
redacted (and a few volatile ones, such as `nonce`). So a request whose
URL 3.1.0 now redacts beyond those (every query value under strict; under
`balanced`, a credential-named parameter such as `?session=`,
`?auth_token=` or `?pin=`, a pair replaced whole for a credential nested
in it, a path's `;jsessionid=`, or a credential from the page's URL) is
recorded with `[REDACTED]` in its key and does not match the live request
at replay. A replay also opens each page at its recorded URL, query
included, so a page recorded under strict opens as `?q=[REDACTED]`, and
under `balanced` a reset link opens as `?token=[REDACTED]`. A redacted
value matches any live value only under canonical-key v2, which reads it
as a wildcard and which the hosted service does not use yet.

**Two new options let you correct it.** `privacy.secretRoutes` declares
routes whose segments are credentials, for example `"/invites/:key"`.
`privacy.keepRoutes` declares routes whose segments are your own IDs and
must be kept. A route the SDK cannot parse stops the capture with
`KUI_E_PRIVACY_ROUTE_INVALID` before anything is sent. See "Known limits"
for what declared routes cost.

Because of all this, a page URL recorded by 3.1.0 can differ from the
same page recorded by 3.0.1.

### 18. Warnings are `console.warn`, not `console.error`

3.0.1 wrote its two warnings, `KUI_E_EVENT_UNSERIALISABLE` and
`KUI_E_EVENT_OVERSIZED`, with `console.error`. 3.1.0 writes them, and its
four new warnings (`KUI_E_EVENT_OVERSIZED_SCRUBBING`,
`KUI_E_NAVIGATION_UNWRAPPED`, `KUI_E_REQUEST_TERM_FAILED` and
`KUI_E_BODY_WORKER_UNAVAILABLE`), with `console.warn`, in the same line
format with its evidence JSON. `console.error` is kept for an error that
ends the capture: an `init()` that is refused (its
line written once per page load for each code, see 3),
or a server rejection. If
you filter the SDK's lines by level, match the `KUI_E_` code instead. One
more `console.warn` line has no code:
`[keploy] the capture's next session could not start:`, followed by the
error, when a `continuous` capture's next session fails to start.

### 19. The SDK leaves half the keepalive quota to the page

Browsers refuse a `keepalive` fetch or a `sendBeacon` once more than
64 KiB of keepalive bodies are in flight from the page (measured as
65,536 bytes in Chromium, Firefox and WebKit; Firefox does not count
`sendBeacon`). 3.0.1 let its own uploads use the whole quota, so a page's
own lead-form POST or analytics beacon could be refused while an SDK
upload was on the wire.

3.1.0 uses at most half the quota, 32 KiB, counting an upload still on
the wire, and leaves the rest to the page. **Behaviour changes:**

- An upload over 32 KiB gzipped is sent without `keepalive` (3.0.1: over
  64 KiB). A navigation before it completes cancels it, although a tab
  close does not (measured in Chromium on a 50 KB/s uplink, a 90 KB gzipped
  upload: 0 of 40 arrived across a navigation, 5 of 5 across a tab
  close).
- The `pagehide` request carries at most 32 KiB of queued events; in
  3.0.1 it carried 64 KiB. An event over 32 KiB (with its envelope) is
  posted the moment it is queued, as 3.0.1 did for one over 64 KiB.
- So that a visitor who leaves with more than that queued loses as little
  as possible, a queue larger than the `pagehide` request can carry is
  sent at once, as a plain fetch (never `keepalive`), one upload at a time,
  until it is back under. So a busy page can make more uploads than one
  per `batchInterval`.
- A failed upload waiting to be re-sent is sent first at `pagehide`, whole
  and as it was first posted, and nothing is sent past it: later DOM events
  are changes against it, so a recording that skipped it could not replay
  past the gap. If that upload's body alone is over 32 KiB, nothing goes at
  `pagehide`, as in 3.0.1 for one over 64 KiB.

## New

### GraphQL requests

Every recorded network event now carries a `requestTerm` field:

- `graphql:<operationName>#<16 hex>` for a GraphQL request sent as a JSON
  body. The hex is a SHA-256 over the query document, taken after every
  string and number literal has been blanked, so no variable or literal
  value is recorded in it.
- `graphql:<operationName>#pq` for a persisted query.
- `""` for no body, a form, or a text body that is not a GraphQL request.
  This includes GraphQL sent as a GET, as a JSON array (a batch) or as raw
  `application/graphql`.
- `body:*` when the term is unknown: a body that is not text (a `Blob`, a
  buffer, a stream), a text body over 4 Mi characters, a body the SDK
  could not read or hash, a request made while the page is leaving before
  the term code has loaded (see 14), or one refused by the memory bound
  while the term code's load hangs (below).

The field is absent only if computing it threw. In that case a
`KUI_E_REQUEST_TERM_FAILED` warning goes to the console once per capture.

Hashing needs SubtleCrypto, which browsers provide only in secure
contexts (HTTPS or localhost). On a plain-HTTP page, a GraphQL document is
therefore recorded as `body:*`.

Keploy's hosted service accepts the field but does not use it yet. It
keys the flows it stores, and so the beta tests that replay them, by
canonical-key v1, which has no term: those tests answer GraphQL calls of
one method and URL in the order they were recorded, whatever operation
each runs.

The code that computes the term is a separate chunk of about 1.2 kB
gzipped (1.4 kB for CommonJS), `@keploy/capture-sdk/request-term`. You do
not import it yourself. The SDK loads it once, the first time a request
body could be a GraphQL request: a JSON object whose text holds `"query"`
(as a key or a value), `persistedQuery`, or a `\u` escape. A search API
that posts `{"query": "…"}` loads it too. A page that sends no such body
never loads it.

How the chunk resolves:

- **Bundlers that read the package's `exports` map** resolve the subpath
  from it.
- **Bundlers that ignore the `exports` map**, such as webpack 4 (as used
  by Create React App 4) and Parcel 2 with its default settings, resolve
  it through `request-term/package.json`, which the package ships.
- **No bundler.** Serve `dist/` as it is; the SDK loads
  `dist/request-term.mjs` from beside `dist/index.mjs`, and honours an
  import-map entry for `@keploy/capture-sdk/request-term` first.
- **CSP.** If your bundler emits the chunk as its own file, your CSP's
  `script-src` must allow it, as it allows your app's other chunks.

If the chunk cannot load, the capture continues. Those requests are
recorded with `requestTerm: "body:*"`, `KUI_E_REQUEST_TERM_FAILED` is
logged once, and the load is not retried for the life of the page.

**If the chunk's load hangs**, GraphQL exchanges waiting for their term
count against the same memory bound as bodies waiting for redaction (see
14). Past it, a new request's term is `body:*` at once, and an exchange
that cannot wait is recorded at once with its bodies cut. What waits is
recorded, with the term `body:*`, when the page leaves, the capture pauses
or `stop()` settles; a hidden tab alone does not end the wait. A page
whose chunk has loaded keeps every term.

### Single-page-app navigations

A route change without a page load is now recorded the way rrweb records
a page load: as a Meta event (rrweb's type 4) with the new URL. A route
change's Meta event also carries a `cause`:

| `cause`    | what moved the page                                                                                                                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `push`     | `pushState`, or the Navigation API reporting a push                                                                                |
| `replace`  | a `replaceState` that changes the URL                                                                                              |
| `traverse` | Back or Forward                                                                                                                    |
| `hash`     | a hash-route change the History API did not make (only where the browser has the Navigation API; elsewhere it reads as `traverse`) |

rrweb's own Meta events, written with every full snapshot, carry no
`cause`. A route change's Meta event can carry two more fields:

- `userInitiated`, where the browser has the Navigation API;
- `initiator: "script"`, when the page's own script called
  `history.back()`, `forward()` or `go()`, or the Navigation API's
  `back()`, `forward()` or `traverseTo()`.

A change of the query string alone is not recorded as a navigation. See 15
for the wrapping this requires.

### `continuous`

`continuous: true` (default `false`) keeps a long-lived tab recording, one
session at a time. A new session starts at the visitor's next click, tap
or key press after the previous session ends. A session ends:

- at `maxSessionDuration`;
- or when the server answers that it has completed the session
  (409 `session_completed`) or that the session is full
  (413 `session_full`). Keploy's ingest sends that reason; an ingest
  server too old to send it keeps the refusal terminal.

A tab nobody uses posts nothing. `sampleRate` is rolled once, when
`init()` starts the capture: each session that follows a recorded one is
recorded too, with no new roll. `continuous` has no effect when you set
`sessionIdGenerator`.

### Error codes

These five new codes reach `onError`:

| code                                  | when                                                                                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `KUI_E_DOM_RECORDER_UNAVAILABLE`      | rrweb could not be loaded (see 8)                                                              |
| `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE` | under strict, its attribute allow-list chunk could not be loaded; nothing was recorded (see 5) |
| `KUI_E_PRIVACY_ROUTE_INVALID`         | a `secretRoutes` or `keepRoutes` entry is not a route (see 17)                                 |
| `KUI_E_CAPTURE_DECLINED`              | the browser sent DNT or GPC (see 2)                                                            |
| `KUI_E_PRIVACY_CONFLICT`              | strict mode together with `maskNetworkBodies: false` (see 1)                                   |

These four new codes are console warnings only. They never reach
`onError`, and the capture continues:

| code                              | when                                                                                                                                                                                                     |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `KUI_E_EVENT_OVERSIZED_SCRUBBING` | an event became too large to send once credentials were scrubbed from it, so it was dropped                                                                                                              |
| `KUI_E_NAVIGATION_UNWRAPPED`      | the SDK could not wrap the History API (see 15)                                                                                                                                                          |
| `KUI_E_REQUEST_TERM_FAILED`       | computing a request's `requestTerm` threw, or the term chunk could not load; the request is recorded without its term, or as `body:*`. Most `body:*` terms come with no warning (see "GraphQL requests") |
| `KUI_E_BODY_WORKER_UNAVAILABLE`   | the body worker could not run, or the body chunk could not load (see 13); said once per page for each part                                                                                               |

Every error now also carries `remedy.docs`, a link to that error's
section of the Keploy docs (`https://keploy.io/docs/ui-capture/errors#<code>`,
in lower case with `-` for `_`).

### Input events say who made them

Each input event rrweb records now carries `userTriggered`: `true` for the
visitor's own input, `false` for a value the page's script wrote (a form
cleared after a submit, the other radios of a group, a date picker's
write).

## Fixes

- **`fetch(new Request(url, { body }))` works with the SDK.** In 3.0.x
  the SDK consumed such a `Request` to inspect it, so the page's own
  `fetch()` threw
  `Cannot construct a Request with a Request object that has already been used`.
  That is how ky and axios's fetch adapter send
  every POST. A `FormData` inside such a `Request` is now redacted by
  field; 3.0.1 recorded it as raw multipart, passwords included.
- **Credentials in non-JSON bodies are redacted** (see 17). 3.0.1 sent a
  form's `password`, an OAuth refresh's `refresh_token` and
  `client_secret`, and an XHR string body's `password=` as typed.
- **The pattern scanners run in linear time.** 3.0.1's email pattern could
  block the page's main thread for a long time on a large body (measured:
  49–68 s on a 256 KB body). The scanners now run in time linear in the
  text they scan.
- **Create React App 4 (webpack 4 with babel-loader) records the DOM.**
  There, `import("rrweb")` arrives as `{ default: module.exports }`.
  3.0.1 read `record` off it, found nothing, and recorded no page activity,
  silently, while still recording network calls. 3.1.0 takes the default,
  for rrweb and for its own chunks.
- **Requests leave at once.** 3.0.1 read the request body (a `Blob`'s
  text, or a whole copy of a `Request`, file bytes included) before it
  called the browser's `fetch`, so uploads started later and the body
  was held in memory twice. 3.1.0 calls the browser's `fetch` first.
- **Streamed responses reach the page as they arrive** (see 11).
- **An ingest outage no longer slows the page**: what the SDK holds is
  capped in bytes, failed batches are dropped oldest first past the cap,
  and uploads back off (see 9, 10).
- **Batches that fill go sooner.** A batch that fills while an upload is
  on the wire is now sent as soon as that upload settles. In 3.0.1 it
  waited for the next `batchInterval`, and a tab killed meanwhile lost it.

## Other changes

- **Bundle format.** The bundle now ships fully minified, with source
  maps (`dist/*.map`) beside it that map back to the SDK's sources.
- **Private names are shortened.** The build shortens the names of the
  SDK classes' `private` members. Code that reached into SDK internals at
  run time (for example a transport's queue) breaks; nothing public
  changes, and the type declarations are unchanged by it.
- **New package entry points.** `exports` gains `./request-term`,
  `./strict-attributes`, `./body-redact` and `./body-worker-start`, with
  `package.json` stubs for bundlers that ignore `exports`. The package
  also sets `unpkg` and `jsdelivr` to `dist/index.mjs`, a `browser` field
  and a Parcel `alias` for the worker start. You do not import any of
  these yourself.

## Known limits

- **Declared routes cost main-thread time.** With `secretRoutes` or
  `keepRoutes`, scrubbing a string costs time in proportion to its length
  times the number of long declared values it holds, and a crafted link
  can declare up to 32. Measured in Chromium: 300 such links made `init()`
  take 2.6 s where it took 0.18 s without them.
- **The DOM's URLs are scrubbed on every DOM event, in every mode.** This
  runs on the page's main thread. The SDK's tests bound the scrub of a
  synthetic 50,000-element snapshot holding 30,000 URLs to under a second
  of CPU time in Node; it has not been timed on a page.
- **A page whose snapshot is too large to send** is serialised again every
  60 s while it stays that large (see 9).
- **Bodies past the redaction bound** are recorded cut (see 14).

## Size

`dist/index.mjs` is about **40.9 kB gzipped** (40,927 B; the CommonJS
`dist/index.js` is 41.1 kB, 41,121 B, and `dist/index.bundler.mjs`, which
the `module` field names, 40.9 kB, 40,905 B), with rrweb not included.
Measured on the repository's build; the published files differ by a few
bytes, since they carry the version string. The budgets are 40,960 B (both
ESM builds) and 41,316 B (CommonJS).

Other files load only when needed:

- `dist/body-redact.mjs` (about 9.7 kB; 9.9 kB for CommonJS) at `init()`,
  and the worker `dist/body-worker.js` (about 9.3 kB) in the next idle
  period, for every capture that records bodies, which is the default
  (see 13);
- strict's attribute allow-list (about 1.3 kB; 1.5 kB for CommonJS), under
  `privacyMode: "strict"` alone (strict loads neither body file);
- the GraphQL term chunk (about 1.2 kB; 1.4 kB for CommonJS), on pages that
  send a body that could be GraphQL (see "GraphQL requests").

For comparison, 3.0.1 shipped unminified at 26.2 kB gzipped (ESM), with
body redaction inside it. The same 3.0.1 file minified, as a production
bundler would minify it, is 12.3 kB. In a minified production build,
expect about 28.6 kB more gzipped JavaScript in the bundle on every page
that loads the SDK (about 27.9 kB for CommonJS), and, under the default
`balanced` mode, about 19 kB more fetched at run time for the body worker
and chunk.

## If you ran a release candidate

**Since 3.1.0-rc.2:**

- **The page gets the network's own `Response` for every `fetch`** (see
  11). rc.2 handed the page a Response it built around the body (unless
  bodies were masked whole, or for `HEAD`, `204`, `205` and `304`), read
  each body ahead of the page up to `maxBodySize`, and recorded every body,
  read or not. Now:
  - a body the page never reads is recorded as
    `[Response body not read by the page]`, and later (see 11). That
    includes one consumed by `cache.put()` or
    `WebAssembly.instantiateStreaming()`, which rc.2 recorded whole;
  - in Chromium, a response your page reads whole is no longer reported
    as `net::ERR_ABORTED` in DevTools and request-failure handlers, as rc.1
    and rc.2 could report a chunked one. A body your page reads to its end
    through `res.body` can still be reported so, as without the SDK;
  - a Cache API round trip keeps the response's `url` and `type`, and
    `WebAssembly.instantiateStreaming()` sees the URL;
  - a `fetch` wrapper installed before the SDK that reads or clones the
    Response after handing it on no longer finds the body taken;
  - a body read only through a clone's stream is recorded as not read;
  - a body that fails part-way while your page reads it whole keeps
    nothing, where rc.2 kept what had arrived;
  - a page that takes `res.body` before the body chunk arrives gets the
    browser's stream, and may be recorded "not captured: early" (see 14).
- **A refused `init()` reaches `onError` in a task of its own, paced and
  bounded** (see 3). rc.2 called `onError` synchronously inside `init()`
  for a declined visitor and a conflicting config, and in `init()`'s
  microtasks for the other refusals at start; a load that failed after an
  offline start or a held leave was handed over from its loader, after
  `init()` had resolved. It wrote a refused `init()`'s
  `console.error` line every time, and built each error as its refusal
  happened. A handler that re-inited the same config for every code
  recursed until the browser's call stack ran out, or kept the page busy
  until it stopped responding. The SDK's error spec moves from
  `sdk-errors` v4 to v5.
- **Bodies waiting for redaction are bounded** (see 14). Past the bound
  they are recorded cut; rc.2 held them without limit.
- **A hung GraphQL term chunk is bounded** the same way (see "GraphQL
  requests"); rc.2 held every waiting exchange until the page closed.
- **A body passed in a plain-object `init` is no longer copied** once
  more by the browser to build the SDK's own `Request`, in every mode, and
  a `Request` object's body is read after `fetch()` returns, not inside
  it.
- **No body worker outlives its captures.** After `stop()`, or under a
  capture that records no bodies, the SDK keeps no worker and no poll.
- **The CommonJS files and the worker now run in strict mode**, as their
  sources are written. rc.2's `dist/index.js`, `request-term.js`,
  `strict-attributes.js` and `body-worker.js` shipped without
  `"use strict"`, so they ran in sloppy mode wherever the consumer did not
  add it. ESM builds are unchanged.
- **Private names are shortened** in the build (see "Other changes").
- **Sizes:** rc.2's 40.7 / 40.9 / 40.6 kB are now 40.9 / 41.1 / 40.9 kB,
  and `dist/body-redact.mjs` moved from 9.4 to 9.7 kB, since the
  `res.body` relay moved into it.

**Since 3.1.0-rc.1**, besides the above:

- strict's attribute allow-list and `KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`
  (5). rc.1 had 9 error codes, 6 classes and 5 warning codes; 3.1.0 has
  10, 7 and 6 (7);
- warnings as `console.warn` (18), and the keepalive share (19);
- body redaction in a Web Worker, with the no-bundler and CDN loading, and
  `PrivacyEngine.maskNetworkData()` no longer redacting bodies by itself
  (13);
- the `module` field moved to `dist/index.bundler.mjs`; the
  `./strict-attributes`, `./body-redact` and `./body-worker-start`
  subpaths and their stubs; the `unpkg`, `jsdelivr`, `browser` and `alias`
  fields;
- the body chunk requested at `init()`, the "not captured" notes and the
  leave handling (14);
- bodies masked whole decided without reading them (6), and `HEAD`, `204`,
  `205` and `304` handed over untouched;
- full batches sent as an upload settles;
- sizes: rc.1 was 41.4 kB (ESM) and 41.7 kB (CommonJS), with body
  redaction inside the bundle.
