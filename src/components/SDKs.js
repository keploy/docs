import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

export const SDKs = () => {
  return (
    <section className="my-20">
      <h2 className="mb-2 text-3xl md:text-4xl">SDKs</h2>
      <p className="mb-8">
        Find SDK tutorials and dependency mock references in the language of
        your choice.
      </p>
      <div className="grid grid-cols-1 gap-6  md:grid-cols-2 lg:gap-8">
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/go")}
        >
          <img
            className="h-16 w-16"
            src="/img/go-lang.svg"
            alt="Go lang logo"
          />
          <p className="text-lg">Go</p>
        </Link>
        <Link to={"https://github.com/keploy/keploy/issues/61"}>
          <div className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg">
            <img
              className="h-16 w-16"
              src="/img/typescript.svg"
              alt="TypeScript logo"
            />
            <p className="text-lg">TypeScript (WIP)</p>
          </div>
        </Link>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={"https://github.com/keploy/keploy/issues/51"}
        >
          <img className="h-16 w-16" src="/img/java.svg" alt="Java logo" />
          <p className="text-lg">Java (WIP)</p>
        </Link>
        <Link
          to={"https://github.com/keploy/keploy/issues/58"}
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
        >
          <img className="h-16 w-16" src="/img/python.svg" alt="Python logo" />
          <p className="text-lg">Python (WIP)</p>
        </Link>
      </div>
    </section>
  );
};
