import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FaBook } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { FaWindows, FaLinux, FaApple } from "react-icons/fa";
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

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-wide md:text-3xl">
          Get Started 🚀
        </h2>
        <p className="text-l mb-8 max-w-4xl">
          Get started with installation, quickstart, or dive into AI-powered API
          testing.
        </p>

        <div >
          {/* Installation Card */}
          <div className="grid gap-4 md:grid-cols-3 xl:gap-6 grid-cols-auto-fit">
            <div className="min-w-[30%]">
              <Link
                className="flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg transition-transform duration-200 hover:scale-105"
                to={useBaseUrl("/server/installation")}
              >
                <div class="flex gap-3">
                  <FaWindows className="h-12 w-12 text-orange-500" />
                  <FaLinux className="h-12 w-12 text-orange-500" />
                  <FaApple className="h-12 w-12 text-orange-500" />
                </div>
                <p className="pt-4 text-lg font-semibold">Installation</p>
              </Link>
            </div>

            {/* Quickstart Card */}
            <div className="min-w-[30%]">
              <Link
                className="flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg transition-transform duration-200 hover:scale-105"
                to={useBaseUrl("/docs/quickstart/quickstart-filter/")}
              >
                <FaBook className="h-12 w-12 text-orange-500" />
                <p className="pt-4 text-lg font-semibold">Quickstart Guide</p>
              </Link>
            </div>

            {/* AI-powered API Testing Card */}
            <div className="min-w-[30%]">
              <Link
                className="flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg transition-transform duration-200 hover:scale-105"
                to={useBaseUrl("/docs/running-keploy/generate-api-tests-using-ai/")}
              >
                <FaRobot className="h-12 w-12 text-orange-500" />
                <p className="pt-4 text-lg font-semibold">AI-powered API Testing</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
