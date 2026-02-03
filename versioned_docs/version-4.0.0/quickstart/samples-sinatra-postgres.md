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

Get started with the User CRUD Application.

import Link from '@docusaurus/Link'
import EnterpriseInstallReminder from '@site/src/components/EnterpriseInstallReminder';

<EnterpriseInstallReminder />

### Get Started

### Clone the application

```bash
git clone https://github.com/keploy/samples-ruby.git && cd samples-ruby/sinatra-postgres
```

### Capture the test cases

Capture the test cases:

```shell
keploy record -c "docker compose up" --container-name "sinatra-app" --buildDelay 50
```

![Keploy Record Sinatra](/img/sinatra-postgres/keploy-record-sinatra.png)

### Generate testcases

To generate testcases we need to make some API calls. Open a **new terminal window** and run the following commands:

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

Once you are done, you can stop the recording in the first terminal (Ctrl+C). Keploy will save the test cases in the `keploy` directory.

### Run the testcases

```bash
keploy test -c "docker compose up" --containerName "sinatra-app" --delay 10
```

![Keploy Test Sinatra](/img/sinatra-postgres/keploy-test-sinatra.png)

You can also check the test summary from your CLI.

## Running App Locally on Linux/WSL

### Prerequisites

- Ruby 3.0+ installed
- PostgreSQL installed and running
- Keploy installed

### Setup

1. **Install dependencies:**

```bash
bundle install
```

![Bundle Install Sinatra](/img/sinatra-postgres/bundle-install.png)


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

Then make API calls as shown above (in a separate terminal).

![Generate Testcases Sinatra](/img/sinatra-postgres/generate-testcases-sinatra.png)


### Run Tests

```bash
keploy test -c "bundle exec ruby app.rb" --delay 5
```

### Conclusion

You have successfully recorded and replayed API tests for a Ruby Sinatra application using Keploy.
