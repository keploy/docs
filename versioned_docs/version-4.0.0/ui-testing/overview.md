---
id: overview
title: UI testing with Keploy
sidebar_label: Overview
slug: /ui-testing/
description: Record real user sessions in your web app with the Keploy capture SDK and turn them into UI flows you can read in the Console, over the REST API, or from a coding agent.
keywords:
  - ui testing
  - capture sdk
  - user flows
  - session recording
---

Keploy UI capture records how real users move through your web app and turns each visit into **UI flows**: the pages, the actions and the API calls behind them. You read the flows in the Console, or a coding agent reads them through the REST API or MCP.

## How it works

1. **Create an ingest key** for a Keploy app. It can only post recordings into that app, so it's safe to ship in your page's JavaScript.
2. **Add the capture SDK** (`@keploy/capture-sdk`) to your web app. It records the page and its `fetch`/`XMLHttpRequest` calls, masks what users type, and sends recordings to Keploy in small batches.
3. **Keploy extracts flows.** It ends a visit after 30 minutes without activity, then extracts the visit's flows, usually within a few minutes.
4. **Read the flows** in the Console, over the REST API, or from an agent through MCP.

<CardGrid>
  <Card title="Set up UI capture" href="/running-keploy/ui-capture/">
    Install the SDK and record your first sessions.
  </Card>
  <Card title="SDK error codes" href="/ui-capture/errors/">
    What each `KUI_E_` error means and how to fix it.
  </Card>
</CardGrid>
