import React from "react";

export const KeployCloud = () => {
  return (
    <section
      id="support"
      className="my-10 w-full border-y border-white/10 py-4"
    >
      <div className="kd-help mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 text-sm">
        <span>Need help?</span>

        <a
          href="https://keploy.io/slack"
          target="_blank"
          rel="noopener noreferrer"
          className="kd-help__link font-semibold"
        >
          Join Slack
        </a>

        <span className="kd-help__sep" aria-hidden="true">
          |
        </span>

        <a
          href="https://calendar.app.google/cXVaj6hbMUjvmrnt9"
          target="_blank"
          rel="noopener noreferrer"
          className="kd-help__link font-semibold"
        >
          Book a Demo
        </a>
      </div>
    </section>
  );
};
