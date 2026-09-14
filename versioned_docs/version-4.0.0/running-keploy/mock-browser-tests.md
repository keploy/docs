---
id: mock-browser-tests
title: Mock a Browser Test Suite (Playwright)
sidebar_label: Browser Suite Mocks
description: Serve a Playwright suite its recorded backend traffic per test, so CI runs the whole suite with no backend at all and a developer can re-record one failing test without touching anyone else's recordings.
tags:
  - mocks
  - playwright
  - browser testing
  - CI/CD
keywords:
  - keploy mock playwright
  - browser test mocks
  - per-test mocks
  - mock download
  - mock upload
  - strict scope
  - partial record
---

# Mock a Browser Test Suite (Playwright)

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" />

:::caution Not in a release yet

Nothing on this page ships in a published Keploy release. `keploy mock record | replay` and the `--partial` / `--strict-scope` flags live on the open source side; `keploy mock download | upload --branch` is the Enterprise registry lane. Both are on development branches only. Treat every command here as a preview, and pin the exact build you tested against.

:::

A Playwright suite runs a real browser against a real frontend, which talks to a real backend. That backend is why the suite is slow to start, why it needs seeded data, and why it cannot run on a pull request without someone standing up a stack first.

Keploy removes it. Record each test's backend calls once, and every later run is served those recordings — per test — with **no backend process running at all**. A pull request's CI then runs the whole browser suite against recordings, and a developer who breaks one test re-records **only that test** without disturbing anyone else's.

## How this differs from mocking a service's dependencies

Keploy's other mocking page, [Mock Your Own Tests](./mock-your-tests.md), covers integration testing: you record the dependencies **your service** calls so the service stays alive while its own test cases replay. This page is a different shape, and the difference decides how strict the tooling has to be.

|                                       | Integration testing ([Mock Your Own Tests](./mock-your-tests.md)) | Browser suite (this page)                              |
| ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------ |
| What gets recorded                    | A service's outgoing dependency calls                             | A browser app's backend calls                          |
| What asserts                          | The recorded response **is** the test case                        | Your Playwright spec asserts                           |
| Role of the mocks                     | Keep the backend alive while tests run                            | The mocks **are** the product under replay             |
| One test reaching another test's mock | Harmless — a third party answered                                 | A **false pass** — the spec asserted on the wrong body |

That last row is the whole reason per-test identity exists. When the recorded response is itself the assertion, any recording that answers the request is fine. When a Playwright spec asserts on the response, test A's body is simply not a valid answer for test B — and serving it produces a green test that proves nothing.

## What identifies a recording

A recording is keyed by the test's **full title path**: the Playwright project, the spec file, every enclosing `describe`, and the test title, joined with `" > "`. That string is the owner of every mock captured while the test was running, and it is what the replay looks up.

Two consequences, both load-bearing:

- **Rename a test and its recording no longer applies.** The title path is the identity, so a renamed test is a new test with no recording. It must be re-recorded. Nothing repairs this automatically, and nothing should — a rename is indistinguishable from a new test.
- **Hook traffic gets its own owner.** Calls made in `beforeAll` / `afterAll` belong to no single test, so they are attributed to `__suite__:<spec file>` — the spec's repo-relative, POSIX-separated path. One spec file, one suite-level owner, replaceable on its own.

A test that makes **no backend calls** owns no mocks. It needs no recording, and it passes. That is correct, not a gap.

## The developer loop

Five commands. CI has already told you which test failed.

```bash
# 1. Fetch main's recordings plus anything already recorded on your branch.
keploy mock download -t <set> --branch <your-branch>

# 2. Reproduce the CI failure locally, with no backend running.
keploy mock replay --name <set> --on-miss fail -c "<your test command>"

# 3. Re-record just the failing test, against a real backend.
keploy mock record --name <set> --partial -c "<your test command> -g 'the one failing test'"

# 4. Publish only what changed, onto your branch.
keploy mock upload -t <set> --branch <your-branch>

# 5. CI re-resolves main + your branch on the next push.
git push
```

:::note The set is named by a different flag on each pair

`record` and `replay` name the mock set with `--name`. `download` and `upload` name it with `-t` / `--test-sets`, which takes a list. They address the same directory — `keploy/<set>/` under `--path` — but the flags are not interchangeable, and `-t` is not accepted by `record` or `replay`.

:::

### 1. Download

```bash
keploy mock download -t <set> --branch <your-branch>
```

The server resolves your branch **layered over `main`**, with your branch winning per test, and returns the result in one query. There is no merge step: no side script, nothing to hand-edit, nothing to commit. What lands in `keploy/<set>/` is the resolved set, one file per owner.

A branch with **no recordings of its own resolves to `main`'s set unchanged**, so a developer who has not recorded anything pays nothing for the branch flag.

Recordings that the resolved set does not contain are removed from the directory, so a stale owner file from a branch you have left cannot be served alongside the resolved set:

```
🐰 Keploy: INFO  Removed a mock file that the resolved recordings do not contain  {"path": "keploy/<set>/3f9a1c0b2d7e.yaml"}
```

### 2. Replay

```bash
keploy mock replay --name <set> --on-miss fail -c "<your test command>"
```

No backend needs to be running. `--on-miss fail` is what makes a missing recording **visible**: an outgoing call that matches nothing gets an error, the spec fails, and Keploy mirrors the runner's exit code.

Do not reach for `--on-miss passthrough` here. It sends the unmatched call to the real dependency and persists nothing, which **erases the miss** — the one signal this lane exists to produce.

### 3. Re-record one test

```bash
keploy mock record --name <set> --partial -c "<your test command> -g 'the one failing test'"
```

`--partial` is a **record-time** flag. It keeps the existing set and replaces only the tests this run actually exercised, whole. Without it, `record` replaces the **entire** set — which is the right default (a test deleted from the suite must not keep its recording forever), and the wrong thing when you are fixing one spec.

```
🐰 Keploy: INFO  partial re-record: keeping the existing set and replacing only the tests this run captures  {"mock-set": "<set>"}
```

:::note `beforeAll` re-runs every time

Playwright runs a spec's `beforeAll` on any invocation of that spec, including a single-test `-g` run. So the `__suite__:<spec file>` recording is refreshed too, not just the test you targeted.

This is desirable — the change you are chasing may be in the hook — but it is worth knowing that a one-test re-record rewrites two owners, not one.

:::

### 4. Upload

```bash
keploy mock upload -t <set> --branch <your-branch>
```

Publishes one row per owner, scoped to the branch. Only the owners whose files changed differ from what is already stored; the rest re-publish identically.

### 5. Push

CI runs `download` with the branch it is building, gets `main` layered with your branch, and replays.

## Record time vs replay time: two flags that look alike

These are easy to confuse and they do different jobs at different phases.

|                    | Phase      | What it does                                                        |
| ------------------ | ---------- | ------------------------------------------------------------------- |
| `--partial`        | **Record** | Keeps the existing set; replaces only the owners this run captured. |
| `--on-miss record` | **Replay** | Appends calls that matched nothing to the set (VCR `new_episodes`). |

`--on-miss record` is a **local development affordance**. It lets you fill a gap without a full re-record while you are iterating. It must **never publish**: the set it leaves behind contains ad-hoc captures taken during a replay, not a clean recording, and uploading it puts those in front of everyone else's CI. Re-record with `--partial` before you run `upload`.

## Reading the output

```
🐰 Keploy: INFO  mock replay summary  {"loaded": 812, "consumed": 806, "missed": 0}
```

- **`missed: 0` under `--on-miss fail` means every outgoing call found a recording.** That is the number to read.
- `loaded` is how many mocks the resolved set carried; `consumed` is how many were matched and taken.

Each miss is also reported individually, with the call that had no answer:

```
🐰 Keploy: WARN  no recorded mock matched an outgoing call  {"protocol": "http", "call": "GET /api/v1/reports/summary", "destination": "api.internal:8080", "next_step": "record this call with --on-miss record, or re-record the set"}
```

:::caution A green suite alone proves very little about mock coverage

Playwright reports pass/fail for the **spec**, not for mock coverage. A spec that skips, or that asserts on something a wrongly-matched response still satisfies, is green. Read Keploy's counters — `missed`, and the per-call warnings above — not the test result.

:::

Two honest limits on the counters:

- `missed` is capped at **512** retained miss events per session. A figure reported as exactly 512 is censored, not exact; the per-call warning lines above are the uncensored record.
- Add `--strict` to exit non-zero when any outgoing call matched nothing, even if the runner itself passed.

## Strict scoping

```bash
keploy mock replay --name <set> --on-miss fail --strict-scope -c "<your test command>"
```

By default, a test with **no recording of its own** is served the whole pool. `--strict-scope` serves it nothing instead — only mocks that no test owns stay reachable — so its first backend call misses, and under `--on-miss fail` the test goes red.

**Why it is opt-in.** Integration testing deliberately wants the lenient behaviour: there, a mock is a third party keeping the service alive, and one test's recording answering another's request is harmless and often intended. A browser suite asserting on the response cannot tolerate it. Turning the strict behaviour on by default would break the integration-testing flow that the same command serves; leaving it off by default would leave browser suites exposed. So it is a flag, and browser suites should set it.

Keploy distinguishes two cases that both narrow to nothing, because they mean opposite things:

| Situation             | What it means                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------- |
| Mapped to zero mocks  | The test **was** recorded and needed no backend calls. Expected; no action.                  |
| Absent from the table | The test was **never** recorded — new, renamed, or its recording was lost. Someone must act. |

## Wiring your Playwright suite

Keploy learns test boundaries from your runner through the scope API described in [Mock Your Own Tests — per-test scoping](./mock-your-tests.md#per-test-scoping-optional). Keploy exports its address to your test process as `KEPLOY_MOCK_AGENT`; a fixture posts to it at the start and end of each test.

For a browser suite there are two additions to that basic shape:

- **Send the full title path, not the bare title.** `testInfo.titlePath.join(' > ')`. Bare titles collide across spec files, and the recording is keyed on this string.
- **Open a second window around the spec's hooks**, named `__suite__:<repo-relative spec path>`, so `beforeAll` traffic gets its own replaceable owner instead of landing outside every window. A plain per-test fixture is set up _after_ `beforeAll` has already run, so it cannot cover hook traffic.

:::note Reference implementation

TODO(verify): a packaged Keploy fixture for Playwright is not published yet. Until it is, the fixture is something each repository writes against the scope API. The shape above is what the verified flow used.

:::

## Troubleshooting

| Symptom                                                                                                    | What it means                                                                                                                                                                         | What to do                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `no recorded mock matched an outgoing call`, test red                                                      | No recording covers this call. The test is new, the app calls something it did not before, or the set is stale.                                                                       | Re-record that test with `keploy mock record --name <set> --partial -c "… -g '<test>'"`, then `upload`.                                                |
| A test you just renamed has no recording                                                                   | The title path **is** the identity, so the rename orphaned the old recording.                                                                                                         | Re-record the test under its new name with `--partial`. The orphaned owner is dropped the next time the set is recorded in full.                       |
| `No mock recordings are registered for this test set on this branch (or on main)`                          | The resolve returned zero rows and the local files were left untouched. Usually a wrong `-t` set name, a wrong app, or nothing was ever published.                                    | Check the set name and `--app-name` against what `upload` published. A branch with no rows of its own is not the cause — that case resolves to `main`. |
| `refusing to publish a per-owner mock set through the single-blob path; re-run with --branch <git-branch>` | `upload` without `--branch` publishes one blob, `mocks.yaml`, which on a per-owner set holds only the captures no test owned. Publishing it would silently drop almost the whole set. | Re-run with `--branch <your-branch>`.                                                                                                                  |
| Suite green but you do not trust it                                                                        | A green spec says nothing about mock coverage.                                                                                                                                        | Read `missed` in the replay summary, run with `--on-miss fail`, and add `--strict-scope` so an unrecorded test cannot pass on someone else's mocks.    |
| A test passes with no recording at all                                                                     | It makes no backend calls.                                                                                                                                                            | Nothing. This is correct.                                                                                                                              |

## Flag reference

Flags added or used by this flow. `record` and `replay` also take the command, path and Docker flags documented in [Mock Your Own Tests](./mock-your-tests.md).

| Command         | Flag                    | Meaning                                                                               |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `mock record`   | `--name <set>`          | Mock set to record into (`keploy/<set>/`).                                            |
| `mock record`   | `--partial`             | Keep the existing set; replace only the tests this run exercises.                     |
| `mock replay`   | `--name <set>`          | Mock set to replay from.                                                              |
| `mock replay`   | `--on-miss fail`        | An unmatched call errors. Makes a missing recording visible.                          |
| `mock replay`   | `--on-miss record`      | Append unmatched calls to the set. Local only — never publish.                        |
| `mock replay`   | `--on-miss passthrough` | Send the call to the real dependency and persist nothing. **Erases the miss.**        |
| `mock replay`   | `--strict-scope`        | A test with no recording of its own is served nothing. Off by default.                |
| `mock replay`   | `--strict`              | Exit non-zero if any outgoing call matched nothing, even when the runner passed.      |
| `mock download` | `-t, --test-sets`       | Test set(s) to resolve.                                                               |
| `mock download` | `--branch <name>`       | Resolve this branch layered over `main`. Omit to stay on the legacy single-blob path. |
| `mock download` | `--app-name <name>`     | The Keploy app the recordings belong to. Defaults to `appName` in `keploy.yml`.       |
| `mock download` | `--overwrite`           | Overwrite a local mock file that differs from the registry version.                   |
| `mock upload`   | `-t, --test-sets`       | Test set(s) to publish.                                                               |
| `mock upload`   | `--branch <name>`       | Publish per-owner rows onto this branch.                                              |
| `mock upload`   | `--app-name <name>`     | The Keploy app to publish under.                                                      |

`--branch` can also be set in `keploy.yml` as `mockRecording.branch`.

## Next

- [Mock Your Own Tests](./mock-your-tests.md) — the full `keploy mock` reference, the scope API, and the integration-testing flow this page contrasts with.
- [Mock Quickstart](./mock-quickstart.md) — a two-minute record-and-replay walkthrough with a sample app.
