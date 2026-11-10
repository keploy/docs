---
id: kept-but-set-aside
title: Kept but set aside
sidebar_label: Kept but set aside
description: A kept test that a run could not run fails the run. Read the kept_set_aside line and its JSON, and run the step it names.
tags:
  - mocks
  - ci
  - troubleshooting
keywords:
  - kept_set_aside
  - needs_skipped
  - verdicts.yaml
  - keploy.lock
  - keploy quarantine
  - coding agent
---

A test can use a value that another test sends, such as an id that an earlier test created. Keploy can replay it only after that other test has run. When the run skips that test, runs it later, or no recording sends the value, Keploy sets the test aside: it does not replay it.

When the test's list still keeps it, the run fails. The list is `keploy.lock` when the project pins one, and the set's `verdicts.yaml` otherwise. The run verified nothing of the test, so a green run would hide it. `keploy mock replay`, and `keploy test` with `KEPLOY_PROVEN=1`, print one `ERROR kept_set_aside` line for each such test. The line says what the test needs and the exact command for each way out.

## The line

The line always has this form, so a script or a coding agent can read it:

```text
ERROR kept_set_aside  <test> in set <set>: <list> keeps it, and this run set it aside, so it verified nothing of it and does not pass: it needs <need>; next: <step>, or <step>  json=<object>
```

For example:

```text
ERROR kept_set_aside  p::TestB in set e2e: keploy.lock keeps it, and this run set it aside, so it verified nothing of it and does not pass: it needs p::TestA, which this run does not run; next: record it with the test it needs: keploy mock record -- -run '^(TestA|TestB)$', or quarantine it: keploy mock quarantine TestB --reason 'keploy set it aside: it needs TestA, which CI does not run' --name e2e  json={"kind":"kept_set_aside","set":"e2e","list":"keploy.lock","test":"p::TestB","needs":{"why":"needs_a_test_this_run_does_not_run","test":"p::TestA","value":"run-body.id","size":24},"next":[...]}
```

The JSON after `json=` holds the same facts:

| Field         | What it holds                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `kind`        | `kept_set_aside`                                                                                                                  |
| `set`, `test` | The test that was set aside, and its set                                                                                          |
| `list`        | The file that keeps it: `keploy.lock` or `<set>/verdicts.yaml`                                                                    |
| `needs.why`   | Why it was set aside (table below)                                                                                                |
| `needs.test`  | The test that sends the value it needs. It is missing when no recording sends it, or Keploy could not read which test sends it    |
| `needs.value` | The name of the value, such as `run-body.id`, and `needs.size` its length. The value itself is never printed                      |
| `next`        | The steps that end it, in order. Each step has an `action` and the exact `command`. A step may have `then`: steps to run after it |

| `needs.why`                               | What happened                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `needs_a_test_this_run_does_not_run`      | The list skips the test it needs, so the run set it aside before it started                      |
| `needs_a_test_that_did_not_run_before_it` | The test it needs had not run when this test began                                               |
| `needs_a_test_the_command_runs_after_it`  | Your test command runs the test it needs after this one                                          |
| `needs_a_value_no_recording_sends`        | No recording of the set sends the value now                                                      |
| `needs_a_test_keploy_could_not_read`      | The test it needs had not run when this test began, and Keploy could not read which test that is |

## What to do

Run one of the `next` steps. Each one makes the next run either replay the test or stop keeping it.

| `action`                        | What it does                                                                                                                                        |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `record_with_the_test_it_needs` | Records the test together with the test it needs, so both are judged again                                                                          |
| `record_it_alone`               | Records the test without the test it needs, so its recording no longer needs a value from it                                                        |
| `record_the_set_again`          | Records the whole set again. Used when no test is named that sends the value                                                                        |
| `quarantine`                    | Quarantines the test with a reason, so its list skips it and no run counts it as kept                                                               |
| `delete_this_sets_copy`         | Deletes this set's copy of the test. It always comes after a `keploy record`, which writes a new set, so the old copy would stay kept and set aside |

With `keploy test`, the record step is `keploy record` with the app command and the `--path` and `--config-path` you gave. Its `then` step deletes the test's files in the old set. When Keploy cannot name those files, the `then` step quarantines the test instead.

## Lines that would cause it

`keploy mock judge`, `keploy test --judge` and `keploy record` warn you before you paste a line that would cause this failure. Each one prints a quarantine line for a test that fails, and some tests need a value from that test. Quarantining that test sets them aside, so the line names them: `quarantining it sets aside <tests> ... quarantine them too`. Each of them gets its own quarantine line, of kind `needs_skipped`.

A test may have a line that skips nothing, such as a mapping edit or a `FIX`, and still need a test that another line quarantines. It gets a second line too: `and once <test> is quarantined, quarantine this too`.

Each line for a `needs_skipped` test ends with the same JSON as the `kept_set_aside` line, with `"kind":"needs_skipped"`. On `keploy mock judge`, the JSON is in the comment of the line to paste, after `; json=`. On `keploy test --judge` and `keploy record`, it is at the end of the `QUARANTINE?` line, after `  json=`. The command line under it is unchanged, so you can paste it as before. In this JSON, `needs.why` is `needs_a_test_ci_skips`, or `needs_a_value_no_recording_sends`.
