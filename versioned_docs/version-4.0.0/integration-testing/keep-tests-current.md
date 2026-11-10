---
id: keep-tests-current
title: Keep tests current
description: How a Keploy test suite stays in step with your service — outdated tests leave through reviewed deletions, new behaviour arrives through recordings, and branches stay up to date with main.
keywords:
  - restore test
  - keploy branch rebase
  - outdated tests
  - test maintenance
---

A recorded suite drifts as your service changes. Keploy keeps it current without anyone editing tests by hand:

- **Outdated tests leave through review.** A pull request that changes behaviour on purpose deletes the tests that recorded the old behaviour, on its Keploy branch (see [Review test changes](/integration-testing/review-test-changes/)). When the pull request merges, the deletions merge into main.
- **New behaviour arrives through recordings.** After the change ships, record again, and the new behaviour becomes fresh tests (see [Record traffic](/integration-testing/record-traffic/)).
- **Unreliable tests fall out on their own.** A test that keeps failing auto-replay is marked as failed and left out of pull-request runs (see [Auto-replay](/integration-testing/auto-replay/)).

## Restore a deleted test

If a branch deleted a test that should have stayed, bring it back as a new commit:

```bash
keploy cloud restore-test --app shop.orders --branch feat/greet \
  --test test-set-0/get-items-by-id-2 -m "The 404 wording change was reverted"
```

- `--test` takes `<test set>/<test>`, or a deleted Test set's name. Repeat it to restore several.
- Without `--test`, the output lists everything the branch deletes, so you can pick.
- The restore is a new commit, so an earlier approval no longer covers the branch's head, and the branch asks for review again.

Restoring brings back the version main had when the branch started. Merging the branch then leaves main's copy of that test as it is.

## Bring a branch up to date with main

If main's tests changed after the pull request's branch was created, for example because another pull request merged, rebase the branch:

```bash
keploy cloud branch-rebase --app shop.orders --branch feat/greet
```

If the same test or mock changed on both sides, the rebase stops and lists the conflicts. Settle each one by keeping the branch's version or taking main's:

```bash
keploy cloud branch-rebase --app shop.orders --branch feat/greet \
  --resolve test_case:tc-9=branch --resolve mock:m-3=main
```

You can also resolve conflicts on the branch's diff page in the Console. By default, `keploy cloud replay` exits non-zero when the branch is behind main; pass `--allow-stale-branch` to only report it.

## Merge by hand

Branches normally merge when their pull request does: the next CI run on main merges them. To merge one yourself, for example when your CI has no push-to-main run, use:

```bash
keploy cloud branch-merge --app shop.orders --branch feat/greet
```

It checks that the pull request has merged first (`--force` skips that check) and needs the branch's approval. Org admins can merge without one using `--bypass-review`.

## Find a branch

```bash
keploy cloud review list --app shop.orders
```

This lists the branches waiting on your review and your own branches under review, with each one's name and ID. Every branch command accepts either.
