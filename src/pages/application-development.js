import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {SDKs} from "../components/SDKs";
import {
  DOCS_URL,
  organizationRef,
  websiteRef,
  breadcrumbList,
} from "../schema/siteEntities";

// Custom React page — not covered by the docs schema plugin — so add JSON-LD
// inline. This page listed the three supported operating systems with no
// structured data; emit a WebPage, a BreadcrumbList, and an ItemList of the OS
// install entry points the SDKs component renders.
const PAGE_URL = `${DOCS_URL}application-development/`;
const INSTALL_URL = `${DOCS_URL}server/installation/`;
const PAGE_TITLE = "Keploy Application Development";
const PAGE_DESCRIPTION =
  "Set up Keploy for application development across supported operating systems — Windows, Linux, and macOS.";

const operatingSystems = ["Windows", "Linux", "macOS"];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": PAGE_URL,
    name: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    isPartOf: websiteRef,
    publisher: organizationRef,
  },
  breadcrumbList([{name: "Application Development", item: PAGE_URL}]),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Supported operating systems",
    itemListElement: operatingSystems.map((os, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: os,
      url: INSTALL_URL,
    })),
  },
];

export default function ApplicationDevelopment() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title="Keploy application development"
      permalink="/application-development"
    >
      <Head>
        {structuredData.map((node, i) => (
          <script type="application/ld+json" key={i}>
            {JSON.stringify(node)}
          </script>
        ))}
      </Head>
      <div className="mx-auto mb-12 max-w-screen-lg p-6 md:p-10">
        <SDKs />
      </div>
    </Layout>
  );
}
