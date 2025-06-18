import React, {useState, useEffect} from "react";
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

  const [localTheme, setLocalTheme] = useState("light");

  useEffect(() => {
    const savedGlossaryTheme = localStorage.getItem("glossary-theme");
    if (savedGlossaryTheme) {
      setLocalTheme(savedGlossaryTheme);
    }
  }, []);

  const toggleLocalTheme = () => {
    const newTheme = localTheme === "light" ? "dark" : "light";
    setLocalTheme(newTheme);
    localStorage.setItem("glossary-theme", newTheme);
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

  const {siteConfig} = useDocusaurusContext();

  const handleLetterClick = (letter) => {
    setActiveLetters((prev) => ({
      ...prev,
      [letter]: !prev[letter],
    }));

    const element = document.getElementById(`section-${letter}`);
    if (element) {
      element.scrollIntoView({behavior: "smooth", block: "start"});
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

  const themeClasses =
    localTheme === "dark"
      ? "bg-gray-900 text-white"
      : "bg-gray-50 text-gray-900";

  const cardThemeClasses =
    localTheme === "dark"
      ? "bg-gray-800 border-gray-700 text-white"
      : "bg-white border-gray-200 text-gray-900";

  const navThemeClasses =
    localTheme === "dark"
      ? "bg-gray-900/95 border-gray-700"
      : "bg-white/95 border-gray-200";

  return (
    <Layout
      title="About the docs"
      permalink="/reference/glossary"
      description="User General Information about Keploy's Documentation"
    >
      <main
        className={`min-h-screen transition-colors duration-300 ${themeClasses}`}
      >
        <div className="container mx-auto px-4 py-8 lg:py-12">
          {/* Header Section with Theme Toggle */}
          <div className="relative mb-12 text-center">
            <button
              onClick={toggleLocalTheme}
              className={`group absolute right-0 top-0 rounded-full border p-3 shadow-lg transition-all duration-300 hover:shadow-xl ${
                localTheme === "dark"
                  ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
              aria-label="Toggle glossary theme"
            >
              {localTheme === "light" ? (
                <svg
                  className="h-6 w-6 text-gray-700 transition-colors group-hover:text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6 text-yellow-400 transition-colors group-hover:text-yellow-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <h1
              className={`mb-4 text-4xl font-bold transition-colors duration-300 lg:text-5xl ${
                localTheme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Glossary
            </h1>
            <p
              className={`mx-auto max-w-2xl text-lg ${
                localTheme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            ></p>
          </div>

          <div
            className={`sticky top-0 z-10 mb-8 border-b py-4 backdrop-blur-sm transition-colors duration-300 ${navThemeClasses}`}
          >
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {Array.from({length: 26}, (_, i) => {
                const letter = String.fromCharCode(65 + i);
                const hasEntries = entries[letter] !== undefined;
                const isActive = activeLetters[letter];

                return (
                  <button
                    key={letter}
                    onClick={() => hasEntries && handleLetterClick(letter)}
                    disabled={!hasEntries}
                    className={`
                      transform rounded-lg px-3 py-2 font-semibold transition-all duration-200 hover:scale-105
                      ${
                        hasEntries
                          ? isActive
                            ? "bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                            : localTheme === "dark"
                            ? "border border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600"
                            : "border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : localTheme === "dark"
                          ? "cursor-not-allowed bg-transparent text-gray-600"
                          : "cursor-not-allowed bg-transparent text-gray-300"
                      }
                    `}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleShowAll}
                className={`px-4 py-2 text-sm font-medium transition-colors hover:underline ${
                  localTheme === "dark"
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-orange-600 hover:text-orange-800"
                }`}
              >
                Show All
              </button>
              <button
                onClick={handleHideAll}
                className={`px-4 py-2 text-sm font-medium transition-colors hover:underline ${
                  localTheme === "dark"
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Hide All
              </button>
            </div>
          </div>

          <div className="space-y-12">
            {Object.entries(activeLetters).map(([letter, isActive]) => {
              const letterEntries = entries[letter];

              if (!isActive || !letterEntries || letterEntries.length === 0) {
                return null;
              }

              return (
                <section
                  key={letter}
                  id={`section-${letter}`}
                  className="scroll-mt-24"
                >
                  <h2
                    className={`mb-6 flex items-center text-3xl font-bold transition-colors duration-300 ${
                      localTheme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <span className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
                      {letter}
                    </span>
                  </h2>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {letterEntries.map((entry, index) => (
                      <a
                        key={index}
                        href={entry.link}
                        className={`group block transform overflow-hidden rounded-xl border shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${cardThemeClasses}`}
                      >
                        <div className="p-6">
                          <div className="mb-3 flex items-start justify-between">
                            <h3
                              className={`text-lg font-semibold transition-colors group-hover:text-orange-600 ${
                                localTheme === "dark"
                                  ? "text-white group-hover:text-orange-400"
                                  : "text-gray-900 group-hover:text-orange-600"
                              }`}
                            >
                              {entry.name}
                            </h3>
                            <svg
                              className={`ml-2 h-5 w-5 flex-shrink-0 transition-colors group-hover:text-orange-500 ${
                                localTheme === "dark"
                                  ? "text-gray-500 group-hover:text-orange-400"
                                  : "text-gray-400 group-hover:text-orange-500"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>

                          <div
                            className={`flex items-center transition-colors ${
                              localTheme === "dark"
                                ? "text-orange-400 group-hover:text-orange-300"
                                : "text-orange-600 group-hover:text-orange-700"
                            }`}
                          >
                            <span className="text-sm font-medium">
                              Learn more
                            </span>
                            <svg
                              className="ml-1 h-4 w-4 transform transition-transform group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
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
        </div>
      </main>
    </Layout>
  );
}

export default Glossary;
