---
id: application-settings
title: Adding New Application to Keploy Cloud
sidebar_label: Add Application 📝
tags:
  - explanation
  - feature guide
  - keploy cloud
  - add application
  - new application
  - installation
keywords:
  - keploy cloud
  - installation
  - API key
---

### Start Keploy Agent

Before adding a new application or performing record-replay operations, please ensure that the keploy agent is running. You can bring up the agent by running

```bash
keploy agent-start
```

Now that we have the agent running. Let's add a new application to Keploy Cloud.

### Step 1: Create a New Application

To add the new application to Keploy Cloud, you need to login to [Keploy Console](https://app.keploy.io) and go to _New Application_.

### Step 2: Add Application Setup Workflow

Now let's add the setup workflow. Add your application name and the setup workflow of the application. For example in the above screenshot you can see the setup workflow script for the [sample Go application](/docs/quickstart/samples-gin/).

<img src="/docs/img/keploy-cloud/keploy-cloud-new-app.png" alt="Add Keploy application"/>.

### Step 3: Edit Keploy Configuration

Finally, edit the default [Keploy Config](/docs/running-keploy/configuration-file/) and click on the _Save_ button to add the application to Keploy Cloud.

### Need Help?

If you have any questions or need assistance, our support team is here to help. You can reach out to us through our support portal, Slack or by emailing us.
