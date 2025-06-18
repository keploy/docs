
import React from 'react';
import { useState, useEffect } from "react"
import Layout from "@theme/Layout"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"

function Glossary() {
  const [state, setState] = useState(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const initialState = {}
    for (let i = 0; i < alphabet.length; i++) {
      initialState[alphabet[i]] = true
    }
    return initialState;
  })

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark"
    }
    return false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [isDarkMode])

  const [searchTerm, setSearchTerm] = useState("")


  const entries = {
    A: [
      {
        name: "Acceptance Testing",
        link: "/docs/concepts/reference/glossary/acceptance-testing",
        description: "Testing to determine if requirements are met and system is ready for delivery.",
      },
      {
        name: "Agile Unit Testing",
        link: "/docs/concepts/reference/glossary/agile-unit-testing",
        description: "Unit testing practices adapted for agile development with rapid feedback loops.",
      },
      {
        name: "AI Test Completion",
        link: "/docs/concepts/reference/glossary/ai-test-completion",
        description: "Automated test generation using AI and machine learning techniques.",
      },
    ],
    B: [
      {
        name: "BDD",
        link: "/docs/concepts/reference/glossary/behaviour-driven-development",
        description: "An approach to software development that encourages collaboration using human-readable scenarios.",
      },
      {
        name: "Beta Testing",
        link: "/docs/concepts/reference/glossary/beta-testing",
        description: "Testing by actual users in a real-world environment before the final release."


      },
      {
        name: "Black Box Testing",
        link: "/docs/concepts/reference/glossary/black-box-testing",
        description: "Testing without knowledge of internal code structure, focusing on inputs and outputs.",
      },
    ],
    C: [
      {
        name: "Code Coverage",
        link: "/docs/concepts/reference/glossary/code-coverage",
        description: "A metric indicating the percentage of code executed by tests.",
      },
      {
        name: "Cucumber Testing",
        link: "/docs/concepts/reference/glossary/cucumber-testing",
        description: "Testing framework that supports BDD with test cases written in plain language.",
      },
    ],
    E: [
      {
        name: "End To End Testing",
        link: "/docs/concepts/reference/glossary/end-to-end-testing",
        description: "Testing the complete flow of an application from start to finish.",
      },
      {
        name: "Error Guessing",
        link: "/docs/concepts/reference/glossary/error-guessing",
        description: "Test design technique based on experience to guess and uncover likely errors.",
      },
    ],
    F: [
      {
        name: "Functional Testing",
        link: "/docs/concepts/reference/glossary/functional-testing",
        description: "Testing based on the specifications of the software to ensure all features work as intended.",
      },
    ],
    G: [
      {
        name: "Gray Box Testing",
        link: "/docs/concepts/reference/glossary/gray-box-testing",
        description: "Testing with partial knowledge of the internal workings of the system.",
      },
    ],
    I: [
      {
        name: "Integration Testing",
        link: "/docs/concepts/reference/glossary/integration-testing",
        description: "Testing combined parts of an application to determine if they function together correctly.",
      },
      {
        name: "Idempotency",
        link: "/docs/concepts/reference/glossary/idempotency",
        description: "A property where repeated operations produce the same result, vital in API testing.",
      },
    ],
    M: [
      {
        name: "Manual Testing",
        link: "/docs/concepts/reference/glossary/manual-testing",
        description: "Testing performed by humans without automation to validate application functionality.",
      },
      {
        name: "Mocks",
        link: "/docs/concepts/reference/glossary/mocks",
        description: "Simulating objects or behaviors in testing to isolate code.",
      },
      {
        name: "Microservice Testing",
        link: "/docs/concepts/reference/glossary/microservice-testing",
        description: "Testing strategies tailored for distributed, independently deployable services.",
      },
    ],
    R: [
      {
        name: "Regression Testing",
        link: "/docs/concepts/reference/glossary/regression-testing",
        description: "Testing to ensure new changes do not adversely affect existing functionality.",
      },
    ],
    S: [
      {
        name: "Stubs",
        link: "/docs/concepts/reference/glossary/stubs",
        description: "Dummy components used in place of real modules to simulate interactions during testing.",
      },
      {
        name: "Software Testing Life Cycle",
        link: "/docs/concepts/reference/glossary/software-testing-life-cycle",
        description: "A structured sequence of testing activities from planning to test closure in the software development process.",
      },
    ],
    T: [
      {
        name: "Test Driven TDD",
        link: "/docs/concepts/reference/glossary/test-driven-development",
        description: "A software development process where tests are written before code.",
      },
      {
        name: "Test Data Generation",
        link: "/docs/concepts/reference/glossary/test-data-generation",
        description: "Creating data sets required to validate software behavior during testing.",
      },
    ],
    U: [
      {
        name: "Unit Test Automation",
        link: "/docs/concepts/reference/glossary/unit-test-automation",
        description: "Automated testing of individual units of code to ensure correctness and efficiency.",
      },
      {
        name: "Unit Testing",
        link: "/docs/concepts/reference/glossary/unit-testing",
        description: "Testing individual units or components of a software.",
      },
    ],
    W: [
      {
        name: "White Box Testing",
        link: "/docs/concepts/reference/glossary/white-box-testing",
        description: "Testing method examining internal code structure and logic for comprehensive coverage.",
      },
    ],
  }

  const { siteConfig, siteMetadata } = useDocusaurusContext()

  const handleClick = (index) => {
    setState((state) => {
      var obj = {
        ...state,
        [index]: !state[index],
      }
      return obj
    })
    scrollToSection(index)
  }

    const scrollToSection = (letter) => {
    const element = document.getElementById(`section-${letter}`)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  const filteredEntries = Object.entries(entries).reduce((acc, [key, items]) => {
    if (state[key]) {
      const filteredItems = items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      if (filteredItems.length > 0) {
        acc[key] = filteredItems
      }
    }
    return acc
  }, {})

  return (
    <Layout
      title="About the docs"
      permalink="/reference/glossary"
      description="User General Information about Keploy's Documentation"
    >
      <main
        className={`
          min-h-screen transition-colors duration-300
          ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}
        `}
      >
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setIsDarkMode((prev) => !prev)}
              className={`
                px-3 py-2 rounded-lg font-medium shadow-md transition-all duration-300
                ${isDarkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}
              `}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "Dark" : "Light"}
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className={`
              text-4xl md:text-5xl font-bold mb-3 transition-colors duration-300
              ${isDarkMode ? "text-gray-100" : "text-gray-900"}
            `}>
              Glossary
            </h1>
            <p className={`
              text-lg max-w-2xl mx-auto transition-colors duration-300
              ${isDarkMode ? "text-gray-400" : "text-gray-600"}
            `}>
              Comprehensive testing terminology and concepts
            </p>
            <div className={`
              mt-2 w-16 h-0.5 mx-auto rounded-full transition-colors duration-300
              ${isDarkMode ? "bg-orange-400" : "bg-orange-500"}
            `}></div>
          </div>

          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <svg
                className={`
                  absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300
                  ${isDarkMode ? "text-gray-400" : "text-gray-400"}
                `}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search terms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  pl-9 pr-4 py-2.5 w-full rounded-lg border focus:ring-2 focus:border-orange-500 transition-all duration-300 shadow-sm text-sm
                  ${isDarkMode
                    ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 focus:ring-orange-400"
                    : "bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:ring-orange-500"}
                `}
              />
            </div>
          </div>

          <div className={`
            flex flex-wrap justify-center gap-2 mb-8 p-4 rounded-xl shadow-sm border transition-all duration-300
            ${isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"}
          `}>
            {new Array(26).fill(0).map((x, i) => {
              const letter = String.fromCharCode(65 + i)
              const isActive = state[letter]
              const hasEntries = entries[letter] !== undefined

              return (
                <button
                  key={i}
                  className={`
                    min-w-[32px] h-8 rounded-lg font-semibold text-sm transition-all duration-300 transform
                    ${
                      isActive
                        ? isDarkMode
                          ? "bg-orange-500 text-white shadow-md scale-105 hover:bg-orange-600"
                          : "bg-orange-500 text-white shadow-md scale-105 hover:bg-orange-600"
                        : hasEntries
                          ? isDarkMode
                            ? "bg-gray-900 text-gray-300 hover:bg-orange-900 hover:scale-105 shadow-sm border border-gray-700"
                            : "bg-white text-gray-700 hover:bg-orange-100 hover:scale-105 shadow-sm border border-gray-200"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                    }
                  `}
                  disabled={!hasEntries}
                  onClick={() => handleClick(letter)}
                >
                  {letter}
                </button>
              )
            })}
          </div>

          <div className="flex justify-center gap-3 mb-6">
            <button
              onClick={() => {
                const newState = {}
                Object.keys(entries).forEach((key) => {
                  newState[key] = true
                })
                setState(newState)
              }}
              className={`
                px-4 py-2 rounded-lg transition-all duration-300 shadow-md text-sm font-medium transform hover:scale-105
                ${isDarkMode
                  ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"
                  : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg"}
              `}
            >
              Select All
            </button>
            <button
              onClick={() => {
                const newState = {}
                Object.keys(entries).forEach((key) => {
                  newState[key] = false
                })
                setState(newState)
              }}
              className={`
                px-4 py-2 rounded-lg transition-all duration-300 shadow-md text-sm font-medium transform hover:scale-105
                ${isDarkMode
                  ? "bg-gray-700 text-white hover:bg-gray-600 hover:shadow-lg"
                  : "bg-gray-500 text-white hover:bg-gray-600 hover:shadow-lg"}
              `}
            >
              Deselect All
            </button>
          </div>

          {Object.keys(filteredEntries).length === 0 ? (
            <div className={`
              text-center py-12 rounded-xl border transition-all duration-300
              ${isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-gray-50 border-gray-200"}
            `}>
              <div className="text-5xl mb-4">🔍</div>
              <h3 className={`
                text-xl font-bold mb-2 transition-colors duration-300
                ${isDarkMode ? "text-gray-400" : "text-gray-600"}
              `}>
                {searchTerm ? "No terms found" : "Select letters to explore"}
              </h3>
              <p className={`
                transition-colors duration-300
                ${isDarkMode ? "text-gray-500" : "text-gray-500"}
              `}>
                {searchTerm ? "Try adjusting your search" : "Choose from the alphabet above"}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(filteredEntries).map(([key, items]) => (
                <section key={key} id={`section-${key}`} className="scroll-mt-20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`
                      text-xl font-bold px-3 py-1.5 rounded-lg shadow-lg transition-colors duration-300
                      ${isDarkMode ? "bg-orange-400 text-gray-900" : "bg-orange-500 text-white"}
                    `}>
                      {key}
                    </div>
                    <div className={`
                      flex-1 h-px transition-colors duration-300
                      ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}
                    `}></div>
                    <div className={`
                      text-xs font-medium px-2 py-1 rounded-full transition-colors duration-300
                      ${isDarkMode ? "text-gray-400 bg-gray-800" : "text-gray-500 bg-gray-100"}
                    `}>
                      {items.length}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {items.map(({ name, link, description }, i) => (
                      <div
                        key={i}
                        className={`
                          group rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border overflow-hidden cursor-pointer hover:border-orange-300
                          ${isDarkMode
                            ? "bg-gray-900 border-gray-700 hover:bg-gray-800"
                            : "bg-white border-gray-200"}
                        `}
                        onClick={() => window.open(link, "_blank")}
                      >
                        <div className={`
                          h-1 transition-colors duration-300
                          ${isDarkMode ? "bg-orange-400" : "bg-orange-500"}
                        `}></div>

                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className={`
                              text-base font-bold group-hover:text-orange-600 transition-colors duration-300 flex-1 pr-2 leading-tight
                              ${isDarkMode ? "text-gray-100" : "text-gray-900"}
                            `}>
                              {name}
                            </h3>
                            <svg
                              className={`
                                h-4 w-4 transition-all duration-300 transform group-hover:translate-x-0.5 flex-shrink-0
                                ${isDarkMode
                                  ? "text-gray-400 group-hover:text-orange-400"
                                  : "text-gray-400 group-hover:text-orange-500"}
                              `}
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

                          <p className={`
                            text-xs leading-relaxed mb-3 line-clamp-3 transition-colors duration-300
                            ${isDarkMode ? "text-gray-400" : "text-gray-600"}
                          `}>
                            {description}
                          </p>

                          <div className={`
                            w-full font-medium py-2 px-3 rounded-lg transition-all duration-300 text-center text-sm transform group-hover:scale-105
                            ${isDarkMode
                              ? "bg-orange-400 hover:bg-orange-500 text-gray-900"
                              : "bg-orange-500 hover:bg-orange-600 text-white"}
                          `}>
                            Learn More 
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>
    </Layout>
  )
}

export default Glossary
