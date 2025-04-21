---
id: jenkins
title: Integrating with Jenkins
description: Guide into Keploy Jenkins Pipeline
sidebar_label: Jenkins Pipeline
keywords:
  - ci testing
  - ci/cd
  - jenkins
  - ci pipeline
tags:
  - ci
  - cd
  - plugin
---

Keploy can integrated with Jenkins to ensure continuous testing as part of your CI/CD pipeline.

## Prerequisites

- Jenkins installed and running
- Sudo access with `"NOPASSWORD"` via `jenkins ALL=(ALL) NOPASSWD: ALL`.

Open terminal and run`sudo visudo` command to open the sudoers file and add the below line at the end of the file.

```sh
jenkins ALL=(ALL) NOPASSWD: ALL
```

## Create a Pipeline

Use the template below to install Keploy in your Jenkins pipeline using a script : -

```sh
pipeline {
    agent any
    stages {
        stage('Install Keploy') {
            steps {
                sh '''
                curl --silent -O -L https://keploy.io/install.sh && bash install.sh
                '''
            }
        }
    }
}

```

> **Note: if you are using `arm_64` as runner use below to download keploy binary**

`curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp`

### Example

Now that we have Keploy installed, and all ready, we need switch to path where `keploy` folder is present in our application and install all the application related dependencies. Since we are using [gin-mongo](https://github.com/keploy/samples-go/tree/main/gin-mongo) sample-application, steps in our `script` would look like below:-

```sh
pipeline {
    agent any
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'sudo apt-get update && sudo apt-get install -y curl kmod linux-headers-generic bpfcc-tools git golang-go'
            }
        }
        stage('Clone and Setup App') {
            steps {
                sh '''
                rm -rf samples-go
                git clone 'https://github.com/keploy/samples-go'
                cd gin-mongo
                go mod tidy
                '''
            }
        }
        stage('Install Keploy') {
            steps {
                sh '''
                curl --silent -O -L https://keploy.io/install.sh && bash install.sh
                '''
            }
        }
        stage('Prepare eBPF Hooks') {
            steps {
                sh '''
                sudo mkdir -p /sys/kernel/debug
                sudo mkdir -p /sys/kernel/tracing
                sudo mount -t debugfs nodev /sys/kernel/debug || true
                sudo mount -t tracefs nodev /sys/kernel/tracing || true
                '''
            }
        }
        stage('Run Keploy Tests') {
            steps {
                sh '''
                cd gin-mongo
                sudo -E keploy test -c "go run main.go handler.go" --disableANSI
                '''
            }
        }
    }
}

```

### 📝 Note

Did you notice some weird stuff in the pipeline? Like `kmod`, `linux-headers`, `/sys/kernel/debug`...and thought, _"Wait, am I hacking the kernel or something?"_ 😅

Don’t worry — these are just there because **Keploy uses eBPF** (a cool Linux feature) to trace your app’s behavior.

So we install `kmod`, `linux-headers-generic`, and `bpfcc-tools` to make that tracing possible.

Some CI systems don’t have `/sys/kernel/debug` and `/sys/kernel/tracing` by default, so we create them and mount `debugfs` and `tracefs` — it’s like giving Keploy the **backstage pass** it needs to watch your app in action.

No black magic. Just some low-level Linux stuff helping your tests run like magic! 🪄✨

We would output something like below:-

```sh
Started by `user admin`

...

sudo -E keploy test -c go run main.go handler.go --disableANSI

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

version: 2.5.2

2025-04-18T04:06:50.413Z	INFO	provider/cmd.go:504	Color encoding is disabled
2025-04-18T04:06:50.413Z	WARN	provider/cmd.go:726	Delay is set to 5 seconds, incase your app takes more time to start use --delay to set custom delay
2025-04-18T04:06:50.413Z	INFO	provider/cmd.go:730	Example usage: keploy test -c "/path/to/user/app" --delay 6
2025-04-18T04:06:50.413Z	WARN	replay/replay.go:140	go language detected. please use --language to manually set the language if needed
2025-04-18T04:06:50.413Z	WARN	golang/utils.go:28	cover flag not found in command, skipping coverage calculation
2025-04-18T04:06:51.104Z	INFO	hooks/hooks.go:436	keploy initialized and probes added to the kernel.

[GIN-debug] GET    /:param                   --> main.GetURL (3 handlers)
[GIN-debug] POST   /url                      --> main.PutURL (3 handlers)
2025-04-18T04:06:57.585Z	INFO	pkg/util.go:123	starting test for of	{"test case": "[test-1]", "test set": "[test-set-0]"}
[GIN] 2025/04/18 - 04:06:57 | 200 |    2.109927ms |             ::1 | POST     "/url"
Testrun passed for testcase with id: "test-1"

--------------------------------------------------------------------

2025-04-18T04:06:57.588Z	INFO	replay/replay.go:717	result	{"testcase id": "[test-1]", "testset id": "[test-set-0]", "passed": "[true]"}
2025-04-18T04:06:57.593Z	INFO	pkg/util.go:123	starting test for of	{"test case": "[test-2]", "test set": "[test-set-0]"}
[GIN] 2025/04/18 - 04:06:57 | 303 |     852.601µs |             ::1 | GET      "/Lhr4BWAi"
Testrun passed for testcase with id: "test-2"

--------------------------------------------------------------------

2025-04-18T04:06:57.597Z	INFO	replay/replay.go:717	result	{"testcase id": "[test-2]", "testset id": "[test-set-0]", "passed": "[true]"}

 <=========================================>
  TESTRUN SUMMARY. For test-set: "test-set-0"
	Total tests: 2
	Total test passed: 2
	Total test failed: 0
	Time Taken: "5.02 s"
 <=========================================>
```

_And... voila! You have successfully integrated keploy in Jenkins CI/CD pipeline 🌟_

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
