---
id: samples-nodejs-Mongoose-Rohit_Yadav
title: NodeJS Sample Application
sidebar_label: NodeJS - Express + Mongoose
description: The following sample app showcases how to use NodeJS framework and the Keploy Platform.
tags:
  - javascript
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - NodeJS Framework
  - MongoDB
  - NodeJS
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A simple sample CRUD application and see how seamlessly Keploy integrates with [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/).


<InstallationGuide/>

## Get Started! 🎬

Clone the repository and move to express-mongoose_Rohit_yadav folder

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/express-mongoose_Rohit_Yadav

# Install the dependencies
npm install
```

## Installation 📥

Depending on your OS, choose your adventure:
There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as MongoDb on Docker container](#using-docker-compose-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as MongoDb on Docker container.
 

Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--containerName`: The container name in the `docker-compose.yml` for traffic interception.

```bash
keploy record -c "docker compose up" --containerName "nodeMongoApp"
```

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

### Let's generate the testcases.

Make API Calls , Let's get started by setting up the Keploy with this command:


## Capturing Testcases

```bash
keploy record -c "npm start"

```
<!-- ![Testcase](./img/p4.jpg) -->
```bash

curl --request PUT \
--url http://your-api-url/edit/<booking_id> \
--header 'Content-Type: application/json' \
--data '{
  "userEmail": "new_email@example.com",
  "roomNumber": "101",
  "startTime": "2024-04-23T09:00:00Z",
  "endTime": "2024-04-23T11:00:00Z"
}'

```

Here's a peek of what you get:

```
Room Booked Successfully
```
 
we will get the output:

![Testcase](./img/p1.jpg)

🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

```bash
curl --request GET \
--url 'http://localhost:3000/bookings/view?roomNumber=1&roomType=A&startTime=2024-03-07T00:00:00Z&endTime=2024-03-08T00:00:00Z' \
--header 'Content-Type: application/json'
```

Or simply wander over to your browser and visit `http://localhost:3000/view`.

<!-- ![Testcase](./img/p2.jpg) -->

<!-- ![Testcase](./img/p3.jpg) -->


## Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --containerName "nodeMongoApp" --delay 10
```
 
🚀 Follow the URL road...!

```bash
curl --request GET \  --url http://localhost:8080/students
```

Or simply wander over to your browser and visit `http://localhost:8000/students`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

### Run Tests 🏁

Ready to put your spells to the test?

```bash
sudo -E env PATH=$PATH keploy test -c "node src/app.js" --delay 10
```

Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

<img src="/docs/img/testrun-node-pass.png" alt="Sample Keploy Test Result Node MongoDB" width="100%" style={{ borderRadius: '5px' }} />

## Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨
