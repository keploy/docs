---
id: samples-flask
title: Sample Task Creation CRUD App (Flask)
sidebar_label: Flask + Mongo
description: The following sample app showcases how to use the Flask framework and the Keploy Platform.
tags:
  - python
  - quickstart
  - samples
  - examples
  - tutorial
  - python-framework
  - mongodb
  - flask-framework
keyword:
  - Flask Framework
  - MongoDB
  - NoSQL
  - Python
  - API Test generator
  - Auto case generation
---

# Introduction

🪄 Dive into the world of Student CRUD Apps and see how seamlessly Keploy integrated with [Flask](https://flask.palletsprojects.com/en/3.0.x/) and [MongoDB](https://www.mongodb.com/). Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone a simple Student Management API 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/flask-mongo
```

## Installation Keploy

Depending on your OS, choose your adventure:

There are 2 ways you can run this sample application.

- [Using Docker compose : running application as well as Mongo on Docker container](#using-docker-compose-)
- [Using Docker container for Mongo and running application locally](#running-app-locally-on-linuxwsl-)

## Using Docker Compose 🐳

We will be using Docker compose to run the application as well as Mongo on Docker container.

### Lights, Camera, Record! 🎥

Capture the test-cases-

```shell
keploy record -c "docker compose up" --containerName "flask-app" --buildDelay 50
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Make a POST request:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Important task"}' http://localhost:5000/api/tasks
```

2. **Make a GET request:**

```bash
curl http://localhost:5000/api/tasks
```

3. **Make a PUT request:**

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Random task"}' http://localhost:5000/api/tasks/12345
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/12345
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "docker compose up" --containerName "flask-app" --buildDelay 50 --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

Final thoughts? Dive deeper! Try different API calls, tweak the DB response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold!✨👩‍💻👨‍💻✨

## Running App Locally on Linux/WSL 🐧

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MongoDB) chill on Docker. Ready? Let's get the party started!🎉

## Install all dependencies

```bash
pip install -r requirements.txt
```

## Start the MongoDB server

```bash
sudo service mongod start
```

## Setup Keploy

Let's get started by setting up the Keploy alias with this command:

```bash
curl --silent -O -L https://keploy.io/install.sh && source install.sh
```

You should see something like this:

```bash
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

Keploy CLI

Available Commands:
  example         Example to record and test via keploy
  generate-config generate the keploy configuration file
  record          record the keploy testcases from the API calls
  test            run the recorded testcases and execute assertions
  update          Update Keploy

Flags:
      --debug     Run in debug mode
  -h, --help      help for keploy
  -v, --version   version for keploy

Use "keploy [command] --help" for more information about a command.
```

## Lights, Camera, Record! 🎥

To initiate the recording of API calls, execute this command in your terminal:

```bash
keploy record -c "python3 app.py"
```

Now, your app will start running, and you have to make some API calls to generate the test cases!!

1. **Make a POST request:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Important task"}' http://localhost:5000/api/tasks
```

2. **Make a GET request:**

```bash
curl http://localhost:5000/api/tasks
```

3. **Make a PUT request:**

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"title":"Task 1","description":"Random task"}' http://localhost:5000/api/tasks/12345
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:5000/api/tasks/12345
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

## Run the tests

Now, it's time to put things to the test 🧪

```bash
keploy test -c "python3 app.py" --delay 10
```

Now, you can also try different API calls, tweak the DB response in the mocks.yml, or fiddle with the request or response in test-x.yml. Run the tests again and see the magic unfold!

## Check Test Coverage

We have a `test-app.py` where all the unit test cases has been written. Now using Keploy, we can check it's code coverage!!
Now to run your unit tests with Keploy, you can run the command given below:

```bash
python3 -m coverage run -p --data-file=.coverage.unit -m pytest -s test_keploy.py test_app.py
```

To combine the coverage from the unit tests, and Keploy's API tests we can use the command below:

```bash
python3 -m coverage combine
```

Finally, to generate the coverage report for the test run, you can run:

```bash
python3 -m coverage report
```

and if you want the coverage in an html file, you can run:

```bash
python3 -m coverage html
```

## Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible.😊🚀

Happy coding! ✨👩‍💻👨‍💻✨
