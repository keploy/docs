import React from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {Community, KeployCloud, Resources, QuickStart} from "../components";
import {GitTogether} from "../components/DevScribe";
import {Products} from "../components/Product";
import {Intro} from "../components";
export default function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <div className="main">
      <Layout
        className="mx-auto my-2 w-full max-w-screen-lg px-8 shadow-none"
        title={`${siteConfig.title}`}
        description={`${siteConfig.tagline}`}
      >
        <main className="mx-auto max-w-screen-lg p-6 md:p-10">
          <QuickStart />
          {/* <GitTogether /> */}
          <Intro />
          <Products />
          <Community />
          <KeployCloud />
        </main>
      </Layout>
    </div>
  );
}
