---
id: pet-clinic
title: Keploy Integration with PetClinic App
sidebar_label: PetClinic
description: This sample app shows how to use Keploy to generate test cases and mocks for the popular Spring Boot Java app, PetClinic.
tags:
  - java
  - spring-jpa
  - springboot
  - java-framework
  - postgres
  - petclinic
  - quickstart
  - samples
  - examples
  - tutorial
keywords:
  - Jacoco
  - Maven
  - Springboot Framework
  - Postgres
  - SQL
  - Java
  - Test PetClinic
  - Junit
---
import HowTo from '@site/src/components/HowTo';

<HowTo
  name="Keploy Integration with PetClinic App — record and replay tests with Keploy"
  description="Clone the sample app, run it under Keploy to capture API traffic, then replay the recorded testcases."
  totalTime="PT10M"
  estimatedCost={{currency: "USD", value: "0"}}
  tools={["Keploy CLI", "Docker", "git"]}
  visible={false}
  steps={[
    {
      name: "Install Keploy",
      text: "Install the Keploy CLI on Linux/WSL using the install script from https://keploy.io/install.sh.",
    },
    {
      name: "Clone the sample app",
      text: "Clone the sample repo referenced on this page and install its dependencies.",
    },
    {
      name: "Start dependencies (database, etc.)",
      text: "Bring up any Docker services the app needs (databases, message queues) before recording.",
    },
    {
      name: "Record API calls",
      text: "Run keploy record -c \"CMD_TO_RUN_APP\" and exercise the app's endpoints (curl, Postman) to capture testcases and mocks.",
    },
    {
      name: "Replay tests",
      text: "Run keploy test -c \"CMD_TO_RUN_APP\" --delay 10 to replay the recorded testcases and detect regressions.",
    },
  ]}
/>

# Instructions For Starting Using API backend Binary

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

This is a petclinic app where you can record testcases and mocks by interacting with the UI, and then test them using Keploy.

import Link from '@docusaurus/Link'
import InstallReminder from '@site/src/components/InstallReminder';
import SectionDivider from '@site/src/components/SectionDivider';

<InstallReminder />

This project has two parts - the frontend and backend, since Keploy is a backend testing platform, we need to start the backend part of the project using Keploy and run the frontend as it is.

## Setup the frontend

### Prerequisites For Frontend:

1. Node version 16.x and above

```bash
git clone https://github.com/keploy/samples-java.git
cd samples-java/spring-petclinic/spring-petclinic-angular
npm i --legacy-peer-deps
```

## Start the frontend

```bash
npm run start
```

Now it's time to setup the backend of our application. Let's move to the backend directory and get started.

```bash
cd samples-java/spring-petclinic/spring-petclinic-rest
```

Prerequisites For API backend Binary:

1. OpenJDK 17+
2. MVN version 3.6+

## Setup the backend

You need to update the postgresql properties, go to
`spring-petclinic/spring-petclinic-rest/src/main/resources/application-postgresql.properties`
and change

```bash
spring.datasource.url=jdbc:postgresql://mypostgres:5432/petclinic
```

to

```bash
spring.datasource.url=jdbc:postgresql://localhost:5432/petclinic
```

and then build the jar using:

```bash
mvn clean install -Dmaven.test.skip=true
```

## Spin up the database

```bash
docker run -e POSTGRES_USER=petclinic -e POSTGRES_PASSWORD=petclinic -e POSTGRES_DB=petclinic -p 5432:5432 --name mypostgres postgres:15.2
```

## Recording the testcases with Keploy

```bash
keploy record -c "java -jar target/spring-petclinic-rest-3.0.2.jar"
```

<img src="/docs/img/pet-record.png" alt="Sample Keploy Test Result Node JWT" width="100%" style={{ borderRadius: '5px' }} />

Now you can start interacting with the UI and Keploy will automatically create the testcases and mocks for it in a folder named 'keploy'.

## Running the testcases using Keploy

```bash
keploy test -c "java -jar target/spring-petclinic-rest-3.0.2.jar" --delay 20
```

🎉 Hooray! You've made it to the end of the binary section! 🎉

<SectionDivider />

## Instructions For Starting Using Docker

<ProductTier tiers="Open Source, Enterprise" offerings="Self-Hosted, Dedicated" />

This is a petclinic app where you can record testcases and mocks by interacting with the UI, and then test them using Keploy.

<InstallReminder />

## Setup the frontend

### Prerequisites For Frontend:

1. Node version 16.x and above

```bash
git clone https://github.com/keploy/samples-java.git
cd samples-java/spring-petclinic/spring-petclinic-angular
npm i --legacy-peer-deps
```

## Start the frontend

```bash
npm run start
```

Now it's time to setup the backend of our application. Let's move to the backend directory and get started.

```bash
cd samples-java/spring-petclinic/spring-petclinic-rest
```

Prerequisites For API backend Binary:

1. OpenJDK 17+
2. MVN version 3.6+

## Recording the testcases with Keploy

```bash
keploy record -c "docker compose up" --container-name javaApp --build-delay 100
```

<img src="/docs/img/pet-record.png" alt="Sample Keploy Record Java" width="100%" style={{ borderRadius: '5px' }} />

## Running the testcases using Keploy

```bash
keploy test -c "docker compose up" --container-name javaApp --build-delay 50 --delay 20
```

Your CLI should look something like this
<img src="/docs/img/keploy-test-postgress-1.png" alt="Sample Keploy Test Java" width="100%" style={{ borderRadius: '5px' }} />

This is a summary of the test cases recorded
<img src="/docs/img/keploy-test-postgress2.png" alt="Sample Keploy Test Summary Java" width="100%" style={{ borderRadius: '5px' }} />

Here `delay` is the time it takes for your application to get started, after which Keploy will start running the testcases. If your application takes longer than 10s to get started, you can change the `delay` accordingly.
`buildDelay` is the time that it takes for the image to get built. This is useful when you are building the docker image from your docker compose file itself.

Hope this helps you out, if you still have any questions, reach out to us .
