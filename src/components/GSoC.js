import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const GSoC = () => {
  return (
    <section className="mt-1 mb-14">
      <h2 className="text-3xl md:text-4xl">Keploy GSoC Guide</h2>
      <Link to={useBaseUrl("docs/gsoc/contribution-guide")}>
        <img
          className="mt-5 w-full h-[450px]"
          src="/img/gsoc-banner.png"
          alt={"GSoC 2023"}
        />
      </Link>
      <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:gap-8">
        <a
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-6 text-center shadow-lg"
          href="https://github.com/keploy/gsoc/tree/main/2023"
        >
          <p className="text-lg font-semibold">Project List</p>
        </a>
        <Link
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-6 text-center shadow-lg"
          to={useBaseUrl("/docs/gsoc/contribution-guide")}
        >
          <p className="text-lg font-semibold">Know More</p>
        </Link>
      </div>
    </section>
  );
};
