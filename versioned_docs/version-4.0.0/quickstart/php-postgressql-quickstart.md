---
id: samples-php-postgres-quickstart
title: PHP + PostgreSQL (Quick Starter)
sidebar_label: PHP + PostgreSQL (Quick Starter)
description: Quick starter for the keploy-php-postgres-quickstart example repository
tags:
  - php
  - postgresql
  - quickstart
---

# PHP + PostgreSQL — Quick Starter

import InstallReminder from '@site/src/components/InstallReminder';

<InstallReminder />

This short quick starter gets you up and running with the example repo:

https://github.com/mishraa-G/keploy-php-postgres-quickstart

It covers cloning, running with Docker (recommended), recording API traffic with Keploy (Linux), and replaying tests. The example uses PHP (Apache) + PostgreSQL and provides a `docker-compose.yml` and `keploy.yml` for end-to-end recording.

## 1) Clone the repo

```bash
git clone https://github.com/mishraa-G/keploy-php-postgres-quickstart.git
cd keploy-php-postgres-quickstart
```

## 2) Run with Docker Compose (recommended)

Most example repos provide a `docker-compose.yml` that brings up the app and PostgreSQL. From the project root:

```bash
docker network create keploy-network || true
docker compose up --build
```

The example app is served under `/index.php` and the service listens on port 8080. Verify the health endpoint:

```bash
curl http://localhost:8080/index.php/health
# -> {"status":"ok"}
```

The repository exposes these REST endpoints (from the example):

- GET  /index.php/health
- POST /index.php/users
- GET  /index.php/users
- GET  /index.php/users/{id}
- DELETE /index.php/users/{id}

Example requests:

```bash
# create user
curl -X POST http://localhost:8080/index.php/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alice","email":"alice@example.com"}'

# list users
curl http://localhost:8080/index.php/users
```

## 3) Run locally without Docker (optional)

If you want to run PHP & Postgres locally, install PHP >= 8.0 with `pgsql`/`pdo_pgsql` enabled and a local PostgreSQL instance. Follow the repo README for exact composer commands (if used) and DB configuration. Typical local flow:

```bash
# install PHP deps (if composer is used)
composer install

# configure DB connection (env file or config)
# start PHP built-in server (example)
php -S 0.0.0.0:8080 -t public
```

Refer to the repo README for exact config keys and any environment variables.

## 4) Record API traffic with Keploy (Linux only)

Keploy's recorder uses eBPF, so recording requires Linux (or GitHub Codespaces). Install Keploy and record while bringing up the app in Docker. The compose service name in this example is `app`.

```bash
curl --silent -O -L https://keploy.io/install.sh
source install.sh
keploy --version

keploy record -c "docker compose up --build" \
  --container-name app \
  --buildDelay 30
```

While recording, run the example curl commands above (or use Postman) to generate traffic. Stop recording with Ctrl+C. Keploy will create a `keploy/` directory containing recorded tests, mock files, and test-sets.

> Notes:
- The `db` service initializes the `users` table using `app/migrate.sql` (see repo).
- `docker-compose.yml` expects an external network named `keploy-network` so Keploy containers can attach to the same network for transparent recording.
- Mask secrets before committing any recordings to git.

> If you're on macOS, run the recorder inside a Linux VM or Codespace because eBPF is required. This quickstart was tested in GitHub Codespaces (Linux-based).

## 5) Replay recorded tests

Replay recorded testcases against the application:

```bash
keploy test -c "docker compose up" \
  --container-name app \
  --delay 10 \
  --buildDelay 30
```

Keploy will run the recorded cases and print pass/fail results. `delay` is how long to wait for the app to become ready (in seconds). `buildDelay` is how long to wait for the image build step when using `docker compose up --build`.

## Project structure (high level)

```
.
├── app/
│   ├── index.php
│   ├── db.php
│   └── migrate.sql
├── Dockerfile
├── docker-compose.yml
├── keploy.yml
└── README.md
```

## Troubleshooting

- If the app doesn't start, check container logs with `docker compose logs --follow` and confirm ports.
- Local run/build issues: ensure PHP extensions (`pgsql`/`pdo_pgsql`) and composer deps are installed per the project's README.
- Keploy recording fails on macOS: use Linux VM / GitHub Codespace for recording.

## Quick cheat-sheet

```bash
# clone
git clone https://github.com/mishraa-G/keploy-php-postgres-quickstart.git

# docker run (recommended)
docker network create keploy-network || true
docker compose up --build

# record (Linux only)
keploy record -c "docker compose up --build" --container-name app --buildDelay 30

# replay
keploy test -c "docker compose up" --container-name app --delay 10 --buildDelay 30
```

---

