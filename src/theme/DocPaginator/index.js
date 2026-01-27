import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";

function PaginatorCard({link, direction}) {
  if (!link) {
    return null;
  }

  const isNext = direction === "next";
  const label = isNext ? "Next page" : "Previous page";

  return (
    <Link
      className={clsx(styles.card, isNext ? styles.next : styles.prev)}
      to={link.permalink}
      rel={isNext ? "next" : "prev"}
    >
      <div className={styles.meta}>
        <span className={styles.title}>{link.title}</span>
        <span className={styles.kicker}>{isNext ? `${label} >` : `< ${label}`}</span>
      </div>
    </Link>
  );
}

export default function DocPaginator({previous, next}) {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav className={styles.paginator} aria-label="Doc pagination">
      {previous ? (
        <PaginatorCard link={previous} direction="prev" />
      ) : (
        <div className={styles.spacer} aria-hidden="true" />
      )}
      {next ? (
        <PaginatorCard link={next} direction="next" />
      ) : (
        <div className={styles.spacer} aria-hidden="true" />
      )}
    </nav>
  );
}
