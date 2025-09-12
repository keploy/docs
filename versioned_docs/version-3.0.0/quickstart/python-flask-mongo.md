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

## Introduction

🪄 Dive into the world of Student CRUD Apps and see how seamlessly Keploy integrated with Flask and MongoDB Buckle up, it's gonna be a fun ride! 🎢

## Clone a simple Student Management API 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/flask-mongo
```

# How to run the sample application Using Docker Compose 🐳

Note: Before getting started, make sure Keploy is installed on your machine.

We will be using Docker compose to run the application as well as Mongo on Docker container.

### Lights, Camera, Record! 🎥

Capture the test-cases-

```shell
keploy record -c "docker compose up" --container-name "flask-app" --buildDelay 50
```

🔥**Make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's make URLs short and sweet:

### Generate testcases

To generate testcases we just need to **make some API calls.**

1. **Make a POST request:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"student_id": "12345", "name": "John Doe", "age": 20}' http://localhost:6000/students
```

2. **Make a GET request:**

```bash
curl http://localhost:6000/students
```

3. **Make a PUT request:**

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name": "Jane Smith", "age": 21}' http://localhost:6000/students/12345
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:6000/students/12345
```

And once you are done, you can stop the recording and give yourself a pat on the back! With that simple spell, you've conjured up a test case with a mock! Explore the **keploy** directory and you'll discover your handiwork in `tests` directory and `mocks.yml`.

Want to see if everything works as expected?

### Run Tests

Time to put things to the test 🧪

```shell
keploy test -c "docker compose up" --container-name "flask-app" --buildDelay 50 --delay 10
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking.

# How to Run the App Locally on Linux/WSL 🐧

Note: Before getting started, make sure Keploy is installed on your machine.

## Introduction

🪄 Dive into the world of Student CRUD Apps and see how seamlessly Keploy integrated with Flask and MongoDB Buckle up, it's gonna be a fun ride! 🎢

## Clone a simple Student Management API 🧪

```bash
git clone https://github.com/keploy/samples-python.git && cd samples-python/flask-mongo
```

We'll be running our sample application right on Linux, but just to make things a tad more thrilling, we'll have the database (MongoDB) chill on Docker. Ready? Let's get the party started!🎉

## Install all dependencies

```bash
pip install -r requirements.txt
```

## Start the MongoDB container

```bash
docker run -p 27017:27017 -d --network backend --name mongo mongo
```

> **Since we are using a MongoDB container, we need to update the `client` on line 11 in `app.py`, to `localhost`.**

## Lights, Camera, Record! 🎥

To initiate the recording of API calls, execute this command in your terminal:

```bash
keploy record -c "python3 app.py"
```

Now, your app will start running, and you have to make some API calls to generate the test cases!!

1. **Make a POST request:**

```bash
curl -X POST -H "Content-Type: application/json" -d '{"student_id": "12345", "name": "John Doe", "age": 20}' http://localhost:6000/students
```

2. **Make a GET request:**

```bash
curl http://localhost:6000/students
```

3. **Make a PUT request:**

```bash
curl -X PUT -H "Content-Type: application/json" -d '{"name": "Jane Smith", "age": 21}' http://localhost:6000/students/12345
```

4. **Make a DELETE request:**

```bash
curl -X DELETE http://localhost:6000/students/12345
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

Hope this helps you out, if you still have any questions, reach out to us .
