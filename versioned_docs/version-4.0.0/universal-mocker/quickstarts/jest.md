---
id: jest
title: "Node.js quickstart: run Jest without the API it calls"
sidebar_label: Node.js (Jest)
description: Record the HTTP calls a Jest suite makes with keploy mock record, then run the same tests with the API switched off. No Keploy account needed. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - node.js
  - jest
  - quickstart
keywords:
  - keploy mock jest
  - keploy mock node
  - mock http api jest
  - mock fetch jest
  - service virtualization node.js
---

# Node.js quickstart: run Jest without the API it calls

In this quickstart, you build a small Node.js app whose tests call a users API
with `fetch`. You record those calls once, with the API up. Then you run the
same Jest tests with the API switched off, and the tests still pass.

You don't write any mock code, and the tests don't change. You don't need a
Keploy account either: the recording stays in your repository.

Every output on this page comes from a real run of Keploy 3.9.4 on Linux.
Some of Keploy's log lines are left out, long lines are trimmed (`…`), and
timestamps are removed.

## Before you begin

You need:

- Linux. Keploy's agent runs as root, so Keploy may ask for your `sudo`
  password.
- [Node.js](https://nodejs.org/en/download) 22 or newer, with npm.
- Keploy. To install it, run:

  ```bash
  source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
  ```

  For other ways to install it, see [Installation](/docs/server/installation/).

## Step 1: Create the sample app

1. Create a folder and a git repository:

   ```bash
   mkdir billing-node && cd billing-node && git init
   ```

2. Save this as `users-api.js`. It stands in for an external users API that
   your app calls:

   ```javascript
   // A stand-in for an external users API. It listens on port 8085.
   const http = require("node:http");

   const USERS = {
     1: {id: 1, name: "Ada Lovelace", plan: "pro"},
     2: {id: 2, name: "Alan Turing", plan: "free"},
   };
   const PLANS = {free: {price: 0}, pro: {price: 20}};

   http
     .createServer((req, res) => {
       const [kind, key] = req.url.split("/").filter(Boolean);
       const table = {users: USERS, plans: PLANS}[kind] || {};
       const item = Object.hasOwn(table, key) ? table[key] : undefined;
       res.writeHead(item ? 200 : 404, {"Content-Type": "application/json"});
       res.end(JSON.stringify(item || {error: "not found"}));
     })
     .listen(8085, "127.0.0.1");
   ```

3. Save this as `billing.js`. It's your app: `monthlyBill` looks a user up in
   the users API and formats their bill:

   ```javascript
   // A small billing app. It calls an external users API.
   const USERS_API = "http://127.0.0.1:8085";

   async function get(path) {
     const res = await fetch(USERS_API + path);
     if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
     return res.json();
   }

   // Look up a user and format their monthly bill.
   async function monthlyBill(userId) {
     const user = await get(`/users/${userId}`);
     const price = user.plan === "pro" ? 20 : 0;
     return `${user.name} (${user.plan}): $${price}/month`;
   }

   module.exports = {get, monthlyBill};
   ```

4. Save this as `billing.test.js`. These are your tests:

   ```javascript
   const billing = require("./billing");

   test("pro user bill", async () => {
     expect(await billing.monthlyBill(1)).toBe("Ada Lovelace (pro): $20/month");
   });

   test("free user bill", async () => {
     expect(await billing.monthlyBill(2)).toBe("Alan Turing (free): $0/month");
   });
   ```

5. Install Jest, and keep `node_modules` out of git:

   ```bash
   npm init -y >/dev/null
   npm install --save-dev --no-audit --no-fund jest
   printf 'node_modules/\n' > .gitignore
   ```

## Step 2: Run the tests against the real API

1. In a second terminal, in the `billing-node` folder, start the users API:

   ```bash
   node users-api.js
   ```

2. Back in the first terminal, run the tests:

   ```bash
   npx jest
   ```

   ```
   PASS ./billing.test.js
     ✓ pro user bill (15 ms)
     ✓ free user bill (3 ms)
   Test Suites: 1 passed, 1 total
   Tests:       2 passed, 2 total
   Snapshots:   0 total
   Time:        0.257 s
   Ran all test suites.
   ```

## Step 3: Record the calls

Run the same test command under `keploy mock record`:

```bash
keploy mock record --local -c "npx jest"
```

```
🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "npx", "args": 1}
🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 1}
PASS ./billing.test.js
  ✓ pro user bill (19 ms)
  ✓ free user bill (6 ms)
Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.211 s, estimated 1 s
Ran all test suites.
🐰 Keploy: INFO  recorded mocks  {"mocks": 2, "mock-set": "default"}
🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
```

`--local` keeps the recording in your repository, so you don't need a Keploy
account for this quickstart. Without `--local`, Keploy asks you to sign in
first.

Keploy wrote four files:

- `keploy.yml`, the project's Keploy settings. It holds the app name and the
  test command.
- `keploy/default/mocks.yaml`, the recording: the 2 calls to the users API,
  each with its answer.
- `keploy/default/last-record.yaml`, the command Keploy recorded this set with.
  `keploy mock status` replays the recording with it.
- `keploy/.gitignore`, which keeps Keploy's temporary files out of git.

Here is the first call in `mocks.yaml`, trimmed:

```yaml
kind: Http
name: mock-0
spec:
  metadata:
    destAddr: 127.0.0.1:8085
    operation: GET
    type: HTTP_CLIENT
  req:
    method: GET
    url: /users/1
    header:
      Host: 127.0.0.1:8085
      User-Agent: node
  resp:
    status_code: 200
    body: '{"id":1,"name":"Ada Lovelace","plan":"pro"}'
```

## Step 4: Replay with the API off

1. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd> in the second terminal.

2. Run the tests on their own. They fail, because nothing answers:

   ```bash
   npx jest
   ```

   ```
   FAIL ./billing.test.js
     ✕ pro user bill (10 ms)
     ✕ free user bill (1 ms)
     ● pro user bill
       TypeError: fetch failed
   …
       Cause:
           connect ECONNREFUSED 127.0.0.1:8085
   …
   Test Suites: 1 failed, 1 total
   Tests:       2 failed, 2 total
   Snapshots:   0 total
   Time:        0.204 s, estimated 1 s
   Ran all test suites.
   ```

3. Run them under `keploy mock replay`:

   ```bash
   keploy mock replay --local -c "npx jest"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "npx", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 1}
   PASS ./billing.test.js
     ✓ pro user bill (13 ms)
     ✓ free user bill (4 ms)
   Test Suites: 1 passed, 1 total
   Tests:       2 passed, 2 total
   Snapshots:   0 total
   Time:        0.175 s, estimated 1 s
   Ran all test suites.
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 2}
   ```

The tests pass with no users API running. Keploy answered every call from the
recording.

## Step 5: Add a call the recording doesn't have

1. Add this function at the end of `billing.js`. It calls a new endpoint,
   `/plans/<plan>`:

   ```javascript
   // Look up the monthly price of a plan.
   async function planPrice(plan) {
     return (await get(`/plans/${plan}`)).price;
   }

   module.exports.planPrice = planPrice;
   ```

2. Add this test at the end of `billing.test.js`:

   ```javascript
   test("pro plan price", async () => {
     expect(await billing.planPrice("pro")).toBe(20);
   });
   ```

3. Replay again, with the API still off:

   ```bash
   keploy mock replay --local -c "npx jest"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "npx", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 1}
   FAIL ./billing.test.js
     ✓ pro user bill (18 ms)
     ✓ free user bill (4 ms)
     ✕ pro plan price (3 ms)
     ● pro plan price
       HTTP 502 Bad Gateway
   …
   Test Suites: 1 failed, 1 total
   Tests:       1 failed, 2 passed, 3 total
   Snapshots:   0 total
   Time:        0.342 s, estimated 1 s
   Ran all test suites.
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 1}
   🐰 Keploy: WARN  no recorded mock matched an outgoing call  {"protocol": "HTTP", "call": "GET /{}/{}", …}
     Mock mismatch: [HTTP] GET /plans/pro [path tag #…]  →  127.0.0.1:8085
     Hint: Only values drifted (path). If the change is expected, re-record the mock set with 'keploy mock record', or, with the dependency reachable, capture the new calls with 'keploy mock replay --on-miss record'. …
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "the test command failed"}
   ```

   The recording has no `/plans/pro` call. Keploy doesn't send the call to the
   real API. It answers it with `502 Bad Gateway`, fails the run, names the
   call, and says what to do. The exit code is the test command's, so CI fails
   too.

4. Start the users API again in the second terminal:

   ```bash
   node users-api.js
   ```

5. Record again, so the recording has the new call too:

   ```bash
   keploy mock record --local -c "npx jest"
   ```

   ```
   🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "npx", "args": 1}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 1}
   PASS ./billing.test.js
     ✓ pro user bill (22 ms)
     ✓ free user bill (6 ms)
     ✓ pro plan price (5 ms)
   Test Suites: 1 passed, 1 total
   Tests:       3 passed, 3 total
   Snapshots:   0 total
   Time:        0.206 s, estimated 1 s
   Ran all test suites.
   🐰 Keploy: INFO  recorded mocks  {"mocks": 3, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   ```

   A new record replaces the recording, so it always matches the tests you
   have now.

6. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd>, and replay:

   ```bash
   keploy mock replay --local -c "npx jest"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "npx", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 1}
   PASS ./billing.test.js
     ✓ pro user bill (23 ms)
     ✓ free user bill (13 ms)
     ✓ pro plan price (5 ms)
   Test Suites: 1 passed, 1 total
   Tests:       3 passed, 3 total
   Snapshots:   0 total
   Time:        0.266 s, estimated 1 s
   Ran all test suites.
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 3}
   ```

   All three tests pass from the recording, with no users API running.

:::caution Record again to add calls from a Node.js app
The [Python quickstart](../mock-quickstart.md) adds a new call with
`keploy mock replay --on-miss record` instead. In Keploy 3.9.4, don't do that
in a Node.js app that calls with `fetch`: the call it adds has no
`Content-Length`, so later replays never end its answer, and the test times
out. Record again, as this step does.
:::

## Step 6: See a failing test fail the run

1. In `billing.test.js`, change `$20/month` to `$25/month`.

2. Replay, and print the exit code:

   ```bash
   keploy mock replay --local -c "npx jest"
   echo "exit code: $?"
   ```

   ```
   FAIL ./billing.test.js
     ✕ pro user bill (27 ms)
     ✓ free user bill (5 ms)
     ✓ pro plan price (3 ms)
     ● pro user bill
       expect(received).toBe(expected) // Object.is equality
       Expected: "Ada Lovelace (pro): $25/month"
       Received: "Ada Lovelace (pro): $20/month"
   …
   Test Suites: 1 failed, 1 total
   Tests:       1 failed, 2 passed, 3 total
   Snapshots:   0 total
   Time:        0.316 s, estimated 1 s
   Ran all test suites.
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   exit code: 1
   ```

   Jest shows the value it expected and the value it received. The summary
   shows no missed call, so every call was answered from the recording, and
   the failure is in the code or the test. Keploy exits with the test
   command's exit code, so a failing test fails your CI job.

3. Change `$25/month` back to `$20/month`.

## Step 7: Commit the recording

Commit `keploy.yml` and the `keploy/` folder with your code:

```bash
git add . && git status --short
```

```
A  .gitignore
A  billing.js
A  billing.test.js
A  keploy.yml
A  keploy/.gitignore
A  keploy/default/last-record.yaml
A  keploy/default/mocks.yaml
A  package-lock.json
A  package.json
A  users-api.js
```

`keploy/default/` holds the recording (`mocks.yaml`) and the record command
(`last-record.yaml`). The other files in `keploy/default/`, such as
`last-replay.yaml`, are run files from this machine's last replay:
`keploy/.gitignore` keeps them out of git, so `git add .` skips them.

Commit what `git add` staged:

```bash
git commit -m "Add billing tests and their Keploy recording"
```

Now anyone can clone the project, install its dependencies with `npm ci`, and
run `keploy mock replay --local -c "npx jest"` with no users API. CI can too.

## Clean up

Step 5 stopped the users API, so nothing is left running. Delete the
`billing-node` folder when you no longer need it.

## Next steps

- [Python quickstart](../mock-quickstart.md): the same loop with `pytest`,
  and `--on-miss record` to add a new call.
- [Playwright quickstart](./playwright.md): the same loop with an
  end-to-end suite that drives your web app in a browser.
- [Java quickstart](./java.md): the same loop with JUnit 5 and Maven.
- [Go quickstart](./go.md): a sample with PostgreSQL and an HTTP API, and a
  check of each test on its own.
- [Run the replay in CI, and share recordings with your team](../mock-your-tests.md#proven-ci).
  With a Keploy account, recordings live in Keploy Cloud, and the repository
  keeps only `keploy.yml` and `keploy.lock`.
- [keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md): what to
  commit when your recordings live in Keploy Cloud.
- [Learn every option of `keploy mock`](../mock-your-tests.md).
