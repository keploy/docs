---
id: deduplication
title: Deduplication
sidebar_label: Deduplication
tags:
  - explanation
  - feature guide
  - jwt
  - Test Deduplication
keywords:
  - dedup
  - keploy cloud
  - jwt
  - deduplication
---

### Why Deduplication? ❄️

Test deduplication simplifies the testing process by removing redundant test cases, saving time and resources while clarifying the purpose and coverage of each test.

### What is Deduplication? ⏳

Test deduplication is a process used in software testing to eliminate duplicate test cases or scenarios. When developing and maintaining software, it's common for test suites to grow in size, often resulting in redundancy where certain test cases cover the same functionality or scenarios.

## Usage 🛠️

To detect duplicate tests, simply run the below command, like so:

```bash
keploy dedup -c "<CMD_TO_RUN_APP>"
```

### For Node Applications

**1. Pre-requsite**

Install the `keploy/sdk` and `nyc` package : -

```bash
npm i @keploy/sdk nyc@15.0.0
```

Add the the following on top of your main application js file (index.js/server.js/app.js/main.js) : -

```bash
const kmiddleware = require('@keploy/sdk/dist/v2/dedup/middleware.js')

app.use(kmiddleware())
```

**2. Run Keploy Dedup**

```
keploy dedup -c "<CMD_TO_RUN_APP>" --delay 10
```

#### Example

Let's use the [expresss-mongoose] application to test dedup feature. In our `src/app.js` file we need to have imported and initialized `@keploy/sdk` package, so now let's run the de-duplication command to check : -

```bash
keploy dedup -c "node src/app.js" -t "test-set-1"
```

<img width="1060" alt="image" src="https://github.com/keploy/docs/assets/53110238/641ded9d-c75f-4861-aafd-bc0f2bbeda7f">

Voila! Keploy will now detect duplicate tests .

### For Java Applications

**1. Pre-requsite**

Put the latest keploy-sdk in your pom.xml file : -

```xml
<dependency>
    <groupId>io.keploy</groupId>
    <artifactId>keploy-sdk</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```

Now that we have added keploy-sdk, let's import it in our main class : -

```xml
import io.keploy.servlet.KeployMiddleware;

@Import(KeployMiddleware.class)
public class SamplesJavaApplication {
    public static void main(String[] args) {
        SpringApplication.run(SamplesJavaApplication.class, args);
    }
}
```

**2. Run Keploy Dedup**

We need to create Jar file via : -

```bash
mvn clean install -DskipTests
```

Once we have our jar file ready, we can run following command : -

```bash
keploy dedup -c "java -javaagent:<PATH_TO_JacocoAgent>=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver -jar <PATH_TO_JAR_FILE>"  --delay 10
```

Voila! Keploy will now detect duplicate tests .

## Remove Duplicate Tests

You can simply remove duplicate tests with :

```bash
keploy dedup --rm
```
