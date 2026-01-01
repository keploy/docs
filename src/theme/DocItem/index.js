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
import Layout from "@docusaurus/core/lib/client/theme-fallback/Layout";
import Head from "@docusaurus/Head";
import MDXContent from "@theme/MDXContent";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
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
  const image = assets.image ?? frontMatter.image; // We only add a title if:
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
  const articleSchema =
    pageUrl && title
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
        {modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {articleSchema && (
          <script type="application/ld+json">
            {JSON.stringify(articleSchema)}
          </script>
        )}
      </Head>
      <Layout
        {...{
          title,
          description,
          keywords: metaKeywords,
          image,
        }}
      />

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
              <DocVersionBadge />

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
                className={clsx(ThemeClassNames.docs.docMarkdown, "markdown")}
              >
                <article className="md:prose-md prose mx-auto my-12 max-w-full px-2 lg:prose-lg md:px-6">
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
                </article>
              </div>
            </article>
            <div>
              <KeployCloud />
            </div>
            <DocPaginator previous={metadata.previous} next={metadata.next} />
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
