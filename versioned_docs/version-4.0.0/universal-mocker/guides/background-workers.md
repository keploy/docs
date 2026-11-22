---
id: background-workers
title: Start-up calls and background work
sidebar_label: Start-up and background calls
description: Where the Universal Mocker records the calls your app makes outside a test, such as at start-up, for a cached token or from a poller, which test a replay answers each one in, and how sessionCalls serves a call to every test. Read from the Keploy 3.9.4 code.
tags:
  - mocks
  - replay
  - background work
  - service virtualization
keywords:
  - keploy mock
  - sessionCalls
  - start-up recording
  - TestMain
  - background worker
  - poller
  - KEPLOY_PROVEN
---

# Start-up calls and background work

Your app makes some calls that no test asks for. It opens a database
connection when it starts, fetches a token once and reuses it, or polls a queue
on a timer. This page says where Keploy records these calls, and which test a
replay answers each one in. It describes Keploy 3.9.4, as its code is written.

## Where a call is recorded

A replay of the whole run answers every call from the whole recording, as
[Step 4 of the Go quickstart](../quickstarts/go.md#step-4-replay-with-the-dependencies-off)
shows. Nothing on this page applies to it.

Keploy splits a recording by test only when it knows where each test begins
and ends: with [`KEPLOY_PROVEN=1`](../mock-your-tests.md#proven), or when your
tests send the begin and end calls of
[per-test scoping](../mock-your-tests.md#per-test-scoping-optional). Then:

- A call made while a test is open goes to that test's recording, whoever made
  it: the test, your app's code, a background thread, or another process.
- A call made outside every test, such as in Go's `TestMain`, goes to the
  set's start-up recording. A `keploy.lock` names it as the set's `@startup`
  entry, as [What it pins](./keploy-yml-and-lock.md#what-it-pins) shows.

## What a replay answers each call with

| The call                                                  | Without `KEPLOY_PROVEN`                               | With `KEPLOY_PROVEN=1`                                                          |
| --------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| A call the test recorded                                  | The test's own recording                              | The test's own recording                                                        |
| A database connection's start-up, made outside every test | The start-up recording, in every test                 | The start-up recording, in every test                                           |
| An HTTP call made outside every test                      | The start-up recording, in every test                 | The start-up recording, only when a `sessionCalls` entry names the call exactly |
| An HTTP call only another test recorded                   | That recording, when a `sessionCalls` entry covers it | Never: another test's recording of a call is served to that test only           |

A call that no recording answers is a miss, as
[A call has no recording](../troubleshooting.md#a-call-has-no-recording)
shows.

## Serve a call to every test

Some HTTP calls are made once per process: your app fetches a token or reads a
shared setting, and keeps it. Only the test that ran first makes the call.
Replay another test alone, or in another order, and it makes the call with no
recording of it.

Declare such a call in `sessionCalls`, at the top level of your project's
`keploy.yml`, not under `mock:`:

```yaml
sessionCalls:
  - host: "auth.example.com"
    method: "POST"
    pathPrefix: "/oauth/token"
```

- `host` is required. Without a port it matches the host on any port, and with
  one only that port.
- `method` and `pathPrefix` narrow the entry. `pathPrefix` matches whole path
  segments: `/oauth` matches `/oauth/token`, not `/oauthx`.

[Session calls section](/docs/running-keploy/configuration-file/#session-calls-section)
has every rule of the keys.

What an entry serves depends on the mode:

- **Without `KEPLOY_PROVEN`:** every test is served a call the entry covers,
  from any test's recording of it.
- **With `KEPLOY_PROVEN=1`:** every test is served the call only from the
  start-up recording, and only when the entry names the call exactly: its
  `method`, and its whole path as `pathPrefix`. So your app must make the call
  outside every test, such as in `TestMain`, when you record. An entry with no
  `method`, or with only a part of the path, serves no start-up recording.

With `KEPLOY_PROVEN=1`, `keploy mock explain` prints each entry with the one
call it names exactly, and the start-up recording the entries serve.

## Read a miss's next step

An HTTP miss's hint says what to do: its `Hint` line, or its `next:` line with
`KEPLOY_PROVEN=1`. The file it calls `keploy.yaml` is your project's
`keploy.yml`. Each hint ends with the command that records the test again.

| The hint starts with                                                                                                                                           | Mode                    | Do this                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Each test is served the HTTP calls it recorded. If another test recorded this call and every test may make it`                                                | Without `KEPLOY_PROVEN` | Add the `sessionCalls` entry the hint quotes. Or record again with the command it names, so this test records the call.                              |
| `Each test is served the HTTP calls it recorded. If the application made this call outside every test (in TestMain or at start-up) and every test may make it` | `KEPLOY_PROVEN=1`       | If your app makes the call at start-up, add the exact entry the hint quotes. If a test makes it, record again with the command the hint names.       |
| `A keploy.yaml sessionCalls entry covers this call only by a path prefix or with no method.`                                                                   | `KEPLOY_PROVEN=1`       | Replace your entry with the exact one the hint quotes.                                                                                               |
| `keploy.yaml declares this call a session call, which serves a recording of it made outside every test (in TestMain or at start-up) to every test`             | `KEPLOY_PROVEN=1`       | The call was recorded inside another test, so the entry can't serve it. Record again with the command the hint names, so this test records the call. |

## Polls and consumers

A worker that polls while a test is open records its polls in that test. With
`KEPLOY_PROVEN=1`, a test is never answered from another test's recording. So
a poll that a replay makes in another test, or more
often than the recording did, misses, and fails that test like any other miss.

Keploy 3.9.4 handles two kinds of poll for you, with `KEPLOY_PROVEN=1`:

- [Redis](./dependencies.md#redis): the blocking pop a worker was still
  waiting on when the recording ended stands for at most one pop at replay, in
  whichever test it comes.
- [Amazon SQS](./dependencies.md#amazon-sqs), on Linux: a poll after every
  recorded one is answered as a poll that found no message, and no test fails
  because the consumer polled fewer times.

## See also

- [Notes for each dependency](./dependencies.md): what a replay does with each
  database and queue.
- [Times, dates and ids that change](./changing-values.md): values in a call
  that are new on every run.
- [Rules in keploy.yml](./declared-rules.md): name the calls your app makes
  after a test or on its own timer, with `KEPLOY_PROVEN=1`.
- [keploy.yml and keploy.lock](./keploy-yml-and-lock.md): the start-up entry
  of the lock.
- [Troubleshooting](../troubleshooting.md): what a failing record or replay
  prints, and how to fix it.
