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

## Introduction

Tired of specifying the same container name, app command, or delay, filters for each record or test command? 😴

Introducing **Keploy-config** 🎉 - It is a YAML-based file that will allow you to define the testing configurations, including container setups, delays, and any other relevant parameters.

## Getting Started:

We will be using a sample app to demonstrate working of Keploy configuration file.

To generate a keploy-config file, run:

```bash
keploy config --generate --path "./config-dir/"
```

For demonstration purposes, we are using the [root directory of the echo-sql application](https://github.com/keploy/samples-go/tree/main/echo-sql). We can place it wherever we want to inside the project.

After successful execution of the command, a default initialized config file named as `keploy.yaml` has been created with the content as shown below:

```yaml
path: ""
command: "./echo-psql-url-shortener"
port: 0
proxyPort: 16789
dnsPort: 26789
debug: false
disableTele: false
inDocker: false
generateGithubActions: true
containerName: ""
networkName: ""
buildDelay: 30s
test:
  selectedTests: {}
  globalNoise:
    global: {}
    test-sets: {}
  delay: 5
  apiTimeout: 5
  coverage: false
  goCoverage: false
  coverageReportPath: ""
  ignoreOrdering: true
  mongoPassword: "default@123"
  language: ""
  removeUnusedMocks: false
record:
  recordTimer: 0s
  filters: []
configPath: ""
bypassRules: []
cmdType: "native"
enableTesting: false
keployContainer: "keploy-v2"
keployNetwork: "keploy-network"
# Visit [https://keploy.io/docs/running-keploy/configuration-file/] to learn about using keploy through configration file.
```

## Using the Config File

The Keploy-config file eliminates the need to repeatedly specify parameters for each record or test command. The parameters in the file correspond to the flags in the Keploy [CLI Command Docs](http://keploy.io/docs/running-keploy/cli-commands/).Using keploy-config can help to reduce the record and test command to just:

### Record Command:

```bash
keploy record
```

### Test Command:

```bash
keploy test
```

Visit the [CLI Command Docs](http://keploy.io/docs/running-keploy/cli-commands/) to know more about the flags/parameters and their usage.

## Configuration Sections

### Record Section

The `record` section in the Keploy-config file allows you to define parameters for recording API calls.

- **`path`**: Path to the project where recording occurs. (Mandatory field)

- **`command`**: Command executed during recording.

- **`proxyport`**: Port number for the proxy. Default is 0.

- **`containerName`**: Name of the container during recording.

- **`networkName`**: Network name for the container during recording.

- **`delay`**: Delay in seconds before recording each request. Default is 5 seconds.

- **`filters`**: API calls to the application to avoid recording.

  Example:

  ```yaml
  record:
    filters:
      - path: "/user/app"
        urlMethods: ["GET"]
        headers: {"^asdf*": "^test"}
        host: "dc.services.visualstudio.com"
  ```

  This will avoid recording the API calls to the path `/user/app` with the method `GET`, headers starting with `asdf` and host `dc.services.visualstudio.com`.

- **`tests`**: Filters to record Tests.

  Example:

  ```yaml
  tests:
    filters:
      - path: ""
        urlMethods: []
        headers: {}
        host: ""
  ```

- **`bypassRules`**: A bypass for mocking API calls.

  Example:

  ```yaml
  bypassRules:
    filters:
      - path: ""
        host: ""
        port: 0
  ```

### Test Section

The `test` section in the Keploy-config file allows you to define parameters for testing API calls.

- **`path`**: Path to the project where testing occurs. (Mandatory field)

- **`command`**: Command executed during testing.

- **`proxyport`**: Port number for the proxy during testing. Default is 0.

- **`containerName`**: Name of the container during testing.

- **`networkName`**: Network name for the container during testing.

- **`ignoreOrdering`**: When set to `true`, ignores the order of array elements in response bodies during testing.

- **`selectedTests`**: : Selected tests to run.
  Example:

  ```yaml
  selectedTests:
    "test-set-1": ["test-1", "test-2"]
    "test-set-2": []
  ```

- **`globalNoise`**: Noisy fields to be ignored at global/test-set level.
  Example:

  ```yml
  globalNoise:
  global:
    body: {"url": ["https?://\S+"]}
  test-sets: {}
  ```

- **`delay`**: Delay in seconds before testing each request. Default is 5 seconds.

- **`apiTimeout`**: Timeout in seconds for API calls during testing. Default is 5 seconds.

- **` bypassRules`**: A bypass for mocking API calls.

  ```yaml
  bypassRules:
  filters:
    - path: ""
      host: ""
      port: 0
  ```

- **`withCoverage`**: Whether to generate coverage reports during testing. Default is `false`.

- **`coverageReportPath`**: Path to store the coverage report.
  Example:
  ```yaml
  coverageReportPath: "/path/to/coverage/report"
  ```

The tests section in the Keploy-config file allows you to define parameters for recording test scenarios during API calls.

- **`filters`**: Filters to record specific tests based on path, HTTP methods, headers, and host.

  Example:

  ```yml
  tests:
    filters:
      - path: "/user/app"
        urlMethods: ["GET"]
        headers:
          "^asdf*": "^test"
        host: "dc.services.visualstudio.com"
  ```

The tests section enables you to specify conditions for recording tests during API calls. The filters subsection allows you to define specific criteria, such as path, HTTP methods, headers, and host, to record relevant test scenarios.

- **`path`**: Specifies the path for which the test should be recorded. It defines the URL path of the API endpoint.

- **`urlMethods`**: Specifies the HTTP methods for which the test should be recorded. It allows you to focus on specific HTTP methods like GET, POST, etc.

- **`headers`**: Specifies headers and their values for which the test should be recorded. It enables you to filter tests based on specific headers.

- **`host`**: Specifies the host for which the test should be recorded. It defines the domain or IP address of the API server.

#### Using Test Filters Together or Independently

You can use the **`path`**, **`urlMethods`**, **`headers`**, and **`host`** filters together or independently based on your testing scenarios. This flexibility allows you to precisely define the conditions under which tests are recorded.

### Bypass Rules Section

The `bypassRules` section in the Keploy-config file allows you to define parameters for bypassing and mocking API calls.

Example:

```yaml
bypassRules:
  - path: "/user/app"
    port: 8080
  - port: 8081
  - host: "dc.services.visualstudio.com"
  - port: 8081
    host: "dc.services.visualstudio.com"
    path: "/user/app"
```

The `bypassRules` section provides a way to bypass and mock API calls during testing. The filters subsection allows you to define specific conditions for applying stubs, such as path, port, and host. You can use these filters together or independently based on your testing scenarios.

- **`path`**: Specifies the path for which the stub should be applied. It defines the URL path of the API endpoint.

- **`port`**: Specifies the port for which the stub should be applied. It defines the network port on which the API call is made.

- **`host`**: Specifies the host for which the stub should be applied. It defines the domain or IP address of the API server.

In the provided example:

- The first bypass rule applies to the path "/user/app" and the port 8080.
- The second bypass rule applies to the port 8081.
- The third bypass rule applies to the host "dc.services.visual

## Advanced Noise Filtering:

Earlier the only way to add the [noisy fields](http://keploy.io/docs/concepts/general-glossary/#3-noisy-field) was by modifying individual test file (testcase level). Now, With the introduction of config file, users can add the noisy fields at test-set and global level through config file itself.

### Global Noise

The `global subsection` of `globalNoise` is used to define parameters that are globally ignored for all API calls during testing. It enables you to filter out consistent noise, ensuring a cleaner evaluation of responses.

```yml
globalNoise:
  global: {body: {
          # To ignore some values for a field, pass regex patterns to the corresponding array value
          "url": ['https?://\S+', 'http://\S+'],
        }, header: {
          # To ignore the entire field, pass an empty array
          "Date": [],
        }}
```

1. **`global`**:

- **`body`**: Defines patterns to ignore for the response body, such as filtering out URLs. Example: `{"url": ['https?://\S+', 'http://\S+']}`
- **`header`**: Specifies headers or header values to be ignored globally. Example: `{"Date": []}`

2. **`test-sets`**: This section is left empty in the example. It allows you to specify additional noise parameters for specific test sets, offering tailored noise filtering for different testing scenarios.

### Test-Set Noise

Under the `test-sets` subsection of `globalNoise`, you can define noise parameters specific to a particular test set. This ensures that certain noise is only ignored for the API calls associated with that specific test set.

```yml
test-sets: {test-set-1: {body: {
            # ignore all the values for the "uuid" field
            "uuid": [],
          }, header: {
            # we can also pass the exact value to ignore for a field
            "User-Agent": ["PostmanRuntime/7.34.0"],
          }}}
```

**`test-set-1`**:

- **`body`**: Defines patterns to ignore for the response body within the specified test set.
- **`header`**: Specifies headers or header values to be ignored for the specified test set. Example: `{"User-Agent": ["PostmanRuntime/7.34.0"]}`

### **Note**:

The `globalNoise` and `test-sets` are optional fields in the config file. If not specified, the default value for both fields is an empty object `{}`. This flexibility allows you to seamlessly integrate advanced noise filtering based on your testing requirements.

## Conclusion

Congratulations! You've now explored the features and configuration options provided by `Keploy-config`.

Now armed with Keploy-config, you are ready to embark on a more organized and productive journey of recording and testing APIs with Keploy. Feel free to explore additional features, customize configurations, and refer to the [CLI Command Docs](http://keploy.io/docs/running-keploy/cli-commands/) for more details on available flags and parameters.

Happy testing and may your APIs always return the expected results! 🚀
