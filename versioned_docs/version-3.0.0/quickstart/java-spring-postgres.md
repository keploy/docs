---
id: pet-clinic
title: Keploy with PetClinic
sidebar_label: PetClinic (PostgresDb)
description: The following sample app showcases how to use Keploy and create test cases and mocks for popular spring-boot java application.
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
keyword:
  - Jacoco
  - Maven
  - Springboot Framework
  - Postgres
  - SQL
  - Java
  - Test PetClinic
  - Junit
---

This is a petclinic app where you can record testcases and mocks by interacting with the UI, and then test them using Keploy.

import Link from '@docusaurus/Link'

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

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

You can start the backend using Keploy in 2 ways:

- [Using Keploy's binary](#instructions-for-starting-using-binary)
- [Using Keploy's docker image](#instructions-for-starting-using-docker)

# Instructions For Starting Using API backend Binary

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

Next we move on to the instructions to start the application using docker.

# Instructions For Starting Using Docker

Prerequisites For Docker:

1.  Docker Desktop 4.25.2 and above

Here we just need to change the command used to start the application.

```bash
keploy record -c "docker compose up" --container-name javaApp --build-delay 100
```

<img src="/docs/img/pet-record.png" alt="Sample Keploy Record Java" width="100%" style={{ borderRadius: '5px' }} />

## Running the testcases using Keploy

```bash
keploy test -c "docker compose up" --container-name javaApp --build-delay 50 --delay 20
```

Your CLI should look something like this
<img src="/docs/img/pet-test1.png" alt="Sample Keploy Test Java" width="100%" style={{ borderRadius: '5px' }} />

This is a summary of the test cases recorded
<img src="/docs/img/pet-test2.png" alt="Sample Keploy Test Summary Java" width="100%" style={{ borderRadius: '5px' }} />

Here `delay` is the time it takes for your application to get started, after which Keploy will start running the testcases. If your application takes longer than 10s to get started, you can change the `delay` accordingly.
`buildDelay` is the time that it takes for the image to get built. This is useful when you are building the docker image from your docker compose file itself.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
