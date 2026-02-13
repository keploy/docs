import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {
  FaStar,
  FaPen,
  FaGithub,
  FaHeart,
  FaGraduationCap,
  FaGoogle,
} from "react-icons/fa";

export const EcosystemSupport = () => {
  return (
    <section className="mb-16" id="ecosystem-support">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <FaHeart className="h-3 w-3" />
          Community
        </span>
        <h2 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
          Ecosystem programs
        </h2>
        <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
          Get sponsored, contribute, and help shape Keploy in the open.
        </p>
      </div>

      {/* Callout Banners */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-12">
        {/* OSS Sponsorship Banner */}
        <div className="group relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 md:col-span-12 dark:border-amber-900/50 dark:from-gray-900 dark:to-amber-950/20">
          {/* Decorative star pattern */}
          <div className="absolute -right-4 -top-4 text-amber-200/50 dark:text-amber-700/20">
            <FaStar className="h-24 w-24" />
          </div>

          <div className="relative">
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
              <FaStar className="h-6 w-6" />
            </div>
            {/* Content */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Keploy Open Source Sponsorship
            </h3>
            <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">
              Selected projects receive <strong>free access</strong> to Keploy’s suite of tools—starting with our <strong>AI-based test generator</strong>—while helping us showcase how AI-powered test generation works in real-world open source development.
            </p>

            <div className="mb-4 rounded-xl border border-amber-200/70 bg-white/70 p-4 text-sm text-gray-700 dark:border-amber-900/40 dark:bg-gray-900/30 dark:text-gray-300">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Requirements</div>
              <ul className="list-disc space-y-1 pl-5">
                <li>Public open source repository</li>
                <li>Valid OSS license (MIT or equivalent)</li>
                <li>
                  Consent to being featured in Keploy’s OSS showcase (marketing, website features, and links to public PRs using Keploy)
                </li>
              </ul>
            </div>

            <div className="mb-5 rounded-xl border border-amber-200/70 bg-white/70 p-4 text-sm text-gray-700 dark:border-amber-900/40 dark:bg-gray-900/30 dark:text-gray-300">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">Selection process</div>
              <p className="mb-0">
                This is an application-based program. Submitting an application does not guarantee acceptance. We review applications on a rolling basis and will reach out to selected projects directly.
              </p>
            </div>

            <Link
              to="https://forms.gle/3jgWe8MLxS5DuZfK6"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-200 hover:from-amber-600 hover:to-orange-600 hover:text-white hover:shadow-amber-500/40 hover:no-underline"
            >
              Apply for sponsorship
            </Link>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              We’ll respond to selected projects—typically within a week.
            </p>
          </div>
        </div>

        {/* Share Your Story Banner */}
        <div className="group relative h-full overflow-hidden rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 md:col-span-6 dark:border-purple-900/50 dark:from-gray-900 dark:to-purple-950/20">
          {/* Decorative pen pattern */}
          <div className="absolute -right-4 -top-4 text-purple-200/50 dark:text-purple-700/20">
            <FaPen className="h-24 w-24" />
          </div>

          <div className="relative">
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
              <FaPen className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Share Your Story
            </h3>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Help us grow and get rewarded.
            </p>
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
              Add your <strong>"Keploy Story"</strong> to our GitHub Issue
              tracker and earn <strong>free credits</strong> for the AI
              platform.
            </p>

            {/* CTA */}
            <Link
              to="https://github.com/keploy/keploy/issues/3444"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-purple-400 bg-white px-5 py-2.5 text-sm font-semibold text-purple-600 transition-all duration-200 hover:bg-purple-50 hover:no-underline dark:border-purple-500 dark:bg-transparent dark:text-purple-400 dark:hover:bg-purple-900/20"
            >
              <FaGithub className="h-4 w-4" />
              Submit to GitHub Issue
            </Link>
          </div>
        </div>

        {/* GSoC Banner */}
        <div className="group relative h-full overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:col-span-6 dark:border-blue-900/50 dark:from-gray-900 dark:to-blue-950/20">
          {/* Decorative cap pattern */}
          <div className="absolute -right-4 -top-4 text-blue-200/50 dark:text-blue-700/20">
            <FaGoogle className="h-24 w-24" />
          </div>

          <div className="relative">
            {/* Icon */}
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
              <FaGoogle className="h-6 w-6" />
            </div>

            {/* Content */}
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Google Summer of Code (GSoC)
            </h3>
            <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              Contribute and get sponsored.
            </p>
            <p className="mb-5 text-sm text-gray-600 dark:text-gray-400">
              Keploy participates in GSoC. Explore this year’s project ideas and contribute to core testing workflows.
            </p>

            {/* CTA */}
            <Link
              to="https://summerofcode.withgoogle.com/archive/2025/organizations/keploy"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-blue-400 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 transition-all duration-200 hover:bg-purple-50 hover:no-underline dark:border-purple-500 dark:bg-transparent dark:text-purple-400 dark:hover:bg-purple-900/20"
            >
              <FaGoogle className="h-4 w-4" />
              View project ideas
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSupport;

