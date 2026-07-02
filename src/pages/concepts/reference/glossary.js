import React, {useState, useMemo} from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import BackToTopButton from "@theme/BackToTopButton";

import {glossaryEntries} from "../../../../static/data/glossaryEntries";
import GlossaryCard from "../../../components/GlossaryCard";

// SEO/GEO: turn each glossary entry into a DefinedTerm inside a single
// DefinedTermSet so AI engines can cite individual definitions and engines
// can surface them as featured-snippet definitions. Mirrors the pattern in
// landing/app/(default)/what-is-api-testing/layout.tsx.
//
// Site config sets `trailingSlash: true`, so every emitted URL must carry a
// trailing slash to match the canonical href. Otherwise Google treats the
// no-slash variant as a duplicate URL of the canonical one.
const allGlossaryItems = Object.values(glossaryEntries).flat();
const SITE = "https://keploy.io";
const GLOSSARY_PATH = "/docs/concepts/reference/glossary/";
const GLOSSARY_URL = `${SITE}${GLOSSARY_PATH}`;
const TERMSET_ID = `${GLOSSARY_URL}#termset`;

function withTrailingSlash(path) {
  if (!path) return path;
  return path.endsWith("/") ? path : `${path}/`;
}

const glossaryStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": TERMSET_ID,
    name: "Keploy Software Testing Glossary",
    description:
      "Definitions for software testing, test automation, and quality engineering terminology, maintained by the Keploy documentation team.",
    url: GLOSSARY_URL,
    // Defensive: an entry without a valid `link` (e.g. a typoed key like
    // `ink:`) would emit `https://keploy.ioundefined` into the JSON-LD.
    // Drop those entries here so structured data never carries a malformed
    // URL even if `glossaryEntries` has gaps.
    hasDefinedTerm: allGlossaryItems
      .filter(
        (entry) => typeof entry.link === "string" && entry.link.length > 0
      )
      .map((entry) => ({
        "@type": "DefinedTerm",
        name: entry.name,
        description: entry.description,
        url: `${SITE}${withTrailingSlash(entry.link)}`,
        inDefinedTermSet: TERMSET_ID,
      })),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {"@type": "ListItem", position: 1, name: "Home", item: `${SITE}/`},
      {"@type": "ListItem", position: 2, name: "Docs", item: `${SITE}/docs/`},
      {
        "@type": "ListItem",
        position: 3,
        name: "Concepts",
        item: `${SITE}/docs/concepts/`,
      },
      {"@type": "ListItem", position: 4, name: "Glossary", item: GLOSSARY_URL},
    ],
  },
];

function Glossary() {
  const [selectedletter, setselectedletter] = useState([]);

  const allLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const availableLetters = Object.keys(glossaryEntries);

  const handleLetterClick = (letter) => {
    setselectedletter((prev) =>
      prev.includes(letter)
        ? prev.filter((l) => l !== letter)
        : [...prev, letter]
    );
  };

  // Reset filter
  const handleResetFilter = () => {
    setselectedletter([]);
  };

  // Memoize the filtered entries to avoid re calculating on every render
  const filteredEntrie = useMemo(() => {
    if (selectedletter.length === 0) {
      return Object.values(glossaryEntries).flat();
    }
    return selectedletter
      .map((letter) => glossaryEntries[letter] || [])
      .flat()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedletter]);

  return (
    <Layout
      title="Software Testing Glossary — Keploy Documentation"
      permalink="/reference/glossary"
      description="Definitions for software testing, test automation, and QA terminology. Acceptance, agile unit, BDD, beta, black-box testing and more."
    >
      <Head>
        {glossaryStructuredData.map((schema, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Head>
      <main className="container mx-auto my-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Glossary
          </h1>
          <p className="mt-4 text-lg text-[var(--ifm-color-emphasis-700)]">
            Your guide to modern software testing and development terminology.
          </p>
        </div>

        <div
          className="mb-8 flex flex-wrap justify-center gap-2"
          role="navigation"
          aria-label="Alphabetical Glossary Navigation"
        >
          {allLetters.map((letter) => {
            const isAvailable = availableLetters.includes(letter);
            const isSelected = selectedletter.includes(letter);

            return (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={!isAvailable}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--ifm-color-primary)] focus:ring-offset-2 sm:h-12 sm:w-12
                  ${
                    isAvailable
                      ? isSelected
                        ? "scale-110 bg-[var(--ifm-color-primary)] text-white shadow-lg"
                        : "bg-[var(--ifm-card-background-color)] text-[var(--ifm-color-primary)] shadow-md hover:bg-[var(--ifm-color-primary-lightest)] hover:text-[var(--ifm-color-primary-darker)]"
                      : "cursor-not-allowed bg-transparent text-[var(--ifm-color-emphasis-300)]"
                  }
                `}
                aria-pressed={isSelected}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {selectedletter.length > 0 && (
          <div className="mb-10 text-center">
            <button
              onClick={handleResetFilter}
              className="rounded-full border-2 border-[var(--ifm-color-primary)] bg-transparent px-6 py-2 font-semibold text-[var(--ifm-color-primary)] transition-colors hover:bg-[var(--ifm-color-primary)] hover:text-white"
            >
              Reset Filter
            </button>
          </div>
        )}

        <div className="mt-12">
          {selectedletter.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEntrie.map((entry, index) => (
                <GlossaryCard key={`${entry.name}-${index}`} {...entry} />
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(glossaryEntries).map(([letter, entries]) => (
                <section key={letter} id={`letter-${letter}`}>
                  <h2 className="mb-6 border-b-2 border-[var(--ifm-color-emphasis-300)] pb-3 text-4xl font-bold text-[var(--ifm-color-primary)]">
                    {letter}
                  </h2>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {entries.map((entry, index) => (
                      <GlossaryCard key={`${entry.name}-${index}`} {...entry} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {filteredEntrie.length === 0 && selectedletter.length > 0 && (
            <div className="py-16 text-center">
              <p className="text-2xl font-semibold text-[var(--ifm-color-emphasis-800)]">
                No terms found.
              </p>
              <p className="mt-2 text-[var(--ifm-color-emphasis-600)]">
                Try selecting a different letter or resetting the filter.
              </p>
            </div>
          )}
        </div>
        <BackToTopButton />
      </main>
    </Layout>
  );
}

export default Glossary;
