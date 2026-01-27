import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { FaArrowRight, FaShieldAlt } from "react-icons/fa";

// Two core docs entry points for this section
const cards = [
  {
    id: "how-it-works",
    title: "How it works",
    description: "How Keploy captures behavior, validates it, and turns it into reliable tests.",
    link: "/keploy-explained/introduction",
    tone: "primary",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <circle
          cx="24"
          cy="24"
          r="20"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.2"
        />
        <path
          d="M24 8v8M24 32v8M8 24h8M32 24h8"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="24"
          cy="24"
          r="8"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="24" cy="24" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "comparison",
    title: "Keploy vs traditional testing tools",
    description: "Where record–replay and AI-generated flows fit vs Postman, contract testing, and mocking libraries.",
    link: "/docs/keploy-explained/why-keploy/",
    tone: "secondary",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M3 6h18M3 12h18M3 18h18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="7" cy="6" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="17" cy="12" r="2" fill="currentColor" opacity="0.5" />
        <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.5" />
      </svg>
    ),
  },
];

export const WhatIsKeploy = () => {
  return (
    <section className="mb-16" id="what-is-keploy">
      {/* Section Header - Larger, bolder */}
      <div className="mb-8 text-center">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          <FaShieldAlt className="h-3 w-3" />
          Enterprise-ready
        </span>
        <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          About Keploy
        </h2>
        {/* Narrative paragraph */}
        <p className="mx-auto mb-2 max-w-3xl text-base leading-relaxed text-gray-600 dark:text-gray-300 md:text-lg">
          As developers, the hardest bugs were never the ones we could reproduce. They were the “works on my machine, breaks in prod” ones—because <b>real user behavior and real dependencies don’t show up in unit tests.</b>
          <br />
          <br />
          We struggled to <b>replicate real user behavior</b> exactly like production on the <b>leftmost part</b> of the SDLC (local dev and CI/CD regression checks). That pain is what led to Keploy: capture real API behavior (and its dependencies) and make it replayable, so tests stay reliable across environments.
        </p>
      </div>

      {/* Two core links */}
      <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.id}
            to={useBaseUrl(card.link)}
            id={card.id}
            className={
              card.tone === "primary"
                ? "group relative overflow-hidden rounded-2xl border border-orange-200 bg-gradient-to-br from-white to-orange-50/30 p-6 transition-all duration-300 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100/50 hover:no-underline dark:border-orange-900/50 dark:from-gray-900 dark:to-orange-950/10 dark:hover:border-orange-500 dark:hover:shadow-orange-900/20"
                : "group relative overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/30 p-6 transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-100/50 hover:no-underline dark:border-purple-900/50 dark:from-gray-900 dark:to-purple-950/10 dark:hover:border-purple-500 dark:hover:shadow-purple-900/20"
            }
          >
            <div className="flex items-start gap-5">
              <div
                className={
                  card.tone === "primary"
                    ? "flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300"
                    : "flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-200"
                }
              >
                {card.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
                <span
                  className={
                    "inline-flex items-center gap-1.5 text-sm font-medium transition-transform group-hover:translate-x-1 " +
                    (card.tone === "primary"
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-purple-600 dark:text-purple-300")
                  }
                >
                  Learn more <FaArrowRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Enterprise Trust Banner */}
      <div className="mx-auto mt-10 max-w-5xl">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow-lg shadow-indigo-500/10 dark:border-indigo-900/40 dark:shadow-indigo-900/20">
          <div className="relative rounded-2xl bg-white/95 p-6 dark:bg-gray-950/60">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br from-indigo-400/30 to-pink-400/10 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-400/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200">
                  <FaShieldAlt className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Built for enterprise security & compliance
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
                    Keploy is compliant with <span className="font-semibold text-gray-800 dark:text-gray-100">SOC 2</span>, <span className="font-semibold text-gray-800 dark:text-gray-100">ISO</span>, <span className="font-semibold text-gray-800 dark:text-gray-100">GDPR</span>, and <span className="font-semibold text-gray-800 dark:text-gray-100">HIPAA</span>—with strong security controls designed for modern teams.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      "SOC 2",
                      "ISO",
                      "GDPR",
                      "HIPAA",
                      "SSO",
                      "Audit Logs",
                      "Self-hosted",
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row md:flex-col md:items-end">
                <a
                  href="https://trust.keploy.io"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:from-indigo-700 hover:to-purple-700 hover:text-white hover:shadow-indigo-500/30 hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:shadow-indigo-900/30 dark:focus-visible:ring-offset-gray-950"
                  aria-label="Visit Keploy Trust Center"
                >
                  Trust Center
                  <FaArrowRight className="h-3.5 w-3.5" />
                </a>
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  Security docs, reports &amp; policies
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatIsKeploy;

