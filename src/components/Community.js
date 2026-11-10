import React from "react";
import Head from "@docusaurus/Head";
import {
  FaYoutube,
  FaGithub,
  FaSlack,
  FaRss,
  FaArrowRight,
} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";
import {HiOutlineNewspaper} from "react-icons/hi2";

const communityLinks = [
  {
    title: "Slack",
    desc: "Live support, discussions, and quick answers.",
    href: "https://keploy.io/slack",
    Icon: FaSlack,
  },
  {
    title: "GitHub",
    desc: "Star the repo, report issues, and follow releases.",
    href: "https://github.com/keploy",
    Icon: FaGithub,
  },
  {
    title: "YouTube",
    desc: "Tutorials, demos, and community meetups.",
    href: "https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg",
    Icon: FaYoutube,
  },
  {
    title: "Substack",
    desc: "Ideas worth reading—delivered to your inbox.",
    href: "https://testgpt.substack.com/",
    Icon: HiOutlineNewspaper,
  },
  {
    title: "X (Twitter)",
    desc: "News, events, and product updates.",
    href: "https://twitter.com/keployio",
    Icon: FaXTwitter,
  },
  {
    title: "Blog",
    desc: "Deep dives on testing, mocks, and API reliability.",
    href: "https://keploy.io/blog",
    Icon: FaRss,
  },
];

// ItemList of the community channels so search engines and AI can enumerate
// the official places to reach Keploy. Built from the same `communityLinks`
// data the cards render, so the structured data never drifts from the UI.
const communitySchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Keploy community channels",
  itemListElement: communityLinks.map((link, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: link.title,
    description: link.desc,
    url: link.href,
  })),
};

export const Community = () => {
  return (
    <section className="kd-community" id="community">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(communitySchema)}
        </script>
      </Head>
      {/* Section Header: same shape as the other home sections */}
      <div className="kd-community__head">
        <h2>Community</h2>
        <p>
          Get help, learn best practices, and stay updated through the channels
          you already use.
        </p>
      </div>

      {/* Community Links Grid */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {communityLinks.map(({title, desc, href, Icon}) => (
          <a
            key={title}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="kd-community__card group flex items-start gap-4 p-4 transition-all duration-200 hover:no-underline"
          >
            <div className="kd-community__icon flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <Icon className="kd-community__glyph" />
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

      {/* Demo CTA */}
      <div className="kd-community__demo p-6">
        <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
          <div className="text-center md:text-left">
            <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
              Want to see a demo of Keploy?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your use-case, workflow—and we'll help with any resources
              you need.
            </p>
          </div>
          <a
            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2l-psdTCNCLYAJ-Jt5ESyGP7gi1_U70ySTjtFNr0Kmx5UagNJnyzg7lNjA3NKnaP6qFfpAgcdZ"
            target="_blank"
            rel="noopener noreferrer"
            className="kd-community__cta inline-flex flex-shrink-0 items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold hover:no-underline"
          >
            Book a Demo
            <FaArrowRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
