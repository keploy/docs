---
id: integration
title: Integration for Java (v1.0.0)
description: Add the Keploy Java SDK to your application.
tags:
  - developer-guide
  - java
---

{'<'}details{'>'}{'<'}summary{'>'}
Pre-requisites

{'<'}/summary{'>'}

- Java 1.8+
- [Maven](https://maven.apache.org/)
- [Docker](https://www.docker.com/)

{'<'}/details{'>'}

## Build configuration

1.  [Find the latest release](https://search.maven.org/artifact/io.keploy/keploy-sdk) of the Keploy Java SDK at maven
    central and add _keploy-sdk_ as a dependency to your `pom.xml` :

        {'<'}dependency{'>'}
          {'<'}groupId{'>'}io.keploy{'<'}/groupId{'>'}
          {'<'}artifactId{'>'}keploy-sdk{'<'}/artifactId{'>'}
          {'<'}version{'>'}1.0.13{'<'}/version{'>'}          {'<'}!--  use latest release --{'>'}
        {'<'}/dependency{'>'}

Sync dependencies or to _build.gradle_:

    compile 'io.keploy:keploy-sdk:1.0.13'

2. Install Keploy Jar

   - Download the latest jar from [here](https://search.maven.org/artifact/io.keploy/keploy-sdk/1.2.6/jar) (eg: 1.2.6) to mock external/internal dependency calls like DB queries, GMaps, S3 etc..

     - Add the jar into the `main` directory

       - Add `-javaagent:` prefix with absolute classpath of Keploy jar downloaded above

         (For example: `-javaagent:/Users/jhon/project/src/main/agent-1.2.5.jar`)

         You can set this through 3 ways:-

         1. {'<'}details{'>'}{'<'}summary{'>'}
            Using Intellij
            {'<'}/summary{'>'}

            Go to `Edit Configuration`-{'>'} `add VM options` -{'>'} paste `-javaagent:/Users/jhon/project/src/main/agent-1.2.5.jar` -{'>'} `OK`.
            {'<'}/details{'>'}

         2. {'<'}details{'>'}{'<'}summary{'>'}
            Using Command Line
            {'<'}/summary{'>'}

            ```
              export JAVA_OPTS="$JAVA_OPTS -javaagent:/Users/jhon/project/src/main/agent-1.2.5.jar"
            ```

            {'<'}/details{'>'}

         3. {'<'}details{'>'}{'<'}summary{'>'}
            Running via Tomcat Server
            {'<'}/summary{'>'}

            ```
                 export CATALINA_OPTS="$CATALINA_OPTS -javaagent:/Users/jhon/project/src/main/agent-1.2.5.jar"
            ```

         {'<'}/details{'>'}

## Supported Frameworks

- **For Spring based application**

  - Add `@Import(KeployMiddleware.class)` below `@SpringBootApplication` in your main class.

    ```java
      ...
      import io.keploy.servlet.KeployMiddleware;
      ...

     @SpringBootApplication
     @Import(KeployMiddleware.class)
     public class SamplesJavaApplication {
       public static void main(String[] args) {
          ...
      }
     }
    ```

- **For Java EE application**

  - Specify the below filter above all other filters and servlets in the **web.xml** file.

    ```xml
      {'<'}filter{'>'}
          {'<'}filter-name{'>'}middleware{'<'}/filter-name{'>'}
          {'<'}filter-class{'>'}io.keploy.servlet.KeployMiddleware{'<'}/filter-class{'>'}
      {'<'}/filter{'>'}

      {'<'}filter-mapping{'>'}
          {'<'}filter-name{'>'}middleware{'<'}/filter-name{'>'}
          {'<'}url-pattern{'>'}/*{'<'}/url-pattern{'>'}
      {'<'}/filter-mapping{'>'}
    ```

- **Configure Environment Variables** (optional)

  - `APP_NAME` (default APP_NAME = myApp)
  - `APP_PORT` (default APP_PORT = 6789)
  - `KEPLOY_URL` (default KEPLOY_URL = http://localhost:6789/api)
  - `KEPLOY_MODE` (default KEPLOY_MODE = record/test)
  - `KTESTS_PATH` (default test directory of your application)
  - `DENOISE` (default DENOISE = false)
    **Note:** By enabling denoise, it will filter out noisy fields for that testcases.
