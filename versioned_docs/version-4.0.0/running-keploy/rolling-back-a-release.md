---
id: rolling-back-a-release
title: Roll back a release
sidebar_label: Rolling back a release
description: Retire a rolled-back or bad release so Keploy removes its test sets from auto-replay and cloud replay, recomputes the replay baseline, and restores them cleanly if you re-promote.
tags:
  - kubernetes
  - k8s proxy
  - releases
  - rollback
  - argo rollouts
  - cloud replay
keywords:
  - rolling back a release
  - retire release
  - restore release
  - keploy release retire
  - keploy release restore
  - keploy release list
  - replay baseline
  - argo rollouts rollback
  - autoRetireRolledBackRelease
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy identifies an application's releases from the `(imageName, imageTag)` stamped on its non-obsolete test sets and builds the auto-replay and cloud replay range from the application's `ReplayBaseline`. When you roll back a promoted release (`v2` → `v1`), retire the rolled-back release so Keploy stops replaying `v2`'s test sets against `v1` pods and moves the current release and replay baseline back to `v1`.

You can list, retire, and restore releases from the [Public REST API](/docs/running-keploy/public-api/), the [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/), the `keploy release` CLI, or the Keploy Console.

---

## When to retire a release

Retire a release whenever Keploy already recorded test sets for an image tag that should no longer represent active behavior:

- **Rollback after promotion (`v2` → `v1`):** You promoted `v2`, Keploy captured test sets for `v2`, and you later rolled the workload back to `v1`. Because `v2`'s test sets are newer than `v1`'s, `v2` remains the current release and stays in the replay range until you retire it—causing auto-replay and [cloud replay](/docs/keploy-cloud/cloud-replay/) to execute `v2` traffic against `v1` pods.
- **Deleted or bad builds:** A broken build, bad migration, or recalled image tag recorded traffic that should not remain in the replay range or act as the active baseline.

### Canary abort before promotion (no retirement needed)

If you use Argo Rollouts and abort a canary before promotion (`v1` → `v2` paused → abort), **you do not need to retire `v2`**. During an aborted rollout, Keploy binds replacement recordings to the stable ReplicaSet (`v1`) and resolves the workload image from that stable ReplicaSet rather than `Rollout.spec.template`, so Keploy never records test sets for the aborted canary tag.

---

## What retiring and restoring do

Release retirement is explicit, audited, and reversible.

### Retire a release

When you retire a release (for example, `v2`):

1. **Marks live test sets obsolete:** Keploy marks every currently live test set belonging to `(imageName, imageTag)` obsolete and records their IDs in `retiredTestSetIds`. Test sets are preserved as read-only history and are never deleted.
2. **Writes an audit entry:** Keploy appends an audit record with the actor, timestamp, reason (`rolled_back`, `deleted`, or `other`), optional note, and affected set count.
3. **Removes sets from replay:** The retired release leaves both auto-replay and the cloud replay range immediately.
4. **Recomputes `ReplayBaseline` safely:** Keploy recalculates `ReplayBaseline` across the remaining active releases and atomically increments a monotonic lifecycle `epoch`. In the `v1` → `v2` → retire `v2` flow, `v1` becomes the current release and replay baseline again. The `epoch` guard rejects any stale concurrent baseline advance from before the retirement so the baseline cannot snap back to `v2`. If you retire every active release on an app, Keploy writes a tombstone baseline (incrementing `epoch` with an empty replay range) so stale advances are still rejected.
5. **Remains idempotent:** Retiring an already-retired release that has no new live sets succeeds with `200 OK` (`alreadyRetired: true`, `affectedSetCount: 0`) and keeps the original retirement metadata and `retiredTestSetIds`.

### Restore a release

When you re-promote a previously retired release and restore it:

1. **Restores only the retired sets:** Keploy un-obsoletes **only** the set IDs recorded in `retiredTestSetIds` for that retirement. Any test set you manually marked obsolete before retiring stays obsolete.
2. **Recomputes `ReplayBaseline`:** Keploy recalculates `ReplayBaseline` (advancing `epoch`), bringing the release's test sets back into auto-replay and the cloud replay range and making it the current release again if it has the newest test sets.
3. **Remains idempotent:** Calling restore on an already-active release with no pending retired sets returns `200 OK` (`alreadyActive: true`, `affectedSetCount: 0`) with no mutation.

### Re-record a retired tag without restoring

If you re-promote a retired tag (for example, `v2`) and record new traffic without calling restore first:

- Keploy keeps the earlier retired test sets obsolete (`retiredSetCount`) while recording the new sets as live (`activeSetCount`).
- Release listings report `state: "active"` and `displayState: "active (N earlier sets retired)"`.
- Calling **Retire** again obsoletes only the newly recorded live sets and records those set IDs in `retiredTestSetIds`.
- Calling **Restore** restores only the set IDs stored in `retiredTestSetIds`—the original retired sets if you restore before re-retiring, or the newly retired sets if you restore after re-retiring.

### Multi-cluster caveat

:::caution Retiring a release is app-wide
A release retirement applies to the application across **all clusters** serving that same app (same organization, namespace, and deployment). If `prod-us` rolled back from `v2` to `v1` while `prod-eu` is still running `v2`, retiring `v2` immediately removes `v2`'s sets from the app's replay range everywhere.

Always inspect `activeClusters` in the API response, CLI output, or Console confirmation dialog before retiring a tag.
:::

---

## Retire or restore with the Public API

Use the [Public REST API](/docs/running-keploy/public-api/) (`https://api.keploy.io/client/v1`) with a scoped API key (`KEPLOY_API_KEY`):

- `GET /apps/{appId}/releases` requires `read` scope (`testcase:read`).
- `POST /apps/{appId}/releases/{release}/retire` and `POST /apps/{appId}/releases/{release}/restore` require `write` scope (`testcase:update`). Viewers receive `200 OK` on `GET` and `403 Forbidden` on `POST`.

```bash
export KEPLOY_API_KEY="kep_your_api_key"
export APP_ID="your-app-id"
BASE="https://api.keploy.io/client/v1"
```

### 1. List releases

Check the current release, baseline, and which clusters are actively running each tag:

```bash
curl -sS -H "Authorization: Bearer $KEPLOY_API_KEY" \
  "$BASE/apps/$APP_ID/releases" | jq
```

Example response:

```json
{
  "data": {
    "appId": "app-1",
    "currentRelease": {
      "imageName": "ghcr.io/org/orders-api",
      "imageTag": "v2"
    },
    "baseline": {
      "release": {
        "imageName": "ghcr.io/org/orders-api",
        "imageTag": "v2"
      },
      "positionAt": 1732784000,
      "epoch": 1
    },
    "releases": [
      {
        "imageName": "ghcr.io/org/orders-api",
        "imageTag": "v2",
        "state": "active",
        "displayState": "active",
        "totalSetCount": 2,
        "activeSetCount": 2,
        "retiredSetCount": 0,
        "obsoleteSetCount": 0,
        "newestSetAt": 1732784000,
        "isCurrent": true,
        "isBaseline": true,
        "inReplayRange": true,
        "activeClusters": []
      },
      {
        "imageName": "ghcr.io/org/orders-api",
        "imageTag": "v1",
        "state": "active",
        "displayState": "active",
        "totalSetCount": 2,
        "activeSetCount": 2,
        "retiredSetCount": 0,
        "obsoleteSetCount": 0,
        "newestSetAt": 1732780000,
        "isCurrent": false,
        "isBaseline": false,
        "inReplayRange": false,
        "activeClusters": [
          {
            "clusterId": "cl-1",
            "clusterName": "prod-east",
            "heartbeatAt": "2026-11-28T07:00:00Z"
          }
        ]
      }
    ]
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-11-28T07:05:00Z"
  }
}
```

### 2. Retire a release

Pass a required `reason` (`rolled_back`, `deleted`, or `other`) and an optional `note`. The `{release}` path segment accepts either an image tag (`v2`) or a URL-encoded `image:tag`.

```bash
curl -sS -X POST "$BASE/apps/$APP_ID/releases/v2/retire" \
  -H "Authorization: Bearer $KEPLOY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "rolled_back",
    "note": "Rolled back orders-api to v1 after latency spike"
  }' | jq
```

Example response:

```json
{
  "data": {
    "release": {
      "imageName": "ghcr.io/org/orders-api",
      "imageTag": "v2",
      "state": "retired",
      "displayState": "retired",
      "totalSetCount": 2,
      "activeSetCount": 0,
      "retiredSetCount": 2,
      "obsoleteSetCount": 2,
      "isCurrent": false,
      "isBaseline": false,
      "inReplayRange": false,
      "reason": "rolled_back"
    },
    "affectedSetCount": 2,
    "alreadyRetired": false,
    "skipped": false,
    "skipReason": "",
    "activeClusters": [],
    "baseline": {
      "release": {
        "imageName": "ghcr.io/org/orders-api",
        "imageTag": "v1"
      },
      "positionAt": 1732780000,
      "epoch": 2
    }
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440001",
    "timestamp": "2026-11-28T07:06:00Z"
  }
}
```

#### Disambiguate `409 Conflict` with `imageName`

If more than one container image on the same app uses the tag `v2`, the API returns `409 Conflict` listing the matching `imageName` values instead of guessing. Retry with `"imageName"` in the request body (or pass the URL-encoded `image:tag` in `{release}`):

```bash
curl -sS -X POST "$BASE/apps/$APP_ID/releases/v2/retire" \
  -H "Authorization: Bearer $KEPLOY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "rolled_back",
    "imageName": "ghcr.io/org/orders-api",
    "note": "Disambiguated target image"
  }' | jq
```

### 3. Restore a release

```bash
curl -sS -X POST "$BASE/apps/$APP_ID/releases/v2/restore" \
  -H "Authorization: Bearer $KEPLOY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "note": "Re-promoted v2 after upstream fix",
    "imageName": "ghcr.io/org/orders-api"
  }' | jq
```

### Common HTTP status codes

| Status | Meaning                                                                                       |
| ------ | --------------------------------------------------------------------------------------------- |
| `200`  | Operation succeeded (including idempotent no-ops with `alreadyRetired` or `alreadyActive`).   |
| `400`  | Invalid or missing `reason` (must be `rolled_back`, `deleted`, or `other`).                   |
| `401`  | Missing, invalid, or expired API key.                                                         |
| `403`  | Caller has viewer-only access (`testcase:read`) or API key lacks `write` (`testcase:update`). |
| `404`  | App or release tag was not found on the app.                                                  |
| `409`  | Multiple image repositories share the tag—specify `imageName` to disambiguate.                |

:::note Self-hosted Kubernetes Proxy endpoints
Self-hosted deployments expose the same operations under `/k8s-proxy/releases`, `/k8s-proxy/releases/{release}/retire`, and `/k8s-proxy/releases/{release}/restore` using `?namespace=<ns>&deployment=<dep>&clusterName=<cluster>`. See the [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/) reference.
:::

---

## Retire or restore with the Keploy CLI

The Keploy Enterprise CLI provides `keploy release` subcommands that work against both **Keploy Cloud (SaaS)** and **self-hosted `k8s-proxy`** installations.

### List releases

```bash
keploy release list --app prod.orders-api
```

Pass `--cluster` when multiple clusters serve the app, or `--json` for machine-readable output (pure JSON on stdout, logs on stderr):

```bash
keploy release list --app prod.orders-api --cluster prod-east --json
```

### Retire a release

`--reason` defaults to `rolled_back`. Valid values are `rolled_back`, `deleted`, and `other`.

```bash
keploy release retire \
  --app prod.orders-api \
  --release v2 \
  --reason rolled_back \
  --note "Rolled back after latency regression"
```

If multiple images share the tag `v2`, pass `--image` to disambiguate:

```bash
keploy release retire \
  --app prod.orders-api \
  --release v2 \
  --image ghcr.io/org/orders-api \
  --reason rolled_back \
  --cluster prod-east \
  --json
```

### Restore a release

```bash
keploy release restore \
  --app prod.orders-api \
  --release v2 \
  --note "Re-promoted v2 after fix" \
  --cluster prod-east
```

### CLI flags

| Flag        | Applies to                  | Description                                                                              |
| ----------- | --------------------------- | ---------------------------------------------------------------------------------------- |
| `--app`     | `list`, `retire`, `restore` | App identity as `<namespace>.<deployment>` (for example, `prod.orders-api`) or app UUID. |
| `--release` | `retire`, `restore`         | Release tag (for example, `v2`) or `image:tag` reference to retire or restore.           |
| `--reason`  | `retire`                    | Retirement reason: `rolled_back` (default), `deleted`, or `other`.                       |
| `--note`    | `retire`, `restore`         | Optional human-readable explanation recorded in the audit log.                           |
| `--image`   | `retire`, `restore`         | Container image repository name used to disambiguate `409 Conflict` responses.           |
| `--cluster` | `list`, `retire`, `restore` | Registered Kubernetes cluster name (required when more than one cluster serves the app). |
| `--json`    | `list`, `retire`, `restore` | Emit pure JSON to stdout for scripting and CI pipelines.                                 |

---

## Retire or restore in the Keploy Console

1. Open your application in the Keploy Console and navigate to **Recordings → Releases**.
2. Review each release row and its status badges:
   - **Current** marks the newest active release (`isCurrent: true`).
   - **Replay baseline** marks the baseline release used to compute the replay range.
   - **Retired** (for example, `Retired · rolled back`) marks a retired release; hover the badge to inspect the reason, actor, and timestamp.
   - If a retired tag was re-recorded without being restored, the row shows `active (N earlier sets retired)`.
3. Click **Retire** on the rolled-back release to open the confirmation dialog:
   - Review the **Active clusters** list in the dialog. If another cluster is still running that release tag, confirm whether you want to retire it app-wide before continuing.
   - Select a **Reason** (**Rolled back**, **Deleted**, or **Other**) and add an optional **Note**.
   - Confirm the action. Keploy marks the release's live test sets obsolete, removes them from auto-replay and cloud replay, and updates the current release, replay baseline, Recordings tree, and Schema Viewer immediately without a page reload.
4. To bring a retired release back after re-promotion, click **Restore** on that release row and confirm in the Restore dialog. Keploy restores only the test sets retired with that action and recalculates the replay baseline.

:::note Permissions
Only organization **Admins** and application **Editors** (roles with `testcase:update`) see and can trigger **Retire** and **Restore**. **Viewers** can open **Recordings → Releases** to inspect release states and badges, but the action buttons are hidden and write API calls return `403 Forbidden`.
:::

---

## Rollback workflow examples

Pair your Kubernetes or Helm rollback command with `keploy release retire` so Keploy immediately aligns its baseline and replay range with the pods running in the cluster.

### 1. Argo Rollouts (`kubectl argo rollouts undo`)

```bash
# Roll back the Argo Rollout to the previous stable revision
kubectl argo rollouts undo orders-api -n prod
kubectl argo rollouts status orders-api -n prod --watch

# Retire the rolled-back release in Keploy
keploy release retire \
  --app prod.orders-api \
  --cluster prod-east \
  --release v2 \
  --reason rolled_back \
  --note "Argo Rollouts undo to v1"
```

#### Optional: Automate rollback retirement with `rolloutHold.autoRetireRolledBackRelease`

If you run Argo Rollouts with the Keploy Kubernetes Proxy, you can opt in to automatic retirement when a Rollout settles back onto an earlier active release:

```yaml
# values.yaml for the k8s-proxy Helm chart
rolloutHold:
  autoRetireRolledBackRelease: true # default: false (opt-in)
```

This setting maps to the `ROLLOUT_AUTO_RETIRE_ROLLED_BACK_RELEASE` environment variable and defaults to `false` so temporary rollbacks during incident triage or soak-testing bounces do not mutate shared release state without explicit intent.

When set to `true`:

- **Automatic rollback retirement:** After an Argo Rollout settles cleanly on an earlier active release (`v1`), `k8s-proxy` checks `GET /k8s-proxy/releases` and calls `POST /k8s-proxy/releases/{newer}/retire` with `reason: "rolled_back"` and `skipIfOtherClustersActive: true` for each newer active release.
- **Multi-cluster safety guard:** Because `k8s-proxy` sends `skipIfOtherClustersActive: true`, the API makes **no mutation** if another cluster still reports fresh pods or heartbeats on the newer release tag. Instead, it returns `200 OK` with `{"skipped": true, "skipReason": "other_clusters_running_release", "activeClusters": [...]}` and `k8s-proxy` logs why it skipped the retirement.
- **Automatic restore on re-promotion:** If the Rollout later re-promotes and settles on a release that was retired with `reason: "rolled_back"`, `k8s-proxy` automatically calls `POST /k8s-proxy/releases/{settled}/restore`. Releases retired with `reason: "deleted"` or `reason: "other"` are **never** auto-restored.

### 2. Helm (`helm rollback`)

```bash
# Roll back the Helm release to the previous revision
helm rollback orders-api 0 -n prod --wait

# Retire the rolled-back image tag in Keploy
keploy release retire \
  --app prod.orders-api \
  --cluster prod-east \
  --release v2 \
  --reason rolled_back \
  --note "Helm rollback to previous revision"
```

### 3. Kubernetes Deployment (`kubectl rollout undo`)

```bash
# Undo the Deployment rollout and wait for pods to settle
kubectl rollout undo deployment/orders-api -n prod
kubectl rollout status deployment/orders-api -n prod

# Retire the rolled-back image tag in Keploy
keploy release retire \
  --app prod.orders-api \
  --cluster prod-east \
  --release v2 \
  --reason rolled_back \
  --note "kubectl rollout undo deployment/orders-api"
```

### 4. GitHub Actions rollback workflow

Add `KEPLOY_API_KEY` (with `write` scope) to your repository secrets, then run `keploy release retire --json` right after rolling back the workload:

```yaml
name: Rollback production release

on:
  workflow_dispatch:
    inputs:
      namespace:
        description: Kubernetes namespace
        required: true
        default: prod
      deployment:
        description: Deployment name
        required: true
        default: orders-api
      cluster:
        description: Registered Keploy cluster name
        required: true
        default: prod-east
      rolled_back_tag:
        description: Image tag being rolled back (for example, v2)
        required: true
      note:
        description: Reason or incident ticket
        required: false
        default: Manual rollback via GitHub Actions

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Configure kubeconfig
        uses: azure/k8s-set-context@v4
        with:
          kubeconfig: ${{ secrets.KUBECONFIG }}

      - name: Roll back Kubernetes deployment
        run: |
          kubectl rollout undo "deployment/${{ inputs.deployment }}" -n "${{ inputs.namespace }}"
          kubectl rollout status "deployment/${{ inputs.deployment }}" -n "${{ inputs.namespace }}" --timeout=5m

      - name: Retire rolled-back release in Keploy
        env:
          KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
        run: |
          RESULT=$(keploy release retire \
            --app "${{ inputs.namespace }}.${{ inputs.deployment }}" \
            --cluster "${{ inputs.cluster }}" \
            --release "${{ inputs.rolled_back_tag }}" \
            --reason rolled_back \
            --note "${{ inputs.note }}" \
            --json)

          echo "$RESULT" | jq
          AFFECTED=$(echo "$RESULT" | jq -r '.affectedSetCount // .data.affectedSetCount // 0')
          NEW_BASELINE=$(echo "$RESULT" | jq -r '.baseline.release.imageTag // .data.baseline.release.imageTag // "none"')
          echo "Retired ${{ inputs.rolled_back_tag }} ($AFFECTED test sets obsoleted). Active baseline: $NEW_BASELINE"
```

---

## Related guides

- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/) — run cloud-stored test sets against a deployment and understand replay range selection.
- [Public REST API](/docs/running-keploy/public-api/) — authentication, scopes, and full `/client/v1` endpoint reference.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/) — in-cluster recording, auto-replay, and `/k8s-proxy/*` data routes.
- [K8s Proxy DaemonSet Architecture & Auto-Replay Environments](/docs/running-keploy/k8s-proxy-daemonset-architecture/) — how the Kubernetes Proxy captures traffic and dispatches auto-replay.
- [Kubernetes setup](/docs/keploy-cloud/kubernetes/) — install and configure the `k8s-proxy` Helm chart.
