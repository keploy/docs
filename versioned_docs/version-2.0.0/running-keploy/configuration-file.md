---
id: configuration-file
title: Configuration File
sidebar_label: Configuration file
description: This section introduces the configuration file
tags:
  - configuration file
keywords:
  - configuration
---

Tired of specifying the same container name, app command, or delay, filters for each record or test command? 😴

Introducing Keploy-config 🎉

It is a YAML-based file that will allow you to define the testing configurations, including container setups, delays, and any other relevant parameters.

To generate a keploy-config file, run:

```bash
keploy generate-config --path "/path/to/your/project"
```

After successful execution of the command, a default initialized config file has been created. 🥳

## Eliminate recording of test cases
 
To simplify your test setup, use the filters section in the YAML configuration file. This allows you to exclude requests with specific headers or methods from generating test cases.<br />
For example, to avoid creating test cases for requests with certain headers and for specific URL methods, use the following configuration:

```bash
  filters: {
    ReqHeader: ["Host","Accept","Accept-Language"],
    urlMethods: {
      "/home":["GET","POST"],
     }
  }
```

With this configuration, test cases won't be generated for requests with the specified headers and for GET or POST requests to <strong>"/home"</strong>, simplifying your testing process.


