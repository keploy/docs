---
id: docker-compose
title: "Docker Compose quickstart: run tests without the services in your compose file"
sidebar_label: Docker Compose
description: Record the PostgreSQL and Redis calls a pytest suite makes to services started by Docker Compose, then run the same tests with the compose stack down. No Keploy account needed. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - docker compose
  - postgresql
  - redis
  - python
  - quickstart
keywords:
  - keploy mock docker compose
  - run tests without docker compose
  - mock postgres redis tests
  - service virtualization docker compose
  - mock record
  - mock replay
---

# Docker Compose quickstart: run tests without the services in your compose file

In this quickstart, your tests need a PostgreSQL database and a Redis cache,
and Docker Compose starts both. You record the tests' calls to them once, with
the compose stack up. Then you stop the stack and run the same tests, and they
still pass. Your CI job doesn't need to start the services any more.

You don't write any mock code, and the tests don't change. You don't need a
Keploy account either: the recording stays in your repository.

Every output on this page comes from a real run of Keploy 3.9.4 on Linux. Some
of Keploy's log lines are left out, long lines are trimmed (`…`), and timestamps
are removed.

## Before you begin

You need:

- Linux. Keploy's agent runs as root, so Keploy may ask for your `sudo`
  password.
- [Docker](https://docs.docker.com/engine/install/) with the Compose plugin
  (`docker compose`), which your user can run without `sudo`.
- Python 3.10 or newer, with its `venv` module. On Debian and Ubuntu, install
  it with `sudo apt install python3-venv`.
- Ports 5432 and 6379 free. Stop a local PostgreSQL or Redis first.
- Keploy. To install it, run:

  ```bash
  source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
  ```

  For other ways to install it, see [Installation](/docs/server/installation/).
  The install script installs Keploy Enterprise, which records and mocks
  Redis. The open-source build (installed with `--oss`) passes Redis calls
  through to the real Redis instead, so with it, Redis must be up for the
  replay too.

## Step 1: Create the sample app

1. Create a folder with a `db` folder in it, and a git repository:

   ```bash
   mkdir -p shop/db && cd shop && git init
   ```

2. Save this as `compose.yaml`. It starts PostgreSQL and Redis, and publishes
   their ports on your machine:

   ```yaml
   services:
     db:
       image: postgres:16
       environment:
         POSTGRES_PASSWORD: postgres
       ports:
         - "5432:5432"
       volumes:
         - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
       healthcheck:
         test: ["CMD", "pg_isready", "-h", "127.0.0.1", "-U", "postgres"]
         interval: 1s
         retries: 30
     cache:
       image: redis:7
       ports:
         - "6379:6379"
       healthcheck:
         test: ["CMD", "redis-cli", "ping"]
         interval: 1s
         retries: 30
   ```

3. Save this as `db/init.sql`. PostgreSQL runs it when the database is first
   created:

   ```sql
   CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL, price_cents int NOT NULL);
   INSERT INTO products VALUES (1, 'Keyboard', 4999), (2, 'Mouse', 1999);
   ```

4. Save this as `shop.py`. It's your app: it reads products from PostgreSQL
   and keeps each user's cart in Redis:

   ```python
   import psycopg
   import redis

   DB_URL = "postgresql://postgres:postgres@127.0.0.1:5432/postgres"
   cache = redis.Redis(host="127.0.0.1", port=6379)


   def product(product_id):
       with psycopg.connect(DB_URL) as conn:
           name, price_cents = conn.execute(
               "SELECT name, price_cents FROM products WHERE id = %s", (product_id,)
           ).fetchone()
       return {"name": name, "price_cents": price_cents}


   def add_to_cart(user, product_id, quantity):
       cache.hset(f"cart:{user}", str(product_id), quantity)


   def clear_cart(user):
       cache.delete(f"cart:{user}")


   def cart_total(user):
       items = cache.hgetall(f"cart:{user}")
       return sum(
           product(int(pid))["price_cents"] * int(quantity)
           for pid, quantity in items.items()
       )
   ```

5. Save this as `test_shop.py`. These are your tests:

   ```python
   import shop


   def test_product():
       assert shop.product(1) == {"name": "Keyboard", "price_cents": 4999}


   def test_cart_total():
       shop.clear_cart("ada")
       shop.add_to_cart("ada", 1, 2)
       shop.add_to_cart("ada", 2, 1)
       assert shop.cart_total("ada") == 11997
   ```

6. Create a virtual environment, keep it and Python's caches out of git, and
   install pytest and the PostgreSQL and Redis clients:

   ```bash
   python3 -m venv .venv
   printf '.venv/\n__pycache__/\n.pytest_cache/\n' > .gitignore
   source .venv/bin/activate
   pip install --quiet pytest "psycopg[binary]" redis
   ```

## Step 2: Run the tests against the compose stack

1. Start PostgreSQL and Redis. The first time, Compose downloads their images.
   `--wait` waits until both services pass their health checks:

   ```bash
   docker compose up -d --wait
   ```

2. Check that both services are up and healthy:

   ```bash
   docker compose ps
   ```

   ```
   NAME           IMAGE         COMMAND                  SERVICE   CREATED         STATUS                  PORTS
   shop-cache-1   redis:7       "docker-entrypoint.s…"   cache     2 seconds ago   Up 1 second (healthy)   0.0.0.0:6379->6379/tcp, [::]:6379->6379/tcp
   shop-db-1      postgres:16   "docker-entrypoint.s…"   db        2 seconds ago   Up 1 second (healthy)   0.0.0.0:5432->5432/tcp, [::]:5432->5432/tcp
   ```

3. Run the tests:

   ```bash
   python3 -m pytest -q
   ```

   ```
   ..                                                                       [100%]
   2 passed in 0.12s
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
2 passed in 0.13s
🐰 Keploy: INFO  recorded mocks  {"mocks": 23, "mock-set": "default"}
🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
```

`--local` keeps the recording in your repository, so you don't need a Keploy
account for this quickstart. Without `--local`, Keploy asks you to sign in
first.

Keploy recorded the tests' calls to both services in
`keploy/default/mocks.yaml`. Count them by kind:

```bash
grep '^kind:' keploy/default/mocks.yaml | sort | uniq -c
```

```
     15 kind: PostgresV3
      8 kind: Redis
```

Here is one Redis call, trimmed:

```yaml
kind: Redis
name: mock-10
spec:
  metadata:
    connID: "2"
    destAddr: 127.0.0.1:6379
  RequestBin:
    - origin: client
      message:
        - type: string
          data: "*4\r\n$4\r\nHSET\r\n$8\r\ncart:ada\r\n$1\r\n1\r\n$1\r\n2\r\n"
  ResponseBin:
    - origin: server
      message:
        - type: string
          data: ":1\r\n"
```

The request is `HSET cart:ada 1 2` in Redis's wire format, and the answer is
`1`. The PostgreSQL mocks hold the connection set-up, and each `SELECT` with
the rows it returned.

## Step 4: Replay with the compose stack down

1. Stop the compose stack, and remove its containers and the database's data:

   ```bash
   docker compose down -v
   ```

2. Run the tests on their own. They fail, because nothing answers:

   ```bash
   python3 -m pytest -q
   ```

   ```
   …
   E           redis.exceptions.ConnectionError: Error 111 connecting to 127.0.0.1:6379. Connection refused.
   …
   =========================== short test summary info ============================
   FAILED test_shop.py::test_product - psycopg.OperationalError: connection fail...
   FAILED test_shop.py::test_cart_total - redis.exceptions.ConnectionError: Erro...
   2 failed in 2.66s
   ```

3. Run them under `keploy mock replay`:

   ```bash
   keploy mock replay --local -c "python3 -m pytest -q"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "python3", "args": 3, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "python3", "args": 3}
   ..                                                                       [100%]
   2 passed in 0.10s
   🐰 Keploy: INFO  mock replay summary  {"loaded": 23, "consumed": 11, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 11}
   ```

The tests pass with no PostgreSQL or Redis running. The summary shows no
missed call: Keploy answered every call from the recording.

## Step 5: Commit the recording

Commit `keploy.yml` and the `keploy/` folder with your code:

```bash
git add . && git status --short
```

```
A  .gitignore
A  compose.yaml
A  db/init.sql
A  keploy.yml
A  keploy/.gitignore
A  keploy/default/last-record.yaml
A  keploy/default/mocks.yaml
A  shop.py
A  test_shop.py
```

`keploy/default/` holds the recording (`mocks.yaml`) and the record command
(`last-record.yaml`). The other files in `keploy/default/`, such as
`last-replay.yaml`, are run files from this machine's last replay:
`keploy/.gitignore` keeps them out of git, so `git add .` skips them.

Commit what `git add` staged:

```bash
git commit -m "Add shop tests and their Keploy recording"
```

Now anyone can clone the project, create its virtual environment and install
its packages (`python3 -m venv .venv`, `source .venv/bin/activate` and
`pip install pytest "psycopg[binary]" redis`), and run
`keploy mock replay --local -c "python3 -m pytest -q"` with the compose stack
down. CI can too.

## Clean up

Step 4 stopped the compose stack. Delete the `shop` folder when you no longer
need it.

## Next steps

- [Python quickstart](../mock-quickstart.md): the same loop with an HTTP API,
  and `--on-miss record` to add a new call.
- [Go quickstart](./go.md): a sample with PostgreSQL and an HTTP API, and a
  check of each test on its own.
- [keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md): what to
  commit, and how the lock pins your recordings.
- [Run the replay in CI](../guides/ci.md), and
  [share recordings with your team](../mock-your-tests.md#proven-team).
