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

Use the below template to create a Pipeline via script : -

```sh
pipeline {
    agent any
    stages {
        stage('Keploy Tests') {
            steps {
                // Download and prepare Keploy binary
                sh "curl --silent --location 'https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz' | tar xz --overwrite -C /tmp"
                sh "mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy"

                // Install application dependencies && Run the keploy test suite

                sudo -E keploy test -c <CMD_TO_RUN_YOUR_APP>
            }
        }
    }
}
```

> **Note: if you are using `arm_64` as runner use below to download keploy binary**

`curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz" | tar xz --overwrite -C /tmp`

### Example

Now that we have Keploy installed, and all ready, we need switch to path where `keploy` folder is present in our application and install all the application related dependencies. Since we are using [express-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) sample-application, steps in our `script` would look like below:-

```sh
pipeline {
    agent any
    stages {
        stage('Keploy Tests') {
            steps {

                // Clone the repository
                git branch: 'main', url: 'https://github.com/keploy/samples-typescript.git'

                // Download and prepare Keploy binary
                sh "curl --silent --location 'https://github.com/keploy/keploy/releases/latest/download/keploy_linux_arm64.tar.gz' | tar xz --overwrite -C /tmp"
                sh "mkdir -p /usr/local/bin && sudo mv /tmp/keploy /usr/local/bin/keploy"

                // switch to the directory where keploy folder is present
                dir('express-mongoose'){

                // Make sure you have NPM in host machine and Install application dependencies.

                sh"""
                npm install
                sudo -E keploy test -c "npm run start" --disableANSI
                """
              }
            }
        }
    }
}
```

We would output something like below:-

```sh
Started by `user admin`

...

+ sudo -E keploy test -c npm run start --disableANSI

       ▓██▓▄
    ▓▓▓▓██▓█▓▄
     ████████▓▒
          ▀▓▓███▄      ▄▄   ▄               ▌
         ▄▌▌▓▓████▄    ██ ▓█▀  ▄▌▀▄  ▓▓▌▄   ▓█  ▄▌▓▓▌▄ ▌▌   ▓
       ▓█████████▌▓▓   ██▓█▄  ▓█▄▓▓ ▐█▌  ██ ▓█  █▌  ██  █▌ █▓
      ▓▓▓▓▀▀▀▀▓▓▓▓▓▓▌  ██  █▓  ▓▌▄▄ ▐█▓▄▓█▀ █▓█ ▀█▄▄█▀   █▓█
       ▓▌                           ▐█▌                   █▌
        ▓

  version: 2.1.0-alpha23

  🐰 Keploy: 2024-06-05T14:50:12+05:30 	INFO config file not found; proceeding with flags only
  🐰 Keploy: 2024-06-05T14:50:12+05:30 	WARN	Delay is set to 5 seconds, incase your app takes more time to start use --delay to set custom delay
  🐰 Keploy: 2024-06-05T14:50:12+05:30 	INFO	Example usage: keploy test -c "/path/to/user/app" --delay 6
  🐰 Keploy: 2024-06-05T14:50:12+05:30 	INFO	GitHub Actions workflow file generated successfully	{"path": "/githubactions/keploy.yml"}
  🐰 Keploy: 2024-06-05T14:50:13+05:30 	INFO	keploy initialized and probes added to the kernel.
  🐰 Keploy: 2024-06-05T14:50:13+05:30 	INFO	Java detected and CA already exists	{"path": "/usr/lib/jvm/java-17-openjdk-arm64/lib/security/cacerts"}
  🐰 Keploy: 2024-06-05T14:50:13+05:30 	INFO	Java detected and CA already exists	{"path": "/usr/lib/jvm/java-17-openjdk-arm64/lib/security/cacerts"}
  🐰 Keploy: 2024-06-05T14:50:14+05:30  INFO	Keploy has taken control of the DNS resolution mechanism, your application may misbehave if you have provided wrong domain name in your application code.
  🐰 Keploy: 2024-06-05T14:50:14+05:30 	INFO	Proxy started at port:16789
  🐰 Keploy: 2024-06-05T14:50:14+05:30 	INFO	running	{"test-set": "test-set-0"}
  🐰 Keploy: 2024-06-05T14:50:14+05:30 	INFO	starting TCP DNS server at addr :26789
  🐰 Keploy: 2024-06-05T14:50:14+05:30 	INFO	starting UDP DNS server at addr :26789

  > NodeMongo@1.0.0 start
  > node src/app.js

  Listening on port 8000
  Connected to MongoDB

  🐰 Keploy: 2024-06-05T14:50:19+05:30 	INFO	starting test for of	{"test case": "test-1", "test set": "test-set-0"}

  Testrun passed for testcase with id: "test-1"

  --------------------------------------------------------------------

  🐰 Keploy: 2024-06-05T14:50:19+05:30   INFO result  {"testcase id": "test-1", "testset id": "test-set-0", "passed": "true"}

  <=========================================>
    TESTRUN SUMMARY. For test-set: "test-set-0"
          Total tests: 1
          Total test passed: 1
          Total test failed: 0
  <=========================================>
  ...
  🐰 Keploy: 2024-06-05T14:50:19+05:30  INFO test run completed {"passed overall": true}
```

_And... voila! You have successfully integrated keploy in Jenkins CI/CD pipeline 🌟_

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
