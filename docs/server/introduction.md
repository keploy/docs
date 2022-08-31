---
id: introduction
title: Installation
sidebar_label: Server
---

## Overview

The [Keploy Server](https://github.com/keploy/keploy) is an API-Testing platform that performs the operations of comparing, storing, deduplication of test-cases.
It is completely open source and can be run in a variety of cloud or on-premise environments.
A single Server instance can be used for many different use cases simultaneously, or be tied to a single application.

import ServerInstallation from './server-installation.md'

<ServerInstallation/>

### Update Keploy Server

If you're running old version of Keploy. Update the Keploy Server version by pulling the latest docker image.

```shell
docker-compose pull
```
