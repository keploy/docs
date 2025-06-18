---
id: samples-s3-keploy
title: Sample S3 File Manager App (Golang)
sidebar_label: Fiber + S3
description: The following sample app showcases how to use fiber framework with AWS S3 and the Keploy Platform.
tags:
  - go
  - quickstart
  - samples
  - examples
  - tutorial
  - s3
  - fiber-framework
keyword:
  - Fiber Framework
  - AWS S3 Mock
  - Golang
  - API Test generator
  - Auto Testcase generation
---

## Introduction

🪄 Dive into the world of cloud storage management and see how seamlessly Keploy integrates with Fiber and AWS S3! Buckle up, it's gonna be a fun ride! 🎢

import InstallationGuide from '../concepts/installation.md'

<InstallationGuide/>

## Get Started! 🎬

## Clone the sample S3 file manager app 🧪

```bash
git clone https://github.com/keploy/samples-go.git && cd samples-go/S3-Keploy
go mod download
```

## Prerequisites 🔧

Before we start, make sure you have:

1. [Go](https://go.dev/doc/install) installed
2. [AWS Access Key and Secret Key](https://docs.aws.amazon.com/sdk-for-go/v2/developer-guide/welcome.html)
3. AWS credentials configured

### Setting AWS Credentials 🔑

Go to your home directory and create `.aws` folder:

```bash
mkdir ~/.aws
```

Create a `credentials` file inside `.aws` folder:

```bash
touch ~/.aws/credentials
```

Open `credentials` in any text editor and add the following:

```
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

## Running the Application 🚀

We'll be running our sample application locally with AWS S3 integration. Ready? Let's get the party started! 🎉

If you are using WSL on Windows then use below to start wsl in the user's home directory:

```bash
wsl ~
```

### Recording Test Cases 📼

Ready, set, record! Here's how:

```bash
sudo -E env PATH="$PATH" keploy record -c 'go run .'
```

Keep an eye out for the `-c` flag! It's the command charm to run the app. Whether you're using `go run .` or `go run main.go`, it's your call.

If you're seeing logs that resemble the ones below, you're on the right track:

   <img src="/docs/img/code-snippets/keploy-record-fiber-s3-local.png" alt="Keploy Record Test case locally" width="100%" />

🔥 Challenge time! Generate some test cases. How? Just **make some API calls**. Postman, Hoppscotch or even curl - take your pick!

Let's manage some S3 buckets and files:

#### Create a new bucket

```bash
curl --request POST \
  --url http://localhost:3000/create \
  --header 'content-type: application/json' \
  --data '{
    "name": "my-test-bucket-keploy-2024"
  }'
```

Here's a peek of what you get:

```json
{
  "msg": "my-test-bucket-keploy-2024 Bucket created successfully!"
}
```

#### List all buckets

```bash
curl --request GET \
  --url http://localhost:3000/list
```

Response:

```json
{
  "buckets": ["my-test-bucket-keploy-2024", "another-bucket-name"]
}
```

🎉 Woohoo! With simple API calls, you've crafted test cases with mocks! Dive into the Keploy directory and feast your eyes on the newly minted `test-1.yml` and `mocks.yml`

```yaml
version: api.keploy.io/v1beta2
kind: Http
name: test-1
spec:
  metadata: {}
  req:
    method: POST
    proto_major: 1
    proto_minor: 1
    url: http://localhost:3000/create
    header:
      Accept: "*/*"
      Content-Length: "35"
      Content-Type: application/json
      Host: localhost:3000
      User-Agent: curl/7.77.0
    body: |-
      {
        "name": "my-test-bucket-keploy-2024"
      }
    body_type: ""
  resp:
    status_code: 200
    header:
      Content-Length: "55"
      Content-Type: application/json; charset=utf-8
      Date: Wed, 18 Jun 2025 10:15:47 GMT
    body: '{"msg":"my-test-bucket-keploy-2024 Bucket created successfully!"}'
    body_type: ""
    status_message: ""
    proto_major: 0
    proto_minor: 0
  objects: []
  assertions:
    noise:
      - header.Date
  created: 1718705747
```

This is how the generated **mock.yml** will look like:

```yaml
version: api.keploy.io/v1beta2
kind: Http
name: mocks
spec:
  metadata:
    operation: "CreateBucket"
  requests:
    - header:
        Authorization: "AWS4-HMAC-SHA256 Credential=..."
        Content-Type: "application/x-amz-json-1.0"
        X-Amz-Target: "DynamoDB_20120810.CreateBucket"
      body: '{"BucketName":"my-test-bucket-keploy-2024","Region":"ap-south-1"}'
      method: POST
      url: "https://s3.ap-south-1.amazonaws.com/"
  responses:
    - status_code: 200
      header:
        Content-Type: "application/x-amz-json-1.0"
        Date: "Wed, 18 Jun 2025 10:15:47 GMT"
      body: '{"BucketLocation":"ap-south-1"}'
  created: 1718705747
```

_Time to perform more API magic!_

#### Upload a file to bucket

```bash
curl --request POST \
  --url "http://localhost:3000/upload?bucket=my-test-bucket-keploy-2024" \
  --form 'filename=@apple.png'
```

#### Get all objects in a bucket

```bash
curl --request GET \
  --url "http://localhost:3000/getallobjects?bucket=my-test-bucket-keploy-2024"
```

#### Replace/Update a file

```bash
curl --request PUT \
  --url "http://localhost:3000/replacefile?bucket=my-test-bucket-keploy-2024" \
  --form 'filename=@mango.png'
```

#### Delete all objects in a bucket

```bash
curl --request DELETE \
  --url "http://localhost:3000/deleteallobjects?bucket=my-test-bucket-keploy-2024"
```

#### Delete a bucket

```bash
curl --request DELETE \
  --url "http://localhost:3000/delete?bucket=my-test-bucket-keploy-2024"
```

Spotted the new test and mock files in your project? High five! 🙌

<img src="/docs/img/code-snippets/fiber-s3-test-sample-local.png" alt="Sample Keploy Test case and Mock for Fiber S3" width="100%" style={{ borderRadius: '5px' }} />

### Running Tests 🏃‍♀️

Time to put things to the test 🧪

```bash
sudo -E env PATH=$PATH keploy test -c "go run ." --delay 20
```

> The `--delay` flag? Oh, that's just giving your app a little breather (in seconds) before the test cases come knocking. This is especially important for S3 operations as they might need some time to propagate across AWS infrastructure.

Your results should be looking all _snazzy_, like this:

<img src="/docs/img/code-snippets/s3-fiber-test-result-local.png" alt="Sample Keploy Test Result Fiber S3" width="100%" style={{ borderRadius: '5px' }}/>

Did you spot any AWS-specific fields showing differences? That's totally normal with cloud services! ☁️

Worry not, just add the ever-changing fields (like AWS **signatures**, **timestamps**, or **request IDs**) to the **noise parameter** to **dodge those assertions**.

> Pro tip: Add `header.Authorization`, `header.X-Amz-Date`, `header.X-Amz-Request-Id` to noise in `test-x.yaml` if needed.

<img src="/docs/img/code-snippets/noise-addition-s3-local.png" alt="Adding Noise to Test case Fiber S3" width="70%" style={{ borderRadius: '5px' }}/>

Run that `keploy test` command once more and watch as everything falls into place with all tests passing! 🌟

Final thoughts? Dive deeper! Try different API calls, tweak the S3 response in the `mocks.yml`, or fiddle with the request or response in `test-x.yml`. Run the tests again and see the magic unfold! ✨👩‍💻👨‍💻✨

## Available API Endpoints 🛣️

Here's a quick reference of all available endpoints:

- `GET /list` - Get all bucket names
- `GET /getallobjects?bucket=<BUCKET_NAME>` - Get all objects in a specific bucket
- `POST /create` - Create a new bucket
- `POST /upload?bucket=<BUCKET_NAME>` - Upload a file to a bucket
- `PUT /replacefile?bucket=<BUCKET_NAME>` - Replace/update an existing file
- `DELETE /delete?bucket=<BUCKET_NAME>` - Delete a bucket
- `DELETE /deleteallobjects?bucket=<BUCKET_NAME>` - Delete all objects in a bucket

## Troubleshooting 🔧

**AWS Credentials Issues:**

- Make sure your AWS credentials are properly configured in `~/.aws/credentials`
- Ensure your IAM user has appropriate S3 permissions
- Check that the region is set correctly (default: `ap-south-1`)

**Bucket Name Issues:**

- S3 bucket names must be globally unique
- Use lowercase letters, numbers, and hyphens only
- Avoid dots in bucket names

**File Upload Issues:**

- Make sure the file exists in your current directory
- Check file permissions
- Ensure the bucket exists before uploading

## Wrapping it up 🎉

Congrats on the journey so far! You've seen Keploy's power with Fiber and AWS S3, flexed your coding muscles, and had a bit of fun too! Now, go out there and keep exploring, innovating, and creating! Remember, with the right tools and a sprinkle of fun, anything's possible. 😊🚀

Happy coding! ✨👩‍💻👨‍💻✨

Hope this helps you out, if you still have any questions, reach out to us.

import GetSupport from '../concepts/support.md'

<GetSupport/>
