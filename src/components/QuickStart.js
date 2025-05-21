import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const QuickStart = () => {
  return (
    <section className="mt-1">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-5xl">
        Welcome to Keploy Documentation! 🚀
      </h1>
      <p className="text-l max-w-3xl">
        This documentation is your roadmap to becoming a Keploy expert, whether
        you're a seasoned developer or just starting out. 🗺️
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        What is Keploy? 🤔
      </h2>
      <p className="text-l max-w-4xl">
        Keploy is your open-source, developer-centric backend testing tool. It
        makes backend testing easy and productive for engineering teams. Plus,
        it's easy-to-use, powerful and extensible..🛠️
      </p>
      <p className="text-l mt-4 max-w-4xl">
        Keploy creates test cases and data mocks/stubs from user-traffic by
        recording API calls and DB queries, significantly speeding up releases
        and enhancing reliability. 📈
      </p>
      {/*
      <h2 className="mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        Contribute through Hacktoberfest ✅
      </h2>
      <p className="text-l mb-8 mt-4 max-w-4xl">
        DigitalOcean's Hacktoberfest is a month-long celebration of open-source
        contributions. Everyone is welcome to participate, regardless of their
        experience level. Simply make a pull request to an open-source project
        to get started.
        <br /> <br />
        You can contribute to{" "}
        <a href="https://github.com/orgs/keploy/repositories">
          several Keploy projects
        </a>{" "}
        participating this year, If you’ve ever wanted to contribute to open
        source , now is your chance!
        <br /> <br />
        Anyone around the globe who desires to help drive the growth of open
        source and make positive contributions to an ever-growing community. All
        backgrounds and skill levels are encouraged to participate.{" "}
        <a href="https://opensource.guide/how-to-contribute">
          Learn How to Contribute?
        </a>
      </p>
      */}
    </section>
  );
};
