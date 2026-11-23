import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import Head from "@docusaurus/Head";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";
import {DOCS_URL, organizationRef, websiteRef} from "../schema/siteEntities";

export default function Leadership() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  const team = [
    {
      name: "Neha Gupta",
      image: "https://avatars.githubusercontent.com/u/15074229?v=4",
      sameAs: "https://twitter.com/know_neha",
    },
    {
      name: "Shubham Jain",
      image: "https://avatars.githubusercontent.com/u/12831254?v=4",
      sameAs: "https://twitter.com/slayerjain",
    },
  ];
  // CollectionPage of Person entities so search engines / AI can resolve the
  // Keploy leadership team (name, photo, social profile) as structured people.
  const leadershipSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Keploy Leadership",
    // Docusaurus derives this route from the filename (leadership.js) ->
    // /docs/leadership/. The capital-L form 404s on case-sensitive hosting, so
    // the schema URL must match the actual lowercase route.
    url: `${DOCS_URL}leadership/`,
    isPartOf: websiteRef,
    publisher: organizationRef,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: team.map((person, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: person.name,
          image: person.image,
          worksFor: organizationRef,
          sameAs: [person.sameAs],
        },
      })),
    },
  };
  return (
    <Layout title="Leadership" permalink="/leadership" description="<head />">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(leadershipSchema)}
        </script>
      </Head>
      <div className="my-15 mx-auto w-auto">
        <ul className="text-center">
          <li className="my-7">
            <span className="text-xl font-semibold">Neha Gupta</span>
            <img
              className="mx-auto my-3 w-40"
              alt="Neha Gupta"
              src="https://avatars.githubusercontent.com/u/15074229?v=4"
            />
            <a className="" href="https://twitter.com/know_neha">
              https://twitter.com/know_neha
            </a>
          </li>
          <li className="my-7">
            <span className="text-xl font-semibold">Shubham Jain</span>
            <img
              className="mx-auto my-3 w-40"
              alt="Shubham Jain"
              src="https://avatars.githubusercontent.com/u/12831254?v=4"
            />
            <a href="https://twitter.com/slayerjain">
              https://twitter.com/slayerjain
            </a>
          </li>
        </ul>
      </div>
    </Layout>
  );
}
