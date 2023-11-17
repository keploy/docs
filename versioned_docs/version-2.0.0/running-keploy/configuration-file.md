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

Tired of specifying the same container name, app command, or delay for each record or test command? 😴

Introducing configuration file 🎉

It is a YAML-based file named keploy-config.yaml. This file will allow you to define the testing configurations, including container setups, delays, and any other relevant parameters.

To generate a keploy-config file, run:

```bash
keploy generate-config --path "/path/to/your/project"
```

After successful execution of the command, a default initialized config file has been created. 🥳
