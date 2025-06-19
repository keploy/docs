import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export const QuickStart = () => {
  return (
    <section className="mt-1">
      <h1 className="mb-4 text-4xl font-semibold tracking-wide md:text-4xl">
        Welcome to Keploy Documentation! 🚀
      </h1>
      <p className="text-lg max-w-3xl">
        This documentation will help you get the most out of Keploy—whether
        you're building your first project or leveling up your testing workflow.
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        What is Keploy? 🤔
      </h2>
      <p className="text-lg max-w-4xl">
        Keploy is your open-source, developer-centric backend testing tool that
        makes backend testing easy and productive for engineering teams. It's
        user-friendly, powerful, and extensible. 🛠️ Keploy features AI-powered
        tools that help you generate unit and API tests quickly, allowing
        developers to focus on writing code rather than writing tests.
      </p>

      <p className="text-lg mt-4 max-w-4xl">
        Keploy creates test cases and data mocks/stubs from user traffic by
        recording API calls and database queries, significantly speeding up releases
        and enhancing reliability. 📈
      </p>

      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        Key Features ✨
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">🤖 AI-Powered Testing</h3>
          <p className="text-sm text-blue-700">Generate comprehensive unit and API tests automatically</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">📊 Traffic Recording</h3>
          <p className="text-sm text-green-700">Capture real API calls and database queries</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-2">🔧 Developer-Friendly</h3>
          <p className="text-sm text-purple-700">Easy integration with existing workflows</p>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        Installation Guide 📗
      </h2>
      <p className="text-lg mb-8 mt-4 max-w-4xl">
        Get Keploy up and running on your Windows, Linux, or macOS
        machine in minutes. Choose your operating system below: ⏱️
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        <Link
          className="scale transform transition-transform hover:scale-105 flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg hover:shadow-xl"
          to={useBaseUrl("/server/installation/")}
          aria-label="Install Keploy on Windows"
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/windows-logo.svg"
            alt="Windows logo"
          />
          <p className="text-lg font-semibold">Windows</p>
          <p className="text-sm text-gray-600">Windows 10/11 supported</p>
        </Link>
        <Link
          className="scale transform transition-transform hover:scale-105 flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg hover:shadow-xl"
          to={useBaseUrl("/server/installation/")}
          aria-label="Install Keploy on Linux"
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/linux-logo.svg"
            alt="Linux logo"
          />
          <p className="text-lg font-semibold">Linux</p>
          <p className="text-sm text-gray-600">Best experience available</p>
        </Link>
        <Link
          className="scale transform transition-transform hover:scale-105 flex flex-col items-center justify-center space-y-3 rounded-lg bg-[color:var(--ifm-card-background-color)] p-6 text-center shadow-lg hover:shadow-xl"
          to={useBaseUrl("/server/installation/")}
          aria-label="Install Keploy on macOS"
        >
          <img
            className="h-16 w-16"
            src="/docs/img/os/apple-logo.svg"
            alt="Mac logo"
          />
          <p className="text-lg font-semibold">macOS</p>
          <p className="text-sm text-gray-600">Intel & Apple Silicon</p>
        </Link>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          ⚠️ <strong>Note:</strong> Keploy v2 is currently in development, with the best
          experience on Linux. Docker support is experimental and may have some
          limitations for certain use cases.
        </p>
      </div>

      <h2 className="mb-4 mt-8 text-2xl font-semibold tracking-wide md:text-3xl">
        Quick Links 🔗
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          to={useBaseUrl("/concepts/what-is-keploy/")}
        >
          <h3 className="font-semibold mb-2">📚 Core Concepts</h3>
          <p className="text-sm text-gray-600">Learn the fundamentals</p>
        </Link>
        <Link
          className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          to={useBaseUrl("/quickstart/samples-tutorials/")}
        >
          <h3 className="font-semibold mb-2">🚀 Quick Start</h3>
          <p className="text-sm text-gray-600">Get up and running</p>
        </Link>
        <Link
          className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          to={useBaseUrl("/operation/record-and-test/")}
        >
          <h3 className="font-semibold mb-2">🎯 Tutorials</h3>
          <p className="text-sm text-gray-600">Step-by-step guides</p>
        </Link>
        <Link
          className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
          to={useBaseUrl("/server/sdk-installation/")}
        >
          <h3 className="font-semibold mb-2">🔧 API Reference</h3>
          <p className="text-sm text-gray-600">Technical documentation</p>
        </Link>
      </div>
    </section>
  );
};