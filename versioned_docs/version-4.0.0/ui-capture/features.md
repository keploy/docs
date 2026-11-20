---
id: features
title: "UI Testing features and availability"
sidebar_label: Features and availability
description: Every Keploy UI Testing feature, where you use it (SDK, dashboard, REST API, MCP or CLI), whether it works today, and the page that covers it.
tags:
  - UI testing
  - UI capture
  - reference
keywords:
  - UI testing features
  - UI capture
  - capture SDK
  - journeys
  - replay beta
  - Keploy MCP
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

What Keploy UI Testing does today, where you use each feature, and the page that explains it. The surfaces are the capture SDK (`@keploy/capture-sdk` 3.1.0, in your web app), the Keploy dashboard (**UI Testing → UI Flows**), the [REST API](./rest-api.md), the Keploy [MCP server](./mcp-tools.md), and the [`keploy` CLI](./cli.md).

The status of each feature is one of these:

- **Beta**: works today. The whole of UI Testing is in beta, and the dashboard says so.
- **Beta, not runnable yet**: part of [replay](./journeys.md#replay-beta), which is in beta, and whose runner, `keploy ui run`, is not in a release build yet. You can see it, but no test runs.
- **Available**: a part of Keploy that UI Testing uses but that is not UI Testing's own, such as the apps API.
- **Not available**: not in the product yet.

## Recording

| Feature                                                                                   | Surface | Status | Page                                                                              |
| ----------------------------------------------------------------------------------------- | ------- | ------ | --------------------------------------------------------------------------------- |
| Record each visit: the page, through rrweb, and every `fetch` and `XMLHttpRequest` call   | SDK     | Beta   | [Install the SDK](./install-sdk.md)                                               |
| Mask personal data in the browser: three privacy modes, mask, unmask and block selectors  | SDK     | Beta   | [Privacy and masking](./privacy.md)                                               |
| Honour Do Not Track and Global Privacy Control                                            | SDK     | Beta   | [Visitors' privacy signals](./privacy.md#visitors-privacy-signals)                |
| Keep credentials in your app's URLs out of the recording (`secretRoutes`, `keepRoutes`)   | SDK     | Beta   | [Credentials in URLs](./privacy.md#secret-routes-and-keep-routes)                 |
| Redact request and response bodies off the main thread, with markers for what is not kept | SDK     | Beta   | [Network calls and bodies](./network-and-bodies.md)                               |
| Name each GraphQL operation a request runs (`requestTerm`)                                | SDK     | Beta   | [GraphQL](./network-and-bodies.md#graphql)                                        |
| Record a single-page app's route changes, so each step belongs to its page                | SDK     | Beta   | [Single-page apps and navigation](./spa-navigation.md)                            |
| Sample page loads, keep capturing a long-open page, use your own session ids, pause       | SDK     | Beta   | [Sessions and sampling](./sessions-and-sampling.md)                               |
| Report errors and warnings with a `KUI_E_` code and a link to its fix                     | SDK     | Beta   | [UI Capture errors and warnings](./errors.md)                                     |
| Build with Vite, Next.js, webpack, Parcel, esbuild or no bundler, under a CSP             | SDK     | Beta   | [Bundlers and frameworks](./bundlers.md), [CSP and workers](./csp-and-workers.md) |

## Setting up

| Feature                                                                   | Surface                                    | Status    | Page                                                                  |
| ------------------------------------------------------------------------- | ------------------------------------------ | --------- | --------------------------------------------------------------------- |
| Create an app to record into                                              | REST, MCP                                  | Available | [Create an app](./rest-api.md#create-an-app)                          |
| Create, list and revoke ingest keys                                       | Dashboard, REST, MCP                       | Beta      | [Ingest keys and environments](./ingest-keys.md)                      |
| Check that recordings arrive and have become flows                        | Dashboard, REST, MCP                       | Beta      | [Capture status](./rest-api.md#capture-status)                        |
| End a visit at once, so its flows follow within minutes                   | REST (ingest)                              | Beta      | [End a visit at once](./sessions-and-sampling.md#end-a-visit-at-once) |
| Check from CI that a build still records                                  | REST                                       | Beta      | [Check capture in CI](./ci.md)                                        |
| A read-only service-account key for one app (`UI_READER`), on a paid plan | Dashboard (create), REST, MCP              | Beta      | [Create the service account](./ci.md#create-the-service-account)      |
| Sign in from a terminal or an agent, and connect an agent                 | CLI (`keploy login`, `keploy mcp-install`) | Available | [CLI](./cli.md)                                                       |
| Set up and read everything from an AI agent                               | MCP, REST                                  | Beta      | [Operate UI capture from an AI agent](./agents.md)                    |

## Reading what was recorded

| Feature                                                          | Surface              | Status | Page                                                                         |
| ---------------------------------------------------------------- | -------------------- | ------ | ---------------------------------------------------------------------------- |
| Flows: each page of each visit, with its steps and network calls | Dashboard, REST, MCP | Beta   | [From first visit to journeys](./walkthrough-dashboard.md)                   |
| Journeys and the journey graph, each with its share of sessions  | Dashboard, REST, MCP | Beta   | [Journeys and replay (beta)](./journeys.md)                                  |
| The journeys Keploy selects to test                              | Dashboard, REST, MCP | Beta   | [Which journeys Keploy selects](./journeys.md#which-journeys-keploy-selects) |
| Recompute the journey plan now (`refresh=true`)                  | REST, MCP            | Beta   | [The plan over REST and MCP](./journeys.md#the-plan-over-rest-and-mcp)       |
| The share of sessions that took any of a set of journeys         | REST, MCP            | Beta   | [Share of sessions affected](./journeys.md#share-of-sessions)                |
| The flow graph                                                   | REST, MCP            | Beta   | [The flow graph](./journeys.md#the-flow-graph)                               |
| Flows scrubbed for an agent's context                            | REST, MCP            | Beta   | [What an agent sees](./agents.md#what-an-agent-sees)                         |

## Replay

| Feature                                                                      | Surface               | Status                 | Page                                           |
| ---------------------------------------------------------------------------- | --------------------- | ---------------------- | ---------------------------------------------- |
| Replay journeys as Playwright tests, against recorded mocks                  | CLI (`keploy ui run`) | Beta, not runnable yet | [Replay (beta)](./journeys.md#replay-beta)     |
| **Generate Test** on a flow's page: creates a UI test run that stays pending | Dashboard             | Beta, not runnable yet | [Replay (beta)](./journeys.md#replay-beta)     |
| Read UI test runs and their verdicts                                         | Dashboard, REST, MCP  | Beta, not runnable yet | [List test runs](./rest-api.md#list-test-runs) |

## Not available yet

| Feature                                                                                                     | Notes                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Pin a journey into the test plan                                                                            | No surface pins one. See [Pinning](./journeys.md#pinning).                          |
| Recompute the journey plan from the dashboard                                                               | Use `refresh=true` over the REST API or MCP.                                        |
| Accept an intended change                                                                                   | On no surface.                                                                      |
| Run reports by email, and share links                                                                       | On no surface.                                                                      |
| A service-account role that runs UI tests in CI                                                             | `UI_READER` only reads.                                                             |
| The dashboard's **Flow Graph** panel, **Coverage** tab, **Impact Analysis** panel and generated test source | Each says the server does not expose it. The flow graph is on the REST API and MCP. |
| A retention setting for recordings                                                                          | Recordings have no retention setting. A journey plan is kept 14 days.               |

## Related

- [UI Testing overview](../running-keploy/ui-capture.md)
- [Limits and sizes](./limits.md)
- [Troubleshooting](./troubleshooting.md)
- [@keploy/capture-sdk 3.1.0 release notes](./capture-sdk-3-1-0-release-notes.md)
