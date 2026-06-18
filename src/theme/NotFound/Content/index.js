import {useEffect} from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";

export default function NotFound() {
  const homeUrl = useBaseUrl("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.location.replace(homeUrl);
    }
  }, [homeUrl]);

  return null;
}
