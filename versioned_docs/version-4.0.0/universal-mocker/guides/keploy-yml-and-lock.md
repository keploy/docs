---
id: keploy-yml-and-lock
title: keploy.yml and keploy.lock
sidebar_label: keploy.yml and keploy.lock
description: What keploy.yml and keploy.lock hold for the Universal Mocker, which files to commit, how keploy.lock pins your recordings, and how to publish a recording that a record kept in its staging folder.
tags:
  - mocks
  - keploy.lock
  - keploy.yml
  - mock publish
keywords:
  - keploy.lock
  - keploy.yml
  - keploy mock publish
  - mock record
  - mock replay
  - pinned mocks
  - service virtualization
---

# keploy.yml and keploy.lock

A project that uses the Universal Mocker commits two small files:

- **`keploy.yml`** says how Keploy runs your tests and where their recordings
  live.
- **`keploy.lock`** names the exact recordings that `keploy mock replay` serves,
  the way `go.sum` names the exact modules of `go.mod`.

By default the recordings themselves live in Keploy Cloud, so git holds only
these two files. Each commit replays exactly the recordings its `keploy.lock` names.

`keploy.lock` is part of Keploy's proven model: the commands on this page that
read or write it run only with `KEPLOY_PROVEN=1` set. Without it, Keploy refuses
them and names the variable to set.

## What to commit

| Where the recordings live                            | Commit                                                          | Keploy keeps out of git                                                                  |
| ---------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Keploy Cloud (the default)                           | `keploy.yml` and `keploy.lock`                                  | `.keploy-run/`, the run files of each record and replay: its own `.gitignore` holds `*`. |
| In the repository (`mock.local: true`, or `--local`) | `keploy.yml` and `keploy/`, with `keploy/.gitignore` as written | The same `.keploy-run/`, and the run files that `keploy/.gitignore` lists.               |

Commit `keploy.lock` with the change its recordings go with, as you commit
`go.sum` with `go.mod`. A pull request that re-records tests then shows, in its
diff, which tests now replay on new recordings.

## keploy.yml

`keploy.yml` sits at the root of the project. Run `keploy mock` there, or pass
`--config-path <folder>` to name the folder that holds it.

The Universal Mocker reads the keys under `mock:`. A typical project needs only
`command`, and `appId` once it records to Keploy Cloud:

```yaml
mock:
  command: go test -p 1 -count=1 -json ./...
  appId: <your app id>
```

The keys under `mock:` that most projects use:

| Key       | What it does                                                                                                                                                    |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `command` | The command that runs your tests, as CI runs it. With `KEPLOY_PROVEN=1`, `keploy mock record` and `keploy mock replay` run it when you don't pass `-c`.         |
| `appId`   | The Keploy app that holds the recordings. `keploy app create` writes it (below).                                                                                |
| `name`    | The mock set to record into and replay from, as `--name` sets it.                                                                                               |
| `local`   | `true` keeps the recordings in the repository, under `keploy/<set>/`, as `--local` does. No `keploy.lock` is read or written.                                   |
| `branch`  | The Keploy branch to read and publish when no `keploy.lock` pins the recordings. Ignored while a lock pins them.                                                |
| `onMiss`  | What replay does with a call that matches no recording: `fail` (the default), `passthrough` or `record`, as `--on-miss` sets it.                                |
| `strict`  | Fail the replay when a call missed its recording, even when the tests passed, as `--strict` does.                                                               |
| `real`    | Destinations that every run reaches for real, never recorded and never mocked, such as `localhost:5432` or `container:redis`. Read only with `KEPLOY_PROVEN=1`. |

### Save the app's id

Run this once in the project, signed in (`keploy login`) or with
`KEPLOY_API_KEY` set:

```bash
keploy app create --name <app name>
```

It creates the Keploy app, or reuses the one with that name, and saves its id
as `mock.appId` in `keploy.yml`. Without `--name`, it names the app after the
git repository.

```text
created app docs-lock-guide (<app id>)
```

`keploy.yml` then reads:

```yaml
mock:
  command: go test -p 1 -count=1 -json ./...
  appId: <app id>
appName: docs-lock-guide
```

Commit `keploy.yml` before you record: a record made from uncommitted changes
says so, because its recording matches the code only once those changes are
committed.

`--app <name>` on `keploy mock record` also creates or reuses an app, but only
for that command: it does not save the id. A later command without `--app` or
`mock.appId` looks for an app named after the repository instead.

## keploy.lock

### What it pins

For each mock set, the lock names one recording for each test and one for the
set's start-up: the calls made outside every test, such as in Go's `TestMain`. Each
recording is named by the `sha256` digest of its bytes, like an image digest,
so a recording cannot change under the lock.

This is the `keploy.lock` of a Go project with two tests, `TestTotalInUSD` and
`TestTotalInEUR`:

```text
# keploy.lock: the recordings `keploy mock replay` serves for this project, one immutable
# recording per test, named by its sha256 (like an image digest). Written by `keploy mock record`:
# commit it with your change. A `skip:` line under an entry is a test keploy does not replay,
# and why; it applies only while it names its entry's digest, so a re-record runs the test again.
# To skip a test, quarantine it (`keploy mock quarantine`); deleting its entry does not.
# Never edit a digest: replay refuses one it cannot verify.
version: 1

.::@startup:
  digest: sha256:10d66037d20bd706d718560edc3a3fd884f462bcfc6f5be81be037186434eb36  # 2026-11-20T03:07Z linux keploy 3.9.4 at 5c5e4335d81a

.::.::TestTotalInEUR:
  digest: sha256:314c6639e8682100b87dee680397237c9ed4098b0b19dc59964c7757b5b66ad4  # 2026-11-20T03:07Z linux keploy 3.9.4 at 5c5e4335d81a

.::.::TestTotalInUSD:
  digest: sha256:38f35de415d243c9c4d1f6d2687e63f8c62a2a9d6577cfdf9b0f886ca6a3fbed  # 2026-11-20T03:07Z linux keploy 3.9.4 at 5c5e4335d81a
```

Each entry names a test, and the `@startup` entry the set's start-up. The
comment after a digest says when, on which OS, with which Keploy version and at
which commit the recording was made. Keploy does not read it.

- `keploy mock replay` serves the recordings the lock names. It does not read
  the copies in the set's folder under `keploy/`.
- A `skip:` line under an entry is a test Keploy does not replay, and the
  reason. It applies only while it names its entry's digest, so a re-record
  runs the test again.
- To skip a test, quarantine it with `keploy mock quarantine`. Deleting its
  entry does not skip it.
- Never edit a digest by hand: replay refuses a recording it cannot verify.

### Where it lives

The lock sits next to the project's `keploy.yml`. Every `keploy mock` command
that reads or writes it uses that file by default, and `keploy mock record`
writes it.

To make a project's first lock, or to use a lock somewhere else, pass `--lock`.
A `--lock` path that does not exist yet is created:

```bash
KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock
```

When the record ends, its last lines say what it pinned:

```text
keploy: keploy.lock: re-recorded .::.::TestTotalInEUR, .::.::TestTotalInUSD (2), kept 0, start-up re-recorded; recordings 3 uploaded, 0 already on the server; packs 3 uploaded, 0 already on the server
keploy: commit keploy.lock with your change
keploy: keploy.lock is not listed in Keploy Cloud: the pin of app <app id> is off, so its replays read Keploy branches, which a listed one could change; `KEPLOY_PROVEN=1 keploy mock pin on` turns it on, then `KEPLOY_PROVEN=1 keploy mock register` lists the lock
keploy: committed keploy/orders and its skip lines (pinned in keploy.lock): 2 replayable, 0 quarantined
```

In this mode the recordings are in Keploy Cloud, so `git status` shows only the
new `keploy.lock`. Commit it.

Later records and replays find `keploy.lock` by themselves.

### Turn on the app's recording pin

Once `keploy.lock` is committed, turn on the app's recording pin. While it is
on, every replay of the app reads `keploy.lock`, Keploy Cloud serves a Keploy
branch's recordings only to a replay that names the branch with `--branch`, and
a Keploy too old to read `keploy.lock` fails instead of replaying a branch. A
CI key cannot turn the pin: sign in as a person.

```bash
KEPLOY_PROVEN=1 keploy mock pin on
```

```text
The pin of app <app id> is on: Keploy Cloud now serves its Keploy branches only to a replay that names one (--branch), so every other keploy mock replay of it reads the project's keploy.lock, and a keploy too old to read keploy.lock fails instead of replaying a branch.
```

Then list the lock under your git branch, for the dashboard's Recordings and
Branch reviews. While the pin is on, later records and publishes list it by
themselves:

```bash
KEPLOY_PROVEN=1 keploy mock register
```

```text
keploy: listed keploy.lock in Keploy Cloud under branch add-lock (3 recorded, 0 removed, 0 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=add-lock
```

`keploy mock pin status` shows the pin, and `keploy mock pin off` turns it off.

### Replay what the lock pins

With the dependencies off, replay reads the lock, pulls the recordings it
names, and runs the tests on them:

```bash
KEPLOY_PROVEN=1 keploy mock replay
```

```text
INFO  pulled set "orders" pinned by /work/orders/keploy.lock: 2 tests, 0 cases; recordings 3 fetched, 0 cached, 0 skipped by keploy.lock and not fetched; packs 3 fetched, 0 cached
...
keploy: orders: 2 test(s) ran: 2 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
VERDICT  passed
```

### The lock and Keploy branches

- `--lock` does not go with `--branch`: Keploy refuses the pair, because they
  name two sources of recordings.
- `--branch` alone reads the Keploy branch it names, even when there is a
  `keploy.lock`, and says that it does. In Keploy 3.9.4, a replay of a branch
  that `keploy mock register` listed leaves out the branch's start-up
  recording, so a test whose code connects to a database fails with
  `FAILED_BY_KEPLOY` on a connection-startup miss. Replay from the lock
  instead: run `KEPLOY_PROVEN=1 keploy mock replay` without `--branch`.
- While a lock pins the recordings, Keploy ignores `keploy.yml`'s `mock.branch`
  and says so.
- `--local`, or `mock.local: true`, keeps the recordings in the repository
  instead, and no lock is read or written.

What each case prints:

- Without `KEPLOY_PROVEN=1`, in a project that has a `keploy.lock`:

  ```text
  Error: /work/orders/keploy.lock pins this project's recordings, which keploy mock reads only with KEPLOY_PROVEN=1: set it, or pass --branch <name> to read a Keploy branch
  ```

- `--lock` without `KEPLOY_PROVEN=1`:

  ```text
  Error: keploy mock record --lock is part of the proven model and runs only with KEPLOY_PROVEN=1, which is not set here: run KEPLOY_PROVEN=1 keploy mock record --lock keploy.lock
  ```

- `--branch` with `--lock`:

  ```text
  Error: --branch add-lock and --lock /work/orders/keploy.lock name two sources of recordings: pass one
  ```

- `--branch` alone, in a project that has a `keploy.lock`:

  ```text
  WARN  reading the Keploy branch --branch names, not keploy.lock  {"branch": "add-lock", "lock": "/work/orders/keploy.lock"}
  ```

  In 3.9.4 that replay of the branch `keploy mock register` listed then goes
  red, because the start-up recording is missing:

  ```text
  INFO  pulled set "orders" from branch "add-lock": 2 tests, 0 cases; packs 2 fetched  {"mock-set": "orders"}
  INFO  mock replay summary  {"loaded": 6, "consumed": 0, "missed": 2}
  FAILED_BY_KEPLOY  .::TestTotalInEUR (failed): keploy/unmocked_call
    MISS  PostgreSQL connection startup to [::1]:5432  x1  match stopped at no_mocks
  ```

- `mock.branch` set while a lock pins the recordings:

  ```text
  WARN  keploy.yml's mock.branch is ignored: keploy.lock pins the recordings  {"mock.branch": "some-branch", "lock": "/work/orders/keploy.lock"}
  ```

## Publish a staged recording

A `keploy mock record` that judged its tests keeps its recording in a staging
folder under the project's `.keploy-run/staging/` when its own publish fails.
`keploy mock judge` keeps a mapping edit that it judged there too. Each prints
the line that publishes what it kept. Run that line:

```bash
KEPLOY_PROVEN=1 keploy mock publish --from .keploy-run/staging/<folder>
```

For example, a record whose `keploy.yml` had lost its `mock.appId` judged its
tests but could not publish them:

```text
keploy: keploy/orders is judged, but its recording was not published (no Keploy app: run "keploy app create" or pass --app <name>); it is kept in /work/orders/.keploy-run/staging/20261120T030817Z-2396317157, and keploy.lock is unchanged. Publish it with: KEPLOY_PROVEN=1 keploy mock publish --from /work/orders/.keploy-run/staging/20261120T030817Z-2396317157
keploy: judged keploy/orders, not published: 2 replayable, 0 quarantined
```

With `mock.appId` back in `keploy.yml`, the printed line publishes the recording
and pins it:

```bash
KEPLOY_PROVEN=1 keploy mock publish --from /work/orders/.keploy-run/staging/20261120T030817Z-2396317157
```

```text
keploy: keploy.lock: re-recorded .::.::TestTotalInEUR, .::.::TestTotalInUSD (2), kept 0, start-up re-recorded; recordings 3 uploaded, 0 already on the server; packs 3 uploaded, 0 already on the server
keploy: recorded from uncommitted changes in 1 file(s); the recording matches the code only once you commit them with keploy.lock
keploy: commit keploy.lock with your change
keploy: listed keploy.lock in Keploy Cloud under branch add-lock (3 recorded, 0 removed, 0 unchanged): https://app.keploy.io/recordings?appId=<app id>&view=e2e&branch=add-lock
```

`git diff keploy.lock` then shows a new digest on each entry, and the staging
folder is gone.

The publish uploads the recording to Keploy Cloud. In a project that a lock
pins, it pins the recording and its skip lines in the lock; otherwise it writes
the judged `verdicts.yaml` into the project. Then it removes the staging
folder.

If the record or judge was given a `--lock` other than the project's own
`keploy.lock`, the line it prints names that lock with `--lock`, and the publish
pins the recording only there:

```bash
KEPLOY_PROVEN=1 keploy mock publish --from .keploy-run/staging/<folder> --lock ci/keploy.lock
```

`--lock` goes only with `--from`. Without `--lock`, the publish pins only in the
project's own `keploy.lock`.

### When the publish refuses

`keploy mock publish --from` writes only into the project whose `.keploy-run`
holds the staging folder. It refuses, says why, and publishes nothing when:

- the folder is not a staging folder a record kept, or it is not in a Keploy
  project's `.keploy-run`: there is no `keploy.yml` that sets `mock.command` in
  the folder that holds `.keploy-run`;
- the staged recording names a keploy folder other than the one the project's
  `keploy.yml` names;
- the staged recording pins in a lock other than the project's own and `--lock`
  does not name it, or `--lock` names a lock other than the staged one;
- `.keploy-run`, the staging folder or a folder in it is a symbolic link that
  leads out of the project;
- it is a judged mapping edit whose judge left a test failing with no skip
  line, or said CI's run of the set would be red. The refusal names each test
  and what to do about it: quarantine it, make the edit its line names, or
  record it again. Then run `keploy mock judge` again and publish what it
  stages.

Two of these, as printed:

```text
Error: /work/elsewhere/.keploy-run/staging/r1 holds no recording a keploy mock record judged and did not publish (no publish.json)
Error: --lock names the keploy.lock of a staged recording: pass it with --from <dir>
```

## Related

- [Mock your tests](../mock-your-tests.md): the whole record and replay loop,
  with CI.
- [Go quickstart](../quickstarts/go.md): record and replay a Go suite end to
  end.
