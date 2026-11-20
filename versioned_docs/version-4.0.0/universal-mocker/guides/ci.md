---
id: ci
title: Run the replay in CI
sidebar_label: CI setup
description: Replay your tests on every pull request and every push to main with no database or service running. The GitHub Actions workflow, the read-only CI key, caching the recordings, the pull request comment, what fails the job, other CI systems and re-recording. Every output is from Keploy 3.9.4.
tags:
  - mocks
  - CI
  - GitHub Actions
  - keploy.lock
keywords:
  - keploy mock replay
  - GitHub Actions
  - CI key
  - service account
  - KEPLOY_API_KEY
  - keploy mock diff
  - mock cache
  - GitLab CI
  - service virtualization
---

# Run the replay in CI

In CI, the job installs Keploy and replays your tests with no database or
service running. Every call is answered from the recordings that the commit's
`keploy.lock` pins. On a pull request, the job also comments which tests the
pull request re-records.

Every output here is from Keploy 3.9.4 on Linux. The jobs ran the workflow on
this page step by step, as a GitHub-hosted runner runs it: a fresh clone, a user
with passwordless `sudo`, no Keploy installed and every dependency switched
off. The output is trimmed: timestamps, run folders and lines that don't matter
are cut.

## What you need

- `keploy.yml` and `keploy.lock` committed, from a record with
  `KEPLOY_PROVEN=1`. The [Go quickstart](../quickstarts/go.md) and
  [keploy.yml and keploy.lock](./keploy-yml-and-lock.md) show how.
- The app's recording pin on, so every replay reads `keploy.lock`:
  [Turn on the app's recording pin](./keploy-yml-and-lock.md#turn-on-the-apps-recording-pin).
- A Linux runner where the job can use `sudo` with no password, or runs as
  root. Keploy starts its agent with `sudo`. GitHub-hosted runners allow it.
- A CI key, which an admin of your Keploy organization makes (step 1).

## Step 1: Make a CI key

The replay signs in with a read-only key of a service account. An admin of your
Keploy organization makes it:

1. In [app.keploy.io](https://app.keploy.io/settings/service-accounts), open
   **Account → Service Accounts**.
2. Create a service account with **New service account**.
3. Under **Access → Grant access**, give it the **MOCK_READER** role on the
   app.
4. Create a key under **Keys**, and copy it.

A CI key can replay, but it can't record: see
[Re-record in CI](#re-record-in-ci).

## Step 2: Save the key as a repository secret

Save the key as the repository secret `KEPLOY_API_KEY`, under the repository's
**Settings → Secrets and variables → Actions**. Or use the GitHub CLI, which
asks for the value, so it stays out of your shell history:

```bash
gh secret set KEPLOY_API_KEY
```

GitHub gives no repository secrets to a pull request from a fork, so its
replay can't sign in.

## Step 3: Add the workflow

With the [VS Code extension](../walkthroughs/vscode.md#step-9-replay-in-ci),
run **Keploy: Wire CI (GitHub Actions)**. It writes
`.github/workflows/keploy.yml` for a Go or Node project at the repository's
root that has a `keploy.lock`, and never over a file that is already there.

Without the extension, add the same file. For a Go module, it is:

```yaml
# Written by the Keploy VS Code extension. On every pull request and every
# push to main, it replays the tests on the recordings keploy.lock pins, with
# every dependency switched off (keploy.yml's mock.command runs them), and on
# a pull request it comments what the pull request's keploy.lock changes.
# It needs one repository secret, KEPLOY_API_KEY: a read-only CI key from
# https://app.keploy.io/settings/service-accounts
name: keploy
on:
  pull_request:
  push:
    branches: [main]
permissions:
  contents: read
  pull-requests: write
jobs:
  replay:
    runs-on: ubuntu-latest
    env:
      KEPLOY_API_KEY: ${{ secrets.KEPLOY_API_KEY }}
      KEPLOY_INVOKER: ci
      KEPLOY_PROVEN: "1"
    steps:
      - uses: actions/checkout@v4
        with:
          # keploy mock diff compares keploy.lock with its merge base.
          fetch-depth: 0
      - uses: actions/setup-go@v5
        with:
          go-version-file: go.mod
      - name: Install the project's dependencies (the replay downloads nothing)
        run: |
          go mod download
      - name: Install Keploy
        run: |
          keploy_rc=0; keploy_sh="$(mktemp)" && curl -fsSL https://keploy.io/ent/install.sh -o "$keploy_sh" && bash "$keploy_sh" || keploy_rc=$?; rm -f "$keploy_sh"; [ "$keploy_rc" -eq 0 ]
      - name: Check the Keploy key
        run: |
          if [ -z "$KEPLOY_API_KEY" ]; then
            echo "::error::Add a repository secret named KEPLOY_API_KEY, a read-only CI key from https://app.keploy.io/settings/service-accounts. A pull request from a fork gets no secrets."
            exit 1
          fi
      - name: Replay on the recordings keploy.lock pins
        # --lock fails the job when keploy.lock is missing, and --on-miss fail
        # fails a call the recordings do not hold instead of letting it out.
        run: |
          keploy mock replay --lock keploy.lock --on-miss fail
      - name: Comment what keploy.lock changes
        if: ${{ always() && github.event_name == 'pull_request' }}
        continue-on-error: true
        env:
          GH_TOKEN: ${{ github.token }}
          PR: ${{ github.event.pull_request.number }}
        run: |
          body="$RUNNER_TEMP/keploy-mock-diff.md"
          { echo '<!-- keploy mock diff -->'; keploy mock diff --markdown --base "origin/$GITHUB_BASE_REF"; } > "$body"
          id=$(gh api --paginate "repos/$GITHUB_REPOSITORY/issues/$PR/comments" --jq '.[] | select(.body | startswith("<!-- keploy mock diff -->")) | .id' | head -n 1)
          if [ -n "$id" ]; then
            gh api -X PATCH "repos/$GITHUB_REPOSITORY/issues/comments/$id" -F body=@"$body" > /dev/null
          else
            gh pr comment "$PR" --repo "$GITHUB_REPOSITORY" --body-file "$body"
          fi
```

The replay lets no download out, so the toolchain and the project's
dependencies are set up before it, in the folder the test command runs in (the
repository's root, or the folder its first `cd` goes to). The extension reads
the toolchain from the program the test command runs, or, for a command such as
`make test`, from that folder's files:

- **Go** (`go`, or a `go.mod`): `actions/setup-go@v5` with the `go.mod`'s
  version, then `go mod download`, as above.
- **Node** (`npm`, `npx`, `pnpm`, `yarn`, `node`, `jest` or `playwright`, or a
  `package.json` with its lockfile): `actions/setup-node@v4` with
  `node-version: lts/*`, then an install from the lockfile: `npm ci`, or pnpm's
  or Yarn's frozen install through corepack (`npm install` with no lockfile).

For any other project, such as a Python or Java one, a test command that runs
several toolchains, or one whose toolchain it can't tell, the extension writes
no workflow and says that CI setup is available on request: contact the Keploy
team at [support@keploy.io](mailto:support@keploy.io) and we'll set it up with
you. [Other CI systems](#other-ci-systems) lists what any job needs.

What each part does:

- `KEPLOY_INVOKER: ci` makes a missing key fail the job at once instead of
  waiting for a sign-in, and the key check before the replay says what to add.
- `--lock` fails the job when `keploy.lock` is missing, and `--on-miss fail`
  fails a call the recordings don't hold instead of letting it reach the
  network.
- On a pull request, the last step comments the table `keploy mock diff
--markdown` prints: the tests the pull request re-records, read from its
  `keploy.lock` against the base branch's. A later push updates that comment.
  That step needs the full history (`fetch-depth: 0`) and
  `pull-requests: write`, and a failure in it never fails the job.

Commit `.github/workflows/keploy.yml` with `keploy.yml` and `keploy.lock`, and
push.

## Step 4: Read the job

Here is a pull request that adds a test, `TestTotalInGBP`, and records it. Its
job, trimmed:

**Install Keploy** prints the version it installed (`Keploy: 3.9.4`),
Keploy's help and its next steps.

**Replay on the recordings keploy.lock pins** downloads the recordings and runs
`go test` against them:

```text
API key verified successfully!
INFO  Using branch for test suites  {"branch": "add-gbp", "appId": "docs-ci-orders"}
INFO  pulled set "orders" pinned by …/orders/keploy.lock: 3 tests, 0 cases; recordings 4 fetched, 0 cached, 0 skipped by keploy.lock and not fetched; packs 4 fetched, 0 cached  {"mock-set": "orders"}
INFO  Replaying mocks for your test command  {"mock-set": "orders", "program": "go", "args": 6, "on-miss": "fail"}
INFO  mock replay summary  {"loaded": 13, "consumed": 11, "missed": 0}
INFO  this replay ran with every dependency answered from the recording  {"mock-set": "orders", "served": 11}
keploy: orders: 3 test(s) ran: 3 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
MOCKED  .::TestTotalInGBP: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
MOCKED  .::TestTotalInGBP: [::1]:8090 (mocked: if this is your app, start it from the runner, then re-record)
MOCKED  .::TestTotalInUSD: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
MOCKED  .::TestTotalInEUR: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
VERDICT  passed
  View test report at: https://app.keploy.io/tr/<report id>?appId=<app id>
```

- Each `MOCKED` line is a destination that a test called and the recordings
  answered: here PostgreSQL on port 5432 and the rates API on port 8090. If
  one of them is your own app, start it in the job, before the test command,
  and record again.
- `VERDICT  passed` means every test that ran passed with no real dependency
  behind it. The step exits with the test command's exit code.

**Comment what keploy.lock changes** posts this comment on the pull request:

```text
<!-- keploy mock diff -->
**e2e tests** keploy.lock vs origin/main (44e7a8263360) — 0 changed, 1 added, 0 removed
| set | test | status | cases | mocks |
|---|---|---|---|---|
| . | .::TestTotalInGBP | added | +0 -0 ~0 | +3 -0 ~0 |
```

[Branches and pull requests](./branches-and-prs.md) explains the table, and
what happens when the pull request merges.

## Pushes to main

When the pull request merges, the push to main runs the same job. After a green
replay, it lists main's `keploy.lock` as Keploy main in Keploy Cloud, and names
the branches it brought into main:

```text
VERDICT  passed
keploy: listed keploy.lock of commit 50494ee09825 as Keploy main in Keploy Cloud (4 recorded, 0 removed, 0 unchanged); now in main, as main's keploy.lock holds or held each one's own recording of every test it changed: add-gbp: https://app.keploy.io/recordings?appId=<app id>&view=e2e
```

The CI key's read access is enough for this.
[Branches and pull requests](./branches-and-prs.md#4-list-main-in-keploy-cloud)
says when main isn't listed.

## Cache the recordings

The replay downloads only the recordings of the tests it runs. Each one is named
by its hash and kept in `~/.cache/keploy/mocks`. To save the downloads on the
next run, cache that folder, keyed on `keploy.lock`, with a step before the
replay:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.cache/keploy/mocks
    key: keploy-mocks-${{ hashFiles('keploy.lock') }}
    restore-keys: keploy-mocks-
```

Cache that folder itself, never a parent such as `~/.cache`. With the cache
restored, the same replay downloads nothing:

```text
INFO  pulled set "orders" pinned by …/orders/keploy.lock: 3 tests, 0 cases; recordings 0 fetched, 4 cached, 0 skipped by keploy.lock and not fetched; packs 0 fetched, 4 cached  {"mock-set": "orders"}
```

Set `KEPLOY_MOCK_CACHE_DIR` to keep the cache in another folder, and cache that
folder instead.

## What fails the job

The replay step exits with your test command's exit code, so a failing test
fails the job. These fail it too.

### No CI key

When the `KEPLOY_API_KEY` secret is missing or empty, as on a pull request from
a fork, the key check stops the job before the replay, and GitHub shows this
error on the run:

```text
Add a repository secret named KEPLOY_API_KEY, a read-only CI key from https://app.keploy.io/settings/service-accounts. A pull request from a fork gets no secrets.
```

Without that step, the replay itself stops with exit code `5`:

```text
Error: not signed in and running non-interactively: run `keploy login` first
```

Add the secret ([step 2](#step-2-save-the-key-as-a-repository-secret)).

### No keploy.lock

A job that runs before `keploy.lock` is committed, or in a folder without one,
replays nothing and exits `1`:

```text
NOT_JUDGED  keploy did not complete the run: could not pull the recordings of orders: there is no keploy.lock at …/orders/keploy.lock, which this run was told pins its recordings: nothing was replayed; the tests are not to blame
VERDICT  not judged: keploy did not complete the run: could not pull the recordings of orders: there is no keploy.lock at …/orders/keploy.lock, which this run was told pins its recordings: nothing was replayed; the tests are not to blame
Error: could not pull the recordings of orders: there is no keploy.lock at …/orders/keploy.lock, which this run was told pins its recordings: nothing was replayed
```

Record with `KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock` on your
machine, and commit `keploy.lock`. Keploy 3.9.4 also prints a `NEXT  debug:`
line here; the fix is the commit, not the debug run.

### A call the recordings don't hold

Here the pull request changes `TestTotalInEUR` to insert and price a new order,
and doesn't record it again. The new `INSERT` has no recording, so
`--on-miss fail` fails the test, and the job exits `1`:

```text
WARN  no recorded mock matched an outgoing call  {"protocol": "PostgreSQL", "call": "INSERT INTO orders VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING", "destination": "[::1]:5432", …}
keploy: orders: 3 test(s) ran: 2 passed, 1 failed (1 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
FAILED_BY_KEPLOY  .::TestTotalInEUR (failed): keploy/unmocked_call
  MISS  PostgreSQL INSERT INTO orders VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING to [::1]:5432  x1  match stopped at no_schema_candidates
        next: None of the mocks this query was matched against at this point of the run holds a recorded invocation of this SQL. Either the application issued a statement it did not issue while recording, or the recording holds it at a different point of the run (in another test, or before or between tests). If the call is intended here, re-record the mock set with 'KEPLOY_PROVEN=1 keploy mock record'.
  UNCONSUMED  mock-5: recorded for this test, never called
  UNCONSUMED  mock-6: recorded for this test, never called
VERDICT  failed: keploy held evidence against 1 test that ran: a call it could not answer or capture, or a recorded call left unmade
NEXT  re-record: KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock
NEXT  quarantine: KEPLOY_PROVEN=1 keploy mock quarantine TestTotalInEUR --reason 'keploy held evidence against it in CI' --name orders
```

When the change is intended, record the test again on your machine, with the
dependencies up, and push the new `keploy.lock`:
[Partial re-record](./partial-re-record.md) records just that test.

[Troubleshooting](../troubleshooting.md#the-tests-pass-on-your-machine-but-fail-in-ci)
covers the other ways a replay that passes on your machine fails in CI, such as
a test command that downloads packages.

## Re-record in CI

Keep CI for replays, and record on your machine. A CI key can't record: Keploy
Cloud refuses the recordings it uploads, so Keploy stops a record signed in
with one, and says so.

A job that must re-record, such as a scheduled refresh, needs the dependencies
up and an API key that a person made. Run it on a branch, not on main, and open
a pull request from it, so the new recordings are reviewed like any other
change:

```bash
git switch -c refresh-recordings
KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock
git commit -am "Refresh the recordings"
git push origin refresh-recordings
```

The record ends with what it re-recorded, and lists the new `keploy.lock` under
the branch:

```text
keploy: keploy.lock: re-recorded .::.::TestTotalInEUR, .::.::TestTotalInGBP, .::.::TestTotalInUSD (3), kept 0, start-up re-recorded; recordings 4 uploaded, 0 already on the server; packs 4 uploaded, 0 already on the server
keploy: commit keploy.lock with your change
keploy: listed keploy.lock in Keploy Cloud under branch refresh-recordings (4 recorded, 0 removed, 0 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=refresh-recordings
```

A record on main lists nothing: Keploy lists the lock of a branch that merges
into main, never main's own.

## Recordings in the repository

With `mock.local: true`, the recordings come with the checkout and there is no
`keploy.lock`. Drop `KEPLOY_API_KEY`, the key check and the comment step, and
run `keploy mock replay --local` instead.

## Other CI systems

GitLab CI and other CI systems are available on request: contact the Keploy
team at [support@keploy.io](mailto:support@keploy.io) and we'll set it up with
you. Any job needs the same steps as the workflow above:

1. A Linux runner where the job runs as root, or as a user with passwordless
   `sudo`.
2. The project's toolchain, and its dependencies downloaded, such as
   `go mod download` or `npm ci`. The replay lets no download out.
3. Keploy, from `https://keploy.io/ent/install.sh`. In a pipeline, it installs
   in `/usr/local/bin`, which takes root or passwordless `sudo`. Without them,
   the install fails:

   ```text
   sudo: a password is required
   Error: could not install the keploy binary
   ```

4. The CI key in `KEPLOY_API_KEY`, from the CI system's secrets.
5. The replay, in the project's folder:

   ```bash
   KEPLOY_INVOKER=ci KEPLOY_PROVEN=1 keploy mock replay --lock keploy.lock --on-miss fail
   ```

On GitLab CI and Woodpecker, a replay of a push to the default branch lists
main's `keploy.lock` as Keploy main, as on GitHub Actions. On any other CI
system, pass `--list-main on`:
[List main in Keploy Cloud](./branches-and-prs.md#4-list-main-in-keploy-cloud).

## Related

- [keploy.yml and keploy.lock](./keploy-yml-and-lock.md): what to commit, and
  the recording pin.
- [Branches and pull requests](./branches-and-prs.md): the pull request's
  table, merging, and Keploy main.
- [Troubleshooting](../troubleshooting.md#the-tests-pass-on-your-machine-but-fail-in-ci):
  a replay that passes on your machine but fails in CI.
- [Reference](../reference.md#exit-codes): the replay's exit codes.
