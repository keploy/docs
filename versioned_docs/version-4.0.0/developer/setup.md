---
id: setup
title: Set up
sidebar_label: Set up
description: Connect your Kubernetes cluster to Keploy by installing the Keploy proxy with Helm, and install the Keploy CLI for local replay and CI.
tags:
  - K8s
  - developer
  - installation
keywords:
  - keploy k8s proxy install
  - connect cluster
  - helm keploy
  - keploy daemonset
  - keploy cli login
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

You need two things: the Keploy proxy running in your cluster, and the Keploy CLI on your machine if you want to replay locally or from CI. If your cluster already shows as **Connected** on the **Clusters** page, skip to [Install the CLI](#install-the-cli).

## Before you start

- `kubectl` and `helm` access to the cluster, with rights to create a namespace and install a Helm chart.
- Permission to connect clusters in Keploy (`cluster:mint`). Ask your admin if **Connect New Cluster** is disabled.
- Linux nodes with kernel 5.10 or later.

## Choose a capture mode

You pick this when you connect the cluster, not when you record.

|                                    | Sidecar (default)                                           | DaemonSet                                                           |
| ---------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- |
| How it captures                    | Keploy injects an agent container into the pods it records. | A Keploy agent on each node captures traffic with eBPF. No sidecar. |
| Pods restart when recording starts | Yes                                                         | Yes, once, so they come back up under capture                       |
| Namespace requirement              | None                                                        | The `keploy` namespace must allow privileged pods                   |

See [DaemonSet & Auto-Replay](/docs/running-keploy/k8s-proxy-daemonset-architecture/) for how DaemonSet mode works.

## Connect your cluster

1. In the sidebar, open **Clusters** and click **Connect New Cluster**.
2. Fill in the dialog:
   - **Cluster Name**: any name you'll recognise, for example `staging-us-east`.
   - **How should Keploy reach this cluster?**: choose **Keploy tunnel** if you can't open an inbound route into the cluster. Choose **Ingress URL** to expose the proxy at a URL, then enter it. Self-hosted clusters always need an ingress URL.
   - **Deployment Type**: **SaaS** stores your test data in Keploy Cloud. **Self-hosted** keeps it in your cluster, and you also pick a **Metadata Backend** (MongoDB or MySQL).
   - **Enable DaemonSet mode**: tick it for DaemonSet mode.
3. Click **Connect to Cluster**. Keploy copies the install command to your clipboard and opens the cluster's page.
4. **DaemonSet mode only:** run the namespace command shown in the dialog first:

   ```bash
   kubectl create namespace keploy --dry-run=client -o yaml | kubectl apply -f -
   kubectl label namespace keploy pod-security.kubernetes.io/enforce=privileged --overwrite
   ```

5. Run the copied command. It looks like this and contains your cluster's access key:

   ```bash
   helm upgrade --install k8s-proxy oci://docker.io/keploy/k8s-proxy-chart --version <version> \
     --namespace keploy --create-namespace \
     --set keploy.accessKey=<access-key> \
     --set keploy.clusterName=<cluster-name> \
     ...
   ```

## Check the install

```bash
kubectl get pods -n keploy
```

All pods should reach `Running`. In DaemonSet mode, you also see one `k8s-proxy-daemonset-*` pod per node.

Back on the **Clusters** page, your cluster shows **Connected**. Open it, and the **Deployments** tab lists your workloads. You're ready to [record](/docs/developer/record/).

## Install the CLI

You need the CLI to replay on your machine, to replay a Keploy branch, and to run Keploy in CI.

1. Install it:

   ```bash
   source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
   ```

2. Sign in:

   - **On your machine:** run `keploy login` and approve the code in your browser.
   - **In CI:** create a key under **Settings** → **API Keys** and set it as `KEPLOY_API_KEY`.

3. Check that it works:

   ```bash
   keploy --version
   ```

A local replay also needs Docker. See [Manual replay](/docs/developer/manual-replay/#replay-from-the-cli) for the replay command. On Windows, or for more sign-in options, see [Install Keploy](/docs/server/install/#install) and [Sign in](/docs/server/install/#sign-in).

## Fix common problems

| Problem                                     | What to do                                                                                                              |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| The cluster stays **Disconnected**          | Check `kubectl get pods -n keploy` and the logs of the `k8s-proxy` pod. With an ingress URL, check that it's reachable. |
| DaemonSet pods are rejected by Pod Security | Run the namespace label command above, then reinstall.                                                                  |
| **Connect New Cluster** is disabled         | You need the `cluster:mint` permission. Ask your admin.                                                                 |

## Related

- [Kubernetes Setup](/docs/keploy-cloud/kubernetes/): a full walkthrough on a local kind cluster, SSH port forwarding and ingress with TLS.
- [K8s Record Replay](/docs/quickstart/k8s-proxy/): set up a sample app and record it end to end.
- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/): self-hosted targeting with `--k8s-proxy-url`, and every other flag.
