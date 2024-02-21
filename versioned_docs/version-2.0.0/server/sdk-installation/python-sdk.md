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

## Installation

### Get the Keploy Python SDK

Install the latest release of the [Keploy Python SDK](https://pypi.org/project/keploy)

```bash
pip3 install keploy
```

## Usage

For getting the code coverage of Keploy tests along with your unit tests, you need to add the following test to your
Pytest file. It can be called as `test_keploy.py`.

```python
from Keploy import run

def test_keploy():
    run("python3 app.py")

```

Now let's run this test using Pytest and Keploy. You can do so by running the command given below:

```bash
keploy test -c "python3 -m coverage run -m pytest test_keploy.py" --delay 10 --coverage
```

Hooray🎉! You've sucessfully got the coverage of your Keploy recorded api tests using Pytest.
