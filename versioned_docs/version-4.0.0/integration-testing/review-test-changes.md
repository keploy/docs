---
id: review-test-changes
title: Review test changes
description: What to do when Keploy fails a pull request — triage the failures, fix regressions, accept intended changes on the pull request's Keploy branch, and get them approved.
keywords:
  - keploy cloud triage
  - keploy cloud accept
  - keploy review
  - pull request
  - regression
---

When `keploy cloud replay` fails a pull request, every failing test is one of two things:

- **A regression:** the change broke behaviour that should have stayed the same. Fix the code.
- **An intended change:** the response is supposed to differ now, for example a new field or a renamed status. The recorded test is outdated. Delete it on the pull request's Keploy branch and have a reviewer approve that.

The pull request's author sorts the failures. A reviewer approves the deletions. Both can do it from the CLI, from the Console, or through a coding agent.

## For the author

<Steps>

### See where the pull request stands

```bash
keploy cloud status
```

Run it from the pull request's checkout. It finds the pull request from your git branch (or pass `--pr 412 --repo acme/shop`) and shows the newest CI run, the Keploy branch, the review state and the next command to run.

### Triage the failed run

```bash
keploy cloud triage --run <run-id> --app shop.orders
```

The run ID is in the CI job's output and summary; `--pr 412` finds the run by pull request instead. Triage downloads the failed tests with their mocks into `.keploy-triage/<run>/` and sorts every failure into one of eight types. It then groups the tests that fail the same way, and gives each group an ID and a question about what changed.

### Answer each group

```bash
keploy cloud triage --run <run-id> --group <group-id> --verdict intended
keploy cloud triage --run <run-id> --group <other-group-id> --verdict regression
```

| Verdict      | Means                                                                  | What to do                                         |
| ------------ | ---------------------------------------------------------------------- | -------------------------------------------------- |
| `regression` | The change broke this                                                  | Fix the code and push. The next run replays again. |
| `intended`   | The new behaviour is correct                                           | It's accepted in the next step                     |
| `not-code`   | The failure isn't caused by the code, for example an environment issue | Nothing is deleted for it                          |

### Accept the intended changes

```bash
keploy cloud accept --run <run-id> --app shop.orders --reviewer asha@acme.io
```

`accept` deletes the tests you marked `intended` on the pull request's Keploy branch and asks the reviewer to review. Without `--reviewer`, it lists who may review.

### Wait for the review

Push, or re-run the CI job. With the outdated tests gone, the tests pass on the branch, and the CI step waits for the approval and then passes. If the reviewer asks for changes, `keploy cloud status` shows their message. Answer it, then ask again:

```bash
keploy cloud review request --app shop.orders --branch <branch> --reviewer asha@acme.io -m "Kept the deletions: the greeting change is intended"
```

</Steps>

:::note Accepting never edits a test
Keploy doesn't rewrite a recorded test to make it pass. An intended change deletes the outdated test, reviewed. The next recording, after the pull request merges, captures the new behaviour. Deleted a test by mistake? [Restore it](/integration-testing/keep-tests-current/#restore-a-deleted-test).
:::

## For the reviewer

```bash
keploy cloud review list                                        # branches waiting on you
keploy cloud review diff --app shop.orders --branch <branch>    # what the branch changes
keploy cloud review approve --app shop.orders --branch <branch> --head <seq>
```

- `review diff` writes the branch's changes against main to `.keploy-review/<branch>/` and prints the branch's head commit, so you or your coding agent can read exactly what the branch deletes or restores.
- `review approve --head <seq>` approves the head you actually saw. If the author adds a commit after that, your approval doesn't carry over, and the branch asks for review again.
- To push back instead, run `keploy cloud review request-changes --app shop.orders --branch <branch> -m "Restore the 404 test; that wording must not change"`.

An author can't approve their own branch or be named as its reviewer; only an org admin may approve their own, and that's recorded as a self-approval. An org admin can also merge without an approval (`keploy cloud branch-merge --bypass-review`), which is recorded on the branch's timeline and the pending reviewers are told.

## In the Console

The same review works in the Keploy Console:

- **Reviews** lists the branches waiting on you.
- A branch's **diff** shows each changed test with its request and response, side by side with main's.
- You can approve, request changes or restore a test from there.

## When the pull request merges

Nothing else to do. The CI run on the push to main merges the pull request's Keploy branch into main's tests (see [Run on every pull request](/integration-testing/run-in-ci/#what-the-step-does)), and the next recording captures the new behaviour.
