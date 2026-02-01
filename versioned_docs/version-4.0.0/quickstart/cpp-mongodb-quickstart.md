---
````markdown
---
id: samples-cpp-mongodb
title: Sample CRUD App (C++)
sidebar_label: C++ + MongoDB
description: A beginner-friendly quickstart showing how to use a C++ REST API with MongoDB and Keploy record & replay.
tags:
  - cpp
  - mongodb
  - quickstart
  - samples
  - examples
  - tutorial
  - mongo-c-driver
keyword:
  - C++
  - MongoDB
  - cpp-httplib
  - Keploy
  - API Test generator
---

import Link from '@docusaurus/Link'
import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';
import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

<InstallReminder />

## Overview

This quickstart shows how to run a small C++ REST API (built using `cpp-httplib`) backed by **MongoDB**, and how to use Keploy to record and replay API tests. The repo contains both Docker and non-Docker workflows so you can follow whichever matches your environment.

---

## Clone the example repository

```bash
git clone https://github.com/mishraa-G/keploy-cpp-mongodb-quickstart.git
cd keploy-cpp-mongodb-quickstart
```

## Prerequisites

- A C++17 compatible compiler (gcc/clang)
- CMake
- MongoDB C Driver (libmongoc / libbson)
- Docker & docker-compose (recommended for an isolated run)

Install helpers (examples):
````markdown
---
id: samples-cpp-mongodb
title: Sample CRUD App (C++)
sidebar_label: C++ + MongoDB
description: A beginner-friendly quickstart showing how to use a C++ REST API with MongoDB and Keploy record & replay.
tags:
  - cpp
  - mongodb
  - quickstart
  - samples
  - examples
  - tutorial
  - mongo-c-driver
keyword:
  - C++
  - MongoDB
  - cpp-httplib
  - Keploy
  - API Test generator
---

import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';
import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

<InstallReminder />

## Overview

This quickstart shows how to run a small C++ REST API (built using `cpp-httplib`) backed by **MongoDB**, and how to use Keploy to record and replay API tests. The repo contains both Docker and non-Docker workflows so you can follow whichever matches your environment.

---

## Clone the example repository

```bash
git clone https://github.com/mishraa-G/keploy-cpp-mongodb-quickstart.git
cd keploy-cpp-mongodb-quickstart
```

## Prerequisites

- A C++17 compatible compiler (gcc/clang)
- CMake
- MongoDB C Driver (libmongoc / libbson)
- Docker & docker-compose (recommended for an isolated run)

Install helpers (examples):

Linux (Ubuntu/Debian):

```bash
sudo apt update
sudo apt install -y build-essential cmake pkg-config \
  libssl-dev libsasl2-dev libbson-dev libmongoc-dev mongodb
```

macOS (Homebrew):

```bash
brew install cmake mongo-c-driver mongodb-community
```

> Note: Keploy's record feature relies on eBPF and currently works only on Linux (or GitHub Codespaces). If you're on macOS, use the Docker path or a Linux VM / Codespace for recording.

---

## Run locally (non-Docker)

This runs the C++ binary directly on your machine and assumes MongoDB is reachable at the configured host (see README in the repo).

```bash
mkdir -p build
cd build
cmake ..
make -j$(nproc || echo 2)
cd ..
./build/app
```

You should see a log like:

```text
Server running on port 8080
```

Test the API:

```bash
curl http://localhost:8080/health
# => {"status":"ok"}

curl -X POST http://localhost:8080/items \
  -H "Content-Type: application/json" \
  -d '{"name":"item1"}'

curl http://localhost:8080/items
```

---

## Run with Docker Compose (recommended)

Docker isolates the app + MongoDB and is the easiest way to get started. From the project root:

```bash
docker network create keploy-network || true
docker compose up --build
```

The app will start on port 8080 by default. Use the same curl commands above to exercise the API.

---

## Record API traffic with Keploy

Keploy's recorder uses eBPF, so recording requires Linux (or GitHub Codespaces). Install Keploy and record while bringing up the app in Docker. The compose service name in this example is `app`.

```bash
curl --silent -O -L https://keploy.io/install.sh
source install.sh
keploy --version

keploy record -c "docker compose up --build" \
  --container-name app \
  --buildDelay 30
```

While recording, generate API traffic (examples):

```bash
curl http://localhost:8080/health
curl -X POST http://localhost:8080/items -H "Content-Type: application/json" -d '{"name":"item1"}'
curl http://localhost:8080/items
```

Stop recording with Ctrl+C. Keploy will generate testcases and mock files inside the `keploy/` directory in the project.

> Notes:
- The `docker/` or compose setup initializes the database as needed (see `docker` folder in repo).
- `docker-compose.yml` expects an external network named `keploy-network` so Keploy containers can attach to the same network for transparent recording.
- Mask secrets before committing any recordings to git.

> If you must record on macOS, record inside a Linux VM or GitHub Codespace because eBPF is required for Keploy's recorder. This quickstart was tested in GitHub Codespaces (Linux-based).

---

## Replay tests

Replay recorded testcases against the application:

```bash
keploy test -c "docker compose up" \
  --container-name app \
  --delay 10 \
  --buildDelay 30
```

Keploy will run the recorded cases and print pass/fail results. `delay` is how long to wait for the app to become ready (in seconds). `buildDelay` is how long to wait for the image build step when using `docker compose up --build`.

---

## Project structure (high level)

```
.
├── app/
│   └── src/
│       └── main.cpp
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── keploy/
│   └── keploy.yml
└── README.md
```

---

## Troubleshooting

- Build fails locally: ensure the MongoDB C driver headers and libs are installed and visible to CMake.
- Keploy record fails on macOS: use a Linux environment (VM, Codespaces) because eBPF is required.

If you hit errors, open an issue in the example repo or check the repo README for environment-specific notes.

---

## Quick commands cheat-sheet

```bash
# clone
git clone https://github.com/mishraa-G/keploy-cpp-mongodb-quickstart.git

# local build & run
mkdir build && cd build && cmake .. && make -j$(nproc || echo 2)
cd .. && ./build/app

# docker
docker network create keploy-network || true
docker compose up --build

# record (Docker)
keploy record -c "docker compose up --build" --container-name app --buildDelay 30

# replay
keploy test -c "docker compose up" --container-name app --delay 10 --buildDelay 30
```

---

## Wrapping up 🎉

You’ve successfully:

- Built a C++ REST API with MongoDB
- Recorded API traffic using Keploy
- Replayed tests automatically without writing test code

Explore `keploy/` to see generated YAMLs, mocks, and testcases. Tweak them and re-run `keploy test` to validate changes.

Happy testing! 🚀

````