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
      <h2 className="mt-8 text-3xl md:text-4xl">QuickStart</h2>
      <p className="mt-8 mb-8">
        Follow a QuickStart in language of your choice.
      </p>
      <div className="grid grid-cols-1 gap-6  md:grid-cols-2 lg:gap-8">
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/go/quickstart/echo-sql")}
        >
          <img
            className="h-16 w-16"
            src="/img/go-lang.svg"
            alt="Go lang logo"
          />
          <p className="text-lg">Go</p>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/java/run-your-first-app-tutorial")}
        >
          <img className="h-16 w-16" src="/img/java.svg" alt="Java logo" />
          <p className="text-lg">Java</p>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/typescript/installation")}
        >
          <img className="h-16 w-16" src="/img/typescript.svg" alt="Typescript logo" />
          <p className="text-lg">Typescript</p>
        </Link>
      </div>
    </section>
  );
};
