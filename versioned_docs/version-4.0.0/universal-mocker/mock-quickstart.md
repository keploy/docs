---
id: mock-quickstart
title: "Python quickstart: run pytest without the API it calls"
sidebar_label: Python (pytest)
description: Record the HTTP calls a pytest suite makes with keploy mock record, then run the same tests with the API switched off. No Keploy account needed. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - python
  - pytest
  - quickstart
keywords:
  - keploy mock quickstart
  - keploy mock pytest
  - mock http api pytest
  - service virtualization python
  - mock record
  - mock replay
---

# Python quickstart: run pytest without the API it calls

In this quickstart, you build a small Python app whose tests call a users API.
You record those calls once, with the API up. Then you run the same `pytest`
with the API switched off, and the tests still pass.

You don't write any mock code, and the tests don't change. You don't need a
Keploy account either: the recording stays in your repository.

Every output on this page comes from a real run of Keploy 3.9.3 on Linux.
Some of Keploy's log lines are left out, long lines are trimmed (`…`), and
timestamps are removed.

## Before you begin

You need:

- Linux. Keploy's agent runs as root, so Keploy may ask for your `sudo`
  password.
- Python 3.10 or newer, with its `venv` module. On Debian and Ubuntu, install
  it with `sudo apt install python3-venv`.
- Keploy. To install it, run:

  ```bash
  source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
  ```

  For other ways to install it, see [Installation](/docs/server/installation/).

## Step 1: Create the sample app

1. Create a folder and a git repository:

   ```bash
   mkdir billing && cd billing && git init
   ```

2. Save this as `users_api.py`. It stands in for an external users API that
   your app calls:

   ```python
   """A stand-in for an external users API. It listens on port 8085."""
   import json
   from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

   USERS = {
       "1": {"id": 1, "name": "Ada Lovelace", "plan": "pro"},
       "2": {"id": 2, "name": "Alan Turing", "plan": "free"},
   }
   PLANS = {"free": {"price": 0}, "pro": {"price": 20}}


   class Handler(BaseHTTPRequestHandler):
       def do_GET(self):
           kind, _, key = self.path.strip("/").partition("/")
           item = {"users": USERS, "plans": PLANS}.get(kind, {}).get(key)
           body = json.dumps(item or {"error": "not found"}).encode()
           self.send_response(200 if item else 404)
           self.send_header("Content-Type", "application/json")
           self.send_header("Content-Length", str(len(body)))
           self.end_headers()
           self.wfile.write(body)

       def log_message(self, *args):
           pass


   try:
       ThreadingHTTPServer(("127.0.0.1", 8085), Handler).serve_forever()
   except KeyboardInterrupt:
       pass
   ```

3. Save this as `billing.py`. It's your app: `monthly_bill` looks a user up in
   the users API and formats their bill:

   ```python
   """A small billing app. It calls an external users API."""
   import json
   import urllib.request

   USERS_API = "http://127.0.0.1:8085"


   def get(path):
       with urllib.request.urlopen(USERS_API + path, timeout=5) as resp:
           return json.load(resp)


   def monthly_bill(user_id):
       """Look up a user and format their monthly bill."""
       user = get(f"/users/{user_id}")
       price = 20 if user["plan"] == "pro" else 0
       return f"{user['name']} ({user['plan']}): ${price}/month"
   ```

4. Save this as `test_billing.py`. These are your tests:

   ```python
   import billing


   def test_pro_user_bill():
       assert billing.monthly_bill(1) == "Ada Lovelace (pro): $20/month"


   def test_free_user_bill():
       assert billing.monthly_bill(2) == "Alan Turing (free): $0/month"
   ```

5. Create a virtual environment, keep it and Python's caches out of git, and
   install pytest:

   ```bash
   python3 -m venv .venv
   printf '.venv/\n__pycache__/\n.pytest_cache/\n' > .gitignore
   source .venv/bin/activate
   pip install --quiet pytest
   ```

## Step 2: Run the tests against the real API

1. In a second terminal, in the `billing` folder, start the users API:

   ```bash
   python3 users_api.py
   ```

2. Back in the first terminal, run the tests:

   ```bash
   python3 -m pytest -q
   ```

   ```
   ..                                                                       [100%]
   2 passed in 0.01s
   ```

## Step 3: Record the calls

Run the same test command under `keploy mock record`:

```bash
keploy mock record --local -c "python3 -m pytest -q"
```

```
🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "python3", "args": 3}
🐰 Keploy: INFO  Starting Application :  {"program": "python3", "args": 3}
..                                                                       [100%]
2 passed in 0.02s
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
  resp:
    status_code: 200
    body: '{"id": 1, "name": "Ada Lovelace", "plan": "pro"}'
```

## Step 4: Replay with the API off

1. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd> in the second terminal.

2. Run the tests on their own. They fail, because nothing answers:

   ```bash
   python3 -m pytest -q
   ```

   ```
   …
   E               urllib.error.URLError: <urlopen error [Errno 111] Connection refused>
   …
   =========================== short test summary info ============================
   FAILED test_billing.py::test_pro_user_bill - urllib.error.URLError: <urlopen ...
   FAILED test_billing.py::test_free_user_bill - urllib.error.URLError: <urlopen...
   2 failed in 0.13s
   ```

3. Run them under `keploy mock replay`:

   ```bash
   keploy mock replay --local -c "python3 -m pytest -q"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "python3", "args": 3, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "python3", "args": 3}
   ..                                                                       [100%]
   2 passed in 0.02s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 2}
   ```

The tests pass with no users API running. Keploy answered every call from the
recording.

## Step 5: Add a call the recording doesn't have

1. Add this function at the end of `billing.py`. It calls a new endpoint,
   `/plans/<plan>`:

   ```python
   def plan_price(plan):
       """Look up the monthly price of a plan."""
       return get(f"/plans/{plan}")["price"]
   ```

2. Add this test at the end of `test_billing.py`:

   ```python
   def test_pro_plan_price():
       assert billing.plan_price("pro") == 20
   ```

3. Replay again, with the API still off:

   ```bash
   keploy mock replay --local -c "python3 -m pytest -q"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "python3", "args": 3, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "python3", "args": 3}
   ..🐰 Keploy(agent): WARN  mock mismatch: no matching mock for outgoing call  {"protocol": "HTTP", "destination": "127.0.0.1:8085", "call": "GET /{}/{}", …}
   F                                                                      [100%]
   …
   E       urllib.error.HTTPError: HTTP Error 502: Bad Gateway
   …
   =========================== short test summary info ============================
   FAILED test_billing.py::test_pro_plan_price - urllib.error.HTTPError: HTTP Er...
   1 failed, 2 passed in 0.08s
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 1}
     Mock mismatch: [HTTP] GET /plans/pro [path tag #a89d800fc72c]  →  127.0.0.1:8085
     Hint: Only values drifted (path). If the change is expected, re-record the mock set with 'keploy mock record', or, with the dependency reachable, capture the new calls with 'keploy mock replay --on-miss record'. …
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   ```

   The recording has no `/plans/pro` call. Keploy doesn't send the call to the
   real API. It answers it with `502 Bad Gateway`, fails the run, names the
   call, and says what to do. The exit code is the test command's, so CI fails
   too.

4. Start the users API again in the second terminal:

   ```bash
   python3 users_api.py
   ```

5. Replay with `--on-miss record`. Keploy answers the calls it has from the
   recording, sends the new call to the real API, and adds it to the
   recording:

   ```bash
   keploy mock replay --local -c "python3 -m pytest -q" --on-miss record
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "python3", "args": 3, "on-miss": "record"}
   🐰 Keploy: INFO  Starting Application :  {"program": "python3", "args": 3}
   ..🐰 Keploy(agent): INFO  on-miss: served an unrecorded call from the real dependency  {"Type": "http", "metadata": {"host":"127.0.0.1:8085","method":"GET","path":"/{}/{}", …}, "policy": "record"}
   .                                                                      [100%]
   3 passed in 0.04s
   🐰 Keploy: INFO  appended new dependency calls to the mock set (--on-miss record)  {"new": 1, "mock-set": "default", "next_step": "review the added mocks and commit them; the next replay serves them without the real dependency"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "--on-miss record lets a call the recording does not have reach the real dependency"}
   ```

6. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd>, and replay:

   ```bash
   keploy mock replay --local -c "python3 -m pytest -q"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "python3", "args": 3, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "python3", "args": 3}
   ...                                                                      [100%]
   3 passed in 0.04s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 3}
   ```

   The run before this one said it "did not prove the tests run with the
   dependencies off", because one call reached the real API. This run proves
   it: all three tests pass from the recording.

You can also record again instead, with the API up. A new record replaces the
recording, so it always matches the tests you have now.

:::note A new id is not a new call
A call that differs from a recorded call only by an id in its path is not a
miss. Keploy treats a number in a path as an id that changes from run to run.
So a test that calls `/users/3` gets the recorded answer for `/users/1`.
When the recording has the exact call, Keploy serves that one, as it did for
`/users/1` and `/users/2`. To get a real answer for user 3, add a test that
asks for it, and record again.
:::

## Step 6: See a failing test fail the run

1. In `test_billing.py`, change `$20/month` to `$25/month`.

2. Replay, and print the exit code:

   ```bash
   keploy mock replay --local -c "python3 -m pytest -q"
   echo "exit code: $?"
   ```

   ```
   F..                                                                      [100%]
   =================================== FAILURES ===================================
   ______________________________ test_pro_user_bill ______________________________
       def test_pro_user_bill():
   >       assert billing.monthly_bill(1) == "Ada Lovelace (pro): $25/month"
   E       AssertionError: assert 'Ada Lovelace...o): $20/month' == 'Ada Lovelace...o): $25/month'
   …
   1 failed, 2 passed in 0.05s
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   exit code: 1
   ```

   The summary shows no missed call, so every call was answered from the
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
A  billing.py
A  keploy.yml
A  keploy/.gitignore
A  keploy/default/last-record.yaml
A  keploy/default/mocks.yaml
A  test_billing.py
A  users_api.py
```

`keploy/default/` holds the recording (`mocks.yaml`) and the record command
(`last-record.yaml`). The other files in `keploy/default/`, such as
`last-replay.yaml`, are run files from this machine's last replay:
`keploy/.gitignore` keeps them out of git, so `git add .` skips them.

Commit what `git add` staged:

```bash
git commit -m "Add billing tests and their Keploy recording"
```

Now anyone can run `keploy mock replay --local -c "python3 -m pytest -q"` on a
clone, with no users API, and CI can too.

## Clean up

Step 5 stopped the users API, so nothing is left running. Delete the `billing`
folder when you no longer need it.

## Next steps

- [Go quickstart](./quickstarts/go.md): a sample with PostgreSQL and an HTTP
  API, and a check of each test on its own.
- [Node.js quickstart](./quickstarts/jest.md): the same loop with Jest and
  `fetch`.
- [Java quickstart](./quickstarts/java.md): the same loop with JUnit 5 and
  Maven.
- [Run the replay in CI, and share recordings with your team](./mock-your-tests.md#proven-ci).
  With a Keploy account, recordings live in Keploy Cloud, and the repository
  keeps only `keploy.yml` and `keploy.lock`.
- [keploy.yml and keploy.lock](./guides/keploy-yml-and-lock.md): what to commit
  when your recordings live in Keploy Cloud.
- [Learn every option of `keploy mock`](./mock-your-tests.md).
