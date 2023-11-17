import React, {useEffect, useState} from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

function Glossary() {
  const [state, setState] = useState(() => {
    const alphabet = "ABCEFIMRSUW";
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
        link: "/concepts/reference/glossary/acceptance-testing",
      },
      {
        name: "Agile Unit Testing",
        link: "/concepts/reference/glossary/agile-unit-testing",
      },
    ],
    B: [
      {
        name: "BDD",
        link: "/concepts/reference/glossary/behaviour-driven-development",
      },
      {
        name: "Beta Testing",
        link: "/concepts/reference/glossary/beta-testing",
      },
      {
        name: "Black Box Testing",
        link: "/concepts/reference/glossary/black-box-testing",
      },
    ],
    C: [
      {
        name: "Component Testing",
        link: "/concepts/reference/glossary/component-testing",
      },
    ],
    E: [
      {
        name: "End To End Testing",
        link: "/concẻpts/reference/glossary/end-to-end-testing",
      },
    ],
    F: [
      {
        name: "Functional Testing",
        link: "/concepts/reference/glossary/functional-testing",
      },
    ],
    I: [
      {
        name: "Integration Testing",
        link: "/concepts/reference/glossary/integration-testing",
      },
      {
        name: "Idempotency",
        link: "/concepts/reference/glossary/idempotency",
      },
    ],
    M: [
      {
        name: "Manual Testing",
        link: "/concepts/reference/glossary/manual-testing",
      },
      {name: "Mocks", link: "/concepts/reference/glossary/mocks"},
    ],
    R: [
      {
        name: "Regression Testing",
        link: "/concepts/reference/glossary/regression-testing",
      },
    ],
    S: [{name: "Stubs", link: "/concepts/reference/glossary/stubs"}],
    U: [
      {
        name: "Unit Test Automation",
        link: "/concepts/reference/glossary/unit-test-automation",
      },
      {
        name: "Unit Testing",
        link: "/concepts/reference/glossary/unit-testing",
      },
    ],
    W: [
      {
        name: "White Box Testing",
        link: "/concepts/reference/glossary/white-box-testing",
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
        <div className="pb-5 text-center font-bold text-4xl">Glossary</div>
        <div className="flex flex-row justify-evenly">
          {new Array(26).fill(0).map((x, i) => (
            <button
              className={`col-span-1  gap-2 rounded-sm p-3
                    ${
                      state[String.fromCharCode(65 + i)]
                        ? "text-black-200 rounded-3xl bg-orange-200 font-bold shadow-md hover:text-orange-950"
                        : entries[String.fromCharCode(65 + i)] === undefined
                        ? "bg-transparent text-gray-400" // Modified color class
                        : "bg-grey-200 rounded-3xl shadow-md"
                    } `}
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
        <div className="-mb-3 mt-10 flex flex-wrap justify-center gap-4 text-xl font-semibold">
          {Object.entries(state).map(([key, value]) => {
            return (
              <div key={key} className="col-span-3 mb-4 w-1/4">
                <div key={key}>{value ? key : ""}</div>
                {value ? (
                  <div className="text-l flex grid justify-around">
                    {entries[key]?.map(({name, link}, i) => (
                      <a
                        className="text-orange-600 hover:text-orange-950 hover:underline"
                        key={i}
                        href={link}
                      >
                        {name}
                      </a>
                    ))}
                  </div>
                ) : (
                  ""
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
