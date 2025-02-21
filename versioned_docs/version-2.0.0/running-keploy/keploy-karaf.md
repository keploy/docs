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

## Step 1: Download Required JARs and Keploy Version

Use Keploy's One click to install latest keploy binary -

```bash
  curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
```

Use `wget` to download the necessary JAR files:

- [io.keploy.agent-2.0.1.jar](https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/io.keploy.agent-2.0.1.jar)
- [org.jacoco.agent-0.8.12-runtime.jar](https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/org.jacoco.agent-0.8.12-runtime.jar)

Run the following commands to download the files:

```bash
wget https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/io.keploy.agent-2.0.1.jar
wget https://keploy-enterprise.s3.us-west-2.amazonaws.com/agent-jars/org.jacoco.agent-0.8.12-runtime.jar
```

## Step 2: Configure Apache Karaf

### Update `JAVA_OPTS` for Linux/Mac in `setenv` File

1. Navigate to the `bin` directory of your Apache Karaf installation.
2. Open the `setenv` file for editing.
3. Add the paths of the downloaded agents under the `JAVA_OPTS` section. For example:

   ```bash
   export JAVA_OPTS="-javaagent:/path/to/KeployAgent.jar"
   export JAVA_OPTS="$JAVA_OPTS -javaagent:/path/to/org.jacoco.agent-0.8.12-runtime.jar=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver"
   ```

### Update `JAVA_OPTS` for Windows in `setenv.bat` File

1. Navigate to the `bin` directory of your Apache Karaf installation.
2. Open the `setenv.bat` file for editing.
3. Add the paths of the downloaded agents under the `JAVA_OPTS` section. For example:

   ```bat
   set JAVA_OPTS=-javaagent:/path/to/KeployAgent.jar
   set JAVA_OPTS=%JAVA_OPTS% -javaagent:/path/to/org.jacoco.agent-0.8.12-runtime.jar=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver
   ```

### Set Environment Variables as Java System Properties on Windows

On Windows, all environment variables should be passed as `-D` system properties for Java. Update the `JAVA_OPTS` section in `setenv.bat` to include the required variables. For example:

```bat
set JAVA_OPTS=%JAVA_OPTS% -DAPI_KEY=xRp5nyiQ+B6yltBUpw==
set JAVA_OPTS=%JAVA_OPTS% -DKEPLOY_MODE=RECORD
set JAVA_OPTS=%JAVA_OPTS% -javaagent:/path/to/org.jacoco.agent-0.8.12-runtime.jar=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver
```

Replace the placeholder values with actual paths and keys as needed.

## Step 3: Export Environment Variables

1. Export the API key specific to your user, as mentioned on [Keploy's User Dashboard](https://app.keploy.io/users), which is required for Keploy to function, by running the following command in the same terminal session:

   ```bash
   export API_KEY="<API_KEY>"
   ```

   Replace the `API_KEY` value with your actual API key if different.

2. Export the application path to point to your target folder containing Java classes:

   ```bash
   export APP_PATH="/Users/path/to/karaf-sample/user-service"
   ```

   Replace the `APP_PATH` value with the absolute path to your application's target folder.

## Step 4: Record Test Cases

1. Record test cases using the following command:

   ```bash
   keploy record --base-url="http://localhost:8181"
   ```

2. Make a series of API calls to your application's endpoints.
3. After completing the API calls, press `Ctrl+C` in the session where you are running the Keploy binary to stop recording.

## Step 5: Or Use Import Postman Collection

1. Ensure you have a Postman collection ready for your application.
2. Run the following command to import the Postman collection as Keploy tests:

   ```bash
   keploy import postman --path="/path/to/YourPostmanCollection.json"
   ```

   Replace `/path/to/YourPostmanCollection.json` with the actual path to your Postman collection.

## Step 6: Run Keploy Tests

1. Use the following command to run the imported tests:

   ```bash
   keploy test --base-path="http://localhost:8181"
   ```

This assumes your Karaf application is running locally on port 8181.

After running the tests, a `coverage.xml` file will be generated in the root directory of your project. This file contains the test coverage report, which can be used for further analysis or integrated with CI/CD pipelines.
