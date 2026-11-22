---
id: branches-and-prs
title: Branches and pull requests
sidebar_label: Branches and pull requests
description: How Universal Mocker recordings follow git. Each commit's keploy.lock pins what its replay serves, a branch's lock is listed under a Keploy branch of the same name, a pull request shows the tests it re-records, and merging the pull request in git merges its recordings. Every output is from Keploy 3.9.4.
tags:
  - mocks
  - keploy.lock
  - branches
  - pull requests
keywords:
  - keploy branches
  - git branch
  - pull request
  - keploy mock diff
  - keploy mock register
  - list main
  - keploy.lock merge conflict
  - service virtualization
---

# Branches and pull requests

With `keploy.lock`, your recordings follow git. A replay serves exactly the
recordings that the commit's `keploy.lock` names. So each git branch carries
its own recordings, a pull request shows which tests it re-records, and merging
the pull request in git merges its recordings. There is no separate merge step
in Keploy.

| In git                    | What Keploy does                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| A commit                  | A replay of the commit serves the recordings its `keploy.lock` pins.                                                                      |
| A branch                  | A record on the branch lists its `keploy.lock` under a Keploy branch of the same name, for the dashboard's Recordings and Branch reviews. |
| A pull request            | `keploy mock diff --markdown` prints the tests the pull request re-records, for a comment on it.                                          |
| A merge                   | git merges `keploy.lock` like any other file.                                                                                             |
| A push to the main branch | A green replay of main lists main's `keploy.lock` as Keploy main, and names the branches it brings into main.                             |

Every output here is from Keploy 3.9.4 on Linux, with the recordings in Keploy
Cloud. The output is trimmed: timestamps, run folders and lines that don't
matter are cut.

## Before you begin

- Keploy reads and writes `keploy.lock` only with `KEPLOY_PROVEN=1` set. The
  commands below set it on each line.
- Sign in with `keploy login`, or set `KEPLOY_API_KEY`.
- `keploy.yml` names the app (`mock.appId`), and is committed on main. See
  [keploy.yml and keploy.lock](./keploy-yml-and-lock.md#save-the-apps-id).
- The app's recording pin is on. A person turns it on once for the app (a CI
  key can't):

  ```bash
  KEPLOY_PROVEN=1 keploy mock pin on
  ```

  ```text
  The pin of app <app id> is on: Keploy Cloud now serves its Keploy branches only to a replay that names one (--branch), so every other keploy mock replay of it reads the project's keploy.lock, and a keploy too old to read keploy.lock fails instead of replaying a branch.
  Warning: keploy.lock does not exist, so every replay of this app here fails until one is committed: make it with KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock, then commit it.
  ```

  Without the pin, a record doesn't list its lock under the branch. It prints
  the command that turns the pin on instead.

## The example

The Go project of the [partial re-record guide](./partial-re-record.md): an
`orders` package that reads an order from PostgreSQL and a rate from a rates
API on `localhost:8090`, with two tests, `TestTotalInUSD` and `TestTotalInEUR`.
Each test starts with `defer keploytest.T(t)()`, from
`github.com/keploy/go-sdk/v3/keploytest`. `keploy.yml` holds
`mock.command: go test -p 1 -count=1 -json ./...` and the app's id.

The repository is on a git host, and `origin` is its remote.

## 1. Record on a branch

Record on a branch, never on main. Main gets its recordings when a branch
merges into it.

1. Create the branch:

   ```bash
   git switch -c add-lock
   ```

2. Start PostgreSQL and the rates API, and record. The first record of a
   project makes its `keploy.lock` with `--lock`:

   ```bash
   KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock
   ```

   The record checks each test with the dependencies off, uploads the
   recordings, writes `keploy.lock`, and lists it under the branch:

   ```text
   keploy: judging round F (go test -p 1 -count=1 -json ./...): 2 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy
   keploy: judging round C (go test -p 1 -count=1 -json ./...): 2 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy
   keploy: keploy.lock: re-recorded .::.::TestTotalInEUR, .::.::TestTotalInUSD (2), kept 0, start-up re-recorded; recordings 3 uploaded, 0 already on the server; packs 3 uploaded, 0 already on the server
   keploy: commit keploy.lock with your change
   keploy: listed keploy.lock in Keploy Cloud under branch add-lock (3 recorded, 0 removed, 0 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=add-lock
   keploy: committed keploy/orders and its skip lines (pinned in keploy.lock): 2 replayable, 0 quarantined
   ```

   The link opens the branch's recordings in Keploy Cloud.

3. Commit `keploy.lock` and push the branch:

   ```bash
   git add keploy.lock
   git commit -m "Pin the tests' recordings in keploy.lock"
   git push -u origin add-lock
   ```

A record on main records and writes `keploy.lock` too, but it lists nothing.
It says why:

```text
keploy: keploy.lock is not listed in Keploy Cloud: main is the repository's default branch; keploy lists the lock of a branch that merges into it, never its own
```

## 2. Open the pull request

Open a pull request for the branch as usual. Its diff shows `keploy.lock`, so
reviewers see which tests now replay on new recordings.

`keploy mock diff` says the same thing per test. It compares the branch's
`keploy.lock` with the one at its merge base with `origin/main`. `--markdown`
prints a table for a comment on the pull request:

```bash
KEPLOY_PROVEN=1 keploy mock diff --markdown
```

```text
**e2e tests** keploy.lock vs 6588fe9b5567, the merge base with origin/main — 0 changed, 2 added, 0 removed
| set | test | status | cases | mocks |
|---|---|---|---|---|
| . | .::TestTotalInEUR | added | +0 -0 ~0 | +3 -0 ~0 |
| . | .::TestTotalInUSD | added | +0 -0 ~0 | +3 -0 ~0 |
```

The GitHub Actions workflow in
[Run the replay in CI](./ci.md) posts this table on every
pull request and updates it on each push.

To review the recordings themselves, open the branch in Keploy Cloud: see
[Find the branch to review](../walkthroughs/dashboard.md#4-find-the-branch-to-review).

## 3. Merge the pull request

Merge the pull request in git. `keploy.lock` merges with the rest of the
change, and from then on every replay of main serves the recordings it pins.

```bash
git switch main
git merge --no-ff add-lock
git push origin main
```

## 4. List main in Keploy Cloud

Keploy Cloud's main shows the `keploy.lock` of your main branch once a green
replay of main lists it.

- **In CI,** a replay of a push to the default branch lists it on its own: on
  GitHub Actions, GitLab CI and Woodpecker, `--list-main` is `auto` by default.
  The CI key needs only read access.
- **Anywhere else,** pass `--list-main on`. Keploy lists the lock only when
  `HEAD` is the tip of `origin`'s default branch, after a green replay:

  ```bash
  KEPLOY_PROVEN=1 keploy mock replay --list-main on
  ```

  ```text
  keploy: orders: 2 test(s) ran: 2 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
  VERDICT  passed
  keploy: listed keploy.lock of commit ea106ef6f0e1 as Keploy main in Keploy Cloud (3 recorded, 0 removed, 0 unchanged); now in main, as main's keploy.lock holds or held each one's own recording of every test it changed: add-lock: https://app.keploy.io/recordings?appId=<app id>&view=e2e
  ```

  The line names the branches that this lock brought into main: here,
  `add-lock`.

`KEPLOY_PROVEN=1 keploy mock register --main` lists the lock without a replay.
It takes the same checks. CI's read-scoped key, app admins and admins can run
it:

```text
keploy: listed keploy.lock of commit ea106ef6f0e1 as Keploy main in Keploy Cloud (0 recorded, 0 removed, 3 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e
```

### When main isn't listed

The listing never changes the replay's verdict. When Keploy can't list the
lock, the replay still passes or fails on its tests, and a line says why
nothing was listed:

- `HEAD` isn't the tip of `origin`'s default branch, for example with a local
  commit not pushed yet:

  ```text
  keploy: did not list keploy.lock as Keploy main in Keploy Cloud: HEAD is commit cf7bb0906f2e, not commit ea106ef6f0e1 at the tip of origin's default branch main, so this keploy.lock is not the one git main holds: list it from a checkout of that tip (git fetch origin main && git checkout --detach FETCH_HEAD), or let a green CI replay of a push to main list it
  ```

- `origin` names no default branch that has a commit:

  ```text
  keploy: did not list keploy.lock as Keploy main in Keploy Cloud: origin's HEAD names no default branch with a commit (git ls-remote --symref origin HEAD), so keploy cannot check that HEAD is its tip
  ```

  Run the `git ls-remote` command it names to see what `origin` reports, and
  check the repository's default branch on your git host.

## Work on several branches at once

Each branch records only the tests it changes. Here two branches start from
main at the same commit:

- `add-gbp` adds `TestTotalInGBP` and records it on its own:

  ```bash
  git switch -c add-gbp main
  KEPLOY_PROVEN=1 keploy mock record -c 'go test -p 1 -count=1 -json -run TestTotalInGBP ./...'
  ```

  ```text
  keploy: keploy.lock: re-recorded .::.::TestTotalInGBP (1), kept 3, start-up kept; recordings 1 uploaded, 0 already on the server; packs 1 uploaded, 0 already on the server
  keploy: commit keploy.lock with your change
  keploy: listed keploy.lock in Keploy Cloud under branch add-gbp (4 recorded, 0 removed, 0 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=add-gbp
  ```

- `price-order-3` changes `TestTotalInEUR` and re-records it on its own:

  ```bash
  git switch -c price-order-3 main
  KEPLOY_PROVEN=1 keploy mock record -c 'go test -p 1 -count=1 -json -run TestTotalInEUR ./...'
  ```

  ```text
  keploy: keploy.lock: re-recorded .::.::TestTotalInEUR (1), kept 2, start-up kept; recordings 1 uploaded, 0 already on the server; packs 1 uploaded, 0 already on the server
  keploy: commit keploy.lock with your change
  keploy: listed keploy.lock in Keploy Cloud under branch price-order-3 (3 recorded, 0 removed, 0 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=price-order-3
  ```

Each branch's `keploy mock diff --markdown` shows only its own test:

```text
**e2e tests** keploy.lock vs ea106ef6f0e1, the merge base with origin/main — 0 changed, 1 added, 0 removed
| set | test | status | cases | mocks |
|---|---|---|---|---|
| . | .::TestTotalInGBP | added | +0 -0 ~0 | +3 -0 ~0 |
```

```text
**e2e tests** keploy.lock vs ea106ef6f0e1, the merge base with origin/main — 1 changed, 0 added, 0 removed
| set | test | status | cases | mocks |
|---|---|---|---|---|
| . | .::TestTotalInEUR | changed | +0 -0 ~0 | +2 -1 ~0 |
```

[Partial re-record](./partial-re-record.md) explains recording one test on
its own.

### Replay a teammate's branch

A teammate who checks out the branch replays the recordings that branch's
`keploy.lock` pins. They need no flag and no database:

```bash
git clone <your repository> orders && cd orders
git switch add-gbp
KEPLOY_PROVEN=1 keploy mock replay
```

```text
INFO  pulled set "orders" pinned by /work/mate/orders/keploy.lock: 3 tests, 0 cases; recordings 4 fetched, 0 cached, 0 skipped by keploy.lock and not fetched; packs 4 fetched, 0 cached
keploy: orders: 3 test(s) ran: 3 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
VERDICT  passed
```

Back on main, the same command replays main's two tests, because main's
`keploy.lock` doesn't pin `TestTotalInGBP` yet:

```text
INFO  pulled set "orders" pinned by /work/mate/orders/keploy.lock: 2 tests, 0 cases; recordings 0 fetched, 3 cached, 0 skipped by keploy.lock and not fetched; packs 0 fetched, 3 cached
keploy: orders: 2 test(s) ran: 2 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
VERDICT  passed
```

### Merge both

The two branches changed different tests, so git merges `keploy.lock` with no
conflict:

```text
$ git merge --no-ff add-gbp
Merge made by the 'ort' strategy.
 gbp_test.go | 20 ++++++++++++++++++++
 keploy.lock |  3 +++
$ git merge --no-ff price-order-3
Auto-merging keploy.lock
Merge made by the 'ort' strategy.
 keploy.lock    |  2 +-
 orders_test.go | 11 ++++++++---
```

Main's `keploy.lock` now pins all three tests, each with its newest recording.
After the push, main's replay lists it and names both branches:

```text
keploy: orders: 3 test(s) ran: 3 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
VERDICT  passed
keploy: listed keploy.lock of commit 5e29c2e25a63 as Keploy main in Keploy Cloud (2 recorded, 0 removed, 2 unchanged); now in main, as main's keploy.lock holds or held each one's own recording of every test it changed: add-gbp, price-order-3: https://app.keploy.io/recordings?appId=<app id>&view=e2e
```

## When two branches re-record the same test

Every recording has its own digest, so two branches that both re-record a test
change the same line of `keploy.lock`. The second merge then conflicts:

```text
$ git merge --no-ff usd-b
Auto-merging keploy.lock
CONFLICT (content): Merge conflict in keploy.lock
Automatic merge failed; fix conflicts and then commit the result.
```

```text
.::.::TestTotalInUSD:
<<<<<<< HEAD
  digest: sha256:874ff63f7818bc324e232c6aaefcdeeb2f88006e71d4da6f7a2df711f8674869  # 2026-11-20T14:00Z linux keploy 3.9.4 at 5e29c2e25a63
=======
  digest: sha256:782b9c7be3c25037ab493e97a645116e94ea5b0cbcc99e8ee1f47f2eda86a75b  # 2026-11-20T14:00Z linux keploy 3.9.4 at 5e29c2e25a63
>>>>>>> usd-b
```

Keploy won't replay or record from a `keploy.lock` with conflict markers in
it. Both commands stop and say what to do:

```text
Error: /work/orders/keploy.lock cannot be read: it holds git conflict markers: resolve the conflict first. Keep both sides' entries of different tests; for a test both sides re-recorded, keep one, or record it again
```

To resolve it:

1. In `keploy.lock`, keep one of the two `digest:` lines, and delete the other
   line and the three marker lines. Keep both sides' entries of different
   tests.
2. Commit the merge:

   ```bash
   git add keploy.lock
   git commit --no-edit
   ```

3. Replay to check it:

   ```bash
   KEPLOY_PROVEN=1 keploy mock replay
   ```

   ```text
   keploy: orders: 3 test(s) ran: 3 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
   VERDICT  passed
   ```

To record the test again instead, resolve the conflict first, because the
record refuses the markers too. Then re-record the test with its dependencies
up, as in [Partial re-record](./partial-re-record.md), and commit
`keploy.lock`.

Never edit a digest by hand: a replay refuses one it can't verify.

## Related

- [keploy.yml and keploy.lock](./keploy-yml-and-lock.md): what the lock pins,
  the recording pin, and replaying a Keploy branch with `--branch`.
- [Partial re-record](./partial-re-record.md): record one test on its own, and
  see what a branch re-records.
- [Keploy Cloud walkthrough](../walkthroughs/dashboard.md): a branch's
  recordings, and its review.
- [Run the replay in CI](./ci.md): the GitHub Actions workflow that replays
  every pull request and comments its diff.
