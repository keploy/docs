---
id: dashboard
title: "Walkthrough: your recordings and reviews in Keploy Cloud"
sidebar_label: Keploy Cloud dashboard
description: A tour of the Keploy Cloud dashboard for the Universal Mocker, from the recordings of a Keploy branch to the review of a pull request's changes and its merge into main.
tags:
  - universal mocker
  - service virtualization
  - keploy cloud
  - walkthrough
keywords:
  - keploy cloud dashboard
  - keploy branches
  - review recorded mocks
  - service virtualization review
  - pull request mocks
---

# Walkthrough: your recordings and reviews in Keploy Cloud

When you record with an account, Keploy Cloud keeps your recordings on a Keploy
branch named after your git branch. This walkthrough shows where to find them in
the dashboard, how a teammate reviews a pull request's changes, and how the
branch merges into main.

The screens are from the Keploy dashboard as of November 2026.

:::note Screenshots are on their way

The boxes marked **Screenshot coming** stand where each screenshot goes. Until
they're added, each box says what the screen shows.

:::

## Before you begin

You need:

- A Keploy account, and the CLI signed in with it (`keploy login`).
- A project you have recorded on a git branch other than main, for example
  with the [Go quickstart](../quickstarts/go.md).
- A pull request for that git branch, if you want to follow the review steps.

## 1. Open your recordings

1. Open [app.keploy.io](https://app.keploy.io) and sign in.
2. In the sidebar, under **Integration Tests**, select **Recordings**. It's open
   on every plan, Free included.
3. In the header, select your app.
4. At the top of the list, select **E2E tests**. The other tab, **Releases**,
   holds recordings made in a cluster, not by your tests.

When `keploy mock register` lists a lock, it prints a link that opens this view
with your app and branch already picked, for example
`https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=add-lock`. See
[keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md).

:::note Screenshot coming

The Recordings page with **E2E tests** selected: the app in the header, the
branch picked, and the list of test sets on the left.

:::

## 2. Pick the Keploy branch

1. Open the branch menu.
2. Type part of the branch name in **Filter branches**.
3. Select the branch with your git branch's name.

Main shows only what has merged into it. If main has no recordings yet, the
page says **No E2E tests on main yet** and lists the open branches that do have
some.

If the branch has none, the page says **No E2E tests on this branch yet**. Run
your tests under `keploy mock record` on that git branch to add them.

## 3. Read the recordings

The list holds one entry per test set. Each set holds its tests, and each test
holds its steps.

1. Open a test set.
2. Select **Start-up mocks** to see the calls your app made while it started,
   before its first test ran. They belong to the set, not to any one test.
3. Select a test to see the calls it made: each request and the answer that
   replay serves for it.
4. To show only one kind of call, such as PostgreSQL or HTTP, use **Filter
   mocks by kind**.
5. To find a test by name, use **Filter tests**.

:::note Screenshot coming

A test selected: its steps in the list, and its recorded calls on the right,
one request and its answer opened.

:::

## 4. Find the branch to review

1. In the sidebar, under **Integration Tests**, select **Branch Reviews**.
2. Find the branch. Type its name, or the pull request number, in **Branch name
   or PR #**. To see one person's branches, use **Author**.

Each row shows the branch, its status and its last update. The status is one
of:

- **Open**: no review has been asked for yet.
- **Review requested**: someone has been asked to review it.
- **Approved**: everyone asked has approved.
- **Changes requested**: a reviewer asked for changes.

If no branch is open, the page says **No open pull request branches on this
app.**

## 5. Review the changes

1. Select the branch. Its review page opens.
2. In the list of changes, open **E2E Tests**. The changes are grouped by test
   set and test.
3. Select a test. Its changes show:
   - **Requests**: how many of the test's requests were added, removed or
     changed.
   - **Added mocks**, **Removed mocks** and **Changed mocks**: the calls that
     differ from main.
   - **Moved to another request**: a call that's now made during a different
     request of the same test.
4. Select a set's **Start-up** entry to see the changes to its start-up calls.

:::note Screenshot coming

The review page of a pull request's branch: the list of changes with **E2E
Tests** opened, and one test's added and changed mocks on the right.

:::

## 6. Commit and ask for a review

A review covers committed work only.

1. If the page shows uncommitted changes, select **Commit**, and say what you
   changed and why.
2. Select **Request Review**.
3. Check the people to ask. Only app admins and org admins can review a branch,
   and you can't ask yourself.
4. Select **Send Request**.

To ask more people later, select **Add Reviewers**.

## 7. Approve or ask for changes

A reviewer opens the branch from **Branch Reviews**, then does one of these:

- Select **Approve**. On your own branch it reads **Approve your own branch**.
  An approval covers the newest commit. A later commit dismisses it and asks
  the reviewer again.
- Select **Request Changes**, say what to change, and select **Request
  Changes** again.

An org admin can approve a branch nobody was asked to review, their own
included.

:::note Screenshot coming

The review page's reviewers card: one reviewer **approved**, one **pending**,
and the **Approve** button.

:::

## 8. Merge with the pull request

The page explains how the branch merges:

> Merges with its pull request: approve it and commit its changes, and your
> pipeline's Keploy step merges it into main once the pull request's change
> reaches main. Merge it here only if CI will not.

In short:

1. Everyone asked approves, and every change is committed.
2. You merge the pull request in git.
3. When your CI pipeline runs Keploy on main, it merges the Keploy branch into
   main. You don't merge it by hand.

If your CI doesn't run Keploy, select **Merge branch to main** on the review
page instead. If main has changed under the branch, the button reads **Merge
branch (conflicts remaining)** until you resolve them.

After the merge, the branch's status is **Merged**, and its recordings show on
main in **Recordings**.

If the app's recording pin is on, main follows the `keploy.lock` of your git
main branch instead: merge the pull request in git, and a green replay of main
lists its lock as Keploy main. The
[branches and pull requests guide](../guides/branches-and-prs.md#3-merge-the-pull-request)
shows both steps and their output.

:::note Screenshot coming

The branch after its pull request merged: the **Merged** badge on the review
page, and the same tests on main in **Recordings**.

:::

## Next steps

- [keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md): what to
  commit, and how a lock pins the recordings a replay reads.
- [Partial re-record](../guides/partial-re-record.md): record one test again
  without touching the rest.
- [Mock your own tests](../mock-your-tests.md): every option, CI, and sharing
  with your team.
