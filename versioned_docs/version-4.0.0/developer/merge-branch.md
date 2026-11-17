---
id: merge-branch
title: Merge a branch
sidebar_label: Merge a branch
description: Commit, review and merge a Keploy branch so its test-data changes, such as deleted test cases, reach main, from the dashboard or from CI.
tags:
  - K8s
  - developer
  - branches
keywords:
  - keploy branch merge
  - approve branch
  - keploy cloud branch-merge
  - keploy cloud branch-commit
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

Merging a branch applies its changes to main. Before that, you commit the changes and a reviewer approves them. Replays of main use the merged changes from then on.

## Merge from the dashboard

1. With the branch selected in the header, click **View changes**. The branch page opens on the **Conversation** tab. **Changes** shows every added, edited and deleted item.
2. **Commit:** click **Commit**, enter a **Commit message**, and confirm. The server refuses to merge changes that aren't committed.
3. **Request a review:** click **Request reviewers** and choose who should approve.
4. **Approve:** the reviewer opens the same page and clicks **Approve**.
5. **Merge:** when the checks show **Approved** and **No conflicts with main**, click **Merge branch to main**.

You see _Merged &lt;branch&gt; to main_, and the branch is marked as merged.

## Know who can approve and merge

- A reviewer must have merge permission on the app and can't be the branch's author.
- An Org Admin can approve their own branch with **Approve your own branch**.
- An Org Admin can also skip review: tick **Merge without the required approval.**, then click **Merge to main, bypassing review**.

Committing again after an approval dismisses that approval, so the branch needs approving again.

## Resolve conflicts

If main changed the same item since you branched, the merge is blocked. Click **Rebase on main** to bring in main's changes, or **Resolve** to open the conflicting items on the **Changes** tab and choose how to resolve each one. Then commit and request approval again.

## Merge from CI

Run these after your pull request merges:

```bash
keploy cloud branch-commit --app "<namespace>.<deployment>" --branch "<branch>"
keploy cloud branch-merge  --app "<namespace>.<deployment>" --branch "<branch>"
```

In CI, `--branch` can usually be left out, because Keploy detects it from the CI environment. Org Admins can add `--bypass-review` to `branch-merge`. For a full GitHub Actions setup with the approval gate, see [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/#wiring-up-your-ci-pipeline).

## Related

- [Create a branch](/docs/developer/create-branch/)
- [Delete failing test cases](/docs/developer/delete-test-cases/)
- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/): replay a branch before you merge it.
