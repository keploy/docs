---
id: stubs
title: Create Data Stubs using Keploy
sidebar_label: Stubs
description: In software testing, stubs are used to simulate the behavior of external systems or modules that are not yet implemented.
tags:
  - explanation
  - Glossary
keywords:
  - API
---

## What are stubs?

Stubs are a piece of code that stands in for some other programming functionality. It can simulate the behavior of existing code (such as a procedure on a remote machine) or be a temporary substitute for yet-to-be-developed code. Stubs are most useful in porting, distributed computing, and general software development and testing.

In software testing, stubs are used to simulate the behavior of external systems or modules that are not yet implemented. This allows the developer to test the calling module without having to wait for the external system to be ready. Stubs can also be used to test the calling module in isolation, without having to worry about the side effects of calling the external system.

Here is an example of a stub in Java:

```java
public class Stub {

    public int getTemperature() {
        return 72;
    }
}
```

The above stub simulates the behavior of a real-world thermometer. It always returns the temperature of 72 degrees Fahrenheit. The stubs we created earlier could be used to test a program that reads the temperature from a thermometer.

When we talk about stubs, they are a valuable tool in the process of software development and testing, as they help to speed up the development process and ensure that the code is working correctly.

## Benefits of using data stubs:

- They can help to speed up the development process by allowing the developer to test the calling module without having to wait for the external system to be ready.
- They can help to ensure that the code is working correctly by isolating the calling module from the external system.
- They can help to identify problems with the calling module by providing a simplified interface to the external system.

## Challenges with data Stubs:

- Data stubs/mocks are difficult to create, especially if the external system is complex.
- And they may not always be accurate representations of the real-world system.
- Also, with data stubs may not be able to handle all of the possible scenarios that the real-world system can handle.
- Stubs are generally brittle.

## Overcoming Stub Challeges with Keploy:

Overall, stubs are a valuable tool for software development and testing. They can help to speed up the development process, ensure that the code is working correctly, and identify problems with the calling module.

Keploy can generate dependency stubs in addition to the testcases by recording your application network calls making your testing process not only faster than unit tests but also incredibly efficient.

<img src="https://keploy.io/docs/gif/record-replay.gif?raw=true"/>

Since the data stubs are generated based on the real-time capturing of API calls from your application, they will be from real-world scenarios. This can help to ensure that the mock data is accurate and that it represents the real data as closely as possible. As well as, it makes the data maintenance process easier by providing a same environment for testing. This can help to identify the source of bugs more easily.
