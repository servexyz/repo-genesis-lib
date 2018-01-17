# repospace

<!-- TOC START min:1 max:4 link:true update:true -->

* [repospace](#repospace)

- [repospace](#repospace)
  * [Functions in procedural order](#functions-in-procedural-order)
    * [Examples](#examples)
      * [`create(rootPath)`](#createrootpath)
      * [`clone([...repos])`](#clonerepos)
      * [`structure({layout})`](#structurelayout)

## Functions in procedural order

| Name                      | Params       | Description              |
| :------------------------ | :----------- | :----------------------- |
| [Create](#createrootpath) | (rootPath)   | Designate repospace root |
| [Clone](#clone)           | ([...repos]) | Clone all github repos   |
| [Hide](#hide)             | N/A          | Move repos to hidden dir |
| [Symlink](#symlink)       | N/A          |                          |
| [Structure](#structure)   | ({layout})   | Move syms to dirs        |

---

### Examples

---

#### `create(rootPath)`

Use empty directory to store cloned repos and symlinks to those repos. Eventually, these symlinks will be added and this repospace will be used as the "root" directory which connects to all related repos.

**Input**

```js
let rootPath = path.join(process.cwd(), "repospaceXYZ");
```

**Call**

```js
repospace.create(rootPath);
```

**Return**

| Type    | Message                             |
| :------ | :---------------------------------- |
| Success | String("/path/to/repospaceXYZ")     |
| Fail    | `Failed to create repospace ${err}` |

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

#### `structure({layout})`

Generate symlinks to represent each cloned repository.

**Input**

> ```js
> let {
>   "repospaceXYZ": [
>     "index.js",
>     "docs": {
>       "images": ["api_brainstorm.jpg", "foobar.gif"]
>     }
>   ]
> }
> ```

**Call**

> ```js
> repospace
>   .create("repospace")
>   .clone(...repos)
>   .hide();
>   .structure({})
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

## Questions

---

1. What happens in the event that someone clones a repo in two locations ? Do branches persist across two locations?
