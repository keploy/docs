---
id: keploy-karaf-example
title: Setting Up Keploy Agent in Apache Karaf for Local Development
sidebar_label: Keploy Karaf Example
description: This section documents how to run keploy with Karaf
tags:
  - keploy
  - keploy karaf
keywords:
  - keploy
  - documentation
  - running-guide
---

## Step 1: Download Required JARs

Use `wget` to download the necessary JAR files:

- [KeployAgent.jar](https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/KeployAgent.jar)
- [org.jacoco.agent-0.8.12-runtime.jar](https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/org.jacoco.agent-0.8.12-runtime.jar)

Run the following commands to download the files:

```bash
wget https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/KeployAgent.jar
wget https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/org.jacoco.agent-0.8.12-runtime.jar
```

## Step 2: Configure Apache Karaf

### Update `JAVA_OPTS` for linux/mac in `setenv` File

1. Navigate to the `bin` directory of your Apache Karaf installation.
2. Open the `setenv` file for editing.
3. Add the paths of the downloaded agents under the `JAVA_OPTS` section. For example:

   ```bash
   export JAVA_OPTS="-javaagent:/path/to/KeployAgent.jar"
   export JAVA_OPTS="$JAVA_OPTS -javaagent:/path/to/org.jacoco.agent-0.8.12-runtime.jar=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver"
   ```

### Update `JAVA_OPTS` for windows in `setenv.bat` File

1. Navigate to the `bin` directory of your Apache Karaf installation.
2. Open the `setenv.bat` file for editing.
3. Add the paths of the downloaded agents under the `JAVA_OPTS` section. For example:

   ```bash
    set JAVA_OPTS=-javaagent:/path/to/KeployAgent.jar
    set JAVA_OPTS=%JAVA_OPTS% -javaagent:/path/to/org.jacoco.agent-0.8.12-runtime.jar=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver
   ```

   **Note**: Windows support is not thoroughly tested. It is recommended to use macOS or Linux for better stability and compatibility.

   Replace `/path/to/` with the actual paths where you downloaded the JAR files.

### Update `config.properties`

1. Navigate to the `etc/config.properties` file in your Karaf installation.
2. Add the following entry under the `bootdelegation` section to allow OSGi bundles to access Keploy artifacts:

   ```properties
   org.osgi.framework.bootdelegation = \
       com.sun.*, \
       javax.transaction, \
       javax.transaction.xa, \
       javax.xml.crypto, \
       javax.xml.crypto.*, \
       javax.security.cert, \
       jdk.nashorn.*, \
       sun.*, \
       jdk.internal.reflect, \
       jdk.internal.reflect.*, \
       org.apache.karaf.jaas.boot, \
       org.apache.karaf.jaas.boot.principal, \
       io.keploy.*
   ```

## Step 3: Start Apache Karaf and Export Environment Variables

1. Start Apache Karaf by navigating to the `bin` directory and running:

   ```bash
   ./karaf
   ```

2. Export the API key required for Keploy to function by running the following command in the same terminal session:

   ```bash
   export API_KEY="<API_KEY>"
   ```

   Replace the `API_KEY` value with your actual API key if different.

3. Export the application path to point to your target folder containing Java classes:

   ```bash
   export APP_PATH="/Users/path/to/karaf-sample/user-service"
   ```

   Replace the `APP_PATH` value with the absolute path to your application's target folder.

## Step 4: Import Postman Collection

1. Ensure you have a Postman collection ready for your application.
2. Run the following command to import the Postman collection as Keploy tests:

   ```bash
   keploy import postman --path="/path/to/YourPostmanCollection.json"
   ```

   Replace `/path/to/YourPostmanCollection.json` with the actual path to your Postman collection.

## Step 5: Run Keploy Tests

Use the following command to run the imported tests:

```bash
keploy test --base-path="http://localhost:8181"
```

This assumes your Karaf application is running locally on port 8181.

After running the tests, a `coverage.xml` file will be generated in the root directory of your project. This file contains the test coverage report, which can be used for further analysis or integrated with CI/CD pipelines.
