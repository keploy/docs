---
id: python
title: Keploy Integration with Pytest
sidebar_label: Pytest
tags:
  - python
  - pytest
keyword:
  - Pytest Framework
  - Flask Framework
  - MongoDb
  - Python
  - API Test generator
  - Auto Testcase generation
  - Pytest
---

## Pre-requisites

1. [Python 3 and above](https://www.python.org/downloads/)
2. [PyTest](https://pypi.org/project/pytest/)
3. [Keploy](https://github.com/keploy/keploy?tab=readme-ov-file#-quick-installation)

You can get the coverage with Keploy in 2 ways:

1. [Using Keploy Binary](#Using-Keploy-Binary)
2. [Using Keploy Docker](#Using-Keploy-Docker)

## Using Keploy Binary

First you need to install Keploy's Python SDK:

```bash
pip install keploy pytest
```

Next, create a test file for running Keploy's API tests. You can name the file `test_keploy.py`, and the contents of the file will be as follows:

```python
from keploy import run, RunOptions

def test_keploy():
    try:
        options = RunOptions(delay=15, debug=False, port=0)
    except ValueError as e:
        print(e)
    run("python3 -m coverage run -p --data-file=.coverage.keploy <command-to-run-your-application>", options)
```

We also need to create a `.coveragerc` file to ignore the coverage of the libraries that is calculated. The contents of the file will be as follows:

```sh
[run]
omit =
    /usr/*
sigterm = true
```

Before starting your application, make sure that the **debug mode is set to False** in your application, for the coverage library to work properly. It should look something like this:

```python
app.run(host=HOST, port=PORT, debug=False)
```

Now to run your unit tests with Keploy, you can run the command given below:

```python
python3 -m coverage run -p --data-file=.coverage.unit -m pytest -s test_keploy.py <your-unit-test-file>
```

> Note: If you face any problems with running the coverage library, you can refer to the documentation for the same [here](https://coverage.readthedocs.io/en/7.4.2/cmd.html#execution-coverage-run)

To combine the coverages and get the reports, you can refer to [this](#combine-and-get-report) section.

Hooray🎉! You've sucessfully got the coverage of your Keploy recorded api tests and unit tests using Pytest.

## Using Keploy Docker

Add the following lines to your `Dockerfile` to install the coverage library and to start the application with the coverage library.

```bash
RUN pip3 install coverage
CMD ["python3", "-m", "coverage", "run",  "-p", "--data-file=./.coverage.unit", "<command-to-run-your-application>"]
```

You also need to add a `.coveragerc` file to ignore the coverage of the libraries used and also enable relative paths to combine the coverage files easily.

```bash
[run]
omit =
    /usr/*
sigterm = true
relative_files = true
```

You need to make sure that your present working directory on the host is mounted to the working directory in the docker container. In a docker compose file, it will look something like this:

```bash
    volumes:
      - .:<working-directory-in-the-container>
```

To get the coverage of Keploy's API tests, you can run the command given below:

```bash
keploy test -c "<command-to-run-your-docker-application>" --containerName=<container-name-on-which-tests-have-been-recorded> --buildDelay 100 --delay 10
```

Now, to get the coverage of your unit tests, you need to update the run command in your Dockerfile to:

```bash
CMD ["python3","-m","coverage","run","-p","--data-file=./.coverage.unit","-m","pytest","test_app.py"]
```

To get the unit coverage you can either run it by using your normal docker run command, or to run it using Keploy, you can use the command below:

```bash
keploy test -c "<command-to-run-your-docker-application>" --containerName=<container-name-on-which-tests-have-been-recorded> --buildDelay 100 --delay 10
```

Now that you have the coverages of both your unit tests and Keploy's API tests, you can combine them and get the report from [here](#combine-and-get-report)

## Combine And Get Report

To combine the coverage from the unit tests, and Keploy's API tests we can use the command below:

```bash
python3 -m coverage combine
```

Make sure to run this command before starting a new test run to avoid getting multiple coverage files.

Finally, to generate the coverage report for the test run, you can run:

```bash
python3 -m coverage report
```

and if you want the coverage in an html file, you can run:

```bash
python3 -m coverage html
```
