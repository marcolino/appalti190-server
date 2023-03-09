[![GitHub package.json version](https://img.shields.io/github/package-json/v/marcolino/appalti190-server?style=flat)](version)
[![Mocha tests](https://github.com/marcolino/appalti190-server/blob/master/test/badges/mocha.svg)](tests)
<p align="center">
<a href="https://Appalti190-server.com/#gh-light-mode-only">
<img width="300" src="https://raw.githubusercontent.com/Appalti190-server/Appalti190-server/master/light.svg#gh-light-mode-only">
</a>
<a href="https://Appalti190-server.com/#gh-dark-mode-only">
<img width="300" src="https://raw.githubusercontent.com/Appalti190-server/Appalti190-server/master/dark.svg#gh-dark-mode-only">
</a>
</p>

<p align="center">
  <img src="https://github.com/Appalti190-server/Appalti190-server/actions/workflows/ci.yml/badge.svg" alt="Node.js CI">
  <a href="https://Appalti190-server.com/discord">
    <img src="https://img.shields.io/discord/757179260417867879?label=discord" alt="Discord">
  </a>
  <a href="CODE_OF_CONDUCT.md">
    <img src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg" alt="Contributor Covenant">
  </a>
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
  </a>
  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Appalti190-server/Appalti190-server?color=purple"/>
</p>

<div align="center">
 
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-59-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

  </div>
 

![1 Appalti190-server main](https://user-images.githubusercontent.com/53312820/190913686-02c7deb1-da2f-41b8-aa31-065e00f6155c.png)

[appalti190-server](https://github.com/marcolino/appalti190-server/) is an open‑source server side project for a general-purpose web app implementing a generic SAAS.

Appalti190-server Appalti190-server auto-generates backend apps built with TypeScript and Node.js, and a client built with React...

# Features

Appalti1190-server provides the following features:

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
  git clone https://github.com/Appalti190-server/Appalti190-server.git
  cd Appalti190-server
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
      <td align="center"><a href="https://Appalti190-server.com/"><img src="https://avatars.githubusercontent.com/u/43705455?v=4?s=100" width="100px;" alt="Yuval Hazaz"/><br /><sub><b>Yuval Hazaz</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=yuval-hazaz" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/belkind27"><img src="https://avatars.githubusercontent.com/u/71218434?v=4?s=100" width="100px;" alt="Roy Belkind"/><br /><sub><b>Roy Belkind</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=belkind27" title="Tests">⚠️</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Abelkind27" title="Bug reports">🐛</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=belkind27" title="Code">💻</a></td>
      <td align="center"><a href="http://cegla.me"><img src="https://avatars.githubusercontent.com/u/62651890?v=4?s=100" width="100px;" alt="Gal Cegla"/><br /><sub><b>Gal Cegla</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=GalCegla" title="Tests">⚠️</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3AGalCegla" title="Bug reports">🐛</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=GalCegla" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/alonram"><img src="https://avatars.githubusercontent.com/u/40050499?v=4?s=100" width="100px;" alt="Alon Ram"/><br /><sub><b>Alon Ram</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=alonram" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=alonram" title="Tests">⚠️</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Aalonram" title="Bug reports">🐛</a> <a href="#content-alonram" title="Content">🖋</a></td>
      <td align="center"><a href="https://github.com/meeroslava"><img src="https://avatars.githubusercontent.com/u/20791516?v=4?s=100" width="100px;" alt="meeroslava"/><br /><sub><b>meeroslava</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=meeroslava" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=meeroslava" title="Tests">⚠️</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Ameeroslava" title="Bug reports">🐛</a> <a href="#content-meeroslava" title="Content">🖋</a></td>
      <td align="center"><a href="https://github.com/udanna"><img src="https://avatars.githubusercontent.com/u/8627181?v=4?s=100" width="100px;" alt="danna"/><br /><sub><b>danna</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=udanna" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/almogbhl"><img src="https://avatars.githubusercontent.com/u/32982671?v=4?s=100" width="100px;" alt="Almog Langleben"/><br /><sub><b>Almog Langleben</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=almogbhl" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/tupe12334"><img src="https://avatars.githubusercontent.com/u/61761153?v=4?s=100" width="100px;" alt="tupe12334"/><br /><sub><b>tupe12334</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=tupe12334" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Atupe12334" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/gabrielmoncea"><img src="https://avatars.githubusercontent.com/u/39256258?v=4?s=100" width="100px;" alt="Gabriel Moncea"/><br /><sub><b>Gabriel Moncea</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=gabrielmoncea" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/m3llo96"><img src="https://avatars.githubusercontent.com/u/66171850?v=4?s=100" width="100px;" alt="m3llo96"/><br /><sub><b>m3llo96</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=m3llo96" title="Documentation">📖</a></td>
      <td align="center"><a href="http://petarvujović"><img src="https://avatars.githubusercontent.com/u/36507050?v=4?s=100" width="100px;" alt="Petar Vujović"/><br /><sub><b>Petar Vujović</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=petarvujovic98" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Apetarvujovic98" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/yam-golombek"><img src="https://avatars.githubusercontent.com/u/71834570?v=4?s=100" width="100px;" alt="yam-golombek"/><br /><sub><b>yam-golombek</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=yam-golombek" title="Documentation">📖</a></td>
      <td align="center"><a href="http://aniddan.com"><img src="https://avatars.githubusercontent.com/u/12671072?v=4?s=100" width="100px;" alt="Iddan Aaronsohn"/><br /><sub><b>Iddan Aaronsohn</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=iddan" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Aiddan" title="Bug reports">🐛</a> <a href="#content-iddan" title="Content">🖋</a></td>
      <td align="center"><a href="http://Timdurward.github.io"><img src="https://avatars.githubusercontent.com/u/11514270?v=4?s=100" width="100px;" alt="Tim Durward"/><br /><sub><b>Tim Durward</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=TimDurward" title="Code">💻</a> <a href="#infra-TimDurward" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=TimDurward" title="Documentation">📖</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/yonantan"><img src="https://avatars.githubusercontent.com/u/9935021?v=4?s=100" width="100px;" alt="yonantan"/><br /><sub><b>yonantan</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=yonantan" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/hermanramaniuk"><img src="https://avatars.githubusercontent.com/u/82475478?v=4?s=100" width="100px;" alt="hermanramaniuk"/><br /><sub><b>hermanramaniuk</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=hermanramaniuk" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=hermanramaniuk" title="Tests">⚠️</a></td>
      <td align="center"><a href="https://www.linkedin.com/profile/view?id=AAIAABLBfC4BE232yLpsGEF-dPR_QMXNvqrVucM&trk=nav_responsive_tab_profile_pic"><img src="https://avatars.githubusercontent.com/u/8780812?v=4?s=100" width="100px;" alt="George Cameron"/><br /><sub><b>George Cameron</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=georgewritescode" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/Leeyaacov"><img src="https://avatars.githubusercontent.com/u/65485193?v=4?s=100" width="100px;" alt="Leeyaacov"/><br /><sub><b>Leeyaacov</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=Leeyaacov" title="Documentation">📖</a> <a href="#design-Leeyaacov" title="Design">🎨</a> <a href="#content-Leeyaacov" title="Content">🖋</a></td>
      <td align="center"><a href="https://github.com/noctifer20"><img src="https://avatars.githubusercontent.com/u/18212378?v=4?s=100" width="100px;" alt="Mikayel Ohanjanyan "/><br /><sub><b>Mikayel Ohanjanyan </b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=noctifer20" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/lalit8347"><img src="https://avatars.githubusercontent.com/u/74647848?v=4?s=100" width="100px;" alt="Lalit C."/><br /><sub><b>Lalit C.</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=lalit8347" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/dabelh"><img src="https://avatars.githubusercontent.com/u/67220861?v=4?s=100" width="100px;" alt="dabelh"/><br /><sub><b>dabelh</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=dabelh" title="Tests">⚠️</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/liyachun01"><img src="https://avatars.githubusercontent.com/u/7907204?v=4?s=100" width="100px;" alt="liyachun"/><br /><sub><b>liyachun</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=liyachun01" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/isabr85"><img src="https://avatars.githubusercontent.com/u/11903954?v=4?s=100" width="100px;" alt="isabr85"/><br /><sub><b>isabr85</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=isabr85" title="Documentation">📖</a></td>
      <td align="center"><a href="http://kapustakrzysztof.pl"><img src="https://avatars.githubusercontent.com/u/53126011?v=4?s=100" width="100px;" alt="Krzysztof Kapusta"/><br /><sub><b>Krzysztof Kapusta</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=kpk-pl" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/erichodges"><img src="https://avatars.githubusercontent.com/u/14981329?v=4?s=100" width="100px;" alt="Eric Hodges"/><br /><sub><b>Eric Hodges</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=erichodges" title="Documentation">📖</a></td>
      <td align="center"><a href="http://0xflotus.github.io"><img src="https://avatars.githubusercontent.com/u/26602940?v=4?s=100" width="100px;" alt="0xflotus"/><br /><sub><b>0xflotus</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=0xflotus" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/MatanForU"><img src="https://avatars.githubusercontent.com/u/8940907?v=4?s=100" width="100px;" alt="MatanForU"/><br /><sub><b>MatanForU</b></sub></a><br /><a href="#design-MatanForU" title="Design">🎨</a></td>
      <td align="center"><a href="https://www.enotriacoe.com"><img src="https://avatars.githubusercontent.com/u/56024126?v=4?s=100" width="100px;" alt="Richard Weaver"/><br /><sub><b>Richard Weaver</b></sub></a><br /><a href="#ideas-richardweaver" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/NullF0rest"><img src="https://avatars.githubusercontent.com/u/40210694?v=4?s=100" width="100px;" alt="NullF0rest"/><br /><sub><b>NullF0rest</b></sub></a><br /><a href="#ideas-NullF0rest" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/sandbox-apps"><img src="https://avatars.githubusercontent.com/u/86398599?v=4?s=100" width="100px;" alt="sandbox-apps"/><br /><sub><b>sandbox-apps</b></sub></a><br /><a href="#ideas-sandbox-apps" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/vimota"><img src="https://avatars.githubusercontent.com/u/865701?v=4?s=100" width="100px;" alt="Victor Mota"/><br /><sub><b>Victor Mota</b></sub></a><br /><a href="#example-vimota" title="Examples">💡</a> <a href="#ideas-vimota" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/Kelz29"><img src="https://avatars.githubusercontent.com/u/25604678?v=4?s=100" width="100px;" alt="Kelello"/><br /><sub><b>Kelello</b></sub></a><br /><a href="#example-Kelz29" title="Examples">💡</a></td>
      <td align="center"><a href="https://github.com/MatthiasWanner"><img src="https://avatars.githubusercontent.com/u/79398461?v=4?s=100" width="100px;" alt="MatthiasWanner"/><br /><sub><b>MatthiasWanner</b></sub></a><br /><a href="#ideas-MatthiasWanner" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://github.com/regicsolutions"><img src="https://avatars.githubusercontent.com/u/6157895?v=4?s=100" width="100px;" alt="regicsolutions"/><br /><sub><b>regicsolutions</b></sub></a><br /><a href="#ideas-regicsolutions" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://sten.pw"><img src="https://avatars.githubusercontent.com/u/2134238?v=4?s=100" width="100px;" alt="Sten Feldman"/><br /><sub><b>Sten Feldman</b></sub></a><br /><a href="#ideas-exsilium" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center"><a href="http://knsblog.com"><img src="https://avatars.githubusercontent.com/u/51660321?v=4?s=100" width="100px;" alt="Thuc Pham"/><br /><sub><b>Thuc Pham</b></sub></a><br /><a href="#example-thucpn" title="Examples">💡</a></td>
      <td align="center"><a href="http://codylacey.com"><img src="https://avatars.githubusercontent.com/u/29167666?v=4?s=100" width="100px;" alt="Cody Lacey"/><br /><sub><b>Cody Lacey</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=CodyLacey" title="Code">💻</a></td>
      <td align="center"><a href="http://Appalti190-server.com"><img src="https://avatars.githubusercontent.com/u/91742238?v=4?s=100" width="100px;" alt="Matan Shidlov"/><br /><sub><b>Matan Shidlov</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=mshidlov" title="Code">💻</a> <a href="#content-mshidlov" title="Content">🖋</a></td>
      <td align="center"><a href="https://github.com/michizhou"><img src="https://avatars.githubusercontent.com/u/33012425?v=4?s=100" width="100px;" alt="michizhou"/><br /><sub><b>michizhou</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=michizhou" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/g-traub"><img src="https://avatars.githubusercontent.com/u/33841027?v=4?s=100" width="100px;" alt="Guillaume Traub"/><br /><sub><b>Guillaume Traub</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=g-traub" title="Code">💻</a></td>
      <td align="center"><a href="https://leetcode.com/purpl3/"><img src="https://avatars.githubusercontent.com/u/82395440?v=4?s=100" width="100px;" alt="Asian Cat"/><br /><sub><b>Asian Cat</b></sub></a><br /><a href="#blog-AsianCat54x" title="Blogposts">📝</a></td>
      <td align="center"><a href="http://www.noyagasi.com"><img src="https://avatars.githubusercontent.com/u/25197581?v=4?s=100" width="100px;" alt="Noy Agasi"/><br /><sub><b>Noy Agasi</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=noyagasi" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Anoyagasi" title="Bug reports">🐛</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/Rutam21"><img src="https://avatars.githubusercontent.com/u/47860497?v=4?s=100" width="100px;" alt="Rutam Prita Mishra"/><br /><sub><b>Rutam Prita Mishra</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=Rutam21" title="Documentation">📖</a></td>
      <td align="center"><a href="https://github.com/alexbass86"><img src="https://avatars.githubusercontent.com/u/96179897?v=4?s=100" width="100px;" alt="Alex Bass"/><br /><sub><b>Alex Bass</b></sub></a><br /><a href="#design-alexbass86" title="Design">🎨</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Aalexbass86" title="Bug reports">🐛</a></td>
      <td align="center"><a href="http://linkedin.com/in/mike-nußbaumer"><img src="https://avatars.githubusercontent.com/u/43721860?v=4?s=100" width="100px;" alt="Mike Nußbaumer"/><br /><sub><b>Mike Nußbaumer</b></sub></a><br /><a href="#ideas-mikenussbaumer" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Amikenussbaumer" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://www.linkedin.com/in/amitbarletz/"><img src="https://avatars.githubusercontent.com/u/39680385?v=4?s=100" width="100px;" alt="Amit Barletz"/><br /><sub><b>Amit Barletz</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=abrl91" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=abrl91" title="Documentation">📖</a></td>
      <td align="center"><a href="http://www.Appalti190-server.com "><img src="https://avatars.githubusercontent.com/u/96979533?v=4?s=100" width="100px;" alt="Moshe Forman"/><br /><sub><b>Moshe Forman</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=MoFoGo" title="Documentation">📖</a></td>
      <td align="center"><a href="https://m-agboola.web.app"><img src="https://avatars.githubusercontent.com/u/20028628?v=4?s=100" width="100px;" alt="Mohammed Agboola®️"/><br /><sub><b>Mohammed Agboola®️</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=molaycule" title="Code">💻</a> <a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3Amolaycule" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/morhag90"><img src="https://avatars.githubusercontent.com/u/97830649?v=4?s=100" width="100px;" alt="morhag90"/><br /><sub><b>morhag90</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=morhag90" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/kwinyyyc"><img src="https://avatars.githubusercontent.com/u/8462684?v=4?s=100" width="100px;" alt="Kwinten Li"/><br /><sub><b>Kwinten Li</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=kwinyyyc" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/EdroViegas"><img src="https://avatars.githubusercontent.com/u/21107004?v=4?s=100" width="100px;" alt="EdroViegas"/><br /><sub><b>EdroViegas</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3AEdroViegas" title="Bug reports">🐛</a></td>
      <td align="center"><a href="https://github.com/hmiiro"><img src="https://avatars.githubusercontent.com/u/35217089?v=4?s=100" width="100px;" alt="Hassan Miiro"/><br /><sub><b>Hassan Miiro</b></sub></a><br /><a href="#ideas-hmiiro" title="Ideas, Planning, & Feedback">🤔</a></td>
      <td align="center"><a href="https://michaelsolati.com"><img src="https://avatars.githubusercontent.com/u/11811422?v=4?s=100" width="100px;" alt="Michael Solati"/><br /><sub><b>Michael Solati</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=MichaelSolati" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/muhsinkamil"><img src="https://avatars.githubusercontent.com/u/62111075?v=4?s=100" width="100px;" alt="Mohamed Muhsin"/><br /><sub><b>Mohamed Muhsin</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=muhsinkamil" title="Code">💻</a></td>
      <td align="center"><a href="https://asiancat54.ml"><img src="https://avatars.githubusercontent.com/u/82395440?v=4?s=100" width="100px;" alt="0xsapphir3"/><br /><sub><b>0xsapphir3</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/issues?q=author%3A0xsapphir3" title="Bug reports">🐛</a></td>
      <td align="center"><a href="http://jnfrati.github.io"><img src="https://avatars.githubusercontent.com/u/23369263?v=4?s=100" width="100px;" alt="Nicolas Frati"/><br /><sub><b>Nicolas Frati</b></sub></a><br /><a href="#ideas-jnfrati" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
    <tr>
      <td align="center"><a href="https://github.com/Smartmind12"><img src="https://avatars.githubusercontent.com/u/91927689?v=4?s=100" width="100px;" alt="Utsav Paul"/><br /><sub><b>Utsav Paul</b></sub></a><br /><a href="#maintenance-Smartmind12" title="Maintenance">🚧</a></td>
      <td align="center"><a href="http://santoshb.com.np"><img src="https://avatars.githubusercontent.com/u/23402178?v=4?s=100" width="100px;" alt="Santosh Bhandari"/><br /><sub><b>Santosh Bhandari</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=TheLearneer" title="Code">💻</a></td>
      <td align="center"><a href="https://github.com/vincenzodomina"><img src="https://avatars.githubusercontent.com/u/54762917?v=4?s=100" width="100px;" alt="Vincenzo Domina"/><br /><sub><b>Vincenzo Domina</b></sub></a><br /><a href="https://github.com/Appalti190-server/Appalti190-server/commits?author=vincenzodomina" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!