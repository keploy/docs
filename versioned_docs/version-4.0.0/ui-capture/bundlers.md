---
id: bundlers
title: Bundlers and frameworks for the Keploy capture SDK
sidebar_label: Bundlers and frameworks
description: Which bundlers and frameworks the Keploy capture SDK is built with in its tests, what each needs, and how it loads its body worker and chunks.
tags:
  - UI testing
  - UI capture
  - capture SDK
keywords:
  - capture SDK
  - Vite
  - Next.js
  - webpack
  - Create React App
  - Parcel
  - esbuild
  - import map
  - Web Worker
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

`@keploy/capture-sdk` is an ES module that your bundler builds into your app. Besides its main bundle, it loads a few files of its own while it runs, and your build must emit and deploy them:

- **rrweb**, the library it records the page with, which `init()` imports;
- **its body redaction code** and **its body worker**, a Web Worker that redacts request and response bodies off your page's main thread, with a small module that starts it;
- **its GraphQL code**, the first time a request body could be a GraphQL request;
- **its attribute list**, under `privacyMode: "strict"` only.

Most bundlers emit all of them on their own. This page says which setups the SDK's tests build, and what the others need.

## Tested setups {#tested-setups}

The SDK's tests install the package, packed as it is for publishing, beside each of these bundlers, build an app that starts a capture, and check in Chromium that it records a GraphQL request with its term, records under `privacyMode: "strict"`, and redacts a large request body.

| Setup                                                                                           | Version tested       | Body worker | What you do                                                                           |
| ----------------------------------------------------------------------------------------------- | -------------------- | ----------- | ------------------------------------------------------------------------------------- |
| [Vite](#vite)                                                                                   | 8.3.8                | Yes         | Nothing                                                                               |
| [Next.js](#nextjs), with Turbopack (its default)                                                | 16.4.3, React 19.3.1 | Yes         | Nothing                                                                               |
| [Next.js](#nextjs), with `--webpack`                                                            | 16.4.3, React 19.3.1 | Yes         | Nothing                                                                               |
| [webpack 5](#webpack-5)                                                                         | 5.112.2              | Yes         | Nothing                                                                               |
| webpack 5 with babel-loader, for Chrome 60 and Safari 11                                        | 5.112.2              | Yes         | Run babel-loader over `node_modules`, and set webpack's `target` to the same browsers |
| [webpack 4](#webpack-4-and-create-react-app-4) with babel-loader, as Create React App 4 runs it | 4.47.0               | No          | Nothing; bodies are redacted on the main thread                                       |
| [Parcel 2](#parcel-2)                                                                           | 2.16.4               | Yes         | `npm install buffer`                                                                  |
| [esbuild](#esbuild)                                                                             | 0.28.2               | No          | Copy the worker beside your bundle                                                    |
| [esbuild](#esbuild), with the worker copied                                                     | 0.28.2               | Yes         | —                                                                                     |
| [No bundler](#no-bundler), an import map for rrweb                                              | —                    | Yes         | Serve the package's `dist/` as it is, and map `rrweb`                                 |

The three [UI capture sample shops](https://github.com/keploy/samples-typescript) are built and tested in their own CI: React with Vite 8.3.8, Next.js 16.4.3 with the App Router, and plain HTML pages with no bundler. [Install the SDK](./install-sdk.md#add-it-to-your-app) shows their setup.

## Where there is no body worker {#where-there-is-no-body-worker}

The SDK starts its worker as `new Worker(new URL("./body-worker.js", import.meta.url))`, which webpack 5, Next.js (webpack and Turbopack), Vite and Parcel 2 turn into a file of your build. Where the worker cannot run, the capture still records every request and response, and redacts the bodies on the page's main thread instead, each only up to its first 64 KiB: a body over that is recorded cut, under a first line `[Body cut: 65536 of N characters kept, unverified]`. The SDK says so once per page with the [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable) warning. There is no worker:

- under **webpack 4**, which cannot parse `import.meta`;
- under **esbuild**, until you copy the worker beside your bundle;
- in a build that loads the SDK's **CommonJS** files (its `require` entry), whose worker start has no `import.meta`;
- when your build's **assets are served from another origin**, such as webpack's `publicPath` or Next.js's `assetPrefix` on a CDN: a browser runs a worker only from the page's own origin;
- when the page's **Content-Security-Policy** does not let your origin run it: see [Content-Security-Policy and workers](./csp-and-workers.md).

With any other bundler, check that your build emits the worker. [Redaction off the main thread](./network-and-bodies.md#redaction-off-the-main-thread) says what a cut body looks like.

## Vite {#vite}

Vite emits everything on its own. In the [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop)'s production build, `npm run build` writes rrweb, the SDK's body redaction code, its body worker, its GraphQL code and its attribute list as files of their own under `dist/assets/`, beside the app's own bundle. Deploy all of them.

Under `npm run dev`, React's development checks (`StrictMode`) make every request twice, and the recording shows both, so check what is recorded against a production build (`npm run build && npm run preview`).

## Next.js {#nextjs}

Next.js emits the worker with Turbopack, its default, and with `--webpack`: in the [Next.js sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-next-shop)'s build, with Turbopack, it is `.next/static/media/body-worker.<hash>.js`. The SDK's tests build both with an App Router page and a Pages Router page. The sample shop starts the capture from `instrumentation-client.ts`: see [Install the SDK](./install-sdk.md#add-it-to-your-app).

- With `assetPrefix` on a CDN, the worker is served from another origin and cannot run.
- The SDK records what runs in the browser. A fetch in a server component runs on the server and is not recorded.

## webpack 5 {#webpack-5}

webpack 5 reads the package's `exports` map, bundles the SDK's chunks and emits its worker. A build transpiled for older browsers builds too: the SDK's tests build webpack 5 with babel-loader for Chrome 60 and Safari 11, and check that every script it emits parses as ES2019, without `import()` or optional chaining. For that:

- **Run babel-loader over `node_modules` too.** The SDK's and rrweb's files use newer syntax, such as optional chaining, so a rule that excludes `node_modules` leaves it in your bundle.
- **Set webpack's own `target` to the same browsers** (`target: "browserslist:chrome 60, safari 11"` in the tests), or webpack's runtime code keeps syntax those browsers cannot parse.

The tests run that build in current Chromium, not in Chrome 60 or Safari 11.

With `publicPath` on another origin, the worker cannot run.

## webpack 4 and Create React App 4 {#webpack-4-and-create-react-app-4}

webpack 4 ignores a package's `exports` map and reads its `module` field, which names `dist/index.bundler.mjs`: the same SDK, built so that webpack 4 never reads `import.meta`. It resolves the SDK's GraphQL code and strict's attribute list through the `request-term/package.json` and `strict-attributes/package.json` the package ships. So the build works, with no worker: the main thread redacts bodies, each up to 64 KiB, and the console shows `KUI_E_BODY_WORKER_UNAVAILABLE` once per page load that records bodies. To redact large bodies whole, move to webpack 5 or another bundler that emits the worker.

The SDK's tests run webpack 4 as Create React App 4 runs it: with babel-loader over `node_modules`, since webpack 4's parser predates the syntax the SDK and rrweb ship, and with Node's legacy OpenSSL provider (`NODE_OPTIONS=--openssl-legacy-provider`), since webpack 4 hashes with MD4. They also build the same entry for the server, as webpack 4's `target: "node"`, Nuxt 2 and Angular Universal 9 to 11 build it.

## Parcel 2 {#parcel-2}

Parcel 2 needs the `buffer` package:

```bash
npm install buffer
```

rrweb's build reads Node's `Buffer`, and Parcel bundles no polyfill for a Node built-in unless its package is installed. That is rrweb's need, and SDK 3.0.1 has it too. When `buffer` is missing, Parcel 2.16 installs it by itself, as a dev dependency, unless the `CI` environment variable is set. With `CI` set, `parcel build` fails, naming rrweb's files and saying:

```text
@parcel/resolver-default: Node builtin polyfill "buffer/" is not installed, but auto install is disabled.
```

Install it yourself, so that every build has it.

Parcel reads the package's `module` field, as webpack 4 does, and the package's `alias` sends it to the worker's start, so Parcel emits the worker.

## esbuild {#esbuild}

esbuild does not emit the worker: copy it from the package into your output directory, beside your bundle, and it runs. The SDK's tests build esbuild with `--format=esm --splitting`, so that rrweb and the SDK's chunks stay files of their own:

```bash
npx esbuild src/main.js --bundle --format=esm --splitting --outdir=dist
cp node_modules/@keploy/capture-sdk/dist/body-worker.js dist/
```

## No bundler {#no-bundler}

There is no script-tag build. Without a bundler:

- **Serve the package's `dist/` directory as it is**, and import `dist/index.mjs` from it. The SDK loads its other files from beside `dist/index.mjs`: `body-redact.mjs`, `request-term.mjs`, `strict-attributes.mjs` under strict, and `body-worker-unbundled.mjs`, which starts `body-worker.js`.
- **Map `rrweb` with an import map** before the SDK loads, to rrweb's `dist/rrweb.js`. The SDK imports `rrweb` by name, which only a bundler or an import map resolves.
- An import map that also maps `@keploy/capture-sdk/body-redact`, `/body-worker-start`, `/request-term` or `/strict-attributes` is used first.

A page that serves `dist/index.mjs` alone has no code to redact a body with: it records each body as not captured, never in the clear, and refuses every strict capture with [`KUI_E_STRICT_ATTRIBUTES_UNAVAILABLE`](./errors.md#kui-e-strict-attributes-unavailable). Without the import map, rrweb cannot load, and the capture ends before anything is sent with [`KUI_E_DOM_RECORDER_UNAVAILABLE`](./errors.md#kui-e-dom-recorder-unavailable).

The [plain HTML sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-html-shop) does exactly this: see the **Plain HTML** tab of [Install the SDK](./install-sdk.md#add-it-to-your-app).

## Assets on a CDN {#assets-on-a-cdn}

A browser runs a worker only from the page's own origin. So when your build's assets are served from a CDN, through webpack's `publicPath` or Next.js's `assetPrefix`, the SDK's chunks load from there, but its worker cannot run, and bodies over 64 KiB are recorded cut.

Loading the SDK itself from a CDN with no bundler works the same way: the chunks load from the CDN, which must send CORS headers, as CDNs do, and the worker cannot. Import `dist/index.mjs` by its path, for example `https://cdn.jsdelivr.net/npm/@keploy/capture-sdk@3.2.0/dist/index.mjs`:

- unpkg's package root redirects to `dist/index.mjs`, so it works too.
- jsDelivr's package root answers with the file at the root's own URL, where no chunk is beside it, so name the path.
- Don't load the package root with unpkg's `?module`. It serves `dist/index.bundler.mjs`, the build for webpack 4, which loads no chunk from beside it: it records every body as not captured and refuses every strict capture.

To have the worker, serve `dist/` from your own origin.

## Size {#size}

The SDK's main bundle, `dist/index.mjs`, is about 40.9 kB gzipped, rrweb not included; the CommonJS `dist/index.js` is 41.1 kB. Its other files load only when a capture needs them:

| File                         | Gzipped      | Loaded                                                                                   |
| ---------------------------- | ------------ | ---------------------------------------------------------------------------------------- |
| `dist/body-redact.mjs`       | about 9.7 kB | At `init()`, beside rrweb, for a capture that records bodies (the default, `"balanced"`) |
| `dist/body-worker.js`        | about 9.3 kB | In the page's next idle period after such a capture starts                               |
| `dist/strict-attributes.mjs` | about 1.3 kB | Under `privacyMode: "strict"` only, which loads neither body file                        |
| `dist/request-term.mjs`      | about 1.2 kB | The first time a request body could be a GraphQL request                                 |

The [3.2.0 release notes](./capture-sdk-3-2-0-release-notes.md#size) give exact byte counts measured on the published tarball, while the package README measures the repository build at its placeholder version; the two differ by a few bytes and round to the same figures above. The package also ships source maps beside each file, for your tools; they are never inlined.

## Related

- [Install the SDK](./install-sdk.md)
- [Content-Security-Policy and workers](./csp-and-workers.md)
- [Network calls and bodies](./network-and-bodies.md)
- [`KUI_E_BODY_WORKER_UNAVAILABLE`](./errors.md#kui-e-body-worker-unavailable)
- [UI capture sample shops](https://github.com/keploy/samples-typescript)
