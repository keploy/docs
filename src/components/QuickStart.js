import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { SDKs as SDKsOption } from "../components/SDKs";

export const QuickStart = () => {
  return (
    <section className="mt-1 mb-14">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-5xl">
        Keploy Documentation
      </h1>
      <p className="max-w-4xl text-xl">
        Keploy is 100% Open Source API Testing Platform that
        eliminates need for writing test-cases and data mocks, making releases faster
        and highly-reliable.
      </p>
      <h2 className="mt-8 text-3xl md:text-4xl">QuickStart</h2>
      <p className="mt-8 mb-8">
        Follow a QuickStart in language of your choice.
      </p>
      <div className="grid grid-cols-1 gap-6  md:grid-cols-2 lg:gap-8">
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/go/quickstart/run-your-first-app-tutorial")}
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
          to={"https://github.com/keploy/keploy/issues/51"}
        >
          <img className="h-16 w-16" src="/img/java.svg" alt="Java logo" />
          <p className="text-lg">Java (WIP)</p>
        </Link>
      </div>
    </section >
  );
};
