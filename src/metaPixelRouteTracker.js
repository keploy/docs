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
//   - Chatwoot                 -> same idea, but a NARROWER gate that excludes
//     scroll. See ENGAGEMENT_TIERS below.
//   - Hotjar                   -> removed.

// Two tiers, because not every third party deserves the same trigger.
//
// Analytics wants scroll: a reader who scrolls is a session worth measuring,
// and Clarity's whole job is recording that scroll.
//
// Chatwoot does not. It is far heavier than a tag -- it opens a persistent
// websocket and keeps it open -- and on a docs site practically every session
// scrolls, so including scroll would boot the SDK for effectively every
// reader and undo the point of gating it. Support chat is worth loading for
// someone who clicks, types or taps, which is also exactly the gate the
// landing page uses for the same widget.
//
// NB: no "mousemove" in either tier. On desktop the pointer moves within
// milliseconds of paint, which would defeat the gate and load almost
// immediately. These are genuine "engaged intent" signals only.
//
// baseUrl is /docs/, so these resolve under the docs site root.
const ENGAGEMENT_TIERS = [
  {
    events: ["pointerdown", "keydown", "scroll", "touchstart"],
    scripts: [
      "/docs/scripts/clarity.js", // Microsoft Clarity
      "/docs/js/apollo-init.js", // Apollo
    ],
    loaded: false,
  },
  {
    events: ["pointerdown", "keydown", "touchstart"],
    scripts: [
      "/docs/scripts/chatwoot.js", // Chatwoot support widget
    ],
    loaded: false,
  },
];

function loadTier(tier) {
  if (tier.loaded || typeof window === "undefined") return;
  tier.loaded = true;
  tier.events.forEach((e) => window.removeEventListener(e, tier.handler));
  for (const src of tier.scripts) {
    const el = document.createElement("script");
    el.src = src;
    el.async = true;
    document.head.appendChild(el);
  }
}

function loadEngagement() {
  ENGAGEMENT_TIERS.forEach(loadTier);
}

function armEngagement() {
  if (typeof window === "undefined") return;
  ENGAGEMENT_TIERS.forEach((tier) => {
    tier.handler = () => loadTier(tier);
    tier.events.forEach((e) =>
      window.addEventListener(e, tier.handler, {passive: true})
    );
  });
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
