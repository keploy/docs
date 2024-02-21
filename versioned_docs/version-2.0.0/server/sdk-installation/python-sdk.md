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
import pytest
import subprocess
import os
import requests
import logging
import sys
import time

from keployCLI import(
    fetch_test_sets,
    run_test_set,
    fetch_test_set_status,
    TestRunStatus,
    stop_user_application,
    start_user_application,
    find_coverage
    # cleanupProcesses
)

# Logger setup
logger = logging.getLogger('KeployCLI')
logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Global variables
server_port = 16789
MAX_TIMEOUT = 100000 # 1 minute timeout for now

def test_keploy():
    testResult = True
    startTime = time.time()

    try:
        testSets = fetch_test_sets()
        if testSets is None:
            pytest.fail('Test sets are null')

        logger.info(f"TestSets: {testSets}")
        # Wait for keploy to start
        subprocess.call(["sleep", "10"])
        for testset in testSets:
            start_user_application("python3 app.py")
            subprocess.call(["sleep", "10"])
            result = True
            testRunId = run_test_set(testset)
            testRunStatus = None

            while True:
                # Check status every 2 sec
                subprocess.call(["sleep", "2"])
                testRunStatus = fetch_test_set_status(testRunId)
                if testRunStatus == TestRunStatus.RUNNING:
                    logger.info("testRun still in progress")

                    # Check if timeout has been reached
                    if time.time() - startTime > MAX_TIMEOUT:
                        logger.info("Timeout reached, exiting loop")
                        break

                    continue
                break

            if testRunStatus == TestRunStatus.FAILED:
                logger.info("testrun failed")
                result = False
            elif testRunStatus == TestRunStatus.PASSED:
                logger.info("testrun passed")
                result = True

            logger.info(f"TestResult of [{testset}]: {result}")
            testResult = testResult and result
            find_coverage(testset)
            stop_user_application()
            # wait 10 sec for server to stop
            subprocess.call(["sleep", "10"])
    # error
    except Exception as e:
        pytest.fail(f"Test execution failed: {str(e)}")

    assert testResult, "Test failed"

```

# <<<<<<< HEAD

> > > > > > > 22cc378276c6bbb265ee8b6f6c044ca36ddf6113
> > > > > > > Now let's run this test using Pytest and Keploy. You can do so by running the command given below:

```bash
keploy test -c "python3 -m coverage run -m pytest test_keploy.py" --delay 10 --coverage
```

Hooray🎉! You've sucessfully got the coverage of your Keploy recorded api tests using Pytest.
