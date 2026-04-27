---
id: k8s-proxy-daemonset-architecture
title: K8s Proxy DaemonSet Architecture & Auto-Replay Environments
sidebar_label: DaemonSet & Auto-Replay
description: How Keploy's DaemonSet recording works under the hood and the three environments where auto-replay can run—in-cluster, Docker daemon runner, and a separate replay cluster.
tags:
  - kubernetes
  - k8s proxy
  - daemonset
  - architecture
  - auto-replay
  - enterprise
keywords:
  - keploy daemonset
  - eBPF capture
  - RecordingSession CRD
  - auto-replay modes
  - cluster-mode replay
  - replay-runner
  - docker daemon replay
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

The Keploy Kubernetes Proxy supports two recording modes—**Sidecar** and **DaemonSet**—and three independent **auto-replay environments** that the same proxy can dispatch to. This page explains the moving parts of DaemonSet recording and then walks through the three replay environments end to end.

If you only want the install steps, see [the K8s Proxy quickstart](/docs/quickstart/k8s-proxy/) or [the customer cluster-mode setup guide](/docs/running-keploy/k8s-proxy-api/). This document is the "behind the scenes" reference.

---

## Part 1—DaemonSet recording architecture

### Why DaemonSet mode

Sidecar mode injects a `keploy-agent` container into your application Pod via a `MutatingAdmissionWebhook` and rolls the Deployment. That works, but it has two non-trivial requirements:

1. **Write RBAC on the application namespace.** The proxy needs `patch deployments` to add the sidecar.
2. **An application restart at recording start.** The injected sidecar only takes effect on the next rollout.

In production environments where Keploy must operate under read-only RBAC on the application namespace, or where rolling the Pod has unacceptable cost, neither requirement is acceptable. DaemonSet mode removes both.

### The three components

```
┌────────────── Source cluster ──────────────────────────────────────────┐
│                                                                        │
│   ┌───────────────┐         ┌─────────────────────────────────────┐    │
│   │ Application   │         │ k8s-proxy (Deployment)              │    │
│   │ Pods          │         │  - controller-runtime manager       │    │
│   │  (unchanged,  │         │  - REST API (/record/start, etc.)   │    │
│   │   no sidecar) │         │  - persists to MinIO + MongoDB      │    │
│   └───────┬───────┘         └──────────────┬──────────────────────┘    │
│           │                                │                            │
│           │ traffic captured by eBPF       │ creates RecordingSession  │
│           │                                ▼                            │
│           │                     ┌────────────────────────────┐          │
│           │                     │ kube-apiserver / etcd      │          │
│           │                     │ • RecordingSession CRD     │          │
│           │                     │ • ReplaySession CRD        │          │
│           │                     └──────────────┬─────────────┘          │
│           │                                    │ watch                  │
│   ┌───────▼─────────────────────────────────┐  │                        │
│   │ keploy-daemonset (per node)             │◀─┘                        │
│   │  - controller-runtime watches the CR    │                            │
│   │  - resolves matching Pods on this node  │                            │
│   │  - programs target_namespace_pids +     │                            │
│   │    target_cgroup_ids BPF maps           │                            │
│   │  - eBPF programs filter by those maps   │                            │
│   │  - uploads test cases + mocks back to   │                            │
│   │    k8s-proxy over HTTP                  │                            │
│   └─────────────────────────────────────────┘                            │
└────────────────────────────────────────────────────────────────────────┘
```

The pieces:

1. **k8s-proxy Deployment.** Same single-replica controller you already run for Sidecar mode. It owns the REST API the Console calls (`/record/start`, `/record/stop`, `/test/start`, etc.), persists captured artifacts to MinIO + MongoDB, and dispatches auto-replay (see Part 2).
2. **`recordingsessions.keploy.io` CRD.** A small Custom Resource the proxy creates at `/record/start`. Each CR is named after the target Deployment and carries a `podSelector`, the list of containers to trace, and the desired mock format. The CRD is the authoritative coordination object between the control plane (k8s-proxy) and the data plane (DaemonSet). Status flows back as a `perNode` array on the CR's `status` subresource.
3. **`keploy-daemonset` DaemonSet.** One Pod per node, running the same enterprise binary you ship for Sidecar mode but in agent-only mode. Each Pod loads its eBPF programs, watches the RecordingSession CR via controller-runtime, and is responsible for capturing traffic from the application Pods that landed on its node.

A `replaysessions.keploy.io` CRD ships alongside RecordingSession but is not used by any current replay environment—it exists so the controller-runtime scheme registers cleanly when a future in-cluster served-replay path is wired up.

### Lifecycle of a recording session

1. **Console click → `/record/start`.** The handler in `pkg/http/handlers.go` reads the target Deployment, extracts its pod-selector labels and container names, and creates (or updates) a `RecordingSession` CR named after the Deployment. In DaemonSet mode the entire mutating-webhook + sidecar injection path is short-circuited—no application Pod is touched.
2. **Per-node reconciler picks up the CR.** Each DaemonSet Pod runs a `SessionReconciler` that listens for CR add/update/delete events. On add/update it:
   - Lists Pods on its own node matching the CR's `podSelector`.
   - For each matching Pod, resolves the application container's TGIDs (process IDs the kernel sees) and cgroup IDs.
   - Inserts those TGIDs into the `target_namespace_pids` BPF map and the cgroup IDs into `target_cgroup_ids`.
   - The eBPF capture programs filter every observed packet against those two maps; non-matching traffic is dropped without being copied to userspace.
3. **Pod churn.** The reconciler re-runs on a 15-second cadence even without CR events, so freshly scheduled or restarted Pods get their TGIDs registered before traffic arrives. When a TGID exits, a `tp_btf/sched_process_exit` BPF program removes it from the map automatically (no userspace book-keeping required).
4. **Capture.** As traffic flows, each DaemonSet agent buffers test cases and mocks locally and uploads them to k8s-proxy over HTTP using a shared bearer token. k8s-proxy persists them to MinIO (mocks) and MongoDB (test cases, reports).
5. **`/record/stop`.** The proxy deletes the RecordingSession CR. Each agent's reconciler sees the delete event, releases the TGID/cgroup refcounts, and the eBPF filter starts dropping all traffic again. A trailing auto-replay fires automatically (see Part 2).

### Targeting in eBPF: TGIDs and cgroup IDs

You may notice the agent maintains **two** target maps. That's deliberate.

- `target_namespace_pids` is the primary mechanism—TGID matching works in any modern kernel and is cheap. The reconciler resolves a Pod's TGIDs by walking its container statuses.
- `target_cgroup_ids` is a fallback for environments where TGID resolution is unreliable. On nested PID namespaces (some kind/k3s setups, certain CRI runtimes), the TGID a userspace tool sees does not always match the TGID the kernel reports inside an eBPF program. The reconciler captures each Pod's cgroup ID alongside its TGIDs and the eBPF programs OR-gate the two checks: a packet is captured if **either** its TGID is in `target_namespace_pids` **or** its cgroup ID is in `target_cgroup_ids`.

This dual-targeting closes the gap on platforms that drop TGID-only filters and is one of the reasons DaemonSet mode is robust on managed Kubernetes flavours.

### What you don't get without the DaemonSet

If `daemonset.enabled=false` in the chart, `/record/start` falls back to the Sidecar path: the proxy injects the agent via the webhook and rolls the application Pod. Both modes drive the same REST API and persist to the same MongoDB schema, so the rest of the Console (Reports, Schema Coverage, Auto-Replay history) does not need to know which mode produced the data.

---

## Part 2—Auto-replay environments

When a recording session ends—either because the cooldown window expires or because `/record/stop` was called—the proxy fires an auto-replay against the freshly recorded test sets. Where that replay actually runs is controlled by `KEPLOY_AUTO_REPLAY_MODE`. Three values are supported, deliberately independent of each other:

| Mode      | Replay runs on…                           | Best for                                                                                                               |
| --------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `crd`     | the source Kubernetes cluster (legacy)    | Dev/staging where Keploy already has write RBAC on the application namespace.                                          |
| `runner`  | a Docker daemon outside the cluster       | Customers who don't want any pod scheduling for replay; long-lived runners that pull work over HTTP.                   |
| `cluster` | a separate Kubernetes cluster you provide | Production with read-only RBAC on the source cluster; replay runs against an isolated Pod in a customer-owned cluster. |

`cluster` is the default in current builds. The mode is process-wide on each k8s-proxy Pod—flipping it requires a Helm upgrade or `kubectl set env` and a rollout.

### How dispatch works

`/record/stop` runs the recording teardown synchronously and then enters a dispatch branch in `pkg/http/handlers.go`. The branch reads `cfg.AutoReplayMode` and routes to one of three handlers, each of which knows how to stand up a replay environment from the captured test cases. All three eventually drive the OSS replayer (`go.keploy.io/server/v3/pkg/service/replay`)—what differs is **where the application under test actually runs** during replay.

The default replay-start delay is **10 seconds** in all three modes. This gives the replayed application time to bind its port before the OSS replayer fires the first test case. Callers can override it via `auto_replay_config.delay` in the `/record/start` body.

---

### Mode A—`crd` (legacy in-cluster)

```
[/record/stop]
      │
      ▼
k8s-proxy
  • creates a standalone Pod + Service in the source cluster
    by stamping out the source Deployment's PodTemplate
    minus the application's container args
  • injects a keploy-agent sidecar (same webhook path
    Sidecar-mode recording uses)
  • drives the OSS replayer against the standalone Service
  • tears down the Pod + Service when replay ends
```

**RBAC required on the application namespace:** `create / patch / delete` on Pods, Services, and NetworkPolicies. This is exactly what the read-only-source threat model rules out, which is why the other two modes exist.

**When to use it:** dev / staging clusters where Keploy already has write RBAC. Mode is selected with `KEPLOY_AUTO_REPLAY_MODE=crd`. No additional config is required.

---

### Mode B—`runner` (Docker daemon)

```
[/record/stop]
      │
      ▼
k8s-proxy
  • POSTs a CreateReplayJobRequest to its own
    /replay-jobs endpoint, which puts a ReplayJob
    in an in-memory store with status=pending

(somewhere outside the cluster, on a host with Docker installed)
keploy-replay-runner   ─poll──▶  k8s-proxy /replay-jobs/poll
   binary                       (HTTPS, shared bearer token)
      │
      │ receives a job:
      │   { record_id, test_set_ids[], image, env, app_port, ... }
      ▼
   docker run <image>             (the application container)
   docker run keploy/enterprise   (the keploy agent, on the same
                                  user-defined Docker network)
      │
      │ keploy enterprise replay … --record-id=<id>
      │   downloads mocks + test cases from k8s-proxy via HTTP
      │   runs the OSS replayer
      ▼
   docker rm <both containers>
      │
      │ POST /replay-jobs/{jobID}/complete
      ▼
k8s-proxy
  • merges the report into Mongo
  • surfaces the run on the Console reports dashboard
```

The runner is a small standalone binary (`cmd/replay-runner` in the k8s-proxy repo). It is not deployed by the chart—operators install it on whichever machine has the Docker daemon, point it at the proxy with a shared token, and start it as a systemd unit / launchd service / pm2 job.

**Configuration on the k8s-proxy side:**

```yaml
env:
  KEPLOY_AUTO_REPLAY_MODE: runner
```

**Configuration on the runner side** (CLI flags or env):

| Flag             | Env                   | Description                                                                    |
| ---------------- | --------------------- | ------------------------------------------------------------------------------ |
| `--platform-url` | `KEPLOY_PLATFORM_URL` | k8s-proxy's externally reachable URL (the same `ingressUrl` the Console uses). |
| `--shared-token` | `KEPLOY_SHARED_TOKEN` | Bearer token. Read from the k8s-proxy `<release>-shared-token` Secret.         |
| `--runner-id`    | `KEPLOY_RUNNER_ID`    | Stable identifier for this runner; used for heartbeat + job assignment.        |
| `--keploy-bin`   | `KEPLOY_BIN`          | Path to the `keploy enterprise` binary that drives the replay.                 |
| `--work-dir`     | `KEPLOY_WORK_DIR`     | Scratch directory for downloaded mocks and reports.                            |
| `--cluster-name` | `KEPLOY_CLUSTER_NAME` | Optional. When set, the runner only picks up jobs scoped to this cluster.      |

The runner heartbeats while a job is in progress and POSTs the final report back to `/replay-jobs/{jobID}/complete`. The k8s-proxy never touches the runner's host—it just exposes the queue.

**When to use it:** customers who can't (or don't want to) run replay Pods inside a Kubernetes cluster at all—typically when the customer has a dedicated VM for test execution, or when air-gapping the replay environment from production is a hard requirement. The trade-off is one more piece of infrastructure to operate.

---

### Mode C—`cluster` (separate replay cluster)

This is the **recommended** production mode and is also the default. It keeps the source cluster strictly read-only and runs every replay in a customer-provided second cluster reached through a kubeconfig.

```
┌── Source cluster (read-only RBAC) ────────────────────────────────────┐
│                                                                       │
│   [/record/stop] ──▶ k8s-proxy                                        │
│                       │ reads source Deployment (image, ports, env,   │
│                       │ ConfigMap/Secret refs)—read-only            │
│                       │ rehydrates referenced ConfigMaps + Secrets    │
│                       │ into the replay namespace                     │
│                       │                                               │
└───────────────────────┼───────────────────────────────────────────────┘
                        │ kubeconfig (mounted as a Secret)
                        ▼
┌── Replay cluster (customer-managed) ──────────────────────────────────┐
│                                                                       │
│   ┌───────────────────────────────────────────────────────────┐      │
│   │ Replay namespace (e.g. keploy-replay)                     │      │
│   │                                                           │      │
│   │  Pod   <app>-rpl-xxxxxx                                   │      │
│   │   ├─ application container (image from source Deployment) │      │
│   │   └─ keploy-agent sidecar (replays mocks)                 │      │
│   │  Service  <app>-rpl-xxxxxx-svc                            │      │
│   │  NetPolicy <app>-rpl-xxxxxx-deny-egress                   │      │
│   │  Rehydrated ConfigMaps + Secrets                          │      │
│   │                                                           │      │
│   │  All resources cleaned up after the session ends.         │      │
│   └───────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────────┘
```

**Flow on `/record/stop`:**

1. k8s-proxy reads the source Deployment's `PodTemplateSpec` (read-only).
2. It rehydrates every `envFrom` / `valueFrom` / volume `ConfigMap` and `Secret` referenced by the Pod template into the replay-cluster's namespace, using the mounted kubeconfig. ServiceAccount-token Secrets are intentionally skipped—they are cluster-bound.
3. It creates a standalone Pod (`<app>-rpl-<random>`) plus a backing Service and a deny-all-egress NetworkPolicy in the replay cluster. The Pod runs the application image alongside the keploy-agent sidecar.
4. It opens a SPDY port-forward through the replay cluster's API server to the agent port and the recorded application port. The OSS replayer drives test cases through that local forward—k8s-proxy never needs in-cluster network reachability into the replay cluster.
5. When replay ends, the proxy deletes the Pod, Service, and NetworkPolicy. ConfigMaps and Secrets are left in place; they're rehydrated again next run if the source spec changed.

**What stays the same as `crd` mode:** the OSS replayer, the report shape, the Mongo collections (`testrunReports`, `testsetReports`, `testcaseReports`, `autoReplayMetrics`, `k8sSchemaCoverageReports`), and the Console UI.

**What's different:** every Pod / Service / NetworkPolicy write goes to the replay cluster. The source cluster never sees a write from Keploy.

**Configuration:**

```yaml
env:
  KEPLOY_AUTO_REPLAY_MODE: cluster
  KEPLOY_REPLAY_KUBECONFIG_PATH: /etc/replay/kubeconfig
  KEPLOY_REPLAY_NAMESPACE: keploy-replay
  # Optional—pre-existing imagePullSecret in the replay namespace
  # KEPLOY_REPLAY_IMAGE_PULL_SECRET: my-pull-secret

extraVolumes:
  - name: replay-kubeconfig
    secret:
      secretName: replay-kubeconfig

extraVolumeMounts:
  - name: replay-kubeconfig
    mountPath: /etc/replay
    readOnly: true
```

The kubeconfig in the Secret should grant the proxy `create / update / patch / delete` on Pods, Services, NetworkPolicies, ConfigMaps, and Secrets **in the replay namespace only**, plus `pods/portforward` and `pods/log`. See the customer setup guide for a copy-paste Role + RoleBinding template.

**Graceful fallback:** if `KEPLOY_AUTO_REPLAY_MODE=cluster` is set but `KEPLOY_REPLAY_KUBECONFIG_PATH` is empty or the file is missing, k8s-proxy logs a warning and falls back to `crd` mode rather than failing fast—this makes phased migrations low-risk.

**When to use it:** any production environment where the source cluster must remain untouched, or where you want hard isolation between recording and replay environments. The trade-off is operating a second Kubernetes cluster; for many teams a small managed cluster (1 or 2 small nodes) is sufficient since replays are short-lived and serialized per `(namespace, deployment)` pair.

---

## Picking a combination

Recording mode and replay environment are orthogonal—every combination is valid, and the choice is independent on each side:

| You want…                                                                                      | Recording mode | Replay environment |
| ---------------------------------------------------------------------------------------------- | -------------- | ------------------ |
| Fastest path to "first recording" in dev, comfortable with pod restarts                        | Sidecar        | `crd`              |
| No application restart, dev cluster has write RBAC                                             | DaemonSet      | `crd`              |
| Production with read-only RBAC on the source namespace, second K8s cluster available           | DaemonSet      | `cluster`          |
| Production with read-only RBAC on the source namespace, no spare K8s cluster but a Docker host | DaemonSet      | `runner`           |

For the operational walkthrough of the cluster-mode setup, see the K8s Proxy REST API guide's setup section. For the dev loop on kind, see the local-testing notes in the Keploy enterprise repo.
