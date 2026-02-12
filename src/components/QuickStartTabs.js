import React, { useState } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  FaMagic,
  FaVideo,
  FaClock,
  FaPlug,
  FaCheckCircle,
  FaPlay,
  FaDownload,
  FaCircle,
  FaTerminal,
} from "react-icons/fa";

export const QuickStartTabs = () => {
  const [activeTab, setActiveTab] = useState("ai");

  const tabs = {
    ai: {
      id: "ai",
      label: "AI-Gen Quickstart",
      time: "5–10 min",
      icon: FaMagic,
      color: "orange",
      headline: "Quickstart: AI Test Generation",
      steps: [
        {
          icon: FaPlug,
          title: "Connect endpoint/spec",
          description: "OpenAPI, Postman, or cURL",
        },
        {
          icon: FaCheckCircle,
          title: "Generate validated suites",
          description: "Auto-create tests + cleanup flows",
        },
        {
          icon: FaPlay,
          title: "Replay on staging/QA",
          description: "Run tests in your environment",
        },
      ],
      cta: {
        label: "Start AI Quickstart",
        link: "https://app.keploy.io",
        primary: true,
      },
    },
    oss: {
      id: "oss",
      label: "Record/Replay Quickstart",
      time: "10 min",
      icon: FaVideo,
      color: "gray",
      headline: "Quickstart: Record–Replay Locally",
      steps: [
        {
          icon: FaDownload,
          title: "Install Keploy",
          description: "Quick CLI setup",
        },
        {
          icon: FaCircle,
          title: "Record one API flow",
          description: "Capture real traffic",
        },
        {
          icon: FaTerminal,
          title: "Replay in CI",
          description: "Run tests in your pipeline",
        },
      ],
      cta: {
        label: "Start OSS Quickstart",
        link: "/docs/quickstart/quickstart-filter/",
        primary: false,
      },
    },
  };


  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-6 text-center">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <FaClock className="h-3 w-3" />
          Fast-Track
        </span>
        <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Quick Starts
        </h2>
        <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-400">
          Get up and running in minutes. Choose your path to faster testing.
        </p>
      </div>

      {/* Two Quickstart Tiles */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.values(tabs).map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <div
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border-2 p-6 transition-all duration-300 ${
                isActive
                  ? tab.id === "ai"
                    ? "border-orange-400 bg-gradient-to-br from-white to-orange-50 shadow-lg shadow-orange-100/50 dark:border-orange-500 dark:from-gray-800 dark:to-orange-950/20 dark:shadow-orange-900/20"
                    : "border-gray-400 bg-gradient-to-br from-white to-gray-50 shadow-lg dark:border-gray-500 dark:from-gray-800 dark:to-gray-900"
                  : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-gray-600"
              }`}
            >
              {/* Time Badge */}
              <div className="mb-4 flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    tab.id === "ai"
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  <FaClock className="h-3 w-3" />
                  {tab.time}
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    tab.id === "ai"
                      ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                      : "bg-gradient-to-br from-gray-600 to-gray-800 text-white dark:from-gray-500 dark:to-gray-700"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              {/* Headline */}
              <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
                {tab.headline}
              </h3>

              {/* Steps */}
              <div className="mb-6 space-y-3">
                {tab.steps.map((step, index) => {
                return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold ${
                            tab.id === "ai"
                              ? "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {step.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <Link
                to={tab.cta.link.startsWith("http") ? tab.cta.link : useBaseUrl(tab.cta.link)}
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:no-underline ${
                  tab.id === "ai"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:from-orange-600 hover:to-orange-700 hover:text-white hover:shadow-orange-500/40"
                    : "border-2 border-gray-300 bg-transparent text-gray-700 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 dark:border-gray-600 dark:text-gray-300 dark:hover:border-orange-500 dark:hover:bg-orange-900/20 dark:hover:text-orange-400"
                }`}
              >
                {tab.cta.label}
              </Link>

              {/* Active indicator */}
              {isActive && (
                <div
                  className={`absolute left-0 top-0 h-1 w-full ${
                    tab.id === "ai"
                      ? "bg-gradient-to-r from-orange-400 to-orange-600"
                      : "bg-gradient-to-r from-gray-500 to-gray-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickStartTabs;

