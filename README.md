<div align="center">
<h1>Keploy</h1>
</div>
<p style="text-align:center;" align="center">
  <img align="center" src="https://avatars.githubusercontent.com/u/92252339?s=200&v=4" height="30%" width="30%" />
 <div align="center">
 <h1>Docs Website</h1>
 <p>
Repository for the Keploy documentation website.
</p>
</div>

**Note** :- Issue Creation is disabled on this Repository, please visit [here](https://github.com/keploy/keploy/issues/new/choose) to submit Issue.

<p align="center">
<a href="https://github.com/keploy/docs" alt="GitHub contributors">
<img src="https://img.shields.io/github/contributors/keploy/docs.svg" />
</a>
<a href="https://github.com/keploy/docs" alt="GitHub issues by-label">
<img src="https://img.shields.io/github/issues/keploy/docs" />
</a>
<a href="https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg" alt="Slack">
<img src="https://img.shields.io/badge/Slack-@layer5.svg?logo=slack" />
</a>
<a href="https://twitter.com/Keployio" alt="Twitter Follow">
<img src="https://img.shields.io/twitter/follow/keploy.svg?label=Follow&style=social" />
</a>
<a href="https://github.com/keploy/docs" alt="License">
<img src="https://img.shields.io/github/license/keploy/docs.svg" />
</a>
</p>

[Keploy](https://keploy.io) is a no-code testing platform that generates tests from API calls.

Keploy is constantly working to improve and expand its documentation.
Some components may change without notice.
Page slugs (URLs), menu labels, and the location of information are a few of the items you can expect to see altered as we endeavour to give you the best experience possible.

The documentation in this repository is published to https://docs.keploy.io.

If information you are looking for seems to be missing, visit the [Keploy community](https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg) forum for help.

Please read the [CONTRIBUTING](/CONTRIBUTING.md) guide and the [STYLE](/STYLE.md) guide before you submit any pull requests.

Maintainers and contributors to this project are expected to conduct themselves in a respectful way.
See the [CNCF Community Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) as a reference.

## Technology Stack

We use a variety of technologies to build the web interface and support the community. They include:

- [NodeJS](https://nodejs.org/)
- [Yarn package manager](https://yarnpkg.com/)
- [React](https://reactjs.org/)
- [GitHub Actions](https://github.com/features/actions)
- Docusaurus

We use NodeJS and Yarn to install, test, and build the website. Docusaurus has been used as a static site generator to build the website. React is being utilized to build our custom component-based user interface to provide a modern look to the website. GitHub Actions manages our CI/CD pipelines and issue triage.

## Installation

The Keploy documentation site uses Docusaurus 2 which is a static website generator.

You can make changes locally without previewing them in the browser.
However, if you want to build the site and preview changes in the browser, you need to have Docusaurus 2 dependencies installed.

Initialize Docusaurus 2 in the repo by running [`npm`](https://docs.npmjs.com/cli/v7/commands/npm-install) once in the root directory of the repo.

Now you can build and view the site locally:

```bash
npm install
npm start
```

The command starts a local development server and opens a browser window.

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
