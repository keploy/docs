import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {
  Community,
  GetStartedPaths,
  TestingCapabilities,
  QuickStartTabs,
  WhatIsKeploy,
  EcosystemSupport,
} from "../components";
import {GET_STARTED_PATHS} from "../components/GetStartedPaths";
import {
  organizationRef,
  websiteRef,
  breadcrumbList,
} from "../schema/siteEntities";
//import {Intro} from "../components";
export default function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const toAbsoluteUrl = (baseUrl, url) => {
    if (!url) {
      return null;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const trimmedBase = baseUrl?.replace(/\/$/, "") ?? "";
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${trimmedBase}${normalizedPath}`;
  };
  const docsUrl = toAbsoluteUrl(siteConfig.url, siteConfig.baseUrl);
  // Home -> Docs breadcrumb, from the shared builder (single source of truth).
  const breadcrumbSchema = breadcrumbList();
  // SEO: docs landing previously rendered with title "Keploy Documentation" (20c)
  // and meta description "API Test Generator Tool" (23c). Both were too short
  // to capture the intent of a docs visitor (install, capture, replay, SDK).
  // The Article JSON-LD below derives its `headline`/`description` from these
  // same constants so the schema, the rendered <title>, the meta description
  // and the sr-only H1 all agree — single source of truth.
  const docsHomeTitle =
    "Keploy Documentation — Install, Capture & Replay API Tests";
  const docsHomeDescription =
    "Install Keploy in 5 minutes, capture real API traffic with eBPF, and replay it as deterministic tests in CI. Quickstarts, SDK references, and integration guides.";
  // CollectionPage, not Article: this page is an index of the docs, with no
  // single author, publication date or headline. DocItem already suppresses
  // Article on /docs/ for exactly that reason, so emitting one here left the
  // site's only generic Article on the page the rule was written for. The
  // ItemList mirrors the four entry-point cards GetStartedPaths renders.
  const collectionPageSchema = docsUrl
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": docsUrl,
        name: docsHomeTitle,
        description: docsHomeDescription,
        url: docsUrl,
        isPartOf: websiteRef,
        publisher: organizationRef,
        mainEntity: {
          "@type": "ItemList",
          name: "Ways to get started with Keploy",
          itemListElement: GET_STARTED_PATHS.map((path, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: path.name,
            description: path.description,
            url: toAbsoluteUrl(siteConfig.url, path.href),
          })),
        },
      }
    : null;

  return (
    <div className="main">
      <Head>
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {collectionPageSchema && (
          <script type="application/ld+json">
            {JSON.stringify(collectionPageSchema)}
          </script>
        )}
      </Head>
      <Layout
        className="mx-auto my-2 w-full max-w-screen-lg px-8 shadow-none"
        title={docsHomeTitle}
        description={docsHomeDescription}
      >
        <main className="mx-auto max-w-screen-lg p-6 md:p-10">
          <h1 className="sr-only">{docsHomeTitle}</h1>

          <GetStartedPaths />
          <TestingCapabilities />
          <QuickStartTabs />
          <WhatIsKeploy />
          <Community />
          <EcosystemSupport />
          {/* <Hacktoberfest /> */}
          {/*<GitTogether />*/}
          {/*<Intro />*/}
          {/*<Products />*/}
          {/*<Resources />*/}

          {/*<GSoC/>*/}

          {/*<KeployCloud />*/}
        </main>
      </Layout>
    </div>
  );
}
