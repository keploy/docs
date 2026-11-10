---
id: record-traffic
title: Record traffic
description: Start, watch and stop a recording of a Kubernetes service's live traffic, choose what Keploy keeps, and record a new release.
keywords:
  - record traffic
  - keploy k8s record
  - kubernetes
  - recording filters
---

A recording captures the requests one deployment receives, and the dependency calls it makes while serving them, until you stop it. Record from an environment with representative traffic, such as staging or production. The more real usage a recording sees, the more of the service its tests cover.

## Start a recording

```bash
keploy k8s apps                                        # deployments Keploy can record
keploy k8s record start --app shop.orders --confirm    # recreates the pods once
```

- **Pods restart once.** Starting a recording recreates the deployment's pods so the agent can attach. `--confirm` agrees to that; without it, the command only explains what would happen.
- **Several containers.** If the pod has more than one app container, name the one to record with `--container <name>` (repeatable). In DaemonSet mode Keploy won't guess.
- **From the Console.** See below. The Console and the CLI drive the same recording, with one difference: a recording started from the CLI auto-replays without [freezing time](/integration-testing/concepts/#time-freezing), while one started from the Console freezes time by default.

### From the Console

Open **Clusters**, then your cluster. On the **Deployments** tab, click **Record** next to the deployment. The recording is set up in three steps:

1. **Pods**: how many of the deployment's replicas to record, and an optional **Auto-stop after**.

<Screenshot src="/img/integration-testing/console/record-pods.webp" alt="The Pods step of Start Recording: a slider for how many replicas to record, and Auto-stop after" width="560" />

2. **Record config**: [filters](/running-keploy/recording-filters/) for what to keep, **Static deduplication** (on by default), **Dynamic deduplication** for Java apps, and **Smart test set** (an [upcoming](/integration-testing/concepts/#smart-test-set) feature).
3. **Auto replay**: the initial delay and interval of the [auto-replays](/integration-testing/auto-replay/) that run while you record, and **Mock noise detection**. **Advanced settings** holds freeze time, the replay image, environment variables and resource limits.

<Screenshot src="/img/integration-testing/console/record-config.webp" alt="The Record config step of Start Recording: filters, static deduplication switched on, dynamic deduplication, smart test set and advanced settings" width="640" />

Click **Start Recording**. The pods restart once, and the Console opens the live recording.

## Watch it

```bash
keploy k8s record status --app shop.orders
```

This shows how many tests and mocks the running recording has captured so far. The Console's live recording page shows the same counts as they arrive. While the recording runs, Keploy auto-replays the new tests every few minutes (see [Auto-replay](/integration-testing/auto-replay/)).

## Stop it

```bash
keploy k8s record stop --app shop.orders
```

In the Console, click **Stop recording** on the live recording. Stopping triggers one last auto-replay over everything captured. The tests that replay cleanly become the app's regression suite on main. The app's **Recordings** page lists them by release, with how many were accepted, how many are bugs and how many couldn't be replayed.

<Screenshot src="/img/integration-testing/console/recordings.webp" alt="An app's Recordings page: test sets grouped by release image, and for the selected release the totals of accepted, bug and unreplayable tests" />

## Record a new release

Record again whenever the service's behaviour changes on purpose, for example after a pull request that changed responses has merged. The new recording captures the new behaviour as fresh tests. You never need to edit a recorded test by hand.

## Choose what Keploy keeps

- **Filters.** Skip health checks, internal endpoints or noisy paths. See [Recording filters](/running-keploy/recording-filters/).
- **Deduplication.** On by default: requests with the same shape as one already kept are dropped while recording. See [Static deduplication](/keploy-cloud/static-deduplication/).
- **Read-only recording.** For production clusters that refuse to give a third-party workload write access, install the chart with `--set recording.readOnly=true`. The proxy then gets a minimal RBAC role with no create, update, patch or delete rights. This needs DaemonSet mode, and replays then run in a separate cluster.

## Where are we?

```bash
keploy k8s status --app shop.orders
```

This shows where the cluster and service are in the loop (connected, recording, replayed) and prints the next command to run.
