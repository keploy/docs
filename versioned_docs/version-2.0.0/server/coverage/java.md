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
			<groupId>org.codehaus.mojo</groupId>
			<artifactId>exec-maven-plugin</artifactId>
			<version>3.0.0</version>
			<executions>
				<execution>
					<goals>
						<goal>exec</goal>
					</goals>
				</execution>
			</executions>
			<configuration>
				<executable>java</executable>
				<arguments>
					<argument>-javaagent:${settings.localRepository}/org/jacoco/org.jacoco.agent/${jacoco.version}/org.jacoco.agent-${jacoco.version}-runtime.jar=destfile=target/${TESTSETID}.exec</argument>
					<argument>-jar</argument>
					<argument>${path.to.application.jar}</argument>
				</arguments>
			</configuration>
		</plugin>
		<plugin>
			<groupId>org.jacoco</groupId>
			<artifactId>jacoco-maven-plugin</artifactId>
			<version>0.8.8</version>
			<!-- Generate unit test report-->
			<executions>
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
			</executions>
		</plugin>
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-surefire-plugin</artifactId>
			<version>2.22.2</version>
			<configuration>
				<argLine>
					-javaagent:${settings.localRepository}/org/jacoco/org.jacoco.agent/0.8.8/org.jacoco.agent-0.8.8-runtime.jar=destfile=target/jacoco.exec
				</argLine>
				<systemPropertyVariables>
					<jacoco-agent.destfile>target/jacoco.exec
						</jacoco-agent.destfile>
				</systemPropertyVariables>
			</configuration>
		</plugin>
		<!-- your plugins will go here -->
	</plugins>
</build>
```
You would need to specify the path to your application JAR file and jacoco version in the build properties. 
```xml
<properties>
	<jacoco.version>0.8.8</jacoco.version>
    <path.to.application.jar>target/your_application_name.jar</path.to.application.jar>
</properties>

```

In addition to editing properties and plugins, you'll need to create two profiles to manage the merging of test-set specific coverage files and generate reports. Another profile will handle the merging of coverage files from Keploy and unit tests and generate a consolidated report.

Add this to your pom.xml:
```xml
<profiles>
	<profile>
			<id>e2e-tests</id>
			<build>
				<plugins>
					<plugin>
						<groupId>org.jacoco</groupId>
						<artifactId>jacoco-maven-plugin</artifactId>
						<version>0.8.8</version>
						<executions>
							<execution>
								<id>merge-e2e</id>
								<phase>verify</phase>
								<goals>
									<goal>merge</goal>
								</goals>
								<configuration>
									<fileSets>
										<fileSet>
											<directory>${project.build.directory}</directory>
											<includes>
												<include>test-set-*.exec</include>
											</includes>
										</fileSet>
									</fileSets>
									<destFile>${project.build.directory}/keploy-e2e.exec</destFile>
								</configuration>
							</execution>
							<execution>
								<id>e2e-report</id>
								<phase>verify</phase>
								<goals>
									<goal>report</goal>
								</goals>
								<configuration>
									<dataFile>${project.build.directory}/keploy-e2e.exec</dataFile>
									<outputDirectory>${project.reporting.outputDirectory}/keployE2E</outputDirectory>
								</configuration>
							</execution>
						</executions>
					</plugin>
				</plugins>
			</build>
		</profile>

	<!-- Profile for Combined Unit and e2e Tests -->
	<profile>
		<id>combined-tests</id>
		<build>
			<plugins>
				<plugin>
					<groupId>org.jacoco</groupId>
					<artifactId>jacoco-maven-plugin</artifactId>
					<executions>
						<!-- Only merge UT and E2E data when this profile is active -->
						<execution>
							<id>merge-ut-e2e</id>
							<phase>verify</phase>
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
								<destFile>${project.build.directory}/ut-e2e-merged.exec</destFile>
							</configuration>
						</execution>
						<!-- Generate combined test report -->
						<execution>
							<id>combined-ut-e2e</id>
							<phase>verify</phase>
							<goals>
								<goal>report</goal>
							</goals>
							<configuration>
								<dataFile>${project.build.directory}/ut-e2e-merged.exec</dataFile>
								<outputDirectory>${project.reporting.outputDirectory}/e2e-ut-aggregate</outputDirectory>
							</configuration>
						</execution>
					</executions>
				</plugin>
			</plugins>
		</build>
	</profile>
</profiles>
```

## Usage

1. firstly, you need to clean the project by removing any previously generated file, and run install command. 
```bash
mvn clean install -Dmaven.test.skip=true
```

2. To dump the test set specific coverage data into your build directory, Run
```bash
keploy test -c "mvn exec:exec"
```

3. To get the coverage report for your keploy tests, Run
```bash
mvn verify -P e2e-tests
```

The html file for this report would generally be generated in target/site/keployE2E directory. Open index.html to visualize the report.

4. To get the coverage report for your unit tests, Run
```bash
mvn test
```

The html file for this report would generally be generated in target/site/ut directory. Open index.html to visualize the report.

5. To get the combined coverage report for your unit tests and keploy recorded tests, Run
```
mvn verify -P combined-tests
```

The html file for this report would generally be generated in target/site/e2e-ut-aggregate directory. Open index.html to visualize the report.