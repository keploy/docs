---
id: quickstart
title: Quickstart
description: Connect a Kubernetes cluster to Keploy, record a service's live traffic as tests with mocks, and replay them against a build — in about 15 minutes.
keywords:
  - keploy quickstart
  - kubernetes
  - k8s-proxy
  - record traffic
  - cloud replay
---

This guide connects a Kubernetes cluster to Keploy, records one service's live traffic, and replays the recorded tests against a build. Use a cluster that already serves traffic, such as staging. For a local trial, a [kind](https://kind.sigs.k8s.io/) cluster with a sample app works too.

**You need:** `kubectl` pointed at the cluster, `helm` 3, and Docker on the machine where you replay.

:::tip Hand it to your coding agent
`keploy k8s setup` walks through every step below and prints the next command each time, so a coding agent (Claude Code, Cursor, Codex) can run it for you. Ask your agent: _"Install Keploy and run `keploy k8s setup`."_
:::

<Steps>

### Install the Keploy CLI

```bash
source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
keploy --version
```

On Windows, see [Installation](/keploy-cloud/cloud-installation/).

### Sign in

```bash
keploy k8s login
```

The command prints a page and a code. Open the page on any device, enter the code and approve. Then collect the session:

```bash
keploy k8s login --finish
```

### Connect your cluster

<Tabs groupId="connect">
<TabItem value="cli" label="CLI" default>

```bash
keploy k8s connect
```

The CLI asks which kube context to use, installs k8s-proxy with Helm, and waits for its first heartbeat (up to 5 minutes). Useful flags:

- `--name <cluster>` names the cluster in Keploy. By default the name comes from the kube context.
- `--mode sidecar` captures through an agent next to each app instead of the default node agent. Use it when the cluster doesn't allow the privileged DaemonSet.
- `--namespace <ns>` installs into one namespace you manage, with no cluster-wide rights. Keploy then records only that namespace's services.
- `--allow-production` is required when the context's name looks like production.

</TabItem>
<TabItem value="console" label="Console + Helm">

1. Open the Keploy Console and connect a new cluster: give it a name, and the URL the proxy will be reachable at.
2. Copy the Helm command the Console prints and run it. It looks like this:

```bash
helm upgrade --install k8s-proxy oci://docker.io/keploy/k8s-proxy-chart \
  --version <version> --namespace keploy --create-namespace \
  --set keploy.accessKey=<access-key> \
  --set keploy.clusterName=<cluster-name> \
  --set keploy.ingressUrl=<proxy-url>
```

3. Wait until the cluster shows as connected in the Console.

</TabItem>
</Tabs>

Check the connection at any time:

```bash
keploy k8s status
```

### Pick a service

```bash
keploy k8s apps
```

This lists the deployments Keploy can record, as `<namespace>.<deployment>`. The rest of this guide uses `shop.orders`.

### Record its traffic

```bash
keploy k8s record start --app shop.orders --confirm
```

Starting a recording recreates the deployment's pods once, so Keploy can attach to them. `--confirm` agrees to that. If the deployment has several containers, pick the app's with `--container <name>`.

Let real traffic flow for a while. On a staging cluster that may already be happening; on a local cluster, send a few requests yourself. Then see what has been captured:

```bash
keploy k8s record status --app shop.orders
```

### Stop and let Keploy check the tests

```bash
keploy k8s record stop --app shop.orders
```

When the recording stops, Keploy **auto-replays** the captured tests in the cluster. It marks fields that change on every call as noise, and sets aside tests that don't replay cleanly. The result shows up in the Console and in `keploy k8s status --app shop.orders`.

### Replay the tests against a build

Create an API key in the Console (**Settings → API Keys**), then replay the app's tests on your machine. Keploy downloads the tests and mocks, starts the app from its image, and serves every dependency call from the mocks:

```bash
export KEPLOY_API_KEY=<your-api-key>
keploy cloud replay --app shop.orders --cluster <cluster-name>
```

Pass `--image <image:tag>` to test a build other than the one the deployment runs, such as the image your pull request builds.

</Steps>

## Next steps

<CardGrid>
  <Card title="Run on every pull request" href="/integration-testing/run-in-ci/">
    Add the replay to CI so every pull request is checked against the recorded tests.
  </Card>
  <Card title="Review test changes" href="/integration-testing/review-test-changes/">
    What to do when a pull request's tests fail.
  </Card>
  <Card title="Connect a cluster" href="/integration-testing/connect-a-cluster/">
    SaaS or self-hosted, DaemonSet or sidecar, and the Helm values that matter.
  </Card>
  <Card title="Use with coding agents" href="/integration-testing/coding-agents/">
    Let Claude Code, Cursor or Codex run the loop.
  </Card>
</CardGrid>
