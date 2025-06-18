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

**Note**: Issue creation is disabled on this repository. Please visit [here](https://github.com/keploy/keploy/issues/new/choose) to submit an issue.

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

Keploy is continuously working to improve and expand its documentation. Some components may change without prior notice. Page slugs (URLs), menu labels, and the location of information are a few of the items you can expect to see altered as we endeavor to provide you with the best experience possible.

The documentation in this repository is published at https://docs.keploy.io.

If the information you are looking for seems to be missing, please visit the [Keploy community](https://join.slack.com/t/keploy/shared_invite/zt-357qqm9b5-PbZRVu3Yt2rJIa6ofrwWNg) forum for help.

Please read the [CONTRIBUTING](/CONTRIBUTING.md) guide and the [STYLE](/STYLE.md) guide before you submit any pull requests.

Maintainers and contributors to this project are expected to conduct themselves in a respectful manner. See the [CNCF Community Code of Conduct](https://github.com/cncf/foundation/blob/master/code-of-conduct.md) as a reference.

## Technology Stack

We use a variety of technologies to build the web interface and support the community. They include:

- [NodeJS](https://nodejs.org/)
- [Yarn package manager](https://yarnpkg.com/)
- [React](https://reactjs.org/)
- [GitHub Actions](https://github.com/features/actions)
- Docusaurus

We use NodeJS and Yarn to install, test, and build the website. Docusaurus has been used as a static site generator to build the website. React is utilized to build our custom component-based user interface to provide a modern look to the website. GitHub Actions manages our CI/CD pipelines and issue triage.

## Installation

The Keploy documentation site uses Docusaurus 2, which is a static website generator.

You can make changes locally without previewing them in the browser. However, if you want to build the site and preview changes in the browser, you need to have Docusaurus 2 dependencies installed.

Initialize Docusaurus 2 in the repo by running [`npm`](https://docs.npmjs.com/cli/v7/commands/npm-install) once in the root directory of the repo.

Now you can build and view the site locally:

```bash
npm install
npm start