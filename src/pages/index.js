import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {Community, KeployCloud, Resources, QuickStart, GetStartedPaths, TestingCapabilities, QuickStartTabs, WhatIsKeploy, EcosystemSupport} from "../components";
import {Products} from "../components/Product";
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
  const breadcrumbSchema =
    docsUrl && siteConfig.url
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: siteConfig.url,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Docs",
              item: docsUrl,
            },
          ],
        }
      : null;
  const articleSchema =
    docsUrl && siteConfig.title
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: siteConfig.title,
          description: siteConfig.tagline,
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": docsUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "Keploy",
            logo: {
              "@type": "ImageObject",
              url: "https://keploy.io/docs/img/favicon.png",
            },
          },
        }
      : null;
  // SEO: docs landing previously rendered with title "Keploy Documentation" (20c)
  // and meta description "API Test Generator Tool" (23c). Both were too short
  // to capture the intent of a docs visitor (install, capture, replay, SDK).
  const docsHomeTitle = "Keploy Documentation — Install, Capture & Replay API Tests";
  const docsHomeDescription = "Install Keploy in 5 minutes, capture real API traffic with eBPF, and replay it as deterministic tests in CI. Quickstarts, SDK references, and integration guides.";

  return (
    <div className="main">
      <Head>
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {articleSchema && (
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
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
