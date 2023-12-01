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

Introducing **Keploy-config** 🎉

It is a YAML-based file that will allow you to define the testing configurations, including container setups, delays, and any other relevant parameters.

To generate a keploy-config file, run:

```bash
keploy generate-config --path "/path/to/your/project"
```

After successful execution of the command, a default initialized config file named as `keploy-config.yaml` has been created with the content as shown below:

```bash
record:
    path: ""
    # mandatory
    command: ""
    proxyport: 0
    containerName: ""
    networkName: ""
    delay: 5
    passThroughPorts: []
test:
    path: ""
    # mandatory
    command: ""
    proxyport: 0
    containerName: ""
    networkName: ""
    testSets: []
    globalNoise: |-
        {
          "global": {
            "body": {},
            "header": {}
          },
          "test-sets": {
            "test-set-name": {
              "body": {},
              "header": {}
            }
          }
        }
    delay: 5
    apiTimeout: 5
    passThroughPorts: []
```

The presence of this file allows the user to eliminate the monotonous way of specifying the same parameters/flags for each record or test command in every run. The flags specified in the Keploy's [CLI Command Docs](http://keploy.io/docs/running-keploy/cli-commands/) are now converted into parameters to the record and test command in the config file. These parameters take the same input as the flags in the CLI command. Specifying those parameters in the config file will allow the user to directly run the record or test command without specifying the flags as shown below:

To record, run:

```bash
keploy record
```

To test, run:

```bash
keploy test
```

Visit the [CLI Command Docs](http://keploy.io/docs/running-keploy/cli-commands/) to know more about the flags/parameters and their usage.

The additional relief that the config file provides is that it allows the user to specify the `Global Noise` and `Test-Set Noise` in the config file itself. The global noise and test set noise are the [Noisy fields](http://keploy.io/docs/concepts/general-glossary/#3-noisy-field) that are needed to be ignore while comparing the response of the API calls. The global noise is the noise that is to be ignored for all the API calls, whereas the test-set noise is the noise that is to be ignored for a particular test set. The global noise and test-set noise are specified in the config file as shown below:

```bash
    globalNoise: |-
     {
       "global": {
         "body": {
            # to ignore some values for a field, 
            # pass regex patterns to the corresponding array value
            "url": ["https?://\S+", "http://\S+"],
         },
         "header": {
            # to ignore the entire field, pass an empty array
            "Date: [],
          }
        },
        # to ignore fields or the corresponding values for a specific test-set,
        # pass the test-set-name as a key to the "test-sets" object and
        # populate the corresponding "body" and "header" objects 
        "test-sets": {
          "test-set-1": {
            "body": {
              "uuid": ["b464d6df-d28b-4d12-8af1-0e2d61289578"]
            },
            "header": { 
              # we can also pass the exact value to ignore for a field
              "User-Agent": ["PostmanRuntime/7.34.0"]
            }
          }
        }
```

The `globalNoise` and `test-set noise` are optional fields in the config file. If not specified, the default value for both the fields is an empty object `{}`.

And now, you are all set to record and test your APIs with Keploy in the new way 🚀
