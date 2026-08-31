---
id: k8s-proxy
title: K8s Record Replay
description: The following sample app to test Keploy integration capabilities using NextJS,Drizzle and Postgres.
tags:
  - K8s
  - Microservices
  - Postgres
keywords:
  - Kubernetes
  - Record Replay
  - API Test generator
  - Auto Testcase generation
---

import HowTo from '@site/src/components/HowTo';

<HowTo
name="Kubernetes Live Record & Replay with Keploy Proxy — record and replay tests with Keploy"
description="Deploy a sample app to a local Kind cluster, connect it to the Keploy Dashboard, install the Keploy Proxy via Helm, then record live Kubernetes traffic and generate tests with AI."
totalTime="PT15M"
estimatedCost={{currency: "USD", value: "0"}}
tools={["Docker", "Kind", "kubectl", "Helm", "git"]}
visible={false}
steps={[
{
name: "Install prerequisites and clone the sample app",
text: "Install Docker, Kind, kubectl, and Helm, then clone the ecommerce sample app and check out the k8s branch (git checkout k8s).",
},
{
name: "Create a Kind cluster",
text: "Create a local Kubernetes cluster with kind create cluster --name ecommerce.",
},
{
name: "Build and load Docker images",
text: "Build the service images locally and load them into the Kind cluster with kind load docker-image, since the manifests use imagePullPolicy: Never.",
},
{
name: "Deploy the application",
text: "Apply the Kubernetes manifests with kubectl apply -f k8s/, wait until all pods are Running, then port-forward the API gateway (kubectl port-forward service/apigateway 8083:8083).",
},
{
name: "Connect your cluster in the Keploy Dashboard",
text: "In app.keploy.io, open Integration Testing → Clusters, add the cluster, and choose how Keploy reaches it — the default Keploy tunnel needs no inbound access, or select Ingress URL and provide the URL where the agent is published.",
},
{
name: "Install the Keploy Proxy via Helm",
text: "Run the Helm command shown in the dashboard to install the Keploy Proxy into the keploy namespace. On the default Keploy tunnel path the agent dials out and is ready once its pods are Running; only the Ingress URL path needs kubectl port-forward -n keploy svc/k8s-proxy 8080:8080.",
},
{
name: "Record live traffic",
text: "Click Start Recording in the dashboard for the apigateway pod and send requests to capture live Kubernetes traffic as testcases and mocks.",
},
{
name: "Generate tests with AI",
text: "Use \"Use AI for Tests\" in the dashboard to expand coverage from the recorded traffic, then review the accepted, buggy, and rejected test suites.",
},
]}
/>

# Kubernetes Live Record & Replay using Keploy Proxy

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

This guide demonstrates how to use **Keploy Proxy** to perform **live traffic recording and replay in a Kubernetes environment**.

## Get the Sample Application

Start by cloning the e-commerce sample application repository and switching to the Kubernetes setup branch.

```bash
git clone https://github.com/keploy/ecommerce_sample_app.git
cd ecommerce_sample_app
git checkout k8s
```

This branch contains all Kubernetes manifests and configurations required for this guide.

## Prerequisites

Make sure you have the following installed:

- **Docker**
- **Kind**
- **kubectl**
- **Helm**

Verify installations:

```bash
docker --version
kind --version
kubectl version --client
helm version
```

## Deployment Steps

You can use the **Keploy Kubernetes proxy** with any Kubernetes cluster, whether it is running in production or in a local environment. For this quickstart, we use a local Kind cluster to provide an overview of how the Keploy Kubernetes proxy works.

We’ll use an **e-commerce sample application** deployed on a local Kubernetes cluster (Kind) to demonstrate Keploy’s live record and replay capabilities with real microservices traffic.

Note: If you already have a Kubernetes cluster running, you can skip the deployment steps.

### 1. Create a Kind Cluster

Create a local Kubernetes cluster named `ecommerce`:

```bash
kind create cluster --name ecommerce
```

### 2. Build Docker Images Locally

The application consists of multiple services.
Build the Docker images locally so they can be used inside the Kind cluster.

```bash
docker build -t user-service:latest ./user_service
docker build -t product-service:latest ./product_service
docker build -t order-service:latest ./order_service
docker build -t apigateway:latest ./apigateway
```

### 3. Load Images into Kind

Since the Kubernetes manifests use `imagePullPolicy: Never`, the images must be manually loaded into the Kind cluster.

```bash
kind load docker-image user-service:latest --name ecommerce
kind load docker-image product-service:latest --name ecommerce
kind load docker-image order-service:latest --name ecommerce
kind load docker-image apigateway:latest --name ecommerce
```

> **Note**
>
> The `mysql:8.0` and `localstack/localstack:3.3` images will be pulled automatically by Kind if not present locally.
> You may also load them manually to speed up cluster startup.

### 4. Deploy the Application

Apply all Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

Check the status of pods:

```bash
kubectl get pods
```

Wait until all pods are in the **Running** state.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/k8s_pods.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 5. Access the Application

The API Gateway is exposed via a **NodePort** service.

For local environments use port-forwarding:

```bash
kubectl port-forward service/apigateway 8083:8083
```

Access the application at:

```
http://localhost:8083
```

At this point, your e-commerce application is live and ready to receive traffic.

---

## Enable Live Record & Replay with Keploy Proxy

### Pick a recording mode

The Keploy Proxy supports two ways to capture traffic from your application Pods. Both modes drive the **same Console UI and REST API**—the rest of this guide works identically in either case. Pick whichever fits your environment.

|                                           | **Sidecar mode (default)**                                                                                                                                        | **DaemonSet mode**                                                                                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| How traffic is captured                   | A `keploy-agent` sidecar container is injected into your application Pod via a `MutatingAdmissionWebhook`. The agent intercepts traffic alongside your container. | A `keploy-daemonset` Pod runs on each node and captures traffic from existing application Pods using **eBPF**—no sidecar, no application Pod restart.                                                                         |
| What happens on `Start Recording`         | The proxy injects the agent and rolls the application Deployment.                                                                                                 | The proxy creates a `RecordingSession` Custom Resource. The DaemonSet picks it up and programs its BPF target maps to capture matching Pods on each node.                                                                     |
| Pod mutation on the application namespace | Required (`patch` on Deployments).                                                                                                                                | **Not required.** Application Pods are never modified.                                                                                                                                                                        |
| Application restart at recording start    | Yes, on first recording.                                                                                                                                          | No.                                                                                                                                                                                                                           |
| Best for                                  | Dev/staging, teams happy to grant write RBAC to Keploy on the application namespace.                                                                              | Production with read-only RBAC on the application namespace; environments where rolling the application Pod has unacceptable cost; or when you want cluster-mode auto-replay (replay runs in a separate cluster you provide). |

The screenshots below show the **Sidecar** flow because that is the default. To use **DaemonSet** mode instead, set the daemonset values when you run the Helm command in step 4 below—every other step is identical.

### 1. Open Keploy Dashboard

Visit:

```
https://app.keploy.io
```

### 2. Add Your Kubernetes Cluster

- Navigate to **Integration Testing**
- Click on **Clusters**
- Connect a new cluster

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/connect_cluster.png
" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 3. Configure Cluster Details

Provide the following information:

- **Cluster Name**: `ecommerce`

  This field is optional. Leave it blank and Keploy names the cluster for you.

- **How should Keploy reach this cluster?**: leave this on its default,
  **Keploy tunnel — the agent dials out (no inbound access needed)**.

  The proxy opens one outbound connection to Keploy over ordinary HTTPS, and the
  dashboard reaches it back down that connection. You need no public hostname, no
  TLS certificate, no LoadBalancer and no firewall rule — and there is no URL to
  fill in, so there is nothing more to do in this step.

<!-- TODO(screenshot): the previous cluster_config.png predates the connectivity
     dropdown — it shows a mandatory Cluster Name and an Ingress URL field, which
     now contradicts the text above. Removed rather than left stale. Replace with
     the capture at docs-screenshots/staging/01-connect-cluster-tunnel-default.png
     once it is uploaded to the keploy-devrel S3 bucket. -->

For more on this path — the Helm values, the network requirements and what the
tunnel does and does not carry — see
[Connect a cluster without an ingress](./k8s-proxy-egress-only.md).

#### To use an ingress URL instead

Select **Ingress URL — I will expose the agent at a URL** and an **Ingress URL**
field appears. Give it the address the browser can reach the agent at — for this
local quickstart, `http://localhost:8080`; in production, whatever public URL
your Ingress, Gateway or LoadBalancer publishes.

Pick this when you want the browser to call the cluster directly. It is
**required for Self-hosted** deployments, which never dial out to Keploy Cloud —
selecting that deployment type forces this choice and disables the dropdown.

On this path you also need the `kubectl port-forward` in step 5 below. Every
other step in this guide is identical either way.

### 4. Install the Keploy Proxy in your k8s Cluster

Once you have provided the cluster details, you can install the Keploy Proxy in your Kubernetes cluster using Helm.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/k8s_helm_command.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

#### DaemonSet mode (optional)

If you want to use **DaemonSet mode** instead of the default Sidecar mode, append the daemonset values to the Helm command shown in the dashboard. The Helm chart installs the `recordingsessions.keploy.io` and `replaysessions.keploy.io` Custom Resource Definitions, and the per-node DaemonSet that performs the eBPF capture.

```bash
# add these flags to the Helm command from the dashboard:
  --set daemonset.enabled=true \
  --set daemonset.crds.install=true
```

After install you should see a per-node `k8s-proxy-daemonset-*` Pod alongside the regular proxy Deployment:

```bash
kubectl get pods -n keploy
# NAME                                 READY   STATUS    RESTARTS   AGE
# k8s-proxy-xxxxxxxxxx-xxxxx           1/1     Running   0          1m
# k8s-proxy-daemonset-xxxxx            1/1     Running   0          1m   ← per node
# k8s-proxy-daemonset-yyyyy            1/1     Running   0          1m
# k8s-proxy-mongodb-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
# k8s-proxy-minio-xxxxxxxxxx-xxxxx     1/1     Running   0          1m
```

Verify the CRDs registered:

```bash
kubectl get crd | grep keploy.io
# recordingsessions.keploy.io   <date>
# replaysessions.keploy.io      <date>
```

The rest of this quickstart proceeds identically—the Console **Start Recording** button creates a `RecordingSession` CR which the DaemonSet picks up; you do not need to interact with the CR yourself.

### 5. Verify the Installation

Paste the Helm command into the terminal. Once the installation is complete, verify that the Keploy Proxy is running.

Note: The Keploy Proxy will be installed in the `keploy` namespace.

```bash
kubectl get pods -n keploy
```

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_proxy.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

**Ingress path only.** If you chose **Ingress URL** in step 3 and are running
this setup on a local machine, port-forward the Keploy Proxy so the browser can
reach it at the address you gave:

```bash
kubectl port-forward -n keploy svc/k8s-proxy 8080:8080
```

On the default **Keploy tunnel** path you can skip this — the agent dials out, so
nothing needs to reach it from your machine.

### 6. Your Keploy Proxy is ready to record live traffic

Once the Keploy Proxy is installed, you can view the list of running pods in the dashboard.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_list_pods.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 7. Start Recording

You can start recording live traffic from any of your pods by clicking Start Recording. For this quickstart, the `apigateway` pod is used.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_start_recording.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 8. Keploy is ready to Capture Live Traffic

Send a request to your API Gateway pod, and Keploy will capture the traffic.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_live_capturing.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 9. Record Live Traffic

Once you have sent a request to your API Gateway pod, you can see the live traffic being captured.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_record_live_traffic.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 10. Stop Recording

Once you have sent a request to your API Gateway pod, you can stop recording by clicking Stop Recording. To view the list of recordings, navigate to the recordings page, where you can see the captured traffic.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_recordings_total.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 11. Generate Tests using AI

Did you notice something interesting in the dashboard? Once you have recorded a test, you can use AI to increase coverage. To generate additional tests, click **Use AI for Tests**.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_recording_dashboard.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 12. Verify the Generation settings

Once you click **Use AI for Tests**, you can view the generation settings.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_k8s_atg.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 13. Verify the Generation

Once initiated, you can see the AI start generating test cases from the recorded traffic. The recorded traffic is used as input to create additional test cases.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_k8s_generation.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 14. View the Test Cases

After test generation, you can view the total number of test suites categorized as accepted, buggy, and rejected.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_k8s_reports.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### Conclusion

In this quickstart, we demonstrated how to use the Keploy Proxy in Kubernetes to record live traffic and generate tests using AI—all without writing manual tests. This is only a quickstart; you can follow the same steps to record real, production-like traffic and generate tests using AI.

Happy Testing with Keploy
