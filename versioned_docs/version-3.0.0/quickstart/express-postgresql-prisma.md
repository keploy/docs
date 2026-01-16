---
id: express-postgresql-prisma
title: Express + PostgreSQL + Prisma Sample Application
sidebar_label: Express + PostgreSQL + Prisma
description: The following sample app showcases how to use Express framework, PostgreSQL and Prisma ORM and the Keploy Platform.
tags:
  - javascript
  - quickstart
  - samples
  - examples
  - tutorial
  - nodejs
keyword:
  - Express Framework
  - PostgreSQL
  - Prisma ORM
  - API Test generator
  - Auto Testcase generation
---

import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';
import ProductTier from '@site/src/components/ProductTier';

## Running App Locally on Linux/WSL

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

A sample Task Management application and see how seamlessly Keploy integrates with Express, PostgreSQL and Prisma ORM. Buckle up, it's gonna be a fun ride!

<InstallReminder />

### Prerequisites

Ensure you have the following installed:

- Docker
- Node.js and npm
- Keploy CLI

Clone the repository and move to express-postgresql-prisma folder

```bash
git clone https://github.com/keploy/samples-typescript.git
cd samples-typescript/express-postgresql-prisma
```

### Install the dependencies

```bash
npm install
```

### Set up environment variables:

```bash
cp .env.example .env
```

### Start PostgreSQL Container

```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

> Note: PostgreSQL Password is `mysecretpassword`

#### Update the `.env` file with your PostgreSQL connection string:

```bash
PORT=3000
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/postgres"
```

### Migrate the database:

```bash
npm run generate
npm run migrate init
```

```bash
root@Linus:~/samples-typescript/express-postgresql-prisma# npm run migrate init

> task-manager@1.0.0 migrate
> prisma migrate dev --name init

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public" at "localhost:5432"

Applying migration `20240730015533_initial_migration`
Applying migration `20240731010434_due_date_type_change_to_string`

The following migration(s) have been applied:

migrations/
  └─ 20240730015533_initial_migration/
    └─ migration.sql
  └─ 20240731010434_due_date_type_change_to_string/
    └─ migration.sql

Your database is now in sync with your schema.

✔ Generated Prisma Client (v5.17.0) to ./node_modules/@prisma/clie
nt in 50ms


┌─────────────────────────────────────────────────────────┐
│  Update available 5.17.0 -> 5.19.0                      │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
```

### Start the application:

```bash
npm run dev
```

```bash
Server is listening at PORT 3000

    Server: http://localhost:3000
    API Docs: http://localhost:3000/api/docs
```

> Note: The application will run on `http://localhost:3000`.

Now we walkthrough how to leverage Keploy to automatically generate test cases for the application, and later test the application using Keploy.

### Generate Test Cases

> Note: Build the application first using `npm run build`

```bash
keploy record -c "npm start"
```

```bash
root@Linus:~/samples-typescript/express-postgresql-prisma# keploy record -c "npm start"
🐰 Keploy: 2024-08-28T09:48:30+05:30    INFO    config file not found; proceeding with flags only

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

version: 2.3.0-beta14

🐰 Keploy: 2024-08-28T09:48:30+05:30    INFO    Generated config file based on the flags that are used
🐰 Keploy: 2024-08-28T09:48:32+05:30    INFO    keploy initialized and probes added to the kernel.
🐰 Keploy: 2024-08-28T09:48:32+05:30    INFO    Keploy has taken control of the DNS resolution mechanism, your application may misbehave if you have provided wrong domain name in your application code.
🐰 Keploy: 2024-08-28T09:48:32+05:30    INFO    Proxy started at port:16789
🐰 Keploy: 2024-08-28T09:48:32+05:30    INFO    starting TCP DNS server at addr :26789
🐰 Keploy: 2024-08-28T09:48:32+05:30    INFO    starting UDP DNS server at addr :26789

> task-manager@1.0.0 start
> node dist/index.js

Server is listening at PORT 3000

    Server: http://localhost:3000
    API Docs: http://localhost:3000/api/docs
```

The above command will start recording the API calls made to the application and will generate a test case in the `testcases/` directory.

> 💡 You can use Postman or any other API testing tool to test the API calls. Additionally, the application will run a swagger UI on `http://localhost:3000/api/docs` to visualize the API calls.

### Test the Application

```bash
keploy test -c "npm start"
```

<SectionDivider />

## Running App using Docker Compose 🐳

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

A sample Task Management application and see how seamlessly Keploy integrates with Express, PostgreSQL and Prisma ORM. Buckle up, it's gonna be a fun ride!

<InstallReminder />

### Prerequisites

Ensure you have the following installed:

- Docker
- Node.js and npm
- Keploy CLI

Clone the repository and move to express-postgresql-prisma folder

```bash
git clone https://github.com/keploy/samples-typescript.git
cd samples-typescript/express-postgresql-prisma
```

### Install the dependencies

```bash
npm install
```

### Set up environment variables:

```bash
cp .env.example .env
```

We will be using Docker compose to run the application as well as PostreSql on Docker container.

Lights, Camera, Record! 🎥
Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags: -c: Command to run the app (e.g., docker compose up).

--container-name: The container name in the docker-compose.yml for traffic interception.

```bash
keploy record -c "docker compose up" --container-name "express-postgresql-prisma-app" --build-delay 50
```

**🔥 Challenge time!** Generate some test cases. How? Just make some API calls. Postman, Hoppscotch or even curl - take your pick!

### Interact with Application

Make API Calls using Postman or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

### API Routes

#### Add Task

- **URL:** `/api/v1/task/add`
- **Method:** `POST`
- **Description:** Add a new task.
- **Request Body:**
  ```json
  {
    "author": "John Doe",
    "title": "Complete the report",
    "description": "Complete the quarterly report by end of the week",
    "dueDate": "2024-08-01",
    "status": "Pending",
    "priority": 3
  }
  ```

Using `curl`

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/task/add' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "author": "John Doe",
  "title": "Complete the report",
  "description": "Complete the quarterly report by end of the week",
  "dueDate": "2024-08-01",
  "status": "Pending",
  "priority": 3
}'
```

#### View All Tasks

Using `curl`

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/task/view' \
  -H 'accept: application/json'
```

#### View Task by ID

- **URL:** `/api/v1/task/view/:id`
- **Method:** `GET`
- **Description:** Retrieve a specific task by its ID.
- **Request Params:** `id` (task ID)

Using `curl`

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/task/view/1' \
  -H 'accept: application/json'
```

#### Change Task Priority

- **URL:** `/api/v1/task/change-priority/:id`
- **Method:** `PUT`
- **Description:** Update the priority of a specific task.
- **Request Params:** `id` (task ID)
- **Request Body:**
  ```json
  {
    "priority": 3
  }
  ```

Using `curl`

```bash
curl -X 'PUT' \
  'http://localhost:3000/api/v1/task/change-priority/1' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "priority": 3
}'
```

#### Update Task

- **URL:** `/api/v1/task/update/:id`
- **Method:** `PUT`
- **Description:** Update details of a specific task.
- **Request Params:** `id` (task ID)
- **Request Body:**
  ```json
  {
    "author": "John Doe",
    "title": "Complete the report",
    "description": "Complete the quarterly report by end of the week",
    "dueDate": "2024-08-01",
    "status": "Pending",
    "priority": 3
  }
  ```

Using `curl`

```bash
curl -X 'PUT' \
  'http://localhost:3000/api/v1/task/update/2' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "author": "John Doe",
  "title": "Complete the report",
  "description": "Complete the quarterly report by end of the week",
  "dueDate": "2024-08-01",
  "status": "Pending",
  "priority": 3
}'
```

#### Delete Task

- **URL:** `/api/v1/task/delete/:id`
- **Method:** `DELETE`
- **Description:** Delete a specific task.
- **Request Params:** `id` (task ID)

Using `curl`

```bash
curl -X 'DELETE' \
  'http://localhost:3000/api/v1/task/delete/1' \
  -H 'accept: application/json'
```

> 🐰 Test Data and Configuration: After recording the interactions, a `keploy` folder will be created containing the recorded test data. Additionally, a `keploy.yml` file will be created as the configuration file.

### Test the Application using Keploy

```bash
keploy test -c "docker compose up" --container-name "nodeMongoApp" --build-delay 50 --delay 10
```

> The **--delay** flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Keploy will replay the recorded interactions and validate the responses against the expected results.

```bash
Node.js v22.7.0
🐰 Keploy: 2024-08-28T10:14:14+05:30    WARN    To enable storing mocks in cloud please use disableMockUpload flag/configuration

 <=========================================>
  COMPLETE TESTRUN SUMMARY.
        Total tests: 7
        Total test passed: 7
        Total test failed: 0
        Total time taken: "5.66 s"

        Test Suite Name         Total Test      Passed          Failed          Time Taken

        "test-set-0"            7               7               0               "5.66 s"
<=========================================>

🐰 Keploy: 2024-08-28T10:14:14+05:30    INFO    calculating coverage for the test run and inserting it into the report
🐰 Keploy: 2024-08-28T10:14:14+05:30    INFO    [Total Coverage Percentage:  86.16%]
🐰 Keploy: 2024-08-28T10:14:14+05:30    INFO    stopping Keploy {"reason": "replay completed successfully"}
🐰 Keploy: 2024-08-28T10:14:14+05:30    INFO    proxy stopped...
🐰 Keploy: 2024-08-28T10:14:17+05:30    INFO    eBPF resources released successfully...
```

Voila! 🎉 You have successfully tested the application using Keploy. Keploy also generates coverage reports for the test-suites.
