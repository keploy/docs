---
id: verdicts-yaml
title: verdicts.yaml reference
sidebar_label: verdicts.yaml reference
description: What keploy/<test-set>/verdicts.yaml holds, when an entry skips a test, and what to do for each quarantine class and reason.
tags:
  - replay
  - ci
  - verdicts
  - reference
keywords:
  - verdicts.yaml
  - KEPLOY_PROVEN
  - quarantined tests
  - keploy quarantine
  - keploy test --judge
  - unmocked_call
  - capture_incomplete
  - unstable_order
---

Under `KEPLOY_PROVEN=1`, each test set can have a `keploy/<test-set>/verdicts.yaml`: the tests of that set that `keploy test` doesn't replay, and why. It's a deny list. Every test the file doesn't name runs as usual. You commit it with the test set, and your CI's `keploy test` reads it. To learn how the file gets written, see [Record, judge and replay tests in CI](/docs/running-keploy/proven-flow/).

These commands write it:

- `keploy record` adds an entry for each test it recorded that its auto-replay couldn't replay.
- `keploy mock record`, which records against your real infrastructure, does the same for the tests it records, and is the only one that writes `app-infra/failed_in_record`.
- `keploy quarantine` adds an entry you write by hand, with your reason.
- `keploy test --judge` only removes: it drops the entries of tests that now pass, and prints a `keploy quarantine` command for each test that fails.

`keploy test` without `KEPLOY_PROVEN=1` ignores the file, says so in a warning, and runs every test.

## Example

<!-- prettier-ignore -->
```yaml
# keploy verdicts: the tests of this set that keploy does not replay, and why.
# Every test not listed here runs as usual. An entry applies only while the test's
# recording is one that `rec` names; after any other change the test runs again.
version: 1
quarantined:
  get-orders-3:
    class: manual
    reason: fails since the orders API change in PR 812 until it is re-recorded
    rec: [sha256:7c01d2e911111111111111111111111111111111111111111111111111111111]
    since: 2026-10-20
    by: quarantine
    keploy: 3.8.80
  post-learn-batch-1:
    class: flaky
    reason: unstable_order
    rec: [sha256:41aa0c3e00000000000000000000000000000000000000000000000000000000]
    since: 2026-10-20
    by: record
    keploy: 3.8.80
    rounds: {full: failed, confirm: skipped}
    calls:
      - {protocol: HTTP, call: POST /batch, destination: localhost:8096, phase: no_match}
```

## When an entry skips a test {#rules}

- **An entry applies only to the recording it names.** `rec` lists the hashes of the test's recordings that the entry quarantines: the hash of the test case file and the request bodies stored beside it in `assets/`, not of its mocks. When Keploy itself rewrites the test case, for example to add noise it learned, it moves the entry onto the new hash. Any other change to the test case, such as a hand edit or a merge that brought another version of it, makes the entry stale: `keploy test` prints `STALE` for it and runs the test.
- **A file Keploy can't read skips nothing.** A file with merge-conflict markers, more than one YAML document, a version other than `1`, or YAML that doesn't parse is unreadable. `keploy test` prints `UNREADABLE` for the set and runs all of its tests.
- **So a missing, stale or broken file can only run too much.** It can turn CI red, never falsely green.
- **An entry outlives a deleted test until you judge its set.** When the test case is gone, `KEPLOY_PROVEN=1 keploy test --judge` drops its entry and prints `PRUNED`. Until then the entry skips nothing, because no test carries its name.

Don't add entries by editing the file: an entry whose `rec` doesn't name the test's current recording never applies. Use `keploy quarantine`, which names it for you.

## Fields {#fields}

| Field         | Meaning                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `version`     | The file's format. This release reads and writes `1` only.                                                                                                                                                                                                                                                                                                                              |
| `quarantined` | One entry per quarantined test, keyed by the test case's name in the set, such as `get-orders-3`.                                                                                                                                                                                                                                                                                       |
| `class`       | Who has to act: `keploy`, `app-infra`, `flaky` or `manual`. See [Classes and reasons](#reasons).                                                                                                                                                                                                                                                                                        |
| `reason`      | Why the test doesn't replay. For `manual`, your own text from `keploy quarantine --reason`, one line of at most 200 bytes.                                                                                                                                                                                                                                                              |
| `rec`         | The recordings the entry applies to: `sha256:<64 hex digits>`, optionally followed by `@<branch>` for a recording published to a Keploy cloud branch, or `none` for a test with no recording.                                                                                                                                                                                           |
| `since`       | The UTC date the test entered quarantine.                                                                                                                                                                                                                                                                                                                                               |
| `by`          | What wrote the entry: `record` for `keploy record` and `keploy mock record`, `quarantine` for `keploy quarantine`.                                                                                                                                                                                                                                                                      |
| `keploy`      | The Keploy version that wrote the reason.                                                                                                                                                                                                                                                                                                                                               |
| `rounds`      | Each judging round's outcome for the test, each `passed`, `failed` or `skipped`: `full` (auto-replay's full round, with nothing skipped), `confirm` (the confirming round, run as CI runs `keploy test`), and `record` (the run against real infrastructure, which only `keploy mock record` has). A test that's about to be quarantined is `skipped` in `confirm`, as CI will skip it. |
| `calls`       | Up to five dependency calls behind the reason: `protocol`, `call` (the method and the URL's shape for HTTP and gRPC, the command alone for other protocols), `destination`, and `phase`, the step of mock matching the call failed at (such as `no_match` or `body_mismatch`) or `record` for a call the recording lost.                                                                |
| `mocks`       | Up to five recorded mocks behind the reason, by `name` and `kind`.                                                                                                                                                                                                                                                                                                                      |
| `diff`        | The paths of the response fields that differed, such as `body.total`. A key that may be a value, such as an email address that a map is keyed by, is written `{}`.                                                                                                                                                                                                                      |

The evidence holds no request or response bodies, query values or headers. A URL keeps only the path segments that read as names, and writes every other one as `{}`: numbers, IDs, UUIDs, hashes, email addresses and tokens with a digit in them. So `/users/alice@example.com/orders/12345` is `/users/{}/orders/{}`. A segment Keploy knows holds a value, such as the place of a variable it learned, is `{}` too. A query keeps its parameters' names, by the same rule, and writes every value as `{}`: `?expand=items&page=2` is `?expand={}&page={}`. Any other segment made only of letters, such as a slug or a lowercase user name, can't be told from a name, so it's kept: `/users/alice/orders/12345` is `/users/alice/orders/{}`. Review the file before you commit it if your URLs carry such values.

Keploy writes each entry's fields on fixed lines, one entry per test, sorted by test name, so changes to tests that are far apart in the file merge in Git without a conflict. Two branches that change the same test's entry, or add entries next to each other, can conflict: see [Resolve a merge conflict](#merge-conflict).

## Classes and reasons {#reasons}

`keploy test` prints what to do for each class and reason under its `QUARANTINED, not run` list.

Every entry that `keploy record` or `keploy mock record` writes was decided on the build that recorded the test: auto-replay replays each recording against the same app, right after you stop recording. So the `keploy` class means what it says: Keploy has to act. On an app that didn't change, Keploy couldn't answer one of the test's calls from its recording, or couldn't match the calls it recorded for it. Checking your diff finds nothing, because there's no diff, and recording the same traffic again can quarantine a different set of tests rather than none. Report such a test to Keploy, with the entry's `calls:` or `mocks:` evidence and the log of the `keploy record` that wrote it. Keploy's printed remedy for `keploy/unmocked_call` and `keploy/unconsumed_mock` says to re-record the test if the app changed on purpose, and to check the diff otherwise: neither applies to an entry from a record's own judging.

To re-record a test, record its flow again with `KEPLOY_PROVEN=1 keploy record` and the command you recorded it with: Keploy writes the new recording to a new test set and judges it there. Then delete the old test case from its set, and `KEPLOY_PROVEN=1 keploy test --judge` drops its entry (`PRUNED`).

| Class and reason             | What happened                                                                                                                                                          | What to do                                                                                                                                                                                                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `keploy/unmocked_call`       | On the build that recorded it, the test made a call Keploy had no recorded answer for, or one call more than it recorded.                                              | Report it to Keploy, as [above](#reasons). One cause is yours: requests that overlapped while you recorded. Then record those flows again, [one request at a time](/docs/running-keploy/proven-flow/#record-your-tests).                                    |
| `keploy/unconsumed_mock`     | On the build that recorded it, the test never made a call Keploy recorded for it.                                                                                      | The same as for `keploy/unmocked_call`.                                                                                                                                                                                                                     |
| `keploy/mock_missing`        | The replay of the build that was just recorded was served other mocks than its recording maps.                                                                         | Report it to Keploy, as [above](#reasons). Keploy's printed remedy is to re-record the test: a new recording is judged afresh, and it isn't sure to be kept.                                                                                                |
| `keploy/capture_incomplete`  | Keploy couldn't capture one of the test's calls, such as a TLS handshake it couldn't join or a UDP reply, or the test's recording lost data that no round could judge. | Give the dependency a TCP address Keploy can mock, or list it in [`mock.real`](/docs/running-keploy/proven-flow/#mock-real), then re-record. For a recording that lost data, see [Capture-loss evidence](/docs/running-keploy/proven-flow/#recording-lost). |
| `flaky/replay_only`          | The test failed on replay with every call answered: the app is nondeterministic (the clock, randomness), or a real dependency's state changed since it was recorded.   | Fix that, then re-record.                                                                                                                                                                                                                                   |
| `flaky/flipped`              | The test passed in one round and failed in the next: it depends on test order, on another test, or on how the command runs it.                                         | Remove the dependency, then re-record.                                                                                                                                                                                                                      |
| `flaky/request_changed`      | A request field changed between runs in a way Keploy doesn't learn.                                                                                                    | Make the field deterministic, then re-record.                                                                                                                                                                                                               |
| `flaky/unstable_order`       | The app sent an array in another order than it recorded, or an array came back in another order.                                                                       | Give the array a stable order in the app, then re-record.                                                                                                                                                                                                   |
| `app-infra/failed_in_record` | The test failed against real infrastructure when it was recorded, so it has no recording. Only `keploy mock record` writes this reason.                                | Fix the app or its infrastructure, then record it again.                                                                                                                                                                                                    |
| `manual/<your reason>`       | You quarantined the test with `keploy quarantine`.                                                                                                                     | Fix what your reason names, then remove the entry with `KEPLOY_PROVEN=1 keploy test --judge` once the test passes, or record the test again.                                                                                                                |

A class or reason this Keploy doesn't know, written by a newer one, is shown as it is, and the entry still applies.

## Tests with no verdict {#not-judged}

A test can also end with no verdict at all, which is not a quarantine. It happens when the test called something Keploy can't capture, or can't tell it captured, or when Keploy couldn't read its own evidence about the test. Keploy writes no entry for such a test, and what happens next depends on where it runs:

- **When you record.** A test with no verdict leaves its whole test set without one. Keploy judges none of the set's tests: it prints a `NOT JUDGED` line for the set instead of a `JUDGED` line, writes no `verdicts.yaml` for it, and doesn't put its mocks in the Keploy registry. `keploy record` says its verdict is incomplete, and exits 1. For an app that called the Docker daemon's socket in one test, it looks like this:

  ```text
  NOT JUDGED  test-set-0: round F stopped early (status INTERNAL_ERR: not judged: 2 test(s) ran while keploy could not capture, or could not tell it captured, every call the application made (get-docker-ping-1, get-whoami-2): the application called a Unix socket keploy cannot capture (1 time(s)) while this test or one before it ran (/var/run/docker.sock), so keploy cannot prove this test's calls were all captured); nothing was written for it
    RECORDING LOST  test-set-0/get-docker-ping-1: not judged: the application called a Unix socket keploy cannot capture (1 time(s)) while this test or one before it ran (/var/run/docker.sock), so keploy cannot prove this test's calls were all captured; its set was not judged
    RECORDING LOST  test-set-0/get-whoami-2: not judged: the application called a Unix socket keploy cannot capture (1 time(s)) while this test or one before it ran (/var/run/docker.sock), so keploy cannot prove this test's calls were all captured; its set was not judged
  keploy record's verdict is incomplete: 1 of the 1 test set it recorded is not judged (test-set-0); it exits 1
  ```

  The `NOT JUDGED` line names the cause and the tests that have no verdict, and a `RECORDING LOST` line under it names each of them. What to do is in the `next_step` of the log lines above them: the `WARN` Keploy logged when the call happened (`the application called a Unix socket keploy cannot capture: ...`), and the replay's `ERROR` line that starts `test-set is not judged:`. Here it's `reach that dependency over a TCP address (mocked, or listed in mock.real)`. The `NEXT` block that follows says `verified_red`, although the set isn't judged rather than failed.

  To recover, fix the cause, delete the set's directory, then record again:

  ```bash
  rm -rf keploy/test-set-0
  KEPLOY_PROVEN=1 keploy record -c "./server"
  ```

  Delete the set first. Recording again doesn't replace it: `keploy record` writes a new test set, such as `test-set-1`, and leaves the set it didn't judge on disk. The `NEXT` block's `commit:` line lists every set on disk, that one too. Committed, it runs in CI with no `verdicts.yaml` (`UNLISTED`): every one of its tests runs, though Keploy judged none of them, so CI can fail on tests that a judged set would have quarantined. For the same reason, don't upload its mocks with `keploy mock upload`, even when the `NEXT` block's `do:` asks for it: that advice is for a set CI replays green. If `rm` is refused, Keploy wrote the files as root: use `sudo rm -rf`.

- **In CI.** The tests the second column below names have no verdict. `keploy test` prints a `NOT JUDGED` line for them, and the run fails. Its `VERDICT  failed` line says what to do.

| Cause                                                                                                                                          | Which tests have no verdict    | What to do                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Called a dependency over a Unix socket, which Keploy doesn't support.                                                                          | That test and every later one. | Reach the dependency over a TCP address, mocked or listed in [`mock.real`](/docs/running-keploy/proven-flow/#mock-real).          |
| Ran after Keploy's report of Unix-socket calls stopped, so whether a test made one can't be told.                                              | That test and every later one. | Report it to Keploy, with the agent's log. Nothing you change in your app ends it.                                                |
| Ran while Keploy couldn't read a process's PID namespace, so whether its calls were your app's can't be told.                                  | That test and every later one. | Report it to Keploy, with the agent's log, which names the process.                                                               |
| Hung up on its TLS handshake with Keploy without a word, which a client that doesn't trust Keploy's CA can do.                                 | That test.                     | Make the client trust Keploy's CA, for example with `NODE_EXTRA_CA_CERTS` for Node.js, or `--cacert` for the curl command line.   |
| Sent data to a server-first protocol Keploy has no parser for, such as SMTP, FTP, POP3, IMAP or NATS, which it relays.                         | That test.                     | List the destination in [`mock.real`](/docs/running-keploy/proven-flow/#mock-real), to reach it for real.                         |
| Connected to a destination that refused the connection at once, such as a Redis error or a MySQL error packet.                                 | That test.                     | Find why the destination refused your app's connections, such as its connection limit or protected mode.                          |
| Called a container whose configuration the Docker daemon didn't give Keploy, so the call's container can't be told.                            | That test.                     | Make `docker inspect` of the container answer: another operation on it, such as a stop's grace period or a hung `exec`, holds it. |
| Keploy couldn't read or check everything the test did: the calls no mock answered, the mocks it used, or its learned values against its calls. | That test.                     | It's Keploy's failure, not your app's: report it to Keploy, with the run's log.                                                   |

A call to something Keploy can't capture that your app makes outside every test, for example while it starts, or after the last test, leaves the whole test set without a verdict, in CI too.

## Resolve a merge conflict {#merge-conflict}

When two branches change the same test's entry, or add entries next to each other, Git can leave conflict markers in the file, and Keploy then skips none of the set's tests. Run `git checkout --conflict=diff3 keploy/<test-set>/verdicts.yaml` to see both sides' entries whole. Keep both sides' entries, and for a test both sides list, keep every `rec` item of both. Then commit the file.

## Related

- [Record, judge and replay tests in CI](/docs/running-keploy/proven-flow/): the flow that writes and reads this file.
- [Capture loss warnings](/docs/running-keploy/capture-loss/): why Keploy couldn't record some bytes, and what to change.
