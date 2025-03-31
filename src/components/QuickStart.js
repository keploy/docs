import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const QuickStart = () => {
  return (
    <section className="mt-1">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-5xl">
        Keploy Documentation! 🚀
      </h1>
      <p className="text-l max-w-3xxl">
        Welcome to Keploy’s documentation! Whether you're new to backend testing
        or an experienced developer, this guide will help you get started with
        Keploy quickly and effectively.🗺️
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        What is Keploy? 🤔
      </h2>

      <p className="text-l max-w-3xxl">
        Keploy helps you speed up backend testing by automating many of the
        repetitive tasks, such as test generation and execution. It integrates
        seamlessly with your CI/CD pipeline, allowing you to focus more on
        building features while ensuring your code stays reliable and
        well-tested.
      </p>
    </section>
  );
};
