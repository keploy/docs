---
id: api-test-generator
title: Keploy API Test Generator
sidebar_label: API Test Generator
description: This section documents usecase of Keploy's API Test Generator
tags:
  - API testing
  - API mocks
  - generate test cases
  - test automation
keywords:
  - api testing
  - api mocks
  - automated testing
  - ai testing
  - keploy
  - Gemini
  - OpenAI
---

# Keploy API Testing Agent

Keploy's **API Testing Agent** allows you to auto-generate API test cases and mocks from real API usage data like `cURL` commands, OpenAPI schemas, or PRD/BRD documents — powered by LLMs.

> 🚀 Zero-code setup. Paste real requests. Get test cases, mocks, and flaky test detection in minutes.

## What It Does

- Auto-generates test cases and mocks from:
  - `cURL` commands
  - OpenAPI/Swagger schemas
  - API documentation, PRD/BRD snippets
- Detects **flaky test cases** through 5 validation iterations
- Allows full control to **edit, delete**, or **rename** test suites and assertions

# Getting Started

This guide walks you through generating, editing, running, and managing automated API tests using Keploy — demonstrated using the **PetClinic** application.

## Step 1: Login and Access the Testing Panel

1. Visit [https://app.keploy.io](https://app.keploy.io)
2. Log in with your credentials.
3. Navigate to the **API Testing** section in the sidebar.
4. Click on **Generate API Tests**  
   → This opens the test generation flow:  
   [https://app.keploy.io/api-testing/generate](https://app.keploy.io/api-testing/generate)

![API testing](/img/api-testing-generate.png)

## Step 2: Add API Information

We'll be using the **PetClinic** application for this demonstration.

### Step A: Run PetClinic Locally

```bash
git clone https://github.com/keploy/samples-java.git
cd samples-java
git checkout atg
cd spring-petclinic/spring-petclinic-rest
```

**Start PostgreSQL container**

```bash
docker run --name postgres-petclinic -e POSTGRES_PASSWORD=petclinic -e POSTGRES_DB=petclinic -p 5432:5432 -d postgres:17
```

**Build and run the app**

```bash
mvn clean -DskipTests install
java -jar target/spring-petclinic-rest-3.0.2.jar
```

### Expose the App Using ngrok

```bash
ngrok http http://localhost:9966
```

Copy the generated ngrok URL (e.g., https://95777-115-245-249-101.ngrok-free.app)

Your Live Base URL will be:

```bash
https://<your-ngrok-url>/petclinic/api
```

### Step B: Setting up the pre-requisites

**CURL Commands (Required):**
Paste at least 3–5 working curl requests for the endpoints.

```bash
# Test 1: GET all owners
curl -X GET "http://localhost:9966/petclinic/api/owners" \
  -H "Accept: application/json, text/plain, */*" \
  -H "Accept-Encoding: gzip, deflate" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Connection: keep-alive" \
  -H "Host: localhost:9966" \
  -H "Origin: http://localhost:4200" \
  -H "Referer: http://localhost:4200/"

# Test 2: OPTIONS request
curl -X OPTIONS "http://localhost:9966/petclinic/api/owners" \
  -H "Accept: */*" \
  -H "Access-Control-Request-Headers: content-type" \
  -H "Access-Control-Request-Method: POST" \
  -H "Content-Length: 0"

# Test 3: POST new owner
curl -X POST "http://localhost:9966/petclinic/api/owners" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/plain, */*" \
  -d '{"id":null,"firstName":"Abimanyu","lastName":"Singh","address":"Berlin","city":"Berlin","telephone":"8882110959"}'

# Test 4: GET all owners (again)
curl -X GET "http://localhost:9966/petclinic/api/owners" \
  -H "Accept: application/json, text/plain, */*"

# Test 5: Search owners by last name
curl -X GET "http://localhost:9966/petclinic/api/owners?lastName=Sin" \
  -H "Accept: application/json, text/plain, */*"

# Test 6: Search for non-existent owner
curl -X GET "http://localhost:9966/petclinic/api/owners?lastName=asdf" \
  -H "Accept: application/json, text/plain, */*"
```

**OpenAPI Schema (Optional but Recommended):**
Add your Swagger/OpenAPI spec in YAML or JSON format.

```bash
openapi: 3.0.1
info:
  title: Spring PetClinic
  description: Spring PetClinic Sample Application.
  license:
    name: Apache 2.0
    url: http://www.apache.org/licenses/LICENSE-2.0
  version: '1.0'

servers:
  - url: http://localhost:9966/petclinic/api

tags:
  - name: failing
    description: Endpoint which always returns an error.
  - name: owner
    description: Endpoints related to pet owners.
  - name: user
    description: Endpoints related to users.
  - name: pet
    description: Endpoints related to pets.
  - name: vet
    description: Endpoints related to vets.
  - name: visit
    description: Endpoints related to vet visits.
  - name: pettypes
    description: Endpoints related to pet types.
  - name: specialty
    description: Endpoints related to vet specialties.

paths:
  /oops:
    get:
      tags: [failing]
      operationId: failingRequest
      summary: Always fails
      description: Produces sample error response.
      responses:
        200:
          description: Never returned.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
          content:
            text/plain:
              schema: {type: string}
        304:
          description: Not modified.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
        400:
          description: Bad request.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

  /owners:
    post:
      tags: [owner]
      operationId: addOwner
      summary: Adds a pet owner
      description: Records the details of a new pet owner.
      requestBody:
        description: The pet owner
        content:
          application/json:
            schema: {$ref: '#/components/schemas/OwnerFields'}
        required: true
      responses:
        201:
          description: The pet owner was successfully added.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/Owner'}
        400:
          description: Bad request.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        500:
          description: Server error.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

    get:
      tags: [owner]
      operationId: listOwners
      summary: Lists pet owners
      description: Returns an array of pet owners.
      parameters:
        - name: lastName
          in: query
          description: Last name.
          required: false
          schema:
            type: string
            example: Davis
      responses:
        200:
          description: Owner details found and returned.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
          content:
            application/json:
              schema:
                type: array
                items: {$ref: '#/components/schemas/Owner'}
        304:
          description: Not modified.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
        500:
          description: Server error.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

  /owners/{ownerId}:
    get:
      tags: [owner]
      operationId: getOwner
      summary: Get a pet owner by ID
      description: Returns the pet owner or a 404 error.
      parameters:
        - name: ownerId
          in: path
          description: The ID of the pet owner.
          required: true
          schema:
            type: integer
            format: int32
            minimum: 0
            example: 1
      responses:
        200:
          description: Owner details found and returned.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
          content:
            application/json:
              schema: {$ref: '#/components/schemas/Owner'}
        304:
          description: Not modified.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
        400:
          description: Bad request.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        404:
          description: Owner not found.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        500:
          description: Server error.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

    put:
      tags: [owner]
      operationId: updateOwner
      summary: Update a pet owner's details
      description: Updates the pet owner record with the specified details.
      parameters:
        - name: ownerId
          in: path
          description: The ID of the pet owner.
          required: true
          schema:
            type: integer
            format: int32
            minimum: 0
            example: 1
      requestBody:
        description: The pet owner details to use for the update.
        content:
          application/json:
            schema: {$ref: '#/components/schemas/OwnerFields'}
        required: true
      responses:
        200:
          description: Update successful.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/Owner'}
        400:
          description: Bad request.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        404:
          description: Owner not found.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        500:
          description: Server error.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

    delete:
      tags: [owner]
      operationId: deleteOwner
      summary: Delete an owner by ID
      description: Returns the owner or a 404 error.
      parameters:
        - name: ownerId
          in: path
          description: The ID of the owner.
          required: true
          schema:
            type: integer
            format: int32
            minimum: 0
            example: 1
      responses:
        200:
          description: Owner details found and returned.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
          content:
            application/json:
              schema: {$ref: '#/components/schemas/Owner'}
        304:
          description: Not modified.
          headers:
            ETag:
              description: An ID for this version of the response.
              schema: {type: string}
        400:
          description: Bad request.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        404:
          description: Owner not found.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        500:
          description: Server error.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

  /owners/{ownerId}/pets:
    post:
      tags: [pet]
      operationId: addPetToOwner
      summary: Adds a pet to an owner
      description: Records the details of a new pet.
      parameters:
        - name: ownerId
          in: path
          description: The ID of the pet owner.
          required: true
          schema:
            type: integer
            format: int32
            minimum: 0
            example: 1
      requestBody:
        description: The details of the new pet.
        content:
          application/json:
            schema: {$ref: '#/components/schemas/PetFields'}
        required: true
      responses:
        201:
          description: The pet was successfully added.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/Pet'}
        400:
          description: Bad request.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        404:
          description: Pet not found.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}
        500:
          description: Server error.
          content:
            application/json:
              schema: {$ref: '#/components/schemas/RestError'}

  # [Additional endpoints would follow the same pattern...]

components:
  schemas:
    RestError:
      title: REST Error
      description: The schema for all error responses.
      type: object
      properties:
        status:
          title: Status
          description: The HTTP status code.
          type: integer
          format: int32
          example: 400
          readOnly: true
        error:
          title: Error
          description: The short error message.
          type: string
          example: Bad Request
          readOnly: true
        path:
          title: Path
          description: The path of the URL for this request.
          type: string
          format: uri
          example: '/api/owners'
          readOnly: true
        timestamp:
          title: Timestamp
          description: The time the error occurred.
          type: string
          format: date-time
          example: '2019-08-21T21:41:46.158+0000'
          readOnly: true
        message:
          title: Message
          description: The long error message.
          type: string
          example: 'Request failed schema validation'
          readOnly: true
        schemaValidationErrors:
          title: Schema validation errors
          description: Validation errors against the OpenAPI schema.
          type: array
          items: {$ref: '#/components/schemas/ValidationMessage'}
        trace:
          title: Trace
          description: The stacktrace for this error.
          type: string
          example: 'com.atlassian.oai.validator.springmvc.InvalidRequestException: ...'
          readOnly: true
      required:
        - status
        - error
        - path
        - timestamp
        - message
        - schemaValidationErrors

    ValidationMessage:
      title: Validation message
      description: Messages describing a validation error.
      type: object
      properties:
        message:
          title: Message
          description: The validation message.
          type: string
          example: "[Path '/lastName'] Instance type (null) does not match any allowed primitive type (allowed: [\"string\"])"
          readOnly: true
      required: [message]
      additionalProperties: true

    # [Additional schemas would follow...]
```

**Additional Resources (Optional):**

- API Documentation
- Code Snippets
- PRD/BRD

## Step 3: Click 'Generate Test'

Keploy will auto-generate a test suite using the inputs provided.
![API testing](/img/api-generate-it.png)

- Click the 'Generate Test' button. Keploy will:
- Analyze your API endpoints
- Create positive and negative test cases
- Generate mock data
- Validate test stability

Example Test Suite: https://957f-115-245-249-101.ngrok-free.app/petclinic/api

Example Test Cases:

- ✅ Vet_Update_ChangeSpecialties_Successful
- ✅ Pet_UpdateOwnersPet_BirthDateOnly
- ✅ Vet_List_All
- ❌ Visit_AddToPet_DescriptionTooLong_400
- ❌ Pet_UpdateOwnersPet_InvalidData_400

![API testing](/img/test-suites.png)

Each test will include:

- Endpoint
- Request Body
- Headers
- Assertions

## Step 4: Sample Test Case Structure

Test Name: Create PetType for Visit Test LD
Request :

```bash
POST /pettypes
Content-Type: application/json
{
  "name": "VisitPetTypeLD"
}
Assertions
Type: status_code
Expected: 200
```

## Step 5: Edit Test Case and Assertions

You can edit test request details and assertions via the UI.

```bash
Name: Create PetType for VisitUpdateDescTooLong
 Method: POST
 URL Path: /petclinic/api/pettypes
 Headers: Content-Type: application/json
 Request Body:
{
  "name": "CatForVisitUpdateDescTooLong"
}
```

You can also switch to the Assertions tab and modify or add:

```bash
Type: status_code
Expected: 200
```

![Edit test](/img/test-edit.png)

## Step 6: Run Tests and Generate Reports

Re-enter the Base URL.

```bash
 https://95777-115-245-249-101.ngrok-free.app
```

Click Run Tests to trigger test execution.

View test results and download reports for QA or CI pipelines.

## Step 7: Manage Test Suites

From the dashboard, you can:

**Delete a test suite entirely.**
![Edit test](/img/delete-suite.png)

**Delete individual test cases within a suite.**
![Edit test](/img/delete-individual.png)

## Tips for Accurate Results

- Always paste at least 3–5 valid cURL commands
- Ensure your Live URL is active and responsive
- Use OpenAPI schemas for better request/response modeling
- Include real production-like inputs wherever possible

## Frequently Asked Questions(FAQs)

**1. What types of API tests can Keploy generate?**
Keploy automatically creates:

- **Functional Tests**: CRUD operations, endpoint validation
- **Edge Case Tests**: Invalid payloads, error responses
- **Performance Tests**: Response time benchmarks
- **Security Tests**: Input sanitization, auth validation
- **Dependency Tests**: Mocked external service calls

**2. How does Keploy handle authentication in API tests?**
Keploy supports:

- **Auth Types**: JWT, OAuth2, API Keys, Basic Auth
- **Auto-Renewal**: Token refresh flows
- **Test Isolation**: Separate auth contexts per test
- **Security**: Never stores raw credentials (uses env variables)

**3. What protocols and formats does Keploy support?**
| Protocol | Formats | Features |
|----------|---------|----------|
| HTTP/HTTPS | JSON, XML | Full support |
| gRPC | Protocol Buffers | Code generation |
| WebSockets | JSON, Binary | Session testing |
| GraphQL | Query/Mutation | Schema validation |

**4. How does test generation work for stateful APIs?**
Keploy handles stateful workflows by:

1. Recording session cookies/headers
2. Detecting data dependencies between calls
3. Generating cleanup teardown sequences
4. Creating isolated test contexts

**Example Order Flow:**

```text
POST /cart → GET /cart → POST /checkout → GET /order/{id}
```
