// Old docs URLs and the pages that replaced them. Bookmarks, search results,
// blog posts, other sites and published packages still link to an old URL, so
// it must keep working for good. The site is served from S3, which does not
// read static/_redirects, so @docusaurus/plugin-client-redirects (in
// docusaurus.config.js) writes a page at each `from` that sends the browser on
// to its `to`. The build fails if a `to` page does not exist.
//
// When a page moves, add its old and new URL here in the same change.
// scripts/verify-moved-urls.js reads this list and checks, in the built site,
// that each `from` redirects to its `to` in one hop, and that the `to` page
// (and its #fragment, when it names one) is there.
module.exports = [
  // The README of @keploy/capture-sdk 3.0.1, on npm. Its other link,
  // /ui-capture/install-sdk/, is a page of its own.
  // scripts/verify-ui-capture-sdk-links.js keeps every link the SDK ships
  // resolvable.
  {from: "/ui-capture/overview/", to: "/running-keploy/ui-capture/"},
  // Pages that moved into the Universal Mocker section.
  {
    from: "/running-keploy/mock-quickstart/",
    to: "/universal-mocker/mock-quickstart/",
  },
  {
    from: "/running-keploy/mock-your-tests/",
    to: "/universal-mocker/mock-your-tests/",
  },
];
