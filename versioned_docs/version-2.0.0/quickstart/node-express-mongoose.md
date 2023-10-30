---
id: samples-nodejs
title: NodeJS Sample Application
sidebar_label: NodeJS - Express + Mongoose
description: The following sample app showcases how to use NodeJS framework and the Keploy Platform.
tags:
  - NodeJS Framework
  - MongoDB
keyword:
  - NodeJS Framework
  - MongoDB
  - NodeJS
  - API Test generator
  - Auto Testcase generation
---

## Introduction

A simple sample CRUD application and see how seamlessly Keploy integrates with [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/). Buckle up, it's gonna be a fun ride! 🎢

## Pre-Requisite 🛠️

- Install WSL (`wsl --install`) for <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows.
- Install Colima( `brew install colima && colima start` ) for <img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs.

## Get Started! 🎬

## Setup application

Clone the repository and move to express-mongoose folder

```bash
git clone https://github.com/keploy/samples-typescript && cd samples-typescript/express-mongoose

# Install the dependencies
npm install
```

## Installation 📥

<<<<<<< HEAD
Depending on your OS, choose your adventure:

- <details>
    <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>
  =======

Depending on your OS, choose your adventure:

- <details>
      <summary><img src="/docs/img/os/linux.png" alt="Linux" width="3%" /> Linux or <img src="/docs/img/os/windows.png" alt="Windows" width="3%" /> Windows</summary>
  >>>>>>> cef8099e5854801cd41d73af1ce251d0745bf48e

  Alright, let's equip ourselves with the **latest Keploy binary**:

  ```bash
  curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp

  sudo mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin && keploy
  ```

  If everything goes right, your screen should look a bit like this:

<<<<<<< HEAD
<img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

Moving on...

  <details>
  <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}> Run App with <img src="/docs/img/os/docker.png" alt="Docker Container" width="3%" /> Docker </summary>
=======
    <img src="/docs/img/code-snippets/install-keploy-logs.png" alt="Test Case Generator" width="50%" />

Moving on...
<details>
<summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}> Run App with <img src="/docs/img/os/docker.png" alt="Docker Container" width="3%" /> Docker </summary>

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

#### Add alias for Keploy:

```bash
alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
```

# <<<<<<< HEAD

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

### Lights, Camera, Record! 🎥

Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
`-c`: Command to run the app (e.g., `docker compose up`).

`--containerName`: The container name in the `docker-compose.yml` for traffic interception.

```sh
keploy record -c "docker compose up" --containerName "nodeMongoApp"
```

<<<<<<< HEAD
🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

`````bash
=======

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

````bash
>>>>>>> cef8099e5854801cd41d73af1ce251d0745bf48e
curl --request POST \
--url http://localhost:8000/students \
 --header 'content-type: application/json' \
 --data '{
  "name":"John Do",
  "email":"john@xyiz.com",
  "phone":"0123456799"
  }'
  ```
Here's a peek of what you get:
<<<<<<< HEAD

`````

Student registration successful!

```
=======

```

Student registration successful!

````
>>>>>>> cef8099e5854801cd41d73af1ce251d0745bf48e
🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

```bash
curl --request GET \  --url http://localhost:8080/students
<<<<<<< HEAD
```
=======
````

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > Or simply wander over to your browser and visit `http://localhost:8000/students`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

#### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --containerName "nodeMongoApp" --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Your results should be looking all _snazzy_, like this:
<img src="/docs/img/testrun-node-fail.png" alt="Sample Keploy Test Result Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

Our testcases failed as the Keep-Alive connection won't be available when we are using testmode, this happen because in test mode the Keploy uses the `Mocks.yml`, which was generated in the record mode. 🕰️

Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

```
      noise:
      |   - header.Date
      |   - header.Keep-Alive
      |   - header.Connection
```

<<<<<<< HEAD

=======

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > Pro tip: Add `header.Connection` & `header.Keep-Alive` to noise in `test-x.yaml`.

<img src="/docs/img/testrun-node-pass.png" alt="Sample Keploy Test Result Node MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

## Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

<<<<<<< HEAD

  </details>
  <br/>

  <details>
  <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}>Run App on 🐧 Linux  </summary>

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (mongoDB) chill on Docker. Ready? Let's get the party started!🎉

=======
</details>
<br/>

    <details>
    <summary style={{ fontWeight: 'bold', fontSize: '1.17em', marginLeft: '0.5em' }}>Run App on 🐧 Linux  </summary>

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (mongoDB) chill on Docker. Ready? Let's get the party started!🎉

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > First things first, update the MongoDB URL on line 4, in **`db/connection.js`**, from `mongodb://mongoDb:27017/keploy` to `mongodb://127.0.0.1:27017/keploy`.

#### 🍃 Kickstart MongoDB

Let's breathe life into your mongo container. A simple spell should do the trick:

```bash
docker compose up mongo
```

### 📼 Roll the Tape - Recording Time!

Ready, set, record! Here's how:

```bash
sudo -E env PATH=$PATH keploy record -c 'node src/app.js'
```

# <<<<<<< HEAD

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > Keep an eye out for the `-c `flag! It's the command charm to run the app.

Alright, magician! With the app alive and kicking, let's weave some test cases. The spell? Making some API calls! Postman, Hoppscotch, or the classic curl - pick your wand.

#### Let's generate the testcases.

<<<<<<< HEAD

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

=======

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

```bash
curl --request POST \
--url http://localhost:8000/students \
--header 'content-type: application/json' \
--data '{
  "name":"John Do",
  "email":"john@xyiz.com",
  "phone":"0123456799"
  }'
```

<<<<<<< HEAD
Here's a peek of what you get:

```
Student registration successful!
```

=======

Here's a peek of what you get:

```
Student registration successful!
```

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > 🎉 Woohoo! Give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **Keploy directory** and you'll discover your handiwork in `test-1.yml` and `mocks.yml`.

<img src="/docs/img/testcase-node.png" alt="Sample Keploy Test Result Node MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

Now, the real fun begins. Let's weave more spells!

🚀 Follow the URL road...!

```bash
curl --request GET \  --url http://localhost:8080/students
```

# <<<<<<< HEAD

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > Or simply wander over to your browser and visit `http://localhost:8000/students`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

### Run Tests 🏁

Ready to put your spells to the test?

```bash
sudo -E env PATH=$PATH keploy test -c "node src/app.js" --delay 10
```

Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

```
      noise:
      |   - header.Date
      |   - header.Keep-Alive
      |   - header.Connection
```

<<<<<<< HEAD

=======

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > Pro tip: Add `header.Connection` & `header.Keep-Alive` to noise in `test-x.yaml`.

<img src="/docs/img/testrun-node-pass.png" alt="Sample Keploy Test Result Node MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

<<<<<<< HEAD

## Wrapping it up 🎉

=======

## Wrapping it up 🎉

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨
<<<<<<< HEAD

  </details>
</details>
 <br/>
=======
    </details>
  </details>
   <br/>
>>>>>>> cef8099e5854801cd41d73af1ce251d0745bf48e

- <details> 
    <summary><img src="/docs/img/os/macos.png" alt="MacOS" width="3%" /> MacOs </summary>

  Dive straight in, but first, give **Colima** a gentle nudge with (`colima start`). Let's make sure it's awake and ready for action!

  #### Add alias for Keploy 🐰:

  For the sake of convenience (and a bit of Mac magic 🪄), let's set up a shortcut for Keploy:

  ```bash
  alias keploy='sudo docker run --pull always --name keploy-v2 -p 16789:16789 --privileged --pid=host -it -v "$(pwd)":/files -v /sys/fs/cgroup:/sys/fs/cgroup -v /sys/kernel/debug:/sys/kernel/debug -v /sys/fs/bpf:/sys/fs/bpf -v /var/run/docker.sock:/var/run/docker.sock --rm ghcr.io/keploy/keploy'
  ```

  ### Lights, Camera, Record! 🎥

  Fire up the application and mongoDB instance with Keploy. Keep an eye on the two key flags:
  `-c`: Command to run the app (e.g., `docker compose up`).

  `--containerName`: The container name in the `docker-compose.yml` for traffic interception.

  ```sh
  keploy record -c "docker compose up" --containerName "nodeMongoApp"
  ```

  <<<<<<< HEAD
  🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

  #### Let's generate the testcases.

  Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

=======

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

#### Let's generate the testcases.

Make API Calls using [Hoppscotch](https://hoppscotch.io), [Postman](https://postman.com) or cURL command. Keploy with capture those calls to generate the test-suites containing testcases and data mocks.

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

````bash
curl --request POST \
--url http://localhost:8000/students \
 --header 'content-type: application/json' \
 --data '{
  "name":"John Do",
  "email":"john@xyiz.com",
  "phone":"0123456799"
  }'
<<<<<<< HEAD
  ```
Here's a peek of what you get:

````

Student registration successful!

```
=======
```

Here's a peek of what you get:

```
Student registration successful!
```

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > 🎉 Woohoo! With a simple API call, you've crafted a test case with a mock! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

_Time to perform more API magic!_
Follow the breadcrumbs... or Make more API Calls

```bash
curl --request GET \  --url http://localhost:8080/students
```

# <<<<<<< HEAD

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
> > > > > > > Or simply wander over to your browser and visit `http://localhost:8000/students`.

Did you spot the new test and mock scrolls in your project library? Awesome! 👏

#### Run Tests

Time to put things to the test 🧪

```bash
keploy test -c "docker compose up" --containerName "nodeMongoApp" --delay 10
```

<<<<<<< HEAD

> # The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.
>
> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.
>
> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

Your results should be looking all _snazzy_, like this:
<img src="/docs/img/testrun-node-fail.png" alt="Sample Keploy Test Result Gin MongoDB" width="100%" style={{ borderRadius: '5px' }}/>

Our testcases failed as the Keep-Alive connection won't be available when we are using testmode, this happen because in test mode the Keploy uses the `Mocks.yml`, which was generated in the record mode. 🕰️

Worry not, just add the ever-changing fields (like our **ts** here) to the **noise parameter** to **dodge those assertions**.

```
      noise:
      |   - header.Date
      |   - header.Keep-Alive
      |   - header.Connection
```

<<<<<<< HEAD

> Pro tip: Add `header.Connection` & `header.Keep-Alive` to noise in `test-x.yaml`.

## Wrapping it up 🎉

=======

> Pro tip: Add `header.Connection` & `header.Keep-Alive` to noise in `test-x.yaml`.

## Wrapping it up 🎉

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

  </details>
<<<<<<< HEAD

=======

> > > > > > > cef8099e5854801cd41d73af1ce251d0745bf48e
