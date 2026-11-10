// Sends a GA4 `app_link_click` event when a reader clicks any link to
// app.keploy.io (navbar "Sign in", the Quickstart button, in-doc links).
//
// Why this exists: on keploy.io, GA4 enhanced measurement does not record
// app.keploy.io links as outbound clicks (it treats the subdomain as the same
// site), so the built-in `click` event never fires for them. Some components
// also call stopPropagation() on their links, which hides the click from any
// listener that waits for it to bubble up.
//
// How it stays safe:
//   - Listens on document in the CAPTURE phase, so it sees the click before
//     any component handler can stop it.
//   - Never calls preventDefault() or stopPropagation() and never delays
//     navigation; it only reads the link and queues a gtag event.
//   - Does nothing if window.gtag is missing (dev builds, blocked GA).
//   - Everything is wrapped in try/catch so it can never break a click.
//
// The event is named `app_link_click` (not `click`) so it never double counts
// with GA's own outbound `click` event wherever that does fire (localhost,
// previews on other hosts).

const APP_HOSTNAME = "app.keploy.io";
const MAX_TEXT_LENGTH = 100;

function findAppLink(target) {
  if (!target || typeof target.closest !== "function") return null;
  const anchor = target.closest("a[href]");
  if (!anchor) return null;
  // getAttribute works for both HTML and SVG anchors (SVG `href` is an object).
  const url = new URL(anchor.getAttribute("href"), window.location.href);
  if (url.hostname !== APP_HOSTNAME) return null;
  return {anchor, url};
}

function linkText(anchor) {
  const text = (anchor.textContent || anchor.getAttribute("aria-label") || "")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, MAX_TEXT_LENGTH);
}

function handleClick(event) {
  try {
    // Middle click arrives as `auxclick`; ignore right click (context menu).
    if (event.type === "auxclick" && event.button !== 1) return;
    if (typeof window.gtag !== "function") return;
    const link = findAppLink(event.target);
    if (!link) return;
    window.gtag("event", "app_link_click", {
      link_domain: link.url.hostname,
      link_url: link.url.href,
      link_text: linkText(link.anchor),
    });
  } catch (e) {
    // Tracking must never break navigation.
  }
}

if (typeof window !== "undefined" && !window.__keployAppLinkClickTracker) {
  window.__keployAppLinkClickTracker = true;
  document.addEventListener("click", handleClick, true);
  document.addEventListener("auxclick", handleClick, true);
}
