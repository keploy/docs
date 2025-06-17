import React, { useState } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Glossary() {
  const [activeLetters, setActiveLetters] = useState(() => {
    const alphabet = "ABCEFGIMRSTUW";
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

  // Properly call the hook
  const { siteConfig } = useDocusaurusContext();

  const handleLetterClick = (letter) => {
    setActiveLetters((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));
    
    // Smooth scroll to section
    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShowAll = () => {
    const alphabet = "ABCEFGIMRSTUW";
    const allActive = {};
    for (let i = 0; i < alphabet.length; i++) {
      allActive[alphabet[i]] = true;
    }
    setActiveLetters(allActive);
  };

  const handleHideAll = () => {
    const alphabet = "ABCEFGIMRSTUW";
    const allInactive = {};
    for (let i = 0; i < alphabet.length; i++) {
      allInactive[alphabet[i]] = false;
    }
    setActiveLetters(allInactive);
  };

  return (
    <Layout
      title="About the docs"
      permalink="/reference/glossary"
      description="User General Information about Keploy's Documentation"
    >
      <main className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Glossary
          </h1>
        </div>

        {/* Alphabet Navigation */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-4 mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(65 + i);
              const hasEntries = entries[letter] !== undefined;
              const isActive = activeLetters[letter];
              
              return (
                <button
                  key={letter}
                  onClick={() => hasEntries && handleLetterClick(letter)}
                  disabled={!hasEntries}
                  className={`
                    px-3 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105
                    ${hasEntries
                      ? isActive
                        ? 'bg-orange-500 text-white shadow-lg hover:bg-orange-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      : 'bg-transparent text-gray-300 cursor-not-allowed dark:text-gray-600'
                    }
                  `}
                >
                  {letter}
                </button>
              );
            })}
          </div>
          
          {/* Control Buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleShowAll}
              className="px-4 py-2 text-sm font-medium text-orange-600 hover:text-orange-800 hover:underline transition-colors"
            >
              Show All
            </button>
            <button
              onClick={handleHideAll}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:underline transition-colors dark:text-gray-400 dark:hover:text-gray-200"
            >
              Hide All
            </button>
          </div>
        </div>

        {/* Glossary Content */}
        <div className="space-y-12">
          {Object.entries(activeLetters).map(([letter, isActive]) => {
            const letterEntries = entries[letter];
            
            if (!isActive || !letterEntries || letterEntries.length === 0) {
              return null;
            }

            return (
              <section key={letter} id={`section-${letter}`} className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <span className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center mr-4">
                    {letter}
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {letterEntries.map((entry, index) => (
                    <a
                      key={index}
                      href={entry.link}
                      className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                            {entry.name}
                          </h3>
                          <svg 
                            className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0 ml-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                        
                        <div className="flex items-center text-orange-600 group-hover:text-orange-700 transition-colors">
                          <span className="text-sm font-medium">Learn more</span>
                          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export default Glossary;
