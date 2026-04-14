/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from "react";
import clsx from "clsx";
import DocPaginator from "@theme/DocPaginator";
import DocVersionBanner from "@theme/DocVersionBanner";
import DocVersionBadge from "@theme/DocVersionBadge";
// import Seo from "@theme/Seo";
import TOC from "@theme/TOC";
import TOCCollapsible from "@theme/TOCCollapsible";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import {ThemeClassNames, useWindowSize} from "@docusaurus/theme-common";
import DocBreadcrumbs from "@theme/DocBreadcrumbs";
import Link from "@docusaurus/Link";
import Head from "@docusaurus/Head";
import MDXContent from "@theme/MDXContent";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {useDocsVersion} from "@docusaurus/plugin-content-docs/client";
import {KeployCloud} from "@site/src/components/KeployCloud";

export default function DocItem(props) {
  const {content: DocContent} = props;
  const {metadata, frontMatter, assets} = DocContent;
  const {
    keywords: frontMatterKeywords,
    hide_title: hideTitle,
    hide_table_of_contents: hideTableOfContents,
    toc_min_heading_level: tocMinHeadingLevel,
    toc_max_heading_level: tocMaxHeadingLevel,
  } = frontMatter;
  const {description, title} = metadata;

  // Get current version info to hide badge on latest version
  let isLatestVersion = true;
  try {
    const versionInfo = useDocsVersion();
    isLatestVersion = versionInfo?.isLast ?? true;
  } catch (e) {
    // If hook fails, assume latest version
    isLatestVersion = true;
  }

  // We only add a title if:
  // - user asks to hide it with front matter
  // - the markdown content does not already contain a top-level h1 heading

  const shouldAddTitle =
    !hideTitle && typeof DocContent.contentTitle === "undefined";
  const windowSize = useWindowSize();
  const canRenderTOC =
    !hideTableOfContents && DocContent.toc && DocContent.toc.length > 0;
  const renderTocDesktop =
    canRenderTOC && (windowSize === "desktop" || windowSize === "ssr");
  const {siteConfig} = useDocusaurusContext();
  const toIsoDate = (value) => {
    if (!value) {
      return null;
    }
    const isEpochSeconds = Number.isFinite(value) && value < 1e12;
    const date = new Date(isEpochSeconds ? value * 1000 : value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString();
  };
  const toAbsoluteUrl = (baseUrl, url) => {
    if (!url) {
      return null;
    }
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const trimmedBase = baseUrl?.replace(/\/$/, "") ?? "";
    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${trimmedBase}${normalizedPath}`;
  };
  const toArray = (value) => {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  };
  const toPersonList = (value) => {
    return toArray(value)
      .map((item) => {
        if (!item) {
          return null;
        }
        if (typeof item === "string") {
          return {["@type"]: "Person", name: item};
        }
        if (item.name) {
          return {
            "@type": "Person",
            name: item.name,
            ...(item.url ? {url: item.url} : {}),
          };
        }
        return null;
      })
      .filter(Boolean);
  };
  const pageUrl = toAbsoluteUrl(siteConfig?.url, metadata?.permalink);
  const modifiedTime = toIsoDate(
    metadata?.lastUpdatedAt || frontMatter?.lastUpdatedAt
  );
  const publishedTime = toIsoDate(
    frontMatter?.date || frontMatter?.publishedAt
  );
  const schemaTypeFromFrontMatter =
    frontMatter?.schemaType || frontMatter?.schema_type;
  const isApi =
    frontMatter?.apiReference === true ||
    frontMatter?.type === "api" ||
    (frontMatter?.tags || []).includes?.("api");
  const isBlog =
    frontMatter?.type === "blog" ||
    frontMatter?.blog === true ||
    (frontMatter?.tags || []).includes?.("blog");
  const schemaType = schemaTypeFromFrontMatter
    ? schemaTypeFromFrontMatter
    : isApi
    ? "APIReference"
    : isBlog
    ? "BlogPosting"
    : "Article";
  const authorList = toPersonList(frontMatter?.author || frontMatter?.authors);
  const maintainerList = toPersonList(frontMatter?.maintainer);
  const contributorList = toPersonList(frontMatter?.contributor);
  const combinedContributors = [...maintainerList, ...contributorList];
  const keywords = frontMatter?.keywords || metadata?.keywords;
  const metaKeywords = frontMatterKeywords ?? metadata?.keywords;
  const programmingLanguage =
    frontMatter?.programmingLanguage || frontMatter?.programmingLanguages;
  const targetPlatform = frontMatter?.targetPlatform;
  const proficiencyLevel = frontMatter?.proficiencyLevel;
  const currentYear = new Date().getFullYear();
  const image = assets?.image ?? frontMatter?.image;
  const imageWithBaseUrl = useBaseUrl(image || "");
  const socialImage = image
    ? toAbsoluteUrl(siteConfig?.url, imageWithBaseUrl)
    : null;
  const normalizedMetaKeywords = Array.isArray(metaKeywords)
    ? metaKeywords.join(", ")
    : metaKeywords;
  // Suppress Article / BlogPosting / APIReference schema on the /docs/
  // root and any category index pages. Article schema on a hub page is
  // a type mismatch because a hub does not have a single author, a
  // single publication date, or a single headline — it is an index of
  // content. Hub pages emit only the normal DocBreadcrumbs JSON-LD.
  const permalink = metadata?.permalink || "";
  const isDocsRoot =
    permalink === "/docs/" ||
    permalink === "/docs" ||
    permalink.endsWith("/docs/index") ||
    permalink.endsWith("/docs/");
  const isCategoryIndex =
    frontMatter?.slug === "index" || /\/category\/|\/index\/?$/.test(permalink);
  const suppressArticleSchema = isDocsRoot || isCategoryIndex;

  const articleSchema =
    pageUrl && title && !suppressArticleSchema
      ? {
          "@context": "https://schema.org",
          "@type": schemaType,
          headline: title,
          description,
          ...(modifiedTime ? {dateModified: modifiedTime} : {}),
          ...(publishedTime ? {datePublished: publishedTime} : {}),
          ...(keywords ? {keywords} : {}),
          ...(authorList.length ? {author: authorList} : {}),
          ...(combinedContributors.length
            ? {contributor: combinedContributors}
            : {}),
          ...(proficiencyLevel ? {proficiencyLevel} : {}),
          ...(programmingLanguage ? {programmingLanguage} : {}),
          ...(targetPlatform ? {targetPlatform} : {}),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
          },
          publisher: {
            "@type": "Organization",
            name: "Keploy",
            logo: {
              "@type": "ImageObject",
              url: "https://keploy.io/docs/img/favicon.png",
            },
          },
        }
      : null;
  const MDXComponent = props.content;
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {normalizedMetaKeywords && (
          <meta name="keywords" content={normalizedMetaKeywords} />
        )}
        {/* Per-page og:title and og:description override the
            docusaurus.config.js site-level defaults, which would
            otherwise emit the same og:title on every docs page
            regardless of content. Social card previews now reflect
            the actual page title. */}
        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta name="twitter:title" content={title} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        {socialImage && <meta property="og:image" content={socialImage} />}
        {socialImage && <meta name="twitter:image" content={socialImage} />}
        {socialImage && (
          <meta name="twitter:card" content="summary_large_image" />
        )}
        {modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {articleSchema && (
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </script>
        )}
      </Head>
      <div className="row">
        <div
          className={clsx("col", {
            [styles.docItemCol]: !hideTableOfContents,
          })}
        >
          <DocVersionBanner />
          <div className={styles.docItemContainer}>
            <article>
              {/*Removing breadcrumb as the component is downranking SEO. not a valid breadcrumb component according to schema.org */}
              <DocBreadcrumbs />

              {/* Meta row: version badge (on older versions) - sits between breadcrumbs and H1 */}
              <div className="doc-meta-row">
                {!isLatestVersion && <DocVersionBadge />}
              </div>
              {canRenderTOC && (
                <TOCCollapsible
                  toc={DocContent.toc}
                  minHeadingLevel={tocMinHeadingLevel}
                  maxHeadingLevel={tocMaxHeadingLevel}
                  className={clsx(
                    ThemeClassNames.docs.docTocMobile,
                    styles.tocMobile
                  )}
                />
              )}

              <div
                className={clsx(
                  ThemeClassNames.docs.docMarkdown,
                  "markdown",
                  "md:prose-md prose mx-auto my-12 max-w-full px-2 lg:prose-lg md:px-6"
                )}
              >
                {/*
                Title can be declared inside md content or declared through
                front matter and added manually. To make both cases consistent,
                the added title is added under the same div.markdown block
                See https://github.com/facebook/docusaurus/pull/4882#issuecomment-853021120
                */}
                {shouldAddTitle && (
                  <header>
                    <Heading as="h1">{title}</Heading>
                  </header>
                )}
                <MDXContent>
                  <MDXComponent />
                </MDXContent>
              </div>
            </article>
            <div>
              <KeployCloud />
            </div>
            <DocPaginator previous={metadata.previous} next={metadata.next} />
            <footer className="docs-inline-footer" aria-label="Docs footer">
              <div className="docs-inline-footer__social">
                <a href="https://github.com/keploy/keploy" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.75-1.33-1.75-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23A11.4 11.4 0 0 1 12 6.8c1.02.01 2.05.14 3 .4 2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
                  </svg>
                </a>
                <a href="https://twitter.com/keployio" aria-label="X">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.3l-4.9-6.29L6.6 22H3.5l7.23-8.26L1 2h6.37l4.43 5.69L18.9 2Zm-1.1 18h1.76L6.4 3.9H4.52L17.8 20Z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.62 3.18c-3.6-.25-11.63-.24-15.23 0C.49 3.45.03 5.8 0 12c.03 6.19.48 8.55 4.38 8.82 3.6.24 11.63.25 15.23 0 3.9-.27 4.36-2.62 4.39-8.82-.03-6.18-.49-8.55-4.39-8.82ZM9 16V8l8 4-8 4Z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/keploy.io/"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm9.1 1.4a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z" />
                  </svg>
                </a>
                <a
                  href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg"
                  aria-label="Slack"
                >
                  <span
                    className="docs-inline-footer__slack"
                    aria-hidden="true"
                  />
                </a>
              </div>
              <div className="docs-inline-footer__usecase">
                <a
                  href="https://calendar.app.google/cXVaj6hbMUjvmrnt9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Have a Keploy use-case? Let&apos;s Talk!
                </a>
              </div>
              <div className="docs-inline-footer__meta">
                <span>Copyright © {currentYear} Keploy Inc.</span>
                <div className="docs-inline-footer__links">
                  <a href="https://keploy.io/about">About</a>
                  <span className="docs-inline-footer__sep">|</span>
                  <Link to="/security">Security</Link>
                  <span className="docs-inline-footer__sep">|</span>
                  <a href="https://keploy.io/legal/privacy-policy">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {renderTocDesktop && (
          <div className="col col--3">
            <TOC
              toc={DocContent.toc}
              minHeadingLevel={tocMinHeadingLevel}
              maxHeadingLevel={tocMaxHeadingLevel}
              className={ThemeClassNames.docs.docTocDesktop}
            />
          </div>
        )}
      </div>
    </>
  );
}
