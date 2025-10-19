---
id: api-testing-webhook
title: Webhook Integration
sidebar_label: Webhook Integration
description: Integrate custom logic and external validations into your API testing lifecycle with Keploy's webhooks.
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

## Keploy ATG Webhook Integration Guide

### 1. Overview

This powerful feature allows you to integrate your own custom logic directly into the test generation and execution lifecycle.

You can use webhooks to:

- **Enforce Custom Policies:** Deny certain types of requests from being executed (e.g., prevent `DELETE` requests in a staging environment).
- **Perform External Validation:** Force a test step to fail if the response doesn't meet external criteria (e.g., check for a specific audit header).
- **Trigger External Workflows:** Log test results to a third-party system, send notifications to Slack, or create tickets in Jira.

This document provides all the information you need to build a server that can receive and respond to Keploy webhooks.

### 2. Quick Start: A Demonstration Server

To help you get started, we've provided a sample webhook server below. **Please note that this is just a demonstration and should not be considered a required baseline.** You are free to implement your webhook server in any language or framework you choose (e.g., Python with Flask, Node.js with Express, Java with Spring, etc.).

This particular example is written in Go for its simplicity and because it can be run as a single, self-contained file without external dependencies. It demonstrates how to:

- Correctly parse the incoming `WebhookReview` JSON payload.
- Differentiate between the `PreExecute` and `PostExecute` phases.
- Return a valid `WebhookResponse` object.

This specific server also includes a random pass/fail logic, which is useful for testing how your Keploy instance handles unpredictable webhook behavior. You can use this code as a reference for building your own custom logic.

```go
package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"time"
)

const failureProbability = 0.3

// We will use a seeded random number generator for true randomness.
var rng *rand.Rand

type APIRequest struct {
	Method  string            `json:"method"`
	URL     string            `json:"url"`
	Headers map[string]string `json:"headers"`
	Body    string            `json:"body"`
}

type APIResponse struct {
	Status  int               `json:"status"`
	Headers map[string]string `json:"headers"`
	Body    string            `json:"body"`
}

type TestSuiteInfo struct {
	Name string `json:"name"`
}

type APIStepInfo struct {
	Name string `json:"name"`
}

type WebhookRequest struct {
	Phase            string        `json:"phase"`
	TestSuiteInfo    TestSuiteInfo `json:"testSuiteInfo"`
	CurrentStep      APIStepInfo   `json:"currentStep"`
	RequestToSend    *APIRequest   `json:"requestToSend,omitempty"`
	ResponseReceived *APIResponse  `json:"responseReceived,omitempty"`
	StepPassed       *bool         `json:"stepPassed,omitempty"`
}

type WebhookReview struct {
	Request  *WebhookRequest  `json:"request"`
	Response *WebhookResponse `json:"response,omitempty"`
}

type WebhookResponse struct {
	Pass   bool   `json:"pass"`
	Reason string `json:"reason,omitempty"`
}

func webhookHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is accepted", http.StatusMethodNotAllowed)
		return
	}

	var review WebhookReview
	if err := json.NewDecoder(r.Body).Decode(&review); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	if review.Request == nil {
		http.Error(w, "Invalid payload format: missing 'request' object", http.StatusBadRequest)
		return
	}

	log.Println("\n\n--- ✅ Webhook Received ---")
	log.Printf("Phase: %s", review.Request.Phase)

	switch review.Request.Phase {
	case "PreExecute":
		log.Printf("Suite: %s, Step: %s", review.Request.TestSuiteInfo.Name, review.Request.CurrentStep.Name)

		webhookResp := WebhookReview{}

		if rng.Float64() < failureProbability {
			log.Println("🎲 RANDOMLY FAILING pre-execution step.")
			webhookResp.Response = &WebhookResponse{
				Pass:   false,
				Reason: "Step was randomly selected to fail by the pre-execution hook.",
			}
			sendJSONResponse(w, http.StatusOK, webhookResp)
			return
		}

		log.Println("🎲 Random check passed. Approving request.")

		webhookResp.Response = &WebhookResponse{
			Pass: true,
		}

		sendJSONResponse(w, http.StatusOK, webhookResp)
		return

	case "PostExecute":
		log.Printf("Suite: %s, Step: %s", review.Request.TestSuiteInfo.Name, review.Request.CurrentStep.Name)
		if review.Request.StepPassed != nil {
			log.Printf("Initial Step Result: %t", *review.Request.StepPassed)
		}

		webhookResp := WebhookReview{}

		if review.Request.StepPassed != nil && *review.Request.StepPassed {
			if rng.Float64() < failureProbability {
				log.Println("🎲 RANDOMLY OVERRIDING a passing step to FAIL.")
				webhookResp.Response = &WebhookResponse{
					Pass:   false,
					Reason: "A passing step was randomly selected to be failed by the post-execution hook.",
				}
				sendJSONResponse(w, http.StatusOK, webhookResp)
				return
			}
			log.Println("🎲 Random check passed. Acknowledging successful step.")
		} else {
			log.Println("Acknowledging an already failed step. No random check needed.")
		}

		webhookResp.Response = &WebhookResponse{
			Pass: true,
		}

		sendJSONResponse(w, http.StatusOK, webhookResp)
		return

	default:
		log.Printf("Received unknown phase: %s", review.Request.Phase)
		http.Error(w, "Unknown phase", http.StatusBadRequest)
	}
}

func sendJSONResponse(w http.ResponseWriter, statusCode int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		log.Printf("Error encoding JSON response: %v", err)
	}
}

func main() {
	rng = rand.New(rand.NewSource(time.Now().UnixNano()))

	http.HandleFunc("/webhook", webhookHandler)

	port := "3001"
	log.Printf("🚀 Go Random Webhook Server listening at http://localhost:%s", port)
	log.Printf("Endpoint is http://localhost:%s/webhook", port)
	log.Printf("Failure probability is set to %.0f%%", failureProbability*100)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}
```

#### To Run the Go Server:

1.  Save the code above as `main.go` in a new directory.
2.  Open your terminal, navigate to that directory, and run the command:
    ```bash
    go run main.go
    ```
3.  Your server is now listening at `http://localhost:3001/webhook`. Use this URL in the Keploy UI settings.

### 3. Core Concepts

#### The Two Phases: `PreExecute` and `PostExecute`

Keploy sends a webhook at two distinct points for every single test step:

1.  **`PreExecute`:** Sent **before** the API request is made.

    - **Purpose:** To act as a gatekeeper. Your server can inspect the `requestToSend` and decide whether to allow the step to proceed.
    - **Your Response:** Your server must return `{"pass": true}` to allow execution or `{"pass": false}` to deny it, effectively failing the step before it even runs.

2.  **`PostExecute`:** Sent **after** the API request has been made and Keploy has run its own internal assertions.
    - **Purpose:** To act as a final validation layer. Your server can inspect the request, the response, and Keploy's initial pass/fail result.
    - **Your Response:** Your server can return `{"pass": false}` to override a passing step and force it to fail.

#### The Golden Rule: Fail-Only Override

This is the most important rule: **A webhook can make a passing step fail, but it can never make a failing step pass.**

If Keploy's internal assertions determine a step has failed (e.g., a 500 status code was received when a 200 was expected), the step is permanently failed. Your webhook cannot reverse this decision. This protects the integrity of your test results.

### 4. API Reference: Data Structures

Your webhook server will receive an HTTP POST request with a `Content-Type: application/json` header. The body of the request will be a single JSON object, the `WebhookReview`.

Your server must respond with a `200 OK` status and a JSON body matching the `WebhookResponse` structure described below.

#### 4.1 Top-Level Object: `WebhookReview`

This is the outermost object of the JSON payload sent to your server.

| Field         | Type             | Description                                                                                     |
| :------------ | :--------------- | :---------------------------------------------------------------------------------------------- |
| **`request`** | `WebhookRequest` | **Required.** The main payload containing all event context. See `WebhookRequest` object below. |

#### 4.2 The `WebhookRequest` Payload

This object contains all the context for the current event. Some fields are only present in specific phases.

| Field                   | Type                          | Presence         | Description                                                                                                |
| :---------------------- | :---------------------------- | :--------------- | :--------------------------------------------------------------------------------------------------------- |
| **`phase`**             | `string`                      | Always           | "PreExecute" or "PostExecute".                                                                             |
| **`testSuiteInfo`**     | `TestSuite`                   | Always           | The full definition of the test suite currently being executed. See `TestSuite` object below.              |
| **`currentStep`**       | `APIStep`                     | Always           | The definition of the API step this event pertains to. See `APIStep` object below.                         |
| **`stepIndex`**         | `int`                         | Always           | The zero-based index of the current step within the test suite.                                            |
| **`executedSteps`**     | `array` of `SuiteResult`      | Always           | Results of previous steps in this suite, providing stateful context. Can be an empty array.                |
| **`requestToSend`**     | `APIRequest`                  | Always           | The fully rendered request that Keploy intends to send or has already sent. See `APIRequest` object below. |
| **`responseReceived`**  | `APIResponse`                 | PostExecute only | The actual response received from your application. See `APIResponse` object below.                        |
| **`stepPassed`**        | `boolean`                     | PostExecute only | Keploy's initial verdict. `true` if all internal assertions passed, `false` otherwise.                     |
| **`assertionFailures`** | `array` of `AssertionFailure` | PostExecute only | A list of failures if `stepPassed` is `false`. Will be absent or empty if the step passed.                 |

#### 4.3 The `WebhookResponse` Body (Your Server's Reply)

This is the JSON object your server **must** return in the response body.

| Field        | Type      | Description                                                                                                                                       |
| :----------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`pass`**   | `boolean` | **Required.** If `false`, the step is failed. In `PreExecute`, this stops the step. In `PostExecute`, this overrides a `true` result from Keploy. |
| **`reason`** | `string`  | **Optional.** A message explaining why your webhook returned `pass: false`. This reason will be included in the test report.                      |

#### 4.4 Detailed Object Definitions

These are the detailed structures for the complex objects referenced above.

#### `TestSuite` Object

| Field         | Type                 | Description                                |
| :------------ | :------------------- | :----------------------------------------- |
| `id`          | `string`             | The unique identifier of the test suite.   |
| `name`        | `string`             | The name of the test suite.                |
| `description` | `string`             | A description of the test suite's purpose. |
| `steps`       | `array` of `APIStep` | The ordered list of steps in this suite.   |

#### `APIStep` Object

| Field           | Type                   | Description                                                              |
| :-------------- | :--------------------- | :----------------------------------------------------------------------- |
| `id`            | `string`               | The unique identifier of this test step.                                 |
| `name`          | `string`               | The name of the step.                                                    |
| `description`   | `string`               | A description of the step's purpose.                                     |
| `method`        | `string`               | The HTTP method (e.g., "GET", "POST").                                   |
| `url`           | `string`               | The request URL, which may contain variable placeholders like `{{var}}`. |
| `body`          | `string`               | The request body.                                                        |
| `headers`       | `object`               | A key-value map of request headers. Values can contain placeholders.     |
| `extract`       | `object`               | A key-value map defining variables to extract from the response.         |
| `assert`        | `array` of `Assertion` | The list of assertions to be checked against the response.               |
| `resp`          | `APIResponse`          | The expected or recorded response for this step.                         |
| `deleteData`    | `DeleteData`           | Internal metadata related to deletion status.                            |
| `normalizeData` | `NormalizeTestRunData` | Internal metadata related to normalization status.                       |

#### `APIRequest` Object

| Field     | Type     | Description                                      |
| :-------- | :------- | :----------------------------------------------- |
| `method`  | `string` | The HTTP method (e.g., "GET", "POST").           |
| `url`     | `string` | The final, rendered URL sent to the server.      |
| `headers` | `object` | A key-value map of request headers.              |
| `body`    | `string` | The final, rendered request body.                |
| `reqId`   | `string` | A unique ID for this specific request execution. |

#### `APIResponse` Object

| Field     | Type     | Description                                        |
| :-------- | :------- | :------------------------------------------------- |
| `status`  | `int`    | The HTTP status code (e.g., 200, 404).             |
| `headers` | `object` | A key-value map of response headers.               |
| `body`    | `string` | The response body as a string.                     |
| `reqId`   | `string` | The ID of the request that produced this response. |

#### `Assertion` Object

| Field             | Type     | Description                                                      |
| :---------------- | :------- | :--------------------------------------------------------------- |
| `type`            | `string` | The type of assertion (e.g., "STATUS_CODE", "JSON_CONTAINS").    |
| `key`             | `string` | The key to check (e.g., a header name or a JSON path).           |
| `expected`        | `any`    | The expected value (can be a number, string, or JSON object).    |
| `expected_string` | `string` | A pre-stringified version of the expected value for convenience. |

#### `AssertionFailure` Object

| Field            | Type     | Description                                                           |
| :--------------- | :------- | :-------------------------------------------------------------------- |
| `stepIndex`      | `int`    | The index of the `APIStep` that failed.                               |
| `assertionIndex` | `int`    | The index of the specific `Assertion` that failed.                    |
| `type`           | `string` | The type of the failed assertion.                                     |
| `key`            | `string` | The key of the failed assertion.                                      |
| `expected`       | `string` | The expected value.                                                   |
| `actual`         | `string` | The actual value received from the response.                          |
| `error`          | `string` | A general error message if the failure was not an assertion mismatch. |

#### `SuiteResult` Object

| Field               | Type                          | Description                                   |
| :------------------ | :---------------------------- | :-------------------------------------------- |
| `stepName`          | `string`                      | The name of the step that was executed.       |
| `pass`              | `boolean`                     | `true` if the step passed, `false` otherwise. |
| `requestSent`       | `APIRequest`                  | The request that was sent for this step.      |
| `responseReceived`  | `APIResponse`                 | The response that was received for this step. |
| `assertionFailures` | `array` of `AssertionFailure` | A list of failures if the step did not pass.  |

### 5. Use Cases & Examples

#### Example 1: Denying a Request in PreExecute

To prevent any request to a `/admin` endpoint from running:

```go
// Inside your webhookHandler's "PreExecute" case
if strings.Contains(review.Request.RequestToSend.URL, "/admin") {
    log.Println("🔥 DENYING request to admin endpoint.")
    response := WebhookResponse{
        Pass:   false,
        Reason: "Policy: Cannot access /admin endpoints during this test.",
    }
    sendJSONResponse(w, http.StatusOK, response)
    return
}
```

#### Example 2: Forcing a Failure in PostExecute

To fail any step that passed but returned a response without a `X-Trace-ID` header:

```go
// Inside your webhookHandler's "PostExecute" case
if *review.Request.StepPassed { // Only check steps that initially passed
    if _, ok := review.Request.ResponseReceived.Headers["X-Trace-Id"]; !ok {
        log.Println("🔥 FORCING FAILURE due to missing X-Trace-Id header.")
        response := WebhookResponse{
            Pass:   false,
            Reason: "Step failed custom validation: Missing X-Trace-Id header.",
        }
        sendJSONResponse(w, http.StatusOK, response)
        return
    }
}
```

### 6. Best Practices

- **Be Stateless:** Design your webhook server to be stateless. Each request from Keploy contains all the context you need to make a decision.
- **Respond Quickly:** Keploy will wait for your webhook's response. A slow webhook will slow down your entire test run. Aim for response times under 500ms.
- **Log Everything:** Your webhook server should log every incoming request and the response it sends. This is invaluable for debugging.
- **Handle Errors Gracefully:** If your server is down or returns a non-200 status code, Keploy will treat it as a transport failure and **fail the test step**. Ensure your server is robust.
