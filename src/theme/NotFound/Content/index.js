import React, {useEffect} from "react";
import {PageMetadata} from "@docusaurus/theme-common";

export default function Index() {
  useEffect(() => {
    window.location.href = "/docs/";
  }, 2000);
  [];

  return (
    <>
      <PageMetadata title="Redirecting..." />
      <main className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1 className="hero__title">Redirecting to home page...</h1>
          </div>
        </div>
      </main>
    </>
  );
}
