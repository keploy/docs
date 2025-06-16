---
id: openhospital
title: Keploy with OpenHospital
sidebar_label: OpenHospital (Mysql)
description: The following sample app showcases how to use Keploy and create test cases and mocks for popular spring-boot java application.
tags:
  - java
  - spring-jpa
  - springboot
  - React
  - java-framework
  - postgres
  - openhospital
  - quickstart
  - samples
  - examples
  - tutorial
keyword:
  - Jacoco
  - Maven
  - Springboot Framework
  - Mysql
  - SQL
  - Java
  - Test OpenHospital
  - Junit
  - React
---

This is a openhospital app where you can record testcases and mocks by interacting with the UI, and then test them using Keploy.

import Link from '@docusaurus/Link'

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

This project has Three parts - the UI, Core and API, since Keploy is a backend testing platform, we need to start the Backend of the project using Keploy and run the frontend as it is.

If you want to try this quickstart setup on a Mac, use Lima. If you're on Windows, use WSL.

## Setup the Core

```bash
git clone https://github.com/keploy/openhospital-core
git checkout integration-with-keploy
mvn clean install -DskipTests=true
docker compose up

```

Note: If you face any issues while setting up the database, please try running docker compose up again. The issue should not occur the second time.

## Setup the Backend

Now it's time to setup the backend of our application. Let's Install the Openhospital API and get started.

```bash
git clone https://github.com/keploy/openhospital-api
git checkout integration-with-keploy
mvn clean install -DskipTests=true
```

Now it's time to start the Backend using Keploy cli:

# Instructions For Starting Using Binary

Prerequisites For Binary:

1. Node 20.11.0 LTS
2. OpenJDK 17.0.9
3. MVN version 3.6.3

## Recording the testcases with Keploy

```bash
keploy record -c "java -cp "target/openhospital-api-0.1.0.jar:rsc/:static/" org.springframework.boot.loader.launch.JarLauncher"
```

<img src="/docs/img/Keploy-record-openhospital.png" alt="Sample Keploy Record Java" width="100%" style={{ borderRadius: '5px' }} />

## Start the frontend

```bash
git clone https://github.com/keploy/openhospital-ui
git checkout integration-with-keploy
npm install
npm start
```

Note: Login with username `admin` and password `admin`
<img src="/docs/img/openhospital-ui.png" alt="Sample Keploy Record Java" width="100%" style={{ borderRadius: '5px' }} />

If you followed all the steps correctly, you should see a UI similar to the one shown above.

Now you can start interacting with the UI and Keploy will automatically create the testcases and mocks for it in a folder named 'keploy'

## Running the testcases using Keploy

```bash
keploy test -c "java -cp "target/openhospital-api-0.1.0.jar:rsc/:static/" org.springframework.boot.loader.launch.JarLauncher" --delay 40

```

🎉 Hooray! You've made it to the end of the binary section! 🎉

Your CLI should look something like this
<img src="/docs/img/Keploy-test-openhospital.png" alt="Sample Keploy Test Java" width="100%" style={{ borderRadius: '5px' }} />

This is a summary of the test cases recorded
<img src="/docs/img/result-openhospital.png" alt="Sample Keploy Test Summary Java" width="100%" style={{ borderRadius: '5px' }} />

Here `delay` is the time it takes for your application to get started, after which Keploy will start running the testcases. If your application takes longer than 10s to get started, you can change the `delay` accordingly.
`buildDelay` is the time that it takes for the image to get built. This is useful when you are building the docker image from your docker compose file itself.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
