import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

export const SDKs = () => {
  return (
    <section className="my-20">
      <h1 className="mb-2 text-3xl md:text-4xl">Supported OS</h1>
      <p className="mb-8">
        Find eBPF tutorials and dependency mock references in the language of
        your choice.
      </p>
      <div className="grid grid-cols-1 gap-6  md:grid-cols-3 lg:gap-8">
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/windows/installation")}
        >
          <img
            className="h-16 w-16"
            src="/img/windows-logo.svg"
            alt="Windows logo"
          />
          <p className="text-lg">Windows</p>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/linux/installation")}
        >
          <img
            className="h-16 w-16"
            src="/img/linux-logo.svg"
            alt="Linux logo"
          />
          <p className="text-lg">Linux</p>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/macos/installation")}
        >
          <img className="h-16 w-16" src="/img/apple-logo.svg" alt="Mac logo" />
          <p className="text-lg">MacOS</p>
        </Link>
      </div>
    </section>
  );
};
