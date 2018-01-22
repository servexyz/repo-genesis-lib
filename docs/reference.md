# Reference

> 3rd-party APIs

[Back to README](../README.md)

### git-clone

> https://www.npmjs.com/package/git-clone

`clone(repo, targetPath, [options], cb)`
Clone repo to targetPath, calling cb on completion.

Supported options:

* _git_: path to git binary; default: git (optional).
* _shallow_: when true, clone with depth 1 (optional).
* _checkout_: revision/branch/tag to check out (optional).

### fs-extra

`ensureDir(dir, [callback])`

> Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.

`pathExists(file[, callback])`

>
