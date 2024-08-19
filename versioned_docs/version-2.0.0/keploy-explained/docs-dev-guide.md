---
id: docs-dev-guide
title: docs-dev-guide
sidebar_label: Docs Dev Guide
tags:
  - dev guide
  - explanation
  - contributing
---

# How to contribute

We encourage contributions from the community.

**Create a [GitHub issue](https://github.com/keploy/docs/issues) for any changes beyond typos and small fixes.**

If you do create a pull request (PR), please follow our style guidance.

We review GitHub issues and PRs on a regular schedule.

To ensure that each change is relevant and properly peer reviewed, please adhere to best practices for open-source contributions.
This means that if you are outside the Keploy organization, you must fork the repository and create PRs from branches on your own fork.
The README in GitHub's [first-contributions repo](https://github.com/firstcontributions/first-contributions) provides an example.

## How to set up the docs website locally?

The Keploy documentation site uses [Docusaurus 2](https://v2.docusaurus.io/), which is a static website generator.

You can make changes locally without previewing them in the browser.
However, if you want to build the site and preview changes in the browser, you need to have [Docusaurus 2 dependencies](https://v2.docusaurus.io/docs/installation/#requirements) installed.

Initialize Docusaurus 2 in the repo by running [`yarn`](https://classic.yarnpkg.com/en/docs/cli/) or [`npm`](https://docs.npmjs.com/cli/v10) once in the root directory of the repo.

Now you can build and view the site locally:

```shell
npm start
```

or

```shell
npm start
```

or

```shell
yarn start
```

The command starts a local development server and opens a browser window.

## Prettier

**Note: The website has been migrated to use `npm` for building, testing, and deploying.**

Steps 1 to 3 are the same for both `yarn` and `npm`

1. Fork the repository

2. Clone the repository with the following command. Replace the {'<'}GITHUB_USERNAME{'>'} with your username

```shell
git clone https://github.com/<GITHUB_USERNAME>/docs.git
```

3. Go into the directory containing the project

```shell
cd docs
```

### Using `npm`

4. Install all the dependencies

```shell
npm install
```

5. Start the development server.

```shell
npm start
```

6. To reformat:

```shell
npm prettier --write '**/*.{js,md}'
```

### Using `yarn` (Legacy)

4. Install all the dependencies

```shell
yarn
```

5. Start the development server.

```shell
yarn start
```

6. To reformat:

```shell
yarn prettier --write '**/*.{js,md}'
```

When we merge your PR, a new build automatically occurs and your changes publish to [https://docs.keploy.io](https://docs.keploy.io).

## How to Contribute Code?

Bug fixes, performance improvements, code formatting, ...
There are a lot ways in which you can contribute code!
The issues list of a project is a great place to find something that you can help us with.

To increase the chances of your code getting merged, please ensure that:

- You satisfy our contribution criteria
- Your pull request:
  - Passes all checks and has no conflicts.
  - Has a well-written title and message that briefly explains your proposed changes.

## How to Report Bugs, Provide Feedback or Request Features?

We welcome all kinds of bug reports, user feedback and feature requests! We've created some issue templates to assist you in this. Please use them to create a new issue in the relevant project's repository. If you are not sure how to create an issue, here are the steps:

1. Navigate to the main page of the documentation website repository

2. Click `Issues`

3. Click `New issue`

4. Our repository uses issue templates, click `Get started` next to the type of issue you'd like to open

5. Type a title for your issue. We advise you to stick to the issue template to describe the issue

6. After you are finished, click `Submit new issue`

## How to Open a Pull Request to Add New Documentation or Fix Bugs?

After you have cloned the documentation repo to your computer locally, edit the files that you wish to change and follow the steps to open a pull request.

1. `add` and `commit` your changes to your repository

2. Git push your changes to your fork on Github

3. On Github, click on the `Create a new Pull Request` button.

4. Use a succinct title and descriptive comments to describe your Pull Request. Also Ensure maintainers can understand your proposed changes from the description

## How to Suggest UI/UX Improvements?

One of the most important areas of improvement to our software Keploy UI. We really need your help with this!

If you have ideas on how we can improve, please share them with us by creating a [new issue](https://github.com/keploy/keploy/issues/new/choose).

## How to Contribute Translations?

Right now our interfaces do not support translations and we also don't have a translation strategy in place. But we want to change this. We want our projects to be accessible to non-English speakers. If you have any ideas then please share them with us by creating a [new issue].

Hope this helps you out, if you still have any questions, reach out to us .

import GetSupport from '../concepts/support.md'

<GetSupport/>
