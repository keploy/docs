---
id: rollout-recording-status
title: Rollout Recording Status
sidebar_label: Rollout recording status
description: Understand the unified rollout recording-status contract across Keploy Console, Kubernetes Proxy, Public API v1, MCP, and CLI so humans and AI agents can track Argo Rollouts pauses, handovers, and restarts without inspecting Kubernetes manually.
tags:
  - kubernetes
  - k8s proxy
  - argo rollouts
  - recording
  - REST API
  - MCP
  - CLI
keywords:
  - rollout recording status
  - recording_state
  - waiting_for_rollout
  - ended_by_rollout
  - restarting_after_rollout
  - rollout_wait_timeout
  - handover_failed
  - get_recording_status
  - argo rollouts recording
  - k8s-proxy rollout
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

When an Argo Rollout starts while Keploy is recording a workload, Keploy ends the pre-rollout recording cleanly, tracks the rollout while it progresses, pauses, or aborts, and starts a replacement recording automatically once the rollout settles. To keep humans and AI agents from having to inspect Kubernetes manually to tell a rollout handover apart from a crash, Keploy exposes **one canonical recording-status contract** across every surface:

- **Keploy Console** — persistent rollout banner and rollout timeline on the active recording view and cluster workload row.
- **Kubernetes Proxy (`k8s-proxy`)** — live status on `GET /record/active`, `GET /record/status` (NDJSON stream and terminal event), and `GET /deployments`.
- **Recording runs history** — persisted rollout context on `POST` / `GET /k8s-proxy/recording-runs` so historical runs explain why a session ended and link to its replacement run.
- **Public REST API v1** — `GET /client/v1/apps/{appId}/recording-status`.
- **MCP server** — `get_recording_status` tool at `https://api.keploy.io/client/v1/mcp`.
- **Keploy CLI** — `keploy k8s status` and `keploy k8s record status`.

Whenever a `rollout` block is present, every surface renders the server-generated `message` and `next_action` guidance and never collapses rollout state into a bare `"Stopped"` or `"Failed"` label. Plain Kubernetes Deployments after a non-rollout stop omit the `rollout` block and keep their standard idle or stopped payload.

---

## Recording states (`recording_state`)

Every surface reports the same `recording_state` enum. The six active/rollout states apply across all surfaces; `idle` and `stopped` appear on Public API v1 and MCP when no recording or rollout handover is active.

| `recording_state`          | Surfaces           | Meaning                                                                                                   | When it occurs                                                                                   | Expected transition                                                                                                        |
| -------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `recording`                | All                | A recording session is actively capturing traffic.                                                        | Normal capture before a rollout, or after a replacement recording starts on the settled release. | Continues until stopped manually, or transitions to `ended_by_rollout` when a new rollout starts.                          |
| `ended_by_rollout`         | All                | The prior recording ended because an Argo Rollout started and handover is owed.                           | `k8s-proxy` detects a rollout on the recorded workload and closes the pre-rollout run.           | Transitions automatically to `waiting_for_rollout` as the proxy begins watching the rollout.                               |
| `waiting_for_rollout`      | All                | Keploy is waiting for an in-progress, paused, or aborting rollout to settle before restarting capture.    | Rollout is stepping through canary weights, paused at a gate, or tearing down after an abort.    | Transitions to `restarting_after_rollout` on settle/abort completion, or to `rollout_wait_timeout` if the deadline passes. |
| `restarting_after_rollout` | All                | The rollout settled (or aborted cleanly back to the stable revision) and replacement capture is starting. | Rollout reaches `phase: "settled"` or `phase: "aborted"` and `k8s-proxy` launches the next run.  | Transitions to `recording` with `next_run_id` populated, or to `handover_failed` if the replacement start fails.           |
| `rollout_wait_timeout`     | All                | The rollout did not finish before the handover wait deadline; no replacement recording was started.       | Rollout remained paused or stalled past the configured wait window.                              | Terminal until an operator resolves the rollout and starts a new recording manually.                                       |
| `handover_failed`          | All                | Handover could not start the replacement recording after the rollout finished.                            | Replacement start was cancelled, rejected, or failed (`rollout_not_restarted`).                  | Terminal until an operator inspects the cause and starts a new recording.                                                  |
| `idle`                     | Public API v1, MCP | The application has no active recording and no recent rollout handover event.                             | Workload has never been recorded or has no persisted recording state.                            | Transitions to `recording` when a recording is started.                                                                    |
| `stopped`                  | Public API v1, MCP | Recording ended for a non-rollout reason (reported alongside `stop_reason`).                              | A user, API call, or non-rollout condition stopped recording on a Deployment or Rollout.         | Transitions to `recording` when a new recording is started.                                                                |

---

## Contract schema reference

### Canonical payload example

```json
{
  "recording_state": "waiting_for_rollout",
  "rollout": {
    "kind": "Argo Rollout",
    "phase": "paused",
    "stable_revision": "74c8c9f9bd",
    "new_revision": "5f9b7d6c4a",
    "stable_image_tag": "v1",
    "new_image_tag": "v2",
    "current_step": 2,
    "total_steps": 5,
    "updated_ready": 3,
    "desired": 10,
    "paused_reason": "CanaryPauseStep",
    "aborted": false,
    "started_at": "2026-11-28T09:00:00Z",
    "status_changed_at": "2026-11-28T09:01:12Z"
  },
  "ended_run_id": "run-old-123",
  "ended_run_test_count": 42,
  "next_run_id": "",
  "message": "Recording paused for rollout of orders to v2 (paused at step 2 of 5, 3/10 pods updated). Recording will restart automatically once promoted or aborted.",
  "next_action": "Rollout paused at step 2 of 5 (CanaryPauseStep): promote or abort it in Argo Rollouts."
}
```

### Top-level fields

| Field                  | Type     | Description                                                                                                                                             |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `recording_state`      | `string` | Canonical recording state enum. See [Recording states](#recording-states-recording_state).                                                              |
| `rollout`              | `object` | Live Argo Rollout progress and metadata. Present for all rollout-related states and omitted for plain Deployments and non-rollout stops.                |
| `ended_run_id`         | `string` | Identifier of the recording run that ended when the rollout began.                                                                                      |
| `ended_run_test_count` | `int`    | Number of test cases captured in `ended_run_id` before the rollout handover ended it.                                                                   |
| `next_run_id`          | `string` | Identifier of the replacement recording run started after the rollout settled or aborted. Empty while waiting or after terminal failure/timeout.        |
| `message`              | `string` | Deterministic one-line summary naming the deployment, target image tag (or revision), live progress (`step X of Y, A/B pods updated`), and next step.   |
| `next_action`          | `string` | Actionable operator instruction whenever user intervention is needed (paused rollout, `rollout_wait_timeout`, `handover_failed`). Empty when automatic. |

### `rollout` object fields

| Field               | Type     | Description                                                                                                                                                                                                  |
| ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `kind`              | `string` | Workload controller kind: `"Argo Rollout"`.                                                                                                                                                                  |
| `phase`             | `string` | Current rollout lifecycle phase: `progressing`, `paused`, `aborting`, `aborted`, or `settled`. `aborting` applies while tearing down; `aborted` once back on stable.                                         |
| `stable_revision`   | `string` | Stable pod-template hash from Argo Rollouts `status.stableRS`.                                                                                                                                               |
| `new_revision`      | `string` | Target pod-template hash from Argo Rollouts `status.currentPodHash`.                                                                                                                                         |
| `stable_image_tag`  | `string` | Container image tag resolved from the stable ReplicaSet.                                                                                                                                                     |
| `new_image_tag`     | `string` | Container image tag resolved from the new ReplicaSet (falls back to `Rollout.spec.template` before the new ReplicaSet is created).                                                                           |
| `current_step`      | `int`    | 1-based human step (`min(status.currentStepIndex + 1, total_steps)` while progressing or paused; `total_steps` when settled).                                                                                |
| `total_steps`       | `int`    | Total canary steps from `len(spec.strategy.canary.steps)` (`0` for blue-green rollouts).                                                                                                                     |
| `updated_ready`     | `int`    | Number of ready pods running `new_revision` from the new ReplicaSet.                                                                                                                                         |
| `desired`           | `int`    | Desired replica count from `spec.replicas`.                                                                                                                                                                  |
| `paused_reason`     | `string` | Pause condition reason from `status.pauseConditions[0].reason` (for example, `CanaryPauseStep`, `BlueGreenPause`, `InconclusiveAnalysis`), `"ManualPause"` when `spec.paused` is `true`, or empty otherwise. |
| `aborted`           | `bool`   | `true` when `status.abort` is `true` or `phase` is `aborting` or `aborted`.                                                                                                                                  |
| `started_at`        | `string` | RFC3339 UTC timestamp when the rollout hold/handover started.                                                                                                                                                |
| `status_changed_at` | `string` | RFC3339 UTC timestamp updated whenever `phase`, `current_step`, `updated_ready`, `paused_reason`, `aborted`, or `new_revision` changes.                                                                      |

:::note Backward-compatible fields on `k8s-proxy`
On direct `k8s-proxy` routes (`GET /record/active`, `GET /record/status`, and `GET /deployments`), the `rollout` object also continues to populate existing additive fields (`state`, `since`, `wait_deadline`, `workload_kind`, `desired_replicas`, `updated_replicas`, `updated_ready_replicas`, `old_replicas`, `total_replicas`, and `available_replicas`) alongside the canonical fields above.
:::

---

## Public API v1 endpoint

Query the recording status for any application in your organization via the [Public REST API](/docs/running-keploy/public-api/):

- **Endpoint:** `GET https://api.keploy.io/client/v1/apps/{appId}/recording-status`
- **Operation ID:** `getRecordingStatus`
- **Authentication:** `Authorization: Bearer <API_KEY>` (or `X-API-Key: <API_KEY>`)
- **Required scope:** `read`
- **Required permission:** `record:read`

### Request example

```bash
export KEPLOY_API_KEY="kep_your_api_key"
export APP_ID="your-app-id"

curl -sS \
  -H "Authorization: Bearer $KEPLOY_API_KEY" \
  "https://api.keploy.io/client/v1/apps/$APP_ID/recording-status" | jq
```

### Example: `waiting_for_rollout` (paused canary)

```json
{
  "data": {
    "recording_state": "waiting_for_rollout",
    "rollout": {
      "kind": "Argo Rollout",
      "phase": "paused",
      "stable_revision": "74c8c9f9bd",
      "new_revision": "5f9b7d6c4a",
      "stable_image_tag": "v1",
      "new_image_tag": "v2",
      "current_step": 2,
      "total_steps": 5,
      "updated_ready": 3,
      "desired": 10,
      "paused_reason": "CanaryPauseStep",
      "aborted": false,
      "started_at": "2026-11-28T09:00:00Z",
      "status_changed_at": "2026-11-28T09:01:12Z"
    },
    "ended_run_id": "run-old-123",
    "ended_run_test_count": 42,
    "message": "Recording paused for rollout of orders to v2 (paused at step 2 of 5, 3/10 pods updated). Recording will restart automatically once promoted or aborted.",
    "next_action": "Rollout paused at step 2 of 5 (CanaryPauseStep): promote or abort it in Argo Rollouts."
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-11-28T09:01:15Z"
  }
}
```

### Example: `restarting_after_rollout` (rollout settled)

```json
{
  "data": {
    "recording_state": "restarting_after_rollout",
    "rollout": {
      "kind": "Argo Rollout",
      "phase": "settled",
      "stable_revision": "5f9b7d6c4a",
      "new_revision": "5f9b7d6c4a",
      "stable_image_tag": "v2",
      "new_image_tag": "v2",
      "current_step": 5,
      "total_steps": 5,
      "updated_ready": 10,
      "desired": 10,
      "aborted": false,
      "started_at": "2026-11-28T09:00:00Z",
      "status_changed_at": "2026-11-28T09:05:40Z"
    },
    "ended_run_id": "run-old-123",
    "ended_run_test_count": 42,
    "next_run_id": "run-new-456",
    "message": "Rollout of orders to v2 settled (step 5 of 5, 10/10 pods updated). Restarting replacement recording."
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440001",
    "timestamp": "2026-11-28T09:05:42Z"
  }
}
```

### Example: `rollout_wait_timeout`

```json
{
  "data": {
    "recording_state": "rollout_wait_timeout",
    "rollout": {
      "kind": "Argo Rollout",
      "phase": "paused",
      "stable_revision": "74c8c9f9bd",
      "new_revision": "5f9b7d6c4a",
      "stable_image_tag": "v1",
      "new_image_tag": "v2",
      "current_step": 2,
      "total_steps": 5,
      "updated_ready": 3,
      "desired": 10,
      "paused_reason": "CanaryPauseStep",
      "aborted": false,
      "started_at": "2026-11-28T09:00:00Z",
      "status_changed_at": "2026-11-28T09:01:12Z"
    },
    "ended_run_id": "run-old-123",
    "ended_run_test_count": 42,
    "message": "Rollout wait timed out for orders to v2 (step 2 of 5, 3/10 pods updated); replacement recording was not started.",
    "next_action": "Rollout paused at step 2 of 5 (CanaryPauseStep): promote or abort it in Argo Rollouts. Then start a new recording for orders."
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440002",
    "timestamp": "2026-11-28T09:30:05Z"
  }
}
```

### Example: `handover_failed`

```json
{
  "data": {
    "recording_state": "handover_failed",
    "rollout": {
      "kind": "Argo Rollout",
      "phase": "settled",
      "stable_revision": "5f9b7d6c4a",
      "new_revision": "5f9b7d6c4a",
      "stable_image_tag": "v2",
      "new_image_tag": "v2",
      "current_step": 5,
      "total_steps": 5,
      "updated_ready": 10,
      "desired": 10,
      "aborted": false,
      "started_at": "2026-11-28T09:00:00Z",
      "status_changed_at": "2026-11-28T09:05:40Z"
    },
    "ended_run_id": "run-old-123",
    "ended_run_test_count": 42,
    "message": "Rollout handover failed for orders to v2 (step 5 of 5, 10/10 pods updated); replacement recording could not be started.",
    "next_action": "Inspect the rollout and proxy health for orders, then start a new recording manually."
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440003",
    "timestamp": "2026-11-28T09:06:10Z"
  }
}
```

### Common HTTP status codes

| Status | Meaning                                                               |
| ------ | --------------------------------------------------------------------- |
| `200`  | Returns the canonical recording-status payload inside `data`.         |
| `401`  | Missing, invalid, or expired API key.                                 |
| `403`  | API key lacks `read` scope or caller lacks `record:read` permission.  |
| `404`  | Application ID does not exist or is not in the caller's organization. |

---

## MCP tool (`get_recording_status`)

AI coding assistants connected to the Keploy MCP server (`https://api.keploy.io/client/v1/mcp`) can call `get_recording_status` directly. It is backed in-process by `GET /client/v1/apps/{appId}/recording-status` and returns the same Public API v1 JSON envelope (`{"data": ..., "meta": ...}`). See [MCP Client Configuration](/docs/running-keploy/agent-test-generation/#mcp-client-configuration) or the [K8s Proxy LLM Workflow](/docs/quickstart/k8s-proxy-llm-workflow/) to connect your editor.

### Tool input

```json
{
  "appId": "<app-id>"
}
```

### Example tool response

```json
{
  "data": {
    "recording_state": "waiting_for_rollout",
    "rollout": {
      "kind": "Argo Rollout",
      "phase": "paused",
      "stable_revision": "74c8c9f9bd",
      "new_revision": "5f9b7d6c4a",
      "stable_image_tag": "v1",
      "new_image_tag": "v2",
      "current_step": 2,
      "total_steps": 5,
      "updated_ready": 3,
      "desired": 10,
      "paused_reason": "CanaryPauseStep",
      "aborted": false,
      "started_at": "2026-11-28T09:00:00Z",
      "status_changed_at": "2026-11-28T09:01:12Z"
    },
    "ended_run_id": "run-old-123",
    "ended_run_test_count": 42,
    "message": "Recording paused for rollout of orders to v2 (paused at step 2 of 5, 3/10 pods updated). Recording will restart automatically once promoted or aborted.",
    "next_action": "Rollout paused at step 2 of 5 (CanaryPauseStep): promote or abort it in Argo Rollouts."
  },
  "meta": {
    "request_id": "550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-11-28T09:01:15Z"
  }
}
```

### How AI agents should interpret the contract

- **Do not treat rollout states as crashes:** `ended_by_rollout`, `waiting_for_rollout`, and `restarting_after_rollout` are expected handover states. Do not call `/record/start` or advise the user to debug a failed agent while any of these three states is active.
- **Surface `message` and `next_action` verbatim:** Read fields under `data` and report `data.message` to explain current rollout progress (`data.rollout.current_step` / `data.rollout.total_steps`, `data.rollout.updated_ready` / `data.rollout.desired`, `data.rollout.new_image_tag`). Whenever `data.next_action` is non-empty (for example, `data.rollout.phase == "paused"`, `rollout_wait_timeout`, or `handover_failed`), present `data.next_action` as the recommended step.
- **Track continuity across runs:** Use `data.ended_run_id` and `data.ended_run_test_count` to confirm traffic already captured before the rollout, and follow `data.next_run_id` once `data.recording_state` transitions back to `recording`.
- **Distinguish aborts from failures:** When `data.rollout.aborted` is `true` and `data.rollout.phase` is `aborting` or `aborted`, Keploy is waiting for Argo Rollouts to return to `stable_image_tag` (`stable_revision`) and will automatically resume recording on the stable ReplicaSet.

---

## CLI rendering

The Keploy CLI decodes the canonical contract returned by `k8s-proxy` and renders the server-provided `message` and `next_action` verbatim inside its standard `=== KEPLOY NEXT ===` block:

- `phase:` reports `k8s_recording` for active, waiting, restarting, and terminal rollout recording states.
- `summary:` renders the server-provided `message` verbatim.
- `ask:` renders `next_action` whenever user intervention is required (omitted when handover is progressing automatically).
- `run:` points to `keploy k8s record status --app <ns>.<dep>` while waiting or restarting, and switches to `keploy k8s record start --app <ns>.<dep> --confirm` on terminal failures (`rollout_wait_timeout` or `handover_failed`).

### Check cluster and workload status

```bash
keploy k8s status --app prod.orders
```

Example output while a canary rollout is paused (`waiting_for_rollout`, `phase: "paused"`):

```text
=== KEPLOY NEXT ===
phase:    k8s_recording
summary:  Recording paused for rollout of orders to v2 (paused at step 2 of 5, 3/10 pods updated). Recording will restart automatically once promoted or aborted.
ask:      Rollout paused at step 2 of 5 (CanaryPauseStep): promote or abort it in Argo Rollouts.
run:      keploy k8s record status --app prod.orders
protocol: This output uses a NEXT block. If it has an `ask`, relay it to the user in your own short words and wait — never answer it yourself: run `run` on yes, or the `options` entry they pick. ...
===================
```

### Check active recording status

```bash
keploy k8s record status --app prod.orders
```

Example output once the rollout settles and the replacement recording starts (`restarting_after_rollout`):

```text
=== KEPLOY NEXT ===
phase:    k8s_recording
summary:  Rollout of orders to v2 settled (step 5 of 5, 10/10 pods updated). Restarting replacement recording.
run:      keploy k8s record status --app prod.orders
protocol: This output uses a NEXT block. If it has an `ask`, relay it to the user in your own short words and wait — never answer it yourself: run `run` on yes, or the `options` entry they pick. ...
===================
```

Example output if the rollout exceeds the wait deadline (`rollout_wait_timeout`):

```text
=== KEPLOY NEXT ===
phase:    k8s_recording
summary:  Rollout wait timed out for orders to v2 (step 2 of 5, 3/10 pods updated); replacement recording was not started.
ask:      Rollout paused at step 2 of 5 (CanaryPauseStep): promote or abort it in Argo Rollouts. Then start a new recording for orders.
run:      keploy k8s record start --app prod.orders --confirm
protocol: This output uses a NEXT block. If it has an `ask`, relay it to the user in your own short words and wait — never answer it yourself: run `run` on yes, or the `options` entry they pick. ...
===================
```

---

## Console, proxy, and recording-run surfaces

- **Keploy Console:** Displays a persistent rollout banner on the active recording page and cluster workload row showing live `phase`, `current_step / total_steps`, `updated_ready / desired`, `stable_image_tag -> new_image_tag`, `paused_reason` or `aborted`, `message`, and `next_action`. A compact rollout timeline connects the ended run (`ended_run_id` and `ended_run_test_count`), the waiting phase, and the replacement run link (`next_run_id`) or terminal next action.
- **Kubernetes Proxy live routes:** `GET /record/active`, `GET /record/status`, and `GET /deployments` emit the canonical fields live as Argo Rollout steps advance. On `GET /record/status`, the NDJSON stream flushes immediately whenever rollout progress changes. See the [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/) for authentication and query parameters.
- **Recording runs (`/k8s-proxy/recording-runs`):** Recording-run records optionally persist `recording_state`, `rollout`, `ended_run_id`, `ended_run_test_count`, `next_run_id`, `message`, and `next_action`, so historical run views explain rollout-triggered endings and link directly to replacement runs.

---

## Related guides

- [Public REST API](/docs/running-keploy/public-api/) — authentication, scopes, and full `/client/v1` endpoint reference.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/) — in-cluster `/record/active`, `/record/status`, `/deployments`, and `/k8s-proxy/*` routes.
- [K8s Proxy DaemonSet Architecture & Auto-Replay Environments](/docs/running-keploy/k8s-proxy-daemonset-architecture/) — how the Kubernetes Proxy captures traffic and dispatches auto-replay.
- [K8s Proxy LLM Workflow](/docs/quickstart/k8s-proxy-llm-workflow/) — connect AI coding assistants to Keploy via MCP.
- [Kubernetes setup](/docs/keploy-cloud/kubernetes/) — install and configure the `k8s-proxy` Helm chart.
