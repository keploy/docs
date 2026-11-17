---
id: create-branch
title: Create a branch
sidebar_label: Create a branch
description: Create a Keploy branch so changes to test cases, mocks and noise are reviewed before they reach main, from the dashboard or the CLI.
tags:
  - K8s
  - developer
  - branches
keywords:
  - keploy branch
  - create branch
  - test data branch
  - keploy cloud replay create-branch
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

A Keploy branch holds changes to your test data, such as deleted test cases, edited mocks or new noise, apart from main. It works like a git branch: you make changes on it, get them reviewed, and [merge](/docs/developer/merge-branch/) them into main. Until then, main and every replay of main are unchanged.

## Create a branch from the dashboard

1. Open the **Recordings** page or a **Test Report**, with your app selected.
2. In the header, open the branch picker, which shows **main**.
3. Click **Create new branch**.
4. Enter a **Branch name**, for example `feat/my-feature`, and click **Create Branch**.

The dashboard switches to the new branch. Every change you make from now on goes to it.

You don't always have to create a branch first. When you change test data while on main, for example when you [delete a test case](/docs/developer/delete-test-cases/), Keploy opens **Create a branch to continue** and makes the change on the branch you create there.

## Name a branch

- A name can't be empty, contain spaces, or be 100 characters or longer.
- `main` and `master` are reserved.
- Names are unique per app. A name that's taken by another branch, including a merged or closed one, is refused. Pick a new name for each change.

Using your git branch name makes it easy to match the two.

## Create a branch from the CLI

Create the branch while replaying it:

```bash
keploy cloud replay --app "<namespace>.<deployment>" --create-branch "$(git rev-parse --abbrev-ref HEAD)"
```

To replay a branch that already exists, use `--branch-name <name>`. See [Branch overlay selection](/docs/keploy-cloud/cloud-replay/#branch-overlay-selection).

## Next step

Make your changes, then [merge the branch](/docs/developer/merge-branch/).

## Related

- [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/): edit test data on a branch from your IDE, the dashboard or the CLI, and gate pull requests in CI.
