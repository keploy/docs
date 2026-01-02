import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {Community, KeployCloud, Resources, QuickStart} from "../components";
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
        className="mx-auto my-2 w-full max-w-screen-lg px-4 md:px-8 shadow-none"
        title={`${siteConfig.title}`}
        description={`${siteConfig.tagline}`}
      >
        <main className="mx-auto max-w-screen-lg p-4 md:p-10">
          <QuickStart />
          {/* <Hacktoberfest /> */}
          {/*<GitTogether />*/}
          {/*<Intro />*/}
          <Products />
          <Resources />
          <Community />
          {/*<GSoC/>*/}
          <KeployCloud />
        </main>
      </Layout>
    </div>
  );
}
