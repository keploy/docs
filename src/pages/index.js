import React from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import {Community} from "../components";
import {
  organizationRef,
  websiteRef,
  breadcrumbList,
} from "../schema/siteEntities";
import styles from "./home.module.css";

// The docs home: what Keploy is, the two ways to build a regression suite,
// and where each product's docs start. It is the page to share.

// The entry points the CollectionPage JSON-LD lists (hrefs include the
// /docs base so they resolve as absolute URLs).
export const HOME_PATHS = [
  {
    name: "Integration testing quickstart",
    description:
      "Connect a Kubernetes cluster, record live traffic and replay it as tests with mocks",
    href: "/docs/integration-testing/quickstart/",
  },
  {
    name: "How Keploy works",
    description:
      "Capture, keep as tests, auto-replay, check every pull request, review and merge",
    href: "/docs/integration-testing/how-it-works/",
  },
  {
    name: "Run on every pull request",
    description: "keploy cloud replay in GitHub Actions, GitLab CI or Jenkins",
    href: "/docs/integration-testing/run-in-ci/",
  },
  {
    name: "API testing",
    description:
      "Generate validated API suites from OpenAPI, Postman, cURL or a live endpoint",
    href: "/docs/api-testing/",
  },
];

const LOOP = [
  ["Capture", "k8s-proxy records live traffic from a deployment"],
  ["Keep as tests", "requests become tests, dependency calls become mocks"],
  ["Auto-replay", "re-run in the cluster to drop noise"],
  ["Check the PR", "replay against the pull request's build"],
  ["Review", "fix regressions, approve intended changes"],
  ["Merge", "test changes merge with the pull request"],
];

const PRODUCTS = [
  {
    title: "Integration Testing",
    to: "/integration-testing/",
    text: "Regression tests with mocks, from real Kubernetes traffic, on every pull request.",
    tag: "Core",
  },
  {
    title: "API Testing",
    to: "/api-testing/",
    text: "AI-generated API suites from OpenAPI, Postman, cURL or browser recordings.",
  },
  {
    title: "UI Testing",
    to: "/ui-testing/",
    text: "Real user sessions in your web app, turned into readable UI flows.",
  },
  {
    title: "Unit Testing",
    to: "/unit-testing/",
    text: "Unit tests generated for the code each pull request changes.",
  },
  {
    title: "API Reference",
    to: "/api-reference/",
    text: "REST APIs, the keploy CLI and the k8s-proxy Helm values.",
  },
];

const GUIDES = [
  ["Connect a cluster", "/integration-testing/connect-a-cluster/"],
  ["Review test changes", "/integration-testing/review-test-changes/"],
  ["Keep tests current", "/integration-testing/keep-tests-current/"],
  ["Use with coding agents", "/integration-testing/coding-agents/"],
  ["keploy cloud reference", "/integration-testing/cli-keploy-cloud/"],
  ["Troubleshooting", "/integration-testing/troubleshooting/"],
];

function Terminal() {
  return (
    <div
      className={styles.terminal}
      aria-label="A pull request check with Keploy"
    >
      <div className={styles.terminalBar}>
        <span />
        <span />
        <span />
        <em>example · pull request #412</em>
      </div>
      <pre className={styles.terminalBody}>
        <code>
          <span className={styles.prompt}>$</span> keploy cloud replay --app
          shop.orders --image shop/orders:pr-412
          {"\n"}
          <span className={styles.dim}>
            {" "}
            replayed 214 tests against the PR build · dependencies mocked
          </span>
          {"\n"}
          <span className={styles.fail}> ✗ 3 failed</span>
          <span className={styles.dim}>
            {" "}
            → Keploy branch opened for this PR
          </span>
          {"\n\n"}
          <span className={styles.prompt}>$</span> keploy cloud triage --run
          tr-8f2c --app shop.orders
          {"\n"}
          <span className={styles.dim}>
            {" "}
            G3fa29c01 · 3 tests · response field{" "}
          </span>
          <span className={styles.hl}>status: "shipped" → "dispatched"</span>
          {"\n"}
          <span className={styles.dim}> intended or regression?</span>
          {"\n\n"}
          <span className={styles.prompt}>$</span> keploy cloud accept --run
          tr-8f2c --reviewer asha@acme.io
          {"\n"}
          <span className={styles.ok}>
            {" "}
            ✓ 3 outdated tests deleted on the branch · review requested
          </span>
          {"\n"}
          <span className={styles.ok}>
            {" "}
            ✓ approved · check passes · merges with the PR
          </span>
        </code>
      </pre>
    </div>
  );
}

export default function Home() {
  const {siteConfig = {}} = useDocusaurusContext();
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
  const docsUrl = toAbsoluteUrl(siteConfig.url, siteConfig.baseUrl);
  // Home -> Docs breadcrumb, from the shared builder (single source of truth).
  const breadcrumbSchema = breadcrumbList();
  // The rendered <title>, the meta description, the sr-only H1 and the
  // CollectionPage JSON-LD below all derive from these two constants.
  const docsHomeTitle =
    "Keploy Documentation — Regression Tests from Real Traffic";
  const docsHomeDescription =
    "Keploy turns real Kubernetes traffic into regression tests with mocks and checks every pull request against them. Quickstarts, guides and references.";
  // CollectionPage, not Article: this page is an index of the docs, with no
  // single author, publication date or headline.
  const collectionPageSchema = docsUrl
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": docsUrl,
        name: docsHomeTitle,
        description: docsHomeDescription,
        url: docsUrl,
        isPartOf: websiteRef,
        publisher: organizationRef,
        mainEntity: {
          "@type": "ItemList",
          name: "Ways to get started with Keploy",
          itemListElement: HOME_PATHS.map((path, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: path.name,
            description: path.description,
            url: toAbsoluteUrl(siteConfig.url, path.href),
          })),
        },
      }
    : null;

  return (
    <div className="main">
      <Head>
        {breadcrumbSchema && (
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        )}
        {collectionPageSchema && (
          <script type="application/ld+json">
            {JSON.stringify(collectionPageSchema)}
          </script>
        )}
      </Head>
      <Layout title={docsHomeTitle} description={docsHomeDescription}>
        <main className={styles.home}>
          <h1 className="sr-only">{docsHomeTitle}</h1>

          <section className={styles.hero}>
            <div className={styles.heroText}>
              <span className={styles.eyebrow}>Keploy documentation</span>
              <p className={styles.heroTitle} aria-hidden="true">
                Regression tests from your <span>real traffic</span>
              </p>
              <p className={styles.heroLead}>
                Record real API interactions (and dependencies) and replay them
                deterministically, locally or in CI.
              </p>
              <div className={styles.heroActions}>
                <Link
                  className={styles.btnPrimary}
                  to="/integration-testing/quickstart/"
                >
                  Quickstart
                </Link>
                <Link
                  className={styles.btnSecondary}
                  to="/integration-testing/how-it-works/"
                >
                  How Keploy works
                </Link>
              </div>
              <div className={styles.install}>
                <code>
                  source /dev/stdin &lt;&lt;&lt;"$(curl -fsSL
                  https://keploy.io/install.sh)"
                </code>
              </div>
            </div>
            <Terminal />
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Two ways to build your regression suite</h2>
              <p>
                Capture from an environment you don't control, or bring your own
                end-to-end tests and let Keploy mock what they touch.
              </p>
            </div>
            <div className={styles.paths}>
              <Link
                className={styles.path}
                to="/integration-testing/how-it-works/"
              >
                <div className={styles.pathHead}>
                  <span className={styles.pathLetter}>A</span>
                  <span className={styles.badgeLive}>Available</span>
                </div>
                <h3>Capture from an environment</h3>
                <p>
                  Record live traffic from staging or production, where you
                  don't control the traffic. Keploy keeps it as your regression
                  suite, checks every pull request against it, and removes
                  outdated tests through review.
                </p>
                <ul>
                  <li>No test code, no SDK</li>
                  <li>Dependencies mocked in CI</li>
                  <li>Changes reviewed like code</li>
                </ul>
                <span className={styles.pathCta}>See how it works →</span>
              </Link>
              <Link
                className={`${styles.path} ${styles.pathSoon}`}
                to="/integration-testing/e2e-tests-with-mocks/"
              >
                <div className={styles.pathHead}>
                  <span className={styles.pathLetter}>B</span>
                  <span className={styles.badgeSoon}>Coming soon</span>
                </div>
                <h3>Your e2e tests with Keploy mocks</h3>
                <p>
                  Write your own end-to-end tests. Keploy records every
                  dependency they hit and mocks it, so the suite runs in your
                  pipeline with no databases or services to start.
                </p>
                <ul>
                  <li>Your tests, your assertions</li>
                  <li>Network-level mocks, no code changes</li>
                  <li>Runs in the pipeline you have</li>
                </ul>
                <span className={styles.pathCta}>Learn more →</span>
              </Link>
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>The loop</h2>
              <p>From a recording to a merged pull request.</p>
            </div>
            <ol className={styles.loop}>
              {LOOP.map(([title, text], i) => (
                <li key={title}>
                  <span className={styles.loopNum}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={styles.loopTitle}>{title}</span>
                  <span className={styles.loopText}>{text}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Products</h2>
            </div>
            <div className={styles.products}>
              {PRODUCTS.map((p) => (
                <Link key={p.title} className={styles.product} to={p.to}>
                  <span className={styles.productTitle}>
                    {p.title}
                    {p.tag ? <em>{p.tag}</em> : null}
                  </span>
                  <span className={styles.productText}>{p.text}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Popular guides</h2>
            </div>
            <div className={styles.guides}>
              {GUIDES.map(([title, to]) => (
                <Link key={to} className={styles.guide} to={to}>
                  {title}
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>

          <section className={styles.section}>
            <Community />
          </section>
        </main>
      </Layout>
    </div>
  );
}
