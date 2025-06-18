import React, { useRef, useState } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

// Optionally, add descriptions to entries for tooltips
const entries = {
  A: [
    {
      name: "Acceptance Testing",
      link: "/docs/concepts/reference/glossary/acceptance-testing",
      description: "Testing to determine if requirements are met for user acceptance.",
    },
    {
      name: "Agile Unit Testing",
      link: "/docs/concepts/reference/glossary/agile-unit-testing",
      description: "Unit testing practices within agile development cycles.",
    },
    {
      name: "AI Test Completion",
      link: "/docs/concepts/reference/glossary/ai-test-completion",
      description: "Using AI to assist in writing and completing tests.",
    },
  ],
  B: [
    {
      name: "BDD",
      link: "/docs/concepts/reference/glossary/behaviour-driven-development",
      description: "Behavior Driven Development: testing based on system behavior from the user's perspective.",
    },
    {
      name: "Beta Testing",
      link: "/docs/concepts/reference/glossary/beta-testing",
      description: "Testing by end users before the final release to find bugs and gather feedback.",
    },
    {
      name: "Black Box Testing",
      link: "/docs/concepts/reference/glossary/black-box-testing",
      description: "Testing without knowledge of internal code or logic, focusing on inputs and outputs.",
    },
  ],
  C: [
    {
      name: "Code Coverage",
      link: "/docs/concepts/reference/glossary/code-coverage",
      description: "A metric showing the percentage of code executed by tests.",
    },
    {
      name: "Cucumber Testing",
      link: "/docs/concepts/reference/glossary/cucumber-testing",
      description: "Testing using Cucumber, a tool for running automated acceptance tests written in plain language.",
    },
  ],
  E: [
    {
      name: "End To End Testing",
      link: "/docs/concepts/reference/glossary/end-to-end-testing",
      description: "Testing the complete workflow of an application from start to finish.",
    },
    {
      name: "Error Guessing",
      link: "/docs/concepts/reference/glossary/error-guessing",
      description: "A testing technique based on experience to guess error-prone areas.",
    },
  ],
  F: [
    {
      name: "Functional Testing",
      link: "/docs/concepts/reference/glossary/functional-testing",
      description: "Testing the functions of an application by feeding input and examining output.",
    },
  ],
  G: [
    {
      name: "Gray Box Testing",
      link: "/docs/concepts/reference/glossary/gray-box-testing",
      description: "Testing with partial knowledge of the internal workings of the application.",
    },
  ],
  I: [
    {
      name: "Integration Testing",
      link: "/docs/concepts/reference/glossary/integration-testing",
      description: "Testing combined parts of an application to ensure they work together.",
    },
    {
      name: "Idempotency",
      link: "/docs/concepts/reference/glossary/idempotency",
      description: "A property where repeated operations produce the same result.",
    },
  ],
  M: [
    {
      name: "Manual Testing",
      link: "/docs/concepts/reference/glossary/manual-testing",
      description: "Testing performed by humans without automation tools.",
    },
    {
      name: "Mocks",
      link: "/docs/concepts/reference/glossary/mocks",
      description: "Objects that simulate the behavior of real components in tests.",
    },
    {
      name: "Microservice Testing",
      link: "/docs/concepts/reference/glossary/microservice-testing",
      description: "Testing strategies and tools for microservice architectures.",
    },
  ],
  R: [
    {
      name: "Regression Testing",
      link: "/docs/concepts/reference/glossary/regression-testing",
      description: "Testing to ensure new changes do not break existing functionality.",
    },
  ],
  S: [
    {
      name: "Stubs",
      link: "/docs/concepts/reference/glossary/stubs",
      description: "Simplified implementations of components used for testing.",
    },
    {
      name: "Software Testing Life Cycle",
      link: "/docs/concepts/reference/glossary/software-testing-life-cycle",
      description: "A sequence of activities conducted during the testing process.",
    },
  ],
  T: [
    {
      name: "Test Driven TDD",
      link: "/docs/concepts/reference/glossary/test-driven-development",
      description: "Test Driven Development: writing tests before code to guide development.",
    },
    {
      name: "Test Data Generation",
      link: "/docs/concepts/reference/glossary/test-data-generation",
      description: "Creating data sets for use in testing.",
    },
  ],
  U: [
    {
      name: "Unit Test Automation",
      link: "/docs/concepts/reference/glossary/unit-test-automation",
      description: "Automating the execution of unit tests.",
    },
    {
      name: "Unit Testing",
      link: "/docs/concepts/reference/glossary/unit-testing",
      description: "Testing individual units or components of software.",
    },
  ],
  W: [
    {
      name: "White Box Testing",
      link: "/docs/concepts/reference/glossary/white-box-testing",
      description: "Testing with knowledge of the internal code and logic.",
    },
  ],
};

const ALPHABET = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

function Glossary() {
  const sectionRefs = useRef({});
  const [activeLetter, setActiveLetter] = useState(ALPHABET.find((l) => entries[l]));

  const handleNavClick = (letter) => {
    setActiveLetter(letter);
    const section = sectionRefs.current[letter];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const { siteConfig, siteMetadata } = useDocusaurusContext();
  return (
    <Layout
      title="About the docs"
      permalink="/reference/glossary"
      description="User General Information about Keploy's Documentation"
    >
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center text-4xl font-bold">Glossary</div>
        <nav className="mb-8 flex flex-wrap justify-center gap-1 py-2 backdrop-blur bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
          {ALPHABET.map((letter) => {
            const hasEntries = !!entries[letter];
            return (
              <button
                key={letter}
                disabled={!hasEntries}
                onClick={() => handleNavClick(letter)}
                className={`mx-1 px-3 py-1 rounded transition-all duration-200 font-semibold text-lg
                  ${!hasEntries ? "text-gray-400 cursor-not-allowed" :
                    activeLetter === letter ?
                      "text-orange-900 dark:text-orange-300 border-b-4 border-orange-500 bg-white dark:bg-orange-950 shadow-sm" :
                      "text-neutral-700 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-800"
                  }
                `}
                aria-current={activeLetter === letter ? "page" : undefined}
              >
                {letter}
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col gap-12">
          {ALPHABET.filter((letter) => entries[letter]).map((letter) => (
            <section
              key={letter}
              ref={(el) => (sectionRefs.current[letter] = el)}
              id={`glossary-${letter}`}
            >
              <h2 className="mb-4 text-2xl font-bold text-orange-600 dark:text-orange-400 tracking-wide">
                {letter}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {entries[letter].map(({ name, link, description }, i) => (
                  <a
                    key={i}
                    href={link}
                    className="group block rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-orange-400"
                    tabIndex={0}
                  >
                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2 text-neutral-900 dark:text-orange-200">
                      {name}
                      {description && (
                        <span className="relative group-hover:underline cursor-help text-orange-400" title={description}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">?</text></svg>
                        </span>
                      )}
                    </h3>
                    {description && (
                      <p className="text-sm text-neutral-600 dark:text-orange-300 line-clamp-2">{description}</p>
                    )}
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </Layout>
  );
}

export default Glossary;