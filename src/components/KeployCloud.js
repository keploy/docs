import React from "react";
import Link from "@docusaurus/Link";

export const KeployCloud = () => {
  return (
    <div className="max-w-5xl mx-auto">
    {/* Questions Card */}
    <div className="questions-card">
    <h2 className="questions-title">
      Questions <span className="text-orange-500">?</span>
    </h2>

    <div className="questions-row">
      <p className="questions-text">
        Stuck with a question? Our Slack community is here to help.
      </p>

      <a href="https://slack.com">
        <button className="questions-btn">
         Join Slack
        </button>
      </a>
    </div>

    <div className="questions-row">
      <p className="questions-text">
        Exploring enterprise use cases? Book a demo with us.
      </p>

      <a href="https://calendar.app.google/cXVaj6hbMUjvmrnt9">
        <button className="questions-btn">
        Book Demo
        </button>
      </a>
    </div>
    </div>
  </div>

  );
};
