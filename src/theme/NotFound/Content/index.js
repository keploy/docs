import React, { useEffect } from "react";
import { PageMetadata } from "@docusaurus/theme-common";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";


export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/docs/";
    }, 1000);


    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageMetadata title="Page Not Found" />
      <main className="mx-auto max-w-screen-lg p-6 md:p-10">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          {/* 404 Error */}
          <div className="rounded-lg bg-[color:var(--ifm-card-background-color)] p-8 shadow-lg">
            <svg
              className="mx-auto h-24 w-24 text-[color:var(--ifm-color-primary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-9a9 9 0 110 18 9 9 0 010-18z"
              />
            </svg>
          </div>

          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-wide md:text-4xl">
              404 - Page Not Found
            </h1>
            <p className="text-xl max-w-2xl">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              className="scale flex items-center justify-center space-x-2 rounded-lg bg-[color:var(--ifm-color-primary)] px-4 py-2 text-white shadow-lg hover:no-underline hover:text-white"
              to={useBaseUrl("/")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Go to Homepage</span>
            </Link>
            <Link
              className="scale flex items-center justify-center space-x-2 rounded-lg bg-[color:var(--ifm-card-background-color)] px-4 py-2 shadow-lg hover:no-underline"
              to={useBaseUrl("/keploy-explained/introduction")}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span>Browse Documentation</span>
            </Link>
          </div>


        </div>
      </main>
    </>
  );
}
