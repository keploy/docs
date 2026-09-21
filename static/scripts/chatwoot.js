// Chatwoot support widget (self-hosted).
//
// No interaction gate in here on purpose -- this file is loaded by the
// interaction loader in src/metaPixelRouteTracker.js, which already holds it
// off the initial page load until the reader engages.
(function initChatwoot() {
  var BASE_URL = "https://chatwoot.keploy.io";

  var scriptEl = document.createElement("script");
  scriptEl.src = BASE_URL + "/packs/js/sdk.js";
  scriptEl.async = true;
  scriptEl.onload = function () {
    window.chatwootSDK?.run({
      websiteToken: "DNsHCafpdxqz3dDU1SPggAon",
      baseUrl: BASE_URL,
    });
  };
  document.head.appendChild(scriptEl);
})();
