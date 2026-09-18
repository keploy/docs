---
id: api-testing-auth-setup
title: Authentication Setup for API Testing
sidebar_label: Auth Setup
description: Configure authentication for Keploy API testing — set up bearer tokens, API keys, and custom auth headers so recorded suites replay against protected endpoints.
tags:
  - API testing
  - webhooks
  - integration
  - custom validation
  - policy enforcement
keywords:
  - webhook
  - API testing
  - PreExecute
  - PostExecute
  - external validation
  - custom logic
---

import ProductTier from '@site/src/components/ProductTier';

<ProductTier tiers="Free, Teams, Scale, Enterprise" offerings="Self-Hosted, Dedicated" />

This guide will help you setup your application Auth in API Test Generation and Run

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/auth.webp" alt="Keploy" width="2908" height="1300" style={{maxWidth:'100%',height:'auto'}} />

### 1. Login API

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/login-curl.webp" alt="Keploy" width="2578" height="1038" style={{maxWidth:'100%',height:'auto'}} />

This Auth option is for the application which provides a login API. Keploy will execute this login API when ever the auth token is required and use it in the API calls either in generation or run.

JWT Token - Keploy will execute this API and take the token from the json response value with the key "token" or "access_token" or "jwt"

Cookie - Keploy will execute this API and take the cookie from response headers with key value "Set-Cookie"

### 2. Bearer Token

<img src="https://keploy-devrel.s3.us-west-2.amazonaws.com/docs/webp-s3/img/jwt.webp" alt="Keploy" width="2674" height="898" style={{maxWidth:'100%',height:'auto'}} />

This Auth option is for the application which can be authenticated using jwt token. This token is used in all the API calls that are done by Keploy to the application.

## Related

- [Adding New Test Suites](/docs/running-keploy/api-testing-add-suite/) — add suites for protected endpoints.
- [Using Keploy Local Agent](/docs/running-keploy/api-testing-local-agent/) — test private endpoints locally.
- [API Test Generator](/docs/running-keploy/api-test-generator/) — generate tests after auth setup.
- [API Test Recorder (Chrome Extension)](/docs/running-keploy/api-testing-chrome-extension/) — capture authenticated traffic.
