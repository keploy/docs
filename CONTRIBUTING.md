# How to contribute

We encourage contributions from the community.

**Create a [GitHub issue](https://github.com/keploy/docs/issues) for any changes beyond typos and small fixes.**

If you do create a pull request (PR), please follow our [style guidance](/STYLE.md).

We review GitHub issues and PRs on a regular schedule.

To ensure that each change is relevant and properly peer reviewed, please adhere to best practices for open-source contributions.
This means that if you are outside the Keploy organization, you must fork the repository and create PRs from branches on your own fork.
The README in GitHub's [first-contributions repo](https://github.com/firstcontributions/first-contributions) provides an example.

## Preview changes locally

The Keploy documentation site uses [Docusaurus 2](https://v2.docusaurus.io/), which is a static website generator.

You can make changes locally without previewing them in the browser.
However, if you want to build the site and preview changes in the browser, you need to have [Docusaurus 2 dependencies](https://v2.docusaurus.io/docs/installation/#requirements) installed.

Initialize Docusaurus 2 in the repo by running [`yarn`](https://classic.yarnpkg.com/en/docs/cli/) once in the root directory of the repo.

Now you can build and view the site locally:

```bash
yarn start
```

The command starts a local development server and opens a browser window.

## Prettier

Before submitting a PR, use Prettier to reformat.

To install:

```
yarn install
```

To reformat:

```
yarn prettier --write '**/*.{js,md}'
```

When we merge your PR, a new build automatically occurs and your changes publish to [https://docs.keploy.io](https://docs.keploy.io).
