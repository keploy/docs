---
id: keploy-console
title: Keploy Console
sidebar_label: Keploy UI 🛠️
tags:
  - explanation
  - feature guide
  - keploy console
  - installation
keywords:
  - keploy console
  - installation
  - API key
---

## Introduction 📘

### Welcome to the Keploy Console Guide!

In this guide, you will find information about Keploy Console, onboarding, features, and how to use them.

### Requesting a Keploy Cloud Account

To request a Keploy Cloud account, please complete the request form [here](https://forms.gle/jGBbyRyh9H7AKXZX6). Our team will review your request and get back to you as soon as possible.

To get started with Keploy Cloud, you will need to install the Keploy Cloud Agent and authenticate your account.

## Installation 🛠️

Install and Validate the Keploy Cloud Agent by following the steps below:

```bash
curl --silent -O -L https://keploy.io/ent/install.sh && source install.sh
```

Enter your **API Key** when prompted, ask your org Admin to re-regenerate the API key in case you lose it.

Once validated, you can start using Keploy Cloud to record-test.

## Get Started with Keploy Console

### Create TestReports

Before starting Keploy Console, generate the `TestReports` by running Keploy in test mode : -

```bash
keploy test -c "<CMD_TO_RUN_APP>"
```

<img src="/docs/img/keploy-cloud/console-test-run.png?raw=true" alt="Keploy TestRun"/>

### Start Keploy Console

To start Keploy Console, run the following command:

```bash
keploy console
```

<img src="/docs/img/keploy-cloud/keploy-console-cmd.png?raw=true" alt="Keploy Console"/>

### Access Keploy UI Console
Now let's navigate to [Keploy UI](https://app.keploy.io), and Signin with the account which has Keploy Cloud access. Once we have signed in, we can select our application from dropdown and find the testreports which were generated earlier : - 

<img src="/docs/img/keploy-cloud/keploy-cloud-app.png?raw=true" alt="Keploy UI Console"/>

We can see Reports which have failed and get more indepth details about that specific test-run, by selecting that specific test-run-report. For example, let's select `test-report-6`, since that is our latest test report: - 

<img src="/docs/img/keploy-cloud/keploy-diff-view.png?raw=true" alt="Keploy Diff Viewer"/>

Here we can get to know how many testset and testcases were present from the report is generated and as well as how many passed and failed.

## Operations
From UI you can edit test-cases by performing operations such as: -

- [Mark Noise](#mark-noisy-fields)
- [Normalise](#normalise-test-report)

Click on three-dot on right hand side to open the menu dialog.

<img src="/docs/img/keploy-cloud/menu-dialog.png?raw=true" alt="Keploy Menu Dialog"/>


### Mark Noisy Fields

`Date` and `Content-Length` are two header field that we can see are different from the expected response so let's mark them as noise : - 

<img src="/docs/img/keploy-cloud/noise.png?raw=true" alt="Noise"/>

Open the Menu Dialog, select `Mark Noise` and we can see that checkboxes are visible in front of each field, tick the checkboxes in front of `Date` and `Content-Length` and save the changes.

Marking a field as noisy will ignore the field from the test report, and the field will not be considered for comparison. if we open `test-2.yml` locally, we would notice the both the above fields have been added under the Noise.

<img src="/docs/img/keploy-cloud/denoise.png?raw=true" alt="Denoise"/>


### Normalise Test Report
We can also normalise the test report, which will remove the noise from the test report. Before normalise we can notice the fields of `test-2.yml`: - 

<img src="/docs/img/keploy-cloud/normalise-before.png?raw=true" alt="Before Normalisation"/>

Open the Menu Dialog, select `Normalise` and we can see that the test report has been normalised : -

<img src="/docs/img/keploy-cloud/normalise.png?raw=true" alt="Normalise"/>

After normalising we can see the expected and actual response in our test-case : -

<img src="/docs/img/keploy-cloud/normalise-after.png?raw=true" alt="After Normalisation"/>

## Need Help?

If you have any questions or need assistance, our support team is here to help. You can reach out to us through our support portal, Slack or by emailing us.
