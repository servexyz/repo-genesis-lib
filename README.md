# Repospace

<!-- TOC START min:1 max:5 link:true update:true -->

* [Repospace](#repospace)
  * [Getting Started](#getting-started)
    * [Parameters](#parameters)
    * [Environment Variables: [.env](./.env)](#environment-variables-envenv)
  * [Requirements](#requirements)
  * [Docs](#docs)

<!-- TOC END -->

---

### Getting Started

---

`init(repospacePath, repospaceRepositoriesPath, reposToClone)`

#### Parameters

| Name                      | Type     | Description           |
| :------------------------ | :------- | :-------------------- |
| repospacePath             | `string` | Symlinks created here |
| repospaceRepositoriesPath | `string` | Repos cloned here     |
| reposToClone              | `object` | { account: repo, ...} |

**Input**

```
let repos = { facebook: react, graphcool: prisma}
init("/path/to/symlinks", "/path/to/cloned/repositories", repos);
```

**Output**
The following repos are cloned & symlinked

```strings
// => git@github.com:facebook/react
// => git@github.com:graphcool/prisma
```

#### Environment Variables: [.env](./.env)

> **Default**

* `.GIT_PROVIDER`=github.com

---

### Requirements

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
