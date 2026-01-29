---
id: k8s-proxy
title: K8s Record Replay
description: The following sample app to test Keploy integration capabilities using NextJS,Drizzle and Postgres.
tags:
  - K8s
  - Microservices
  - Postgres
keyword:
  - Kubernetes
  - Record Replay
  - API Test generator
  - Auto Testcase generation
---

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
- **Ingress URL**:

  ```
  http://localhost:8080
  ```

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/cluster_config.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

This allows the Keploy Proxy to observe and record live traffic from your Kubernetes application.

Note: For this quickstart, I am running it locally. If you are running your application in production, provide the necessary ingress URL.

### 4. Install the Keploy Proxy in your k8s Cluster

Once you have provided the cluster details, you can install the Keploy Proxy in your Kubernetes cluster using Helm.

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/k8s_helm_command.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

### 5. Verify the Installation

Paste the Helm command into the terminal. Once the installation is complete, verify that the Keploy Proxy is running.

Note: The Keploy Proxy will be installed in the `keploy` namespace.

```bash
kubectl get pods -n keploy
```

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/k8s-proxy/keploy_proxy.png" alt="Sample Keploy K8s proxy" width="100%" style={{ borderRadius: '5px' }}/>

Note: You need to port-forward the Keploy Proxy when running this setup on a local machine.

```bash
kubectl port-forward -n keploy svc/k8s-proxy 8080:8080
```

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
