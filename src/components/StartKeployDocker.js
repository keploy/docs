import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";

export default function StartKeploy() {
  return (
    <div
      style={{
        border: "1px solid var(--ifm-color-emphasis-200)",
        borderRadius: "12px",
        padding: "0.8rem",
        background: "var(--ifm-background-color)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h3>🎬 Start Capturing Test Cases</h3>

      <Tabs>
        {/* Docker Tab */}
        <TabItem value="docker" label="Docker">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "docker run -p <appPort>:<hostPort> --name <containerName> --network keploy-network --rm <applicationImage>" --containerName "<containerName>" --delay 10`}
          </CodeBlock>

          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "docker run -p <appPort>:<hostPort> --name <containerName> --network keploy-network --rm <applicationImage>" --containerName "<containerName>" --delay 20`}
          </CodeBlock>
        </TabItem>

        {/* Docker Compose Tab */}
        <TabItem value="docker-compose" label="Docker Compose">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "docker compose up" --container-name <containerName> --build-delay 100`}
          </CodeBlock>

          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "docker compose up" --container-name <containerName> --build-delay 50 --delay 20`}
          </CodeBlock>
        </TabItem>
      </Tabs>

      <h3>📖 What’s Next?</h3>
      <p>
        Now, take it further by following the{" "}
        <Link to="/docs/quickstart/quickstart-filter/">
          <strong>Quickstart Guide</strong>
        </Link>{" "}
        and see Keploy in action with your app.
      </p>
    </div>
  );
}