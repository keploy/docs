import React, { useState, useMemo } from "react";

/**
 * SharedTokenExchanger - Interactive widget that calls
 * `POST <proxy>/get-shared-token` with a user-supplied PAT and displays the
 * resulting `sharedToken` / `ingressUrl` / `deploymentType`. Mirrors the
 * documented bootstrap flow so readers can verify the exchange without
 * leaving the page.
 *
 * Browser-only fetch: Docusaurus SSRs to static HTML, so all stateful logic
 * runs client-side once hydrated. The component never persists the PAT or
 * the returned shared token — both stay in component state for the
 * lifetime of the page.
 */

const inputStyle = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  fontSize: "0.875rem",
  fontFamily: "var(--ifm-font-family-monospace)",
  border: "1px solid var(--ifm-color-emphasis-300)",
  borderRadius: "6px",
  background: "var(--ifm-background-color)",
  color: "var(--ifm-font-color-base)",
  boxSizing: "border-box",
};

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "var(--ifm-color-emphasis-700)",
  marginBottom: "0.25rem",
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  fontSize: "0.875rem",
  fontWeight: 600,
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  background: "var(--ifm-color-primary)",
  color: "#fff",
};

const responseBoxStyle = {
  padding: "0.75rem 1rem",
  fontSize: "0.8125rem",
  fontFamily: "var(--ifm-font-family-monospace)",
  borderRadius: "6px",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  marginTop: "0.75rem",
};

export default function SharedTokenExchanger({
  defaultProxy = "https://your-proxy-ingress",
}) {
  const [proxy, setProxy] = useState(defaultProxy);
  const [pat, setPat] = useState("");
  const [showPat, setShowPat] = useState(false);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(null); // { ok: boolean, status?, body?, error? }

  const trimmedProxy = useMemo(() => proxy.trim().replace(/\/+$/, ""), [proxy]);

  const equivalentCurl = useMemo(() => {
    const proxyForCurl = trimmedProxy || "<PROXY_URL>";
    const patForCurl = pat ? "$PAT" : "<YOUR_PAT>";
    return `curl -sS -X POST "${proxyForCurl}/get-shared-token" \\\n  -H "Authorization: Bearer ${patForCurl}"`;
  }, [trimmedProxy, pat]);

  const canSubmit = trimmedProxy.length > 0 && pat.trim().length > 0 && !pending;

  async function exchange() {
    if (!canSubmit) return;
    setPending(true);
    setResult(null);

    const url = `${trimmedProxy}/get-shared-token`;
    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${pat.trim()}` },
      });
      const text = await resp.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      setResult({ ok: resp.ok, status: resp.status, body });
    } catch (err) {
      setResult({
        ok: false,
        error:
          "Request failed in the browser. This is most often a CORS or TLS error: the proxy must serve a cert your browser trusts and allow the docs origin in CORS. Run the equivalent curl below from a shell to verify the exchange end-to-end.",
        cause: String(err && err.message ? err.message : err),
      });
    } finally {
      setPending(false);
    }
  }

  function copy(text) {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(text).catch(() => {});
  }

  const success = result && result.ok && result.body && typeof result.body === "object";
  const successBg = "rgba(16, 185, 129, 0.10)";
  const successBorder = "1px solid rgba(16, 185, 129, 0.35)";
  const errorBg = "rgba(239, 68, 68, 0.10)";
  const errorBorder = "1px solid rgba(239, 68, 68, 0.35)";

  return (
    <div
      style={{
        border: "1px solid var(--ifm-color-emphasis-200)",
        borderRadius: "8px",
        padding: "1rem 1.25rem",
        margin: "1rem 0 1.5rem",
        background: "var(--ifm-background-surface-color)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <strong style={{ fontSize: "0.95rem" }}>Try it: exchange a PAT</strong>
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--ifm-color-emphasis-600)",
          }}
        >
          POST <code>/get-shared-token</code>
        </span>
      </div>

      <div style={{ display: "grid", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div>
          <label style={labelStyle} htmlFor="ste-proxy">
            Proxy ingress URL
          </label>
          <input
            id="ste-proxy"
            type="url"
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            placeholder="https://your-proxy-ingress"
            spellCheck={false}
            autoComplete="off"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="ste-pat">
            Personal Access Token
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              id="ste-pat"
              type={showPat ? "text" : "password"}
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              placeholder="kep_..."
              spellCheck={false}
              autoComplete="off"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => setShowPat((v) => !v)}
              style={{
                ...buttonStyle,
                background: "transparent",
                color: "var(--ifm-color-emphasis-700)",
                border: "1px solid var(--ifm-color-emphasis-300)",
                fontWeight: 500,
              }}
            >
              {showPat ? "Hide" : "Show"}
            </button>
          </div>
          <small
            style={{
              display: "block",
              marginTop: "0.25rem",
              color: "var(--ifm-color-emphasis-600)",
              fontSize: "0.75rem",
            }}
          >
            The PAT stays in your browser. It is sent only to the proxy URL above.
          </small>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={exchange}
          disabled={!canSubmit}
          style={{
            ...buttonStyle,
            opacity: canSubmit ? 1 : 0.5,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          {pending ? "Exchanging…" : "Get shared token"}
        </button>
        <button
          type="button"
          onClick={() => copy(equivalentCurl)}
          style={{
            ...buttonStyle,
            background: "transparent",
            color: "var(--ifm-color-primary)",
            border: "1px solid var(--ifm-color-primary)",
          }}
        >
          Copy as curl
        </button>
      </div>

      {result && success && (
        <div
          style={{
            ...responseBoxStyle,
            background: successBg,
            border: successBorder,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
              fontFamily: "var(--ifm-font-family-base)",
            }}
          >
            <strong>200 OK</strong>
            <button
              type="button"
              onClick={() => copy(result.body.sharedToken || "")}
              style={{
                ...buttonStyle,
                padding: "0.25rem 0.625rem",
                fontSize: "0.75rem",
                background: "transparent",
                color: "var(--ifm-color-primary)",
                border: "1px solid var(--ifm-color-primary)",
              }}
            >
              Copy sharedToken
            </button>
          </div>
          {JSON.stringify(result.body, null, 2)}
        </div>
      )}

      {result && !success && (
        <div
          style={{
            ...responseBoxStyle,
            background: errorBg,
            border: errorBorder,
          }}
        >
          <div
            style={{
              marginBottom: "0.5rem",
              fontFamily: "var(--ifm-font-family-base)",
            }}
          >
            <strong>
              {result.status ? `HTTP ${result.status}` : "Request failed"}
            </strong>
          </div>
          {result.error && (
            <div style={{ fontFamily: "var(--ifm-font-family-base)", marginBottom: "0.5rem" }}>
              {result.error}
              {result.cause && (
                <div style={{ marginTop: "0.25rem", color: "var(--ifm-color-emphasis-700)" }}>
                  Reason: {result.cause}
                </div>
              )}
            </div>
          )}
          {result.body !== undefined &&
            (typeof result.body === "object"
              ? JSON.stringify(result.body, null, 2)
              : String(result.body))}
        </div>
      )}
    </div>
  );
}
