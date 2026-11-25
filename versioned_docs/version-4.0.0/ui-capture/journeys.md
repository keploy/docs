---
id: journeys
title: "UI journeys and replay (beta)"
sidebar_label: Journeys and replay (beta)
description: What a journey is, how Keploy picks the journeys to test, the Journeys tab, the plan over REST and MCP, shares of sessions, and where replay stands in beta.
tags:
  - UI testing
  - UI capture
  - journeys
keywords:
  - user journeys
  - journey plan
  - share of sessions
  - uiJourneys
  - uiJourneyImpact
  - Playwright replay
  - UI test runs
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy chains each visit's flows, in order, into the path the visit took through your pages: its **journey**. From the journeys of an app's recent visits it builds a **journey plan**: how sessions move between pages, the journeys they take, each with its share of sessions, and the journeys Keploy selects to replay as tests. This page explains how the plan is built and where to read it: the dashboard's **Journeys** tab, the REST API and MCP.

:::note Beta
UI Testing is in beta. Journeys and their shares work today. Replaying journeys as Playwright tests is in beta too: Enterprise CLI `v3.9.20` and later ships `keploy ui status` and `keploy ui run` on Linux and macOS. See [Replay (beta)](#replay-beta).
:::

## What a journey is {#what-a-journey-is}

A session's journey is the pages it went through, in order: the page it landed on, then the page of each of its flows, in the order they happened. A page that follows itself counts once, and a journey holds at most 16 pages.

- **A page is its path, with IDs folded.** A path segment that is a number, a UUID, a MongoDB ObjectId or a ULID is written `:id`, a long hexadecimal one `:hash`, and a JWT `:token`, so `/orders/1042` and `/orders/1043` are one page, `/orders/:id`. The query is left out.
- **A session took a journey when its pages start with the journey's pages.** A session that went `/` → `/products` → `/cart` took `/` → `/products` too, so a longer journey's sessions are also in the shorter ones. The plan lists as journeys the paths at least one session took whole, from its landing page to its last.
- **Every figure counts sessions,** one page load of your app with its in-app navigation, never people: the capture SDK carries no identity of the visitor. On a site whose links load pages, each page load is a session of its own, so its journeys are each one page long. See [Sessions and sampling](./sessions-and-sampling.md#what-a-session-is).
- **A journey's ID is stable:** it is computed from its pages, so the same pages have the same ID in every plan.

A plan reads the app's sessions that started in the last 30 days and have been turned into flows (`PROCESSED`), at most the newest 50,000. A session that reached no page is counted apart, as `sessionsOnNoPage`, and is in no journey and no total.

## Which journeys Keploy selects to test {#which-journeys-keploy-selects}

Keploy ranks the journeys by how many sessions took them, the most recently seen first among equals. It then takes them in that order, skipping any that adds no move between pages not yet covered, until the journeys taken cover 80% of the window's moves, or until it has taken 20:

- **Moves are weighed by sessions.** Each move from one page to the next counts the sessions that made it, and landing on a page counts as a move too.
- **A longer journey replaces a shorter one it continues,** because its test replays the shorter journey's pages too.
- **A journey with no recording to replay is not run.** Each selected journey is replayed from one session: the newest that took exactly that journey with no error response, preferring one that did something on its pages over one that only landed. Its `flowIds` are the recording a test of the journey replays. A journey is not run, and Keploy moves on, when there is no such session: `ERRORS_ONLY` when every session that took exactly that journey got an error response (a status of 400 or more, or no response), and `NO_REPLAYABLE_RECORDING` when none recorded it whole, because each had more than 100 flows.

The [walkthrough](./walkthrough-dashboard.md#see-the-journeys) works through one plan: five visits along three paths, where a single journey covers 12 of the 15 weighed moves.

## The Journeys tab {#the-journeys-tab}

Open **UI Testing → UI Flows**, select your app in the header, and open the **Journeys** tab. It starts with how many sessions it counts, between which days (UTC), and a note on the unit: every figure counts sessions, not users. A note under it says when a bound left sessions out, such as "Only the newest 50,000 sessions in the window were read; older ones are not counted."

**Journey graph** draws the pages and the moves between them, with each page's share of the sessions that reached it; a move back to a page already on the path is not drawn. The two tables under it are the complete figures: one of pages, with the sessions that reached each page and the sessions that started there, and one of moves, with the sessions that made each move.

<img src="/docs/img/ui-capture/ui-capture-journeys.webp" alt="The top of the Journeys tab: the sessions in the last 30 days, the note that every figure counts sessions, and the journey graph with its tables of pages and moves, each with its share of sessions" width="100%" />

**Journey tests** lists the journeys Keploy replays, with the pages in order, the share of sessions, the badges under **Test**, and when a session last took it (**Last seen (UTC)**). **Selected** marks a journey Keploy picked, and **Runs** says a test of it has a recording to replay. A [pinned](#pinning) journey is marked **Pinned**, and **Not run**, with the reason, when it has no recording to replay, such as "every session that took it got an error response, so there is no clean recording to replay". **Other frequent journeys** lists the most taken journeys that are not in the test plan, marked **Not in the test plan**.

<img src="/docs/img/ui-capture/ui-capture-journey-tests.webp" alt="Journey tests with one selected journey and its share of sessions, and Other frequent journeys with the journeys that are not in the test plan" width="100%" />

Each share is the server's: the sessions, the total they are a share of, and the percentage, shown to two decimals. A share under 0.01% shows as `<0.01%`, never as 0.

When the tab has no plan to show, it says why: **No sessions in this window** when no session started in the last 30 days, and **No session has a journey yet** when sessions were read but none could be counted yet.

## The plan over REST and MCP {#the-plan-over-rest-and-mcp}

The same plan is `GET /client/v1/apps/{appId}/ui/journeys` on the REST API, and the tool `uiJourneys` on the Keploy MCP server, with an API key that has the `read` scope and `app:view` on the app. [Journey plan](./rest-api.md#journey-plan) lists its fields with a real answer. What differs from the tab:

- **Pages are shown as an agent may read them:** a path segment that reads as a secret or a person's data is replaced with `REDACTED`, as in [What an agent sees](./agents.md#what-an-agent-sees), and pages that read alike are one, counted in `pagesMerged`. The graph is cut to 200 pages and 100 moves, and `ranked` to the 50 most taken journeys; what is left out is counted.
- **`freshness` says how current the plan is.** A plan is served for up to 24 hours, or until the sessions processed since it was computed reach a tenth of those it read (at least one; a plan that read the full 50,000 keeps its 24 hours), and the next read then computes a new one. `refresh=true` computes one now, at most once a minute per app; it needs the `write` scope and `testgen:run` on the app.
- **A read may have to wait.** When the server's queue of plan computations is full, or the request ends before its plan is ready, the answer is `429` `RATE_LIMITED`: retry in 10 seconds.

A plan is kept for 14 days; its `planId` names it in [share of sessions](#share-of-sessions) calls until then.

## Share of sessions affected {#share-of-sessions}

`GET /client/v1/apps/{appId}/ui/journeys/impact?planId=<planId>&journeyIds=<id>,<id>`, or the MCP tool `uiJourneyImpact`, says how many of a plan's sessions took at least one of a set of its journeys: the share of sessions a change to those journeys would touch. It is a union, never a sum: a session that took two of the journeys counts once, so the share of two journeys can be less than their shares added up.

- `journeyIds` takes 1 to 100 of the plan's `journeys`, the ones Keploy runs, joined with commas. Over MCP it is one string.
- A journey that is not one of the plan's `journeys` is `400` `INVALID_PARAMETER`; a plan older than 14 days is `404`.

The [agent walkthrough](./walkthrough-agent.md#share-of-sessions) shows a call and its answer.

## The flow graph {#the-flow-graph}

`GET /client/v1/apps/{appId}/ui/flow-graph`, or the MCP tool `uiFlowGraph`, is a second view of how visits move: built from the app's 10,000 most recent flows, a page for each page pattern with its number of flows and its share of sessions, and a link for each move between a session's consecutive flows, with how often it happened and up to five of the flows it led to. Links only go forward in one page order, so moves back to an earlier page are counted in `backLinksDropped`. [Flow graph](./rest-api.md#flow-graph) has a real answer.

The flow graph is on the REST API and MCP only. The dashboard's **Flow Graph** panel on the **Flows** tab does not draw it: it says that the server does not expose `uiFlowGraph` and that the figure was never measured.

## Replay (beta) {#replay-beta}

Replay is what the journey plan is for: Keploy turns the plan's journeys into Playwright tests that replay each journey's recording, its flows, against mocks of the network calls recorded with it. The capture SDK only records; generating and running the tests is Keploy's side.

Replaying journeys as Playwright tests is in beta. Enterprise CLI `v3.9.20` and later ships `keploy ui status --app <id>` and `keploy ui run` on Linux and macOS to check readiness and replay recorded journeys locally or in CI.

What you see in the dashboard and API:

- **Generate Test.** A flow's page in the dashboard has a **Generate Test** button that queues a `PENDING` UI test run. To replay journeys locally or in your own CI, use `keploy ui run` in Enterprise CLI `v3.9.20` and later (Linux and macOS).
- **Test runs.** Runs are listed on the **Test Runs** tab and over the REST API and MCP: [List test runs](./rest-api.md#list-test-runs) and `listUITestRuns`, [Get a test run](./rest-api.md#get-a-test-run) and `getUITestRun`. No REST API or MCP tool creates or runs a test directly; use `keploy ui run`.
- **Verdicts.** A run's results use a closed set of verdicts, shown in the dashboard with these labels:

| Verdict            | Dashboard label   | What it means                                                  |
| ------------------ | ----------------- | -------------------------------------------------------------- |
| `PASSED`           | Passed            | Replayed, and no change from the recording.                    |
| `FAILED`           | Failed            | A real difference from the recording.                          |
| `UNCOVERED`        | No recording      | In scope, but no recording exists to compare to.               |
| `UNPROVEN`         | Not proven        | A comparison was attempted, but its result is not trustworthy. |
| `NONDETERMINISTIC` | Did not reproduce | The run did not reproduce itself.                              |
| `BLOCKED`          | Blocked           | The environment stopped it; nothing was measured.              |
| `PENDING`          | Pending           | Not run yet.                                                   |

## Pinning {#pinning}

A pinned journey is tested whatever its rank, and the plan has room for 50. Pinning is not available to you yet: the dashboard, the REST API and MCP have no way to pin a journey. The plan's `pinned` field, and the tab's **Pinned** badge, are for it.

## Related

- [From first visit to journeys](./walkthrough-dashboard.md)
- [REST API: Journey plan](./rest-api.md#journey-plan)
- [MCP tools](./mcp-tools.md)
- [Operate UI capture from an AI agent](./agents.md)
- [Limits and sizes](./limits.md#on-the-server)
