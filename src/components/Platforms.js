import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const Platforms = () => {
  return (
    <section className="mb-4 mt-12">
      <h2 className="mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        Setup Guide 📗
      </h2>
      <p className="text-l mb-8 mt-4 max-w-4xl">
        Follow the steps below to install Keploy on your system. ⏱️
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/server/installation/")}
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/windows-logo.svg"
            alt="Windows logo"
          />
          <p className="text-lg font-semibold">Windows</p>
        </Link>
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/server/installation/")}
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/linux-logo.svg"
            alt="Linux logo"
          />
          <p className="text-lg font-semibold">Linux</p>
        </Link>
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/server/installation/")}
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/apple-logo.svg"
            alt="MacOs logo"
          />
          <p className="text-lg font-semibold">MacOS</p>
        </Link>
      </div>
      <p className="text-l mt-6 text-gray-500">
        <b>⚠️ Important Note:</b> Keploy v2 is currently in Beta, and the best
        experience is on Linux. Docker support is experimental, and some
        limitations may apply.
      </p>
    </section>
  );
};
