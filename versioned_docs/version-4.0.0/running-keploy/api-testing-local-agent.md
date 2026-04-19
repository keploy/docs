---
id: api-testing-local-agent
title: Using Keploy Local Agent
description: Guide to adding to recording and generating test suites using local agent
sidebar_label: Local Agent
tags:
  - api-testing
  - local-agent
  - test-suite
  - test-management
---
import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide explains how to use the local agent to test private or local endpoints. Follow the steps below to set up and use the local agent effectively.

## Steps to Use the Local Agent

1. **Enter the Endpoint URL**
   - Enter the endpoint URL you want to test. This can be a private URL or any other endpoint.
   - You can also enter a localhost link

2. **Download the Keploy Agent**
   - Based on your device configuration, download the Keploy agent:
     - **Windows**
     - **Mac**
     - **Linux**
![Local Agent](https://keploy-devrel.s3.us-west-2.amazonaws.com/local-agent-1.png)

3. **Start the Keploy Agent**
   - Once the agent is downloaded, start it on your device.
   - Open the agent interface to ensure it is running and ready to connect.

![Local Agent](https://keploy-devrel.s3.us-west-2.amazonaws.com/local-agent-2.png)

4. **Record API Calls**
   - The Keploy agent will automatically record the API calls you make.
   - It will capture the responses and start generating test suites based on the recorded calls.

5. **Troubleshooting Connection Issues**
   - Ensure that the agent is running and the endpoint URL is correct.
   - If the local agent fails to connect, you can use the Keploy extension as an alternative  [Record API Tests via Chrome Extension](https://keploy.io/docs/running-keploy/api-testing-chrome-extension/)

By following these steps, you can efficiently use the local agent to test your APIs and generate test suites automatically.