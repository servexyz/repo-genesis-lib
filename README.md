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
| Hide                      | N/A          | Move repos to hidden dir |
| Symlink                   | N/A          |                          |
| [Structure](#structure)   | ({layout})   | Move syms to dirs        |

### Examples

#### `create(rootPath)`

> Directory must be empty.

**Input**

```js
String("/path/to/repospace");
String("repospace");
```

**Output**

```js
```

#### `clone([...repos])`

**Input**

```js
```

**Output**

```js
```

#### `structure({layout})`

**Input**

```js
```

**Output**

```js
```

### Requirements

* 1:many repo locations without using submodules
* Easy-to-update layout without moving massive files
* Consistency for entire time with option for individual layouts
* Monolith convenience with micro lib modularity

### layout

**Example**

```json
{
  "repospaceName": [
    "index.js",
    {
      "docs": {
        "images": ["api_brainstorm.jpg", "foobar.gif"]
      }
    }
  ]
}
```
