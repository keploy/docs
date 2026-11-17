---
id: overview
title: Developer guide
sidebar_label: Overview
description: The day-to-day Keploy loop on Kubernetes, from recording live traffic and replaying it, to fixing failing tests on a branch and merging them into main.
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

1. **[Record](/docs/developer/record/)** live traffic on a deployment.
2. **[Auto-replay](/docs/developer/auto-replay/)** runs while you record, so you see failures early.
3. **[Manual replay](/docs/developer/manual-replay/)** runs your tests on demand and produces a **Test Report**.
4. **[Fix failing tests](/docs/developer/fix-failing-tests/)**: fix the code if your app regressed. Otherwise delete the test case or add noise on a branch, then commit, review and merge it.
5. **[Noise configuration](/docs/developer/noise/)** lists every place you can tell Keploy which fields may change between runs.

## Key terms

| Term           | Meaning                                                                                                                       |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Test case      | One recorded request to your app and the response it returned.                                                                |
| Mock           | One recorded outgoing call your app made, such as a database query or an HTTP call. During replay, Keploy answers from it.    |
| Test set       | A group of test cases, with their mocks, from a recording. A recording produces one or more test sets.                        |
| Smart test set | The app's long-lived, deduplicated set of recorded flows, used for regression testing.                                        |
| Noise          | A field Keploy ignores when comparing, because its value changes on every run (timestamps, IDs, tokens).                      |
| Test Report    | The result of a manual replay: which test cases passed and failed, with a diff for each failure.                              |
| Branch         | A place for test-data changes, such as deletes and noise, that reach main only after they are committed, reviewed and merged. |

## Permissions you need

| Task                                       | Permission                                                    | Built-in roles that have it     |
| ------------------------------------------ | ------------------------------------------------------------- | ------------------------------- |
| Record                                     | `record:start` on the cluster, or `testcase:write` on the app | Admin, App Admin, Cluster Admin |
| Replay                                     | `replay:start` on the cluster or the app                      | Admin, App Admin, Cluster Admin |
| Change test data on a branch, and merge it | `branch:write` and `branch:merge` on the app                  | Admin, App Admin                |

If a button is disabled or you get a permission error, ask your admin for the role you need.

## Related

- [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/): wire branches into your CI pipeline.
- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/): every `keploy cloud replay` flag.
- [Kubernetes Proxy REST API](/docs/running-keploy/k8s-proxy-api/): drive recording and replay from scripts.
