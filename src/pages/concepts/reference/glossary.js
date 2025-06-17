import React, { useState, useRef } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Glossary() {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [activeLetter, setActiveLetter] = useState(null);
  const sectionRefs = useRef({});

  const handleLetterClick = (letter) => {
    const el = sectionRefs.current[letter];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLetter(letter);
    }
  };

 const entries = {
  A: [
    {
      name: "Acceptance Testing",
      link: "/docs/concepts/reference/glossary/acceptance-testing",
      desc: "Validates whether requirements are met."
    },
    {
      name: "Agile Unit Testing",
      link: "/docs/concepts/reference/glossary/agile-unit-testing",
      desc: "Testing in agile development environments."
    },
    {
      name: "AI Test Completion",
      link: "/docs/concepts/reference/glossary/ai-test-completion",
      desc: "Using AI to auto-complete test cases."
    },
  ],
  B: [
    {
      name: "BDD",
      link: "/docs/concepts/reference/glossary/behaviour-driven-development",
      desc: "Behavior-Driven Development."
    },
    {
      name: "Beta Testing",
      link: "/docs/concepts/reference/glossary/beta-testing",
      desc: "Final-stage external testing."
    },
    {
      name: "Black Box Testing",
      link: "/docs/concepts/reference/glossary/black-box-testing",
      desc: "Testing without internal knowledge."
    },
  ],
  C: [
    {
      name: "Code Coverage",
      link: "/docs/concepts/reference/glossary/code-coverage",
      desc: "Measures test scope."
    },
    {
      name: "Cucumber Testing",
      link: "/docs/concepts/reference/glossary/cucumber-testing",
      desc: "BDD testing using Gherkin syntax."
    },
  ],
  E: [
    {
      name: "End To End Testing",
      link: "/docs/concepts/reference/glossary/end-to-end-testing",
      desc: "Testing complete workflow from start to finish."
    },
    {
      name: "Error Guessing",
      link: "/docs/concepts/reference/glossary/error-guessing",
      desc: "Predicting common error-prone areas."
    },
  ],
  F: [
    {
      name: "Functional Testing",
      link: "/docs/concepts/reference/glossary/functional-testing",
      desc: "Testing software functions against requirements."
    },
  ],
  G: [
    {
      name: "Gray Box Testing",
      link: "/docs/concepts/reference/glossary/gray-box-testing",
      desc: "Testing with partial knowledge of internals."
    },
  ],
  I: [
    {
      name: "Integration Testing",
      link: "/docs/concepts/reference/glossary/integration-testing",
      desc: "Testing interaction between integrated modules."
    },
    {
      name: "Idempotency",
      link: "/docs/concepts/reference/glossary/idempotency",
      desc: "Operation producing same result no matter how many times."
    },
  ],
  M: [
    {
      name: "Manual Testing",
      link: "/docs/concepts/reference/glossary/manual-testing",
      desc: "Human-driven testing without automation."
    },
    {
      name: "Mocks",
      link: "/docs/concepts/reference/glossary/mocks",
      desc: "Simulated objects to mimic real components."
    },
    {
      name: "Microservice Testing",
      link: "/docs/concepts/reference/glossary/microservice-testing",
      desc: "Testing individual microservices independently."
    },
  ],
  R: [
    {
      name: "Regression Testing",
      link: "/docs/concepts/reference/glossary/regression-testing",
      desc: "Ensures new code changes do not break existing functionality."
    },
  ],
  S: [
    {
      name: "Stubs",
      link: "/docs/concepts/reference/glossary/stubs",
      desc: "Dummy modules to replace real modules for testing."
    },
    {
      name: "Software Testing Life Cycle",
      link: "/docs/concepts/reference/glossary/software-testing-life-cycle",
      desc: "Phases of testing process."
    },
  ],
  T: [
    {
      name: "Test Driven TDD",
      link: "/docs/concepts/reference/glossary/test-driven-development",
      desc: "Writing tests before code development."
    },
    {
      name: "Test Data Generation",
      link: "/docs/concepts/reference/glossary/test-data-generation",
      desc: "Creating data sets for testing purposes."
    },
  ],
  U: [
    {
      name: "Unit Test Automation",
      link: "/docs/concepts/reference/glossary/unit-test-automation",
      desc: "Automated testing of individual units."
    },
    {
      name: "Unit Testing",
      link: "/docs/concepts/reference/glossary/unit-testing",
      desc: "Testing smallest testable parts of software."
    },
  ],
  W: [
    {
      name: "White Box Testing",
      link: "/docs/concepts/reference/glossary/white-box-testing",
      desc: "Testing internal structures or workings of an application."
    },
  ],
};


  const { siteConfig, siteMetadata } = useDocusaurusContext();

  return (
    <Layout
      title="Glossary"
      permalink="/reference/glossary"
      description="Glossary of testing terms for Keploy documentation."
    >
      <main className="margin-vert--lg container">
        <div className="text-center text-4xl font-bold mb-8">Glossary</div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {alphabet.split("").map((char) => (
            <button
              key={char}
              onClick={() => handleLetterClick(char)}
              disabled={!entries[char]}
              className={`rounded-full px-3 py-1 font-semibold transition-all duration-300 ease-in-out
                ${!entries[char]
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : activeLetter === char
                  ? "bg-orange-500 text-white shadow-md scale-110"
                  : "bg-gray-100 text-gray-700 hover:bg-orange-200"}`}
            >
              {char}
            </button>
          ))}
        </div>

        {Object.entries(entries).map(([letter, terms]) => (
          <section
            key={letter}
            ref={(el) => (sectionRefs.current[letter] = el)}
            className="mb-10"
          >
            <h2 className="text-2xl font-bold mb-4" id={letter}>
              {letter}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {terms.map(({ name, link, desc }, i) => (
                <a
                  key={i}
                  href={link}
                  className="block rounded-lg border border-gray-300 dark:border-gray-600 p-4 shadow-sm transition-transform hover:scale-105 hover:shadow-md bg-white dark:bg-gray-800"
                >
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
                    {name}
                  </div>
                  {desc && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {desc}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </section>
        ))}
      </main>
    </Layout>
  );
}

export default Glossary;
