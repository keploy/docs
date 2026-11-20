---
id: privacy
title: "UI capture privacy: what the SDK masks and what it still records"
sidebar_label: Privacy and masking
description: What the Keploy capture SDK masks in the browser in each privacy mode, what it still records, and how to mask, block and declare more.
tags:
  - UI testing
  - UI capture
  - privacy
  - masking
keywords:
  - UI capture privacy
  - capture SDK masking
  - privacyMode
  - strict mode
  - Do Not Track
  - Global Privacy Control
  - honorPrivacySignals
  - secretRoutes
  - PII redaction
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The capture SDK, `@keploy/capture-sdk`, masks personal data in your visitors' browsers before anything is sent. This page is for the developer who sets it up and for the privacy or security reviewer who signs it off: what each privacy mode masks, what every mode still records, and how to mask, block or declare more. It describes SDK 3.1.0. The [package's README on npm](https://www.npmjs.com/package/@keploy/capture-sdk) states every rule in full.

## Where masking happens {#where-masking-happens}

Masking happens in the browser, before the SDK sends anything. Nothing can be unmasked later, because Keploy's server never receives the original. The SDK sends what it records only to the `endpoint` you configure; [What leaves the browser](#what-leaves-the-browser) lists what each request carries.

## Choose a privacy mode {#choose-a-privacy-mode}

`privacyMode` sets what is recorded of the page. A masked value is recorded as asterisks, one per character, so its length is kept.

| What the visitor typed or sees                                                                                                 | `"balanced"` (default) | `"strict"` | `"off"` |
| ------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | ---------- | ------- |
| `password` and `hidden` inputs                                                                                                 | masked                 | masked     | masked  |
| `color`, `date`, `datetime-local`, `email`, `file`, `month`, `number`, `range`, `search`, `tel`, `text`, `time`, `url`, `week` | masked                 | masked     | kept    |
| `<textarea>`, `<select>`                                                                                                       | masked                 | masked     | kept    |
| Visible text                                                                                                                   | kept                   | masked     | kept    |

- **`"balanced"`** masks every typed value and keeps the page's visible text. It is the default.
- **`"strict"`**, for public sites, records no page text: it also masks every visible text node, blanks every attribute, `<meta>` content and comment that holds text, records no request or response body, and replaces every query value in a URL. See [What strict records](#what-strict-records).
- **`"off"`** masks only password and hidden fields.

A hidden field is masked in every mode, because it holds the page's own machinery, such as a CSRF token, and never what a person typed. A `file` input's value is the name of the file the person picked (`C:\fakepath\Resume_John_Smith.pdf`), so it follows the mode like any other typed value.

The values of radio buttons, checkboxes and `submit`, `button`, `reset` and `image` inputs are not in the table: they are recorded as written under `"balanced"` and `"off"`, and blanked under `"strict"`. Their value is usually a label, but not always. To keep one that holds personal data out of the recording, such as a checkbox whose value is an email address, list it in `privacy.blockSelectors`.

In every mode, `"off"` included, the SDK replaces every JWT and every key whose prefix names its provider (a Keploy `kep_` key, GitHub, Stripe, AWS and others) with `[REDACTED]` in the page's text and attribute values.

## What strict records, and what it doesn't {#what-strict-records}

Under `"strict"`, an attribute keeps its value only when its name describes the page's structure: `id`, `class`, `role`, `name`, `type`, `data-testid`, ARIA state and relationships (`aria-expanded`, `aria-labelledby`), form and layout attributes (`for`, `disabled`, `colspan`, `width`), and SVG geometry and paint (`d`, `viewBox`, `fill`). A URL attribute, such as `href`, `src` or a lazy loader's `data-src`, `data-href` and `data-srcset`, keeps its URL with every query value replaced, and a `style` attribute keeps its CSS. Every other value is recorded as `""`: `title`, `alt`, `placeholder`, `aria-label` and the other `aria-*` text, every other `data-*` attribute but `data-testid`, every `value` attribute rrweb would record in the clear, and each ARIA attribute that reflects what the visitor chose, such as `aria-valuenow` or `aria-checked`.

What strict still records, so never put a visitor's data there:

- **URL paths.** Only query values and fragment-pair values are replaced, so `/search/<term>` and a `#/search/<q>` route are recorded with the term.
- **`id` and `class` values**, and a field's `name`.
- **`data-testid` values, as written.** Replays find elements by them, so strict keeps them. An app that builds one from user data, such as `row-${email}`, records that data. Never build a `data-testid` from user data.
- **SVG geometry.** A signature pad's strokes are its paths' `d` values.
- **Text under `unmaskSelectors`.**

On the network, strict records no request or response body (each is recorded as `[MASKED]`), replaces every query value in every recorded URL, and keeps only the values of headers that describe the exchange rather than the person: `accept`, `accept-encoding`, `accept-ranges`, `age`, `cache-control`, `connection`, `content-encoding`, `content-language`, `content-length`, `content-type`, `date`, `etag`, `expires`, `keep-alive`, `last-modified`, `pragma`, `transfer-encoding` and `vary`. Every other header's value is replaced with `[REDACTED]`, and its name is kept.

Strict reads attributes with an allow-list that is a chunk of its own, which `init()` loads beside rrweb. Strict records nothing until both have loaded. If the allow-list cannot load, because of a Content-Security-Policy, a network failure or a deployment that dropped the file, the capture ends before anything is recorded or sent, with [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](./errors.md#kui-e-strict-attributes-unavailable). Setting `privacy.maskNetworkBodies: false` beside `"strict"` asks for the bodies strict leaves out, so the SDK refuses that configuration with [`KUI_E_PRIVACY_CONFLICT`](./errors.md#kui-e-privacy-conflict) before it records anything.

A strict recording also replays with less of the page's look. CSS keyed on a `data-*` attribute or a `title` no longer matches (`[data-theme=dark]`, a component's `data-state=open`), and a `<progress>` or `<meter>` shows no value. A control whose only name is its `aria-label` has no name in a strict recording, so give it a `data-testid`.

## Mask, unmask and block elements {#mask-unmask-and-block-elements}

- **`maskSelectors`** masks the text of the elements its CSS selectors match, and of everything below them.
- **`unmaskSelectors`** keeps the text below the elements it matches in the clear, overriding `maskSelectors` and `"strict"`.
- **`privacy.blockSelectors`** keeps the elements it matches out of the recording altogether. rrweb records an empty box of the same size in their place, so use it for a video, a chat widget or a list of customers' names. The network calls the blocked element's code makes are still recorded.

`maskSelectors` and `unmaskSelectors` act on text only: no selector un-masks an input's value, which `privacyMode` alone decides. Each can be given at the top level of the options or under `privacy`, and the two lists are merged.

The React sample shop masks its order confirmation, which repeats the email the shopper typed, and blocks its reviews, which carry people's names:

```ts title="ui-capture-react-shop/src/keploy.ts (excerpt)"
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
    console.error(`[shop] Keploy UI capture stopped: ${err.code}`, err.message);
  },
});
```

## Rich-text editors {#rich-text-editors}

Text typed into a `contenteditable` element, such as a TipTap, Quill, Lexical or ProseMirror editor, is typed text: it is masked under `"balanced"` and `"strict"` as an input's value is, whatever `unmaskSelectors` says, and recorded under `"off"`.

## Visitors' privacy signals {#visitors-privacy-signals}

The SDK honours Do Not Track and Global Privacy Control by default: `honorPrivacySignals` is `true` from SDK 3.1.0. When a visitor's browser sends either signal, `init()` records nothing, patches nothing and sends nothing for that visitor. **Brave and DuckDuckGo send Global Privacy Control by default**, so visits from those browsers never appear in your flows.

The signals the SDK reads are `navigator.globalPrivacyControl === true` and `navigator.doNotTrack === "1"`, as well as Do Not Track as older browsers spell it: `navigator.doNotTrack === "yes"` (Firefox before 32), `window.doNotTrack === "1"` (Safari, Internet Explorer 11) and `navigator.msDoNotTrack === "1"` (Internet Explorer 10).

For a declined visitor, the SDK calls your `onError` with [`KUI_E_CAPTURE_DECLINED`](./errors.md#kui-e-capture-declined) in a task after `init()`, never inside it, and writes one `console.info` line per page. It is not a failure, so keep it out of your error tracking, as the sample shop's `onError` does:

```ts title="ui-capture-react-shop/src/keploy.ts (excerpt)"
onError(err) {
  // The visitor's browser sends Do Not Track or Global Privacy Control:
  // nothing is recorded, and nothing needs fixing.
  if (err.code === "KUI_E_CAPTURE_DECLINED") return;
  console.error(`[shop] Keploy UI capture stopped: ${err.code}`, err.message);
},
```

Set `honorPrivacySignals: false` only where your site has its own lawful basis to record such visitors and says so in its privacy policy. An `init()` called again with the same options is declined again.

When you try capture on your own site, use a browser that sends neither signal: in one that does, the SDK records nothing.

## Network calls: headers, credentials, bodies {#network-calls}

Every recorded call keeps its method, URL, status and duration. Its headers and bodies are redacted by these rules; [Network calls and bodies](./network-and-bodies.md) explains how the SDK reads a body and what a large one looks like.

- **Headers.** The values of `Authorization`, `Cookie`, `Set-Cookie`, `X-API-Key`, `X-Auth-Token` and `Proxy-Authorization` are always replaced with `[REDACTED]`, and so is the value of any header whose name reads as a credential's, such as `X-Csrf-Token`, `X-Session-Id` or `Ocp-Apim-Subscription-Key`. `privacy.sensitiveHeaders` adds names to that list; it cannot remove the six. Every other header value is scanned for the patterns below and otherwise recorded as it is, so name in `privacy.sensitiveHeaders` any header your own code fills with what a person typed.
- **Credential names.** One rule reads every name the SDK records a value under: a JSON body's key, a form field, a multipart part, a `name=value` pair in a text body, a header, and a URL's query or fragment parameter. A value under a credential's name, such as `password`, `token`, `secret`, `apikey`, `session`, `pin`, `ssn`, `cardnumber` or `cvv`, or a name ending in `token`, `secret` or `password`, is replaced with `[REDACTED]`. A paging cursor, such as `pageToken` or `nextPageToken`, is not a credential and is kept. The page's own URL and the URLs in its DOM keep `auth`, `session`, `cookie`, `pin` and `sig` by name, as an app's own parameters, and replace such a value only when it looks generated, so `?pin=4821` in the page's URL is recorded.
- **Pairs in a text body.** In a body that is neither JSON nor a form, such as one sent as `text/plain`, a `name=value` pair is found only where one can start, such as at the body's start or after `?`, `&`, `;`, a line break or a space; its name must be made of letters, digits, `_`, `-`, `%` and closed brackets; and its value ends at the first space, quote, backtick, bracket, backslash, `&`, `;` or comma. So `password=correct horse` is recorded as `password=[REDACTED] horse`, and `user.password=…` is not found at all. Send a form with its form content type, and the whole value is replaced.
- **Bodies.** A JSON body is parsed, every value under a credential's name is replaced, and the JSON stays valid. Every string value in it, and every other body as text, is then scanned for JWTs, keys whose prefix names their provider, email addresses, US phone numbers, US social security numbers, IPv4 addresses and card numbers, and each match is replaced with `[REDACTED]`. The code of an OAuth token exchange is replaced too.

**Everything else in a body is recorded as it was sent.** Under `"balanced"`, a checkout request's shipping address, or a profile response's name, is recorded unless a credential's name or a pattern covers it. To record no body, set `privacy.maskNetworkBodies: true`, which records every body as `[MASKED]`, or use `"strict"`, which sets it. To replace values of a shape you know, add [your own patterns](#your-own-patterns).

## Values in URLs {#values-in-urls}

The SDK keeps a URL's path, because the path is what a replay matches requests by; it replaces only a credential it recognises there ([below](#secret-routes-and-keep-routes)). What happens to the rest of a URL depends on the mode:

- **`"balanced"` and `"off"` keep every query value whose name is not a credential's.** A visitor's search is masked in the search box, but when your app puts it in a URL, the URL carries it: the [sample shops](https://github.com/keploy/samples-typescript) record their search for `kettle` as `GET /api/products?q=kettle`. A request's URL is judged by its parameter names alone, never by what a value looks like, so an email address in a request's query is recorded too.
- **The page's own URL**, and the URLs in its DOM, are also scrubbed by shape: a value shaped like a token, or one a built-in pattern matches, such as `?email=ada%40x.com`, is replaced.
- **`"strict"` replaces every query value**, whatever its name, and keeps every name: `/search?q=ada%40example.com&page=2` is recorded as `/search?q=[REDACTED]&page=[REDACTED]`.
- **In every mode**, a user name and password in a URL are dropped, a request's fragment (`#...`) is dropped, and the page's fragment is kept only when it is a hash router's route, such as `#/cart`.

So keep personal data out of URL paths in every mode, and out of query values unless you use `"strict"`.

## Credentials in URLs: secretRoutes and keepRoutes {#secret-routes-and-keep-routes}

A credential in the page's URL, such as a reset link's `?token=` or an OAuth callback's `code`, is replaced with `[REDACTED]` in that URL. The SDK recognises such a credential by its parameter's name, by a value that looks generated, and by the words of the path before it, as in `/reset-password/<token>` or `/invitations/<uuid>/accept`.

A value that looks generated, 8 or more characters mixing two of lower case, upper case and digits, is also replaced in every other event the SDK sends, wherever the page copies it: into links, the DOM or its requests. A word, digits alone, such as a six-digit code, or a value shorter than 8 characters is replaced only in the URL that names it. A credential in a path segment can be declared with `secretRoutes`, as below: one of 6 or more characters is then kept out of every event. A query value cannot be declared, so keep such codes out of your URLs.

Recognition misses some credentials, such as a 10-character `/invites/<key>`, and takes some app ids for one, such as `/teams/invite/<id>`. Declare both:

```ts
await KeployCapture.init({
  endpoint,
  apiKey,
  privacy: {
    secretRoutes: ["/invites/:key", "/*/change-email/:token"],
    keepRoutes: ["/teams/invite/:teamId", "/invites/settings"],
  },
});
```

- A route is `/`-separated segments from the start of the path. Each segment is a literal, matched in any case, `*` for any one segment, or `:name` for the value the route names. A route matches a path that begins with it, a hash router's route (`#/...`), and a URL nested in a query parameter.
- **`secretRoutes`** names the routes whose segments are credentials: it must name at least one `:name`. The value is kept out of the recorded URL and out of every event: the DOM, inputs, requests and responses. A value of 6 or more characters is scrubbed wherever it appears, whatever its letters, so a page of your own that a secret route also matches, such as `/invites/notifications` under `/invites/:key`, has `notifications` scrubbed from every later event of the page until you declare it in `keepRoutes`. A shorter value is scrubbed only as the path segment after its route's segment.
- **`keepRoutes`** names the routes whose segments are your app's own ids: it must have at least one literal. What its `:name` segments name is never taken for a token, unless a credential's name or a secret route names it too.
- A route outside these rules refuses the capture with [`KUI_E_PRIVACY_ROUTE_INVALID`](./errors.md#kui-e-privacy-route-invalid), on every page load, whatever `sampleRate` says.
- Routes are read when a capture starts and kept for the page. A second `init()` while a capture is live returns that capture and adds no routes.

## Your own patterns {#your-own-patterns}

`privacy.piiPatterns` adds your own patterns as `{ name, pattern }` objects, where `pattern` is a regular expression. They run over network data only: over header values, over the string values inside JSON bodies, over form bodies as sent and decoded, and over every other body as text. They do not run over the page's text or attributes. Every match is replaced with `[REDACTED]`, whether or not the pattern has the `g` flag. A pattern never changes a JSON key or a number, so a JSON body still parses.

They do not run over URLs, on purpose: a URL's path and query values are what a replay matches requests by, so rewriting them would make the recording unmatchable. Put an identifier that must be scrubbed by pattern in a header or the body instead.

## Try your configuration {#try-your-configuration}

The SDK exports its `PrivacyEngine`, so you can run the same masking on your own strings:

```ts
import {PrivacyEngine} from "@keploy/capture-sdk";

new PrivacyEngine().maskText("contact user@example.com now"); // "contact [REDACTED] now"
```

`new PrivacyEngine(privacy, privacyMode)` takes your `privacy` options and your privacy mode. Its `maskNetworkData(event)` masks a network event's headers and URL as a capture does. It redacts the event's bodies only once a capture on the page has loaded the SDK's body code; until then it records each body as `[MASKED]`, never in the clear.

## What leaves the browser {#what-leaves-the-browser}

Each request the SDK sends to your `endpoint` carries:

- the session id;
- a batch of events: rrweb's DOM events and the masked network calls, each with its method, URL, headers, bodies, status and duration;
- the page's metadata: its URL, the user agent, the viewport, the referrer, the language, the device pixel ratio and the start time;
- the SDK's name and version;
- the capture identity that lets Keploy join this recording to a backend recording of the same requests: the session id, the page's origin, a start time and a random nonce.

Each request also carries the ingest key in its `X-API-Key` header and a random `batchId`. The metadata and the capture identity ride on every batch. A batch is gzipped when the browser has `CompressionStream` and gzip makes it smaller. Each recorded input event also says whether the visitor made it (`userTriggered: true`) or the page's script wrote the value. The SDK sends nothing to anyone but your `endpoint`, and keeps nothing in cookies, `localStorage` or `sessionStorage`: it carries no identity of the visitor from one page load to the next.

## What the dashboard, REST and MCP show {#what-the-dashboard-rest-and-mcp-show}

- **The dashboard** shows a flow to everyone who can view its app. A flow's page lists its steps, with a typed value as it was recorded (a masked one as asterisks), and its network calls with their method, recorded URL, status and time. The page shows no headers or bodies, but Keploy stores each call's headers and bodies, as the SDK recorded them, with its flow, because a replay serves them, and anyone who can view the app can read them through the dashboard's own API.
- **The REST API and MCP** return less, because their answers go into an AI agent's context: no typed values, no headers or bodies, no query strings, fragments or credentials in URLs, and a path segment that reads as a secret or a person's data replaced with `REDACTED`. [What an agent sees](../running-keploy/ui-capture.md#what-an-agent-sees) lists the rules.

## Recognition, not a guarantee {#recognition-not-a-guarantee}

The SDK finds credentials and personal data by their names, their shapes and patterns, and it cannot recognise every one. A credential in a shape the rules do not know is recorded: an unusual parameter name, a token that is a dictionary word or digits alone, a token in a path shorter than 16 characters (20 after a word such as `invitations` or `verification`), or a UUID or an ObjectId after such a word, as in `/invitations/<uuid>`. Where a value could be a credential or an app's own id, the SDK treats it as a credential: an id scrubbed by mistake can be kept with `keepRoutes`, but a credential recorded by mistake cannot be taken back.

So declare your secret routes, name a credential parameter like one (anything ending in `token`), and remember what every mode records as it is: URL paths, `data-testid`, `id` and `class` values, and under `"balanced"` query values and the parts of bodies no rule covers. Use `"strict"` for a public site, `privacy.blockSelectors` for an area that must never be recorded, and `privacy.maskNetworkBodies` when no body should leave the browser.

## Related

- [Network calls and bodies](./network-and-bodies.md)
- [Sessions and sampling](./sessions-and-sampling.md)
- [UI Capture errors and warnings](./errors.md)
- [Privacy at a glance](../running-keploy/ui-capture.md#what-the-sdk-records-and-what-it-masks), on the UI Testing overview
- [@keploy/capture-sdk 3.1.0 release notes](./capture-sdk-3-1-0-release-notes.md)
