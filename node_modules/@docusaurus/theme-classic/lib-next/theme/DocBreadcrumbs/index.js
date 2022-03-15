/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import {
  ThemeClassNames,
  useSidebarBreadcrumbs,
  useHomePageRoute,
} from '@docusaurus/theme-common';
import styles from './styles.module.css';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl'; // TODO move to design system folder

function BreadcrumbsItemLink({children, href}) {
  const className = clsx('breadcrumbs__link', styles.breadcrumbsItemLink);
  return href ? (
    <Link className={className} href={href}>
      {children}
    </Link>
  ) : (
    <span className={className}>{children}</span>
  );
} // TODO move to design system folder

function BreadcrumbsItem({children, active}) {
  return (
    <li
      className={clsx('breadcrumbs__item', {
        'breadcrumbs__item--active': active,
      })}>
      {children}
    </li>
  );
}

function HomeBreadcrumbItem() {
  const homeHref = useBaseUrl('/');
  return (
    <BreadcrumbsItem>
      <BreadcrumbsItemLink href={homeHref}>🏠</BreadcrumbsItemLink>
    </BreadcrumbsItem>
  );
}

export default function DocBreadcrumbs() {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav
      className={clsx(
        ThemeClassNames.docs.docBreadcrumbs,
        styles.breadcrumbsContainer,
      )}
      aria-label="breadcrumbs">
      <ul className="breadcrumbs">
        {homePageRoute && <HomeBreadcrumbItem />}
        {breadcrumbs.map((item, idx) => (
          <BreadcrumbsItem key={idx} active={idx === breadcrumbs.length - 1}>
            <BreadcrumbsItemLink href={item.href}>
              {item.label}
            </BreadcrumbsItemLink>
          </BreadcrumbsItem>
        ))}
      </ul>
    </nav>
  );
}
