---
id: debugger-guide
title: Debugger Guide
sidebar_label: Debugger Guide
tags:
  - explanation
  - dev guide
  - debugger guide
---

# Debugger Guide 👨‍🔧

In this blog, we will learn how to debug keploy using Visual Studio Code integrated debugger.

## Setting Up Configuration File

To bring up the **Run and Debug** view, select the **Run and Debug** icon in the **Activity Bar** on the side of VS Code. You can also use the keyboard shortcut `Cmd + Shift + D` for MacOS and `Ctrl + shift + D` for Windows.

If running and debugging is not yet configured (no `launch.json` has been created), VS Code shows the Run start view.

Click on **create a launch.json file** 👉 **Go** 👉 **Go: Launch Package**

Navigate to `launch.json` to begin crafting JSON objects.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Record",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "asRoot": true,
      "console": "integratedTerminal",
      "program": "main.go",
      "args": ["record", "-c", "<path_to_executable>"],
      "env": {
        "PATH": "${env:PATH}"
      }
    },
    {
      "name": "Test",
      "type": "go",
      "request": "launch",
      "mode": "auto",
      "asRoot": true,
      "console": "integratedTerminal",
      "program": "main.go",
      "args": ["test", "-c", "<path_to_executable>"],
      "env": {
        "PATH": "${env:PATH}"
      }
    }
  ]
}
```

## Retrieving the PATH Environment Variable

### macOS/ Linux

<ul><li>

Terminal:

```shell
echo $PATH
```

</li>

</ul>

### Windows

<ul><li>

Command Prompt (CMD):

```shell
echo %PATH%
```

</li>

</ul>
Let's take a closer look at some important key-value pairs in our JSON file:

- The `"name"` parameter can be anything, but for convenience, consider using the keploy command name (e.g., `Record` and `Test`).
- The `args` parameter represents the entire keploy command to run your application. For example, in [Gin + Mongo](https://keploy.io/docs/quickstart/samples-gin/), on Linux, it's `record -c "go run main.go handler.go"`, and for MacOS, it's `record -c "docker compose up" --containerName "ginMongoApp"`.

You can either add more objects in the "configurations" array or modify the "args" property within a single object to add more commands.

> **Note**: By default, the keploy tests and reports will be generated in the keploy directory. You can change this by creating the [generate-config](https://keploy.io/docs/running-keploy/cli-commands/#generate-config) and specifying the desired path.

## Running the Debugger

Click the **Start Debugging** button to witness the magic of debugging unfold seamlessly.

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
