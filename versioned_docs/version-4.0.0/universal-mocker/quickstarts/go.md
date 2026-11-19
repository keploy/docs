---
id: go
title: "Go quickstart: run go test without PostgreSQL or an HTTP API"
sidebar_label: Go (go test)
description: Record the PostgreSQL queries and HTTP calls a Go test suite makes with keploy mock record, then run the same go test with both dependencies switched off. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - go
  - quickstart
keywords:
  - keploy mock go
  - go test mock postgres
  - mock http api go test
  - service virtualization go
  - keploytest
---

# Go quickstart: run go test without PostgreSQL or an HTTP API

In this quickstart, you build a small Go package whose tests read PostgreSQL
and call an exchange-rates API. You record those calls once, with both
dependencies up. Then you run the same `go test` with both of them switched
off, and the tests still pass.

You don't write any mock code, and the tests don't change.

Every output on this page comes from a real run of Keploy 3.9.3 on Linux. Long
log lines are trimmed and timestamps are removed.

## Before you begin

You need:

- Linux. Keploy's agent runs as root, so Keploy may ask for your `sudo`
  password.
- [Go](https://go.dev/dl/) 1.21 or newer.
- [Docker](https://docs.docker.com/get-docker/), to run PostgreSQL.
- Keploy. To install it, run:

  ```bash
  source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
  ```

  For other ways to install it, see [Installation](/docs/server/installation/).

## Step 1: Create the sample package

1. Create a folder, a git repository and a Go module:

   ```bash
   mkdir orders && cd orders
   git init
   go mod init example.com/orders
   ```

2. Save this as `orders.go`. `TotalIn` reads an order from PostgreSQL, asks the
   rates API for an exchange rate, and returns the converted total:

   ```go
   // Package orders prices an order in another currency. The order comes from
   // PostgreSQL and the exchange rate from a rates API.
   package orders

   import (
   	"context"
   	"database/sql"
   	"encoding/json"
   	"fmt"
   	"net/http"
   )

   type Service struct {
   	DB       *sql.DB
   	RatesURL string
   }

   // TotalIn returns the order's total, converted to currency.
   func (s *Service) TotalIn(ctx context.Context, orderID int, currency string) (float64, error) {
   	var cents int
   	var from string
   	err := s.DB.QueryRowContext(ctx,
   		"SELECT amount_cents, currency FROM orders WHERE id = $1", orderID).Scan(&cents, &from)
   	if err != nil {
   		return 0, fmt.Errorf("order %d: %w", orderID, err)
   	}

   	url := fmt.Sprintf("%s/rates?from=%s&to=%s", s.RatesURL, from, currency)
   	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
   	if err != nil {
   		return 0, err
   	}
   	resp, err := http.DefaultClient.Do(req)
   	if err != nil {
   		return 0, err
   	}
   	defer resp.Body.Close()
   	if resp.StatusCode != http.StatusOK {
   		return 0, fmt.Errorf("rates API: %s", resp.Status)
   	}
   	var rate struct {
   		Rate float64 `json:"rate"`
   	}
   	if err := json.NewDecoder(resp.Body).Decode(&rate); err != nil {
   		return 0, err
   	}
   	return float64(cents) / 100 * rate.Rate, nil
   }
   ```

3. Save this as `orders_test.go`. Each test creates the table and its rows,
   then checks one total:

   ```go
   package orders

   import (
   	"context"
   	"database/sql"
   	"testing"

   	_ "github.com/lib/pq"
   )

   func newService(t *testing.T) *Service {
   	db, err := sql.Open("postgres",
   		"postgres://postgres:postgres@localhost:5432/postgres?sslmode=disable")
   	if err != nil {
   		t.Fatal(err)
   	}
   	t.Cleanup(func() { db.Close() })

   	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS orders (
   		id int PRIMARY KEY, amount_cents int NOT NULL, currency text NOT NULL)`)
   	if err != nil {
   		t.Fatal(err)
   	}
   	_, err = db.Exec(`INSERT INTO orders VALUES (1, 4000, 'EUR'), (2, 1250, 'USD')
   		ON CONFLICT (id) DO NOTHING`)
   	if err != nil {
   		t.Fatal(err)
   	}
   	return &Service{DB: db, RatesURL: "http://localhost:8090"}
   }

   func TestTotalInUSD(t *testing.T) {
   	s := newService(t)
   	got, err := s.TotalIn(context.Background(), 1, "USD")
   	if err != nil {
   		t.Fatal(err)
   	}
   	if got != 50 {
   		t.Fatalf("total = %v, want 50", got)
   	}
   }

   func TestTotalInEUR(t *testing.T) {
   	s := newService(t)
   	got, err := s.TotalIn(context.Background(), 2, "EUR")
   	if err != nil {
   		t.Fatal(err)
   	}
   	if got != 10 {
   		t.Fatalf("total = %v, want 10", got)
   	}
   }
   ```

4. Save this as `cmd/rates/main.go`. It stands in for a real exchange-rates
   API:

   ```go
   // A stand-in for a real exchange-rates API.
   package main

   import (
   	"encoding/json"
   	"log"
   	"net/http"
   )

   var rates = map[string]float64{"EUR-USD": 1.25, "USD-EUR": 0.8, "EUR-GBP": 0.875}

   func main() {
   	http.HandleFunc("/rates", func(w http.ResponseWriter, r *http.Request) {
   		pair := r.URL.Query().Get("from") + "-" + r.URL.Query().Get("to")
   		rate, ok := rates[pair]
   		if !ok {
   			http.Error(w, "unknown pair "+pair, http.StatusNotFound)
   			return
   		}
   		json.NewEncoder(w).Encode(map[string]float64{"rate": rate})
   	})
   	log.Println("rates API on :8090")
   	log.Fatal(http.ListenAndServe(":8090", nil))
   }
   ```

5. Add the PostgreSQL driver:

   ```bash
   go get github.com/lib/pq@v1.10.9
   go mod tidy
   ```

## Step 2: Run the tests against the real dependencies

1. Start PostgreSQL:

   ```bash
   docker run -d --name orders-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
   ```

   Then wait until it accepts connections. The first start takes a few
   seconds:

   ```bash
   until docker exec orders-db pg_isready -q -h 127.0.0.1 -U postgres; do sleep 1; done
   ```

2. In a second terminal, in the `orders` folder, start the rates API:

   ```bash
   go run ./cmd/rates
   ```

3. Back in the first terminal, run the tests:

   ```bash
   go test -count=1 ./...
   ```

   ```
   ok  	example.com/orders	0.031s
   ?   	example.com/orders/cmd/rates	[no test files]
   ```

`-count=1` turns off Go's test cache. Without it, `go test` can print a cached
result and skip the tests, and then there are no calls to record or replay.

## Step 3: Record the calls

Run the same test command under `keploy mock record`:

```bash
keploy mock record --local -c "go test -count=1 ./..."
```

```
🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "go", "args": 3}
🐰 Keploy: INFO  Starting Application :  {"program": "go", "args": 3}
ok  	example.com/orders	0.035s
?   	example.com/orders/cmd/rates	[no test files]
🐰 Keploy: INFO  recorded mocks  {"mocks": 10, "mock-set": "default"}
🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
```

`--local` keeps the recording in your repository, so you don't need a Keploy
account for this quickstart. Without `--local`, Keploy asks you to sign in
first.

Keploy wrote four files:

- `keploy.yml`, the project's Keploy settings. It holds the app name and the
  test command.
- `keploy/default/mocks.yaml`, the recording: 10 mocks, 8 for PostgreSQL (the
  connections and each statement) and 2 HTTP calls, each with its answer.
- `keploy/default/last-record.yaml`, the command Keploy recorded this set with.
  `keploy mock status` replays the recording with it.
- `keploy/.gitignore`, which keeps Keploy's temporary files out of git.

Here is one HTTP call from `mocks.yaml`, trimmed:

```yaml
kind: Http
name: mock-4
spec:
  metadata:
    destAddr: "[::1]:8090"
    operation: GET
    type: HTTP_CLIENT
  req:
    method: GET
    url: /rates?from=EUR&to=USD
    header:
      Host: localhost:8090
  resp:
    status_code: 200
    body: |
      {"rate":1.25}
```

## Step 4: Replay with the dependencies off

1. Stop PostgreSQL:

   ```bash
   docker rm -f orders-db
   ```

2. Stop the rates API with <kbd>Ctrl</kbd>+<kbd>C</kbd> in the second terminal.

3. Run the tests on their own. They fail, because nothing answers:

   ```bash
   go test -count=1 ./...
   ```

   ```
       orders_test.go:22: dial tcp [::1]:5432: connect: connection refused
   FAIL
   FAIL	example.com/orders	0.005s
   ```

4. Run them under `keploy mock replay`:

   ```bash
   keploy mock replay --local -c "go test -count=1 ./..."
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "go", "args": 3, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "go", "args": 3}
   ok  	example.com/orders	0.163s
   ?   	example.com/orders/cmd/rates	[no test files]
   🐰 Keploy: INFO  mock replay summary  {"loaded": 10, "consumed": 8, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 8}
   ```

The tests pass with no database and no rates API running. Keploy answered every
call from the recording.

## Step 5: Add a test, and see a call with no recording

1. Add this test at the end of `orders_test.go`:

   ```go
   func TestTotalInGBP(t *testing.T) {
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

2. Replay again, with the dependencies still off:

   ```bash
   keploy mock replay --local -c "go test -count=1 ./..."
   ```

   ```
   --- FAIL: TestTotalInGBP (0.02s)
       orders_test.go:27: pq: keploy-pg-v3: no recorded invocation matched (hash=…e6592f0c76da currentTest= binds=6); …
   FAIL
   FAIL	example.com/orders	0.228s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 10, "consumed": 8, "missed": 1}
     Mock mismatch: [PostgreSQL] INSERT INTO orders VALUES ($1, $2, $3), ($4, $5, $6)
   		ON CONFLICT (id) DO NOTHING  →  [::1]:5432
     Hint: The 2 recorded invocation(s) of this SQL available at this point of the run were all already served: the application ran it more times here than the recording holds. If the extra call is intended, re-record the mock set with 'keploy mock record'; otherwise find what makes the application repeat it.
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   ```

   The new test runs the `INSERT` a third time, and the recording holds it
   twice. Keploy doesn't send the call to the real database. It fails the run,
   names the call, and says what to do. The exit code is the test command's, so
   CI fails too.

3. Start the dependencies again, as in [Step 2](#step-2-run-the-tests-against-the-real-dependencies),
   and record again:

   ```bash
   keploy mock record --local -c "go test -count=1 ./..."
   ```

   ```
   ok  	example.com/orders	0.088s
   🐰 Keploy: INFO  recorded mocks  {"mocks": 15, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   ```

   A new record replaces the set, so the recording always matches the tests
   you have now.

4. Stop the dependencies, as in Step 4, and replay:

   ```bash
   keploy mock replay --local -c "go test -count=1 ./..."
   ```

   ```
   ok  	example.com/orders	0.221s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 15, "consumed": 12, "missed": 0}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 12}
   ```

## Step 6: Check each test on its own

So far, Keploy answers the calls of the whole run. With `KEPLOY_PROVEN=1`,
it also knows where each test starts and ends. It then gives each test only the
calls that test recorded, replays every test before it keeps the recording, and
reports a result per test.

1. Add Keploy's Go package:

   ```bash
   go get github.com/keploy/go-sdk/v3@v3.1.3
   ```

2. In `orders_test.go`, import it, and make `defer keploytest.T(t)()` the first
   line of each test:

   ```go
   import (
   	"context"
   	"database/sql"
   	"testing"

   	"github.com/keploy/go-sdk/v3/keploytest"
   	_ "github.com/lib/pq"
   )
   ```

   ```go
   func TestTotalInUSD(t *testing.T) {
   	defer keploytest.T(t)()
   	s := newService(t)
   	// ...the rest of the test is unchanged
   }
   ```

   Do the same in `TestTotalInEUR` and `TestTotalInGBP`. Outside Keploy, the
   line does nothing, so `go test` works as before.

3. In `keploy.yml`, replace the `mock:` block with this one. It adds the command
   Keploy runs the tests with:

   ```yaml
   mock:
     name: default
     command: go test -p 1 -count=1 -json ./...
     local: true
   ```

   `-p 1` runs one test binary at a time, which per-test checks need in this
   release. `-json` shows each test's result, and the reason for a skip. It
   also makes `go test` print a JSON line for each test event, so the
   outputs below leave those lines out and show Keploy's own.
   `local: true` keeps the recording in the repository, as `--local` did.

4. Start the dependencies again, as in Step 2. Then delete the old recording,
   and record:

   ```bash
   rm -rf keploy
   export KEPLOY_PROVEN=1
   keploy mock record
   ```

   ```
   🐰 Keploy: INFO  wrote per-test mock mappings  {"tests": 3, "mock-set": "default"}
   🐰 Keploy: INFO  recorded mocks  {"mocks": 15, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   keploy: judging round F (go test -p 1 -count=1 -json ./...): 3 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-F.log
   keploy: judging round C (go test -p 1 -count=1 -json ./...): 3 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-C.log
   keploy: committed keploy/default and its verdicts.yaml: 3 replayable, 0 quarantined
   ```

   After the record, Keploy replayed the tests twice with the dependencies off
   (the judging rounds). All 3 replayed, so it kept all 3. A test that doesn't
   replay is set aside in `keploy/default/verdicts.yaml`, with the reason and
   the fix.

5. Ask Keploy what to do next:

   ```bash
   keploy mock status
   ```

   ```
   === KEPLOY NEXT ===
   phase:    recorded
   summary:  1 recording(s); not yet proven to run with the dependencies off: default (never replayed on this machine).
   ask:      Prove it offline? I'll replay the tests with every dependency switched off; any call the recording does not have fails the run.
   run:      KEPLOY_PROVEN=1 keploy mock replay --local -c 'go test -p 1 -count=1 -json ./...' --on-miss fail
   ```

   `keploy mock status` always prints a `NEXT` block like this one: where things
   stand, and the command to run next. Coding agents read it too.

6. Stop the dependencies, and replay:

   ```bash
   keploy mock replay
   ```

   ```
   🐰 Keploy: INFO  mock replay summary  {"loaded": 15, "consumed": 12, "missed": 0}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 12}
   keploy: default: 3 test(s) ran: 3 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
   MOCKED  .::TestTotalInUSD: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
   MOCKED  .::TestTotalInUSD: [::1]:8090 (mocked: if this is your app, start it from the runner, then re-record)
   MOCKED  .::TestTotalInEUR: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
   MOCKED  .::TestTotalInGBP: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
   VERDICT  passed
   ```

   Each `MOCKED` line names a connection a test opened that Keploy answered.
   The EUR and GBP tests reuse the HTTP connection the USD test opened, so only
   the USD test lists port 8090.

7. Make a test fail on purpose. In `TestTotalInUSD`, change both `50`s to `51`,
   then replay:

   ```bash
   keploy mock replay
   ```

   ```
   keploy: default: 3 test(s) ran: 2 passed, 1 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
   FAILED  .::TestTotalInUSD: the test failed
   VERDICT  failed: the test command exited 1
   ```

   Keploy names the test that failed, and exits with the test command's code.
   Change the `51`s back to `50`.

## Step 7: Commit the recording

Commit `keploy.yml` and the `keploy/` folder with your code:

```bash
git status --short
```

```
?? cmd/
?? go.mod
?? go.sum
?? keploy.yml
?? keploy/
?? orders.go
?? orders_test.go
```

`keploy/default/` holds the recording (`mocks.yaml`), which recorded calls
belong to each test (`mappings.yaml`), each test's result from the judging
rounds (`verdicts.yaml`), the record command (`last-record.yaml`) and a
`README.md`. Commit them all.

Keploy also writes `.keploy-run/`, with the logs of each run. Its own
`.gitignore` keeps it out of git.

Now anyone can run `KEPLOY_PROVEN=1 keploy mock replay` on a clone, with no
PostgreSQL and no rates API, and CI can too.

## Clean up

Step 6 stopped PostgreSQL and the rates API, so nothing is left running.
Delete the `orders` folder when you no longer need it.

## Next steps

- [Run the replay in CI, and share recordings with your team](../mock-your-tests.md#proven-ci).
  With a Keploy account, recordings live in Keploy Cloud, and the repository
  keeps only `keploy.yml` and `keploy.lock`.
- [Use the VS Code extension](/docs/running-keploy/utg-vscode-extension/) to
  record and replay from your editor.
- [Learn every option of `keploy mock`](../mock-your-tests.md).
