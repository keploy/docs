---
id: samples-php-mongodb
title: PHP Sample Application (MongoDB)
sidebar_label: PHP - Slim + MongoDB
description: The following sample app showcases how to use PHP Slim framework with MongoDB and the Keploy Platform.
tags:
  - php
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - PHP Framework
  - MongoDB
  - Slim
  - API Test generator
  - Auto Testcase generation
---

import InstallReminder from '@site/src/components/InstallReminder';

import SectionDivider from '@site/src/components/SectionDivider';

## Using Docker Compose 🐳

A simple sample CRUD Books API application and see how seamlessly Keploy integrates with PHP Slim and MongoDB. Buckle up, it's gonna be a fun ride! 🎢

<InstallReminder />

### Get Started! 🎬

Clone the repository and move to slim-mongodb folder

```bash
git clone https://github.com/swastikiscoding/samples-php.git && cd samples-php/slim-mongodb
```

We will be using Docker compose to run the application as well as MongoDB on Docker container.

### Lights, Camera, Record! 🎥

First, let's set up the environment and start recording. Keep an eye on the key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--container-name`: The container name in the `docker-compose.yml` for traffic interception.

```bash
# Create network
docker network create keploy-network

# Start MongoDB database
docker compose up -d mongodb

# Build the application
docker compose build app

# Start recording with Keploy
keploy record -c "docker compose up app" --container-name "slim-mongodb-app-1" -n keploy-network
```

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Let's generate the testcases.

Make API Calls using Postman or cURL command. Keploy will capture those calls to generate the test-suites containing testcases and data mocks.

```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Go Programming Language", "author": "Alan Donovan", "price": 44.99}'
```

Here's a peek of what you get:

```json
{"title":"The Go Programming Language","author":"Alan Donovan","price":44.99,"id":"507f1f77bcf86cd799439011"}
```

> **Note**: MongoDB uses ObjectId format for IDs (e.g., `507f1f77bcf86cd799439011`). Copy the `id` from the POST response to use in subsequent requests.

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

```bash
# Create more books
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin", "price": 39.99}'

# Get all books
curl http://localhost:8080/api/books

# Get a specific book (replace <BOOK_ID> with actual ID from previous response)
curl http://localhost:8080/api/books/<BOOK_ID>

# Update a book (replace <BOOK_ID> with actual ID)
curl -X PUT http://localhost:8080/api/books/<BOOK_ID> \
  -H "Content-Type: application/json" \
  -d '{"title": "The Go Programming Language", "author": "Alan Donovan & Brian Kernighan", "price": 49.99}'

# Delete a book (replace <BOOK_ID> with actual ID)
curl -X DELETE http://localhost:8080/api/books/<BOOK_ID>
```

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

### Run Tests

Time to put things to the test 🧪

```bash
# Stop any running containers
docker compose down

# Run Keploy tests
keploy test -c "docker compose up app" --container-name "slim-mongodb-app-1" -n keploy-network --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

<SectionDivider />

## Running App Locally on Linux/WSL 🐧

A simple sample CRUD Books API application and see how seamlessly Keploy integrates with PHP Slim and MongoDB. Buckle up, it's gonna be a fun ride! 🎢

<InstallReminder />

### Get Started! 🎬

Clone the repository and move to slim-mongodb folder

```bash
git clone https://github.com/swastikiscoding/samples-php.git && cd samples-php/slim-mongodb

# Install the dependencies
composer install
```

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MongoDB) chill on Docker. Ready? Let's get the party started!🎉

If you are using WSL on windows then use below to start wsl in the user's home directory:

```bash
wsl ~
```

#### 🍃 Kickstart MongoDB

We are going to run a MongoDB docker container which requires an existing docker network. We need to run the following command to create the required docker network:

```bash
docker network create keploy-network
```

Now, let's breathe life into your MongoDB container. A simple spell should do the trick:

```bash
docker compose up -d mongodb
```

#### Configure Environment

Set up the database connection environment variables:

```bash
export MONGO_URI=mongodb://localhost:27017
export DB_NAME=booksdb
```

### 📼 Roll the Tape - Recording Time!

Ready, set, record! Here's how:

```bash
sudo -E env PATH=$PATH keploy record -c 'php -S localhost:8080 -t public'
```

Keep an eye out for the `-c` flag! It's the command charm to run the app.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

#### Let's generate the testcases.

Make API Calls using Postman or cURL command. Keploy will capture those calls to generate the test-suites containing testcases and data mocks.

```bash
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Go Programming Language", "author": "Alan Donovan", "price": 44.99}'
```

Here's a peek of what you get:

```json
{"title":"The Go Programming Language","author":"Alan Donovan","price":44.99,"id":"507f1f77bcf86cd799439011"}
```

🎉 Woohoo! Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

Now, the real fun begins. Let's weave more spells!

🚀 Follow the URL road...!

```bash
# Get all books
curl http://localhost:8080/api/books

# Create another book
curl -X POST http://localhost:8080/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin", "price": 39.99}'
```

Or simply wander over to your browser and visit `http://localhost:8080/api/books`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

### Run Tests 🏁

Ready to put your spells to the test?

```bash
sudo -E env PATH=$PATH keploy test -c "php -S localhost:8080 -t public" --delay 10
```

### Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨
