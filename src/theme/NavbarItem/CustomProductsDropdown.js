import React, {useEffect, useRef, useState} from "react";
import Link from "@docusaurus/Link";
import { useColorMode } from '@docusaurus/theme-common';

export default function CustomProductsDropdown() {
  const [drop, setDrop] = useState(false);
  const dropdownRef = useRef(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDrop(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setDrop(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative font-inter font-medium mr-2 hidden lg:block">
      <div className="flex flex-col relative">
        <div className="w-max">
          <button
            onClick={() => setDrop(!drop)}
            aria-haspopup="true"
            aria-expanded={drop}
            aria-controls="product-dropdown"
            className="flex justify-center items-center gap-x-1 cursor-pointer hover:text-[#ff8a3c] transition-all duration-200"
          >
            <div>Product</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`size-5 transition-transform duration-200 mt-1 stroke-[2] ${drop ? 'rotate-180' : 'rotate-0'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>

        <div
          id="product-dropdown"
          role="menu"
          className={`absolute top-full mt-5 left-[125%] grid grid-cols-2 grid-rows-2 gap-x-16 gap-y-3 w-[48rem] backdrop-blur-sm p-4 rounded-lg z-50 transition-all duration-200 transform ${
            drop ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          } ${colorMode === 'dark' ? 'bg-dark/50' : 'bg-white/50'}`}
        >
          <Link
            to="/running-keploy/utg-pr-agent/"
            role="menuitem"
            tabIndex={drop ? 0 : -1}
            className="group col-span-1 row-span-2 rounded-lg w-[425px] h-[400px] bg-white border border-orange-300 overflow-hidden hover:scale-105 transition duration-300"
          >
            <div className="m-4">
              <div className="text-[16px] text-gray-900">Unit Testing</div>
              <div className="text-gray-500 text-[11px]">Generate unit test with mocks in seconds</div>
            </div>
            <img
              src={require("@site/static/img/unitTest.png").default}
              className="rounded-lg h-[323px] group-hover:blur-[2px] transition duration-300"
              alt="Unit Testing"
            />
          </Link>

          <Link
            to="/keploy-explained/introduction"
            role="menuitem"
            tabIndex={drop ? 0 : -1}
            className="group col-span-1 row-span-1 rounded-lg border border-orange-300 overflow-hidden hover:scale-105 transition duration-300 bg-white"
          >
            <div className="mx-4 mt-2">
              <div className="text-[16px] text-gray-900">API Testing</div>
              <div className="text-gray-500 text-[11px] bg-white/50 backdrop-blur-lg">
                Automatically record, replay, and validate APIs
              </div>
            </div>
            <img
              src={require("@site/static/img/apiTest.png").default}
              className="mt-3 h-[123px] group-hover:blur-[2px] transition duration-300"
              alt="API Testing"
            />
          </Link>

          <Link
            to="/running-keploy/about-api-testing"
            role="menuitem"
            tabIndex={drop ? 0 : -1}
            className="group col-span-1 row-span-1 rounded-lg border border-orange-300 overflow-hidden hover:scale-105 bg-white transition duration-300"
          >
            <div className="mx-4 mt-2">
              <div className="text-[16px] text-gray-900">Integration Testing</div>
              <div className="text-gray-500 text-[11px] bg-white/50 backdrop-blur-lg">
                Open-source testing infrastructure for devs
              </div>
            </div>
            <img
              src={require("@site/static/img/integrationTest.png").default}
              className="mt-3 h-[120px] group-hover:blur-[2px] transition duration-300 w-[400px] ml-2"
              alt="Integration Testing"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
