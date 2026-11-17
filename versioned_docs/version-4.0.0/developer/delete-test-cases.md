---
id: delete-test-cases
title: Delete failing test cases
sidebar_label: Delete test cases
description: Remove a failing or obsolete test case from a Test Report. The delete is made on a Keploy branch and reaches main when the branch is merged.
tags:
  - K8s
  - developer
  - test report
  - branches
keywords:
  - delete test case
  - delete test set
  - keploy test report
  - keploy branch
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

When a replay fails because the test case itself is wrong or obsolete, rather than because your app regressed, delete it from the **Test Report**. The delete never goes straight to main. It is made on a Keploy branch and reaches main only when that branch is [merged](/docs/developer/merge-branch/).

:::tip
Delete a test case only when you're sure the failure is not a real regression. See [Read the Test Report](/docs/developer/manual-replay/#read-the-test-report).
:::

## Delete test cases

1. Open **Reports** → **Live recording runs** and click the run.
2. Tick the checkbox on each failed test case you want to remove. Only failed test cases have a checkbox.
3. In the bar that appears, click **Delete**, then confirm with **Delete recording**.
4. If you're on main, the **Create a branch to continue** dialog opens. Enter a branch name and click **Create Branch & Continue**. Keploy makes the delete on the new branch and switches you to it.

You see: _Deleted test case "…" on branch "…". Merge the branch to apply it to main._

If you're already on a branch, the delete goes to that branch. If the report came from a pull request that already has a Keploy branch, the delete goes to that branch.

## Delete a whole test set

When every test case in a test set failed in this run, the set's row shows a trash icon, **Delete test set**. It works the same way, on a branch. Once merged, the set's test cases, mappings and mocks are removed from main.

Deleting a single test case removes only the test case. Its mocks stay.

## Undo a delete

Open the branch with **View changes** in the header, then:

- **Before you commit:** click the discard icon on your uncommitted changes. This can't be undone.
- **After you commit:** click **Restore test case** (or **Restore test set**) on the deleted item, or revert the commit. Either adds a new commit and dismisses existing approvals.
- **Any time before merging:** click **Close Branch**. Main is unchanged.

After the branch is merged, the delete is part of main.

## Fix common problems

| Message                                                  | What to do                                                                 |
| -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Cannot delete: this recording is used by a sandbox test. | A sandbox test still uses this recording. Stop using it there, then retry. |
| Failed to delete test case(s) …                          | Check you have branch write permission on the app, then retry.             |

## Next step

[Merge the branch](/docs/developer/merge-branch/) so the delete reaches main.
