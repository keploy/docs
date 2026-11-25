---
id: ci
title: "Check UI capture in CI"
sidebar_label: Check capture in CI
description: Check from a CI job that a build of your web app still records visits that become flows, with an app of its own for CI and a read-only service-account key.
tags:
  - UI testing
  - UI capture
  - CI
keywords:
  - UI capture CI
  - GitHub Actions
  - capture status
  - service account
  - UI_READER
  - ingest key
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

A CI job can check that a build of your web app still records: it serves the build, drives a few visits in a headless browser, ends each one at once, and waits until Keploy has turned every visit into flows. This page sets that up for GitHub Actions with the [React sample shop](https://github.com/keploy/samples-typescript/tree/main/ui-capture-react-shop), and says what to change for your own app.

## What CI can do today {#what-ci-can-do-today}

- **Record visits to a build.** The build carries an ingest key, a scripted browser visits it, and each visit is ended at once with `POST /ui/v1/sessions/<session id>/complete`, so its flows follow within a minute or two instead of after 30 idle minutes.
- **Read what was recorded.** Capture status, flows, the flow graph and the journey plan are read with an API key: a service-account key bound to the `UI_READER` role on the app, or a personal access token with the `read` scope.
- **Replay journeys separately with the CLI.** This workflow checks capture via REST with a read-only `UI_READER` key. Replaying journeys as Playwright tests is in beta and runs through `keploy ui status --app <id>` and `keploy ui run --app <id> --base-url <url>` in Keploy `3.9.20` and later (Linux and macOS). For CI replay, bind a service account to the `UI_RUNNER` role (`UI_READER` only reads).

## Keys at build time {#keys-at-build-time}

The check uses two keys, and they go to different places:

- **The ingest key goes into the build.** The SDK reads it in the browser, so it is built into the page: as `VITE_KEPLOY_INGEST_KEY` in the React shop, `NEXT_PUBLIC_KEPLOY_INGEST_KEY` in the Next.js shop. An ingest key can only post recordings into its app, so it is safe in a page, but whatever page sends it records into that app. Build what CI visits with the key of the app you keep for CI, never with production's.
- **The read key stays in the CI job.** It reads the app's capture status and flows, so keep it in your CI's secrets and never put it in a build.

## Keep CI visits out of production journeys {#keep-ci-visits-out-of-production-journeys}

Give CI an app of its own, such as `storefront-web-ci`. An app's journeys are built from every session it receives in the last 30 days, so scripted visits that record into your production app weigh on its journeys' shares as much as real visitors do. [One app per environment](./ingest-keys.md#one-app-per-environment) explains why.

Create the app with `POST /client/v1/apps` (see [Create an app](./rest-api.md#create-an-app)), then its ingest key, in the dashboard or with the API: see [Create one](./ingest-keys.md#create-one). A key created in the dashboard does not expire; one created with the API can (`ttlDays`).

## Create the service account {#create-the-service-account}

A service account is an identity for a pipeline: it belongs to the organization, not a person, starts with no access, and signs in only with its own keys. Bound to the `UI_READER` role on one app, its key reads that app's capture status, flows, flow graph, journeys, impact and test runs. It cannot create or delete apps, list, mint or revoke ingest keys, or recompute the journey plan.

You need to be an organization admin. On the **Free** plan, an organization can hold **one live service-account key** at a time across `MOCK_READER`, `UI_READER`, and `UI_RUNNER`. If your organization already has a live service-account key, grant this role on the CI app to that existing account (**Grant access** on its row) and reuse its key, or revoke the existing key first — steps 2 and 4 below (creating a new account and new key) are refused on Free while another key is live. When using the CLI, `--rotate` on `keploy service-account key create` replaces only that same account's key and cannot free another account's slot (see [`keploy service-account`](../running-keploy/cli-commands.md#service-account)). Keploy asks you to sign in again first when your sign-in is not recent (**Confirm it's you**).

1. Click your avatar at the bottom of the sidebar, then **Account Settings**. Under **Account**, click **Service Accounts**.
2. Click **New service account**, give it a **Name**, such as `ui-capture-ci`, and click **Create service account**. Its access opens next.
3. Click **Grant access**, or the **Grant permissions** tab. Under **Where does it apply**, keep **App**, and under **Apps** pick the app you keep for CI. Under **What they can do**, tick **UI_READER**. Under **For how long**, the grant lasts 90 days unless you pick another length or **No expiry**. Click **Grant access**.
4. Back on the **Service Accounts** list, click **Keys** on the account's row, then **New key**. Give it a **Key name**, such as `GitHub Actions`, pick its **Expiration**, from 30 to 365 days (90 by default; a service-account key always expires), and click **Create key**.
5. Copy the key: it is shown only once. Click **I've copied my token**.

Add the key to your repository as a secret, `KEPLOY_UI_READER_KEY` below. When the grant or the key expires, the key no longer reads the app: create a new key, or grant the role again, before then.

A personal access token with the `read` scope reads the same data, with its owner's access to the app.

## A capture check for each pull request {#a-capture-check-for-each-pull-request}

This workflow builds the React sample shop with the CI app's ingest key, serves the build, runs the shop's five scripted visits, and waits until every visit has become flows. It is written for a copy of the [samples repository](https://github.com/keploy/samples-typescript), where the shop is the folder `ui-capture-react-shop`; in your own repository, set `working-directory` and `cache-dependency-path` to your app's folder. It needs, in the repository's settings:

- the variable `KEPLOY_CI_APP_ID`: the CI app's ID;
- the secret `KEPLOY_CI_INGEST_KEY`: the CI app's ingest key;
- the secret `KEPLOY_UI_READER_KEY`: the service-account key from above.

```yaml title=".github/workflows/ui-capture-check.yml"
name: UI capture check

on:
  pull_request:

# recentSessions lists an app's ten newest sessions: one check at a time.
concurrency:
  group: ui-capture-check
  cancel-in-progress: false

jobs:
  capture-check:
    # Fork and Dependabot pull requests get no Actions secrets: skip them.
    if: github.event.pull_request.head.repo.full_name == github.repository && github.actor != 'dependabot[bot]'
    runs-on: ubuntu-latest
    timeout-minutes: 30
    defaults:
      run:
        shell: bash
        working-directory: ui-capture-react-shop
    env:
      KEPLOY_API: https://api.keploy.io
      KEPLOY_APP_ID: ${{ vars.KEPLOY_CI_APP_ID }}
      KEPLOY_API_KEY: ${{ secrets.KEPLOY_UI_READER_KEY }}
      VITE_KEPLOY_INGEST_ENDPOINT: https://api.keploy.io/ui/v1/ingest
      VITE_KEPLOY_INGEST_KEY: ${{ secrets.KEPLOY_CI_INGEST_KEY }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: ui-capture-react-shop/package-lock.json

      - name: Install
        run: npm ci

      - name: Install Chromium for Playwright
        run: npx playwright install --with-deps chromium

      - name: Build with the CI app's ingest key
        run: npm run build

      - name: Record five visits, each completed at once
        run: |
          npm run preview &
          timeout 60 bash -c 'until curl -fs http://localhost:4173 >/dev/null; do sleep 1; done'
          npm run -s demo:visits | tee visits.log

      - name: Check that every visit became flows
        run: |
          ui="$KEPLOY_API/client/v1/apps/$KEPLOY_APP_ID/ui"
          auth="Authorization: Bearer $KEPLOY_API_KEY"
          ids=$(sed -n 's/^visit .* -- session \(.*\) completed$/\1/p' visits.log)
          [ -n "$ids" ] || { echo "::error::no visit was recorded"; exit 1; }
          for attempt in $(seq 15); do
            status=$(curl -fsS "$ui/capture-status" -H "$auth")
            waiting=0
            for id in $ids; do
              state=$(jq -r --arg id "$id" '.data.recentSessions[] | select(.sdkSessionId == $id) | .status' <<<"$status")
              echo "session $id: ${state:-not listed yet}"
              case "$state" in
                PROCESSED) ;;
                FAILED) echo "::error::session $id could not be turned into flows"; exit 1 ;;
                *) waiting=1 ;;
              esac
            done
            [ "$waiting" = 0 ] && break
            [ "$attempt" = 15 ] && { echo "::error::the visits had no flows after 15 minutes"; exit 1; }
            sleep 60
          done
          flows=$(curl -fsS "$ui/flows?limit=200" -H "$auth")
          for id in $ids; do
            sid=$(jq -r --arg id "$id" '.data.recentSessions[] | select(.sdkSessionId == $id) | .id' <<<"$status")
            count=$(jq --arg sid "$sid" '[.data[] | select(.sessionId == $sid)] | length' <<<"$flows")
            echo "session $id: $count flows"
            [ "$count" -gt 0 ] || { echo "::error::session $id made no flow"; exit 1; }
          done
```

What each part does:

- **`npm run build`** builds the shop with the two `VITE_KEPLOY_` variables from the job's environment, so the page records into the CI app.
- **`npm run -s demo:visits`** drives five visits through the served build in a headless Chromium. Each visit waits until the capture is recording, ends it with `KeployCapture.stop()`, and completes its session with the ingest key, then prints its session id: `visit 1/5: / > /products > /cart > /checkout -- session <id> completed`. A visit that cannot be completed, such as one whose key was revoked, fails the step.
- **The check** reads [capture status](./rest-api.md#capture-status) once a minute, as often as Keploy extracts flows, until each of this run's sessions, found by its `sdkSessionId` in `recentSessions`, is `PROCESSED`. A `FAILED` session fails the check at once. Then it [lists the flows](./rest-api.md#list-flows), newest first, and checks that each session made at least one: a flow's `sessionId` is the session's `id`.

The check waits on the run's own sessions, not on the app's `state`. `state` is `FLOWS_READY` as soon as the app has any flow, so on an app that earlier runs recorded into, it says nothing about this run.

### For your own app {#for-your-own-app}

Replace the build, serve and visit steps with your own. Your scripted visit has to end its capture and complete its session, and print the session id the check reads. The sample shop shows how: a Playwright init script sets `window.keployScriptedVisit` before the page loads ([`scripts/visits.mjs`](https://github.com/keploy/samples-typescript/blob/main/ui-capture-react-shop/scripts/visits.mjs)), and the shop's own [`src/scripted-visits.ts`](https://github.com/keploy/samples-typescript/blob/main/ui-capture-react-shop/src/scripted-visits.ts) then lets the script call `KeployCapture.stop()` and read `KeployCapture.getSessionId()`. The script completes the session with `POST /ui/v1/sessions/<session id>/complete` and the ingest key in `X-API-Key`. Ordinary visitors' pages never set that flag, so the hook does nothing for them.

To visit a preview deploy instead of a build the job serves, point the visits at it: the shop's script takes the address in `SHOP_URL`. That deploy has to be built with the CI app's ingest key too.

## What the check proves {#what-the-check-proves}

A green check means the build starts the capture SDK, its ingest key and endpoint are right, and its visits reach Keploy and become flows. It does not compare the flows with earlier ones, and it does not test your app's behaviour: that is what [replay](./journeys.md#replay-beta) is for. If the check fails, [Troubleshooting](./troubleshooting.md) lists the usual causes.

## Related

- [Ingest keys and environments](./ingest-keys.md)
- [REST API](./rest-api.md)
- [Sessions and sampling](./sessions-and-sampling.md#end-a-visit-at-once)
- [Operate UI capture from an AI agent](./agents.md)
- [Troubleshooting](./troubleshooting.md)
