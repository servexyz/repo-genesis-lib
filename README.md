![logo](docs/images/logo/repo-genesis@2x.png)

> Organize multiple repositories into monolith structure

[![Build Status](https://travis-ci.org/servexyz/repo-genesis.svg?branch=master)](https://travis-ci.org/servexyz/repo-genesis)

## Install

```bash
yarn add repo-genesis
```

## Use

```js
const { init } = require("repo-genesis");
await init(config);
```

> Full test: [repo.test.js](./tests/repo.test.js)

> Full config: [sample.config.js](./tests/sample.config.js)

#### Config

```js
const config = {
  provider: "myProviderAlias",
  repospacePath: path.join(__dirname, "../sandbox"),
  repositories: [
    {
      servexyz: "npm-starter"
    },
    {
      servexyz: "cli-starter"
    }
  ]
};
```

**Provider**

* `Public` repos? Provider is `optional`
* `Private` repos? Provider is `required`

  > Read more about defining config [here](config.md)

---

### Goals

---

* 1:many repo locations without using submodules
* Easy-to-update layout without moving massive files
* Consistency for entire time with option for individual layouts
* Monolith convenience with micro lib modularity

---

### Docs

---

#### For Users

* [Config](./docs/config.md)
  > Creating config used by init

#### For Maintainers

* [Reference](./docs/reference.md)

  > 3rd party API's

* [Todo](./docs/todo.md)

  > Todos by release version & questions

* [Brainstorm](./docs/brainstorm.md)

  > Thinking about the API

* [Debug](./docs/debug.md)

  > Errors & notes about fixing them

### Related

* `@servexyz/repo-genesis-cli`
  > [@github](https://github.com/servexyz/repo-genesis-cli) | [@npm](https://npmjs.com/package/repo-genesis-cli)
