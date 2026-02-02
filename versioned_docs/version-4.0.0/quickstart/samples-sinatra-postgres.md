---
id: samples-sinatra-postgres
title: Sample User CRUD App (Sinatra + Postgres)
sidebar_label: Sinatra + Postgres
description: A sample User CRUD application built with Ruby Sinatra and PostgreSQL to demonstrate how Keploy records API calls and database interactions automatically.
tags:
  - sinatra
  - ruby
  - quickstart
  - samples
  - examples
  - tutorial
  - ruby-framework
  - postgresql
keyword:
  - Sinatra Framework
  - Ruby
  - PostgreSQL
  - API Test generator
  - Auto case generation
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Enterprise" offerings="Self-Hosted, Dedicated" />

🪄 Dive into the world of User CRUD Apps and see how seamlessly Keploy integrates with Sinatra and PostgreSQL. Buckle up, it's gonna be a fun ride! 🎢

import Link from '@docusaurus/Link'
import EnterpriseInstallReminder from '@site/src/components/EnterpriseInstallReminder';

<EnterpriseInstallReminder />

### Get Started! 🎬

### Clone the application 🧪

```bash
git clone https://github.com/keploy/samples-ruby.git && cd samples-ruby/sinatra-postgres
```

## Using Docker Compose 🐳

We will be using Docker Compose to run the application as well as PostgreSQL in Docker containers.

### Lights, Camera, Record! 🎥

Capture the test cases:

```shell
keploy record -c "docker compose up" --container-name "sinatra-app" --buildDelay 50
```

![Keploy Record Sinatra](/img/sinatra-postgres/keploy-record-sinatra.png)

🔥 **Make some API calls**. Postman, Hoppscotch, or even curl - take your pick!

### Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Health check:**

```bash
curl http://localhost:4567/
```

2. **Create a user:**

```bash
curl -X POST http://localhost:4567/users \
-H "Content-Type: application/json" \
-d '{"name": "John Doe", "email": "john@example.com"}'
```

3. **Create another user:**

```bash
curl -X POST http://localhost:4567/users \
-H "Content-Type: application/json" \
-d '{"name": "Jane Smith", "email": "jane@example.com"}'
```

4. **Get all users:**

```bash
curl http://localhost:4567/users
```

5. **Get a specific user:**

```bash
curl http://localhost:4567/users/1
```

6. **Delete a user:**

```bash
curl -X DELETE http://localhost:4567/users/2
```

![Generate Testcases Sinatra](/img/sinatra-postgres/generate-testcases-sinatra.png)

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up test cases with mocks! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

### Time to run the testcases 🏃

```bash
keploy test -c "docker compose up" --containerName "sinatra-app" --delay 10
```

![Keploy Test Sinatra](/img/sinatra-postgres/keploy-test-sinatra.png)

You can also check the test summary from your CLI.

## Running App Locally on Linux/WSL 🐧

### Prerequisites

- Ruby 3.0+ installed
- PostgreSQL installed and running
- Keploy installed

### Setup

1. **Install dependencies:**

```bash
bundle install
```

2. **Set up environment variables:**

```bash
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_NAME=keploy_demo
export DATABASE_USER=postgres
export DATABASE_PASSWORD=postgres
```

3. **Create the database:**

```bash
createdb keploy_demo
```

### Record Test Cases

```bash
keploy record -c "bundle exec ruby app.rb"
```

Then make API calls as shown above.

### Run Tests

```bash
keploy test -c "bundle exec ruby app.rb" --delay 5
```

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your Ruby coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀
