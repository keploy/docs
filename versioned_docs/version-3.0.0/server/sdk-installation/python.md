---
id: python
title: Merge Unit and Keploy Test Coverage Data
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

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

| Programming Language | Prerequisites                                                             |
| :------------------: | :------------------------------------------------------------------------ |
|        python        | [Python 3 and above](https://www.python.org/downloads/) <br/> coverage.py |

## Usage

#### First install Coverage library:

```
pip install coverage
```

For Python, Keploy will automatically generate the coverage report after you run the command below.

```
keploy test -c "your_application_command"
```

If you’re running with **Unicorn**, use the following command:

```
keploy test -c "python -m uvicorn application.main:app --reload" --delay 10
```

After successful execution of this command, A coverage report would be generated inside the test-run folder of keploy/reports.

```
keploy
├── reports
│   └── test-run-0
│       ├── coverage.yaml
│       └── test-set-0-report.yaml
└── test-set-0
    ├── mocks.yaml
    └── tests
        ├── test-1.yaml
        └── test-2.yaml
```

To get the coverage data for your unit tests:

```sh
coverage run --data-file=.coverage.unit test_program.py
```

Here, test_program.py is the unit test program you want to run, and --data-file is set to .coverage.unit because, by default, raw coverage data would be written to .coverage which is where coverage data for keploy tests is present, so to avoid overwriting we pass a new file through data-file flag.

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
