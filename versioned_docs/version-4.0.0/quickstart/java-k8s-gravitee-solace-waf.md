---
id: java-k8s-gravitee-solace-waf
title: Record and replay Java on Kubernetes with Gravitee, Solace PubSub+, and ModSecurity WAF
sidebar_label: K8s Gravitee, Solace PubSub+ & WAF
description: Deploy Spring Boot on Kind with Gravitee, Solace PubSub+ (SMF), ModSecurity WAF, PostgreSQL, and Redis, then record and replay all five mock kinds.
tags:
  - java
  - spring-boot
  - kubernetes
  - kind
  - solace
  - gravitee
  - waf
  - postgres
  - redis
  - quickstart
  - samples
keywords:
  - Java
  - Spring Boot
  - Kubernetes
  - Kind
  - Gravitee
  - Solace PubSub+
  - SMF
  - ModSecurity
  - OWASP CRS
  - PostgreSQL
  - Redis
  - Keploy k8s-proxy
  - DaemonSet
---

import HowTo from '@site/src/components/HowTo';
import ProductTier from '@site/src/components/ProductTier';

<HowTo
name="Record and replay a Java Spring Boot service on Kubernetes with Gravitee, Solace PubSub+, ModSecurity WAF, PostgreSQL, and Redis"
description="Deploy a multi-dependency Spring Boot service on Kind, connect the cluster to Keploy, record live traffic across five mock kinds, and replay baseline, regression, strict-noise, and expected-change builds."
totalTime="PT20M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["Docker", "git", "Kind", "kubectl", "Helm", "Keploy Enterprise CLI"]}
visible={false}
steps={[
{
name: "Create a Kind cluster and install ingress-nginx",
text: "Clone keploy/samples-java, create a local Kind cluster with kind-config.yaml, and install the Kind ingress-nginx controller.",
},
{
name: "Build and load the application images",
text: "Build orders-api (1.0, 2.0, 2.1, 2.2), inventory-api, and payments-api, then load them into the Kind cluster.",
},
{
name: "Deploy the multi-dependency stack",
text: "Apply the Kubernetes manifests for Solace PubSub+, PostgreSQL, Redis, ModSecurity / OWASP CRS WAF, Gravitee API Gateway, and the services.",
},
{
name: "Connect the cluster in the Keploy Console",
text: "Configure a tunnel DaemonSet cluster in app.keploy.io, label the keploy namespace, and install k8s-proxy via Helm.",
},
{
name: "Record traffic and inspect all five mock kinds",
text: "Start recording orders-api, run scripts/traffic.sh, stop recording, and inspect the Solace, PostgresV3, Redis, Http (Gravitee and WAF), and DNS mocks.",
},
{
name: "Replay baseline, regression, strict, and expected-change builds",
text: "Verify green sandbox auto-replay on 1.0, catch multi-dependency diffs on 2.0, compare default versus strict mock noise on 2.1, and triage the intended response change on 2.2 locally with keploy cloud replay and keploy cloud triage.",
},
]}
/>

<ProductTier tiers="Enterprise" offerings="SaaS" />

This guide walks you through deploying a Spring Boot 3.3 / Java 21 `orders-api` on a local Kind cluster behind a **ModSecurity / OWASP CRS** WAF and **Gravitee** API Gateway, then recording and replaying its live traffic with Keploy's Kubernetes DaemonSet agent — with no code changes, no SDK, and no sidecar.

Sample repository: [keploy/samples-java/k8s-gravitee-solace-waf](https://github.com/keploy/samples-java/tree/main/k8s-gravitee-solace-waf)

:::note Minimum versions
Requires Keploy Enterprise `vX.Y.Z+`, Keploy Enterprise CLI `vX.Y.Z+`, and `k8s-proxy-chart` `vX.Y.Z+` for native Solace PubSub+ SMF v3 mocks.
:::

## Explore the architecture

Every `POST /orders` request travels through the inbound WAF and Gravitee API Gateway into `orders-api`, which then interacts with five real dependencies — including outbound calls back through Gravitee and the ModSecurity / OWASP CRS WAF, plus bidirectional native SMF messaging on Solace PubSub+:

```text
client -> ingress-nginx + ModSecurity / OWASP CRS PL1 (inbound WAF)   ns ingress-nginx
       -> Gravitee API Gateway 4.9 (API "Orders API", /orders)        ns gateway
       -> orders-api (Spring Boot 3.3, Java 21)                       ns orders
            |-- Redis 7.2 (SET NX EX idempotency, GET/SETEX cache, DEL) ns data
            |-- ModSecurity / OWASP CRS PL2 (Host: payments.partner.local)
            |     -> payments-api (200 authorized, or WAF 403 -> 422) ns orders
            |-- PostgreSQL 16 (INSERT / SELECT / UPDATE orders)       ns data
            |-- Gravitee API Gateway 4.9 (API "Inventory API", /inventory)
            |     -> inventory-api (POST /inventory/reserve)          ns orders
            |-- Solace PubSub+ Standard (native SMF v3, TCP :55555)   ns messaging
                  -> Publish: JCSMP Direct to topic orders/created
                  <-> Subscribe + Publish + Consume: JCSMP XMLMessageConsumer
                     on topic orders/cancelled/<orderId> (POST /orders/{id}/cancel)
```

## Check prerequisites

Ensure you have the following installed:

- **Docker** (allocate at least 12 GB RAM for Kind, Solace PubSub+, and replay sandboxes)
- **git**
- **Kind** (`v0.27+`)
- **kubectl** (`v1.31+`)
- **Helm** (`v3.16+`)
- **curl** and **python3**
- A **Keploy Enterprise** account at [app.keploy.io](https://app.keploy.io) and the [Keploy Enterprise CLI](/docs/keploy-cloud/cloud-installation/) (`keploy`) for local cloud replay and triage

Verify your tools:

```bash
docker --version
git --version
kind --version
kubectl version --client
helm version
```

## Clone the sample repository

```bash
git clone https://github.com/keploy/samples-java.git
cd samples-java/k8s-gravitee-solace-waf
```

## Create a Kind cluster and install ingress-nginx

Create the `keploy-k8s-sample` Kind cluster with ports 80 and 443 mapped to `localhost`:

```bash
kind create cluster --name keploy-k8s-sample --config kind-config.yaml --wait 180s
```

Install the Kind `ingress-nginx` controller (pinned to its final upstream release `controller-v1.15.1`) and wait for it to become ready:

:::note Retired upstream controller
Upstream `kubernetes/ingress-nginx` was retired and archived in March 2026 (`controller-v1.15.1` is its final release). It is used here only to provide a self-contained local Kind ModSecurity / OWASP CRS WAF sandbox.
:::

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.15.1/deploy/static/provider/kind/deploy.yaml
kubectl -n ingress-nginx rollout status deploy/ingress-nginx-controller --timeout=300s
```

:::tip Mount bpffs in containerized Kind environments
If `/sys/fs/bpf` is not mounted as `bpffs` inside the Kind node container, mount it before installing the Keploy DaemonSet agent:

```bash
docker exec keploy-k8s-sample-control-plane sh -c 'mount | grep -q " /sys/fs/bpf type bpf" || mount -t bpf bpf /sys/fs/bpf'
```
:::

## Build and load the images

Build `orders-api` (`1.0` baseline plus `2.0`, `2.1`, and `2.2` change variants), `inventory-api`, and `payments-api`:

| Image | Patch | Purpose |
| --- | --- | --- |
| `orders-api:1.0` | Baseline | All dependencies healthy |
| `orders-api:2.0` | `app/v2.patch` | Multi-dependency regression across Gravitee (`/inventory/reserve`), Solace PubSub+ SMF (`OrderCreated`), and PostgreSQL (`UPDATE`) |
| `orders-api:2.1` | `app/v3.patch` | Subtle value drift: upper-cases `channel` (`"web"` → `"WEB"`) in the Solace PubSub+ event |
| `orders-api:2.2` | `app/v4.patch` | Intended API change: `POST /orders/{id}/cancel` returns `"status": "REFUND_PENDING"` instead of `"CANCELLED"` |

```bash
docker build -t orders-api:1.0 ./app
docker build --build-arg VARIANT=v2 -t orders-api:2.0 ./app
docker build --build-arg VARIANT=v3 -t orders-api:2.1 ./app
docker build --build-arg VARIANT=v4 -t orders-api:2.2 ./app
docker build -t inventory-api:1.0 ./inventory-app
docker build -t payments-api:1.0 ./payments-app
```

Load the images into Kind:

```bash
kind load docker-image --name keploy-k8s-sample \
  orders-api:1.0 orders-api:2.0 orders-api:2.1 orders-api:2.2 \
  inventory-api:1.0 payments-api:1.0
```

## Deploy the stack

Apply the manifests for Solace PubSub+, PostgreSQL, Redis, ModSecurity / OWASP CRS WAF, Gravitee API Gateway, `inventory-api`, `payments-api`, `orders-api`, and both Ingress routes:

```bash
kubectl apply -f k8s/00-namespaces.yaml \
  -f k8s/10-solace.yaml \
  -f k8s/12-postgres.yaml \
  -f k8s/13-redis.yaml \
  -f k8s/06-waf-modsecurity.yaml \
  -f k8s/15-inventory-api.yaml \
  -f k8s/16-payments-api.yaml \
  -f k8s/30-gravitee-gateway.yaml \
  -f k8s/31-gravitee-orders-api-definition.yaml \
  -f k8s/32-gravitee-inventory-api-definition.yaml \
  -f k8s/20-orders-api.yaml \
  -f k8s/40-ingress-waf.yaml \
  -f k8s/41-ingress-payments-waf.yaml
```

Wait for all deployments to roll out (Solace PubSub+ takes about 60 seconds on first start):

```bash
kubectl -n data rollout status deploy/postgres --timeout=300s
kubectl -n data rollout status deploy/redis --timeout=300s
kubectl -n orders rollout status deploy/inventory-api --timeout=300s
kubectl -n orders rollout status deploy/payments-api --timeout=300s
kubectl -n gateway rollout status deploy/gravitee-gateway --timeout=300s
kubectl -n orders rollout status deploy/orders-api --timeout=300s
kubectl -n messaging rollout status deploy/solace --timeout=300s
```

Create the Solace PubSub+ `orders-audit` queue (`orders/>`) and wait for the edge ingress route to sync:

```bash
until bash scripts/solace-setup-queue.sh; do sleep 5; done
until curl -fsS http://localhost/orders/ORD-SEED-1001 >/dev/null 2>&1; do sleep 3; done
```

Verify that a single order flows end to end through the WAF, Gravitee, Redis, partner payments WAF, PostgreSQL, outbound Gravitee `/inventory`, and Solace PubSub+:

```bash
curl -s -i -X POST http://localhost/orders \
  -H "Content-Type: application/json" \
  -d '{"customerId":"C-4242","reference":"PO-SMOKE-1","currency":"EUR","note":"standard delivery","items":[{"sku":"SKU-DOCK-USB4","quantity":1,"unitPrice":189.50}]}'

bash scripts/solace-queue-depth.sh
```

Verify the ModSecurity / OWASP CRS WAF blocks inbound attacks (`403`, never reaching `orders-api`) and enforces the outbound partner payments WAF (`403` → `422 payment_rejected_by_waf`):

```bash
bash scripts/attack.sh
```

Reset Redis and PostgreSQL to the clean seed state before recording:

```bash
bash scripts/reset.sh
```

## Connect the cluster in the Keploy Console

1. Open [app.keploy.io/clusters](https://app.keploy.io/clusters) and click **Connect New Cluster**.
2. Expand **Advanced settings** and configure:
   - **Cluster Name**: `keploy-k8s-sample`
   - **How should Keploy reach this cluster?**: **Keploy tunnel — the agent dials out (no inbound access needed)**
   - **Deployment Type**: **SaaS**
   - Check **Enable DaemonSet mode**
3. Click **Connect to Cluster**. This registers the cluster and copies the generated Helm install command (which includes your cluster access key).
4. Create and label the `keploy` namespace so Kubernetes Pod Security Admission permits the privileged DaemonSet agent:

```bash
kubectl create namespace keploy --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace keploy pod-security.kubernetes.io/enforce=privileged --overwrite
```

5. Run the copied install command, or create the `keploy-credentials` Secret and install `k8s-proxy` directly. Replace `<CHART_VERSION>` with the chart version shown in the dialog (or `X.Y.Z` from Minimum versions above, without a leading `v`):

```bash
kubectl -n keploy create secret generic keploy-credentials \
  --from-literal=access-key="<YOUR_ACCESS_KEY>" \
  --dry-run=client -o yaml | kubectl apply -f -

helm upgrade --install k8s-proxy oci://docker.io/keploy/k8s-proxy-chart \
  --version <CHART_VERSION> \
  --namespace keploy \
  --set selfHosted=false \
  --set environment=prod \
  --set keploy.existingSecret=keploy-credentials \
  --set keploy.existingSecretKey=access-key \
  --set keploy.clusterName=keploy-k8s-sample \
  --set keploy.apiServerUrl=https://api.keploy.io \
  --set keploy.tunnel.enabled=true \
  --set service.type=ClusterIP \
  --set ingress.enabled=false \
  --set daemonset.enabled=true
```

Wait for both Keploy workloads to become ready:

```bash
kubectl -n keploy rollout status deploy/k8s-proxy --timeout=180s
kubectl -n keploy rollout status ds/k8s-proxy-daemonset --timeout=180s
```

Open **Clusters → keploy-k8s-sample** in the Keploy Console and confirm the cluster status is **Connected** with `orders/orders-api` listed under **Deployments**.

## Record traffic

1. In the Keploy Console, open **Clusters → keploy-k8s-sample**, click **Record** on `orders/orders-api`, click **Next**, leave **Static deduplication** on under **Record config**, click **Next**, then click **Start Recording**.
2. Wait until the `orders-api` Pod is ready:

```bash
kubectl -n orders rollout status deploy/orders-api --timeout=180s
```

3. Send end-to-end traffic through the WAF and Gravitee:

```bash
bash scripts/traffic.sh
```

`scripts/traffic.sh` sends 19 requests exercising every dependency and edge case:
- Eight `POST /orders` (`201`) across multiple SKUs, currencies, and sales channels.
- One duplicate `POST /orders` (`409`) caught by Redis `SET NX EX` idempotency.
- One `POST /orders` (`422`) whose customer note triggers the outbound ModSecurity / OWASP CRS PL2 rules (`403`) on the partner payments WAF.
- One invalid `POST /orders` (`400`) rejected by input validation.
- Four `GET /orders/{id}` (`200`) covering Redis cache `MISS` → PostgreSQL `SELECT` → Redis `SETEX` and a Redis cache `HIT`.
- Two distinct `POST /orders/{id}/cancel` (`200`, `"consumedVia":"solace-smf"`) publishing and consuming `OrderCancelled` over Solace PubSub+ native SMF on `orders/cancelled/<orderId>`, updating PostgreSQL, and evicting Redis.
- One post-cancel `GET /orders/{id}?afterCancel=1` (`200`, `"status":"CANCELLED"`) and one `GET /orders/ORD-DOESNOTEXIST` (`404`).

4. Click **Stop Recording** in the Keploy Console. Keploy drains the persistent SMF, PostgreSQL, and Redis sockets cleanly and starts sandbox auto-replay automatically.

## Walk through recorded tests and mocks

Open the newest recording for `orders/orders-api` in the Keploy Console. Static deduplication condenses the 19 requests into **13 tests** (collapsing repeated `POST /orders` creates and the duplicate `GET /orders/ORD-SEED-1001?view=cached` response shape) backed by **five native mock kinds**:

### Inspect Solace PubSub+ (native SMF v3) mocks

Filter mocks by **Solace**. You will see the native SMF v3 (`:55555`) protocol exchanges:
- Session `login`, `subscribe` (`orders/cancelled/<orderId>`), `control`, and a deduplicated `keepalive`.
- `publish` mocks on `orders/created` and `orders/cancelled/<orderId>` with decoded JSON payloads and `correlationId`.
- Broker-pushed **`consume`** mocks on `orders/cancelled/<orderId>` delivered to the JCSMP `XMLMessageConsumer` inside `POST /orders/{id}/cancel`.

### Inspect PostgreSQL mocks

Filter mocks by **Postgres** (`PostgresV3`):
- `INSERT INTO orders (...) VALUES ($1, 'CREATED', ...)` for each created order.
- `SELECT order_id, status, ... FROM orders WHERE order_id = $1` with the returned order row (and 0 rows for `ORD-DOESNOTEXIST`).
- `UPDATE orders SET status = 'CANCELLED' WHERE order_id = $1` for each order cancellation (recorded wire SQL; during replay mismatch reporting Keploy normalizes SQL literals to positional placeholders such as `$2`, `$3`).

### Inspect Redis mocks

Filter mocks by **Redis**:
- `SET idempotency:<customerId>:<reference> <orderId> NX EX 3600` (`OK` on first order, `nil` on the `409` duplicate).
- `GET order:<id>`, `SETEX order:<id> 300`, and `DEL` on WAF-403 cleanup and cancellation.

### Inspect HTTP mocks via Gravitee and ModSecurity / OWASP CRS WAF

Filter mocks by **Http** to inspect both gateway and WAF interactions:
- **Gravitee inbound and outbound:** Inbound `POST /orders` tests retain Gravitee's injected headers (`X-Gateway: gravitee-apim-4.9`, `X-Api-Plan: keyless`, `X-Gravitee-Transaction-Id`). Outbound `Http` mocks to `gravitee-gateway.gateway.svc.cluster.local:82` (`POST /inventory/reserve`) capture `X-Api-Key` (validated by `inventory-api`) on the request and Gravitee's `X-Gravitee-Transaction-Id`, `X-Served-By: gravitee-inventory`, and `X-Gateway-Api: Inventory API` headers on the response.
- **ModSecurity / OWASP CRS WAF inbound and outbound:** Inbound attacks from `scripts/attack.sh` return `403` at the edge and never appear in the recording. Outbound `Http` mocks to `ingress-nginx-controller.ingress-nginx.svc.cluster.local:80` (`Host: payments.partner.local`, `POST /payments/authorize`) capture both `200 AUTHORIZED` and the **`403 Forbidden`** WAF block verdict so replay reproduces `422 payment_rejected_by_waf` offline.

### Inspect DNS mocks

Filter mocks by **DNS** to inspect cluster service resolutions for `solace.messaging.svc.cluster.local`, `postgres.data.svc.cluster.local`, `redis.data.svc.cluster.local`, `gravitee-gateway.gateway.svc.cluster.local`, and `ingress-nginx-controller.ingress-nginx.svc.cluster.local`.

## Replay in the Keploy Console

### Verify baseline auto-replay (`orders-api:1.0`)

Auto-replay starts a sandbox Pod with a deny-egress `NetworkPolicy` so Solace PubSub+, PostgreSQL, Redis, Gravitee/`inventory-api`, and WAF/`payments-api` are all unreachable and answered from mocks. Expected result: **13 passed, 0 failed**.

### Catch a multi-dependency regression (`orders-api:2.0`)

1. Click **Replay** on `orders/orders-api`, then click **Next**.
2. In **Configure**, set **Replay image (optional)** to `orders-api:2.0` and leave [**Strict mock noise**](/docs/developer/manual-replay/#strict-mock-noise) off.
3. Click **Start Replay**.

Expected result: **8 passed, 5 failed** — the same three `POST /orders` tests (`201 → 502`) each report both the Gravitee and Solace PubSub+ diffs, and the two `POST /orders/{id}/cancel` tests (`200 → 500`) report the PostgreSQL diff:
- **Gravitee → `inventory-api`** (`POST /orders`, 3 tests): `body.warehouse: recorded "EU-WEST-1", absent in live call; body.fulfillmentCenter: live "EU-WEST-1", absent in recording`.
- **Solace PubSub+ SMF** (`POST /orders`, same 3 tests): `body.eventVersion: recorded "1", live "2"; body.totalAmount: recorded "...", absent in live call; body.amount: live "...", absent in recording`.
- **PostgreSQL** (`POST /orders/{id}/cancel`, 2 tests): `UPDATE orders SET status = $2, note = $3 WHERE order_id = $1 (no_schema_candidates)` (Keploy normalizes SQL literals to positional placeholders).

### Compare default versus strict mock noise (`orders-api:2.1`)

1. Click **Replay** → **Next**, set **Replay image (optional)** to `orders-api:2.1`, leave **Strict mock noise** OFF, and click **Start Replay**: **13 passed, 0 failed** (`201 → 201`), while showing the outgoing Solace PubSub+ diff (`body.channel: recorded "web", live "WEB"`).
2. Click **Replay** → **Next**, set **Replay image (optional)** to `orders-api:2.1`, turn **Strict mock noise** ON, and click **Start Replay**: **10 passed, 3 failed** — the three `POST /orders` tests fail purely on the Solace PubSub+ value drift (`body.channel`: `"web"` → `"WEB"`, `"mobile"` → `"MOBILE"`), even though every HTTP status is still `201`.

### Verify an intended response change (`orders-api:2.2`)

Click **Replay** → **Next**, set **Replay image (optional)** to `orders-api:2.2` (**Strict mock noise** OFF), and click **Start Replay**: **11 passed, 2 failed**. Only the two `POST /orders/{id}/cancel` tests (`200 → 200`) fail, each showing `"status": "CANCELLED"` → `"REFUND_PENDING"` while every dependency call matches.

## Run local cloud replay and triage

Authenticate the [Keploy Enterprise CLI](/docs/keploy-cloud/cloud-installation/) once (`keploy login`, or export `KEPLOY_API_KEY="<YOUR_API_KEY>"`), then replay the same cloud-stored recording directly against a local Docker image (see [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/)). Omit `--test-sets` to replay every test set recorded for the app, or pass `--test-sets "<TEST_SET_ID>"` with the Test Set ID from the Console recording page:

```bash
# Replay baseline 1.0 locally
keploy cloud replay \
  --app orders.orders-api \
  --cluster keploy-k8s-sample

# Replay the 2.0 multi-dependency regression locally
keploy cloud replay \
  --app orders.orders-api \
  --cluster keploy-k8s-sample \
  --image orders-api:2.0

# Replay the 2.2 intended cancel-status change locally
keploy cloud replay \
  --app orders.orders-api \
  --cluster keploy-k8s-sample \
  --image orders-api:2.2
```

When a replay fails, copy `<RUN_ID>` (the ID between `/tr/` and `?appId=` in the report link printed at the end of the replay output) and run `keploy cloud triage`:

```bash
keploy cloud triage \
  --app orders.orders-api \
  --cluster keploy-k8s-sample \
  --run <RUN_ID>
```

For `orders-api:2.0`, triage groups the five failures into two dependency groups (`CALL_CHANGED` on `POST /orders` for Gravitee + Solace PubSub+, and `CALL_ADDED` on `POST /orders/{id}/cancel` for PostgreSQL). For `orders-api:2.2`, triage groups both cancel failures under `RESPONSE_CHANGED` (`2 tests on POST /orders/{id}/cancel`, `$.status: "CANCELLED" → "REFUND_PENDING"`).

## Clean up

Reset PostgreSQL, Redis, and `orders-api` between runs:

```bash
bash scripts/reset.sh
```

When you are done, uninstall `k8s-proxy`, delete the Kind cluster, remove the local `keploy/` directory and `keploy.yml` created by local replay, and delete the `keploy-k8s-sample` entry under **Clusters** in [app.keploy.io](https://app.keploy.io/clusters):

```bash
helm uninstall k8s-proxy -n keploy
kind delete cluster --name keploy-k8s-sample
rm -rf keploy keploy.yml
```

## Review third-party components and licences

This sample pulls third-party container images and libraries subject to their own licences:

- **Solace PubSub+ Standard** (`solace/solace-pubsub-standard:10.26.0`) and **`com.solacesystems:sol-jcsmp:10.24.0`** are proprietary free-to-use software distributed under the [Solace Corporation License Agreement](https://solace.com/license-software), not open source. Pulling the Solace container image or building `orders-api` with `sol-jcsmp` requires accepting Solace's licence terms.
- **Gravitee APIM Gateway CE** (`graviteeio/apim-gateway`), **ModSecurity v3**, **OWASP CRS**, and **`ingress-nginx`** are licensed under **Apache-2.0**.
- **PostgreSQL 16** (`postgres:16.16-alpine`) is licensed under the **PostgreSQL License**.
- **Redis 7.2** (`redis:7.2.17-alpine`) is licensed under **BSD-3-Clause**.

## Related

- [K8s Record Replay](/docs/quickstart/k8s-proxy/) — overview of recording and replaying Kubernetes workloads with Keploy.
- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/) — full flag reference for `keploy cloud replay`.
- [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/) — branching and gating pull requests with Keploy.
