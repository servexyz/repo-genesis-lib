# Reference

> 3rd-party APIs

[Back to README](../README.md)

### git-clone

* `clone(repo, targetPath, [options], cb)` [Docs](https://www.npmjs.com/package/git-clone)

> Clone repo to targetPath, calling cb on completion.

Supported options:

* _git_: path to git binary; default: git (optional).
* _shallow_: when true, clone with depth 1 (optional).
* _checkout_: revision/branch/tag to check out (optional).

### fs-extra

* `ensureDir(dir, [callback])` [Docs](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureDir.md)

> Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.

```
async function example (directory) {
  try {
    await fs.ensureDir(directory)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
```

* `pathExists(file[, callback])` [Docs](https://github.com/jprichardson/node-fs-extra/blob/master/docs/pathExists.md)

> Test whether or not the given path exists by checking with the file system. Like fs.exists, but with a normal callback signature (err, exists). Uses fs.access under the hood.

```
async function example (f) {
  const exists = await fs.pathExists(f)

  console.log(exists) // => false
}
```

* `ensureSymlink(srcpath, dstpath, [type, callback])` [Docs](https://github.com/jprichardson/node-fs-extra/blob/master/docs/ensureSymlink.md)

> Ensures that the symlink exists. If the directory structure does not exist, it is created.

```
async function example (src, dest) {
  try {
    await fs.ensureSymlink(src, dest)
    console.log('success!')
  } catch (err) {
    console.error(err)
  }
}
```
