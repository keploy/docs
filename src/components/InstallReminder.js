import React from "react";
import Link from "@docusaurus/Link";

export default function InstallReminder() {
  return (
    <div className="install-reminder-container">
      <h3>Don’t have Keploy installed yet?</h3>
      <p>
        Before running this sample, make sure Keploy is installed on your
        system.
      </p>
      <Link
        to="/docs/server/installation/"
        className="install-reminder-button"
      >
        👉 Go to Installation Guide
      </Link>
    </div>
  );
}