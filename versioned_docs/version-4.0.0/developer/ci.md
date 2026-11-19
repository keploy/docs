---
id: ci
title: Replay in CI
sidebar_label: Replay in CI
description: Replay recorded tests on every pull request with keploy cloud replay. Keploy creates a Keploy branch for a pull request whose tests fail, keeps it up to date with main, waits for its review, and merges it into main after the pull request merges.
tags:
  - K8s
  - developer
  - CI
  - branches
keywords:
  - keploy cloud replay ci
  - keploy branch pull request
  - auto branch
  - approval gate
  - keploy branch conflict
  - keploy cloud branch-rebase
  - keploy cloud branch-merge
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

<div className="developer-doc" hidden />

Run `keploy cloud replay` in your CI pipeline to replay your recorded tests against every pull request. When a pull request changes your app's behavior on purpose, some tests fail as expected. Keploy then creates a Keploy branch for the pull request, where you delete or edit those tests and get the change reviewed. When the pull request merges, Keploy merges the branch into main, so main's tests match the new behavior.

## Add Keploy to your pipeline

Run the replay on pull requests and on pushes to main. For example, with GitHub Actions:

```yaml
on:
  pull_request:
  push:
    branches: [main]

jobs:
  keploy-replay:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Install Keploy
        run: source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh)"
      - name: Replay
        env:
          KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
        run: keploy cloud replay --app "<namespace>.<deployment>" --cluster "<cluster>" --image "<image>:<tag>"
```

- **API key:** create one under **Settings** → **API Keys** and store it as a CI secret. To merge pull requests' branches into main, the key needs the `branch:merge` permission on the app. A key that belongs to a CI account or a service account can create branches and replay, but it can't update a branch with main's changes, and it merges only approved branches.
- **Image:** pass the image your pipeline built with `--image`, so the replay tests the pull request's code. To replay in the cluster instead of on the CI runner, add `--trigger`; the cluster must be able to pull the image. See [Run a manual replay](/docs/developer/manual-replay/#choose-how-to-replay).
- **Full history:** check out with full history (`fetch-depth: 0` on GitHub Actions). After a pull request merges, Keploy reads the git history to find it.

Keploy recognizes pull requests and pushes on GitHub Actions, GitLab CI, CircleCI, Azure Pipelines, Bitbucket Pipelines, AWS CodeBuild, Jenkins and Woodpecker. On another CI system, set `KEPLOY_CI_PR_NUMBER`, `KEPLOY_CI_REPOSITORY`, `KEPLOY_CI_PR_SOURCE_BRANCH` and `KEPLOY_CI_PR_TARGET_BRANCH` on pull-request runs, and `KEPLOY_CI_BRANCH` on push runs.

## What happens on a pull request

1. **Keploy replays main.** The run replays main's recorded tests against the pull request's code. If they pass, the run passes.
2. **If tests fail, Keploy creates a branch.** The run creates a Keploy branch for the pull request, named after its git branch. If that name is taken, Keploy adds the pull request number, for example `feature-x-pr42`. The run then fails and prints the failed tests, the branch's name and link, and what to do next.
3. **You decide what each failure is.** If a failure is a regression, fix the code and push. If it's an intended change, delete or edit the failed tests. Deleting is recommended. See [Delete or edit a test case](/docs/developer/fix-failing-tests/#delete-or-edit-a-test-case).

   - **To delete:** open the run's **Test Report** and delete the failed tests there. The deletions go straight to the pull request's branch.
   - **To edit:** on **Recordings**, select the pull request's branch in the branch picker and edit the tests there.

   Then, on the branch's page, commit the changes and request a review.

![A failed test selected for delete in the Test Report](/img/developer/report-delete-selected.webp)

4. **The next run replays the branch.** Until you commit, each run replays main again. Once the branch has committed changes, each run first updates the branch with main's latest changes, then replays it: the tests you deleted don't run, and the tests you edited run with your changes. If main changed the same tests meanwhile, see [When main changes before your pull request merges](#when-main-changes-before-your-pull-request-merges).
5. **The run waits for the review.** When the tests pass but the branch's changes aren't approved yet, the run keeps waiting, and the pull request shows the check as pending. The run passes as soon as a reviewer approves the branch. It fails if a reviewer requests changes, if the branch is closed, or if no one approves it within 30 minutes; after an approval, re-run the pipeline.

![Branch page with review, conflict and commit checks](/img/developer/branch-demo-conversation.webp)

To work through failures from a terminal instead of the dashboard, run the `keploy cloud triage` command that the failed run prints. It explains the failures one group at a time. Then `keploy cloud accept` deletes the tests you marked as intended on the pull request's branch, commits the deletion and, with `--reviewer`, requests a review.

## When main changes before your pull request merges

While your pull request is open, other pull requests can change main's tests: their Keploy branches merge into main when those pull requests merge. Before each run replays your pull request's branch, Keploy updates the branch with main's latest changes, much like rebasing a git branch, so the run replays your changes on top of main's.

For each test case, the result depends on what the branch and main did to it since the branch was last updated:

| Your branch      | Main                                | Result                                                                                          |
| ---------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| Didn't change it | Edited or deleted it                | The branch picks up main's version.                                                             |
| Deleted it       | Edited it                           | Your deletion is kept.                                                                          |
| Deleted it       | Deleted it                          | It stays deleted.                                                                               |
| Edited it        | Deleted it, or deleted its test set | It stays deleted. The run says that your edit no longer applies.                                |
| Edited it        | Edited it                           | Conflict. The run fails and names the test case. See [Resolve a conflict](#resolve-a-conflict). |

Two edits of the same test case conflict even when they change different parts of it, such as the response body on one side and noise on the other.

When Keploy settles a test case for you (the second to fourth rows), it commits the result to the branch with the message "Keploy: bring the branch up to date with main". The branch then needs approval again, and the run says so.

The update needs a user's API key. With a CI account's or a service account's key, Keploy doesn't update the branch: the run replays it as it is, and a conflict shows up only when the branch merges into main.

### Example: two pull requests change the same test

Pull requests 1 and 2 both change the response of `GET /orders`. Their Keploy branches, `feature-a` and `feature-b`, both edited the test case `get-orders-1`, and both branches are approved. Pull request 2 merges first:

1. The next run that targets main, such as the push of pull request 2's merge, merges `feature-b` into main. Main's `get-orders-1` is now pull request 2's version.
2. On pull request 1's next run, Keploy updates `feature-a` with main. Both branches edited `get-orders-1`, so the run fails with a conflict.
3. You choose a version as in [Resolve a conflict](#resolve-a-conflict), commit it, and get `feature-a` approved again. The next run replays `feature-a` on top of main.

If the branches changed `get-orders-1` in other ways, pull request 1's run goes differently:

- **`feature-a` deleted `get-orders-1`:** the deletion is kept and committed. Nothing fails, and the branch needs approval again.
- **`feature-b` deleted `get-orders-1` and `feature-a` edited it:** the test case stays deleted, and the run says that the edit on `feature-a` no longer applies.
- **`feature-a` didn't change `get-orders-1`:** `feature-a` picks up pull request 2's version. Nothing fails, and the approval stands.

### Resolve a conflict

When both sides edited a test case, choose which version the branch keeps. You can do it on the branch's page or from a terminal. Either way, the branch changes, so it needs approval again.

**On the branch's page:**

1. On **Recordings**, select the pull request's branch in the branch picker and edit the test case so that it holds the version the branch should keep. To keep both changes, add the other pull request's change to yours. To see what main changed, open the conflict on the branch's **Changes** tab, which shows main's version beside the branch's.
2. Click **View changes**, then **Review it** on the banner about your uncommitted change. Your edit shows as a conflict. Choose **Keep my changes** to put your edit on top of main's latest version, or **Discard my changes** to throw your edit away and take main's version. The choice applies at once and can't be undone.

![An uncommitted edit that conflicts with main, with Keep my changes and Discard my changes](/img/developer/branch-conflict-uncommitted.webp)

3. Click **Commit**.

Don't use the **Keep main's version** and **Use branch's version** choices on the **Changes** tab for this. They apply only when the branch merges into main. The run's update of the branch ignores them, so the run keeps failing.

**From a terminal:**

1. List the conflicts:

   ```bash
   keploy cloud branch-rebase --app "<namespace>.<deployment>" --branch "<branch>"
   ```

   It names each conflict with its ID, such as `test_case:<id>`, and prints the commands that settle them.

2. Run the command again with a `--resolve` for each conflict. `=branch` keeps the branch's version, and `=main` takes main's:

   ```bash
   keploy cloud branch-rebase --app "<namespace>.<deployment>" --branch "<branch>" --resolve test_case:<id>=branch
   ```

   Keeping the branch's version replaces main's version of the test case, including the other pull request's change to it. To keep both changes, take main's version, then edit the test case again on the branch.

3. Commit the result on the branch's page, or with `keploy cloud branch-commit --app "<namespace>.<deployment>" --branch "<branch>"`.

Then request a review. Once the branch is approved, re-run the pipeline.

## After the pull request merges

The next pipeline run that targets main, such as the push that merges the pull request, finds the merged pull request in the git history and merges its Keploy branch into main. From then on, main's tests include the branch's deletes and edits.

- If main changed one of the branch's test cases after the branch's last update, for example because another pull request merged in between, the merge settles it by the same rules as an update, with one difference: when both sides edited the test case, no one is there to choose, so main's version is kept and the run logs that the branch's edit was dropped. A deletion on the branch is still kept.
- To decide a conflict yourself, choose a version for it on the branch's **Changes** tab before the merge. The merge uses the choices made there first, and settles only the remaining conflicts by these rules.
- If the branch can't merge, for example because it isn't approved, has uncommitted changes or conflicts with main, the run doesn't fail. It logs why and what to do, and the next run on main tries again.
- With a CI account's or a service account's key, Keploy doesn't settle conflicts, so a branch that conflicts with main waits for a person. Choose a version for each conflict on the branch's **Changes** tab. The choices don't change the branch, so its approval stands, and the next run on main merges the branch with them.
- Branches older than 30 days are no longer checked. Merge such a branch by hand, from a checkout of the repository:

  ```bash
  keploy cloud branch-merge --app "<namespace>.<deployment>" --branch "<branch>"
  ```

  It merges a pull request's branch only once the checkout shows that the pull request merged. `--force` skips that check.

- With an Admin's key, these merges bypass review, and the server records each bypass. Use a non-admin key with `branch:merge` to keep reviews required.

## Pipeline options

| Option                                                  | Default | What it does                                                                                                                  |
| ------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `--no-auto-branch`, or `KEPLOY_AUTO_BRANCH=false`       | Off     | Always replays main on pull requests and never creates a branch.                                                              |
| `--no-branch-catchup`                                   | Off     | Skips merging merged pull requests' branches into main.                                                                       |
| `--require-approval`, or `KEPLOY_REQUIRE_APPROVAL=true` | Off     | Fails at once, instead of waiting, when the tests pass but the branch isn't approved.                                         |
| `--approval-timeout`, or `KEPLOY_APPROVAL_TIMEOUT`      | `30m`   | How long a run waits for the approval.                                                                                        |
| `--base-branch`                                         | `main`  | The git branch that Keploy's main follows.                                                                                    |
| `--branch-name <name>` or `--create-branch <name>`      | None    | Replays the named branch, or creates it. Keploy doesn't choose a branch then, and an unapproved branch fails the run at once. |

## Related

- [Fix failing tests](/docs/developer/fix-failing-tests/): delete test cases, then commit, review and merge a branch.
- [Edit test cases and mocks](/docs/developer/edit-test-data/): change a test case's expected response, its noise or its mocks on a branch.
- [Run a manual replay](/docs/developer/manual-replay/): the three ways to run `keploy cloud replay`.
- [Cloud Replay Command Reference](/docs/keploy-cloud/cloud-replay/): every flag of `keploy cloud replay`.
