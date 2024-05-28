---
id: java
title: Coverage Report Generation
sidebar_label: Java
tags:
  - java
keyword:
  - MongoDB
  - Jacoco
  - Maven
  - Springboot Framework
  - Postgres
  - SQL
  - Java
  - API Test generator
  - Auto Testcase generation
  - Junit
---

## Pre-requisites

1. [Java 1.8+](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html#getting-started.installing)
2. [Maven](https://maven.apache.org/)
3. [Jacoco 0.8.8](https://mvnrepository.com/artifact/org.jacoco/jacoco-maven-plugin/0.8.8)

To get the coverage data for keploy tests and combined coverage data, you need to update your pom.xml and run the commands in [Usage](#usage) section.

### Update `pom.xml` file

You will need to add the following plugins in `pom.xml` file of your application. :-

```xml
<build>
	<plugins>
		<!-- your plugins would go here -->
        <plugin>
            <groupId>org.jacoco</groupId>
            <artifactId>jacoco-maven-plugin</artifactId>
            <version>0.8.8</version>
            <executions>
                <!-- Prepare the JaCoCo agent to track coverage during tests -->
                <execution>
                    <id>prepare-agent</id>
                    <goals>
                        <goal>prepare-agent</goal>
                    </goals>
                </execution>
                <!-- Merge e2e & u-t execution data files after tests are run -->
                <execution>
                    <id>merge-ut-e2e</id>
                    <phase>test</phase>
                    <goals>
                        <goal>merge</goal>
                    </goals>
                    <configuration>
                        <fileSets>
                            <fileSet>
                                <directory>${project.build.directory}</directory>
                                <includes>
                                    <include>jacoco.exec</include>
                                    <include>keploy-e2e.exec</include>
                                </includes>
                            </fileSet>
                        </fileSets>
                        <!-- Output of merged data -->
                        <destFile>${project.build.directory}/ut-e2e-merged.exec</destFile>
                    </configuration>
                </execution>
                <!-- Generate report based on the different execution data -->
                <!-- Generate unit test report-->
                <execution>
                    <id>post-unit-test</id>
                    <phase>test</phase>
                    <goals>
                        <goal>report</goal>
                    </goals>
                    <configuration>
                        <dataFile>${project.build.directory}/jacoco.exec</dataFile>
                        <!-- Use merged data file -->
                        <outputDirectory>${project.reporting.outputDirectory}/ut</outputDirectory>
                    </configuration>
                </execution>
                <!-- Generate combined (e2e+ut) report test report-->
                <execution>
                    <id>combined-ut-e2e</id>
                    <phase>test</phase>
                    <goals>
                        <goal>report</goal>
                    </goals>
                    <configuration>
                        <dataFile>${project.build.directory}/ut-e2e-merged.exec</dataFile>
                        <!-- Use merged data file -->
                        <outputDirectory>${project.reporting.outputDirectory}/e2e-ut-aggregate</outputDirectory>
                    </configuration>
                </execution>
            </executions>
        </plugin>
		<!-- your plugins will go here -->
	</plugins>
</build>

## Usage

1. firstly, you need to clean the project by removing any previously generated file, and run install command. 
```bash
mvn clean install -Dmaven.test.skip=true
```

2. Just run keploy test as usual to get the coverage report for keploy recorded testcases:
```bash
keploy test -c "java -jar target/your_application.jar"
```

coverage report would be dumped in the current test-run folder inside keploy/reports, also you can visualize the report by opening index.html found in target/site/e2e directory

3. To get the combined report as well as coverage report for your unit tests, Run
```bash
mvn test
```

The html file for unit tests report would be generated in target/site/ut directory and, for combined report it would be generated in target/site/e2e-ut-aggregate directory. Open index.html to visualize the report.