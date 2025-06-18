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
        ink: "/docs/concepts/reference/glossary/stubs",
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
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-800">Glossary</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Learn the key terms and concepts that define software testing, all in one place.
          </p>
          <div className="mt-6 flex flex-col items-center">
            <input
              type="text"
              placeholder="Search glossary..."
              className="w-96 rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <div className="mt-2 text-sm text-gray-400">What word are you interested in?</div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {new Array(26).fill(0).map((x, i) => (
            <button
              className={`mx-1 px-4 py-2 text-sm font-medium rounded-full transition
                ${
                  entries[String.fromCharCode(65 + i)]
                    ? state[String.fromCharCode(65 + i)]
                      ? "bg-orange-500 text-white"
                      : "border border-gray-300 text-gray-700 hover:bg-orange-100"
                    : "text-gray-300 cursor-not-allowed"
                }
              `}

              key={i}
              disabled={
                entries[String.fromCharCode(65 + i)] === undefined
                  ? true
                  : false
              }
              onClick={() => handleClick(String.fromCharCode(65 + i))}
            >
              {String.fromCharCode(65 + i)}
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition w-full">
          {Object.entries(state).map(([key, value]) => {
            return (
              <div key={key} className="w-full mb-8">
                {value && (
                  <>
                    <div className="text-3xl font-bold text-orange-500 mb-4">{key}</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                      {entries[key]?.map(({ name, link }, i) => (
                        <div key={i} className="rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition">
                          <h3 className="text-lg font-semibold text-orange-700">{name}</h3>
                          <p className="text-sm text-gray-500 mt-2">
                            
                          </p>
                          <a href={link} className="mt-4 inline-block text-sm font-medium text-orange-600 hover:underline">
                            Know More →
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

            );
          })}
        </div>
      </main>
    </Layout>
  );
}

export default Glossary;
