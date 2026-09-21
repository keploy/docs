// Chatwoot support widget (self-hosted).
//
// No interaction gate in here on purpose -- this file is loaded by the
// interaction loader in src/metaPixelRouteTracker.js, which already holds it
// off the initial page load until the reader engages.
(function initChatwoot() {
  var BASE_URL = "https://chatwoot.keploy.io";

  // `position` is declared rather than left to default because the
  // .theme-back-to-top-button rule in src/css/custom.css is built around the
  // bubble sitting bottom-right. Making it explicit means that CSS breaks
  // loudly here rather than silently there if it ever changes.
  window.chatwootSettings = {
    position: "right",
    type: "standard",
    darkMode: "auto",
  };

  // The back-to-top button is only lifted clear of the bubble once the bubble
  // actually exists. If Chatwoot is down, blocked, or the SDK 404s, the button
  // keeps the theme's default position instead of floating above a gap.
  window.addEventListener("chatwoot:ready", function onReady() {
    document.documentElement.classList.add("chatwoot-ready");
  });

  var scriptEl = document.createElement("script");
  scriptEl.src = BASE_URL + "/packs/js/sdk.js";
  scriptEl.async = true;
  scriptEl.onload = function () {
    // Checked here rather than at the top of the IIFE, where it would be
    // useless: two injections in the same tick both run before either sdk.js
    // has loaded, so $chatwoot is undefined for both. By onload the first
    // run() has set it, so the second one stops. The loader's per-tier flag
    // already prevents that case, and run() self-guards too, but this does
    // not depend on either staying true.
    if (window.$chatwoot) return;
    window.chatwootSDK?.run({
      websiteToken: "DNsHCafpdxqz3dDU1SPggAon",
      baseUrl: BASE_URL,
    });
  };
  document.head.appendChild(scriptEl);
})();
