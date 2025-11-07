import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // immediate redirect without adding to browser history
      window.location.replace("/docs");
    }
  }, []);

  // render nothing (no content shown)
  return null;
}
