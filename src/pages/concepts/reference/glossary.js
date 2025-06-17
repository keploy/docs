import React, { useState } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import clsx from "clsx";

function Glossary() {
  // Initialize state for toggling sections
  const [expandedSections, setExpandedSections] = useState(() => {
    const sections = {};
    "ABCEFGIMRSTUW".split('').forEach(letter => {
      sections[letter] = true;
    });
    return sections;
  });
  
  const toggleSection = (letter) => {
    setExpandedSections(prev => ({
      ...prev,
      [letter]: !prev[letter]
    }));
  };



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
  };
  
  return (
    <Layout
      title="Glossary | Keploy Documentation"
      permalink="/reference/glossary"
      description="Comprehensive glossary of testing and development terms used in Keploy documentation"
      wrapperClassName="min-h-screen"
    >
      <Head>
        <meta name="keywords" content="glossary, testing terms, development terms, Keploy, API testing, unit testing" />
      </Head>
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Developer Glossary
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg opacity-80">
            Browse our comprehensive glossary of testing and development terms used throughout Keploy's documentation.
          </p>
        </div>

        {/* Alphabet Navigation */}
        <div className="sticky top-16 z-10 py-4 mb-8 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(65 + i);
              const hasTerms = entries[letter] !== undefined;
              const isActive = expandedSections[letter];
              
              return (
                <button
                  key={letter}
                  onClick={() => toggleSection(letter)}
                  disabled={!hasTerms}
                  className={clsx(
                    'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 font-medium',
                    {
                      'bg-orange-200 text-orange-900 font-bold shadow-md': isActive && hasTerms,
                      'text-gray-400 cursor-not-allowed': !hasTerms,
                      'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800': !isActive && hasTerms
                    }
                  )}
                  aria-label={`Toggle ${letter} section`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(entries).map(([letter, terms]) =>
            expandedSections[letter] && (
              <div key={letter} className="space-y-4">
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {letter}
                  </h2>
                  <span className="ml-3 text-sm text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {terms.length} {terms.length === 1 ? 'term' : 'terms'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {terms.map(({ name, link }, index) => (
                    <a
                      key={index}
                      href={link}
                      className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {name}
                          </h3>
                        </div>
                        <div className="ml-2 text-orange-500 dark:text-orange-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </main>
    </Layout>
  );
}

export default Glossary;
