# Adding a New Quickstart (Integration Testing)

This guide explains how to add a **new Quickstart** to our docs.  
If you’re contributing for the first time — don’t worry, this is meant to be simple and step-by-step 🙂


## Before You Start

- We maintain **versioned documentation**
- Always add new quickstarts to the **latest docs version**
- Current latest version: **v4.0.0**

👉 Please make sure you are contributing to the **latest version only**.


## Steps to Add a New Quickstart

### 1. Create a New Quickstart File

Navigate to the latest versioned docs directory:

```

versioned_docs/version-4.0.0/quickstart/

```

- Create a **new `.md` or `.mdx` file** for your quickstart
- Follow the structure used by existing quickstarts
- Keep the content clear and beginner-friendly

---

### 2. Add Your Quickstart to the Sidebar

To make your quickstart visible in the docs sidebar, update:

```

versioned_sidebars/version-4.0.0-sidebars.json

```

- Add your new quickstart under the appropriate section
- Ensure the ordering matches the existing structure

---

### 3. Adding a New Language?

If your quickstart introduces a **new programming language**, you must update:

```

src/components/QuickStartFilter.js

```

Please include:
- Language name
- Language icon
- Any required metadata for filtering

👉 You can refer to existing language entries for examples.

---

### 4. List the Quickstart in the QuickStart List

You **must** list your quickstart in:

```

src/components/QuickStartList.js

```

Make sure to include:
- **Docker setup**
- **Non-Docker setup**

Both flows are required so users can choose what works best for them.

---

## Note: Before Creating the PR

Please complete **all** the checks below before opening a pull request:

### 1. Run the Build Locally

Make sure the docs build passes:

```

npm run build

```
Your PR should not introduce any build errors.

---

### 2. Check the Design

- The design **must match existing quickstarts**
- Follow current spacing, layout, and styling
- If unsure, compare with an existing quickstart page

---

### 3. Refer to Existing Code

If you’re confused at any point:
- Check how other quickstarts are implemented
- Follow existing patterns — consistency is important

---

### 4. Add Command Images Correctly

If your quickstart includes **Keploy commands** (like `record` or `replay`):

- Include **terminal screenshots**
- Terminal background **must be white**
- Images should look clean and readable
- Follow the style used in existing docs

---

## Need Help?

If you have **any doubts or questions**, feel free to reach out to us on **Slack**.  
We’re happy to help and review early drafts 

---

Thanks for contributing and helping improve our docs 💙  
Happy hacking!
