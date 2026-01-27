import React from "react";

export const KeployCloud = () => {
  return (
    <section
      id="cloud"
      className="mt-10 flex max-w-7xl items-center justify-between rounded-md border border-[color:var(--ifm-toc-border-color)] bg-[color:var(--ifm-background-surface-color)] px-4 py-3"
    >
      <p className="m-0 text-sm text-[color:var(--ifm-font-color-base)]">
        Need help or have questions?
      </p>

      <div className="flex gap-4 text-sm">
        <a
          href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg"
          className="font-medium text-orange-500 hover:underline"
        >
          Join Slack
        </a>
        <a
          href="https://calendar.app.google/cXVaj6hbMUjvmrnt9"
          className="font-medium text-orange-500 hover:underline"
        >
          Book a demo
        </a>
      </div>
    </section>
  );
};
