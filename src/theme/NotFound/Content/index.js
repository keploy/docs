import React from "react";
import {translate} from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import {PageMetadata} from "@docusaurus/theme-common";

export default function NotFound() {
  return (
    <>
      <PageMetadata title="Page Not Found" />
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3 text-center">
            <h1 className="hero__title">404: Page Not Found</h1>
            <p className="padding-vert--md">
              We could not find what you were looking for.<br />
              The page you requested may have been moved or deleted.
            </p>
            <div className="margin-vert--lg">
              <Link to="/docs/" className="button button--primary margin-right--md">
                Back to Homepage
              </Link>
              <Link to="/docs/search" className="button button--secondary">
                Search Documentation
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
