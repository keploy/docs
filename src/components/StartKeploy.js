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
        <TabItem value="go" label="Go">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "go run main.go"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "go run main.go" --delay 10`}
          </CodeBlock>
        </TabItem>

        <TabItem value="node" label="Node.js">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "npm start"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "npm start" --delay 10`}
          </CodeBlock>
        </TabItem>

        <TabItem value="java" label="Java">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "mvn spring-boot:run"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "mvn spring-boot:run" --delay 10`}
          </CodeBlock>
        </TabItem>

        <TabItem value="python" label="Python">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "python app.py"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "python app.py" --delay 10`}
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
