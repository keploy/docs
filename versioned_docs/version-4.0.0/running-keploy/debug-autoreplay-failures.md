---
id: debug-autoreplay-failures
title: Debug an auto-replay failure with your coding agent
sidebar_label: Debug auto-replay failures
description: Find out why auto-replay failed each test case, and what to do next, with one command or one MCP tool that a coding agent can read.
tags:
  - kubernetes
  - auto-replay
  - troubleshooting
keywords:
  - keploy debug failures
  - auto-replay failure
  - debug bundle
  - coding agent
  - MCP
---

When auto-replay fails test cases of a test set, `keploy debug failures` tells you, for each failing case, why it failed, the evidence, and the next step to take. It prints JSON for a coding agent, and the Keploy MCP server answers the same question through a tool.

## Run it

```bash
keploy debug failures --app <namespace>.<deployment> --json
```

- With no `--test-sets`, it reads the deployment's newest 200 auto-replay results and explains every test set whose newest auto-replay among them failed a case. When the deployment has more results than that, the answer's `partial` says so: a set whose newest auto-replay is older is not listed, so name it with `--test-sets`.
- With no `--test-sets`, it also explains every test set cloud replay runs that still holds a case an auto-replay marked failed, even when that set's newest auto-replay failed none: an earlier round's mark stays until it is cleared, and cloud replay skips the case until then. It reads the store's list of those sets, 200 per page. `partial` names a set whose marked cases the store could not count, and says when the list ran past 50 pages. A list that cannot be read fails the command.
- `--test-sets test-set-0` reads one set. `--test-sets "test-set-0:test-1 test-2"` reads only those cases.
- `--cluster <name>` picks the cluster when the app runs in more than one.
- Without `--json`, it prints the same answer as text.

For each set, the command also writes the failing cases, their mocks, `failures.yaml` and `explain.json` (the set's part of the JSON answer) under the output directory.

The command exits 0 when it explains every failing case, even when the explanation is that no reason was recorded, or that the case is no longer marked failed. It exits 1 when it could not read a set's failures or write them under the output directory. It still answers and writes every other set, and the error it ends with names each set it could not explain. The text answer says `NOT EXPLAINED` for that set, and the JSON answer keeps the set as an entry with an `error`.

When a set's failing cases and their mocks cannot be read (its mock bundle cannot be opened, for one), the command still explains each case from the failure details the store holds. It writes `explain.json` but not the cases, says why in the set's `notWritten` (`NOT WRITTEN:` in the text answer), and exits 1 naming the set.

## What each case says

Each case has one `class`, the first that applies in the order below, and `classes`, every class that applies.

| Class                 | What happened                                                                                                                                                                                                           | Next step                                                                                                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reason_not_recorded` | Auto-replay marked the case failed and recorded no reason.                                                                                                                                                              | A Keploy bug. Report it with the test set id and the debug bundle id. When the bundle gives a reason for the case, or says why the round failed, the step quotes it.                                                                                |
| `no_longer_failed`    | The newest auto-replay failed the case, but the store no longer marks it failed: the mark was cleared, or the case was deleted or re-recorded since that round.                                                         | `none`: nothing to do; the store no longer marks this case failed. Run auto-replay again to re-check the case.                                                                                                                                      |
| `not_replayed`        | No auto-replay round replayed the case before the recording stopped, so it has no verdict. `notReplayedCause` in the evidence says why.                                                                                 | Replay the set with `keploy cloud replay --clear-failed`, the command the answer gives (its action is `replay`), to give the case a verdict.                                                                                                        |
| `not_stored_whole`    | The case did not reach the store whole (its request body, a file part or its traffic stayed out), so no replay from the store sends it, and it has no verdict. `notReplayedCause` in the evidence says what stayed out. | Report it with the test set id, the case and the cause (its action is `report_bug`). No replay, with `--clear-failed` or without, gives it a verdict.                                                                                               |
| `cant_replay`         | Auto-replay can't replay the case's recording at all, so it has no verdict. `notReplayedCause` in the evidence says why.                                                                                                | Record the test set again (its action is `rerecord`). No replay of this recording gives the case a verdict.                                                                                                                                         |
| `unrecorded_read`     | Every call Keploy could not answer for the case is a read that no recording in the test set holds: the recorded app likely answered it from an in-process cache that was warm before recording.                         | Record the test set again from a fresh start of the app's pod (its action is `rerecord`), so the startup capture holds the reads that fill its caches.                                                                                              |
| `app_unreachable`     | The replay got no response from the app.                                                                                                                                                                                | Read the bundle's `logs/autoreplay` section for the app's start and the replay's first error.                                                                                                                                                       |
| `unmocked_call`       | The app made a call that no recorded mock resembles.                                                                                                                                                                    | Record the case again. If the same call is unmocked again, report its protocol and shape.                                                                                                                                                           |
| `mock_miss`           | The app made a call that differs from its closest recorded mock.                                                                                                                                                        | Record the case again, or report the call shape and the closest mock if a value changes on every run.                                                                                                                                               |
| `status_diff`         | The response status changed.                                                                                                                                                                                            | If intended, replay the set with `keploy cloud replay --clear-failed` (a plain replay skips a case auto-replay marked failed), then delete the case through `keploy cloud triage` and `keploy cloud accept`. If not, fix the regression in the app. |
| `body_diff`           | The response body changed. Only values changed, or its shape changed.                                                                                                                                                   | Values only: mark the fields noise with the edit the answer gives. Shape: if intended, delete the case as for `status_diff`, else fix the regression.                                                                                               |
| `header_diff`         | Response headers changed.                                                                                                                                                                                               | Mark the headers noise with the edit the answer gives.                                                                                                                                                                                              |
| `other`               | A recorded reason none of the classes above covers.                                                                                                                                                                     | The step the reason's code names, else report it with the bundle id.                                                                                                                                                                                |

The evidence holds field paths, header names, status codes and call shapes, and for a case stored with no verdict, the cause the store or the proxy recorded. It never holds a header's value or a body's value.

When the newest auto-replay counts more failed cases than it names, the set's `unnamedFailed` says how many. The debug bundle holds them.

When the auto-replay results could not be read, each set's `resultsError` says so. The set then lists only the cases the store marks failed: a case the newest auto-replay failed that the store no longer marks is not listed.

## The debug bundle

For each set, the answer names the debug bundle of the set's newest auto-replay round: its id, the round it covers, when it was built, what it holds (its sections and their state), and why its round failed when the proxy recorded that. The answer also says how to download the bundle through the cluster's ingress with your Keploy credential.

A bundle is built only for a round with cases it could not replay. When the set's newest bundle covers an earlier round, the answer says that no bundle is known to be from the newest round, and gives none of the earlier bundle's reasons. When the CLI cannot reach the bundle, the answer says why.

## A JSON answer

```json
{
  "app": "shop.orders",
  "testSets": [
    {
      "testSetId": "test-set-0",
      "replayId": "replay-12",
      "failed": 1,
      "byClass": {"body_diff": 1},
      "cases": [
        {
          "testCase": "test-3",
          "class": "body_diff",
          "classes": ["body_diff"],
          "evidence": {"body": {"valueChanged": ["data.updatedAt"]}},
          "next": {"action": "mark_noise", "say": "...", "edit": "..."}
        }
      ],
      "bundle": {
        "id": "...",
        "replayId": "replay-12",
        "createdAt": "...",
        "sections": {"logs/autoreplay": "ready"},
        "download": "..."
      }
    }
  ]
}
```

## From an MCP client

The Keploy MCP server has the tool `debug_autoreplay_failures`. Give it the app as `namespace.deployment`, and optionally the test sets. When the app runs in one cluster, the tool finds that cluster. When the app runs in more than one, give the cluster too: without it the tool refuses and names the clusters.

The tool answers with the JSON that `keploy debug failures --json` prints, plus the cluster it read. When it lists no set, its `note` says why: the app has no auto-replay result, or the newest auto-replay of every test set failed no case; either way, no test set cloud replay runs holds a case marked failed. The tool reads each set's failure details alone, never its cases' mocks, so a set whose mock bundle cannot be opened is still explained. The MCP server cannot reach the cluster's debug bundle, so each set's `bundle` says to run `keploy debug failures` where the cluster is reachable.
