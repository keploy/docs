---
id: integration
title: Integration
description: Add the Keploy Go SDK to your application.
tags:
  - developer-guide
  - go
---

### Get the SDK

Add the [Keploy Go SDK](https://github.com/keploy/go-sdk) to your project:

```bash
go get -u github.com/keploy/go-sdk
```

Or clone the Go SDK repo to your preferred location:

```bash
git clone git@github.com:keploy/go-sdk.git
```

> Note that Testcases are exported as files in the project directory by default


### SDK Modes

[Learn more](../concepts/what-are-keploy-sdk-modes.md) about SDK modes

### Where is the Go SDK technical reference?

The [Keploy Go SDK API reference](https://pkg.go.dev/github.com/keploy/go-sdk) is published on [pkg.go.dev](https://pkg.go.dev/github.com/keploy/go-sdk)

## Usage

```go
import(
    "github.com/keploy/go-sdk/keploy"
    "github.com/keploy/go-sdk/integrations/<package_name>"
)
```

Create your app instance

```go
k := keploy.New(keploy.Config{
     App: keploy.AppConfig{
         Name: "<app_name>",
         Port: "<app_port>",
     },
     Server: keploy.ServerConfig{
         URL: "<keploy_host>",
         LicenseKey: "<license_key>", //optional for managed services
     },
    })
```

For example:

```go
port := "6789"
 k := keploy.New(keploy.Config{
     App: keploy.AppConfig{
         Name: "my-app",
         Port: port,
     },
     Server: keploy.ServerConfig{
         URL: "http://localhost:6789/api",
     },
 })
```

Now wrap the routers, https clients and external dependencies like DBs. See the list of [supported frameworks](/docs/go/supported-frameworks).
