---
id: cloud-replay
title: Cloud Replay Command Reference
sidebar_label: Cloud Replay
description: Complete reference for every flag of the keploy cloud replay command — app and cluster selection, self-hosted vs SaaS targeting, the --k8s-proxy-url ingress override, release-tag and branch selection, mapping flags, and trigger vs local replay, with examples.
tags:
  - K8s
  - cloud replay
  - CLI
  - flags
  - self-hosted
keywords:
  - keploy cloud replay
  - cloud replay flags
  - k8s-proxy-url
  - k8s-proxy ingress
  - release-tag
  - trigger replay
  - smart-set
  - self-hosted replay
---

# Cloud Replay Command Reference

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

## Overview

`keploy cloud replay` runs an application's cloud-stored test cases against a running deployment and reports pass/fail per test set. It is the command CI pipelines use to gate pull requests and the command developers use to validate a [Keploy branch](/docs/quickstart/k8s-proxy-developer-workflow/) before opening one.

```bash
keploy cloud replay --app <namespace>.<deployment> [flags]
```

Three axes determine how a run behaves:

- **Where the replay executes** — locally on your machine (the default) or inside the cluster (`--trigger`). See [Trigger vs local replay](#trigger-vs-local-replay).
- **Where the test data and cluster live** — Keploy **SaaS** (test assets fetched from the api-server) or **self-hosted** (test assets fetched from your in-cluster k8s-proxy ingress). Keploy detects this from the selected cluster's `deployment_type`; some flags (notably [`--k8s-proxy-url`](#--k8s-proxy-url)) apply only to self-hosted clusters.
- **How the CLI authenticates** — directly against the api-server (the default), or **through the k8s-proxy** for offline/air-gapped self-hosted CI (set `--k8s-proxy-url`, which turns this mode on). See [Authenticating through the k8s-proxy](#authenticating-through-the-k8s-proxy).

:::tip
Every flag is also available via `keploy cloud replay --help`. Run with `--debug` to see which ingress URL, cluster, and branch a run resolved to.
:::

## Quick examples

```bash
# Local replay against a SaaS app, latest release
keploy cloud replay --app prod.orders

# Local replay scoped to a Keploy branch (developer pre-PR check)
keploy cloud replay --app prod.orders --branch-name "$(git rev-parse --abbrev-ref HEAD)"

# Replay only a specific release's test sets
keploy cloud replay --app prod.orders --release-tag docker.io/acme/orders:1.4.2

# Self-hosted via the k8s-proxy: --k8s-proxy-url targets an explicit ingress AND
# authenticates through the proxy (no direct api-server needed) — no --k8s-proxy-auth required
export KEPLOY_API_KEY=kep_xxxxxxxx
keploy cloud replay --app prod.orders --cluster my-cluster \
  --k8s-proxy-url https://keploy-proxy.my-cluster.internal

# In-cluster (trigger) replay of the smart set
keploy cloud replay --app prod.orders --cluster my-cluster --trigger --replay-source smart-set
```

---

## App and cluster selection

| Flag           | Default              | Required    | Description                                                                                                                                                                                                |
| -------------- | -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--app`        | —                    | **Yes**     | App identity. Use `namespace.deployment` for k8s/proxy apps (e.g. `prod.orders`). When `--namespace`/`--deployment` are omitted they are derived from this value.                                          |
| `--cluster`    | —                    | Conditional | Name of the Keploy-registered k8s cluster. Optional when exactly one cluster is actively heart-beating; **required** when more than one active cluster exists or when none is heart-beating (self-hosted). |
| `--namespace`  | derived from `--app` | Conditional | Kubernetes namespace. Required when `--trigger` is set and it can't be derived from `--app`.                                                                                                               |
| `--deployment` | derived from `--app` | No          | Kubernetes deployment name. Derived from `--app` when omitted.                                                                                                                                             |

The `--app` value `prod.orders` is split on the first `.`: `prod` is the namespace and `orders` is the deployment. Pass `--namespace`/`--deployment` explicitly when your names contain dots or when you want to override the derivation.

```bash
# Shorthand — namespace and deployment are derived from --app
keploy cloud replay --app prod.orders

# Whole identity spelled out — use when a name contains a dot, or to be explicit under --trigger
keploy cloud replay --app prod.orders --namespace prod --deployment orders --cluster my-cluster
```

---

## Self-hosted ingress targeting

### `--k8s-proxy-url`

**Self-hosted only.** The k8s-proxy ingress URL to target directly, e.g. `https://keploy-proxy.my-cluster.internal`.

```bash
keploy cloud replay --app prod.orders --cluster my-cluster \
  --k8s-proxy-url https://keploy-proxy.my-cluster.internal
```

:::note
Setting `--k8s-proxy-url` also switches the run into **auth-through-proxy mode** — the CLI authenticates your PAT through the proxy and skips direct api-server calls. You therefore don't pass `--k8s-proxy-auth` separately (the URL turns it on). See [Authenticating through the k8s-proxy](#authenticating-through-the-k8s-proxy) for what that entails (PAT required, `--cluster` name, RBAC, TLS).
:::

By default, a self-hosted cloud replay discovers the k8s-proxy ingress from the selected cluster's **latest heartbeat**. `--k8s-proxy-url` makes that endpoint explicit and overridable: when set, it **overrides** the heartbeat-inferred ingress URL for every k8s-proxy call the run makes (fetching test sets, mocks and mappings, and — under `--trigger` — starting the in-cluster replay and streaming its status).

Reach for it when:

- The ingress address reported by the heartbeat is wrong or unreachable from where you run the CLI (split-horizon DNS, a bastion/port-forward, a freshly changed ingress host).
- You want runs to be reproducible and independent of cluster heartbeat state.

Rules and behaviour:

- Must be an **absolute `http://` or `https://` URL with a host**. Malformed values are rejected up front, before any cluster work, with a clear error. A trailing slash is trimmed automatically.
- Applies to **self-hosted clusters only**. For a SaaS cluster the value is ignored (replay talks to the api-server directly) and the CLI logs a warning so the flag is never silently dropped.
- Because it enters auth-through-proxy mode, the run **skips the cluster-list lookup** and talks to the proxy directly — so the cluster need not be actively heart-beating, but it must still be **registered**: pass the `--cluster` name the app was recorded under.
- Can also be set in `keploy.yml` as `cloud.k8sProxyUrl`.

```yaml
# keploy.yml
cloud:
  k8sProxyUrl: https://keploy-proxy.my-cluster.internal
```

---

## Authenticating through the k8s-proxy

**Self-hosted only.** An additive, opt-in authentication mode for CI runners and boxes that can reach **only** the k8s-proxy — no direct route to the Keploy api-server and no internet. When enabled, the CLI authenticates your API key **through** the k8s-proxy (which validates it against the api-server on your behalf) and then skips every other direct api-server call for the rest of the run.

The two are related but conceptually distinct: [`--k8s-proxy-url`](#--k8s-proxy-url) chooses _which ingress the data plane targets_, while auth mode changes _how the CLI authenticates and which control-plane calls it makes_. In practice you just set the URL and auth mode comes on with it — you rarely pass `--k8s-proxy-auth` yourself.

### Enabling it

| Input                         | Flag               | Environment variable         | keploy.yml                 |
| ----------------------------- | ------------------ | ---------------------------- | -------------------------- |
| k8s-proxy ingress URL         | `--k8s-proxy-url`  | `KEPLOY_K8S_PROXY_URL`       | `cloud.k8sProxyUrl`        |
| API key (PAT)                 | `--api-key`        | `KEPLOY_API_KEY`             | —                          |
| Turn the mode on _(optional)_ | `--k8s-proxy-auth` | `KEPLOY_K8S_PROXY_AUTH=true` | `cloud.k8sProxyAuth: true` |

Only two inputs are required — a proxy URL to reach and a PAT to authenticate. **Setting the proxy URL enables the mode automatically**, so `--k8s-proxy-auth` is optional; pass it (or `KEPLOY_K8S_PROXY_AUTH=true`) only to be explicit. Generate the PAT from **Settings → API Keys** in the dashboard.

```bash
export KEPLOY_API_KEY=kep_xxxxxxxx
export KEPLOY_TLS_SKIP_VERIFY=true
./enterprise/keploy-enterprise cloud replay \
  --k8s-proxy-url https://localhost:8085 \
  --app travelcard.travel-card-api \
  --cluster aditya-selfhosted \
  --test-sets test-set-fc5c588bc-travel-card-api-fc5c588bc-xgfbn \
  --delay 10
```

Notice there is no `--k8s-proxy-auth` flag here: **setting `--k8s-proxy-url` turns k8s-proxy-auth mode on automatically**, so the URL alone enables it. `KEPLOY_API_KEY` (the PAT) and `KEPLOY_TLS_SKIP_VERIFY` (needed when the proxy serves a [self-signed cert](#tls-to-a-self-signed-proxy)) are set as **environment variables**, while `--k8s-proxy-url` and the rest are passed as **flags**. Each input has both a flag and an environment-variable form (see the table above); when both are set, the flag wins.

The proxy URL can also be supplied as an environment variable — `KEPLOY_K8S_PROXY_URL` — which is handy in CI where it sits alongside the other secrets and config:

```bash
export KEPLOY_API_KEY=kep_xxxxxxxx
export KEPLOY_TLS_SKIP_VERIFY=true
export KEPLOY_K8S_PROXY_URL=https://localhost:8085
./enterprise/keploy-enterprise cloud replay \
  --app travelcard.travel-card-api \
  --cluster aditya-selfhosted \
  --test-sets test-set-fc5c588bc-travel-card-api-fc5c588bc-xgfbn \
  --delay 10
```

To be explicit you can still pass `--k8s-proxy-auth` (or `KEPLOY_K8S_PROXY_AUTH=true`), but it is redundant whenever a proxy URL is set.

### What it does

- Authenticates by sending your PAT to the proxy's `/relay-auth` endpoint, which relays it to the api-server's `/auth/apikey` and returns only the verdict — the CLI never contacts the api-server directly.
- Forces the run into **self-hosted** mode: it skips the cluster-list lookup and targets the proxy ingress directly. Because of this, a `--cluster` name is needed (see below).
- **Skips** every direct api-server step that would otherwise hang offline: the api-key exchange, role/plan checks, IT-usage check, update check, and the end-of-run debug-bundle upload (which targets the api-server). Authorization is still enforced server-side by the proxy's RBAC on every request.

### TLS to a self-signed proxy

Self-hosted proxies commonly serve a self-signed certificate. If the auth preflight fails with `certificate signed by unknown authority`, either trust the CA or skip verification:

```bash
# Option A — skip verification (matches the self-hosted data plane)
export KEPLOY_TLS_SKIP_VERIFY=true

# Option B — keep verification on by trusting the proxy's CA
export SSL_CERT_FILE=/path/to/proxy-ca.pem
```

### `--cluster` in this mode

Since the mode skips the cluster-list lookup, pass `--cluster <name>` where `<name>` is the cluster the app was **registered/recorded under** (the deployment's `KEPLOY_CLUSTER_NAME`). The CLI adopts it automatically from the app's record when you omit it; a **wrong** name resolves zero apps (`app <ns>.<dep> not found for the cluster <name>`).

### Permissions

- **Local replay** (no `--trigger`) needs a key with **read + write** — enough to fetch tests and upload the report.
- **In-cluster replay** (`--trigger`) starts an orchestrated replay via the proxy's `/test/start`, which requires the admin-tier `replay:start` permission (or the `ci` scope). Under `KEPLOY_RBAC_MODE=enforce`, a key without it is rejected.

---

## Trigger vs local replay

### `--trigger`

| Flag        | Default | Description                                                                                                                                                                                                                                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--trigger` | `false` | When set, the replay runs **inside the cluster**: the CLI calls the k8s-proxy to start an in-cluster replay job and streams its status. When unset (default), the replay runs **locally** — test cases and mocks are downloaded and replayed from your machine against the deployed app. |

- **Local replay (default)** — best for developer pre-PR validation and CI gating. Supports branch-scoped runs ([`--branch-name`](#branch-overlay-selection) etc.).
- **In-cluster replay (`--trigger`)** — runs the replay as a job in the cluster, reusing the deployment's own networking. Branch flags are **not** supported with `--trigger` (the in-cluster path does not thread branch context); combining them is rejected with an actionable error. Drop `--trigger` to validate a branch locally.

---

## Test source selection

| Flag                | Default          | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--replay-source`   | `latest-release` | Which test cases to replay: `latest-release` (legacy per-release sets) or `smart-set` (the deduped history of every unique flow). `smart-set` requires `EnableSmartTestSet=true` on the app. Invalid values are rejected.                                                                                                                                                                                         |
| `--release-tag`     | —                | Replay only the test sets recorded for a specific release, given as the container image reference (e.g. `docker.io/org/app:1.2.3`, matched on image **and** tag). A bare tag like `1.2.3` matches **every** image carrying that tag (their union), so prefer the full reference when the app has more than one image. When set, only that release's test sets are downloaded and the smart-set source is skipped. |
| `--test-sets`, `-t` | all              | Restrict the run to specific test sets, e.g. `--test-sets "test-set-1, test-set-2"`. Supports selective test cases with the colon syntax: `--test-sets "test-set-1:testCaseA testCaseB"`. Ignored on the `--trigger` smart-set path (the smart set is the unit of replay there).                                                                                                                                  |
| `--useLocalTests`   | `false`          | Use the local test sets, tests, and mocks already on disk instead of fetching them from the cloud.                                                                                                                                                                                                                                                                                                                |
| `--useLocalMock`    | `false`          | Use existing local mocks instead of downloading them from the cloud (test cases are still fetched).                                                                                                                                                                                                                                                                                                               |

---

## Branch overlay selection

Cloud replay can run against a [Keploy branch overlay](/docs/quickstart/k8s-proxy-developer-workflow/) instead of `main`. The three **overlay** flags — `--branch-name`, `--branch-id`, and `--create-branch` — are **mutually exclusive**; pass at most one. `--branch` is separate: it is the legacy CI-derived test-data branch name (auto-detected from the CI environment), and `--branch-name` overrides it when both are present. With no overlay flag set, the run targets `main` (the default). Overlay flags are **not** compatible with `--trigger`.

| Flag              | Default               | Description                                                                                                                                                       |
| ----------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--branch-name`   | —                     | Keploy branch **name** to scope the replay to. The CLI resolves the name to its branch ID internally. The common CI/developer choice — pass your git branch name. |
| `--branch-id`     | —                     | Keploy branch **UUID** to scope the replay to. Use when you already have the ID.                                                                                  |
| `--create-branch` | —                     | Create a new Keploy branch with this name and scope the replay to it. Tip: pass your current git branch name.                                                     |
| `--branch`        | auto-detected from CI | Legacy test-data branch name. Auto-detected from the CI environment when omitted; `--branch-name` overrides it when both are present.                             |

```bash
keploy cloud replay --app prod.orders --branch-name "$(git rev-parse --abbrev-ref HEAD)"
```

---

## Mapping and failure semantics

| Flag                | Default (cloud replay) | Description                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--disable-mapping` | `false`                | Disable test-to-mock mapping during replay. Leave enabled (the default) so the per-test mapping diff is available for diagnostics.                                                                                                                                                                                                                                              |
| `--strict-failure`  | `true`                 | Mark response-failing tests as **FAILED** even when the consumed mock set also diverged from the recorded mapping. With `--strict-failure=false` such cases are demoted to **OBSOLETE** (the historical behaviour). Cloud replay defaults this **on** because it is the CI-gating path; opt out with `--strict-failure=false` (or `test.strictFailure: false` in `keploy.yml`). |

---

## Replay tuning

| Flag                      | Default                  | Description                                                                                                                                                                                                                                                       |
| ------------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--delay`, `-d`           | `5`                      | Seconds to wait for the application to start before sending requests.                                                                                                                                                                                             |
| `--api-timeout`           | —                        | Per-request timeout (seconds) when calling the application under test.                                                                                                                                                                                            |
| `--mongo-password`        | —                        | Authentication password used when mocking MongoDB connections.                                                                                                                                                                                                    |
| `--image`                 | from deployment manifest | Application docker image (with tag) to replay against. Falls back to the image in the K8s deployment manifest when omitted.                                                                                                                                       |
| `--envs`                  | —                        | Add or override environment variables for the replay session, e.g. `--envs "GEN_AI=true,DB_URL=postgres://localhost:5432"`.                                                                                                                                       |
| `--freezeTime`            | `true`                   | Freeze time during the replay run so time-sensitive responses match. Cloud replay enables this by default.                                                                                                                                                        |
| `--channel-binding-shim`  | from record config       | Enable the eBPF channel-binding shim: on replay it downgrades libpq `channel_binding=require`→`disable` so SCRAM-SHA-256-PLUS apps replay against trust-mode mocks. Requires the enterprise cbshim agent image. Mirrors `keploy.yml` `record.channelBindingShim`. |
| `--dedup`                 | `false`                  | Deduplicate the replay run.                                                                                                                                                                                                                                       |
| `--generate-compose-file` | `false`                  | Write the generated docker-compose YAML to disk (`docker-compose-keploy.yaml`) instead of passing it in-memory via stdin. Useful for debugging the generated compose.                                                                                             |

---

## Uploads and reporting

| Flag                     | Default (cloud replay) | Description                                                                                                                                                                           |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--disableMockUpload`    | `true`                 | Disable uploading mocks back to the cloud. Cloud replay defaults this on (replay consumes mocks, it doesn't re-record them).                                                          |
| `--disableReportUpload`  | `false`                | Disable uploading the test report to the server. Defaults off so runs appear in the dashboard; OAuth sessions default it on unless the flag is set explicitly.                        |
| `--disable-debug-bundle` | `false`                | Disable the automatic debug-bundle assembly and upload at the end of the run. By default every run captures a debug-level log and uploads a support bundle to the api-server on exit. |

---

## CI metadata overrides

These take precedence over values auto-detected from the CI provider's environment. Set them when running outside a recognised CI environment or to correct auto-detected values.

| Flag                    | Description                                            |
| ----------------------- | ------------------------------------------------------ |
| `--ci-provider`         | CI provider name (e.g. `github_actions`, `gitlab_ci`). |
| `--ci-branch`           | CI branch name.                                        |
| `--ci-commit-sha`       | CI commit SHA.                                         |
| `--ci-repository`       | CI repository (e.g. `org/repo`).                       |
| `--ci-pr-number`        | Pull request number.                                   |
| `--ci-pr-source-branch` | PR source branch.                                      |
| `--ci-pr-target-branch` | PR target branch.                                      |
| `--ci-trigger-actor`    | User who triggered the pipeline.                       |
| `--ci-pipeline-url`     | URL of the CI pipeline run.                            |

---

## General flags

| Flag                  | Default           | Description                                                                                       |
| --------------------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| `--api-key`           | `$KEPLOY_API_KEY` | Keploy API key for this invocation. Overrides the `KEPLOY_API_KEY` environment variable.          |
| `--path`, `-p`        | `.`               | Path to the local directory where test cases, mocks, and reports are stored/downloaded.           |
| `--config-path`, `-c` | `.`               | Path to the directory containing `keploy.yml`.                                                    |
| `--debug`             | `false`           | Verbose debug logging. Useful to confirm the resolved ingress URL, cluster, and branch for a run. |

---

## SaaS vs self-hosted at a glance

| Concern                     | SaaS                                           | Self-hosted (k8s-proxy)                                                           |
| --------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Where test assets come from | Keploy api-server                              | In-cluster k8s-proxy ingress                                                      |
| `--cluster`                 | Optional (single active cluster auto-selected) | Recommended/required; cluster must be registered and active                       |
| `--k8s-proxy-url`           | Ignored (warned)                               | **Honored** — overrides the ingress URL _and_ switches on auth-through-proxy mode |
| `--k8s-proxy-auth`          | N/A                                            | Optional — implied by `--k8s-proxy-url`; pass only to be explicit                 |
| Auth to the data plane      | api-server token                               | User PAT validated by the k8s-proxy                                               |
| Test report upload          | api-server                                     | k8s-proxy ingress (proxy DB), authenticated with the PAT                          |

---

## Troubleshooting self-hosted replay

Local (non-`--trigger`) self-hosted replay boots the app **and** the Keploy eBPF agent locally via docker-compose, so it has a few environment prerequisites the SaaS path doesn't. The failures below are the common ones, with fixes:

| Symptom                                                          | Cause                                                                                                            | Fix                                                                                           |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `k8s-proxy-auth: … certificate signed by unknown authority`      | Proxy serves a self-signed cert                                                                                  | `export KEPLOY_TLS_SKIP_VERIFY=true` (or `SSL_CERT_FILE=<ca.pem>`)                            |
| `failed to get test sets: unexpected status code: 400`           | Empty `clusterName` sent to the proxy                                                                            | Pass `--cluster <name>` (the app's registered cluster)                                        |
| `app <ns>.<dep> not found for the cluster <name>`                | `--cluster` doesn't match the app's recorded cluster                                                             | Use the exact `KEPLOY_CLUSTER_NAME` the app was recorded under                                |
| `blob not found` / `…/mocks.bin not found`                       | The mock blob isn't in the proxy's object store (e.g. the store was reset after recording)                       | Re-record the test set; keep the metadata DB and object store lifecycles in sync              |
| `sysctl: executable file not found in $PATH`                     | The privileged (sudo) re-exec stripped `/usr/sbin`/`/sbin` from `PATH`                                           | Handled by the CLI automatically; on older builds `export PATH="$PATH:/usr/sbin:/sbin"`       |
| `pull access denied for <app-image>`                             | The app image lives only in the cluster, not the local docker daemon                                             | Load it locally, pass `--image <local-tag>`, or use `--trigger` (in-cluster)                  |
| `manifest for keploy/enterprise:v<ver> not found`                | The eBPF agent image tag derived from the CLI version isn't published (a dev build resolves to `v<version>-dev`) | Use a release binary, or make that tag resolvable to the local docker daemon                  |
| `connection reset by peer` → `ACTUAL STATUS 0` on the first test | The app wasn't listening yet when the first request fired                                                        | Raise `--delay` (e.g. `--delay 20`) for slow-starting apps (JVM, etc.)                        |
| `no matching mock found for POST /v1/logs` (or similar)          | The app exports OpenTelemetry/telemetry to a collector that wasn't mocked                                        | Disable telemetry export for the replay, add the endpoint to `test.globalNoise`, or re-record |

:::tip
For a cluster-deployed app, in-cluster replay (`--trigger --namespace <ns>`) sidesteps the local docker/image/eBPF prerequisites entirely — it replays where the app and its dependencies already run. It needs a key with `replay:start` (admin-tier or the `ci` scope).
:::

---

## Related pages

- [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/) — branches, local validation, and CI gating with cloud replay.
- [Kubernetes setup](/docs/keploy-cloud/kubernetes/) — registering a cluster and installing the k8s-proxy.
- [Smart Test Sets](/docs/keploy-cloud/deduplication/) — what `--replay-source smart-set` replays.
