---
id: features
title: Universal Mocker features
sidebar_label: Features
description: Every capability of Keploy's Universal Mocker (keploy mock), each with a link to the page that shows it. Record and replay any test command, check each test on its own, share recordings through keploy.lock and Keploy branches, re-record one test, keep replays off the real network, and handle values that change.
tags:
  - universal mocker
  - service virtualization
  - mocks
  - keploy mock
  - features
keywords:
  - universal mocker features
  - service virtualization
  - keploy mock
  - keploy.lock
  - partial re-record
  - network isolation
  - KEPLOY_PROVEN
---

# Universal Mocker features

This page lists what Universal Mocker does in Keploy 3.9.13. Each row links to
the page that shows it.

## Record and replay any test command

| Feature                                                                                         | What it does                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Any test command](./overview.md#understand-how-it-works)                                       | Keploy wraps the command that runs your tests: `go test`, `pytest`, `npx jest`, `mvn test`, `npx playwright test`, or a shell script. You write no mock code and change no test.                                                                                                                                                                                                                                                         |
| [Record once](./quickstarts/go.md)                                                              | `keploy mock record` runs your tests against the real dependencies and saves each outgoing call with its answer.                                                                                                                                                                                                                                                                                                                         |
| [Replay with the dependencies off](./mock-quickstart.md)                                        | `keploy mock replay` runs the same command and answers each call from the recording. Your test framework still decides which tests pass.                                                                                                                                                                                                                                                                                                 |
| [A call with no recording gets an error](./mock-your-tests.md#on-miss-policy)                   | A call Keploy can't match to any recording gets an error instead of a real answer (`--on-miss fail`, the default), and the replay names it. By default, the run fails when a test fails on that error, and `--strict` fails it even when no test does: see [A test that doesn't fail on the answer](./guides/network-isolation.md#a-test-that-doesnt-fail-on-the-answer). The note below the table says what else a replay lets through. |
| [Add the calls of a new test](./mock-quickstart.md#step-5-add-a-call-the-recording-doesnt-have) | With `--on-miss record`, a call the recording doesn't have goes to the real dependency, and Keploy adds it to the recording.                                                                                                                                                                                                                                                                                                             |
| [Catch a dependency that changed](./mock-your-tests.md#on-miss-policy)                          | `--strict` fails the run when a call missed its recorded mock, even when the tests passed.                                                                                                                                                                                                                                                                                                                                               |
| [Run with no Keploy account](./mock-quickstart.md)                                              | `--local` keeps the recordings in your repository, so you record and replay without signing in.                                                                                                                                                                                                                                                                                                                                          |
| [Services that Docker Compose starts](./quickstarts/docker-compose.md)                          | Record the calls your tests make to the services in a compose file, then replay them with the compose stack down.                                                                                                                                                                                                                                                                                                                        |

In a replay of the whole run, Keploy 3.9.4 and later can answer a call with a
new id from a similar recorded call and count it as answered: see
[Times, dates and ids that change](./guides/changing-values.md#a-replay-of-the-whole-run).
A DNS lookup the recording doesn't have doesn't fail a replay, and other UDP
(not DNS) isn't intercepted: see
[Network isolation in replay](./guides/network-isolation.md).

## Check each test on its own

These run with `KEPLOY_PROVEN=1` set.

| Feature                                                                                | What it does                                                                                                                                                                          |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Prove each test offline](./mock-your-tests.md#proven)                                 | `keploy mock record` replays every test with the dependencies off before it keeps the recording. A test that doesn't replay is skipped, with Keploy's reason and what to do about it. |
| [Replay each test on its own recording](./mock-your-tests.md#proven)                   | `keploy mock replay` runs the kept tests, each against its own recording. A green replay means every test it ran passed with no real dependency behind it.                            |
| [Mark where each test starts and ends](./mock-your-tests.md#per-test-scoping-optional) | Go tests use `github.com/keploy/go-sdk/v3`, Playwright tests use `@keploy/playwright`, and any other framework makes two HTTP calls per test.                                         |
| [Find out why a test is skipped](./mock-your-tests.md#proven-skips)                    | `keploy mock explain` says why a test is skipped or run. `keploy mock quarantine` skips a test in CI with your reason. `keploy mock replay --all` also runs the skipped tests.        |
| [Judge the recordings again](./reference.md#keploy-mock-judge)                         | `keploy mock judge` judges the recordings again, for example after a Keploy upgrade, and drops the skips of tests that now replay.                                                    |
| [Check a hand edit offline](./reference.md#keploy-mock-check)                          | `keploy mock check` reads the recordings offline and names each mistake with its file, line and fix.                                                                                  |

## Share recordings through Keploy Cloud

Keploy reads and writes `keploy.lock` only with `KEPLOY_PROVEN=1` set, and
Keploy Cloud needs a sign-in.

| Feature                                                                                                  | What it does                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Commit two files](./guides/keploy-yml-and-lock.md#what-to-commit)                                       | The recordings live in Keploy Cloud. Your repository holds only `keploy.yml` and `keploy.lock`.                                                            |
| [Pin each test to its recording](./guides/keploy-yml-and-lock.md#what-it-pins)                           | `keploy.lock` names one recording for each test and one for the start-up, by the `sha256` digest of its bytes, so a recording can't change under the lock. |
| [Keploy branches follow git branches](./guides/branches-and-prs.md)                                      | A record on a git branch lists its `keploy.lock` under a Keploy branch named after it. Keploy never lists a record on main.                                |
| [Merge with the pull request](./guides/branches-and-prs.md#3-merge-the-pull-request)                     | git merges `keploy.lock` with the rest of the change. A green replay of main lists main's lock as Keploy main, in CI with no extra step.                   |
| [Resolve a keploy.lock conflict](./guides/branches-and-prs.md#when-two-branches-re-record-the-same-test) | When two branches re-record the same test, keep one recording. Keploy refuses a lock with conflict markers and says how to resolve it.                     |
| [Turn on the recording pin](./guides/keploy-yml-and-lock.md#turn-on-the-apps-recording-pin)              | `keploy mock pin on` makes every replay of the app read `keploy.lock`.                                                                                     |
| [Publish a staged recording](./guides/keploy-yml-and-lock.md#publish-a-staged-recording)                 | When a record's own publish fails, Keploy keeps the recording in a staging folder and prints the line that publishes it.                                   |
| [Replay a teammate's recordings](./mock-your-tests.md#proven-team)                                       | A teammate signs in, clones the repository and replays. The replay downloads the recordings `keploy.lock` pins.                                            |
| [List a branch's recordings for the dashboard](./reference.md#keploy-mock-register)                      | `keploy mock register` lists `keploy.lock`'s recordings in Keploy Cloud under the git branch.                                                              |
| [Use the mock registry](/docs/keploy-cloud/mock-registry/)                                               | `keploy mock upload` uploads mocks to Keploy's mock registry, and `keploy mock download` downloads them.                                                   |

## Re-record only what changed

These run with `KEPLOY_PROVEN=1` set.

| Feature                                                                                                    | What it does                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| [Record a new test on its own](./guides/partial-re-record.md#record-a-new-test-on-its-own)                 | A record whose `-c` runs one test records only that test. `keploy.lock` keeps every other test's recording.                                 |
| [Re-record a test whose calls changed](./guides/partial-re-record.md#re-record-a-test-whose-calls-changed) | The same filtered record replaces that test's recording, and only its entry in `keploy.lock` changes.                                       |
| [Replay a few tests](./guides/partial-re-record.md#replay-only-some-tests)                                 | A replay whose `-c` runs some tests replays only those.                                                                                     |
| [See what a branch re-records](./guides/partial-re-record.md#see-what-a-branch-re-records)                 | `keploy mock diff` compares `keploy.lock` with the one at your branch's merge base. `--markdown` prints a table for a pull request comment. |

## Keep replays off the real network

| Feature                                                                                                        | What it does                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [What a replay does with each call](./guides/network-isolation.md#what-a-replay-does-with-each-call)           | Keploy answers each recorded call from the recording. By default, a TCP connection the recording doesn't have gets an error instead of reaching the real service, and the replay names it. DNS lookups and UDP work differently: see the next rows and the note below the table. |
| [DNS lookups answered by Keploy](./guides/network-isolation.md#dns-lookups)                                    | Keploy answers a recorded lookup from the recording. By default, it answers any other lookup itself.                                                                                                                                                                             |
| [Let a call out on purpose](./guides/network-isolation.md#let-a-call-out-on-purpose)                           | `--on-miss passthrough`, `--pass-through-ports` and `--allow-egress dns` each let one kind of call reach the real network.                                                                                                                                                       |
| [Tell whether a replay went out](./guides/network-isolation.md#tell-whether-a-replay-reached-the-real-network) | The replay's last line says whether the recording answered every connection the tests opened. It doesn't count lookups sent out with `--allow-egress dns`, or UDP. Each flag that lets something out prints a `real egress opened by` line.                                      |

UDP that isn't DNS, ICMP and raw sockets aren't intercepted. See
[What a replay doesn't intercept](./guides/network-isolation.md#what-a-replay-doesnt-intercept).

## Handle values that change

| Feature                                                                                                        | What it does                                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [New times and request ids](./guides/changing-values.md#a-replay-of-the-whole-run)                             | A replay answers a call whose time or request id is new on this run from the recording.                                                                                      |
| [Ids your test sends, then uses again](./guides/changing-values.md#a-replay-that-checks-each-test-on-its-own)  | With `KEPLOY_PROVEN=1`, Keploy learns at record where an id goes, and the replay expects the new id in each call.                                                            |
| [Calls made outside every test](./guides/background-workers.md#what-a-replay-answers-each-call-with)           | Calls your app makes outside every test, such as in Go's `TestMain`, go to the set's start-up recording. The guide says which test a replay answers each one in.             |
| [Serve a call to every test](./guides/background-workers.md#serve-a-call-to-every-test)                        | A `sessionCalls` entry in `keploy.yml` serves a call your app makes once and keeps, such as fetching a token, to every test.                                                 |
| [A clock shifted back to the recording](./guides/changing-values.md#a-replay-that-checks-each-test-on-its-own) | With `KEPLOY_PROVEN=1`, a test that compares a time with the clock replays on a clock shifted back to its recording. A test that fails in the judging rounds is quarantined. |

## Find out what to run next

| Feature                                                                               | What it does                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`keploy mock status`](./troubleshooting.md#start-with-keploy-mock-status)            | Prints where the project is and the command to run next.                                                                                                                                                                                 |
| [Status as JSON](./reference.md#keploy-mock-status)                                   | `keploy mock status --json` prints the same block and the full mock state as one JSON object, for an editor or a coding agent.                                                                                                           |
| [Replay results](./reference.md#replay-results)                                       | Each replay writes what it proved to `keploy/<set>/last-replay.yaml`.                                                                                                                                                                    |
| [Replay in CI](./guides/ci.md)                                                        | Replays every pull request and push to main with no dependency running on GitHub Actions, GitLab CI, Jenkins, or any other CI, signed in with a read-only CI key, and comments the tests a pull request re-records on GitHub.            |
| [Print the CI recipe](./reference.md#keploy-mock-ci)                                  | `keploy mock ci` prints the replay recipe for the CI your repository runs (`github`, `gitlab`, `jenkins`, or `other`), pinned to your Keploy release, with `--json` for editors and coding agents.                                       |
| [Create a CI key from the terminal](./reference.md#keploy-service-account-key-create) | `keploy service-account key create --role MOCK_READER` creates a read-only CI key for one app once an admin approves it in the browser, and saves it straight to a GitHub secret (`--to-gh-secret`) or a mode `0600` file (`--to-file`). |
| [Fresh browser sign-in](./reference.md#keploy-login)                                  | `keploy login --fresh` starts a new browser sign-in even when already signed in, for actions that require a recent sign-in.                                                                                                              |
| [Your test command's exit code](./reference.md#exit-codes)                            | `keploy mock record` and `keploy mock replay` exit with your test command's own exit code, so a failing test fails your CI job.                                                                                                          |
| [Fixes for each error](./troubleshooting.md)                                          | What a failing record or replay prints, what causes it, and how to fix it.                                                                                                                                                               |

## Run it where you work

| Feature                                                            | What it does                                                                                                                                                                                           |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Linux, macOS and Docker](./overview.md#check-what-it-supports)    | Record and replay on Linux, on macOS on Apple silicon with no sudo, and through a `docker run` or `docker compose` command. Native Windows support is coming.                                          |
| [Databases, queues and APIs](./overview.md#check-what-it-supports) | HTTP, gRPC, PostgreSQL, MySQL, MongoDB, Redis, Kafka and more. The overview lists each one for Linux and macOS.                                                                                        |
| [Notes for each dependency](./guides/dependencies.md)              | Keploy tells dependencies apart by their first bytes, on any port, and reads TLS with its own CA. The page also covers PostgreSQL and MySQL logins, Redis blocking pops and SQS polls at replay.       |
| [VS Code](/docs/running-keploy/utg-vscode-extension/)              | The Keploy VS Code extension installs the Keploy CLI, signs you in, hands the project setup to Claude Code (extension or CLI), GitHub Copilot or Cursor, and wires CI for every project and CI system. |
| [Coding agents](./guides/coding-agents.md)                         | `keploy skill install mock` gives Claude Code, Cursor, Codex, GitHub Copilot or Antigravity the steps to record and replay your tests, following each NEXT block.                                      |
| [Every command and flag](./reference.md)                           | Each `keploy mock` command and flag, the `keploy.yml` keys, the environment variables and the exit codes.                                                                                              |
