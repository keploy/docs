import React, { useEffect, useRef, useState } from "react";
import Link from "@docusaurus/Link";
import { useColorMode } from '@docusaurus/theme-common';

export default function CustomBlogDropdown() {
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
    <div
      ref={dropdownRef}
      className="relative font-inter font-medium hidden lg:block"
    >
      <div className="flex flex-col relative">
        <div className="w-max">
          <button
            onClick={() => setDrop((prev) => !prev)}
            className="flex justify-center items-center gap-x-1 cursor-pointer hover:text-[#ff8a3c] transition duration-200"
            aria-haspopup="true"
            aria-expanded={drop}
            aria-controls="blog-dropdown-menu"
          >
            <span>Blog</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className={`size-6 transition-transform duration-1000 ${
                drop ? "rotate-180" : "rotate-0"
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
        </div>


        <div
          id="blog-dropdown-menu"
          role="menu"
          className={`absolute top-full mt-5 left-[25%] grid grid-cols-3 grid-rows-1 gap-x-2 gap-y-3 w-[850px] backdrop-blur-sm p-4 rounded-lg transform transition-all duration-1000 z-50 ${
            drop
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          } ${colorMode === "dark" ? "bg-dark/50" : "bg-white/50"}`}
        >
          <Link
            to="https://keploy.io/blog/technology"
            role="menuitem"
            tabIndex={drop ? 0 : -1}
            className="group col-span-1 row-span-1 rounded-lg bg-white border border-orange-300 overflow-hidden hover:scale-105 transition duration-300"
          >
            <div className="m-4">
              <div className="text-[16px] text-gray-900">Technical Blogs</div>
            </div>
            <img
              src={require("@site/static/img/technicalBlog.png").default}
              className="rounded-lg group-hover:blur-[2px] transition duration-300"
              alt="Technical Blogs"
            />
          </Link>

          <Link
            to="https://keploy.io/blog/community"
            role="menuitem"
            tabIndex={drop ? 0 : -1}
            className="group col-span-1 row-span-1 rounded-lg border border-orange-300 overflow-hidden hover:scale-105 transition duration-300 bg-white"
          >
            <div className="mx-4 mt-4">
              <div className="text-[16px] text-gray-900">Community Articles</div>
            </div>
            <img
              src={require("@site/static/img/communityArticles.png").default}
              className="mt-3 group-hover:blur-[2px] transition duration-300"
              alt="Community Articles"
            />
          </Link>

          <Link
            to="/concepts/reference/glossary/"
            role="menuitem"
            tabIndex={drop ? 0 : -1}
            className="group col-span-1 row-span-1 rounded-lg border border-orange-300 overflow-hidden hover:scale-105 bg-white transition duration-300"
          >
            <div className="mx-4 mt-4">
              <div className="text-[16px] text-gray-900">Glossary</div>
            </div>
            <img
              src={require("@site/static/img/glossary.png").default}
              className="group-hover:blur-[2px] transition duration-300 w-[400px]"
              alt="Glossary"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
