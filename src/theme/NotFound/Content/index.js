import React, {useEffect} from "react";
import Link from "@docusaurus/Link";
import {useHistory} from "@docusaurus/router";
import {useColorMode} from "@docusaurus/theme-common";

export default function NotFoundContent() {
  const history = useHistory();
  const {colorMode, setColorMode} = useColorMode();

  // Hide the global Docusaurus navbar/announcement bar on 404
  useEffect(() => {
    if (typeof document === "undefined") return;
    
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

    hideHeaders();
    const timer = setTimeout(hideHeaders, 500);
    const timer2 = setTimeout(hideHeaders, 2000);

    document.documentElement.classList.add("keploy-notfound-active");
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      document.documentElement.classList.remove("keploy-notfound-active");
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
    <div className="relative min-h-screen bg-white dark:bg-[#0a0a0a] overflow-x-hidden transition-colors duration-300">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
        @keyframes shadow-pulse {
          0% { transform: scale(1); opacity: 0.14; }
          50% { transform: scale(0.86); opacity: 0.08; }
          100% { transform: scale(1); opacity: 0.14; }
        }
        @keyframes sign-bob {
          0% { transform: rotate(-0.8deg) translateY(0); }
          50% { transform: rotate(0.8deg) translateY(2px); }
          100% { transform: rotate(-0.8deg) translateY(0); }
        }
        @keyframes tear-drop {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-shadow { animation: shadow-pulse 6s ease-in-out infinite; transform-origin: center; }
        .blink { animation: blink 5s infinite; transform-origin: center; transform-box: fill-box; }
        .sign-bob { animation: sign-bob 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
        .animate-tear { animation: tear-drop 3s infinite; }
      `}</style>

      {/* Custom Pill Header */}
      <header className="mx-auto w-full max-w-6xl px-6 pt-8 relative z-50">
        <div className="rounded-full bg-white/95 dark:bg-[#121212]/95 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-gray-800 backdrop-blur-lg">
          <div className="flex items-center gap-3 md:gap-5">
            <Link to="/docs" className="flex items-center gap-2 hover:no-underline">
              <img
                src="/docs/img/keploy-logo-dark.svg"
                alt="Keploy"
                className="h-7 w-auto dark:invert"
              />
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/docs/keploy-explained/introduction/" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#ff914d] hover:no-underline transition-colors">Technology <span className="opacity-30">⌄</span></Link>
              <Link to="/docs/community/" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#ff914d] hover:no-underline transition-colors">Community <span className="opacity-30">⌄</span></Link>
              <Link to="/docs" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-[#ff914d] hover:no-underline transition-colors">Resources <span className="opacity-30">⌄</span></Link>
            </nav>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button onClick={openSearch} className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] px-3 py-1.5 text-sm font-medium text-gray-500 hover:border-[#ff914d] hover:bg-white dark:hover:bg-[#222]">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden rounded bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-700 px-1 py-0.5 text-[10px] md:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
              </button>

              {/* Theme Switcher */}
              <button
                onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-600 dark:text-yellow-400 shadow-sm hover:border-[#ff914d] transition-all"
                title={`Switch to ${colorMode === 'dark' ? 'light' : 'dark'} mode`}
              >
                {colorMode === 'dark' ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>

              {/* Slack */}
              <Link to="https://keploy.io/slack" className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-[#ff914d] hover:no-underline">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.528 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.528 0 0 1 2.521-2.52 2.527 2.528 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.527 2.528 0 0 1 2.521 2.521 2.527 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.527 2.528 0 0 1-2.52 2.52h-2.522v-2.52zM17.688 8.834a2.527 2.528 0 0 1-2.521 2.521 2.527 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.167 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.167 18.958a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.167 24a2.528 2.528 0 0 1-2.522-2.52v-2.52h2.522zM15.167 17.688a2.527 2.528 0 0 1-2.522-2.521 2.527 2.528 0 0 1 2.522-2.521h6.313A2.528 2.528 0 0 1 24 15.167a2.528 2.528 0 0 1-2.52 2.521h-6.313z" /></svg>
                <span className="hidden sm:inline">Slack</span>
              </Link>

              {/* VS Code badge */}
              <Link
                to="https://marketplace.visualstudio.com/items?itemName=Keploy.keployio"
                className="hidden items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:no-underline hover:border-[#ff914d] md:flex"
              >
                <svg className="h-4 w-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352z"/>
                </svg>
                1.1M
              </Link>

              {/* GitHub badge */}
              <Link
                to="https://github.com/keploy/keploy"
                className="hidden items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 text-sm font-bold text-gray-700 dark:text-gray-200 hover:no-underline hover:border-[#ff914d] md:flex"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                14.3K
              </Link>

              <Link to="https://app.keploy.io" className="rounded-full bg-[#ff914d] px-5 py-2 text-sm font-bold text-white hover:bg-[#e67643] hover:no-underline transition-all shadow-md shadow-orange-500/20">Sign in</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-20 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <p className="mb-4 text-xs font-bold tracking-widest text-[#ff914d] uppercase bg-orange-50 dark:bg-orange-900/20 inline-block px-3 py-1 rounded-full">Error Code: 404</p>
          <h1 className="mb-2 text-7xl font-black text-[#ff914d] leading-tight" style={{fontFamily: "'Aeonik', sans-serif"}}>Oops! 404</h1>
          <h2 className="mb-8 text-5xl font-bold text-gray-800 dark:text-gray-100" style={{fontFamily: "'Aeonik', sans-serif"}}>Not Found...</h2>
          <p className="mb-10 max-w-lg text-lg text-gray-500 dark:text-gray-400 leading-relaxed">Looks like you've wandered off the beaten path. Our team is working to get you back on track.</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link to="/docs" className="rounded-full bg-[#ff914d] px-10 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/30 hover:bg-[#e67643] hover:-translate-y-1 transition-all">Back To Home</Link>
            <button onClick={handleGoBack} className="rounded-full border-2 border-gray-100 dark:border-gray-800 bg-white dark:bg-transparent px-10 py-4 text-base font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">Go Back</button>
          </div>
        </div>

        {/* 🐰 Bunny on log (classic mode) */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="animate-float relative z-10">
            <svg viewBox="0 0 400 450" className="h-auto w-full max-w-[420px]" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Log */}
              <ellipse cx="200" cy="420" rx="120" ry="20" fill="#8B4513" />
              <rect x="80" y="380" width="240" height="40" rx="10" fill="#A0522D" />
              <rect x="85" y="386" width="230" height="28" rx="8" fill="#8B4513" />
              <line x1="100" y1="395" x2="145" y2="395" stroke="#6B3E0A" strokeWidth="2" />
              <line x1="165" y1="403" x2="215" y2="403" stroke="#6B3E0A" strokeWidth="2" />
              <line x1="235" y1="394" x2="290" y2="394" stroke="#6B3E0A" strokeWidth="2" />
              <circle cx="98" cy="402" r="4" fill="#4A2C0A" />
              <circle cx="305" cy="402" r="4" fill="#4A2C0A" />

              {/* Bunny body */}
              <ellipse cx="200" cy="340" rx="70" ry="55" fill="#F5A623" />
              <ellipse cx="200" cy="352" rx="45" ry="35" fill="#FFD699" opacity="0.95" />

              {/* Bunny head */}
              <circle cx="200" cy="230" r="75" fill="#F5A623" />
              <ellipse cx="200" cy="250" rx="56" ry="46" fill="#FFBE5C" opacity="0.65" />

              {/* Ears */}
              <ellipse cx="135" cy="120" rx="25" ry="70" fill="#F5A623" transform="rotate(-15 135 120)" />
              <ellipse cx="135" cy="120" rx="15" ry="50" fill="#FFB88C" transform="rotate(-15 135 120)" />
              <ellipse cx="265" cy="120" rx="25" ry="70" fill="#F5A623" transform="rotate(15 265 120)" />
              <ellipse cx="265" cy="120" rx="15" ry="50" fill="#FFB88C" transform="rotate(15 265 120)" />

              {/* Eyes */}
              <ellipse cx="170" cy="225" rx="22" ry="25" fill="white" />
              <ellipse cx="170" cy="228" rx="14" ry="16" fill="#3D2314" />
              <circle cx="165" cy="222" r="5" fill="white" />
              <ellipse cx="230" cy="225" rx="22" ry="25" fill="white" />
              <ellipse cx="230" cy="228" rx="14" ry="16" fill="#3D2314" />
              <circle cx="225" cy="222" r="5" fill="white" />

              {/* Nose & mouth */}
              <ellipse cx="200" cy="270" rx="12" ry="8" fill="#3D2314" />
              <path d="M185 285 Q200 298 215 285" stroke="#3D2314" strokeWidth="3" fill="none" strokeLinecap="round" />
              <line x1="200" y1="278" x2="200" y2="290" stroke="#3D2314" strokeWidth="2" />

              {/* Paws */}
              <ellipse cx="150" cy="370" rx="25" ry="20" fill="#F5A623" />
              <ellipse cx="250" cy="370" rx="25" ry="20" fill="#F5A623" />

              {/* Warning sign */}
              <g transform="translate(300, 200)">
                <rect x="15" y="50" width="8" height="120" fill="#8B7355" rx="2" />
                <rect x="-18" y="0" width="80" height="60" rx="8" fill="white" stroke="#E0E0E0" strokeWidth="2" />
                <path d="M22 12 L42 48 L2 48 Z" fill="none" stroke="#F5A623" strokeWidth="4" strokeLinejoin="round" />
                <line x1="22" y1="22" x2="22" y2="36" stroke="#F5A623" strokeWidth="4" strokeLinecap="round" />
                <circle cx="22" cy="43" r="2.5" fill="#F5A623" />
              </g>
            </svg>
          </div>
          {/* Shadow */}
          <div className="animate-shadow w-72 h-10 bg-black/5 dark:bg-black/40 rounded-full mt-[-40px] blur-2xl"></div>
        </div>
      </main>
    </div>
  );
}
