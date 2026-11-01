---
id: samples-ruby
title: Sample Books API
sidebar_label: Ruby + Postgres
description: The following sample app showcases how to use the Ruby (Sinatra) framework and the Keploy Platform.
tags:
  - ruby
  - quickstart
  - samples
  - examples
  - tutorial
  - sinatra
  - postgresql
  - ruby-framework
keywords:
  - Sinatra Framework
  - PostgreSQL
  - Ruby
  - API Test generator
  - Auto case generation
---

import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';

## Introduction

🪄 Dive into the world of a realistic Ruby Books API and see how seamlessly Keploy integrates with [Ruby (Sinatra)](https://sinatrarb.com/) and [PostgreSQL](https://www.postgresql.org/). This quickstart goes beyond basic CRUD, featuring search, filtering, pagination, related resources (books and reviews), and an automated traffic script to simulate a realistic testing scenario. Buckle up, it's gonna be a fun ride! 🎢

<InstallReminder />

## Prerequisites

### For Local Setup:

- Ruby 3.2 or higher
- PostgreSQL 15 or higher
- Bundler (`gem install bundler`)

### For Docker Setup:

- Docker (20.10 or higher)
- Docker Compose (v2.0 or higher)

<SectionDivider />

## Using Docker Compose 🐳

We will be using Docker Compose to run the application as well as PostgreSQL in Docker containers.

### Clone the Application 🧪

```bash
git clone https://github.com/keploy/samples-ruby.git && cd samples-ruby/sinatra-postgres-quickstart
```

### Lights, Camera, Record! 🎥

Start Keploy in record mode. This will spin up your app via Docker Compose and begin capturing API calls as test cases:

```bash
keploy record -c "docker compose up --build" --container-name "ruby-books-app" --cmd-type docker-compose
```

In a new terminal, verify the app is ready:

```bash
curl http://localhost:18080/health
```

Now make some API calls to generate test cases:

```bash
# Search books
curl "http://localhost:18080/books?q=the&min_year=1900&sort_by=title&order=asc"

# Create a book
curl -X POST http://localhost:18080/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Dune", "author": "Frank Herbert", "isbn": "9780441013593", "published_year": 1965}'

# Add a review
curl -X POST http://localhost:18080/books/1/reviews \
  -H "Content-Type: application/json" \
  -d '{"reviewer": "qa-team@example.com", "rating": 5, "comment": "Excellent world building."}'

# Analytics
curl "http://localhost:18080/analytics/books/top-rated?limit=3&min_reviews=1"
```

When done, press `Ctrl+C` to stop the recording.

> **Optional: run the full automated 20-call scenario**
>
> The repo includes `run-keploy.sh` which automates all of the above. **Be aware of what it does to your machine before running it:**
> - Calls `sudo -v` (may prompt for your password)
> - Requires `ss` from the `iproute2` package
> - Runs `docker compose down -v` + `docker volume rm` **on start and on exit**, which wipes the PostgreSQL data volume
>
> ```bash
> ./run-keploy.sh
> ```

Once recording is complete, Keploy writes test cases under `keploy/test-set-N/tests/` and mocks under `keploy/test-set-N/mocks.yaml`. Explore the `keploy/` directory to see your captured test suite.

![Recorded testcase example](/img/ruby_testcase.png)
*Screenshot: The `keploy/test-set-0/` tree after a completed recording session.*

### Stop the Running Services

```bash
docker compose down
```

Want to see if everything works as expected?

### Run Tests 🧪

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name "ruby-books-app" --cmd-type docker-compose --buildDelay 50 --delay 10
```

After tests complete, stop the services:

```bash
docker compose down
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yaml`, or fiddle with the request or response in `test-N.yaml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨


<SectionDivider />

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application locally on Linux/WSL using the workflow below:

### Clone the Application 🧪

```bash
git clone https://github.com/keploy/samples-ruby.git && cd samples-ruby/sinatra-postgres-quickstart
```

### Install Dependencies

```bash
bundle install
```

### Set up PostgreSQL Database

On Ubuntu/WSL, PostgreSQL uses `peer` auth by default. Run the following to set a password for the `postgres` role and create the database over TCP:

```bash
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
createdb -h localhost -U postgres booksdb
psql -h localhost -U postgres -d booksdb -f init.sql
```

### Configure Environment Variables

The app reads configuration directly from environment variables (no dotenv gem). Override the defaults as needed before starting:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=booksdb
export DB_USER=postgres
export DB_PASSWORD=postgres
export PORT=8000
```

### Start the Application with Keploy

If the app is already running, stop it before you start recording.

```bash
keploy record -c "bundle exec ruby app.rb"
```

The API will be available at `http://localhost:8000`

### Verify the Setup

In a new terminal (keep `keploy record` running in the first terminal), verify the app is healthy:

```bash
curl http://localhost:8000/health
```

Expected Response:

```json
{"status":"healthy","service":"Ruby Books API","database":"connected"}
```

### Generate Testcases

In the same terminal (keep `keploy record` running), make API calls to generate test cases:

#### 1. Search and Filter Books

```bash
curl "http://localhost:8000/books?q=the&min_year=1900&sort_by=title&order=asc"
```

#### 2. Create a New Book

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Dune",
    "author": "Frank Herbert",
    "isbn": "9780441013593",
    "published_year": 1965
  }'
```

#### 3. Add a Review (Dependent Resource)

```bash
# Replace '1' with the ID of the book you just created
curl -X POST http://localhost:8000/books/1/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "reviewer": "qa-team@example.com",
    "rating": 5,
    "comment": "Excellent world building."
  }'
```

#### 4. Test Analytics Endpoint

```bash
curl "http://localhost:8000/analytics/books/top-rated?limit=3&min_reviews=1"
```

#### 5. Trigger an Expected Error (Negative Test)

This exercises the `published_year` type validation — the value must be an integer:

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Invalid Data",
    "author": "Test Author",
    "published_year": "Not a year"
  }'
```

Expected response:

```json
{"error":"Published year must be an integer"}
```

And once you are done, you can stop the Keploy recording (Ctrl+C in the first terminal) and give yourself a pat on the back! With that simple spell, you've conjured up test cases with mocks! Explore the **keploy** directory and you'll find your test cases under `test-set-N/tests/` and mocks under `test-set-N/mocks.yaml`.

Want to see if everything works as expected?

### Run Tests 🧪

Time to put things to the test 🧪

```bash
keploy test -c "bundle exec ruby app.rb" --delay 10
```

After tests complete, press `Ctrl+C` to stop the app.

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yaml`, or fiddle with the request or response in `test-N.yaml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

Happy coding! ✨👩‍💻👨‍💻✨
