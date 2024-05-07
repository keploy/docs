---
id: python
title: Coverage Report Generation
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

## Pre-requisites

1. [Python 3 and above](https://www.python.org/downloads/)
2. [coverage.py](https://coverage.readthedocs.io/en/7.4.1/install.html)

To get the coverage for Keploy recorded testcases,

Create a `.coveragerc` file to ignore the coverage of the libraries that is calculated. The contents of the file will be as follows:

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

Now, run Keploy test with coverage flag enabled, also prepend `coverage run \$APPEND` in your application command:

```bash
keploy test -c "coverage run \$APPEND my_program.py arg1 arg2" --coverage
```

After successful execution of this command, A coverage report would be generated inside the test-run folder of keploy/reports. Additionally, the raw coverage data would be dumped in .coverage file.

To get the coverage data for your unit tests:
```
coverage run --data-file=.coverage.unit test_program.py
```
Here, test_program.py is the unit test program you want to run, and --data-file is set to .coverage.unit becuase, by default, raw coverage data would be written to .coverage which is where coverage data for keploy tests is present, so to avoid overwritting we pass a new file through data-file flag.

To combine the coverages and get the reports, you can refer to [this](#Combine-And-Get-Report) section.

> Note: If you face any problems with running the coverage library, you can refer to the documentation for the same [here](https://coverage.readthedocs.io/en/7.4.2/cmd.html#execution-coverage-run)

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
