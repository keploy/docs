import React, {useState} from "react";
import CodeBlock from "@theme/CodeBlock";

export default function CollapsibleCode({
  code,
  language = "json",
  previewLines = 10,
}) {
  const [expanded, setExpanded] = useState(false);
  const codeLines = code.trim().split("\n");
  const visibleCode = expanded
    ? code.trim()
    : codeLines.slice(0, previewLines).join("\n") + "\n# ...";

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(code.trim());
      const btn = document.getElementById("copy-full-code");
      if (btn) {
        const originalText = btn.innerText;
        btn.innerText = "Copied!";
        setTimeout(() => (btn.innerText = originalText), 2000);
      }
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="margin-vert--md">
      {/* Pass the full code to CodeBlock so default copy button works */}
      <CodeBlock language={language}>{visibleCode}</CodeBlock>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "-8px", // Pulls buttons closer to code block
        }}
      >
        {codeLines.length > previewLines && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="button button--sm button--secondary"
          >
            {expanded ? "Show Less" : "Show More"}
          </button>
        )}
        <button
          id="copy-full-code"
          onClick={handleCopy}
          className="button button--sm button--primary"
        >
          Copy
        </button>
      </div>
    </div>
  );
}
