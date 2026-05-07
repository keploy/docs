import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

// Custom React pages under src/pages/ are not covered by the docs schema
// plugin — add Article + BreadcrumbList JSON-LD inline so the page is
// machine-readable for search engines and AI crawlers.
//
// Site config sets `trailingSlash: true`, so canonical URLs in the JSON-LD
// must carry the trailing slash to match the actual emitted href and avoid
// duplicate URL variants in structured data.
//
// Single source of truth for the page's title and description: the Layout
// `title`/`description` props, the visible H1, and the Article JSON-LD
// `headline`/`description` all read from these constants. Previously the
// page shipped Layout title "About the docs" / description "User General
// Information about..." while the JSON-LD claimed headline "About the
// Keploy Documentation" / a different description, which confuses snippet
// generators and leaves rich-result text out of sync with the meta tags.
const ABOUT_TITLE = "About the Keploy Documentation";
const ABOUT_DESCRIPTION =
  "Information about Keploy's documentation, contribution guidelines, and licensing.";

const aboutStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    url: "https://keploy.io/docs/about/",
    publisher: {
      "@type": "Organization",
      name: "Keploy",
      logo: {
        "@type": "ImageObject",
        url: "https://keploy.io/docs/img/favicon.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://keploy.io/docs/about/",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://keploy.io/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Docs",
        item: "https://keploy.io/docs/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "About",
        item: "https://keploy.io/docs/about/",
      },
    ],
  },
];

function About() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={ABOUT_TITLE}
      permalink="/about"
      description={ABOUT_DESCRIPTION}
    >
      <Head>
        {aboutStructuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Head>
      <main className="margin-vert--lg container">
        <h1>{ABOUT_TITLE}</h1>
        <div className="margin-bottom--lg">
          <h2 id="latest">Documentation SLA</h2>
          <p>
            Keploy is constantly working to improve and expand its
            documentation. As a result, some components may change without
            notice. Page slugs (URLs), menu labels, and the location of
            information are a few of the items you can expect to see altered as
            we aim to try and give our users the best experience possible.
          </p>
          <p>
            Visit{" "}
            <a href="https://github.com/keploy/docs">keploy/docs on github</a>{" "}
            for help if the information you are looking for appears to be
            missing.
          </p>
          <p>
            View the{" "}
            <a href="https://github.com/keploy/docs">
              source repository README
            </a>{" "}
            for contribution guidelines if you are looking to help improve the
            Keploy documentation experience.
          </p>
        </div>
        <div className="margin-bottom--lg">
          <h2 id="next">MIT License</h2>
          <pre>
            <p>Copyright (c) 2021 Keploy Inc. All rights reserved.</p>

            <p>
              Permission is hereby granted, free of charge, to any person
              obtaining a copy
              <br />
              of this software and associated documentation files (the
              "Software"), to deal
              <br />
              in the Software without restriction, including without limitation
              the rights
              <br />
              to use, copy, modify, merge, publish, distribute, sublicense,
              and/or sell
              <br />
              copies of the Software, and to permit persons to whom the Software
              is
              <br />
              furnished to do so, subject to the following conditions:
            </p>

            <p>
              The above copyright notice and this permission notice shall be
              included in
              <br />
              all copies or substantial portions of the Software.
            </p>

            <p>
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
              EXPRESS OR
              <br />
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
              MERCHANTABILITY,
              <br />
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT
              SHALL THE
              <br />
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
              OTHER
              <br />
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
              ARISING FROM,
              <br />
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
              DEALINGS IN
              <br />
              THE SOFTWARE.
            </p>
          </pre>
        </div>
      </main>
    </Layout>
  );
}

export default About;
