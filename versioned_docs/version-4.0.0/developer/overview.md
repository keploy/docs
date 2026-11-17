---
id: overview
title: Developer guide
sidebar_label: Overview
description: The day-to-day Keploy loop on Kubernetes, from recording live traffic and replaying it, to cleaning up a failing test case on a branch and merging it into main.
tags:
  - K8s
  - developer
  - record
  - replay
  - branches
keywords:
  - keploy developer guide
  - k8s proxy record replay
  - auto replay
  - delete test case
  - keploy branch merge
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

This section covers the everyday loop once the [Keploy proxy is installed in your cluster](/docs/quickstart/k8s-proxy/). Each page is short and links out to the detailed reference where one exists.

## The loop

1. **[Record](/docs/developer/record/).** Capture live traffic on a deployment. Each request becomes a test case, and the calls your app makes to databases and other services are saved as mocks.
2. **[Auto-replay](/docs/developer/auto-replay/).** While recording runs, Keploy replays new test sets on a fixed interval, so you see failures without lifting a finger.
3. **[Manual replay](/docs/developer/manual-replay/).** Replay on demand from the dashboard or the CLI, and read the result on the **Test Report** page.
4. **[Noise configuration](/docs/developer/noise/).** Tell Keploy which response fields and mock request fields are allowed to change between runs.
5. **[Delete a failing test case](/docs/developer/delete-test-cases/).** If a replay fails because the test case is wrong or obsolete rather than because of a real app regression, delete it from the report. The delete goes to a branch, never straight to main.
6. **[Create a branch](/docs/developer/create-branch/).** Every change to test data lives on a Keploy branch, the same way code changes live on a git branch.
7. **[Merge a branch](/docs/developer/merge-branch/).** Commit, get a review, and merge. Only then does main change.

## Before you start

- The Keploy proxy is installed and your cluster shows as connected on the **Clusters** page. See [K8s Record Replay](/docs/quickstart/k8s-proxy/).
- You have permission to record on the cluster. Deleting test cases and merging branches need branch permissions on the app. An Org Admin has all of them.

## Related

- [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/): wire branches into your CI pipeline.
- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/): every `keploy cloud replay` flag.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/): drive recording and replay from scripts.
