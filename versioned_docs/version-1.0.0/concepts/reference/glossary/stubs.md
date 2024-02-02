---
id: Stubs
title: Stubs (v1.0.0)
sidebar_label: Stubs
description: This glossary has an explanation of all the terminologies that beginners find difficult to understand at first glance.
tags:
  - explanation
keywords:
  - API
---

A stub is a piece of code that stands in for some other programming functionality. It can simulate the behavior of existing code (such as a procedure on a remote machine) or be a temporary substitute for yet-to-be-developed code. Stubs are most useful in porting, distributed computing, and general software development and testing.

In software testing, stubs are used to simulate the behavior of external systems or modules that are not yet implemented. This allows the developer to test the calling module without having to wait for the external system to be ready. Stubs can also be used to test the calling module in isolation, without having to worry about the side effects of calling the external system.

Here is an example of a stub in Java:

```java
public class Stub {

    public int getTemperature() {
        return 72;
    }
}
```

This stub simulates the behavior of a real-world thermometer. It always returns the temperature of 72 degrees Fahrenheit. This stub could be used to test a program that reads the temperature from a thermometer.

Stubs are a valuable tool for software development and testing. They can help to speed up the development process and ensure that the code is working correctly.

### Benefits of using stubs:

- They can help to speed up the development process by allowing the developer to test the calling module without having to wait for the external system to be ready.
- They can help to ensure that the code is working correctly by isolating the calling module from the external system.
- They can help to identify problems with the calling module by providing a simplified interface to the external system.

### Limitations of using stubs:

- They can be difficult to create, especially if the external system is complex.
- They may not always be accurate representations of the real-world system.
- They may not be able to handle all of the possible scenarios that the real-world system can handle.

Overall, stubs are a valuable tool for software development and testing. They can help to speed up the development process, ensure that the code is working correctly, and identify problems with the calling module.
