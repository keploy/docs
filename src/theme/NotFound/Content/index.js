import React, {useEffect} from "react";
import {PageMetadata} from "@docusaurus/theme-common";

export default function NotFound() {
  useEffect(() => {
    // Immediate redirect after 1s without showing any error
    if (typeof window !== "undefined") {
      const id = setTimeout(() => {
        window.location.href = "/docs/";
      }, 1000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, []);

  return (
    <>
      <PageMetadata title="Redirecting..." />
      <main
        style={{
          height: "100vh",
          backgroundColor: "var(--ifm-background-color)",
        }}
      />
    </>
  );
}
