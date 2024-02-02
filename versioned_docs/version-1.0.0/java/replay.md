---
id: replay
title: Replay Tests & Mocks for Java (v1.0.0)
description: Replay Test Suite for Java in Keploy.
tags:
  - developer-guide
  - go
  - replay-guide
  - replay-test-case
---

import ReplayTest from '../operation/test.md'

<ReplayTest/>

### Method 2 [preferred]

<details><summary>
Testing using Unit Test File

</summary>

import JUnit from './integration-with-junit.md'

<JUnit/>

</details>

### Method 3

<details><summary>
Get Test-Coverage with Surgefire

</summary>

To get test coverage, in addition to above Method-2 follow below instructions

- Add maven-surefire-plugin to your _pom.xml_.

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

- Add Jacoco plugin to your _pom.xml_.

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

- Run your tests using command : `mvn test`.

</details>

### Method 4

<details><summary>
Run Tests in CI/CD

</summary>

After following METHOD 2 above ^, Keploy will be integrated to `junit`.
If you already have `junit` no changes are required in the CI/CD pipeline.

</details>
