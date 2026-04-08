---
id: gitops-flux
title: Deploy Keploy with Flux CD
sidebar_label: Flux CD
description: "Deploy Keploy k8s-proxy with Flux CD GitOps on Kubernetes — HelmRelease setup with Contour ingress controller."
tags:
  - explanation
  - feature guide
  - keploy enterprise
  - kubernetes
  - flux
  - gitops
  - contour
keywords:
  - keploy enterprise
  - kubernetes
  - flux
  - gitops
  - helm
  - contour
  - ingress
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

This guide walks you through deploying **Keploy's `k8s-proxy`** using **Flux CD** (GitOps) on a Kubernetes cluster, with **Contour** as the ingress controller.

Flux watches your Git repository and automatically applies changes to the cluster. Adding Keploy requires a **HelmRelease** for the `k8s-proxy` and an **HTTPProxy** for Contour routing.

> [!NOTE]
> This guide assumes you have already completed the [Kubernetes Setup](/docs/keploy-cloud/kubernetes) and have a running Kind cluster with Keploy connected. For Contour setup details, see the [ArgoCD guide](/docs/keploy-cloud/gitops-argocd#2-deploy-contour-ingress-controller)—the Contour steps are identical.

---

## Prerequisites

Ensure you have the following before you begin:

1. **A running Kubernetes cluster** (Kind, EKS, GKE, AKS)
2. **Flux CLI** installed ([installation guide](https://fluxcd.io/flux/installation/))
3. **kubectl** and **Helm** installed
4. **A Git repository** (GitHub, GitLab, Bitbucket) for Flux to watch
5. **Keploy Enterprise account** (with an access key)
6. **Contour** deployed ([see step 2 in the ArgoCD guide](/docs/keploy-cloud/gitops-argocd#2-deploy-contour-ingress-controller))

---

## 1) Bootstrap Flux

> Skip this if Flux is already installed on your cluster.

Bootstrap Flux with your GitHub repository:

```bash
flux bootstrap github \
  --owner=<YOUR_GITHUB_USERNAME> \
  --repository=<YOUR_REPO_NAME> \
  --branch=main \
  --path=clusters/staging \
  --personal
```

This installs Flux on your cluster and creates the `clusters/staging` directory in your Git repo where you'll add Keploy manifests.

Verify Flux is running:

```bash
flux check
```

---

## 2) Create the Keploy access key secret

> Skip if you already created this during the [Kubernetes Setup](/docs/keploy-cloud/kubernetes).

Go to the Keploy UI → **Clusters** → **Connect New Cluster**. Enter your cluster name and ingress URL (e.g. `https://your-host:30080`). Click **Connect** to get your access key.

```bash
kubectl create namespace keploy

kubectl -n keploy create secret generic keploy-credentials \
  --from-literal=access-key="<YOUR_ACCESS_KEY>"
```

> [!WARNING]
> Never commit access keys to Git. For production, use [Flux SOPS](https://fluxcd.io/flux/guides/mozilla-sops/) or [Sealed Secrets](https://fluxcd.io/flux/guides/sealed-secrets/) to encrypt secrets in your repository.

---

## 3) Add the Keploy Helm repository source

Create `clusters/staging/keploy-source.yaml` in your Git repo:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: HelmRepository
metadata:
  name: keploy
  namespace: flux-system
spec:
  interval: 1h
  type: oci
  url: oci://docker.io/keploy
```

---

## 4) Create the HelmRelease for `k8s-proxy`

Create `clusters/staging/keploy-k8s-proxy.yaml` in your Git repo:

```yaml
apiVersion: helm.toolkit.fluxcd.io/v2
kind: HelmRelease
metadata:
  name: k8s-proxy
  namespace: keploy
spec:
  interval: 5m
  chart:
    spec:
      chart: k8s-proxy-chart
      version: "3.3.10"
      sourceRef:
        kind: HelmRepository
        name: keploy
        namespace: flux-system
  install:
    createNamespace: true
  values:
    replicaCount: 1
    environment: "staging"
    selfHosted: false
    fullnameOverride: "k8s-proxy"

    keploy:
      existingSecret: "keploy-credentials"
      existingSecretKey: "access-key"
      clusterName: "<YOUR_CLUSTER_NAME>"
      apiServerUrl: "https://api.keploy.io"
      ingressUrl: "https://<YOUR_INGRESS_HOST>:30080"

    service:
      type: ClusterIP

    mongodb:
      enabled: false
    minio:
      enabled: false
```

Replace:

- `<YOUR_CLUSTER_NAME>`—the name you entered in the Keploy UI
- `<YOUR_INGRESS_HOST>`—the hostname that resolves to your cluster
- `:30080`—the NodePort from the Contour patch. For cloud clusters (EKS/GKE/AKS) using a LoadBalancer, use `:443` instead

---

## 5) Create the HTTPProxy for TLS passthrough

Create `clusters/staging/k8s-proxy-httpproxy.yaml` in your Git repo:

```yaml
apiVersion: projectcontour.io/v1
kind: HTTPProxy
metadata:
  name: k8s-proxy-ingress
  namespace: keploy
spec:
  virtualhost:
    fqdn: <YOUR_INGRESS_HOST>
    tls:
      passthrough: true
  tcpproxy:
    services:
      - name: k8s-proxy
        port: 8080
```

Replace `<YOUR_INGRESS_HOST>` with the same hostname used in `keploy.ingressUrl`.

> [!NOTE]
> TLS passthrough is required because the `k8s-proxy` serves HTTPS natively. Envoy forwards the encrypted connection directly to the `k8s-proxy` without terminating TLS. See the [ArgoCD guide](/docs/keploy-cloud/gitops-argocd#5-create-the-httpproxy-for-tls-passthrough) for a detailed explanation.

---

## 6) Push and let Flux reconcile

Commit and push all three files:

```bash
git add clusters/staging/keploy-source.yaml \
        clusters/staging/keploy-k8s-proxy.yaml \
        clusters/staging/k8s-proxy-httpproxy.yaml
git commit -m "Add Keploy k8s-proxy deployment"
git push
```

Flux detects the changes and applies them automatically. Check the status:

```bash
# Force immediate reconciliation (optional)
flux reconcile source git flux-system

# Check HelmRelease status
flux get helmreleases -n keploy

# Check HTTPProxy
kubectl get httpproxy -A
```

---

## 7) Verify the deployment

```bash
# Check k8s-proxy is running
kubectl get pods -n keploy

# Check HTTPProxy status (should show "valid")
kubectl get httpproxy -A

# Test connectivity through Contour
curl -sk https://<YOUR_INGRESS_HOST>:30080/healthz
# → {"status":"ok"}
```

✅ Open the Keploy UI → **Clusters** → your cluster should show as **Connected**. You can now record and replay traffic on any deployment.

---

## Git repository structure

After adding Keploy, your Flux repo should look like:

```text
clusters/
└── staging/
    ├── keploy-source.yaml            # OCI Helm repository for Keploy
    ├── keploy-k8s-proxy.yaml         # HelmRelease for k8s-proxy
    ├── k8s-proxy-httpproxy.yaml       # Contour HTTPProxy (TLS passthrough)
    └── your-other-apps/               # Your existing Flux manifests
```

---

## Summary

To add Keploy to an existing Flux setup, you need:

| What              | File                             | Purpose                                     |
| ----------------- | -------------------------------- | ------------------------------------------- |
| Helm source       | `keploy-source.yaml`             | OCI Helm repository for Keploy charts       |
| HelmRelease       | `keploy-k8s-proxy.yaml`          | Deploy `k8s-proxy` from Keploy's Helm chart |
| Contour HTTPProxy | `k8s-proxy-httpproxy.yaml`       | Route HTTPS traffic via TLS passthrough     |
| Kubernetes Secret | `kubectl create secret` (manual) | Access key for Keploy cloud authentication  |

Your existing application manifests and Flux configurations remain **completely untouched**. Keploy works alongside your app—not inside it.
