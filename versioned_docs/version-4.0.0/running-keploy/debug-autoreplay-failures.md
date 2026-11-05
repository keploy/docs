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

- With no `--test-sets`, it reads every test set whose newest auto-replay failed a case.
- `--test-sets test-set-0` reads one set. `--test-sets "test-set-0:test-1 test-2"` reads only those cases.
- `--cluster <name>` picks the cluster when the app runs in more than one.
- Without `--json`, it prints the same answer as text.

For each set, the command also writes the failing cases, their mocks, `failures.yaml` and `explain.json` (the set's part of the JSON answer) under the output directory.

The command exits 0 when it explains every failing case, even when the explanation is that no reason was recorded. It exits 1 when it could not read a set's failures or write them under the output directory. It still answers and writes every other set, and the error it ends with names each set it could not explain. The text answer says `NOT EXPLAINED` for that set, and the JSON answer keeps the set as an entry with an `error`.

## What each case says

Each case has one `class`, the first that applies in the order below, and `classes`, every class that applies.

| Class                 | What happened                                                         | Next step                                                                                                                                                            |
| --------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `reason_not_recorded` | Auto-replay marked the case failed and recorded no reason.            | A Keploy bug. Report it with the test set id and the debug bundle id. When the bundle gives a reason for the case, or says why the round failed, the step quotes it. |
| `app_unreachable`     | The replay got no response from the app.                              | Read the bundle's `logs/autoreplay` section for the app's start and the replay's first error.                                                                        |
| `unmocked_call`       | The app made a call that no recorded mock resembles.                  | Record the case again. If the same call is unmocked again, report its protocol and shape.                                                                            |
| `mock_miss`           | The app made a call that differs from its closest recorded mock.      | Record the case again, or report the call shape and the closest mock if a value changes on every run.                                                                |
| `status_diff`         | The response status changed.                                          | If intended, delete the case through `keploy cloud triage` and `keploy cloud accept`. If not, fix the regression in the app.                                         |
| `body_diff`           | The response body changed. Only values changed, or its shape changed. | Values only: mark the fields noise with the edit the answer gives. Shape: delete the case if intended, else fix the regression.                                      |
| `header_diff`         | Response headers changed.                                             | Mark the headers noise with the edit the answer gives.                                                                                                               |
| `other`               | A recorded reason none of the classes above covers.                   | The step the reason's code names, else report it with the bundle id.                                                                                                 |

The evidence holds field paths, header names, status codes and call shapes. It never holds a header's value or a body's value.

When the newest auto-replay counts more failed cases than it names, the set's `unnamedFailed` says how many. The debug bundle holds them.

## The debug bundle

For each set, the answer names the set's newest debug bundle on the cluster: its id, when it was built, what it holds (its sections and their state), and why its round failed when the proxy recorded that. The answer also says how to download the bundle through the cluster's ingress with your Keploy credential. When the CLI cannot reach the bundle, the answer says why.

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
          "evidence": {"body": {"valueChanged": ["body.updatedAt"]}},
          "next": {"action": "mark_noise", "say": "...", "edit": "..."}
        }
      ],
      "bundle": {
        "id": "...",
        "createdAt": "...",
        "sections": {"logs/autoreplay": "ready"},
        "download": "..."
      }
    }
  ]
}
```

## From an MCP client

The Keploy MCP server has the tool `debug_autoreplay_failures`. Give it the app, and optionally the test sets. It answers with the same classes, evidence and next steps.
