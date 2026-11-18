---
id: manual-replay
title: Run a manual replay
sidebar_label: Manual replay
description: Replay recorded test cases on demand from the Keploy dashboard or the CLI, and open the Test Report to see what passed and what failed.
tags:
  - K8s
  - developer
  - replay
keywords:
  - keploy replay
  - run replay dashboard
  - keploy cloud replay
  - test report
  - strict mock noise
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

A manual replay runs your recorded test cases whenever you choose, and Keploy answers every outgoing call from the recorded mocks. Each run produces a **Test Report**.

## Replay from the dashboard

1. In the sidebar, open **Clusters**, click your cluster, and stay on the **Deployments** tab.
2. Click **Replay** on the deployment.
3. **Select tests**: select test sets, or open a test set and select individual test cases. If you select nothing, every recorded test set runs. Click **Next**.

   ![Select tests step of the Run Replay dialog](/img/developer/replay-step-select.webp)

4. **Configure**: keep the defaults or change the [settings](#replay-settings). Click **Start Replay**.

   ![Configure step of the Run Replay dialog](/img/developer/replay-step-configure.webp)

The deployment row now shows **Replaying** with the progress. Click it to see live counts, open the replay page with **View details**, or cancel the run with **Stop Replay**.

To replay a selection from the **Recordings** page, select the test cases and choose **Replay** → **Replay in cluster**.

Test cases that auto-replay already marked as failed aren't listed, and the replay skips them.

## Replay settings

| Setting                 | Default                | What it does                                                                                                                                                                          |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Initial delay (seconds) | 10                     | How long Keploy waits for your app to start in the replay pod before sending tests. If the app is still not accepting connections, Keploy waits longer.                               |
| API timeout (seconds)   | 10                     | Timeout for each test request. An empty field means 10 seconds.                                                                                                                       |
| Strict mock noise       | Off                    | Fails an outgoing call when a field in its request body changed since recording, unless that field is known noise. See [Strict mock noise](/docs/developer/noise/#strict-mock-noise). |
| Freeze time             | On                     | Replays with the clock set to the recording time. See [Time Freezing](/docs/keploy-cloud/time-freezing/).                                                                             |
| Replay image (optional) | The deployment's image | Container image for the replay pod. Use it to test a new build against the recorded traffic.                                                                                          |
| Environment variables   | None                   | Extra environment variables for your app during replay.                                                                                                                               |
| Advanced options        | None                   | Response fields to ignore for this run, for all test sets or per test set. See [Noise configuration](/docs/developer/noise/).                                                         |
| Debug Logs              | Off                    | Turns on debug logging in the replay pod.                                                                                                                                             |

The dialog fills in the settings from your previous replay of the same deployment. Check them before you start a new run.

:::note
A replay from the dashboard always runs against main. To replay a Keploy branch, use the CLI with `--branch-name`.
:::

## Replay from the CLI

On the deployment row, click the terminal icon (**Cloud replay command**) to copy a ready-made command:

```bash
keploy cloud replay --app "<namespace>.<deployment>" --cluster "<cluster>"
```

- Without extra flags, the replay runs on your machine and needs Docker.
- Add `--trigger` to run the replay inside the cluster instead. `--trigger` can't be combined with `--test-sets` or the branch flags.
- Add `--branch-name <name>` to replay a Keploy branch before you merge it.

For every flag, see the [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/).

## Open the Test Report

1. In the sidebar, open **Reports**. On **Live recording runs**, the **Recordings** tab lists your manual replays.

   ![Test Reports list with manual runs](/img/developer/reports-list-failed.webp)

2. Click a run. The **Test Report** page shows **Total**, **Passed**, **Failed**, **Ignored**, **Duration** and **Run by**. Click a test to see its request, response and noise.

   ![Test Report page with a test's request and response](/img/developer/report-failed.webp)

If any test failed, see [Fix failing tests](/docs/developer/fix-failing-tests/).

## Related

- [Auto-replay](/docs/developer/auto-replay/): automatic rounds while a recording runs.
- [Developer + LLM Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-llm-workflow/): let an AI coding assistant diagnose and fix failing replays.
