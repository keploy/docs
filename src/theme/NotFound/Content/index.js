import React from 'react';
import { useHistory } from '@docusaurus/router';
import { translate } from '@docusaurus/Translate';
import { Home, ArrowLeft } from 'lucide-react';

/**
 * Custom 404 Page Component for Keploy Docs
 * 
 * Issue #3441: Add styled 404 page to docs website
 * Requirements from @amaan-bhati:
 * - Styled 404 page (not auto-redirect)
 * - Docs navbar/header (already provided by Layout wrapper)
 * - "Back to Home" button to return to docs homepage
 * - "Go to Previous Page" button (if navigation history exists)
 * - Good illustration/image that says 404
 * - Should work with dark/light theme
 * - Responsive design for mobile and desktop
 */
export default function NotFoundContent() {
  const history = useHistory();

  // Handle "Go to Previous Page" button click
  const handleGoBack = () => {
    // Check if there's previous page in history
    if (window.history.length > 1) {
      history.goBack();
    } else {
      // If no history, go to home
      history.push('/docs/');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-var(--ifm-navbar-height))] items-center justify-center px-4 py-16">
      {/* Two-column layout: Text on left, Image on right */}
      <div className="flex max-w-6xl flex-col-reverse items-center gap-12 lg:flex-row lg:gap-16">

        {/* Left Column: Text Content and Buttons */}
        <div className="flex-1 text-center lg:text-left">
          {/* Error Message */}
          <h1 className="mb-4 text-6xl font-bold text-[color:var(--ifm-color-primary)]">
            Oops! 404
          </h1>

          <h2 className="mb-4 text-3xl font-semibold text-[color:var(--ifm-color)]">
            {translate({
              id: 'theme.NotFound.title',
              message: 'Page Not Found',
            })}
          </h2>

          <p className="mb-8 text-lg text-[color:var(--ifm-color-emphasis-600)]">
            {translate({
              id: 'theme.NotFound.p1',
              message: "We couldn't find what you're looking for. The page you are trying to access doesn't exist or has been moved.",
            })}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
            {/* Primary Button: Back to Home */}
            <a
              href="/docs/"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[color:var(--ifm-color-primary)] px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[color:var(--ifm-color-primary-dark)] hover:no-underline hover:text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--ifm-color-primary)] focus:ring-offset-2"
              aria-label="Go back to documentation homepage"
            >
              <Home size={20} aria-hidden="true" />
              Back to Home
            </a>

            {/* Secondary Button: Go to Previous Page */}
            <button
              onClick={handleGoBack}
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[color:var(--ifm-color-primary)] bg-transparent px-6 py-3 font-semibold text-[color:var(--ifm-color-primary)] shadow-sm transition-all hover:scale-105 hover:bg-[color:var(--ifm-color-primary)] hover:text-white focus:outline-none focus:ring-2 focus:ring-[color:var(--ifm-color-primary)] focus:ring-offset-2"
              aria-label="Navigate to previous page"
            >
              <ArrowLeft size={20} aria-hidden="true" />
              Go to Previous Page
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 border-t border-[color:var(--ifm-color-emphasis-300)] pt-8">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-[color:var(--ifm-color-emphasis-600)]">
              Helpful Links
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm lg:justify-start">
              <a
                href="/docs/server/installation"
                className="text-[color:var(--ifm-color-primary)] hover:underline"
              >
                Installation Guide
              </a>
              <span className="text-[color:var(--ifm-color-emphasis-400)]">•</span>
              <a
                href="/docs/concepts/reference/glossary/"
                className="text-[color:var(--ifm-color-primary)] hover:underline"
              >
                Glossary
              </a>
              <span className="text-[color:var(--ifm-color-emphasis-400)]">•</span>
              <a
                href="https://github.com/keploy/keploy"
                className="text-[color:var(--ifm-color-primary)] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repository
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: 404 Illustration */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src="/docs/img/404-not-found.png"
            alt="404 - Page not found illustration"
            className="h-auto w-full max-w-md object-contain"
          />
        </div>

      </div>
    </div>
  );
}
