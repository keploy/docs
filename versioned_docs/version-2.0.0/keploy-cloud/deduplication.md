---
id: deduplication
title: Remove Duplicates Tests 🧹
sidebar_label: Remove Duplicate Tests 🧹
tags:
  - explanation
  - feature guide
  - Test Deduplication
keywords:
  - dedup
  - keploy cloud
  - deduplication
  - duplicate tests
  - python
  - java
  - nodejs
  - node
  - testcases
---

## Why Deduplication? ❄️

When developing or maintaining a software, it is common for test suites to grow in size. This often results in redundancy, as many test cases cover the same functions or scenarios. This is where Test Deduplication comes into play.

It simplifies the testing process by removing redundant test cases, which saves time and resources while keeping the testcases which adds value to the overall coverage of the application.

## Usage 🛠️

To detect duplicate tests, simply run the below command, like so:

```bash
keploy dedup -c "<CMD_TO_RUN_APP>" -t="<TESTSETS_TO_RUN>"
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

**2. Run Deduplication**

```
keploy dedup -c "<CMD_TO_RUN_APP>" --delay 10 -t="<TESTSETS_TO_RUN>"
```

#### Example

Let's use the [expresss-mongoose](https://github.com/keploy/samples-typescript/tree/main/express-mongoose) application to test dedup feature. In our `src/app.js` file we need to have imported and initialized `@keploy/sdk` package, so now let's run the de-duplication command to check : -

```bash
keploy dedup -c "node src/app.js" -t "test-set-1"
```

<img width="1060" alt="image" src="https://github.com/keploy/docs/assets/53110238/641ded9d-c75f-4861-aafd-bc0f2bbeda7f" />

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

```java
import io.keploy.servlet.KeployMiddleware;

@Import(KeployMiddleware.class)
public class SamplesJavaApplication {
    public static void main(String[] args) {
        SpringApplication.run(SamplesJavaApplication.class, args);
    }
}
```

**2. Run Deduplication**

We need to create Jar file via : -

```bash
mvn clean install -DskipTests
```

Once we have our jar file ready, we can run following command : -

```bash
keploy dedup -c "java -javaagent:<PATH_TO_JacocoAgent>=address=*,port=36320,destfile=jacoco-it.exec,output=tcpserver -jar <PATH_TO_JAR_FILE>"  --delay 10 -t="test-set-0"
```

Voila! Keploy will now detect duplicate tests .

### For Python Applications

Deduplication works only on test mode there are no special instructions to record your tests.

**1. Pre-requsite**

Put the latest keploy-sdk in your file : -

```bash
pip install keploy coverage requests fastapi
```

In your main app file add the following with along with the other imports. And add Keploy's middleware along with the other middlewares for your app based on your framework:

1. In FastAPI -

```py
# existing imports
from keploy import FastApiCoverageMiddleware

app.add_middleware(FastApiCoverageMiddleware)
# existing functions
```

2. In Flask -

```py
# existing imports
from keploy import FlaskCoverageMiddleware

app.wsgi_app = FlaskCoverageMiddleware(app.wsgi_app)

# existing functions
```

3. In Django - Open `settings.py` and add the middleware class to the **MIDDLEWARE** list.

```py
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'keploy.DjangoCoverageMiddleware',  # Add keploy middleware here
],

# Other settings
```

**2. Run Deduplication**

Run keploy with test-sets in which you want to check for the duplicate testcases :

```sh
keploy dedup -c "<command to run your Python app>" --delay "<time required for your application to start>"
```

#### Example

Let's use the [flask-mongo](https://github.com/keploy/samples-python/tree/main/flask-mongo) application to test dedup feature. In our `app.py` file we need to have imported and initialized `keploy` package, since this is a flask application we can follow above flask approach. Once we have added package, let's run the de-duplication command to check : -

```bash
keploy dedup -c "python3 app.py" -t "test-set-1"
```

<img width="1111" alt="image" src="https://github.com/user-attachments/assets/03638c80-ae11-492f-9b4e-bce92d15a04e"/>

## Remove Duplicate Tests

You can simply remove duplicate tests with :

```bash
keploy dedup --rm
```
