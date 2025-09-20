import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const QuickStart = () => {
  return (
    <section className="mt-1">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-4xl">
        Welcome to Keploy Documentation! 🚀
      </h1>
      <p className="text-l max-w-3xl">
        This documentation will help you get the most out of Keploy—whether
        you’re building your first project or leveling up your testing workflow.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        What is Keploy? 🤔
      </h2>
      <p className="text-l max-w-4xl">
        Keploy is your open-source, developer-centric backend testing tool. It
        makes backend testing easy and productive for engineering teams. Plus,
        it's easy-to-use, powerful and extensible..🛠️ Keploy also has AI-powered
        tools that help you generate unit and api tests quickly, helping
        developers focus on writing code rather than writing tests.
      </p>

      <p className="text-l mt-4 max-w-4xl">
        Keploy creates test cases and data mocks/stubs from user-traffic by
        recording API calls and DB queries, significantly speeding up releases
        and enhancing reliability. 📈
      </p>

      {/*<h2 className="mt-8 text-2xl font-semibold tracking-wide md:text-3xl">*/}
      {/*  Contribute through Hacktoberfest ✅*/}
      {/*</h2>*/}
      {/*<p className="text-l mb-8 mt-4 max-w-4xl">*/}
      {/*  DigitalOcean's Hacktoberfest is a month-long celebration of open-source*/}
      {/*  contributions. Everyone is welcome to participate, regardless of their*/}
      {/*  experience level. Simply make a pull request to an open-source project*/}
      {/*  to get started.*/}
      {/*  <br /> <br />*/}
      {/*  You can contribute to{" "}*/}
      {/*  <a href="https://github.com/orgs/keploy/repositories">*/}
      {/*    several Keploy projects*/}
      {/*  </a>{" "}*/}
      {/*  participating this year, If you’ve ever wanted to contribute to open*/}
      {/*  source , now is your chance!*/}
      {/*  <br /> <br />*/}
      {/*  Anyone around the globe who desires to help drive the growth of open*/}
      {/*  source and make positive contributions to an ever-growing community. All*/}
      {/*  backgrounds and skill levels are encouraged to participate.{" "}*/}
      {/*  <a href="https://opensource.guide/how-to-contribute">*/}
      {/*    Learn How to Contribute?*/}
      {/*  </a>*/}
      {/*</p>*/}

      <h2 className="mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        Installation Guide 📗
      </h2>
      <p className="text-l mb-8 mt-4 max-w-4xl">
        Let's get Keploy up and running on your Windows, Linux, or macOS
        machine, so you can start crafting test cases in minutes. ⏱️
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/installation/installation")}
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/windows-logo.svg"
            alt=""
          />
          <p className="text-lg font-semibold">Windows</p>
        </Link>
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/")}
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/linux-logo.svg"
            alt="Linux logo"
          />
          <p className="text-lg font-semibold">Linux</p>
        </Link>
        <Link
          className="scale flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg"
          to={useBaseUrl("/installation/macos-installation/")}
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/apple-logo.svg"
            alt="Mac logo"
          />
          <p className="text-lg font-semibold">MacOS</p>
        </Link>
      </div>
    </section>
  );
};
