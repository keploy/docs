import React from "react";
import { FaYoutube, FaGithub, FaSlack, FaRss, FaArrowRight } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiOutlineNewspaper } from "react-icons/hi2";

const communityLinks = [
  {
    title: "Slack",
    desc: "Live support, discussions, and quick answers.",
    href: "https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg",
    Icon: FaSlack,
    iconColor: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
  {
    title: "GitHub",
    desc: "Star the repo, report issues, and follow releases.",
    href: "https://github.com/keploy",
    Icon: FaGithub,
    iconColor: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-100 dark:bg-gray-700/50",
  },
  {
    title: "YouTube",
    desc: "Tutorials, demos, and community meetups.",
    href: "https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg",
    Icon: FaYoutube,
    iconColor: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-900/30",
  },
  {
    title: "Substack",
    desc: "Ideas worth reading—delivered to your inbox.",
    href: "https://testgpt.substack.com/",
    Icon: HiOutlineNewspaper,
    iconColor: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    title: "X (Twitter)",
    desc: "News, events, and product updates.",
    href: "https://twitter.com/keployio",
    Icon: FaXTwitter,
    iconColor: "text-gray-800 dark:text-gray-200",
    bgColor: "bg-gray-100 dark:bg-gray-700/50",
  },
  {
    title: "Blog",
    desc: "Deep dives on testing, mocks, and API reliability.",
    href: "https://keploy.io/blog",
    Icon: FaRss,
    iconColor: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
  },
];

export const Community = () => {
  return (
    <section className="mb-16" id="community">
      {/* Section Header */}
      <div className="mb-8 text-center">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
          💬 Community
        </span>
        <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Connect with the Keploy community
        </h2>
        <p className="mx-auto max-w-2xl text-base text-gray-600 dark:text-gray-400">
          Get help, learn best practices, and stay updated—through the channels you already use.
        </p>
      </div>

      {/* Community Links Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {communityLinks.map(({ title, desc, href, Icon, iconColor, bgColor }) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-orange-300 hover:shadow-md hover:no-underline dark:border-gray-700 dark:bg-gray-800/50 dark:hover:border-orange-500/50"
          >
            <div
              className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${bgColor}`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <FaArrowRight className="h-3 w-3 flex-shrink-0 text-gray-400 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-orange-500 dark:text-gray-500" />
              </div>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {desc}
              </p>
            </div>
          </a>
        ))}
      </div>

      {/* Enterprise Demo CTA */}
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6 dark:border-gray-700 dark:from-gray-800/80 dark:to-gray-900/80">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
              Want to see a demo of Keploy Enterprise?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your use-case, workflow—and we'll help with any resources you need.
            </p>
          </div>
          <a
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2l-psdTCNCLYAJ-Jt5ESyGP7gi1_U70ySTjtFNr0Kmx5UagNJnyzg7lNjA3NKnaP6qFfpAgcdZ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-gray-800 hover:text-white hover:no-underline dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 dark:hover:text-gray-900"
          >
            Book a Demo
            <FaArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
