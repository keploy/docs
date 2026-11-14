---
id: keploy-lock
title: Pin Your Mocks with keploy.lock
sidebar_label: keploy.lock and Mock Publish
description: Pin the recordings keploy mock replay serves in a keploy.lock file that you commit with your change, and publish a staged recording into it with keploy mock publish --from.
tags:
  - mocks
  - keploy.lock
  - mock publish
keywords:
  - keploy.lock
  - keploy mock publish
  - mock record
  - mock replay
  - pinned mocks
---

# Pin Your Mocks with keploy.lock

`keploy.lock` pins the recordings that
[`keploy mock replay`](./mock-your-tests.md) serves for a project, the way
`go.sum` pins the modules of `go.mod`. You commit it with the change that its
recordings go with, so every commit replays exactly the recordings it names.

`keploy.lock`, `--lock` and `keploy mock publish --from` are part of Keploy's
proven model: set `KEPLOY_PROVEN=1` to use them. Without it, Keploy refuses
them and names the variable to set.

## What keploy.lock pins

For each Test-Set, the lock names one recording for each Test-Case and one for
the Test-Set's start-up. Each recording is named by the `sha256` digest of its
bytes, like an image digest, so a recording cannot change under the lock.

- `keploy mock replay` serves the recordings that the lock names. It does not
  read the copies in the Test-Set's folder under `keploy/`.
- A `skip:` line under an entry is a Test-Case that Keploy does not replay, and
  the reason. It applies only while it names its entry's digest, so a
  re-record runs the Test-Case again. To skip a Test-Case, quarantine it with
  `keploy mock quarantine`. Deleting its entry does not skip it.
- Never edit a digest by hand: replay refuses a recording that it cannot
  verify.

## Where keploy.lock lives

The lock sits next to the project's `keploy.yml`, and every `keploy mock`
command that reads or writes it uses that file by default. `keploy mock record`
writes it.

To make a project's first lock, or to use a lock somewhere else, pass `--lock`:

```bash
KEPLOY_PROVEN=1 keploy mock record -c "go test ./..." --lock keploy.lock
```

A `--lock` path that does not exist yet is created. `--lock` does not go with
`--branch`: `--branch` uses the recordings of the Keploy branch that it names,
even when there is a `keploy.lock`. While a lock pins the recordings, Keploy
ignores `keploy.yml`'s `mock.branch` and says so.

## Publish a staged recording

A judged `keploy mock record` keeps its recording in a staging folder under the
project's `.keploy-run/staging/` when its own publish fails, and
`keploy mock judge` keeps a mapping edit that it judged there. Each prints the
line that publishes what it kept. Run that line:

```bash
KEPLOY_PROVEN=1 keploy mock publish --from .keploy-run/staging/<folder>
```

The publish uploads the recording to Keploy Cloud. In a project that a lock
pins, it pins the recording and its skip lines in the lock; otherwise it writes
the judged `verdicts.yaml` into the project. It then removes the staging
folder.

If the record or judge was given a `--lock` other than the project's own
`keploy.lock`, the line it prints names that lock with `--lock`, and the
publish pins the recording only there:

```bash
KEPLOY_PROVEN=1 keploy mock publish --from .keploy-run/staging/<folder> --lock ci/keploy.lock
```

`--lock` goes only with `--from`. Without `--lock`, the publish pins only in the
project's own `keploy.lock`.

### The project that a staged recording publishes into

`keploy mock publish --from` writes only into the project whose `.keploy-run`
holds the staging folder. It refuses, says why, and publishes nothing when:

- the folder is not in a keploy project's `.keploy-run`: there is no
  `keploy.yml` that sets `mock.command` in the folder that holds `.keploy-run`;
- the staged recording names a keploy folder other than the one that the
  project's `keploy.yml` names;
- the staged recording pins in a lock other than the project's own and
  `--lock` does not name it, or `--lock` names a lock other than the staged
  one;
- `.keploy-run`, the staging folder or a folder in it is a symbolic link that
  leads out of the project.
