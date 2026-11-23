---
id: changing-values
title: Times, dates and ids that change
sidebar_label: Values that change
description: What keploy mock replay does when your tests send values that change on every run, such as the time, today's date, random ids in a header, a body or a path, and a token that expires, in a replay of the whole run and in a replay that checks each test on its own. Every output is from Keploy 3.9.4.
tags:
  - mocks
  - replay
  - noise
keywords:
  - keploy mock replay
  - changing values
  - timestamps
  - generated ids
  - random ids
  - token expiry
  - freeze time
  - KEPLOY_PROVEN
  - service virtualization
---

# Times, dates and ids that change

Your tests send values that change on every run: the time, today's date, a
random id. The recording holds the values of the run that recorded it. This
page shows what `keploy mock replay` does when a value is new, in its two
modes: a replay of the whole run, and a replay that checks each test on its
own (`KEPLOY_PROVEN=1`).

Every output here is from Keploy 3.9.4 on Linux, in a Go project whose tests
call an orders API on `localhost:8092`, with the recordings kept in the
repository (`--local`). The output is trimmed: timestamps and lines that
don't matter are cut.

## The example

Each test sends a value that is new on every run:

| Test                     | What changes on every run                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| `TestQuote`              | The time, in seconds, in the query: `GET /quote?item=book&at=1795156553`.                              |
| `TestDailyReport`        | Today's date in the query: `GET /report?day=2026-11-20`.                                               |
| `TestStock`              | A random `X-Request-Id` header.                                                                        |
| `TestCreateOrder`        | A random order id in the JSON body of `POST /orders`.                                                  |
| `TestCreateThenGetOrder` | A random order id, sent in the body of `POST /orders` and then in the path of `GET /orders/{id}`.      |
| `TestToken`              | Nothing it sends. It checks that the token the API returns hasn't expired. The token lasts 10 seconds. |

Two of the tests:

```go
// A new random id, sent in a body and then used again in a path.
func TestCreateThenGetOrder(t *testing.T) {
	id := newID()
	body, _ := json.Marshal(map[string]string{"id": id, "item": "book"})
	req, _ := http.NewRequest(http.MethodPost, api+"/orders", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	var created struct{ ID string }
	call(t, req, http.StatusCreated, &created)
	var o struct{ ID, Item string }
	get(t, api+"/orders/"+id, &o)
	if o.ID != id || o.Item != "book" {
		t.Fatalf("got %+v, want order %s for a book", o, id)
	}
}

// A token the test checks has not expired.
func TestToken(t *testing.T) {
	var tok struct {
		Token     string
		ExpiresAt int64
	}
	get(t, api+"/token", &tok)
	now := time.Now().Unix()
	t.Logf("now %d, the token expires at %d", now, tok.ExpiresAt)
	if now >= tok.ExpiresAt {
		t.Fatalf("the token expired %d s ago", now-tok.ExpiresAt)
	}
}
```

`newID` returns `ord-` and 16 random hex digits. `TestQuote` logs the time it
asks for.

## A replay of the whole run

1. Start the orders API, and record:

   ```bash
   keploy mock record --local -c "go test -count=1 -v ./..."
   ```

   ```text
   === RUN   TestQuote
       values_test.go:47: asked for the price at 1795156553
   --- PASS: TestQuote (0.00s)
   …
   === RUN   TestToken
       values_test.go:83: now 1795156553, the token expires at 1795156563
   --- PASS: TestToken (0.00s)
   …
   ok  	example.com/values	0.008s
   🐰 Keploy: INFO  recorded mocks  {"mocks": 7, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   ```

2. Stop the API, wait 20 seconds, and replay:

   ```bash
   keploy mock replay --local -c "go test -count=1 -v ./..."
   ```

   ```text
   === RUN   TestQuote
       values_test.go:47: asked for the price at 1795156578
   --- PASS: TestQuote (0.00s)
   === RUN   TestDailyReport
   --- PASS: TestDailyReport (0.00s)
   === RUN   TestStock
   --- PASS: TestStock (0.00s)
   === RUN   TestToken
       values_test.go:83: now 1795156578, the token expires at 1795156563
       values_test.go:85: the token expired 15 s ago
   --- FAIL: TestToken (0.00s)
   === RUN   TestCreateOrder
   --- PASS: TestCreateOrder (0.00s)
   === RUN   TestCreateThenGetOrder
       values_test.go:112: got {ID:ord-dcce109751713323 Item:book}, want order ord-8ab071aa4d5a130a for a book
   --- FAIL: TestCreateThenGetOrder (0.00s)
   FAIL
   🐰 Keploy: INFO  mock replay summary  {"loaded": 7, "consumed": 7, "missed": 0}
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "the test command failed"}
   ```

What happened to each value:

- **New values in a call:** `TestQuote` asked for a time 25 seconds after the
  recorded one, `TestStock` sent a new request id, and `TestCreateOrder` sent
  a new order id. The replay answered each call from the recording, and the
  tests passed. `TestDailyReport` ran on the day it was recorded, so its date
  was the same.
- **An id used again later:** `TestCreateThenGetOrder` asked for
  `GET /orders/ord-8ab071aa4d5a130a`. The replay answered with the order the
  recording has, `ord-dcce109751713323`, and the summary counts the call as
  answered (`"missed": 0`). In this mode, Keploy 3.9.4 doesn't check that an
  id in the path matches the recorded one. The test caught it because it
  checks the id in the answer. Check the ids your tests get back.
- **The clock:** in this mode, Keploy 3.9.4 doesn't shift the clock of a
  `go test` run. `TestToken` read the real time, so the recorded token had
  expired. `--freeze-time=false` gives the same result:

  ```bash
  keploy mock replay --local --freeze-time=false -c "go test -count=1 -v ./..."
  ```

  ```text
  === RUN   TestToken
      values_test.go:83: now 1795156581, the token expires at 1795156563
      values_test.go:85: the token expired 18 s ago
  --- FAIL: TestToken (0.00s)
  ```

  A test that compares a recorded expiry with the clock fails in this mode
  once that lifetime has passed.

## A replay that checks each test on its own

With `KEPLOY_PROVEN=1`, Keploy knows where each test starts and ends. The
record then replays every test before it keeps the recording, learns which
values change, and sets aside a test that still fails. Each replay runs a test
on a clock shifted back to when that test was recorded.

1. Set the project up as
   [Step 6 of the Go quickstart](../quickstarts/go.md#step-6-check-each-test-on-its-own)
   does: add `defer keploytest.T(t)()` as the first line of each test, and put
   the test command in `keploy.yml`:

   ```yaml
   mock:
     name: default
     command: go test -p 1 -count=1 -json ./...
     local: true
   ```

2. Start the orders API, delete the old recording, and record:

   ```bash
   rm -rf keploy
   export KEPLOY_PROVEN=1
   keploy mock record
   ```

   ```text
   🐰 Keploy: INFO  wrote per-test mock mappings  {"tests": 6, "mock-set": "default"}
   🐰 Keploy: INFO  recorded mocks  {"mocks": 7, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   keploy: judging round F (go test -p 1 -count=1 -json ./...): running; its output: …/round-F.log
   keploy: TestCreateOrder: learned 1 field on 1 mock: 1 echo
   keploy: TestCreateThenGetOrder: learned 2 fields on 2 mocks: 2 variable places
   keploy: TestQuote: learned 1 field on 1 mock: 1 echo
   keploy: every field round F learned (4): …/round-F-learned.txt
   keploy: judging round F (go test -p 1 -count=1 -json ./...): 5 passed, 1 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-F.log
   keploy: judging round C (go test -p 1 -count=1 -json ./...): 5 passed, 0 failed, 0 skipped by the test, 1 skipped by keploy; its output: …/round-C.log
     QUARANTINED TestToken: flaky/replay_only: it failed with every call answered; rounds: record passed, full failed, confirm skipped
     FIX flaky/replay_only: it failed on replay with every call answered: the app is nondeterministic (the clock, randomness), or a real dependency's state changed since it was recorded; fix that, then re-record
   keploy: committed keploy/default and its verdicts.yaml: 5 replayable, 1 quarantined (1 flaky/replay_only)
   ```

   The judging rounds replayed the tests with the API off. Round F learned
   the values that changed:

   - **echo:** a value that belongs to one call, such as an id the API sends
     back in its answer: here the time in `TestQuote` and the order id in
     `TestCreateOrder`. A replay accepts a new value there.
   - **variable places:** a value that appears in more than one call. In
     `TestCreateThenGetOrder`, the id sent in `POST /orders` is the id in the
     path of `GET /orders/{id}`. A replay takes the new id from the first
     call, expects it in the later one, and answers with it.

   `TestToken` failed in round F with every call answered, so the record set
   it aside (quarantined it) in `keploy/default/verdicts.yaml`.

3. Ask Keploy about a test:

   ```bash
   keploy mock explain --local TestCreateThenGetOrder
   ```

   ```text
   .::TestCreateThenGetOrder (keploy/default)
     asked as: TestCreateThenGetOrder, the one test of the set with that name
     status: runs: no verdicts.yaml entry skips it
     recorded calls (2):
       mock-5 Http POST /orders to [::1]:8092 (mocks.yaml:256); follows: id
       mock-6 Http GET /orders/{} to [::1]:8092 (mocks.yaml:310); follows: id
     …
   ```

   `follows: id` marks a call that carries the id the test sends.

4. Stop the API, and replay:

   ```bash
   keploy mock replay --local -c "go test -p 1 -count=1 -v ./..." --on-miss fail
   ```

   ```text
   === RUN   TestQuote
   🐰 Keploy(agent): INFO  .::TestQuote runs 665.272887ms after its recorded begin: the app read a later instant before it began (outside every test, or in the test before it), and the run's clock never moves back  {"test": ".::TestQuote", …}
       values_test.go:49: asked for the price at 1795156591
   --- PASS: TestQuote (0.01s)
   …
   === RUN   TestToken
       values_test.go:81: keploy: quarantined (flaky/replay_only) in keploy/default/verdicts.yaml since 2026-11-20; it runs again once a keploy mock record of it replays in rounds that agree, or keploy mock quarantine --undo takes the entry away (keploy mock judge keeps it: one clean run cannot show what varied is fixed)
   --- SKIP: TestToken (0.00s)
   === RUN   TestCreateOrder
   --- PASS: TestCreateOrder (0.00s)
   === RUN   TestCreateThenGetOrder
   --- PASS: TestCreateThenGetOrder (0.00s)
   PASS
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 6}
   🐰 Keploy(agent): INFO  the run fell up to 673.182778ms behind its recording; tests that check a recorded token's or cache's age against the clock can fail when 673.182778ms exceeds that lifetime  {"behind": "673.182778ms", "test": ".::TestStock"}
   keploy: default: 5 test(s) ran: 5 passed, 0 failed (0 held by keploy), 0 skipped by the test; 1 quarantined (skipped by keploy)
   …
   VERDICT  passed
   ```

   `TestQuote` asked for the price at the recorded time, `1795156591`, about
   40 seconds before the replay ran: its clock was shifted back to when it
   was recorded. `TestCreateThenGetOrder` sent a new id, and passed. The
   quarantined `TestToken` was skipped.

   This replay ran `-v` in place of the `-json` in `keploy.yml`, to show each
   test's lines. Keploy says so on a `SUBSET` line and leaves the set's last
   replay as it was. Run it with no `-c` to replay with `mock.command`.

### A test Keploy quarantined

`keploy mock explain` says why a test is set aside, and how to run it again:

```bash
keploy mock explain --local TestToken
```

```text
.::TestToken (keploy/default)
  status: quarantined: keploy mock replay skips it, because its verdicts.yaml entry applies
  class/reason: flaky/replay_only
  why: it failed with every call answered; rounds: record passed, full failed, confirm skipped
  …
  to take it out of the list: delete its entry (keploy/default/verdicts.yaml, lines 9-18): keploy mock replay then runs the test, and a record quarantines it again only if it fails again
```

A quarantined test isn't run in CI. To run the quarantined tests too, add
`--all`:

```bash
KEPLOY_PROVEN=1 keploy mock replay --all
```

## Values in the answers

A replay of the whole run returns each answer as it was recorded. A value the
service made, such as the order's creation time or the token's expiry, is the
recorded value: in both of those replays above, `TestToken` got the recorded
expiry, `1795156563`.

A replay that checks each test on its own puts the new value of a learned
field into the answer. The answer to `GET /orders/{id}` held the new id, so
`TestCreateThenGetOrder` passed. Every other value in an answer is the
recorded one.

## In short

| Value                                                | A replay of the whole run                                          | A replay that checks each test on its own                                                              |
| ---------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| A new time, request id or body id                    | Answered from the recording.                                       | Answered. A value the API sends back is learned at record (`echo`).                                    |
| An id the test sends, then uses again                | Answered with the recorded call, even for a different id.          | Learned at record (`variable places`): the replay expects the new id in each call.                     |
| A test that compares an answer's time with the clock | Reads the real clock: fails once the recorded lifetime has passed. | Runs on a clock shifted back to its recording. A test that fails in the judging rounds is quarantined. |

## See also

- [Times and ids your app makes](./declared-rules.md#times-and-ids-your-app-makes):
  how a time in a MongoDB call is checked, and the `clock` and `minted` rules
  of `keploy.yml`.
- [Network isolation in replay](./network-isolation.md): what a replay keeps
  from the real network.
- [A call has no recording](../troubleshooting.md#a-call-has-no-recording):
  what a replay prints when a call doesn't match the recording.
- [Reference](../reference.md#keploy-mock-replay): `--freeze-time` and the
  other replay flags.
