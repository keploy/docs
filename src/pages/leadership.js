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
    <Layout title="Leadership" permalink="/Leadership" description="<head />">
      <div className="w-auto mx-auto my-15">
        <ul className="text-center">
          <li className="my-7">
            <span className="font-semibold text-xl">Neha Gupta</span>
            <img
              className="w-40 mx-auto my-3"
              alt="Neha Gupta"
              src="https://avatars.githubusercontent.com/u/15074229?v=4"
            />
            <a className="" href="https://twitter.com/know_neha">
              https://twitter.com/know_neha
            </a>
          </li>
          <li className="my-7">
            <span className="font-semibold text-xl">Shubham Jain</span>
            <img
              className="w-40 mx-auto my-3"
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
