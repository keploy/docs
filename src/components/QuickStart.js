import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const QuickStart = () => {
  return (
    <section className="mt-1 mb-14">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-5xl">
        Keploy Documentation
      </h1>
      <p className="max-w-4xl text-xl">
          Keploy is simple e2e testing toolkit for developers.
          It creates test-cases and data mocks/stubs by recording API calls, DB queries, etc,
          making releases faster and highly-reliable.
      </p>
      <h2 className="mt-8 text-3xl md:text-4xl">Getting Started</h2>
      <p className="mt-8 mb-8">
        Discover how to set up Keploy with app making testcases in just a few minutes.
      </p>
      <div className="grid grid-cols-1 gap-6  md:grid-cols-3 lg:gap-8">
      <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/windows/installation")}
        >
          <img className="h-16 w-16" src="/img/windows.svg" alt="Windows logo" />
          <p className="text-lg">Windows</p>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/linux/installation")}
        >
<<<<<<< HEAD
          <img className="h-16 w-16" src="/img/linux.svg" alt="Linux logo" />
=======
          <img className="h-16 w-16" src="/img/Linux.svg" alt="Linux logo" />
>>>>>>> 1ef5e1d46062542bb826045af100dc94f126872e
          <p className="text-lg">Linux</p>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/server/macos/installation")}
        >
<<<<<<< HEAD
          <img className="h-16 w-16" src="/img/apple_grey.svg" alt="Mac logo" />
=======
          <img className="h-16 w-16" src="/img/Apple_grey.svg" alt="Mac logo" />
>>>>>>> 1ef5e1d46062542bb826045af100dc94f126872e
          <p className="text-lg">MacOS</p>
        </Link>
      </div>
    </section>
  );
};
