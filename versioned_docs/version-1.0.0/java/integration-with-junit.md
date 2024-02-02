---
id: integration-with-Junit
title: Integrate with Junit (v1.0.0)
sidebar_label: Integrate with Junit
---

- Add below code in your unit testfile, say, `Sample_Test.java` in `test/java` directory.

```java
          @Test
          public void TestKeploy() throws InterruptedException {

             CountDownLatch countDownLatch = HaltThread.getInstance().getCountDownLatch();
             mode.setTestMode();
             new Thread(() -> {
                 SamplesJavaApplication.main(new String[]{""});
                 countDownLatch.countDown();
             }).start();

             countDownLatch.await();
          }
```

- Run `mvn test`
