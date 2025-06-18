### ✨ Contributed by Ashish Singh as part of the API Fellowship Assignment

<div align="center">
  <h1>Keploy</h1>
</div>

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/92252339?s=200&v=4" height="30%" width="30%" />
</p>

<div align="center">
  <h2>Docs Website</h2>
  <p>Repository for the Keploy documentation website.</p>
</div>

git-checkout--b-ashish-readme-update
> **Note:** Issue creation is disabled on this repository. Please visit [here](https://github.com/keploy/keploy/issues/new/choose) to submit an issue.
> ⚠️ **Note:** Issue creation is disabled in this repository.  
> To submit a new issue, please visit the [Keploy community forum](https://github.com/keploy/dashboard/issues) or the main repo’s issue tracker.
>  main

<p align="center">
  <a href="https://github.com/keploy/docs"><img src="https://img.shields.io/github/contributors/keploy/docs.svg" alt="GitHub contributors" /></a>
  <a href="https://github.com/keploy/docs"><img src="https://img.shields.io/github/issues/keploy/docs" alt="GitHub issues by-label" /></a>
  <a href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg"><img src="https://img.shields.io/badge/Slack-@layer5.svg?logo=slack" alt="Slack" /></a>
  <a href="https://twitter.com/Keployio"><img src="https://img.shields.io/twitter/follow/keploy.svg?label=Follow&style=social" alt="Twitter Follow" /></a>
  <a href="https://github.com/keploy/docs"><img src="https://img.shields.io/github/license/keploy/docs.svg" alt="License" /></a>
</p>

[Keploy](https://keploy.io) is a no-code testing platform that generates tests from API calls.

Keploy is constantly working to improve and expand its documentation. As Keploy evolves rapidly, you may notice changes in slugs, menu labels, or content organization. These efforts aim to provide the best experience possible.

The documentation in this repository is published at [https://docs.keploy.io](https://docs.keploy.io).

If the information you're looking for seems missing, visit the [Keploy Community Forum](https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg) for help.

Please read the [CONTRIBUTING](/CONTRIBUTING.md) guide and the [STYLE](/STYLE.md) guide before submitting a pull request.

Maintainers and contributors to this project are expected to conduct themselves respectfully. See the [CNCF Community Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) as a reference.

---

## 🛠️ Technology Stack

We use a variety of technologies to build the web interface and support the community:

- [NodeJS](https://nodejs.org/)
- [Yarn package manager](https://yarnpkg.com/)
- [React](https://reactjs.org/)
- [GitHub Actions](https://github.com/features/actions)
- [Docusaurus](https://docusaurus.io/)

We use NodeJS and Yarn to install, test, and build the website. Docusaurus serves as our static site generator. React powers our component-based UI, and GitHub Actions manages CI/CD pipelines.

---

## 🧩 Installation

The Keploy documentation site uses **Docusaurus 2**.

To get started locally:

```bash
npm install
npm start


The command starts a local development server and opens a browser window.

> 💡 **Tip:** After running `npm install`, use `npm start` to preview changes live at `http://localhost:3000/`.


## Running Vale Locally for Documentation Linting

To help maintain consistency in our documentation, we use Vale, a syntax-aware linter that checks for spelling, grammar, and style issues.

### Installation

**Step 1: Install Vale**

If you're on macOS, you can install Vale using Homebrew:

```bash
brew install vale
```

Alternatively, you can install Vale manually:

1. Download Vale: Visit the Vale Releases page and download the latest version for your operating system.

2. Install Vale:

- On macOS and Linux, extract the binary, move it to /usr/local/bin, and make it executable:

```bash
sudo mv vale /usr/local/bin/
sudo chmod +x /usr/local/bin/vale
```

- On Windows, follow the instructions in the downloaded .zip file.

**Step 2: Configure Vale**

1. Ensure you have the .vale.ini configuration file in the root directory.

2. Check that StylesPath in .vale.ini points to the vale_styles directory (where custom styles are stored):

```ini
StylesPath = vale_styles
MinAlertLevel = error
```

### Running Vale

1. Linting Documentation: To check all markdown files in versioned_docs/version-2.0.0/ for errors, run:

```bash
vale versioned_docs/version-2.0.0/**/*.md
```

2. Review Errors:

- Vale will output any issues directly in the terminal. Address these issues in the markdown files to maintain style consistency.

Note: Running Vale locally helps catch issues early, ensuring a smooth review process when you submit a pull request.

## Prettier

1. Fork the repository

<br/>

2. Clone the repository with the following command. Replace the {'<'}GITHUB_USERNAME{'>'} with your username

```sh
git clone https://github.com/<GITHUB_USERNAME>/docs.git

## Go into the directory containing the project

cd docs
```

<br/>

3. Install all the dependencies

```sh
npm install

## Start the development server.

npm start
```

4. To reformat:

```sh
npx prettier --write '**/*.{js,md}'
```

5. Check the build status:

```sh
npm run build
```

> Note: if the Build is failing, fix the changes before making PR.

When we merge your PR, a new build automatically occurs and your changes publish to [https://keploy.io/docs](https://keploy.io/docs).

## How to Get Involved?

Keploy welcomes contributions to the docs website. If you have an idea for a new feature or a bug fix, please submit an issue or pull request. Our planned features can be found on our [Issue Tracker](https://github.com/keploy/keploy/issues/new/choose).

## Community Support ❤️

### 🤔 Questions?

Reach out to us. We're here to help!

[![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)](https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg)
[![LinkedIn](https://img.shields.io/badge/linkedin-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/keploy/)
[![YouTube](https://img.shields.io/badge/YouTube-%23FF0000.svg?style=for-the-badge&logo=YouTube&logoColor=white)](https://www.youtube.com/channel/UC6OTg7F4o0WkmNtSoob34lg)
[![Twitter](https://img.shields.io/badge/Twitter-%231DA1F2.svg?style=for-the-badge&logo=Twitter&logoColor=white)](https://twitter.com/Keployio)

### 💖 Let's Build Together!

Whether you're a newbie coder or a wizard 🧙‍♀️, your perspective is golden. Take a peek at our:
