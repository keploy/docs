import React from "react";
import Link from "@docusaurus/Link";
import {useColorMode} from "@docusaurus/theme-common";

export default function InstallReminder() {
  const {colorMode} = useColorMode();
  const isDark = colorMode === "dark";

  const containerStyle = {
    padding: "1rem",
    border: isDark ? "1px solid #333" : "1px solid #eee",
    borderRadius: "10px",
    background: isDark ? "#23272f" : "#fff8f5",
    margin: "2rem 0",
    color: isDark ? "#fff" : "#222",
    boxShadow: isDark
      ? "0 2px 10px rgba(0,0,0,0.6)"
      : "0 2px 6px rgba(0, 0, 0, 0.08)",
  };

  return (
    <div
      style={containerStyle}
    >
      <h3 style={{marginTop: 0, color: isDark ? "#fff" : "#222"}}>Don’t have Keploy installed yet?</h3>
      <p style={{color: isDark ? "#ccc" : undefined}}>
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
