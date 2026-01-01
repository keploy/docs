import React, { useEffect, useState } from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function NotFound() {
  const [countdown, setCountdown] = useState(12);
  const homeUrl = useBaseUrl("/");

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          window.location.href = homeUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [homeUrl]);

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto my-12 flex max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="flex flex-col items-center justify-between sm:flex-row">
          {/* Rabbit Image */}
          <div className="mb-8 flex justify-center">
            <img
              src={useBaseUrl("/img/404-error.png")}
              alt="404 - Page Not Found"
              className="h-auto w-full max-w-md sm:max-w-lg"
              style={{ maxHeight: "400px" }}
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center justify-center">
            <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-8xl">
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                404
              </span>
            </h1>

            <h2 className="mb-4 text-2xl font-semibold md:text-4xl">
              Page Not Found
            </h2>

            <p className="mb-8 max-w-xl text-lg text-[color:var(--ifm-color)] opacity-80">
              Looks like you’ve taken a wrong turn. The page you’re looking for
              doesn’t exist or may have been moved.
            </p>

            {/* Countdown */}
            <p className="mb-10 text-sm text-[color:var(--ifm-color)] opacity-70">
              Redirecting to homepage in{" "}
              <span className="font-bold text-orange-500 animate-pulse">
                {countdown}s
              </span>
              …
            </p>

            {/* CTA buttons */}
            <div className="mb-14 flex flex-col gap-4 sm:flex-row">
              <Link
                to={homeUrl}
                className="rounded-full bg-[color:var(--ifm-color-primary)] px-8 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-[color:var(--ifm-color-primary-dark)]"
              >
                Go to Homepage
              </Link>

            </div>
          </div>
        </div>

        {/* Popular pages */}
        <div className="w-full max-w-3xl">
          <h3 className="mb-6 text-xl font-semibold tracking-wide">
            Popular Pages
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                title: "Installation",
                desc: "Get started with Keploy installation",
                link: "/server/installation",
              },
              {
                title: "Introduction",
                desc: "Learn what Keploy is and how it works",
                link: "/keploy-explained/introduction",
              },
              {
                title: "API Test Generator",
                desc: "Generate API tests automatically",
                link: "/running-keploy/api-test-generator",
              },
              {
                title: "Glossary",
                desc: "Explore Keploy terminology",
                link: "/concepts/reference/glossary",
              },
            ].map((item) => (
              <Link
                key={item.title}
                to={useBaseUrl(item.link)}
                className="group rounded-xl bg-[color:var(--ifm-card-background-color)] p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-[color:var(--ifm-color-primary)] group-hover:underline">
                  {item.title}
                </h4>
                <p className="text-sm text-[color:var(--ifm-color)] opacity-80">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
