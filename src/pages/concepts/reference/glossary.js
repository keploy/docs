import React, { useState, useRef, useEffect } from "react";
import Layout from "@theme/Layout";
import Head from "@docusaurus/Head";
import clsx from "clsx";

function Glossary() {
  // Initialize refs for each section
  const sectionRefs = useRef({});
  // Track which section is in view for navbar highlight
  const [activeLetter, setActiveLetter] = useState("A");

  // Initialize state for toggling sections
  const [expandedSections, setExpandedSections] = useState(() => {
    const sections = {};
    "ABCEFGIMRSTUW".split('').forEach(letter => {
      sections[letter] = true;
    });
    return sections;
  });

  // Scroll to section when navbar letter is clicked
  // Lock highlight on clicked letter until its section is at the top
  const [scrollTargetLetter, setScrollTargetLetter] = useState(null);
  const scrollToSection = (letter) => {
    // Always expand the section before scroll
    setExpandedSections(prev => ({ ...prev, [letter]: true }));
    setScrollTargetLetter(letter);
    setActiveLetter(letter);
    setTimeout(() => {
      if (sectionRefs.current[letter]) {
        sectionRefs.current[letter].scrollIntoView({ behavior: 'instant', block: 'start' });
        // Offset for sticky navbar (default 150px)
        window.scrollBy({ top: -150, behavior: 'smooth' });
      }
    }, 0);
  };




  // Intersection Observer for active section
  useEffect(() => {
    const handleScroll = () => {
      // Get all refs in DOM order
      const sectionList = Object.entries(sectionRefs.current)
        .filter(([letter, ref]) => !!ref && expandedSections[letter])
        .map(([letter, ref]) => ({ letter, top: ref.getBoundingClientRect().top }));
      // If a scroll target is set, keep highlight until its section is at the top
      if (scrollTargetLetter) {
        const targetSection = sectionList.find(s => s.letter === scrollTargetLetter);
        if (targetSection && Math.abs(targetSection.top) < 4) {
          setActiveLetter(scrollTargetLetter);
          setScrollTargetLetter(null); // Unlock
        } else {
          setActiveLetter(scrollTargetLetter);
        }
        return;
      }
      // Find the section closest to (but not below) the top of viewport, only among expanded
      let closest = null;
      let minDist = Infinity;
      sectionList.forEach(({ letter, top }) => {
        if (top <= 150 && Math.abs(top) < minDist) {
          minDist = Math.abs(top);
          closest = letter;
        }
      });
      // Fallback: if no section is visible, keep the last activeLetter
      if (closest) {
        setActiveLetter(closest);
      }
      // else do not update activeLetter, keep last clicked

    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Call once to set initial
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [expandedSections, scrollTargetLetter]);

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
          <p className="text-gray-600 text-lg opacity-80">
            Browse our comprehensive glossary of testing and development terms used throughout Keploy's documentation.
          </p>
        </div>

        {/* Alphabet Navigation */}
        <div className="sticky top-16 z-10 py-4 mb-8 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
            {Array.from({ length: 26 }, (_, i) => {
              const letter = String.fromCharCode(65 + i);
              const hasTerms = entries[letter] !== undefined;
              const isActive = expandedSections[letter];
              
              return (
                <button
                  key={letter}
                  onClick={() => scrollToSection(letter)}
                  disabled={!hasTerms}
                  className={clsx(
                    'w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 font-medium',
                    {
                      'bg-orange-200 text-orange-900 font-bold shadow-md': activeLetter === letter && hasTerms,
                      'text-gray-400 cursor-not-allowed': !hasTerms,
                      'text-gray-700 hover:bg-gray-100': activeLetter !== letter && hasTerms
                    }
                  )}
                  aria-label={`Scroll to ${letter} section`}
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
              <div
                key={letter}
                ref={el => (sectionRefs.current[letter] = el)}
                className="space-y-4"
              >
                <div className="flex items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {letter}
                  </h2>
                  <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {terms.length} {terms.length === 1 ? 'term' : 'terms'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {terms.map(({ name, link }, index) => (
                    <a
                      key={index}
                      href={link}
                      className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {name}
                          </h3>
                        </div>
                        <div className="ml-2 text-orange-500">
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
