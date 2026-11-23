---
id: partial-re-record
title: Re-record only the tests that changed
sidebar_label: Partial re-record
description: Record a new test, or re-record a test whose calls changed, without running the whole suite against the real dependencies again. keploy.lock keeps every other test's recording. Replay a few tests, and see what a branch re-records with keploy mock diff. Every output is from Keploy 3.9.4.
tags:
  - mocks
  - keploy.lock
  - re-record
keywords:
  - partial re-record
  - re-record one test
  - keploy mock record
  - keploy mock diff
  - keploy.lock
  - KEPLOY_PROVEN
  - service virtualization
---

# Re-record only the tests that changed

A large suite can take hours to run against the real dependencies. When you add
a test, or change what one test calls, re-record only that test. `keploy.lock`
keeps the recordings of all the other tests as they were.

Partial re-record uses `keploy.lock`, so it runs with `KEPLOY_PROVEN=1`.
Without it, a record replaces the whole mock set: see
[Without KEPLOY_PROVEN](#without-keploy_proven).

Every output here is from Keploy 3.9.4 on Linux, with the recordings in Keploy
Cloud (the last section keeps them in the repository). The output is trimmed: timestamps, run folders and lines that don't
matter are cut.

## The example

The Go project of the
[keploy.yml and keploy.lock guide](./keploy-yml-and-lock.md): an `orders`
package that reads an order from PostgreSQL and a rate from a rates API on
`localhost:8090`. Each test starts with `defer keploytest.T(t)()`, from
`github.com/keploy/go-sdk/v3/keploytest`.

- `keploy.yml` holds `mock.command: go test -p 1 -count=1 -json ./...` and the
  app's id.
- `keploy.lock` is committed on `main`. It pins two tests, `TestTotalInUSD` and
  `TestTotalInEUR`, and the start-up recording.
- The work happens on a git branch, `add-gbp`.

## Record a new test on its own

1. Add the new test. Here it is `TestTotalInGBP`, in `gbp_test.go`:

   ```go
   func TestTotalInGBP(t *testing.T) {
   	defer keploytest.T(t)()
   	s := newService(t)
   	got, err := s.TotalIn(context.Background(), 1, "GBP")
   	if err != nil {
   		t.Fatal(err)
   	}
   	if got != 35 {
   		t.Fatalf("total = %v, want 35", got)
   	}
   }
   ```

2. Commit the test. A record made from uncommitted changes says so, because
   its recording matches the code only once they are committed.

   ```bash
   git add gbp_test.go
   git commit -m "add TestTotalInGBP"
   ```

3. Start the real dependencies: PostgreSQL and the rates API.

4. Record only the new test. Pass your test runner's own filter in `-c`. For
   `go test`, that is `-run`:

   ```bash
   KEPLOY_PROVEN=1 keploy mock record -c 'go test -p 1 -count=1 -json -run TestTotalInGBP ./...'
   ```

   ```text
   🐰 Keploy: INFO  pulled set "orders" pinned by …/keploy.lock: 2 tests, 0 cases; recordings 3 fetched, 0 cached, 0 skipped by keploy.lock and not fetched; packs 3 fetched, 0 cached  {"mock-set": "orders"}
   🐰 Keploy: INFO  wrote per-test mock mappings  {"tests": 1, "mock-set": "orders"}
   🐰 Keploy: INFO  recorded mocks  {"mocks": 5, "mock-set": "orders"}
   keploy: judging round F (go test -p 1 -count=1 -json -run TestTotalInGBP ./...): 1 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-F.log
   keploy: judging round C (go test -p 1 -count=1 -json ./...): 3 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-C.log
   keploy: TestTotalInEUR runs 26.8s after its recording in every replay, CI's too, because newer tests run before it (it began before TestTotalInGBP in its recording); the confirming round ran it so and it passed, so it is kept; re-record it to bring it back in step
   keploy: TestTotalInUSD runs 26.8s after its recording in every replay, CI's too, because newer tests run before it (it began before TestTotalInGBP in its recording); the confirming round ran it so and it passed, so it is kept; re-record it to bring it back in step
   keploy: keploy.lock: re-recorded .::.::TestTotalInGBP (1), kept 3, start-up kept; recordings 1 uploaded, 0 already on the server; packs 1 uploaded, 0 already on the server
   keploy: commit keploy.lock with your change
   ```

   What happened:

   - Keploy first pulled the recordings `keploy.lock` pins.
   - It ran your command against the real dependencies. Only
     `TestTotalInGBP` ran, so only its calls were recorded.
   - Round F replayed your command on the new recording.
   - Round C, the confirming round, replayed the project's whole
     `mock.command` on the recordings: the new test and the two kept ones.
   - `kept 3, start-up kept`: the lock's other three entries, the start-up
     recording and the two older tests, stay as they were.

5. Check what changed. `git status` shows only `keploy.lock`, and its diff adds
   one entry:

   ```bash
   git diff keploy.lock
   ```

   ```diff
    .::.::TestTotalInEUR:
      digest: sha256:5d823464e0b8101b7a19b1ef89e3f32b20a7b03c57dc28e331626efbab080c55  # 2026-11-20T07:31Z linux keploy 3.9.4 at fa76803aa924

   +.::.::TestTotalInGBP:
   +  digest: sha256:f28fd422e9a2e2e9aec1a58c80029b8503c69ad14943c1df2cf4f6a487615a07  # 2026-11-20T07:32Z linux keploy 3.9.4 at d81fc8be7614
   +
    .::.::TestTotalInUSD:
      digest: sha256:490212b12a9f6c5d619416a1d089bac8304ca62bc98b85952d83719d25d0567d  # 2026-11-20T07:31Z linux keploy 3.9.4 at fa76803aa924
   ```

6. Commit `keploy.lock`:

   ```bash
   git add keploy.lock
   git commit -m "record TestTotalInGBP"
   ```

### When older tests now run later

`go test` runs `gbp_test.go` before `orders_test.go`, so the new test runs
first. The two older tests now start later in the run than they did in their
recording: Keploy says each runs 26.8 seconds after its recording, in every
replay, CI's too. The confirming round ran them that way and they passed, so
Keploy kept them.

A test that checks how old a recorded time is can fail by that gap. To bring
a test back in step, re-record it too. See
[Times, dates and ids that change](./changing-values.md).

## Re-record a test whose calls changed

Here `TestTotalInEUR` changes: it now adds an order and prices that one.

1. Change the test, and commit the change:

   ```diff
    func TestTotalInEUR(t *testing.T) {
    	defer keploytest.T(t)()
    	s := newService(t)
   -	got, err := s.TotalIn(context.Background(), 2, "EUR")
   +	_, err := s.DB.Exec(`INSERT INTO orders VALUES (3, 2500, 'USD')
   +		ON CONFLICT (id) DO NOTHING`)
   +	if err != nil {
   +		t.Fatal(err)
   +	}
   +	got, err := s.TotalIn(context.Background(), 3, "EUR")
    	if err != nil {
    		t.Fatal(err)
    	}
   -	if got != 10 {
   -		t.Fatalf("total = %v, want 10", got)
   +	if got != 20 {
   +		t.Fatalf("total = %v, want 20", got)
    	}
    }
   ```

2. With the dependencies stopped, replay. The changed test fails, because its
   recording doesn't hold the new `INSERT`:

   ```bash
   KEPLOY_PROVEN=1 keploy mock replay
   ```

   ```text
   keploy: orders: 3 test(s) ran: 2 passed, 1 failed (1 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
   FAILED_BY_KEPLOY  .::TestTotalInEUR (failed): keploy/unmocked_call
     MISS  PostgreSQL INSERT INTO orders VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING to [::1]:5432  x1  match stopped at no_schema_candidates
     UNCONSUMED  mock-5: recorded for this test, never called
     UNCONSUMED  mock-6: recorded for this test, never called
   VERDICT  failed: keploy held evidence against 1 test that ran: a call it could not answer or capture, or a recorded call left unmade
   NEXT  re-record: KEPLOY_PROVEN=1 keploy mock record
   ```

   The `NEXT` line re-records the whole suite. You only need the failed test.

3. Start the dependencies again.

4. Re-record only `TestTotalInEUR`:

   ```bash
   KEPLOY_PROVEN=1 keploy mock record -c 'go test -p 1 -count=1 -json -run TestTotalInEUR ./...'
   ```

   ```text
   keploy: judging round F (go test -p 1 -count=1 -json -run TestTotalInEUR ./...): 1 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-F.log
   keploy: judging round C (go test -p 1 -count=1 -json ./...): 3 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-C.log
   keploy: TestTotalInUSD runs 26.8s after its recording in every replay, CI's too, because newer tests run before it (it began before TestTotalInGBP in its recording); the confirming round ran it so and it passed, so it is kept; re-record it to bring it back in step
   keploy: keploy.lock: re-recorded .::.::TestTotalInEUR (1), kept 3, start-up kept; recordings 1 uploaded, 0 already on the server; packs 1 uploaded, 0 already on the server
   keploy: commit keploy.lock with your change
   ```

   `TestTotalInEUR` is no longer in the note: its new recording was made after
   `TestTotalInGBP`'s.

5. Check the lock. Only the changed test's digest is new:

   ```bash
   git diff keploy.lock
   ```

   ```diff
    .::.::TestTotalInEUR:
   -  digest: sha256:5d823464e0b8101b7a19b1ef89e3f32b20a7b03c57dc28e331626efbab080c55  # 2026-11-20T07:31Z linux keploy 3.9.4 at fa76803aa924
   +  digest: sha256:da6acd9d8efaf6a7ce2b9185d7d96286b2da5b05f5553e557f661d668044621a  # 2026-11-20T07:33Z linux keploy 3.9.4 at 4cfb96b38d00

    .::.::TestTotalInGBP:
      digest: sha256:f28fd422e9a2e2e9aec1a58c80029b8503c69ad14943c1df2cf4f6a487615a07  # 2026-11-20T07:32Z linux keploy 3.9.4 at d81fc8be7614
   ```

6. Commit `keploy.lock`, then stop the dependencies and replay the whole
   suite:

   ```bash
   git add keploy.lock
   git commit -m "re-record TestTotalInEUR"
   KEPLOY_PROVEN=1 keploy mock replay
   ```

   ```text
   🐰 Keploy: INFO  mock replay summary  {"loaded": 14, "consumed": 12, "missed": 0}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "orders", "served": 12}
   keploy: orders: 3 test(s) ran: 3 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
   VERDICT  passed
   ```

## Replay only some tests

To replay a few tests, pass your test runner's filter in `-c`, as for the
record:

```bash
KEPLOY_PROVEN=1 keploy mock replay -c 'go test -p 1 -count=1 -json -run TestTotalInEUR ./...'
```

```text
🐰 Keploy: INFO  mock replay summary  {"loaded": 14, "consumed": 5, "missed": 0}
keploy: orders: 1 test(s) ran: 1 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
SUBSET  this replay ran go test -p 1 -count=1 -json -run TestTotalInEUR ./..., not the project's mock.command (go test -p 1 -count=1 -json ./...): keploy's verdict is on the tests it ran alone; 2 recorded test(s) not run, neither failed nor missing: TestTotalInGBP, TestTotalInUSD; it changed no skip, published no recording and left the set's last replay as it was
VERDICT  passed
```

The verdict covers only the tests that ran. A replay with no `-c`, as in CI,
runs `mock.command`, so every test.

With `KEPLOY_PROVEN=1`, `--run-only` is refused:

```text
Error: --run-only is not used with KEPLOY_PROVEN: select the tests with your own test command; keploy skips only the tests verdicts.yaml quarantines
```

## See what a branch re-records

`keploy mock diff` compares `keploy.lock` with the one at the merge base of
your branch. Here, `add-gbp` against `origin/main`:

```bash
KEPLOY_PROVEN=1 keploy mock diff
```

```text
e2e tests keploy.lock pins vs 13cad7974eec, the merge base with origin/main
changed  ./.::TestTotalInEUR  cases +0 -0 ~0  mocks +2 -1 ~1
added    ./.::TestTotalInGBP  cases +0 -0 ~0  mocks +3 -0 ~0
```

`--markdown` prints the same as a table for a pull request comment:

```bash
KEPLOY_PROVEN=1 keploy mock diff --markdown
```

```text
**e2e tests** keploy.lock vs 13cad7974eec, the merge base with origin/main — 1 changed, 1 added, 0 removed

| set | test | status | cases | mocks |
|---|---|---|---|---|
| . | .::TestTotalInEUR | changed | +0 -0 ~0 | +2 -1 ~1 |
| . | .::TestTotalInGBP | added | +0 -0 ~0 | +3 -0 ~0 |
```

`TestTotalInUSD` isn't listed: the branch kept its recording.

## Without KEPLOY_PROVEN

Without `KEPLOY_PROVEN=1`, a record writes the whole mock set again: a record
of one test leaves only that test's calls. Here the same project keeps its
recordings in the repository (`--local`):

1. A record of the whole suite writes 10 mocks:

   ```bash
   keploy mock record --local -c 'go test -p 1 -count=1 ./...'
   ```

   ```text
   🐰 Keploy: INFO  recorded mocks  {"mocks": 10, "mock-set": "default"}
   ```

2. A record of `TestTotalInGBP` alone replaces them with its 5:

   ```bash
   keploy mock record --local -c 'go test -p 1 -count=1 -run TestTotalInGBP ./...'
   ```

   ```text
   🐰 Keploy: INFO  recorded mocks  {"mocks": 5, "mock-set": "default"}
   ```

3. A replay of the whole suite then fails the two other tests:

   ```bash
   keploy mock replay --local -c 'go test -p 1 -count=1 ./...'
   ```

   ```text
   --- FAIL: TestTotalInUSD (0.00s)
   --- FAIL: TestTotalInEUR (0.00s)
   FAIL	example.com/orders	0.255s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 5, "consumed": 4, "missed": 2}
   ```

In this mode, re-record the whole suite. To re-record a few tests at a time,
use `KEPLOY_PROVEN=1` and `keploy.lock`.

## In short

| You want to                          | Run (`KEPLOY_PROVEN=1`)                                    |
| ------------------------------------ | ---------------------------------------------------------- |
| Record a new test                    | `keploy mock record -c '<your command, filtered to it>'`   |
| Re-record a test whose calls changed | `keploy mock record -c '<your command, filtered to it>'`   |
| Replay a few tests                   | `keploy mock replay -c '<your command, filtered to them>'` |
| See which tests a branch re-records  | `keploy mock diff`, or `keploy mock diff --markdown`       |
| Replay every test, as CI does        | `keploy mock replay`                                       |

Commit `keploy.lock` after each record.

## See also

- [keploy.yml and keploy.lock](./keploy-yml-and-lock.md): what the lock pins,
  and how to make the first one.
- [Times, dates and ids that change](./changing-values.md): tests that check
  the clock.
- [Troubleshooting](../troubleshooting.md#a-call-has-no-recording): what a
  replay prints when a call has no recording.
- [Reference](../reference.md#keploy-mock-diff): every flag of
  `keploy mock diff`, `record` and `replay`.
