[![GitHub package.json version](https://img.shields.io/github/package-json/v/marcolino/appalti190-server?style=flat)](version)
[![GitHub package.json license](https://img.shields.io/github/package-json/license/marcolino/appalti190-server?style=flat)](license)
[![Mocha tests ok](https://raw.githubusercontent.com/marcolino/appalti190-server/master/public/badges/mocha.svg)](tests)
<p align="center">
<a href="https://amplication.com/#gh-light-mode-only">
<img width="300" src="https://raw.githubusercontent.com/amplication/amplication/master/light.svg#gh-light-mode-only">
</a>
<a href="https://amplication.com/#gh-dark-mode-only">
<img width="300" src="https://raw.githubusercontent.com/amplication/amplication/master/dark.svg#gh-dark-mode-only">
</a>
</p>

<p align="center">
  <a href="https://amplication.com/discord">
    <img src="https://img.shields.io/discord/757179260417867879?label=discord" alt="Discord">
  </a>
  <a href="CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>
  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/marcolino/appalti190-server?color=purple"/>
</p>

<div align="center">
 
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

  </div>
 

![1 Appalti190-server main](https://user-images.githubusercontent.com/53312820/190913686-02c7deb1-da2f-41b8-aa31-065e00f6155c.png)

[appalti190-server](https://github.com/marcolino/appalti190-server/) is an open‑source server side project for a general-purpose web app implementing a generic SAAS.

Appalti190-server ...

# Tests Coverage
[Mocha unit + e2e tests coverage](https://github.com/marcolino/appalti190-server/master/coverage/index.html) 

# Features

Appalti190-server provides the following features:

- Production-ready APIs
- Data Model
- Role Based Access Control (RBAC)
- Microservices Support
- Continuous GitHub Sync
- TypeScript and Node.js Source Code
- Plugin System
- Monorepo or Polyrepo
- Custom Code
- Admin UI
- Appalti190-server Console & CLI

# Getting Started

You can get started with Appalti190-server immediately on the Appalti190-server Cloud. 

Alternatively you can set up a local development environment.

See the [Appalti190-server Website](http://Appalti190-server.com/) or [Appalti190-server Docs](http://docs.Appalti190-server.com/) for more details.

## Tutorials 

- [Todo Application using Appalti190-server and Angular](https://docs.Appalti190-server.com/tutorials/angular-todos/)
- [Todo Application using Appalti190-server and React](https://docs.Appalti190-server.com/tutorials/react-todos/)

## Appalti190-server Cloud (SaaS)

Launch Appalti190-server from [app.Appalti190-server.com](http://app.Appalti190-server.com/)

## Development Environment (Local)

### System Requirements

:bulb: Before you begin, make sure you have the following installed:

- [Node.js v16 or above](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git/)

### Getting Started With Local Development

Appalti190-server is using a monorepo (powered by [Nx Workspaces](https://nx.dev/)) with multiple apps and libraries.

Follow these simple instructions to set up a local development environment.

1. Clone the repository and install dependencies:

  ```bash
  git clone https://github.com/marcolino/appalti190-server.git
  cd appalti190-server
  npm install
  ```

2. Run the [setup script](https://github.com/Appalti190-server/Appalti190-server/blob/master/scripts/setup.ts), which takes care of installing dependencies, building packages and ensuring your workspace is dev-ready.

  ```bash
  npm run setup:dev
  ```

3. Spin up all required infrastructure (Postgres, Kafka, etc.) using Docker Compose:

  ```bash
  # To be able to view logs
  npm run docker:dev

  # Or, if you prefer to run it at the background
  npm run docker:dev -- -d
  ```

4. Apply database migrations:

  ```bash
  npm run db:migrate:deploy
  ```

5. To start developing, run the `serve` target of the desired app:

  ```bash
  # This will serve the Appalti190-server Server in development mode
  npx nx serve Appalti190-server-server

  # This will serve the Appalti190-server Client in development mode
  npx nx serve Appalti190-server-client
  ```

+ **Please note that in order to be able to run the app's client properly, you need to `serve` both the server and client.**

That's it, you are good to go! Happy hacking! 👾

You can always find more information in each app/library's respective README.md file.

### Setting Up Appalti190-server Manually

You can use a manual step-by-step approach to set up Appalti190-server in a local development environment. To do so, you should follow the following instructions for **Setting Up Appalti190-server Server**, and **Setting Up Appalti190-server Client**.

#### Setting up [Appalti190-server Server](https://github.com/Appalti190-server/Appalti190-server/blob/master/packages/Appalti190-server-server/README.md)

Appalti190-server Server is the main component of the platform that provides all the core functionality to design and create low-code applications.
The server exposes a GraphQL API for all actions. The server is built with the following awesome open-source technologies: Node.js, NestJS, Prisma over PostgreSQL, GraphQL API, and many more...

#### Setting Up [Appalti190-server Client](https://github.com/Appalti190-server/Appalti190-server/blob/master/packages/Appalti190-server-client/README.md)

Appalti190-server Client is the front end of the platform that provides you with an easy-to-drive UI for building your next low-code application.
The client is based on React, Apollo client, Primer components, React Material Web Components, Formik, and more.

# Version 1

Appalti190-server is currently in version 1. This is the first major release of Appalti190-server with enterprise-grade production readiness & scale. In this version, we have introduced multiple new features and enhanced the existing ones. The feature set is listed above in the [Features](#features) section.

## Support

Ask your questions and participate in discussions regarding Appalti190-server-related and web-dev topics at the Appalti190-server Discord server. 

<a href="https://discord.gg/Z2CG3rUFnu"><img src="https://Appalti190-server.com/images/discord_banner_purple.svg" /></a>

## Create a Bug Report

If you see an error message or run into an issue, please [create bug report](https://github.com/Appalti190-server/Appalti190-server/issues/new?assignees=&labels=type%3A+bug&template=bug.yaml&title=%F0%9F%90%9B+Bug+Report%3A+). This effort is valued and helps all Appalti190-server users.


## Submit a Feature Request

If you have an idea, or you're missing a capability that would make development easier and more robust, please [Submit feature request](https://github.com/Appalti190-server/Appalti190-server/issues/new?assignees=&labels=type%3A+feature+request&template=feature.yml).

If a similar feature request already exists, don't forget to leave a "+1".
If you add some more information such as your thoughts and vision about the feature, your comments will be embraced warmly :)


# Contributing

Appalti190-server is an open-source project. We are committed to a fully transparent development process and highly appreciate any contributions. Whether you are helping us fix bugs, proposing new features, improving our documentation or spreading the word - we would love to have you as a part of the Appalti190-server community.

# Useful Links

- [Docs](https://docs.Appalti190-server.com/)
- [Blog](https://Appalti190-server.com/blog)
- [Twitter](https://twitter.com/Appalti190-server)
- [Discord](https://Appalti190-server.com/discord)
- [Youtube](https://www.youtube.com/c/Appalti190-servercom)

Please refer to our [Contribution Guidelines](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md).

# Contributors ✨

Thanks goes to these wonderful people ([:hugs:](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/marcolino"><img src="https://avatars.githubusercontent.com/u/849127?v=4?s=100" width="100px;" alt="Marco Solari"/><br /><sub><b>Marco Solari</b></sub></a><br /><a href="https://github.com/marcolino/appalti190-server/commits?author=marcolino" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!