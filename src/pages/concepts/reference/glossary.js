import React, {useState, useMemo} from "react";
import Layout from "@theme/Layout";

import {glossaryEntries} from "../../../../static/data/glossaryEntries";
import GlossaryCard from "../../../components/GlossaryCard";

function Glossary() {

  const [state, setState] = useState(() => {
    const alphabet = "ABCEFGIMORSTUW";
    const initialState = {};
    for (let i = 0; i < alphabet.length; i++) {
      initialState[alphabet[i]] = true;
    }
    return initialState;
  });
  const entries = {
    A: [
      {
        name: "Acceptance Testing",
        link: "/docs/concepts/reference/glossary/acceptance-testing",
      },
      {
        name: "Agile Unit Testing",
        link: "/docs/concepts/reference/glossary/agile-unit-testing",
      },
      {
        name: "AI Test Completion",
        link: "/docs/concepts/reference/glossary/ai-test-completion",
      },
    ],
    B: [
      {
        name: "BDD",
        link: "/docs/concepts/reference/glossary/behaviour-driven-development",
      },
      {
        name: "Beta Testing",
        link: "/docs/concepts/reference/glossary/beta-testing",
      },
      {
        name: "Black Box Testing",
        link: "/docs/concepts/reference/glossary/black-box-testing",
      },
    ],
    C: [
      {
        name: "Code Coverage",
        link: "/docs/concepts/reference/glossary/code-coverage",
      },
      {
        name: "Cucumber Testing",
        link: "/docs/concepts/reference/glossary/cucumber-testing",
      },
    ],
    E: [
      {
        name: "End To End Testing",
        link: "/docs/concepts/reference/glossary/end-to-end-testing",
      },
      {
        name: "Error Guessing",
        link: "/docs/concepts/reference/glossary/error-guessing",
      },
    ],
    F: [
      {
        name: "Functional Testing",
        link: "/docs/concepts/reference/glossary/functional-testing",
      },
    ],
    G: [
      {
        name: "Gray Box Testing",
        link: "/docs/concepts/reference/glossary/gray-box-testing",
      },
    ],
    I: [
      {
        name: "Integration Testing",
        link: "/docs/concepts/reference/glossary/integration-testing",
      },
      {
        name: "Idempotency",
        link: "/docs/concepts/reference/glossary/idempotency",
      },
    ],
    M: [
      {
        name: "Manual Testing",
        link: "/docs/concepts/reference/glossary/manual-testing",
      },
      {
        name: "Mocks",
        link: "/docs/concepts/reference/glossary/mocks",
      },
      {
        name: "Microservice Testing",
        link: "/docs/concepts/reference/glossary/microservice-testing",
      },
    ],
    O: [
      {
        name: "Observability Testing",
        link: "/docs/concepts/reference/glossary/observability-testing",
      },
    ],
    R: [
      {
        name: "Regression Testing",
        link: "/docs/concepts/reference/glossary/regression-testing",
      },
    ],
    S: [
      {
        name: "Stubs",
        link: "/docs/concepts/reference/glossary/stubs",
      },
      {
        name: "Software Testing Life Cycle",
        link: "/docs/concepts/reference/glossary/software-testing-life-cycle",
      },
    ],
    T: [
      {
        name: "Test Driven TDD",
        link: "/docs/concepts/reference/glossary/test-driven-development",
      },
      {
        name: "Test Data Generation",
        link: "/docs/concepts/reference/glossary/test-data-generation",
      },
    ],
    U: [
      {
        name: "Unit Test Automation",
        link: "/docs/concepts/reference/glossary/unit-test-automation",
      },
      {
        name: "Unit Testing",
        link: "/docs/concepts/reference/glossary/unit-testing",
      },
    ],
    W: [
      {
        name: "White Box Testing",
        link: "/docs/concepts/reference/glossary/white-box-testing",
      },
    ],
=======
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
      title="Glossary"
      permalink="/reference/glossary"
      description="A glossary of terms related to software testing and development."
    >
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
      </main>
    </Layout>
  );
}

export default Glossary;
