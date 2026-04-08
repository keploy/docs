---
id: gitops-argocd
title: Deploy Keploy with ArgoCD
sidebar_label: ArgoCD
tags:
  - explanation
  - feature guide
  - keploy enterprise
  - kubernetes
  - argocd
  - gitops
  - contour
keywords:
  - keploy enterprise
  - kubernetes
  - argocd
  - gitops
  - helm
  - contour
  - ingress
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

This guide walks you through deploying **Keploy's `k8s-proxy`** using **ArgoCD** (GitOps) on a Kubernetes cluster, with **Contour** as the ingress controller.

If you already use ArgoCD to manage your applications, adding Keploy requires **just two files**—an ArgoCD Application YAML and a Contour HTTPProxy YAML. No changes to your existing app code or manifests.

> [!NOTE]
> This guide assumes you have already completed the [Kubernetes Setup](/docs/keploy-cloud/kubernetes) and have a running Kind cluster with Keploy connected.

---

## Prerequisites

Ensure you have the following before you begin:

1. **A running Kubernetes cluster** (Kind, EKS, GKE, AKS)
2. **ArgoCD** installed on the cluster
3. **kubectl** and **Helm** installed
4. **Keploy Enterprise account** (with an access key)

---

## 1) Install ArgoCD

> Skip this if ArgoCD is already installed on your cluster.

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd rollout status deployment/argocd-server
```

Get the admin password:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret \
  -o jsonpath="{.data.password}" | base64 -d; echo
```

Access the ArgoCD UI:

```bash
kubectl -n argocd port-forward svc/argocd-server 8443:443 &
```

Open `https://localhost:8443` in your browser. Login with username `admin` and the password from above.

---

## 2) Deploy Contour ingress controller

Keploy's `k8s-proxy` serves **HTTPS natively** on its backend port. You need an ingress controller that supports **TLS passthrough**—forwarding the encrypted connection directly to the `k8s-proxy` without terminating it.

[Contour](https://projectcontour.io/) is a CNCF ingress controller powered by Envoy that supports this via its **HTTPProxy** CRD.

### 2.1 Install Contour

```bash
kubectl apply -f https://projectcontour.io/quickstart/contour.yaml
```

Wait for it to be ready:

```bash
kubectl -n projectcontour rollout status deployment/contour
kubectl -n projectcontour rollout status daemonset/envoy
```

### 2.2 Patch Envoy for Kind/VM clusters

Kind only maps specific ports to the host. Since TLS passthrough uses Envoy's HTTPS listener (port 443), you need to assign it to the mapped NodePort:

```bash
kubectl patch svc envoy -n projectcontour --type='json' -p='[
  {"op": "replace", "path": "/spec/type", "value": "NodePort"},
  {"op": "replace", "path": "/spec/ports/0/nodePort", "value": 30081},
  {"op": "replace", "path": "/spec/ports/1/nodePort", "value": 30080}
]'
```

This puts the **HTTPS listener on NodePort 30080** (mapped to the host) and the HTTP listener on 30081.

> [!TIP]
> For cloud clusters (EKS/GKE/AKS), skip this patch. The default LoadBalancer type works—your cloud provider assigns an external IP automatically.

### 2.3 Verify Contour

```bash
kubectl get pods -n projectcontour
kubectl get svc  -n projectcontour
```

Expected output:

```text
NAME      TYPE       CLUSTER-IP    EXTERNAL-IP   PORT(S)                      AGE
envoy     NodePort   10.96.65.35   <none>        80:30081/TCP,443:30080/TCP   2m
```

---

## 3) Create the Keploy access key secret

> Skip if you already created this during the [Kubernetes Setup](/docs/keploy-cloud/kubernetes).

Go to the Keploy UI → **Clusters** → **Connect New Cluster**. Enter your cluster name and ingress URL (e.g. `https://your-host:30080`). Click **Connect** to get your access key.

```bash
kubectl create namespace keploy

kubectl -n keploy create secret generic keploy-credentials \
  --from-literal=access-key="<YOUR_ACCESS_KEY>"
```

> [!WARNING]
> Never commit access keys to Git. Use `existingSecret` in Helm values or a secrets manager (Sealed Secrets, Vault, External Secrets Operator).

---

## 4) Create the ArgoCD Application for `k8s-proxy`

Create a file named `keploy-k8s-proxy.yaml`:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: keploy-k8s-proxy
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    chart: k8s-proxy-chart
    repoURL: registry-1.docker.io/keploy
    targetRevision: "3.3.10"
    helm:
      values: |
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
  destination:
    server: https://kubernetes.default.svc
    namespace: keploy
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Replace:

- `<YOUR_CLUSTER_NAME>`—the name you entered in the Keploy UI
- `<YOUR_INGRESS_HOST>`—the hostname that resolves to your cluster (e.g. your VM IP or a DNS name)
- `:30080`—the NodePort from the Contour patch above. For cloud clusters (EKS/GKE/AKS) using a LoadBalancer, use `:443` instead

Apply it:

```bash
kubectl apply -f keploy-k8s-proxy.yaml
```

---

## 5) Create the HTTPProxy for TLS passthrough

The `k8s-proxy` serves HTTPS on its backend. A standard Kubernetes `Ingress` only supports HTTP backends, so you need Contour's **HTTPProxy** CRD with TLS passthrough.

Create a file named `k8s-proxy-httpproxy.yaml`:

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

Apply it:

```bash
kubectl apply -f k8s-proxy-httpproxy.yaml
```

### How TLS passthrough works

```text
Client (Keploy cloud)
  │
  │  HTTPS (encrypted)
  ▼
Envoy (port 30080)           ← reads SNI hostname, does NOT decrypt
  │
  │  forwards encrypted bytes
  ▼
k8s-proxy (port 8080)        ← terminates TLS itself
```

Envoy looks at the **SNI** (Server Name Indication)—the hostname in the TLS Client Hello—to decide where to route the connection. It then passes the encrypted bytes straight through to the `k8s-proxy` without inspecting them. This is why the `fqdn` in the HTTPProxy must match the hostname the client uses.

> [!NOTE]
> SNI matching means you **must** access the `k8s-proxy` using the hostname (e.g. `https://your-host:30080`), not the raw IP address. Add an `/etc/hosts` entry if needed.

---

## 6) Verify the deployment

```bash
# Check ArgoCD sees the app
kubectl get applications -n argocd

# Check HTTPProxy status
kubectl get httpproxy -A
# Should show status: valid

# Check k8s-proxy is running
kubectl get pods -n keploy

# Test connectivity through Contour
curl -sk https://<YOUR_INGRESS_HOST>:30080/healthz
# → {"status":"ok"}
```

✅ Open the Keploy UI → **Clusters** → your cluster should show as **Connected**. You can now record and replay traffic on any deployment.

---

## 7) Deploy your application with ArgoCD

Your application needs **no changes** for Keploy. Deploy it as you normally would with ArgoCD—either from Helm charts or raw `K8s` manifests:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: my-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/your-repo.git
    targetRevision: main
    path: k8s/
  destination:
    server: https://kubernetes.default.svc
    namespace: staging
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Once deployed, your application appears in the Keploy UI under your cluster's **Deployments** tab. Click **Record** to start capturing live traffic.

---

## Summary

To add Keploy to an existing ArgoCD setup, you need:

| What               | File                             | Purpose                                     |
| ------------------ | -------------------------------- | ------------------------------------------- |
| ArgoCD Application | `keploy-k8s-proxy.yaml`          | Deploy `k8s-proxy` from Keploy's Helm chart |
| Contour HTTPProxy  | `k8s-proxy-httpproxy.yaml`       | Route HTTPS traffic via TLS passthrough     |
| Kubernetes Secret  | `kubectl create secret` (manual) | Access key for Keploy cloud authentication  |

Your existing application code, manifests, and ArgoCD Applications remain **completely untouched**. Keploy works alongside your app—not inside it.
