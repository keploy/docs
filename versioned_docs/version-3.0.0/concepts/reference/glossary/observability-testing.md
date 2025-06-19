---
id: observability-testing
title: Observability Testing with Keploy
sidebar_label: Observability Testing
description: This glossary has an explanation of all the terminologies that beginners find difficult to understand at first glance.
tags:
  - explanation
  - glossary
  - observability
  - testing
  - monitoring
keywords:
  - API
  - observability
  - testing
  - logs
  - metrics
  - traces
---

## What is Observability Testing?

<figure>
  <img src="https://grafana.com/media/blog/otel-lgtm-docker-image/docker-image_components.png?w=900" />
  <figcaption class="figcaption">The OTEL-LGTM Stack. Image Credits: <a href="https://grafana.com/blog/2024/03/13/an-opentelemetry-backend-in-a-docker-image-introducing-grafana/otel-lgtm/">Grafana</a></figcaption>
</figure>


Observability in testing ensures that software systems produce sufficient data (logs, metrics, and traces - the holy trinity of telemetry) to understand their internal state and diagnose issues during or after tests. It’s not just about **whether** a test passes, but also about **why** a system behaves a certain way under test conditions.

Popular tools and frameworks used for tracking these metrics are [Grafana](https://grafana.com) and [Prometheus](https://prometheus.io/). To learn more about getting started with these tools, check out their elaborate [guide](https://grafana.com/docs/grafana/latest/getting-started/get-started-grafana-prometheus/).

## What Does Observability Add To Testing?

- **Improved debugging** — easier to pinpoint failures and their causes.
- **Faster incident response** — helps teams react to test failures or outages.
- **Enhanced confidence in system behavior** — tests validate not just outcomes, but how systems behave under load or failure.

## Example Observability Checks During Testing

- Validate that API request traces are emitted for each call.
- Ensure error logs are generated when failures occur.
- Confirm metrics (e.g., response times, throughput) meet expected thresholds during load tests.

## Core Components of Observability

| Signal    | Description | Example |
|-----------|-------------|---------|
| **Logs**  | Human-readable event records | Error logs, access logs |
| **Metrics** | Numeric time-series data | CPU usage, request latency |
| **Traces** | Distributed request flows | Trace of a request through multiple microservices |


## Example: Observability in a Simple Python App (With Docker, Prometheus, and Grafana)

Let’s walk through a **Hello World Flask app** with Prometheus metrics and visual monitoring via Grafana. In order to follow along smoothly, make sure you have [Docker](https://www.docker.com/) installed on your system.

### Step 1: `server.py` – A simple Flask app with metrics
```python
from flask import Flask
from flask_cors import CORS
from prometheus_client import Counter, generate_latest

app = Flask(__name__)
CORS(app)

REQUEST_COUNT = Counter("hello_world_requests", "Number of Hello World requests")

@app.route("/")
def hello_world():
    REQUEST_COUNT.inc()
    return "Hello, World!"

@app.route("/metrics")
def metrics():
    return generate_latest(), 200, {'Content-Type': 'text/plain'}


if __name__ == "__main__":
    app.run("0.0.0.0", port="5000", debug=True)
```

### Step 2: `dockerfile`, to build and launch your python server
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "server.py"]
```

### Step 3: `compose.yaml`, to coordinate all your containers together
```yaml
services:
  flask-server:
    build: .
    container_name: flask-server
    ports:
      - "5000:5000"

  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    container_name: grafana
    ports:
      - "3001:3000"
    volumes:
      - ./grafana:/var/lib/grafana # optional, so your dashboard stays persistent
```

### Step 4: `prometheus.yml`, some basic prometheus config

```yml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: 'flask-app'
    static_configs:
      - targets: ['flask-server:5000'] # notice it's not localhost:5000 since that won't be identified by the docker network
```

### Step 5: `requirements.txt`, for managing your python dependencies
```
flask
flask-cors
prometheus-client
```

After you've followed through, your directory structure should look something like this:
```
.
├── compose.yaml
├── dockerfile
├── prometheus.yml
├── requirements.txt
└── server.py
```

### Step 6: How it works

- Run:
  ```sh
  docker-compose up --build -d
  ```
- Visit:

    `http://localhost:5000/` – Simple flask app

    `http://localhost:5000/metrics` – Prometheus-compatible metrics

    `http://localhost:9090/` – Prometheus UI

    `http://localhost:3001/` – Grafana UI (Default username/password is **admin/admin**)

- Within the Prometheus UI, you can enter `hello_world_requests_total` (We got this from the parameter we defined in our python app using `REQUEST_COUNT`) as a query and see Prometheus gracefully scrape your app for key metrics.

  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/prometheus.png" />

- Next, you can visit your Grafana UI at `localhost:3001`, use the default login credentials - `admin/admin` to login. 

  Once there, add a datasource by going over to `Connections > Data sources > Add data source`

  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/grafana-ds.png" />

  Add `Prometheus` as your data source, and in the **connection url**, add `http://prometheus:9090` (notice you cannot use `http://localhost:9090`, since the dockert network would not recognise that. For more info on this, check out the docker docs on networking)

  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/grafana-con.png" />

  Scroll down, and click on `Save & test`, and if you've done everything right so far, you should see everything green.

  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/grafana-test.png" />

  Next, you can create a dashboard, by heading over to `Dashboards > New > Import`

  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/grafana-upload.png" />

  You may use our sample config from [here](https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/budget-pastebin/grafana-dashboard.json).

  Give your dashboard a pretty name, and select `Prometheus` as your data source.
  
  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/grafana-import.png" />

  Once done, hit `Import`, and check out your dashboard at `Dashboards > <whatever dashboard you just created>` 🎉

  <img src="https://raw.githubusercontent.com/BilledPlatypus/media/refs/heads/main/keploy-docs/grafana-endres.png" />


### Summary

With the above setup, you now have a clean and simple way of monitoring various aspects of your app in real time, and getting an exact trace of when and where problems do occur.

Observability helps go beyond “it works” to “it works, and here’s proof.” It enables deeper understanding and confidence in your system by exposing its internal signals. Whether you're writing unit tests or running load tests, observability can help you catch what traditional testing might miss.

However, it's not always this simple in most real world scenarios, and you do eventually run into issues, which you can be prepared for beforehand, thanks to Keploy's robust testing suite!


## Challenges in Observability Testing:

- **Signal overload (too much data)**  
  - Systems emit large volumes of logs, metrics, and traces, making it difficult to identify meaningful signals amidst noise.

- **Lack of automated assertions**  
  - Observability data is collected but not actively validated in test cases, causing issues to go undetected unless manually reviewed.

- **Lack of production fidelity in test environments**  
  - CI or staging environments may not emit the same telemetry as production, leading to false positives or missed issues.

- **Non-determinism in metrics**  
  - Performance data can fluctuate across test runs, making it difficult to assert on expected values reliably.

- **Difficulty correlating logs, metrics, and traces**  
  - Without unified tooling, it's hard to trace a single issue across different observability signals.


## Overcoming Challenges with Keploy

Keploy is an innovative testing tool designed to address many of the challenges associated with observability testing. Here's how it helps:
<img src="https://keploy.io/docs/gif/record-replay.gif?raw=true"/>
<br/>

- **Automated Test Case Generation**: Keploy can generate test cases by recording your application's network calls. This automation significantly reduces the time and effort required to create comprehensive test suites.
- **Dependency Mocking**: Keploy automatically generates dependency mocks based on recorded network interactions. This feature allows for faster and more efficient testing compared to traditional unit tests.
- **Realistic Testing Environment**: With its built-in proxy setup, Keploy records system calls between services, creating a more accurate representation of the production environment in your tests.
- **Efficient Integration Testing**: By capturing and replaying inter-service communications, Keploy enables more effective integration testing without the need to set up complex environments.
- **Reduced Test Maintenance**: As Keploy generates tests based on actual system behavior, it helps keep tests up-to-date with changes in the observability, reducing the maintenance burden.
- **Performance Testing**: The recorded interactions can be used to simulate realistic load scenarios, aiding in performance testing of observability.

By leveraging Keploy's capabilities, development teams can overcome many of the traditional challenges associated with observability testing, leading to more robust and reliable distributed systems.