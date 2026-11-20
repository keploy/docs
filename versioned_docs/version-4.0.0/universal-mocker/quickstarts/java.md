---
id: java
title: "Java quickstart: run JUnit tests without the API they call"
sidebar_label: Java (JUnit, Maven)
description: Record the HTTP calls a JUnit 5 suite makes with keploy mock record, then run the same mvn test with the API switched off. No Keploy account needed. A copy-paste sample with the real output of each step.
tags:
  - universal mocker
  - service virtualization
  - java
  - junit
  - maven
  - quickstart
keywords:
  - keploy mock java
  - keploy mock junit
  - keploy mock maven
  - mock http api junit
  - service virtualization java
---

# Java quickstart: run JUnit tests without the API they call

In this quickstart, you build a small Java app whose JUnit 5 tests call a users
API with Java's `HttpClient`. You record those calls once, with the API up.
Then you run the same `mvn test` with the API switched off, and the tests still
pass.

You don't write any mock code, and the tests don't change. You don't need a
Keploy account either: the recording stays in your repository.

Every output on this page comes from a real run of Keploy 3.9.4 on Linux.
Some of Keploy's and Maven's log lines are left out, long lines are trimmed
(`…`), and timestamps are removed.

## Before you begin

You need:

- Linux. Keploy's agent runs as root, so Keploy may ask for your `sudo`
  password.
- A JDK, version 17 or newer, such as [Eclipse Temurin](https://adoptium.net/).
- [Maven](https://maven.apache.org/download.cgi) 3.9 or newer.
- Keploy. To install it, run:

  ```bash
  source /dev/stdin <<<"$(curl -fsSL https://keploy.io/install.sh || echo 'echo Keploy installer download failed >&2; return 1')"
  ```

  For other ways to install it, see [Installation](/docs/server/installation/).

## Step 1: Create the sample app

1. Create a folder with a git repository and Maven's source folders:

   ```bash
   mkdir billing-java && cd billing-java && git init
   mkdir -p src/main/java/com/example src/test/java/com/example
   ```

2. Save this as `UsersApi.java`. It stands in for an external users API that
   your app calls:

   ```java
   // A stand-in for an external users API. It listens on port 8085.
   import com.sun.net.httpserver.HttpServer;
   import java.net.InetSocketAddress;
   import java.nio.charset.StandardCharsets;
   import java.util.Map;

   public class UsersApi {
     static final Map<String, Map<String, String>> TABLES = Map.of(
         "users", Map.of(
             "1", "{\"id\":1,\"name\":\"Ada Lovelace\",\"plan\":\"pro\"}",
             "2", "{\"id\":2,\"name\":\"Alan Turing\",\"plan\":\"free\"}"),
         "plans", Map.of(
             "free", "{\"price\":0}",
             "pro", "{\"price\":20}"));

     public static void main(String[] args) throws Exception {
       HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 8085), 0);
       server.createContext("/", exchange -> {
         String[] parts = exchange.getRequestURI().getPath().split("/");
         String item = parts.length == 3
             ? TABLES.getOrDefault(parts[1], Map.of()).get(parts[2])
             : null;
         byte[] body = (item != null ? item : "{\"error\":\"not found\"}")
             .getBytes(StandardCharsets.UTF_8);
         exchange.getResponseHeaders().set("Content-Type", "application/json");
         exchange.sendResponseHeaders(item != null ? 200 : 404, body.length);
         exchange.getResponseBody().write(body);
         exchange.close();
       });
       server.start();
     }
   }
   ```

3. Save this as `pom.xml`. It builds the app with Jackson for JSON, and tests
   it with JUnit 5:

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <project xmlns="http://maven.apache.org/POM/4.0.0"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
     <modelVersion>4.0.0</modelVersion>
     <groupId>com.example</groupId>
     <artifactId>billing</artifactId>
     <version>1.0</version>

     <properties>
       <maven.compiler.release>17</maven.compiler.release>
       <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
     </properties>

     <dependencies>
       <dependency>
         <groupId>com.fasterxml.jackson.core</groupId>
         <artifactId>jackson-databind</artifactId>
         <version>2.18.2</version>
       </dependency>
       <dependency>
         <groupId>org.junit.jupiter</groupId>
         <artifactId>junit-jupiter</artifactId>
         <version>5.11.4</version>
         <scope>test</scope>
       </dependency>
     </dependencies>

     <build>
       <plugins>
         <plugin>
           <groupId>org.apache.maven.plugins</groupId>
           <artifactId>maven-surefire-plugin</artifactId>
           <version>3.5.2</version>
         </plugin>
       </plugins>
     </build>
   </project>
   ```

4. Save this as `src/main/java/com/example/Billing.java`. It's your app:
   `monthlyBill` looks a user up in the users API and formats their bill:

   ```java
   package com.example;

   import com.fasterxml.jackson.databind.JsonNode;
   import com.fasterxml.jackson.databind.ObjectMapper;
   import java.io.IOException;
   import java.net.URI;
   import java.net.http.HttpClient;
   import java.net.http.HttpRequest;
   import java.net.http.HttpResponse;

   // A small billing app. It calls an external users API.
   public class Billing {
     static final String USERS_API = "http://127.0.0.1:8085";
     static final HttpClient HTTP = HttpClient.newHttpClient();
     static final ObjectMapper JSON = new ObjectMapper();

     static JsonNode get(String path) throws IOException, InterruptedException {
       HttpRequest request = HttpRequest.newBuilder(URI.create(USERS_API + path)).build();
       HttpResponse<String> response = HTTP.send(request, HttpResponse.BodyHandlers.ofString());
       if (response.statusCode() != 200) {
         throw new IOException("HTTP " + response.statusCode() + " for " + path);
       }
       return JSON.readTree(response.body());
     }

     // Look up a user and format their monthly bill.
     public static String monthlyBill(int userId) throws IOException, InterruptedException {
       JsonNode user = get("/users/" + userId);
       String plan = user.get("plan").asText();
       int price = plan.equals("pro") ? 20 : 0;
       return user.get("name").asText() + " (" + plan + "): $" + price + "/month";
     }
   }
   ```

5. Save this as `src/test/java/com/example/BillingTest.java`. These are your
   tests:

   ```java
   package com.example;

   import static org.junit.jupiter.api.Assertions.assertEquals;

   import org.junit.jupiter.api.Test;

   class BillingTest {
     @Test
     void proUserBill() throws Exception {
       assertEquals("Ada Lovelace (pro): $20/month", Billing.monthlyBill(1));
     }

     @Test
     void freeUserBill() throws Exception {
       assertEquals("Alan Turing (free): $0/month", Billing.monthlyBill(2));
     }
   }
   ```

6. Keep Maven's build output out of git:

   ```bash
   printf 'target/\n' > .gitignore
   ```

## Step 2: Run the tests against the real API

1. In a second terminal, in the `billing-java` folder, start the users API:

   ```bash
   java UsersApi.java
   ```

2. Back in the first terminal, run the tests:

   ```bash
   mvn test
   ```

   The first run downloads Jackson, JUnit and Maven's plugins. Then the tests
   run:

   ```
   [INFO] Scanning for projects...
   …
   [INFO] -------------------------------------------------------
   [INFO]  T E S T S
   [INFO] -------------------------------------------------------
   [INFO] Running com.example.BillingTest
   [INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.347 s -- in com.example.BillingTest
   [INFO]
   [INFO] Results:
   [INFO]
   [INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
   [INFO]
   [INFO] ------------------------------------------------------------------------
   [INFO] BUILD SUCCESS
   [INFO] ------------------------------------------------------------------------
   ```

   Run the tests this way once before you record, so Maven has downloaded what
   it needs. If Maven downloads during a record, Keploy records its downloads
   along with your app's calls.

## Step 3: Record the calls

Run the same test command under `keploy mock record`:

```bash
keploy mock record --local -c "mvn test"
```

```
🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "mvn", "args": 1}
🐰 Keploy: INFO  pointing Java at a merged keploy truststore via JAVA_TOOL_OPTIONS (the JDK's cacerts is left untouched)  {"truststore": "/tmp/keploy-java-truststore-1000.jks", …}
🐰 Keploy: INFO  Starting Application :  {"program": "mvn", "args": 1}
Picked up JAVA_TOOL_OPTIONS: -Djavax.net.ssl.trustStore=/tmp/keploy-java-truststore-1000.jks -Djavax.net.ssl.trustStorePassword=changeit
[INFO] Scanning for projects...
…
[INFO]  T E S T S
[INFO] -------------------------------------------------------
Picked up JAVA_TOOL_OPTIONS: -Djavax.net.ssl.trustStore=/tmp/keploy-java-truststore-1000.jks -Djavax.net.ssl.trustStorePassword=changeit
[INFO] Running com.example.BillingTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.332 s -- in com.example.BillingTest
…
[INFO] BUILD SUCCESS
…
🐰 Keploy: INFO  recorded mocks  {"mocks": 2, "mock-set": "default"}
🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
```

`--local` keeps the recording in your repository, so you don't need a Keploy
account for this quickstart. Without `--local`, Keploy asks you to sign in
first.

Keploy sets `JAVA_TOOL_OPTIONS` for your test command. It points each JVM at a
truststore that holds your system's certificates and Keploy's own, so Keploy
can record calls to HTTPS services too. Your JDK's `cacerts` file doesn't
change. Each JVM prints the `Picked up JAVA_TOOL_OPTIONS` line as it starts:
first Maven's, then the one Surefire starts to run the tests.

Keploy wrote four files:

- `keploy.yml`, the project's Keploy settings. It holds the app name and the
  test command.
- `keploy/default/mocks.yaml`, the recording: the 2 calls to the users API,
  each with its answer.
- `keploy/default/last-record.yaml`, the command Keploy recorded this set with.
  `keploy mock status` replays the recording with it.
- `keploy/.gitignore`, which keeps Keploy's temporary files out of git.

Here is the first call in `mocks.yaml`, trimmed:

```yaml
kind: Http
name: mock-0
spec:
  metadata:
    destAddr: "[127.0.0.1]:8085"
    operation: GET
    type: HTTP_CLIENT
  req:
    method: GET
    url: /users/1
    header:
      Connection: Upgrade, HTTP2-Settings
      Host: 127.0.0.1:8085
      Http2-Settings: AAEAAEAAAAIAAAAAAAMAAAAAAAQBAAAAAAUAAEAAAAYABgAA
      Upgrade: h2c
      User-Agent: Java-http-client/21.0.13.1
  resp:
    status_code: 200
    header:
      Content-Length: "43"
      Content-Type: application/json
    body: '{"id":1,"name":"Ada Lovelace","plan":"pro"}'
```

Java's `HttpClient` offers to switch a plain HTTP call to HTTP/2, with the
`Upgrade: h2c` header. The users API answers in HTTP/1.1, and Keploy records
the call as your app made it.

## Step 4: Replay with the API off

1. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd> in the second terminal.

2. Run the tests on their own. They fail, because nothing answers:

   ```bash
   mvn test
   ```

   ```
   [INFO] Running com.example.BillingTest
   [ERROR] Tests run: 2, Failures: 0, Errors: 2, Skipped: 0, Time elapsed: 0.277 s <<< FAILURE! -- in com.example.BillingTest
   [ERROR] com.example.BillingTest.proUserBill -- Time elapsed: 0.258 s <<< ERROR!
   java.net.ConnectException
   …
   [ERROR] com.example.BillingTest.freeUserBill -- Time elapsed: 0.005 s <<< ERROR!
   java.net.ConnectException
   …
   [ERROR] Tests run: 2, Failures: 0, Errors: 2, Skipped: 0
   …
   [INFO] BUILD FAILURE
   …
   ```

3. Run them under `keploy mock replay`:

   ```bash
   keploy mock replay --local -c "mvn test"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "mvn", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "mvn", "args": 1}
   …
   [INFO] Running com.example.BillingTest
   [INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.317 s -- in com.example.BillingTest
   …
   [INFO] BUILD SUCCESS
   …
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 2}
   ```

The tests pass with no users API running. Keploy answered every call from the
recording.

## Step 5: Add a call the recording doesn't have

1. Add this method to `Billing.java`, just before the class's last `}`. It
   calls a new endpoint, `/plans/<plan>`:

   ```java
     // Look up the monthly price of a plan.
     public static int planPrice(String plan) throws IOException, InterruptedException {
       return get("/plans/" + plan).get("price").asInt();
     }
   ```

2. Add this test to `BillingTest.java`, just before the class's last `}`:

   ```java
     @Test
     void proPlanPrice() throws Exception {
       assertEquals(20, Billing.planPrice("pro"));
     }
   ```

3. Replay again, with the API still off:

   ```bash
   keploy mock replay --local -c "mvn test"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "mvn", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "mvn", "args": 1}
   …
   [INFO] Running com.example.BillingTest
   [ERROR] Tests run: 3, Failures: 0, Errors: 1, Skipped: 0, Time elapsed: 0.339 s <<< FAILURE! -- in com.example.BillingTest
   [ERROR] com.example.BillingTest.proPlanPrice -- Time elapsed: 0.298 s <<< ERROR!
   java.io.IOException: HTTP 502 for /plans/pro
   …
   [ERROR] Tests run: 3, Failures: 0, Errors: 1, Skipped: 0
   …
   [INFO] BUILD FAILURE
   …
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 2, "consumed": 2, "missed": 1}
   🐰 Keploy: WARN  no recorded mock matched an outgoing call  {"protocol": "HTTP", "call": "GET /{}/{}", …}
     Mock mismatch: [HTTP] GET /plans/pro [path tag #…]  →  127.0.0.1:8085
     Hint: Only values drifted (path). If the change is expected, re-record the mock set with 'keploy mock record', or, with the dependency reachable, capture the new calls with 'keploy mock replay --on-miss record'. …
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "the test command failed"}
   ```

   The recording has no `/plans/pro` call. Keploy doesn't send the call to the
   real API. It answers it with `502 Bad Gateway`, fails the run, names the
   call, and says what to do. The exit code is the test command's, so CI fails
   too.

4. Start the users API again in the second terminal:

   ```bash
   java UsersApi.java
   ```

5. Record again, so the recording has the new call too:

   ```bash
   keploy mock record --local -c "mvn test"
   ```

   ```
   🐰 Keploy: INFO  Recording mocks for your test command  {"mock-set": "default", "program": "mvn", "args": 1}
   🐰 Keploy: INFO  Starting Application :  {"program": "mvn", "args": 1}
   …
   [INFO] Running com.example.BillingTest
   [INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.391 s -- in com.example.BillingTest
   …
   [INFO] BUILD SUCCESS
   …
   🐰 Keploy: INFO  recorded mocks  {"mocks": 3, "mock-set": "default"}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "record"}
   ```

   A new record replaces the recording, so it always matches the tests you
   have now.

6. Stop the users API with <kbd>Ctrl</kbd>+<kbd>C</kbd>, and replay:

   ```bash
   keploy mock replay --local -c "mvn test"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "mvn", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "mvn", "args": 1}
   …
   [INFO] Running com.example.BillingTest
   [INFO] Tests run: 3, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.272 s -- in com.example.BillingTest
   …
   [INFO] BUILD SUCCESS
   …
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command finished successfully  {"phase": "replay"}
   🐰 Keploy: INFO  this replay ran with every dependency answered from the recording  {"mock-set": "default", "served": 3}
   ```

   All three tests pass from the recording, with no users API running.

## Step 6: See a failing test fail the run

1. In `BillingTest.java`, change `$20/month` to `$25/month`.

2. Replay, and print the exit code:

   ```bash
   keploy mock replay --local -c "mvn test"
   echo "exit code: $?"
   ```

   ```
   🐰 Keploy: INFO  Replaying mocks for your test command  {"mock-set": "default", "program": "mvn", "args": 1, "on-miss": "fail"}
   🐰 Keploy: INFO  Starting Application :  {"program": "mvn", "args": 1}
   …
   [INFO] Running com.example.BillingTest
   [ERROR] Tests run: 3, Failures: 1, Errors: 0, Skipped: 0, Time elapsed: 0.320 s <<< FAILURE! -- in com.example.BillingTest
   [ERROR] com.example.BillingTest.proUserBill -- Time elapsed: 0.012 s <<< FAILURE!
   org.opentest4j.AssertionFailedError: expected: <Ada Lovelace (pro): $25/month> but was: <Ada Lovelace (pro): $20/month>
   …
   [ERROR] Tests run: 3, Failures: 1, Errors: 0, Skipped: 0
   …
   [INFO] BUILD FAILURE
   …
   🐰 Keploy: ERROR  error while running the app  {"error": "exit status 1"}
   🐰 Keploy: INFO  mock replay summary  {"loaded": 3, "consumed": 3, "missed": 0}
   🐰 Keploy: INFO  test command exited non-zero; mirroring its exit code  {"phase": "replay", "exitCode": 1}
   🐰 Keploy: INFO  this replay did not prove the tests run with the dependencies off  {"mock-set": "default", "reason": "the test command failed"}
   exit code: 1
   ```

   JUnit shows the value it expected and the value it got. The summary shows
   no missed call, so every call was answered from the recording, and the
   failure is in the code or the test. Keploy exits with the test command's
   exit code, so a failing test fails your CI job.

3. Change `$25/month` back to `$20/month`.

## Step 7: Commit the recording

Commit `keploy.yml` and the `keploy/` folder with your code:

```bash
git add . && git status --short
```

```
A  .gitignore
A  UsersApi.java
A  keploy.yml
A  keploy/.gitignore
A  keploy/default/last-record.yaml
A  keploy/default/mocks.yaml
A  pom.xml
A  src/main/java/com/example/Billing.java
A  src/test/java/com/example/BillingTest.java
```

`keploy/default/` holds the recording (`mocks.yaml`) and the record command
(`last-record.yaml`). The other files in `keploy/default/`, such as
`last-replay.yaml`, are run files from this machine's last replay:
`keploy/.gitignore` keeps them out of git, so `git add .` skips them.

Commit what `git add` staged:

```bash
git commit -m "Add billing tests and their Keploy recording"
```

Now anyone can replay the tests on a clone with no users API, and CI can too.
The replay gives `mvn test` no network, so Maven must already have every plugin
and library the build uses. On a machine whose Maven repository
(`~/.m2/repository`) doesn't have them yet, such as a fresh CI runner, fetch
them first with a run that starts Surefire but matches no test:

```bash
mvn -B test -Dtest='*#none' -Dsurefire.failIfNoSpecifiedTests=false
keploy mock replay --local -c "mvn test"
```

Without that first command, the replay ends in `BUILD FAILURE` and Keploy
reports DNS misses for `repo.maven.apache.org`. Its hint says to re-record, but
a record would capture Maven's downloads: fetch them before the replay instead.
`mvn dependency:go-offline` isn't enough on its own, because Surefire fetches
the rest only when it starts to run tests.

## Clean up

Step 5 stopped the users API, so nothing is left running. Delete the
`billing-java` folder when you no longer need it.

## Next steps

- [Node.js quickstart](./jest.md): the same loop with Jest and `fetch`.
- [Python quickstart](../mock-quickstart.md): the same loop with `pytest`,
  and `--on-miss record` to add a new call.
- [Go quickstart](./go.md): a sample with PostgreSQL and an HTTP API, and a
  check of each test on its own.
- [Run the replay in CI, and share recordings with your team](../mock-your-tests.md#proven-ci).
  With a Keploy account, recordings live in Keploy Cloud, and the repository
  keeps only `keploy.yml` and `keploy.lock`.
- [keploy.yml and keploy.lock](../guides/keploy-yml-and-lock.md): what to
  commit when your recordings live in Keploy Cloud.
- [Learn every option of `keploy mock`](../mock-your-tests.md).
