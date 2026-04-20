(function initApollo() {
  var randomCacheBuster = Math.random().toString(36).substring(7);
  var scriptEl = document.createElement("script");
  scriptEl.src =
    "https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=" +
    randomCacheBuster;
  scriptEl.async = true;
  scriptEl.defer = true;
  scriptEl.onload = function () {
    window.trackingFunctions?.onLoad?.({
      appId: "6644a0d6a54b5b0438c841cc",
    });
  };
  document.head.appendChild(scriptEl);
})();
