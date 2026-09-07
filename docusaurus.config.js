//@ts-check

import {themes as prismThemes} from "prism-react-renderer";
const path = require("path");
const remarkFaqSchema = require("./src/remark/remarkFaqSchema");
const {siteGraph} = require("./src/schema/siteEntities");
const fs = require("fs");
const remarkImageSize = require("./src/remark/remarkImageSize");
import {visit} from "unist-util-visit";
const FontPreloadPlugin = require("webpack-font-preload-plugin");

// Single source of truth for the "current" docs version. Update this one
// value when cutting a new docs version -- it drives both the versioning
// config (lastVersion/versions/onlyIncludeVersions) and docusaurus-plugin-llms's
// docsDir, which otherwise have to be kept in sync by hand.
const CURRENT_DOCS_VERSION = "4.0.0";

// Curated "About Keploy" content (positioning, awards, links) maintained by
// the content team. Fed into docusaurus-plugin-llms via rootContent/fullRootContent
// instead of living in static/, because static/ files get overwritten by the
// plugin's postBuild step when they share a filename with its generated output
// (llms.txt / llms-full.txt) -- this was silently discarding the curated content.
const llmsRootContent = fs.readFileSync(
  path.join(__dirname, "content/llms-root.txt"),
  "utf8"
);
const llmsFullRootContent = fs.readFileSync(
  path.join(__dirname, "content/llms-full-root.txt"),
  "utf8"
);

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  headTags: [
    // DM Sans is now self-hosted (see src/css/custom.css @font-face). The
    // render-blocking Google Fonts stylesheet + its two preconnects
    // (fonts.googleapis.com / fonts.gstatic.com) were removed here to cut the
    // font from the critical render path and drop us to <=4 preconnects.
    // Preload the latin woff2 so it loads in parallel with the CSS instead of
    // being discovered only after the stylesheet parses (html -> css -> font
    // chain). crossorigin is required even same-origin for font preloads.
    {
      tagName: "link",
      attributes: {
        rel: "preload",
        href: "/docs/fonts/DMSans-latin.woff2",
        as: "font",
        type: "font/woff2",
        crossorigin: "anonymous",
      },
    },
    // DM Sans @font-face (self-hosted from static/fonts). Inlined here rather
    // than in custom.css because webpack's css-loader can't resolve the stable
    // /docs/fonts/ URL from within src/css. Variable font, weights 400-700,
    // font-display:swap; latin + latin-ext subsets.
    {
      tagName: "style",
      attributes: {},
      innerHTML: `
@font-face{font-family:"DM Sans";src:url("/docs/fonts/DMSans-latin.woff2") format("woff2");font-weight:400 700;font-style:normal;font-display:swap;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;}
@font-face{font-family:"DM Sans";src:url("/docs/fonts/DMSans-latin-ext.woff2") format("woff2");font-weight:400 700;font-style:normal;font-display:swap;unicode-range:U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;}`,
    },
    // Preconnect tag
    {
      tagName: "link",
      attributes: {
        rel: "preconnect",
        href: "https://keploy.io/",
      },
    },
    // Site-wide entity graph (Organization, WebSite, SoftwareApplication).
    // These used to be three sibling <script> blocks, each re-declaring its
    // own publisher, which left several disconnected Organization nodes on
    // every page. They now share one graph and are addressable by `@id`, so
    // per-page schema can point at them instead of copying them.
    {
      tagName: "script",
      attributes: {
        type: "application/ld+json",
      },
      innerHTML: JSON.stringify(siteGraph),
    },
    // Meta Pixel Code — fires eagerly (init + PageView) on load so conversion
    // tracking is accurate from the first paint. Intentionally NOT deferred.
    // SPA route changes re-fire PageView from src/metaPixelRouteTracker.js.
    {
      tagName: "script",
      attributes: {},
      innerHTML: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2006330080011702');
fbq('track', 'PageView');`,
    },
    {
      tagName: "noscript",
      attributes: {},
      innerHTML: `<img height="1" width="1" style="display:none" alt="" src="https://www.facebook.com/tr?id=2006330080011702&ev=PageView&noscript=1" />`,
    },
    // End Meta Pixel Code
  ],
  title: "Keploy Documentation",
  // Plain "|" delimiter for React-page <title>s (about, security, …). The old
  // "🐰" put an emoji in SERP titles; this keeps them clean and aligns with the
  // "|" suffix the docs theme (DocItem) uses.
  titleDelimiter: "|",
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
    // D11: emit full source maps for the client bundle so first-party JS is
    // debuggable in production (error tracking / DevTools). Server bundle keeps
    // its default — no new dependency, no runtime impact, just extra .map files.
    function clientSourceMapsPlugin() {
      return {
        name: "client-source-maps",
        configureWebpack(_config, isServer) {
          if (isServer) return {};
          return {devtool: "source-map"};
        },
      };
    },
    "docusaurus-tailwindcss-loader",
    [
      "docusaurus-plugin-llms",
      {
        docsDir: `versioned_docs/version-${CURRENT_DOCS_VERSION}`,
        ignoreFiles: ["**/shared/**"],
        description:
          "Technical documentation for Keploy, an open-source AI-powered testing agent and sandboxing platform that automatically generates test cases, dependency mocks, and production-like sandboxes from real user traffic using eBPF kernel technology. Keploy keeps testing aligned with AI-driven code velocity — achieving 90% test coverage in minutes with zero code changes.",
        rootContent: llmsRootContent,
        fullRootContent: llmsFullRootContent,
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        generateMarkdownFiles: true,
        preserveDirectoryStructure: false,
        excludeImports: true,
      },
    ],
  ],
  themeConfig: {
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 2,
    },
    canonicalBase: "https://keploy.io/",
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
      {
        // 1200x630 card committed to this repo (static/img/), so it can't 404
        // from a change in the landing app. The old
        // https://keploy.io/images/keploy-hero.png returned the landing app's
        // 404 page, breaking every social/OG preview and the Article schema
        // image fallback that reused it.
        property: "og:image",
        content: "https://keploy.io/docs/img/keploy-docs-card.png",
      },
      {property: "og:image:width", content: "1200"},
      {property: "og:image:height", content: "630"},
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
    // announcementBar: {
    //   id: "announcementBar_gittogether_sf_2026", // Increment on change to reset dismissed state
    //   content: "GitTogether SF • May 14, 2026 • San Francisco",
    //   isCloseable: true,
    // },
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
              to: "server/install",
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
          href: "https://keploy.io/slack",
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
        <a href="https://github.com/keploy/keploy" aria-label="GitHub"><svg aria-hidden="true" focusable="false" class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
        <a href="https://twitter.com/keployio" aria-label="Twitter"><svg aria-hidden="true" focusable="false" class="footer__svg" xmlns="http://www.w3.org/2000/svg"  width="27px" height="24px" viewBox="0 0 24 24" version="1.1"><path  d="M 20.476562 0.00390625 L 24.464844 0.00390625 L 15.753906 10.167969 L 26 23.996094 L 17.976562 23.996094 L 11.691406 15.609375 L 4.503906 23.996094 L 0.511719 23.996094 L 9.828125 13.125 L 0 0.00390625 L 8.226562 0.00390625 L 13.90625 7.671875 Z M 19.078125 21.558594 L 21.285156 21.558594 L 7.027344 2.3125 L 4.65625 2.3125 Z M 19.078125 21.558594 "/>
        </g>
        </svg></a>
        <a href="https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg" aria-label="YouTube"><svg aria-hidden="true" focusable="false" class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></a>
        <a href="https://www.instagram.com/keploy.io/" aria-label="Instagram"><svg aria-hidden="true" focusable="false" class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
        <a href="https://keploy.io/slack" aria-label="Slack"><svg aria-hidden="true" focusable="false" class="footer__svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 2447.6 2452.5">
        <path d="m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z" /><path d="m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z" /><path d="m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z" /><path d="m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0"/>
        </svg></a>
        </div>
     <div className="footer__icons footer">
    <a class="footer__link-item" href="https://calendar.app.google/cXVaj6hbMUjvmrnt9" target="_blank" rel="noopener noreferrer"> Have a Keploy use-case? Let's Talk!</a> 
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
          showLastUpdateAuthor: true,
          /**
           * Whether to display the last date the doc was updated.
           */
          showLastUpdateTime: true,
          /**
           * Skip the next release docs when versioning is enabled.
           * This will not generate HTML files in the production build for documents
           * in `/docs/next` directory, only versioned docs.
           */
          // excludeNextVersionDocs: false,
          lastVersion: CURRENT_DOCS_VERSION,
          versions: {
            [CURRENT_DOCS_VERSION]: {
              label: "3.0.0",
            },
            "1.0.0": {
              label: "1.0.0",
              path: "1.0.0",
              banner: "unmaintained",
              noIndex: true,
            },
            "2.0.0": {
              label: "2.0.0",
              path: "2.0.0",
              banner: "unmaintained",
              noIndex: true,
            },
          },
          onlyIncludeVersions: ["1.0.0", "2.0.0", CURRENT_DOCS_VERSION],
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
            // D5 (CLS): stamp intrinsic width/height onto raw <img> tags so the
            // browser reserves layout space. Docusaurus already sizes Markdown
            // images natively, so this only touches hand-written <img>.
            // Dependency-free; skips remote/relative/webp/svg and never
            // overwrites author dimensions.
            remarkImageSize,
            // Emit FAQPage JSON-LD (Question/Answer) for FAQ docs so they are
            // eligible for FAQ rich results and AI extraction.
            remarkFaqSchema,
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
        // GA fires eagerly via the standard gtag preset (loads on page load +
        // auto-tracks SPA route changes) so analytics are accurate from the
        // first paint. Intentionally NOT idle-deferred.
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
          filename: "sitemap.xml",
          // Differentiate docs sitemap priorities by content type so
          // search engines spend crawl budget proportional to how
          // canonical each page is. Priority buckets:
          //   1.0  → /docs/ root (highest — primary entry point)
          //   0.9  → /docs/quickstart/* (highest-intent user flow)
          //   0.8  → /docs/running-keploy/* (primary product docs)
          //   0.7  → /docs/concepts/*, /docs/keploy-explained/*
          //   0.6  → /docs/keploy-cloud/*, /docs/ci-cd/*
          //   0.6  → /docs/keploy-explained/*-faq/ (3 FAQ pages) and
          //          /docs/keploy-explained/common-errors/ (troubleshooting)
          //          — reference-style, lower crawl priority than core docs
          //   0.5  → /docs/concepts/reference/glossary/* (long-tail
          //          glossary; noindexed legacy versions excluded via
          //          netlify headers + robots.txt)
          //
          // Also exclude auto-generated tag indexes and the unmaintained
          // 1.0.0 / 2.0.0 doc versions from the sitemap. Those versions
          // additionally carry `noIndex: true` via their `versions` config
          // above; excluding from the sitemap signals that they should not
          // be ranked at all.
          //
          // Docusaurus matches `ignorePatterns` against the full route path
          // including `baseUrl` (`/docs/`), so the patterns must carry that
          // prefix — bare `/tags/**` and `/1.0.0/**` would never match the
          // emitted `/docs/tags/...` and `/docs/1.0.0/...` routes. Bare
          // patterns are kept as defence-in-depth in case `baseUrl` is ever
          // flattened to `/`.
          ignorePatterns: [
            "/docs/tags/**",
            "/docs/1.0.0/**",
            "/docs/2.0.0/**",
            "/tags/**",
            "/1.0.0/**",
            "/2.0.0/**",
          ],
          createSitemapItems: async (params) => {
            const {defaultCreateSitemapItems, ...rest} = params;
            const items = await defaultCreateSitemapItems(rest);
            return items.map((item) => {
              const url = item.url;
              // The /docs/ home page is the highest-priority entry point
              // for the whole docs subtree.
              if (url.endsWith("/docs/") || url.endsWith("/docs")) {
                return {...item, priority: 1.0, changefreq: "weekly"};
              }
              if (url.includes("/quickstart/")) {
                return {...item, priority: 0.9, changefreq: "weekly"};
              }
              if (url.includes("/running-keploy/")) {
                return {...item, priority: 0.8, changefreq: "weekly"};
              }
              if (url.includes("/concepts/reference/glossary/")) {
                // Glossary entries are numerous, long-tail, and often
                // off-topic for core product queries. Keep them in the
                // sitemap but mark them low priority.
                return {...item, priority: 0.5, changefreq: "monthly"};
              }
              // FAQ + troubleshooting match FIRST, because these pages live
              // under /keploy-explained/ in the v4 docs (e.g.
              // /docs/keploy-explained/integration-testing-faq/,
              // /docs/keploy-explained/api-testing-faq/,
              // /docs/keploy-explained/unit-testing-faq/,
              // /docs/keploy-explained/common-errors/ — "common-errors" is
              // the troubleshooting guide, labelled "Troubleshooting Guide"
              // in the sidebar). Without matching first, they would be
              // captured by the /keploy-explained/ rule below and get
              // priority 0.7 instead of the intended 0.6.
              if (
                url.includes("-faq/") ||
                url.includes("-faq") ||
                url.includes("/common-errors")
              ) {
                return {...item, priority: 0.6, changefreq: "monthly"};
              }
              if (
                url.includes("/concepts/") ||
                url.includes("/keploy-explained/")
              ) {
                return {...item, priority: 0.7, changefreq: "weekly"};
              }
              if (url.includes("/keploy-cloud/") || url.includes("/ci-cd/")) {
                return {...item, priority: 0.6, changefreq: "monthly"};
              }
              return item;
            });
          },
        },
      },
    ],
  ],

  clientModules: [require.resolve("./src/metaPixelRouteTracker.js")],
  scripts: [
    // Analytics loading (see src/metaPixelRouteTracker.js for the full strategy):
    //   - GA          -> eager via the gtag preset (auto SPA tracking)
    //   - Meta Pixel  -> eager via the inline snippet in headTags; SPA re-fire
    //                    from the client module
    //   - Clarity + Apollo -> lazy, on first user interaction (client module)
    //   - Hotjar      -> removed
    // keploy's own first-party telemetry (~2 KiB) stays eager below.
    {
      src: "https://telemetry.keploy.io/sessions/sdk.js",
      async: true,
      defer: true,
      "data-endpoint": "https://telemetry.keploy.io/sessions/collect",
      "data-source": "docs",
    },
  ],
};

function convertIndent4ToIndent2(code) {
  // TypeScript always outputs 4 space indent. This is a workaround.
  // See https://github.com/microsoft/TypeScript/issues/4042
  return code.replace(/^( {4})+/gm, (match) => {
    return "  ".repeat(match.length / 4);
  });
}
