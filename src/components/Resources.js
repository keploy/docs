import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import Link from "@docusaurus/Link";

const links = [
  {
    type: "video",
    title: "AI Powered API testing",
    length: "1 min watch",
    url: "https://youtu.be/W6kh-TCUQH0?feature=shared",
  },
  {
    type: "article",
    title: "What's Keploy?",
    length: "3-20 min reads",
    url: "/keploy-explained/introduction",
  },
  {
    type: "article",
    title: "Installation Guide",
    length: "10 min read",
    url: "/server/installation/",
  },
  {
    type: "article",
    title: "QuickStart with Go Sample App",
    length: "10 min read",
    url: "/quickstart/samples-gin",
  },
  {
    type: "article",
    title: "Why Keploy?",
    length: "1 min read",
    url: "/keploy-explained/why-keploy",
  },
  {
    type: "video",
    title: "Demo Video of Keploy",
    length: "2 min watch",
    url: "https://www.youtube.com/watch?v=23yQaY81Zho",
  },
];

export const Resources = () => {
  return (
    <section className="mb-4 mt-12">
      <h2 className="mb-4 text-2xl font-semibold tracking-wide md:text-3xl">
        Quick Links
      </h2>
      <ul className="mt-5 flex flex-col space-y-3 text-lg">
        {links.map((link, i) => (
          <li key={i} className="flex items-center space-x-3 hover:underline">
            {link.type === "article" ? (
              // Article Link Icon
              <svg
                className="h-7 w-7 text-[color:var(--ifm-color-primary-dark)]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              // Other Link Icon (e.g., video, documentation)
              <svg
                className="h-7 w-7 text-[color:var(--ifm-color-primary-dark)]"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {/* Link Text */}
            <Link className="flex-1" to={useBaseUrl(link.url)}>
              {link.title}{" "}
              <span className="text-xs uppercase opacity-80">
                {link.length}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
