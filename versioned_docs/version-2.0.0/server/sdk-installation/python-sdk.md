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
2. [Pytest](https://pypi.org/project/pytest/)

## Contents
1. [Installation](#installation)
2. [Usage](#usage)

## Installation
1. First you need to install [Python(version 3 and above)](https://www.python.org/downloads/)

2. Install the Python-SDK and also Python's coverage library via pip.

```bash
pip install keploy coverage
```

3. Install Keploy from [here](https://github.com/keploy/keploy?tab=readme-ov-file#-quick-installation)

## Usage

Keploy simplifies the testing process by seamlessly generating end-to-end test cases without the need to write unit test files and manage mocks/stubs.

Add a test file with the following code to the directory with all your existing tests. This will help us to get the coverage of Keploy's API tests along with the other unit tests. We can call this `test_keploy.py`

```python
from keploy import run
def test_keploy():
    run("python3 -m coverage run --data-file=.coverage_data.keploy <command-to-run-your-application>")
```

> Note: If you face any problems with running the coverage library, you can refer to the documentation for the same [here](https://coverage.readthedocs.io/en/7.4.2/cmd.html#execution-coverage-run)

To ignore the coverage of python libraries which are included in the report by default, you need to create a `.coveragerc` file in the directory where you will ignore the /usr/ directory(only for Linux users). The contents of the file will be as follows:

```bash
[run]
omit =
    /usr/*
sigterm = true
```

Before starting your application, make sure that the **debug mode is set to False** in your application, for the coverage library to work properly.

Now to run this testcase along with your another unit testcases, you can run the command below:

```bash
keploy test -c "python3 -m coverage run -p --data-file=.coverage.unit -m pytest test_keploy.py <your-unit-test-file>" --delay 10 --coverage
```

Now, to combine the coverage from the unit tests, and Keploy's API tests, we can use the command below:

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

Hooray🎉! You've sucessfully got the coverage of your Keploy recorded api tests using Pytest.