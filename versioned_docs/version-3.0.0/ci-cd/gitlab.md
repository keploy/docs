---
id: gitlab
title: Integrating with GitLab CI
description: Guide into Keploy GitLab CI Pipeline
sidebar_label: GitLab Runner
keywords:
  - ci testing
  - ci/cd
  - github
  - gitlab
tags:
  - ci
  - cd
  - plugin
---

Keploy can integrated with GitLab CI to streamline your testing process and ensure continuous testing as part of your CI/CD pipeline.

## Create pipeline

To integrate the Keploy in `GitLab`, we first need to install and setup by adding the following steps to our `.gitlab-ci.yml` : -

```yaml
---
stages:
  - test

keploy-test-job: # This job runs in the test stage.
  image: ubuntu:22.04
  stage: test
  before_script:
    ## Add the dependencies
    - apt-get update && apt-get install -y curl python3 python3-pip git kmod linux-headers-generic bpfcc-tools sudo
    - git clone https://github.com/keploy/samples-python
    - cd flask-mongo
    - mkdir -p /sys/kernel/debug
    - mkdir -p /sys/kernel/tracing

  script:
    ## Steps to install Keploy and run application
    ...
```

> **Note: if you are using `arm_64` as runner use below to download keploy binary**

`curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp`

Now that we have Keploy installed, and all ready, we need switch to path where `keploy` folder is present in our application and install all the application related dependencies. Since we are using [flask-mongo](https://github.com/keploy/samples-python) sample-application, steps in our `script:` would look like below:-

```yaml
script:
  ## Steps to install Keploy and run application
  # Install Keploy
  - curl --silent -O -L https://keploy.io/install.sh && source install.sh

  # Mount required filesystems
  - mount -t debugfs nodev /sys/kernel/debug || true
  - mount -t tracefs nodev /sys/kernel/tracing || true

  # Run Keploy tests
  - pip3 install -r requirements.txt
  - keploy test -c "python3 app.py"  --delay 50
```

In your `.gitlab-ci.yml file`, in last step we have `keploy test` command to run your keploy generated test suite, this sets up Keploy to replay the interactions it has generated and perform CI Testing.

### 📝 Note

Did you notice some weird stuff in the pipeline? Like `kmod`, `linux-headers`, `/sys/kernel/debug`...and thought, _"Wait, am I hacking the kernel or something?"_ 😅

Don’t worry — these are just there because **Keploy uses eBPF** (a cool Linux feature) to trace your app’s behavior.

So we install `kmod`, `linux-headers-generic`, and `bpfcc-tools` to make that tracing possible.

Some CI systems don’t have `/sys/kernel/debug` and `/sys/kernel/tracing` by default, so we create them and mount `debugfs` and `tracefs` — it’s like giving Keploy the **backstage pass** it needs to watch your app in action.

No black magic. Just some low-level Linux stuff helping your tests run like magic! 🪄✨

We will get to see output : -

```sh
$ keploy test -c "python3 app.py"  --delay 50
       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓
version: 2.5.1
🐰 Keploy: 2025-04-14T16:22:12Z 	WARN	python language detected. please use --language to manually set the language if needed
🐰 Keploy: 2025-04-14T16:22:13Z 	INFO	keploy initialized and probes added to the kernel.
🐰 Keploy: 2025-04-14T16:22:14Z 	INFO	starting UDP DNS server at addr :26789
🐰 Keploy: 2025-04-14T16:22:14Z 	INFO	Keploy has taken control of the DNS resolution mechanism, your application may misbehave if you have provided wrong domain name in your application code.
🐰 Keploy: 2025-04-14T16:22:14Z 	INFO	Proxy started at port:16789
🐰 Keploy: 2025-04-14T16:22:14Z 	INFO	running	{"test-set": "[test-set-0]"}
🐰 Keploy: 2025-04-14T16:22:14Z 	INFO	starting TCP DNS server at addr :26789
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:6000
 * Running on http://127.0.0.1:6000
Press CTRL+C to quit
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 100-754-563
🐰 Keploy: 2025-04-14T16:23:04Z 	INFO	starting test for of	{"test case": "[test-1]", "test set": "[test-set-0]"}
127.0.0.1 - - [14/Apr/2025 16:23:04] "POST /students HTTP/1.1" 200 -
Testrun passed for testcase with id: "test-1"
--------------------------------------------------------------------
🐰 Keploy: 2025-04-14T16:23:04Z 	INFO	result	{"testcase id": "[test-1]", "testset id": "[test-set-0]", "passed": "[true]"}
 <=========================================>
  TESTRUN SUMMARY. For test-set: "test-set-0"
	Total tests: 1
	Total test passed: 1
	Total test failed: 0
	Time Taken: "50.01 s"
 <=========================================>
  COMPLETE TESTRUN SUMMARY.
	Total tests: 1
	Total test passed: 1
	Total test failed: 0
	Total time taken: "50.01 s"
	Test Suite Name		Total Test	Passed		Failed		Time Taken
	"test-set-0"		1		1		0		"50.01 s"
<=========================================>
🐰 Keploy: 2025-04-14T16:23:05Z 	INFO	calculating coverage for the test run and inserting it into the report
Wrote JSON report to coverage.json
🐰 Keploy: 2025-04-14T16:23:05Z 	INFO	[Total Coverage Percentage:  64%]
🐰 Keploy: 2025-04-14T16:23:05Z 	INFO	stopping Keploy	{"reason": "replay completed successfully"}
🐰 Keploy: 2025-04-14T16:23:05Z 	INFO	proxy stopped...
🐰 Keploy: 2025-04-14T16:23:05Z 	INFO	eBPF resources released successfully...
Cleaning up project directory and file based variables
00:00
Job succeeded

```

_And... voila! You have successfully integrated keploy in GitLab CI/CD pipeline 🌟_

Integrating Keploy with GitLab CI automates the testing process, ensuring that tests are run with every commit and merge request. And by running tests automatically in CI pipeline, you can catch issues early and ensure that your application remains stable and reliable.

### 📦 Need the Full Pipeline?

If you’re thinking, “This pipeline looks cool, but I need the _whole thing_ to integrate with your application!” — well, you're in luck! Check it out [here](https://github.com/keploy/samples-python) and get ready to copy-paste your way to success! ✨🚀

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
