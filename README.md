# Repospace

<!-- TOC START min:1 max:5 link:true update:true -->

* [Repospace](#repospace)
  * [Functions in procedural order](#functions-in-procedural-order)
    * [Examples](#examples)
      * [`create(rootPath)`](#createrootpath)
      * [`clone([...repos])`](#clonerepos)
      * [`hide()`](#hide)
      * [`symlink(pathToRepos)`](#symlinkpathtorepos)
      * [`structure({layout})`](#structurelayout)
    * [Requirements](#requirements)

<!-- TOC END -->

## Functions in procedural order

| Name                      | Params                | Description              |
| :------------------------ | :-------------------- | :----------------------- |
| [Create](#createrootpath) | String(`pathToSpace`) | Designate repospace root |
| [Clone](#clone)           | Array(`repos`)        | Clone all github repos   |
| [Hide](#hide)             | undefined             | Move repos to hidden dir |
| [Symlink](#symlink)       | String(`pathToRepos`) |                          |
| [Structure](#structure)   | Object(`structure`)   | Move syms to dirs        |

---

### Examples

---

#### `create(rootPath)`

Use empty directory to store cloned repos and symlinks to those repos. Eventually, these symlinks will be added and this repospace will be used as the "root" directory which connects to all related repos.

**Input**

> ```js
> let rootPath = path.join(process.cwd(), "repospaceXYZ");
> ```

**Call**

> ```js
> repospace.create(rootPath);
> ```

**Return**

> | Type    | Message                             |
> | :------ | :---------------------------------- |
> | Success | String("/path/to/repospaceXYZ")     |
> | Fail    | `Failed to create repospace ${err}` |

---

#### `clone([...repos])`

Clone all of the specified repos.

**Input**

> ```js
> let repos = [
>   {
>     name: "foo",
>     url: "github.com/servexyz/foo"
>   },
>   {
>     name: "bar",
>     url: "github.com/servexyz/bar"
>   }
> ];
> ```

**Call**

> ```js
> repospace.create("repospaceXYZ").clone(...repos);
> ```

**Return**

> | Type    | Return                               |
> | :------ | :----------------------------------- |
> | Success | String(`path/to/${...createdRepos}`) |
> | Fail    | Boolean(false)                       |

---

#### `hide()`

Hide all of the cloned repositories. This will also be added to .gitignore

**Input**

> Not applicable

**Call**

> ```js
> repospace
>   .create("repospaceXYZ")
>   .clone(...repos)
>   .hide();
> ```

**Return**

> | Type    | Return         |
> | :------ | :------------- |
> | Success | Boolean(true)  |
> | Fail    | Boolean(false) |

---

#### `symlink(pathToRepos)`

Generate symlinks to represent each cloned repository inside hidden directory.

**Input**

> ```js
> symlink("path/to/hidden/repos");
> ```

**Call**

> ```js
> repospace
>   .create("repospaceXYZ")
>   .clone(...repos)
>   .hide();
>   .symlink("path/to/hidden/repos");
> ```

**Return**

> | Type    | Return         |
> | :------ | :------------- |
> | Success | Boolean(true)  |
> | Fail    | Boolean(false) |

#### `structure({layout})`

**Input**

> ```js
> let layout = {
>   repospaceXYZ: [
>     "index.js",
>     ("docs": {
>       images: ["api_brainstorm.jpg", "foobar.gif"]
>     })
>   ]
> };
> ```

> Note: Run structure through JSON.parse. Screws up markdown format to include JSON.parse(``);

**Call**

> ```js
> repospace
>   .create("repospace")
>   .clone(...repos)
>   .hide();
>   .symlink();
>   .structure(layout);
> ```

**Return**

> | Type    | Return         |
> | :------ | :------------- |
> | Success | Boolean(true)  |
> | Fail    | Boolean(false) |

---

### Requirements

---

* 1:many repo locations without using submodules
* Easy-to-update layout without moving massive files
* Consistency for entire time with option for individual layouts
* Monolith convenience with micro lib modularity

---
