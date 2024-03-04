---
id: samples-bunjs
title: BunJS Sample Application
sidebar_label: BunJS + Mongo
description: The following sample app showcases how to use BunJS framework and the Keploy Platform.
tags:
  - javascript
  - quickstart
  - samples
  - examples
  - tutorial
  - bun-js-framework
  - mongodb
keyword:
  - BunJS Framework
  - MongoDB
  - BunJS
  - API Test generator
  - Auto Testcase generation
  - javascript
---

# Sample Bun.js and MongoDB app

This is a sample app to test Keploy integration capabilities using [Bun.js](https://bun.sh) and [MongoDB](https://www.mongodb.com/).

## Pre-requsite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.
- Install BunJS ( `curl -fsSL https://bun.sh/install | bash` )

## Optional

- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.

## Setup app

Now that we have bun installed, we will setup our application

```zsh
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/bun-mongo

# Install the dependencies
bun install
```

## Installation 📥

There are two ways to use Keploy:-

Depending on your OS, choose your adventure:

- <details>
     <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>

  Alright, let's equip ourselves with the **latest Keploy binary**:

  ```bash
  curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

  sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
  ```

  If everything goes right, your screen should look a bit like this:

     <img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

  Moving on...

   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}>Run App on 🐧 Linux / WSL </summary>

  We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (mongoDB) chill on Docker. Ready? Let's get the party started!🎉

  > **Since we have setup our sample-app natively, we need to update the mongoDB host on line 41, in `supabun.ts`, from `mongodb://mongoDb-bun:27017/keploy` to `mongodb://localhost:27017/keploy`.**

  #### 🍃 Kickstart MongoDB

  Let's breathe life into your mongo container. A simple spell should do the trick:

  ```bash
  docker-compose up -d
  ```

  ### 📼 Roll the Tape - Recording Time!

  Ready, set, record! Here's how:

  ```bash
  sudo -E env PATH=$PATH keploy record -c 'bun run supabun.ts'
  ```

  Keep an eye out for the `-c `flag! It's the command charm to run the app.

  Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

  #### Let's generate the testcases.

  Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

  ```bash
  curl --request POST localhost:420/save
  ```

  Here's a peek of what you get:

  ```
  {"succes":true}
  ```

  🎉 Woohoo! Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

  <img src="/docs/img/testcase-node.png" alt="Sample Keploy Test Result Bun MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

  Now, the real fun begins. Let's weave more spells!

  🚀 Follow the URL road...!

  ```bash
  curl --request GET localhost:420/fetch
  ```

  Or simply wander over to your browser and visit `http://localhost:420/fetch`.

  this will provide us with the output:-

  ```
  {"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
  ```

  We will get the following output in our terminal

  ![Testcase](/img/testcase-bun.png)

  Did you spot the new test and mock scrolls in your project library? Awesome! 👏

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>

   <details>
   <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}> Run App with <img src="/docs/img/os/docker.png" alt="Docker Container" width="3%" /> Docker </summary>

  ### Lights, Camera, Record! 🎥

  First We'll start our MongoDb Instance:

  ```sh
  docker-compose up -d
  ```

  Now, let's build docker image for our application:

  ```sh
  docker build -t bun-app:1.0 .
  ```

  Now, We'll run keploy in record mode:

  ```sh
  keploy record -c "docker run -p 420:420 --name bunMongoApp --network keploy-network bun-app:1.0"
  ```

  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  #### Let's generate the testcases.

  Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

  ```bash
  curl --request POST localhost:420/save
  ```

  Here's a peek of what you get:

  ```
  {"succes":true}
  ```

  🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

  _Time to perform more API magic!_
  Follow the breadcrumbs... or Make more API Calls

  ```bash
  curl --request GET localhost:420/fetch
  ```

  Or simply wander over to your browser and visit `http://localhost:420/fetch`.

  this will provide us with the output:-

  ```
  {"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
  ```

  We will get the following output in our terminal

  ![Testcase](/img/testcase-bun.png)

  Did you spot the new test and mock scrolls in your project library? Awesome! 👏

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨
   </details>

   </details>
    <br/>

- <details>
     <summary><img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs </summary>

  Dive straight in, but first in case you're using **Keploy** with **Colima**, give it a gentle nudge with (`colima start`). Let's make sure it's awake and ready for action!

  ### Use Keploy with Docker-Desktop

  Note: To run Keploy on MacOS through [Docker](https://docs.docker.com/desktop/release-notes/#4252) the version must be `4.25.2` or above.

  #### Creating Docker Volume

  ```bash
  docker volume create --driver local --opt type=debugfs --opt device=debugfs debugfs
  ```

  ### Use Keploy with Colima

  ### Lights, Camera, Record! 🎥

  First We'll start our MongoDb Instance:

  ```sh
  docker-compose up -d
  ```

  Now, let's build docker image for our application:

  ```sh
  docker build -t bun-app:1.0 .
  ```

  Now, We'll run keploy in record mode:

  ```sh
  keploy record -c "docker run -p 420:420 --name bunMongoApp --network keploy-network bun-app:1.0"
  ```

  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  #### Let's generate the testcases.

  Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

  ```bash
  curl --request POST localhost:420/save
  ```

  Here's a peek of what you get:

  ```
  {"succes":true}
  ```

  🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

  _Time to perform more API magic!_
  Follow the breadcrumbs... or Make more API Calls

  ```bash
  curl --request GET localhost:420/fetch
  ```

  Or simply wander over to your browser and visit `http://localhost:420/fetch`.

  this will provide us with the output:-

  ```
  {"succes":{"_id":"6513cfec0bc1a17a36c06337","name":"Cow","sound":"Moo","__v":0}}
  ```

  We will get the following output in our terminal

  ![Testcase](/img/testcase-bun.png)

  Did you spot the new test and mock scrolls in your project library? Awesome! 👏

  ## Wrapping it up 🎉

  Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

  Happy coding! ✨👩‍💻👨‍💻✨

   </details>

### Running the testcases

This is WIP and depended upon the issue by oven/bun & elysia:- https://github.com/elysiajs/elysia/issues/231
