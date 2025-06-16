---
id: java-spring-boot-mongo
title: Sample Rest API with Spring-Boot and MongoDB
sidebar_label: Potion App (MongoDb)
description: This CRUD Application is about managing the data of Magical Potions in the Keploy inventory.
tags:
  - java
  - spring-jpa
  - java-framework
  - quickstart
  - samples
  - examples
  - tutorial
  - mongodb
keyword:
  - MongoDB
  - Maven
  - Springboot Framework
  - Postgres
  - SQL
  - Java
  - API Test generator
  - Auto Testcase generation
  - Junit
---

## Introduction

🪄 Dive into the world of REST API and see how seamlessly Keploy integrates with [Spring-Boot](https://github.com/spring-projects/spring-boot) and MongoDB Buckle up, it's gonna be a fun ride! 🎢

## Pre-Requisite 🛠️

- Install JDK and add JAVA_HOME in environment variable.
- Install [Maven](https://maven.apache.org/install.html)
- Install [Docker](https://docs.docker.com/engine/install/)

## Get Started! 🎬

### Set up the Mongo database

Create a docker network -

```bash
docker network create backend
```

Start the MongoDB instance -

```bash
docker run -p 27017:27017 --name spring-boot-mongo --network backend mongo
```

### Clone the sample REST API CRUD app 🧪

```bash
git clone https://github.com/keploy/samples-java.git && cd samples-java/spring-boot-mongo
mvn wrapper:wrapper
./mvnw clean install
```

> **Note**: For Windows, use `mvnw.cmd clean install`

## Install Keploy 📥

First things first, If you are using WSL on windows then use below to start wsl in the user's home directory:

```bash
wsl ~
```

Alright, let's equip ourselves with the **latest Keploy binary**:

```bash
curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
```

If everything goes right, your screen should look a bit like this:

<img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

## Run Application

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (mongoDB) chill on Docker. Ready? Let's get the party started!🎉

### 📼 Roll the Tape - Recording Time!

Ready, set, record! Here's how:

```bash
keploy record -c "./mvnw spring-boot:run"
```

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

### Generate testcases

To generate testcases we just need to **make some API calls.**

**1. Make a POST request**

```bash
curl --location 'http://localhost:8080/potions' \
--header 'Content-Type: application/json' \
--data '    {
      "name": "Strength Potion v2",
      "description": "Enhances the drinker'\''s physical strength temporarily.",
      "bottle": 3,
      "quantity": 150
  }'
```

**2. Make a GET request**

```bash
curl --location --request GET 'http://localhost:8080/potions'
```

> Take a note of the `id` and replace the `UUID_OF_POTION` with the `id` in the upcoming API requests!

**3. Make a PUT request**

```bash
  curl --location --request PUT 'http://localhost:8080/potions/UUID_OF_POTION' \
  --header 'Content-Type: application/json' \
  --data '    {
        "name": "Strength Potion",
        "description": "Enhances the drinker'\''s physical strength temporarily.",
        "bottle": 5,
        "quantity": 200
    }'
```

**4. Make a GET request**

```bash
curl --location --request GET 'http://localhost:8080/potions/UUID_OF_POTION'
```

**5. Make a DELETE request**

```bash
curl --location --request DELETE 'http://localhost:8080/potions/UUID_OF_POTION'
```

Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-x.yml` and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests 🏁

Ready to put your spells to the test?

```bash
keploy test -c "./mvnw spring-boot:run" --delay 15
```

This will run the tests and generate the report in the `Keploy/reports` directory in the CWD.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. We provided you with some data in [potions.json](https://github.com/keploy/samples-java/blob/main/spring-boot-mongo/potions.json). Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

## Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
