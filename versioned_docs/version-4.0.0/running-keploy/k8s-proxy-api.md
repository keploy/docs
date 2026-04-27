---
id: k8s-proxy-api
title: Kubernetes Proxy REST API
sidebar_label: Kubernetes Proxy REST API
description: Use the Keploy Kubernetes Proxy REST API to trigger recordings, manage recording and auto-replay configs, stream session status, run replays, and drive the enterprise recording flow programmatically from CI/CD, internal tooling, or AI agents.
tags:
  - kubernetes
  - k8s proxy
  - REST API
  - recording
  - automation
  - enterprise
  - CI/CD
keywords:
  - k8s proxy
  - kubernetes proxy
  - keploy enterprise
  - recording API
  - live recording
  - auto replay
  - programmatic recording
  - shared token
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

The **Keploy Kubernetes Proxy** runs as an in-cluster service that drives recording, replay, and observability for Deployments in one or more namespaces. Its REST API has two groups of routes:

- **Operational routes** such as `/record/start`, `/record/status`, `/test/start`, `/deployments`, and `/proxy/update`. These are the routes used to control live in-cluster recording and replay.
- **API-server-compatible data routes** under `/k8s-proxy/*`. The Console and CLI use these paths for stored test cases, mocks, reports, schema, schema coverage, and saved configs. The proxy can serve these paths directly.

Use this API when you want to script the same Kubernetes live-recording flow the Keploy Console drives from CI/CD pipelines, operators, or internal tooling without running the `keploy` CLI on each node.

**Base URL:** `https://<your-proxy-ingress>` - the externally reachable address configured as `ingressUrl` when you installed the `k8s-proxy` Helm chart. In-cluster callers can use `https://<release-fullname>.<release-namespace>.svc:8080` by default, or `http://<release-fullname>.<release-namespace>.svc:8081` when `proxy.insecure.enabled=true`.

---

## Recording modes: Sidecar and DaemonSet

The Kubernetes Proxy supports two recording modes. Both expose the same REST API documented here — pick whichever fits your environment.

- **Sidecar mode (default).** When recording starts, the proxy's `MutatingAdmissionWebhook` injects a `keploy-agent` sidecar container into the target Pod and rolls it. The agent intercepts traffic from the application container alongside it. This is the mode the rest of this document describes.
- **DaemonSet mode.** A `keploy-daemonset` Pod runs on each node and captures traffic from existing application Pods via eBPF — no sidecar injection, no application-Pod restart. Recording is scoped by a `RecordingSession` Custom Resource that the proxy creates from `/record/start`; the DaemonSet agents pick it up and program their BPF target maps. This is the right mode when application Pods cannot be mutated (read-only RBAC on the application namespace), or when the rollout cost of injecting a sidecar is unacceptable. Cluster-mode auto-replay (a separate replay cluster reached via mounted kubeconfig) is supported in this mode.

The same `/record/start`, `/record/stop`, `/test/start`, `/deployments`, and report endpoints work identically across both modes — the difference is purely in how the agent is delivered to the workload.

---

## Why the Kubernetes Proxy instead of `keploy enterprise` directly?

Running the Keploy enterprise CLI inside a Pod works, but it is a per-app, per-node model: each Deployment you want to record needs its own sidecar plumbing, image rebuild, or pod restart. The Kubernetes Proxy removes that friction:

- **Zero-touch agent setup.** The proxy registers a `MutatingAdmissionWebhook` (`/mutate`) so the Keploy recording agent is injected into target Pods on the next rollout. No image rebuild, sidecar template change, or per-app config knob is required.
- **One API for every Deployment.** A single shared-token-authenticated endpoint starts or stops recording for any Deployment in the watched scope. `podsCount` controls how many pods are recorded and is capped by the Deployment replicas or HPA max replicas.
- **Cluster-wide or namespace-scoped.** Install once per cluster, or set `watchNamespace` to pin the proxy to a single team's namespace. Cross-namespace calls are rejected with `403`.
- **Stored session outputs.** Recording, replay, and schema-coverage outputs are persisted through the configured platform storage. Per-session and proxy logs are available through the log endpoints when log retention/support-bundle storage is enabled.
- **Auto-replay loop.** A recording session can kick off an auto-replay on a cadence (`autoReplayInterval`) against freshly recorded test sets, giving you self-validating live traffic without a separate pipeline.
- **Self-updating.** The proxy can roll itself (and the injected agent) forward via `POST /proxy/update`, so upgrades do not require kubectl or a GitOps round-trip—unless you _want_ GitOps to stay authoritative (the proxy detects and reports reverts).
- **Static deduplication at the edge.** Enable `static_dedup` in the recording config to drop schema-identical traffic _before_ it is ever written as a test case. See [Static Deduplication](/docs/keploy-cloud/static-deduplication/).

If you only need to script a single app outside Kubernetes, the [Public REST API](/docs/running-keploy/public-api/) (`api.keploy.io/client/v1`) is the better fit. The Kubernetes Proxy API is specifically the _live-recording_ control plane.

---

## Authentication

Every protected proxy endpoint requires the cluster **shared token**. Send it as a Bearer token:

```text
Authorization: Bearer <K8S_PROXY_SHARED_TOKEN>
```

Only `GET /healthz` and the admission webhook `POST /mutate` are unauthenticated. Every other route rejects missing or malformed headers with `401 Unauthorized`.

```bash
# Verify the proxy is up (no auth required)
curl -sf https://$PROXY/healthz
# {"status":"ok"}
```

### How the token is provisioned

The proxy generates a 32-byte random value (`crypto/rand`, hex-encoded) on every Pod start and reports it to the Keploy API server in its first heartbeat. The token is **not** sourced from a Helm value, ConfigMap, or Secret, and it rotates whenever the Pod restarts. There is nothing to commit in GitOps and nothing to read out of `kubectl get secret`.

### Retrieve the token

Authenticated callers fetch the current token from the Keploy API server, which mirrors the latest heartbeat from each cluster. Log in once to obtain a user JWT, then look up the proxy app for the Deployment you want to drive:

```bash
API_SERVER="https://api.keploy.io"
NS="default"
DEPLOY="orders-api"
CLUSTER="prod-use1"

# 1. Authenticate as a Keploy user (admin, user, or cicd role)
JWT=$(curl -s -X POST "$API_SERVER/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"..."}' | jq -r '.token')

# 2. Look up the proxy app for this Deployment and read its sharedToken
K8S_PROXY_SHARED_TOKEN=$(curl -s -H "Authorization: Bearer $JWT" \
  "$API_SERVER/cluster/getApp?namespace=$NS&deployment=$DEPLOY&clusterName=$CLUSTER" \
  | jq -r '.sharedToken')

AUTH="Authorization: Bearer $K8S_PROXY_SHARED_TOKEN"
```

`GET /cluster/getApps` returns the same `sharedToken` field for every proxy-managed app in your organization in a single response, which is convenient when you want to script across many Deployments at once.

> The proxy shared token is cluster-wide, not per-user. The API server still uses normal user JWT/cookie authentication on its own routes (including `/cluster/getApp`). Programmatic callers should re-fetch the shared token on each run, since it changes whenever the proxy Pod restarts.

---

## Response format

Handlers return JSON with `application/json` on success. Validation failures usually return `{"error": "..."}` with a 4xx status; shared-token auth failures return `{"success": false, "message": "Unauthorized: ..."}`. A handful of endpoints stream newline-delimited JSON instead - they are called out explicitly below.

```js
// Successful record start (200)
{ "record": "started", "id": "default-orders-api" }

// Validation error (400)
{ "error": "namespace and deployment are required" }

// Auth error (401)
{ "success": false, "message": "Unauthorized: Missing authorization header" }

// Namespace-scoped proxy rejecting a cross-namespace call (403)
{ "error": "this proxy is scoped to namespace \"payments\"" }
```

### Error status codes

| HTTP | When it happens                                                                                 |
| ---- | ----------------------------------------------------------------------------------------------- |
| 400  | Missing or malformed request body, missing required fields                                      |
| 401  | Missing or invalid `Authorization: Bearer` header                                               |
| 403  | Request touches a namespace outside `watchNamespace`, or image repo mismatch on `/proxy/update` |
| 404  | Recording/replay session ID not found, or deployment/config does not exist                      |
| 405  | Wrong HTTP method for the route                                                                 |
| 500  | Kubernetes API error, storage backend unavailable, or unexpected server error                   |
| 503  | Kubernetes client or self-discovery not initialised (proxy is still starting or missing RBAC)   |

---

## Quick start: Trigger and watch a live recording

The golden path: pick a Deployment, start a recording, stream its status, and stop it when you have the traffic you need.

### 1. Set up variables

```bash
PROXY="https://k8s-proxy.example.com"    # ingressUrl from Helm install
AUTH="Authorization: Bearer $K8S_PROXY_SHARED_TOKEN"
NS="default"
DEPLOY="orders-api"
```

### 2. Discover target Deployments

```bash
curl -s -H "$AUTH" "$PROXY/deployments?namespace=$NS" | jq
# [{"name":"orders-api","namespace":"default","replicas":3,"readyReplicas":3}]
```

### 3. Start a recording

```bash
RECORD_ID=$(curl -s -X POST "$PROXY/record/start" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{
    "namespace": "'"$NS"'",
    "deployment": "'"$DEPLOY"'",
    "podsCount": 3,
    "clusterId": "prod-use1",
    "record_config": {
      "static_dedup": true,
      "enable_sampling": 10,
      "filters": [
        { "path": "/health", "urlMethods": ["GET"] }
      ]
    }
  }' | jq -r '.id')

echo "Recording started: $RECORD_ID"
```

On success the proxy registers the session before it touches the workload, ensures the mutating webhook configuration is present, copies the CA secret into the target namespace, creates the headless Service, and triggers a targeted restart of the selected pods so the agent is injected as they come back.

### 4. Stream session status

```bash
curl -N -H "$AUTH" "$PROXY/record/status?record_id=$RECORD_ID"
```

This returns newline-delimited JSON—one event per state change. Each line includes the current testcase count, endpoints seen, mock counts, and `static_dedup_stats` when static dedup is enabled.

```json
{
  "test_cases_count": 12,
  "endpoints": [
    {
      "name": "test-1",
      "endpoint": "/orders",
      "method": "GET",
      "status_code": 200
    }
  ],
  "mock_count": 8,
  "mock_types": {"SQL": 3},
  "status": "running",
  "pods_running": 3,
  "static_dedup_stats": [],
  "started_at": 1712345678
}
```

### 5. Stop the session

```bash
curl -s -X POST "$PROXY/record/stop" \
  -H "$AUTH" -H "Content-Type: application/json" \
  -d '{"record_id":"'"$RECORD_ID"'"}'
# {"record":"stopped","id":"default-orders-api"}
```

The proxy tears down the headless Service, unloads the agent on the next rollout, and flushes the recorded tests to the platform store so they show up under that app in the Keploy Console.

---

## Recording configuration

The `record_config` block in `POST /record/start` is a UI-friendly subset of the OSS `config.Record` struct and is persisted alongside the session so the UI can prefill it and so the exact inputs are auditable.

| Field                 | Type                    | Description                                                                                                                                     |
| --------------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `filters`             | `Filter[]`              | Traffic patterns to filter during recording. Matches use AND semantics across fields.                                                           |
| `client_key`          | `string`                | Optional client identifier propagated to downstream mock capture (useful for multi-tenant apps).                                                |
| `enable_sampling`     | `uint`                  | If set to a positive value, sample 1-in-N matching requests. Omit or set `0` to use the proxy default.                                          |
| `static_dedup`        | `bool`                  | Drop schema-identical traffic in the agent before it becomes a test case. See [Static Deduplication](/docs/keploy-cloud/static-deduplication/). |
| `custom_dedup_fields` | `EndpointDedupFields[]` | Add value-aware fingerprints for matching endpoints. Providing this also enables static dedup for the injected sidecar.                         |
| `low_latency_mode`    | `bool`                  | Start the agent in low-latency mode.                                                                                                            |
| `debug`               | `bool`                  | Start the injected agent with debug logs.                                                                                                       |
| `memory_limit`        | `string`                | Memory request in MiB, expressed as a positive integer string. The container limit is set to twice this value.                                  |
| `secret_protection`   | `object`                | Enable record-time secret detection/obfuscation with optional custom headers, body keys, URL params, and allow lists.                           |

Each `Filter` accepts:

| Field          | Type                | Description                             |
| -------------- | ------------------- | --------------------------------------- |
| `path`         | `string`            | Regex matched against the request path. |
| `host`         | `string`            | Hostname to match.                      |
| `port`         | `uint`              | Port to match.                          |
| `urlMethods`   | `string[]`          | HTTP methods (e.g. `["GET","POST"]`).   |
| `headers`      | `map[string]string` | Header key/value pairs to match.        |
| `filterPolicy` | `string`            | `exclude` (default) or `include`.       |

### Auto-replay configuration

Attach an `auto_replay_config` to `POST /record/start` to automatically replay freshly recorded test sets against a standalone Pod the proxy provisions. Each replay runs in isolation against a fresh Pod + Service so it cannot disturb production traffic.

| Field                | Type                         | Description                                                         |
| -------------------- | ---------------------------- | ------------------------------------------------------------------- |
| `autoReplayInterval` | `int64` (minutes, default 5) | Cooldown between replays for the same session.                      |
| `mongoPassword`      | `string`                     | Override for user-provided Mongo credentials used during replay.    |
| `apiTimeout`         | `uint64` (seconds)           | Per-request timeout for the replayed application.                   |
| `delay`              | `uint64` (seconds)           | Initial delay before starting tests (lets the standalone Pod warm). |
| `globalNoise`        | `object`                     | Fields to ignore during diffing. Accepts `global` and `test-sets`.  |
| `envOverrides`       | `map[string]string`          | Env var overrides for the standalone replay Pod.                    |

---

## Endpoint reference

All paths are relative to the proxy base URL. Unless noted, every route requires `Authorization: Bearer <K8S_PROXY_SHARED_TOKEN>`.

### Health and admission

| Method | Path       | Auth | Description                                                         |
| ------ | ---------- | ---- | ------------------------------------------------------------------- |
| `GET`  | `/healthz` | No   | Liveness probe. Returns `{"status":"ok"}`.                          |
| `POST` | `/mutate`  | No   | Kubernetes MutatingAdmissionWebhook endpoint. Do not call directly. |

### Deployments

| Method | Path                          | Description                                                          |
| ------ | ----------------------------- | -------------------------------------------------------------------- |
| `GET`  | `/deployments?namespace=<ns>` | List Deployments. Omit `namespace` for cluster-wide (unless scoped). |

### Recording

| Method | Path                                                    | Description                                                                               |
| ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `POST` | `/record/start`                                         | Start a recording session. Body: `RecordRequest`. See quickstart above.                   |
| `POST` | `/record/stop`                                          | Stop a session. Body: `{"record_id":"..."}`.                                              |
| `GET`  | `/record/status?record_id=<id>`                         | Stream session status (NDJSON). One line per state change.                                |
| `GET`  | `/record/active?namespace=<ns>&deployment=<dep>`        | Check whether a session is running for a Deployment. Returns `in_progress` + `record_id`. |
| `GET`  | `/record/app-status?namespace=<ns>&deployment=<dep>`    | Report agent-injection and Pod-readiness status for the target app.                       |
| `GET`  | `/record/logs?namespace=<ns>&deployment=<dep>&...`      | Tail recording-session logs. Accepts `stream`, `previous`, `tail_bytes`, `stream_bytes`.  |
| `GET`  | `/record/logs/check?namespace=<ns>&deployment=<dep>`    | Cheap check: are session logs available?                                                  |
| `GET`  | `/record/logs/download?namespace=<ns>&deployment=<dep>` | Download recording logs as a ZIP.                                                         |

**`RecordRequest` body:**

```json
{
  "namespace": "default",
  "deployment": "orders-api",
  "podsCount": 3,
  "clusterId": "prod-use1",
  "record_config": {"static_dedup": true, "enable_sampling": 10, "filters": []},
  "auto_replay_config": {"autoReplayInterval": 10, "delay": 5}
}
```

### Replay / Test

| Method | Path                                                  | Description                                                        |
| ------ | ----------------------------------------------------- | ------------------------------------------------------------------ |
| `POST` | `/test/start`                                         | Start a replay. Body: `ReplayRequest` with optional `test_config`. |
| `POST` | `/test/stop`                                          | Stop a replay. Body: `{"replay_id":"..."}`.                        |
| `GET`  | `/test/status?replay_id=<id>`                         | Stream replay status and per-testcase results (NDJSON).            |
| `GET`  | `/test/active?namespace=<ns>&deployment=<dep>`        | Check whether a replay is in progress for this Deployment.         |
| `POST` | `/test/mock-metadata`                                 | Extended mock metadata.                                            |
| `POST` | `/test/normalize`                                     | AI-normalize testcases in a run.                                   |
| `GET`  | `/test/download?...`                                  | Download a full test bundle (ZIP).                                 |
| `GET`  | `/test/download/active?...`                           | Download tests from the currently active recording session.        |
| `GET`  | `/test/logs?namespace=<ns>&deployment=<dep>&...`      | Tail replay logs. Same flags as `/record/logs`.                    |
| `GET`  | `/test/logs/check?namespace=<ns>&deployment=<dep>`    | Replay-logs availability check.                                    |
| `GET`  | `/test/logs/download?namespace=<ns>&deployment=<dep>` | Replay logs ZIP.                                                   |

**`ReplayRequest` body:**

```json
{
  "namespace": "default",
  "deployment": "orders-api",
  "test_config": {
    "selectedTests": {"test-set-0": ["tc-1", "tc-2"]},
    "apiTimeout": 30,
    "delay": 5,
    "globalNoise": {"global": {"header": {"Date": []}}},
    "envOverrides": {"FEATURE_FLAG_X": "off"}
  }
}
```

Omit `selectedTests` to replay every set.

### API-server-compatible data routes

These routes are all mounted under `/k8s-proxy` and are served directly by the proxy. Direct proxy calls use the proxy shared token; calls routed through the API server use normal Console/API-server authentication and role checks.

#### Health

| Method | Path                | Description                                              |
| ------ | ------------------- | -------------------------------------------------------- |
| `GET`  | `/k8s-proxy/health` | Health check for the API-server-compatible data surface. |

#### Test cases, mocks, and mappings

| Method   | Path                                                | Description                                    |
| -------- | --------------------------------------------------- | ---------------------------------------------- |
| `POST`   | `/k8s-proxy/testcases`                              | Insert a testcase.                             |
| `POST`   | `/k8s-proxy/testcases/bulk`                         | Insert multiple testcases.                     |
| `GET`    | `/k8s-proxy/testcases`                              | Fetch testcases.                               |
| `GET`    | `/k8s-proxy/testcases/detail`                       | Fetch one testcase payload.                    |
| `GET`    | `/k8s-proxy/testcases/metadata`                     | Fetch testcase metadata.                       |
| `POST`   | `/k8s-proxy/testcases/selective`                    | Fetch selected testcases.                      |
| `PUT`    | `/k8s-proxy/testcases/{testCaseId}`                 | Update one testcase.                           |
| `PUT`    | `/k8s-proxy/testcases/bulk`                         | Update multiple testcases.                     |
| `DELETE` | `/k8s-proxy/testcases`                              | Delete testcases.                              |
| `GET`    | `/k8s-proxy/testcases/testsets`                     | List test set IDs.                             |
| `GET`    | `/k8s-proxy/testcases/testsets/metadata`            | List test set metadata.                        |
| `GET`    | `/k8s-proxy/testcases/testsets/latest-release/full` | Fetch latest-release test sets with full data. |
| `DELETE` | `/k8s-proxy/testcases/testset`                      | Delete a test set.                             |
| `POST`   | `/k8s-proxy/mocks/upload`                           | Upload mocks.                                  |
| `GET`    | `/k8s-proxy/mocks/download`                         | Download mocks.                                |
| `GET`    | `/k8s-proxy/mocks/reference`                        | Fetch mock reference metadata.                 |
| `POST`   | `/k8s-proxy/mocks/reference`                        | Insert or update mock reference metadata.      |
| `DELETE` | `/k8s-proxy/mocks/reference`                        | Delete mock reference metadata.                |
| `POST`   | `/k8s-proxy/mappings`                               | Upload mappings.                               |
| `GET`    | `/k8s-proxy/mappings`                               | Fetch mappings.                                |

#### Reports and schema coverage

| Method   | Path                                         | Description                          |
| -------- | -------------------------------------------- | ------------------------------------ |
| `POST`   | `/k8s-proxy/insert/testCaseResult`           | Insert testcase result data.         |
| `GET`    | `/k8s-proxy/get/testCaseResults`             | Fetch testcase result data.          |
| `DELETE` | `/k8s-proxy/clear/testCaseResults`           | Clear testcase result data.          |
| `POST`   | `/k8s-proxy/insert/report`                   | Insert a test report.                |
| `GET`    | `/k8s-proxy/get/report`                      | Fetch one test report.               |
| `GET`    | `/k8s-proxy/get/allReports`                  | List stored reports.                 |
| `GET`    | `/k8s-proxy/get/testRunIds`                  | List test run IDs.                   |
| `GET`    | `/k8s-proxy/get/testRunReports`              | Fetch test-run-level reports.        |
| `GET`    | `/k8s-proxy/get/testSetReports`              | Fetch test-set-level reports.        |
| `GET`    | `/k8s-proxy/get/testCaseReports`             | Fetch per-testcase reports.          |
| `PUT`    | `/k8s-proxy/update/report`                   | Update a report.                     |
| `POST`   | `/k8s-proxy/report/multipart`                | Upload a multipart test-run report.  |
| `POST`   | `/k8s-proxy/autoreplay-metrics`              | Insert auto-replay metrics.          |
| `GET`    | `/k8s-proxy/autoreplay-metrics`              | Fetch auto-replay metrics.           |
| `POST`   | `/k8s-proxy/insert/schema`                   | Insert captured OpenAPI schema.      |
| `PUT`    | `/k8s-proxy/update/schema`                   | Update captured OpenAPI schema.      |
| `GET`    | `/k8s-proxy/get/schema`                      | Fetch captured OpenAPI schema.       |
| `GET`    | `/k8s-proxy/get/schema-coverage`             | Fetch per-endpoint schema coverage.  |
| `POST`   | `/k8s-proxy/schema-coverage-report`          | Save a schema coverage report.       |
| `GET`    | `/k8s-proxy/get/schema-coverage-summary`     | Fetch schema coverage summary.       |
| `GET`    | `/k8s-proxy/get/top-schema-coverage-summary` | Fetch top-N schema coverage summary. |

#### Saved config

| Method | Path                                                | Description                                                            |
| ------ | --------------------------------------------------- | ---------------------------------------------------------------------- |
| `POST` | `/k8s-proxy/config`                                 | Insert or update saved proxy config.                                   |
| `GET`  | `/k8s-proxy/config/{namespace}/{deployment}/{kind}` | Fetch saved config. `kind` can be `record`, `replay`, or `autoreplay`. |
| `GET`  | `/k8s-proxy/config/list/{kind}`                     | List saved configs by kind.                                            |

### Assertion-test generator (ATG)

| Method | Path                            | Description                                                                        |
| ------ | ------------------------------- | ---------------------------------------------------------------------------------- |
| `POST` | `/agent/run/{jobID}`            | Process an ATG job. Accepts optional `?timeout=<seconds>` (default `30`).          |
| `POST` | `/agent/execute-request`        | Execute an HTTP request through the ATG runtime (used during assertion authoring). |
| `POST` | `/agent/service-url`            | Resolve a Service URL inside the cluster (used to target the app from the UI).     |
| `POST` | `/agent/recordATGSandbox`       | Bind to an already-running ATG sandbox recording session.                          |
| `POST` | `/agent/stopATGSandboxRecord`   | Stop an ATG sandbox recording session.                                             |
| `POST` | `/agent/replayATGSandbox`       | Start an ATG sandbox replay session.                                               |
| `POST` | `/agent/stopATGSandboxReplay`   | Stop an ATG sandbox replay session.                                                |
| `GET`  | `/agent/ATGSandboxRecordStatus` | Fetch ATG sandbox recording status.                                                |
| `GET`  | `/agent/ATGSandboxRecordLogs`   | Fetch ATG sandbox recording logs.                                                  |
| `GET`  | `/agent/ATGSandboxReplayLogs`   | Fetch ATG sandbox replay logs.                                                     |
| `GET`  | `/agent/autoReplayLogs`         | Fetch auto-replay logs.                                                            |

### Proxy self-management

| Method | Path                                            | Description                                                                           |
| ------ | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `POST` | `/proxy/update`                                 | Roll the proxy (and optionally the injected agent image) to a new version. See below. |
| `GET`  | `/proxy/update/status`                          | Current rollout state: `""`, `updating`, `desired_applied`, or `reverted_by_gitops`.  |
| `POST` | `/proxy/shutdown`                               | Gracefully terminate the proxy Pod (Kubernetes will reschedule it).                   |
| `GET`  | `/logs/proxy?...`                               | Tail proxy-pod logs. Same flags as session log endpoints.                             |
| `GET`  | `/logs/proxy/download`                          | Download proxy logs as ZIP (current + previous container, when available).            |
| `GET`  | `/autoreplay/debug-bundles`                     | List captured auto-replay debug bundles.                                              |
| `GET`  | `/autoreplay/debug-bundles/{bundleID}`          | Fetch one auto-replay debug bundle metadata record.                                   |
| `GET`  | `/autoreplay/debug-bundles/{bundleID}/download` | Download one auto-replay debug bundle.                                                |
| `POST` | `/autoreplay/debug-bundles/{bundleID}/share`    | Share one auto-replay debug bundle through the configured API server.                 |

**`POST /proxy/update` body:**

```json
{
  "proxy_image": "ghcr.io/keploy/k8s-proxy:v1.4.0",
  "agent_image": "ghcr.io/keploy/keploy:v3.7.1"
}
```

The proxy validates that you are bumping the _same_ image repository (you cannot swap `ghcr.io/keploy/k8s-proxy` for an unknown registry) and then patches its own Deployment. If a GitOps controller (Argo CD, Flux) reverts the bump, `/proxy/update/status` reports `reverted_by_gitops` with guidance to update your Helm values or manifest repo instead.

---

## Namespace scoping

When the proxy is installed with `watchNamespace=<ns>`, every API call is force-scoped to that namespace:

- `GET /deployments` ignores the `namespace` query and returns only that namespace.
- Any request whose `namespace` field does not match returns `403` with `{"error":"this proxy is scoped to namespace \"<ns>\""}`.

Leave `watchNamespace` unset to run cluster-wide. Cluster-wide mode requires Deployment `get`/`list`/`watch` RBAC across all namespaces, which the default Helm chart provisions.

---

## Related guides

- [Static Deduplication](/docs/keploy-cloud/static-deduplication/)—drop duplicate traffic at record time using the `static_dedup` field.
- [Remove Duplicate Tests](/docs/keploy-cloud/deduplication/)—coverage-based dedup at replay time (`keploy dedup`).
- [Public REST API](/docs/running-keploy/public-api/)—Keploy Cloud control plane (apps, suites, jobs).
- [Kubernetes installation](/docs/keploy-cloud/kubernetes/)—install and configure the Kubernetes Proxy.
- [GitOps with Argo CD](/docs/keploy-cloud/gitops-argocd/)—manage the proxy via GitOps, including how `/proxy/update` interacts with reverts.
