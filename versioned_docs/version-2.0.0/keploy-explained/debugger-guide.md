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

To bring up the **Run and Debug** view, select the **Run and Debug** icon in the **Activity Bar** on the side of VS Code. You can also use the keyboard shortcut `Ctrl+Shift+D`.  

If running and debugging is not yet configured (no `launch.json` has been created), VS Code shows the Run start view.

Click on **create a launch.json file**  👉  **Go**  👉  **Go: Launch Package**

Navigate to `launch.json` to begin crafting JSON objects.

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
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
            "args": [
                "record",
                "-c",
                "<path_to_executable>"
                // "--delay", "15"
            ],
        },
        {
            "name": "Test",
            "type": "go",
            "request": "launch",
            "mode": "auto",
            "asRoot": true,
            "console": "integratedTerminal",
            "program": "main.go",
            "args": [
                "test",
                "-c",
                "<path_to_executable>",
                // "--delay", "15"
            ],
        }
    ]
}

```

Let's take a closer look at some important key-value pairs in our JSON file:

- The `"name"`  parameter can be anything, but for convenience, consider using the keploy command name (e.g., `Record` and `Test`).
- The `args` parameter represents the entire keploy command for running your application. For example, in [Gin + Mongo](https://keploy.io/docs/quickstart/samples-gin/), you run `keploy record -c "go run main.go handler.go"` where `record -c "go run main.go handler.go"` is the `"args"`.

You can either add more objects in the "configurations" array or modify the "args" property within a single object to add more commands.

> **Note**: By default, the keploy tests and reports will be generated in the keploy directory. You can change this by creating the [generate-config](https://keploy.io/docs/running-keploy/cli-commands/#generate-config) and specifying the desired path.


## Running the Debugger

Click the **Start Debugging** button or press **F5** to witness the magic of debugging unfold seamlessly.