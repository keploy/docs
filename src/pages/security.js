import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import {
  DOCS_URL,
  ORGANIZATION_ID,
  organizationRef,
  websiteRef,
} from "../schema/siteEntities";

export default function Security() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  // WebPage + security ContactPoint so the responsible-disclosure channel is
  // machine-readable (this page is linked from every doc footer).
  const securitySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${DOCS_URL}security/`,
        name: "Keploy Security Practices and Policies",
        url: `${DOCS_URL}security/`,
        description:
          "Learn how Keploy ensures data protection, privacy, and secure testing — Keploy's security measures, policies, and responsible-disclosure process.",
        isPartOf: websiteRef,
        publisher: organizationRef,
      },
      {
        // Shares the site-wide Organization's `@id`, so the disclosure
        // address attaches to that entity rather than creating a second
        // Keploy. This is the page that documents the channel, so the
        // property is declared here rather than on every route.
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "security",
          email: "hello@keploy.io",
        },
      },
    ],
  };
  return (
    <Layout
      title="Keploy Security"
      permalink="/security"
      description="<head />"
    >
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(securitySchema)}
        </script>
      </Head>
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title text-black">
            Keploy Security Practices and Policies
          </h1>
          <p className="hero__subtitle text-black">
            Learn how Keploy ensures data protection, privacy, and secure
            testing. Explore Keploy’s security measures, policies, and best
            practices for safeguarding your systems.
          </p>
        </div>
      </header>
      <div className={clsx("hero hero--secondary", styles.heroBanner)}>
        <div className="container">
          <div className="row">
            <div className={clsx("col col--5", styles.securityPageHeaders)}>
              <h2>Responsible Disclosure</h2>
            </div>
            <div className={clsx("col col--4", styles.justifyLeft)}>
              <p>
                If you have any concerns about security or would like to report
                a security issue, please reach out to our team at{" "}
                <a href="mailto:hello@keploy.io">hello@keploy.io</a>.
              </p>
              <p>
                We promise not to bring legal action against people who do the
                following:
              </p>
              <ul>
                <li>
                  Share with us the full details of any problem they've found.
                </li>
                <li>
                  Keep the issue private until we've had a reasonable time to
                  address it.
                </li>
                <li>
                  Don't intentionally harm our service or exfiltrate data from
                  it
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
