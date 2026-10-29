import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";

// The command that starts each sample app. On macOS, keploy loads into the app
// through the dynamic linker, and macOS strips that from anything a launcher
// (npm, mvn, a shell script, a pyenv shim) re-spawns and from Apple's own
// /usr/bin/python3 and /usr/bin/java — so there the commands start the app's
// real executable, built first. go run works but records its toolchain too.
const COMMANDS = {
  default: {
    go: "go run main.go",
    node: "npm start",
    java: "mvn spring-boot:run",
    python: "python app.py",
  },
  macos: {
    go: "./app",
    node: "node server.js",
    java: "${JAVA_HOME:-$(/usr/libexec/java_home)}/bin/java -jar target/<your-app>.jar",
    python: ".venv/bin/python app.py",
  },
};

export default function StartKeploy({platform}) {
  const cmd = COMMANDS[platform] || COMMANDS.default;
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
            {`keploy record -c "${cmd.go}"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "${cmd.go}" --delay 10`}
          </CodeBlock>
        </TabItem>

        <TabItem value="node" label="Node.js">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "${cmd.node}"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "${cmd.node}" --delay 10`}
          </CodeBlock>
        </TabItem>

        <TabItem value="java" label="Java">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "${cmd.java}"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "${cmd.java}" --delay 10`}
          </CodeBlock>
        </TabItem>

        <TabItem value="python" label="Python">
          <br />
          <p>
            <strong>Record the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy record -c "${cmd.python}"`}
          </CodeBlock>
          <p>
            <strong>Run the test cases</strong>
          </p>
          <CodeBlock language="bash">
            {`keploy test -c "${cmd.python}" --delay 10`}
          </CodeBlock>
        </TabItem>
      </Tabs>

      {platform === "macos" && (
        <p>
          On macOS, build first (<code>go build -o app .</code>,{" "}
          <code>mvn package</code>) and start the app itself, not through a
          launcher such as <code>npm start</code>, <code>mvn</code> or a wrapper
          script. Use your JDK&apos;s own <code>java</code> and a virtualenv
          built on a Homebrew, uv or pyenv Python, not Apple&apos;s{" "}
          <code>/usr/bin/java</code> or <code>/usr/bin/python3</code>. macOS
          removes Keploy from those processes, and Keploy warns you when that
          happens.
        </p>
      )}

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
