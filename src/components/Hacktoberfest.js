import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {SDKs as SDKsOption} from "./SDKs";

export const Hacktoberfest = () => {
  return (
    <section className="mt-1 mb-14">
      <h2 className="mt-8 text-3xl md:text-4xl font-bold">Keploy Hacktoberfest Guide</h2>
      <img src="https://user-images.githubusercontent.com/53110238/193503992-c839beeb-53fd-46d7-9214-a88bfff6475a.png"/>
      <div className="grid grid-cols-1 gap-6  md:grid-cols-2 lg:gap-8">
        <a
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-6 text-center shadow-lg"
          href="https://github.com/keploy/keploy/issues?q=is%3Aopen+is%3Aissue+label%3AHACKTOBERFEST2022"
        >
          <p className="text-lg font-semibold">Active Issues</p>
        </a>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/hacktoberfest/contribution-guide")}
        >
          <p className="text-lg font-semibold">Know More</p>
        </Link>
      </div>
    </section>
  );
};
