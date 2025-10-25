import React, { useEffect } from "react";
import {PageMetadata} from "@docusaurus/theme-common";
import {useLocation} from '@docusaurus/router';
import NotFoundPage from "../../../components/NotFoundPage";

export default function NotFound() {
  const location = useLocation();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if we're already in the /docs path
      const newPath = location.pathname.startsWith('/docs') 
        ? '/docs/' 
        : '/docs' + location.pathname;
      window.location.href = newPath;
    }, 1000); // Increased to 1 seconds to match animation

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <>
      <PageMetadata title="404: Page Not Found" />
      <NotFoundPage />
    </>
  );
}
