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
- A CI key (step 1).

## Step 1: Make a CI key

The replay signs in with the key of a service account that holds only the
**MOCK_READER** role: it reads the app's recordings and uploads the replay
report, and does nothing else. In the project's folder, run:

```bash
keploy service-account key create --role MOCK_READER --to-gh-secret KEPLOY_API_KEY
```

It shows a link and a code, and opens the browser. The page names the key, the
app and the role, and asks you to sign in to Keploy again before you approve.
Only an admin of the app's company can approve it: anyone else's approval ends
the request, so ask an admin to run the command, or to approve a new one.
Keploy then makes the key and sets it as the repository secret
`KEPLOY_API_KEY` through the GitHub CLI (`gh`), which must be signed in with
the right to set it. The key is never printed. It is for the app that
`keploy.yml`'s `mock.appId` names; `--app <app id>` names another. The Keploy
server refuses a role you may not grant.

A coding agent runs the command with `--no-wait --json`, gives you the link and
the code it prints, then runs
`keploy service-account key create --finish --json`.

With a Keploy that has no `service-account` command, an admin of your Keploy
organization makes the key in the dashboard, and you save it in step 2:

1. In [app.keploy.io](https://app.keploy.io/settings/service-accounts), open
   **Account → Service Accounts**.
2. Create a service account with **New service account**.
3. Under **Access → Grant access**, give it the **MOCK_READER** role on the
   app.
4. Create a key under **Keys**, and copy it.

A CI key can replay, but it can't record: see
[Re-record in CI](#re-record-in-ci).

## Step 2: Save the key as a repository secret

`--to-gh-secret` in step 1 already did this. For a key made in the dashboard,
save it as the repository secret `KEPLOY_API_KEY`, under the repository's
**Settings → Secrets and variables → Actions**. Or use the GitHub CLI, which
asks for the value, so it stays out of your shell history:

```bash
gh secret set KEPLOY_API_KEY
```

GitHub gives no repository secrets to a pull request from a fork, so its
replay can't sign in.

## Step 3: Add the workflow

With the [VS Code extension](../walkthroughs/vscode.md#step-9-replay-in-ci),
run **Keploy: Wire CI**. It writes
`.github/workflows/keploy.yml` for a Go or Node project that has a
`keploy.lock`, and never over a file that is already there. For a project in a
folder below the repository's root, the workflow's steps run in that folder.
For any other project, such as Python or Java, the extension shows the steps
of [Other CI systems](#other-ci-systems) instead.

Without the extension, add the file yourself. For a Go module at the
repository's root, it is:

```yaml
# Written by the Keploy VS Code extension. On every pull request and every
# push to main, it replays the tests on the recordings keploy.lock pins, with
# every dependency switched off (keploy.yml's mock.command runs them), and on
# a pull request it comments what the pull request's keploy.lock changes.
# It needs one repository secret, KEPLOY_API_KEY: a key with only MOCK_READER,
# which keploy service-account key create --role MOCK_READER --to-gh-secret KEPLOY_API_KEY
# makes and stores (or an admin, in Settings > Service accounts:
# https://app.keploy.io/settings/service-accounts).
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
            echo "::error::Add a repository secret named KEPLOY_API_KEY, a key with only MOCK_READER: run keploy service-account key create --role MOCK_READER --to-gh-secret KEPLOY_API_KEY in the project's folder, or make it in Settings > Service accounts (https://app.keploy.io/settings/service-accounts). A pull request from a fork gets no secrets."
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
several toolchains, or one whose toolchain it can't tell, and for every CI
other than GitHub Actions, the extension writes no workflow and instead offers
the recipe `keploy mock ci` prints for the project (the steps in
[Other CI systems](#other-ci-systems)): you can hand CI setup to your coding
agent or view and copy the steps directly. If you get stuck, write to
[support@keploy.io](mailto:support@keploy.io).

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
Cloud refuses the recordings that a key without write access uploads.

With `KEPLOY_PROVEN=1`, as this guide sets it, Keploy 3.9.4 stops a record
before it starts when the key's role is `CI`. It doesn't stop a record signed
in with a service-account key, like the one [step 1](#step-1-make-a-ci-key)
makes, or a record without `KEPLOY_PROVEN=1`. Such a record runs your tests
against the real dependencies, and then Keploy Cloud refuses its recordings
at the upload: see
[A CI key can't record](../troubleshooting.md#a-ci-key-cant-record).

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

For GitLab CI, Jenkins and any other CI, and for a project the VS Code
extension writes no workflow for, such as Python or Java, Keploy prints the
recipe for your project. In the project's folder, run:

```bash
keploy mock ci
```

It names the CI the repository runs (from its CI config, or else its `origin`
remote), the project's folder and its test command (`keploy.yml`'s
`mock.command`), and prints that CI's example: GitHub Actions, GitLab CI,
Jenkins, or shell lines for any other CI. `--ci gitlab` (or `github`,
`jenkins`, `other`) prints another CI's example instead, and `--json` prints
the same for an editor or a coding agent. It writes nothing. In the VS Code
extension, **Wire CI** offers the same recipe: **Show me the steps** opens it
with a copy button, and **Hand CI setup to** your coding agent gives it to the
agent.

Every job takes the same steps:

1. **Check out** the repository, with `keploy.yml` and `keploy.lock`
   committed.
2. **Set up the project's toolchain and install every dependency the tests
   need, before the replay.** The replay lets nothing out: a package the test
   run fetches during it (a Go module, an npm package, a pip wheel, a Maven
   plugin) is a call the recordings do not hold, and fails the job. Use the
   project's own install, for example:
   - Go: `go mod download`
   - Node: `npm ci` (`pnpm install --frozen-lockfile`, `yarn install --immutable`); with Playwright, `npx playwright install --with-deps`
   - Python: `pip install -r requirements.txt` (`pip install -e ".[test]"`, `poetry install`, `uv sync --frozen`)
   - Java with Maven: `mvn -B -ntp test -Dtest=NoSuchTest -Dsurefire.failIfNoSpecifiedTests=false`: it compiles the tests and fetches the test runner's provider (which `mvn dependency:go-offline` leaves out), and runs no test
3. **Install Keploy.** `keploy mock ci` pins the install line to the release
   you run, and the job sets `KEPLOY_DISABLE_AUTO_UPDATE=1`: without it Keploy
   brings itself to the latest release when a command starts. The job runs on
   Linux as root or with passwordless `sudo`: Keploy starts its eBPF agent with
   `sudo` unless the job runs as root. A job that runs in a container needs a
   privileged one. Without root or passwordless `sudo`, the install fails:

   ```text
   sudo: a password is required
   Error: could not install the keploy binary
   ```

4. **Add the key**, as a CI secret named `KEPLOY_API_KEY`: a key with only
   MOCK_READER. In the project's folder, run:

   ```bash
   keploy service-account key create --role MOCK_READER --to-file ~/keploy-ci.key
   ```

   Put the file's contents in the CI's secrets as `KEPLOY_API_KEY`, then
   delete the file. Keploy asks you to sign in again in the browser, as in
   [step 1](#step-1-make-a-ci-key), and only an admin of the app's company can
   approve the key. Give the key to the job as the
   `KEPLOY_API_KEY` environment variable. Never print it or commit it. A pull
   request from a fork gets no secrets on most CIs, so its job fails at the
   key.

5. **Replay**, in the project's folder:

   ```bash
   KEPLOY_PROVEN=1 KEPLOY_INVOKER=ci keploy mock replay --lock keploy.lock --on-miss fail
   ```

   It runs `keploy.yml`'s `mock.command` with the recorded answers. `--lock`
   fails the job when `keploy.lock` is missing, and `--on-miss fail` fails a
   call the recordings don't hold instead of letting it out.
   `KEPLOY_INVOKER=ci` makes a missing key fail at once instead of waiting for
   a browser sign-in. Never drop `--on-miss fail` or add `--local` to this
   step.

The examples below are what `keploy mock ci --ci <ci>` prints for a project at
the repository's root, made with a development build of Keploy, so their
install line installs the latest release. A release's own `keploy mock ci`
pins its version there (`bash "$keploy_sh" -v vX.Y.Z`): use the line your
Keploy prints. Put the project's toolchain setup and dependency
install where the comment says. For a project in a folder below the root,
the example also runs the replay in that folder. Keep that folder in the step
(`working-directory`, `cd`, or `--lock <folder>/keploy.lock`): `keploy mock status`
counts a step at the root toward a project below it only when the step names
that project (by its folder, or by a unique `--name <its recording>`). A step
that names no project counts only for a `keploy.yml` at the repository's root.

### GitLab CI

`.gitlab-ci.yml`; the key is a CI/CD variable (Settings > CI/CD > Variables),
masked and not protected: a protected variable reaches only protected
branches, so a merge request's pipeline would run without it. A self-managed
runner runs the job privileged only with `privileged = true` in its
config.toml.

```yaml
keploy-replay:
  image: ubuntu:24.04 # or the image your tests already run in
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
  variables:
    KEPLOY_INVOKER: ci
    KEPLOY_PROVEN: "1"
    KEPLOY_DISABLE_AUTO_UPDATE: "1"
  script:
    - apt-get update && apt-get install -y --no-install-recommends curl ca-certificates
    # Step 2: set up the project's toolchain and install its dependencies here.
    - |
      keploy_rc=0; keploy_sh="$(mktemp)" && curl -fsSL https://keploy.io/ent/install.sh -o "$keploy_sh" && bash "$keploy_sh" || keploy_rc=$?; rm -f "$keploy_sh"; case "$(uname -s)" in Darwin) PATH="$HOME/.keploy/bin:$PATH"; export PATH ;; esac; [ "$keploy_rc" -eq 0 ]
    - keploy mock replay --lock keploy.lock --on-miss fail
```

### Jenkins

`Jenkinsfile`; the key is a Secret text credential, here with the id
`keploy-api-key`. The agent is a Linux machine where the job is root or has
passwordless sudo.

```groovy
pipeline {
  agent any
  environment {
    KEPLOY_API_KEY = credentials('keploy-api-key')
    KEPLOY_INVOKER = 'ci'
    KEPLOY_PROVEN = '1'
    KEPLOY_DISABLE_AUTO_UPDATE = '1'
  }
  stages {
    stage('Keploy replay') {
      steps {
        // Step 2: set up the project's toolchain and install its dependencies here.
        sh '''
          keploy_rc=0; keploy_sh="$(mktemp)" && curl -fsSL https://keploy.io/ent/install.sh -o "$keploy_sh" && bash "$keploy_sh" || keploy_rc=$?; rm -f "$keploy_sh"; case "$(uname -s)" in Darwin) PATH="$HOME/.keploy/bin:$PATH"; export PATH ;; esac; [ "$keploy_rc" -eq 0 ]
        '''
        dir('.') {
          sh 'keploy mock replay --lock keploy.lock --on-miss fail'
        }
      }
    }
  }
}
```

### Any other CI: the steps as shell lines

Run them on every pull request and every push to the main branch, with
`KEPLOY_API_KEY` from the CI's secrets in the environment:

```sh
export KEPLOY_INVOKER=ci KEPLOY_PROVEN=1 KEPLOY_DISABLE_AUTO_UPDATE=1
# Step 2: set up the project's toolchain and install its dependencies here.
keploy_rc=0; keploy_sh="$(mktemp)" && curl -fsSL https://keploy.io/ent/install.sh -o "$keploy_sh" && bash "$keploy_sh" || keploy_rc=$?; rm -f "$keploy_sh"; case "$(uname -s)" in Darwin) PATH="$HOME/.keploy/bin:$PATH"; export PATH ;; esac; [ "$keploy_rc" -eq 0 ]
keploy mock replay --lock keploy.lock --on-miss fail
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
