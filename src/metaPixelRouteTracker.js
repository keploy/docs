// Re-fire Meta Pixel PageView on client-side route changes.
// The base snippet in docusaurus.config.js (headTags) only fires PageView on
// the initial load; Docusaurus is an SPA, so in-app navigation must be tracked
// explicitly here.
export function onRouteDidUpdate({location, previousLocation}) {
  if (previousLocation && location.pathname !== previousLocation.pathname) {
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }
}
