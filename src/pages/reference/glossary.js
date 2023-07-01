import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";

function Glossary() {
    const context = useDocusaurusContext();
    const [state, setState] = useState(() => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const initialState = {};
        for (let i = 0; i < alphabet.length; i++) {
            initialState[alphabet[i]] = 0;
        }
        return initialState;
    });
    const entries = {
        'A': [
            { name: 'Acceptance Testing', link: '/docs/concepts/reference/glossary/acceptance-testing' },
            { name: 'Agile Unit Testing', link: '/docs/concepts/reference/glossary/agile-unit-testing' }
        ],
        'B': [
            { name: 'Behaviour Driven Development', link: '/docs/concepts/reference/glossary/behaviour-driven-development' },
            { name: 'Beta Testing', link: '/docs/concepts/reference/glossary/beta-testing' },
            { name: 'Black Box Testing', link: '/docs/concepts/reference/glossary/black-box-testing' }
        ],
        'E': [
            { name: 'End To End Testing', link: '/docs/concepts/reference/glossary/end-to-end-testing' },

        ],
        'U': [
            { name: 'Unit Test Automation', link: '/docs/concepts/reference/glossary/unit-test-automation' },
            { name: 'Unit Testing', link: '/docs/concepts/reference/glossary/unit-testing' },
        ],
        'W': [
            { name: 'White Box Testing', link: '/docs/concepts/reference/glossary/white-box-testing' },

        ]
    }
    const { siteConfig = {} } = context;
    const handleClick = (index) => {
        // const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        // const letter = alphabet[index];
        console.log(index)
        setState((state) => ({
            ...state,
            [index]: !state[index]
        }));
        console.log(state)
    };
    return (
        <Layout
            title="About the docs"
            permalink="/reference/glossary"
            description="User General Information about Keploy's Documentation"
        >
            <main className="margin-vert--lg container">
                <div className="text-4xl font-bold text-center">Glossary</div>
                <div className="grid grid-cols-12 gap-1">
                    {new Array(26).fill(0).map((x, i) => <button className={`col-span-1  p-2 rounded-sm  ${state[String.fromCharCode(65 + i)] ? "bg-orange-200" : "bg-transparent"} `} key={i} disabled={entries[String.fromCharCode(65 + i)] === undefined ? true : false}
                        onClick={() => handleClick(String.fromCharCode(65 + i))}>{String.fromCharCode(65 + i)}</button>)}


                </div>
                <div className="text-xl font-semibold grid grid-cols-8">
                    {Object.entries(state).map(([key, value]) =>
                        <div key={key} className="col-span-2">
                            <div key={key}>{value ? key : ''}</div>
                            {
                                value ?
                                    <div className="flex flex-col p-3">
                                        {entries[key]?.map(({ name, link }, i) => <a className="text-orange-600 hover:text-orange-950 hover:underline" key={i} href={link}>{name}</a>)}
                                    </div>
                                    :
                                    ''
                            }
                        </div>

                    )}
                </div>
            </main>
        </Layout>
    );
}

export default Glossary;
