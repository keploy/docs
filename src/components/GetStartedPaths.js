import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  FaRocket,
  FaMagic,
  FaRetweet,
  FaLaptopCode,
} from "react-icons/fa";
import { SiKubernetes } from "react-icons/si";

export const GetStartedPaths = () => {
  return (
    <section className="mb-12">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <span className="mb-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          Get started
        </span>
        <h2 className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">
          How do you want to get started?
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Pick a workflow to begin. You can switch anytime—both paths lead to reliable, replayable tests.
        </p>
      </div>

      {/* Two Paths Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Test Generation */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-orange-50/50 p-6 h-full shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-orange-100/50 dark:border-gray-700 dark:from-gray-800 dark:to-orange-950/20 dark:hover:shadow-orange-900/20">
          {/* Decorative gradient blob */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-600/10 blur-2xl transition-transform duration-500 group-hover:scale-150"></div>

          <div className="relative flex h-full flex-col">
            {/* Icon Badge */}
            <div className="relative">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 p-3 text-white shadow-lg shadow-orange-500/25">
              <FaMagic className="h-6 w-6" />
            </div>
            </div>

            {/* Path Label */}
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                AI Test Generation
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Keploy Console
              </span>
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Generate Tests with Keploy AI
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Generate validated API test suites from OpenAPI, Postman, cURL, or endpoints—then run them across staging/QA.
            </p>

            {/* Features */}
            <ul className="mb-6 space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  ✓
                </span>
                Generate connected API flows
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  ✓
                </span>
                Validated suites with cleanup
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  ✓
                </span>
                Replay on any environment (no mocks)
              </li>
            </ul>

            {/* Console Options */}
            <div className="mt-auto space-y-3 pt-2">
              <Link
                to={useBaseUrl("/docs/running-keploy/generate-api-tests-using-ai/")}
                className="group/option flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white/50 p-3 min-h-[92px] transition-all duration-200 hover:border-orange-300 hover:bg-orange-50/50 hover:no-underline dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-orange-500/50 dark:hover:bg-orange-900/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 transition-colors group-hover/option:bg-orange-100 group-hover/option:text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    <FaRocket className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                      Generate from OpenAPI Schema / Postman Collection / cURL
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Connect resources in Keploy Console and generate validated suites
                    </p>
                  </div>
                </div>
                <span className="mt-1 text-gray-400 transition-colors group-hover/option:text-orange-500 dark:text-gray-500">→</span>
              </Link>

              <Link
                to={useBaseUrl("/docs/running-keploy/api-testing-chrome-extension/")}
                className="group/option flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white/50 p-3 min-h-[92px] transition-all duration-200 hover:border-orange-300 hover:bg-orange-50/50 hover:no-underline dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-orange-500/50 dark:hover:bg-orange-900/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 transition-colors group-hover/option:bg-orange-100 group-hover/option:text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    <FaLaptopCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                      Record with Chrome extension
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Turn browser actions into API test flows (no mocks)
                    </p>
                  </div>
                </div>
                <span className="mt-1 text-gray-400 transition-colors group-hover/option:text-orange-500 dark:text-gray-500">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Record & Replay */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-purple-50/50 p-6 h-full shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 dark:border-gray-700 dark:from-gray-800 dark:to-purple-950/20 dark:hover:shadow-purple-900/20">
          {/* Decorative gradient blob */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/10 blur-2xl transition-transform duration-500 group-hover:scale-150"></div>

          <div className="relative flex h-full flex-col">
            {/* Icon Badge */}
            <div className="relative">
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 p-3 text-white shadow-lg shadow-purple-500/25">
              <FaRetweet className="h-6 w-6" />
            </div>
            </div>
            {/* Path Label */}
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-purple-800 dark:bg-purple-900/40 dark:text-purple-200">
                Record & Replay
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Traffic-based testing
              </span>
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Record & Replay API Traffic
            </h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Record real API interactions (and dependencies) and replay them deterministically in local or CI.
            </p>

            {/* Highlights */}
            <ul className="mb-6 space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">✓</span>
                Deterministic replays (with mocks)
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">✓</span>
                Mocks dependencies automatically
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">✓</span>
                Ready for CI pipelines
              </li>
            </ul>

            {/* Sub-Options */}
            <div className="mt-auto space-y-3 pt-2">
              <Link
                to={useBaseUrl("/docs/running-keploy/record-replay-in-kubernetes/")}
                className="group/option flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white/50 p-3 min-h-[92px] transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/50 hover:no-underline dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 transition-colors group-hover/option:bg-purple-100 group-hover/option:text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                    <SiKubernetes className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                     Record in K8s, Replay Anywhere (Local/CI/K8s)
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Capture from staging/prod, replay in your pipeline
                    </p>
                  </div>
                </div>
                <span className="mt-1 text-gray-400 transition-colors group-hover/option:text-purple-500 dark:text-gray-500">→</span>
              </Link>

              <Link
                to={useBaseUrl("/docs/server/installation/")}
                className="group/option flex items-start justify-between gap-3 rounded-xl border border-gray-200 bg-white/50 p-3 min-h-[92px] transition-all duration-200 hover:border-purple-300 hover:bg-purple-50/50 hover:no-underline dark:border-gray-600 dark:bg-gray-800/50 dark:hover:border-purple-500/50 dark:hover:bg-purple-900/10"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700 transition-colors group-hover/option:bg-purple-100 group-hover/option:text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                    <FaLaptopCode className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-0.5 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                      Record Locally
                      <span className="rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-purple-700 dark:bg-purple-900/30 dark:text-purple-200">
                        Open Source
                      </span>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Classic Open Source experience for rapid iteration
                    </p>
                  </div>
                </div>
                <span className="mt-1 text-gray-400 transition-colors group-hover/option:text-purple-500 dark:text-gray-500">→</span>
              </Link>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStartedPaths;
