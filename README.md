# Library-Genesis

> Convert config into library scaffolding

[![Build Status](https://travis-ci.org/servexyz/library-genesis.svg?branch=master)](https://travis-ci.org/servexyz/library-genesis)

## Install

```bash
yarn add repo-genesis
```

## Use

```js
const { init } = require("repo-genesis");
await init(config);
```

> Test [repo.test.js](./tests/repo.test.js)
> Config [sample.config.js](./tests/sample.config.js)

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

* [Brainstorm](./docs/brainstorm.md)

  > Thinking about the API

* [Debug](./docs/debug.md)

  > Errors & notes about fixing them

* [Reference](./docs/reference.md)

  > 3rd party API's

* [Todo](./docs/todo.md)
  > Todos by release version & questions

### Related
