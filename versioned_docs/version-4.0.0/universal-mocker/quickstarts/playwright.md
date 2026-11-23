---
id: playwright
title: "Playwright quickstart: run end-to-end tests without the API your app calls"
sidebar_label: Playwright
description: Record the HTTP calls your web app makes while a Playwright suite drives it in a browser, then run the same npx playwright test with the API switched off. No Keploy account needed. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - node.js
  - playwright
  - end-to-end testing
  - quickstart
keywords:
  - keploy mock playwright
  - mock backend api playwright
  - playwright e2e without backend
  - playwright service virtualization
  - mock http api end-to-end tests
---

# Playwright quickstart: run end-to-end tests without the API your app calls

In this quickstart, you build a small web app that renders its pages from a
users API. A Playwright suite opens those pages in Chromium and checks them. You
record the app's calls to the users API once, with the API up. Then you run the
same Playwright tests with the API switched off, and the tests still pass.

You don't write any mock code, and the tests don't change. You don't need a
Keploy account either: the recording stays in your repository.

Every output on this page comes from a real run of Keploy 3.9.4 and Playwright
1.65.1 on Linux. Some of Keploy's log lines are left out, long lines are trimmed
(`…`), and timestamps are removed.

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
   mkdir billing-web && cd billing-web && git init
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

3. Save this as `app.js`. It's your web app: the page `/bill/<user id>` looks
   the user up in the users API and shows their monthly bill:

   ```javascript
   // A small billing web app on port 3000. It calls an external users API.
   const http = require("node:http");

   const USERS_API = "http://127.0.0.1:8085";

   async function get(path) {
     const res = await fetch(USERS_API + path);
     if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
     return res.json();
   }

   const escape = (s) =>
     String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

   // Each page's text, by the first part of its path.
   const pages = {
     bill: async (userId) => {
       const user = await get(`/users/${userId}`);
       const price = user.plan === "pro" ? 20 : 0;
       return `${user.name} (${user.plan}): $${price}/month`;
     },
   };

   http
     .createServer(async (req, res) => {
       const [page, key] = req.url.split("/").filter(Boolean);
       if (page === "health") return res.end("ok");
       let status = 200;
       let text;
       try {
         text = await pages[page](key);
       } catch (err) {
         status = 500;
         text = err.message;
       }
       const heading = `<h1 id="result">${escape(text)}</h1>`;
       res.writeHead(status, {"Content-Type": "text/html; charset=utf-8"});
       res.end(`<!doctype html><title>Billing</title>${heading}`);
     })
     .listen(3000, "127.0.0.1");
   ```

4. Save this as `playwright.config.js`. Playwright starts the app before the
   tests, and stops it after:

   ```javascript
   const {defineConfig} = require("@playwright/test");

   module.exports = defineConfig({
     testDir: "tests",
     use: {baseURL: "http://127.0.0.1:3000"},
     webServer: {command: "node app.js", url: "http://127.0.0.1:3000/health"},
   });
   ```

5. Create a `tests` folder, and save this in it as `billing.spec.js`. These
   are your tests:

   ```javascript
   const {test, expect} = require("@playwright/test");

   test("pro user bill", async ({page}) => {
     await page.goto("/bill/1");
     await expect(page.locator("#result")).toHaveText(
       "Ada Lovelace (pro): $20/month"
     );
   });

   test("free user bill", async ({page}) => {
     await page.goto("/bill/2");
     await expect(page.locator("#result")).toHaveText(
       "Alan Turing (free): $0/month"
     );
   });
   ```

6. Install Playwright and its Chromium. Then keep `node_modules`, Playwright's
   results and the `/health` file that Keploy saves in Step 3 out of git.
   Playwright may ask for your `sudo` password to install the libraries Chromium
   needs:

   ```bash
   npm init -y >/dev/null
   npm install --save-dev --no-audit --no-fund @playwright/test
   npx playwright install --with-deps chromium
   printf 'node_modules/\ntest-results/\nkeploy/*/tests/get-health-*.yaml\n' > .gitignore
   ```

## Step 2: Run the tests against the real API

1. In a second terminal, in the `billing-web` folder, start the users API:

   ```bash
   node users-api.js
   ```

2. Back in the first terminal, run the tests:

   ```bash
   npx playwright test
   ```

   ```
   Running 2 tests using 1 worker
     ✓  1 tests/billing.spec.js:3:1 › pro user bill (114ms)
     ✓  2 tests/billing.spec.js:10:1 › free user bill (79ms)
     2 passed (870ms)
   ```

## Step 3: Record the calls

Run the same test command under `keploy mock record`:

```bash
keploy mock record --local -c "npx playwright test"
```

```
🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "npx", "args": 2}
🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 2}
🐰 Keploy(agent): INFO  self-call passed through to the run's own listener; the real handler answers it, not a mock  {"destination": "127.0.0.1:3000", …}
🐰 Keploy: INFO  🟠 Keploy has captured test cases for the user's application.  {"path": "…/billing-web/keploy/default/tests", "testcase name": "get-health-1"}
Running 2 tests using 1 worker
  ✓  1 tests/billing.spec.js:3:1 › pro user bill (91ms)
  ✓  2 tests/billing.spec.js:10:1 › free user bill (57ms)
  2 passed (610ms)
🐰 Keploy: INFO  recorded mocks  {"mocks": 2, "mock-set": "default"}
🐰 Keploy: INFO  recorded test cases  {"cases": 1, "mock-set": "default"}
🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
🐰 Keploy(agent): INFO  self-calls passed through to the run's own listeners; the real handler answered them, not a mock  {"calls": 3, "processes": 1, "reason": "loopback_outside_run"}
```

`--local` keeps the recording in your repository, so you don't need a Keploy
account for this quickstart. Without `--local`, Keploy asks you to sign in
first.

Keploy recorded only your app's calls to the users API. Chromium's requests to
your app aren't in the recording: your app runs inside the test command, so
Keploy lets those requests reach it.

Keploy wrote five files:

- `keploy.yml`, the project's Keploy settings. It holds the app name and the
  test command.
- `keploy/default/mocks.yaml`, the recording: the 2 calls your app made to the
  users API, each with its answer.
- `keploy/default/last-record.yaml`, the command Keploy recorded this set with.
  `keploy mock status` replays the recording with it.
- `keploy/.gitignore`, which keeps Keploy's temporary files out of git.
- `keploy/default/tests/get-health-1.yaml`, Playwright's request to `/health`,
  which checks that your app is up. Keploy 3.9.4 saves it as a test case.
  `keploy mock replay` doesn't use it, so the `.gitignore` from Step 1 keeps it
  out of git.

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
   npx playwright test
   ```

   ```
   Running 2 tests using 1 worker
     ✘  1 tests/billing.spec.js:3:1 › pro user bill (5.1s)
     ✘  2 tests/billing.spec.js:10:1 › free user bill (5.1s)
     1) tests/billing.spec.js:3:1 › pro user bill ───…
       Error: expect(locator).toHaveText(expected) failed
       Locator:  locator('#result')
       Expected: "Ada Lovelace (pro): $20/month"
       Received: "fetch failed"
       Timeout:  5000ms
   …
     2) tests/billing.spec.js:10:1 › free user bill ───…
       Error: expect(locator).toHaveText(expected) failed
       Locator:  locator('#result')
       Expected: "Alan Turing (free): $0/month"
       Received: "fetch failed"
       Timeout:  5000ms
   …
     2 failed
       tests/billing.spec.js:3:1 › pro user bill ───…
       tests/billing.spec.js:10:1 › free user bill ───…
   ```

3. Run them under `keploy mock replay`:

   ```bash
   keploy mock replay --local -c "npx playwright test"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "npx", "args": 2, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 2}
   🐰 Keploy(agent): INFO  self-call passed through to the run's own listener; the real handler answers it, not a mock  {"destination": "127.0.0.1:3000", …}
   Running 2 tests using 1 worker
     ✓  1 tests/billing.spec.js:3:1 › pro user bill (123ms)
     ✓  2 tests/billing.spec.js:10:1 › free user bill (74ms)
     2 passed (737ms)
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 2}
   🐰 Keploy(agent): INFO  self-calls passed through to the run's own listeners; the real handler answered them, not a mock  {"calls": 3, "processes": 1, "reason": "loopback_outside_run"}
   ```

The tests pass with no users API running. Playwright still started your app
and drove it in Chromium, and your app answered Chromium's requests itself: the
`self-call` lines count them. Keploy answered the app's calls to the users API
from the recording.

:::note A WARN about certutil
On a machine without `certutil`, Keploy prints a `WARN` that it could not add
its certificate to the database Chromium reads. It matters only for HTTPS calls
that Chromium itself makes: Keploy can't record or mock those until you install
`certutil` (`sudo apt-get install libnss3-tools` on Debian or Ubuntu,
`sudo dnf install nss-tools` on Fedora). In this quickstart, only your app
makes calls, over HTTP, so the tests pass either way.
:::

## Step 5: Add a call the recording doesn't have

1. Add these lines at the end of `app.js`. They add a page, `/plan/<plan>`,
   that calls a new endpoint of the users API:

   ```javascript
   // The plan's monthly price.
   pages.plan = async (plan) =>
     `${plan}: $${(await get(`/plans/${plan}`)).price}/month`;
   ```

2. Add this test at the end of `tests/billing.spec.js`:

   ```javascript
   test("pro plan price", async ({page}) => {
     await page.goto("/plan/pro");
     await expect(page.locator("#result")).toHaveText("pro: $20/month");
   });
   ```

3. Replay again, with the API still off:

   ```bash
   keploy mock replay --local -c "npx playwright test"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "npx", "args": 2, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 2}
   🐰 Keploy(agent): INFO  self-call passed through to the run's own listener; the real handler answers it, not a mock  {"destination": "127.0.0.1:3000", …}
   Running 3 tests using 1 worker
     ✓  1 tests/billing.spec.js:3:1 › pro user bill (140ms)
     ✓  2 tests/billing.spec.js:10:1 › free user bill (80ms)
     ✘  3 tests/billing.spec.js:17:1 › pro plan price (5.1s)
     1) tests/billing.spec.js:17:1 › pro plan price ───…
       Error: expect(locator).toHaveText(expected) failed
       Locator:  locator('#result')
       Expected: "pro: $20/month"
       Received: "HTTP 502 Bad Gateway"
       Timeout:  5000ms
   …
     1 failed
       tests/billing.spec.js:17:1 › pro plan price ───…
     2 passed (5.9s)
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 1}
   🐰 Keploy: WARN  no recorded mock matched an outgoing call  {"protocol": "HTTP", "call": "GET /{}/{}", …}
     Mock mismatch: [HTTP] GET /plans/pro [path tag #…]  →  127.0.0.1:8085
     Hint: Only values drifted (path). If the change is expected, re-record the mock set with 'keploy mock record', or, with the dependency reachable, capture the new calls with 'keploy mock replay --on-miss record'. …
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "the test command failed"}
   ```

   The recording has no `/plans/pro` call. Keploy doesn't send the call to the
   real API. It answers your app with `502 Bad Gateway`, which the new page
   shows, and Playwright fails the test. Keploy fails the run, names the call,
   and says what to do. The exit code is the test command's, so CI fails too.

4. Start the users API again in the second terminal:

   ```bash
   node users-api.js
   ```

5. Record again, so the recording has the new call too:

   ```bash
   keploy mock record --local -c "npx playwright test"
   ```

   ```
   🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "npx", "args": 2}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 2}
   🐰 Keploy(agent): INFO  self-call passed through to the run's own listener; the real handler answers it, not a mock  {"destination": "127.0.0.1:3000", …}
   🐰 Keploy: INFO  🟠 Keploy has captured test cases for the user's application.  {"path": "…/billing-web/keploy/default/tests", "testcase name": "get-health-2"}
   Running 3 tests using 1 worker
     ✓  1 tests/billing.spec.js:3:1 › pro user bill (174ms)
     ✓  2 tests/billing.spec.js:10:1 › free user bill (93ms)
     ✓  3 tests/billing.spec.js:17:1 › pro plan price (85ms)
     3 passed (950ms)
   🐰 Keploy: INFO  recorded mocks  {"mocks": 3, "mock-set": "default"}
   🐰 Keploy: INFO  recorded test cases  {"cases": 1, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   🐰 Keploy(agent): INFO  self-calls passed through to the run's own listeners; the real handler answered them, not a mock  {"calls": 4, "processes": 1, "reason": "loopback_outside_run"}
   ```

   A new record replaces the recording, so it always matches the tests you
   have now.

6. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd>, and replay:

   ```bash
   keploy mock replay --local -c "npx playwright test"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "npx", "args": 2, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "npx", "args": 2}
   🐰 Keploy(agent): INFO  self-call passed through to the run's own listener; the real handler answers it, not a mock  {"destination": "127.0.0.1:3000", …}
   Running 3 tests using 1 worker
     ✓  1 tests/billing.spec.js:3:1 › pro user bill (147ms)
     ✓  2 tests/billing.spec.js:10:1 › free user bill (87ms)
     ✓  3 tests/billing.spec.js:17:1 › pro plan price (76ms)
     3 passed (938ms)
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 3}
   🐰 Keploy(agent): INFO  self-calls passed through to the run's own listeners; the real handler answered them, not a mock  {"calls": 4, "processes": 1, "reason": "loopback_outside_run"}
   ```

   All three tests pass from the recording, with no users API running.

:::caution Record again to add calls from a Node.js app
The [Python quickstart](../mock-quickstart.md) adds a new call with
`keploy mock replay --on-miss record` instead. In Keploy 3.9.4, don't do that
in a Node.js app that calls with `fetch`, as this app does: the call it adds has
no `Content-Length`, so later replays never end its answer, and the test times
out. Record again, as this step does.
:::

## Step 6: See a failing test fail the run

1. In `tests/billing.spec.js`, change `$20/month` to `$25/month` in the first
   test.

2. Replay, and print the exit code:

   ```bash
   keploy mock replay --local -c "npx playwright test"
   echo "exit code: $?"
   ```

   ```
   Running 3 tests using 1 worker
     ✘  1 tests/billing.spec.js:3:1 › pro user bill (5.1s)
     ✓  2 tests/billing.spec.js:10:1 › free user bill (105ms)
     ✓  3 tests/billing.spec.js:17:1 › pro plan price (84ms)
     1) tests/billing.spec.js:3:1 › pro user bill ───…
       Error: expect(locator).toHaveText(expected) failed
       Locator:  locator('#result')
       Expected: "Ada Lovelace (pro): $25/month"
       Received: "Ada Lovelace (pro): $20/month"
       Timeout:  5000ms
   …
     1 failed
       tests/billing.spec.js:3:1 › pro user bill ───…
     2 passed (6.5s)
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   exit code: 1
   ```

   Playwright shows the text it expected and the text the page showed. The
   summary shows no missed call, so every call was answered from the
   recording, and the failure is in the code or the test. Keploy exits with the
   test command's exit code, so a failing test fails your CI job.

3. Change `$25/month` back to `$20/month`.

## Step 7: Commit the recording

Commit `keploy.yml` and the `keploy/` folder with your code:

```bash
git add . && git status --short
```

```
A  .gitignore
A  app.js
A  keploy.yml
A  keploy/.gitignore
A  keploy/default/last-record.yaml
A  keploy/default/mocks.yaml
A  package-lock.json
A  package.json
A  playwright.config.js
A  tests/billing.spec.js
A  users-api.js
```

`keploy/default/` holds the recording (`mocks.yaml`) and the record command
(`last-record.yaml`). `git add .` skips the other files in `keploy/default/`:

- `tests/get-health-2.yaml`, the `/health` request of the last record (each
  record replaces it). The `.gitignore` from Step 1 keeps it out of git.
- Run files from this machine's last replay, such as `last-replay.yaml`.
  `keploy/.gitignore` keeps them out of git.

Commit what `git add` staged:

```bash
git commit -m "Add billing tests and their Keploy recording"
```

Now anyone can clone the project, install its dependencies and Chromium with
`npm ci` and `npx playwright install --with-deps chromium`, and run
`keploy mock replay --local -c "npx playwright test"` with no users API. CI can
too.

## Clean up

Step 5 stopped the users API, and Playwright stops the app after each run, so
nothing is left running. Delete the `billing-web` folder when you no longer
need it.

## Next steps

- [Node.js quickstart](./jest.md): the same loop with Jest and `fetch`, with no
  browser.
- [Python quickstart](../mock-quickstart.md): the same loop with `pytest`,
  and `--on-miss record` to add a new call.
- [Go quickstart](./go.md): a sample with PostgreSQL and an HTTP API, and a
  check of each test on its own.
- [Run the replay in CI](../guides/ci.md), and
  [share recordings with your team](../mock-your-tests.md#proven-team).
  With a Keploy account, recordings live in Keploy Cloud, and the repository
  keeps only `keploy.yml` and `keploy.lock`.
- [keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md): what to
  commit when your recordings live in Keploy Cloud.
- [Learn every option of `keploy mock`](../mock-your-tests.md).
