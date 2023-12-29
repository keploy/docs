---
id: java
title: Integrate with Junit
sidebar_label: Integrate with Junit
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


## Installation

### Get Keploy java sdk

[Download the latest release of the Keploy Java SDK](https://central.sonatype.com/artifact/io.keploy/keploy-sdk?smo=true) at maven central and add keploy-sdk as a dependency to your pom.xml :

```xml
	<dependencies>
		<dependency>
			<groupId>io.keploy</groupId>
			<artifactId>v2</artifactId>
			<version>1.0.0-SNAPSHOT</version> <!--  use latest release -->
		</dependency>
	</dependencies>
```

### Update `pom.xml` file

You will need to add the following puligns in `pom.xml` file of your application. :-

```xml
<build>
	<plugins>
		<plugin>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-maven-plugin</artifactId>
			<version>${project.parent.version}</version>
		</plugin>
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-surefire-plugin</artifactId>
			<version>2.22.2</version>
			<configuration>
			<!-- <skipTests>true</skipTests> -->
				<argLine>
				-javaagent:${settings.localRepository}/org/jacoco/org.jacoco.agent/0.8.8/org.jacoco.agent-0.8.8-runtime.jar=destfile=target/jacoco.exec
			</argLine>
				<systemPropertyVariables>
					<jacoco-agent.destfile>target/jacoco.exec
					</jacoco-agent.destfile>
				</systemPropertyVariables>
			</configuration>
		</plugin>
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
					<configuration>
						<destFile>${project.build.directory}/jacoco.exec</destFile>
					</configuration>
				</execution>
		<!-- Merge execution data files after tests are run -->
				<execution>
					<id>merge-results</id>
					<phase>test</phase>
					<goals>
						<goal>merge</goal>
					</goals>
					<configuration>
						<fileSets>
							<fileSet>
								<directory>${project.build.directory}</directory>
								<includes>
									<include>*.exec</include>
							<!-- Include all .exec files -->
								</includes>
								<excludes>
									<exclude>jacoco-merged.exec</exclude>
							<!-- Exclude the merged exec file -->
								</excludes>
							</fileSet>
						</fileSets>
						<destFile>${project.build.directory}/jacoco-merged.exec</destFile>
		<!-- Output of merged data -->
					</configuration>
				</execution>
		<!-- Generate report based on the merged execution data -->
				<execution>
					<id>post-merge-report</id>
					<phase>test</phase>
					<goals>
						<goal>report</goal>
					</goals>
					<configuration>
						<dataFile>${project.build.directory}/jacoco-merged.exec</dataFile>
		<!-- Use merged data file -->
						<outputDirectory>${project.reporting.outputDirectory}/jacoco-aggregate</outputDirectory>
					</configuration>
				</execution>
			</executions>
		</plugin>
	</plugins>
</build>
```

## Usage

For the code coverage for the keploy API tests using the `junit` integration, you need to add the following test to your Junit test file.

```java
@Test
    @Order(Integer.MAX_VALUE)
    public void TestKeploy() throws IOException, InterruptedException {

        Boolean testResult = true;
        long MAX_TIMEOUT = 60000; // 1m
        try {

            String[] testSets = KeployCLI.FetchTestSets();
            if (testSets == null) {
                System.err.println("Test sets are null ");
                return;
            }

            System.out.println("TestSets: " + Arrays.asList(testSets));

            System.out.println("starting user application");

            boolean result = true;
            for (String testset : testSets) {

                // running the test set.
                String testRunId = KeployCLI.RunTestSet(testset);


                String jarPath = "target/<your-application-jar-file-path>";
                String[] command = {
                        "java",
                        "-jar",
                        jarPath
                };
                String userCmd = String.join(" ", command);

                KeployCLI.StartUserApplication(userCmd);

                KeployCLI.TestRunStatus testRunStatus = KeployCLI.TestRunStatus.PASSED;

                long startTime = System.currentTimeMillis();

                // Check status in every 2 seconds
                while (true) {
                    // Sleep for 2 seconds
                    Thread.sleep(2000);

                    testRunStatus = KeployCLI.FetchTestSetStatus(testRunId);

                    if (testRunStatus == KeployCLI.TestRunStatus.RUNNING) {
                        System.out.println("testRun still in progress");

                        // Check if the current time exceeds the start time by MAX_TIMEOUT
                        if (System.currentTimeMillis() - startTime > MAX_TIMEOUT) {
                            System.out.println("Timeout reached, exiting loop");
                            break;
                        }

                        continue;
                    }

                    break;
                }

                if (testRunStatus == KeployCLI.TestRunStatus.FAILED || testRunStatus == KeployCLI.TestRunStatus.RUNNING) {
                    System.out.println("testrun failed");
                    result = false;
                } else if (testRunStatus == KeployCLI.TestRunStatus.PASSED) {
                    System.out.println("testrun passed");
                    result = true;
                }

                System.out.println("TestResult of [" + testset + "]:" + result);
                testResult = testResult && result;
                KeployCLI.FindCoverage(testset);
                //Change This time if you have bigger codebase. Because it will take more time to dump the coverage
                Thread.sleep(5000);
                KeployCLI.StopUserApplication();
            }
        } catch (Exception e) {
            System.err.println("failed to execute keploy tests:" + e);
        } finally {
            System.out.println("Testing done with status:" + testResult);
        }

        assertTrue(testResult, "Keploy Test Result");
    }
```

Now let's run junit tests along keploy using command:-

```bash
sudo -E keploy serve -c "mvn test" --delay 15
```
