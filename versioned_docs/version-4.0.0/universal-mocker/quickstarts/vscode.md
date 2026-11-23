---
id: vscode
title: "VS Code quickstart: record and replay a Go test suite from your editor"
sidebar_label: VS Code
description: Record the PostgreSQL queries and HTTP calls of a Go test suite from the Keploy VS Code extension, then replay the same tests from VS Code with both dependencies switched off. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - vscode
  - go
  - quickstart
keywords:
  - keploy vs code quickstart
  - vscode mock dependencies
  - record and replay tests in vscode
  - service virtualization vscode
  - mock postgres go test
  - keploy mock record
---

# VS Code quickstart: record and replay a Go test suite from your editor

In this quickstart, you record the calls a Go test suite makes to PostgreSQL
and to an HTTP API, from the Keploy VS Code extension. Then you switch both off
and replay the same tests from VS Code, and they still pass.

You add one line to each test and write a two-line `keploy.yml`. The recording
goes to Keploy Cloud, and your repository keeps two small files:
`keploy.yml` and `keploy.lock`.

Every output on this page comes from a real run of version 3.1.1 of the
extension and Keploy 3.9.4, the CLI it downloads, on Linux. Some of Keploy's
log lines and the JSON lines of `go test -json` are left out, long lines are
trimmed (`…`), and timestamps are removed.

To let your coding agent do the setup instead, follow the
[VS Code walkthrough](../walkthroughs/vscode.md).

## Before you begin

You need:

- VS Code 1.125 or later, on Linux. The extension's
  [requirements](/docs/running-keploy/utg-vscode-extension/#requirements) list
  the Linux versions that work.
- [Go](https://go.dev/dl/) 1.21 or newer.
- [Docker](https://docs.docker.com/get-docker/), to run PostgreSQL.
- An empty repository on your Git host, such as GitHub or GitLab, to push the
  sample to.
- A free Keploy account. You sign in from the extension in Step 4.

You don't need to install Keploy yourself: the extension downloads it. Keploy's
agent runs as root on Linux, so a record or a replay may ask for your `sudo`
password in its terminal.

## Step 1: Create the sample package

1. Create the `orders` package as
   [Step 1 of the Go quickstart](./go.md#step-1-create-the-sample-package)
   shows: its folder, git repository and module, `orders.go`,
   `orders_test.go`, the rates API in `cmd/rates/main.go`, and the PostgreSQL
   driver.

2. Add Keploy's Go package:

   ```bash
   go get github.com/keploy/go-sdk/v3@v3.1.3
   ```

3. In `orders_test.go`, import it, and make `defer keploytest.T(t)()` the first
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

   Do the same in `TestTotalInEUR`. The line tells Keploy where each test
   starts and ends, so Keploy gives each test only the calls it recorded.
   Outside Keploy, it does nothing, so `go test` works as before.

4. Save this as `keploy.yml` in the `orders` folder:

   ```yaml
   mock:
     command: go test -p 1 -count=1 -json ./...
   ```

   `command` is the test command Keploy runs. `-p 1` runs one test binary at a
   time, which per-test checks need in this release. `-json` shows Keploy each
   test's result. `-count=1` turns off Go's test cache, so the tests always run
   and make their calls.

5. Commit, and push to your repository. Use your repository's URL:

   ```bash
   git add -A
   git commit -m "Add the orders package"
   git branch -M main
   git remote add origin <your repository's URL>
   git push -u origin main
   ```

   Keploy Cloud names the app after the repository, and lists each recording
   under the git branch it was made on.

## Step 2: Start the dependencies

1. Start PostgreSQL, and wait until it accepts connections:

   ```bash
   docker run -d --name orders-db -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16
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
   ok  	example.com/orders	0.060s
   ?   	example.com/orders/cmd/rates	[no test files]
   ```

## Step 3: Install the extension

1. Open the `orders` folder in VS Code.
2. In the **Extensions** view, search for **Keploy**, and select **Install** on
   **Keploy: API Testing, Mocks & Service Virtualization**. Its ID is
   `keploy.keployio`.
3. Select the **Keploy** icon in the Activity Bar. The **Set up** checklist
   opens.

The extension downloads the Keploy CLI by itself. A notification, **Keploy:
downloading the CLI (3.9.4)**, shows its progress. When it ends, the checklist
ticks **Keploy CLI installed**.

## Step 4: Sign in

1. In the checklist, select **Signed in to Keploy**.
2. VS Code asks whether to open `https://app.keploy.io/activate`. Select
   **Open**.
3. In your browser, sign in, type the code the **Keploy sign-in** notification
   in VS Code shows, and approve the sign-in.

VS Code says **Keploy: you are signed in.**, and the checklist ticks **Signed
in to Keploy**. The [walkthrough's Step 3](../walkthroughs/vscode.md#step-3-sign-in)
shows these screens.

The checklist also shows **Project set up by your agent** ticked. You did that
part yourself in Step 1, when you wrote `keploy.yml`.

## Step 5: Record

PostgreSQL and the rates API from Step 2 must still be running.

1. Open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and
   run **Keploy: Record**.

2. You're on `main`, so the extension says:

   ```text
   Keploy records on a work branch, not on main: the default branch's recordings change only through merges, so CI replays what was reviewed.
   ```

   Select **Create keploy/orders and record**. The extension creates the
   branch `keploy/orders`, switches to it, and records there.

3. The record runs `keploy mock record --lock keploy.lock` in a terminal,
   with `KEPLOY_PROVEN=1`. It runs `go test` with PostgreSQL and the rates API
   up, and ends like this:

   ```text
    *  Executing task: …/.keploy/bin/keploy mock record --lock keploy.lock
   🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "orders", "program": "go", "args": 6}
   🐰 Keploy: INFO  recorded mocks  {"mocks": 10, "mock-set": "orders"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   keploy: judging round F (go test -p 1 -count=1 -json ./...): 2 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-F.log
   keploy: judging round C (go test -p 1 -count=1 -json ./...): 2 passed, 0 failed, 0 skipped by the test, 0 skipped by keploy; its output: …/round-C.log
   keploy: keploy.lock: re-recorded .::.::TestTotalInEUR, .::.::TestTotalInUSD (2), kept 0, start-up re-recorded; recordings 3 uploaded, 0 already on the server; packs 3 uploaded, 0 already on the server
   keploy: recorded from uncommitted changes in 1 file(s); the recording matches the code only once you commit them with keploy.lock
   keploy: commit keploy.lock with your change
   keploy: keploy.lock is not listed in Keploy Cloud: the pin of app <app id> is off, so its replays read Keploy branches, which a listed one could change; `KEPLOY_PROVEN=1 keploy mock pin on` turns it on, then `KEPLOY_PROVEN=1 keploy mock register` lists the lock
   keploy: committed keploy/orders and its skip lines (pinned in keploy.lock): 2 replayable, 0 quarantined
   ```

   After the record, Keploy replayed the tests twice with the dependencies off
   (the judging rounds). Both replayed, so it kept both. The checklist says
   **Recorded: 2 tests in Keploy Cloud**.

The record kept every call the tests made, with its answer. It uploaded the
recording to Keploy Cloud, and wrote `keploy.lock`, which pins each test to its
recording. Before the record started, the extension created the app in Keploy
Cloud with `keploy app create`, and the app's ID and name went into
`keploy.yml`. That change is the uncommitted file the record's output counts,
and Step 7 commits it:

```yaml
mock:
  command: go test -p 1 -count=1 -json ./...
  appId: <your app's ID>
appName: <your repository's name>
```

The line that says `keploy.lock` "is not listed" is about the app's recording
pin, which is off for a new app. You don't need it for this quickstart.
[Turn on the app's recording pin](../guides/keploy-yml-and-lock.md#turn-on-the-apps-recording-pin)
explains it.

## Step 6: Replay with the dependencies off

1. Stop PostgreSQL:

   ```bash
   docker rm -f orders-db
   ```

2. Stop the rates API: press <kbd>Ctrl</kbd>+<kbd>C</kbd> in its terminal.

3. Run **Keploy: Replay** from the Command Palette.

   The replay runs `keploy mock replay` in a terminal, with
   `KEPLOY_PROVEN=1`. It reads `keploy.lock`, downloads the recording, runs
   `go test` again, and answers every call the tests make from the recording.
   It ends like this:

   ```text
    *  Executing task: …/.keploy/bin/keploy mock replay
   🐰 Keploy: INFO  pulled set "orders" pinned by …/orders/keploy.lock: 2 tests, 0 cases; recordings 3 fetched, 0 cached, 0 skipped by keploy.lock and not fetched; packs 3 fetched, 0 cached  {"mock-set": "orders"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 10, "consumed": 8, "missed": 0}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "orders", "served": 8}
   keploy: orders: 2 test(s) ran: 2 passed, 0 failed (0 held by keploy), 0 skipped by the test; 0 quarantined (skipped by keploy)
   MOCKED  .::TestTotalInUSD: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
   MOCKED  .::TestTotalInUSD: [::1]:8090 (mocked: if this is your app, start it from the runner, then re-record)
   MOCKED  .::TestTotalInEUR: [::1]:5432 (mocked: if this is your app, start it from the runner, then re-record)
   VERDICT  passed
   RESULT  …/orders/.keploy-run/runs/…/quarantine.yaml

     View test report at: https://app.keploy.io/tr/…
   ```

   `VERDICT  passed` means `go test` exited 0 with no PostgreSQL and no rates
   API running. Each `MOCKED` line names a connection a test opened that
   Keploy answered: port 5432 is PostgreSQL and port 8090 is the rates API.
   The EUR test reuses the HTTP connection the USD test opened, so only the
   USD test lists port 8090. The last line links to the replay's report in
   Keploy Cloud.

   The checklist ticks **Replay green**.

## Step 7: Commit keploy.yml and keploy.lock

1. Run **Keploy: Stage keploy.yml, keploy.lock and the test edits** from the
   Command Palette. A list shows the files to stage, with `keploy.lock` and
   `keploy.yml` picked. Select **OK**.
2. **Source Control** opens with both files staged. When its message box is
   empty, the extension puts `test: record dependency mocks with Keploy` in it.
   Select **Commit**.

These two files are all your repository keeps: the recording itself is in Keploy
Cloud, and `keploy.lock` names it.

## Clean up

Step 6 stopped PostgreSQL and the rates API, so nothing is left running.
Delete the `orders` folder when you no longer need it.

## Next steps

- [VS Code walkthrough](../walkthroughs/vscode.md): let your coding agent set
  up a project, see a red test, and add the CI workflow.
- [Branches and pull requests](../guides/branches-and-prs.md): push
  `keploy/orders`, open a pull request, and merge its recording into main.
- [keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md): what each
  file holds, and what to commit.
- [Run the replay in CI](../guides/ci.md): replay every pull request with no
  dependency running.
