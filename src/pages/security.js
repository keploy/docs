import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

export default function Security() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title="Keploy Security"
      permalink="/security"
      description="<head />"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title text-black">Keploy security</h1>
          <p className="hero__subtitle text-black">Our commitment</p>
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
