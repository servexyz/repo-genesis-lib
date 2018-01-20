# Trail

> Purpose of trail is to keep track of todos, questions and references... in other words, establish a trail of creation

<!-- TOC START min:1 max:3 link:true update:true -->

* [Trail](#trail)
  * [Todo](#todo)
    * [v.0.5.0](#v050)
    * [v.1.0.0](#v100)
  * [Questions](#questions)
  * [Reference](#reference)
    * [Git-JS (simple-git)](#git-js-simple-git)
    * [fs-extra](#fs-extra)

<!-- TOC END -->

## Todo

> Todos are bundled by release version

### v.0.5.0

* [x] API Docs
* [ ] Update API docs
* [x] Questions, references and trail for v.0.5.0
* [x] Add jest config & tests directory
* [ ] Get api.test.js working
* [ ] Convert to prototypes to enable API like this:

```
repospace()
  .createDirectories(repospacePath)
  .cloneFactory(repos, hiddenPath)
  .symlinkFactory()
```

### v.1.0.0

* [ ] Configure environment variables to work with git-js
* [ ] Gracefully handle failures on repo-by-repo basis (currently all-or-nothing res/rej)
* [ ] SymlinkLayoutFactory (right now symlinks all just dump into repospace)

---

## Questions

1. What's the performance difference (if at all) using something like [git-clone](https://github.com/jaz303/git-clone) vs [git-js](https://github.com/steveukx/git-js) ?

2. In the case of [run-git-command](https://www.npmjs.com/package/run-git-command) does it make sense to use a more generic git command runner ?

3. What happens in the event that someone clones a repo in two locations ? Do branches persist across two locations?

4. Will there be pathing issues with relative repos in Windows environment ?

5. What's the most effective way to add a path to gitignore (ie. for the hidden repo that's generated / where all the repos are moved to?)

6. Should the environment variables be based on a general admin account ? Or map to personal ENV file which is gitignored ? Probably latter

7. Is this best way to parse gitignore ? https://www.npmjs.com/package/parse-gitignore

8. Do I need to add dotenv to test files as well or is it sufficient to leave it in index.js ?

---

## Reference

### Git-JS (simple-git)

> Note: Repo name is git-js... Package name is simple-git

`.clone(repoPath, [localPath, [options]], [handlerFn])`

> clone a remote repo at repoPath to a local directory at localPath (can be omitted to use the default of a directory with the same name as the repo name) with an optional array of additional arguments to include between git clone and the trailing repo local arguments

```js
const USER = "something";
const PASS = "somewhere";
const REPO = "github.com/username/private-repo";

const git = require("simple-git/promise");
const remote = `https://${USER}:${PASS}@${REPO}`;

git()
  .silent(true)
  .clone(remote)
  .then(() => console.log("finished"))
  .catch(err => console.error("failed: ", err));
```

### fs-extra

`ensureDir(dir, [callback])`

> Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.

`pathExists(file[, callback])`

> Test whether or not the given path exists by checking with the file system. Like fs.exists, but with a normal callback signature (err, exists). Uses fs.access under the hood.
