import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const Hacktoberfest = () => {
  return (
    <section className="mt-1 mb-14">
      <h2 className="text-3xl md:text-4xl">Keploy Hacktoberfest Guide</h2>
      <img
        className="mt-5 "
        src="https://user-images.githubusercontent.com/53110238/193503992-c839beeb-53fd-46d7-9214-a88bfff6475a.png"
        alt={"hacktober fest 2022"}
      />
      <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-2 lg:gap-8">
        <a
          className=" scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:orange] p-6 text-center shadow-lg"
          href="https://github.com/issues?q=is%3Aissue+created%3A%3E%3D2020-09-06+user%3Akeploy+label%3AHACKTOBERFEST2022"
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
