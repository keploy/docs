---
id: cloud-replay
title: Cloud Replay Command Reference
sidebar_label: Cloud Replay
description: Complete reference for every flag of the keploy cloud replay command — app and cluster selection, self-hosted vs SaaS targeting, the --proxy-url ingress override, release-tag and branch selection, mapping flags, and trigger vs local replay, with examples.
tags:
  - K8s
  - cloud replay
  - CLI
  - flags
  - self-hosted
keywords:
  - keploy cloud replay
  - cloud replay flags
  - proxy-url
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

Two axes determine how a run behaves:

- **Where the replay executes** — locally on your machine (the default) or inside the cluster (`--trigger`). See [Trigger vs local replay](#trigger-vs-local-replay).
- **Where the test data and cluster live** — Keploy **SaaS** (test assets fetched from the api-server) or **self-hosted** (test assets fetched from your in-cluster k8s-proxy ingress). Keploy detects this from the selected cluster's `deployment_type`; some flags (notably [`--proxy-url`](#--proxy-url)) apply only to self-hosted clusters.

:::tip
Every flag is also available via `keploy cloud replay --help`. Run with `-v`/`--debug` to see which ingress URL, cluster, and branch a run resolved to.
:::

## Quick examples

```bash
# Local replay against a SaaS app, latest release
keploy cloud replay --app prod.orders

# Local replay scoped to a Keploy branch (developer pre-PR check)
keploy cloud replay --app prod.orders --branch-name "$(git rev-parse --abbrev-ref HEAD)"

# Replay only a specific release's test sets
keploy cloud replay --app prod.orders --release-tag docker.io/acme/orders:1.4.2

# Self-hosted: target an explicit k8s-proxy ingress instead of the heartbeat-inferred one
keploy cloud replay --app prod.orders --cluster my-cluster \
  --proxy-url https://keploy-proxy.my-cluster.internal

# In-cluster (trigger) replay of the smart set
keploy cloud replay --app prod.orders --cluster my-cluster --trigger --replay-source smart-set
```

---

## App and cluster selection

| Flag | Default | Required | Description |
| --- | --- | --- | --- |
| `--app` | — | **Yes** | App identity. Use `namespace.deployment` for k8s/proxy apps (e.g. `prod.orders`). When `--namespace`/`--deployment` are omitted they are derived from this value. |
| `--cluster` | — | Conditional | Name of the Keploy-registered k8s cluster. Optional when exactly one cluster is actively heart-beating; **required** when more than one active cluster exists or when none is heart-beating (self-hosted). |
| `--namespace` | derived from `--app` | Conditional | Kubernetes namespace. Required when `--trigger` is set and it can't be derived from `--app`. |
| `--deployment` | derived from `--app` | No | Kubernetes deployment name. Derived from `--app` when omitted. |

The `--app` value `prod.orders` is split on the first `.`: `prod` is the namespace and `orders` is the deployment. Pass `--namespace`/`--deployment` explicitly when your names contain dots or when you want to override the derivation.

---

## Self-hosted ingress targeting

### `--proxy-url`

**Self-hosted only.** The k8s-proxy ingress URL to target directly, e.g. `https://keploy-proxy.my-cluster.internal`.

```bash
keploy cloud replay --app prod.orders --cluster my-cluster \
  --proxy-url https://keploy-proxy.my-cluster.internal
```

By default, a self-hosted cloud replay discovers the k8s-proxy ingress from the selected cluster's **latest heartbeat**. `--proxy-url` makes that endpoint explicit and overridable: when set, it **overrides** the heartbeat-inferred ingress URL for every k8s-proxy call the run makes (fetching test sets, mocks and mappings, and — under `--trigger` — starting the in-cluster replay and streaming its status).

Reach for it when:

- The ingress address reported by the heartbeat is wrong or unreachable from where you run the CLI (split-horizon DNS, a bastion/port-forward, a freshly-changed ingress host).
- You want runs to be reproducible and independent of cluster heartbeat state.

Rules and behaviour:

- Must be an **absolute `http://` or `https://` URL with a host**. Malformed values are rejected up front, before any cluster work, with a clear error. A trailing slash is trimmed automatically.
- Applies to **self-hosted clusters only**. For a SaaS cluster the value is ignored (replay talks to the api-server directly) and the CLI logs a warning so the flag is never silently dropped.
- It does **not** bypass cluster registration/activity checks — the cluster must still be registered and (for self-hosted) actively heart-beating. `--proxy-url` only changes *which ingress URL is used*, not whether the cluster is considered valid.
- Can also be set in `keploy.yml` as `cloud.proxyUrl`.

```yaml
# keploy.yml
cloud:
  proxyUrl: https://keploy-proxy.my-cluster.internal
```

---

## Trigger vs local replay

### `--trigger`

| Flag | Default | Description |
| --- | --- | --- |
| `--trigger` | `false` | When set, the replay runs **inside the cluster**: the CLI calls the k8s-proxy to start an in-cluster replay job and streams its status. When unset (default), the replay runs **locally** — test cases and mocks are downloaded and replayed from your machine against the deployed app. |

- **Local replay (default)** — best for developer pre-PR validation and CI gating. Supports branch-scoped runs ([`--branch-name`](#branch-overlay-selection) etc.).
- **In-cluster replay (`--trigger`)** — runs the replay as a job in the cluster, reusing the deployment's own networking. Branch flags are **not** supported with `--trigger` (the in-cluster path does not thread branch context); combining them is rejected with an actionable error. Drop `--trigger` to validate a branch locally.

---

## Test source selection

| Flag | Default | Description |
| --- | --- | --- |
| `--replay-source` | `latest-release` | Which test cases to replay: `latest-release` (legacy per-release sets) or `smart-set` (the deduped history of every unique flow). `smart-set` requires `EnableSmartTestSet=true` on the app. Invalid values are rejected. |
| `--release-tag` | — | Replay only the test sets recorded for a specific release, given as the container image reference (e.g. `docker.io/org/app:1.2.3`, matched on image **and** tag). A bare tag like `1.2.3` matches **every** image carrying that tag (their union), so prefer the full reference when the app has more than one image. When set, only that release's test sets are downloaded and the smart-set source is skipped. |
| `--test-sets`, `-t` | all | Restrict the run to specific test sets, e.g. `--test-sets "test-set-1, test-set-2"`. Supports selective test cases with the colon syntax: `--test-sets "test-set-1:testCaseA testCaseB"`. Ignored on the `--trigger` smart-set path (the smart set is the unit of replay there). |
| `--useLocalTests` | `false` | Use the local test sets, tests, and mocks already on disk instead of fetching them from the cloud. |
| `--useLocalMock` | `false` | Use existing local mocks instead of downloading them from the cloud (test cases are still fetched). |

---

## Branch overlay selection

Cloud replay can run against a [Keploy branch overlay](/docs/quickstart/k8s-proxy-developer-workflow/) instead of `main`. The three branch flags below are **mutually exclusive** — pass at most one. With none set, the run targets `main` (the default). Branch flags are **not** compatible with `--trigger`.

| Flag | Default | Description |
| --- | --- | --- |
| `--branch-name` | — | Keploy branch **name** to scope the replay to. The CLI resolves the name to its branch ID internally. The common CI/developer choice — pass your git branch name. |
| `--branch-id` | — | Keploy branch **UUID** to scope the replay to. Use when you already have the ID. |
| `--create-branch` | — | Create a new Keploy branch with this name and scope the replay to it. Tip: pass your current git branch name. |
| `--branch` | auto-detected from CI | Legacy test-data branch name. Auto-detected from the CI environment when omitted; `--branch-name` overrides it when both are present. |

```bash
keploy cloud replay --app prod.orders --branch-name "$(git rev-parse --abbrev-ref HEAD)"
```

---

## Mapping and failure semantics

| Flag | Default (cloud replay) | Description |
| --- | --- | --- |
| `--disable-mapping` | `false` | Disable test-to-mock mapping during replay. Leave enabled (the default) so the per-test mapping diff is available for diagnostics. |
| `--strict-failure` | `true` | Mark response-failing tests as **FAILED** even when the consumed mock set also diverged from the recorded mapping. With `--strict-failure=false` such cases are demoted to **OBSOLETE** (the historical behaviour). Cloud replay defaults this **on** because it is the CI-gating path; opt out with `--strict-failure=false` (or `test.strictFailure: false` in `keploy.yml`). |

---

## Replay tuning

| Flag | Default | Description |
| --- | --- | --- |
| `--delay`, `-d` | `5` | Seconds to wait for the application to start before sending requests. |
| `--api-timeout` | — | Per-request timeout (seconds) when calling the application under test. |
| `--mongo-password` | — | Authentication password used when mocking MongoDB connections. |
| `--image` | from deployment manifest | Application docker image (with tag) to replay against. Falls back to the image in the K8s deployment manifest when omitted. |
| `--envs` | — | Add or override environment variables for the replay session, e.g. `--envs "GEN_AI=true,DB_URL=postgres://localhost:5432"`. |
| `--freezeTime` | `true` | Freeze time during the replay run so time-sensitive responses match. Cloud replay enables this by default. |
| `--channel-binding-shim` | from record config | Enable the eBPF channel-binding shim: on replay it downgrades libpq `channel_binding=require`→`disable` so SCRAM-SHA-256-PLUS apps replay against trust-mode mocks. Requires the enterprise cbshim agent image. Mirrors `keploy.yml` `record.channelBindingShim`. |
| `--dedup` | `false` | Deduplicate the replay run. |
| `--generate-compose-file` | `false` | Write the generated docker-compose YAML to disk (`docker-compose-keploy.yaml`) instead of passing it in-memory via stdin. Useful for debugging the generated compose. |

---

## Uploads and reporting

| Flag | Default (cloud replay) | Description |
| --- | --- | --- |
| `--disableMockUpload` | `true` | Disable uploading mocks back to the cloud. Cloud replay defaults this on (replay consumes mocks, it doesn't re-record them). |
| `--disableReportUpload` | `false` | Disable uploading the test report to the server. Defaults off so runs appear in the dashboard; OAuth sessions default it on unless the flag is set explicitly. |
| `--disable-debug-bundle` | `false` | Disable the automatic debug-bundle assembly and upload at the end of the run. By default every run captures a debug-level log and uploads a support bundle to the api-server on exit. |

---

## CI metadata overrides

These take precedence over values auto-detected from the CI provider's environment. Set them when running outside a recognised CI environment or to correct auto-detected values.

| Flag | Description |
| --- | --- |
| `--ci-provider` | CI provider name (e.g. `github_actions`, `gitlab_ci`). |
| `--ci-branch` | CI branch name. |
| `--ci-commit-sha` | CI commit SHA. |
| `--ci-repository` | CI repository (e.g. `org/repo`). |
| `--ci-pr-number` | Pull request number. |
| `--ci-pr-source-branch` | PR source branch. |
| `--ci-pr-target-branch` | PR target branch. |
| `--ci-trigger-actor` | User who triggered the pipeline. |
| `--ci-pipeline-url` | URL of the CI pipeline run. |

---

## General flags

| Flag | Default | Description |
| --- | --- | --- |
| `--api-key` | `$KEPLOY_API_KEY` | Keploy API key for this invocation. Overrides the `KEPLOY_API_KEY` environment variable. |
| `--path`, `-p` | `.` | Path to the local directory where test cases, mocks, and reports are stored/downloaded. |
| `--config-path`, `-c` | `.` | Path to the directory containing `keploy.yml`. |
| `--debug` | `false` | Verbose debug logging. Useful to confirm the resolved ingress URL, cluster, and branch for a run. |

---

## SaaS vs self-hosted at a glance

| Concern | SaaS | Self-hosted (k8s-proxy) |
| --- | --- | --- |
| Where test assets come from | Keploy api-server | In-cluster k8s-proxy ingress |
| `--cluster` | Optional (single active cluster auto-selected) | Recommended/required; cluster must be registered and active |
| `--proxy-url` | Ignored (warned) | **Honored** — overrides the heartbeat-inferred ingress URL |
| Auth to the data plane | api-server token | User PAT validated by the k8s-proxy |

---

## Related pages

- [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/) — branches, local validation, and CI gating with cloud replay.
- [Kubernetes setup](/docs/keploy-cloud/kubernetes/) — registering a cluster and installing the k8s-proxy.
- [Smart Test Sets](/docs/keploy-cloud/deduplication/) — what `--replay-source smart-set` replays.
