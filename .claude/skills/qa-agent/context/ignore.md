# Ignore

Skip these paths during QA unless the review is explicitly about generated output, build tooling, or ignore-policy changes.

- `node_modules/`
- `.next/`
- `out/`
- `dist/`
- `build/`
- `.git/`
- `*.min.js`
- `*.generated.*`
- `__generated__/`
- `coverage/`
- `.cache/`
- `.docusaurus/`
- `.cache-loader/`
- `.netlify/`
- `.idea/`
- `.history/`
- `package-lock.json`

Project-specific generated or machine-managed artifacts to skip by default:

- `.docusaurus/DONT-EDIT-THIS-FOLDER`
- `build/assets/`
- `build/js/`
- `build/scripts/`
- `build/data/`

Files to note but not review for content/security unless explicitly requested:

- `.env.local`
- `.env.development.local`
- `.env.test.local`
- `.env.production.local`
