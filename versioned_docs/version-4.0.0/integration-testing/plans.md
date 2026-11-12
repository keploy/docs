---
id: plans
title: Plans and sign-up
description: Integration testing works on every Keploy plan, including Free — sign up, connect a cluster from the Console, and see where your usage stands.
keywords:
  - keploy plans
  - free plan
  - free trial
  - kubernetes
  - sign up
---

Integration testing is on every Keploy plan, including **Free**. Connecting a cluster, recording, auto-replay, replays in CI and branch reviews are on each; what differs is how much you can replay.

## Sign up

1. Sign in at [app.keploy.io](https://app.keploy.io).
2. Connect a cluster: **Clusters** → **Connect New Cluster**, or `keploy k8s connect` from the terminal. The [Quickstart](/integration-testing/quickstart/) walks through both.

There's no plan to request first and no sales call needed.

## What differs between plans

| Plan                     | Replay usage                  |
| ------------------------ | ----------------------------- |
| Free                     | Up to a monthly limit         |
| Teams trial              | Up to a monthly limit         |
| Enterprise trial         | No limit                      |
| Teams, Scale, Enterprise | Metered or unlimited, by plan |

- Usage counts the tests a replay runs and the mocks it uses. The limit applies to replays run with an API key or a cluster's key: `keploy cloud replay` in CI, any `keploy cloud replay --trigger`, and the Console's **Replay** button, which is disabled once you're over it. A `keploy cloud replay` you run on your own machine after signing in with `keploy k8s login` isn't counted. Auto-replay in your cluster keeps running.
- On Free, Keploy refuses replay downloads from an outdated CLI or k8s-proxy. If a replay or auto-replay downloads nothing, upgrade both.
- **Usage**, in the Console's **Integration Tests** menu, shows this month's usage. Plans and prices are under **Billing & Plans**, in the Console's **Support** menu.

For a self-hosted install, where your tests and mocks stay in your own database and object storage, see [Connect a cluster](/integration-testing/connect-a-cluster/). To talk to us about a plan, [book a call](https://calendar.app.google/cXVaj6hbMUjvmrnt9).
