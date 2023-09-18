import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const QuickStart = () => {
  return (
    <section className="mt-1">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-5xl">
        Welcome to Keploy Documentation! 🚀
      </h1>
      <p className="max-w-3xl text-l">
        This documentation is your roadmap to becoming a Keploy expert, whether
        you're a seasoned developer or just starting out. 🗺️
      </p>

      <h2 className="mb-4 text-2xl font-semibold tracking-wide md:text-3xl mt-8">
        What is Keploy? 🤔
      </h2>
      <p className="max-w-4xl text-l">
        Keploy is your open-source, developer-centric E2E testing tool. It makes
        regression testing easy and productive for engineering teams. Plus, it's
        free and highly extensible.🛠️
      </p>
      <p className="max-w-4xl text-l mt-4">
        Keploy creates test cases and generates data mocks/stubs by recording
        API calls and DB queries, significantly speeding up releases and
        enhancing reliability. 📈
      </p>

      <h2 className="mt-8 text-2xl md:text-3xl font-semibold tracking-wide">
        Installation Guide 📗
      </h2>
      <p className="max-w-4xl text-l mt-4 mb-8">
        Let's get Keploy up and running on your Windows, Linux, or macOS
        machine, so you can start crafting test cases in minutes. ⏱️
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/windows/installation")}
        >
          <img
            className="h-16 w-16"
            src="/img/windows-logo.svg"
            alt="Windows logo"
          />
          <p className="text-lg font-semibold">Windows</p>
        </Link>
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/linux/installation")}
        >
          <img
            className="h-16 w-16"
            src="/img/linux-logo.svg"
            alt="Linux logo"
          />
          <p className="text-lg font-semibold">Linux</p>
        </Link>
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/macos/installation")}
        >
          <img className="h-16 w-16" src="/img/apple-logo.svg" alt="Mac logo" />
          <p className="text-lg font-semibold">MacOS</p>
        </Link>
      </div>
      <p className=" text-l mt-6">
        ⚠️ Please note that Keploy v2 is currently in development, with the best
        experience on Linux. Docker support is experimental and may have some
        limitations for certain use cases.
      </p>
    </section>
  );
};
