---
id: outside-every-test
title: A call outside every test
sidebar_label: Outside every test
description: A dependency call that no mock answered, made while no test was running, fails the run but no test. Read the outside_every_test line and its JSON, and run the step it names.
tags:
  - mocks
  - ci
  - troubleshooting
keywords:
  - outside_every_test
  - KEPLOY_PROVEN
  - keploy mock replay
  - keploy test
  - coding agent
---

Your app makes dependency calls that no Test-Case sends. A timer, a clean-up job or a cache refresh can run after one test ends and before the next one starts. A call can also start inside a test, and Keploy decides that no mock answers it only after the test has ended. Either way, no test made the call alone, so Keploy does not fail a test for it.

When no mock answers such a call, the run fails. A green run would hide a dependency call that the recording does not cover. Every test that passed still passes, and Keploy still learns from it. `keploy mock replay`, `keploy test --judge` and `keploy record` print one `ERROR outside_every_test` line for each call. `keploy test` with `KEPLOY_PROVEN=1` logs the same facts as fields of one ERROR log entry for each call.

A call that repeats a recorded background call, such as the app's own timer, fails nothing. Keploy answers it from the recording, or lists it without failing the run.

## The line

The line always has this form, so a script or a coding agent can read it:

```text
ERROR outside_every_test  <call> in set <set>: <when>; <facts>; it fails the run, and no test; next: <step>  json=<object>
```

For example:

```text
ERROR outside_every_test  HTTP DELETE /sessions to auth:8080 in set e2e: made between tests, 150ms after test-1 ended and 150ms before test-2 began; the closest recording is mock-7, which it differs from in body.ids[0]; it fails the run, and no test; next: if the app changed this call on purpose, record the set again: mkdir -p -- /home/me/app/keploy-replaced && mkdir -- /home/me/app/keploy-replaced/e2e-test-run-3 && mv -- /home/me/app/keploy/e2e /home/me/app/keploy-replaced/e2e-test-run-3/e2e && keploy record -c 'go run .' --metadata name=e2e (it first moves the set's recordings out of the keploy folder, into /home/me/app/keploy-replaced/e2e-test-run-3; delete that folder once the set recorded again passes)  json={"kind":"outside_every_test","set":"e2e","call":{"protocol":"HTTP","call":"DELETE /sessions","destination":"auth:8080"},"between":{"after":"test-1","afterEndedMs":150,"next":"test-2","nextBeginsMs":150},"placed":true,"closest":"mock-7","differs":["body.ids[0]"],"facts":"the closest recording is mock-7, which it differs from in body.ids[0]","next":{"action":"record_if_changed","command":"mkdir -p -- /home/me/app/keploy-replaced \u0026\u0026 mkdir -- /home/me/app/keploy-replaced/e2e-test-run-3 \u0026\u0026 mv -- /home/me/app/keploy/e2e /home/me/app/keploy-replaced/e2e-test-run-3/e2e \u0026\u0026 keploy record -c 'go run .' --metadata name=e2e","replaced":"/home/me/app/keploy-replaced/e2e-test-run-3"}}
```

`<when>` is one of these:

- `made between tests, <d> after <test> ended and <d> before <test> began`: the call was made while no test was open.
- `made in test <test>, and keploy decided it missed only after that test ended`: the call is named under the test that made it. When it was a test of an earlier set, `<set>` is that test's set.
- `made before the first test, <d> before <test> began` or `made after the last test, <d> after <test> ended`: a call that an earlier set made while none of its tests was open, which Keploy decided only after that set ended. `<set>` is the set that made it, and `<test>` is one of that set's tests. The call can also be made between two of that set's tests, in the first form above.
- `made while no test was open, at a time keploy could not place between two tests`: the run still fails. Keploy says this when the call has no time, when Keploy has no test times to place it by, or when those times do not put the call outside every test.

In the JSON, `between` has the same fields for every placed form: `after` and `afterEndedMs` for the test that ended before the call, `next` and `nextBeginsMs` for the test that began after it. `after` is `""` for a call made before the first test, and `next` is `""` for a call made after the last.

When Keploy cannot name the earlier set that made a call, the line says `in an earlier test set` in place of `in set <set>`, and `set` is empty in the JSON. When Keploy's agent counted how many sets before this one that set ran, the JSON has that count as `earlierBy` (`1` is the set run just before).

The JSON after `json=` holds the same facts. Keploy writes `kind`, `set`, `between`, `madeIn`, `placed`, `earlierBy`, `closest`, `facts` and `next`. Only `call` holds text that your app wrote, such as its path. `differs` names the fields in which the call differs from its closest recording, never their values.

Under `KEPLOY_PROVEN=1`, `keploy test` logs these fields: `kind`, `test-set`, `protocol`, `call`, `destination`, `made_in`, `after`, `before`, `at`, `closest`, `differs`, `facts` and `next_step`. A call of an earlier set, made in one of its tests or while none was open, also has `read-in-test-set`, the set that was running when Keploy decided it. For such a call made while none of that set's tests was open, `test-set` is the set that made it, and `after` and `before` name the tests of that set it was made between: `after` is `""` for a call made before the set's first test, `before` is `""` for one made after its last, and both are `""` when Keploy cannot place the call.

## Fix it

The line names one next step, which Keploy chooses from the facts:

1. **The call is a read that a test's recording holds** (`"action":"move_to_worker"`). The app made the call again outside that test, for example from a timer. Move the recording to `worker:` in the set's mapping, so that Keploy answers the call wherever the app makes it. `keploy mock judge` writes this edit for you.
2. **A recording came close** (`"action":"record_if_changed"`). The call differs from that recording in the fields that the line names. If you changed the call on purpose, run the command to record the set again. If you did not, fix the app.
3. **No recording of this call in the set** (`"action":"record_again"`). The call is new since you recorded the set. Run the command to record the set again.
4. **An earlier set made the call, and Keploy cannot name that set** (`"action":"record_earlier_set"`, with no `command`). Recording the set that the run read again does not fix it, because that set never made the call. Record the set that made it again, with the command that recorded that set. The line names that set as far as Keploy knows it: by its test that made the call (`madeIn`), or by how many sets before this one it ran (`earlierBy`).

The command records the failing set again in its place, so that the next run reads the new recording:

- On `keploy test` and `keploy record`, `keploy record` always writes a new test set, and gives a name that is taken a `-N` suffix. So the command first moves the set's folder out of the keploy folder, into `keploy-replaced/<set>-<run>/<set>` beside it (`<run>` is the run whose report holds the call, such as `test-run-3`), then runs `keploy record` with `--metadata name=<set>`, which gives the new recording the set's name. Nothing is removed: the JSON tail's `next.replaced` is the folder the old recordings went to. If recording fails, move them back from there; once the set recorded again passes, delete that folder. If a folder of that name is already there (you ran the command before), `mkdir` stops the command before it moves anything, so no earlier copy is overwritten. The command carries the app's command (`-c`), and `--path` and `--config-path` when the keploy folder or `keploy.yml` is not in the folder that you run the command from. Every word that is not plain is in single quotes for a POSIX shell, so `$` and backticks in the app's command stay as they are. The new set starts empty, so send the app's traffic again while it records.
- On `keploy mock replay`, the command is `keploy mock record` with `--name <set>` and the flags of the replay, which records the mock set again under its name.
- When `keploy record` cannot take the set's name (a name that it reads as a number, `true` or `null`, or one with a comma), the step has no command. Record the set again with the command that recorded it, and give the new set the old set's name.

Several such calls fail the run once, and the run names each call on its own line.
