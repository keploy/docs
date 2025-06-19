# Style guidance

In general, Keploy content follows the [Google developer documentation style guide](https://developers.google.com/style).
When the Google guide is silent about an issue, we follow the [Microsoft Writing Style Guide](https://docs.microsoft.com/en-us/style-guide/welcome/).

## Purpose

This document defines the style conventions used in Keploy documentation to ensure clarity, consistency, and professionalism across all content.
It is intended for contributors, technical writers, and engineers writing or editing Keploy docs.

## Keploy-specific style guidance

We have a few Keploy-specific style guidelines that override the Google and Microsoft guides.

### Capitalization of core terms

Many of Keploy's core terms can be used in a generic way.
To differentiate one of Keploy's core terms from a generic instance of a term, always treat the Keploy term as a proper noun in documentation.
Generic versions of the same term should not be capitalized and should be used sparingly to avoid confusion.

- Correct: "Next, Normalise the Test case on the Test run details."
- Incorrect: "Next, normalise the test case on the test run details"

### En dashes in ranges

Using an en dash (`&ndash;` or the character `–`) in a range of numbers is acceptable.
Even better is to use words such as _from_, _to_, and _through_.

Be consistent.
If you use an en dash in one range, use en dashes in all ranges.
Do not mix words and en dashes (or hyphens, for that matter).

- Correct: "5 to 10 GB"
- Correct: "5–10 GB"
- Correct: "5-10 GB"
- Incorrect: "from 5-10 GB"

## Headings

Although the following guidance is provided by both the Google and Microsoft guides, we want to emphasize how we style headings.

### Infinitive verb forms in headings

Titles and headings should use infinitive verb forms whenever possible. People tend to search by using infinitive verb forms, so using them helps SEO.

- Correct: "Install Keploy"
- Incorrect: "Installing Keploy"

### Sentence casing in headings

Use sentence casing for titles and headings.
Sentence casing means that only the first letter of the first word and proper nouns are capitalized.

- Correct: "How to get started with Keploy"
- Incorrect: "How To Get Started With Keploy"

### Example

- Incorrect “Keploy installation instructions” — not infinitive, not compelling

- Incorrect “How To Install Keploy” — wrong casing

- Correct “Install Keploy” — clear, action-oriented, SEO-friendly

### Tone

Write in a friendly, professional tone.
Use active voice whenever possible.
Avoid slang, idioms, or overly technical jargon unless necessary.
Assume the reader is intelligent but unfamiliar with the product.
  
### Quick reference

| Rule Category       | Keploy Style Recommendation                                              |
| ------------------- | ------------------------------------------------------------------------ |
|   Capitalization    | Capitalize Keploy-specific terms when referring to them in documentation |
|   Headings          | Use sentence case and infinitive verbs in titles and section headings    |
|   Ranges            | Use en dashes (`–`) or words like “to” and “through” consistently        |
|   Voice             | Prefer active voice over passive voice                                   |
|   Tone              | Write in a friendly, professional, and clear tone                        |
|   Consistency       | Apply formatting choices consistently throughout a document              |
|   Reference Order   | Follow the Google style guide; defer to Microsoft when Google is silent  |


