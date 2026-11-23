import React from "react";
import Link from "@docusaurus/Link";
import ArrowUpRight from "../../static/img/ArrowUpRight.svg";

// Uses Docusaurus `Link` rather than a bare `<a>` for two reasons: a glossary
// entry pointing at a slug that doesn't exist now fails the build
// (`onBrokenLinks: "throw"`) instead of shipping a 404 that only surfaces in a
// crawl, and `Link` applies the site's `trailingSlash` setting, so these
// hand-written slash-less paths stop costing a 301 on every click.
const GlossaryCard = ({name, description, link}) => {
  return (
    <Link
      to={link}
      className="group flex h-full flex-col rounded-xl border border-transparent bg-[var(--ifm-card-background-color)] p-6 shadow-[0_4px_12px_var(--ifm-card-shadow-color)] transition-all duration-300 hover:border-[var(--ifm-color-primary)] hover:shadow-[0_8px_20px_var(--ifm-card-shadow-color)] focus:outline-none focus:ring-2 focus:ring-[var(--ifm-color-primary)] focus:ring-offset-2
      "
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="pr-4 text-xl font-bold text-[var(--ifm-color-primary)]">
          {name}
        </h3>
        <ArrowUpRight
          className=" flex-shrink-0 text-[var(--ifm-color-emphasis-500)] transition-all duration-300 ease-in-out group-hover:rotate-45 group-hover:text-[var(--ifm-color-primary)]"
          size={22}
        />
      </div>
      <p className="text-sm leading-relaxed text-[var(--ifm-color-emphasis-700)]">
        {description}
      </p>
    </Link>
  );
};

export default GlossaryCard;
