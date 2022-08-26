 ---
id: index
title: How to use the Keploy Java SDK
description: Add the Keploy Java SDK to your application.
tags:
  - developer-guide
  - java
---

## Requirements

- Java 1.8+

## Build configuration

[Find the latest release](https://search.maven.org/artifact/io.keploy/keploy-sdk) of the Keploy Java SDK at maven
central.

Add *keploy-sdk* as a dependency to your *pom.xml*:

    <dependency>
      <groupId>io.keploy</groupId>
      <artifactId>keploy-sdk</artifactId>
      <version>1.0.12</version>
    </dependency>

or to *build.gradle*:

    compile 'io.keploy:keploy-sdk:1.0.12'

## Usage

**Replace** `@SpringBootApplication` with `@SpringBootApplication(scanBasePackages = {"<your base package>", "io.keploy.servlet"}).` in your main class.


- **Configure Environment Variables**
    - `APP_NAME`           (default APP_NAME = myApp)
    - `APP_PORT`           (default APP_PORT = 8080)
    - `KEPLOY_URL`         (default KEPLOY_URL = http://localhost:8081/api)
    - `KEPLOY_MODE`        (default KEPLOY_MODE = record/test)
    - `DENOISE`            (default DENOISE = false)
      **Note:** By enabling denoise, it will filter out noisy fields for that testcases.

- **Generate testcases**
    - To generate/capture TestCases set  and run your application.
        1. Set `KEPLOY_MODE = record`
        2. Run your application.
        3. Make some API calls.

- **Run the testcases**
    - **Note:** Before running tests stop the sample application.
        - Using environment variable
            1. Set `KEPLOY_MODE = test` (default "record")
            2. Run your application.
            3. You can also run the application with coverage to see the test coverage.
        - Using command line -
            1. Add Jacoco [dependency]() and [plugin]().
            2. Run your application using command `:`


### KEPLOY_MODE
There are 3 modes:
- **Record**: Sets to record mode.
- **Test**: Sets to test mode.
- **Off**: Turns off all the functionality provided by the API

**Note:** `KEPLOY_MODE` value is case sensitive.