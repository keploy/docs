---
id: fix-failing-tests
title: Fix failing tests
sidebar_label: Fix failing tests
description: Find out why a replayed test failed, delete obsolete test cases or add noise on a Keploy branch, then commit, review and merge the branch into main.
tags:
  - K8s
  - developer
  - test report
  - branches
keywords:
  - keploy test report
  - delete test case
  - keploy branch
  - keploy branch merge
  - keploy cloud branch-merge
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

When a replay fails, first find out why. If your app regressed, fix the code. If the test data is wrong, change it on a **Keploy branch**: every change to test data, such as deleting a test case or adding noise, is made on a branch and reaches main only after it is committed, reviewed and merged, the same way a pull request works.

## Find out why a test failed

1. Open **Reports** → **Live recording runs** → **Recordings** and click the run.
2. Open a failed test and click **View response diff** to compare **Expected** with **Actual** status, headers and body.
3. Check the mock badge on the test. A note such as _N calls matched no mock_ means your app made an outgoing call that the recording doesn't cover.

| What you see                                                 | Cause              | Fix                                                       |
| ------------------------------------------------------------ | ------------------ | --------------------------------------------------------- |
| The response really changed in a way your users would notice | Your app regressed | Fix the code and replay again. Leave the test case alone. |
| Only a timestamp, ID or token differs                        | Noise              | [Add the field as noise](#add-noise-to-a-test-case).      |
| The endpoint or behaviour changed on purpose, or was removed | Obsolete test case | [Delete the test case](#delete-a-test-case).              |

**Copy prompt and triage this run** copies a prompt for your AI coding assistant, which runs `keploy cloud triage` to diagnose the failures for you.

## Delete a test case

1. On the **Test Report**, tick the checkbox on each failed test case to remove. Only failed test cases have one.
2. In the bar that appears, click **Delete**, then confirm with **Delete recording**.
3. If you're on main, **Create a branch to continue** opens. Enter a branch name and click **Create Branch & Continue**.

Keploy makes the delete on the branch and switches you to it: _Deleted test case "…" on branch "…". Merge the branch to apply it to main._ Now [commit, review and merge](#commit-review-and-merge) the branch.

- **A whole test set:** when every test case in a set failed in this run, the set's row shows **Delete test set**. Once merged, the set's test cases, mappings and mocks are removed from main.
- **Mocks:** deleting a single test case removes only the test case. Its mocks stay.
- **Where the delete goes:** if you're already on a branch, it goes there. If the report came from a pull request that has a Keploy branch, it goes to that branch.

## Add noise to a test case

On the **Recordings** page, open the test case, then the **Noise** tab, and click **Add noise**. Like a delete, this goes to a branch. See [Noise configuration](/docs/developer/noise/) for the other places noise can be set.

## Use a branch

You usually don't create a branch yourself: **Create a branch to continue** appears whenever you change test data on main. To create one up front, open the branch picker in the header (it shows **main**), click **Create new branch**, enter a **Branch name** and click **Create Branch**.

![Branch picker with Create new branch](/img/developer/branch-picker.webp)

![Create Branch dialog](/img/developer/branch-create-dialog.webp)

- A name can't be empty, contain spaces, or be 100 characters or longer. `main` and `master` are reserved.
- Names are unique per app. A name used by another branch, including a merged or closed one, is refused.
- Using your git branch name makes the two easy to match.

The dashboard's **Replay** always runs main. To replay your branch before merging, use the CLI:

```bash
keploy cloud replay --app "<namespace>.<deployment>" --branch-name "<branch>"
```

## Commit, review and merge

1. With the branch selected in the header, click **View changes**. The **Changes** tab lists every added, edited and deleted item.
2. Click **Commit**, enter a **Commit message**, and confirm. Uncommitted changes can't be merged.
3. Click **Request reviewers** and choose who should approve.
4. The reviewer opens the same page and clicks **Approve**. A reviewer can't approve their own branch, except an Admin, who sees **Approve your own branch**.
5. When the checks show **Approved** and **No conflicts with main**, click **Merge branch to main**.

![Branch page with review and merge checks](/img/developer/branch-merge-box.webp)

You see _Merged &lt;branch&gt; to main_. Replays of main use the change from then on.

- **Committing after an approval** dismisses it, so the branch needs approving again.
- **Conflicts:** if main changed the same item, click **Rebase on main**, or **Resolve** to choose how to resolve each conflicting item on the **Changes** tab.
- **Skipping review:** an Admin can tick **Merge without the required approval.** and click **Merge to main, bypassing review**.

## Undo a change

On the branch page (**View changes**):

- **Before you commit:** click the discard icon on your uncommitted changes. This can't be undone.
- **After you commit:** click **Restore test case** (or **Restore test set**) on the item, or revert the commit.
- **Any time before merging:** click **Close Branch**. Main is unchanged.

After the merge, the change is part of main.

## Merge from CI

Run these after your pull request merges:

```bash
keploy cloud branch-commit --app "<namespace>.<deployment>" --branch "<branch>"
keploy cloud branch-merge  --app "<namespace>.<deployment>" --branch "<branch>"
```

In CI, `--branch` can be left out, because Keploy detects it from the CI environment. For a full GitHub Actions setup with the approval gate, see [Developer Workflow with Keploy Proxy](/docs/quickstart/k8s-proxy-developer-workflow/#wiring-up-your-ci-pipeline).

## Fix common problems

| Message                                                  | What to do                                                                  |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Cannot delete: this recording is used by a sandbox test. | A sandbox test still uses this recording. Stop using it there, then retry.  |
| Failed to delete test case(s) …                          | Check that you have permission to change test data on the app, then retry.  |
| The merge button stays disabled                          | Read the checks above it: commit, get approval, or resolve conflicts first. |
