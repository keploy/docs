---
id: integration-with-Junit
title: Integrate with Junit 
sidebar_label: Integrate with Junit 
---

### Testing using Unit Test File

Once you have testcases captured, create a test file `SampleJavaApplication_Test.java` in the test directory of your sample application.



- **Run the testcases**
    - **Note:** Before running tests stop the sample application.

    - Set `KEPLOY_MODE = test` (default "record")
        - Using IDE 
            1. Run your application.
            2. You can also run the application with coverage to see the test coverage.

        - Using command line
            1. Add below code in your testfile and run `mvn test`.

               ```java
                  @Test
                  public void TestKeploy() throws InterruptedException {

                     CountDownLatch countDownLatch = HaltThread.getInstance().getCountDownLatch();

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
