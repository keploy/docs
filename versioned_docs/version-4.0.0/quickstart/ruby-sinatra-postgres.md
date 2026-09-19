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

![Ruby Docker setup](/img/ruby_postgres_docker_setup.png)
*Screenshot: Docker and PostgreSQL setup for the Ruby quickstart.*

### Lights, Camera, Record! 🎥

Capture the test cases using our automated traffic script. This script handles starting the application via Keploy, waiting for it to become healthy, and generating 20 realistic API calls (including search, dependent resources, and expected errors).

```bash
./run-keploy.sh
```

What this script does:
1. Starts Keploy record mode with `docker compose up --build`
2. Automatically finds an available port
3. Waits for the `/health` endpoint to be ready
4. Sends 20 diverse API calls to simulate real-world usage
5. Gracefully stops recording once finished

![Recorded testcase example](/img/ruby_testcase.png)
*Screenshot: Example recorded testcase captured during the quickstart.*

And once the script completes, give yourself a pat on the back! With that simple spell, you've conjured up a comprehensive suite of test cases with mocks! Explore the **keploy** directory and you'll discover your handiwork in the `tests` directory and `mocks.yml`.

### Stop the Running Services

```bash
docker compose down
```

Want to see if everything works as expected?

### Run Tests 🧪

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name "ruby-books-app" --buildDelay 50 --delay 10
```

After tests complete, stop the services:

```bash
docker compose down
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

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

Create the database:

```bash
createdb booksdb
```

Initialize the database with the schema:

```bash
psql -d booksdb -f init.sql
```

### Configure Environment Variables

```bash
cp .env.example .env
# Edit .env if needed for your local PostgreSQL configuration
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
{"status": "healthy", "service": "Ruby Books API"}
```

### Lights, Camera, Record! 🎥

Keep the same recording session running and start making API calls to exercise the application.

🔥**Make some API calls**. Since this is a complex application, you can test various endpoints such as searching, filtering, and adding reviews!

### Generate Testcases

To generate test cases, open a new terminal and make some API calls. Here is a sample scenario you can run:

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

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Invalid Data",
    "published_year": "Not a year"
  }'
```

And once you are done, you can stop the Keploy recording (Ctrl+C in the first terminal) and give yourself a pat on the back! With that simple spell, you've conjured up test cases with mocks! Explore the **keploy** directory and you'll discover your handiwork in the `tests` directory and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests 🧪

Time to put things to the test 🧪

```bash
keploy test -c "bundle exec ruby app.rb" --delay 10
```

After tests complete, press `Ctrl+C` to stop the app.

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

Happy coding! ✨👩‍💻👨‍💻✨
