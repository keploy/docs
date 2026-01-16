/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from "react";
import clsx from "clsx";
import {ThemeClassNames} from "@docusaurus/theme-common";
import {useSidebarBreadcrumbs} from "@docusaurus/plugin-content-docs/client";
import {useHomePageRoute} from "@docusaurus/theme-common/internal";
import {useLocation} from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import {translate} from "@docusaurus/Translate";
import Head from "@docusaurus/Head";
import HomeBreadcrumbItem from "@theme/DocBreadcrumbs/Items/Home";

import styles from "./styles.module.css";

function BreadcrumbsItemLink({children, href, isLast}) {
  const className = "breadcrumbs__link";
  if (isLast) {
    return (
      <span className={className} itemProp="name">
        {children}
      </span>
    );
  }
  return href ? (
    <Link className={className} href={href} itemProp="item">
      <span itemProp="name">{children}</span>
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
}

function BreadcrumbsItem({children, active, index, addMicrodata}) {
  return (
    <li
      {...(addMicrodata && {
        itemScope: true,
        itemProp: "itemListElement",
        itemType: "https://schema.org/ListItem",
      })}
      className={clsx("breadcrumbs__item", {
        "breadcrumbs__item--active": active,
      })}
    >
      {children}
      <meta itemProp="position" content={String(index + 1)} />
    </li>
  );
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const {siteConfig} = useDocusaurusContext();
  const {pathname} = useLocation();

  if (!breadcrumbs) {
    return null;
  }

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

  const breadcrumbItems = [];
  const pushBreadcrumbItem = (item) => {
    if (!item?.item || !item?.name) {
      return;
    }
    if (breadcrumbItems.some((existing) => existing.item === item.item)) {
      return;
    }
    breadcrumbItems.push(item);
  };

  if (siteConfig?.url) {
    pushBreadcrumbItem({name: "Home", item: siteConfig.url});
  }

  if (siteConfig?.url && siteConfig?.baseUrl) {
    const docsUrl = toAbsoluteUrl(siteConfig.url, siteConfig.baseUrl);
    if (docsUrl && docsUrl !== siteConfig.url) {
      pushBreadcrumbItem({name: "Docs", item: docsUrl});
    }
  }

  if (breadcrumbs.length > 0) {
    breadcrumbs.forEach((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      const href = crumb.href || (isLast ? pathname : null);
      const absoluteUrl = toAbsoluteUrl(siteConfig?.url, href);
      if (!absoluteUrl) {
        return;
      }
      pushBreadcrumbItem({
        name: crumb.label,
        item: absoluteUrl,
      });
    });
  }

  const breadcrumbSchema =
    breadcrumbItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item,
          })),
        }
      : null;

  return (
    <>
      {breadcrumbSchema && (
        <Head>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        </Head>
      )}
      <nav
        className={clsx(
          ThemeClassNames.docs.docBreadcrumbs,
          styles.breadcrumbsContainer
        )}
        aria-label={translate({
          id: "theme.docs.breadcrumbs.navAriaLabel",
          message: "Breadcrumbs",
          description: "The ARIA label for the breadcrumbs",
        })}
      >
        <ul
          className="breadcrumbs"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {homePageRoute && <HomeBreadcrumbItem />}
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const href =
              item.type === "category" && item.linkUnlisted
                ? undefined
                : item.href;
            return (
              <BreadcrumbsItem
                key={idx}
                active={isLast}
                index={idx}
                addMicrodata={!!href}
              >
                <BreadcrumbsItemLink href={href} isLast={isLast}>
                  {item.label}
                </BreadcrumbsItemLink>
              </BreadcrumbsItem>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
