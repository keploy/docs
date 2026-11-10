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
ERROR outside_every_test  HTTP DELETE /sessions to auth:8080 in set e2e: made between tests, 150ms after test-1 ended and 150ms before test-2 began; the closest recording is mock-7, which it differs from in body.ids[0]; it fails the run, and no test; next: if the app changed this call on purpose, record the set again: keploy record -c 'go run .'  json={"kind":"outside_every_test","set":"e2e","call":{"protocol":"HTTP","call":"DELETE /sessions","destination":"auth:8080"},"between":{"after":"test-1","afterEndedMs":150,"next":"test-2","nextBeginsMs":150},"placed":true,"closest":"mock-7","differs":["body.ids[0]"],"facts":"the closest recording is mock-7, which it differs from in body.ids[0]","next":{"action":"record_if_changed","command":"keploy record -c 'go run .'"}}
```

`<when>` is one of these:

- `made between tests, <d> after <test> ended and <d> before <test> began`: the call was made while no test was open.
- `made in test <test>, and keploy decided it missed only after that test ended`: the call is named under the test that made it. When it was a test of an earlier set, `<set>` is that test's set.
- `made while no test was open, at a time keploy could not place between two tests`: the run still fails. This is also the form for a call that an earlier set made while none of its tests was open, which Keploy decided only after that set ended. Then `<set>` is the set that made it.

When Keploy cannot name the earlier set that made a call, the line says `in an earlier test set` in place of `in set <set>`, and `set` is empty in the JSON.

The JSON after `json=` holds the same facts. Keploy writes `kind`, `set`, `between`, `madeIn`, `placed`, `closest`, `facts` and `next`. Only `call` holds text that your app wrote, such as its path. `differs` names the fields in which the call differs from its closest recording, never their values.

Under `KEPLOY_PROVEN=1`, `keploy test` logs these fields: `kind`, `test-set`, `protocol`, `call`, `destination`, `made_in`, `after`, `before`, `at`, `closest`, `differs`, `facts` and `next_step`. A call of an earlier set, made in one of its tests or while none was open, also has `read-in-test-set`, the set that was running when Keploy decided it.

## Fix it

The line names one next step, which Keploy chooses from the facts:

1. **The call is a read that a test's recording holds** (`"action":"move_to_worker"`). The app made the call again outside that test, for example from a timer. Move the recording to `worker:` in the set's mapping, so that Keploy answers the call wherever the app makes it. `keploy mock judge` writes this edit for you.
2. **A recording came close** (`"action":"record_if_changed"`). The call differs from that recording in the fields that the line names. If you changed the call on purpose, run the command to record the set again. If you did not, fix the app.
3. **No recording of this call in the set** (`"action":"record_again"`). The call is new since you recorded the set. Run the command to record the set again.

Several such calls fail the run once, and the run names each call on its own line.
