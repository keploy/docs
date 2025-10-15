import React from "react";
import Link from "@docusaurus/Link";

export default function EnterpriseInstallReminder() {
  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #eee",
        borderRadius: "10px",
        background: "#fff8f5",
        margin: "2rem 0",
      }}
    >
      <h3>Don’t have Keploy installed yet?</h3>
      <p>
        Before running this sample, make sure Keploy is installed on your
        system.
      </p>
      <Link
        to="/docs/keploy-cloud/cloud-installation/"
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
