---
id: ingest-keys
title: "UI capture ingest keys: create, rotate and revoke them, one app per environment"
sidebar_label: Ingest keys and environments
description: What a Keploy UI ingest key can do, how to create, rotate and revoke one in the dashboard or the API, and why each environment gets its own app.
tags:
  - UI testing
  - UI capture
  - ingest key
keywords:
  - UI ingest key
  - capture SDK apiKey
  - rotate ingest key
  - revoke ingest key
  - uiCaptureSetup
  - environments
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

The capture SDK sends what it records with an **ingest key**, the `apiKey` you pass to `KeployCapture.init()`. This page says what an ingest key can do, how to create, rotate and revoke one in the dashboard or over the API, who may, and why each environment you record should have an app of its own.

## What an ingest key can do {#what-an-ingest-key-can-do}

An ingest key is issued for one Keploy app. It can post recordings into that app and do nothing else: no reads, and no other API. That is what makes it safe to ship in your page's JavaScript, where every visitor can read it.

- It works only on the SDK's two routes: `POST /ui/v1/ingest`, where the SDK posts its batches, and `POST /ui/v1/sessions/<session id>/complete`, which [ends a visit at once](./sessions-and-sampling.md#end-a-visit-at-once). The SDK sends it as the `X-API-Key` header. A script or a CI job may send `Authorization: Bearer kep_…` instead, but from a page only `X-API-Key` passes the routes' CORS rules.
- A live personal access token, or any other live Keploy key that is not an ingest key, is refused there with `403` and "this API key is not a UI ingest key", and an ingest key is refused everywhere else. Never put another kind of Keploy credential in `apiKey`.
- A key records into the app it was created for, whatever page sends it.
- A key belongs to its app, not to the person who created it: it keeps working when that person leaves your organization, and stops working when the app is deleted.

## Create one {#create-one}

### In the dashboard {#create-in-the-dashboard}

1. Open **UI Testing → UI Flows** and select your app in the header. An app with no flows and no test runs shows the setup card on its own; otherwise the card is under the **Setup** tab.
2. Under **1. Create an ingest key**, optionally type a name of up to 100 characters, such as `production web`. Without one, the key is named `web` and today's date, such as `web 2026-11-20`.
3. Click **Create ingest key**. If you signed in more than 15 minutes ago, Keploy first asks you to **Confirm it's you**: click **Sign in again** and sign in.
4. Copy the key. **Copy this key now — it is shown only once.**

<img src="/docs/img/ui-capture/ui-capture-key-created.webp" alt="The setup card after Create ingest key: the new key in a box that says it is shown only once, the install command, an init snippet with the endpoint and the key filled in, and the key listed under Ingest keys" width="100%" />

A key created in the dashboard does not expire: its row under **Ingest keys** says `expires never`. To create one that expires, use the API. The [dashboard quickstart](./quickstart-dashboard.md#create-an-ingest-key) puts a new key into a sample shop.

### With the REST API or MCP {#create-with-the-api}

```bash
curl -X POST https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys \
  -H "Authorization: Bearer kep_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "production web", "ttlDays": 365}'
```

- **`name`** is optional, at most 100 bytes once spaces at either end are trimmed. Without one, the key is named `ui-capture` and today's date in UTC. `Web UI Session`, in any case, is reserved and refused.
- **`ttlDays`** is optional: the key's lifetime, from 1 to 365 days. Without it, the key does not expire.
- **The response's `data`** carries the key as `apiKey`, the `endpoint` the SDK posts to, the SDK's install command and an `init` snippet with the key in it, and the next steps. `apiKey` is in this response only, so store it before you go on.
- **Every call creates a new key.** A stored key's secret cannot be returned again, so list and revoke the keys you no longer use.
- A `409` whose `error.code` is `UI_INGEST_KEY_ACCOUNT_CLAIMED` means the key was taken back because the app's service account was being removed at the same moment: send the request again.

An AI agent does the same with the MCP tool `uiCaptureSetup`. The [Overview](../running-keploy/ui-capture.md#set-up-ui-capture-from-an-ai-agent-mcp) shows how to connect one.

A key's expiry is checked on every request the SDK makes, so a key stops working the moment it expires. A page that sends an expired key is refused with `401`, and its capture ends with [`KUI_E_INGEST_KEY_REJECTED`](./errors.md#kui-e-ingest-key-rejected).

## One app per environment {#one-app-per-environment}

Keploy builds an app's journeys from every session the app receives: each journey's share is a share of all the app's sessions in the last 30 days. Visits from a staging site, a preview deploy or a CI job that record into your production app count in those shares as much as real visitors do.

So give each environment you record an app of its own, such as `storefront-web` for production and `storefront-web-staging` for staging, and give each environment's build the ingest key of its app. Pick each app's name with care: an app's name cannot be changed once it is created.

## Rotate a key {#rotate-a-key}

An app can have several active keys at once, so you can replace one without a gap in recording:

1. Create a new key for the same app.
2. Deploy your app with the new key.
3. Wait until the old key is no longer used. Tabs that loaded your page before the deploy still send the old key until they reload. The key list shows each key's last use (**last used** in the dashboard, `lastUsedAt` over the API), which Keploy updates at most once every 5 minutes.
4. Revoke the old key.

Each key in the list also shows its prefix (`keyPrefix`), the start of the key: it tells you which key a page ships.

## Revoke a key {#revoke-a-key}

**In the dashboard**, open the setup card: under the **Setup** tab once the app has flows or test runs. Under **Ingest keys**, click the trash icon next to the key. The row asks you to confirm: **Pages using it stop recording.** Click **Revoke**.

<img src="/docs/img/ui-capture/ui-capture-revoke.webp" alt="An ingest key's row asking to confirm the revoke, with the line Pages using it stop recording and the Revoke and Cancel buttons" width="100%" />

**Over the API**, delete it by its id from the key list:

```bash
curl https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys \
  -H "Authorization: Bearer kep_YOUR_API_KEY"

curl -X DELETE https://api.keploy.io/client/v1/apps/<appId>/ui/ingest-keys/<keyId> \
  -H "Authorization: Bearer kep_YOUR_API_KEY"
```

The answer's `data` is `{"id": "<keyId>", "revoked": true}`. An id that is not one of this app's ingest keys is answered `404`. The list never returns a key's secret, and keeps revoked keys, marked `revoked`. An agent uses the MCP tools `listUIIngestKeys` and `revokeUIIngestKey`.

Pages that use a revoked key are refused **within about 30 seconds**: each Keploy server keeps its answer for a key for up to 30 seconds. Their capture then ends with [`KUI_E_INGEST_KEY_REJECTED`](./errors.md#kui-e-ingest-key-rejected). Deleting the app deletes its keys too.

## Who can manage keys {#who-can-manage-keys}

| To                 | Permission on the app | API key scope, over the REST API or MCP |
| ------------------ | --------------------- | --------------------------------------- |
| Create a key       | `testgen:run`         | `write`                                 |
| Revoke a key       | `testgen:run`         | `write`                                 |
| List an app's keys | `app:view`            | `read`                                  |

In the dashboard, creating or revoking a key also needs a sign-in less than 15 minutes old: past that, Keploy asks you to **Confirm it's you** first.

Organization admins and the app's App Admins have `testgen:run`. A plain member does not, unless an admin grants it.

No service-account key can manage ingest keys. Listing them is refused to every service account, and creating or revoking one needs `testgen:run`, which none of the roles a service account can hold grants (`ATG_RUNNER`, `ITG_RUNNER`, `UI_READER`, `MOCK_READER`). Use your own API key, or the dashboard.

## Related

- [Dashboard quickstart](./quickstart-dashboard.md)
- [Sessions and sampling](./sessions-and-sampling.md)
- [Limits and sizes](./limits.md)
- [Keploy Public API](../running-keploy/public-api.md)
- [`KUI_E_INGEST_KEY_REJECTED`](./errors.md#kui-e-ingest-key-rejected)
