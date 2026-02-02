//@ts-check

import {themes as prismThemes} from "prism-react-renderer";
const path = require("path");
import {visit} from "unist-util-visit";
const FontPreloadPlugin = require("webpack-font-preload-plugin");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Keploy Documentation",
  titleDelimiter: "🐰",
  tagline: "API Test Generator Tool",
  url: "https://keploy.io",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  trailingSlash: true,
  favicon: "img/favicon.png",
  organizationName: "keploy", // Usually your GitHub org/user name.
  projectName: "docs", // Usually your repo name.
  plugins: [
    function preloadFontPlugin() {
      return {
        name: "preload-font-plugin",
        configureWebpack() {
          return {
            plugins: [new FontPreloadPlugin()],
          };
        },
      };
    },
    "docusaurus-tailwindcss-loader",
  ],
  themeConfig: {
    canonicalBase: "https://www.keploy.io/",
    metadata: [
      {
        description: "Documentation for Keploy Backend Test Generator",
      },
      {
        name: "x-default",
        content: "en-us",
      },
      {
        name: "description",
        content:
          "Keploy - Open source tool that generates Regression Tests like unit tests with mocks and stubs from API calls.",
      },
      {
        name: "keywords",
        content:
          "API testing, Keploy docs, incident replay, network calls, code paths, test scenarios, code coverage, stubs, junit, go-test, live environment, production incidents, open source, regression tests, ai tests",
      },
      {name: "twitter:card", content: "summary_large_image"},
    ],
    headTags: [
      // Preconnect tag
      {
        tagName: "link",
        attributes: {
          rel: "preconnect",
          href: "https://keploy.io/",
        },
      },
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          description:
            "Keploy - Open source tool that generates integration tests like unit tests with mocks or stubs from API calls.",
          keywords:
            "API testing, incident replay, network calls, code paths, test scenarios, code coverage, stubs, junit, go-test, live environment, production incidents, open source, regression tests, ai tests",
          name: "Keploy",
          url: "https://keploy.io/",
          logo: "https://keploy.io/docs/img/favicon.png",
        }),
      },
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Organization",
          name: "Keploy",
          url: "https://keploy.io/",
          logo: "https://keploy.io/docs/img/favicon.png",
        }),
      },
      {
        tagName: "script",
        attributes: {
          type: "application/ld+json",
        },
        innerHTML: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "WebSite",
          name: "Keploy Documentation",
          url: "https://keploy.io/docs/",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://keploy.io/docs/search?q={search_term_string}",
            "query-input": "required name=search_term_string",
          },
        }),
      },
    ],
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
      // switchConfig: {
      //   darkIcon: "🌙",
      //   darkIconStyle: {
      //     content: `url(/img/moon.svg)`,
      //     transform: "scale(2)",
      //     margin: "0 0.2rem",
      //   },
      //   lightIcon: "\u{1F602}",
      //   lightIconStyle: {
      //     content: `url(/img/sun.svg)`,
      //     transform: "scale(2)",
      //   },
      // },
    },
    announcementBar: {
      id: "announcementBar_1", // Increment on change
      content: `⭐️ If you like Keploy, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/keploy/keploy">GitHub</a> and follow us on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/keployio">Twitter</a> ❤️ `,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["java", "ruby", "php", "bash"],
    },
    // hideableSidebar: true,
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: "Keploy logo",
        src: "img/keploy-logo-dark.svg",
        srcDark: "img/keploy-logo-dark.svg",
      },
      items: [
        {
          label: "Products",
          position: "left",
          items: [
            {
              label: "Integration Testing",
              to: "server/installation",
            },
            {
              label: "API Testing (AI)",
              to: "/running-keploy/api-test-generator",
            },
          ],
        },
        {
          label: "Blog",
          items: [
            {
              label: "Tech Blogs",
              href: "https://keploy.io/blog/technology",
            },
            {
              label: "Community Articles",
              href: "https://keploy.io/blog/community",
            },
            {
              label: "Glossary",
              href: "/concepts/reference/glossary/",
            },
          ],
          position: "left",
        },
        {
          to: "/keploy-explained/contribution-guide",
          label: "Contribution Guide",
          position: "left",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
        },
        {
          href: "https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg",
          position: "right",
          className: "header-slack-link",
          "aria-label": "Join our Slack community",
        },
        {
          href: "https://github.com/keploy/keploy",
          position: "right",
          className: "header-github-link",
          "aria-label": "GitHub repository",
        },
      ],
    },
    footer: {
      copyright: `
         
    <div className="footer__icons footer">
        <a href="https://github.com/keploy/keploy" aria-label="GitHub"><svg class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
        <a href="https://twitter.com/keployio" aria-label="Twitter"><svg class="footer__svg" xmlns="http://www.w3.org/2000/svg"  width="27px" height="24px" viewBox="0 0 24 24" version="1.1"><path  d="M 20.476562 0.00390625 L 24.464844 0.00390625 L 15.753906 10.167969 L 26 23.996094 L 17.976562 23.996094 L 11.691406 15.609375 L 4.503906 23.996094 L 0.511719 23.996094 L 9.828125 13.125 L 0 0.00390625 L 8.226562 0.00390625 L 13.90625 7.671875 Z M 19.078125 21.558594 L 21.285156 21.558594 L 7.027344 2.3125 L 4.65625 2.3125 Z M 19.078125 21.558594 "/>
        </g>
        </svg></a>
        <a href="https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg" aria-label="YouTube"><svg class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
        <a href="https://www.instagram.com/keploy.io/" aria-label="Instagram"><svg class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
        <a href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg" aria-label="Slack"><svg class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2447.6 2452.5">
        <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" /><path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" /><path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" /><path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"/>
        </svg></a>
        </div>
     <div className="footer__icons footer">
    <a class="footer__link-item" href="https://docs.google.com/forms/d/e/1FAIpQLSdj9q7dyRh3D7ZzRExHLWRRkNPOnLnFfrbKqSwqH3Ur4HzP4g/viewform">Have a Keploy use-case? Let's Talk!</a> 
    </div> 
      <div class="footer__copyright"><span class="footer__block">Copyright © ${new Date().getFullYear()} </span> Keploy Inc.</div>
      <div>
        <a class="footer__link-item" href="/about">About</a>
        <span class="footer__separators"> | </span>
        <a class="footer__link-item" href="https://keploy.io/docs/security/">Security</a>
        <span class="footer__separators"> | </span>
        <a class="footer__link-item" href="/privacy-policy">Privacy Policy</a>
      </div>
      `,
    },
    algolia: {
      apiKey: "c4628c331b0f4997178c879978033276",
      indexName: "keploy",
      appId: "WZTL8PLCOD",
      contextualSearch: true, // Optional, If you different version of docs etc (v1 and v2) doesn't display dup results
      // algoliaOptions: {}, // Optional, if provided by Algolia
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        // Will be passed to @docusaurus/plugin-content-docs
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          exclude: ["**/shared/**"], // do not render "shared" content
          editUrl: "https://github.com/keploy/docs/blob/master",
          /**
           * Whether to display the author who last updated the doc.
           */
          showLastUpdateAuthor: false,
          /**
           * Whether to display the last date the doc was updated.
           */
          showLastUpdateTime: false,
          /**
           * Skip the next release docs when versioning is enabled.
           * This will not generate HTML files in the production build for documents
           * in `/docs/next` directory, only versioned docs.
           */
          // excludeNextVersionDocs: false,
          lastVersion: "4.0.0",
          versions: {
            "1.0.0": {
              label: "1.0.0",
              path: "1.0.0",
              banner: "unmaintained",
            },
            "2.0.0": {
              label: "2.0.0",
              path: "2.0.0",
              banner: "unmaintained",
            },
            "3.0.0": {
              label: "3.0.0",
              path: "3.0.0",
              banner: "unmaintained",
            },
          },
          onlyIncludeVersions: ["1.0.0", "2.0.0", "3.0.0", "4.0.0"],
          includeCurrentVersion: true, // excludeNextVersionDocs is now deprecated
          // // below remark plugin disabled until we can figure out why it is not transpiling to ESNext properly - swyx
          remarkPlugins: [
            [
              () =>
                function addTSNoCheck(tree) {
                  // Disable TS type checking for any TypeScript code blocks.
                  // This is because imports are messy with snipsync: we don't
                  // have a way to pull in a separate config for every example
                  // snipsync pulls from.
                  function visitor(node) {
                    if (!/^ts$/.test(node.lang)) {
                      return;
                    }
                    node.value = "// @ts-nocheck\n" + node.value.trim();
                  }

                  visit(tree, "code", visitor);
                },
              {},
            ],
            [
              () =>
                function removeTSNoCheck(tree) {
                  function visitor(node) {
                    if (!/^ts$/.test(node.lang) && !/^js$/.test(node.lang)) {
                      return;
                    }
                    if (node.value.startsWith("// @ts-nocheck\n")) {
                      node.value = node.value.slice("// @ts-nocheck\n".length);
                    }
                    // If TS compiled output is empty, replace it with a more helpful comment
                    if (
                      node.lang === "js" &&
                      node.value.trim() === "export {};"
                    ) {
                      node.value = "// Not required in JavaScript";
                    } else if (node.lang === "js") {
                      node.value = convertIndent4ToIndent2(node.value).trim();
                    }
                  }
                  visit(tree, "code", visitor);
                },
              {},
            ],
          ],
        },
        // Will be passed to @docusaurus/plugin-content-blog
        // TODO : Add Blogging Section
        // blog: {
        //   routeBasePath: "blog",
        //   path: "blog",
        //   postsPerPage: 10,
        //   editUrl: "https://github.com/keploy/docs/blob/master",
        //   blogTitle: "Keploy Blog",
        //   showReadingTime: true, // Show estimated reading time for the blog post.
        //   feedOptions: {
        //     type: "all",
        //     copyright: `Copyright © ${new Date().getFullYear()} Keploy Inc.  All rights reserved.`,
        //   },
        // },
        // Will be passed to @docusaurus/theme-classic.
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-LLS95VWZPC",
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
        // Will be passed to @docusaurus/plugin-content-sitemap
        sitemap: {
          // Per v2.0.0-alpha.72 cacheTime is now deprecated
          //cacheTime: 600 * 1000, // 600 sec - cache purge period
          changefreq: "weekly",
          priority: 0.5,
        },
      },
    ],
  ],

  scripts: [
    {
      src: "/docs/scripts/feedback.js",
      async: true,
      defer: true,
    },
    {
      src: "/docs/scripts/clarity.js",
      async: true,
      defer: true,
    },
    {
      src: "/docs/js/apollo-init.js",
      async: true,
      defer: true,
    },
    /*{
      src: "/docs/scripts/chat.js",
      async: true,
      defer: true,
    },
     {
       src: "/scripts/fullstory.js",
       async: true,
       defer: true,
     },*/
  ],
};

function convertIndent4ToIndent2(code) {
  // TypeScript always outputs 4 space indent. This is a workaround.
  // See https://github.com/microsoft/TypeScript/issues/4042
  return code.replace(/^( {4})+/gm, (match) => {
    return "  ".repeat(match.length / 4);
  });
}
