import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

// Extracted card component for reusability
const OsCard = ({ to, imgSrc, imgAlt, osName }) => (
  <Link
    className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
    to={useBaseUrl(to)}
  >
    <img className="h-16 w-16" src={imgSrc} alt={imgAlt} />
    <p className="text-lg">{osName}</p>
  </Link>
);

export const SDKs = () => {
  return (
    <section className="my-20">
      {/* Section title */}
      <h1 className="mb-2 text-3xl md:text-4xl">Supported OS</h1>

      {/* Section description */}
      <p className="mb-8">
        Find eBPF tutorials and dependency mock references in the language of
        your choice.
      </p>

      {/* OS cards grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {/* Windows OS card */}
        <OsCard
          to="/server/windows/installation"
          imgSrc="/docs/img/os/windows-logo.svg"
          imgAlt="Windows logo"
          osName="Windows"
        />

        {/* Linux OS card */}
        <OsCard
          to="/server/linux/installation"
          imgSrc="/docs/img/os/linux-logo.svg"
          imgAlt="Linux logo"
          osName="Linux"
        />

        {/* MacOS OS card */}
        <OsCard
          to="/server/macos/installation"
          imgSrc="/docs/img/os/apple-logo.svg"
          imgAlt="Mac logo"
          osName="MacOS"
        />
      </div>
    </section>
  );
};

export default SDKs;
