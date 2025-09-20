//@ts-check

import { themes as prismThemes } from "prism-react-renderer";
const path = require("path");
import { visit } from "unist-util-visit";
const FontPreloadPlugin = require("webpack-font-preload-plugin");

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "Keploy Documentation",
  titleDelimiter: "🐰",
  tagline: "API Test Generator Tool",
  url: "https://keploy.io",
  baseUrl: "/docs/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
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
      { name: "twitter:card", content: "summary_large_image" },
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
    ],
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
    },
    announcementBar: {
      id: "announcementBar_1", // Increment on change
      content: `
        ✨ If you like Keploy, give it a star on&nbsp;
        <a class="announcementBarLink" target="_blank" rel="noopener noreferrer" href="https://github.com/keploy/keploy">GitHub</a>&nbsp;and follow us on&nbsp;
        <a class="announcementBarLink" target="_blank" rel="noopener noreferrer" href="https://twitter.com/keployio">Twitter</a>&nbsp;❤️
      `,
    },
    prism: {
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["java", "ruby", "php", "bash"],
    },
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
            {
              label: "Unit Testing",
              to: "/running-keploy/utg-pr-agent",
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
        <a href="https://github.com/keploy/keploy" aria-label="GitHub"><svg class="footer__svg" ... /></a>
        <a href="https://twitter.com/keployio" aria-label="Twitter"><svg class="footer__svg" ... /></a>
        <a href="https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg" aria-label="YouTube"><svg class="footer__svg" ... /></a>
        <a href="https://www.instagram.com/keploy.io/" aria-label="Instagram"><svg class="footer__svg" ... /></a>
        <a href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg" aria-label="Slack"><svg class="footer__svg" ... /></a>
        </div>
     <div className="footer__icons footer">
    <a class="footer__link-item" href="https://docs.google.com/forms/d/e/1FAIpQLSdj9q7dyRh3D7ZzRExHLWRRkNPOnLnFfrbKqSwqH3Ur4HzP4g/viewform">Have a Keploy use-case? Let's Talk!</a> 
    </div> 
      <div class="footer__copyright"><span class="footer__block">Copyright © ${new Date().getFullYear()}</span> Keploy Inc.</div>
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
      contextualSearch: true,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          exclude: ["**/shared/**"], // do not render "shared" content
          editUrl: "https://github.com/keploy/docs/blob/master",
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          lastVersion: "3.0.0",
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
          },
          onlyIncludeVersions: ["1.0.0", "2.0.0", "3.0.0"],
          includeCurrentVersion: true,
          remarkPlugins: [
            [
              () =>
                function addTSNoCheck(tree) {
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
                    if (node.lang === "js" && node.value.trim() === "export {};") {
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
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
        gtag: {
          trackingID: "G-LLS95VWZPC",
          anonymizeIP: true,
        },
        sitemap: {
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
      src: "/docs/scripts/chat.js",
      async: true,
      defer: true,
    },
    {
      src: "/scripts/fullstory.js",
      async: true,
      defer: true,
    },
  ],
};

function convertIndent4ToIndent2(code) {
  return code.replace(/^( {4})+/gm, (match) => {
    return "  ".repeat(match.length / 4);
  });
}
