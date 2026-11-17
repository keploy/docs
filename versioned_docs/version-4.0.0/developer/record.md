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

   ![Record button on a deployment row](/img/developer/record-deployments.webp)

3. **Pods**: choose the **Number of pods to record** and, if you want, **Auto-stop after**. Click **Next**.

   ![Pods step of the Start Recording dialog](/img/developer/record-step-pods.webp)

4. **Record config**: add filters and pick a deduplication mode. Click **Next**.

   ![Record config step with filters and deduplication](/img/developer/record-step-config.webp)

5. **Auto replay**: set how often Keploy replays what you captured (see [Auto-replay](/docs/developer/auto-replay/)). Click **Start Recording**.

   ![Auto replay step of the Start Recording dialog](/img/developer/record-step-auto-replay.webp)

You land on the **Active recording** page. It shows a live count of captured test cases and mocks, each request as it is recorded, and the status of the recorded pods.

![Active recording page with captured test cases and pod status](/img/developer/record-active.webp)

You can also open the same dialog from the **Recordings** page with the **Record** button.

:::caution Pods restart
Starting a recording restarts the selected pods so they come back up with capture attached. Start it when a restart is acceptable.
:::

## Send traffic

Keploy records only the requests your app actually receives. Use your app as you normally would: run your test suite or a load script, click through the frontend, or call the API directly. For example:

```bash
kubectl port-forward -n <namespace> svc/<service> 8080:<service-port>
curl http://localhost:8080/<endpoint>
```

Cover the endpoints and edge cases you want tests for. With static deduplication on (the default), each distinct request shape becomes one test case.

## Recording options

| Option                   | Step          | Default   | What it does                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------ | ------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Number of pods to record | Pods          | 1         | How many pods to capture. Capped at the HPA maximum or the replica count.                                                                                                                                                                                                                                                                                     |
| Record all pods          | Pods          | Off       | Shown only when the deployment has an HPA. Captures every pod.                                                                                                                                                                                                                                                                                                |
| Auto-stop after          | Pods          | Empty     | Stops the recording after this long. When empty, the cluster's maximum recording duration applies if your admin set one. Otherwise the recording runs until you stop it.                                                                                                                                                                                      |
| Add filter               | Record config | None      | Include or exclude requests by path, host, port, method or header. See [Recording filters](/docs/running-keploy/recording-filters/).                                                                                                                                                                                                                          |
| Static deduplication     | Record config | On        | Skips a request when one with the same method, path, header names, status and body structure was already captured, so you get one test case per request shape. See [Static Deduplication](/docs/keploy-cloud/static-deduplication/).                                                                                                                          |
| Dynamic deduplication    | Record config | Off       | Java apps only. During auto-replay, flags test cases that run the same code path as another one, so only unique code paths are kept. You can't use it together with static deduplication. It also gives you [code coverage](/docs/developer/coverage/#check-code-coverage-java) per test set. See [Dynamic Deduplication](/docs/keploy-cloud/deduplication/). |
| Smart test set           | Record config | On        | Deduplicates recorded flows into the app's persistent smart test set, which is used for regression testing.                                                                                                                                                                                                                                                   |
| Advanced settings        | Record config | Collapsed | Agent memory and CPU, Low Latency Mode (sidecar clusters only), and which containers to capture.                                                                                                                                                                                                                                                              |

:::note Capture mode is set at install time
Whether a cluster records with a sidecar or with the DaemonSet is decided when you connect the cluster, not in this dialog. See [Choose a capture mode](/docs/developer/setup/#choose-a-capture-mode).
:::

If you save custom dedup fields on the **Schema** page, static deduplication stays on for that deployment even when you switch the toggle off.

## Stop the recording

Use either of these:

- On the deployment row, click the **Recording** status, then **Stop Recording**.
- On the **Active recording** page, click **Stop recording**.

If anything new was captured since the last auto-replay round, Keploy runs one final round after the stop. When you stop from the **Active recording** page, you are taken to that replay if one is starting, or to the **Recordings** page otherwise.

## View what you recorded

1. Open **Recordings**, with your app selected in the header's app selector.
2. In the left panel, expand a release and a test set, then click a test case.
3. The **Map** view shows the request, your app, and each outgoing call Keploy mocked. Switch to **Raw** for the full request and response. Below, the **Mocks** tab lists the outgoing calls and **Noise** lists the fields Keploy ignores.

![A recorded test case with its map, mocks and noise](/img/developer/recordings-test-case.webp)

If a test case has fields that change on every call, such as a timestamp, add them on the **Noise** tab. See [Noise configuration](/docs/developer/noise/).

## Fix a recording that won't start

| Message                                                                    | What to do                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| You don't have permission to start recording on this cluster               | Ask an admin for record permission on the cluster or app.                 |
| A recording is already in progress for this deployment…                    | It was started from another tab, the CLI or by a teammate. Stop it first. |
| Requested duration exceeds the cluster limit of …                          | Lower **Auto-stop after** to within the limit your admin set.             |
| …has zero replicas; scale it up before starting recording                  | Scale the deployment to at least one replica.                             |
| Recording started, but no pods came up with the keploy sidecar within 60s… | Check the pod's events with `kubectl describe pod`.                       |

## Related

- [Set up](/docs/developer/setup/): connect your cluster and install the CLI.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/): start and stop recordings from a script.
