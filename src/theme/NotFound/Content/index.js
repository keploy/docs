import {useEffect} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function NotFound() {
  const homeUrl = useBaseUrl("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(homeUrl);
    }
  }, [homeUrl]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-extrabold md:text-8xl">
        <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
          404
        </span>
      </h1>
    </div>
  );
}
