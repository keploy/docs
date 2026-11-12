---
id: cli-keploy-k8s
title: keploy k8s
sidebar_label: CLI — keploy k8s
description: Reference for keploy k8s — sign in, connect a Kubernetes cluster, list deployments, and start, watch and stop recordings.
keywords:
  - keploy k8s
  - cli reference
  - kubernetes
---

`keploy k8s` connects a Kubernetes cluster to Keploy and records its services. Every command prints a NEXT block with the next step.

**Flags on every `keploy k8s` command:**

| Flag                 | Description                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `--context` `string` | Kube context to use (default: the current context for reads; `connect` asks when not given) |
| `--json`             | Print the NEXT block as one JSON object                                                     |

## `keploy k8s setup`

Set up Keploy on a cluster and record a service — the one command to hand a coding agent

| Flag             | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| `--app` `string` | Service as &lt;namespace&gt;.&lt;deployment&gt;, when already chosen |

## `keploy k8s login`

Sign in from any device with a page and a code (then run with --finish)

| Flag       | Description                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--finish` | Collect the session for the sign-in started by 'keploy k8s login': waits up to 70 seconds for the approval, and can be run again until the code expires |
| `--new`    | Discard the sign-in code still waiting here and start a new one (without it, 'keploy k8s login' shows the waiting code again)                           |

## `keploy k8s connect`

Install Keploy's k8s-proxy into a cluster and verify it is connected

| Flag                   | Description                                                                                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--allow-production`   | Confirm installing into a context whose name looks like production                                                                                             |
| `--confirm`            | Confirm switching an installed cluster's capture mode with --mode                                                                                              |
| `--local`              | Use a local kind cluster; tells you what to install or create first                                                                                            |
| `--mode` `string`      | Capture mode: daemonset (default for a new install) or sidecar, for clusters that refuse the privileged node agent; on an installed proxy it switches the mode |
| `--name` `string`      | Cluster name in Keploy (default: derived from the kube context)                                                                                                |
| `--namespace` `string` | Install into this one namespace you manage (no cluster-wide rights needed); Keploy then records only its services                                              |
| `--rotate-key`         | Issue a new access key for the installed proxy and restart it with the key                                                                                     |
| `--timeout` `duration` | How long to wait for the install and the first heartbeat (default 5m0s)                                                                                        |

## `keploy k8s status`

Show where this cluster and service are in the Keploy loop, and the next step

| Flag             | Description                                     |
| ---------------- | ----------------------------------------------- |
| `--app` `string` | Service as &lt;namespace&gt;.&lt;deployment&gt; |

## `keploy k8s values`

Show the k8s-proxy settings you can change, and the exact commands that change and undo them

## `keploy k8s apps`

List the deployments Keploy can record

| Flag                         | Description              |
| ---------------------------- | ------------------------ |
| `-n`, `--namespace` `string` | Only list this namespace |

## `keploy k8s record`

Record a service's live traffic as Keploy tests. Every `record` subcommand takes `--app <namespace>.<deployment>` (required).

### `keploy k8s record start`

Start recording (recreates the deployment's pods once)

| Flag                    | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `--confirm`             | Confirm recreating the deployment's pods                            |
| `--container` `strings` | App container to record, for a deployment with several (repeatable) |

### `keploy k8s record status`

Show what the running recording has captured

### `keploy k8s record stop`

Stop recording; Keploy then auto-replays the captured tests
