# Todo

> Todos are bundled by release version

[Back to README](../README.md)

---

<!-- TOC START min:1 max:3 link:true update:true -->

* [Todo](#todo)
  * [v.0.5.0](#v050)
  * [v.1.0.0](#v100)
  * [Questions](#questions)

<!-- TOC END -->

---

### v.0.5.0

* [x] API Docs
  * [x] Seperate docs by concern
  * [x] Update API docs
    * [x] Remove old
    * [x] Add new
* [x] Questions, references and trail for v.0.5.0
* [x] Add jest config & tests directory
* [x] Choose git-clone library (try a few different options)
  * [x] Promisify git-clone library if needed
* [x] Get repospace.test.js working

### v.1.0.0

* [ ] SymlinkLayoutFactory (right now symlinks all just dump into repospace)
* [x] Replace dotenv require with https://www.npmjs.com/package/babel-plugin-dotenv
* [x] Set default GIT_PROVIDER to github (currently alechp)
* [ ] Create CLI
* [x] Move .env path out of header (so TOC isn't messed up)
* [ ] Update init() to take string instead of require

---

## Questions

3. What happens in the event that someone clones a repo in two locations ? Do branches persist across two locations?

4. Will there be pathing issues with relative repos in Windows environment ?

5. What's the most effective way to add a path to gitignore (ie. for the hidden repo that's generated / where all the repos are moved to?)

6. Is this best way to parse gitignore ? https://www.npmjs.com/package/parse-gitignore
7. Is there a babel-plugin for dotenv ? Yes: https://www.npmjs.com/package/babel-plugin-dotenv
8. Is there a library which concatenates env for you ? Would be nice to be able to have one "checked-in" env which wouldn't commit anything private to public repo but still have baseline. In other words you could have .env.private & .env.public where .env.public has paths and things like that.... .env.private would have SSH keys. And something like babel-plugin-inline-dotenv would load both, but git would only check in .env.public
9. What's the best way to add a spinner while promise is being resolved? I believe sindresorhus had a solution for this
10. Why isn't Atom showing sandbox directory in sidebar when it gets added/deleted repeatedly ?
11. What's the best way to publish a private scope module ? Always run into difficulties when I try this for some reason. Looking to set scope to @servexyz

---
