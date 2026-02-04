import React from "react";

export const KeployCloud = () => {
  return (
    <section
      id="support"
      className="my-10 w-full border-y border-white/10 py-4"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-3 text-sm text-gray-400">
        <span className="opacity-70">Need help?</span>

        <a
          href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange-500 hover:text-orange-400"
        >
          Join Slack
        </a>

        <span className="opacity-30">|</span>

        <a
          href="https://calendar.app.google/cXVaj6hbMUjvmrnt9"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange-500 hover:text-orange-400"
        >
          Book a Demo
        </a>
      </div>
    </section>
  );
};
