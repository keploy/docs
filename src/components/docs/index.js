import React from "react";
import Link from "@docusaurus/Link";
import clsx from "clsx";

/*
 * Building blocks for doc pages. They are registered globally in
 * src/theme/MDXComponents.js, so a page uses them without importing:
 *
 *   <Steps>                       numbered steps; each `### Heading` inside
 *   ### Install the proxy         is one step
 *   ...
 *   </Steps>
 *
 *   <CardGrid>
 *     <Card title="Quickstart" href="/integration-testing/quickstart/">
 *       Connect a cluster and record your first tests.
 *     </Card>
 *   </CardGrid>
 *
 *   <ComingSoon />                small "Coming soon" badge
 *
 *   <Lifecycle steps={[{title, text}, ...]} />   a left-to-right flow
 */

export function Steps({children}) {
  return <div className="kd-steps">{children}</div>;
}

export function CardGrid({children, cols = 2}) {
  return (
    <div className={clsx("kd-card-grid", `kd-card-grid--${cols}`)}>
      {children}
    </div>
  );
}

export function Card({title, href, badge, icon, children}) {
  const body = (
    <>
      <div className="kd-card__head">
        {icon ? <span className="kd-card__icon">{icon}</span> : null}
        <span className="kd-card__title">{title}</span>
        {badge ? <span className="kd-badge">{badge}</span> : null}
      </div>
      {children ? <div className="kd-card__body">{children}</div> : null}
    </>
  );
  if (!href) {
    return <div className="kd-card kd-card--static">{body}</div>;
  }
  return (
    <Link className="kd-card" to={href}>
      {body}
      <span className="kd-card__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  );
}

export function ComingSoon({label = "Coming soon"}) {
  return <span className="kd-badge kd-badge--soon">{label}</span>;
}

export function Lifecycle({steps}) {
  return (
    <ol className="kd-lifecycle">
      {steps.map((s, i) => (
        <li key={s.title} className="kd-lifecycle__step">
          <span className="kd-lifecycle__num">{i + 1}</span>
          <span className="kd-lifecycle__title">{s.title}</span>
          {s.text ? <span className="kd-lifecycle__text">{s.text}</span> : null}
        </li>
      ))}
    </ol>
  );
}
