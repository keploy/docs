// SPA tracker + lazy loader for engagement analytics.
//
//   - Google Analytics (gtag)  -> fires eagerly via the gtag preset in
//     docusaurus.config.js (loads on page load, auto-tracks SPA routes). Not
//     touched here.
//   - Meta Pixel               -> fires eagerly via the inline snippet in
//     headTags (init + PageView on load). Because that only fires once, this
//     module re-fires PageView on client-side (SPA) route changes.
//   - Microsoft Clarity + Apollo -> lazy-loaded on the FIRST user interaction
//     (scroll / click / key / touch): engaged sessions only, so they stay off
//     the initial load.
//   - Hotjar                   -> removed.

// baseUrl is /docs/, so these resolve under the docs site root.
const INTERACTION_SCRIPTS = [
  "/docs/scripts/clarity.js", // Microsoft Clarity
  "/docs/js/apollo-init.js", // Apollo
];
// NB: no "mousemove" — on desktop the pointer moves within milliseconds of
// paint, which would defeat the gate and load Clarity/Apollo almost immediately.
// These are genuine "engaged intent" signals only.
const INTERACTION_EVENTS = ["pointerdown", "keydown", "scroll", "touchstart"];

let engagementLoaded = false;
function loadEngagement() {
  if (engagementLoaded || typeof window === "undefined") return;
  engagementLoaded = true;
  INTERACTION_EVENTS.forEach((e) =>
    window.removeEventListener(e, loadEngagement)
  );
  for (const src of INTERACTION_SCRIPTS) {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    document.head.appendChild(el);
  }
}

function armEngagement() {
  if (typeof window === "undefined") return;
  INTERACTION_EVENTS.forEach((e) =>
    window.addEventListener(e, loadEngagement, {passive: true})
  );
}

export function onRouteDidUpdate({location, previousLocation}) {
  // Initial page load: arm the interaction loader (GA + Pixel already fired
  // eagerly from the preset / headTags).
  if (!previousLocation) {
    armEngagement();
    return;
  }
  // Client-side navigation is itself engagement.
  if (location.pathname !== previousLocation.pathname) {
    loadEngagement();
    // Re-fire the Meta Pixel PageView (GA SPA tracking is handled by the preset).
    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }
}
