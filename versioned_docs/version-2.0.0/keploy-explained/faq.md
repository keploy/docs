---
id: faq
title: Frequently Asked Questions (FAQ)
sidebar_label: FAQ
tags:
  - explanation
  - faq
---

Let's get to the heart of Keploy with some fun Q&A!

### 1. Is Keploy a unit testing framework?

Nope, doesn't replace your trusty unit testing frameworks like `go-test`, `JUnit`, `Pytest`, or `Jest`. Instead, it teams up with them to make your testing life a breeze, ensuring compatibility with your favorite tools and pipelines.

### 2. Does Keploy replace unit tests entirely?

Almost! Keploy aims to save you a whopping 80% of the testing effort. While it handles most cases, you might still want to write tests for some methods that aren't API-invokable.

### 3. What code changes do I need to do?

Zero, zip, nada! For `Golang`, `Java`, `Python`, and `JavaScript` applications, Keploy plays nice with your existing codebase, requiring no code changes.

### 4. How do I run keploy in my CI pipeline?

Simple as pie. No need to overhaul your CI pipeline; you can keep using the one that runs your unit tests. Keploy fits right in!

### 5. Does Keploy support read after write to DB scenarios?

Absolutely! Keploy keeps things in order, recording write and read requests in sequence. It expects your application to play by the rules and serves up the same database responses as it did during capture.

### 6. How does keploy handle fields like timestamps, random numbers (eg: uuids)?

Keploy's got a keen eye for detail. If a request passes its deduplication algorithm, it's game time. Keploy sends a second request with the same parameters to check for differences in responses. Fields like timestamps and UUIDs get the spotlight as they're automatically flagged for comparison. From then on, they're out of the testing picture.

### 7. Can I use keploy to generate tests from production environments automatically?

Not just yet, but we're on it! We're cooking up a scalable deduplication algorithm to make it safe for production. If you're itching to explore this frontier, come chat with us on Slack. We'd love to join forces and put our system to the test with your systems.

### 8. What if my application behaviour changes?

Change is the only constant in the tech world, right? If your app decides to switch things up, your test cases might break. No worries; you can mark the new behavior as normal.

Got more questions? We're all ears (and code)👂.

<!-- ### 9. Would keploy know if an external service changes?

Not yet. Unless that application is also using keploy, keploy would only test the functionality of the current application. We are working to detect scanning for API contract violations and adding multiple application to perform comprehensive integration tests. All contributions are welcome. -->

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
