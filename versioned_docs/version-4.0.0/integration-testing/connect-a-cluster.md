---
id: connect-a-cluster
title: Connect a cluster
description: Install Keploy's k8s-proxy into a Kubernetes cluster — Keploy Cloud or self-hosted, DaemonSet or sidecar capture, and the Helm values that matter.
keywords:
  - k8s-proxy helm
  - self-hosted keploy
  - daemonset
  - sidecar
  - kubernetes
---

Keploy reaches your services through **k8s-proxy**, a Helm chart you install once per cluster. It captures traffic, runs auto-replay, and serves your tests to CI. Install it with `keploy k8s connect` (see the [Quickstart](/integration-testing/quickstart/)) or with Helm directly, as this page shows.

## Choose where the data lives

<Tabs groupId="deployment">
<TabItem value="saas" label="Keploy Cloud (SaaS)" default>

Tests, mocks and reports are stored in Keploy Cloud, and you use the Console at app.keploy.io. The proxy needs an access key and a cluster name, both from the Console:

```bash
helm upgrade --install k8s-proxy oci://docker.io/keploy/k8s-proxy-chart \
  --version <version> --namespace keploy --create-namespace \
  --set keploy.accessKey=<access-key> \
  --set keploy.clusterName=<cluster-name> \
  --set keploy.ingressUrl=https://keploy-proxy.example.com
```

`keploy.ingressUrl` is the URL the proxy is reachable at from outside the cluster, through your Ingress, a load balancer or a NodePort. If the cluster allows no inbound route, leave it empty and turn on the outbound tunnel instead. The proxy then dials Keploy Cloud over ordinary HTTPS egress:

```bash
  --set keploy.tunnel.enabled=true
```

</TabItem>
<TabItem value="self-hosted" label="Self-hosted">

Nothing leaves your network. The proxy stores metadata in a database you run and recordings in your object storage, and your Keploy Console and CI talk to the proxy directly:

```bash
helm upgrade --install k8s-proxy oci://docker.io/keploy/k8s-proxy-chart \
  --version <version> --namespace keploy --create-namespace \
  --set selfHosted=true \
  --set keploy.accessKey=<access-key> \
  --set keploy.clusterName=<cluster-name> \
  --set keploy.ingressUrl=https://keploy-proxy.internal.example.com \
  --set proxy.metadataBackend=sql \
  --set proxy.sql.existingSecret=keploy-sql \
  --set installMongoDB=false --set mongodb.enabled=false \
  --set objectStorage.provider=s3 \
  --set objectStorage.bucketName=keploy-recordings \
  --set objectStorage.region=us-east-1 \
  --set objectStorage.accessKey=<access-key-id> \
  --set objectStorage.secretKey=<secret-access-key>
```

- **Metadata.** `proxy.metadataBackend=sql` stores it in MySQL (or RDS, TiDB). Give it the DSN through a Secret (`proxy.sql.existingSecret`, key `sql-dsn`) rather than in `proxy.sql.dsn`. The default backend is a bundled MongoDB.
- **Recordings.** `objectStorage.provider` is `s3`, `gcs`, `azure` or `minio` (any S3-compatible store). Give the bucket's credentials with `objectStorage.accessKey` and `objectStorage.secretKey` (and `objectStorage.endpoint` for a store other than AWS). Only with `provider=minio` and no endpoint does the chart deploy a bundled store instead, which is fine for a trial.
- **Ingress.** `keploy.ingressUrl` is required: on a self-hosted install it's the only way in. The tunnel isn't available, and the chart refuses to install with both `selfHosted=true` and `keploy.tunnel.enabled=true`.
- **Encryption.** Recorded secrets are encrypted by default (`encryption=true`), with a key the chart creates and manages.

The CLI reaches a self-hosted cluster through its proxy. Set `KEPLOY_K8S_PROXY_URL` (or pass `--k8s-proxy-url`) wherever you run `keploy cloud` commands, including CI. If the proxy uses a self-signed certificate, also set `KEPLOY_TLS_SKIP_VERIFY=true`.

</TabItem>
</Tabs>

:::tip Keep the access key out of your values file
For GitOps (Argo CD, Flux), create a Secret yourself and point the chart at it with `keploy.existingSecret=<secret-name>`. The key name defaults to `access-key`; change it with `keploy.existingSecretKey`.
:::

## Choose a capture mode

|                                          | DaemonSet (default for `keploy k8s connect`)           | Sidecar                                        |
| ---------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| How it captures                          | A node agent on each node, using eBPF                  | An agent container injected into the app's pod |
| App pods restart when a recording starts | Once, so the agent can attach                          | Once, to inject the agent                      |
| Needs                                    | A privileged pod per node; Linux 5.10+ (6.4+ on arm64) | Permission to patch the app's deployments      |
| Pick it when                             | You can run a privileged node agent                    | Your cluster policy refuses privileged pods    |

With Helm, turn DaemonSet mode on with `--set daemonset.enabled=true`; the chart's own default is sidecar. To switch an installed cluster from the CLI, run `keploy k8s connect --mode sidecar --confirm` (or `--mode daemonset`).

## Check the install

```bash
kubectl get pods -n keploy
keploy k8s status
```

`keploy k8s status` shows whether the proxy's heartbeat reaches Keploy, and the next step to take.

## Change a setting later

```bash
keploy k8s values
```

This prints the settings you can change on the installed proxy, each with the exact command that changes it and the one that undoes it. To issue a new access key and restart the proxy with it, run `keploy k8s connect --rotate-key`.

## Related

- [Helm values reference](/integration-testing/helm-values/)
- [DaemonSet architecture and auto-replay environments](/running-keploy/k8s-proxy-daemonset-architecture/)
- [GitOps with Flux](/keploy-cloud/gitops-flux/)
