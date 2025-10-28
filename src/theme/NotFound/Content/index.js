import React, {useEffect, useState} from "react";
import {translate} from "@docusaurus/Translate";
import Link from "@docusaurus/Link";
import {PageMetadata} from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function NotFound() {
  const [requestedUrl, setRequestedUrl] = useState("");

  useEffect(() => {
    // capture the full URL client-side and trigger a redirect after 2s
    if (typeof window !== "undefined") {
      setRequestedUrl(window.location.href);
      const id = setTimeout(() => {
        window.location.href = "/docs/";
      }, 2000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, []);

  return (
    <>
      <PageMetadata title="Page Not Found" />
      <main
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          padding: "20px 0",
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col col--6 col--offset-3 text-center">
              <div
                style={{
                  maxHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <img
                  src={require("@site/static/img/error404.png").default}
                  alt={translate({message: "404 - Page Not Found"})}
                  style={{
                    width: "380px",
                    maxWidth: "100%",
                    height: "auto",
                    display: "block",
                    margin: "0 auto",
                  }}
                />

                <h1
                  className="hero__title"
                  style={{
                    color: "var(--ifm-color-primary)",
                    margin: "0.5rem 0",
                    fontSize: "2rem",
                  }}
                >
                  404: Page Not Found
                </h1>

                <p
                  style={{
                    color: "var(--ifm-color-emphasis-700)",
                    margin: "0.5rem 0",
                  }}
                >
                  We could not find what you were looking for.
                  <br />
                  The page you requested may have been moved or deleted.
                </p>

                {requestedUrl && (
                  <p
                    style={{
                      color: "var(--ifm-color-emphasis-600)",
                      margin: "0.25rem 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    Requested URL: <code>{requestedUrl}</code>
                  </p>
                )}

                <p
                  style={{
                    color: "var(--ifm-color-primary)",
                    margin: "0.25rem 0",
                    fontSize: "0.9rem",
                  }}
                >
                  Redirecting to documentation...
                </p>

                <div style={{marginTop: "0.5rem"}}>
                  <Link to="/docs/" className="button button--primary">
                    Go to Documentation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
