import React from "react";
import Link from "@docusaurus/Link";

export default function InstallReminder() {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid var(--ifm-color-emphasis-300)",
        borderRadius: "10px",
        background: "var(--ifm-card-background-color)",
        margin: "2rem 0",
      }}
    >
      <h3 style={{ color: "var(--ifm-color)", margin: "0 0 0.5rem 0" }}>
        Don't have Keploy installed yet?
      </h3>
      <p style={{ color: "var(--ifm-color-emphasis-600)", margin: "0 0 1rem 0" }}>
        Before running this sample, make sure Keploy is installed on your
        system.
      </p>
      <Link
        to="/docs/server/installation/"
        style={{
          display: "inline-block",
          marginTop: "0.5rem",
          padding: "0.6rem 1rem",
          background: "#e67e22",
          color: "#fff",
          borderRadius: "6px",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        👉 Go to Installation Guide
      </Link>
    </div>
  );
}
