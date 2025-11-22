import React from "react";
import {translate} from "@docusaurus/Translate";
import {PageMetadata} from "@docusaurus/theme-common";
import Layout from "@theme/Layout";
import NotFoundContent from "@theme/NotFound/Content";
export default function Index() {
  useEffect(() => {
    // Redirect immediately without adding history entry
    window.location.replace("/docs");
  }, []);

  return (
    <>
      <PageMetadata title="Redirecting..." />
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Redirecting…</h1>
        <p>You will be taken to the documentation shortly.</p>
      </div>
    </>
  );
}
