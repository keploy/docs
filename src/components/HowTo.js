import React from "react";
import Head from "@docusaurus/Head";

/**
 * HowTo schema.org wrapper for Docusaurus MDX pages.
 *
 * Emits valid schema.org/HowTo JSON-LD into <head> and (optionally) renders a
 * matching numbered <ol> of visible steps. Authors can pass `visible={false}`
 * when the prose below already renders the steps so the JSON-LD is the only
 * change to the page.
 *
 * Required HowTo fields per Google: name, step (array of HowToStep with name + text).
 * Optional: totalTime (ISO 8601 duration), estimatedCost (MonetaryAmount), tool, supply.
 *
 * Example:
 *   <HowTo
 *     name="Install Keploy on Linux"
 *     totalTime="PT5M"
 *     estimatedCost={{currency: "USD", value: "0"}}
 *     tools={["bash", "curl"]}
 *     supplies={["Linux machine with kernel >= 5.10"]}
 *     steps={[
 *       {name: "Download", text: "Run: curl ...", url: "#download"},
 *       {name: "Install",  text: "Run: sudo install ...", url: "#install"},
 *     ]}
 *     visible={false}
 *   />
 */
export default function HowTo({
  name,
  description,
  totalTime,
  estimatedCost,
  tools,
  supplies,
  image,
  steps,
  visible = true,
}) {
  if (!name || !Array.isArray(steps) || steps.length === 0) {
    // Component is a no-op without the minimum required fields.
    return null;
  }

  // Filter to steps that carry both `name` and `text` per Google's HowTo
  // requirements. Auto-generating "Step N" placeholders or emitting empty
  // `text` produces low-quality structured data that the rich-results test
  // flags. If the author gave us nothing usable, drop the schema entirely
  // rather than ship a hollow HowTo.
  const validSteps = steps.filter(
    (s) =>
      typeof s.name === "string" &&
      s.name.trim() &&
      typeof s.text === "string" &&
      s.text.trim()
  );
  if (validSteps.length === 0) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    step: validSteps.map((s, i) => {
      const step = {
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      };
      if (s.url) step.url = s.url;
      if (s.image) step.image = s.image;
      return step;
    }),
  };

  if (description) schema.description = description;
  if (totalTime) schema.totalTime = totalTime;
  if (image) schema.image = image;
  if (estimatedCost && estimatedCost.value !== undefined) {
    schema.estimatedCost = {
      "@type": "MonetaryAmount",
      currency: estimatedCost.currency || "USD",
      value: String(estimatedCost.value),
    };
  }
  if (Array.isArray(tools) && tools.length > 0) {
    schema.tool = tools.map((t) =>
      typeof t === "string" ? {"@type": "HowToTool", name: t} : t
    );
  }
  if (Array.isArray(supplies) && supplies.length > 0) {
    schema.supply = supplies.map((s) =>
      typeof s === "string" ? {"@type": "HowToSupply", name: s} : s
    );
  }

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Head>
      {visible && (
        <section
          aria-label={name}
          style={{
            border: "1px solid var(--ifm-color-emphasis-200)",
            borderRadius: "12px",
            padding: "1rem 1.25rem",
            margin: "1rem 0 1.5rem",
            background: "var(--ifm-background-surface-color)",
          }}
        >
          <h3 style={{marginTop: 0}}>{name}</h3>
          {description && <p>{description}</p>}
          <ol>
            {/* Don't derive an `id` from `s.url`. In docs usage `step.url`
                often points at an existing heading anchor on the page (e.g.
                `#capturing-testcases`), so reusing that as a list-item id
                would produce duplicate ids in the DOM whenever `visible`
                is enabled. The list is the readable view; `step.url` in
                the JSON-LD already covers the schema linkage. */}
            {validSteps.map((s, i) => (
              <li key={i}>
                <strong>{s.name}</strong>
                <div>{s.text}</div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
