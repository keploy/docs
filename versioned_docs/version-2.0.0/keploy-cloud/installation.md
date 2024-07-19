---
id: cloud-installation
title: Keploy Cloud Installation
sidebar_label: Installation 🛠️
tags:
  - explanation
  - feature guide
  - keploy cloud
  - installation
keywords:
  - keploy cloud
  - installation
  - API key
---

## Introduction 📘

#### Welcome to the Keploy Cloud Guide!

In this guide, you will find information about Keploy Cloud, onboarding, features, and how to use them.

#### Requesting a Keploy Cloud Account

To request a Keploy Cloud account, please complete the request form [here](https://forms.gle/jGBbyRyh9H7AKXZX6). Our team will review your request and get back to you as soon as possible.

#### Getting Started with Keploy Cloud

Once your account is set up, you can start exploring features of Keploy Cloud. Here are some key features to can get started with:

- **Time Freezing** ❄️: Keploy Cloud allows you to freeze/rollback the time in every test run, back to when the test case was recorded. This allows developers to ensure time-sensitive objects don’t expire or change, making tests consistent and more reliable.

- **AI-Driven Test Generation** 🧠: Keploy will automatically uncover your API's edge cases and generate test cases to expose more code paths, thereby increasing code coverage.

- **Test Deduplication** 📊 : Keploy detects duplicate/redundant tests automatically, which will be particularly useful if you plan to record numerous scenarios from a live environment and wish to retain only unique scenario tests.

- **Keploy Console** 📈: We are ensuring a smooth experience of visualising bugs found with Keploy and sharing reports with your team.

- **Asynchronous Processes Support** ⏱ : Keploy V2 captures and replays asynchronous tasks effectively. We're also incorporating support for adding custom user-defined behaviours or assertions.

- **Mock Registry** 📂: The Mock Registry is a system designed to handle large mock files by uploading them to cloud storage, preventing these sizable files from being committed to Git repositories. This approach optimizes repository size and performance while maintaining an efficient and streamlined development workflow.

To get started with Keploy Cloud, you will need to install the Keploy Cloud Agent and authenticate your account.

import PlatformRequirements from '../concepts/platform-requirements.md'

<PlatformRequirements/>

## Installation 🛠️

Install and Validate the Keploy Cloud Agent by following the steps below:

```bash
curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
```

Enter your **API Key** when prompted, ask your org Admin to re-regenerate the API key in case you lose it.

Once validated, you can start using Keploy Cloud to record-test.

### Need Help?

If you have any questions or need assistance, our support team is here to help. You can reach out to us through our support portal, Slack or by emailing us at hello[at]keploy.io.
