---
id: helm-values
title: Helm values
sidebar_label: Helm values
description: The k8s-proxy Helm chart values most installs set — identity, Keploy Cloud or self-hosted storage, capture mode, recording and auto-replay placement.
keywords:
  - k8s-proxy helm values
  - helm chart
  - self-hosted
  - kubernetes
---

The k8s-proxy chart is installed from `oci://docker.io/keploy/k8s-proxy-chart`. This page covers the values most installs set. Every value is documented inline in the chart's `values.yaml`:

```bash
helm show values oci://docker.io/keploy/k8s-proxy-chart --version <version>
```

On an installed proxy, `keploy k8s values` lists the settings you can change, with the command that changes each and the one that undoes it.

## Identity

| Value                      | Default                 | Description                                                                                                            |
| -------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `keploy.accessKey`         | `""`                    | The cluster's access key, from the Console or `keploy k8s connect`.                                                    |
| `keploy.existingSecret`    | `""`                    | Read the access key from this Secret instead (GitOps).                                                                 |
| `keploy.existingSecretKey` | `access-key`            | Key inside `keploy.existingSecret`.                                                                                    |
| `keploy.clusterName`       | `""`                    | The cluster's name in Keploy.                                                                                          |
| `keploy.apiServerUrl`      | `https://api.keploy.io` | Keploy API server.                                                                                                     |
| `keploy.ingressUrl`        | `""`                    | URL the proxy is reachable at from outside the cluster. Required for self-hosted.                                      |
| `keploy.tunnel.enabled`    | `false`                 | Keploy Cloud only: reach the cluster over an outbound tunnel, with no inbound route.                                   |
| `environment`              | `prod`                  | Which Keploy Console may call the proxy from a browser. Keep `prod` (app.keploy.io) unless Keploy tells you otherwise. |

## Keploy Cloud or self-hosted

| Value                                | Default                       | Description                                                                                                                              |
| ------------------------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `selfHosted`                         | `false`                       | Keep all data in your own database and object storage. Can't be combined with `keploy.tunnel.enabled`.                                   |
| `proxy.metadataBackend`              | `mongo`                       | Self-hosted metadata store: `mongo` (bundled or external MongoDB) or `sql` (MySQL, RDS, TiDB).                                           |
| `proxy.sql.existingSecret`           | `""`                          | Secret holding the SQL DSN (key `sql-dsn`). Prefer it over `proxy.sql.dsn`.                                                              |
| `installMongoDB` / `mongodb.enabled` | follows `selfHosted` / `true` | Set both to `false` with `proxy.metadataBackend=sql`.                                                                                    |
| `objectStorage.provider`             | `minio`                       | `s3`, `gcs`, `azure`, or `minio` for any S3-compatible store. With `minio` and no `objectStorage.endpoint`, a bundled store is deployed. |
| `objectStorage.bucketName`           | `keploy-mocks`                | Bucket for recordings and mocks.                                                                                                         |
| `objectStorage.region`               | `""`                          | Bucket region.                                                                                                                           |
| `encryption`                         | `true`                        | Encrypt recorded secrets on self-hosted installs.                                                                                        |

## Capture

| Value                | Default | Description                                                                                                                     |
| -------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `daemonset.enabled`  | `false` | Capture with a node agent on each node (eBPF) instead of an injected sidecar. `keploy k8s connect` turns it on by default.      |
| `recording.readOnly` | `false` | Give the proxy a minimal RBAC role with no write verbs. Needs `daemonset.enabled=true`; replays then run in a separate cluster. |
| `watchNamespace`     | `[]`    | Limit the proxy to these namespaces.                                                                                            |

## Auto-replay

| Value                         | Default                 | Description                                                                                                              |
| ----------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `autoReplay.namespace`        | the release namespace   | Namespace the auto-replay pods run in. Set it to the app's namespace when its images pull with the app's cloud identity. |
| `autoReplay.imagePullSecrets` | the app's own, mirrored | Pull secrets for auto-replay pods outside the app's namespace.                                                           |

## Exposure

| Value             | Default     | Description                                                             |
| ----------------- | ----------- | ----------------------------------------------------------------------- |
| `ingress.enabled` | `false`     | Render an Ingress for the proxy. Set `ingress.hosts` and `ingress.tls`. |
| `gateway.enabled` | `false`     | Render a Gateway API route instead.                                     |
| `service.type`    | `ClusterIP` | `LoadBalancer` or `NodePort` to expose the proxy without an Ingress.    |
