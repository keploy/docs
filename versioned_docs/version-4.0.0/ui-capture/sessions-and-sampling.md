---
id: sessions-and-sampling
title: "UI capture sessions: when a session starts and ends, and how sampling works"
sidebar_label: Sessions and sampling
description: What a Keploy UI capture session is, every way one ends, how sampleRate samples page loads, and how a session becomes flows.
tags:
  - UI testing
  - UI capture
  - sessions
keywords:
  - UI capture session
  - capture SDK
  - sampleRate
  - maxSessionDuration
  - continuous capture
  - session complete
  - sessionIdGenerator
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The capture SDK records each visit to your web app as a **session**: what the visitor did and the network calls the page made. Keploy turns each finished session into flows. This page says what a session is, every way one ends, how `sampleRate` picks the sessions that are recorded, and what happens to a session on Keploy's side. It describes SDK 3.1.0.

## What a session is {#what-a-session-is}

A session is **one page load of your app and its in-app navigations**:

- **A single-page app** keeps one session across its route changes: `history.pushState`, the visitor going back or forward, a hash router's `#/route`. Each route change is recorded with the new URL, so each step belongs to the page it happened on.
- **A site whose links load pages** starts a new session on every page load. Its sessions each hold one page, and its journeys never span two pages. The [plain HTML sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-html-shop) records every page that way.

The SDK picks a new session id for every session it starts: a random UUID, unless you [supply your own](#your-own-session-ids). It keeps nothing in the browser between page loads and carries no identity of the visitor, so every journey figure Keploy shows is a share of sessions, not of people. `KeployCapture.getSessionId()` returns the live session's id, and `""` when no session is live.

## When a session ends {#when-a-session-ends}

| What ends it                         | What happens                                                                                                                                                                                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maxSessionDuration` (10 minutes)    | Recording stops and the queued events are sent. A later `init()` starts a new session, or, with `continuous: true`, the next one starts at the visitor's next click, tap or key press.                                                                                        |
| `KeployCapture.stop()`               | Recording stops and the queued events are sent, after up to a second for calls already answered to finish their bodies. A later `init()` starts a new session.                                                                                                                |
| The page unloads                     | The SDK sends what is still queued as the page goes: see [Batching and outages](#batching-and-outages).                                                                                                                                                                       |
| 30 minutes with no batch             | Keploy's server completes the session. It checks every minute.                                                                                                                                                                                                                |
| `POST /ui/v1/sessions/<id>/complete` | The server completes the session at once. Use it from a test or a CI recording, after the page has stopped recording.                                                                                                                                                         |
| 256 MiB or 10,000 batches stored     | The server refuses the session's next batch with `413` and the reason `session_full`. The capture ends with [`KUI_E_INGEST_REJECTED`](./errors.md#kui-e-ingest-rejected), or, with `continuous: true`, the next session starts at the visitor's next click, tap or key press. |

### Keep capturing a long-open page {#continuous}

One page load can stay open for hours, and a capture otherwise ends at `maxSessionDuration`. Set `continuous: true` to keep capturing for the life of the page, one session at a time: when a session ends at `maxSessionDuration`, or because the server completed or filled it, the next one starts at the visitor's next click, tap or key press. A tab nobody uses posts nothing. Each session becomes flows of its own.

`continuous` has no effect when you set a `sessionIdGenerator`. That id is yours, usually one per visit, and a second session under it would be refused, so the capture ends as it would without `continuous`.

### A tab that comes back after 30 minutes {#a-tab-that-comes-back}

A tab can send no batch for more than 30 minutes while its session is still open: on a computer that slept, or with a `maxSessionDuration` longer than 30 minutes. By then the server has completed the session, so the tab's next batch is answered `409`. The capture ends with [`KUI_E_SESSION_CONFLICT`](./errors.md#kui-e-session-conflict), and that tab records nothing more until the page is reloaded or calls `init()` again. With `continuous: true` and the SDK's own session ids, it starts a new session at the visitor's next click, tap or key press instead.

### End a visit at once {#end-a-visit-at-once}

`POST /ui/v1/sessions/<session id>/complete`, with the app's ingest key in `X-API-Key`, ends one session at once, so its flows follow within a minute or two instead of 30 minutes after its last activity. The session id is the SDK's own, from `KeployCapture.getSessionId()`: read it before you call `stop()`, which clears it. Completing a session that is already complete answers with the session unchanged, so a retry is safe; an id the app never received is answered `404`.

```bash
curl -X POST https://api.keploy.io/ui/v1/sessions/<session id>/complete \
  -H "X-API-Key: kep_YOUR_INGEST_KEY"
```

Call it once the page has stopped recording, for example after `KeployCapture.stop()` has resolved, as the React and Next.js sample shops' scripted visits do. A page that goes on recording after its session was completed is refused at its next batch, as a returning tab is.

## Sampling {#sampling}

`sampleRate` is the fraction of captures recorded: `1`, the default, records every one, and `0.1` records one in ten. The rest never start: they record, patch and send nothing.

- **It is rolled when `init()` starts a capture**, so once per page load, and again only after `stop()` or the session's end. A later `init()` on the same page returns the same capture, sampled out or not.
- **It samples page loads, not visitors.** The SDK carries no identity across page loads, so on a site whose links load pages, each page is sampled on its own, and a visit can be recorded on some of its pages and not others. A single-page app is sampled per visit.
- **Under `continuous`**, each session after a recorded one is recorded too, with no new roll.
- On a page that was sampled out, `KeployCapture.getSessionId()` returns `""`.

A `privacy.secretRoutes` or `privacy.keepRoutes` entry that is not a valid route is refused before the roll, so it fails on every page load, whatever `sampleRate` says.

## Your own session ids {#your-own-session-ids}

`sessionIdGenerator` supplies your own session id instead of the SDK's UUID, so you can find a recording from your own systems. The id must be 1 to 200 characters of letters, digits, `.`, `-` and `_`, with no empty dot-separated part, such as `tenant-7.user_42.run-3`. Encode anything else first.

The SDK checks what the generator returns before it sends anything, and refuses to start on anything outside that rule, or on a generator that throws, with [`KUI_E_SESSION_ID_INVALID`](./errors.md#kui-e-session-id-invalid). The server refuses a second live session under an id that is already in use, which ends that capture with [`KUI_E_SESSION_CONFLICT`](./errors.md#kui-e-session-conflict), so return a new id for each visit, never a fixed value.

## Pause, resume, stop and hidden tabs {#pause-resume-stop}

```ts
KeployCapture.pause(); // keep the session, record nothing more
KeployCapture.resume();
KeployCapture.getSessionId(); // "" when no session is live
KeployCapture.stop(); // stop recording and send what is queued
```

- **`pause()`** keeps the session and records nothing more: no DOM event, and no network call that starts or is answered while it is paused, even one whose answer arrives after `resume()`. A call still reading its body at `pause()` is recorded then, with what had arrived, cut and marked `...[truncated]`.
- **`resume()`** records again. It takes a fresh snapshot of the page only if something was dropped while the recording was paused.
- **In a continuous capture, a pause carries over**: a pause in force when a session ends, or made while the capture waits for its next session, holds in the next session too, even one an explicit `init()` starts, until `resume()`.
- **`stop()`** ends the capture for good, a continuous capture's wait included. A later `init()` starts a new session.
- **A hidden tab** pauses DOM recording and nothing else: the page's network calls are still recorded, because the page still makes them. When the tab is shown again, the SDK takes a fresh snapshot only if something was dropped while it was hidden.

## Batching and outages {#batching-and-outages}

The SDK queues what it records in memory and sends it to your `endpoint` in batches:

- **`batchSize`**, 50 events by default, is how many events one request carries at most. It is clamped to 5,000, the most the server accepts, and a batch is also cut at the server's 10 MiB cap.
- **`batchInterval`**, 5,000 ms by default, is the time between sends. Each send carries one batch.
- **`maxQueueSize`**, 5,000 events by default, is how many events the SDK holds unsent. Past it, or past 16 MiB of events, the oldest are dropped; when a batch that failed to send goes back into a full queue, the newest queued events are dropped instead.
- **When the page unloads**, whatever is still queued is sent with `keepalive`, up to 32 KiB in all. Browsers allow a page 64 KiB of such requests in flight, and the SDK leaves the page half. A queue that grows past what can go then is sent at once, so the page's last requests usually hold what is left; what does not fit in them is lost.

When the server answers `429` or a `5xx`, or the network fails, the SDK tries a batch three times, up to one and then up to two seconds apart, and puts it back at the front of the queue. From then on, each later batch gets one attempt, and the wait between attempts doubles from 2 seconds to 60, each wait lengthened at random by up to half, so an ingest that is down gets about one request a minute. `stop()`, a hidden tab, the browser coming back online and the page's unload still send at once. The first batch the server accepts ends the outage and sends what piled up.

Any other `4xx` is final, but for the two `continuous` cases [above](#when-a-session-ends): the SDK ends the capture, stops patching `fetch` and `XMLHttpRequest`, logs the server's explanation with `console.error`, and calls `onError` once. [UI Capture errors and warnings](./errors.md) says what each code means and how to fix it.

## From session to flows {#from-session-to-flows}

On Keploy's side, a session moves through these states:

| Status       | What it means                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| `RECORDING`  | Batches are arriving.                                                                                         |
| `COMPLETED`  | The session ended: 30 minutes passed with no batch, or it was completed with `/complete`.                     |
| `PROCESSING` | Its flows are being extracted.                                                                                |
| `PROCESSED`  | Its flows are ready: a new flow starts at each page, and after a gap of more than 30 seconds between actions. |
| `FAILED`     | Its flows could not be extracted.                                                                             |

Extraction runs every minute, and a session's flows are usually ready within a few minutes of its end. A session that cannot be extracted is tried again with growing waits, eight attempts in all over about two hours, and is then marked `FAILED`. A page that was only loaded still gives a flow, of one step: its navigation.

The app's capture status counts its sessions by these states and says what to do next: see [Capture status](./rest-api.md#capture-status).

## Related

- [Privacy and masking](./privacy.md)
- [Network calls and bodies](./network-and-bodies.md)
- [Limits and sizes](./limits.md)
- [UI Capture errors and warnings](./errors.md)
- [Capture real user flows from your web app](../running-keploy/ui-capture.md)
