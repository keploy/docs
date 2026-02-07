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
keyword:
  - Sinatra Framework
  - PostgreSQL
  - Ruby
  - API Test generator
  - Auto case generation
---

import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';

## Introduction

🪄 Dive into the world of Books CRUD API and see how seamlessly Keploy integrates with [Ruby (Sinatra)](http://sinatrarb.com/) and [PostgreSQL](https://www.postgresql.org/). Buckle up, it's gonna be a fun ride! 🎢

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

We will be using Docker compose to run the application as well as PostgreSQL on Docker container.

### Clone the Application 🧪

```bash
git clone https://github.com/Nsanjayboruds/keploy-ruby-postgresql-quickstart.git && cd keploy-ruby-postgresql-quickstart
```

### Lights, Camera, Record! 🎥

Capture the test-cases-

```bash
keploy record -c "docker compose up --build" --container-name "ruby-books-app"
```

This will:

- Start a PostgreSQL container
- Build and start the Ruby application container
- Initialize the database with sample data
- Expose the API on port 8000

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

### Generate Testcases

To generate testcases we just need to **make some API calls.**

#### 1. Get All Books

```bash
curl http://localhost:8000/books
```

#### 2. Get a Specific Book

```bash
curl http://localhost:8000/books/1
```

#### 3. Create a New Book

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "9780547928227",
    "published_year": 1937
  }'
```

#### 4. Update a Book

```bash
curl -X PUT http://localhost:8000/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby (Updated)",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "published_year": 1925
  }'
```

#### 5. Delete a Book

```bash
curl -X DELETE http://localhost:8000/books/1
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up test cases with mocks! Explore the **keploy** directory and you'll discover your handiwork in the `tests` directory and `mocks.yml`.

### Stop the Running Services

```bash
docker compose down
```

Want to see if everything works as expected?

### Run Tests 🧪

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --container-name "ruby-books-app" --delay 10
```

After tests complete, stop the services:

```bash
docker compose down
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

<SectionDivider />

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application locally on Linux/WSL. There are 2 ways you can run this application:

### Clone the Application 🧪

```bash
git clone https://github.com/Nsanjayboruds/keploy-ruby-postgresql-quickstart.git && cd keploy-ruby-postgresql-quickstart
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

```bash
curl http://localhost:8000/health
```

Expected Response:

```json
{"status": "healthy", "service": "Ruby Books API"}
```

### Lights, Camera, Record! 🎥

If you stopped the app after verification, restart recording:

```bash
keploy record -c "bundle exec ruby app.rb"
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

### Generate Testcases

To generate testcases we just need to **make some API calls.**

#### 1. Get All Books

```bash
curl http://localhost:8000/books
```

#### 2. Get a Specific Book

```bash
curl http://localhost:8000/books/1
```

#### 3. Create a New Book

```bash
curl -X POST http://localhost:8000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "isbn": "9780547928227",
    "published_year": 1937
  }'
```

#### 4. Update a Book

```bash
curl -X PUT http://localhost:8000/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Gatsby (Updated)",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "published_year": 1925
  }'
```

#### 5. Delete a Book

```bash
curl -X DELETE http://localhost:8000/books/1
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up test cases with mocks! Explore the **keploy** directory and you'll discover your handiwork in the `tests` directory and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests 🧪

Time to put things to the test 🧪

```bash
keploy test -c "bundle exec ruby app.rb" --delay 10
```

After tests complete, stop the app:

```bash
Ctrl+C
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

Happy coding! ✨👩‍💻👨‍💻✨
