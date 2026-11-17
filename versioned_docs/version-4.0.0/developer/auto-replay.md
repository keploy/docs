---
id: auto-replay
title: Auto-replay
sidebar_label: Auto-replay
description: How Keploy replays newly recorded test sets on an interval while a recording runs, the auto-replay settings, and where to read the results.
tags:
  - K8s
  - developer
  - auto-replay
keywords:
  - keploy auto replay
  - auto replay interval
  - mock noise detection
  - auto-replay history
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

While a recording runs, Keploy replays what you captured on a fixed interval. You don't need to turn it on: every recording runs auto-replay, and you set it up in the last step of the record dialog.

## Set up auto-replay

1. Start a recording as in [Record test cases](/docs/developer/record/).
2. On the **Auto replay** step, set **Auto replay interval (minutes)**. The default is 5.
3. Change any other settings you need (see below), then click **Start Recording**.

Settings are fixed for the life of the recording. To change them, stop the recording and start a new one. The dialog fills in your previous values. To see what a running recording uses, click **View configuration**.

## How rounds run

- The first round starts one interval after the recording starts. Each later round starts one interval after the previous round finishes.
- A round runs only when something new was captured. Otherwise, Keploy skips it and waits for the next interval.
- A round replays whole test sets, so test cases that already passed run again in later rounds.
- When you stop the recording, Keploy runs one final round if anything new was captured since the last one.

## Auto-replay settings

| Setting                        | Default                | What it does                                                                                                                                                                                                              |
| ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auto replay interval (minutes) | 5                      | Time between the end of one round and the start of the next. The minimum is the initial delay plus 5 seconds for each recorded pod. A shorter value is rejected.                                                          |
| Initial delay (seconds)        | 10                     | How long each round waits for your app to start in the replay pod before sending tests. If the app is still not accepting connections, Keploy waits longer.                                                               |
| Mock noise detection           | Off                    | Learns which request-body fields of your app's outgoing calls change between recording and replay, and saves them as noise on the matching mocks. See [Noise configuration](/docs/developer/noise/#mock-noise-detection). |
| Freeze time                    | On                     | Replays with the clock set to the recording time, so tokens and timestamps still match. See [Time Freezing](/docs/keploy-cloud/time-freezing/).                                                                           |
| Replay image (optional)        | The deployment's image | Container image used for the replay pod.                                                                                                                                                                                  |
| Environment variables          | None                   | Extra environment variables for the app during replay.                                                                                                                                                                    |
| Noise options                  | None                   | Response fields to ignore when comparing, globally or per test set. See [Noise configuration](/docs/developer/noise/).                                                                                                    |
| API timeout (seconds)          | 10                     | Timeout for each test request.                                                                                                                                                                                            |

**Freeze time**, the replay image, environment variables, noise options and the API timeout are under **Advanced settings** on the **Auto replay** step.

## Read the results

- **While recording:** on the **Active recording** page, click **View running auto-replay**. The **Replays** strip lists each round as _N passed · N failed · N noisy_. Click a round to see its test cases.
- **After the recording:** open the **⋮** menu on the deployment row and choose **Auto-Replay History**.

A round shows red if any test failed, amber if any test was noisy, and green otherwise. A **noisy** test differed only in fields Keploy saved as noise on the test case, so it is not counted as failed.

Auto-replay results are not listed on the **Reports** page. To get a **Test Report** you can act on, such as deleting a failing test case, run a [manual replay](/docs/developer/manual-replay/).

## Fix common problems

| Message                                               | What to do                                                         |
| ----------------------------------------------------- | ------------------------------------------------------------------ |
| Auto replay interval too short: needs at least N min… | Raise the interval, lower the initial delay, or record fewer pods. |
| Replay pod can't start / Replay pod is failing        | Check the replay image name and tag, and the pod's events.         |
| The first test set fails with connection errors       | Your app needs longer to start. Raise **Initial delay (seconds)**. |

## Related

- [DaemonSet & Auto-Replay](/docs/running-keploy/k8s-proxy-daemonset-architecture/): where auto-replay can run (in the cluster, a Docker runner, or a separate cluster).
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/): the `auto_replay_config` fields.
