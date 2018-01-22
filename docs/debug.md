# Debug

[Back to README](../README.md)

## January 21st, 2018

```
(node:23879) UnhandledPromiseRejectionWarning: ReferenceError: Repospace is not defined
(node:23879) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:23879) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

* `Fixed` this by importing. I was requiring before. I wonder how this is processed under the sheets ?

---

```
Ran all test suites.
  console.log src/repospace.js:68
    Failed to clone repositories.
     [object Object],[object Object]

  console.log src/repospace.js:68
    Failed to clone repositories.
     [object Object],[object Object]

  console.log tests/repospace.test.js:23
    Failed to createDirectories or cloneRepositories.
     TypeError: this.log is not a function
```

* `Fixed` this.log (should just be log)
* `Working on` git cloning issue

  * Split repo into repo.acct and repo.repo... Still not cloning properly. Going to swap out git-clone method next.
    * Note: This is the source of node-git-clone being investigated right now: https://github.com/aichbauer/node-git-clone-repo/blob/master/lib/index.js
