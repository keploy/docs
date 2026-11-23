---
id: dependencies
title: Notes for each dependency
sidebar_label: Dependencies
description: How the Universal Mocker tells your databases, queues and services apart, how it reads encrypted connections, and what to know about PostgreSQL, MySQL, Redis and Amazon SQS when you record and replay your tests with keploy mock. Read from the Keploy 3.9.4 code.
tags:
  - mocks
  - dependencies
  - replay
keywords:
  - keploy mock
  - dependencies
  - postgresql
  - mysql
  - redis
  - amazon sqs
  - tls
  - service virtualization
---

# Notes for each dependency

The [overview](../overview.md#check-what-it-supports) lists the dependencies
Keploy records and replays on Linux and on macOS. This page says what to know
about some of them. It describes Keploy 3.9.4, as its code is written.

## How Keploy tells dependencies apart

- Keploy looks at the first bytes of each connection, not at its port. Your
  database or service can listen on any port.
- It tries the protocols it knows in a fixed order, and uses the first one
  that matches.
- A MySQL server speaks first, so Keploy recognizes MySQL from the server's
  greeting.
- A connection that matches no protocol is saved as raw bytes. It replays only
  when your tests send exactly the same bytes again.

## Encrypted connections

When a connection starts a TLS handshake, Keploy answers it with a certificate
from its own certificate authority (CA), then reads the protocol inside. This
is how Keploy reads HTTPS calls, and any other connection that starts with
TLS.

You don't install or trust that CA yourself. Each run sets it up, as
[HTTPS: do I need to trust Keploy's certificate?](/docs/keploy-explained/common-errors/#https-ca)
explains for Linux, macOS and Java.

## PostgreSQL

At replay, Keploy answers the login itself:

- It accepts TLS when the server accepted it at record, and refuses it when the
  server refused it.
- It lets the client in without checking its password.

## MySQL

At replay, Keploy answers the login from the recording:

- It doesn't compare the password the client sends.
- When the recording holds both a refused login and an accepted one for the
  same server, the replay lets the login in.

## Redis

The Keploy CLI records and replays Redis on Linux. On macOS, run the tests in
Docker, as [Platforms](../mock-your-tests.md#platforms) shows.

A worker that waits on a blocking pop (`BLPOP`, `BRPOP`, `BLMOVE`,
`BRPOPLPUSH`, `BLMPOP`, `BZPOPMIN`, `BZPOPMAX`, `BZMPOP`, or `XREAD` and
`XREADGROUP` with `BLOCK`) is often still waiting when the recording ends. With
[`KEPLOY_PROVEN=1`](../mock-your-tests.md#proven):

- That last pop, which the recording holds with no answer, stands for at most
  one pop at replay, in whichever test it comes.
- No test fails when the replay's worker doesn't send that pop.
- A pop that got an answer, a timeout included, is checked in the test that
  recorded it, like any other call.

## Amazon SQS

On Linux, Keploy understands SQS calls. With
[`KEPLOY_PROVEN=1`](../mock-your-tests.md#proven), a queue consumer's polls
(`ReceiveMessage`) replay this way:

- A poll that found no message answers at most one poll. No test fails
  because the consumer polled fewer times at replay, where every answer comes
  at once.
- A poll after every recorded one is answered as a poll that found no message.
- The messages of a recorded poll are delivered once in each test set. If the
  consumer polls again and that recording would answer it a second time, the
  replay answers that the poll found no message, as SQS does once a message is
  received and deleted.
- A poll that delivered messages, or that got an error, is checked in the test
  that recorded it, like any other call.

On macOS, Keploy records SQS calls as plain HTTPS calls, without SQS's own
matching. A poll beyond the recorded ones then has no recording to answer it.
Run SQS tests on Linux or in Docker, as
[Platforms](../mock-your-tests.md#platforms) shows.

## See also

- [Check what it supports](../overview.md#check-what-it-supports): each
  dependency on Linux and macOS.
- [Network isolation in replay](./network-isolation.md): what a replay does
  with a call the recording doesn't have.
- [Times, dates and ids that change](./changing-values.md): what a replay does
  with a value that is new on every run.
- [Troubleshooting](../troubleshooting.md): symptoms, causes and fixes.
