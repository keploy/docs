---
id: record
title: Record test cases
sidebar_label: Record
description: Start and stop a live recording of a Kubernetes deployment from the Keploy dashboard, and what each recording option does.
tags:
  - K8s
  - developer
  - record
keywords:
  - keploy record kubernetes
  - start recording
  - static deduplication
  - recording filters
  - smart test set
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

Keploy records live traffic on your deployment's pods. Each incoming request becomes a test case, and each outgoing call your app makes (database queries, HTTP calls to other services) is saved as a mock.

## Start a recording

1. In the sidebar, open **Clusters** and click your cluster.
2. On the **Deployments** tab, click **Record** on the deployment you want to capture.
3. **Pods**: choose the **Number of pods to record** and, if you want, **Auto-stop after**. Click **Next**.
4. **Record config**: add filters and pick a deduplication mode. Click **Next**.
5. **Auto replay**: set how often Keploy replays what you captured (see [Auto-replay](/docs/developer/auto-replay/)). Click **Start Recording**.

You land on the **Active recording** page, which shows a live count of captured test cases. Now send traffic to your app.

You can also open the same dialog from the **Recordings** page with the **Record** button.

:::caution Pods restart
Starting a recording restarts the selected pods so they come back up with capture attached. Start it when a restart is acceptable.
:::

## Recording options

| Option                   | Step          | Default   | What it does                                                                                                                                                                                                                                              |
| ------------------------ | ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Number of pods to record | Pods          | 1         | How many pods to capture. Capped at the HPA maximum or the replica count.                                                                                                                                                                                 |
| Record all pods          | Pods          | Off       | Shown only when the deployment has an HPA. Captures every pod.                                                                                                                                                                                            |
| Auto-stop after          | Pods          | Empty     | Stops the recording after this long. When empty, the cluster's maximum recording duration applies if your admin set one. Otherwise the recording runs until you stop it.                                                                                  |
| Add filter               | Record config | None      | Include or exclude requests by path, host, port, method or header. See [Recording filters](/docs/running-keploy/recording-filters/).                                                                                                                      |
| Static deduplication     | Record config | On        | Skips a request when one with the same method, path, header names, status and body structure was already captured, so you get one test case per request shape. See [Static Deduplication](/docs/keploy-cloud/static-deduplication/).                      |
| Dynamic deduplication    | Record config | Off       | Java apps only. During auto-replay, flags test cases that run the same code path as another one, so only unique code paths are kept. You can't use it together with static deduplication. See [Dynamic Deduplication](/docs/keploy-cloud/deduplication/). |
| Smart test set           | Record config | On        | Deduplicates recorded flows into the app's persistent smart test set, which is used for regression testing.                                                                                                                                               |
| Advanced settings        | Record config | Collapsed | Agent memory and CPU, Low Latency Mode (sidecar clusters only), and which containers to capture.                                                                                                                                                          |

:::note Capture mode is set at install time
Whether a cluster records with a sidecar or with the DaemonSet is decided when the Keploy proxy is installed, not in this dialog. See [DaemonSet & Auto-Replay](/docs/running-keploy/k8s-proxy-daemonset-architecture/).
:::

If you save custom dedup fields on the **Schema** page, static deduplication stays on for that deployment even when you switch the toggle off.

## Stop the recording

Use either of these:

- On the deployment row, click the **Recording** status, then **Stop Recording**.
- On the **Active recording** page, click **Stop recording**.

If anything new was captured since the last auto-replay round, Keploy runs one final round after the stop. When you stop from the **Active recording** page, you are taken to that replay if one is starting, or to the **Recordings** page otherwise.

Your test sets are listed on the **Recordings** page under **Test sets**.

## Fix a recording that won't start

| Message                                                                    | What to do                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| You don't have permission to start recording on this cluster               | Ask an admin for record permission on the cluster or app.                 |
| A recording is already in progress for this deployment…                    | It was started from another tab, the CLI or by a teammate. Stop it first. |
| Requested duration exceeds the cluster limit of …                          | Lower **Auto-stop after** to within the limit your admin set.             |
| …has zero replicas; scale it up before starting recording                  | Scale the deployment to at least one replica.                             |
| Recording started, but no pods came up with the keploy sidecar within 60s… | Check the pod's events with `kubectl describe pod`.                       |

## Related

- [K8s Record Replay](/docs/quickstart/k8s-proxy/): install the proxy and record your first app.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/): start and stop recordings from a script.
