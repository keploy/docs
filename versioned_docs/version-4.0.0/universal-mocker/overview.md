---
id: overview
title: Universal Mocker — service virtualization for the tests you already have
sidebar_label: Overview
description: Keploy's Universal Mocker records the database, queue and API calls your own test suite makes, then replays them so go test, pytest, Jest, JUnit or Playwright runs with those dependencies switched off. Service virtualization with no mock code to write.
tags:
  - universal mocker
  - service virtualization
  - mocks
  - mocking
  - keploy mock
keywords:
  - universal mocker
  - service virtualization
  - dependency mocking
  - keploy mock record
  - keploy mock replay
  - mock database calls
  - offline tests
---

# Universal Mocker

**Universal Mocker** is Keploy's service virtualization for the tests you
already have. You run your own test command under `keploy mock record` once,
with the real dependencies up. Keploy saves every call your tests make to
databases, queues and other services, with each answer. After that,
`keploy mock replay` runs the same command with those dependencies switched off
and answers each call from the recording.

You write no mock code, and you change no test. Your test framework still
decides which tests pass.

![Record once against the real dependencies, then replay with them switched off](/img/universal-mocker/record-replay.svg)

## Understand how it works

1. **Record.** Run `keploy mock record -c "<your test command>"`. Your tests run
   against the real dependencies. Keploy sits between the two and saves each
   outgoing call and its answer.
2. **Replay.** Run `keploy mock replay -c "<your test command>"`. The
   dependencies can be off. Keploy answers each call with its recorded answer.
   By default, a call that matches no recording fails the run
   (`--on-miss fail`), so a missing mock never passes silently.
3. **Check every test on its own (optional).** With `KEPLOY_PROVEN=1`,
   `keploy mock record` also replays each test with the dependencies off before
   it keeps the recording. A test that doesn't replay is set aside, with the
   reason and the next step. See
   [Prove each test offline](./mock-your-tests.md#proven).
4. **Share.** In that mode, when you are signed in, the recordings go to Keploy
   Cloud, under a Keploy branch named after your git branch. Two things must be
   true:

   - `keploy.yml` names a Keploy app (`mock.appId`). Run `keploy app create`
     first, or record once with `--app <name>`.
   - You record on a git branch other than main. Keploy never publishes to
     main: switch to a branch first (`git switch -c <name>`), or pass
     `--branch <name>`.

   Your repository holds only `keploy.yml` and `keploy.lock`, which pins each
   test to its recordings. CI replays what `keploy.lock` pins.
   [keploy.yml and keploy.lock](./guides/keploy-yml-and-lock.md) explains both.

## Choose the right Keploy product

| You want to…                                                                                     | Use                                                                       |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| Run the tests you already have (unit, integration, e2e) without their databases, queues and APIs | **Universal Mocker** (`keploy mock`)                                      |
| Turn real traffic from a running app or a cluster into tests and mocks                           | [Integration Testing](/docs/server/install/) (`keploy record`, k8s-proxy) |
| Generate API tests from a schema, a collection or live traffic with AI                           | [API Testing](/docs/running-keploy/api-test-generator/)                   |

The difference is who owns the tests. With Universal Mocker, your team owns
the tests and records whenever a branch needs it. With Integration Testing,
Keploy captures tests from an environment's traffic.

## Check what it supports

**Test commands.** Any command that runs your tests: `go test`, `pytest`,
`npx jest`, `mvn test`, `npx playwright test`, or a shell script. Keploy wraps
the command and doesn't need to know the framework.

**Per-test checks** (`KEPLOY_PROVEN=1`) need each test to say where it starts
and ends:

- **Go:** [`github.com/keploy/go-sdk/v3`](https://pkg.go.dev/github.com/keploy/go-sdk/v3/keploytest).
- **Playwright:** [`@keploy/playwright`](https://www.npmjs.com/package/@keploy/playwright).
- **Any other framework:** two HTTP calls per test, as
  [Per-test scoping](./mock-your-tests.md#per-test-scoping-optional) shows.

**Platforms.**

| Platform              | Record and replay | Per-test checks (`KEPLOY_PROVEN=1`) | Notes                                                    |
| --------------------- | ----------------- | ----------------------------------- | -------------------------------------------------------- |
| Linux                 | Yes               | Yes                                 | Keploy's agent runs as root; Keploy starts it with sudo. |
| macOS (Apple silicon) | Yes               | Yes                                 | No sudo or admin rights needed.                          |
| Docker                | Yes               | Not yet                             | Pass a `docker run` or `docker compose` command.         |
| Windows               | Coming soon       | Coming soon                         | Native Windows support, VS Code included, is coming.     |

**Dependencies** in Keploy 3.9.4. "Docker" means: run the tests through a
Docker command so Keploy reads the calls on Linux.

| Dependency             | Linux | macOS  |
| ---------------------- | ----- | ------ |
| HTTP and HTTPS, HTTP/2 | Yes   | Yes    |
| gRPC                   | Yes   | Yes    |
| PostgreSQL             | Yes   | Yes    |
| MySQL                  | Yes   | Yes    |
| MongoDB                | Yes   | Yes    |
| Amazon DynamoDB        | Yes   | Yes    |
| Aerospike              | Yes   | Yes    |
| Couchbase              | Yes   | Yes    |
| Memcached              | Yes   | Yes    |
| Apache HBase           | Yes   | Yes    |
| Apache ZooKeeper       | Yes   | Yes    |
| Redis                  | Yes   | Docker |
| Kafka                  | Yes   | Docker |
| Apache Pulsar          | Yes   | Docker |
| Amazon SQS             | Yes   | Docker |

A call to any other TCP service is saved as raw bytes. It replays only when
your tests send exactly the same bytes again.

## Use it from VS Code

The [Keploy VS Code extension](/docs/running-keploy/utg-vscode-extension/)
installs the Keploy CLI, signs you in, and hands the project setup to your
coding agent. Then you record, replay and review from the editor.

## Next steps

- [Go quickstart](./quickstarts/go.md): run `go test` without PostgreSQL or an
  HTTP API, then check each test on its own.
- [Python quickstart](./mock-quickstart.md): run `pytest` without the API it
  calls, with no Keploy account.
- [Node.js quickstart](./quickstarts/jest.md): run Jest without the API it
  calls, with no Keploy account.
- [Java quickstart](./quickstarts/java.md): run JUnit tests with `mvn test`
  without the API they call, with no Keploy account.
- [Playwright quickstart](./quickstarts/playwright.md): run a Playwright
  end-to-end suite without the API your web app calls, with no Keploy account.
- [Docker Compose quickstart](./quickstarts/docker-compose.md): record the
  PostgreSQL and Redis calls of a `pytest` suite, then run it with the compose
  stack down.
- [Mock your own tests](./mock-your-tests.md): every option, per-test checks,
  CI, and sharing with your team.
- [keploy.yml and keploy.lock](./guides/keploy-yml-and-lock.md): what to
  commit, and how the lock pins your recordings.
- [Partial re-record](./guides/partial-re-record.md): record a new test, or
  re-record a changed one, without running the whole suite again.
- [Network isolation](./guides/network-isolation.md): what a replay keeps
  from the real network, and how to let a call out on purpose.
- [Times, dates and ids that change](./guides/changing-values.md): what a
  replay does when a test sends a value that is new on every run.
- [Features](./features.md): every capability, with a link to the page that
  shows it.
- [Troubleshooting](./troubleshooting.md): what a failing record or replay
  prints, and how to fix it.
- [CLI commands](/docs/running-keploy/cli-commands/): the full `keploy` command
  list.
