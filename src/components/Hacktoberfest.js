import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const Hacktoberfest = () => {
  return (
    <section className="mb-14 mt-1">
      <img
        className="mt-8 "
        src="https://raw.githubusercontent.com/Sonichigo/crdb_keploy/refs/heads/main/hacktoberfest.png?raw=true"
        alt={"hacktoberfest-2024"}
      />
      <div className="mt-10 grid grid-cols-1 gap-20 md:grid-cols-2">
        <a
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-4 text-center shadow-lg"
          href="https://github.com/keploy/keploy/issues?q=is%3Aissue+is%3Aopen+label%3Ahacktoberfest2024"
        >
          <p className="text-lg font-semibold">Active Issues</p>
        </a>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-4 text-center shadow-lg"
          to={useBaseUrl("/hacktoberfest/contribution-guide")}
        >
          <p className="text-lg font-semibold">Know More</p>
        </Link>
      </div>
    </section>
  );
};
