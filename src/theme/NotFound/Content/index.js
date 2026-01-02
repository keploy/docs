import React, {useEffect} from "react";
import Link from "@docusaurus/Link";
import {useHistory} from "@docusaurus/router";

export default function NotFoundContent() {
  const history = useHistory();

  // Hide the global Docusaurus navbar/announcement bar on 404
  useEffect(() => {
    if (typeof document === "undefined") return;
    
    // Nuclear option: Direct DOM manipulation to hide headers
    const hideHeaders = () => {
      const selectors = [
        '.navbar', 
        'nav.navbar', 
        'div[class*="announcementBar"]', 
        'div[class^="announcementBar_"]',
        '.navbar__inner'
      ];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.height = '0';
        });
      });
    };

    // Run immediately
    hideHeaders();
    
    // Also run on a small delay because Docusaurus might re-render
    const timer = setTimeout(hideHeaders, 500);
    const timer2 = setTimeout(hideHeaders, 2000);

    document.documentElement.classList.add("keploy-notfound-active");
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      document.documentElement.classList.remove("keploy-notfound-active");
      // Restore headers when leaving 404
      const selectors = ['.navbar', 'nav.navbar', 'div[class*="announcementBar"]'];
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          el.style.display = '';
          el.style.visibility = '';
          el.style.height = '';
        });
      });
    };
  }, []);

  const openSearch = () => {
    if (typeof window === "undefined") return;
    const isMac = /Mac|iPhone|iPad|iPod/i.test(window.navigator?.platform ?? "");
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        code: "KeyK",
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
      })
    );
  };

  const handleGoBack = () => {
    if (history.length > 1) {
      history.goBack();
    } else {
      history.push("/docs");
    }
  };

  const isMac = typeof window !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(window.navigator?.platform ?? "");

  return (
    <div className="relative min-h-screen bg-[#f9fafb] dark:bg-[#141414]">
      {/* Custom Pill Header */}
      <header className="mx-auto w-full max-w-6xl px-6 pt-8">
        <div className="rounded-full bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur-md dark:bg-[#1a1a1a]/70">
          <div className="flex items-center gap-3 md:gap-5">
            {/* Logo */}
            <Link to="/docs" className="flex items-center gap-2 hover:no-underline">
              <img
                src="/docs/img/keploy-logo-dark.svg"
                alt="Keploy"
                className="h-7 w-auto dark:invert"
              />
            </Link>

            {/* Nav Menu (desktop only) */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/docs/keploy-explained/introduction/" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[#ff914d] hover:no-underline">
                Technology <span className="ml-1 text-gray-500">⌄</span>
              </Link>
              <Link to="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[#ff914d] hover:no-underline">
                Community <span className="ml-1 text-gray-500">⌄</span>
              </Link>
              <Link to="/docs" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-[#ff914d] hover:no-underline">
                Resources <span className="ml-1 text-gray-500">⌄</span>
              </Link>
            </nav>

            {/* Right Side */}
            <div className="ml-auto flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button
                onClick={openSearch}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-600 transition-all hover:border-[#ff914d] hover:text-[#ff914d] dark:border-gray-600 dark:bg-[#141414] dark:text-gray-400"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden rounded border border-gray-300 px-1.5 py-0.5 text-xs dark:border-gray-600 md:inline">
                  {isMac ? "⌘" : "Ctrl"} K
                </kbd>
              </button>

              {/* Badges */}
              <Link 
                to="https://marketplace.visualstudio.com/items?itemName=Keploy.keployio" 
                className="hidden items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:no-underline hover:border-[#ff914d] dark:border-gray-600 dark:bg-[#141414] dark:text-gray-300 sm:flex"
              >
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352z"/>
                </svg>
                1.1M
              </Link>
              
              <Link 
                to="https://github.com/keploy/keploy" 
                className="hidden items-center gap-1.5 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:no-underline hover:border-[#ff914d] dark:border-gray-600 dark:bg-[#141414] dark:text-gray-300 sm:flex"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                14.3K
              </Link>

              {/* Sign In */}
              <Link
                to="https://app.keploy.io"
                className="rounded-full bg-[#ff914d] px-4 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#e67643] hover:no-underline hover:text-white"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main 404 Content */}
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        {/* Left Side - Text */}
        <div className="flex-1 text-center lg:text-left">
          <h1 className="mb-2 text-5xl font-bold text-[#ff914d] md:text-6xl lg:text-7xl" style={{fontFamily: "'Aeonik', sans-serif"}}>
            Oops! 404
          </h1>
          <h2 className="mb-6 text-4xl font-bold text-[#ff914d] md:text-5xl lg:text-6xl" style={{fontFamily: "'Aeonik', sans-serif"}}>
            Not Found...
          </h2>

          <p className="mb-8 max-w-lg text-lg text-gray-600 dark:text-gray-400">
            Looks like you've wandered off the beaten path. Our team is working to get you back on track and find what you're looking for.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to="/docs"
              className="inline-flex items-center justify-center rounded-full bg-[#ff914d] px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#e67643] hover:shadow-lg hover:no-underline hover:text-white"
            >
              Back To Home
            </Link>

            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center rounded-full bg-[#ff914d] px-6 py-3 text-base font-semibold text-white shadow-md transition-all hover:bg-[#e67643] hover:shadow-lg"
            >
              Back to Previous Page
            </button>
          </div>
        </div>

        {/* Right Side - Bunny Illustration */}
        <div className="relative flex-1 flex justify-center lg:justify-end">
          <svg
            viewBox="0 0 400 450"
            className="h-auto w-full max-w-sm lg:max-w-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wooden Log Base */}
            <ellipse cx="200" cy="420" rx="120" ry="20" fill="#8B4513" />
            <rect x="80" y="380" width="240" height="40" rx="8" fill="#A0522D" />
            <rect x="85" y="385" width="230" height="30" rx="6" fill="#8B4513" />
            <line x1="100" y1="395" x2="140" y2="395" stroke="#6B3E0A" strokeWidth="2" />
            <line x1="160" y1="400" x2="200" y2="400" stroke="#6B3E0A" strokeWidth="2" />
            <line x1="220" y1="393" x2="280" y2="393" stroke="#6B3E0A" strokeWidth="2" />
            <circle cx="95" cy="400" r="4" fill="#4A2C0A" />
            <circle cx="305" cy="400" r="4" fill="#4A2C0A" />

            {/* Bunny Body */}
            <ellipse cx="200" cy="340" rx="70" ry="55" fill="#F5A623" />
            <ellipse cx="200" cy="355" rx="50" ry="35" fill="#E8941D" opacity="0.5" />
            <ellipse cx="200" cy="345" rx="40" ry="30" fill="#FFD699" />

            {/* Bunny Head */}
            <circle cx="200" cy="230" r="75" fill="#F5A623" />
            <ellipse cx="200" cy="250" rx="55" ry="45" fill="#FFBE5C" opacity="0.6" />

            {/* Ears */}
            <ellipse cx="130" cy="120" rx="25" ry="70" fill="#F5A623" transform="rotate(-15 130 120)" />
            <ellipse cx="130" cy="120" rx="15" ry="50" fill="#FFB88C" transform="rotate(-15 130 120)" />
            <ellipse cx="270" cy="120" rx="25" ry="70" fill="#F5A623" transform="rotate(15 270 120)" />
            <ellipse cx="270" cy="120" rx="15" ry="50" fill="#FFB88C" transform="rotate(15 270 120)" />

            {/* Eyes */}
            <ellipse cx="165" cy="225" rx="22" ry="25" fill="white" />
            <ellipse cx="165" cy="228" rx="14" ry="16" fill="#3D2314" />
            <circle cx="160" cy="222" r="5" fill="white" />
            <ellipse cx="235" cy="225" rx="22" ry="25" fill="white" />
            <ellipse cx="235" cy="228" rx="14" ry="16" fill="#3D2314" />
            <circle cx="230" cy="222" r="5" fill="white" />

            {/* Eyebrows */}
            <ellipse cx="165" cy="195" rx="15" ry="5" fill="#D4851A" />
            <ellipse cx="235" cy="195" rx="15" ry="5" fill="#D4851A" />

            {/* Nose & Mouth */}
            <ellipse cx="200" cy="270" rx="12" ry="8" fill="#3D2314" />
            <path d="M185 285 Q200 298 215 285" stroke="#3D2314" strokeWidth="3" fill="none" strokeLinecap="round" />
            <line x1="200" y1="278" x2="200" y2="290" stroke="#3D2314" strokeWidth="2" />

            {/* Cheeks */}
            <ellipse cx="140" cy="260" rx="15" ry="10" fill="#FFB88C" opacity="0.6" />
            <ellipse cx="260" cy="260" rx="15" ry="10" fill="#FFB88C" opacity="0.6" />

            {/* Paws */}
            <ellipse cx="150" cy="370" rx="25" ry="20" fill="#F5A623" />
            <ellipse cx="250" cy="370" rx="25" ry="20" fill="#F5A623" />

            {/* Warning Sign */}
            <g transform="translate(300, 200)">
              <rect x="15" y="50" width="8" height="100" fill="#8B7355" rx="2" />
              <rect x="-15" y="0" width="70" height="60" rx="5" fill="white" stroke="#E0E0E0" strokeWidth="2" />
              <path d="M20 15 L40 50 L0 50 Z" fill="none" stroke="#F5A623" strokeWidth="4" strokeLinejoin="round" />
              <line x1="20" y1="25" x2="20" y2="38" stroke="#F5A623" strokeWidth="4" strokeLinecap="round" />
              <circle cx="20" cy="45" r="2.5" fill="#F5A623" />
            </g>
          </svg>
        </div>
      </main>
    </div>
  );
}
