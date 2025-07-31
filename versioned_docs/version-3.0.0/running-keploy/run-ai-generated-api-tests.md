---
id: run-ai-generated-api-tests
title: Run AI-Generated API Tests
sidebar_label: Run Tests
description: Discover how to execute Keploy’s AI-generated API test suites—locally, on-demand from the console, or automatically in CI/CD—and interpret the results to keep your API stable.
---

Once you’ve finished curating a suite , it’s time to hit **Run** and see how your API behaves against the latest contract.

## Open the **Run Tests** Modal

1. In the top-right of the Test-Suite workspace, click the green **Run Tests** button.

2. The modal will open with **two tabs**:

   | Tab                | What to Fill In                                                                                                                                                      |
   | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | **Endpoint**       | **API Endpoint URL** – the base URL Keploy will prepend to every request in the suite (e.g. `https://jsonplaceholder.typicode.com`).                                 |
   | **Authentication** | (Optional) Drop in a **Bearer**, **Basic**, or **API-key** credential that applies to every step.<br />You can also add per-step auth later in the test-step editor. |

3. Click **Run Tests** to start execution. A toast confirmation appears and the modal closes.

## Watch the Run Spin Up

A **Run Badge** next to each suite row flips from _queued_ → _running_ → _✔ passed_ or _✖ failed_ in real time.

## View the Test-Run Report

1. Click the **📄 View Test Run Report** link that appears in the toast, or switch to the **Run Reports** icon in the sidebar.
2. The summary table shows:

   | Column                      | Meaning                                                    |
   | --------------------------- | ---------------------------------------------------------- |
   | **Report ID**               | UUID of this run (use it in CI logs or API calls).         |
   | **Created At**              | Timestamp the run was triggered.                           |
   | **Creator**                 | Email or token that kicked off the run.                    |
   | **Total / Passed / Failed** | Quick health check of your suite.                          |
   | **Status**                  | `QUEUED`, `RUNNING`, or `COMPLETED` (green if 100 % pass). |

3. Click any **Report ID** to drill into per-test details: request/response dumps, assertion diff views, execution time, and re-run buttons for flaky steps.

## Re-running After Fixes

Iterate quickly:

1. Patch your API or tweak assertions from the "Test Suite".
2. Re-click **Run Tests**—Keploy re-uses the same Endpoint/Auth settings you last entered.
3. Compare the new report with the previous one right in the dashboard to verify the fix.

You now have a pipeline—from triggering the run to an all-green build—that safeguards your API contract in every environment.
