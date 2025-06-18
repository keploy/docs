import React, {useState} from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Glossary() {
  const [state, setState] = useState(() => {
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
        description: "Testing conducted to determine if requirements are met and system is ready for deployment."
      },
      {
        name: "Agile Unit Testing",
        link: "/docs/concepts/reference/glossary/agile-unit-testing",
        description: "Unit testing practices adapted for agile development methodologies and continuous integration."
      },
      {
        name: "AI Test Completion",
        link: "/docs/concepts/reference/glossary/ai-test-completion",
        description: "Automated test generation and completion using artificial intelligence techniques."
      },
    ],
    B: [
      {
        name: "BDD",
        link: "/docs/concepts/reference/glossary/behaviour-driven-development",
        description: "Behavior-Driven Development approach focusing on collaboration between developers and business stakeholders."
      },
      {
        name: "Beta Testing",
        link: "/docs/concepts/reference/glossary/beta-testing",
        description: "Testing performed by end users in a real environment before final release."
      },
      {
        name: "Black Box Testing",
        link: "/docs/concepts/reference/glossary/black-box-testing",
        description: "Testing method that examines functionality without knowledge of internal code structure."
      },
    ],
    C: [
      {
        name: "Code Coverage",
        link: "/docs/concepts/reference/glossary/code-coverage",
        description: "Metric measuring the percentage of code executed during testing."
      },
      {
        name: "Cucumber Testing",
        link: "/docs/concepts/reference/glossary/cucumber-testing",
        description: "BDD framework that uses natural language specifications for automated testing."
      },
    ],
    E: [
      {
        name: "End To End Testing",
        link: "/docs/concepts/reference/glossary/end-to-end-testing",
        description: "Complete testing of application workflow from start to finish in real-world scenarios."
      },
      {
        name: "Error Guessing",
        link: "/docs/concepts/reference/glossary/error-guessing",
        description: "Testing technique based on tester's experience to identify potential problem areas."
      },
    ],
    F: [
      {
        name: "Functional Testing",
        link: "/docs/concepts/reference/glossary/functional-testing",
        description: "Testing that validates software functions according to specified requirements."
      },
    ],
    G: [
      {
        name: "Gray Box Testing",
        link: "/docs/concepts/reference/glossary/gray-box-testing",
        description: "Testing approach combining black box and white box testing techniques."
      },
    ],
    I: [
      {
        name: "Integration Testing",
        link: "/docs/concepts/reference/glossary/integration-testing",
        description: "Testing the interfaces and interaction between integrated software components."
      },
      {
        name: "Idempotency",
        link: "/docs/concepts/reference/glossary/idempotency",
        description: "Property ensuring operations can be applied multiple times with the same result."
      },
    ],
    M: [
      {
        name: "Manual Testing",
        link: "/docs/concepts/reference/glossary/manual-testing",
        description: "Testing process executed manually by human testers without automation tools."
      },
      {
        name: "Mocks",
        link: "/docs/concepts/reference/glossary/mocks",
        description: "Simulated objects that mimic real components for isolated testing."
      },
      {
        name: "Microservice Testing",
        link: "/docs/concepts/reference/glossary/microservice-testing",
        description: "Testing strategies specific to microservices architecture and distributed systems."
      },
    ],
    R: [
      {
        name: "Regression Testing",
        link: "/docs/concepts/reference/glossary/regression-testing",
        description: "Testing to ensure new changes don't break existing functionality."
      },
    ],
    S: [
      {
        name: "Stubs",
        link: "/docs/concepts/reference/glossary/stubs",
        description: "Simplified implementations used as placeholders during testing."
      },
      {
        name: "Software Testing Life Cycle",
        link: "/docs/concepts/reference/glossary/software-testing-life-cycle",
        description: "Systematic process defining phases and activities in software testing."
      },
    ],
    T: [
      {
        name: "Test Driven TDD",
        link: "/docs/concepts/reference/glossary/test-driven-development",
        description: "Development approach where tests are written before the actual code implementation."
      },
      {
        name: "Test Data Generation",
        link: "/docs/concepts/reference/glossary/test-data-generation",
        description: "Process of creating relevant data sets for testing purposes."
      },
    ],
    U: [
      {
        name: "Unit Test Automation",
        link: "/docs/concepts/reference/glossary/unit-test-automation",
        description: "Automated execution of unit tests to validate individual code components."
      },
      {
        name: "Unit Testing",
        link: "/docs/concepts/reference/glossary/unit-testing",
        description: "Testing individual software components in isolation from the rest of the system."
      },
    ],
    W: [
      {
        name: "White Box Testing",
        link: "/docs/concepts/reference/glossary/white-box-testing",
        description: "Testing method that examines internal code structure and logic paths."
      },
    ],
  };

  const {siteConfig, siteMetadata} = useDocusaurusContext;
  const handleClick = (index) => {
    setState((state) => {
      var obj = {
        ...state,
        [index]: !state[index],
      };
      return obj;
    });
  };
  return (
    <Layout
      title="About the docs"
      permalink="/reference/glossary"
      description="User General Information about Keploy's Documentation"
    >
      <main className="margin-vert--lg container flex flex-col justify-evenly">
        <div className="pb-5 text-center text-4xl font-bold">Glossary</div>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-center">All your testing needs in a place.</p>
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {new Array(26).fill(0).map((x, i) => (
            <button
              className={`w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200 transform hover:scale-105 ${
                state[String.fromCharCode(65 + i)]
                  ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-600"
                  : entries[String.fromCharCode(65 + i)] === undefined
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500"
                  : "bg-white text-gray-700 shadow-sm hover:shadow-md hover:bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              }`}
              key={i}
              disabled={entries[String.fromCharCode(65 + i)] === undefined}
              onClick={() => handleClick(String.fromCharCode(65 + i))}
            >
              {String.fromCharCode(65 + i)}
            </button>
          ))}
        </div>

        <div className="space-y-12">
          {Object.entries(state).map(([key, value]) => {
            if (!value || !entries[key]) return null;
            return (
              <div key={key} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    {key}
                  </h2>
                  <div className="mx-auto w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"></div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                  {entries[key]?.map(({name, link, description}, i) => (
                    <a
                      key={`${key}-${i}`}
                      href={link}
                      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-300 transform hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer overflow-hidden w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] max-w-sm flex flex-col"
                    >
                      <div className="p-5 flex-grow">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 leading-tight mb-3">
                          {name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {description}
                        </p>
                      </div>
                      <div className="h-1 bg-gradient-to-r from-orange-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {Object.entries(state).every(([key, value]) => !value || !entries[key]) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              Select categories above to view glossary terms
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Glossary;