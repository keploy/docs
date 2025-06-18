---
id: keploy-templatize
title: Keploy Templatize
sidebar_label: Keploy Templatize
description: This section documents how to templatize a testset
tags:
  - keploy
  - keploy templatize
keywords:
  - keploy
  - documentation
  - running-guide
---

Sometimes keploy test and keploy rerecord fail because there are fields which are noisy but they are used in requests so when their values change, the subsequent requests also fail.

eg: If an application is returning a JWT token in the response of a testcase and that token is being used in the request of another testcase, then that testcase will also fail when a new token is issued and the test is still using the old one that has been expired.

Templatize, as its name suggests, templatizes the testcases, so now the JWT token's original value will be replaced by a template in both the response of one testcase and the request of the other testcase and a config file will be created which will contain a map of the template key mapped to its value. Now in the test mode or rerecord mode, whenever a new token is issued where the template is placed, it will update the template value in the map and use that value in the subequent testcases where the template is placed.

## Keploy Templatize Example

You can use the following command to templatize your testsets.

```zsh
sudo -E env 'PATH=$PATH' keploy templatize
```

By default, it templatizes all the testsets in the keploy folder. If you want to templatize a particular testset, you can pass the testset flag like

```zsh
sudo -E env 'PATH=$PATH' keploy templatize -t="test-set-1"
```

> **Note**
>
> Even though you can use templatize multiple times, even on testsets that have already been templatized, but it is not reversible. So make sure you create a copy of your keploy folder before trying it out.
