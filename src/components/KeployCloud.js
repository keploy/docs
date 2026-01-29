import React from "react";
import Link from "@docusaurus/Link";

export const KeployCloud = () => {
  return (
    <section
      id="cloud"
      className="flex flex-col items-center justify-between rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/20 md:flex-row"
    >
      <div className="mb-3 flex items-center gap-2 md:mb-0">
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
          Have questions?
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          We're here to help!
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg"
          className="whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-xs font-bold text-orange-600 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-orange-50 hover:text-orange-700 hover:shadow hover:no-underline dark:bg-gray-800 dark:text-orange-400 dark:ring-gray-700 dark:hover:bg-gray-700"
        >
          Join Slack to chat
        </Link>
        <Link
          href="https://calendar.app.google/cXVaj6hbMUjvmrnt9"
          className="whitespace-nowrap rounded-md bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:text-gray-900 hover:shadow hover:no-underline dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700"
        >
          Book a Demo
        </Link>
      </div>
    </section>
  );
};
