---
id: python
title: Merge Unit Test Coverage Data
sidebar_label: Python
tags:
  - python
  - coverage
keyword:
  - Pytest Framework
  - Flask Framework
  - coverage
  - MongoDb
  - Python
  - API Test generator
  - Auto Testcase generation
  - Pytest
---

import WhatAreKeployFeatures from './index.md'

<WhatAreKeployFeatures/>

| Programming Language | Prerequisites                                                                                                                      |
| :------------------: | :--------------------------------------------------------------------------------------------------------------------------------- |
|        python        | [Python 3 and above](https://www.python.org/downloads/) <br/> [coverage.py](https://coverage.readthedocs.io/en/7.4.1/install.html) |

## Usage

To get the coverage data for your unit tests:

```sh
coverage run --data-file=.coverage.unit test_program.py
```

Here, test_program.py is the unit test program you want to run, and --data-file is set to .coverage.unit becuase, by default, raw coverage data would be written to .coverage which is where coverage data for keploy tests is present, so to avoid overwritting we pass a new file through data-file flag.

> Note: If you face any problems with running the coverage library, you can refer to the documentation for the same [here](https://coverage.readthedocs.io/en/7.4.2/cmd.html#execution-coverage-run)

### Combine And Get Report

To combine the coverage from the unit tests, and Keploy's API tests we can use the command below:

```bash
coverage combine
```

Make sure to run this command before starting a new test run to avoid getting multiple coverage files.

Finally, to generate the coverage report for the test run, you can run:

```bash
coverage report
```

and if you want the coverage in an html file, you can run:

```bash
coverage html
```
