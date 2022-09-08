---
id: installation
title: How to use the Keploy Java SDK
description: Add the Keploy Java SDK to your application.
tags:
  - developer-guide
  - java
---

## Requirements

- Java 1.8+
- Maven
- Docker

## Build configuration

[Find the latest release](https://search.maven.org/artifact/io.keploy/keploy-sdk) of the Keploy Java SDK at maven
central.

Add _keploy-sdk_ as a dependency to your _pom.xml_:

    <dependency>
      <groupId>io.keploy</groupId>
      <artifactId>keploy-sdk</artifactId>
      <version>1.0.13</version>
    </dependency>

or to _build.gradle_:

    compile 'io.keploy:keploy-sdk:1.0.13'

## Usage

**Replace** `@SpringBootApplication` with `@SpringBootApplication(scanBasePackages = {"<your base package>", "io.keploy.servlet"}).` in your main class.

- **Configure Environment Variables**

  - `APP_NAME` (default APP_NAME = myApp)
  - `APP_PORT` (default APP_PORT = 8080)
  - `KEPLOY_URL` (default KEPLOY_URL = http://localhost:8081/api)
  - `KEPLOY_MODE` (default KEPLOY_MODE = record/test)
  - `KTESTS_PATH` (default test directory of your application)
  - `DENOISE` (default DENOISE = false)
    **Note:** By enabling denoise, it will filter out noisy fields for that testcases.

- **Generate testcases**

  - To generate/capture TestCases set and run your application.
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
      1. Add below code in your testfile and run `mvn test`.

            ```java
              @Test
              public void TestKeploy() throws InterruptedException {

                  CountDownLatch countDownLatch = HaltThread.getInstance().getCountDownLatch();
                  mode.setTestMode();
                  new Thread(() -> {
                      SamplesJavaApplication.main(new String[]{""});
                      countDownLatch.countDown();
                  }).start();

                  countDownLatch.await();
              }
            ```

            2. To get test coverage, in addition to above follow below instructions.

            3. Add maven-surefire-plugin to your *pom.xml*.

               ```xml
                    <plugin>
                        <groupId>org.apache.maven.plugins</groupId>
                        <artifactId>maven-surefire-plugin</artifactId>
                        <version>2.22.2</version>
                        <configuration>

                    <!-- <skipTests>true</skipTests> -->

                            <systemPropertyVariables>
                                <jacoco-agent.destfile>target/jacoco.exec
                                </jacoco-agent.destfile>
                            </systemPropertyVariables>
                        </configuration>
                    </plugin>
               ```
            - 4. Add Jacoco plugin to your *pom.xml*.
                  ```xml
                       <plugin>
                          <groupId>org.jacoco</groupId>
                          <artifactId>jacoco-maven-plugin</artifactId>
                          <version>0.8.5</version>
                          <executions>
                              <execution>
                                  <id>prepare-agent</id>
                                  <goals>
                                      <goal>prepare-agent</goal>
                                  </goals>
                              </execution>
                              <execution>
                                  <id>report</id>
                                  <phase>prepare-package</phase>
                                  <goals>
                                      <goal>report</goal>
                                  </goals>
                              </execution>
                              <execution>
                                  <id>post-unit-test</id>
                                  <phase>test</phase>
                                  <goals>
                                      <goal>report</goal>
                                  </goals>
                                  <configuration>
                                      <!-- Sets the path to the file which contains the execution data. -->

                                      <dataFile>target/jacoco.exec</dataFile>
                                      <!-- Sets the output directory for the code coverage report. -->
                                      <outputDirectory>target/my-reports</outputDirectory>
                                  </configuration>
                              </execution>
                          </executions>
                      </plugin>
                  ```
            5. Run your tests using command : `mvn test`.

### KEPLOY_MODE

There are 3 modes:

- **Record**: Sets to record mode.
- **Test**: Sets to test mode.
- **Off**: Turns off all the functionality provided by the API

**Note:** `KEPLOY_MODE` value is case sensitive.
