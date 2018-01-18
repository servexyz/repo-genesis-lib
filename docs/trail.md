# Trail

## Todo

## Questions

1. What's the performance difference (if at all) using something like [git-clone](https://github.com/jaz303/git-clone) vs [git-js](https://github.com/steveukx/git-js) ?

2. In the case of [run-git-command](https://www.npmjs.com/package/run-git-command) does it make sense to use a more generic git command runner ?

3. What happens in the event that someone clones a repo in two locations ? Do branches persist across two locations?

4. Will there be pathing issues with relative repos in Windows environment ?

5. What's the most effective way to add a path to gitignore (ie. for the hidden repo that's generated / where all the repos are moved to?)

## Reference

### Git-JS

`.clone(repoPath, [localPath, [options]], [handlerFn])`

> clone a remote repo at repoPath to a local directory at localPath (can be omitted to use the default of a directory with the same name as the repo name) with an optional array of additional arguments to include between git clone and the trailing repo local arguments
