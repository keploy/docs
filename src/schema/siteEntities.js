/**
 * Canonical schema.org nodes for the docs site.
 *
 * Consumers merge JSON-LD nodes that share an `@id`, so each entity is
 * declared once here and referenced by `@id` everywhere else. Without that,
 * a single doc page emitted four unrelated Organization nodes -- the
 * site-wide one, `SoftwareApplication.publisher`, `Article.author` and
 * `Article.publisher` -- which had already drifted apart, carrying two
 * different logo URLs between them.
 *
 * CommonJS because docusaurus.config.js require()s this alongside the ESM
 * theme components and pages that import it.
 */

const SITE_URL = "https://keploy.io";
// `trailingSlash: true`, so URLs emitted into JSON-LD need the slash to match
// the canonical href instead of the variant that 301s to it.
const DOCS_URL = `${SITE_URL}/docs/`;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${DOCS_URL}#website`;
const SOFTWARE_APPLICATION_ID = `${SITE_URL}/#keploy`;
const GLOSSARY_URL = `${DOCS_URL}concepts/reference/glossary/`;
const TERMSET_ID = `${GLOSSARY_URL}#termset`;

// Bare `@id` references. The full nodes below ship in the <head> of every
// route via the site-wide `headTags` graph, so these always resolve.
const organizationRef = {"@id": ORGANIZATION_ID};
const websiteRef = {"@id": WEBSITE_ID};

// `trailingSlash: true` means the slash-less form of any internal path 301s
// to the canonical one. Hand-written paths (glossary data, hard-coded hrefs)
// routinely omit it, which costs a redirect hop for users and makes JSON-LD
// URLs disagree with the canonical tag.
function withTrailingSlash(path) {
  if (!path || path.endsWith("/")) {
    return path;
  }
  return `${path}/`;
}

const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Keploy",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE_URL}/#logo`,
    url: `${SITE_URL}/images/keploy-logo-full.svg`,
    caption: "Keploy",
  },
  foundingDate: "2021-01-01",
  knowsAbout: [
    "API Testing",
    "Test Automation",
    "eBPF-based Testing",
    "Dependency Virtualization",
    "AI-Powered Testing",
  ],
  award: [
    "API World 2023 Award: Best in API Infrastructure",
    "CNCF Landscape",
    "Google for Startups Accelerator",
    "Google Summer of Code Mentoring Organization",
  ],
  sameAs: [
    "https://github.com/keploy",
    "https://twitter.com/Keployio",
    "https://www.linkedin.com/company/keploy",
    "https://www.youtube.com/@keploy",
    "https://discord.gg/keploy",
    "https://community.keploy.io",
    "https://marketplace.visualstudio.com/items?itemName=Keploy.keployio",
    "https://chromewebstore.google.com/detail/keploy-api-test-recorder/ohcclfkaidblnjnggclkiecgkpgldihe",
    "https://www.crunchbase.com/organization/hybridk8s",
    "https://www.gartner.com/reviews/product/keploy-618993540",
    "https://www.g2.com/products/keploy/reviews",
    "https://www.capterra.in/software/1070466/Keploy",
    "https://aws.amazon.com/marketplace/reviews/reviews-list/prodview-xgwmdk4ivjjv4",
  ],
};

const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Keploy Documentation",
  url: DOCS_URL,
  publisher: organizationRef,
  potentialAction: {
    "@type": "SearchAction",
    target: `${DOCS_URL}search/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const softwareApplicationNode = {
  "@type": "SoftwareApplication",
  "@id": SOFTWARE_APPLICATION_ID,
  name: "Keploy",
  description:
    "Keploy is an open-source, AI-powered testing agent and sandboxing platform that automatically generates test cases, dependency mocks, and production-like sandboxes from real user traffic using eBPF. It helps developers achieve 90% test coverage in minutes with zero code changes. Native support is available on Linux; macOS and Windows require a Linux environment such as Lima, WSL, or Docker.",
  applicationCategory: "DeveloperTool",
  applicationSubCategory: "Test Automation",
  operatingSystem: "Linux",
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  softwareHelp: DOCS_URL,
  codeRepository: "https://github.com/keploy/keploy",
  downloadUrl: "https://github.com/keploy/keploy/releases",
  isAccessibleForFree: true,
  url: SITE_URL,
  featureList: [
    "Automatic test case generation from real user traffic",
    "Production-like sandbox environments from captured traffic",
    "AI-powered dependency virtualization and mock generation",
    "Record and replay testing with eBPF kernel capture",
    "AI noise detection for flaky test elimination",
    "Legacy application testing without code changes",
    "Migration regression testing against production baselines",
    "Continuous validation in CI/CD pipelines",
    "Multi-language support (Go, Java, TypeScript, Python)",
  ],
  keywords: [
    "test automation",
    "API testing",
    "API test generation",
    "unit testing",
    "integration testing",
    "mock generation",
    "dependency virtualization",
    "eBPF-based testing",
    "record and replay",
    "production sandbox",
  ],
  programmingLanguage: ["Go", "Java", "TypeScript", "JavaScript", "Python"],
  publisher: organizationRef,
};

// One graph for the whole site, injected into every route via `headTags`.
// Replaces three sibling <script> blocks that each re-declared the publisher.
const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationNode, websiteNode, softwareApplicationNode],
};

// Every bespoke React page (home, about, glossary, application-development, …)
// hand-built the same "Home -> Docs" breadcrumb prefix, repeating the site and
// docs URLs and the position numbering. Centralise it: callers pass only the
// trail beyond Docs as `{name, item}` crumbs, and this stamps the shared root
// crumbs and numbers every position, so the breadcrumbs can never disagree
// between pages.
const HOME_CRUMB = {name: "Home", item: `${SITE_URL}/`};
const DOCS_CRUMB = {name: "Docs", item: DOCS_URL};

function breadcrumbList(trail = []) {
  const items = [HOME_CRUMB, DOCS_CRUMB, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

module.exports = {
  SITE_URL,
  DOCS_URL,
  ORGANIZATION_ID,
  WEBSITE_ID,
  SOFTWARE_APPLICATION_ID,
  GLOSSARY_URL,
  TERMSET_ID,
  organizationRef,
  websiteRef,
  siteGraph,
  withTrailingSlash,
  breadcrumbList,
};
